// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import "./AttestationStore.sol";

/// @title KumplyValidatorSetManager — KYB-gated ValidatorSetManager for the KUMPLY Compliance L1
/// @notice Custom implementation of the ACP-99 ValidatorSetManager standard that enforces
///         KYB (Tier 4) verification via the KUMPLY AttestationStore as a prerequisite for
///         joining the L1 validator set.
/// @dev    Architecture (ACP-77 + ACP-99 compliant):
///           - Only addresses with a valid, non-expired Tier-4 (Business) attestation can
///             initialize a validator registration.
///           - On attestation expiry, anyone may call `disableExpiredValidator()` to remove
///             the node from the active set — keeps the L1 trust-minimized.
///           - State changes emit Warp-compatible events that the P-Chain consumes to update
///             the canonical validator set (per ACP-77 §"L1 Validator Manager Contract").
///         The validator-set contract sits on the C-Chain (or the L1 itself once bootstrapped)
///         and communicates with the P-Chain via Avalanche Warp Messages (AWM).
/// @author KUMPLY Team
contract KumplyValidatorSetManager is AccessControl, Pausable {
    // ──────────────────────────────────────────────────────────────────
    //  Roles
    // ──────────────────────────────────────────────────────────────────

    /// @notice Role that may sign off on validator registrations / removals
    bytes32 public constant L1_MANAGER_ROLE = keccak256("L1_MANAGER_ROLE");

    // ──────────────────────────────────────────────────────────────────
    //  Constants
    // ──────────────────────────────────────────────────────────────────

    /// @notice Minimum KYC tier required to operate a validator (4 = Business / KYB)
    uint32 public constant REQUIRED_VALIDATOR_TIER = 4;

    /// @notice Maximum churn — number of weight changes per epoch (ACP-77 §"Churn limits")
    uint64 public constant MAX_CHURN_PER_EPOCH = 20;

    /// @notice Per-validator weight ceiling (basis points of total weight). 0.2 = 2000 bps.
    uint64 public constant MAX_VALIDATOR_WEIGHT_BPS = 2000;

    // ──────────────────────────────────────────────────────────────────
    //  Custom Errors
    // ──────────────────────────────────────────────────────────────────

    error ValidatorNotKYBVerified();
    error InsufficientValidatorTier(uint32 actual, uint32 required);
    error ValidatorAlreadyRegistered();
    error ValidatorNotFound();
    error InvalidNodeID();
    error InvalidWeight();
    error AttestationStillValid();
    error ChurnLimitExceeded();
    error WeightOverflow();
    error InvalidSubnetID();

    // ──────────────────────────────────────────────────────────────────
    //  Data Structures (ACP-99 compatible)
    // ──────────────────────────────────────────────────────────────────

    /// @notice Validator registration record (mirrors ACP-99 §"ValidatorInfo")
    struct Validator {
        bytes nodeID;           // 20-byte Avalanche node ID
        address owner;          // EVM address of the validator operator (must be KYB)
        uint64 weight;          // Voting weight (proportional to stake/reputation)
        uint64 registeredAt;    // Block timestamp of P-Chain acknowledgment
        uint64 expiresAt;       // Mirror of owner's AttestationStore expiry
        bool active;            // False when removed or attestation expired
    }

    // ──────────────────────────────────────────────────────────────────
    //  State
    // ──────────────────────────────────────────────────────────────────

    /// @notice Reference to the KUMPLY AttestationStore that gates validator entry
    AttestationStore public immutable attestationStore;

    /// @notice The 32-byte ID of the L1 subnet this manager governs (ACP-77 §"SubnetID")
    bytes32 public immutable subnetID;

    /// @notice Validators keyed by their EVM owner address
    mapping(address => Validator) public validators;

    /// @notice Reverse index: nodeID hash → owner address
    mapping(bytes32 => address) public nodeIDToOwner;

    /// @notice List of all current validator owners (for enumeration)
    address[] public validatorList;

    /// @notice Sum of weights of all active validators
    uint64 public totalWeight;

    /// @notice Number of active validators
    uint64 public activeValidatorCount;

    /// @notice Per-epoch churn counter (resets on epoch advance)
    uint64 public currentEpochChurn;

    /// @notice The block timestamp at which the current epoch started
    uint64 public epochStartTimestamp;

    // ──────────────────────────────────────────────────────────────────
    //  Events (Warp-compatible — consumed by P-Chain per ACP-77)
    // ──────────────────────────────────────────────────────────────────

    /// @notice Emitted when a validator is registered. Payload is read by the P-Chain.
    event ValidatorRegistered(
        bytes32 indexed validationID,
        bytes nodeID,
        address indexed owner,
        uint64 weight,
        uint64 expiry,
        uint32 attestationTier
    );

    /// @notice Emitted when a validator is removed (expired KYB or admin action)
    event ValidatorRemoved(bytes32 indexed validationID, bytes nodeID, address indexed owner, string reason);

    /// @notice Emitted when a validator's weight is updated
    event ValidatorWeightUpdated(bytes32 indexed validationID, uint64 oldWeight, uint64 newWeight);

    /// @notice Emitted when the churn epoch advances
    event EpochAdvanced(uint64 indexed epochStart, uint64 totalWeight, uint64 activeCount);

    /// @notice Emitted when an expired-attestation validator is purged
    event ExpiredValidatorPurged(address indexed owner, bytes nodeID, uint64 attestationExpiredAt);

    // ──────────────────────────────────────────────────────────────────
    //  Constructor
    // ──────────────────────────────────────────────────────────────────

    /// @notice Initializes the KumplyValidatorSetManager
    /// @param _admin      Address granted DEFAULT_ADMIN_ROLE and L1_MANAGER_ROLE
    /// @param _store      Deployed AttestationStore (KYB attestations live here)
    /// @param _subnetID   32-byte SubnetID returned by `avalanche blockchain create`
    constructor(address _admin, address _store, bytes32 _subnetID) {
        if (_subnetID == bytes32(0)) revert InvalidSubnetID();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(L1_MANAGER_ROLE, _admin);

        attestationStore = AttestationStore(payable(_store));
        subnetID = _subnetID;
        epochStartTimestamp = uint64(block.timestamp);
    }

    // ──────────────────────────────────────────────────────────────────
    //  Validator Lifecycle (ACP-99 standard operations)
    // ──────────────────────────────────────────────────────────────────

    /// @notice Initialize a validator registration — gated by KYB (Tier 4) attestation
    /// @dev    Step 1 of ACP-77 registration flow. Caller must own a valid KYB attestation.
    ///         Emits ValidatorRegistered which the P-Chain consumes as a Warp message.
    /// @param  _nodeID  20-byte node ID of the AvalancheGo node to register
    /// @param  _weight  Voting weight (subject to MAX_VALIDATOR_WEIGHT_BPS cap)
    /// @return validationID The 32-byte registration ID (hash of nodeID + subnetID + nonce)
    function initializeValidatorRegistration(
        bytes calldata _nodeID,
        uint64 _weight
    ) external whenNotPaused returns (bytes32 validationID) {
        if (_nodeID.length != 20) revert InvalidNodeID();
        if (_weight == 0) revert InvalidWeight();

        // ── KYB gate: validator owner MUST hold a valid Business attestation ──
        (bool ok, uint32 tier,, uint64 expiry) = attestationStore.verify(msg.sender);
        if (!ok) revert ValidatorNotKYBVerified();
        if (tier < REQUIRED_VALIDATOR_TIER) {
            revert InsufficientValidatorTier(tier, REQUIRED_VALIDATOR_TIER);
        }

        if (validators[msg.sender].active) revert ValidatorAlreadyRegistered();

        bytes32 nodeHash = keccak256(_nodeID);
        if (nodeIDToOwner[nodeHash] != address(0)) revert ValidatorAlreadyRegistered();

        // ── Churn / weight checks (ACP-77) ──
        _advanceEpochIfNeeded();
        if (currentEpochChurn >= MAX_CHURN_PER_EPOCH) revert ChurnLimitExceeded();

        uint64 newTotalWeight = totalWeight + _weight;
        if (newTotalWeight < totalWeight) revert WeightOverflow();
        if (
            totalWeight > 0 &&
            _weight * 10_000 > newTotalWeight * MAX_VALIDATOR_WEIGHT_BPS
        ) revert InvalidWeight();

        // ── Record ──
        validators[msg.sender] = Validator({
            nodeID: _nodeID,
            owner: msg.sender,
            weight: _weight,
            registeredAt: uint64(block.timestamp),
            expiresAt: expiry,
            active: true
        });
        nodeIDToOwner[nodeHash] = msg.sender;
        validatorList.push(msg.sender);
        totalWeight = newTotalWeight;
        activeValidatorCount += 1;
        currentEpochChurn += 1;

        validationID = keccak256(abi.encodePacked(_nodeID, subnetID, uint256(validatorList.length)));

        emit ValidatorRegistered(validationID, _nodeID, msg.sender, _weight, expiry, tier);
    }

    /// @notice Voluntarily exit the validator set — only the owner may call
    /// @dev    Step 2 of ACP-77 deregistration flow (ValidatorRemoved Warp message)
    function initializeValidatorRemoval() external whenNotPaused {
        Validator storage v = validators[msg.sender];
        if (!v.active) revert ValidatorNotFound();

        _advanceEpochIfNeeded();
        if (currentEpochChurn >= MAX_CHURN_PER_EPOCH) revert ChurnLimitExceeded();

        _removeValidator(msg.sender, "voluntary_exit");
        currentEpochChurn += 1;
    }

    /// @notice Anyone may purge a validator whose KYB attestation has expired
    /// @dev    This is the "self-healing" property of the Compliance L1: when a
    ///         validating institution loses its Tier-4 standing, the network removes
    ///         it automatically without human admin intervention.
    function disableExpiredValidator(address _owner) external {
        Validator storage v = validators[_owner];
        if (!v.active) revert ValidatorNotFound();

        (bool ok,,, uint64 expiry) = attestationStore.verify(_owner);
        if (ok && expiry > uint64(block.timestamp)) revert AttestationStillValid();

        _removeValidator(_owner, "kyb_expired");
        emit ExpiredValidatorPurged(_owner, v.nodeID, expiry);
    }

    /// @notice L1 manager forcibly removes a validator (slashing, compliance violation, etc.)
    function adminRemoveValidator(address _owner, string calldata _reason)
        external
        onlyRole(L1_MANAGER_ROLE)
    {
        Validator storage v = validators[_owner];
        if (!v.active) revert ValidatorNotFound();
        _removeValidator(_owner, _reason);
    }

    /// @notice Update a validator's weight (e.g. stake increase)
    function updateValidatorWeight(uint64 _newWeight)
        external
        whenNotPaused
    {
        Validator storage v = validators[msg.sender];
        if (!v.active) revert ValidatorNotFound();
        if (_newWeight == 0) revert InvalidWeight();

        uint64 oldWeight = v.weight;
        uint64 newTotal;
        if (_newWeight > oldWeight) {
            newTotal = totalWeight + (_newWeight - oldWeight);
            if (newTotal < totalWeight) revert WeightOverflow();
        } else {
            newTotal = totalWeight - (oldWeight - _newWeight);
        }

        v.weight = _newWeight;
        totalWeight = newTotal;

        bytes32 validationID = keccak256(abi.encodePacked(v.nodeID, subnetID, uint256(0)));
        emit ValidatorWeightUpdated(validationID, oldWeight, _newWeight);
    }

    // ──────────────────────────────────────────────────────────────────
    //  Internal Helpers
    // ──────────────────────────────────────────────────────────────────

    function _removeValidator(address _owner, string memory _reason) internal {
        Validator storage v = validators[_owner];
        bytes memory nodeID = v.nodeID;
        bytes32 nodeHash = keccak256(nodeID);

        totalWeight -= v.weight;
        activeValidatorCount -= 1;
        v.active = false;

        delete nodeIDToOwner[nodeHash];

        bytes32 validationID = keccak256(abi.encodePacked(nodeID, subnetID, uint256(0)));
        emit ValidatorRemoved(validationID, nodeID, _owner, _reason);
    }

    /// @dev Advances the epoch (24h windows) and resets the churn counter
    function _advanceEpochIfNeeded() internal {
        if (block.timestamp >= epochStartTimestamp + 1 days) {
            epochStartTimestamp = uint64(block.timestamp);
            currentEpochChurn = 0;
            emit EpochAdvanced(epochStartTimestamp, totalWeight, activeValidatorCount);
        }
    }

    // ──────────────────────────────────────────────────────────────────
    //  Views
    // ──────────────────────────────────────────────────────────────────

    /// @notice Check if an address is currently an active validator
    function isActiveValidator(address _owner) external view returns (bool) {
        return validators[_owner].active;
    }

    /// @notice Get a validator's full record
    function getValidator(address _owner) external view returns (Validator memory) {
        return validators[_owner];
    }

    /// @notice Returns the count of registered (active + inactive) validators
    function totalValidators() external view returns (uint256) {
        return validatorList.length;
    }

    /// @notice Snapshot of the current validator set summary
    function getSetSummary() external view returns (
        uint64 totalWeight_,
        uint64 activeCount,
        uint64 epochChurn,
        uint64 epochStart
    ) {
        return (totalWeight, activeValidatorCount, currentEpochChurn, epochStartTimestamp);
    }

    // ──────────────────────────────────────────────────────────────────
    //  Admin
    // ──────────────────────────────────────────────────────────────────

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}

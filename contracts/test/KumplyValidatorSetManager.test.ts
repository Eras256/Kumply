import { expect } from "chai";
import { ethers } from "hardhat";
import { AttestationStore, KumplyValidatorSetManager } from "../typechain-types";

describe("KumplyValidatorSetManager", function () {
  let store: AttestationStore;
  let manager: KumplyValidatorSetManager;
  let admin: any;
  let verifier: any;
  let bank: any;        // KYB-verified Bankaool validator
  let vc: any;          // KYB-verified Arkangeles validator
  let retail: any;      // Tier 2 — not enough to validate
  let unverified: any;

  const ONE_YEAR = 365 * 24 * 60 * 60;
  const SUBNET_ID = "0x" + "ab".repeat(32); // 32-byte mock SubnetID
  const NODE_ID_1 = "0x" + "11".repeat(20); // 20-byte mock NodeID
  const NODE_ID_2 = "0x" + "22".repeat(20);
  const NODE_ID_3 = "0x" + "33".repeat(20);

  async function issueTier(addr: string, tier: number, ttl = ONE_YEAR) {
    const expiry = (await ethers.provider.getBlock("latest"))!.timestamp + ttl;
    await store.connect(verifier).issueAttestation(addr, tier, expiry);
  }

  beforeEach(async function () {
    [admin, verifier, bank, vc, retail, unverified] = await ethers.getSigners();

    const StoreFactory = await ethers.getContractFactory("AttestationStore");
    store = (await StoreFactory.deploy(admin.address, ethers.ZeroAddress)) as unknown as AttestationStore;
    await store.waitForDeployment();
    await store.connect(admin).addVerifier(verifier.address);

    const ManagerFactory = await ethers.getContractFactory("KumplyValidatorSetManager");
    manager = (await ManagerFactory.deploy(
      admin.address,
      await store.getAddress(),
      SUBNET_ID
    )) as unknown as KumplyValidatorSetManager;
    await manager.waitForDeployment();

    // Pre-issue KYB to bank + vc, Tier 2 to retail
    await issueTier(bank.address, 4);
    await issueTier(vc.address, 4);
    await issueTier(retail.address, 2);
  });

  describe("Deployment", function () {
    it("sets admin and L1_MANAGER_ROLE", async function () {
      const DEFAULT_ADMIN_ROLE = await manager.DEFAULT_ADMIN_ROLE();
      const L1_MANAGER_ROLE = await manager.L1_MANAGER_ROLE();
      expect(await manager.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      expect(await manager.hasRole(L1_MANAGER_ROLE, admin.address)).to.be.true;
    });

    it("stores attestationStore reference + subnetID", async function () {
      expect(await manager.attestationStore()).to.equal(await store.getAddress());
      expect(await manager.subnetID()).to.equal(SUBNET_ID);
    });

    it("rejects zero subnetID at construction", async function () {
      const ManagerFactory = await ethers.getContractFactory("KumplyValidatorSetManager");
      await expect(
        ManagerFactory.deploy(admin.address, await store.getAddress(), ethers.ZeroHash)
      ).to.be.revertedWithCustomError(manager, "InvalidSubnetID");
    });

    it("starts with zero validators and zero weight", async function () {
      const [tw, ac] = await manager.getSetSummary();
      expect(tw).to.equal(0);
      expect(ac).to.equal(0);
    });
  });

  describe("Validator Registration — KYB Gate", function () {
    it("KYB-verified address registers successfully", async function () {
      await expect(manager.connect(bank).initializeValidatorRegistration(NODE_ID_1, 100))
        .to.emit(manager, "ValidatorRegistered");

      const v = await manager.getValidator(bank.address);
      expect(v.active).to.be.true;
      expect(v.owner).to.equal(bank.address);
      expect(v.weight).to.equal(100);
      expect(v.nodeID).to.equal(NODE_ID_1);
    });

    it("rejects unverified address", async function () {
      await expect(
        manager.connect(unverified).initializeValidatorRegistration(NODE_ID_1, 100)
      ).to.be.revertedWithCustomError(manager, "ValidatorNotKYBVerified");
    });

    it("rejects Tier 2 (Standard KYC) address", async function () {
      await expect(
        manager.connect(retail).initializeValidatorRegistration(NODE_ID_1, 100)
      ).to.be.revertedWithCustomError(manager, "InsufficientValidatorTier");
    });

    it("rejects duplicate nodeID", async function () {
      await manager.connect(bank).initializeValidatorRegistration(NODE_ID_1, 100);
      await expect(
        manager.connect(vc).initializeValidatorRegistration(NODE_ID_1, 100)
      ).to.be.revertedWithCustomError(manager, "ValidatorAlreadyRegistered");
    });

    it("rejects same owner re-registering", async function () {
      await manager.connect(bank).initializeValidatorRegistration(NODE_ID_1, 100);
      await expect(
        manager.connect(bank).initializeValidatorRegistration(NODE_ID_2, 100)
      ).to.be.revertedWithCustomError(manager, "ValidatorAlreadyRegistered");
    });

    it("rejects invalid nodeID length", async function () {
      const tooShort = "0x" + "aa".repeat(10);
      await expect(
        manager.connect(bank).initializeValidatorRegistration(tooShort, 100)
      ).to.be.revertedWithCustomError(manager, "InvalidNodeID");
    });

    it("rejects zero weight", async function () {
      await expect(
        manager.connect(bank).initializeValidatorRegistration(NODE_ID_1, 0)
      ).to.be.revertedWithCustomError(manager, "InvalidWeight");
    });

    it("updates totalWeight and activeValidatorCount", async function () {
      // ACP-77: each new validator must be <= 20% of new total weight.
      // First @ 1000 (any weight, totalWeight=0 skips check). Second @ 200 → 200/1200 = 16.67% OK.
      await manager.connect(bank).initializeValidatorRegistration(NODE_ID_1, 1000);
      await manager.connect(vc).initializeValidatorRegistration(NODE_ID_2, 200);

      const [tw, ac] = await manager.getSetSummary();
      expect(tw).to.equal(1200);
      expect(ac).to.equal(2);
    });

    it("rejects weight that exceeds 20% per-validator cap", async function () {
      await manager.connect(bank).initializeValidatorRegistration(NODE_ID_1, 100);
      // 200 would be 200/300 = 66.7% — exceeds 20% cap
      await expect(
        manager.connect(vc).initializeValidatorRegistration(NODE_ID_2, 200)
      ).to.be.revertedWithCustomError(manager, "InvalidWeight");
    });
  });

  describe("Validator Removal", function () {
    beforeEach(async function () {
      await manager.connect(bank).initializeValidatorRegistration(NODE_ID_1, 100);
    });

    it("owner can voluntarily exit", async function () {
      await expect(manager.connect(bank).initializeValidatorRemoval())
        .to.emit(manager, "ValidatorRemoved");

      expect(await manager.isActiveValidator(bank.address)).to.be.false;
      const [tw, ac] = await manager.getSetSummary();
      expect(tw).to.equal(0);
      expect(ac).to.equal(0);
    });

    it("admin can force-remove validator", async function () {
      await expect(manager.connect(admin).adminRemoveValidator(bank.address, "compliance_violation"))
        .to.emit(manager, "ValidatorRemoved");
      expect(await manager.isActiveValidator(bank.address)).to.be.false;
    });

    it("non-admin cannot force-remove", async function () {
      await expect(
        manager.connect(vc).adminRemoveValidator(bank.address, "test")
      ).to.be.reverted;
    });

    it("rejects removal of unregistered address", async function () {
      await expect(
        manager.connect(unverified).initializeValidatorRemoval()
      ).to.be.revertedWithCustomError(manager, "ValidatorNotFound");
    });
  });

  describe("KYB Expiry — Self-Healing", function () {
    it("anyone can purge a validator with expired attestation", async function () {
      await manager.connect(bank).initializeValidatorRegistration(NODE_ID_1, 100);

      // Revoke the bank's attestation
      await store.connect(verifier).revoke(bank.address);

      // Any random EOA can now purge
      await expect(manager.connect(unverified).disableExpiredValidator(bank.address))
        .to.emit(manager, "ExpiredValidatorPurged");

      expect(await manager.isActiveValidator(bank.address)).to.be.false;
    });

    it("cannot purge a validator with valid attestation", async function () {
      await manager.connect(bank).initializeValidatorRegistration(NODE_ID_1, 100);
      await expect(
        manager.connect(unverified).disableExpiredValidator(bank.address)
      ).to.be.revertedWithCustomError(manager, "AttestationStillValid");
    });

    it("can purge after time-based expiry", async function () {
      const shortExpiry = 60; // 60 seconds
      await store.connect(verifier).issueAttestation(vc.address, 4,
        (await ethers.provider.getBlock("latest"))!.timestamp + shortExpiry);
      await manager.connect(vc).initializeValidatorRegistration(NODE_ID_2, 100);

      // Fast-forward past expiry
      await ethers.provider.send("evm_increaseTime", [shortExpiry + 1]);
      await ethers.provider.send("evm_mine", []);

      await expect(manager.connect(unverified).disableExpiredValidator(vc.address))
        .to.emit(manager, "ExpiredValidatorPurged");
    });
  });

  describe("Weight Updates", function () {
    beforeEach(async function () {
      await manager.connect(bank).initializeValidatorRegistration(NODE_ID_1, 100);
    });

    it("validator can increase weight", async function () {
      await expect(manager.connect(bank).updateValidatorWeight(150))
        .to.emit(manager, "ValidatorWeightUpdated");
      const v = await manager.getValidator(bank.address);
      expect(v.weight).to.equal(150);
    });

    it("validator can decrease weight", async function () {
      await manager.connect(bank).updateValidatorWeight(50);
      const v = await manager.getValidator(bank.address);
      expect(v.weight).to.equal(50);
      const [tw] = await manager.getSetSummary();
      expect(tw).to.equal(50);
    });

    it("rejects zero weight update", async function () {
      await expect(
        manager.connect(bank).updateValidatorWeight(0)
      ).to.be.revertedWithCustomError(manager, "InvalidWeight");
    });

    it("rejects weight update from non-validator", async function () {
      await expect(
        manager.connect(vc).updateValidatorWeight(100)
      ).to.be.revertedWithCustomError(manager, "ValidatorNotFound");
    });
  });

  describe("Pausable", function () {
    it("admin can pause and unpause", async function () {
      await manager.connect(admin).pause();
      await expect(
        manager.connect(bank).initializeValidatorRegistration(NODE_ID_1, 100)
      ).to.be.reverted; // EnforcedPause

      await manager.connect(admin).unpause();
      await expect(
        manager.connect(bank).initializeValidatorRegistration(NODE_ID_1, 100)
      ).to.emit(manager, "ValidatorRegistered");
    });
  });

  describe("ACP-77 Constants", function () {
    it("REQUIRED_VALIDATOR_TIER is 4 (Business)", async function () {
      expect(await manager.REQUIRED_VALIDATOR_TIER()).to.equal(4);
    });

    it("MAX_CHURN_PER_EPOCH and MAX_VALIDATOR_WEIGHT_BPS are exposed", async function () {
      expect(await manager.MAX_CHURN_PER_EPOCH()).to.equal(20);
      expect(await manager.MAX_VALIDATOR_WEIGHT_BPS()).to.equal(2000);
    });
  });
});

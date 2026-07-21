# KUMPLY Compliance L1 — Deploy-Ready Configuration

This folder contains everything needed to spin up the **KUMPLY Compliance L1** on the Avalanche network using Avalanche CLI. All files conform to **ACP-77** (Reinventing Subnets) and **ACP-99** (ValidatorSetManager).

> **Status:** Deploy-Ready · Not Yet Live · Institutional validator slots open (KYB-gated)

---

## Files

| File | Purpose | Reference |
|---|---|---|
| `genesis.json` | Subnet-EVM genesis state — chain ID, fee config, allocations, Warp config | [Subnet-EVM docs](https://build.avax.network/docs/nodes/chain-configs/avalanche-l1s/subnet-evm) |
| `l1-config.json` | KUMPLY-specific L1 metadata — validator set, consensus, compliance hooks | [L1 configs](https://build.avax.network/docs/nodes/chain-configs/avalanche-l1s/avalanche-l1-configs) |
| `subnet-config.json` | Per-chain runtime config for AvalancheGo validators | [Chain configs](https://build.avax.network/docs/nodes/chain-configs/primary-network/c-chain) |
| `../scripts/deploy-l1.sh` | One-shot deployment script (Avalanche CLI) | [Avalanche CLI](https://build.avax.network/docs/tooling/avalanche-sdk/interchain/getting-started) |
| `../scripts/deploy-validator-manager.ts` | Hardhat script to deploy `KumplyValidatorSetManager.sol` | [ACP-99](https://build.avax.network/docs/acps/99-validatorsetmanager-contract) |

---

## Chain Identity

- **Name:** KUMPLY Compliance L1
- **Symbol:** KMP
- **Chain ID:** 43210 (mainnet) · 432103 (testnet variant)
- **VM:** Subnet-EVM v0.7.0
- **Gas token:** KMP
- **Consensus:** Snowman (k=20, β=15, ACP-77 compliant)
- **Block time:** 2s target

---

## Architectural decisions

### Why these parameters?

1. **Quorum 67%** in `warpConfig` — required for Avalanche Warp Messages to the P-Chain (ACP-77 §"Validator manager contracts" minimum).
2. **`contractDeployerAllowList` enabled** — only KYB-verified institutions can deploy contracts on the L1 (resolved off-chain at chain bootstrap by Hardhat deploy script).
3. **`txAllowList` disabled** — any wallet can transact (we don't gate at the network level; gating happens at the application level via `ComplianceGate.sol`).
4. **PoA validator set** — initially run by KUMPLY Protocol, with KYB-verified institutional validators onboarding into open slots. PoS migration via ACP-99 ValidatorManager contract upgrade path is supported.
5. **`requirePrimaryNetworkSigners: true`** — ACP-77 requirement so the L1 can use the Primary Network's Warp signature aggregation.

---

## Deployment flow

```bash
# 1) Create the L1 on Fuji testnet
avalanche blockchain create kumply-l1 --evm --genesis ./genesis.json
avalanche blockchain deploy kumply-l1 --testnet

# 2) Capture SubnetID from output, then deploy the ValidatorSetManager on C-Chain
pnpm hardhat run scripts/deploy-validator-manager.ts --network fuji

# 3) Subscribe the manager to the P-Chain via Warp
# (handled automatically by Avalanche CLI when validators register)

# 4) Have institutional validators register via initializeValidatorRegistration()
#    Each validator MUST hold a Tier-4 (KYB) attestation in AttestationStore
```

---

## Cost & timing

| Network | Setup time | Cost (AVAX) | Hardware/validator |
|---|---|---|---|
| **Fuji L1** | ~3 hours (P2P bootstrap) | $0 | 4 cores, 8 GB RAM, 500 GB NVMe |
| **Mainnet L1** | ~6 hours | Continuous P-Chain fee per validator (ACP-77 dynamic, no more 2000 AVAX lock) | 8 cores, 16 GB RAM, 1 TB NVMe |

---

## Why a dedicated L1?

The C-Chain works for **today's** attestation reads. But:

1. **Validator-level compliance.** Only institutions that pass KYB can validate. The network *itself* becomes a regulated proof of identity.
2. **Cost predictability.** Sub-cent reads for compliance lookups at institutional scale — uneconomic on the C-Chain at peak gas.
3. **Cross-L1 ICM.** Attestations propagate to every Avalanche L1 via Warp without bridges or oracles.
4. **Regulatory narrative.** A blockchain where every block is signed by a licensed institution is the strongest possible compliance story.

See [`../../L1.md`](../../L1.md) for the full architectural rationale and roadmap.

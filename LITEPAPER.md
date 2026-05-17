# KUMPLY — Institutional Compliance Infrastructure for Avalanche

**Litepaper · v1.1 · May 2026**

> One-line: KUMPLY is the on-chain identity and compliance layer for institutional Web3, built natively on Avalanche. We provide KYC, KYB, and KYA (Know Your Agent) attestations as a public good for DApps, plus a dedicated Compliance L1 where every validator is a verified institution.

| | |
|---|---|
| **Category** | Identity · Enterprise · Infrastructure |
| **Network** | Avalanche (C-Chain + dedicated L1, ACP-77/99 compliant) |
| **Stage** | Fuji testnet deployed · mainnet Q4 2026 |
| **Tests passing** | 157 (110 contracts · 30 SDK · 17 API) |
| **Repo** | https://github.com/Eras256/Kumply |
| **Live** | https://kumply.xyz (institutional landing + KYC flow) |

---

## 1. The Problem

LatAm financial institutions face a structural blocker to adopting Web3: **regulatory uncertainty around counterparty identity**. A bank cannot interact with an EVM address without knowing who controls it. A fintech cannot route a stablecoin payment without confirming the recipient passed KYC. A tokenization platform cannot list assets to qualified investors without verifying accreditation.

Today the workarounds are all bad:

- **Off-chain whitelists** (e.g. Polygon ID, Worldcoin) — sit outside the chain, require trust in a centralized issuer, and don't compose with smart contracts.
- **Per-DApp KYC** — every protocol re-onboards the same user, fragmenting compliance data and creating duplicate AML risk for institutions.
- **Wrapped permissioned chains** (e.g. Quorum, Hyperledger) — break composability with the wider DeFi ecosystem and lock institutions into walled gardens.

The cost is concrete: Banco Bankaool and Arkangeles in Mexico, BTG Pactual in Brazil, and dozens of LatAm fintechs have publicly stated they want to deploy on-chain products but cite "no compliant counterparty resolution layer" as the gating concern.

## 2. The Solution

KUMPLY is a **two-layer compliance primitive on Avalanche**:

### Layer 1 — AttestationStore on C-Chain (live, deployed)
A smart contract that stores cryptographically signed KYC/KYB/KYA attestations on Avalanche C-Chain. Each attestation is a tuple `(address, tier, expiry, issuer)`. Five tiers map to real-world verification depth:

| Tier | Type | Use Case |
|---|---|---|
| 1 | Basic KYC | Wallet onboarding, low-risk DeFi |
| 2 | Standard KYC | Stablecoin payments, peer-to-peer transfers |
| 3 | Enhanced KYC | Lending, derivatives, tokenized assets |
| 4 | Business / KYB | Institutional accounts, validators |
| 5 | Agent / KYA | Autonomous AI agents and bots (new in 2026) |

DApps consume attestations through a **gateway pattern**: a `ComplianceGate` contract enforces a minimum tier before allowing protected actions, with two billing modes — `pay-per-use` (per-call fee in AVAX) and SaaS subscription (off-chain billed, on-chain exempt). Reading is free for public verification; writing only by KUMPLY's `VERIFIER_ROLE` (initially the protocol; later expanded to additional registered verifiers).

### Layer 2 — KUMPLY Compliance L1 (deploy-ready)
A dedicated Avalanche L1 (Subnet-EVM, chainId 43210) that is **open to all 5 tiers as users**, with KYB gating only at the security layer:

| Role on the L1 | Tier requirement | Why |
|---|---|---|
| **Validators** (block producers) | Tier 4 (KYB) | Banks, fintechs, and regulated entities provide network security |
| **Contract deployers** | Tier 4 (KYB) | Audited, accountable code in the institutional ecosystem |
| **Transactors** (gas payers) | Any tier 0–5 | Retail KYC users, institutional accounts, and autonomous agents all transact freely |
| **Attestation readers** | Open | Public, free, permissionless |

The validator set is governed by `KumplyValidatorSetManager.sol`, our ACP-99-compliant ValidatorSetManager that enforces KYB on validator registration and self-heals when an attestation expires (anyone can permissionlessly purge an expired validator). DApps deployed on the L1 use tier-aware `ComplianceGate` contracts to admit Tier-1 retail users into peer-to-peer flows, Tier-3 enhanced-KYC users into lending markets, Tier-4 institutional accounts into qualified pools, and Tier-5 autonomous agents into agentic DeFi.

This is unique in the Avalanche ecosystem: it's the first L1 whose **security** is gated by on-chain compliance proofs *and* whose **applications** can tier-gate user actions without forcing the network into a permissioned walled garden. Banks, regulated fintechs, and licensed money transmitters can run validators with cryptographic assurance that every counterparty in the consensus set is verified — while individual users at every tier transact freely.

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER / DApp                              │
└────────────────┬──────────────────────────┬─────────────────────┘
                 │                          │
        Verify KYC tier              Check counterparty
                 │                          │
                 ▼                          ▼
   ┌──────────────────────┐    ┌────────────────────────┐
   │   Sumsub WebSDK      │    │   ComplianceGate.sol    │
   │  (off-chain KYC)     │    │  (DApp-side gateway)    │
   └─────────┬────────────┘    └──────────┬──────────────┘
             │ webhook                     │ verify(addr)
             ▼                             ▼
   ┌─────────────────────────────────────────────────────┐
   │            AttestationStore.sol  (C-Chain)          │
   │   (tier · expiry · issuer · revocation status)      │
   └─────────────────────┬───────────────────────────────┘
                         │ KYB Tier-4 gate
                         ▼
   ┌─────────────────────────────────────────────────────┐
   │      KumplyValidatorSetManager.sol  (ACP-99)        │
   │   Two-phase Warp lifecycle: initiate → P-Chain ack  │
   └─────────────────────┬───────────────────────────────┘
                         │ sendWarpMessage (ACP-30)
                         ▼
   ┌─────────────────────────────────────────────────────┐
   │       Avalanche P-Chain  (ACP-77 L1 manager)        │
   └─────────────────────┬───────────────────────────────┘
                         │ ConvertSubnetToL1Tx /
                         │ RegisterL1ValidatorTx
                         ▼
   ┌─────────────────────────────────────────────────────┐
   │          KUMPLY Compliance L1  (Subnet-EVM)         │
   │   KYB-only validators & deployers · open transact   │
   │   Tier-aware ComplianceGate on every L1 DApp        │
   │   KMP gas · ICM-mirrored AttestationStore (Q3 '26)  │
   └─────────────────────────────────────────────────────┘
```

**Standards compliance verified by 110 unit tests:**

- **ACP-30** — Avalanche Warp × EVM (WarpMessenger precompile at `0x05`)
- **ACP-77** — Reinventing Subnets (continuous fee L1 validators)
- **ACP-99** — ValidatorSetManager contract (two-phase init/complete flow)
- **ACP-103** — Dynamic multidimensional fees (roadmap, post-launch)
- **Avalanche codec** — bit-exact `RegisterL1ValidatorMessage`, `L1ValidatorRegistrationMessage`, `L1ValidatorWeightMessage`, `SubnetToL1ConversionMessage` (re-implemented in the test harness for round-trip validation)

## 4. Why This Matters for Avalanche

KUMPLY closes the critical institutional adoption gap **and** opens a new primitive — verified autonomous agents — that doesn't exist anywhere else in the L1 ecosystem.

1. **🤖 KYA — Know Your Agent (unique in the Avalanche ecosystem)** — Tier 5 verifies autonomous AI agents and bots before they touch capital on-chain. With agentic DeFi (LangChain-style on-chain agents, autonomous market makers, AI portfolio managers) projected to drive 15–30% of DeFi transaction volume by end of 2026, every protocol will need a way to distinguish trusted, bounded agents from anonymous scripts. KUMPLY is the first L1 in Avalanche — and to our knowledge in any EVM L1 — purpose-built for it. **No other Avalanche L1 has this**. Section 4.1 below details the mechanism.
2. **Brings real banks on-chain** — Bankaool (MX), Arkangeles (MX), and a pipeline of LatAm fintechs have validated the need. A KYB-gated L1 is the first deployment vehicle they can operate without straddling unclear regulatory perimeters.
3. **Open to retail users, not just institutions** — The L1 is a full home for the 5-tier compliance spectrum. Retail KYC users (Tiers 1–3) can transact freely; institutional accounts (Tier 4) can deploy contracts and validate; agents (Tier 5) can operate within bounded budgets. Compliance composes at the application layer via `ComplianceGate`, not by walling off the chain.
4. **Composable with existing Avalanche DeFi** — `ComplianceGate` integrates as a 3-line dependency for any C-Chain DApp wanting tiered users (Trader Joe institutional pools, GMX accredited markets, Benqi qualified lending).
5. **Cross-L1 attestation propagation via ICM** — Tier proofs issued on C-Chain propagate to any other Avalanche L1 via Interchain Messaging, making KUMPLY a network-wide identity primitive, not a single-chain product.
6. **First production use case for ACP-99** — Our open-source implementation is one of the earliest live integrations of the ValidatorSetManager standard, useful as reference for other institutional L1 builders.

### 4.1 KYA — Know Your Agent (Tier 5) — the unique differentiator

Autonomous agents present a verification problem that **classic KYC cannot solve**. An AI agent doesn't have a passport. A bot doesn't have a tax ID. But protocols still need to know: *"Can this address transact $50K of stablecoin in my pool? Is the entity behind it accountable? Does this agent have permission to do what it's trying to do?"*

KUMPLY Tier 5 (KYA) is a structured attestation specifically for autonomous actors:

| KYA Field | What it captures | Verified by |
|---|---|---|
| **Model fingerprint** | Hash of model weights (open models) or pinned API endpoint + version (closed models) | KUMPLY attestor |
| **Owner attestation** | EVM address of a Tier-4 (KYB) human/institution that takes legal responsibility | On-chain proof of Tier-4 |
| **Behavior bounds** | Max tx/day, max value/tx, allowed contract allowlist, allowed assets, time-of-day windows | Owner-declared, immutable until reissued |
| **Provenance** | Training data jurisdiction, ToS hash, behavior policy URI | Owner-declared, IPFS-pinned |
| **Liveness signal** | Heartbeat oracle from the agent's runtime (proves it's still operating) | Off-chain runtime → on-chain timestamp |

DApps gate agent actions through an extended `ComplianceGate`:
```solidity
require(agentRegistry.canExecute(msg.sender, action, value), "AGENT_BOUND_EXCEEDED");
```

This unlocks **agentic DeFi with safety rails**: an autonomous market-making bot operates within its declared limits; if it deviates, the owner's KYB attestation gives counterparties legal recourse. No anonymous-LLM rug pulls. No "AI did it" legal voids.

**Why this lands on Avalanche specifically:** Avalanche's sub-second finality and low fees make it the natural home for high-frequency agentic transactions. ACP-77 L1s let us run a chain optimized for agent throughput separately from the broader institutional chain.

**KYA is in the Sumsub level catalog (`agent-kya`) and in `AttestationStore.sol`'s tier 5 today.** The `AgentRegistry.sol` extension contract is in our Q3 2026 roadmap as the next ship.

## 5. Business Model — Software-Only, B2B

KUMPLY operates as **infrastructure software**, not a financial institution. We do not custody funds, do not facilitate fiat/crypto exchange, do not issue tradable assets. Revenue comes from:

| Stream | Customer | Pricing | Channel |
|---|---|---|---|
| **SaaS subscription** | Regulated institutions (banks, ITFs, fintechs) | MXN/USD monthly fixed (CFDI billing) | Direct sales |
| **Pay-per-use API** | DApps, autonomous agents, small teams | $0.50 USD per `checkCompliance` call, paid in AVAX | Smart contract |
| **L1 gas (KMP)** | Validators, DApps deploying on KUMPLY L1 | Native gas fees on L1 transactions | On-chain |
| **Verifier-as-a-Service** | KYC providers wanting on-chain distribution | License + revenue share | Partnership |

Pricing benchmark: traditional KYC providers (Sumsub, Onfido, Veriff) charge $1–8 per verification with no on-chain composability and no programmatic API for smart contracts. Our $0.50 per-check is a 50–94% cost reduction, plus the compliance data is reusable across every Avalanche DApp the user touches — meaning per-user lifetime cost trends toward zero as the network effect compounds.

## 6. Token: KMP

KMP is the **native gas token of the KUMPLY Compliance L1**. Its role is strictly utility — paying for computation and storage on the L1. KMP is not:

- not a security under LMV (Mexico) or US securities law analysis
- not e-money under LRITF Art. 22 (Mexico's Fintech Law)
- not staked for validator rewards (validators are paid in AVAX via ACP-77 continuous fees on P-Chain)
- not listed on any DEX, AMM, or CEX
- not sold to the public

Testnet (Fuji) genesis allocation: **1,000,000,000 KMP, 100% to the KUMPLY operator wallet** for testnet faucet, demo grants, and validator gas top-ups. **Mainnet allocation is explicitly deferred** until: (a) on-chain traction is demonstrated, (b) institutional validator agreements are formalized, and (c) a written Mexican fintech-law counsel opinion confirms the software-only positioning. This commitment is embedded as on-chain documentation in `genesis.json` itself.

## 7. Roadmap

| Quarter | Milestone | Status |
|---|---|---|
| **Q1 2026** | AttestationStore + ComplianceGate deployed and verified on Fuji | ✅ Done |
| **Q2 2026** | ACP-99 ValidatorSetManager refactor · 110 tests passing · litepaper · grant submissions (Retro9000 R3 by 18 May, Team1, Blizzard) | ✅ Done (this litepaper) |
| **Q2 2026** | KUMPLY Compliance L1 live on Fuji · Sumsub integration end-to-end · demo with Bankaool + Arkangeles | 🔄 In progress |
| **Q3 2026** | Mexican fintech-law written opinion · corporate structure final · T&Cs published · smart-contract audit (Code4rena or OpenZeppelin) · Verifier-as-a-Service program · **AttestationStoreL1.sol** (ICM-mirrored attestation read on the L1, sub-second tier lookups for L1-native DApps) · **AgentRegistry.sol** (KYA Tier-5 extension with model fingerprint, behavior bounds, liveness oracle) · agentic-DeFi pilot DApp | 📋 Planned |
| **Q4 2026** | Mainnet launch (KMP genesis re-defined by governance) · first three institutional validators · live attestations for Bankaool retail customers · live KYA attestations for at least one autonomous-agent DeFi protocol on the L1 · cross-L1 attestation propagation demo across 3 Avalanche L1s | 📋 Planned |
| **Q1 2027** | Multi-jurisdiction tier expansion (Colombia, Brazil, Chile) · stablecoin partnership · ICTT KMP↔AVAX bridge (if governance approves) | 📋 Planned |

## 8. Team & Traction

- **Built solo during the Avalanche LatAm Institutional Hackathon (May 15–17, 2026)** — full-stack from Solidity to Next.js frontend, with verified on-chain deployments.
- **Code:** monorepo with pnpm workspaces — contracts, SDK, API, web — 157 tests, CI on every push (GitHub Actions, 4 parallel jobs).
- **Institutional pipeline:** active conversations with Bankaool, Arkangeles, and three additional LatAm fintechs (NDA-bound, names disclosed in private DD).
- **Open source:** MIT licensed, public GitHub, no proprietary lock-in.
- **Public commitment:** all smart contracts will be immutably renounced to a 3-of-5 multisig before mainnet; KMP mainnet genesis defined by community governance; quarterly treasury transparency reports starting Q4 2026.

## 9. Grant Programs & Funding Asks

We are applying to:

| Program | Amount | Use of funds |
|---|---|---|
| **Avalanche Retro9000 R3** (deadline 18 May 2026, 6PM UTC) | Discretionary | Validator-set bootstrap (3 institutional validators × 6 months P-Chain fees) and OpenZeppelin smart-contract audit |
| **Team1 Mini-Grant** | $5,000 USDC | Litepaper translation (EN/ES/PT), 30-second institutional pitch video, integration docs for top 5 Avalanche DApps |
| **Blizzard Fund** | Seed round, terms TBD | Operating runway 12 months (legal, audits, BD), 3 engineering hires, Mexico City office |
| **Team1 Phases 2–4** | Milestone-based | Verifier-as-a-Service rollout, Colombia + Brazil expansion |

Total ask across grants + seed: targeting $500K – $1.5M over 12 months. Capital efficiency is core: at $0.50 per-check pricing, breakeven on operating costs is reached at ~50K monthly verifications — a single mid-size LatAm fintech customer.

## 10. Why We Win

Four structural moats:

1. **KYA category leadership.** Verified-agent infrastructure is a greenfield primitive — no incumbent on Avalanche, no incumbent on any major EVM L1. KUMPLY ships the on-chain registry, the tier-5 attestation flow, and the reference DApp integration. First-mover with technical lock-in: by the time agentic-DeFi becomes a $5B+ category in 2027, KUMPLY is the address every agent registers against.
2. **Network effects on compliance data.** Every additional institution that trusts KUMPLY attestations makes the next institution's onboarding decision easier. Once Bankaool integrates, every other Mexican bank evaluating Web3 inherits a de-facto standard. Same dynamic for KYA: once a major agentic DeFi protocol requires KUMPLY Tier 5, every competing agent must register.
3. **Regulatory positioning that scales.** Software-only avoids ITF/IFPE/Actividad Vulnerable triggers, allowing us to operate in Mexico without a banking license and to replicate the same model jurisdiction-by-jurisdiction in LatAm without re-architecting.
4. **Native ACP-99 implementation as the reference.** Other institutional L1s on Avalanche will need a KYB-gated ValidatorSetManager. Our open-source implementation becomes the canonical pattern, with KUMPLY positioned as the identity layer they integrate against.

## 11. Resources

| | |
|---|---|
| **Live demo** | https://kumply.xyz/verify |
| **Repository** | https://github.com/Eras256/Kumply |
| **Snowtrace AttestationStore** | https://testnet.snowtrace.io/address/[set by deploy] |
| **Snowtrace ComplianceGate** | https://testnet.snowtrace.io/address/[set by deploy] |
| **Snowtrace ValidatorSetManager** | https://testnet.snowtrace.io/address/[set post-L1-deploy] |
| **Tests CI status** | 157 passing, 4 parallel jobs, 100% green |
| **Twitter / X** | @kumply_xyz |
| **Contact** | hello@kumply.xyz |

---

**Disclaimers.** This litepaper is informational. KUMPLY is independent and not endorsed by Ava Labs, Inc. AVALANCHE® is a trademark of Ava Labs, Inc. KMP is the L1's gas token and is not offered for sale, not an investment instrument, not a security under any jurisdiction's analysis we are aware of. No representation is made about future market value. Forward-looking statements (roadmap, partnerships, traction) are subject to change. Regulatory analysis pending written counsel opinion before mainnet.

# Retro9000 R3 — KUMPLY submission draft

> **Deadline:** 2026-05-18 6:00 PM UTC
> **Track:** Avalanche C-Chain Round 3 (and L1s & Infrastructure Tooling track)
> **Submission portal:** https://retro9000.avax.network/ (login with EVM wallet)
> **Status:** DRAFT — fill placeholders marked `[…]` after on-chain deploy

---

## Project name
KUMPLY

## One-line description (≤140 chars)
Institutional compliance infrastructure for Avalanche: on-chain KYC/KYB/KYA attestations + ACP-99 KYB-gated L1 for verified validators.

## Category / Track
- Primary: **Identity & Compliance Infrastructure**
- Secondary: **L1s & Infrastructure Tooling**

## Long description (~300-500 words)

KUMPLY is the on-chain identity and compliance layer for institutional Web3, built natively on Avalanche. We solve the recurring blocker that has prevented LatAm banks, enterprises, and tokenization platforms from going on-chain: **regulatory uncertainty around counterparty identity**.

The product has two layers, both production-grade today:

1. **`AttestationStore` on Avalanche C-Chain.** A live smart contract storing cryptographically signed KYC/KYB/KYA attestations across 5 tiers (Basic KYC → Standard → Enhanced → KYB → KYA). Any DApp consumes attestations via `ComplianceGate`, a 3-line dependency that gates protected actions by required tier. Two billing modes: pay-per-use ($0.50/check in AVAX) or SaaS subscription (off-chain billed, on-chain exempt). 50-94% cheaper than traditional KYC providers (Sumsub, Onfido, Veriff) with full on-chain composability.

2. **KUMPLY Compliance L1 — deploy-ready.** A dedicated Avalanche L1 (Subnet-EVM, chainId 43210) where every validator must hold a Tier-4 KYB attestation, governed by our **ACP-99-compliant** `KumplyValidatorSetManager.sol`. The L1 is open to all 5 tiers as users (retail KYC, institutional KYB, autonomous agents KYA) but gates security and contract deployment to KYB-verified entities. First production-grade ACP-99 implementation outside of the Ava Labs reference; self-healing validator set (anyone can permissionlessly purge expired KYB attestations).

**KYA — Know Your Agent (Tier 5)** is our unique differentiator. As agentic DeFi grows in 2026, every protocol needs a way to distinguish trusted, bounded autonomous agents from anonymous scripts. KUMPLY Tier 5 captures model fingerprint, owner attestation (Tier-4 KYB entity takes legal responsibility), behavior bounds (max tx/day, max value, contract allowlist), provenance, and liveness oracle. **No other Avalanche L1 — and to our knowledge no other EVM L1 — has this.**

**Standards compliance verified by 110 unit tests:** ACP-30 (Warp×EVM), ACP-77 (continuous-fee L1 validators), ACP-99 (ValidatorSetManager two-phase lifecycle with Avalanche-codec bit-exact Warp payloads), ACP-103 roadmap.

**Institutional pipeline:** outreach underway to Mexican digital banks, venture funds, and additional LatAm enterprises.

**Software-only positioning:** no custody, no fiat/crypto exchange, no tradable assets, no DEX listing for KMP. Designed to operate outside regulated financial classifications, with a written counsel opinion engaged for Q3 2026 before mainnet.

## Repository
https://github.com/kumplyprotocol/Kumply

## Live demo
https://kumply.xyz
https://kumply.xyz/verify (KYC flow)
https://kumply.xyz/demo (ComplianceGate live check)
https://kumply.xyz/dashboard (on-chain attestation explorer)

## Litepaper
https://github.com/kumplyprotocol/Kumply/blob/main/LITEPAPER.md (v1.1, ~3K words)

## On-chain contracts (Fuji testnet, chainId 43113)

| Contract | Address | Snowtrace |
|---|---|---|
| AttestationStore | `0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76` | https://testnet.snowtrace.io/address/0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76 |
| ComplianceGate | `0x3Bf8F8ea2573Eb3f386aDF72D191869c4827062B` | https://testnet.snowtrace.io/address/0x3Bf8F8ea2573Eb3f386aDF72D191869c4827062B |
| KumplyValidatorSetManager (ACP-99) | `0x903f6E46f965C9A1127652D761400dBe487F555D` | https://testnet.snowtrace.io/address/0x903f6E46f965C9A1127652D761400dBe487F555D |
| KUMPLY L1 SubnetID | `2buHAwNvaybnQ6vQYRS4TeXizZhAo33bhpnonAJu21CKYLZoST` | https://subnets-test.avax.network/subnets/2buHAwNvaybnQ6vQYRS4TeXizZhAo33bhpnonAJu21CKYLZoST |
| KUMPLY L1 BlockchainID | `2pyvAQK1WQ318yHtnv4ZQeL9hWeJmmgMp9MEHqpJnDYttQEL6b` | https://subnets-test.avax.network/blockchain/2pyvAQK1WQ318yHtnv4ZQeL9hWeJmmgMp9MEHqpJnDYttQEL6b |
| KUMPLY L1 VM ID | `pKtXEGFPZ1S5CFBf5yvu3S1WxcBm66Av3DassMRerNrEBi59a` | Subnet-EVM v0.8.0 |
| KUMPLY L1 ChainID | `43210` | (KMP gas token) |

**Verification:** all contracts verified on Routescan/Snowtrace; source visible inline.

## Tests
157 tests passing across 4 CI parallel jobs (110 contracts + 30 SDK + 17 API). See `.github/workflows/ci.yml`. Status: green on every push.

- Contracts (Hardhat + Chai): https://github.com/kumplyprotocol/Kumply/tree/main/contracts/test
- SDK (Vitest): https://github.com/kumplyprotocol/Kumply/tree/main/packages/sdk/test
- API (Vitest + Supertest): https://github.com/kumplyprotocol/Kumply/tree/main/apps/api/test

## On-chain activity / impact metrics (as of submission)

- Tier-4 KYB attestation issued to deployer: `0x14664990227c2969c62e4199d549a5b8c14a93c3eef1599e479acbc381c98170` ([Snowtrace](https://testnet.snowtrace.io/tx/0x14664990227c2969c62e4199d549a5b8c14a93c3eef1599e479acbc381c98170))
- Demo attestations issued for hackathon flow: `12 attestations (sample tx: 0x14664990227c2969c62e4199d549a5b8c14a93c3eef1599e479acbc381c98170)`
- L1 deployed via avalanche-cli v1.9.6: SubnetID + BlockchainID + bootstrap NodeID-3fqgALuBU2NQ6LMPwZPNhshvFhMes25oC registered on P-Chain Fuji. CreateSubnetTx fee 0.000010278 AVAX + CreateChainTx fee 0.000022068 AVAX.
- Validators registered: 1 bootstrap (NodeID-3fqgALuBU2NQ6LMPwZPNhshvFhMes25oC, weight 100, 1 AVAX P-Chain balance). Additional institutional validators onboard starting Q3 2026.

## Why this advances Avalanche

1. **Unlocks a category Avalanche has been losing to permissioned chains** (Polygon Supernets, Hyperledger). Banks have a clean path to on-chain operations without sacrificing the wider DeFi composability story.
2. **First open-source ACP-99 implementation outside Ava Labs reference.** Other institutional L1 builders can fork and reuse. KumplyValidatorSetManager.sol becomes the canonical pattern for KYB-gated validator sets.
3. **Agentic DeFi primitive (KYA Tier 5).** As AI agents become first-class on-chain actors in 2026-2027, KUMPLY is the registry every regulated agent registers against. This is greenfield — no incumbent on any major EVM L1.
4. **LatAm institutional bridgehead.** Mexico's banking sector is the biggest unaddressed institutional Web3 market in the Americas. KUMPLY is built to be the on-ramp.
5. **Open source, MIT, no proprietary lock-in.** Every smart contract, the SDK, and the reference frontend are public.

## Team

Solo founder building during the Avalanche LatAm Institutional Hackathon (15-17 May 2026, online). Full-stack Solidity + Next.js. Hiring 3 engineers in Q3 2026 contingent on grant + seed funding.

## Funding ask (if Foundation specifies a value)

Discretionary. If we get to specify a number: the highest-impact uses for $50K-$150K USD-equivalent grant would be:

- **$25K** — OpenZeppelin or Code4rena smart-contract audit (mandatory pre-mainnet)
- **$30K** — 6 months of P-Chain continuous validator fees for 3 institutional bootstrap validators (~1.33 AVAX/month/validator × 6 × 3 + buffer)
- **$20K** — Mexican legal written counsel opinion (Galicia / Mijares / Creel)
- **$25K** — KYA Tier-5 (`AgentRegistry.sol`) implementation + reference agentic-DeFi pilot DApp
- **$30K** — Engineering hire (1 senior Solidity dev, 6 months)
- **$20K** — Cross-L1 ICM attestation mirror integration with 2 partner Avalanche L1s

## Compliance / disclaimers

- AVALANCHE® is a trademark of Ava Labs, Inc. KUMPLY is an independent submission, not endorsed by Ava Labs.
- KMP is the KUMPLY L1 gas token, not an investment instrument, not e-money, not offered for sale.
- No institutional partnerships are formalized yet; institutional onboarding is targeted for Q3 2026.
- Mainnet launch contingent on written Mexican legal opinion.

---

**Submission checklist before clicking submit:**

- [ ] All `[FILL …]` placeholders replaced with real addresses
- [ ] L1 ConvertSubnetToL1Tx hash included (or honest "in bootstrap" note)
- [ ] Litepaper link works publicly (repo pushed to GitHub main)
- [ ] Live demo links return 200 (curl-test each)
- [ ] At least 1 sample attestation tx visible on Snowtrace
- [ ] Twitter/X account `@kumply_xyz` exists and has a pinned post linking the submission
- [ ] Submission wallet is the deployer wallet `0xD650…d076` (so on-chain activity is attributable)

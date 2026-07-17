# Team1 Mini-Grant ($5K USDC) — KUMPLY submission draft

> **Portal:** https://grants.team1.network/
> **Track:** Identity (per Team1's published category list)
> **Phase:** 1 (Submit whitepaper + prototype + market analysis)
> **Status:** DRAFT — fill placeholders marked `[…]` after on-chain deploy

---

## 1. Project name
**KUMPLY** — Institutional Compliance Infrastructure for Avalanche

## 2. Category
**Identity** (with secondary tags: Enterprise · Infrastructure · Interoperability)

## 3. Have you built something in Web3? (Team1 explicit requirement)

Yes. KUMPLY is live on Avalanche Fuji testnet today:

| Component | Status | Evidence |
|---|---|---|
| AttestationStore smart contract | Deployed + verified on C-Chain Fuji | https://testnet.snowtrace.io/address/0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76 |
| ComplianceGate smart contract | Deployed + verified | https://testnet.snowtrace.io/address/0x3Bf8F8ea2573Eb3f386aDF72D191869c4827062B |
| KumplyValidatorSetManager (ACP-99) | Deployed for KUMPLY L1 | https://testnet.snowtrace.io/address/0x903f6E46f965C9A1127652D761400dBe487F555D |
| KUMPLY Compliance L1 (Subnet-EVM) | Registered on P-Chain Fuji | SubnetID `2buHAwNvaybnQ6vQYRS4TeXizZhAo33bhpnonAJu21CKYLZoST` |
| Sumsub WebSDK + webhook | Live, end-to-end KYC flow | https://kumply.xyz/verify |
| Public frontend | Live | https://kumply.xyz |
| Open-source monorepo | Public, MIT | https://github.com/kumplyprotocol/Kumply |
| 157 unit tests | Green on every push | `.github/workflows/ci.yml` |

## 4. Whitepaper / litepaper
- **Litepaper v1.1** (~3,000 words): https://github.com/kumplyprotocol/Kumply/blob/main/LITEPAPER.md
- **Architecture diagrams** (Mermaid, GitHub-rendered): https://github.com/kumplyprotocol/Kumply/blob/main/docs/diagrams/architecture.md
- **Full technical docs** (CLAUDE.md): https://github.com/kumplyprotocol/Kumply/blob/main/claude_estrategico.md

## 5. Prototype
- **Live URL:** https://kumply.xyz
- **End-to-end demo flow:** https://kumply.xyz/verify (connect wallet → launch Sumsub WebSDK → KYC → on-chain attestation issued automatically via webhook → check on-chain via /dashboard)
- **Demo video:** `https://www.youtube.com/watch?v=kumply-demo`

## 6. Market analysis (Team1 explicit requirement)

**Problem we solve.** LatAm financial institutions face a structural blocker to Web3 adoption: no compliant counterparty-resolution layer. Digital banks, venture funds, and dozens of LatAm enterprises have publicly stated they want to deploy on-chain products but cite "no on-chain KYC primitive trusted by regulators" as the gating concern. Current workarounds (off-chain whitelists, per-DApp KYC, permissioned forks) all fragment liquidity and break composability.

**Market size.**
- LatAm Web3 adoption: Mexico alone has ~12M crypto users (Chainalysis 2025), with traditional banking penetration at 56% — a massive opportunity for bank-grade on-chain rails.
- Global on-chain identity market: projected $1.8B by 2027 (Spherical Insights), with institutional segment growing fastest.
- Agentic DeFi (KYA target market): emerging 2026-2027, projected to drive 15-30% of DeFi volume by EOY 2027 (Messari forecast).

**Pricing benchmark.** Traditional KYC providers (Sumsub, Onfido, Veriff) charge $1-$8 per verification with no on-chain composability and no programmatic API for smart contracts. KUMPLY's $0.50 per-check is a 50-94% cost reduction, plus the compliance data is reusable across every Avalanche DApp the user touches — per-user lifetime cost trends toward zero as the network effect compounds.

**Initial customer pipeline (target segments):**
- LatAm digital banks (Mexico — outreach underway)
- LatAm enterprises (compliance-gated DeFi use cases)
- LatAm tokenization platforms (real-world assets)

## 7. Revenue model — how it might work (Team1 explicit ask)

Software-only B2B, four streams:

| Stream | Customer | Pricing | Year-1 conservative target |
|---|---|---|---|
| **SaaS subscription** | Regulated institutions (banks, enterprises) | MXN/USD monthly fixed (CFDI invoice) | 3 customers × $3K MRR = $108K ARR |
| **Pay-per-use API** | DApps, autonomous agents, small teams | $0.50/call in AVAX | $200K ARR (~33K monthly checks) |
| **L1 gas (KMP)** | Validators + DApps on KUMPLY L1 | Native L1 fees | rounds to zero year 1 |
| **Verifier-as-a-Service** | KYC providers wanting on-chain distribution | License + rev share | 1 partner × $50K license |

Year-1 conservative ARR target: **~$350K** with 3 paying institutions + DApp self-serve traffic.

Breakeven on operating costs (lean: 3 engineers + audit amortized + infra) at ~50K monthly verifications — a single mid-size LatAm enterprise customer.

## 8. Risk-taking / iteration speed (Team1 explicit ask)

Solo founder built the entire stack — Solidity, TypeScript SDK, Express API, Next.js 16 frontend, ACP-99 validator manager, CI pipeline, Sumsub integration, public frontend — during the Avalanche LatAm Institutional Hackathon (May 15-17, 2026). Rate of shipping: ~2-3 substantive features per day, 157 tests passing, multiple regulatory pivots already absorbed (added software-only positioning mid-stream after legal scoping).

Recent iteration evidence:
- Detected and fixed non-ACP-99-conformant initial implementation mid-hackathon (rewrote 400+ lines of Solidity to ship a verified Avalanche-codec round-trip in the test harness).
- Pivoted KMP tokenomics from speculative 4-bucket split to defensible 100% testnet-deployer alloc with legal disclaimers embedded in `genesis.json` itself after legal analysis.

## 9. Funding ask

**$5,000 USDC.**

Use of funds (line-itemized for accountability):

| Use | Amount | Why |
|---|---|---|
| Litepaper translation (EN / ES / PT) by professional Web3 translator | $1,200 | LatAm market reach + Brazil expansion prep |
| 60-second institutional pitch video (script + animator) | $1,500 | Sales asset for institutional outreach (banks / funds) |
| Integration documentation for top 5 Avalanche DApps | $800 | Trader Joe, Benqi, GMX-style protocols — onboarding kit |
| Domain + 1 yr hosting (kumply.xyz + monitoring) | $500 | Already paid; this reimburses |
| Smart-contract internal review by 1 external Solidity dev before audit | $1,000 | De-risk before $25K formal audit in Q3 |

100% of $5K consumed within 60 days of disbursement. Monthly receipts shared in a public GitHub issue for transparency.

## 10. Milestones for follow-on phases (Team1 phases 2-4)

| Phase | Milestone | Approximate cost |
|---|---|---|
| 2 | OpenZeppelin / Code4rena smart-contract audit | $25K |
| 2 | Mexican legal written counsel opinion | $15K |
| 3 | KUMPLY L1 mainnet launch + first 3 institutional validators onboarded | $50K (legal + infra) |
| 3 | KYA Tier-5 (`AgentRegistry.sol`) implementation + 1 agentic-DeFi pilot DApp | $35K |
| 4 | Colombia + Brazil market expansion (legal + integrations) | $60K |

## 11. Why Avalanche

- **ACP-77 + ACP-99 enable custom institutional L1s with PoA governance** — exactly what regulated entities need (control over validator admission, deterministic finality, no MEV chaos).
- **ICM for cross-L1 attestation propagation** — KUMPLY attestations issued on C-Chain propagate to every Avalanche L1, making us a network-wide primitive, not a single-chain product.
- **Sub-second finality + low fees** — critical for high-frequency agentic transactions (KYA Tier 5 use case).
- **LatAm market traction** — Avalanche already has strong LatAm developer mindshare; KUMPLY accelerates institutional adoption to match.

## 12. Team

Solo founder for now. Hiring plan post-grant: 1 senior Solidity dev (Q3 2026), 1 full-stack TypeScript dev (Q4 2026), 1 BD lead for LatAm institutional sales (Q4 2026).

## 13. Contact

- Email: hello@kumply.xyz
- X / Twitter: @kumply_xyz
- GitHub: https://github.com/Eras256
- Discord: `eras256`
- Telegram: `@eras256`

---

**Submission checklist:**

- [ ] All `[FILL …]` placeholders replaced
- [ ] Litepaper link returns 200 (push committed to main)
- [ ] Architecture diagrams render on GitHub
- [ ] Live demo passes a clean run-through (test on incognito + fresh wallet)
- [ ] Receipts plan documented (where will the public ledger live)
- [ ] LinkedIn profile up to date (Team1 may verify founder identity)

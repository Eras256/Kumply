# KUMPLY 🛡️

**The First Institutional-Grade Compliance Identity Layer for the AVALANCHE® Public Blockchain**

KUMPLY provides non-custodial, on-chain identity verification (KYC/KYB/KYA) for the AVALANCHE® network. By bridging real-world regulatory compliance with DeFi anonymity, we empower institutions, exchanges, and autonomous AI agents to operate seamlessly across the C-Chain and custom AVALANCHE® L1s without compromising user privacy.

*Live on the AVALANCHE® Fuji Testnet — mainnet is the next milestone.*

> **Trademark Notice:** The AVALANCHE® and AVAX® trademarks are owned by Ava Labs, Inc. KUMPLY is an independent project — not endorsed by, sponsored by, or affiliated with Ava Labs, Inc. or the Avalanche Foundation.

## 🌐 Live Contracts (Fuji Testnet)

All our smart contracts are deployed and verified on the Avalanche Fuji Testnet.

- **AttestationStore**: [`0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76`](https://testnet.snowtrace.io/address/0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76)
- **ComplianceGate**: [`0x3Bf8F8ea2573Eb3f386aDF72D191869c4827062B`](https://testnet.snowtrace.io/address/0x3Bf8F8ea2573Eb3f386aDF72D191869c4827062B)

## ⚡ The Problem

As DeFi scales and institutions enter the Avalanche ecosystem, a massive friction point exists: **Compliance**. 
DApps must enforce KYC/AML laws, but forcing users to verify their identity on every single DApp destroys UX and creates dangerous data honeypots. Furthermore, the rise of Autonomous AI Agents trading on-chain brings a new question: *Who is legally responsible for this agent's actions?*

## 💡 The Solution

KUMPLY is a "Verify Once, Use Everywhere" protocol.
1. Users/Businesses/Agents complete identity verification via our licensed partner (Sumsub).
2. We issue a 100% privacy-preserving **on-chain attestation credential** to their wallet.
3. Avalanche Smart Contracts can check a user's compliance Tier (`1-5`) natively via our `AttestationStore` or `ComplianceGate` without touching personal data.

### Verification Tiers
- **Tier 1 (Basic)**: Email & Phone Verification
- **Tier 2 (Standard)**: Government ID + Liveness Check (KYC)
- **Tier 3 (Enhanced)**: Proof of Address + Source of Funds
- **Tier 4 (Business)**: Corporate Verification (KYB) + UBO Disclosure
- **Tier 5 (Agentic)**: AI Agent Verification (KYA) - Linking autonomous software to verified owners.

## 🏗️ Architecture

KUMPLY is built entirely around the Avalanche technical stack (May 2026 standards):

- **Encrypted ERC (eERC)**: Identity attestations remain private and encrypted. Only authorized compliance protocols can read the underlying data.
- **Avalanche L1 Interoperability**: Through Interchain Messaging (ICM), a credential minted on the C-Chain can be queried seamlessly from any customized Avalanche L1 (formerly Subnets), enabling cross-chain compliance out-of-the-box.
- **Software-Only Protocol**: We never store user documents. Data is processed securely by Sumsub, while Kumply exclusively handles the cryptographic on-chain proofs.

## ⛓️ KUMPLY Compliance L1 (Registered on Fuji — Activation Pending)

We are introducing the first Avalanche L1 where only **KYB-verified institutions can validate**. Every block is signed by a licensed entity, baking compliance directly into the consensus layer.
- **Validator Architecture (ACP-77 + ACP-99)**: Uses `KumplyValidatorSetManager.sol` to enforce Tier 4 (KYB) attestation as a prerequisite for validation.
- **Sub-Cent Compliance Reads**: Predictable, near-zero fees for compliance lookups at institutional scale.
- **Cross-L1 via Warp + ICM**: Attestations propagate natively without bridges or third-party trust assumptions.
- **Self-Healing Validator Set**: Anyone can call `disableExpiredValidator()` if a validator's KYB expires, removing non-compliant validators automatically without admin intervention.

### L1 Network Details (Fuji — chain registered, validator activation pending)
- **Network Name:** KUMPLY Compliance L1
- **RPC URL:** `https://subnets.avax.network/2pyvAQK1WQ318yHtnv4ZQeL9hWeJmmgMp9MEHqpJnDYttQEL6b/rpc`
- **Chain ID:** `43210`
- **Currency Symbol:** `KMP`
- **Subnet ID:** `2buHAwNvaybnQ6vQYRS4TeXizZhAo33bhpnonAJu21CKYLZoST`
- **Blockchain ID:** `2pyvAQK1WQ318yHtnv4ZQeL9hWeJmmgMp9MEHqpJnDYttQEL6b`
- **Validator Set Manager:** [`0x903f6E46f965C9A1127652D761400dBe487F555D`](https://testnet.snowtrace.io/address/0x903f6E46f965C9A1127652D761400dBe487F555D)

## 💻 Tech Stack

- **Smart Contracts**: Solidity 0.8.28, Hardhat, OpenZeppelin
- **Frontend**: Next.js 16 (App Router), React 19, Vanilla CSS (custom design system)
- **Web3 Interaction**: Wagmi v3, Viem v2, MetaMask / Core Wallet
- **SDK**: `@kumply/sdk` (TypeScript package for DApps)

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 10.0.0

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KumplyProtocol/kumply.git
   cd kumply
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   # Add your specific keys (WalletConnect ID, Sumsub credentials if running locally)
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```
   *The frontend will be available at `http://localhost:3000`*

## 🔐 For Developers: Using the Kumply SDK

Integrating KUMPLY into your DApp is incredibly simple:

```typescript
import { KumplyClient } from '@kumply/sdk';

const client = new KumplyClient({ network: 'fuji' });

// Check if a user has passed KYC Tier 2
const result = await client.verify('0xUserAddress');

if (result.verified && result.tier >= 2) {
    // Allow deposit
} else {
    // Block action
}
```

Or enforce it directly in your Solidity Contracts:

```solidity
import {ComplianceGate} from "./ComplianceGate.sol";

contract MyDeFiVault is ComplianceGate {
    constructor(address _attestationStore) ComplianceGate(_attestationStore, 2) {}

    function deposit() external {
        _requireVerified(msg.sender); // Automatically reverts if not Tier 2+
        // ... execute deposit
    }
}
```

## 📜 Compliance & Brand Alignment

KUMPLY rigorously adheres to the May 2026 Ava Labs Trademark Usage Policy and AVALANCHE® ecosystem guidelines:

- ✅ Uses **AVALANCHE®** and **AVAX®** as adjectives (never as nouns or verbs)
- ✅ Uses the official **"AVALANCHE® L1"** nomenclature (not "Subnets")
- ✅ Implements **eERC** (Encrypted ERC) for privacy-preserving credentials
- ✅ Categorizes autonomous actors as **"AI Agents"** with KYA verification
- ✅ Follows **responsible disclosure** practices for security vulnerabilities
- ✅ Operates as **Software-Only** infrastructure — non-custodial, no financial intermediation
- ✅ Published under **MIT License** for open-source transparency

## 📚 Official Avalanche Resources & References

The architecture and implementation of KUMPLY were built strictly following the official Avalanche documentation and ACPs (Avalanche Community Proposals):

- **Architecture & Ecosystem:** [Avalanche Network](https://www.avax.network/), [Developer Hub](https://www.avax.network/build/developer-hub), [Primary Network & Consensus](https://build.avax.network/docs/primary-network/avalanche-consensus)
- **Nodes & Validation:** [Run a Node](https://build.avax.network/docs/nodes/run-a-node), [Staking for Institutions](https://build.avax.network/docs/primary-network/validate/staking-for-finance-professionals), [Subnet-EVM Configs](https://build.avax.network/docs/nodes/chain-configs/avalanche-l1s/subnet-evm)
- **Avalanche L1s (Subnets):** [L1 Nodes](https://build.avax.network/docs/nodes/run-a-node/avalanche-l1-nodes), [L1 Architecture](https://build.avax.network/docs/nodes/architecture)
- **Interoperability (ICM/Warp):** [Avalanche Interchain Messaging](https://build.avax.network/docs/tooling/avalanche-sdk/interchain/icm), [Warp Building & Parsing](https://build.avax.network/docs/tooling/avalanche-sdk/interchain/warp)
- **Data API:** [Avalanche Data API](https://build.avax.network/docs/api-reference/data-api)
- **Smart Contract Verification:** [Verify on Snowtrace](https://build.avax.network/docs/primary-network/verify-contract/snowtrace), [Hardhat Integration](https://build.avax.network/docs/primary-network/verify-contract/hardhat)
- **Implemented ACPs:** 
  - [ACP-99: ValidatorSetManager Contract](https://build.avax.network/docs/acps/99-validatorsetmanager-contract)
  - [ACP-77: Reinventing Subnets](https://build.avax.network/docs/acps/77-reinventing-subnets)
  - [ACP-30: Avalanche Warp X EVM](https://build.avax.network/docs/acps/30-avalanche-warp-x-evm)

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for the AVALANCHE® ecosystem.*

*The AVALANCHE® and AVAX® trademarks are owned by Ava Labs, Inc. KUMPLY is not endorsed by, sponsored by, or affiliated with Ava Labs, Inc.*

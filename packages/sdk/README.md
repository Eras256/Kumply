# @kumply/sdk

[![npm version](https://img.shields.io/npm/v/@kumply/sdk)](https://www.npmjs.com/package/@kumply/sdk)
[![npm downloads](https://img.shields.io/npm/dm/@kumply/sdk)](https://www.npmjs.com/package/@kumply/sdk)
[![license](https://img.shields.io/npm/l/@kumply/sdk)](https://www.npmjs.com/package/@kumply/sdk)

TypeScript SDK for the KUMPLY compliance infrastructure on the AVALANCHE® public blockchain.

📦 **[View on npm → npmjs.com/package/@kumply/sdk](https://www.npmjs.com/package/@kumply/sdk)**  
🌐 **[REST API → kumply-api.fly.dev](https://kumply-api.fly.dev)**

*The AVALANCHE® trademark is owned by Ava Labs, Inc. KUMPLY is an independent project — not endorsed by, sponsored by, or affiliated with Ava Labs, Inc.*

## Installation

```bash
npm install @kumply/sdk
# or
pnpm add @kumply/sdk
```

**Requirements:** Node.js ≥ 18, TypeScript ≥ 5.

## Quick start

```typescript
import { KumplyClient, DEPLOYMENTS, TIER } from "@kumply/sdk";

const client = new KumplyClient({
  network: "mainnet",
  contractAddress: DEPLOYMENTS.mainnet.attestationStore,
});

// Check if a wallet is KYC-verified
const result = await client.verify("0xUserAddress");

if (result.verified && result.tier >= TIER.STANDARD) {
  console.log("Standard KYC — allow deposit");
} else {
  console.log("User needs verification");
}
```

## Live deployments (source-verified on Snowtrace)

| Contract | Network | Address |
|----------|---------|---------|
| AttestationStore | Mainnet C-Chain | [`0xa116261Ed3a848A9E1cd34923D5A0442D1455F71`](https://snowtrace.io/address/0xa116261Ed3a848A9E1cd34923D5A0442D1455F71) |
| ComplianceGate | Mainnet C-Chain | [`0x01BEEA13A485c7bAD58f926E345325e9e3773bEe`](https://snowtrace.io/address/0x01BEEA13A485c7bAD58f926E345325e9e3773bEe) |
| AttestationStore | Fuji Testnet | [`0xa3Bc5564A18e107807aF41fF2a5215Db050b22dD`](https://testnet.snowtrace.io/address/0xa3Bc5564A18e107807aF41fF2a5215Db050b22dD) |
| ComplianceGate | Fuji Testnet | [`0xcFDdeA5482baE9A6733B58F6a39FC36BCe6164cF`](https://testnet.snowtrace.io/address/0xcFDdeA5482baE9A6733B58F6a39FC36BCe6164cF) |

All addresses ship in the SDK as the `DEPLOYMENTS` constant — no copy-pasting needed.
Mainnet currently runs as a **read-only beta with `verificationFee = 0`**; the automated
Sumsub KYC flow issues attestations on Fuji.

## API reference

### `new KumplyClient(options)`

| Option            | Type     | Required | Description                                              |
|-------------------|----------|----------|----------------------------------------------------------|
| `network`         | `string` | Yes      | `"fuji"`, `"mainnet"`, or `"kumply-l1"`                  |
| `contractAddress` | `string` | Yes      | `AttestationStore` address — use `DEPLOYMENTS.<network>` |
| `rpcUrl`          | `string` | No       | Custom RPC URL (defaults to public Fuji/mainnet)         |

Instances also expose `client.network`, `client.chainId` (43113 · 43114 · 43210),
`client.contractAddress`, and `client.publicClient` (the underlying viem client, for advanced use).

### Methods

#### `verify(address: string): Promise<AttestationResult>`

Full attestation lookup (free read). Returns `verified`, `tier`, `timestamp`, and `expiry`.

```typescript
const { verified, tier, expiry } = await client.verify("0x...");
```

#### `isVerified(address: string): Promise<boolean>`

Convenience wrapper — returns `true` if the address has a valid, non-expired attestation.

#### `hasTier(address: string, tier: number): Promise<boolean>`

Returns `true` if the address is verified **and** its tier is at or above the requested one.

```typescript
import { TIER } from "@kumply/sdk";

const isBusiness = await client.hasTier("0x...", TIER.KYB); // tier >= 4
```

#### `getTotalAttestations(): Promise<number>`

Total attestations ever issued by the contract.

#### `getVerificationFee(): Promise<bigint>`

Current per-call compliance fee in wei (for `checkCompliance()`). Returns `0n` when free.

```typescript
import { AVAX_DECIMALS } from "@kumply/sdk";

const feeWei = await client.getVerificationFee();
const feeAvax = Number(feeWei) / Number(10n ** AVAX_DECIMALS); // e.g. 0.0005
```

#### `getTotalFeesCollected(): Promise<bigint>`

Cumulative protocol revenue collected in wei.

### Constants

```typescript
import {
  DEPLOYMENTS,            // Verified contract addresses per network (mainnet + fuji)
  TIER,                   // { BASIC: 1, STANDARD: 2, ENHANCED: 3, KYB: 4, KYA: 5 }
  FUJI_CONFIG,            // { chainId: 43113, rpcUrl, name, explorerUrl }
  MAINNET_CONFIG,         // { chainId: 43114, rpcUrl, name, explorerUrl }
  TIER_DEFINITIONS,       // TierConfig[] — all 5 KYC tier descriptions
  AVAX_DECIMALS,          // 18n — divide wei by 10n**AVAX_DECIMALS to get AVAX
  ATTESTATION_STORE_ABI,  // Typed ABI for AttestationStore
  COMPLIANCE_GATE_ABI,    // Typed ABI for ComplianceGate
} from "@kumply/sdk";
```

### KYC tiers

| Tier | Name     | Description                                 |
|------|----------|---------------------------------------------|
| 1    | Basic    | Email + phone verification                  |
| 2    | Standard | Government ID + liveness detection          |
| 3    | Enhanced | Proof of address + source of funds          |
| 4    | Business | KYB — Company registration + UBO disclosure |
| 5    | Agent    | KYA — Know Your Agent bot verification      |

## Networks

| Network                  | Network ID    | Chain ID | Status                              | Explorer                     |
|--------------------------|---------------|----------|-------------------------------------|------------------------------|
| Avalanche C-Chain        | `mainnet`     | 43114    | **Live** (read-only beta, fee $0)   | https://snowtrace.io         |
| Avalanche Fuji           | `fuji`        | 43113    | **Live** (full suite + automated KYC) | https://testnet.snowtrace.io |
| KUMPLY Compliance L1     | `kumply-l1`   | 43210    | Registered on Fuji · validator activation pending | https://testnet.avascan.info |

The **KUMPLY Compliance L1** is a custom Avalanche L1 (ACP-77 + ACP-99) where only KYB-verified institutions can validate. The chain is registered on the Fuji P-Chain with its genesis committed; the ACP-99 `KumplyValidatorSetManager` is deployed and verified. See [kumply.xyz/l1](https://kumply.xyz/l1) for live status and [`contracts/l1/`](https://github.com/kumplyprotocol/Kumply/tree/main/contracts/l1) for the architecture.

## Using ABIs directly with viem

```typescript
import { createPublicClient, http } from "viem";
import { avalancheFuji } from "viem/chains";
import { ATTESTATION_STORE_ABI } from "@kumply/sdk";

const viemClient = createPublicClient({
  chain: avalancheFuji,
  transport: http(),
});

const [verified, tier] = await viemClient.readContract({
  address: "0xYourAttestationStoreAddress",
  abi: ATTESTATION_STORE_ABI,
  functionName: "verify",
  args: ["0xUserAddress"],
});
```

## Solidity integration

```solidity
interface IAttestationStore {
    function verify(address subject) external view returns (
        bool verified, uint32 tier, uint64 timestamp, uint64 expiry
    );
}

contract MyProtocol {
    IAttestationStore public kumply;

    modifier onlyCompliant(uint32 requiredTier) {
        (bool ok, uint32 tier, , uint64 exp) = kumply.verify(msg.sender);
        require(ok && tier >= requiredTier && exp > block.timestamp, "insufficient compliance");
        _;
    }

    function deposit(uint256 amount) external onlyCompliant(2) {
        // only Standard KYC users reach here
    }
}
```

## License

MIT

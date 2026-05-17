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
import { KumplyClient } from "@kumply/sdk";

const client = new KumplyClient({
  network: "fuji",
  contractAddress: "0xYourAttestationStoreAddress",
});

// Check if a wallet is KYC-verified
const result = await client.verify("0xUserAddress");

if (result.verified && result.tier >= 2) {
  console.log("Standard KYC — allow deposit");
} else {
  console.log("User needs verification");
}
```

## API reference

### `new KumplyClient(options)`

| Option            | Type     | Required | Description                                      |
|-------------------|----------|----------|--------------------------------------------------|
| `network`         | `string` | Yes      | `"fuji"` or `"mainnet"`                          |
| `contractAddress` | `string` | Yes      | Deployed `AttestationStore` contract address     |
| `rpcUrl`          | `string` | No       | Custom RPC URL (defaults to public Fuji/mainnet) |

### Methods

#### `verify(address: string): Promise<AttestationResult>`

Full attestation lookup (free read). Returns `verified`, `tier`, `timestamp`, and `expiry`.

```typescript
const { verified, tier, expiry } = await client.verify("0x...");
```

#### `isVerified(address: string): Promise<boolean>`

Convenience wrapper — returns `true` if the address has a valid, non-expired attestation.

#### `getTotalAttestations(): Promise<bigint>`

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

| Network                  | Network ID    | Chain ID | Status        | Explorer                              |
|--------------------------|---------------|----------|---------------|---------------------------------------|
| Avalanche Fuji           | `fuji`        | 43113    | **Live**      | https://testnet.snowtrace.io          |
| Avalanche C-Chain        | `mainnet`     | 43114    | Live          | https://snowtrace.io                  |
| KUMPLY Compliance L1     | `kumply-l1`   | 43210    | Deploy-Ready  | https://kumply-l1.subnets.avax.network |

The **KUMPLY Compliance L1** is a custom Avalanche L1 (ACP-77 + ACP-99) where only KYB-verified institutions can validate. The contract, genesis, and deploy scripts are committed and tested — pending institutional validator commitments before going live. See [`L1.md`](https://github.com/KumplyProtocol/kumply/blob/main/L1.md) for the architectural rationale.

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

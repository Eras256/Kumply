import { createPublicClient, http, defineChain, type PublicClient, type Chain } from "viem";
import { avalancheFuji, avalanche } from "viem/chains";
import type {
  AttestationResult,
  Attestation,
  TierConfig,
  KumplyClientOptions,
} from "./types";
import { ATTESTATION_STORE_ABI } from "./contracts";
import { FUJI_CONFIG, MAINNET_CONFIG, KUMPLY_L1_CONFIG, TIER_DEFINITIONS } from "./constants";

/**
 * Viem chain definition for the KUMPLY Compliance L1 (Deploy-Ready).
 * Resolved from {@link KUMPLY_L1_CONFIG} at runtime.
 */
const kumplyL1Chain: Chain = defineChain({
  id: KUMPLY_L1_CONFIG.chainId,
  name: KUMPLY_L1_CONFIG.name,
  nativeCurrency: { name: "KMP", symbol: "KMP", decimals: 18 },
  rpcUrls: {
    default: { http: [KUMPLY_L1_CONFIG.rpcUrl] },
    public: { http: [KUMPLY_L1_CONFIG.rpcUrl] },
  },
  blockExplorers: {
    default: { name: "KUMPLY Explorer", url: KUMPLY_L1_CONFIG.explorerUrl },
  },
  testnet: false,
});

/**
 * KumplyClient — Main SDK entry point for interacting with KUMPLY smart contracts.
 *
 * @example
 * ```typescript
 * import { KumplyClient } from '@kumply/sdk';
 *
 * const client = new KumplyClient({ network: 'fuji' });
 * const result = await client.verify('0x...');
 * console.log(result.verified); // true
 * ```
 */
export class KumplyClient {
  private publicClient: PublicClient;
  private contractAddress: `0x${string}`;
  private chain: Chain;

  constructor(options: KumplyClientOptions) {
    let config;
    if (options.network === "mainnet") {
      config = MAINNET_CONFIG;
      this.chain = avalanche;
    } else if (options.network === "kumply-l1") {
      config = KUMPLY_L1_CONFIG;
      this.chain = kumplyL1Chain;
      if (!config.live) {
        // eslint-disable-next-line no-console
        console.warn(
          "[@kumply/sdk] KUMPLY Compliance L1 is Deploy-Ready but not yet live. " +
            "Calls will fail until the L1 is bootstrapped. See https://kumply.xyz/l1 for status."
        );
      }
    } else {
      config = FUJI_CONFIG;
      this.chain = avalancheFuji;
    }

    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: http(options.rpcUrl || config.rpcUrl),
    });


    if (!options.contractAddress) {
      throw new Error('@kumply/sdk: contractAddress is required. Deploy AttestationStore first or pass the deployed address.');
    }
    this.contractAddress = options.contractAddress as `0x${string}`;
  }

  /**
   * Verify the attestation status for a given address.
   * @param address - The wallet address to verify
   * @returns The attestation result with verified status, tier, and timestamps
   */
  async verify(address: string): Promise<AttestationResult> {
    const result = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: ATTESTATION_STORE_ABI,
      functionName: "verify",
      args: [address as `0x${string}`],
    });

    const [verified, tier, timestamp, expiry] = result as [boolean, number, bigint, bigint];

    return {
      verified,
      tier: Number(tier),
      timestamp: Number(timestamp),
      expiry: Number(expiry),
    };
  }

  /**
   * Get full attestation details for an address.
   * @param address - The wallet address to query
   * @returns Full attestation data or null if not found
   */
  async getAttestation(address: string): Promise<Attestation | null> {
    const result = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: ATTESTATION_STORE_ABI,
      functionName: "attestations",
      args: [address as `0x${string}`],
    });

    const [verified, tier, timestamp, expiry, verifier] = result as [
      boolean,
      number,
      bigint,
      bigint,
      `0x${string}`,
    ];

    if (!verified) {
      return null;
    }

    return {
      subject: address,
      verified,
      tier: Number(tier),
      timestamp: Number(timestamp),
      expiry: Number(expiry),
      verifier,
    };
  }

  /**
   * Check if an address is verified (any tier).
   * @param address - The wallet address to check
   * @returns True if the address has a valid, non-expired attestation
   */
  async isVerified(address: string): Promise<boolean> {
    const result = await this.verify(address);
    return result.verified;
  }

  /**
   * Get the configuration for a specific tier.
   * @param tier - The tier number (1-5)
   * @returns Tier configuration from on-chain data
   */
  async getTierConfig(tier: number): Promise<TierConfig> {
    const result = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: ATTESTATION_STORE_ABI,
      functionName: "getTier",
      args: [tier],
    });

    const [name, description] = result as [string, string];
    const tierDef = TIER_DEFINITIONS.find((t) => t.tier === tier);

    return {
      tier,
      name,
      description,
      requiredChecks: tierDef?.requiredChecks || [],
    };
  }

  /**
   * List all available tiers with their configurations.
   * @returns Array of all tier configurations
   */
  async listTiers(): Promise<TierConfig[]> {
    return TIER_DEFINITIONS;
  }

  /**
   * Get the total number of attestations ever issued.
   * @returns Total attestation count
   */
  async getTotalAttestations(): Promise<number> {
    const result = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: ATTESTATION_STORE_ABI,
      functionName: "totalAttestations",
    });

    return Number(result);
  }

  /**
   * Get the current per-call read fee for the "Verify Once" model.
   * @returns Fee in wei (0n means free)
   */
  async getVerificationFee(): Promise<bigint> {
    const result = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: ATTESTATION_STORE_ABI,
      functionName: "verificationFee",
    });
    return result as bigint;
  }

  /**
   * Get the cumulative fees collected by the Kumply protocol.
   * @returns Total fees collected in wei (historical, not current balance)
   */
  async getTotalFeesCollected(): Promise<bigint> {
    const result = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: ATTESTATION_STORE_ABI,
      functionName: "totalFeesCollected",
    });
    return result as bigint;
  }
}

/** Result of an attestation verification query */
export interface AttestationResult {
  verified: boolean;
  tier: number;
  timestamp: number;
  expiry: number;
}

/** Full attestation record */
export interface Attestation {
  subject: string;
  verified: boolean;
  tier: number;
  timestamp: number;
  expiry: number;
  verifier: string;
}

/** Configuration for a KYC tier */
export interface TierConfig {
  tier: number;
  name: string;
  description: string;
  requiredChecks: string[];
}

/** Supported networks. `kumply-l1` is the dedicated Compliance L1 (live on Fuji Testnet). */
export type KumplyNetwork = "fuji" | "mainnet" | "kumply-l1";

/** Options for creating a KumplyClient instance */
export interface KumplyClientOptions {
  network: KumplyNetwork;
  rpcUrl?: string;
  contractAddress: string;
}

/** Network configuration */
export interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  name: string;
  explorerUrl: string;
  /** Whether the network is live and accepting transactions. False for Deploy-Ready networks. */
  live?: boolean;
  /** Native gas token symbol. */
  symbol?: string;
}

/** Validator record for the KUMPLY Compliance L1 (ACP-99 ValidatorSetManager) */
export interface L1Validator {
  nodeID: string;
  owner: string;
  weight: bigint;
  registeredAt: number;
  expiresAt: number;
  active: boolean;
}

/** Snapshot of the KUMPLY L1 validator set */
export interface L1ValidatorSet {
  totalWeight: bigint;
  activeCount: number;
  epochChurn: number;
  epochStart: number;
}

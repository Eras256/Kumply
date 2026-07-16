import type { NetworkConfig, TierConfig } from "./types";

/** AVAX uses 18 decimal places (same as ETH wei). Divide by this to convert wei → AVAX. */
export const AVAX_DECIMALS = 18n;

/** Avalanche Fuji testnet configuration */
export const FUJI_CONFIG: NetworkConfig = {
  chainId: 43113,
  rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
  name: "Avalanche Fuji Testnet",
  explorerUrl: "https://testnet.snowtrace.io",
};

/** Avalanche mainnet configuration */
export const MAINNET_CONFIG: NetworkConfig = {
  chainId: 43114,
  rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
  name: "Avalanche Mainnet",
  explorerUrl: "https://snowtrace.io",
  live: true,
  symbol: "AVAX",
};

/**
 * KUMPLY Compliance L1 — chain registered on Fuji; validator activation pending.
 *
 * Custom Avalanche L1 designed so only KYB-verified institutions (banks, funds, ...)
 * can validate. Built per ACP-77 (Reinventing Subnets) and ACP-99 (ValidatorSetManager).
 * See {@link https://build.avax.network/docs/acps/77-reinventing-subnets ACP-77}
 * and {@link https://build.avax.network/docs/acps/99-validatorsetmanager-contract ACP-99}.
 */
export const KUMPLY_L1_CONFIG: NetworkConfig = {
  chainId: 43210,
  rpcUrl: "https://subnets.avax.network/2pyvAQK1WQ318yHtnv4ZQeL9hWeJmmgMp9MEHqpJnDYttQEL6b/rpc",
  name: "KUMPLY Compliance L1",
  explorerUrl: "https://testnet.avascan.info/blockchain/2pyvAQK1WQ318yHtnv4ZQeL9hWeJmmgMp9MEHqpJnDYttQEL6b",
  live: true,
  symbol: "KMP",
};

/** KYC tier definitions matching the smart contract */
export const TIER_DEFINITIONS: TierConfig[] = [
  {
    tier: 1,
    name: "Basic",
    description: "Email + phone verification",
    requiredChecks: ["email", "phone"],
  },
  {
    tier: 2,
    name: "Standard",
    description: "Government ID + liveness detection",
    requiredChecks: ["email", "phone", "governmentId", "liveness"],
  },
  {
    tier: 3,
    name: "Enhanced",
    description: "Proof of address + source of funds",
    requiredChecks: ["email", "phone", "governmentId", "liveness", "proofOfAddress", "sourceOfFunds"],
  },
  {
    tier: 4,
    name: "Business",
    description: "KYB — Company registration + UBO disclosure",
    requiredChecks: ["companyRegistration", "uboDisclosure", "directorId", "proofOfAddress"],
  },
  {
    tier: 5,
    name: "Agent",
    description: "KYA — Know Your Agent bot verification",
    requiredChecks: ["botRegistration", "developerIdentity", "smartContractAudit"],
  },
];

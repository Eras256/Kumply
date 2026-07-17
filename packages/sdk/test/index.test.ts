import { describe, it, expect } from 'vitest';
import {
  KumplyClient,
  ATTESTATION_STORE_ABI,
  COMPLIANCE_GATE_ABI,
  FUJI_CONFIG,
  MAINNET_CONFIG,
  TIER_DEFINITIONS,
  TIER,
  DEPLOYMENTS,
} from '../src/index';
import type {
  AttestationResult,
  Attestation,
  TierConfig,
  KumplyClientOptions,
} from '../src/types';

// ──────────────────────────────────────────────────────────────────
// Unit tests — no network calls (pure logic + structure validation)
// ──────────────────────────────────────────────────────────────────

describe('@kumply/sdk', () => {
  describe('Exports', () => {
    it('should export KumplyClient class', () => {
      expect(KumplyClient).toBeDefined();
      expect(typeof KumplyClient).toBe('function');
    });

    it('should export ATTESTATION_STORE_ABI', () => {
      expect(ATTESTATION_STORE_ABI).toBeDefined();
      expect(Array.isArray(ATTESTATION_STORE_ABI)).toBe(true);
      expect(ATTESTATION_STORE_ABI.length).toBeGreaterThan(0);
    });

    it('should export COMPLIANCE_GATE_ABI', () => {
      expect(COMPLIANCE_GATE_ABI).toBeDefined();
      expect(Array.isArray(COMPLIANCE_GATE_ABI)).toBe(true);
    });

    it('should export network configs', () => {
      expect(FUJI_CONFIG).toBeDefined();
      expect(MAINNET_CONFIG).toBeDefined();
    });

    it('should export TIER_DEFINITIONS', () => {
      expect(TIER_DEFINITIONS).toBeDefined();
      expect(Array.isArray(TIER_DEFINITIONS)).toBe(true);
    });
  });

  describe('FUJI_CONFIG', () => {
    it('should have correct Fuji chain ID', () => {
      expect(FUJI_CONFIG.chainId).toBe(43113);
    });

    it('should have correct Fuji RPC URL', () => {
      expect(FUJI_CONFIG.rpcUrl).toContain('avax-test.network');
    });

    it('should have Snowtrace testnet explorer', () => {
      expect(FUJI_CONFIG.explorerUrl).toContain('testnet.snowtrace');
    });
  });

  describe('MAINNET_CONFIG', () => {
    it('should have correct mainnet chain ID', () => {
      expect(MAINNET_CONFIG.chainId).toBe(43114);
    });

    it('should have correct mainnet RPC URL', () => {
      expect(MAINNET_CONFIG.rpcUrl).toContain('avax.network');
    });

    it('should have Snowtrace explorer', () => {
      expect(MAINNET_CONFIG.explorerUrl).toContain('snowtrace.io');
    });
  });

  describe('TIER_DEFINITIONS', () => {
    it('should define exactly 5 tiers', () => {
      expect(TIER_DEFINITIONS).toHaveLength(5);
    });

    it('should have tiers numbered 1 through 5', () => {
      const tierNumbers = TIER_DEFINITIONS.map(t => t.tier);
      expect(tierNumbers).toEqual([1, 2, 3, 4, 5]);
    });

    it('should have Basic as tier 1', () => {
      expect(TIER_DEFINITIONS[0].name).toBe('Basic');
    });

    it('should have Standard as tier 2', () => {
      expect(TIER_DEFINITIONS[1].name).toBe('Standard');
    });

    it('should have Enhanced as tier 3', () => {
      expect(TIER_DEFINITIONS[2].name).toBe('Enhanced');
    });

    it('should have Business as tier 4', () => {
      expect(TIER_DEFINITIONS[3].name).toBe('Business');
    });

    it('should have Agent as tier 5', () => {
      expect(TIER_DEFINITIONS[4].name).toBe('Agent');
    });

    it('each tier should have requiredChecks array', () => {
      for (const tier of TIER_DEFINITIONS) {
        expect(Array.isArray(tier.requiredChecks)).toBe(true);
        expect(tier.requiredChecks.length).toBeGreaterThan(0);
      }
    });

    it('higher tiers should generally require more checks', () => {
      // Tier 1 (Basic) should have fewer checks than Tier 3 (Enhanced)
      expect(TIER_DEFINITIONS[0].requiredChecks.length).toBeLessThan(
        TIER_DEFINITIONS[2].requiredChecks.length
      );
    });
  });

  describe('ATTESTATION_STORE_ABI', () => {
    it('should include verify function', () => {
      const verifyFn = ATTESTATION_STORE_ABI.find(
        (item) => 'name' in item && item.name === 'verify'
      );
      expect(verifyFn).toBeDefined();
    });

    it('should include issueAttestation function', () => {
      const issueFn = ATTESTATION_STORE_ABI.find(
        (item) => 'name' in item && item.name === 'issueAttestation'
      );
      expect(issueFn).toBeDefined();
    });

    it('should include totalAttestations function', () => {
      const totalFn = ATTESTATION_STORE_ABI.find(
        (item) => 'name' in item && item.name === 'totalAttestations'
      );
      expect(totalFn).toBeDefined();
    });

    it('should include AttestationIssued event', () => {
      const event = ATTESTATION_STORE_ABI.find(
        (item) => 'name' in item && item.name === 'AttestationIssued' && item.type === 'event'
      );
      expect(event).toBeDefined();
    });

    it('should include AttestationRevoked event', () => {
      const event = ATTESTATION_STORE_ABI.find(
        (item) => 'name' in item && item.name === 'AttestationRevoked' && item.type === 'event'
      );
      expect(event).toBeDefined();
    });
  });

  describe('KumplyClient constructor', () => {
    it('should throw if contractAddress is not provided', () => {
      expect(() => new KumplyClient({ network: 'fuji' } as any)).toThrowError(
        'contractAddress is required'
      );
    });

    it('should create an instance with valid options', () => {
      const client = new KumplyClient({
        network: 'fuji',
        contractAddress: '0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76',
      });
      expect(client).toBeInstanceOf(KumplyClient);
    });

    it('should create an instance with mainnet network', () => {
      const client = new KumplyClient({
        network: 'mainnet',
        contractAddress: '0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76',
      });
      expect(client).toBeInstanceOf(KumplyClient);
    });

    it('should create an instance with custom RPC URL', () => {
      const client = new KumplyClient({
        network: 'fuji',
        contractAddress: '0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76',
        rpcUrl: 'https://custom-rpc.example.com',
      });
      expect(client).toBeInstanceOf(KumplyClient);
    });

    it('should expose listTiers as a method', async () => {
      const client = new KumplyClient({
        network: 'fuji',
        contractAddress: '0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76',
      });
      const tiers = await client.listTiers();
      expect(tiers).toHaveLength(5);
    });

    it('should expose network, chainId, contractAddress and publicClient', () => {
      const client = new KumplyClient({
        network: 'mainnet',
        contractAddress: DEPLOYMENTS.mainnet.attestationStore,
      });
      expect(client.network).toBe('mainnet');
      expect(client.chainId).toBe(43114);
      expect(client.contractAddress).toBe(DEPLOYMENTS.mainnet.attestationStore);
      expect(client.publicClient).toBeDefined();
    });

    it('should report fuji network and chainId', () => {
      const client = new KumplyClient({
        network: 'fuji',
        contractAddress: DEPLOYMENTS.fuji.attestationStore,
      });
      expect(client.network).toBe('fuji');
      expect(client.chainId).toBe(43113);
    });

    it('should expose hasTier as a method', () => {
      const client = new KumplyClient({
        network: 'fuji',
        contractAddress: DEPLOYMENTS.fuji.attestationStore,
      });
      expect(typeof client.hasTier).toBe('function');
    });
  });

  describe('TIER constants', () => {
    it('should map the five tiers to contract values', () => {
      expect(TIER.BASIC).toBe(1);
      expect(TIER.STANDARD).toBe(2);
      expect(TIER.ENHANCED).toBe(3);
      expect(TIER.KYB).toBe(4);
      expect(TIER.KYA).toBe(5);
    });
  });

  describe('DEPLOYMENTS', () => {
    it('should include mainnet and fuji deployments', () => {
      expect(DEPLOYMENTS.mainnet).toBeDefined();
      expect(DEPLOYMENTS.fuji).toBeDefined();
    });

    it('every address should be a checksummed 0x + 40 hex string', () => {
      const all = [
        DEPLOYMENTS.mainnet.attestationStore,
        DEPLOYMENTS.mainnet.complianceGate,
        DEPLOYMENTS.fuji.attestationStore,
        DEPLOYMENTS.fuji.complianceGate,
        DEPLOYMENTS.fuji.validatorSetManager,
      ];
      for (const addr of all) {
        expect(addr).toMatch(/^0x[0-9a-fA-F]{40}$/);
      }
    });

    it('mainnet and fuji stores should be distinct deployments', () => {
      expect(DEPLOYMENTS.mainnet.attestationStore).not.toBe(DEPLOYMENTS.fuji.attestationStore);
      expect(DEPLOYMENTS.mainnet.complianceGate).not.toBe(DEPLOYMENTS.fuji.complianceGate);
    });
  });
});

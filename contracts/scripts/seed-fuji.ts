import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// Seed a realistic demo dataset on Fuji so the public dashboard shows a full
// tier distribution and a populated attestations table. Testnet-only fixtures —
// subjects never sign, so any valid address works. NEVER run this on mainnet.
//
// 0xD650… stays at Tier 4 (KYB): kumply.xyz/demo depends on it passing the
// Tier 2/Tier 4 use cases and being rejected by the Tier 5 (KYA) one.
const DEMO_ATTESTATIONS = [
  { address: "0xD65042534CE80fcb641fd6Eb99a16eBF6C0cd076", tier: 4, label: "Demo KYB Business" },
  { address: "0x1F98431c8aD98523631AE4a59f267346ea31F984", tier: 2, label: "Standard KYC — retail trader" },
  { address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72", tier: 2, label: "Standard KYC — retail trader" },
  { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", tier: 2, label: "Standard KYC — DeFi user" },
  { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", tier: 3, label: "Enhanced KYC — high-value" },
  { address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", tier: 3, label: "Enhanced KYC — accredited" },
  { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", tier: 1, label: "Basic KYC — starter" },
  { address: "0xc00e94Cb662C3520282E6f5717214004A7f26888", tier: 1, label: "Basic KYC — starter" },
  { address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", tier: 4, label: "KYB — institutional fund" },
  { address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", tier: 5, label: "KYA — autonomous trading agent" },
];

async function main() {
  const storeAddress = process.env.CONTRACT_ATTESTATION_STORE;
  if (!storeAddress) throw new Error("CONTRACT_ATTESTATION_STORE not set in .env");

  const [deployer] = await ethers.getSigners();
  console.log("Seeding with account:", deployer.address);
  console.log("AttestationStore:", storeAddress);

  const store = await ethers.getContractAt("AttestationStore", storeAddress);

  const isVerifier = await (store as any).isVerifier(deployer.address);
  if (!isVerifier) {
    console.error("❌ Deployer is not a verifier. Run deploy.ts first.");
    process.exit(1);
  }

  const ONE_YEAR = 365 * 24 * 60 * 60;
  const block = await ethers.provider.getBlock("latest");
  const expiry = BigInt(block!.timestamp) + BigInt(ONE_YEAR);

  let issued = 0;
  for (const entry of DEMO_ATTESTATIONS) {
    const subject = ethers.getAddress(entry.address); // validate + checksum
    const existing = await (store as any).verify(subject);
    if (existing[0]) {
      console.log(`  ⏭️  ${entry.label} (${subject}) already attested at tier ${existing[1]}`);
      continue;
    }

    console.log(`  📋 Issuing Tier ${entry.tier} for ${entry.label}...`);
    const tx = await (store as any).issueAttestation(subject, entry.tier, expiry);
    await tx.wait();
    issued++;
    console.log(`  ✅ Done — tx: ${tx.hash}`);
  }

  console.log("\n═══════════════════════════════════════════");
  console.log("  KUMPLY Fuji Seed Complete");
  console.log(`  Newly issued: ${issued} / ${DEMO_ATTESTATIONS.length}`);
  console.log(`  Explorer: https://testnet.snowtrace.io/address/${storeAddress}`);
  console.log("═══════════════════════════════════════════");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

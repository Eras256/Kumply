import { ethers, network } from "hardhat";

/**
 * KUMPLY — Manually issue an attestation (verifier-only).
 *
 * Beta path for mainnet, where automated Sumsub issuance is disabled.
 * The signer must hold VERIFIER_ROLE on the target AttestationStore.
 *
 * Env:
 *   ISSUE_SUBJECT  — wallet to attest (defaults to the signer)
 *   ISSUE_TIER     — 1..5 (default 4 = KYB)
 *
 * Usage:
 *   ISSUE_TIER=4 npx hardhat run scripts/issue-attestation.ts --network avalanche
 */

const STORE: Record<string, string> = {
  avalanche: "0xa116261Ed3a848A9E1cd34923D5A0442D1455F71",
  fuji: "0xa3Bc5564A18e107807aF41fF2a5215Db050b22dD",
};

async function main() {
  const storeAddress = STORE[network.name];
  if (!storeAddress) throw new Error(`No AttestationStore configured for network "${network.name}"`);

  const [signer] = await ethers.getSigners();
  const subject = process.env.ISSUE_SUBJECT || signer.address;
  const tier = Number(process.env.ISSUE_TIER || "4");
  const ONE_YEAR = 365 * 24 * 60 * 60;
  const block = await ethers.provider.getBlock("latest");
  const expiry = BigInt(block!.timestamp) + BigInt(ONE_YEAR);

  const store = await ethers.getContractAt("AttestationStore", storeAddress);

  const isVerifier = await (store as any).isVerifier(signer.address);
  if (!isVerifier) throw new Error(`Signer ${signer.address} is not a verifier on ${storeAddress}`);

  const existing = await (store as any).verify(subject);
  if (existing[0]) {
    console.log(`⏭️  ${subject} already verified at tier ${existing[1]} — nothing to do.`);
    return;
  }

  console.log(`Issuing tier ${tier} attestation on ${network.name} for ${subject}...`);
  const tx = await (store as any).issueAttestation(subject, tier, expiry);
  console.log(`  tx: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`  ✅ confirmed in block ${receipt.blockNumber}`);

  const [ok, t, ts, exp] = await (store as any).verify(subject);
  console.log(`  verify() → verified=${ok}, tier=${t}, issuedAt=${ts}, expiry=${exp}`);
  const explorer = network.name === "avalanche" ? "https://snowtrace.io" : "https://testnet.snowtrace.io";
  console.log(`  Explorer: ${explorer}/tx/${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

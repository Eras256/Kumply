import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy AttestationStore
  // eERC token starts as address(0) — Phase 1 does not require encrypted proofs.
  // Once AvaCloud EncryptedERC is available (Phase 2), call:
  //   attestationStore.setEercToken(deployedEercAddress)
  const eercTokenAddress = "0x0000000000000000000000000000000000000000";

  console.log("\n1. Deploying AttestationStore...");
  const AttestationStoreFactory = await ethers.getContractFactory("AttestationStore");
  const attestationStore = await AttestationStoreFactory.deploy(deployer.address, eercTokenAddress);
  await attestationStore.waitForDeployment();
  const storeAddress = await attestationStore.getAddress();
  console.log("   AttestationStore deployed to:", storeAddress);

  // Deploy ComplianceGate with requiredTier = 2
  console.log("\n2. Deploying ComplianceGate (requiredTier: 2)...");
  const ComplianceGateFactory = await ethers.getContractFactory("ComplianceGate");
  const complianceGate = await ComplianceGateFactory.deploy(storeAddress, 2);
  await complianceGate.waitForDeployment();
  const gateAddress = await complianceGate.getAddress();
  console.log("   ComplianceGate deployed to:", gateAddress);

  // Add deployer as verifier for initial setup
  console.log("\n3. Adding deployer as verifier...");
  const tx = await attestationStore.addVerifier(deployer.address);
  await tx.wait();
  console.log("   Deployer added as verifier");

  console.log("\n═══════════════════════════════════════════");
  console.log("  KUMPLY Deployment Complete");
  console.log("═══════════════════════════════════════════");
  console.log("  AttestationStore:", storeAddress);
  console.log("  ComplianceGate: ", gateAddress);
  console.log("  Admin:          ", deployer.address);
  console.log("  Network:        ", (await ethers.provider.getNetwork()).chainId.toString());
  console.log("═══════════════════════════════════════════");
  const chainId = (await ethers.provider.getNetwork()).chainId;
  const suffix = chainId === 43114n ? "_MAINNET" : "";
  console.log("\nUpdate your .env with:");
  console.log(`  CONTRACT_ATTESTATION_STORE${suffix}=${storeAddress}`);
  console.log(`  CONTRACT_COMPLIANCE_GATE${suffix}=${gateAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

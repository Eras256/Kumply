#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
#  KUMPLY Compliance L1 — One-shot deployment script (Avalanche CLI)
#  ACP-77 + ACP-99 compliant. Targets Fuji testnet by default.
#
#  Prerequisites:
#    - Avalanche CLI installed:    curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh
#    - AvalancheGo node running:   ~/.avalanche-cli/node
#    - Funded Fuji wallet (faucet: https://core.app/tools/testnet-faucet/?subnet=c&token=c)
#    - jq installed for JSON parsing
# ─────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────
L1_NAME="kumply-l1"
NETWORK="${NETWORK:-fuji}"           # fuji | mainnet
GENESIS_FILE="$(dirname "$0")/../l1/genesis.json"
L1_CONFIG_FILE="$(dirname "$0")/../l1/l1-config.json"
SUBNET_CONFIG_FILE="$(dirname "$0")/../l1/subnet-config.json"
OUTPUT_DIR="$(dirname "$0")/../l1/.deployment"

mkdir -p "$OUTPUT_DIR"

echo "═══════════════════════════════════════════════════════════════"
echo "  KUMPLY Compliance L1 — Avalanche CLI Deployment"
echo "═══════════════════════════════════════════════════════════════"
echo "  L1 name:        $L1_NAME"
echo "  Network:        $NETWORK"
echo "  Genesis:        $GENESIS_FILE"
echo "  Output:         $OUTPUT_DIR"
echo "═══════════════════════════════════════════════════════════════"

# ── 1) Sanity checks ────────────────────────────────────────────────
command -v avalanche >/dev/null 2>&1 || { echo "❌ Avalanche CLI not found. Install: https://docs.avax.network/tooling/cli-guides/install-avalanche-cli"; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "❌ jq not found. Install: brew install jq (or apt install jq)"; exit 1; }

# ── 2) Create the L1 ────────────────────────────────────────────────
echo "🔧 Step 1/5 — Creating blockchain config…"
avalanche blockchain create "$L1_NAME" \
  --evm \
  --evm-defaults \
  --custom-vm-genesis "$GENESIS_FILE" \
  --proof-of-authority \
  --warp \
  --evm-token KMP \
  --evm-chain-id 43210 \
  --force || true

# ── 3) Deploy to network ────────────────────────────────────────────
echo "🚀 Step 2/5 — Deploying $L1_NAME to $NETWORK… (~3 hours bootstrap)"
avalanche blockchain deploy "$L1_NAME" --"$NETWORK" --output-tx-path "$OUTPUT_DIR/deploy-tx.json"

# ── 4) Extract identifiers ──────────────────────────────────────────
SUBNET_ID=$(avalanche blockchain describe "$L1_NAME" --network "$NETWORK" | jq -r '.subnetID' || echo "")
BLOCKCHAIN_ID=$(avalanche blockchain describe "$L1_NAME" --network "$NETWORK" | jq -r '.blockchainID' || echo "")
RPC_URL=$(avalanche blockchain describe "$L1_NAME" --network "$NETWORK" | jq -r '.rpcURL' || echo "")

cat > "$OUTPUT_DIR/deployment.json" <<EOF
{
  "name": "$L1_NAME",
  "network": "$NETWORK",
  "subnetID": "$SUBNET_ID",
  "blockchainID": "$BLOCKCHAIN_ID",
  "rpcURL": "$RPC_URL",
  "chainID": 43210,
  "symbol": "KMP",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

echo "✅ L1 deployed:"
echo "   SubnetID:       $SUBNET_ID"
echo "   BlockchainID:   $BLOCKCHAIN_ID"
echo "   RPC:            $RPC_URL"

# ── 5) Deploy KumplyValidatorSetManager on C-Chain ──────────────────
echo "🔐 Step 3/5 — Deploying KumplyValidatorSetManager to C-Chain…"
pnpm hardhat run scripts/deploy-validator-manager.ts --network "$NETWORK"

# ── 6) Bootstrap the validator set ──────────────────────────────────
echo "🌐 Step 4/5 — Awaiting institutional validators to call initializeValidatorRegistration()"
echo "   Each validator MUST hold a Tier-4 (KYB) attestation in AttestationStore."
echo "   Expected: Bankaool, Arkangeles, KUMPLY Protocol Treasury"

# ── 7) Save chain-config so AvalancheGo picks it up ─────────────────
NODE_CHAINS_DIR="${AVAGO_CHAINS_DIR:-$HOME/.avalanchego/configs/chains}"
mkdir -p "$NODE_CHAINS_DIR/$BLOCKCHAIN_ID"
cp "$SUBNET_CONFIG_FILE" "$NODE_CHAINS_DIR/$BLOCKCHAIN_ID/config.json"

echo "🎉 Step 5/5 — Deployment complete!"
echo "═══════════════════════════════════════════════════════════════"
echo "  Update .env with:"
echo "    KUMPLY_L1_SUBNET_ID=$SUBNET_ID"
echo "    KUMPLY_L1_BLOCKCHAIN_ID=$BLOCKCHAIN_ID"
echo "    KUMPLY_L1_RPC_URL=$RPC_URL"
echo "  Then update SDK:    packages/sdk/src/constants.ts → KUMPLY_L1_CONFIG"
echo "  Then update Web3Provider:    apps/web/src/providers/Web3Provider.tsx"
echo "═══════════════════════════════════════════════════════════════"

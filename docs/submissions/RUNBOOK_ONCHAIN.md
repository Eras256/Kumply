# On-chain Runbook — Tier-4 attestation + L1 deploy

> Operaciones que **tú** ejecutas en tu máquina. La IDE no tiene tu `.env`, ni Avalanche CLI, ni `jq`. Esta es la lista exacta de pasos para shipear antes del deadline de Retro9000 (2026-05-18 6PM UTC).

---

## 0. Preflight (5 min)

```bash
cd ~/Kumply
ls .env || cp .env.example .env   # crea .env si no existe
```

Edita `.env` y rellena (al mínimo):
```
DEPLOYER_PRIVATE_KEY=0x<tu private key — la wallet 0xD650…d076>
CONTRACT_ATTESTATION_STORE=0x<la address del AttestationStore que ya tienes desplegado>
FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
SNOWTRACE_API_KEY=verifyContract
```

Verifica balance:
```bash
cast balance 0xD65042534CE80fcb641fd6Eb99a16eBF6C0cd076 --rpc-url $FUJI_RPC_URL
# Debe mostrar ≥ 5000000000000000000 wei (5 AVAX) — ya lo tienes confirmado
```

---

## 1. Emitir Tier-4 KYB al deployer (30 s, ~0.01 AVAX)

```bash
cd ~/Kumply/contracts
npx hardhat run scripts/issue-tier4-deployer.ts --network fuji
```

**Output esperado:**
```
═══════════════════════════════════════════════════════════════
  Issuing Tier-4 (KYB) Attestation
═══════════════════════════════════════════════════════════════
  Signer:            0xD650...d076
  Subject:           0xD650...d076
  AttestationStore:  0x9Bbb...7d76

🚀 Issuing Tier 4 (Business/KYB), expiry +1y …
   tx: 0x<hash>
   ✅ confirmed in block <N>

  Result:
    verified: true
    tier:     4
    expiry:   2027-05-18T…
```

**Guarda el tx hash** — va en la submission de Retro9000.

**Verifica on-chain:**
- https://testnet.snowtrace.io/tx/<tx>
- https://testnet.snowtrace.io/address/0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76 → tab "Read Contract" → `verify(0xD650…d076)` → debe devolver `(true, 4, …, …)`

---

## 2. Instalar prerequisitos del L1 deploy (15-30 min)

Si estás en WSL2 / Linux nativo:

```bash
# Avalanche CLI
curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh -s
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc
avalanche --version   # debe imprimir vX.Y.Z

# jq
sudo apt install -y jq    # Ubuntu/Debian
# o: brew install jq      # macOS
jq --version

# Verifica que tienes las dependencias
command -v avalanche && command -v jq && echo "✓ ready"
```

Si estás en Windows nativo sin WSL: **instala WSL2 + Ubuntu primero** (`wsl --install -d Ubuntu` desde PowerShell admin, reboot, configura usuario).

---

## 3. C→P export — fondear el balance de P-Chain (5 min, ~0.001 AVAX fees)

Los validadores de L1 pagan fee continuo en P-Chain (~1.33 AVAX/mes/validador, ACP-77). Exporta 3 AVAX para tener buffer:

```bash
avalanche key list                # confirma que tu key está cargada
avalanche key transfer            # interactivo: from C-Chain → to P-Chain, amount 3
# o no-interactivo:
# avalanche key transfer --key <name> --fund-p-chain --amount 3 --network fuji
```

Verifica balance P-Chain:
```bash
avalanche key list -p   # debe mostrar 3 AVAX en P-Chain
```

---

## 4. Deploy KUMPLY Compliance L1 (~3 h, mayormente espera de bootstrap)

```bash
cd ~/Kumply
bash contracts/scripts/deploy-l1.sh
```

El script hace 5 cosas:
1. `avalanche blockchain create kumply-l1 ...` (1 min)
2. `avalanche blockchain deploy kumply-l1 --fuji` (~3 h — esto es el bootstrap del subnet, normal)
3. Extrae SubnetID + BlockchainID + RPC y los guarda en `contracts/l1/.deployment/deployment.json`
4. `pnpm hardhat run scripts/deploy-validator-manager.ts --network fuji` — despliega el KumplyValidatorSetManager con el SubnetID real
5. Copia el `subnet-config.json` a `~/.avalanchego/configs/chains/<BlockchainID>/config.json`

**Output final:**
```
🎉 Step 5/5 — Deployment complete!
═══════════════════════════════════════════════════════════════
  Update .env with:
    KUMPLY_L1_SUBNET_ID=2<…>
    KUMPLY_L1_BLOCKCHAIN_ID=2<…>
    KUMPLY_L1_RPC_URL=https://<…>/ext/bc/<…>/rpc
```

**Pega esos 3 valores en `.env`** y también el address del manager (sale en el step 4).

`deploy-validator-manager.ts` además **parcha automáticamente** `contracts/l1/l1-config.json` con el manager address — verifica:
```bash
grep validatorSetManager contracts/l1/l1-config.json
```

---

## 5. Bootstrap del validator set (manual, opcional para submission)

Una vez la L1 está corriendo, los validadores institucionales (tú primero, luego Bankaool/Arkangeles) llaman:

```ts
manager.initiateValidatorRegistration(
  nodeID20bytes,        // tu node ID del AvalancheGo
  blsPublicKey48bytes,  // BLS PoP del nodo
  remainingBalanceOwner, // PChainOwner: { threshold: 1, addresses: [tu addr] }
  disableOwner,          // PChainOwner: { threshold: 1, addresses: [tu addr] }
  weight                 // p.ej. 100
)
// → emite RegisterL1ValidatorMessage vía Warp
// → esperar ~30 s — P-Chain procesa RegisterL1ValidatorTx
// → manager.completeValidatorRegistration(messageIndex)
```

Para la submission de Retro9000 **no hace falta** tener validators registrados — basta con tener la L1 desplegada y el manager contract live. Los validators los onboardas en Q3 2026.

---

## 6. Última verificación pre-submission

```bash
# Test suite verde
cd ~/Kumply && pnpm test
# expected: "157 passing"

# Snowtrace verifications
echo "AttestationStore:  https://testnet.snowtrace.io/address/$CONTRACT_ATTESTATION_STORE"
echo "ComplianceGate:    https://testnet.snowtrace.io/address/$CONTRACT_COMPLIANCE_GATE"
echo "ValidatorManager:  https://testnet.snowtrace.io/address/$CONTRACT_VALIDATOR_SET_MANAGER"
echo "L1 SubnetID:       https://subnets-test.avax.network/subnets/$KUMPLY_L1_SUBNET_ID"

# Live demo
curl -sI https://kumply.io | head -1            # 200 OK
curl -sI https://kumply.io/verify | head -1     # 200 OK
curl -sI https://kumply.io/dashboard | head -1  # 200 OK

# Repo público + último commit visible
git push origin main   # idempotente, ya pusheado
```

---

## 7. Llenar y enviar las submissions

Antes del **2026-05-18 6PM UTC**:

1. Abre `docs/submissions/retro9000.md` — reemplaza todos los `[FILL …]` con las addresses/hashes/SubnetID reales.
2. Abre `docs/submissions/team1.md` — mismo proceso.
3. Sube a sus portales:
   - Retro9000: https://retro9000.avax.network/ → connect wallet `0xD650…d076` → submit
   - Team1: https://grants.team1.network/ → fill form
4. Pin un tweet en `@kumply_xyz` con el link a la submission + screenshot del repo verde.

---

## Troubleshooting rápido

| Síntoma | Causa probable | Fix |
|---|---|---|
| `Error: insufficient funds for gas` | C-Chain balance < tx cost | Refill desde faucet https://core.app/tools/testnet-faucet/?subnet=c&token=c |
| `Error: VERIFIER_ROLE missing` en issueAttestation | Deployer no tiene el rol | Necesitas `addVerifier(0xD650…d076)` desde el admin antes. Es lo mismo que el deployer en tu caso (deployer === admin per `deploy.ts`) — debería pasar |
| `avalanche: command not found` | CLI no en PATH | `export PATH="$HOME/bin:$PATH"` y reintenta |
| `getVerifiedWarpMessage returns valid=false` | P-Chain aún no ack-eó | Espera 30-60 s y reintenta `completeValidatorRegistration` |
| Bootstrap del L1 atascado >4 h | Validador local desincronizado | `avalanche node logs kumply-l1` y revisa errores comunes en https://build.avax.network/docs/nodes/run-a-node/common-errors |

---

## ⚠️ Acciones que NO debes hacer hasta tener opinión legal

- ❌ `npm run deploy:avalanche` (mainnet) — solo Fuji por ahora
- ❌ Listar KMP en cualquier DEX
- ❌ Aceptar pagos en MXN/USD por KMP
- ❌ Vender KMP de tu wallet personal a terceros
- ❌ Prometer rendimientos en KMP a validadores
- ❌ Hacer airdrops públicos de KMP

Todo eso rompe el positioning software-only que protege contra ITF/IFPE/Actividad Vulnerable. Ver `LEGAL_REVIEW_BRIEF.md` (gitignored, local).

@claude_estrategico.md

# KUMPLY — Instrucciones Técnicas para AI

> Última actualización: 17 Mayo 2026 — 134 tests passing (87 contracts + 30 SDK + 17 API). KUMPLY Compliance L1 (Deploy-Ready) agregado: `KumplyValidatorSetManager.sol` + génesis + scripts Avalanche CLI. Ver [`L1.md`](./L1.md).

---

## 1. Monorepo — Estructura

```
kumply/                          # Root (pnpm workspaces)
├── contracts/                   # @kumply/contracts — Solidity 0.8.28 + Hardhat
│   ├── contracts/
│   │   ├── AttestationStore.sol            # Core: KYC attestations (5 tiers, Pausable, AccessControl)
│   │   ├── ComplianceGate.sol              # Gatekeeper: enforce min tier for on-chain actions
│   │   └── KumplyValidatorSetManager.sol   # ACP-99 ValidatorSetManager with KYB gating (L1)
│   ├── l1/                                  # KUMPLY Compliance L1 (Deploy-Ready)
│   │   ├── genesis.json                     # Subnet-EVM genesis (chainId 43210, KMP gas)
│   │   ├── l1-config.json                   # ACP-77 L1 config + compliance hooks
│   │   ├── subnet-config.json               # Per-chain AvalancheGo runtime config
│   │   └── README.md                        # L1 deployment overview
│   ├── scripts/
│   │   ├── deploy.ts                        # Deploy AttestationStore + ComplianceGate to Fuji
│   │   ├── deploy-l1.sh                     # Avalanche CLI script (one-shot L1 deploy)
│   │   ├── deploy-validator-manager.ts      # Hardhat: deploy KumplyValidatorSetManager
│   │   ├── seed-fuji.ts                     # Seed demo attestations for hackathon
│   │   └── verify-contracts.ts              # Verify on Snowtrace/Routescan
│   └── test/
│       ├── AttestationStore.test.ts         # 40 Hardhat tests
│       ├── ComplianceGate.test.ts           # ComplianceGate tests
│       └── KumplyValidatorSetManager.test.ts # 27 tests (L1 validator set + KYB gate)
├── packages/
│   └── sdk/                     # @kumply/sdk — TypeScript SDK (viem-based)
│       ├── src/
│       │   ├── index.ts          # Barrel exports
│       │   ├── client.ts         # KumplyClient (verify, isVerified, getTotalAttestations)
│       │   ├── contracts.ts      # ATTESTATION_STORE_ABI, COMPLIANCE_GATE_ABI
│       │   ├── config.ts         # Network configs (fuji, mainnet)
│       │   └── types.ts          # KumplyClientOptions, TierInfo, etc.
│       └── test/
│           └── index.test.ts     # 30 vitest tests
├── apps/
│   ├── api/                     # @kumply/api — Express + TypeScript (Railway)
│   │   ├── src/index.ts          # API server (exports `app` for testing)
│   │   ├── test/index.test.ts    # 15 vitest+supertest tests
│   │   ├── openapi.yaml          # OpenAPI 3.0 spec
│   │   └── vitest.config.ts
│   └── web/                     # web — Next.js 16 + React 19 (Vercel)
│       ├── src/app/
│       │   ├── [locale]/         # i18n pages (next-intl)
│       │   │   ├── page.tsx        # Home
│       │   │   ├── verify/         # KYC flow (Sumsub WebSDK)
│       │   │   ├── demo/           # Live demo (ComplianceGate check)
│       │   │   ├── dashboard/      # On-chain attestation explorer
│       │   │   ├── network/        # Fuji network status + contracts
│       │   │   ├── l1/             # KUMPLY Compliance L1 page (Deploy-Ready)
│       │   │   ├── tiers/          # Tier descriptions
│       │   │   ├── developers/     # SDK docs
│       │   │   ├── solutions/      # Use cases
│       │   │   └── legal/          # Privacy policy, terms
│       │   └── api/
│       │       ├── token/route.ts   # POST — Sumsub access token proxy
│       │       └── webhook/route.ts # POST — Sumsub webhook → on-chain attestation
│       ├── src/providers/Web3Provider.tsx  # Wagmi + avalancheFuji
│       ├── src/i18n/              # next-intl routing
│       ├── messages/en.json       # English strings
│       ├── messages/es.json       # Spanish strings
│       └── public/
│           ├── favicon.png        # 466KB PNG favicon
│           └── og-image.png       # 336KB OG image
├── CLAUDE.md                    # ← ESTE ARCHIVO
├── claude_estrategico.md        # Contexto estratégico + links Avalanche
├── .env                         # Root env (API + Hardhat read from here)
├── .env.example                 # Template con instrucciones
├── vercel.json                  # Vercel deployment + security headers
└── .github/workflows/ci.yml    # CI: 4 jobs (contracts, sdk, api, web)
```

---

## 2. Variables de Entorno — Cómo se cargan

| Componente | Archivo que lee | Método |
|------------|----------------|--------|
| **Hardhat** (`contracts/`) | `../.env` (root) | `dotenv.config({ path: '../.env' })` |
| **Express API** (`apps/api/`) | `../../.env` (root) | `dotenv.config({ path: '../../.env' })` |
| **Next.js** (`apps/web/`) | `apps/web/.env.local` | Automático por Next.js |
| **CI/CD** | Inline en `ci.yml` | `env:` block en workflow |
| **Vercel** | Vercel Dashboard | `@variable_name` secrets |

### Variables críticas

```bash
# ── Blockchain ──
FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
DEPLOYER_PRIVATE_KEY=0x...           # ⚠ NUNCA commitear — admin + verifier del contrato
CONTRACT_ATTESTATION_STORE=0x...     # Actualizar tras pnpm deploy:fuji
CONTRACT_COMPLIANCE_GATE=0x...       # Actualizar tras pnpm deploy:fuji

# ── Sumsub ──
SUMSUB_APP_TOKEN=                    # https://cockpit.sumsub.com → App Tokens
SUMSUB_SECRET_KEY=                   # Para firmar requests
SUMSUB_WEBHOOK_SECRET=               # Para verificar webhooks entrantes
SUMSUB_BASE_URL=https://api.sumsub.com

# ── API ──
API_KEY=kumply-fuji-testnet-2026     # Protege /api/token
SNOWTRACE_API_KEY=verifyContract     # Para verificar contratos en Snowtrace
```

---

## 3. Smart Contracts

### AttestationStore.sol
- **Roles:** `DEFAULT_ADMIN_ROLE` (deploy), `VERIFIER_ROLE` (addVerifier/removeVerifier)
- **Funciones clave:**
  - `issueAttestation(address, uint32 tier, uint64 expiry)` — solo VERIFIER, no cuando pausado
  - `revoke(address)` — solo VERIFIER
  - `verify(address)` → `(bool, uint32, uint64, uint64)` — lectura pública gratuita, funciona pausado
  - `checkCompliance(address)` payable → `(bool, uint32)` — API de pago para DApps ("Verify Once" $0.50); fee solo se cobra si el usuario está verificado y el caller no es suscriptor
  - `setVerificationFee(uint256 wei)` — solo ADMIN; fija el read fee (0 = gratis)
  - `setSubscription(address, bool)` — solo ADMIN; exime a un ComplianceGate de L1 del fee (SaaS)
  - `withdrawFees()` — solo ADMIN; retira AVAX acumulado al treasury
  - `setEercToken(address)` — solo ADMIN, Phase 2 (eERC encrypted proofs)
  - `pause()` / `unpause()` — solo ADMIN
- **State:** `verificationFee` (wei), `totalFeesCollected` (wei acumulado), `subscribedCallers` (mapping)
- **Events:** `AttestationIssued`, `AttestationRevoked`, `VerifierAdded`, `VerifierRemoved`, `ContractPaused`, `ContractUnpaused`, `EercTokenUpdated`, `ComplianceChecked`, `VerificationFeeUpdated`, `SubscriptionUpdated`, `FeesWithdrawn`
- **Tiers:** 1=Basic, 2=Standard, 3=Enhanced, 4=Business/KYB, 5=Agent/KYA

### ComplianceGate.sol
- Constructor: `(address attestationStore, uint32 requiredTier)`
- `protectedAction()` payable — requiere tier >= requiredTier; si fee > 0 y gate no suscrito, caller envía fee en msg.value (se reenvía a checkCompliance). Si suscrito, usa verify() gratis.
- `updateRequiredTier(uint32)` — solo ADMIN
- `getVerificationFee()` view — devuelve el fee actual del AttestationStore (para frontends)
- **Dos modos de billing:** pay-per-use (fee por llamada) vs SaaS subscription (exento, facturación off-chain mensual)

### Deploy
```bash
pnpm deploy:fuji          # Deploy contracts
pnpm seed:fuji            # Seed demo attestations
npx hardhat run scripts/verify-contracts.ts --network fuji  # Verify on Snowtrace/Routescan
```

---

## 4. Sumsub Integration

### Arquitectura del flujo KYC
```
Usuario → /verify → Connect Wallet → Launch Sumsub WebSDK
                                           ↓
                                    Sumsub procesa KYC
                                           ↓
                         Sumsub webhook → POST /api/webhook
                                           ↓
                              Verify HMAC-SHA256 signature
                                           ↓
                         isVerified(address) — check on-chain
                                           ↓ (if not verified)
                    issueAttestation(address, tier, expiry) — on-chain tx
                                           ↓
                    Frontend polls verify(address) → shows "Done"
```

### Levels de Sumsub (crear en Dashboard)
| Level Name | Tier | Tipo |
|-----------|------|------|
| `basic-kyc` | 1 | KYC persona básico |
| `standard-kyc` | 2 | KYC persona estándar |
| `enhanced-kyc` | 3 | KYC persona completo |
| `business-kyb` | 4 | KYB empresa |
| `agent-kya` | 5 | KYA agente IA |

### Dos implementaciones de webhook (elegir UNA)
1. **Next.js API route** (`apps/web/src/app/api/webhook/route.ts`) — para Vercel
   - Sin Set en memoria (serverless = stateless)
   - Idempotencia garantizada on-chain via `isVerified()`
2. **Express standalone** (`apps/api/src/index.ts`) — para Railway
   - Set en memoria como guard secundario + on-chain check

---

## 5. Frontend (Next.js 16)

### i18n
- **Framework:** `next-intl` v4 con `[locale]` App Router convention
- **Locales:** `en`, `es`
- **Messages:** `apps/web/messages/{en,es}.json`
- **Routing:** `src/i18n/routing.ts` → `createNavigation()`
- **Import Link:** Siempre `import { Link } from "@/i18n/routing"` (NUNCA `next/link`)

### Wagmi / Web3
- Config en `src/providers/Web3Provider.tsx`
- Solo `avalancheFuji` chain
- Connectors: `injected({ target: "metaMask" })` + `injected()`

### Páginas (9 total)
| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | RSC | Landing page institucional |
| `/verify` | Client | Flujo KYC con Sumsub WebSDK |
| `/demo` | Client | Demo interactivo de ComplianceGate |
| `/dashboard` | Client | Explorer de attestaciones on-chain |
| `/network` | RSC | Estado de red Fuji + contratos |
| `/tiers` | RSC | Descripción de los 5 tiers |
| `/developers` | RSC | Documentación del SDK |
| `/solutions` | RSC | Casos de uso |
| `/legal` | RSC | Privacy policy + terms |

---

## 6. Testing

```bash
pnpm test                          # Corre TODO (105 tests)
pnpm --filter @kumply/contracts test  # 60 tests (Hardhat + Chai)
pnpm --filter @kumply/sdk test        # 30 tests (Vitest)
pnpm --filter @kumply/api test        # 15 tests (Vitest + Supertest)
```

### Cobertura
- **Contracts (60):** deploy, roles, issueAttestation, revoke, verify, pausable, tiers, edge cases, setEercToken, checkCompliance, verificationFee, setSubscription, withdrawFees, fee integration en ComplianceGate
- **SDK (30):** exports, config, tiers, ABI entries, constructor validation, network configs
- **API (17):** health check, auth (API key), validation (Zod), webhook HMAC, attestation lookup, fee endpoint

---

## 7. CI/CD

### GitHub Actions (`.github/workflows/ci.yml`)
- **Trigger:** push to `main`/`develop`, PR to `main`
- **Jobs:** contracts → sdk → api (needs sdk) → web (needs sdk)
- Uses pnpm v10, Node.js v20

### Vercel (`vercel.json`)
- Framework: Next.js
- Build: `cd apps/web && pnpm build`
- Security headers: HSTS, X-Frame-Options DENY, nosniff, XSS protection
- Rewrite: `/api/v1/:path*` → Railway API (if active)
- Env: uses `@variable_name` secrets from Vercel Dashboard

---

## 8. Convenciones de Código

- **Solidity:** Natspec en todas las funciones públicas. Custom errors (no `require` strings). Events en toda mutación de estado.
- **TypeScript:** Strict mode. Zod para validación de input en API.
- **Logging:** JSON estructurado: `{ ts, level, event, ...data }`. Niveles: `INFO`, `WARN`, `ERROR`, `AUDIT`.
- **Seguridad:** HMAC-SHA256 en todos los webhooks (sin bypass por environment). Rate limiting en todos los endpoints. Helmet + CORS.
- **SDK:** Barrel exports desde `index.ts`. `contractAddress` es required (type + runtime check).

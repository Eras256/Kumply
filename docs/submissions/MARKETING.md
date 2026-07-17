# Marketing assets — submissions support

> Drafts para tweets pinneados, script del demo video, y posts en LinkedIn.
> Todos los links apuntan a `kumply.xyz`, repo `kumplyprotocol/Kumply`, addresses on-chain reales.

---

## 1. Demo video — script (60-90 s)

**Setup:** screen recording de https://kumply.xyz, una wallet MetaMask con la deployer key, dual monitor con Snowtrace en la segunda pantalla. Voice-over en español neutro o inglés según audiencia.

### Storyboard

| Tiempo | Pantalla | Voice-over |
|---|---|---|
| **0:00 – 0:08** | Landing page `kumply.xyz`, fade-in del logo, scroll lento por el hero | "KUMPLY es la primera infraestructura de compliance institucional sobre Avalanche. KYC, KYB y KYA — Know Your Agent — en una sola primitiva on-chain." |
| **0:08 – 0:18** | Click en "Verify" → connect wallet → MetaMask popup approval | "Cualquier usuario, enterprise o agente autónomo conecta su wallet, lanza el flujo KYC vía Sumsub —" |
| **0:18 – 0:32** | Sumsub WebSDK abre (skip al estado "Approved") → webhook dispara → loading "Issuing attestation" → tx confirmation | "— y al aprobar, nuestro webhook dispara `issueAttestation` on-chain. La atestación queda escrita en C-Chain Fuji, verificable públicamente." |
| **0:32 – 0:42** | Cambio a Snowtrace → muestro la tx hash → Read Contract → `verify(address)` returns `(true, 4, expiry, …)` | "Aquí: tier 4, KYB. La misma atestación es leída por cualquier DApp en Avalanche en una sola llamada." |
| **0:42 – 0:55** | Cambio a `kumply.xyz/demo` → demo del ComplianceGate → click "Protected action" → success | "Tres líneas de Solidity en un ComplianceGate. Cualquier DApp gatea acciones por tier requerido — sin re-hacer KYC por protocolo, sin walled gardens." |
| **0:55 – 1:10** | Cambio a `kumply.xyz/l1` → muestro SubnetID + BlockchainID + Snowtrace del ValidatorSetManager | "Y ya está LIVE en Fuji: nuestra Compliance L1 propia, con validadores KYB únicamente, gobernada por nuestro KumplyValidatorSetManager — ACP-99 compliant, 110 tests verde." |
| **1:10 – 1:25** | Frase final + logo + CTAs (kumply.xyz · GitHub · @kumply_xyz) | "Software-only, no custodial, listo para que cualquier banco digital o VC LatAm opere en cadena sin perder regulación. Buscamos partners en Retro9000, Team1 y Blizzard." |

### Tips de producción

- **Loom o ScreenStudio** (recomendado por la animación de zooms/clicks automática).
- Resolución 1920×1080, 60fps, MP4 H.264, audio AAC 128kbps.
- Subtítulos burned-in en EN y ES (o exportar VTT separados).
- Loop final con QR code a `kumply.xyz` por 3 segundos.
- Subir a YouTube como **unlisted** + Twitter native upload.

---

## 2. Tweets pinneados — `@kumply_xyz`

### Tweet pinneado principal (versión EN)

> 🇺🇸 **EN — pin this**

```
KUMPLY is live on @AvalancheFuji.

The first KYB-gated Avalanche L1 — every validator is a verified
institution. KYC, KYB & KYA (Know Your Agent) attestations on-chain,
ACP-99 compliant, 110 tests passing.

Submitting to Retro9000 R3 today.

🔗 https://kumply.xyz
📄 LITEPAPER → github.com/kumplyprotocol/Kumply
🧪 Snowtrace: testnet.snowtrace.io/address/0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76

🧵 ↓
```

**Hilo de 5 tweets ↓**

```
1/ KUMPLY is institutional compliance infrastructure for Avalanche.

A bank cannot interact with an EVM address without knowing who controls it.
A enterprise cannot route stablecoin payments without confirming KYC.
A tokenization platform cannot list to qualified investors without verification.

We fix this on-chain.

2/ Two layers:

Layer 1 — AttestationStore on C-Chain (LIVE).
5 tiers: Basic KYC → Standard → Enhanced → KYB → KYA.
DApps gate actions with 3 lines of Solidity via @KumplyComplianceGate.

Layer 2 — KUMPLY Compliance L1 (chain registered on Fuji, validator activation pending).
Validators must hold Tier-4 (KYB). Open to all 5 tiers as users.

3/ ACP-99 compliant from day one.

KumplyValidatorSetManager.sol implements the full two-phase Warp lifecycle —
initiate → P-Chain ack → complete. Avalanche codec round-trip verified
in the test harness (bit-exact RegisterL1ValidatorMessage et al).

First open-source ACP-99 impl outside the Ava Labs reference.

4/ KYA — Know Your Agent (Tier 5) is the differentiator.

Autonomous AI agents present a verification problem KYC can't solve.
KUMPLY captures: model fingerprint · owner attestation (KYB) ·
behavior bounds · provenance · liveness oracle.

No other Avalanche L1 — and to our knowledge no other EVM L1 — has this.

5/ Software-only B2B. No custody. No fiat. No DEX listing for KMP.

Designed to stay outside enterprise / IFPE / Actividad Vulnerable classifications
under Mexican Enterprise Law.

Target pipeline: Mexican digital banks · venture funds · LatAm enterprises.

Built solo at the @avalabs LatAm Institutional Hackathon · MIT licensed.
```

### Tweet pinneado (versión ES)

```
🇲🇽 KUMPLY está LIVE en @AvalancheFuji.

La primera L1 de Avalanche con gate KYB — cada validador es una
institución verificada. Atestaciones on-chain KYC, KYB y KYA (Know Your
Agent), ACP-99 compliant, 110 tests pasando.

Aplicando a Retro9000 R3 hoy.

🔗 https://kumply.xyz
📄 Litepaper → github.com/kumplyprotocol/Kumply

🧵 ↓
```

### Quote-tweet candidates

- @avalancheavax announcements de Retro9000 → repostea con "Submitting KUMPLY today — the first ACP-99 KYB-gated L1 on @AvalancheFuji"
- @team1network anuncios → "KUMPLY applying to the Identity track — solving counterparty resolution for LatAm institutions"
- Cualquier publicación de bancos digitales o VCs LatAm sobre Web3 → "This is exactly what KUMPLY is built for. DM us"

---

## 3. LinkedIn post — versión larga (español, audiencia institucional LatAm)

```
🚀 Hoy lanzamos KUMPLY en Avalanche Fuji.

KUMPLY es la primera infraestructura de compliance institucional sobre
Avalanche: atestaciones KYC, KYB y KYA (Know Your Agent) on-chain, más una
L1 dedicada donde cada validador es una institución verificada.

¿Por qué importa? Porque bancos digitales, fondos y decenas de enterprises LatAm
quieren operar en cadena pero no pueden mientras no exista una primitiva
de "saber quién es la contraparte" que sea técnicamente componible y
regulatoriamente defendible.

Lo que entregamos en este hackathon:
✅ 3 smart contracts en C-Chain Fuji, verificados
✅ 1 Avalanche L1 propia registrada en P-Chain (Subnet-EVM, chainId 43210)
✅ KumplyValidatorSetManager ACP-99 compliant — primera implementación
    open-source fuera de la referencia de Ava Labs
✅ 157 tests verde, CI en cada push
✅ Modelo software-only: sin custodia, sin intercambio fiat↔crypto, fuera
    del perímetro regulated financial frameworks bajo Ley Enterprise mexicana

Y el diferenciador que nadie más en el ecosistema Avalanche tiene: KYA —
Know Your Agent. Tier 5 para agentes IA autónomos. Cuando el agentic DeFi
sea 15-30% del volumen DeFi en 2027, KUMPLY es el registry donde cada
agente regulado debe atestar.

Aplicando ahora a:
• Avalanche Retro9000 Round 3
• Team1 Mini-Grants (categoría Identity)
• Blizzard Fund (seed)

Solo founder, full-stack, código MIT. Buscando:
• Integraciones con DApps de Avalanche que quieran usuarios institucionales
• Conversaciones con bancos / enterprises LatAm interesados en validar
• Despacho de enterprise mexicano (Galicia / Mijares / Creel) para opinión
    pre-mainnet

→ Repo: github.com/kumplyprotocol/Kumply
→ Sitio: kumply.xyz
→ Litepaper: github.com/kumplyprotocol/Kumply/blob/main/LITEPAPER.md

#Avalanche #Web3 #Compliance #LatAm #Enterprise #KYC #ACP99 #InstitutionalDeFi
```

---

## 4. Discord / Telegram announcement (corto)

```
📢 KUMPLY just shipped to Avalanche Fuji.

The first KYB-gated L1 on Avalanche + KYC/KYB/KYA on-chain attestations.

ACP-99 compliant. 157 tests. Software-only. Open source MIT.

Submitting Retro9000 R3 today.

→ kumply.xyz
→ github.com/kumplyprotocol/Kumply
```

---

## 5. Cold email — institutional outreach (bancos / fondos / enterprises)

**Subject:** KUMPLY — KYC y KYB on-chain en Avalanche, listo para piloto

```
Hola [Nombre],

Soy [tu nombre], founder de KUMPLY. Acabamos de lanzar en Avalanche Fuji
la primera infraestructura de compliance institucional con atestaciones
KYC, KYB y KYA on-chain — más una L1 dedicada donde cada validador es
una institución verificada.

¿Por qué te escribo? Porque sé que [empresa] ha explorado Web3 pero
choca con el mismo blocker que todos: no hay forma técnica defensible
de saber quién está al otro lado de un wallet, sin perder componibilidad
con el resto de DeFi.

KUMPLY resuelve esto sin pedirle a [empresa] que se vuelva exchange ni
que custodie crypto. Modelo software-only — facturación SaaS en MXN, sin
intermediación de activos virtuales, fuera del perímetro regulated financial frameworks.

¿Puedo mandarte el litepaper (3 minutos de lectura) y agendar 20 min la
próxima semana para mostrarte el demo? Si después prefieres pasar, no
gastamos más tiempo.

Saludos,
[tu nombre]
hello@kumply.xyz
kumply.xyz · github.com/kumplyprotocol/Kumply
```

---

## 6. Calendly / meeting link template (cuando lo configures)

- **Meeting type:** "KUMPLY — 20 min institutional demo"
- **Description:** Live walkthrough del attestation flow + Compliance L1
  + Q&A. Sin commitment, sin venta dura. Si después de los 20 min crees
  que aplica para tu equipo, agendamos un follow-up técnico.
- **Required fields:** Nombre, empresa, cargo, casos de uso de interés.

---

## Checklist final pre-tweets

- [ ] Crear cuenta `@kumply_xyz` en X/Twitter (si aún no existe)
- [ ] Avatar = KUMPLY logo cuadrado
- [ ] Banner = mockup de la `/dashboard` con tier badges
- [ ] Bio: "Institutional compliance infra for @AvalancheFuji · KYC · KYB · KYA · MIT"
- [ ] Pin el tweet principal
- [ ] Hilo de 5 tweets debajo
- [ ] Quote-tweet a @avalancheavax cuando vean tu submission
- [ ] Repost en español + LinkedIn al mismo tiempo

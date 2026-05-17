# KUMPLY — Architecture Diagrams

Mermaid diagrams render natively on GitHub. Each can also be exported as PNG/SVG
via the Mermaid Live Editor: https://mermaid.live

---

## 1. End-to-end attestation flow (C-Chain + L1)

```mermaid
flowchart TB
    subgraph User["👤 User / DApp / Agent"]
        U[EVM Wallet]
    end

    subgraph OffChain["☁️  Off-chain"]
        SUMSUB[Sumsub WebSDK<br/>KYC / KYB / KYA]
        WEBHOOK[KUMPLY Webhook API<br/>HMAC-SHA256 verified]
    end

    subgraph CChain["🔗 Avalanche C-Chain"]
        AS[AttestationStore.sol<br/>5 tiers · pausable · pay-to-read]
        CG[ComplianceGate.sol<br/>SaaS sub OR pay-per-use]
        VSM[KumplyValidatorSetManager.sol<br/>ACP-99 · KYB gate]
    end

    subgraph PChain["⚙️  Avalanche P-Chain"]
        PC[ConvertSubnetToL1Tx<br/>RegisterL1ValidatorTx<br/>ACP-77 continuous fees]
    end

    subgraph L1["🏛  KUMPLY Compliance L1"]
        L1V[Validators<br/>Tier-4 KYB only]
        L1D[Deployers<br/>Tier-4 KYB only]
        L1T[Transactors<br/>any tier 0-5]
        ASL1[AttestationStoreL1<br/>ICM-mirrored · Q3 2026]
        AR[AgentRegistry<br/>KYA Tier-5 · Q3 2026]
    end

    U -->|launch KYC flow| SUMSUB
    SUMSUB -->|webhook| WEBHOOK
    WEBHOOK -->|issueAttestation| AS
    U -->|verify counterparty| CG
    CG -->|verify| AS
    VSM -->|verify msg.sender| AS
    VSM -->|sendWarpMessage| PC
    PC -->|L1ValidatorRegistrationMessage| VSM
    PC ===|secures| L1V
    AS -.->|ICM mirror| ASL1
    ASL1 --> AR
    L1V -.- L1D -.- L1T

    style AS fill:#1a472a,stroke:#22c55e,color:#fff
    style VSM fill:#1a472a,stroke:#22c55e,color:#fff
    style CG fill:#1a472a,stroke:#22c55e,color:#fff
    style ASL1 fill:#374151,stroke:#9ca3af,color:#fff,stroke-dasharray: 5 5
    style AR fill:#374151,stroke:#9ca3af,color:#fff,stroke-dasharray: 5 5
```

---

## 2. ACP-99 two-phase validator lifecycle

```mermaid
sequenceDiagram
    participant V as Validator (Tier-4 EOA)
    participant M as KumplyValidatorSetManager
    participant AS as AttestationStore
    participant W as WarpMessenger (0x05)
    participant P as P-Chain

    Note over V,P: Phase 1 — Initiate
    V->>M: initiateValidatorRegistration(nodeID, blsKey,<br/>remainingBalanceOwner, disableOwner, weight)
    M->>AS: verify(msg.sender)
    AS-->>M: (ok=true, tier=4, expiry)
    M->>M: state: PendingAdded
    M->>W: sendWarpMessage(RegisterL1ValidatorMessage)
    W-->>M: messageID
    M-->>V: validationID
    Note over W,P: ~30s — P-Chain processes RegisterL1ValidatorTx

    Note over V,P: Phase 2 — Complete (within 23h)
    V->>M: completeValidatorRegistration(messageIndex)
    M->>W: getVerifiedWarpMessage(messageIndex)
    W-->>M: L1ValidatorRegistrationMessage{registered: true}
    M->>M: state: Active · activeValidatorCount++
    M-->>V: success

    Note over V,M: Self-healing — KYB expiry
    Note over V,AS: ⏰ Attestation expires
    V->>AS: (no action)
    Note over M: anyone can call disableExpiredValidator
    V->>M: disableExpiredValidator(validationID)
    M->>AS: verify(owner)
    AS-->>M: (ok=false)
    M->>W: sendWarpMessage(L1ValidatorWeightMessage{weight: 0})
    M->>M: state: PendingRemoved
```

---

## 3. 5-tier compliance spectrum

```mermaid
flowchart LR
    T1[Tier 1<br/>Basic KYC<br/>Retail onboarding]
    T2[Tier 2<br/>Standard KYC<br/>P2P, stablecoin pay]
    T3[Tier 3<br/>Enhanced KYC<br/>Lending, RWAs]
    T4[Tier 4<br/>KYB · Business<br/>Institutional accounts<br/>Validators · Deployers]
    T5[Tier 5<br/>🤖 KYA · Agent<br/>Autonomous AI bots<br/>UNIQUE to KUMPLY]

    T1 --> T2 --> T3 --> T4
    T4 -.->|owner attests<br/>responsibility for| T5

    style T5 fill:#dc2626,stroke:#fca5a5,color:#fff
    style T4 fill:#1a472a,stroke:#22c55e,color:#fff
```

---

## 4. KYA — Know Your Agent (Tier 5)

```mermaid
flowchart TB
    OWNER[👔 Tier-4 KYB Owner<br/>Bankaool / Hedge Fund / VC]
    AGENT[🤖 Autonomous Agent<br/>EVM wallet]
    AR[AgentRegistry.sol<br/>Q3 2026]
    DAPP[DApp on KUMPLY L1]
    POOL[Liquidity Pool]

    OWNER -->|registers agent<br/>declares bounds| AR
    AGENT -->|attempts swap| DAPP
    DAPP -->|canExecute?<br/>address, action, value| AR
    AR -->|check: bounds OK,<br/>liveness fresh,<br/>owner Tier-4 valid| AR
    AR -->|✓ within bounds| DAPP
    DAPP -->|execute| POOL

    subgraph AgentMetadata[KYA Attestation Fields]
        F1[Model fingerprint<br/>hash or API endpoint]
        F2[Owner attestation<br/>Tier-4 KYB address]
        F3[Behavior bounds<br/>maxTxPerDay, maxValuePerTx,<br/>contract allowlist]
        F4[Provenance<br/>training data, ToS hash]
        F5[Liveness signal<br/>heartbeat oracle]
    end

    AR -.- AgentMetadata
    style AGENT fill:#dc2626,stroke:#fca5a5,color:#fff
    style AR fill:#1a472a,stroke:#22c55e,color:#fff
```

---

## 5. Cross-L1 attestation propagation (Q3 2026 roadmap)

```mermaid
flowchart LR
    subgraph CChain["Avalanche C-Chain"]
        AS[AttestationStore<br/>canonical source]
    end

    subgraph KumplyL1["KUMPLY Compliance L1"]
        ASL1[AttestationStoreL1<br/>ICM mirror]
    end

    subgraph OtherL1["Any other Avalanche L1<br/>e.g. DFK, Beam, Dexalot"]
        ASOther[AttestationStoreMirror<br/>ICM mirror]
        DAppX[Institutional DApp]
    end

    AS -->|sendWarpMessage<br/>on issue/revoke| ASL1
    AS -->|sendWarpMessage<br/>on issue/revoke| ASOther
    DAppX --> ASOther
    DAppX -.->|same tier proof works| AS

    style AS fill:#1a472a,stroke:#22c55e,color:#fff
    style ASL1 fill:#374151,stroke:#9ca3af,color:#fff,stroke-dasharray: 5 5
    style ASOther fill:#374151,stroke:#9ca3af,color:#fff,stroke-dasharray: 5 5
```

---

## How to render / export

**On GitHub:** these diagrams render automatically in this `.md` file.

**As PNG/SVG for slide decks or PDF:**
1. Copy any code block (the part between ` ```mermaid ` and ` ``` `).
2. Paste into https://mermaid.live
3. Click `Actions → PNG` or `SVG`.
4. Recommended export size for slides: 1920 × 1080, transparent background.

**For the litepaper PDF:** convert LITEPAPER.md to PDF using `pandoc` with a Mermaid filter
(`mermaid-filter`) or simply embed pre-rendered PNGs from `mermaid.live`.

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const ATTESTATION_STORE_MAINNET = "0xa116261Ed3a848A9E1cd34923D5A0442D1455F71";
const COMPLIANCE_GATE_MAINNET = "0x01BEEA13A485c7bAD58f926E345325e9e3773bEe";
const ATTESTATION_STORE = "0xa3Bc5564A18e107807aF41fF2a5215Db050b22dD";
const COMPLIANCE_GATE = "0xcFDdeA5482baE9A6733B58F6a39FC36BCe6164cF";
const VALIDATOR_SET_MANAGER = "0x903f6E46f965C9A1127652D761400dBe487F555D";
const L1_SUBNET_ID = "2buHAwNvaybnQ6vQYRS4TeXizZhAo33bhpnonAJu21CKYLZoST";
const L1_BLOCKCHAIN_ID = "2pyvAQK1WQ318yHtnv4ZQeL9hWeJmmgMp9MEHqpJnDYttQEL6b";
const REPO = "https://github.com/kumplyprotocol/Kumply";

const SECTION_PADDING: React.CSSProperties = { padding: "1.5rem", marginBottom: "1.25rem" };
const HEAD_FLEX: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" };
const CHIP: React.CSSProperties = {
  display: "inline-block",
  background: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "0.15rem 0.55rem",
  fontSize: "0.7rem",
  color: "var(--text-secondary)",
  fontFamily: "monospace",
};
const CODE_BLOCK: React.CSSProperties = {
  display: "block",
  background: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "0.85rem 1rem",
  fontSize: "0.82rem",
  fontFamily: "monospace",
  color: "var(--text-primary)",
  overflowX: "auto",
  whiteSpace: "pre",
  lineHeight: 1.55,
};
const ADDR_PILL: React.CSSProperties = {
  display: "block",
  background: "var(--bg-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "0.5rem 0.75rem",
  fontSize: "0.78rem",
  fontFamily: "monospace",
  color: "var(--text-primary)",
  wordBreak: "break-all",
};

function SectionHead({ id, num, title, subtitle }: { id: string; num: string; title: string; subtitle?: string }) {
  return (
    <div id={id} style={{ scrollMarginTop: "5rem", marginBottom: "0.85rem" }}>
      <div style={HEAD_FLEX}>
        <span
          style={{
            ...CHIP,
            background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
            color: "white",
            border: "none",
            minWidth: "2.25rem",
            textAlign: "center",
            fontWeight: 700,
            padding: "0.25rem 0.55rem",
          }}
        >
          {num}
        </span>
        <h2 style={{ fontSize: "1.35rem", margin: 0, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{title}</h2>
      </div>
      {subtitle ? (
        <p style={{ color: "var(--text-secondary)", margin: "0 0 1rem 0", fontSize: "0.92rem", lineHeight: 1.65 }}>{subtitle}</p>
      ) : null}
    </div>
  );
}

function AddressRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.35rem" }}>
        <span style={{ color: "var(--text-secondary)", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "var(--accent-light)" }}>
            Explorer ↗
          </a>
        ) : null}
      </div>
      <code style={ADDR_PILL}>{value}</code>
    </div>
  );
}

export default function DocsPage() {
  const t = useTranslations("Docs");
  const tnav = useTranslations("Navbar");

  const toc = [
    { id: "overview", num: "01", label: t("toc.overview") },
    { id: "quickstart", num: "02", label: t("toc.quickstart") },
    { id: "contracts", num: "03", label: t("toc.contracts") },
    { id: "sdk", num: "04", label: t("toc.sdk") },
    { id: "api", num: "05", label: t("toc.api") },
    { id: "l1", num: "06", label: t("toc.l1") },
    { id: "kya", num: "07", label: t("toc.kya") },
    { id: "tiers", num: "08", label: t("toc.tiers") },
    { id: "architecture", num: "09", label: t("toc.architecture") },
    { id: "resources", num: "10", label: t("toc.resources") },
  ];

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "5rem" }}>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1 className="section-title">{t("title")}</h1>
        <p className="section-subtitle" style={{ margin: "0 auto", maxWidth: "720px" }}>{t("subtitle")}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
          <span style={CHIP}>v1.1</span>
          <span style={CHIP}>{t("badges.network")}</span>
          <span style={CHIP}>ACP-30 · 77 · 99</span>
          <span style={CHIP}>{t("badges.tests")}</span>
        </div>
      </div>

      <div className="docs-grid">
        {/* ── SIDEBAR / TOC ───────────────────────────────────── */}
        <aside className="docs-toc">
          <div className="glass-card docs-toc-inner">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem 0" }}>
              {t("toc.heading")}
            </h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
              {toc.map((it) => (
                <a
                  key={it.id}
                  href={`#${it.id}`}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.55rem",
                    padding: "0.4rem 0.5rem",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-primary)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                  }}
                  className="docs-toc-link"
                >
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.7rem", fontFamily: "monospace", minWidth: "1.5rem" }}>{it.num}</span>
                  <span>{it.label}</span>
                </a>
              ))}
            </nav>
            <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <a href={REPO} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ justifyContent: "center", textDecoration: "none", fontSize: "0.78rem" }}>
                {t("cta.github")} ↗
              </a>
              <a href={`${REPO}/blob/main/LITEPAPER.md`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ justifyContent: "center", textDecoration: "none", fontSize: "0.78rem" }}>
                {t("cta.litepaper")} ↗
              </a>
              <Link href="/verify" className="btn btn-primary" style={{ justifyContent: "center", textDecoration: "none", fontSize: "0.78rem" }}>
                {tnav("verify")}
              </Link>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────────── */}
        <main className="docs-main">
          {/* 01 OVERVIEW */}
          <section className="glass-card" style={SECTION_PADDING}>
            <SectionHead id="overview" num="01" title={t("overview.title")} subtitle={t("overview.subtitle")} />
            <div className="grid-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
              <div style={{ padding: "0.85rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>{t("overview.cardA.label")}</div>
                <div style={{ fontSize: "0.92rem", color: "var(--text-primary)" }}>{t("overview.cardA.value")}</div>
              </div>
              <div style={{ padding: "0.85rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>{t("overview.cardB.label")}</div>
                <div style={{ fontSize: "0.92rem", color: "var(--text-primary)" }}>{t("overview.cardB.value")}</div>
              </div>
              <div style={{ padding: "0.85rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>{t("overview.cardC.label")}</div>
                <div style={{ fontSize: "0.92rem", color: "var(--text-primary)" }}>{t("overview.cardC.value")}</div>
              </div>
            </div>
          </section>

          {/* 02 QUICKSTART */}
          <section className="glass-card" style={SECTION_PADDING}>
            <SectionHead id="quickstart" num="02" title={t("quickstart.title")} subtitle={t("quickstart.subtitle")} />
            <div style={{ marginBottom: "1rem" }}>
              <h4 style={{ fontSize: "0.92rem", margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>{t("quickstart.installTitle")}</h4>
              <code style={CODE_BLOCK}>pnpm add @kumply/sdk viem</code>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <h4 style={{ fontSize: "0.92rem", margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>{t("quickstart.verifyTitle")}</h4>
              <code style={CODE_BLOCK}>{`import { KumplyClient } from "@kumply/sdk";

const client = new KumplyClient({
  network: "mainnet",
  contractAddress: "${ATTESTATION_STORE_MAINNET}",
});

const { verified, tier, expiry } = await client.verify(
  "0xUserAddress…"
);

if (verified && tier >= 4) {
  // user is KYB-verified — proceed
}`}</code>
            </div>
            <div>
              <h4 style={{ fontSize: "0.92rem", margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>{t("quickstart.gateTitle")}</h4>
              <code style={CODE_BLOCK}>{`// Solidity — 3-line dependency
import { ComplianceGate } from "@kumply/contracts";

contract MyDApp {
  ComplianceGate immutable gate;
  constructor() { gate = ComplianceGate(${COMPLIANCE_GATE_MAINNET}); }

  function protectedAction() external payable {
    gate.protectedAction{value: msg.value}();
    // your logic — only Tier 3+ users reach here
  }
}`}</code>
            </div>
          </section>

          {/* 03 CONTRACTS */}
          <section className="glass-card" style={SECTION_PADDING}>
            <SectionHead id="contracts" num="03" title={t("contracts.title")} subtitle={t("contracts.subtitle")} />
            <AddressRow label="AttestationStore · Mainnet C-Chain" value={ATTESTATION_STORE_MAINNET} href={`https://snowtrace.io/address/${ATTESTATION_STORE_MAINNET}`} />
            <AddressRow label="ComplianceGate · Mainnet C-Chain" value={COMPLIANCE_GATE_MAINNET} href={`https://snowtrace.io/address/${COMPLIANCE_GATE_MAINNET}`} />
            <AddressRow label="AttestationStore · Fuji Testnet" value={ATTESTATION_STORE} href={`https://testnet.snowtrace.io/address/${ATTESTATION_STORE}`} />
            <AddressRow label="ComplianceGate · Fuji Testnet" value={COMPLIANCE_GATE} href={`https://testnet.snowtrace.io/address/${COMPLIANCE_GATE}`} />
            <AddressRow label="KumplyValidatorSetManager (ACP-99) · Fuji" value={VALIDATOR_SET_MANAGER} href={`https://testnet.snowtrace.io/address/${VALIDATOR_SET_MANAGER}`} />
            <div style={{ marginTop: "1rem", padding: "0.85rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{t("contracts.methodsLabel")}</div>
              <code style={{ ...CODE_BLOCK, padding: "0.6rem 0.75rem", fontSize: "0.76rem" }}>
{`// AttestationStore
verify(address) → (bool, uint32, uint64, uint64)
checkCompliance(address) payable → (bool, uint32)
issueAttestation(address, uint32 tier, uint64 expiry)
revoke(address)
setSubscription(address gate, bool)
setVerificationFee(uint256 wei)

// ComplianceGate
protectedAction() payable
updateRequiredTier(uint32)
getVerificationFee() view

// KumplyValidatorSetManager (ACP-99)
initiateValidatorRegistration(nodeID, blsKey, balOwner, disOwner, weight)
completeValidatorRegistration(messageIndex)
initiateValidatorRemoval(validationID)
completeValidatorRemoval(messageIndex)
initiateValidatorWeightUpdate(validationID, newWeight)
disableExpiredValidator(validationID)`}
              </code>
            </div>
          </section>

          {/* 04 SDK */}
          <section className="glass-card" style={SECTION_PADDING}>
            <SectionHead id="sdk" num="04" title={t("sdk.title")} subtitle={t("sdk.subtitle")} />
            <code style={CODE_BLOCK}>{`import { KumplyClient, ATTESTATION_STORE_ABI, TIER } from "@kumply/sdk";

const client = new KumplyClient({
  network: "mainnet",
  contractAddress: "${ATTESTATION_STORE_MAINNET}",
});

// Read methods (free, no gas)
await client.verify(address);            // → { verified, tier, expiry, issuedAt }
await client.isVerified(address);        // → boolean
await client.hasTier(address, TIER.KYB); // → boolean (≥ tier 4)
await client.getTotalAttestations();     // → bigint
await client.getVerificationFee();       // → wei (current pay-per-use price)

// Network info
client.network;                          // "fuji" | "mainnet"
client.chainId;                          // 43113 | 43114
client.publicClient;                     // viem PublicClient (advanced use)`}</code>
            <p style={{ margin: "1rem 0 0 0", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              {t("sdk.note")}
            </p>
          </section>

          {/* 05 API */}
          <section className="glass-card" style={SECTION_PADDING}>
            <SectionHead id="api" num="05" title={t("api.title")} subtitle={t("api.subtitle")} />
            <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              <div style={{ padding: "0.85rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <code style={{ fontSize: "0.78rem", color: "var(--accent-light)", fontFamily: "monospace" }}>GET /health</code>
                <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.78rem", color: "var(--text-secondary)" }}>{t("api.health")}</p>
              </div>
              <div style={{ padding: "0.85rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <code style={{ fontSize: "0.78rem", color: "var(--accent-light)", fontFamily: "monospace" }}>POST /api/token</code>
                <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.78rem", color: "var(--text-secondary)" }}>{t("api.token")}</p>
              </div>
              <div style={{ padding: "0.85rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <code style={{ fontSize: "0.78rem", color: "var(--accent-light)", fontFamily: "monospace" }}>POST /webhook/sumsub</code>
                <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.78rem", color: "var(--text-secondary)" }}>{t("api.webhook")}</p>
              </div>
              <div style={{ padding: "0.85rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <code style={{ fontSize: "0.78rem", color: "var(--accent-light)", fontFamily: "monospace" }}>GET /attestation/:address</code>
                <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.78rem", color: "var(--text-secondary)" }}>{t("api.attestation")}</p>
              </div>
              <div style={{ padding: "0.85rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                <code style={{ fontSize: "0.78rem", color: "var(--accent-light)", fontFamily: "monospace" }}>GET /fee</code>
                <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.78rem", color: "var(--text-secondary)" }}>{t("api.fee")}</p>
              </div>
            </div>
            <p style={{ margin: "1rem 0 0 0", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              {t("api.note")}{" "}
              <a href={`${REPO}/blob/main/apps/api/openapi.yaml`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-light)" }}>
                openapi.yaml ↗
              </a>
            </p>
          </section>

          {/* 06 L1 */}
          <section className="glass-card" style={SECTION_PADDING}>
            <SectionHead id="l1" num="06" title={t("l1.title")} subtitle={t("l1.subtitle")} />
            <AddressRow label="Subnet ID" value={L1_SUBNET_ID} href={`https://subnets-test.avax.network/subnets/${L1_SUBNET_ID}`} />
            <AddressRow label="Blockchain ID" value={L1_BLOCKCHAIN_ID} href={`https://subnets-test.avax.network/blockchain/${L1_BLOCKCHAIN_ID}`} />
            <AddressRow label="Chain ID" value="43210" />
            <AddressRow label={t("l1.tokenLabel")} value="KMP — utility gas only · not listed · not for sale" />
            <div style={{ marginTop: "1rem" }}>
              <h4 style={{ fontSize: "0.92rem", margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>{t("l1.rolesTitle")}</h4>
              <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.7 }}>
                <li>{t("l1.role1")}</li>
                <li>{t("l1.role2")}</li>
                <li>{t("l1.role3")}</li>
                <li>{t("l1.role4")}</li>
              </ul>
            </div>
          </section>

          {/* 07 KYA — destacado */}
          <section className="glass-card" style={{ ...SECTION_PADDING, border: "1px solid var(--accent-light)" }}>
            <SectionHead id="kya" num="07" title={t("kya.title")} subtitle={t("kya.subtitle")} />
            <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {[
                { l: t("kya.f1.label"), v: t("kya.f1.value") },
                { l: t("kya.f2.label"), v: t("kya.f2.value") },
                { l: t("kya.f3.label"), v: t("kya.f3.value") },
                { l: t("kya.f4.label"), v: t("kya.f4.value") },
                { l: t("kya.f5.label"), v: t("kya.f5.value") },
              ].map((f, i) => (
                <div key={i} style={{ padding: "0.85rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--accent-light)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem", fontWeight: 600 }}>{f.l}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.5 }}>{f.v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(99, 102, 241, 0.08)", border: "1px solid var(--accent-light)", borderRadius: "var(--radius-sm)", fontSize: "0.82rem", color: "var(--text-primary)" }}>
              <strong>{t("kya.roadmapLabel")}:</strong> {t("kya.roadmap")}
            </div>
          </section>

          {/* 08 TIERS */}
          <section className="glass-card" style={SECTION_PADDING}>
            <SectionHead id="tiers" num="08" title={t("tiers.title")} subtitle={t("tiers.subtitle")} />
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {[
                { n: "1", k: "tierOne" },
                { n: "2", k: "tierTwo" },
                { n: "3", k: "tierThree" },
                { n: "4", k: "tierFour" },
                { n: "5", k: "tierFive" },
              ].map((tier) => (
                <div key={tier.n} style={{ display: "flex", gap: "0.85rem", padding: "0.75rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ minWidth: "2.5rem", height: "2.5rem", borderRadius: "var(--radius-sm)", background: tier.n === "5" ? "linear-gradient(135deg, #dc2626, #f87171)" : tier.n === "4" ? "linear-gradient(135deg, var(--accent), var(--accent-light))" : "var(--bg-tertiary, #1f2937)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.05rem" }}>
                    {tier.n}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.15rem" }}>{t(`tiers.${tier.k}.name`)}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{t(`tiers.${tier.k}.use`)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 09 ARCHITECTURE */}
          <section className="glass-card" style={SECTION_PADDING}>
            <SectionHead id="architecture" num="09" title={t("architecture.title")} subtitle={t("architecture.subtitle")} />
            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--text-primary)", fontSize: "0.88rem", lineHeight: 1.85 }}>
              <li>
                <a href={`${REPO}/blob/main/docs/diagrams/architecture.md`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-light)" }}>
                  {t("architecture.linkA")} ↗
                </a>
              </li>
              <li>{t("architecture.linkB")}</li>
              <li>{t("architecture.linkC")}</li>
              <li>{t("architecture.linkD")}</li>
            </ul>
          </section>

          {/* 10 RESOURCES */}
          <section className="glass-card" style={SECTION_PADDING}>
            <SectionHead id="resources" num="10" title={t("resources.title")} subtitle={t("resources.subtitle")} />
            <div style={{ display: "grid", gap: "0.6rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <a href={REPO} target="_blank" rel="noopener noreferrer" className="docs-resource">
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>GitHub</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t("resources.github")}</span>
              </a>
              <a href={`${REPO}/blob/main/LITEPAPER.md`} target="_blank" rel="noopener noreferrer" className="docs-resource">
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>Litepaper v1.1</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t("resources.litepaper")}</span>
              </a>
              <a href={`https://snowtrace.io/address/${ATTESTATION_STORE_MAINNET}`} target="_blank" rel="noopener noreferrer" className="docs-resource">
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>Snowtrace</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t("resources.snowtrace")}</span>
              </a>
              <a href="https://build.avax.network/docs/acps/99-validatorsetmanager-contract" target="_blank" rel="noopener noreferrer" className="docs-resource">
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>ACP-99</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t("resources.acp99")}</span>
              </a>
              <a href="https://build.avax.network/docs/acps/77-reinventing-subnets" target="_blank" rel="noopener noreferrer" className="docs-resource">
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>ACP-77</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t("resources.acp77")}</span>
              </a>
              <a href="mailto:hello@kumply.xyz" className="docs-resource">
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>hello@kumply.xyz</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t("resources.contact")}</span>
              </a>
            </div>
          </section>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .docs-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        .docs-toc {
          position: sticky;
          top: 5rem;
        }
        .docs-toc-inner {
          padding: 1rem;
        }
        .docs-toc-link:hover {
          background: var(--bg-secondary);
          color: var(--accent-light) !important;
        }
        .docs-resource {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0.85rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          text-decoration: none;
          transition: border-color 0.15s, transform 0.15s;
        }
        .docs-resource:hover {
          border-color: var(--accent-light);
          transform: translateY(-1px);
        }
        @media (max-width: 900px) {
          .docs-grid {
            grid-template-columns: 1fr;
          }
          .docs-toc {
            position: static;
          }
          .docs-toc-inner nav {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.25rem !important;
          }
        }
        @media (max-width: 500px) {
          .docs-toc-inner nav {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
}

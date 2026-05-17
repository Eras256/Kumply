import { useTranslations } from "next-intl";

// ── KUMPLY Compliance L1 — Deploy-Ready configuration ──────────────
const L1_CHAIN_ID         = 43210;
const L1_NAME             = "KUMPLY Compliance L1";
const L1_SYMBOL           = "KMP";
const L1_VM               = "Subnet-EVM v0.7.0";
const L1_BLOCK_TIME       = "2s";
const L1_RPC_PLACEHOLDER  = "https://kumply-l1.rpc.kumply.xyz/ext/bc/{blockchainID}/rpc";
const L1_EXPLORER         = "https://kumply-l1.subnets.avax.network";
const ATTESTATION_STORE   = process.env.NEXT_PUBLIC_CONTRACT_ATTESTATION_STORE || "0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76";

// Planned founding validators (KYB-gated — must hold Tier 4 attestation)
const FOUNDING_VALIDATORS = [
  { name: "Bankaool",             role: "Digital bank · CNBV regulated",       tier: 4, status: "committed"   },
  { name: "Arkangeles",           role: "Venture capital · LatAm",             tier: 4, status: "committed"   },
  { name: "KUMPLY Protocol",      role: "Treasury validator",                  tier: 4, status: "committed"   },
  { name: "LatAm DeFi Alliance",  role: "Regional consortium",                 tier: 4, status: "invited"     },
  { name: "Institutional TBD #5", role: "Banking partner",                     tier: 4, status: "negotiating" },
];

const ACP_REFERENCES = [
  { id: "ACP-77",  title: "Reinventing Subnets",          href: "https://build.avax.network/docs/acps/77-reinventing-subnets" },
  { id: "ACP-99",  title: "ValidatorSetManager Contract", href: "https://build.avax.network/docs/acps/99-validatorsetmanager-contract" },
  { id: "ACP-83",  title: "Dynamic Multidim Fees",        href: "https://build.avax.network/docs/acps/83-dynamic-multidimensional-fees" },
  { id: "ACP-30",  title: "Avalanche Warp x EVM",         href: "https://build.avax.network/docs/acps/30-avalanche-warp-x-evm" },
];

function StatBlock({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
      <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{label}</div>
      <div style={{ color: accent ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600, wordBreak: 'break-all' }}>{value}</div>
    </div>
  );
}

function Row({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.85rem 0', borderBottom: '1px solid var(--border)', gap: '1rem' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flexShrink: 0 }}>{label}</span>
      {mono ? (
        <code style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', textAlign: 'right' }}>{value}</code>
      ) : (
        <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', textAlign: 'right' }}>{value}</span>
      )}
    </li>
  );
}

export default function L1Page() {
  const t = useTranslations('L1');

  return (
    <div className="container l1-container">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)', borderRadius: '999px', marginBottom: '1.25rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 10px #fbbf24' }}></span>
          <span style={{ color: '#fbbf24', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('badge')}</span>
        </div>
        <h1 className="section-title">{t('title')}</h1>
        <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '720px' }}>{t('subtitle')}</p>
      </div>

      {/* ── Status banner ──────────────────────────────────────── */}
      <div className="glass-card" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', borderLeft: '4px solid #fbbf24' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.3rem' }}>{t('statusTitle')}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{t('statusDesc')}</p>
          </div>
          <a
            href="https://github.com/Eras256/Kumply"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ flexShrink: 0 }}
          >
            {t('viewOnGitHub')} ↗
          </a>
        </div>
      </div>

      {/* ── Chain identity ─────────────────────────────────────── */}
      <div className="l1-grid-2">
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t('chainIdentity')}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <Row label={t('chainName')} value={L1_NAME} mono={false} />
            <Row label="Chain ID" value={String(L1_CHAIN_ID)} />
            <Row label={t('gasToken')} value={L1_SYMBOL} />
            <Row label="VM" value={L1_VM} />
            <Row label={t('blockTime')} value={L1_BLOCK_TIME} />
            <Row label={t('consensus')} value="Snowman (k=20, β=15)" />
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t('endpoints')}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <Row label="RPC (planned)" value={L1_RPC_PLACEHOLDER} />
            <Row label={t('explorer')} value={L1_EXPLORER} />
            <Row label="AttestationStore" value={ATTESTATION_STORE} />
            <Row label={t('validatorSetMgr')} value="Deploy-Ready (.sol)" mono={false} />
            <Row label="Warp / ICM" value={t('enabled')} mono={false} />
            <Row label="ICTT" value={t('plannedPhase2')} mono={false} />
          </ul>
        </div>
      </div>

      {/* ── Architecture diagram (text-only) ───────────────────── */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t('architectureTitle')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{t('architectureDesc')}</p>

        <div className="code-block l1-code-diagram">
          <span className="comment">┌─────────────────────────────────────────────────────────────────┐</span><br/>
          <span className="comment">│</span>  <span className="keyword">Validator Set (ACP-77 + ACP-99)</span>                              <span className="comment">│</span><br/>
          <span className="comment">│</span>  KYB-verified institutions only · 5–21 active validators        <span className="comment">│</span><br/>
          <span className="comment">└─────────────────────────────────────────────────────────────────┘</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">│</span> initializeValidatorRegistration(nodeID, weight)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">▼</span><br/>
          <span className="comment">┌─────────────────────────────────────────────────────────────────┐</span><br/>
          <span className="comment">│</span>  <span className="function">KumplyValidatorSetManager.sol</span>                                 <span className="comment">│</span><br/>
          <span className="comment">│</span>  require: attestationStore.verify(msg.sender).tier &gt;= 4         <span className="comment">│</span><br/>
          <span className="comment">└─────────────────────────────────────────────────────────────────┘</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">│</span> Warp Message (ACP-77 §"L1 Validator Manager")<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">▼</span><br/>
          <span className="comment">┌─────────────────────────────────────────────────────────────────┐</span><br/>
          <span className="comment">│</span>  <span className="keyword">P-Chain</span> · canonical L1 validator set sync                      <span className="comment">│</span><br/>
          <span className="comment">└─────────────────────────────────────────────────────────────────┘</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">│</span> Snowman++ consensus<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">▼</span><br/>
          <span className="comment">┌─────────────────────────────────────────────────────────────────┐</span><br/>
          <span className="comment">│</span>  <span className="keyword">KUMPLY L1 (Subnet-EVM, KMP gas)</span> · 2s blocks · ICM enabled    <span className="comment">│</span><br/>
          <span className="comment">└─────────────────────────────────────────────────────────────────┘</span>
        </div>
      </div>

      {/* ── Founding validators ────────────────────────────────── */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t('foundingValidators')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{t('foundingValidatorsDesc')}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {FOUNDING_VALIDATORS.map((v) => (
            <div
              key={v.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  background: 'var(--accent-glow)', border: '1px solid var(--border-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem'
                }}>
                  {v.name.charAt(0)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{v.name}</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>{v.role}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Tier {v.tier} · KYB</span>
                <span
                  className={`badge ${v.status === 'committed' ? 'badge-success' : 'badge-info'}`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {t(`status_${v.status}`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why a dedicated L1 ─────────────────────────────────── */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t('whyTitle')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{t('whySubtitle')}</p>

        <div className="l1-grid-why">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>0{i}</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.4rem' }}>{t(`why${i}Title`)}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.55 }}>{t(`why${i}Desc`)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Deployment artifacts ───────────────────────────────── */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t('artifactsTitle')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{t('artifactsDesc')}</p>

        <div className="l1-grid-artifacts">
          <StatBlock label="Contract" value="KumplyValidatorSetManager.sol" />
          <StatBlock label="Genesis" value="contracts/l1/genesis.json" />
          <StatBlock label="L1 config" value="contracts/l1/l1-config.json" />
          <StatBlock label="Deploy script" value="contracts/scripts/deploy-l1.sh" />
          <StatBlock label="Hardhat tests" value="27 passing" accent />
          <StatBlock label="Network" value="Fuji testnet (initial)" />
        </div>
      </div>

      {/* ── ACP references ─────────────────────────────────────── */}
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t('acpTitle')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{t('acpDesc')}</p>

        <div className="l1-grid-acp">
          {ACP_REFERENCES.map((acp) => (
            <a
              key={acp.id}
              href={acp.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1.1rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: 'var(--text-primary)',
              }}
            >
              <div>
                <div style={{ color: 'var(--accent-light)', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700 }}>{acp.id}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{acp.title}</div>
              </div>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>↗</span>
            </a>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .l1-container { padding-top: 2rem; padding-bottom: 5rem; }
        .l1-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
        .l1-code-diagram { font-family: monospace; line-height: 1.7; overflow-x: auto; white-space: pre; }
        .l1-grid-why { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; }
        .l1-grid-artifacts { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.75rem; }
        .l1-grid-acp { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; }
        
        @media (max-width: 768px) {
          .l1-container { padding-top: 1.5rem; padding-bottom: 3.5rem; }
          .l1-grid-2, .l1-grid-artifacts { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .l1-container { padding-top: 1rem; padding-bottom: 2.5rem; }
          .l1-grid-why { grid-template-columns: 1fr; }
        }
      ` }} />
    </div>
  );
}

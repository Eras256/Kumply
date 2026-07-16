import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Hero3DWrapper from "@/components/Hero3DWrapper";
import { KumplyClient } from "@kumply/sdk";

async function getTotalAttestations(): Promise<number> {
  try {
    const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ATTESTATION_STORE || "0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76") as `0x${string}`;
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') return 0;
    const client = new KumplyClient({ network: 'fuji', contractAddress });
    return await client.getTotalAttestations();
  } catch {
    return 0;
  }
}

export default async function Home() {
  const t = await getTranslations('Hero');
  const h = await getTranslations('Home');
  const totalAttestations = await getTotalAttestations();

  return (
    <div>
      {/* ── Testnet Banner ── */}
      <div className="container" style={{ paddingTop: '1.5rem' }}>
        <div role="alert" style={{
          background: 'var(--warning-bg)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderLeft: '3px solid var(--warning)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0'
        }}>
          <span style={{ color: 'var(--warning)', fontSize: '0.9rem', flexShrink: 0 }}>⚠</span>
          <span style={{ color: 'var(--warning)', fontSize: '0.82rem', fontWeight: 500 }}>{h('testnetBanner')}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section id="hero" aria-labelledby="hero-heading" className="container animate-fade-in-up" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }} className="hero-grid">
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)', flexShrink: 0 }}></span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('badge')}</span>
            </div>

            <h1 id="hero-heading" className="page-title" style={{ fontSize: '3.5rem', textAlign: 'left', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              {t('title1')}<br />
              <span style={{ color: 'var(--accent)' }}>{t('title2')}</span>
            </h1>

            <p className="page-description" style={{ textAlign: 'left', marginLeft: 0, marginBottom: '2.5rem', fontSize: '1.15rem', maxWidth: '500px', lineHeight: 1.7 }}>
              {t('description')}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
              <Link href="/verify" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                {t('btnPrimary')}
              </Link>
              <Link href="/developers" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                {t('btnSecondary')}
              </Link>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="hero-3d-container">
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <Hero3DWrapper />
            </div>
          </div>
        </div>


      </section>

      {/* ── Stats Bar ── */}
      <section id="stats" aria-label="Key metrics" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2.5rem 0' }}>
        <div className="container">
          <div className="stats-grid" style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-value">{totalAttestations > 0 ? totalAttestations.toString() : '—'}</div>
              <div className="stat-label">{h('statsAttestation')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">5</div>
              <div className="stat-label">{h('statsTiers')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">2</div>
              <div className="stat-label">{h('statsContracts')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ fontSize: '2rem' }}>&lt;1s</div>
              <div className="stat-label">{h('statsFinality')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" aria-labelledby="how-title" className="container section">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 id="how-title" className="section-title">{h('howItWorksTitle')}</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>{h('howItWorksSubtitle')}</p>
        </div>

        <div className="how-it-works-grid" style={{ display: 'grid', alignItems: 'center', gap: '0' }}>
          {/* Step 1 */}
          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: 'var(--shadow-glow)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-glow)', border: '1px solid var(--accent)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '1rem' }}>1</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{h('step1Title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{h('step1Desc')}</p>
          </div>

          {/* Arrow 1 */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="step-arrow">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M13 6l6 6-6 6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Step 2 */}
          <div className="glass-card animate-glow" style={{ textAlign: 'center', padding: '2rem 1.5rem', borderColor: 'var(--accent)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: 'var(--shadow-glow)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-glow)', border: '1px solid var(--accent)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '1rem' }}>2</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>{h('step2Title')}</h3>
            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className="badge badge-accent">{h('step2KYC')}</span>
              <span className="badge badge-info">{h('step2KYB')}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.02em', background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>{h('step2KYA')}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{h('step2Desc')}</p>
          </div>

          {/* Arrow 2 */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="step-arrow">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M13 6l6 6-6 6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Step 3 */}
          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--success), #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--success-bg)', border: '1px solid var(--success)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--success)', marginBottom: '1rem' }}>3</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{h('step3Title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{h('step3Desc')}</p>
          </div>
        </div>


      </section>

      {/* ── Infrastructure / Stack ── */}
      <section id="partners" aria-labelledby="partners-title" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container section">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 id="partners-title" className="section-title">{h('partnersTitle')}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>{h('partnersSubtitle')}</p>
          </div>

          <div className="partners-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {/* AVALANCHE® Network */}
            <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--accent-dark), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem' }}>
                🔺
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{h('partner1Name')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{h('partner1Desc')}</p>
              <div style={{ marginTop: '1rem' }}>
                <span className="badge badge-info">Network</span>
              </div>
            </div>

            {/* Sumsub */}
            <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #1e40af, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem' }}>
                🪪
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{h('partner2Name')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{h('partner2Desc')}</p>
              <div style={{ marginTop: '1rem' }}>
                <span className="badge badge-info">KYC Provider</span>
              </div>
            </div>

            {/* KUMPLY Compliance L1 */}
            <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem' }}>
                ⛓️
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{h('partner3Name')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{h('partner3Desc')}</p>
              <div style={{ marginTop: '1rem' }}>
                <span className="badge badge-accent">Live on Fuji</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Avalanche ── */}
      <section id="why-avalanche" aria-labelledby="why-avax-title" className="container section">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 id="why-avax-title" className="section-title">{h('whyAvaxTitle')}</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>{h('whyAvaxSubtitle')}</p>
        </div>

        <div className="why-avax-grid" style={{ display: 'grid', gap: '1.5rem' }}>
          <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{h('whyF1Title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{h('whyF1Desc')}</p>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--info-bg)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="var(--info)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{h('whyF2Title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{h('whyF2Desc')}</p>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.86 0 .53-.39 1.38-2.1 1.38-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="var(--success)"/></svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{h('whyF3Title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{h('whyF3Desc')}</p>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{h('whyF4Title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{h('whyF4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="cta" aria-labelledby="cta-title" className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(232,65,66,0.1) 0%, rgba(10,11,15,0) 60%)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(232,65,66,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

          <div style={{ position: 'relative' }}>
            <h2 id="cta-title" className="section-title cta-title" style={{ marginBottom: '1rem' }}>{h('ctaTitle')}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2.5rem', maxWidth: '520px' }}>{h('ctaSubtitle')}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/verify" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                {h('ctaBtn')}
              </Link>
              <Link href="/tiers" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                {h('ctaBtnSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Hero */
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-grid > div:first-child { text-align: center !important; display: flex; flex-direction: column; align-items: center; }
          .hero-grid .page-title { text-align: center !important; font-size: 2.4rem !important; }
          .hero-grid .page-description { text-align: center !important; margin: 0 auto 2.5rem auto !important; }
          .hero-grid > div:first-child > div:last-child { flex-direction: column; width: 100%; max-width: 320px; margin: 0 auto; }
          .hero-3d-container { grid-row: 1; }
        }
        @media (max-width: 480px) {
          .hero-grid .page-title { font-size: 1.9rem !important; }
        }

        /* Stats */
        .stats-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }

        /* How it works */
        .how-it-works-grid { grid-template-columns: 1fr 48px 1fr 48px 1fr; }
        @media (max-width: 768px) {
          .how-it-works-grid { grid-template-columns: 1fr; }
          .step-arrow { transform: rotate(90deg); margin: 0.5rem auto; }
        }

        /* Why Avalanche */
        .why-avax-grid { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: 768px) { .why-avax-grid { grid-template-columns: 1fr; } }

        /* CTA */
        .cta-title { font-size: 2.5rem; }
        @media (max-width: 768px) { .cta-title { font-size: 2rem; } }
        @media (max-width: 480px) { .cta-title { font-size: 1.75rem; } }
      ` }} />
    </div>
  );
}

import { useTranslations } from "next-intl";

const ATTESTATION_STORE = "0x9Bbb0797EA92277c268fe7E45BdB16b70E787d76";
const COMPLIANCE_GATE   = "0x3Bf8F8ea2573Eb3f386aDF72D191869c4827062B";
const SNOWTRACE_BASE    = "https://testnet.snowtrace.io/address";

function ContractRow({ label, address }: { label: string; address: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        <a
          href={`${SNOWTRACE_BASE}/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.75rem', color: 'var(--accent-light)' }}
        >
          View on Snowtrace ↗
        </a>
      </div>
      <code style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-primary)', wordBreak: 'break-all', background: 'var(--bg-secondary)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
        {address}
      </code>
    </div>
  );
}

export default function DevelopersPage() {
  const t  = useTranslations('Developers');

  return (
    <div className="container dev-container">
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 className="section-title">{t('title')}</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>{t('subtitle')}</p>
      </div>

      {/* Install + Basic Verify */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t('step1')}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="https://www.npmjs.com/package/@kumply/sdk"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.78rem', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0zm6.77 6.77h10.46v10.46H15V9.77H12.23v7.46H6.77V6.77z"/></svg>
              npmjs.com/package/@kumply/sdk ↗
            </a>
            <a
              href="https://kumply-api.fly.dev"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.78rem', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              kumply-api.fly.dev ↗
            </a>
          </div>
        </div>
        <div className="code-block dev-code-block" style={{ marginBottom: '2rem' }}>
          pnpm add @kumply/sdk
        </div>

        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t('step2')}</h3>
        <div className="code-block dev-code-block">
          <span className="keyword">import</span> {'{'} <span className="function">KumplyClient</span> {'}'} <span className="keyword">from</span> <span className="string">'@kumply/sdk'</span>;<br/><br/>

          <span className="keyword">const</span> client = <span className="keyword">new</span> <span className="function">KumplyClient</span>({'{'}<br/>
          &nbsp;&nbsp;network: <span className="string">'fuji'</span>,<br/>
          &nbsp;&nbsp;contractAddress: <span className="string">'{ATTESTATION_STORE}'</span><br/>
          {'}'});<br/><br/>

          <span className="comment">// Verify a wallet address</span><br/>
          <span className="keyword">const</span> result = <span className="keyword">await</span> client.<span className="function">verify</span>(<span className="string">'0x…'</span>);<br/>
          console.<span className="function">log</span>(result);<br/>
          <span className="comment">// {'{'} verified: true, tier: 3, expiry: 1748000000, issuer: '0x…' {'}'}</span><br/><br/>

          <span className="keyword">if</span> (result.tier &gt;= <span className="number">2</span>) {'{'}<br/>
          &nbsp;&nbsp;<span className="comment">// Standard KYC verified — allow trading</span><br/>
          {'}'} <span className="keyword">else if</span> (result.tier === <span className="number">4</span>) {'{'}<br/>
          &nbsp;&nbsp;<span className="comment">// KYB verified institution — allow RWA access</span><br/>
          {'}'} <span className="keyword">else if</span> (result.tier === <span className="number">5</span>) {'{'}<br/>
          &nbsp;&nbsp;<span className="comment">// KYA verified agent — allow AI execution</span><br/>
          {'}'}
        </div>
      </div>

      {/* Live Contract Addresses */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)', flexShrink: 0 }}></div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t('step3')}</h3>
          <span className="badge badge-info" style={{ marginLeft: 'auto' }}>Fuji Testnet · chainId 43113</span>
        </div>

        <div>
          <ContractRow label={t('attestationStore')} address={ATTESTATION_STORE} />
          <ContractRow label={t('complianceGate')} address={COMPLIANCE_GATE} />
        </div>
      </div>

      {/* Solidity Integration */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t('solidityTitle')}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{t('soliditySubtitle')}</p>
        <div className="code-block dev-code-block">
          <span className="comment">// SPDX-License-Identifier: MIT</span><br/>
          <span className="keyword">pragma solidity</span> ^<span className="number">0.8</span>.<span className="number">28</span>;<br/><br/>

          <span className="keyword">interface</span> <span className="function">IAttestationStore</span> {'{'}<br/>
          &nbsp;&nbsp;<span className="keyword">function</span> <span className="function">verify</span>(address subject)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">external</span> <span className="keyword">view</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">returns</span> (<span className="keyword">bool</span> verified, <span className="keyword">uint32</span> tier,<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">uint64</span> timestamp, <span className="keyword">uint64</span> expiry);<br/>
          {'}'}<br/><br/>

          <span className="keyword">contract</span> <span className="function">MyDeFiProtocol</span> {'{'}<br/>
          &nbsp;&nbsp;<span className="function">IAttestationStore</span> <span className="keyword">public</span> immutable kumply;<br/><br/>

          &nbsp;&nbsp;<span className="function">constructor</span>() {'{'}<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;kumply = <span className="function">IAttestationStore</span>(<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="string">{ATTESTATION_STORE}</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;);<br/>
          &nbsp;&nbsp;{'}'}<br/><br/>

          &nbsp;&nbsp;<span className="keyword">function</span> <span className="function">deposit</span>(uint256 amount) <span className="keyword">external</span> {'{'}<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;(bool verified, uint32 tier,,) = kumply.<span className="function">verify</span>(msg.sender);<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">require</span>(verified, <span className="string">"KYC required"</span>);<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">require</span>(tier &gt;= <span className="number">2</span>, <span className="string">"Standard tier needed"</span>);<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// ... deposit logic</span><br/>
          &nbsp;&nbsp;{'}'}<br/>
          {'}'}
        </div>
      </div>

      {/* Resources */}
      <div className="dev-grid-resources">
        <a
          href="https://www.npmjs.com/package/@kumply/sdk"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card"
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', cursor: 'pointer' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(203,56,55,0.12)', border: '1px solid rgba(203,56,55,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#cb3837"><path d="M0 0h24v24H0V0zm6.77 6.77h10.46v10.46H15V9.77H12.23v7.46H6.77V6.77z"/></svg>
          </div>
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{t('npmTitle')}</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>{t('npmDesc')}</p>
          </div>
        </a>

        <a
          href="https://kumply-api.fly.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card"
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', cursor: 'pointer' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{t('apiTitle')}</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>{t('apiDesc')}</p>
          </div>
        </a>

        <a
          href={`${SNOWTRACE_BASE}/${ATTESTATION_STORE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card"
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', cursor: 'pointer' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>AttestationStore on Snowtrace</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>View contract source & transactions</p>
          </div>
        </a>

        <a
          href="https://core.app/tools/testnet-faucet/?subnet=c&token=c"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card"
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', textDecoration: 'none', cursor: 'pointer' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Fuji Testnet Faucet</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Get free test AVAX for development</p>
          </div>
        </a>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .dev-container { padding-top: 2rem; padding-bottom: 5rem; }
        .dev-code-block { overflow-x: auto; white-space: pre; }
        .dev-grid-resources { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        
        @media (max-width: 768px) {
          .dev-container { padding-top: 1.5rem; padding-bottom: 3.5rem; }
          .dev-grid-resources { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .dev-container { padding-top: 1rem; padding-bottom: 2.5rem; }
        }
      ` }} />
    </div>
  );
}

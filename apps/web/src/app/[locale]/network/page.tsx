"use client";

import { useTranslations } from "next-intl";
import { useKumplyNetwork } from "@/providers/KumplyNetworkProvider";

export default function NetworkPage() {
  const t = useTranslations('Network');
  const { network, contractAddress, complianceGateAddress, rpcUrl, chainId } = useKumplyNetwork();
  
  const verifierAddress = process.env.NEXT_PUBLIC_VERIFIER_ADDRESS || "0xD65042534CE80fcb641fd6Eb99a16eBF6C0cd076";
  const snowtraceBase = network === "mainnet" 
    ? "https://snowtrace.io/address" 
    : "https://testnet.snowtrace.io/address";
  const networkLabel = network === "mainnet" ? "Avalanche Mainnet" : "Avalanche Fuji Testnet";

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 className="section-title">{t('title')}</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>{t('subtitle')}</p>
      </div>

      {/* Top row: Network status + faucet */}
      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '1.5rem' }}>
        {/* Network Status */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block', boxShadow: '0 0 10px var(--success)', flexShrink: 0 }}></span>
            {t('status')}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Status</span>
              <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem' }}>{t('online')}</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('chainId')}</span>
              <code style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.9rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>{chainId}</code>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.85rem 0', borderBottom: '1px solid var(--border)', gap: '1rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flexShrink: 0 }}>{t('rpcUrl')}</span>
              <code style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', textAlign: 'right' }}>{rpcUrl}</code>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Currency</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{network === "mainnet" ? "AVAX" : "AVAX"}</span>
            </li>
          </ul>
        </div>

        {/* Faucet + Add to Wallet */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-primary)', fontSize: '1rem' }}>{t('faucet')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6, fontSize: '0.9rem' }}>
              {t('faucetDesc')}
            </p>
            <a
              href="https://core.app/tools/testnet-faucet/?subnet=c&token=c"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
            >
              {t('faucet')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '0.25rem' }}>
                <path d="M5 12H19M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1rem' }}>{t('addToWallet')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6, fontSize: '0.875rem' }}>{t('addToWalletDesc')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <a href="https://core.app" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none', justifyContent: 'center', fontSize: '0.85rem' }}>Core Wallet</a>
              <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none', justifyContent: 'center', fontSize: '0.85rem' }}>MetaMask</a>
            </div>
          </div>
        </div>
      </div>

      {/* KUMPLY Deployed Contracts */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.25rem' }}>{t('contractsTitle')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('contractsSubtitle')}</p>
          </div>
          <span className="badge badge-success">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }}></span>
            Live on {network === "mainnet" ? "Mainnet" : "Fuji"}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* AttestationStore */}
          <div style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('attestationStore')}</span>
              <a href={`${snowtraceBase}/${contractAddress}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-light)' }}>{t('viewOnSnowtr')}</a>
            </div>
            <code style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-primary)', wordBreak: 'break-all', display: 'block', background: 'var(--bg-secondary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>{contractAddress}</code>
          </div>

          {/* ComplianceGate */}
          <div style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('complianceGate')}</span>
              <a href={`${snowtraceBase}/${complianceGateAddress}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-light)' }}>{t('viewOnSnowtr')}</a>
            </div>
            <code style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-primary)', wordBreak: 'break-all', display: 'block', background: 'var(--bg-secondary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>{complianceGateAddress}</code>
          </div>

          {/* Verifier */}
          <div style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('verifierAddress')}</span>
              <a href={`${snowtraceBase}/${verifierAddress}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-light)' }}>{t('viewOnSnowtr')}</a>
            </div>
            <code style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-primary)', wordBreak: 'break-all', display: 'block', background: 'var(--bg-secondary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>{verifierAddress}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

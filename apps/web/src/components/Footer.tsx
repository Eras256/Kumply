import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import KumplyLogo from "@/app/images/KumplyLogo.png";

export function Footer() {
  const tFooter = useTranslations('Footer');
  const tSol = useTranslations('Solutions');
  const tDev = useTranslations('DevelopersDocs');
  const tLegal = useTranslations('Legal');

  const linkStyle = { 
    color: 'var(--text-secondary)', 
    fontSize: '0.9rem', 
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  };

  return (
    <footer 
      role="contentinfo"
      aria-label="Site footer"
      style={{ 
        borderTop: '1px solid var(--border)', 
        padding: '4rem 0 2rem 0', 
        marginTop: '6rem', 
        background: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '200px',
        background: 'radial-gradient(ellipse, rgba(232, 65, 66, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}></div>

      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          {/* Column 1: Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/" aria-label="KUMPLY home" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <Image src={KumplyLogo} alt="Kumply Logo" width={28} height={28} style={{ borderRadius: '6px' }} />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>KUMPLY</span>
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {tFooter('brandDesc')}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <span className="badge badge-accent">LatAm Hackathon</span>
              <span className="badge badge-info">Fuji Testnet</span>
            </div>
          </div>

          {/* Column 2: Solutions */}
          <nav aria-label="Solutions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{tFooter('solutions')}</h4>
            <Link href="/solutions/kyc" style={linkStyle}>{tSol('kyc.title')}</Link>
            <Link href="/solutions/kyb" style={linkStyle}>{tSol('kyb.title')}</Link>
            <Link href="/solutions/kya" style={linkStyle}>{tSol('kya.title')}</Link>
            <Link href="/solutions/cross-l1" style={linkStyle}>{tSol('cross-l1.title')}</Link>
          </nav>

          {/* Column 3: Developers */}
          <nav aria-label="Developers" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{tFooter('developers')}</h4>
            <Link href="/developers" style={linkStyle}>TypeScript SDK</Link>
            <Link href="/developers/contracts" style={linkStyle}>{tDev('contracts.title')}</Link>
            <Link href="/developers/api" style={linkStyle}>{tDev('api.title')}</Link>

          </nav>

          {/* Column 4: Legal & Compliance */}
          <nav aria-label="Legal" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{tFooter('legal')}</h4>
            <Link href="/legal/privacy" style={linkStyle}>{tLegal('privacy.title')}</Link>
            <Link href="/legal/terms" style={linkStyle}>{tLegal('terms.title')}</Link>
            <Link href="/legal/regulatory" style={linkStyle}>{tLegal('regulatory.title')}</Link>
            <Link href="/legal/audit" style={linkStyle}>{tLegal('audit.title')}</Link>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1.5rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)'
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            {tFooter('rights')}
          </p>
          
          <div style={{ 
            fontSize: '0.8rem', 
            color: 'var(--text-tertiary)', 
            maxWidth: '600px', 
            textAlign: 'right',
            lineHeight: 1.5,
            padding: '1rem',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <strong>{tFooter('trademark').split(':')[0]}:</strong> {tFooter('trademark').split(':').slice(1).join(':')}
          </div>
        </div>
      </div>
    </footer>
  );
}

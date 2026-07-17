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
    <footer role="contentinfo" aria-label="Site footer" className="site-footer">
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '600px',
        height: '200px',
        background: 'radial-gradient(ellipse, rgba(232, 65, 66, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}></div>

      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/" aria-label="KUMPLY home" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <Image src={KumplyLogo} alt="Kumply Logo" width={28} height={28} style={{ borderRadius: '6px' }} />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>KUMPLY</span>
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {tFooter('brandDesc')}
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-success">Mainnet C-Chain</span>
              <span className="badge badge-accent">Fuji Testnet</span>
              <span className="badge badge-info">Compliance Infra</span>
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
            <Link href="/l1" style={linkStyle}>{tFooter('l1') || 'Compliance L1'}</Link>
            <a href="https://subnets-test.avax.network/subnets/2buHAwNvaybnQ6vQYRS4TeXizZhAo33bhpnonAJu21CKYLZoST" target="_blank" rel="noopener noreferrer" style={linkStyle}>Subnet Explorer ↗</a>
            <Link href="/docs" style={linkStyle}>{tFooter('docs') || 'Docs'}</Link>

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
        <div className="footer-bottom-bar">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            {tFooter('rights')}
          </p>
          
          <div className="footer-disclaimer">
            <strong>{tFooter('trademark').split(':')[0]}:</strong> {tFooter('trademark').split(':').slice(1).join(':')}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .site-footer { border-top: 1px solid var(--border); padding: 4rem 0 2rem 0; margin-top: 6rem; background: var(--bg-secondary); position: relative; overflow: hidden; }
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; margin-bottom: 4rem; }
        .footer-bottom-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; padding-top: 2rem; border-top: 1px solid var(--border); }
        .footer-disclaimer { font-size: 0.8rem; color: var(--text-tertiary); max-width: 600px; text-align: right; line-height: 1.5; padding: 1rem; background: var(--bg-primary); border-radius: var(--radius-md); border: 1px solid var(--border); }
        
        @media (max-width: 768px) {
          .site-footer { padding: 3rem 0 1.5rem 0; margin-top: 4rem; }
          .footer-grid { gap: 2rem; margin-bottom: 2rem; }
          .footer-bottom-bar { flex-direction: column; align-items: flex-start; }
          .footer-disclaimer { text-align: left; }
        }
      ` }} />
    </footer>
  );
}

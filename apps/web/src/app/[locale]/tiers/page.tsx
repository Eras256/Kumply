import { TierCard } from "@/components/TierCard";
import { useTranslations } from "next-intl";

export default function TiersPage() {
  const t = useTranslations('Tiers');

  return (
    <div className="container tiers-container">
      <div className="tiers-header">
        <h1 className="section-title tiers-title">{t('title')}</h1>
        <p className="section-subtitle tiers-subtitle">{t('subtitle')}</p>
      </div>

      <div className="tiers-grid">
        <TierCard tier={1} name={t('tier1Name')} description={t('tier1Desc')} features={["Email Verification","Phone Number OTP","Basic AML Screening"]} ctaLabel={t('ctaLabel')} levelName="basic-kyc" />
        <TierCard tier={2} name={t('tier2Name')} description={t('tier2Desc')} features={["Government ID Scan","Biometric Liveness Check","Global Sanctions Check"]} recommended ctaLabel={t('ctaLabel')} levelName="standard-kyc" />
        <TierCard tier={3} name={t('tier3Name')} description={t('tier3Desc')} features={["Proof of Address","Source of Funds Check","Continuous Monitoring"]} ctaLabel={t('ctaLabel')} levelName="enhanced-kyc" />
        <TierCard tier={4} name={t('tier4Name')} description={t('tier4Desc')} features={["Company Registry Check","UBO Disclosure","Director Verification"]} ctaLabel={t('ctaLabel')} levelName="business-kyb" />
        <TierCard tier={5} name={t('tier5Name')} description={t('tier5Desc')} features={["Bot Registry Check","Developer Identity","Smart Contract Audit"]} ctaLabel={t('ctaLabel')} levelName="agent-kya" />
      </div>

      {/* ── Mainnet Info Section ── */}
      <div className="mainnet-info glass-card">
        <div className="mainnet-info__header">
          <span className="badge badge-accent">Mainnet C-Chain</span>
          <h2 className="mainnet-info__title">{t('mainnetTitle')}</h2>
          <p className="mainnet-info__subtitle">{t('mainnetSubtitle')}</p>
        </div>

        <div className="mainnet-info__grid">
          <div className="mainnet-info__card">
            <h4>{t('mainnetStatus')}</h4>
            <p>{t('mainnetStatusDesc')}</p>
          </div>
          <div className="mainnet-info__card">
            <h4>{t('mainnetFee')}</h4>
            <p>{t('mainnetFeeDesc')}</p>
          </div>
        </div>

        <div className="mainnet-info__contracts">
          <h4>{t('mainnetContracts')}</h4>
          <div className="mainnet-info__contracts-list">
            <div className="mainnet-info__contract-item">
              <span className="contract-label">{t('mainnetStore')}:</span>
              <a 
                href="https://snowtrace.io/address/0xa116261Ed3a848A9E1cd34923D5A0442D1455F71" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contract-address"
              >
                0xa116261Ed3a848A9E1cd34923D5A0442D1455F71 ↗
              </a>
            </div>
            <div className="mainnet-info__contract-item">
              <span className="contract-label">{t('mainnetGate')}:</span>
              <a 
                href="https://snowtrace.io/address/0x01BEEA13A485c7bAD58f926E345325e9e3773bEe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contract-address"
              >
                0x01BEEA13A485c7bAD58f926E345325e9e3773bEe ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .tiers-container { padding-top: 2rem; padding-bottom: 5rem; }
        .tiers-header { text-align: center; margin-bottom: 4rem; margin-top: 1.5rem; }
        .tiers-title { font-size: 3rem; margin-bottom: 1rem; }
        .tiers-subtitle { margin: 0 auto; max-width: 600px; }
        .tiers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
        
        .mainnet-info { margin-top: 4rem; padding: 2.5rem; border-color: var(--border-accent); }
        .mainnet-info__header { margin-bottom: 2rem; }
        .mainnet-info__title { font-size: 1.8rem; font-weight: 800; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .mainnet-info__subtitle { color: var(--text-secondary); font-size: 1rem; }
        .mainnet-info__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2.5rem; }
        .mainnet-info__card h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary); }
        .mainnet-info__card p { color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; }
        .mainnet-info__contracts h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); }
        .mainnet-info__contracts-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .mainnet-info__contract-item { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border); }
        .contract-label { font-size: 0.88rem; font-weight: 600; color: var(--text-secondary); }
        .contract-address { font-family: monospace; font-size: 0.88rem; color: var(--accent-light); text-decoration: none; }
        .contract-address:hover { color: var(--accent); }

        @media (max-width: 768px) {
          .tiers-container { padding-top: 1rem; padding-bottom: 3rem; }
          .tiers-header { margin-bottom: 2.5rem; }
          .tiers-title { font-size: 2.25rem; }
          
          .mainnet-info { padding: 1.5rem; margin-top: 3rem; }
          .mainnet-info__grid { grid-template-columns: 1fr; gap: 1.25rem; }
          .mainnet-info__title { font-size: 1.5rem; }
          .mainnet-info__contract-item { gap: 0.5rem; }
        }
        @media (max-width: 480px) {
          .tiers-title { font-size: 1.8rem; }
        }
      ` }} />
    </div>
  );
}

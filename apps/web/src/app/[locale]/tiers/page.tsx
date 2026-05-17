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
      <style dangerouslySetInnerHTML={{ __html: `
        .tiers-container { padding-top: 2rem; padding-bottom: 5rem; }
        .tiers-header { text-align: center; margin-bottom: 4rem; margin-top: 1.5rem; }
        .tiers-title { font-size: 3rem; margin-bottom: 1rem; }
        .tiers-subtitle { margin: 0 auto; max-width: 600px; }
        .tiers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
        
        @media (max-width: 768px) {
          .tiers-container { padding-top: 1rem; padding-bottom: 3rem; }
          .tiers-header { margin-bottom: 2.5rem; }
          .tiers-title { font-size: 2.25rem; }
        }
        @media (max-width: 480px) {
          .tiers-title { font-size: 1.8rem; }
        }
      ` }} />
    </div>
  );
}

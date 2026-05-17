import { TierCard } from "@/components/TierCard";
import { useTranslations } from "next-intl";

export default function TiersPage() {
  const t = useTranslations('Tiers');

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '1.5rem' }}>
        <h1 className="section-title">{t('title')}</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>{t('subtitle')}</p>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <TierCard tier={1} name={t('tier1Name')} description={t('tier1Desc')} features={["Email Verification","Phone Number OTP","Basic AML Screening"]} ctaLabel={t('ctaLabel')} levelName="basic-kyc" />
        <TierCard tier={2} name={t('tier2Name')} description={t('tier2Desc')} features={["Government ID Scan","Biometric Liveness Check","Global Sanctions Check"]} recommended ctaLabel={t('ctaLabel')} levelName="standard-kyc" />
        <TierCard tier={3} name={t('tier3Name')} description={t('tier3Desc')} features={["Proof of Address","Source of Funds Check","Continuous Monitoring"]} ctaLabel={t('ctaLabel')} levelName="enhanced-kyc" />
        <TierCard tier={4} name={t('tier4Name')} description={t('tier4Desc')} features={["Company Registry Check","UBO Disclosure","Director Verification"]} ctaLabel={t('ctaLabel')} levelName="business-kyb" />
        <TierCard tier={5} name={t('tier5Name')} description={t('tier5Desc')} features={["Bot Registry Check","Developer Identity","Smart Contract Audit"]} ctaLabel={t('ctaLabel')} levelName="agent-kya" />
      </div>
    </div>
  );
}

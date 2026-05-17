import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface TierCardProps {
  tier: number;
  name: string;
  description: string;
  features: string[];
  recommended?: boolean;
  ctaLabel?: string;
  levelName?: string;
}

export function TierCard({ tier, name, description, features, recommended, ctaLabel, levelName }: TierCardProps) {
  const t = useTranslations('Tiers');
  const label = ctaLabel ?? t('ctaLabel');

  return (
    <div className={`glass-card ${recommended ? 'animate-glow' : ''}`} style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderColor: recommended ? 'var(--accent)' : 'var(--border)'
    }}>
      {recommended && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'white',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          boxShadow: 'var(--shadow-glow)',
          whiteSpace: 'nowrap'
        }}>
          {t('recommended')}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{name}</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tier {tier}</p>
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: recommended ? 'var(--accent-glow)' : 'var(--bg-secondary)',
          border: `1px solid ${recommended ? 'var(--accent)' : 'var(--border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          fontWeight: 800,
          color: recommended ? 'var(--accent)' : 'var(--text-primary)',
          flexShrink: 0
        }}>
          {tier}
        </div>
      </div>

      <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem', marginBottom: '1.5rem', flexGrow: 1, lineHeight: 1.6 }}>
        {description}
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {features.map((feature, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: '1px' }}>
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" fill={recommended ? "var(--accent-glow)" : "var(--bg-secondary)"} stroke={recommended ? "var(--accent)" : "var(--border)"} strokeWidth="1.5"/>
              <path d="M7.75 12L10.58 14.83L16.25 9.17004" stroke={recommended ? "var(--accent)" : "var(--text-tertiary)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={levelName ? `/verify?level=${levelName}` : '/verify'}
        className={`btn ${recommended ? 'btn-primary' : 'btn-secondary'}`}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {label}
      </Link>
    </div>
  );
}

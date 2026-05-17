import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function DevelopersDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const t = await getTranslations('DevelopersDocs');
  
  const keys = ['contracts', 'api'];
  if (!keys.includes(slug)) {
    notFound();
  }

  return (
    <div className="container dev-slug-container">
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="section-title dev-slug-title">{t(`${slug}.title`)}</h1>
        <p className="dev-slug-subtitle">{t(`${slug}.subtitle`)}</p>
      </div>
      
      <div className="glass-card dev-slug-card">
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          {t(`${slug}.p1`)}
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
          {t(`${slug}.p2`)}
        </p>
      </div>

      <div className="dev-slug-grid">
        <div className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', borderTop: '4px solid var(--accent)' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>{t(`${slug}.f1Title`)}</h3>
          <p style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{t(`${slug}.f1Desc`)}</p>
        </div>
        <div className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', borderTop: '4px solid var(--accent)' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>{t(`${slug}.f2Title`)}</h3>
          <p style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{t(`${slug}.f2Desc`)}</p>
        </div>
        <div className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', borderTop: '4px solid var(--accent)' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>{t(`${slug}.f3Title`)}</h3>
          <p style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{t(`${slug}.f3Desc`)}</p>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .dev-slug-container { padding-top: 120px; padding-bottom: 6rem; min-height: 80vh; }
        .dev-slug-title { font-size: 3rem; margin-bottom: 1rem; }
        .dev-slug-subtitle { font-size: 1.25rem; color: var(--accent); font-weight: 500; }
        .dev-slug-card { padding: 3rem; background: var(--bg-card); margin-bottom: 4rem; }
        .dev-slug-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
        
        @media (max-width: 768px) {
          .dev-slug-container { padding-top: 100px; padding-bottom: 4rem; }
          .dev-slug-title { font-size: 2.25rem; }
          .dev-slug-subtitle { font-size: 1.1rem; }
          .dev-slug-card { padding: 1.5rem; margin-bottom: 2rem; }
        }
        @media (max-width: 480px) {
          .dev-slug-container { padding-top: 80px; }
          .dev-slug-title { font-size: 1.75rem; }
        }
      ` }} />
    </div>
  );
}

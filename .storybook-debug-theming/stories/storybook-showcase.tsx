import React from 'react';

const COLORS = {
  ink: '#0f172a',
  inkMuted: '#475569',
  inkSoft: '#64748b',
  border: 'color-mix(in srgb, var(--ui-color-border, #cbd5e1) 82%, transparent)',
  borderStrong: 'color-mix(in srgb, var(--ui-color-border, #cbd5e1) 94%, #94a3b8 6%)',
  surface: 'var(--ui-color-surface, #ffffff)',
  surfaceAlt: 'color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, #eef4ff 4%)',
  canvas: 'linear-gradient(180deg, #f8fbff 0%, #f3f7fb 100%)',
  accent: '#2563eb',
  accentSoft: 'color-mix(in srgb, #2563eb 10%, white)',
  accentBorder: 'color-mix(in srgb, #2563eb 24%, white)',
  success: '#15803d',
  warning: '#b45309',
  danger: '#b42318'
} as const;

export const showcasePageStyle: React.CSSProperties = {
  display: 'grid',
  gap: 24,
  padding: 24,
  borderRadius: 24,
  background: COLORS.canvas,
  border: `1px solid ${COLORS.border}`,
  boxShadow: '0 18px 56px rgba(15, 23, 42, 0.08)'
};

export const showcaseHeroStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'minmax(0, 1.45fr) minmax(220px, 0.85fr)',
  alignItems: 'start'
};

export const showcaseHeroBodyStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12
};

export const showcaseSurfaceStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
  padding: 20,
  borderRadius: 20,
  border: `1px solid ${COLORS.borderStrong}`,
  background: COLORS.surface,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)'
};

export const showcasePanelStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  padding: 16,
  borderRadius: 16,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.surfaceAlt
};

export const showcaseMetaGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'
};

export const showcaseMetricStyle: React.CSSProperties = {
  display: 'grid',
  gap: 6,
  minHeight: 84,
  padding: 16,
  borderRadius: 16,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.surface
};

export const showcaseEyebrowStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.4,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: COLORS.accent
};

export const showcaseTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 32,
  lineHeight: 1.12,
  fontWeight: 700,
  color: COLORS.ink
};

export const showcaseBodyStyle: React.CSSProperties = {
  margin: 0,
  maxWidth: 680,
  fontSize: 15,
  lineHeight: 1.6,
  color: COLORS.inkMuted
};

export const showcaseCaptionStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.5,
  color: COLORS.inkSoft
};

export const showcaseLabelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.4,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: COLORS.inkSoft
};

export const showcaseValueStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.15,
  fontWeight: 700,
  color: COLORS.ink
};

export const showcaseInfoStyle: React.CSSProperties = {
  display: 'grid',
  gap: 10,
  alignContent: 'start',
  padding: 18,
  borderRadius: 20,
  border: `1px solid ${COLORS.accentBorder}`,
  background: COLORS.accentSoft,
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.7)'
};

export const showcaseChipRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8
};

export const showcaseChipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 28,
  padding: '0 10px',
  borderRadius: 999,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.surface,
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.inkMuted
};

export const showcaseSidebarItemStyle: React.CSSProperties = {
  display: 'grid',
  gap: 4,
  padding: 12,
  borderRadius: 14,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.surface
};

export const showcaseMonoStyle: React.CSSProperties = {
  fontFamily: 'IBM Plex Mono, SFMono-Regular, Menlo, monospace'
};

export function toneColor(tone: 'neutral' | 'success' | 'warning' | 'danger' = 'neutral') {
  if (tone === 'success') return COLORS.success;
  if (tone === 'warning') return COLORS.warning;
  if (tone === 'danger') return COLORS.danger;
  return COLORS.inkSoft;
}

type ShowcasePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  meta?: Array<{ label: string; value: string; tone?: 'neutral' | 'success' | 'warning' | 'danger' }>;
  children: React.ReactNode;
};

export function ShowcasePage({ eyebrow, title, description, meta = [], children }: ShowcasePageProps) {
  return (
    <div style={showcasePageStyle}>
      <div style={showcaseHeroStyle}>
        <div style={showcaseHeroBodyStyle}>
          <div style={showcaseEyebrowStyle}>{eyebrow}</div>
          <h2 style={showcaseTitleStyle}>{title}</h2>
          <p style={showcaseBodyStyle}>{description}</p>
        </div>
        <div style={showcaseInfoStyle}>
          <div style={showcaseLabelStyle}>Quality Target</div>
          <div style={{ ...showcaseValueStyle, fontSize: 20 }}>Premium SaaS Pattern</div>
          <p style={showcaseCaptionStyle}>
            Stories here are meant to validate spacing, visual hierarchy, state contrast, and interaction polish.
          </p>
          {meta.length ? (
            <div style={showcaseMetaGridStyle}>
              {meta.map((item) => (
                <div key={item.label} style={showcaseMetricStyle}>
                  <div style={showcaseLabelStyle}>{item.label}</div>
                  <div style={{ ...showcaseValueStyle, fontSize: 18, color: toneColor(item.tone) }}>{item.value}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}

type ShowcaseSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function ShowcaseSection({ eyebrow, title, description, children }: ShowcaseSectionProps) {
  return (
    <section style={showcaseSurfaceStyle}>
      <div style={{ display: 'grid', gap: 8 }}>
        {eyebrow ? <div style={showcaseEyebrowStyle}>{eyebrow}</div> : null}
        <div style={{ margin: 0, fontSize: 24, lineHeight: 1.2, fontWeight: 700, color: COLORS.ink }}>{title}</div>
        {description ? <p style={showcaseBodyStyle}>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}


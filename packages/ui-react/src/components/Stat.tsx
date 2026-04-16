import React from 'react';

const TONE_ACCENTS = {
  neutral: '#475569',
  brand: '#2563eb',
  info: '#0891b2',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
} as const;

const SIZE_STYLES = {
  sm: { label: 12, value: 20, meta: 11, icon: 14, gap: 6, padding: '12px' },
  md: { label: 12, value: 24, meta: 12, icon: 16, gap: 8, padding: '14px' },
  lg: { label: 13, value: 30, meta: 13, icon: 18, gap: 10, padding: '16px' },
} as const;

export type StatProps = Omit<React.HTMLAttributes<HTMLElement>, 'label'> & {
  as?: keyof JSX.IntrinsicElements;
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
  trend?: React.ReactNode;
  description?: React.ReactNode;
  tone?: keyof typeof TONE_ACCENTS;
  size?: keyof typeof SIZE_STYLES;
  variant?: 'plain' | 'card';
};

export const Stat = React.forwardRef<HTMLElement, StatProps>(function Stat(
  {
    as = 'section',
    label,
    value,
    icon,
    meta,
    trend,
    description,
    tone = 'neutral',
    size = 'md',
    variant = 'plain',
    className,
    style,
    children,
    ...rest
  },
  forwardedRef
) {
  const Component = as as keyof JSX.IntrinsicElements;
  const accent = TONE_ACCENTS[tone];
  const sizing = SIZE_STYLES[size];

  return React.createElement(
    Component,
    {
      ref: forwardedRef,
      className,
      style: {
        background: variant === 'card' ? 'var(--ui-color-surface, #ffffff)' : 'transparent',
        border: variant === 'card' ? '1px solid var(--ui-color-border, #dbe4ef)' : 'none',
        borderRadius: variant === 'card' ? 'var(--ui-radius-lg, 16px)' : 0,
        display: 'grid',
        gap: sizing.gap,
        minWidth: 0,
        padding: variant === 'card' ? sizing.padding : 0,
        ...style,
      },
      ...rest,
    },
    <div style={{ alignItems: 'center', display: 'flex', gap: 10, justifyContent: 'space-between', minWidth: 0 }}>
      <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: sizing.label, lineHeight: 1.35, minWidth: 0 }}>
        {label}
      </div>
      {icon ? (
        <div
          aria-hidden="true"
          style={{
            alignItems: 'center',
            background: `color-mix(in srgb, ${accent} 12%, transparent)`,
            borderRadius: 999,
            color: accent,
            display: 'inline-flex',
            flex: '0 0 auto',
            justifyContent: 'center',
            minHeight: sizing.icon + 12,
            minWidth: sizing.icon + 12,
          }}
        >
          {icon}
        </div>
      ) : null}
    </div>,
    <div style={{ color: 'var(--ui-color-text, #0f172a)', fontSize: sizing.value, fontWeight: 700, lineHeight: 1.05 }}>
      {value}
    </div>,
    description ? (
      <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: sizing.meta, lineHeight: 1.45 }}>
        {description}
      </div>
    ) : null,
    meta || trend ? (
      <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {meta ? (
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: sizing.meta, lineHeight: 1.35 }}>
            {meta}
          </div>
        ) : null}
        {trend ? (
          <div style={{ color: accent, fontSize: sizing.meta, fontWeight: 600, lineHeight: 1.35 }}>
            {trend}
          </div>
        ) : null}
      </div>
    ) : null,
    children
  );
});

Stat.displayName = 'Stat';

export default Stat;

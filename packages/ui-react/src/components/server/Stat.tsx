import React from 'react';
import { Icon } from './Icon';

// Theme tokens first (contrast-checked text steps from ThemeProvider / applyTheme, then the raw
// tone colour), the old fixed colours only as the last fallback. They were hard-coded, so a custom
// brand or dark theme never reached Stat and MetricCard.
const TONE_ACCENTS = {
  neutral: 'var(--ui-color-muted, #475569)',
  brand: 'var(--ui-color-accent-text, var(--ui-color-primary, #2563eb))',
  info: 'var(--ui-color-info-text, var(--ui-color-info, #0e7490))',
  success: 'var(--ui-color-success-text, var(--ui-color-success, #15803d))',
  warning: 'var(--ui-color-warning-text, var(--ui-color-warning, #b45309))',
  danger: 'var(--ui-color-danger-text, var(--ui-color-danger, #c81e1e))',
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
  /** An Editora icon name ("wallet"), or your own element. */
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
        // --ui-radius-lg was never defined, so this was always 16px; follow Card's radius instead.
        borderRadius: variant === 'card' ? 'var(--base-card-radius, calc(var(--ui-radius, 6px) + 2px))' : 0,
        display: 'grid',
        gap: sizing.gap,
        minWidth: 0,
        padding: variant === 'card' ? sizing.padding : 0,
        ...style,
      },
      ...rest,
    },
    <div style={{ alignItems: 'center', display: 'flex', gap: 10, justifyContent: 'space-between', minWidth: 0 }}>
      <div style={{ color: 'var(--ui-color-muted, #526175)', fontSize: sizing.label, lineHeight: 1.35, minWidth: 0 }}>
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
          {/* A string is an Editora icon name, as on Button and Sidebar items. */}
          {typeof icon === 'string' ? <Icon name={icon} size={sizing.icon} decorative /> : icon}
        </div>
      ) : null}
    </div>,
    <div style={{ color: 'var(--ui-color-text, #0f172a)', fontSize: sizing.value, fontWeight: 700, lineHeight: 1.05 }}>
      {value}
    </div>,
    description ? (
      <div style={{ color: 'var(--ui-color-muted, #526175)', fontSize: sizing.meta, lineHeight: 1.45 }}>
        {description}
      </div>
    ) : null,
    meta || trend ? (
      <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {meta ? (
          <div style={{ color: 'var(--ui-color-muted, #526175)', fontSize: sizing.meta, lineHeight: 1.35 }}>
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

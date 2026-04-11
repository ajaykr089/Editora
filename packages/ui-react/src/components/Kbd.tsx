import React from 'react';

const SIZE_STYLES = {
  sm: { fontSize: 11, gap: 4, inset: '2px 6px' },
  md: { fontSize: 12, gap: 5, inset: '3px 8px' },
  lg: { fontSize: 13, gap: 6, inset: '4px 10px' },
} as const;

const TONE_STYLES = {
  default: { background: '#f8fafc', border: '#cbd5e1', color: '#0f172a' },
  neutral: { background: '#f8fafc', border: '#cbd5e1', color: '#0f172a' },
  brand: { background: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
  info: { background: '#ecfeff', border: '#a5f3fc', color: '#0f766e' },
  success: { background: '#f0fdf4', border: '#bbf7d0', color: '#15803d' },
  warning: { background: '#fffbeb', border: '#fde68a', color: '#b45309' },
  danger: { background: '#fef2f2', border: '#fecaca', color: '#b91c1c' },
} as const;

export type KbdProps = React.HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  keys?: readonly React.ReactNode[];
  separator?: React.ReactNode;
  size?: keyof typeof SIZE_STYLES;
  tone?: keyof typeof TONE_STYLES;
};

function resolveItems(keys: readonly React.ReactNode[] | undefined, children: React.ReactNode) {
  if (keys?.length) return keys;
  return React.Children.toArray(children);
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  {
    as = 'span',
    keys,
    separator = '+',
    size = 'md',
    tone = 'default',
    className,
    style,
    children,
    ...rest
  },
  forwardedRef
) {
  const Component = as as keyof JSX.IntrinsicElements;
  const items = resolveItems(keys, children);
  const sizing = SIZE_STYLES[size];
  const colors = TONE_STYLES[tone];

  return React.createElement(
    Component,
    {
      ref: forwardedRef,
      className,
      style: {
        alignItems: 'center',
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: sizing.gap,
        lineHeight: 1,
        verticalAlign: 'middle',
        ...style,
      },
      ...rest,
    },
    items.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 ? (
          <span
            aria-hidden="true"
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              color: 'var(--ui-color-muted, #64748b)',
              display: 'inline-flex',
              fontSize: sizing.fontSize,
              lineHeight: 1,
            }}
          >
            {separator}
          </span>
        ) : null}
        <kbd
          style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderBottomWidth: 2,
            borderRadius: 8,
            boxShadow: '0 1px 0 rgba(15, 23, 42, 0.06)',
            color: colors.color,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            display: 'inline-flex',
            fontFamily: "var(--ui-font-family-mono, var(--font-mono, ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace))",
            fontSize: sizing.fontSize,
            fontWeight: 600,
            lineHeight: 1,
            minHeight: 24,
            minWidth: 24,
            padding: sizing.inset,
            textAlign: 'center',
            textTransform: 'uppercase',
            verticalAlign: 'middle',
            whiteSpace: 'nowrap',
          }}
        >
          {item}
        </kbd>
      </React.Fragment>
    ))
  );
});

Kbd.displayName = 'Kbd';

export default Kbd;

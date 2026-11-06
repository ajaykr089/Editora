import React from 'react';
import { toneColors } from './_tones';

const SIZE_STYLES = {
  sm: { fontSize: 12, padding: '2px 6px', radius: 8 },
  md: { fontSize: 13, padding: '3px 8px', radius: 10 },
  lg: { fontSize: 14, padding: '4px 10px', radius: 12 },
} as const;

const TONE_STYLES = {
  default: toneColors('default'),
  neutral: toneColors('neutral'),
  brand: toneColors('brand'),
  info: toneColors('info'),
  success: toneColors('success'),
  warning: toneColors('warning'),
  danger: toneColors('danger'),
} as const;

export type CodeSnippetProps = React.HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  code?: string;
  tone?: keyof typeof TONE_STYLES;
  size?: keyof typeof SIZE_STYLES;
  block?: boolean;
  children?: React.ReactNode;
};

export const CodeSnippet = React.forwardRef<HTMLElement, CodeSnippetProps>(function CodeSnippet(
  {
    as = 'code',
    code,
    tone = 'default',
    size = 'md',
    block = false,
    className,
    style,
    children,
    ...rest
  },
  forwardedRef
) {
  const Component = as as keyof JSX.IntrinsicElements;
  const colors = TONE_STYLES[tone];
  const sizing = SIZE_STYLES[size];
  const content = code ?? children;

  return React.createElement(
    Component,
    {
      ref: forwardedRef,
      className,
      style: {
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: sizing.radius,
        color: colors.color,
        display: block ? 'block' : 'inline-block',
        fontFamily: "var(--ui-font-family-mono, var(--font-mono, ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace))",
        fontSize: sizing.fontSize,
        lineHeight: 1.5,
        maxWidth: '100%',
        overflowX: block ? 'auto' : 'visible',
        padding: sizing.padding,
        whiteSpace: block ? 'pre-wrap' : 'nowrap',
        ...style,
      },
      ...rest,
    },
    content
  );
});

CodeSnippet.displayName = 'CodeSnippet';

export default CodeSnippet;

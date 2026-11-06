// Tone colours from the theme, shared by the small server-safe components (Kbd, CodeSnippet, Stat).
// Each value is a CSS expression: the theme token first (set by ThemeProvider / applyTheme, with
// contrast-checked *-text steps), the old fixed colour only as the last fallback, so a custom brand
// palette or a dark theme reaches these components.
const SURFACE = 'var(--ui-color-surface, #ffffff)';

const TONE_BASE = {
  brand: 'var(--ui-color-primary, #2563eb)',
  info: 'var(--ui-color-info, #0891b2)',
  success: 'var(--ui-color-success, #16a34a)',
  warning: 'var(--ui-color-warning, #d97706)',
  danger: 'var(--ui-color-danger, #dc2626)',
} as const;

const TONE_TEXT = {
  brand: 'var(--ui-color-accent-text, var(--ui-color-primary, #1d4ed8))',
  info: 'var(--ui-color-info-text, var(--ui-color-info, #0f766e))',
  success: 'var(--ui-color-success-text, var(--ui-color-success, #15803d))',
  warning: 'var(--ui-color-warning-text, var(--ui-color-warning, #b45309))',
  danger: 'var(--ui-color-danger-text, var(--ui-color-danger, #b91c1c))',
} as const;

export type Tone = 'default' | 'neutral' | keyof typeof TONE_BASE;

export function toneColors(tone: Tone): { background: string; border: string; color: string } {
  if (tone === 'default' || tone === 'neutral') {
    return {
      background: 'var(--ui-color-surface-alt, #f8fafc)',
      border: 'var(--ui-color-border, #cbd5e1)',
      color: 'var(--ui-color-text, #0f172a)',
    };
  }
  return {
    background: `color-mix(in srgb, ${TONE_BASE[tone]} 8%, ${SURFACE})`,
    border: `color-mix(in srgb, ${TONE_BASE[tone]} 32%, ${SURFACE})`,
    color: TONE_TEXT[tone],
  };
}

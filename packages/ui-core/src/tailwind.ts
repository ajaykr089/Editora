/**
 * Tailwind CSS support: Editora's theme tokens as Tailwind colours, radius and fonts, so app markup
 * styled with Tailwind and Editora's components share one theme, plus variants for styling the
 * components' parts and states.
 *
 * Tailwind v3 (tailwind.config.js):
 *
 *   const { editoraPreset } = require('@editora/ui-core/tailwind');
 *   module.exports = { presets: [editoraPreset], content: ['./src/**\/*.{ts,tsx}'] };
 *
 * Tailwind v4 (your CSS):
 *
 *   @import "tailwindcss";
 *   @import "@editora/ui-core/tailwind.css";
 *
 * Then: `bg-ui-surface text-ui-text border-ui-border`, `rounded-ui`, `font-ui`, and on a component
 * `part-[button]:rounded-full` (v3; `[&::part(button)]:rounded-full` in v4) or `ui-open:shadow-lg`.
 * Component internals live in a shadow root, which utility classes cannot reach: style them through
 * their parts (`::part(...)`, listed in each component's API page) or their custom properties.
 *
 * This module is plain data with no dependency on tailwindcss, safe to load in a Node config file.
 */

/** Tailwind colour name (used as `ui-<name>`) -> the Editora token it reads. */
export const TAILWIND_COLOR_TOKENS: Record<string, string> = {
  background: 'var(--ui-color-background, #ffffff)',
  surface: 'var(--ui-color-surface, #ffffff)',
  'surface-alt': 'var(--ui-color-surface-alt, #f8fafc)',
  'surface-elevated': 'var(--ui-color-surface-elevated, #ffffff)',
  'surface-subtle': 'var(--ui-color-surface-subtle, #f1f5f9)',
  text: 'var(--ui-color-text, #0f172a)',
  'text-strong': 'var(--ui-color-text-strong, #020617)',
  'text-secondary': 'var(--ui-color-text-secondary, #334155)',
  muted: 'var(--ui-color-muted, #526175)',
  placeholder: 'var(--ui-color-placeholder, #94a3b8)',
  border: 'var(--ui-color-border, #e2e8f0)',
  line: 'var(--ui-color-line, #e2e8f0)',
  'line-strong': 'var(--ui-color-line-strong, #cbd5e1)',
  'line-subtle': 'var(--ui-color-line-subtle, #f1f5f9)',
  'field-border': 'var(--ui-color-field-border, #94a3b8)',
  fill: 'var(--ui-color-fill, #f1f5f9)',
  'fill-hover': 'var(--ui-color-fill-hover, #e2e8f0)',
  'fill-active': 'var(--ui-color-fill-active, #cbd5e1)',
  primary: 'var(--ui-color-primary, #2563eb)',
  'primary-hover': 'var(--ui-color-primary-hover, #1d4ed8)',
  'on-primary': 'var(--ui-color-foreground-on-primary, #ffffff)',
  accent: 'var(--ui-color-accent, #7c3aed)',
  'accent-text': 'var(--ui-color-accent-text, #1d4ed8)',
  'accent-subtle': 'var(--ui-color-accent-subtle, #eff6ff)',
  success: 'var(--ui-color-success, #15803d)',
  warning: 'var(--ui-color-warning, #b45309)',
  danger: 'var(--ui-color-danger, #dc2626)',
  info: 'var(--ui-color-info, #0e7490)',
  'success-text': 'var(--ui-color-success-text, #15803d)',
  'warning-text': 'var(--ui-color-warning-text, #b45309)',
  'danger-text': 'var(--ui-color-danger-text, #b91c1c)',
  'info-text': 'var(--ui-color-info-text, #0e7490)',
  'focus-ring': 'var(--ui-color-focus-ring, #2563eb)',
  'chart-1': 'var(--ui-chart-1, var(--ui-color-primary, #2563eb))',
  'chart-2': 'var(--ui-chart-2, var(--ui-color-info, #0e7490))',
  'chart-3': 'var(--ui-chart-3, var(--ui-color-success, #15803d))',
  'chart-4': 'var(--ui-chart-4, #8b5cf6)',
  'chart-5': 'var(--ui-chart-5, var(--ui-color-danger, #dc2626))',
  'chart-6': 'var(--ui-chart-6, #db2777)',
};

/** State variants: `ui-open:`, `ui-disabled:`, ... match the attributes Editora components set. */
export const TAILWIND_STATE_VARIANTS: Record<string, string> = {
  'ui-open': '&[open]',
  'ui-closed': '&:not([open])',
  'ui-disabled': '&[disabled]',
  'ui-invalid': '&:is([invalid], [aria-invalid="true"])',
  'ui-checked': '&:is([checked], [aria-checked="true"])',
  'ui-selected': '&:is([selected], [aria-selected="true"])',
  'ui-loading': '&:is([loading], [state="loading"])',
};

type TailwindPluginApi = {
  addVariant: (name: string, definition: string | string[]) => void;
  matchVariant?: (name: string, fn: (value: string) => string) => void;
};

/** Tailwind v3 plugin (a plain function, the form Tailwind accepts without its plugin helper). */
export function editoraTailwindPlugin({ addVariant, matchVariant }: TailwindPluginApi): void {
  for (const [name, selector] of Object.entries(TAILWIND_STATE_VARIANTS)) addVariant(name, selector);
  // part-[button]:rounded-full -> .x::part(button) { border-radius: ... } (Tailwind 3.2+).
  if (matchVariant) matchVariant('part', (value) => `&::part(${value.replace(/[^a-zA-Z0-9_-]/g, '')})`);
}

/** Tailwind v3 preset: put it in `presets`. */
export const editoraPreset = {
  theme: {
    extend: {
      colors: { ui: { ...TAILWIND_COLOR_TOKENS } },
      borderRadius: {
        ui: 'var(--ui-radius, 6px)',
        'ui-control': 'var(--ui-control-radius-2, var(--ui-radius, 6px))',
        'ui-control-sm': 'var(--ui-control-radius-1, var(--ui-radius, 4px))',
      },
      fontFamily: {
        ui: 'var(--ui-font-family, Inter, system-ui, sans-serif)',
        'ui-heading': 'var(--ui-font-family-heading, var(--ui-font-family, Inter, system-ui, sans-serif))',
        'ui-mono': 'var(--ui-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
      },
      boxShadow: {
        'ui-sm': 'var(--ui-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.06))',
        'ui-md': 'var(--ui-shadow-md, 0 4px 12px rgba(15, 23, 42, 0.08))',
        'ui-lg': 'var(--ui-shadow-lg, 0 12px 32px rgba(15, 23, 42, 0.12))',
      },
      ringColor: { 'ui-focus': 'var(--ui-color-focus-ring, #2563eb)' },
    },
  },
  plugins: [editoraTailwindPlugin],
};

/** Tailwind v4: the same mapping as CSS, shipped as `@editora/ui-core/tailwind.css`. */
export const TAILWIND_V4_CSS = [
  '/* Editora theme tokens for Tailwind v4: @import "@editora/ui-core/tailwind.css"; after @import "tailwindcss". */',
  '@theme inline {',
  ...Object.entries(TAILWIND_COLOR_TOKENS).map(([name, value]) => `  --color-ui-${name}: ${value};`),
  '  --radius-ui: var(--ui-radius, 6px);',
  '  --radius-ui-control: var(--ui-control-radius-2, var(--ui-radius, 6px));',
  '  --radius-ui-control-sm: var(--ui-control-radius-1, var(--ui-radius, 4px));',
  '  --font-ui: var(--ui-font-family, Inter, system-ui, sans-serif);',
  '  --font-ui-heading: var(--ui-font-family-heading, var(--ui-font-family, Inter, system-ui, sans-serif));',
  '  --font-ui-mono: var(--ui-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);',
  '  --shadow-ui-sm: var(--ui-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.06));',
  '  --shadow-ui-md: var(--ui-shadow-md, 0 4px 12px rgba(15, 23, 42, 0.08));',
  '  --shadow-ui-lg: var(--ui-shadow-lg, 0 12px 32px rgba(15, 23, 42, 0.12));',
  '}',
  '',
  ...Object.entries(TAILWIND_STATE_VARIANTS).map(([name, selector]) => `@custom-variant ${name} (${selector});`),
  '',
].join('\n');

export default editoraPreset;

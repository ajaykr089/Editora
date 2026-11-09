import type { ThemeTokens } from './theme';

/**
 * Semantic layer of the design tokens.
 *
 * Components should read roles ("the hover fill", "the focus ring", "control height 2"),
 * not pick a step off a colour scale themselves. Every value here is derived from the
 * 12-step scales of the active theme, so it follows the accent palette, the gray scale
 * and light/dark mode without a component knowing about any of them.
 *
 * Step meaning follows the Radix Colors convention:
 *   1-2 app/subtle background, 3-5 component fill (rest/hover/active),
 *   6-8 borders (subtle/default/strong), 9-10 solid fill (rest/hover),
 *   11-12 text (secondary/strong).
 */
export type SemanticTokenMap = Record<string, string>;

const CONTROL_SIZES = ['1', '2', '3', '4'] as const;

/** Radix Themes control metrics: size 1 = 24px, 2 = 32px (the default), 3 = 40px, 4 = 48px. */
type ControlScale = Record<(typeof CONTROL_SIZES)[number], string>;
type Density = 'compact' | 'default' | 'comfortable';
// Per theme density (ThemeTokens.density). Default = Radix Themes metrics.
const CONTROL_HEIGHTS: Record<Density, ControlScale> = {
  compact: { '1': '20px', '2': '28px', '3': '36px', '4': '44px' },
  default: { '1': '24px', '2': '32px', '3': '40px', '4': '48px' },
  comfortable: { '1': '28px', '2': '36px', '3': '44px', '4': '52px' },
};
const CONTROL_FONT_SIZES: Record<Density, ControlScale> = {
  compact: { '1': '12px', '2': '13px', '3': '15px', '4': '17px' },
  default: { '1': '12px', '2': '14px', '3': '16px', '4': '18px' },
  comfortable: { '1': '13px', '2': '15px', '3': '16px', '4': '18px' },
};
const CONTROL_PADDINGS_INLINE: Record<Density, ControlScale> = {
  compact: { '1': '6px', '2': '10px', '3': '14px', '4': '18px' },
  default: { '1': '8px', '2': '12px', '3': '16px', '4': '20px' },
  comfortable: { '1': '10px', '2': '14px', '3': '18px', '4': '22px' },
};
const DENSITY_GAP: Record<Density, string> = { compact: '6px', default: '8px', comfortable: '12px' };
/** Extra radius, on top of the theme radius, for the larger control sizes (Radix: radius-2, radius-2, radius-3, radius-4). */
const CONTROL_RADIUS_EXTRA: Record<(typeof CONTROL_SIZES)[number], number> = { '1': 0, '2': 0, '3': 2, '4': 4 };

export function deriveSemanticTokens(tokens: ThemeTokens): SemanticTokenMap {
  const gray = tokens.palette?.gray || {};
  const accent = tokens.palette?.accent || {};
  const radiusScale = tokens.radiusScale || {};
  const c = tokens.colors;
  const vars: SemanticTokenMap = {};

  const put = (name: string, value: string | undefined) => {
    if (value) vars[name] = value;
  };

  // Neutral roles: they only exist when the theme carries a gray scale.
  put('--ui-color-surface-subtle', gray['2']);
  put('--ui-color-fill', gray['3']);
  put('--ui-color-fill-hover', gray['4']);
  put('--ui-color-fill-active', gray['5']);
  put('--ui-color-line-subtle', gray['6']);
  put('--ui-color-line', gray['7']);
  put('--ui-color-line-strong', gray['8']);
  put('--ui-color-text-secondary', gray['11'] || c.muted);
  put('--ui-color-text-strong', gray['12'] || c.text);
  // Field outlines (inputs, selects, text areas, pickers) are the only visible edge of the control,
  // so they need 3:1 against the surface (WCAG 1.4.11); --ui-color-line is a divider, about 1.6:1.
  // Half the text colour into the surface gives about 3.4:1 on white and more in dark themes.
  const fieldSurface = c.surface || c.background;
  put('--ui-color-field-border', c.text && fieldSurface ? `color-mix(in srgb, ${c.text} 52%, ${fieldSurface})` : undefined);
  put('--ui-color-field-border-hover', c.text && fieldSurface ? `color-mix(in srgb, ${c.text} 66%, ${fieldSurface})` : undefined);

  // Accent roles.
  // (`--ui-color-accent` itself is left alone: ui-chart reads it as a second series colour.)
  put('--ui-color-accent-subtle', accent['2']);
  put('--ui-color-accent-fill', accent['3']);
  put('--ui-color-accent-fill-hover', accent['4']);
  put('--ui-color-accent-fill-active', accent['5']);
  put('--ui-color-accent-line', accent['7']);
  put('--ui-color-accent-solid', accent['9'] || c.primary);
  put('--ui-color-accent-solid-hover', accent['10'] || c.primaryHover || c.primary);
  put('--ui-color-accent-text', accent['11']);
  // The brand accent for dark surfaces (contrast variants, dark panels): a light tint of the primary
  // colour, readable on near-black. Those variants hard-coded a light blue (#93c5fd), so they never
  // followed a custom brand.
  put('--ui-color-accent-on-dark', c.primary ? `color-mix(in srgb, ${c.primary} 45%, #ffffff)` : undefined);

  // Tokens that components already read but the theme never defined, so they always fell
  // back to a hard-coded Tailwind-era colour (and stayed light in dark mode).
  put('--ui-color-surface-elevated', tokens.surfaces?.panelSolid || c.surfaceAlt || c.surface);
  put('--ui-color-info', c.info);
  // Placeholder text: 62% of the text colour keeps it at 4.5:1 or better on the field background (light and dark).
  put('--ui-color-placeholder', c.text ? `color-mix(in srgb, ${c.text} 62%, transparent)` : undefined);

  // Focus ring: one definition for every focusable surface.
  put('--ui-ring-color', c.focusRing || c.primary);
  vars['--ui-ring-width'] = '2px';
  vars['--ui-ring-offset'] = '2px';

  // Control scale shared by buttons, inputs, selects and the like, at the theme's density.
  const density: Density = tokens.density === 'compact' || tokens.density === 'comfortable' ? tokens.density : 'default';
  vars['--ui-density'] = density;
  vars['--ui-density-gap'] = DENSITY_GAP[density];
  vars['--ui-default-gap'] = DENSITY_GAP[density];
  for (const size of CONTROL_SIZES) {
    vars[`--ui-control-height-${size}`] = CONTROL_HEIGHTS[density][size];
    vars[`--ui-control-font-size-${size}`] = CONTROL_FONT_SIZES[density][size];
    vars[`--ui-control-padding-inline-${size}`] = CONTROL_PADDINGS_INLINE[density][size];
    // Built on the theme's single `radius`, so `radius: '10px'` still reshapes every control.
    const extra = CONTROL_RADIUS_EXTRA[size];
    const radius = tokens.radius || radiusScale['2'] || '6px';
    vars[`--ui-control-radius-${size}`] = extra ? `calc(${radius} + ${extra}px)` : radius;
  }

  // Overlay motion: a decelerating enter and a quicker, plainer exit.
  vars['--ui-motion-enter-easing'] = 'cubic-bezier(0.16, 1, 0.3, 1)';
  vars['--ui-motion-exit-easing'] = 'cubic-bezier(0.4, 0, 1, 1)';

  // Shared aliases for names that components and docs already use.
  put('--ui-font-family-mono', tokens.typography?.codeFamily || 'monospace');
  put('--font-mono', tokens.typography?.codeFamily || 'monospace');
  put('--ui-breakpoint-xl', tokens.breakpoints?.xl || '1280px');

  return vars;
}

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

const CONTROL_SIZES = ['1', '2', '3'] as const;

/** Radix Themes control metrics: size 1 = 24px, 2 = 32px, 3 = 40px. */
const CONTROL_HEIGHT: Record<(typeof CONTROL_SIZES)[number], string> = { '1': '24px', '2': '32px', '3': '40px' };
const CONTROL_FONT_SIZE: Record<(typeof CONTROL_SIZES)[number], string> = { '1': '12px', '2': '14px', '3': '16px' };
const CONTROL_PADDING_INLINE: Record<(typeof CONTROL_SIZES)[number], string> = { '1': '8px', '2': '12px', '3': '16px' };
/** Which entry of the radius scale a control of each size uses. */
const CONTROL_RADIUS_STEP: Record<(typeof CONTROL_SIZES)[number], string> = { '1': '2', '2': '2', '3': '3' };

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

  // Tokens that components already read but the theme never defined, so they always fell
  // back to a hard-coded Tailwind-era colour (and stayed light in dark mode).
  put('--ui-color-surface-elevated', tokens.surfaces?.panelSolid || c.surfaceAlt || c.surface);
  put('--ui-color-info', c.info);

  // Focus ring: one definition for every focusable surface.
  put('--ui-ring-color', c.focusRing || c.primary);
  vars['--ui-ring-width'] = '2px';
  vars['--ui-ring-offset'] = '2px';

  // Control scale shared by buttons, inputs, selects and the like.
  for (const size of CONTROL_SIZES) {
    vars[`--ui-control-height-${size}`] = CONTROL_HEIGHT[size];
    vars[`--ui-control-font-size-${size}`] = CONTROL_FONT_SIZE[size];
    vars[`--ui-control-padding-inline-${size}`] = CONTROL_PADDING_INLINE[size];
    put(`--ui-control-radius-${size}`, radiusScale[CONTROL_RADIUS_STEP[size]] || tokens.radius);
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

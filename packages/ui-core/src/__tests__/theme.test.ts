import { describe, it, expect, beforeEach } from 'vitest';
import {
  applyTheme,
  createThemeTokens,
  defaultTokens,
  deriveForegroundOnPrimary,
  readableForeground,
  registerThemeHost,
  withAccentPalette
} from '../theme';

describe('theme.applyTheme', () => {
  beforeEach(() => {
    document.documentElement.style.cssText = '';
  });

  it('applies CSS variables to documentElement', () => {
    applyTheme(defaultTokens);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-color-primary').trim()).toBe(defaultTokens.colors.primary);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-color-border').trim()).toBe(defaultTokens.colors.border);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-color-focus-ring').trim()).toBe(defaultTokens.colors.focusRing);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-color-surface-alt').trim()).toBe(defaultTokens.colors.surfaceAlt);
    // legacy variable (backwards compatibility)
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-primary').trim()).toBe(defaultTokens.colors.primary);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-border').trim()).toBe(defaultTokens.colors.border);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-radius').trim()).toBe(defaultTokens.radius);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-default-gap').trim()).toBe('8px');
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-default-font-size').trim()).toBe('14px');
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-default-line-height').trim()).toBe('20px');
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-default-letter-spacing').trim()).toBe('0em');
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-font-family')).toContain('-apple-system');
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-motion-easing')).toBe(defaultTokens.motion?.easing);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--gray-1').trim()).toBe(defaultTokens.palette?.gray?.['1']);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--accent-9').trim()).toBe(defaultTokens.palette?.accent?.['9']);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--space-4').trim()).toBe(defaultTokens.spaceScale?.['4']);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--radius-3').trim()).toBe(defaultTokens.radiusScale?.['3']);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--shadow-3').trim()).toBe(defaultTokens.shadows?.['3']);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--black-a3').trim()).toBe(defaultTokens.palette?.blackAlpha?.['3']);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--white-a10').trim()).toBe(defaultTokens.palette?.whiteAlpha?.['10']);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-menu-bg').trim()).toBe(defaultTokens.components?.menu?.bg);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-panel-shadow').trim()).toBe(defaultTokens.components?.panel?.shadow);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-avatar-radius').trim()).toBe(defaultTokens.components?.avatar?.radius);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-badge-radius').trim()).toBe(defaultTokens.components?.badge?.radius);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-breadcrumb-radius').trim()).toBe(defaultTokens.components?.breadcrumb?.radius);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-navigation-menu-radius').trim()).toBe(defaultTokens.components?.navigationMenu?.radius);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-context-menu-radius').trim()).toBe(defaultTokens.components?.contextMenu?.radius);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-menubar-radius').trim()).toBe(defaultTokens.components?.menubar?.radius);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-multi-select-radius').trim()).toBe(defaultTokens.components?.multiSelect?.radius);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-dropdown-bg').trim()).toBe(defaultTokens.components?.dropdown?.bg);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-dropdown-radius').trim()).toBe(defaultTokens.components?.dropdown?.radius);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-dropdown-content-padding').trim()).toBe(defaultTokens.components?.dropdown?.['content-padding']);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-select-radius').trim()).toBe(defaultTokens.components?.select?.radius);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-block-controls-radius').trim()).toBe(defaultTokens.components?.blockControls?.radius);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-box-radius').trim()).toBe(defaultTokens.components?.box?.radius);
  });

  it('propagates tokens to registered Shadow hosts', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    registerThemeHost(host);

    applyTheme({ ...defaultTokens, colors: { ...defaultTokens.colors, primary: '#000000', text: '#222222' } });
    expect(host.style.getPropertyValue('--ui-color-primary')).toBe('#000000');
    expect(host.style.getPropertyValue('--ui-color-text')).toBe('#222222');

    host.remove();
  });

  it('can create a themed token set with named accent palettes', () => {
    const blueTokens = createThemeTokens({}, { accentPalette: 'blue', mode: 'light' });
    expect(blueTokens.colors.primary).toBe('#0090ff');
    expect(blueTokens.palette?.accent?.['11']).toBe('#0d74ce');

    const greenDarkTokens = withAccentPalette(defaultTokens, 'green', 'dark');
    expect(greenDarkTokens.colors.primary).toBe('#30a46c');
    expect(greenDarkTokens.palette?.accentSurface).toBe('#13281e80');
  });

  it('makes panels follow the surface colour a theme overrides instead of staying light', () => {
    const dark = createThemeTokens({ colors: { ...defaultTokens.colors, background: '#020617', surface: '#0f172a' } });

    expect(dark.surfaces?.background).toBe('#020617');
    expect(dark.surfaces?.surface).toBe('#0f172a');
    expect(dark.surfaces?.panelSolid).toBe('#0f172a');
    expect(dark.surfaces?.panel).toContain('#0f172a');

    const host = document.createElement('div');
    applyTheme(dark, host);
    expect(host.style.getPropertyValue('--color-panel-solid')).toBe('#0f172a');
  });

  it('keeps a surface the theme set explicitly', () => {
    const tokens = createThemeTokens({
      colors: { ...defaultTokens.colors, surface: '#0f172a' },
      surfaces: { panelSolid: '#111111' }
    });

    expect(tokens.surfaces?.panelSolid).toBe('#111111');
    expect(tokens.surfaces?.surface).toBe('#0f172a');
  });

  it('leaves the baseline surfaces alone when no colours are overridden', () => {
    expect(createThemeTokens({}).surfaces?.panelSolid).toBe('#ffffff');
  });
  it('picks a text colour that reads at 4.5:1 on a solid accent fill', () => {
    // Radix's "contrast" colour for blue and gray is white, which is about 3.3:1 on #0090ff / #8d8d8d.
    const ratio = (a: string, b: string) => {
      const lum = (hex: string) => {
        const h = hex.replace('#', '');
        const c = [0, 2, 4].map((o) => {
          const v = parseInt(h.slice(o, o + 2), 16) / 255;
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      };
      return (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
    };

    for (const name of ['blue', 'gray'] as const) {
      const tokens = createThemeTokens({}, { accentPalette: name, mode: 'light' });
      expect(ratio(tokens.colors.foregroundOnPrimary!, tokens.colors.primary)).toBeGreaterThanOrEqual(4.5);
    }
    // The fill itself is unchanged.
    expect(createThemeTokens({}, { accentPalette: 'blue', mode: 'light' }).colors.primary).toBe('#0090ff');
  });

  it('keeps the preferred text colour when it already reads, and ignores colours it cannot parse', () => {
    expect(readableForeground('#2563eb', '#ffffff')).toBe('#ffffff');
    expect(readableForeground('#ffc53d', '#21201c')).toBe('#21201c');
    expect(readableForeground('#0090ff', '#ffffff')).toBe('#111111');
    expect(readableForeground('var(--brand)', '#ffffff')).toBe('#ffffff');
  });
  it('gives a theme that sets only a primary colour a text colour that reads on it', () => {
    // Without this the baseline's dark amber text colour was kept, which is 3.2:1 on blue.
    const blue = createThemeTokens({ colors: { ...defaultTokens.colors, primary: '#2563eb', foregroundOnPrimary: undefined } });
    expect(blue.colors.foregroundOnPrimary).toBe('#ffffff');

    const bright = deriveForegroundOnPrimary({ colors: { ...defaultTokens.colors, primary: '#0090ff', foregroundOnPrimary: undefined } });
    expect(bright.foregroundOnPrimary).toBe('#111111');

    // An explicit choice, or no primary at all, is left alone.
    expect(deriveForegroundOnPrimary({ colors: { ...defaultTokens.colors, primary: '#0090ff', foregroundOnPrimary: '#ffffff' } })).toEqual({});
    expect(deriveForegroundOnPrimary({})).toEqual({});
  });

  it('re-derives the text colour when a patch changes the primary but carries the old one along', () => {
    // The usual setTokens({ ...tokens, colors: { ...tokens.colors, primary } }) shape.
    const base = { colors: { ...defaultTokens.colors } };
    const toViolet = { colors: { ...defaultTokens.colors, primary: '#7c3aed' } };
    expect(deriveForegroundOnPrimary(toViolet, base)).toEqual({ foregroundOnPrimary: '#ffffff' });

    // Keeps the current text colour while it still reads, changes nothing when the primary is unchanged,
    // and never overrides a text colour the patch changed on purpose.
    const white = { colors: { ...defaultTokens.colors, primary: '#2563eb', foregroundOnPrimary: '#ffffff' } };
    expect(deriveForegroundOnPrimary({ colors: { ...white.colors, primary: '#7c3aed' } }, white)).toEqual({ foregroundOnPrimary: '#ffffff' });
    expect(deriveForegroundOnPrimary({ colors: { ...defaultTokens.colors } }, base)).toEqual({});
    expect(deriveForegroundOnPrimary({ colors: { ...defaultTokens.colors, primary: '#7c3aed', foregroundOnPrimary: '#f0f0f0' } }, base)).toEqual({});
  });
});

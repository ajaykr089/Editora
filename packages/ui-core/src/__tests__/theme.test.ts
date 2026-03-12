import { describe, it, expect, beforeEach } from 'vitest';
import { applyTheme, createThemeTokens, defaultTokens, registerThemeHost, withAccentPalette } from '../theme';

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
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-context-menu-radius').trim()).toBe(defaultTokens.components?.contextMenu?.radius);
    expect(getComputedStyle(document.documentElement).getPropertyValue('--base-menubar-radius').trim()).toBe(defaultTokens.components?.menubar?.radius);
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
});

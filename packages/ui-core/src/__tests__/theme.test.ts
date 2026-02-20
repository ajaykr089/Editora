import { describe, it, expect, beforeEach } from 'vitest';
import { applyTheme, defaultTokens, registerThemeHost } from '../theme';

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
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-font-family')).toContain('Inter');
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-motion-easing')).toBe(defaultTokens.motion?.easing);
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
});

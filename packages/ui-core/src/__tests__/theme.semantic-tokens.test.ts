import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applySystemTheme,
  applyTheme,
  baselineDarkTokens,
  baselineLightTokens,
  createThemeTokens,
  themeToCss,
  themeToVariables,
  withAccentPalette
} from '../theme';

const root = () => document.documentElement;
const read = (name: string) => root().style.getPropertyValue(name).trim();

describe('semantic design tokens', () => {
  it('derives the neutral and accent roles from the 12-step scales', () => {
    const vars = themeToVariables(baselineLightTokens);
    const gray = baselineLightTokens.palette!.gray!;
    const accent = baselineLightTokens.palette!.accent!;

    expect(vars['--ui-color-fill']).toBe(gray['3']);
    expect(vars['--ui-color-fill-hover']).toBe(gray['4']);
    expect(vars['--ui-color-fill-active']).toBe(gray['5']);
    expect(vars['--ui-color-line']).toBe(gray['7']);
    expect(vars['--ui-color-line-strong']).toBe(gray['8']);
    expect(vars['--ui-color-text-secondary']).toBe(gray['11']);
    expect(vars['--ui-color-text-strong']).toBe(gray['12']);
    expect(vars['--ui-color-accent-fill']).toBe(accent['3']);
    expect(vars['--ui-color-accent-solid']).toBe(accent['9']);
    expect(vars['--ui-color-accent-text']).toBe(accent['11']);
  });

  it('follows dark mode and the accent palette without a component knowing', () => {
    const light = themeToVariables(baselineLightTokens);
    const dark = themeToVariables(baselineDarkTokens);
    expect(dark['--ui-color-fill']).not.toBe(light['--ui-color-fill']);
    expect(dark['--ui-color-text-strong']).not.toBe(light['--ui-color-text-strong']);

    const blue = themeToVariables(withAccentPalette(baselineLightTokens, 'blue'));
    expect(blue['--ui-color-accent-solid']).not.toBe(light['--ui-color-accent-solid']);
  });

  it('defines the tokens that components read but the theme used to leave out', () => {
    const light = themeToVariables(baselineLightTokens);
    const dark = themeToVariables(baselineDarkTokens);
    expect(light['--ui-color-info']).toBe('#0e7490');
    expect(dark['--ui-color-info']).not.toBe(light['--ui-color-info']);
    // The elevated surface used to be a light slate in dark mode as well.
    expect(dark['--ui-color-surface-elevated']).not.toBe(light['--ui-color-surface-elevated']);
    expect(light['--ui-breakpoint-xl']).toBe('1280px');
    expect(light['--ui-font-family-mono']).toBeTruthy();
  });

  it('exposes one control scale (Radix Themes metrics) and one focus ring', () => {
    const vars = themeToVariables(baselineLightTokens);
    expect([vars['--ui-control-height-1'], vars['--ui-control-height-2'], vars['--ui-control-height-3']]).toEqual(['24px', '32px', '40px']);
    expect([vars['--ui-control-font-size-1'], vars['--ui-control-font-size-2'], vars['--ui-control-font-size-3']]).toEqual(['12px', '14px', '16px']);
    expect(vars['--ui-control-radius-2']).toBe(baselineLightTokens.radiusScale!['2']);
    expect(vars['--ui-control-radius-3']).toBe(baselineLightTokens.radiusScale!['3']);
    expect(vars['--ui-ring-color']).toBe(baselineLightTokens.colors.focusRing);
    expect(vars['--ui-ring-width']).toBe('2px');
    expect(vars['--ui-ring-offset']).toBe('2px');
  });

  it('keeps a custom radius scale in control radii', () => {
    const vars = themeToVariables(createThemeTokens({ radiusScale: { '2': '10px', '3': '14px' } }));
    expect(vars['--ui-control-radius-2']).toBe('10px');
    expect(vars['--ui-control-radius-3']).toBe('14px');
  });
});

describe('themeToCss / applyTheme parity', () => {
  beforeEach(() => {
    root().style.cssText = '';
  });

  it('applyTheme sets exactly the variables themeToVariables lists', () => {
    applyTheme(baselineLightTokens);
    const expected = themeToVariables(baselineLightTokens);
    for (const [name, value] of Object.entries(expected)) {
      expect(read(name), name).toBe(value);
    }
  });

  it('serialises the same variables as a stylesheet', () => {
    const css = themeToCss(baselineLightTokens, '.ui-theme');
    expect(css.startsWith('.ui-theme {')).toBe(true);
    for (const [name, value] of Object.entries(themeToVariables(baselineLightTokens))) {
      expect(css).toContain(`${name}: ${value};`);
    }
  });
});

describe('theme contract guard', () => {
  it('every --ui-color-* token a component reads is defined by the theme', () => {
    const dir = resolve(__dirname, '../components');
    const defined = new Set(Object.keys(themeToVariables(baselineLightTokens)));
    // Read as an optional override hook on purpose, with a literal fallback that is the real default.
    const intentionallyOptional = new Set([
      '--ui-color-accent', // ui-chart: a second series colour distinct from the primary
      '--ui-color-primary-contrast', // ui-dialog submit text, falls back to white
      '--ui-color-primary-foreground' // alias that falls back to --ui-color-foreground-on-primary
    ]);
    const missing = new Map<string, string[]>();

    for (const file of readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
      const source = readFileSync(resolve(dir, file), 'utf8');
      for (const match of source.matchAll(/var\((--ui-color-[a-z0-9-]+)/g)) {
        const name = match[1];
        if (defined.has(name) || intentionallyOptional.has(name)) continue;
        missing.set(name, [...(missing.get(name) || []), file]);
      }
    }

    expect(Object.fromEntries(missing)).toEqual({});
  });
});

describe('applySystemTheme', () => {
  type Listener = (e: { matches: boolean }) => void;
  let listeners: Listener[];
  let matches: boolean;

  beforeEach(() => {
    listeners = [];
    matches = false;
    root().style.cssText = '';
    root().removeAttribute('data-ui-mode');
    vi.stubGlobal('matchMedia', (query: string) => ({
      media: query,
      get matches() {
        return matches;
      },
      addEventListener: (_: string, l: Listener) => listeners.push(l),
      removeEventListener: (_: string, l: Listener) => {
        listeners = listeners.filter((x) => x !== l);
      }
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('applies the light theme when the system is light', () => {
    applySystemTheme();
    expect(root().getAttribute('data-ui-mode')).toBe('light');
    expect(read('--ui-color-background')).toBe(baselineLightTokens.colors.background);
    expect(read('color-scheme')).toBe('light');
  });

  it('starts dark when the system is dark and follows changes', () => {
    matches = true;
    const stop = applySystemTheme();
    expect(root().getAttribute('data-ui-mode')).toBe('dark');
    expect(read('--ui-color-background')).toBe(baselineDarkTokens.colors.background);

    listeners.forEach((l) => l({ matches: false }));
    expect(root().getAttribute('data-ui-mode')).toBe('light');
    expect(read('--ui-color-background')).toBe(baselineLightTokens.colors.background);

    stop();
    expect(listeners).toHaveLength(0);
  });

  it('applies per-mode overrides and the accent palette', () => {
    applySystemTheme({ accentPalette: 'blue', light: { radius: '9px' } });
    expect(read('--ui-radius')).toBe('9px');
    expect(read('--ui-color-accent-solid')).toBe(themeToVariables(withAccentPalette(baselineLightTokens, 'blue', 'light'))['--ui-color-accent-solid']);
  });

  it('does not throw and returns a no-op without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined);
    const stop = applySystemTheme();
    expect(root().getAttribute('data-ui-mode')).toBe('light');
    expect(() => stop()).not.toThrow();
  });
});

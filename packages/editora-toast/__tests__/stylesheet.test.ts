import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(__dirname, '..', 'src', 'toast.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

// The rules of the stylesheet as [selector, body] pairs (nesting is not used, @media blocks are flattened).
const rules = Array.from(css.matchAll(/([^{}@][^{}]*)\{([^{}]*)\}/g)).map((m) => [m[1].trim(), m[2]] as const);
const rule = (selector: string) => rules.filter(([s]) => s.split(',').map((x) => x.trim()).includes(selector)).map(([, body]) => body).join('\n');

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const f = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

describe('toast.css', () => {
  it('paints an opaque surface: a tint is only ever layered over the solid --et-bg', () => {
    expect(rule('.editora-toast')).toMatch(/background:\s*var\(--et-bg\)/);
    // The old stylesheet replaced the surface with a 6% tint, so the page showed through the text.
    const backgrounds = Array.from(css.matchAll(/background:\s*([^;]+);/g)).map((m) => m[1]);
    const tinted = backgrounds.filter((value) => /-tint\)/.test(value));
    expect(tinted.length).toBeGreaterThan(0);
    tinted.forEach((value) => expect(value, value).toMatch(/var\(--et-bg\)\s*$/));
  });

  it('makes the "dark" theme dark, with light text (it used to be a white card)', () => {
    const body = rule('.editora-toast[data-theme="dark"]');
    const bg = body.match(/--et-bg:\s*(#[0-9a-f]{6})/i)![1];
    const text = body.match(/--et-text:\s*(#[0-9a-f]{6})/i)![1];
    expect(luminance(bg)).toBeLessThan(0.05);
    expect(luminance(text)).toBeGreaterThan(0.7);
  });

  it('follows the system and the app: prefers-color-scheme, and a .dark / data-theme switch on the root', () => {
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\)\s*\{\s*:root/);
    expect(css).toMatch(/:root\.dark,/);
    expect(css).toMatch(/:root\[data-theme="dark"\]/);
    expect(css).toMatch(/:root\.light,/); // an app that is light while the system is dark
  });

  it('keeps transform free for the enter, exit and swipe motion: the stack layout uses translate and scale', () => {
    const body = rule('.editora-toast');
    expect(body).toMatch(/translate:\s*0 var\(--et-y/);
    expect(body).toMatch(/scale:\s*var\(--et-s/);
  });

  it('resolves the primary button colours per toast, not once on :root', () => {
    expect(rule(':root')).not.toMatch(/--et-action-bg\s*:/);
    expect(rule('.editora-toast-action.primary')).toMatch(/var\(--et-action-bg,\s*var\(--et-text\)\)/);
  });

  it('gives the progress track a width and a height (it used to be unstyled)', () => {
    expect(rule('.editora-toast-progress-track')).toMatch(/height:\s*4px/);
    expect(rule('.editora-toast-progress-bar')).toMatch(/background:\s*var\(--et-accent\)/);
  });

  it('follows contrast preferences and forced colours', () => {
    expect(css).toMatch(/@media \(prefers-contrast: more\)[\s\S]*?\.editora-toast \{[^}]*border-color: var\(--et-text\)/);
    const forced = css.match(/@media \(forced-colors: active\) \{([\s\S]*?)\n\}\n/)?.[1] || '';
    expect(forced).toMatch(/background: Canvas/);
    expect(forced).toMatch(/color: CanvasText/);
    expect(forced).toMatch(/\.editora-toast-action\.primary \{[^}]*Highlight/);
  });
});

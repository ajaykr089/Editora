import { describe, expect, it } from 'vitest';
import { baselineDarkTokens, baselineLightTokens } from '../theme';
import { deriveSemanticTokens } from '../semantic-tokens';

const hex = (value: string) => {
  const m = value.trim().replace('#', '');
  const full = m.length === 3 ? m.split('').map((ch) => ch + ch).join('') : m.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};
const luminance = (rgb: number[]) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: number[], b: number[]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** color-mix(in srgb, A p%, B) for hex colours. */
const resolveMix = (value: string) => {
  const m = /color-mix\(in srgb, (#[0-9a-f]+) (\d+)%, (#[0-9a-f]+)\)/i.exec(value);
  if (!m) throw new Error(`not a hex color-mix: ${value}`);
  const [a, p, b] = [hex(m[1]), Number(m[2]) / 100, hex(m[3])];
  return a.map((v, i) => Math.round(v * p + b[i] * (1 - p)));
};

// Field outlines must reach 3:1 (WCAG 1.4.11); the general line colour is about 1.6:1.
describe('field border token', () => {
  for (const [name, tokens] of [['light', baselineLightTokens], ['dark', baselineDarkTokens]] as const) {
    it(`reaches 3:1 against the surface and the page in the ${name} theme`, () => {
      const vars = deriveSemanticTokens(tokens);
      const border = resolveMix(vars['--ui-color-field-border']);
      for (const bg of [tokens.colors.surface, tokens.colors.background, tokens.colors.surfaceAlt].filter(Boolean) as string[]) {
        expect(contrast(border, hex(bg)), `${name} on ${bg}`).toBeGreaterThanOrEqual(3);
      }
      const hover = resolveMix(vars['--ui-color-field-border-hover']);
      expect(contrast(hover, hex(tokens.colors.surface!))).toBeGreaterThan(contrast(border, hex(tokens.colors.surface!)));
    });
  }
});

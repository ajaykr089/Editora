// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { iconNameList, renderIconSvg } from '../src/index';

describe('glyph shapes', () => {
  it('gives no two icons the same drawing, apart from deliberate synonyms', () => {
    // These pairs are the same picture under two names on purpose.
    const synonyms = ['box=product', 'logo-map-pin=map-pin', 'marketing=megaphone', 'success-state=validation'];
    const byDrawing = new Map<string, string[]>();
    for (const name of iconNameList) {
      const drawing = renderIconSvg(name).replace(/ aria-label="[^"]*"/, '');
      byDrawing.set(drawing, [...(byDrawing.get(drawing) || []), name]);
    }
    const same = [...byDrawing.values()].filter((names) => names.length > 1).map((names) => names.sort().join('='));
    expect(same.sort()).toEqual(synonyms);
  });

  it('draws media controls as outlines, filled in the solid variant', () => {
    for (const name of ['play', 'pause', 'stop', 'forward', 'rewind', 'skip-next', 'skip-previous']) {
      expect(renderIconSvg(name), name).not.toContain('fill="currentColor"');
      expect(renderIconSvg(name, { variant: 'solid' }), name).toContain('fill="currentColor"');
    }
  });
});

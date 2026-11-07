// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as glyphs from '../src/glyphs';
import { renderIconDefinition } from '../src/renderer';
import { iconDefinitions, renderIconSvg } from '../src/index';
// @ts-expect-error plain .mjs script
import { exportName, renderGlyphsModule } from '../scripts/generate-glyphs.mjs';

describe('per-icon exports (@editora/icons/glyphs)', () => {
  it('is regenerated from definitions.ts (run scripts/generate-glyphs.mjs)', async () => {
    const current = readFileSync(resolve(__dirname, '../src/glyphs.ts'), 'utf8');
    expect(current === (await renderGlyphsModule())).toBe(true);
  });

  it('exports every built-in icon, rendering exactly as the registry does', () => {
    expect(Object.keys(glyphs)).toHaveLength(iconDefinitions.length);
    for (const definition of iconDefinitions) {
      const glyph = (glyphs as Record<string, typeof definition>)[exportName(definition.name)];
      expect(glyph, definition.name).toBeDefined();
      for (const variant of ['outline', 'solid', 'duotone'] as const) {
        expect(renderIconDefinition(glyph, { variant, rtl: true }), `${definition.name}:${variant}`).toBe(renderIconSvg(definition.name, { variant, rtl: true }));
      }
    }
  });

  it('names exports in camelCase with an Icon suffix', () => {
    expect(exportName('check')).toBe('checkIcon');
    expect(exportName('chevron-down')).toBe('chevronDownIcon');
    expect(exportName('link-2')).toBe('link2Icon');
    expect(glyphs.chevronDownIcon.name).toBe('chevron-down');
  });

  it('the renderer entry does not import the registry or the definitions', () => {
    const source = readFileSync(resolve(__dirname, '../src/renderer.ts'), 'utf8');
    expect(source).not.toMatch(/from '\.\/(registry|definitions|index|glyphs)'/);
    const glyphSource = readFileSync(resolve(__dirname, '../src/glyphs.ts'), 'utf8');
    expect(glyphSource.match(/^import .*$/gm)).toEqual(["import type { IconDefinition } from './types';"]);
  });
});

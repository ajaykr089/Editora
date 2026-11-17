// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as glyphs from '../src/glyphs';
import { getRegisteredIcon, renderIconDefinition } from '../src/renderer';
import { getIcon, iconDefinitions, iconNameList, registerIcon, renderIconSvg } from '../src/index';
import type { IconName } from '../src/index';
// @ts-expect-error plain .mjs script
import { exportName, renderGlyphsModule, renderNamesModule } from '../scripts/generate-glyphs.mjs';

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
    const registered = readFileSync(resolve(__dirname, '../src/registered.ts'), 'utf8');
    expect(registered.match(/^import .*$/gm)).toEqual(["import type { IconDefinition } from './types';"]);
    const glyphSource = readFileSync(resolve(__dirname, '../src/glyphs.ts'), 'utf8');
    expect(glyphSource.match(/^import .*$/gm)).toEqual(["import type { IconDefinition } from './types';"]);
  });
});

describe('IconName', () => {
  it('is regenerated from definitions.ts (run scripts/generate-glyphs.mjs)', async () => {
    const current = readFileSync(resolve(__dirname, '../src/names.ts'), 'utf8');
    expect(current === (await renderNamesModule())).toBe(true);
  });

  it('lists every built-in name and nothing else', () => {
    const source = readFileSync(resolve(__dirname, '../src/names.ts'), 'utf8');
    const listed = [...source.matchAll(/^ {2}\| '([^']+)'/gm)].map((match) => match[1]);
    expect(listed).toEqual([...iconNameList]);
  });

  it('autocompletes built-in names and still accepts any string', () => {
    const name: IconName = 'chevron-down';
    // @ts-expect-error a typo in a typed name is a compile error
    const typo: IconName = 'chevron-dwn';
    expect(renderIconSvg(name)).toContain('<svg');
    expect(renderIconSvg('close')).toBe(renderIconSvg('x')); // an alias is not an IconName, but is accepted
    expect(renderIconSvg(typo)).toBe('');
  });
});

describe('getRegisteredIcon (@editora/icons/renderer)', () => {
  it('lists icons added or replaced with registerIcon, not the built-in ones', () => {
    expect(getRegisteredIcon('check')).toBeUndefined();
    const original = getIcon('check')!;
    const replacement = { name: 'Check', variants: { outline: { nodes: [{ tag: 'circle' as const, attrs: { cx: 12, cy: 12, r: 4 } }] } } };
    registerIcon(replacement);
    try {
      expect(getRegisteredIcon('check')).toBe(getIcon('check'));
      expect(getRegisteredIcon('check')?.variants.outline.nodes[0].tag).toBe('circle');
    } finally {
      registerIcon(original);
    }
    expect(getRegisteredIcon('check')).toEqual(original); // restored (the registry keeps a copy)
    expect(renderIconSvg('check')).toBe(renderIconDefinition(glyphs.checkIcon));
  });
});

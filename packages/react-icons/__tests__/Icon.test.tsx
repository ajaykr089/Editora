import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getIcon, hasIcon, listIcons, registerIcon } from '@editora/icons';
import { checkIcon } from '@editora/icons/glyphs';
import * as ReactIcons from '../src/index';
// @ts-expect-error plain .mjs script
import { renderIconsModule } from '../scripts/generate-icons.mjs';

const { Icon, CheckIcon, IconProvider, defaultIconContext, defineIcon, icons } = ReactIcons;
const html = (el: React.ReactElement) => renderToStaticMarkup(el);
const strokeWidths = (el: React.ReactElement) => [...new Set(html(el).match(/stroke-width="[^"]*"/g) || [])];

describe('named icon components', () => {
  it('has a component for every icon in the registry, and each renders an <svg>', () => {
    const components = Object.entries(ReactIcons).filter(([key, value]) => /Icon$/.test(key) && key !== 'Icon' && typeof value === 'object') as Array<[string, React.ComponentType]>;
    expect(components.length).toBeGreaterThanOrEqual(listIcons().length);
    for (const [key, Component] of components) expect(html(<Component />), key).toContain('<svg');
    const names = new Set(components.map(([key]) => key));
    const missing = listIcons().filter((n) => !names.has(n.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('') + 'Icon'));
    expect(missing).toEqual([]);
  });

  it('renders nothing for an unknown icon name', () => {
    expect(html(<Icon name="definitely-not-an-icon" />)).toBe('');
  });
});

describe('stroke width resolution', () => {
  it('uses the prop, then the prop weight, then the provider width, then the provider weight, then the default', () => {
    expect(strokeWidths(<CheckIcon />)).toEqual(['stroke-width="1.5"']);
    expect(strokeWidths(<CheckIcon strokeWidth={3} />)).toEqual(['stroke-width="3"']);
    expect(strokeWidths(<CheckIcon iconWeight="bold" />)).toEqual(['stroke-width="1.75"']);
    // provider values (these were ignored / overridden before)
    expect(strokeWidths(<IconProvider value={{ strokeWidth: 3 }}><CheckIcon /></IconProvider>)).toEqual(['stroke-width="3"']);
    expect(strokeWidths(<IconProvider value={{ iconWeight: 'bold' }}><CheckIcon /></IconProvider>)).toEqual(['stroke-width="1.75"']);
    // props still beat the provider
    expect(strokeWidths(<IconProvider value={{ strokeWidth: 3 }}><CheckIcon iconWeight="thin" /></IconProvider>)).toEqual(['stroke-width="1.25"']);
    expect(strokeWidths(<IconProvider value={{ iconWeight: 'bold' }}><CheckIcon strokeWidth={4} /></IconProvider>)).toEqual(['stroke-width="4"']);
    // when a provider sets both, its explicit width wins over its weight
    expect(strokeWidths(<IconProvider value={{ strokeWidth: 2.5, iconWeight: 'bold' }}><CheckIcon /></IconProvider>)).toEqual(['stroke-width="2.5"']);
  });

  it('draws the stroke at its width in screen pixels at every size, with or without absoluteStrokeWidth', () => {
    // Strokes are non-scaling (vector-effect), so they are already the same on screen at every size. Scaling the width by
    // viewBox / size as well gave a 3px stroke at size 12 and a 0.75px one at size 48 (measured in Chromium).
    for (const size of [12, 24, 48, '12px']) {
      expect(strokeWidths(<CheckIcon size={size} absoluteStrokeWidth />), String(size)).toEqual(['stroke-width="1.5"']);
      expect(strokeWidths(<CheckIcon size={size} absoluteStrokeWidth={false} />), String(size)).toEqual(['stroke-width="1.5"']);
    }
    expect(strokeWidths(<IconProvider value={{ absoluteStrokeWidth: true }}><CheckIcon size={48} /></IconProvider>)).toEqual(['stroke-width="1.5"']);
    expect(html(<CheckIcon size={48} absoluteStrokeWidth />)).toContain('vector-effect="non-scaling-stroke"');
  });

  it('ignores invalid widths', () => {
    expect(strokeWidths(<CheckIcon strokeWidth={-1} />)).toEqual(['stroke-width="1.5"']);
    expect(strokeWidths(<CheckIcon strokeWidth={NaN} />)).toEqual(['stroke-width="1.5"']);
  });

  it('nested providers merge; the inner one wins on conflicts', () => {
    const out = html(
      <IconProvider value={{ size: 40, color: 'blue' }}>
        <IconProvider value={{ color: 'red' }}>
          <CheckIcon />
        </IconProvider>
      </IconProvider>
    );
    expect(out).toContain('width="40"');
    expect(out).toContain('color="red"');
  });

  it('keeps defaultIconContext exported with its original values', () => {
    expect(defaultIconContext.strokeWidth).toBe(1.5);
    expect(defaultIconContext.iconWeight).toBe('regular');
  });
});

describe('size', () => {
  it('uses valid sizes and falls back to the default for invalid ones, without React warnings', () => {
    const warn = vi.spyOn(console, 'error').mockImplementation(() => {});
    const width = (size: unknown) => html(<CheckIcon size={size as number} />).match(/width="([^"]*)"/)?.[1];
    expect(width(32)).toBe('32');
    expect(width('2rem')).toBe('2rem');
    for (const bad of [0, -4, NaN, 'abc', '']) expect(width(bad), String(bad)).toBe('15');
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('takes the size from a provider', () => {
    expect(html(<IconProvider value={{ size: 40 }}><CheckIcon /></IconProvider>)).toContain('width="40"');
  });
});

describe('accessibility', () => {
  it('is decorative by default and labelled with a title or aria-label', () => {
    const decorative = html(<CheckIcon />);
    expect(decorative).toContain('aria-hidden="true"');
    expect(decorative).toContain('role="presentation"');
    const titled = html(<CheckIcon title="Done" />);
    expect(titled).toContain('role="img"');
    expect(titled).toContain('aria-label="Done"');
    expect(html(<CheckIcon aria-label="Saved" />)).toContain('aria-label="Saved"');
  });

  it('never marks an icon both aria-hidden and labelled', () => {
    const out = html(<CheckIcon decorative aria-label="Saved" />);
    expect(out).toContain('aria-hidden="true"');
    expect(out).not.toContain('aria-label');
    const viaProp = html(<CheckIcon decorative ariaLabel="Saved" title="Saved" />);
    expect(viaProp).toContain('aria-hidden="true"');
    expect(viaProp).not.toContain('aria-label');
  });

  it('passes className, style, data-* and handlers through', () => {
    const out = html(<CheckIcon className="x" style={{ color: 'red' }} data-testid="t" onClick={() => {}} />);
    expect(out).toContain('class="x"');
    expect(out).toContain('style="color:red"');
    expect(out).toContain('data-testid="t"');
  });
});

describe('refs', () => {
  it('forwards the ref of Icon and of a named component to the <svg>', () => {
    const generic = React.createRef<SVGSVGElement>();
    const named = React.createRef<SVGSVGElement>();
    const container = document.createElement('div');
    const root = createRoot(container);
    flushSync(() => root.render(<><Icon ref={generic} name="check" /><CheckIcon ref={named} /></>));
    expect(generic.current).toBeInstanceOf(SVGSVGElement);
    expect(named.current).toBeInstanceOf(SVGSVGElement);
    expect(named.current).toBe(container.querySelectorAll('svg')[1]);
    flushSync(() => root.unmount());
  });
});

describe('search (re-exported from @editora/icons)', () => {
  // The README's picker, rendered: results come best first and draw with <Icon name>.
  function IconPicker({ query, category }: { query: string; category?: string }) {
    const results = ReactIcons.searchIcons(query, { category, limit: 60 });
    return (
      <ul>
        {results.map((result) => (
          <li key={result.name} title={result.matchedBy === 'name' ? result.name : `${result.name} · ${result.matched}`}>
            <Icon name={result.name} size={20} /> {result.name}
          </li>
        ))}
      </ul>
    );
  }

  it('finds icons by name, alias, tag and category, and each result renders', () => {
    expect(ReactIcons.searchIcons('bin')[0]).toMatchObject({ name: 'trash', matchedBy: 'tag', matched: 'bin' });
    const markup = html(<IconPicker query="delete" />);
    expect(markup).toContain('title="trash · delete"');
    expect((markup.match(/<svg/g) || []).length).toBe((markup.match(/<li[ >]/g) || []).length);
    expect(html(<IconPicker query="" category="weather" />)).toContain('umbrella');
  });

  it('lists categories with counts', () => {
    const categories = ReactIcons.listIconCategories();
    expect(categories.find((category) => category.name === 'weather')?.count).toBeGreaterThan(0);
  });
});

describe('named icons drawn from their own glyph', () => {
  it('src/icons.tsx is regenerated from @editora/icons/glyphs (run scripts/generate-icons.mjs)', () => {
    expect(readFileSync(resolve(__dirname, '../src/icons.tsx'), 'utf8') === renderIconsModule()).toBe(true);
  });

  it('draw exactly what <Icon name> draws, for every icon and variant', () => {
    for (const [name, Component] of Object.entries(icons)) {
      const canonical = getIcon(name)!.name; // the legacy components (NavIcon, ...) are named after an alias
      for (const variant of ['outline', 'solid', 'duotone'] as const) {
        expect(html(<Component variant={variant} rtl title="t" />), `${name}:${variant}`).toBe(html(<Icon name={canonical} variant={variant} rtl title="t" />));
      }
    }
  });

  it('still draw an icon the app registered under the same name', () => {
    const original = getIcon('check')!;
    registerIcon({ name: 'check', variants: { outline: { nodes: [{ tag: 'circle', attrs: { cx: 12, cy: 12, r: 4 } }] } } });
    try {
      expect(html(<CheckIcon />)).toContain('<circle');
      expect(html(<CheckIcon />)).toBe(html(<Icon name="check" />));
    } finally {
      registerIcon(original);
    }
    expect(html(<CheckIcon />)).not.toContain('<circle');
  });

  it('do not import the registry (so a bundle keeps only the icons it uses)', () => {
    const runtimeImports = (file: string) =>
      [...readFileSync(resolve(__dirname, '../src', file), 'utf8').matchAll(/^import (?!type )[^;]*? from '([^']+)'/gms)].map((match) => match[1]);
    expect(runtimeImports('defineIcon.tsx').sort()).toEqual(['./IconContext', '@editora/icons/renderer', 'react']);
    expect(runtimeImports('icons.tsx').sort()).toEqual(['./defineIcon', '@editora/icons/glyphs']);
    expect(runtimeImports('IconContext.tsx')).toEqual(['react']);
  });
});

describe('defineIcon', () => {
  const brand = {
    name: 'brand-mark',
    variants: { outline: { nodes: [{ tag: 'path' as const, attrs: { d: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z' } }] } },
  };

  it('makes a component from a definition without registering it', () => {
    const BrandIcon = defineIcon(brand);
    expect(BrandIcon.displayName).toBe('BrandMarkIcon');
    expect(defineIcon(brand, 'Logo').displayName).toBe('Logo');
    const out = html(<IconProvider value={{ size: 24, color: 'red' }}><BrandIcon title="Acme" /></IconProvider>);
    expect(out).toContain('d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"');
    expect(out).toContain('width="24"');
    expect(out).toContain('color="red"');
    expect(out).toContain('aria-label="Acme"');
    expect(html(<BrandIcon decorative={false} />)).toContain('aria-label="brand-mark"');
    expect(hasIcon('brand-mark')).toBe(false);
  });

  it('draws a built-in glyph the same as the named component', () => {
    const Check = defineIcon(checkIcon);
    expect(html(<Check variant="solid" size={20} />)).toBe(html(<CheckIcon variant="solid" size={20} />));
  });

  it('renders nothing for a definition without an outline', () => {
    const Broken = defineIcon({ name: 'broken' } as never);
    expect(html(<Broken />)).toBe('');
  });
});

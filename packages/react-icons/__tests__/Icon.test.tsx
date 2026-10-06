import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { listIcons } from '@editora/icons';
import * as ReactIcons from '../src/index';

const { Icon, CheckIcon, IconProvider, defaultIconContext } = ReactIcons;
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

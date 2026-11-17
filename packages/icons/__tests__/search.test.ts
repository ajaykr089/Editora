// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { iconDefinitions, listIconCategories, registerIcon, searchIcons } from '../src/index';

const names = (query: string, options?: Parameters<typeof searchIcons>[1]) => searchIcons(query, options).map((result) => result.name);

describe('searchIcons', () => {
  it('puts a name or alias equal to the query first', () => {
    expect(searchIcons('check')[0]).toMatchObject({ name: 'check', matchedBy: 'name', matched: 'check' });
    expect(searchIcons('delete')[0]).toMatchObject({ name: 'trash', matchedBy: 'alias', matched: 'delete' });
    expect(searchIcons('Chart Line')[0].name).toBe('chart-line'); // case, spaces and underscores like everywhere else
    expect(searchIcons('user_add')[0].name).toBe('user-plus');
  });

  it('finds icons by the start of a name or of one of its words', () => {
    expect(names('calend')).toEqual(expect.arrayContaining(['calendar', 'calendar-days', 'calendar-range']));
    expect(names('line')).toContain('chart-line');
  });

  it('finds icons by tag and by category', () => {
    expect(searchIcons('bin')[0]).toMatchObject({ name: 'trash', matchedBy: 'tag', matched: 'bin' });
    expect(names('weather')).toEqual(expect.arrayContaining(['sun', 'moon', 'rain', 'snow', 'storm']));
  });

  it('ranks an exact tag above a name that only starts with the word', () => {
    expect(names('ai').slice(0, 2).sort()).toEqual(['brain', 'sparkles']);
  });

  it('needs every word to match when some icon matches them all', () => {
    const results = names('arrow left');
    expect(results[0]).toBe('arrow-left');
    expect(results).toContain('chevron-left');
    expect(results).not.toContain('arrow-right');
  });

  it('falls back to the icons that match the most words', () => {
    expect(names('delete file')[0]).toBe('file-x');
    expect(names('dark xyzzy')[0]).toBe('moon');
  });

  it('does not match short words inside other words', () => {
    expect(names('tic')).not.toContain('grip-vertical');
  });

  it('returns nothing for a word nothing matches', () => {
    expect(searchIcons('xyzzy')).toEqual([]);
  });

  it('lists every icon by name for an empty query, and filters by category', () => {
    expect(searchIcons('')).toHaveLength(iconDefinitions.length);
    const weather = names('', { category: 'weather' });
    expect(weather).toContain('umbrella');
    expect(weather.every((name) => iconDefinitions.find((d) => d.name === name)!.categories!.includes('weather'))).toBe(true);
    expect(names('arrow', { category: ['arrows', 'shapes'] })).not.toContain('logo-github');
    expect(names('sun', { category: 'arrows' })).toEqual([]);
  });

  it('honours limit', () => {
    expect(searchIcons('arrow', { limit: 3 })).toHaveLength(3);
    expect(searchIcons('arrow', { limit: 0 })).toEqual([]);
  });

  it('searches icons added with registerIcon', () => {
    registerIcon({ name: 'brand-mark', aliases: ['acme'], tags: ['company-logo'], categories: ['brand'], variants: { outline: { nodes: [{ tag: 'circle', attrs: { cx: 12, cy: 12, r: 4 } }] } } });
    expect(searchIcons('acme')[0]).toMatchObject({ name: 'brand-mark', matchedBy: 'alias' });
    expect(names('company')).toContain('brand-mark');
    expect(names('', { category: 'brand' })).toEqual(['brand-mark']);
  });
});

describe('listIconCategories', () => {
  it('lists every category with its size, and every built-in icon is in at least one', () => {
    const categories = listIconCategories();
    expect(categories.map((category) => category.name)).toEqual([...categories.map((category) => category.name)].sort());
    expect(categories.find((category) => category.name === 'weather')?.count).toBeGreaterThanOrEqual(9);
    expect(iconDefinitions.filter((definition) => !(definition.categories || []).length)).toEqual([]);
  });
});

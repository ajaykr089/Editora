// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getIcon, hasIcon, iconDefinitions, renderIconSvg } from '../src/index';

const target = (alias: string) => getIcon(alias)?.name;

describe('aliases', () => {
  it('point at the icon that draws them', () => {
    expect(target('tick')).toBe('check');
    expect(target('loading')).toBe('spinner');
    expect(target('github')).toBe('logo-github');
    expect(target('twitter')).toBe('logo-twitter');
    expect(target('export')).toBe('download');
    expect(target('import')).toBe('upload');
    expect(target('avatar')).toBe('user-circle');
    expect(target('line-height')).toBe('type-line-height');
    expect(target('pagination-next')).toBe('chevron-right');
    expect(target('coupon')).toBe('tag');
  });

  it('are dropped when no icon draws them, so a lookup draws nothing instead of the wrong picture', () => {
    for (const name of ['pizza', 'opacity', 'gamepad', 'tab', 'modal', 'gradient', 'nft']) {
      expect(hasIcon(name), name).toBe(false);
      expect(renderIconSvg(name), name).toBe('');
    }
  });

  it('keeps the names @editora/react-icons publishes components under', () => {
    expect(target('nav')).toBe('navigation');
    expect(target('navigation-icon')).toBe('navigation');
    expect(target('airplan')).toBe('airplane');
  });

  it('gives no icon a catch-all list of unrelated names', () => {
    // semantic-business once answered to 69 names (export, payroll, chatbot, ...) with one generic glyph.
    const crowded = iconDefinitions.filter((definition) => (definition.aliases || []).length > 20).map((definition) => definition.name);
    expect(crowded).toEqual([]);
  });
});

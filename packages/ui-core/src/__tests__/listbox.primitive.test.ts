import { describe, expect, it } from 'vitest';
import {
  findListboxTypeaheadIndex,
  getListboxBoundaryIndex,
  moveListboxActiveIndex,
  resolveListboxActiveIndex,
  scrollListboxItemIntoView,
  syncActiveDescendant
} from '../primitives/listbox';

describe('listbox primitive', () => {
  const items = [
    { id: 'one', label: 'One', disabled: false },
    { id: 'two', label: 'Two', disabled: true },
    { id: 'three', label: 'Three', disabled: false }
  ];

  it('resolves an active index from active, selected, or first enabled item', () => {
    expect(resolveListboxActiveIndex(items, { selectedIndex: 2, getDisabled: (item) => item.disabled })).toBe(2);
    expect(resolveListboxActiveIndex(items, { selectedIndex: 1, getDisabled: (item) => item.disabled })).toBe(0);
    expect(getListboxBoundaryIndex(items, 'last', (item) => item.disabled)).toBe(2);
  });

  it('moves and typeaheads through enabled items', () => {
    expect(
      moveListboxActiveIndex(items, 0, 1, { fallbackIndex: -1, getDisabled: (item) => item.disabled })
    ).toBe(2);
    expect(
      findListboxTypeaheadIndex(items, 'th', {
        startIndex: 0,
        getLabel: (item) => item.label,
        getDisabled: (item) => item.disabled
      })
    ).toBe(2);
  });

  it('syncs aria-activedescendant and scrolls defensively', () => {
    const owner = document.createElement('input');
    const item = document.createElement('button');
    item.id = 'opt-1';
    item.scrollIntoView = undefined as unknown as typeof item.scrollIntoView;

    syncActiveDescendant(owner, item.id);
    expect(owner.getAttribute('aria-activedescendant')).toBe('opt-1');

    syncActiveDescendant(owner, null);
    expect(owner.hasAttribute('aria-activedescendant')).toBe(false);

    expect(() => scrollListboxItemIntoView(item)).not.toThrow();
  });
});

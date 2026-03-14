import { describe, expect, it, vi } from 'vitest';
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
    const container = document.createElement('div');
    const item = document.createElement('button');
    item.id = 'opt-1';
    const nativeScrollSpy = vi.fn();
    item.scrollIntoView = nativeScrollSpy as unknown as typeof item.scrollIntoView;

    Object.defineProperties(container, {
      clientHeight: { configurable: true, value: 80 },
      scrollHeight: { configurable: true, value: 300 },
      clientWidth: { configurable: true, value: 120 },
      scrollWidth: { configurable: true, value: 120 }
    });
    Object.defineProperties(item, {
      getBoundingClientRect: {
        configurable: true,
        value: () => ({ top: 140, left: 0, width: 80, height: 24, bottom: 164, right: 80, x: 0, y: 140, toJSON: () => ({}) })
      }
    });
    Object.defineProperties(container, {
      getBoundingClientRect: {
        configurable: true,
        value: () => ({ top: 0, left: 0, width: 120, height: 80, bottom: 80, right: 120, x: 0, y: 0, toJSON: () => ({}) })
      }
    });
    container.style.overflowY = 'auto';
    container.appendChild(item);
    document.body.appendChild(container);

    syncActiveDescendant(owner, item.id);
    expect(owner.getAttribute('aria-activedescendant')).toBe('opt-1');

    syncActiveDescendant(owner, null);
    expect(owner.hasAttribute('aria-activedescendant')).toBe(false);

    expect(() => scrollListboxItemIntoView(item)).not.toThrow();
    expect(container.scrollTop).toBe(84);
    expect(nativeScrollSpy).not.toHaveBeenCalled();
  });
});

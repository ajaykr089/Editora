import { describe, expect, it } from 'vitest';
import {
  findFirstEnabledIndex,
  findIndexByValue,
  findLastEnabledIndex,
  findNextEnabledIndex,
  findTypeaheadMatch,
  normalizeCollectionText
} from '../primitives/collection';

describe('collection primitive', () => {
  const items = [
    { value: 'a', label: 'Alpha', disabled: false },
    { value: 'b', label: 'Bravo', disabled: true },
    { value: 'c', label: 'Café', disabled: false },
    { value: 'd', label: 'Delta', disabled: false }
  ];

  it('finds first and last enabled items', () => {
    expect(findFirstEnabledIndex(items, (item) => item.disabled)).toBe(0);
    expect(findLastEnabledIndex(items, (item) => item.disabled)).toBe(3);
  });

  it('moves across enabled items while skipping disabled entries', () => {
    expect(findNextEnabledIndex(items, 0, 1, { getDisabled: (item) => item.disabled })).toBe(2);
    expect(findNextEnabledIndex(items, 0, -1, { getDisabled: (item) => item.disabled })).toBe(3);
  });

  it('supports value lookup and normalized typeahead search', () => {
    expect(findIndexByValue(items, 'c', (item) => item.value)).toBe(2);
    expect(normalizeCollectionText(' Café ')).toBe('cafe');
    expect(
      findTypeaheadMatch(items, 'ca', {
        startIndex: 0,
        getLabel: (item) => item.label,
        getDisabled: (item) => item.disabled
      })
    ).toBe(2);
  });
});

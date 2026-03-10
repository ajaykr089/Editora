import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-collection';
import { UICollection } from '../components/ui-collection';

describe('ui-collection component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('applies item semantics and supports value/typeahead lookup', () => {
    const el = document.createElement('ui-collection') as UICollection;
    el.setAttribute('item-selector', '.item');
    el.setAttribute('item-role', 'menuitem');
    el.innerHTML = `
      <button class="item" data-value="alpha">Alpha</button>
      <button class="item" disabled data-value="bravo">Bravo</button>
      <button class="item" data-value="cafe">Café</button>
    `;

    document.body.appendChild(el);
    el.refresh();

    const items = el.queryItems();
    expect(items).toHaveLength(3);
    expect(items[0].getAttribute('role')).toBe('menuitem');
    expect(items[1].getAttribute('aria-disabled')).toBe('true');
    expect(el.findByValue('cafe')).toBe(items[2]);
    expect(el.findTypeaheadMatch('ca')).toBe(items[2]);
  });
});

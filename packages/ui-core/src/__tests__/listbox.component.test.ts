import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-listbox';
import { UIListbox } from '../components/ui-listbox';

describe('ui-listbox component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('moves active state across enabled items and supports typeahead', () => {
    const el = document.createElement('ui-listbox') as UIListbox;
    el.setAttribute('item-selector', '.item');
    el.setAttribute('item-role', 'option');
    el.innerHTML = `
      <button class="item">Alpha</button>
      <button class="item" disabled>Bravo</button>
      <button class="item">Gamma</button>
    `;

    document.body.appendChild(el);
    el.refresh();

    const first = el.focusBoundary('first', { focus: false, scroll: false });
    expect(first?.textContent).toContain('Alpha');
    expect(first?.getAttribute('data-active')).toBe('true');

    const moved = el.move(1, { current: first, focus: false, scroll: false });
    expect(moved?.textContent).toContain('Gamma');
    expect(moved?.getAttribute('data-active')).toBe('true');
    expect(first?.hasAttribute('data-active')).toBe(false);

    const matched = el.typeahead('al', { current: moved, focus: false, scroll: false });
    expect(matched?.textContent).toContain('Alpha');
    expect(moved?.hasAttribute('data-active')).toBe(false);
  });

  it('injects base option text styling into the host root', () => {
    const host = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });
    const el = document.createElement('ui-listbox') as UIListbox;
    shadow.appendChild(el);
    document.body.appendChild(host);

    const style = shadow.querySelector('style[data-ui-listbox-base-style]');
    expect(style?.textContent).toContain('ui-listbox .option-label');
    expect(style?.textContent).toContain('ui-listbox .option-description');
    expect(style?.textContent).toContain('ui-listbox .option-text');
  });

  it('activates and emits selection events when an option is clicked', () => {
    const el = document.createElement('ui-listbox') as UIListbox;
    el.setAttribute('item-selector', '.item');
    el.setAttribute('item-role', 'option');
    el.innerHTML = `
      <button class="item" data-value="alpha">Alpha</button>
      <button class="item" data-value="bravo">Bravo</button>
    `;

    const selections: string[] = [];
    el.addEventListener('select', (event) => {
      selections.push((event as CustomEvent<{ value: string }>).detail.value);
    });

    document.body.appendChild(el);
    el.refresh();

    const bravo = el.querySelector('[data-value="bravo"]') as HTMLButtonElement | null;
    expect(bravo).toBeTruthy();
    bravo?.click();

    expect(bravo?.getAttribute('data-active')).toBe('true');
    expect(selections).toEqual(['bravo']);
  });
});

import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-roving-focus-group';
import { UIRovingFocusGroup } from '../components/ui-roving-focus-group';

describe('ui-roving-focus-group component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('moves active focus across enabled items and keeps one tabbable item', () => {
    const el = document.createElement('ui-roving-focus-group') as UIRovingFocusGroup;
    el.setAttribute('item-selector', '.item');
    el.innerHTML = `
      <button class="item">Alpha</button>
      <button class="item" disabled>Bravo</button>
      <button class="item">Gamma</button>
    `;

    document.body.appendChild(el);

    const first = el.focusBoundary('first', { focus: false });
    expect(first?.textContent).toContain('Alpha');
    expect(first?.getAttribute('tabindex')).toBe('0');

    const moved = el.move(1, { current: first, focus: false });
    expect(moved?.textContent).toContain('Gamma');
    expect(moved?.getAttribute('tabindex')).toBe('0');
    expect(first?.getAttribute('tabindex')).toBe('-1');
  });
});

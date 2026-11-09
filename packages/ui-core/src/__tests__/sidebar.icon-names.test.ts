import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-sidebar';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
afterEach(() => { document.body.innerHTML = ''; });

describe('ui-sidebar item icons', () => {
  it('draws an icon name as an Editora icon and keeps other text as it is', async () => {
    const side = document.createElement('ui-sidebar');
    side.setAttribute('items', JSON.stringify([
      { value: 'expenses', label: 'Expenses', icon: 'receipt' },
      { value: 'reports', label: 'Reports', icon: 'chart-pie' },
      { value: 'fun', label: 'Fun', icon: '🎉' },
      { value: 'letter', label: 'Letter', icon: 'A' },
    ]));
    document.body.appendChild(side);
    await tick();
    const icon = (value: string) => side.shadowRoot!.querySelector(`.item-button[data-value="${value}"] .icon`)!;
    expect(icon('expenses').querySelector('ui-icon')!.getAttribute('name')).toBe('receipt');
    expect(icon('reports').querySelector('ui-icon')!.getAttribute('name')).toBe('chart-pie');
    expect(icon('fun').querySelector('ui-icon')).toBeNull();
    expect(icon('fun').textContent).toBe('🎉');
    expect(icon('letter').textContent).toBe('A');
    expect(customElements.get('ui-icon')).toBeDefined();
  });
});

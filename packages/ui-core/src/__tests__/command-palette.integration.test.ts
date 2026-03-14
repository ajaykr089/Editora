import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-command-palette';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-command-palette integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('uses ui-listbox for active command movement and selection', async () => {
    const el = document.createElement('ui-command-palette') as HTMLElement;
    el.innerHTML = `
      <button slot="command">Open file</button>
      <button slot="command">Rename symbol</button>
      <button slot="command">Format document</button>
    `;

    let selectedIndex: number | null = null;
    el.addEventListener('select', (event: Event) => {
      selectedIndex = (event as CustomEvent<{ index: number }>).detail.index;
    });

    document.body.appendChild(el);
    await flushMicrotask();

    el.setAttribute('open', '');
    await flushMicrotask();

    const command = el.shadowRoot?.querySelector('ui-command') as HTMLElement | null;
    expect(command).toBeTruthy();
    expect(command?.shadowRoot?.querySelector('ui-listbox.list')).toBeTruthy();

    const input = command?.shadowRoot?.querySelector('.search') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await flushMicrotask();

    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await flushMicrotask();

    expect(selectedIndex).toBe(1);
    expect(el.hasAttribute('open')).toBe(false);
  });
});

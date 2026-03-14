import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-command';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-command', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('filters commands and selects through keyboard navigation', async () => {
    const el = document.createElement('ui-command') as HTMLElement & { focusSearch(): void };
    el.innerHTML = `
      <button slot="command" data-value="open">Open file</button>
      <button slot="command" data-value="rename">Rename symbol</button>
      <button slot="command" data-value="format">Format document</button>
    `;

    let selected: string | undefined;
    el.addEventListener('select', (event: Event) => {
      selected = (event as CustomEvent<{ value?: string }>).detail.value;
    });

    document.body.appendChild(el);
    await flushMicrotask();

    el.focusSearch();
    const input = el.shadowRoot?.querySelector('.search') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    input!.value = 'ren';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    expect((el.querySelector('[data-value="open"]') as HTMLElement | null)?.hidden).toBe(true);
    expect((el.querySelector('[data-value="rename"]') as HTMLElement | null)?.hidden).toBe(false);

    input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(selected).toBe('rename');
  });

  it('emits query-change and empty state as the filter changes', async () => {
    const el = document.createElement('ui-command') as HTMLElement;
    el.innerHTML = `<button slot="command">Open file</button>`;

    let latestQuery = '';
    el.addEventListener('query-change', (event: Event) => {
      latestQuery = (event as CustomEvent<{ value: string }>).detail.value;
    });

    document.body.appendChild(el);
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.search') as HTMLInputElement | null;
    const empty = el.shadowRoot?.querySelector('.empty') as HTMLElement | null;
    expect(input).toBeTruthy();
    expect(empty).toBeTruthy();

    input!.value = 'missing';
    input!.dispatchEvent(new Event('input', { bubbles: true }));

    expect(latestQuery).toBe('missing');
    expect(empty?.hasAttribute('hidden')).toBe(false);
  });
});

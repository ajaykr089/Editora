import { describe, expect, it } from 'vitest';
import '../components/ui-inline-edit';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-inline-edit', () => {
  it('enters edit mode and saves a new value', async () => {
    const el = document.createElement('ui-inline-edit') as HTMLElement;
    el.setAttribute('value', 'Draft copy');
    document.body.appendChild(el);
    await flushMicrotask();

    let saved = '';
    el.addEventListener('save', (event: Event) => {
      saved = (event as CustomEvent<{ value: string }>).detail.value;
    });

    (el.shadowRoot?.querySelector('.edit-btn') as HTMLButtonElement).click();
    await flushMicrotask();

    const input = el.shadowRoot?.querySelector('.field') as HTMLInputElement | null;
    if (input) {
      input.value = 'Published copy';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    (el.shadowRoot?.querySelector('.save-btn') as HTMLButtonElement).click();

    expect(el.getAttribute('value')).toBe('Published copy');
    expect(saved).toBe('Published copy');
  });
});

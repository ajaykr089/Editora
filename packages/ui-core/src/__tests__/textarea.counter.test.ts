import { describe, expect, it } from 'vitest';
import '../components/ui-textarea';

describe('ui-textarea counter', () => {
  it('counter shows the count like show-count', async () => {
    const el = document.createElement('ui-textarea');
    el.setAttribute('counter', '');
    el.setAttribute('value', 'abc');
    document.body.appendChild(el);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const count = el.shadowRoot!.querySelector('[id$="-count"]') as HTMLElement;
    expect(count).not.toBeNull();
    expect(count.hidden).toBe(false);
    expect(count.textContent).toContain('3');
    el.remove();
  });
});

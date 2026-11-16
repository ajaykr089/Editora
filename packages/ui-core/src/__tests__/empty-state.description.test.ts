import { describe, expect, it } from 'vitest';
import '../components/ui-empty-state';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('ui-empty-state description', () => {
  it('leaves the line out when there is no description', async () => {
    const el = document.createElement('ui-empty-state');
    el.setAttribute('title', 'A free day');
    document.body.appendChild(el);
    await tick();
    const p = el.shadowRoot!.querySelector('.description')!;
    expect(p.hasAttribute('hidden')).toBe(true);
    expect(el.shadowRoot!.textContent).not.toContain('Try adjusting');
    el.setAttribute('description', 'Nothing planned.');
    await tick();
    expect(el.shadowRoot!.querySelector('.description')!.hasAttribute('hidden')).toBe(false);
    el.remove();
  });

  it('shows a slotted description', async () => {
    const el = document.createElement('ui-empty-state');
    el.innerHTML = '<span slot="description">From a slot</span>';
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector('.description')!.hasAttribute('hidden')).toBe(false);
    el.remove();
  });
});

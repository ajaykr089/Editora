import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-anchor';

function settle() {
  return Promise.resolve();
}

describe('ui-anchor', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders an internal anchor and syncs navigation attributes', async () => {
    const el = document.createElement('ui-anchor');
    el.setAttribute('href', '/foundation');
    el.setAttribute('target', '_blank');
    el.textContent = 'Open Foundation';
    document.body.appendChild(el);
    await settle();

    const anchor = el.shadowRoot?.querySelector('a') as HTMLAnchorElement | null;
    const slot = el.shadowRoot?.querySelector('slot') as HTMLSlotElement | null;
    expect(anchor).toBeTruthy();
    expect(slot).toBeTruthy();
    expect(anchor?.getAttribute('href')).toBe('/foundation');
    expect(anchor?.getAttribute('target')).toBe('_blank');
    expect(el.textContent).toContain('Open Foundation');
  });

  it('marks the internal anchor as disabled when href is absent', async () => {
    const el = document.createElement('ui-anchor');
    el.textContent = 'Label';
    document.body.appendChild(el);
    await settle();

    const anchor = el.shadowRoot?.querySelector('a') as HTMLAnchorElement | null;
    expect(anchor?.hasAttribute('href')).toBe(false);
    expect(anchor?.getAttribute('aria-disabled')).toBe('true');
  });
});

import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-button';

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

function mount(html: string): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  return host.firstElementChild as HTMLElement;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-button variant names from other libraries', () => {
  it.each(['outline', 'soft', 'surface'])('variant="%s" gets the %s look in the accent colour', async (name) => {
    const el = mount(`<ui-button variant="${name}">Go</ui-button>`);
    await flush();
    expect(el.getAttribute('data-appearance')).toBe(name);
    expect(el.shadowRoot!.querySelector('.btn')!.className).toContain('btn--solid');
    // The app's own attributes are left alone.
    expect(el.hasAttribute('recipe')).toBe(false);
  });

  it('lets an explicit recipe win and follows variant changes', async () => {
    const el = mount('<ui-button variant="outline" recipe="soft">Go</ui-button>');
    await flush();
    expect(el.getAttribute('data-appearance')).toBe('soft');
    el.removeAttribute('recipe');
    await flush();
    expect(el.getAttribute('data-appearance')).toBe('outline');
    el.setAttribute('variant', 'secondary');
    await flush();
    expect(el.hasAttribute('data-appearance')).toBe(false);
  });

  it('has a link look that is not a filled button', async () => {
    const el = mount('<ui-button variant="link">Read more</ui-button>');
    await flush();
    const cls = el.shadowRoot!.querySelector('.btn')!.className;
    expect(cls).toContain('btn--link');
    expect(cls).not.toContain('btn--solid');
  });
});

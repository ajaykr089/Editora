import { describe, expect, it, vi } from 'vitest';
import '../components/ui-button';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

async function mount(attrs: Record<string, string>) {
  const el = document.createElement('ui-button');
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  el.textContent = 'Write an article';
  document.body.appendChild(el);
  await tick();
  return el;
}

describe('ui-button href', () => {
  it('renders a real link that looks like the button', async () => {
    const el = await mount({ href: './editor.html', target: '_blank' });
    const link = el.shadowRoot!.querySelector('a[part="button"]')!;
    expect(link.getAttribute('href')).toBe('./editor.html');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(el.shadowRoot!.querySelector('button')).toBeNull();
    el.remove();
  });

  it('asks before navigating, so an app router can keep the page', async () => {
    const el = await mount({ href: '/orders' });
    const onNavigate = vi.fn((event: Event) => event.preventDefault());
    el.addEventListener('navigate', onNavigate);
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, composed: true });
    el.shadowRoot!.querySelector('a')!.dispatchEvent(click);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect((onNavigate.mock.calls[0][0] as CustomEvent).detail.href).toBe('/orders');
    expect(click.defaultPrevented).toBe(true);
    el.remove();
  });

  it('a disabled link has no href and does nothing', async () => {
    const el = await mount({ href: '/orders', disabled: '' });
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.hasAttribute('href')).toBe(false);
    expect(link.getAttribute('aria-disabled')).toBe('true');
    const onNavigate = vi.fn();
    el.addEventListener('navigate', onNavigate);
    el.click();
    expect(onNavigate).not.toHaveBeenCalled();
    el.remove();
  });
});

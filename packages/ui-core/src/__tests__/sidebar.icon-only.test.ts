import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-sidebar';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const css = (el: Element) => Array.from(el.shadowRoot!.querySelectorAll('style')).map((node) => node.textContent).join('\n');

const ITEMS = [
  { value: 'home', label: 'Home', icon: 'home', href: '#/' },
  {
    value: 'reports', label: 'Reports', icon: 'chart-line',
    children: [
      { value: 'sales', label: 'Sales', href: '#/sales' },
      { value: 'traffic', label: 'Traffic', href: '#/traffic' },
    ],
  },
];

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement('ui-sidebar') as HTMLElement & { value: string };
  el.setAttribute('items', JSON.stringify(ITEMS));
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  document.body.appendChild(el);
  await tick();
  return el;
}

const button = (el: Element, value: string) =>
  Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>('.nav .item-button')).find((b) => b.dataset.value === value)!;
const flyout = (el: Element) => el.shadowRoot!.querySelector<HTMLElement>('.flyout')!;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-sidebar icon only (collapsed)', () => {
  it('keeps the labels for screen readers instead of display: none', async () => {
    const el = await mount({ collapsed: '' });
    const text = css(el);
    expect(text).toMatch(/:host\(\[collapsed\]\) \.nav \.copy \{[^}]*clip-path: inset\(50%\)/);
    expect(text).not.toMatch(/:host\(\[collapsed\]\) \.copy,/);
    expect(button(el, 'home').textContent).toContain('Home');
  });

  it('shows the label beside a hovered or focused item', async () => {
    const el = await mount({ collapsed: '' });
    button(el, 'home').dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
    const tip = el.shadowRoot!.querySelector<HTMLElement>('.tip')!;
    expect(tip.hidden).toBe(false);
    expect(tip.textContent).toBe('Home');
    expect(tip.getAttribute('aria-hidden')).toBe('true');
    button(el, 'home').dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
    expect(tip.hidden).toBe(true);
  });

  it('no tooltip while expanded', async () => {
    const el = await mount();
    button(el, 'home').dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
    expect(el.shadowRoot!.querySelector<HTMLElement>('.tip')!.hidden).toBe(true);
  });

  it('a group opens its pages in a flyout (it used to do nothing when collapsed)', async () => {
    const el = await mount({ collapsed: '', value: 'traffic' });
    const group = button(el, 'reports');
    group.click();
    expect(flyout(el).hidden).toBe(false);
    expect(group.getAttribute('aria-expanded')).toBe('true');
    expect(group.getAttribute('aria-controls')).toBe('flyout');
    expect(Array.from(flyout(el).querySelectorAll('.item-label')).map((n) => n.textContent)).toEqual(['Sales', 'Traffic']);
    expect(flyout(el).querySelector('[aria-current="page"]')?.textContent).toContain('Traffic');
    expect(el.shadowRoot!.activeElement?.textContent).toContain('Sales');
    // Escape closes it and returns focus to the group
    (el.shadowRoot!.activeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(flyout(el).hidden).toBe(true);
    expect(group.getAttribute('aria-expanded')).toBe('false');
    expect(el.shadowRoot!.activeElement).toBe(group);
  });

  it('choosing a page in the flyout selects it and closes the flyout', async () => {
    const el = await mount({ collapsed: '' });
    const seen: string[] = [];
    el.addEventListener('select', (e) => seen.push((e as CustomEvent).detail.value));
    button(el, 'reports').click();
    const sales = Array.from(flyout(el).querySelectorAll<HTMLElement>('.item-button')).find((b) => b.dataset.value === 'sales')!;
    sales.addEventListener('click', (e) => e.preventDefault());
    sales.click();
    expect(seen).toEqual(['sales']);
    expect(el.value).toBe('sales');
    expect(flyout(el).hidden).toBe(true);
  });

  it('a click on a group the pointer already opened keeps the flyout open', async () => {
    const el = await mount({ collapsed: '' });
    const group = button(el, 'reports');
    group.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
    expect(flyout(el).hidden).toBe(false);
    group.click();
    expect(flyout(el).hidden).toBe(false);
    // pinned: leaving does not close it; a second click does
    group.dispatchEvent(new Event('pointerout', { bubbles: true, composed: true }));
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(flyout(el).hidden).toBe(false);
    group.click();
    expect(flyout(el).hidden).toBe(true);
  });

  it('a hover-opened flyout closes when the pointer leaves', async () => {
    const el = await mount({ collapsed: '' });
    const group = button(el, 'reports');
    group.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
    group.dispatchEvent(new Event('pointerout', { bubbles: true, composed: true }));
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(flyout(el).hidden).toBe(true);
  });

  it('a click outside closes the flyout', async () => {
    const el = await mount({ collapsed: '' });
    button(el, 'reports').click();
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(flyout(el).hidden).toBe(true);
  });

  it('collapse-button toggles the sidebar', async () => {
    const el = await mount({ collapsible: '', 'collapse-button': '' });
    const toggle = el.shadowRoot!.querySelector<HTMLElement>('.collapse-btn')!;
    expect(toggle.getAttribute('aria-label')).toBe('Collapse sidebar');
    toggle.click();
    expect(el.hasAttribute('collapsed')).toBe(true);
    expect(toggle.getAttribute('aria-label')).toBe('Expand sidebar');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('no collapse button unless asked for', async () => {
    const el = await mount({ collapsible: '' });
    expect(el.shadowRoot!.querySelector('.collapse-btn')).toBeNull();
  });
});

describe('ui-sidebar solid, gradient and glass variants', () => {
  it('defines them, and keeps a group label readable on a brand fill', async () => {
    const el = await mount();
    const text = css(el);
    for (const variant of ['solid', 'gradient', 'glass']) expect(text).toContain(`:host([variant="${variant}"]) {`);
    expect(text).toMatch(/:host\(\[variant="solid"\]\) \{[^}]*--ui-sidebar-item-active-bg: var\(--ui-sidebar-accent\)/);
    expect(text).toContain(':host([variant="solid"]) .item-button[data-has-active="true"]:not([aria-current="page"])');
  });
});

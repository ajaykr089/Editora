import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-sidebar';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

const ITEMS = [
  { value: 'home', label: 'Home', icon: 'home', href: '#/' },
  {
    value: 'sales',
    label: 'Sales',
    icon: 'cart',
    description: 'Orders and customers',
    children: [
      { value: 'orders', label: 'Orders', href: '#/orders' },
      { value: 'customers', label: 'Customers', href: '#/customers' },
      { value: 'returns', label: 'Returns', section: 'After sale', href: '#/returns' }
    ]
  },
  {
    value: 'content',
    label: 'Content',
    icon: 'file',
    section: 'Workspace',
    children: [
      { value: 'posts', label: 'Posts', href: '#/posts' },
      { value: 'media', label: 'Media', href: '#/media' }
    ]
  }
];

async function mount(attrs: Record<string, string> = {}) {
  const el = document.createElement('ui-sidebar') as HTMLElement & { value: string };
  el.setAttribute('layout', 'dual');
  el.setAttribute('items', JSON.stringify(ITEMS));
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  document.body.appendChild(el);
  await tick();
  return el;
}

const rail = (el: Element) => Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>('.rail .item-button'));
const panelLabels = (el: Element) =>
  Array.from(el.shadowRoot!.querySelectorAll('.panel .item-label')).map((node) => node.textContent);
const panelTitle = (el: Element) => el.shadowRoot!.querySelector('.panel-title-label')?.textContent;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-sidebar layout="dual"', () => {
  it('puts top-level items on the rail and the open area in the panel', async () => {
    const el = await mount({ value: 'customers' });
    expect(rail(el).map((b) => b.querySelector('.rail-label')?.textContent)).toEqual(['Home', 'Sales', 'Content']);
    expect(panelTitle(el)).toBe('Sales');
    expect(el.shadowRoot!.querySelector('.panel-title-description')?.textContent).toBe('Orders and customers');
    expect(panelLabels(el)).toEqual(['Orders', 'Customers', 'Returns']);
    // a child's own section labels a group; the inherited one does not
    expect(Array.from(el.shadowRoot!.querySelectorAll('.panel .section-label')).map((n) => n.textContent)).toEqual(['After sale']);
    const [home, sales, content] = rail(el);
    expect(home.tagName).toBe('A');
    expect(sales.getAttribute('aria-expanded')).toBe('true');
    expect(sales.getAttribute('aria-controls')).toBe('panel');
    expect(sales.getAttribute('data-has-active')).toBe('true');
    expect(content.getAttribute('aria-expanded')).toBe('false');
    expect(el.shadowRoot!.querySelector('.panel [aria-current="page"]')?.textContent).toContain('Customers');
  });

  it('separates rail items of different sections', async () => {
    const el = await mount();
    expect(el.shadowRoot!.querySelectorAll('.rail .rail-divider')).toHaveLength(1);
  });

  it('opens an area on click without changing the value', async () => {
    const el = await mount({ value: 'orders' });
    const events: string[] = [];
    el.addEventListener('area-change', (e) => events.push((e as CustomEvent).detail.value));
    rail(el)[2].click();
    await tick();
    expect(panelTitle(el)).toBe('Content');
    expect(panelLabels(el)).toEqual(['Posts', 'Media']);
    expect(el.value).toBe('orders');
    expect(events).toEqual(['content']);
    expect(rail(el)[1].getAttribute('data-has-active')).toBe('true');
  });

  it('follows the value to its area', async () => {
    const el = await mount({ value: 'orders' });
    el.value = 'media';
    await tick();
    expect(panelTitle(el)).toBe('Content');
    expect(el.shadowRoot!.querySelector('.panel [aria-current="page"]')?.textContent).toContain('Media');
  });

  it('a top-level link on the rail is the current page', async () => {
    const el = await mount({ value: 'home' });
    expect(rail(el)[0].getAttribute('aria-current')).toBe('page');
    // the panel still shows the first area
    expect(panelTitle(el)).toBe('Sales');
  });

  it('collapsed shows the rail only; an area click opens the panel again', async () => {
    const el = await mount({ value: 'orders', collapsible: '', collapsed: '' });
    expect(el.style.getPropertyValue('inline-size')).toBe('var(--ui-sidebar-rail-width)');
    expect(rail(el)[1].getAttribute('aria-expanded')).toBe('false');
    rail(el)[1].click();
    await tick();
    expect(el.hasAttribute('collapsed')).toBe(false);
    expect(el.style.getPropertyValue('inline-size')).toContain('var(--ui-sidebar-rail-width) +');
    // clicking the open area folds the panel away
    rail(el)[1].click();
    await tick();
    expect(el.hasAttribute('collapsed')).toBe(true);
  });

  it('search filters the panel', async () => {
    const el = await mount({ value: 'orders', 'search-query': 'cust' });
    expect(panelLabels(el)).toEqual(['Customers']);
    expect(rail(el)).toHaveLength(3);
  });

  it('without any area there is no panel', async () => {
    const el = document.createElement('ui-sidebar');
    el.setAttribute('layout', 'dual');
    el.setAttribute('items', JSON.stringify([{ value: 'a', label: 'A', icon: 'home' }]));
    document.body.appendChild(el);
    await tick();
    expect(el.hasAttribute('data-panel-empty')).toBe(true);
    expect(el.shadowRoot!.querySelector('.panel-title')).toBeNull();
  });

  it('arrow keys walk the rail and move into the panel', async () => {
    const el = await mount({ value: 'orders' });
    const [home, sales] = rail(el);
    home.focus();
    home.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(el.shadowRoot!.activeElement).toBe(sales);
    sales.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(el.shadowRoot!.activeElement?.textContent).toContain('Orders');
    (el.shadowRoot!.activeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(el.shadowRoot!.activeElement).toBe(rail(el)[1]);
  });

  it('the classic list is unchanged without layout', async () => {
    const el = document.createElement('ui-sidebar');
    el.setAttribute('items', JSON.stringify(ITEMS));
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector('.rail')).toBeNull();
    expect(el.shadowRoot!.querySelectorAll('.item-button[data-action="toggle"]')).toHaveLength(2);
  });
});

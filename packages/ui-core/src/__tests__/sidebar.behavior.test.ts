import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-sidebar';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
  window.localStorage.clear();
});

describe('ui-sidebar behavior', () => {
  it('renders nested submenu items from the items attribute and toggles them open', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute(
      'items',
      JSON.stringify([
        {
          value: 'library',
          label: 'Library',
          children: [
            { value: 'books', label: 'Books' },
            { value: 'magazines', label: 'Magazines' }
          ]
        }
      ])
    );
    document.body.appendChild(el);
    await flushMicrotask();

    const toggle = el.shadowRoot?.querySelector('.item-button[data-action="toggle"]') as HTMLButtonElement | null;
    const item = el.shadowRoot?.querySelector('.item') as HTMLElement | null;
    const submenu = el.shadowRoot?.querySelector('.submenu') as HTMLElement | null;
    expect(toggle).toBeTruthy();
    expect(item?.hasAttribute('data-expanded')).toBe(false);
    expect(submenu?.hasAttribute('hidden')).toBe(false);

    toggle?.click();
    await flushMicrotask();

    expect(item?.getAttribute('data-expanded')).toBe('true');
    expect(el.shadowRoot?.textContent).toContain('Magazines');
  });

  it('parses slotted item nodes with nested data-children and renders svg icons from wrapper-provided html', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    const item = document.createElement('div');
    item.slot = 'item';
    item.dataset.value = 'library';
    item.dataset.label = 'Library';
    item.dataset.section = 'Library';
    item.dataset.iconHtml = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 3h6l2 2h6v8H1z"></path></svg>';
    item.dataset.children = JSON.stringify([{ value: 'books', label: 'Books' }]);
    item.textContent = 'Library';
    el.appendChild(item);
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.shadowRoot?.querySelector('.icon svg')).toBeTruthy();
    const toggle = el.shadowRoot?.querySelector('.item-button[data-action="toggle"]') as HTMLButtonElement | null;
    toggle?.click();
    await flushMicrotask();
    expect(el.shadowRoot?.textContent).toContain('Books');
  });

  it('renders custom item content html and applies section label transform overrides', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute('section-label-transform', 'none');
    const item = document.createElement('div');
    item.slot = 'item';
    item.dataset.value = 'collections';
    item.dataset.label = 'Collections';
    item.dataset.section = 'Library';
    item.dataset.contentHtml = '<span>Collections</span><span>Curated reading lists</span>';
    item.textContent = 'Collections';
    el.appendChild(item);
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.shadowRoot?.querySelector('.copy.custom-copy')?.innerHTML).toContain('Curated reading lists');
    expect(el.shadowRoot?.querySelector('.section-label')?.textContent).toBe('Library');
  });

  it('defaults section labels to no text transformation', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute(
      'items',
      JSON.stringify([{ section: 'Primary navigation', value: 'overview', label: 'Overview' }])
    );
    document.body.appendChild(el);
    await flushMicrotask();

    const label = el.shadowRoot?.querySelector('.section-label') as HTMLElement | null;
    expect(label?.textContent).toBe('Primary navigation');
  });

  it('filters items when search-query is set', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute(
      'items',
      JSON.stringify([
        { section: 'Library', value: 'books', label: 'Books' },
        { section: 'Library', value: 'magazines', label: 'Magazines' }
      ])
    );
    el.setAttribute('search-query', 'maga');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.shadowRoot?.textContent).toContain('Magazines');
    expect(el.shadowRoot?.textContent).not.toContain('Books');
  });

  it('renders leaf href items as anchors', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute(
      'items',
      JSON.stringify([
        { section: 'Library', value: 'books', label: 'Books', href: '/books', target: '_blank', rel: 'noreferrer' }
      ])
    );
    document.body.appendChild(el);
    await flushMicrotask();

    const link = el.shadowRoot?.querySelector('.item-button[href="/books"]') as HTMLAnchorElement | null;
    expect(link?.tagName).toBe('A');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noreferrer');
  });

  it('does not render an empty icon wrap when an item has no icon', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute(
      'items',
      JSON.stringify([
        {
          section: 'Library',
          value: 'collections',
          label: 'Collections',
          children: [{ value: 'guides', label: 'Guides' }]
        }
      ])
    );
    document.body.appendChild(el);
    await flushMicrotask();

    const toggle = el.shadowRoot?.querySelector('.item-button[data-action="toggle"]') as HTMLButtonElement | null;
    expect(toggle?.querySelector('.icon-wrap')).toBeNull();
  });

  it('only renders submenu arrows for items that actually have children', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute(
      'items',
      JSON.stringify([
        {
          section: 'Library',
          value: 'collections',
          label: 'Collections',
          children: [{ value: 'guides', label: 'Guides' }]
        },
        {
          section: 'Library',
          value: 'history',
          label: 'Reading history',
          badge: '12'
        }
      ])
    );
    document.body.appendChild(el);
    await flushMicrotask();

    const toggle = el.shadowRoot?.querySelector('.item-button[data-action="toggle"]') as HTMLButtonElement | null;
    const leaf = el.shadowRoot?.querySelector('.item-button[data-action="select"]') as HTMLButtonElement | null;
    expect(toggle?.querySelector('.arrow-wrap')).toBeTruthy();
    expect(leaf?.querySelector('.arrow-wrap')).toBeNull();
  });

  it('animates submenu expansion through expanded state instead of hidden toggling', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute(
      'items',
      JSON.stringify([
        {
          value: 'library',
          label: 'Library',
          children: [{ value: 'books', label: 'Books' }]
        }
      ])
    );
    document.body.appendChild(el);
    await flushMicrotask();

    const item = el.shadowRoot?.querySelector('.item') as HTMLElement | null;
    const toggle = el.shadowRoot?.querySelector('.item-button[data-action="toggle"]') as HTMLButtonElement | null;
    const submenu = el.shadowRoot?.querySelector('.submenu') as HTMLElement | null;
    expect(item?.hasAttribute('data-expanded')).toBe(false);
    expect(submenu?.hasAttribute('hidden')).toBe(false);

    toggle?.click();
    await flushMicrotask();

    expect(item?.getAttribute('data-expanded')).toBe('true');
  });

  it('selects a leaf item and emits select/change details', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute(
      'items',
      JSON.stringify([
        { section: 'Workspace', value: 'dashboard', label: 'Dashboard' },
        { section: 'Workspace', value: 'reports', label: 'Reports' }
      ])
    );
    document.body.appendChild(el);
    await flushMicrotask();

    let detail: Record<string, unknown> | null = null;
    el.addEventListener('select', (event) => {
      detail = (event as CustomEvent).detail;
    });

    const button = el.shadowRoot?.querySelector('.item-button[data-value="reports"]') as HTMLButtonElement | null;
    button?.click();
    await flushMicrotask();

    expect(el.getAttribute('value')).toBe('reports');
    expect(detail).toMatchObject({ value: 'reports', label: 'Reports' });
  });

  it('applies numeric radius values to the shell variables', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute('radius', '20');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.style.getPropertyValue('--ui-sidebar-radius')).toBe('20px');
    expect(el.style.getPropertyValue('--ui-sidebar-item-radius')).toBe('20px');
  });

  it('applies item radius and spacing overrides without a rerender path', async () => {
    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute('item-radius', '10');
    el.setAttribute('item-gap', '8');
    el.setAttribute('item-padding-x', '12');
    el.setAttribute('item-padding-y', '6');
    el.setAttribute('item-height', '45');
    el.setAttribute('item-font-size', '15');
    el.setAttribute('item-line-height', '22');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.style.getPropertyValue('--ui-sidebar-item-radius')).toBe('10px');
    expect(el.style.getPropertyValue('--ui-sidebar-item-gap')).toBe('8px');
    expect(el.style.getPropertyValue('--ui-sidebar-item-padding-x')).toBe('12px');
    expect(el.style.getPropertyValue('--ui-sidebar-item-padding-y')).toBe('6px');
    expect(el.style.getPropertyValue('--ui-sidebar-item-height')).toBe('45px');
    expect(el.style.getPropertyValue('--ui-sidebar-item-font-size')).toBe('15px');
    expect(el.style.getPropertyValue('--ui-sidebar-item-line-height')).toBe('22px');
  });

  it('auto-collapses on small viewports and can be expanded manually', async () => {
    const originalMatchMedia = window.matchMedia;
    let listener: ((event: { matches: boolean }) => void) | null = null;
    window.matchMedia = ((query: string) => ({
      matches: query === '(max-width: 767px)',
      media: query,
      onchange: null,
      addEventListener: (_type: string, cb: (event: { matches: boolean }) => void) => {
        listener = cb;
      },
      removeEventListener: () => {
        listener = null;
      },
      addListener: (cb: (event: { matches: boolean }) => void) => {
        listener = cb;
      },
      removeListener: () => {
        listener = null;
      },
      dispatchEvent: () => true
    })) as typeof window.matchMedia;

    const el = document.createElement('ui-sidebar') as HTMLElement;
    el.setAttribute('collapsible', '');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.hasAttribute('collapsed')).toBe(true);

    (el as unknown as { expand: () => void }).expand();
    await flushMicrotask();

    expect(el.hasAttribute('collapsed')).toBe(false);

    listener?.({ matches: false });
    await flushMicrotask();

    expect(el.hasAttribute('collapsed')).toBe(false);
    window.matchMedia = originalMatchMedia;
  });
});

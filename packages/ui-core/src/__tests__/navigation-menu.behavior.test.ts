import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-navigation-menu';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-navigation-menu', () => {
  it('stays closed by default until an item activates a panel', async () => {
    const el = document.createElement('ui-navigation-menu');
    el.innerHTML = `
      <button slot="item">Overview</button>
      <button slot="item">Reports</button>
      <section slot="panel">Overview panel</section>
      <section slot="panel">Reports panel</section>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const viewport = el.shadowRoot?.querySelector('.viewport-shell');
    const items = Array.from(el.querySelectorAll('[slot="item"]'));
    expect(el.getAttribute('selected')).toBeNull();
    expect(viewport?.hasAttribute('hidden')).toBe(true);
    expect(el.hasAttribute('data-open')).toBe(false);
    expect(items[0]?.getAttribute('tabindex')).toBe('0');
    expect(items[0]?.getAttribute('data-active')).toBe('false');
  });

  it('normalizes numeric and full radius values', async () => {
    const el = document.createElement('ui-navigation-menu');
    el.setAttribute('radius', '12');
    document.body.appendChild(el);
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-nav-radius')).toBe('12px');

    el.setAttribute('radius', 'full');
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-nav-radius')).toBe('999px');
  });

  it('syncs tabs and panels from slotted content', async () => {
    const el = document.createElement('ui-navigation-menu');
    el.setAttribute('selected', '0');
    el.innerHTML = `
      <button slot="item">Overview</button>
      <button slot="item">Reports</button>
      <section slot="panel">Overview panel</section>
      <section slot="panel">Reports panel</section>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const items = Array.from(el.querySelectorAll('[slot="item"]'));
    const panels = Array.from(el.querySelectorAll('[slot="panel"]'));
    expect(el.getAttribute('data-open')).toBe('true');
    expect(items[0]?.getAttribute('data-active')).toBe('true');
    expect(items[1]?.getAttribute('data-active')).toBe('false');
    expect(panels[0]?.hasAttribute('hidden')).toBe(false);
    expect(panels[1]?.hasAttribute('hidden')).toBe(true);
  });

  it('updates selection on click and emits change detail', async () => {
    const el = document.createElement('ui-navigation-menu');
    el.setAttribute('selected', '0');
    el.innerHTML = `
      <button slot="item">Overview</button>
      <button slot="item">Reports</button>
      <section slot="panel">Overview panel</section>
      <section slot="panel">Reports panel</section>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    let detail: CustomEvent['detail'] | undefined;
    el.addEventListener('change', (event) => {
      detail = (event as CustomEvent).detail;
    });

    (el.querySelectorAll('[slot="item"]')[1] as HTMLButtonElement).click();
    await flushMicrotask();

    expect(el.getAttribute('selected')).toBe('1');
    expect(detail).toMatchObject({ selected: 1, previous: 0, reason: 'click' });
  });

  it('supports top-level link items without a matching panel', async () => {
    const el = document.createElement('ui-navigation-menu');
    el.setAttribute('selected', '0');
    el.innerHTML = `
      <button slot="item" data-nav-key="learn">Learn</button>
      <button slot="item" data-nav-key="overview">Overview</button>
      <a slot="item" data-nav-key="github" href="https://example.com">Github</a>
      <section slot="panel" data-nav-panel-for="learn">Learn panel</section>
      <section slot="panel" data-nav-panel-for="overview">Overview panel</section>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const items = Array.from(el.querySelectorAll('[slot="item"]'));
    const panels = Array.from(el.querySelectorAll('[slot="panel"]'));
    expect(items[2]?.hasAttribute('aria-controls')).toBe(false);
    expect(panels[0]?.getAttribute('data-active')).toBe('true');
    expect(panels[1]?.getAttribute('data-active')).toBe('false');

    (items[2] as HTMLAnchorElement).click();
    await flushMicrotask();

    expect(el.getAttribute('selected')).toBe('2');
    expect(el.hasAttribute('data-open')).toBe(false);
    expect(panels[0]?.hasAttribute('hidden')).toBe(true);
    expect(panels[1]?.hasAttribute('hidden')).toBe(true);
  });

  it('flips the viewport above when there is not enough room below', async () => {
    const el = document.createElement('ui-navigation-menu');
    el.setAttribute('selected', '0');
    el.innerHTML = `
      <button slot="item">Overview</button>
      <button slot="item">Reports</button>
      <section slot="panel">Overview panel</section>
      <section slot="panel">Reports panel</section>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const bar = el.shadowRoot?.querySelector('.bar') as HTMLElement | null;
    const viewport = el.shadowRoot?.querySelector('.viewport') as HTMLElement | null;
    expect(bar).toBeTruthy();
    expect(viewport).toBeTruthy();

    const originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 500
    });

    bar!.getBoundingClientRect = () =>
      ({
        top: 420,
        bottom: 460,
        left: 0,
        right: 400,
        width: 400,
        height: 40,
        x: 0,
        y: 420,
        toJSON() {
          return {};
        }
      }) as DOMRect;

    viewport!.getBoundingClientRect = () =>
      ({
        top: 0,
        bottom: 280,
        left: 0,
        right: 640,
        width: 640,
        height: 280,
        x: 0,
        y: 0,
        toJSON() {
          return {};
        }
      }) as DOMRect;

    Object.defineProperty(viewport!, 'scrollHeight', {
      configurable: true,
      value: 280
    });

    window.dispatchEvent(new Event('resize'));
    await flushMicrotask();

    expect(el.getAttribute('data-side')).toBe('top');

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: originalInnerHeight
    });
  });

  it('closes sibling navigation menus when one instance opens', async () => {
    const first = document.createElement('ui-navigation-menu');
    first.setAttribute('selected', '0');
    first.innerHTML = `
      <button slot="item">Learn</button>
      <button slot="item">Overview</button>
      <section slot="panel">Learn panel</section>
      <section slot="panel">Overview panel</section>
    `;

    const second = document.createElement('ui-navigation-menu');
    second.innerHTML = `
      <button slot="item">Learn</button>
      <button slot="item">Overview</button>
      <section slot="panel">Learn panel</section>
      <section slot="panel">Overview panel</section>
    `;

    document.body.appendChild(first);
    document.body.appendChild(second);
    await flushMicrotask();

    expect(first.getAttribute('selected')).toBe('0');
    expect(first.getAttribute('data-open')).toBe('true');

    (second.querySelectorAll('[slot="item"]')[1] as HTMLButtonElement).click();
    await flushMicrotask();

    expect(second.getAttribute('selected')).toBe('1');
    expect(second.getAttribute('data-open')).toBe('true');
    expect(first.getAttribute('selected')).toBe('-1');
    expect(first.hasAttribute('data-open')).toBe(false);
  });
});

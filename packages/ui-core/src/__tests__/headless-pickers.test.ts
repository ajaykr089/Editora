import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCombobox, createContextMenu, createNavigationMenu, createScrollArea, createSelect, createToaster } from '../headless';

function html(markup: string): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = markup;
  document.body.appendChild(host);
  return host;
}
const key = (el: Element, name: string, init: KeyboardEventInit = {}) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...init }));
const pe = (type: string, init: MouseEventInit & { pointerType?: string } = {}) => {
  const ev = new MouseEvent(type, { bubbles: true, cancelable: true, ...init });
  Object.defineProperty(ev, 'pointerType', { value: init.pointerType ?? 'mouse' });
  Object.defineProperty(ev, 'pointerId', { value: 1 });
  return ev;
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('createContextMenu', () => {
  const markup = '<div id="area" tabindex="0">Right click here</div><div id="menu"><button data-menu-item>Copy</button><button data-menu-item>Paste</button></div>';

  it('opens on contextmenu, focuses the first item, chooses and returns focus', () => {
    const host = html(markup);
    const onSelect = vi.fn();
    const ctx = createContextMenu({ target: host.querySelector('#area') as HTMLElement, menu: host.querySelector('#menu') as HTMLElement, onSelect });
    const area = host.querySelector('#area') as HTMLElement;
    area.focus();
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 40, clientY: 50 });
    area.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(ctx.isOpen).toBe(true);
    const items = host.querySelectorAll<HTMLElement>('[data-menu-item]');
    expect(document.activeElement).toBe(items[0]);
    expect(host.querySelector('#menu')!.getAttribute('role')).toBe('menu');
    key(items[0], 'ArrowDown');
    expect(document.activeElement).toBe(items[1]);
    items[1].click();
    expect(onSelect).toHaveBeenCalledWith(items[1]);
    expect(ctx.isOpen).toBe(false);
    expect(document.activeElement).toBe(area);
  });

  it('opens with Shift+F10 and the ContextMenu key, and on a touch long press', () => {
    vi.useFakeTimers();
    const host = html(markup);
    const ctx = createContextMenu({ target: host.querySelector('#area') as HTMLElement, menu: host.querySelector('#menu') as HTMLElement });
    const area = host.querySelector('#area') as HTMLElement;
    area.focus();
    key(area, 'F10', { shiftKey: true });
    expect(ctx.isOpen).toBe(true);
    key(document.activeElement!, 'Escape');
    ctx.close();
    key(area, 'ContextMenu');
    expect(ctx.isOpen).toBe(true);
    ctx.close();
    area.dispatchEvent(pe('pointerdown', { pointerType: 'touch', clientX: 10, clientY: 10 }));
    vi.advanceTimersByTime(699);
    expect(ctx.isOpen).toBe(false);
    vi.advanceTimersByTime(1);
    expect(ctx.isOpen).toBe(true);
    ctx.close();
    area.dispatchEvent(pe('pointerdown', { pointerType: 'touch', clientX: 10, clientY: 10 }));
    area.dispatchEvent(pe('pointermove', { pointerType: 'touch', clientX: 40, clientY: 10 }));
    vi.advanceTimersByTime(1000);
    expect(ctx.isOpen).toBe(false);
  });
});

describe('createSelect', () => {
  const markup = '<form id="f"><button id="t"><span data-select-value></span></button><div id="l" aria-label="Fruit"><div data-option data-value="apple">Apple</div><div data-option data-value="banana" aria-disabled="true">Banana</div><div data-option data-value="cherry">Cherry</div></div></form>';

  it('is a select-only combobox: focus stays on the trigger, active descendant moves', () => {
    const host = html(`<label for="t">Fruit</label>${markup}`);
    const onValueChange = vi.fn();
    const select = createSelect({ trigger: host.querySelector('#t') as HTMLElement, listbox: host.querySelector('#l') as HTMLElement, placeholder: 'Pick a fruit', onValueChange, name: 'fruit' });
    const t = host.querySelector('#t') as HTMLElement;
    const opts = host.querySelectorAll<HTMLElement>('[data-option]');
    expect(t.getAttribute('role')).toBe('combobox');
    expect(t.getAttribute('aria-haspopup')).toBe('listbox');
    expect(t.getAttribute('aria-labelledby')).toBe(host.querySelector('label')!.id);
    expect(t.textContent).toBe('Pick a fruit');
    expect(t.hasAttribute('data-placeholder')).toBe(true);
    t.focus();
    key(t, 'ArrowDown');
    expect(select.isOpen).toBe(true);
    expect(t.getAttribute('aria-activedescendant')).toBe(opts[0].id);
    key(t, 'ArrowDown');
    expect(t.getAttribute('aria-activedescendant')).toBe(opts[2].id);
    key(t, 'Enter');
    expect(select.value).toBe('cherry');
    expect(select.isOpen).toBe(false);
    expect(document.activeElement).toBe(t);
    expect(t.textContent).toBe('Cherry');
    expect(opts[2].getAttribute('aria-selected')).toBe('true');
    expect(new FormData(host.querySelector('#f') as HTMLFormElement).get('fruit')).toBe('cherry');
    expect(onValueChange).toHaveBeenCalledWith('cherry');
  });

  it('typing while closed selects; the keyboard click after Enter does not reopen; Escape closes', () => {
    const host = html(markup);
    const select = createSelect({ trigger: host.querySelector('#t') as HTMLElement, listbox: host.querySelector('#l') as HTMLElement });
    const t = host.querySelector('#t') as HTMLButtonElement;
    t.focus();
    key(t, 'c');
    expect(select.value).toBe('cherry');
    expect(select.isOpen).toBe(false);
    key(t, 'Enter');
    t.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 0 }));
    expect(select.isOpen).toBe(true);
    key(t, 'Escape');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(select.isOpen).toBe(false);
    t.click();
    expect(select.isOpen).toBe(true);
    host.querySelectorAll<HTMLElement>('[data-option]')[0].click();
    expect(select.value).toBe('apple');
  });
});

describe('createCombobox', () => {
  const markup = '<label for="i">Country</label><input id="i"><div id="l"><div data-option data-value="fr">France</div><div data-option data-value="de">Germany</div><div data-option data-value="gr">Greece</div><div data-combobox-empty>No matches</div></div>';

  it('filters as you type, Enter chooses the active option', () => {
    const host = html(markup);
    const onValueChange = vi.fn();
    const combo = createCombobox({ input: host.querySelector('#i') as HTMLInputElement, listbox: host.querySelector('#l') as HTMLElement, onValueChange });
    const input = host.querySelector('#i') as HTMLInputElement;
    const opts = host.querySelectorAll<HTMLElement>('[data-option]');
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(host.querySelector('#l')!.getAttribute('aria-labelledby')).toBe(host.querySelector('label')!.id);
    input.focus();
    input.value = 'gr';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(combo.isOpen).toBe(true);
    expect([...opts].map((o) => o.hidden)).toEqual([true, true, false]);
    expect(input.getAttribute('aria-activedescendant')).toBe(opts[2].id);
    key(input, 'Enter');
    expect(combo.value).toBe('gr');
    expect(input.value).toBe('Greece');
    expect(onValueChange).toHaveBeenCalledWith('gr');
    input.value = 'zz';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect((host.querySelector('[data-combobox-empty]') as HTMLElement).hidden).toBe(false);
  });

  it('arrows open and move, Escape closes then clears, blur closes', () => {
    const host = html(markup);
    const combo = createCombobox({ input: host.querySelector('#i') as HTMLInputElement, listbox: host.querySelector('#l') as HTMLElement });
    const input = host.querySelector('#i') as HTMLInputElement;
    const opts = host.querySelectorAll<HTMLElement>('[data-option]');
    input.focus();
    key(input, 'ArrowDown');
    expect(input.getAttribute('aria-activedescendant')).toBe(opts[0].id);
    key(input, 'ArrowUp');
    expect(input.getAttribute('aria-activedescendant')).toBe(opts[2].id);
    key(input, 'Escape');
    expect(combo.isOpen).toBe(false);
    input.value = 'x';
    key(input, 'Escape');
    expect(input.value).toBe('');
    key(input, 'ArrowDown');
    input.blur();
    expect(combo.isOpen).toBe(false);
  });
});

describe('createNavigationMenu', () => {
  const markup = `<nav id="n" aria-label="Main">
    <ul>
      <li data-nav-item data-value="products"><button data-nav-trigger>Products</button><div data-nav-content><a href="#a">Editor</a><a href="#b">Charts</a></div></li>
      <li data-nav-item data-value="docs"><button data-nav-trigger>Docs</button><div data-nav-content><a href="#c">Guide</a></div></li>
      <li data-nav-item><a href="#blog">Blog</a></li>
    </ul>
  </nav><button id="out">Outside</button>`;

  it('click toggles one panel at a time, Escape returns to the trigger', () => {
    const host = html(markup);
    const nav = createNavigationMenu({ root: host.querySelector('#n') as HTMLElement });
    const [products, docs] = Array.from(host.querySelectorAll<HTMLElement>('[data-nav-trigger]'));
    const panels = host.querySelectorAll<HTMLElement>('[data-nav-content]');
    expect(products.getAttribute('aria-expanded')).toBe('false');
    expect(panels[0].hidden).toBe(true);
    products.click();
    expect(nav.value).toBe('products');
    expect(panels[0].hidden).toBe(false);
    docs.click();
    expect(panels[0].hidden).toBe(true);
    expect(docs.getAttribute('aria-expanded')).toBe('true');
    panels[1].querySelector('a')!.focus();
    key(panels[1].querySelector('a')!, 'Escape');
    expect(nav.value).toBe('');
    expect(document.activeElement).toBe(docs);
  });

  it('arrows move between entries, Arrow Down enters a panel, hover opens after the delay', () => {
    vi.useFakeTimers();
    const host = html(markup);
    const nav = createNavigationMenu({ root: host.querySelector('#n') as HTMLElement });
    const [products, docs] = Array.from(host.querySelectorAll<HTMLElement>('[data-nav-trigger]'));
    products.focus();
    key(products, 'ArrowRight');
    expect(document.activeElement).toBe(docs);
    key(docs, 'ArrowRight');
    expect(document.activeElement).toBe(host.querySelector('a[href="#blog"]'));
    key(document.activeElement!, 'Home');
    key(products, 'ArrowDown');
    expect(nav.value).toBe('products');
    expect(document.activeElement).toBe(host.querySelector('a[href="#a"]'));
    key(document.activeElement!, 'ArrowDown');
    expect(document.activeElement).toBe(host.querySelector('a[href="#b"]'));
    nav.setValue('');
    docs.dispatchEvent(pe('pointerover'));
    vi.advanceTimersByTime(199);
    expect(nav.value).toBe('');
    vi.advanceTimersByTime(1);
    expect(nav.value).toBe('docs');
    host.querySelector('#out')!.dispatchEvent(pe('pointerdown'));
    expect(nav.value).toBe('');
  });
});

describe('createScrollArea', () => {
  it('sizes and moves the thumb to match the viewport, hides tracks without overflow', () => {
    const host = html('<div id="r"><div data-scroll-viewport style="height:100px"><div style="height:400px"></div></div><div data-scrollbar="vertical"><div data-scroll-thumb></div></div><div data-scrollbar="horizontal"><div data-scroll-thumb></div></div></div>');
    const viewport = host.querySelector('[data-scroll-viewport]') as HTMLElement;
    const [vTrack, hTrack] = Array.from(host.querySelectorAll<HTMLElement>('[data-scrollbar]'));
    for (const [prop, val] of Object.entries({ clientHeight: 100, scrollHeight: 400, clientWidth: 200, scrollWidth: 200 })) Object.defineProperty(viewport, prop, { configurable: true, value: val });
    Object.defineProperty(vTrack, 'clientHeight', { configurable: true, value: 100 });
    const area = createScrollArea({ root: host.querySelector('#r') as HTMLElement, type: 'always' });
    const thumb = vTrack.querySelector('[data-scroll-thumb]') as HTMLElement;
    expect(viewport.tabIndex).toBe(0);
    expect(vTrack.getAttribute('aria-hidden')).toBe('true');
    expect(thumb.style.height).toBe('25px');
    expect(vTrack.dataset.state).toBe('visible');
    expect(hTrack.hidden).toBe(false);
    expect(hTrack.dataset.state).toBe('hidden');
    viewport.scrollTop = 300;
    viewport.dispatchEvent(new Event('scroll'));
    expect(thumb.style.transform).toBe('translateY(75px)');
    area.destroy();
  });

  it('hover type shows the bars only while hovered', () => {
    vi.useFakeTimers();
    const host = html('<div id="r"><div data-scroll-viewport></div><div data-scrollbar="vertical"><div data-scroll-thumb></div></div></div>');
    const viewport = host.querySelector('[data-scroll-viewport]') as HTMLElement;
    Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 100 });
    Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 300 });
    createScrollArea({ root: host.querySelector('#r') as HTMLElement });
    const track = host.querySelector('[data-scrollbar]') as HTMLElement;
    expect(track.dataset.state).toBe('hidden');
    host.querySelector('#r')!.dispatchEvent(pe('pointerenter', { bubbles: false }));
    expect(track.dataset.state).toBe('visible');
    host.querySelector('#r')!.dispatchEvent(pe('pointerleave', { bubbles: false }));
    vi.advanceTimersByTime(600);
    expect(track.dataset.state).toBe('hidden');
  });
});

describe('createToaster', () => {
  it('announces through a live region, times out, pauses while hovered', async () => {
    vi.useFakeTimers();
    const host = html('<section id="r"></section>');
    const region = host.querySelector('#r') as HTMLElement;
    const onDismiss = vi.fn();
    const toaster = createToaster({ region, duration: 1000, onDismiss });
    expect(region.getAttribute('role')).toBe('region');
    expect(region.getAttribute('aria-label')).toBe('Notifications (F8)');
    const li = document.createElement('li');
    li.innerHTML = '<strong>Saved</strong><p>Your draft is safe</p><button data-toast-close>Close</button>';
    region.appendChild(li);
    const id = toaster.add(li);
    vi.advanceTimersByTime(60);
    expect(document.querySelector('[data-toast-announcer="assertive"]')!.textContent).toBe('Saved Your draft is safe');
    region.dispatchEvent(pe('pointerenter', { bubbles: false }));
    vi.advanceTimersByTime(5000);
    expect(onDismiss).not.toHaveBeenCalled();
    region.dispatchEvent(pe('pointerleave', { bubbles: false }));
    vi.advanceTimersByTime(1000);
    expect(onDismiss).toHaveBeenCalledWith(li, id);
    expect(li.dataset.state).toBe('closed');
  });

  it('F8 focuses the toasts, Escape and the close button dismiss, a swipe dismisses', () => {
    const host = html('<ol id="r"></ol>');
    const region = host.querySelector('#r') as HTMLElement;
    const toaster = createToaster({ region, duration: Infinity });
    expect(region.hasAttribute('role')).toBe(false);
    expect(region.getAttribute('aria-label')).toBe('Notifications (F8)');
    const make = (text: string) => {
      const li = document.createElement('li');
      li.innerHTML = `<p>${text}</p><button data-toast-close>Close</button>`;
      region.appendChild(li);
      toaster.add(li, { type: 'background' });
      return li;
    };
    const a = make('A');
    const b = make('B');
    const c = make('C');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'F8', bubbles: true }));
    expect(document.activeElement).toBe(a);
    key(a, 'Escape');
    expect(a.isConnected).toBe(false);
    expect(document.activeElement).toBe(b);
    (b.querySelector('[data-toast-close]') as HTMLElement).click();
    expect(b.isConnected).toBe(false);
    c.dispatchEvent(pe('pointerdown', { clientX: 0, button: 0 }));
    c.dispatchEvent(pe('pointermove', { clientX: 30 }));
    expect(c.style.getPropertyValue('--toast-swipe')).toBe('30px');
    c.dispatchEvent(pe('pointerup', { clientX: 30 }));
    expect(c.isConnected).toBe(true);
    c.dispatchEvent(pe('pointerdown', { clientX: 0, button: 0 }));
    c.dispatchEvent(pe('pointermove', { clientX: 80 }));
    c.dispatchEvent(pe('pointerup', { clientX: 80 }));
    expect(c.isConnected).toBe(false);
    toaster.destroy();
    expect(document.querySelector('[data-toast-announcer]')).toBe(null);
  });

  it('a toast closed under the pointer does not leave the next one paused', () => {
    vi.useFakeTimers();
    const host = html('<section id="r"></section>');
    const region = host.querySelector('#r') as HTMLElement;
    const toaster = createToaster({ region, duration: 1000 });
    const make = () => {
      const li = document.createElement('div');
      li.innerHTML = 'Saved <button data-toast-close>Close</button>';
      region.appendChild(li);
      toaster.add(li);
      return li;
    };
    const first = make();
    region.dispatchEvent(pe('pointerenter', { bubbles: false }));
    (first.querySelector('[data-toast-close]') as HTMLElement).click();
    // No pointerleave: the region emptied under the pointer.
    (document.activeElement as HTMLElement | null)?.blur();
    const second = make();
    vi.advanceTimersByTime(1000);
    expect(second.isConnected).toBe(false);
  });
});


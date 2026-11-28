import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAccordion, createCollapsible, createHoverCard, createToggleGroup, createToolbar, createTooltip } from '../headless';

function html(markup: string): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = markup;
  document.body.appendChild(host);
  return host;
}
function pe(type: string, pointerType = 'mouse'): Event {
  const ev = new MouseEvent(type, { bubbles: false });
  Object.defineProperty(ev, 'pointerType', { value: pointerType });
  return ev;
}
const key = (el: Element, name: string) => el.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('createCollapsible', () => {
  it('toggles the content and reports it', () => {
    const host = html('<button id="t">Details</button><div id="c">More</div>');
    const onOpenChange = vi.fn();
    const ctl = createCollapsible({ trigger: host.querySelector('#t') as HTMLElement, content: host.querySelector('#c') as HTMLElement, onOpenChange });
    const t = host.querySelector('#t') as HTMLButtonElement;
    expect(t.getAttribute('aria-expanded')).toBe('false');
    expect(t.getAttribute('aria-controls')).toBe('c');
    expect((host.querySelector('#c') as HTMLElement).hidden).toBe(true);
    t.click();
    expect(ctl.isOpen).toBe(true);
    expect(t.getAttribute('data-state')).toBe('open');
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('does nothing when disabled', () => {
    const host = html('<button id="t">Details</button><div id="c">More</div>');
    const ctl = createCollapsible({ trigger: host.querySelector('#t') as HTMLElement, content: host.querySelector('#c') as HTMLElement, disabled: true });
    (host.querySelector('#t') as HTMLButtonElement).click();
    expect(ctl.isOpen).toBe(false);
  });
});

describe('createAccordion', () => {
  const markup = ['a', 'b', 'c'].map((v) => `<div data-accordion-item data-value="${v}"><h3><button data-accordion-trigger>${v}</button></h3><div data-accordion-content>${v} body</div></div>`).join('');

  it('opens one item at a time and labels the panels', () => {
    const host = html(`<div id="r">${markup}</div>`);
    const onValueChange = vi.fn();
    const ctl = createAccordion({ root: host.querySelector('#r') as HTMLElement, onValueChange });
    const triggers = host.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]');
    const panels = host.querySelectorAll<HTMLElement>('[data-accordion-content]');
    expect(panels[0].getAttribute('role')).toBe('region');
    expect(panels[0].getAttribute('aria-labelledby')).toBe(triggers[0].id);
    triggers[0].click();
    triggers[1].click();
    expect(ctl.value).toEqual(['b']);
    expect(panels[0].hidden).toBe(true);
    expect(panels[1].hidden).toBe(false);
    triggers[1].click();
    expect(ctl.value).toEqual([]);
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it('keeps one open when not collapsible, and allows several when multiple', () => {
    const host = html(`<div id="r">${markup}</div><div id="m">${markup}</div>`);
    const single = createAccordion({ root: host.querySelector('#r') as HTMLElement, collapsible: false, defaultValue: ['a'] });
    const t = host.querySelectorAll<HTMLButtonElement>('#r [data-accordion-trigger]');
    t[0].click();
    expect(single.value).toEqual(['a']);
    expect(t[0].getAttribute('aria-disabled')).toBe('true');
    const multi = createAccordion({ root: host.querySelector('#m') as HTMLElement, type: 'multiple' });
    const m = host.querySelectorAll<HTMLButtonElement>('#m [data-accordion-trigger]');
    m[0].click();
    m[2].click();
    expect(multi.value).toEqual(['a', 'c']);
  });

  it('moves between triggers with arrows, Home and End', () => {
    const host = html(`<div id="r">${markup}</div>`);
    createAccordion({ root: host.querySelector('#r') as HTMLElement });
    const t = host.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]');
    t[0].focus();
    key(t[0], 'ArrowDown');
    expect(document.activeElement).toBe(t[1]);
    key(t[1], 'End');
    expect(document.activeElement).toBe(t[2]);
    key(t[2], 'ArrowDown');
    expect(document.activeElement).toBe(t[0]);
  });
});

describe('createTooltip', () => {
  it('describes its trigger and shows after the delay on hover, hides on leave and Escape', () => {
    vi.useFakeTimers();
    const host = html('<button id="t">Save</button><div id="tip">Saves the draft</div>');
    const tip = createTooltip({ trigger: host.querySelector('#t') as HTMLElement, content: host.querySelector('#tip') as HTMLElement, delay: 300 });
    const t = host.querySelector('#t')!;
    expect(host.querySelector('#tip')!.getAttribute('role')).toBe('tooltip');
    expect(t.getAttribute('aria-describedby')).toBe('tip');
    t.dispatchEvent(pe('pointerenter', 'mouse'));
    vi.advanceTimersByTime(299);
    expect(tip.isOpen).toBe(false);
    vi.advanceTimersByTime(1);
    expect(tip.isOpen).toBe(true);
    // Moving onto the tooltip keeps it (WCAG 1.4.13).
    t.dispatchEvent(pe('pointerleave'));
    host.querySelector('#tip')!.dispatchEvent(pe('pointerenter'));
    vi.advanceTimersByTime(500);
    expect(tip.isOpen).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(tip.isOpen).toBe(false);
  });

  it('only one tooltip is open at a time, and touch does not open it', () => {
    vi.useFakeTimers();
    const host = html('<button id="a">A</button><div id="ta">A tip</div><button id="b">B</button><div id="tb">B tip</div>');
    const a = createTooltip({ trigger: host.querySelector('#a') as HTMLElement, content: host.querySelector('#ta') as HTMLElement });
    const b = createTooltip({ trigger: host.querySelector('#b') as HTMLElement, content: host.querySelector('#tb') as HTMLElement });
    a.show();
    b.show();
    expect(a.isOpen).toBe(false);
    b.hide();
    host.querySelector('#a')!.dispatchEvent(pe('pointerenter', 'touch'));
    vi.advanceTimersByTime(1000);
    expect(a.isOpen).toBe(false);
  });
});

describe('createHoverCard', () => {
  it('opens after a delay, stays while hovered, and is hidden from assistive technology', () => {
    vi.useFakeTimers();
    const host = html('<a id="t" href="#ada">@ada</a><div id="c">Ada Lovelace</div>');
    const card = createHoverCard({ trigger: host.querySelector('#t') as HTMLElement, content: host.querySelector('#c') as HTMLElement });
    expect(host.querySelector('#c')!.getAttribute('aria-hidden')).toBe('true');
    host.querySelector('#t')!.dispatchEvent(pe('pointerenter', 'mouse'));
    vi.advanceTimersByTime(700);
    expect(card.isOpen).toBe(true);
    host.querySelector('#t')!.dispatchEvent(pe('pointerleave'));
    host.querySelector('#c')!.dispatchEvent(pe('pointerenter', 'mouse'));
    vi.advanceTimersByTime(1000);
    expect(card.isOpen).toBe(true);
    host.querySelector('#c')!.dispatchEvent(pe('pointerleave'));
    vi.advanceTimersByTime(300);
    expect(card.isOpen).toBe(false);
  });
});

describe('createToggleGroup', () => {
  const markup = '<div id="g" aria-label="Align"><button data-toggle-item data-value="l">L</button><button data-toggle-item data-value="c">C</button><button data-toggle-item data-value="r">R</button></div>';

  it('single is a radio group with one checked item, which can be cleared', () => {
    const host = html(markup);
    const group = createToggleGroup({ root: host.querySelector('#g') as HTMLElement, defaultValue: ['l'] });
    const items = host.querySelectorAll<HTMLButtonElement>('[data-toggle-item]');
    expect(host.querySelector('#g')!.getAttribute('role')).toBe('radiogroup');
    expect(items[0].getAttribute('role')).toBe('radio');
    expect(items[0].getAttribute('aria-checked')).toBe('true');
    items[1].click();
    expect(group.value).toEqual(['c']);
    expect(items[0].getAttribute('aria-checked')).toBe('false');
    items[1].click();
    expect(group.value).toEqual([]);
  });

  it('multiple uses aria-pressed and one roving tab stop', () => {
    const host = html(markup);
    const group = createToggleGroup({ root: host.querySelector('#g') as HTMLElement, type: 'multiple' });
    const items = host.querySelectorAll<HTMLButtonElement>('[data-toggle-item]');
    items[0].click();
    items[2].click();
    expect(group.value).toEqual(['l', 'r']);
    expect(items[2].getAttribute('aria-pressed')).toBe('true');
    expect([...items].filter((i) => i.tabIndex === 0).length).toBe(1);
    items[2].focus();
    key(items[2], 'ArrowRight');
    expect(document.activeElement).toBe(items[0]);
  });
});

describe('createToolbar', () => {
  it('is one tab stop with arrow navigation, leaving text inputs their arrows', () => {
    const host = html('<div id="tb" aria-label="Format"><button>B</button><button>I</button><input aria-label="Size"><button disabled>X</button><button>U</button></div>');
    createToolbar({ root: host.querySelector('#tb') as HTMLElement });
    const [b, i, input, , u] = Array.from(host.querySelectorAll<HTMLElement>('button, input'));
    expect(host.querySelector('#tb')!.getAttribute('role')).toBe('toolbar');
    expect(b.tabIndex).toBe(0);
    expect(i.tabIndex).toBe(-1);
    b.focus();
    key(b, 'ArrowRight');
    expect(document.activeElement).toBe(i);
    key(i, 'ArrowRight');
    expect(document.activeElement).toBe(input);
    key(input, 'ArrowRight');
    expect(document.activeElement).toBe(input);
    key(input, 'ArrowDown');
    key(input, 'End');
    expect(document.activeElement).toBe(input);
    u.focus();
    expect(u.tabIndex).toBe(0);
    expect(b.tabIndex).toBe(-1);
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCheckbox, createRadioGroup, createSlider, createSwitch } from '../headless';

function html(markup: string): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = markup;
  document.body.appendChild(host);
  return host;
}
const key = (el: Element, name: string, init: KeyboardEventInit = {}) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...init }));
const flush = () => new Promise((r) => setTimeout(r, 5));

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createCheckbox', () => {
  it('toggles, reports, and goes from indeterminate to checked', () => {
    const host = html('<button id="c">Accept</button>');
    const onCheckedChange = vi.fn();
    const box = createCheckbox({ root: host.querySelector('#c') as HTMLElement, defaultChecked: 'indeterminate', onCheckedChange });
    const c = host.querySelector('#c') as HTMLButtonElement;
    expect(c.getAttribute('role')).toBe('checkbox');
    expect(c.getAttribute('type')).toBe('button');
    expect(c.getAttribute('aria-checked')).toBe('mixed');
    expect(c.dataset.state).toBe('indeterminate');
    c.click();
    expect(box.checked).toBe(true);
    c.click();
    expect(c.getAttribute('aria-checked')).toBe('false');
    expect(onCheckedChange.mock.calls).toEqual([[true], [false]]);
  });

  it('Enter does not toggle; a non-button root toggles on Space', () => {
    const host = html('<button id="b">B</button><div id="d">D</div>');
    const b = createCheckbox({ root: host.querySelector('#b') as HTMLElement });
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    host.querySelector('#b')!.dispatchEvent(enter);
    expect(enter.defaultPrevented).toBe(true);
    expect(b.checked).toBe(false);
    const d = createCheckbox({ root: host.querySelector('#d') as HTMLElement });
    expect((host.querySelector('#d') as HTMLElement).tabIndex).toBe(0);
    key(host.querySelector('#d')!, ' ');
    expect(d.checked).toBe(true);
  });

  it('is ignored while disabled', () => {
    const host = html('<button id="c">C</button>');
    const box = createCheckbox({ root: host.querySelector('#c') as HTMLElement, disabled: true });
    (host.querySelector('#c') as HTMLElement).click();
    expect(box.checked).toBe(false);
    expect(host.querySelector('#c')!.getAttribute('aria-disabled')).toBe('true');
    box.setDisabled(false);
    (host.querySelector('#c') as HTMLElement).click();
    expect(box.checked).toBe(true);
  });

  it('submits with the form and resets with it', async () => {
    const host = html('<form id="f"><button id="c">Terms</button></form>');
    const box = createCheckbox({ root: host.querySelector('#c') as HTMLElement, name: 'terms', value: 'yes', required: true });
    const form = host.querySelector('#f') as HTMLFormElement;
    expect(new FormData(form).get('terms')).toBe(null);
    expect(form.checkValidity()).toBe(false);
    (host.querySelector('#c') as HTMLElement).click();
    expect(new FormData(form).get('terms')).toBe('yes');
    expect(form.checkValidity()).toBe(true);
    form.reset();
    await flush();
    expect(box.checked).toBe(false);
    box.destroy();
    expect(form.querySelector('input')).toBe(null);
  });
});

describe('createSwitch', () => {
  it('is a switch with on/off state', () => {
    const host = html('<button id="s">Wi-Fi</button>');
    const sw = createSwitch({ root: host.querySelector('#s') as HTMLElement, defaultChecked: true });
    const s = host.querySelector('#s') as HTMLElement;
    expect(s.getAttribute('role')).toBe('switch');
    expect(s.getAttribute('aria-checked')).toBe('true');
    s.click();
    expect(sw.checked).toBe(false);
    expect(s.dataset.state).toBe('unchecked');
  });
});

describe('createRadioGroup', () => {
  const markup = '<form id="f"><div id="g" aria-label="Plan"><button data-radio-item data-value="free">Free</button><button data-radio-item data-value="pro" disabled>Pro</button><button data-radio-item data-value="team">Team</button></div></form>';

  it('has one tab stop on the checked item, arrows move and check, skipping disabled', () => {
    const host = html(markup);
    const onValueChange = vi.fn();
    const group = createRadioGroup({ root: host.querySelector('#g') as HTMLElement, defaultValue: 'team', onValueChange });
    const items = host.querySelectorAll<HTMLButtonElement>('[data-radio-item]');
    expect(host.querySelector('#g')!.getAttribute('role')).toBe('radiogroup');
    expect([...items].map((i) => i.tabIndex)).toEqual([-1, -1, 0]);
    items[2].focus();
    key(items[2], 'ArrowDown');
    expect(document.activeElement).toBe(items[0]);
    expect(group.value).toBe('free');
    key(items[0], 'ArrowRight');
    expect(document.activeElement).toBe(items[2]);
    key(items[2], 'Home');
    expect(group.value).toBe('free');
    expect(items[0].getAttribute('aria-checked')).toBe('true');
    expect(onValueChange).toHaveBeenCalledWith('free');
  });

  it('Space checks, click checks, disabled does not; submits and resets with the form', async () => {
    const host = html(markup);
    const group = createRadioGroup({ root: host.querySelector('#g') as HTMLElement, name: 'plan', defaultValue: 'free' });
    const items = host.querySelectorAll<HTMLButtonElement>('[data-radio-item]');
    const form = host.querySelector('#f') as HTMLFormElement;
    expect(new FormData(form).get('plan')).toBe('free');
    items[1].click();
    expect(group.value).toBe('free');
    items[2].click();
    expect(new FormData(form).get('plan')).toBe('team');
    form.reset();
    await flush();
    expect(group.value).toBe('free');
    expect(new FormData(form).get('plan')).toBe('free');
  });

  it('a disabled group takes no input', () => {
    const host = html(markup);
    const group = createRadioGroup({ root: host.querySelector('#g') as HTMLElement, disabled: true });
    host.querySelectorAll<HTMLButtonElement>('[data-radio-item]')[0].click();
    expect(group.value).toBe('');
  });
});

describe('createSlider', () => {
  const single = '<div id="s" style="position:relative;width:200px"><span data-slider-range></span><span data-slider-thumb aria-label="Volume"></span></div>';
  const double = '<form id="f"><div id="s"><span data-slider-range></span><span data-slider-thumb aria-label="Min"></span><span data-slider-thumb aria-label="Max"></span></div></form>';

  it('exposes slider semantics and moves by step, large step, Home and End', () => {
    const host = html(single);
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    const slider = createSlider({ root: host.querySelector('#s') as HTMLElement, defaultValue: [50], step: 5, onValueChange, onValueCommit, getValueText: (v) => `${v} percent` });
    const thumb = host.querySelector('[data-slider-thumb]') as HTMLElement;
    expect(thumb.getAttribute('role')).toBe('slider');
    expect(thumb.getAttribute('aria-valuenow')).toBe('50');
    expect(thumb.getAttribute('aria-valuetext')).toBe('50 percent');
    expect(thumb.tabIndex).toBe(0);
    key(thumb, 'ArrowRight');
    expect(slider.value).toEqual([55]);
    key(thumb, 'ArrowDown');
    key(thumb, 'PageUp');
    expect(slider.value).toEqual([100]);
    key(thumb, 'End');
    expect(onValueCommit).toHaveBeenCalledTimes(3);
    key(thumb, 'Home');
    expect(slider.value).toEqual([0]);
    expect(thumb.style.left).toBe('0%');
    expect((host.querySelector('[data-slider-range]') as HTMLElement).style.right).toBe('100%');
  });

  it('keeps range thumbs apart and submits both in order', () => {
    const host = html(double);
    const slider = createSlider({ root: host.querySelector('#s') as HTMLElement, defaultValue: [20, 30], minStepsBetweenThumbs: 5, name: 'price' });
    const [lo, hi] = Array.from(host.querySelectorAll<HTMLElement>('[data-slider-thumb]'));
    expect(lo.getAttribute('aria-valuemax')).toBe('25');
    expect(hi.getAttribute('aria-valuemin')).toBe('25');
    key(lo, 'PageUp');
    expect(slider.value).toEqual([25, 30]);
    key(hi, 'Home');
    expect(slider.value).toEqual([25, 30]);
    key(hi, 'ArrowRight', { shiftKey: true });
    expect(slider.value).toEqual([25, 40]);
    expect(new FormData(host.querySelector('#f') as HTMLFormElement).getAll('price[]')).toEqual(['25', '40']);
  });

  it('snaps decimal steps cleanly', () => {
    const host = html(single);
    const slider = createSlider({ root: host.querySelector('#s') as HTMLElement, min: 0, max: 1, step: 0.1, defaultValue: [0.2] });
    const thumb = host.querySelector('[data-slider-thumb]')!;
    key(thumb, 'ArrowUp');
    expect(slider.value).toEqual([0.3]);
  });

  it('pressing the track moves the nearest thumb and drags it', () => {
    const host = html(double);
    const root = host.querySelector('#s') as HTMLElement;
    root.getBoundingClientRect = () => ({ left: 0, top: 0, right: 200, bottom: 10, width: 200, height: 10, x: 0, y: 0, toJSON() {} }) as DOMRect;
    const onValueCommit = vi.fn();
    const slider = createSlider({ root, defaultValue: [20, 80], onValueCommit });
    const pe = (type: string, clientX: number) => {
      const ev = new MouseEvent(type, { bubbles: true, cancelable: true, clientX, button: 0 });
      Object.defineProperty(ev, 'pointerId', { value: 1 });
      return ev;
    };
    root.dispatchEvent(pe('pointerdown', 140));
    expect(slider.value).toEqual([20, 70]);
    expect(document.activeElement).toBe(root.querySelectorAll('[data-slider-thumb]')[1]);
    root.dispatchEvent(pe('pointermove', 400));
    expect(slider.value).toEqual([20, 100]);
    root.dispatchEvent(pe('pointermove', -50));
    expect(slider.value).toEqual([20, 20]);
    root.dispatchEvent(pe('pointerup', 0));
    expect(onValueCommit).toHaveBeenCalledTimes(1);
    expect(onValueCommit).toHaveBeenCalledWith([20, 20]);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  OVERLAY_MOTION_CSS,
  closeOverlay,
  liftToTopLayer,
  openOverlay,
  removeOverlay,
  retireOverlay,
  setPanelOpen,
  splitPlacement
} from '../primitives/overlay-motion';
import '../components/ui-popover';
import '../components/ui-select';
import '../components/ui-dialog';
import '../components/ui-alert-dialog';

function surface(): HTMLElement {
  const el = document.createElement('div');
  document.body.append(el);
  return el;
}

/** jsdom has no CSS animations; make one visible to the helper. */
function stubAnimation(el: HTMLElement, name: string, duration: string) {
  const real = window.getComputedStyle.bind(window);
  vi.spyOn(window, 'getComputedStyle').mockImplementation((target: Element, pseudo?: string | null) => {
    const cs = real(target, pseudo);
    if (target !== el) return cs;
    return new Proxy(cs, {
      get(obj, prop) {
        if (prop === 'animationName') return name;
        if (prop === 'animationDuration') return duration;
        if (prop === 'animationDelay') return '0s';
        const value = Reflect.get(obj, prop);
        return typeof value === 'function' ? value.bind(obj) : value;
      }
    });
  });
}

describe('overlay motion', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('marks an open surface with the state hooks', () => {
    const el = surface();
    openOverlay(el);
    expect(el.hasAttribute('data-ui-overlay')).toBe(true);
    expect(el.getAttribute('data-state')).toBe('open');
  });

  it('an instant open does not replay the enter animation', () => {
    const el = surface();
    openOverlay(el, { animate: false });
    expect(el.hasAttribute('data-instant')).toBe(true);
  });

  it('closes at once when there is no exit animation', () => {
    const el = surface();
    const done = vi.fn();
    closeOverlay(el, done);
    expect(el.getAttribute('data-state')).toBe('closed');
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('waits for the exit animation, then calls done once', () => {
    const el = surface();
    stubAnimation(el, 'ui-overlay-out', '0.1s');
    const done = vi.fn();
    closeOverlay(el, done);
    expect(done).not.toHaveBeenCalled();
    el.dispatchEvent(new Event('animationend'));
    expect(done).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(500);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('falls back to a timer when animationend never arrives', () => {
    const el = surface();
    stubAnimation(el, 'ui-overlay-out', '100ms');
    const done = vi.fn();
    closeOverlay(el, done);
    vi.advanceTimersByTime(100);
    expect(done).not.toHaveBeenCalled();
    vi.advanceTimersByTime(80);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('the returned function finishes the exit straight away', () => {
    const el = surface();
    stubAnimation(el, 'ui-overlay-out', '1s');
    const done = vi.fn();
    const finish = closeOverlay(el, done);
    finish();
    expect(done).toHaveBeenCalledTimes(1);
    finish();
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('retireOverlay removes the surface after the exit, removeOverlay at once', () => {
    const a = surface();
    stubAnimation(a, 'ui-overlay-out', '0.1s');
    retireOverlay(a);
    expect(a.isConnected).toBe(true);
    a.dispatchEvent(new Event('animationend'));
    expect(a.isConnected).toBe(false);

    const b = surface();
    removeOverlay(b);
    expect(b.isConnected).toBe(false);
    expect(() => removeOverlay(null)).not.toThrow();
  });

  it('splits a placement into side and align', () => {
    expect(splitPlacement('bottom-start')).toEqual({ side: 'bottom', align: 'start' });
    expect(splitPlacement('top')).toEqual({ side: 'top', align: 'center' });
  });

  it('exports CSS keyed on data-state and data-side, with reduced motion turning it off', () => {
    expect(OVERLAY_MOTION_CSS).toContain('[data-ui-overlay][data-state="open"]');
    expect(OVERLAY_MOTION_CSS).toContain('[data-ui-overlay][data-state="closed"]');
    expect(OVERLAY_MOTION_CSS).toContain('[data-side="top"]');
    expect(OVERLAY_MOTION_CSS).toMatch(/prefers-reduced-motion: reduce[\s\S]*animation: none/);
    // the enter fills backwards: nothing animated is left on the surface afterwards
    expect(OVERLAY_MOTION_CSS).toMatch(/ui-overlay-in[^;]*backwards;/);
  });
});

describe('top layer', () => {
  afterEach(() => {
    delete (HTMLElement.prototype as { showPopover?: unknown }).showPopover;
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('does nothing where the Popover API is missing (z-index stacking stays)', () => {
    const el = surface();
    liftToTopLayer(el);
    expect(el.hasAttribute('popover')).toBe(false);
  });

  it('promotes a connected surface and clears the popover user-agent box', () => {
    const show = vi.fn();
    (HTMLElement.prototype as { showPopover?: unknown }).showPopover = show;
    const el = surface();
    liftToTopLayer(el);
    expect(el.getAttribute('popover')).toBe('manual');
    expect(show).toHaveBeenCalledTimes(1);
    expect(el.style.margin).toBe('0px');
    expect(el.style.padding).toBe('0px');
  });

  it('leaves the box alone when the surface styles itself', () => {
    (HTMLElement.prototype as { showPopover?: unknown }).showPopover = vi.fn();
    const el = surface();
    el.style.background = 'red';
    liftToTopLayer(el, { resetBox: false });
    expect(el.style.background).toBe('red');
  });
});

describe('panels that stay in the shadow tree', () => {
  it('shows and hides with hidden, and records the state and side', () => {
    const panel = document.createElement('div');
    panel.hidden = true;
    document.body.append(panel);

    setPanelOpen(panel, true, 'top');
    expect(panel.hidden).toBe(false);
    expect(panel.getAttribute('data-state')).toBe('open');
    expect(panel.getAttribute('data-side')).toBe('top');

    setPanelOpen(panel, false);
    expect(panel.hidden).toBe(true);
    expect(panel.getAttribute('data-state')).toBe('closed');
  });

  it('keeps the panel until the exit ends', () => {
    vi.useFakeTimers();
    const panel = document.createElement('div');
    document.body.append(panel);
    stubAnimation(panel, 'ui-overlay-out', '0.1s');
    setPanelOpen(panel, true);
    setPanelOpen(panel, false);
    expect(panel.hidden).toBe(false);
    panel.dispatchEvent(new Event('animationend'));
    expect(panel.hidden).toBe(true);
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('opening again cancels a pending close', () => {
    vi.useFakeTimers();
    const panel = document.createElement('div');
    document.body.append(panel);
    stubAnimation(panel, 'ui-overlay-out', '0.1s');
    setPanelOpen(panel, true);
    setPanelOpen(panel, false);
    setPanelOpen(panel, true);
    expect(panel.hidden).toBe(false);
    vi.advanceTimersByTime(500);
    expect(panel.hidden).toBe(false);
    expect(panel.getAttribute('data-state')).toBe('open');
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
});

describe('components', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('ui-popover opens a surface with state hooks and removes it on close', async () => {
    document.body.innerHTML = `<ui-popover><button slot="trigger">Open</button><div slot="content">Hello</div></ui-popover>`;
    const el = document.querySelector('ui-popover') as HTMLElement;
    await Promise.resolve();
    el.setAttribute('open', '');
    const shell = document.querySelector('#ui-portal-root .popover-shell') as HTMLElement;
    expect(shell).toBeTruthy();
    expect(shell.getAttribute('data-state')).toBe('open');
    expect(shell.hasAttribute('data-side')).toBe(true);
    el.removeAttribute('open');
    expect(document.querySelector('#ui-portal-root .popover-shell')).toBeNull();
  });

  it('ui-dialog keeps data-state in step with open', async () => {
    const el = document.createElement('ui-dialog');
    document.body.append(el);
    await Promise.resolve();
    const overlay = () => el.shadowRoot!.querySelector('.overlay') as HTMLElement;
    expect(overlay().hidden).toBe(true);
    el.setAttribute('open', '');
    await Promise.resolve();
    expect(overlay().hidden).toBe(false);
    expect(overlay().getAttribute('data-state')).toBe('open');
    el.removeAttribute('open');
    await Promise.resolve();
    expect(overlay().hidden).toBe(true);
    expect(overlay().getAttribute('data-state')).toBe('closed');
  });

  it('ui-alert-dialog backdrop carries data-state while open and is dropped when closed', async () => {
    const el = document.createElement('ui-alert-dialog');
    el.setAttribute('title', 'Delete?');
    document.body.append(el);
    await Promise.resolve();
    el.setAttribute('open', '');
    await Promise.resolve();
    expect(el.shadowRoot!.querySelector('.backdrop')?.getAttribute('data-state')).toBe('open');
    el.removeAttribute('open');
    await Promise.resolve();
    await Promise.resolve();
    expect(el.shadowRoot!.querySelector('.backdrop')).toBeNull();
  });

  it('ui-select panel gets data-state and data-side', async () => {
    document.body.innerHTML = `<ui-select placeholder="Pick"><option value="a">A</option></ui-select>`;
    const el = document.querySelector('ui-select') as HTMLElement;
    await Promise.resolve();
    const panel = () => el.shadowRoot!.querySelector('.panel') as HTMLElement;
    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    trigger.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(panel().getAttribute('data-state')).toBe('open');
    expect(['top', 'bottom']).toContain(panel().getAttribute('data-side'));
    expect(panel().hidden).toBe(false);
    trigger.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(panel().hidden).toBe(true);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-context-menu';
import '../components/ui-menubar';
import { createDismissableLayer } from '../primitives/dismissable-layer';

function flushMicrotask() {
  return Promise.resolve();
}

describe('ui-menubar and ui-context-menu integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    const root = document.getElementById('ui-portal-root');
    if (root?.parentElement) root.parentElement.removeChild(root);
  });

  it('ui-menubar opens a panel from item click and closes on outside pointerdown', async () => {
    const outside = document.createElement('button');
    const el = document.createElement('ui-menubar') as HTMLElement;
    el.innerHTML = `
      <button slot="item">File</button>
      <button slot="item">Edit</button>
      <div slot="content"><button class="item">New</button></div>
      <div slot="content"><button class="item">Undo</button></div>
    `;
    document.body.append(outside, el);
    await flushMicrotask();

    const trigger = el.querySelector('[slot="item"]') as HTMLButtonElement;
    trigger.click();
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(true);
    expect((el as HTMLElement & { _portalEl?: HTMLElement | null })._portalEl).toBeTruthy();

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(false);
  });

  it('ui-menubar keeps the portaled panel node stable across visual updates while open', async () => {
    const el = document.createElement('ui-menubar') as HTMLElement & { _portalEl?: HTMLElement | null };
    el.innerHTML = `
      <button slot="item">File</button>
      <button slot="item">Edit</button>
      <div slot="content"><button class="item">New</button></div>
      <div slot="content"><button class="item">Undo</button></div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.setAttribute('open', '');
    await flushMicrotask();

    const portalBefore = el._portalEl;
    expect(portalBefore).toBeTruthy();

    el.setAttribute('variant', 'contrast');
    el.setAttribute('density', 'comfortable');
    el.setAttribute('shape', 'soft');
    await flushMicrotask();

    expect(el._portalEl).toBe(portalBefore);
  });

  it('ui-context-menu closes on outside pointerdown', async () => {
    const outside = document.createElement('button');
    const el = document.createElement('ui-context-menu') as HTMLElement;
    el.innerHTML = `<div slot="content"><button class="menuitem">Open</button></div>`;
    document.body.append(outside, el);
    await flushMicrotask();

    (el as HTMLElement & { openAt?: (x: number, y: number) => void }).openAt?.(40, 40);
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(true);

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(false);
  });

  it('ui-context-menu stays open when state changes to loading', async () => {
    const el = document.createElement('ui-context-menu') as HTMLElement & { openAt?: (x: number, y: number) => void };
    el.innerHTML = `<div slot="content"><button class="menuitem">Open</button></div>`;
    document.body.appendChild(el);
    await flushMicrotask();

    el.openAt?.(40, 40);
    await flushMicrotask();
    expect(el.hasAttribute('open')).toBe(true);

    el.setAttribute('state', 'loading');
    await flushMicrotask();
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('ui-context-menu uses lean global listeners for point and anchor modes', async () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const anchor = document.createElement('div');
    anchor.id = 'ctx-anchor';
    anchor.style.position = 'absolute';
    anchor.style.left = '12px';
    anchor.style.top = '12px';
    anchor.style.width = '20px';
    anchor.style.height = '20px';
    document.body.appendChild(anchor);

    const el = document.createElement('ui-context-menu') as HTMLElement & {
      openAt?: (x: number, y: number) => void;
      openFor?: (anchor: string | HTMLElement) => void;
      close?: () => void;
    };
    el.innerHTML = `<div slot="content"><button class="menuitem">Inspect</button></div>`;
    document.body.appendChild(el);
    await flushMicrotask();

    el.openAt?.(24, 24);
    await flushMicrotask();

    expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(addSpy).not.toHaveBeenCalledWith('scroll', expect.any(Function), true);

    el.close?.();
    await flushMicrotask();

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    addSpy.mockClear();
    removeSpy.mockClear();

    el.openFor?.(anchor);
    await flushMicrotask();

    expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);

    el.close?.();
    await flushMicrotask();

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('ui-context-menu mounts into the portal root and dismisses before ancestor overlays', async () => {
    const parent = document.createElement('div');
    parent.textContent = 'Parent overlay';
    document.body.appendChild(parent);
    const parentDismiss = vi.fn();
    const parentLayer = createDismissableLayer({ node: parent, onDismiss: parentDismiss });

    const el = document.createElement('ui-context-menu') as HTMLElement & { openAt?: (x: number, y: number) => void; _portalEl?: HTMLElement | null };
    el.innerHTML = `<div slot="content"><button class="menuitem">Inspect</button></div>`;
    document.body.appendChild(el);
    await flushMicrotask();

    el.openAt?.(32, 32);
    await flushMicrotask();

    const root = document.getElementById('ui-portal-root');
    expect(root?.contains(el._portalEl || null)).toBe(true);
    expect(el.hasAttribute('open')).toBe(true);

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    await flushMicrotask();

    expect(el.hasAttribute('open')).toBe(false);
    expect(parentDismiss).not.toHaveBeenCalled();

    parentLayer.destroy();
  });

  it('ui-context-menu mirrors host theme tokens onto the portaled menu surface', async () => {
    const el = document.createElement('ui-context-menu') as HTMLElement & { openAt?: (x: number, y: number) => void; _portalEl?: HTMLElement | null };
    el.style.setProperty('--ui-color-primary', '#f59e0b');
    el.style.setProperty('--ui-color-foreground-on-primary', '#111111');
    el.style.setProperty('--accent-surface', '#fff7d6');
    el.style.setProperty('--base-context-menu-bg', '#fffdf6');
    el.innerHTML = `<div slot="content"><button class="menuitem">Inspect</button></div>`;
    document.body.appendChild(el);
    await flushMicrotask();

    el.openAt?.(32, 32);
    await flushMicrotask();

    expect(el._portalEl?.style.getPropertyValue('--ui-color-primary')).toBe('#f59e0b');
    expect(el._portalEl?.style.getPropertyValue('--ui-color-foreground-on-primary')).toBe('#111111');
    expect(el._portalEl?.style.getPropertyValue('--accent-surface')).toBe('#fff7d6');
    expect(el._portalEl?.style.getPropertyValue('--base-context-menu-bg')).toBe('#fffdf6');
  });

  it('ui-context-menu closes when an anchored trigger becomes hidden or removed', async () => {
    const anchor = document.createElement('div');
    anchor.id = 'cm-anchor';
    anchor.style.position = 'absolute';
    anchor.style.left = '24px';
    anchor.style.top = '24px';
    anchor.style.width = '20px';
    anchor.style.height = '20px';
    document.body.appendChild(anchor);

    const el = document.createElement('ui-context-menu') as HTMLElement & { openFor?: (anchor: string | HTMLElement) => void; _positionMenu?: () => void };
    el.innerHTML = `<div slot="content"><button class="menuitem">Inspect</button></div>`;
    document.body.appendChild(el);
    await flushMicrotask();

    el.openFor?.('cm-anchor');
    await flushMicrotask();
    expect(el.hasAttribute('open')).toBe(true);

    anchor.style.display = 'none';
    el._positionMenu?.();
    await flushMicrotask();
    expect(el.hasAttribute('open')).toBe(false);

    anchor.style.display = '';
    el.openFor?.('cm-anchor');
    await flushMicrotask();
    expect(el.hasAttribute('open')).toBe(true);

    anchor.remove();
    el._positionMenu?.();
    await flushMicrotask();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('ui-context-menu applies submenu hover intent instead of opening immediately', async () => {
    vi.useFakeTimers();
    const el = document.createElement('ui-context-menu') as HTMLElement & { openAt?: (x: number, y: number) => void; _portalEl?: HTMLElement | null };
    el.innerHTML = `
      <div slot="content">
        <button class="menuitem">Open</button>
        <div class="menuitem" data-menu-item>
          Share
          <div class="submenu">
            <button class="menuitem">Copy link</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.openAt?.(32, 32);
    await flushMicrotask();

    const share = el._portalEl?.querySelector('[data-menu-item]') as HTMLElement | null;
    (el as HTMLElement & { _scheduleSubmenuIntent?: (item: HTMLElement) => void })._scheduleSubmenuIntent?.(share as HTMLElement);
    await flushMicrotask();
    expect(share?.getAttribute('data-submenu-open')).not.toBe('true');

    vi.advanceTimersByTime(120);
    await flushMicrotask();
    expect(share?.getAttribute('data-submenu-open')).toBe('true');
    vi.useRealTimers();
  });

  it('ui-context-menu resets highlighted state when hover leaves the menu surface', async () => {
    const el = document.createElement('ui-context-menu') as HTMLElement & { openAt?: (x: number, y: number) => void; _portalEl?: HTMLElement | null };
    el.innerHTML = `
      <div slot="content">
        <button class="menuitem">Edit</button>
        <button class="menuitem">Duplicate</button>
      </div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.openAt?.(48, 48);
    await flushMicrotask();

    const items = el._portalEl?.querySelectorAll<HTMLElement>('.menuitem');
    const first = items?.[0];
    const second = items?.[1];
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();

    (el as HTMLElement & { _onRootPointerOver?: (event: Event) => void })._onRootPointerOver?.({
      composedPath: () => [first as HTMLElement],
    } as unknown as Event);
    await flushMicrotask();
    expect(first?.hasAttribute('data-highlighted')).toBe(false);
    expect(second?.hasAttribute('data-highlighted')).toBe(false);

    (el as HTMLElement & { _onRootPointerOver?: (event: Event) => void })._onRootPointerOver?.({
      composedPath: () => [second as HTMLElement],
    } as unknown as Event);
    await flushMicrotask();
    expect(first?.hasAttribute('data-highlighted')).toBe(false);
    expect(second?.hasAttribute('data-highlighted')).toBe(false);

    (el as HTMLElement & { _onRootPointerLeave?: () => void })._onRootPointerLeave?.();
    await flushMicrotask();

    expect(first?.hasAttribute('data-highlighted')).toBe(false);
    expect(second?.hasAttribute('data-highlighted')).toBe(false);
  });

  it('ui-context-menu repositions anchored menus when the anchor rect changes without viewport events', async () => {
    const requestAnimationFrameOriginal = window.requestAnimationFrame;
    const cancelAnimationFrameOriginal = window.cancelAnimationFrame;
    let currentRect = {
      top: 24,
      left: 24,
      right: 64,
      bottom: 48,
      width: 40,
      height: 24,
      x: 24,
      y: 24,
      toJSON() { return this; }
    } as DOMRect;

    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: () => 1
    });
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      value: () => {}
    });

    const anchor = document.createElement('div');
    anchor.id = 'tracked-anchor';
    anchor.getBoundingClientRect = () => currentRect;
    document.body.appendChild(anchor);

    const el = document.createElement('ui-context-menu') as HTMLElement & {
      openFor?: (anchor: string | HTMLElement) => void;
      _portalEl?: HTMLElement | null;
      _anchorTrackRaf?: number | null;
      _trackAnchorLayout?: () => void;
    };
    el.innerHTML = `<div slot="content"><button class="menuitem">Inspect</button></div>`;
    document.body.appendChild(el);
    await flushMicrotask();

    el.openFor?.(anchor);
    await flushMicrotask();

    const surface = el._portalEl?.querySelector('.surface') as HTMLElement | null;
    const before = surface?.style.left;

    currentRect = {
      ...currentRect,
      top: 96,
      left: 140,
      right: 180,
      bottom: 120,
      x: 140,
      y: 96
    } as DOMRect;
    el._anchorTrackRaf = null;
    el._trackAnchorLayout?.();
    await flushMicrotask();

    expect(surface?.style.left).not.toBe(before);

    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: requestAnimationFrameOriginal
    });
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      value: cancelAnimationFrameOriginal
    });
  });
});

import { describe, expect, it } from 'vitest';
import '../components/ui-floating-toolbar';

describe('ui-floating-toolbar behavior', () => {
  it('closes on outside pointerdown by default', () => {
    const anchor = document.createElement('button');
    anchor.id = 'ft-behavior-anchor';
    document.body.appendChild(anchor);

    const el = document.createElement('ui-floating-toolbar') as HTMLElement;
    el.innerHTML = '<button slot="toolbar">Action</button>';
    document.body.appendChild(el);

    let closeReason = '';
    el.addEventListener('close', (event: Event) => {
      closeReason = (event as CustomEvent<{ reason?: string }>).detail?.reason || '';
    });

    (el as any).showForAnchorId('ft-behavior-anchor');
    expect(el.hasAttribute('open')).toBe(true);

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(el.hasAttribute('open')).toBe(false);
    expect(closeReason).toBe('outside');

    el.remove();
    anchor.remove();
  });

  it('honors cancelable request-close handlers', () => {
    const anchor = document.createElement('button');
    anchor.id = 'ft-prevent-anchor';
    document.body.appendChild(anchor);

    const el = document.createElement('ui-floating-toolbar') as HTMLElement;
    el.innerHTML = '<button slot="toolbar">Action</button>';
    document.body.appendChild(el);

    el.addEventListener('request-close', (event) => event.preventDefault());
    (el as any).showForAnchorId('ft-prevent-anchor');
    expect(el.hasAttribute('open')).toBe(true);

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(el.hasAttribute('open')).toBe(true);

    el.remove();
    anchor.remove();
  });

  it('respects close-on-escape=false', () => {
    const anchor = document.createElement('button');
    anchor.id = 'ft-escape-anchor';
    document.body.appendChild(anchor);

    const el = document.createElement('ui-floating-toolbar') as HTMLElement;
    el.innerHTML = '<button slot="toolbar">Action</button>';
    el.setAttribute('close-on-escape', 'false');
    document.body.appendChild(el);

    (el as any).showForAnchorId('ft-escape-anchor');
    expect(el.hasAttribute('open')).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(el.hasAttribute('open')).toBe(true);

    el.remove();
    anchor.remove();
  });

  it('closes when anchor becomes hidden', () => {
    const anchor = document.createElement('button');
    anchor.id = 'ft-hidden-anchor';
    anchor.style.position = 'absolute';
    anchor.style.left = '10px';
    anchor.style.top = '10px';
    document.body.appendChild(anchor);

    const el = document.createElement('ui-floating-toolbar') as HTMLElement;
    el.innerHTML = '<button slot="toolbar">Action</button>';
    document.body.appendChild(el);

    let closeReason = '';
    el.addEventListener('close', (event: Event) => {
      closeReason = (event as CustomEvent<{ reason?: string }>).detail?.reason || '';
    });

    (el as any).showForAnchorId('ft-hidden-anchor');
    expect(el.hasAttribute('open')).toBe(true);

    anchor.style.display = 'none';
    (el as any)._position?.();
    expect(el.hasAttribute('open')).toBe(false);
    expect(closeReason).toBe('anchor-hidden');

    el.remove();
    anchor.remove();
  });

  it('positions the panel with left/top instead of transform translation variables', () => {
    const anchor = document.createElement('button');
    anchor.id = 'ft-position-anchor';
    document.body.appendChild(anchor);
    Object.defineProperty(anchor, 'getBoundingClientRect', {
      value: () => ({
        left: 120,
        top: 80,
        right: 180,
        bottom: 120,
        width: 60,
        height: 40
      })
    });

    const el = document.createElement('ui-floating-toolbar') as HTMLElement & { _panel?: HTMLElement | null };
    el.innerHTML = '<button slot="toolbar">Action</button>';
    document.body.appendChild(el);

    (el as any).showForAnchorId('ft-position-anchor');
    const panel = el.shadowRoot?.querySelector('.panel') as HTMLElement | null;
    expect(panel).toBeTruthy();
    Object.defineProperty(panel!, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        top: 0,
        right: 160,
        bottom: 48,
        width: 160,
        height: 48
      })
    });

    (el as any)._position?.();

    expect(panel?.style.left).toBeTruthy();
    expect(panel?.style.top).toBeTruthy();
    expect(el.style.getPropertyValue('--ui-floating-toolbar-x')).toBe('');
    expect(el.style.getPropertyValue('--ui-floating-toolbar-y')).toBe('');

    el.remove();
    anchor.remove();
  });
});

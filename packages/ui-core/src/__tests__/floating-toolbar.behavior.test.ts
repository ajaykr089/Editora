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
});

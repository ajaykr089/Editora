import { describe, expect, it } from 'vitest';
import '../components/ui-selection-popup';

describe('ui-selection-popup behavior', () => {
  it('positions the popup with left/top instead of transform translation variables', async () => {
    const anchor = document.createElement('button');
    anchor.id = 'selection-popup-anchor';
    document.body.appendChild(anchor);
    Object.defineProperty(anchor, 'getBoundingClientRect', {
      value: () => ({
        left: 200,
        top: 160,
        right: 260,
        bottom: 200,
        width: 60,
        height: 40
      })
    });

    const el = document.createElement('ui-selection-popup') as HTMLElement & { _popup?: HTMLElement | null };
    el.innerHTML = '<button>Action</button>';
    document.body.appendChild(el);
    await Promise.resolve();

    (el as any).openFor('selection-popup-anchor');
    await Promise.resolve();

    const popup = el.shadowRoot?.querySelector('.popup') as HTMLElement | null;
    expect(popup).toBeTruthy();
    Object.defineProperty(popup!, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        top: 0,
        right: 180,
        bottom: 64,
        width: 180,
        height: 64
      })
    });

    (el as any)._position?.();

    expect(popup?.style.left).toBeTruthy();
    expect(popup?.style.top).toBeTruthy();
    expect(popup?.style.getPropertyValue('--ui-selection-popup-x')).toBe('');
    expect(popup?.style.getPropertyValue('--ui-selection-popup-y')).toBe('');

    el.remove();
    anchor.remove();
  });
});

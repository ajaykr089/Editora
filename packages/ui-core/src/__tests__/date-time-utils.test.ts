import { beforeEach, describe, expect, it } from 'vitest';
import { computePopoverPosition } from '../components/date-time-utils';

function rect(values: Partial<DOMRect>): DOMRect {
  return {
    x: values.left ?? 0,
    y: values.top ?? 0,
    top: values.top ?? 0,
    left: values.left ?? 0,
    right: values.right ?? ((values.left ?? 0) + (values.width ?? 0)),
    bottom: values.bottom ?? ((values.top ?? 0) + (values.height ?? 0)),
    width: values.width ?? 0,
    height: values.height ?? 0,
    toJSON: () => ({})
  } as DOMRect;
}

describe('date-time utils', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 640, configurable: true, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 400, configurable: true, writable: true });
    Object.defineProperty(window, 'scrollX', { value: 0, configurable: true, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
  });

  it('keeps the current bottom placement when neither side fits and top is only slightly better', () => {
    const anchor = rect({ top: 150, left: 32, width: 180, height: 32 });
    const panel = rect({ width: 220, height: 214 });

    const position = computePopoverPosition(anchor, panel, 8, 8, 'bottom');

    expect(position.placement).toBe('bottom');
    expect(position.top).toBe(190);
  });

  it('keeps the current top placement when neither side fits and bottom is only slightly better', () => {
    const anchor = rect({ top: 188, left: 32, width: 180, height: 32 });
    const panel = rect({ width: 220, height: 214 });

    const position = computePopoverPosition(anchor, panel, 8, 8, 'top');

    expect(position.placement).toBe('top');
    expect(position.top).toBe(-34);
  });

  it('flips when the opposite side has materially more space', () => {
    const anchor = rect({ top: 260, left: 32, width: 180, height: 32 });
    const panel = rect({ width: 220, height: 260 });

    const position = computePopoverPosition(anchor, panel, 8, 8, 'bottom');

    expect(position.placement).toBe('top');
    expect(position.top).toBe(-8);
  });

  it('preserves the current placement when both sides fit', () => {
    const anchor = rect({ top: 180, left: 32, width: 180, height: 32 });
    const panel = rect({ width: 220, height: 96 });

    const position = computePopoverPosition(anchor, panel, 8, 8, 'top');

    expect(position.placement).toBe('top');
    expect(position.top).toBe(76);
  });
});

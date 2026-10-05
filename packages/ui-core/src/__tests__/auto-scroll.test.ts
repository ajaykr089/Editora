import { describe, expect, it } from 'vitest';
import { edgeScrollDelta, findScrollParent } from '../primitives/auto-scroll';

describe('edgeScrollDelta', () => {
  it('is zero in the middle of the span', () => {
    expect(edgeScrollDelta(300, 0, 600)).toBe(0);
    expect(edgeScrollDelta(60, 0, 600)).toBe(0);
    expect(edgeScrollDelta(540, 0, 600)).toBe(0);
  });

  it('scrolls up near the top and down near the bottom', () => {
    expect(edgeScrollDelta(20, 0, 600)).toBeLessThan(0);
    expect(edgeScrollDelta(580, 0, 600)).toBeGreaterThan(0);
  });

  it('speeds up towards the edge and is capped at maxStep', () => {
    const slow = edgeScrollDelta(500, 0, 600);
    const fast = edgeScrollDelta(590, 0, 600);
    expect(Math.abs(fast)).toBeGreaterThan(Math.abs(slow));
    expect(edgeScrollDelta(10_000, 0, 600)).toBe(18);
    expect(edgeScrollDelta(-10_000, 0, 600)).toBe(-18);
    expect(edgeScrollDelta(599, 0, 600, 56, 30)).toBeLessThanOrEqual(30);
  });

  it('never scrolls for an empty span or a non-finite pointer, and keeps both zones apart in a small span', () => {
    expect(edgeScrollDelta(10, 100, 100)).toBe(0);
    expect(edgeScrollDelta(Number.NaN, 0, 600)).toBe(0);
    // A 60px span only has 30px zones, so the middle stays calm.
    expect(edgeScrollDelta(30, 0, 60)).toBe(0);
    expect(edgeScrollDelta(5, 0, 60)).toBeLessThan(0);
  });
});

describe('findScrollParent', () => {
  it('returns the nearest vertically scrollable ancestor, or null for the page', () => {
    const scroller = document.createElement('div');
    scroller.style.overflowY = 'auto';
    Object.defineProperty(scroller, 'scrollHeight', { value: 900, configurable: true });
    Object.defineProperty(scroller, 'clientHeight', { value: 300, configurable: true });
    const inner = document.createElement('section');
    const leaf = document.createElement('span');
    inner.appendChild(leaf);
    scroller.appendChild(inner);
    document.body.appendChild(scroller);

    expect(findScrollParent(leaf)).toBe(scroller);

    const plain = document.createElement('div');
    const child = document.createElement('span');
    plain.appendChild(child);
    document.body.appendChild(plain);
    expect(findScrollParent(child)).toBeNull();
  });

  it('crosses shadow roots and ignores containers that do not actually overflow', () => {
    const scroller = document.createElement('div');
    scroller.style.overflowY = 'scroll';
    Object.defineProperty(scroller, 'scrollHeight', { value: 500, configurable: true });
    Object.defineProperty(scroller, 'clientHeight', { value: 100, configurable: true });
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });
    const leaf = document.createElement('span');
    root.appendChild(leaf);
    scroller.appendChild(host);
    document.body.appendChild(scroller);
    expect(findScrollParent(leaf)).toBe(scroller);

    Object.defineProperty(scroller, 'scrollHeight', { value: 100, configurable: true });
    expect(findScrollParent(leaf)).toBeNull();
  });
});

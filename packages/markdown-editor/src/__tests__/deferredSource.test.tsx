import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as TestUtils from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CHEAP_BUILD,
  DEFER_FROM,
  MAX_LAG,
  MAX_WAIT,
  MIN_LAG,
  previewLag,
  useDeferredSource,
} from '../components/deferredSource';

const act: (callback: () => void) => void = (React as any).act ?? (TestUtils as any).act;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('previewLag', () => {
  it('is nothing for a short document, however slow the build', () => {
    expect(previewLag(DEFER_FROM - 1, 5_000)).toBe(0);
    expect(previewLag(0, 5_000)).toBe(0);
  });

  it('is nothing for a build that is quick, however long the document', () => {
    expect(previewLag(500_000, CHEAP_BUILD - 1)).toBe(0);
    expect(previewLag(500_000, 0)).toBe(0);
  });

  it('is twice the build when it is long and slow, kept between the shortest and longest pause', () => {
    expect(previewLag(DEFER_FROM, CHEAP_BUILD)).toBe(MIN_LAG);
    expect(previewLag(DEFER_FROM, 150)).toBe(300);
    expect(previewLag(DEFER_FROM, 151.4)).toBe(303);
    expect(previewLag(DEFER_FROM, 10_000)).toBe(MAX_LAG);
    expect(previewLag(DEFER_FROM, MAX_LAG / 2)).toBe(MAX_LAG);
  });
});

describe('useDeferredSource', () => {
  let host: HTMLDivElement;
  let root: Root;
  const slow = { current: 200 }; // a build of 200ms: a lag of 400ms for a long text

  const long = (tag: string) => `${tag}${'x'.repeat(DEFER_FROM)}`;

  function Probe({ value, enabled = true, build = slow }: { value: string; enabled?: boolean; build?: { current: number } }) {
    const shown = useDeferredSource(value, enabled, build);
    return <div data-shown={shown.slice(0, 2)} />;
  }
  const show = (value: string, enabled = true, build = slow) => act(() => root.render(<Probe value={value} enabled={enabled} build={build} />));
  const shown = () => host.firstElementChild!.getAttribute('data-shown');
  const wait = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

  beforeEach(() => {
    vi.useFakeTimers();
    slow.current = 200;
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    vi.useRealTimers();
  });

  it('is the text itself for a short document, in the render it changed', () => {
    show('a1');
    expect(shown()).toBe('a1');
    show('b2');
    expect(shown()).toBe('b2');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('is the text itself for a long document while the build is quick', () => {
    slow.current = CHEAP_BUILD - 1;
    show(long('a1'));
    show(long('b2'));
    expect(shown()).toBe('b2');
  });

  it('shows the first text at once, since nothing is known of the build yet', () => {
    slow.current = 0;
    show(long('a1'));
    expect(shown()).toBe('a1');
  });

  it('holds an earlier text of a long document until the typing pauses, then shows the latest', () => {
    show(long('a1'));
    show(long('b2'));
    expect(shown()).toBe('a1');
    wait(399);
    expect(shown()).toBe('a1');
    wait(1);
    expect(shown()).toBe('b2');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('starts the pause again with each change, and shows only the last text', () => {
    show(long('a1'));
    show(long('b2'));
    wait(300);
    show(long('c3'));
    wait(300);
    expect(shown()).toBe('a1');
    show(long('d4'));
    wait(399);
    expect(shown()).toBe('a1');
    wait(1);
    expect(shown()).toBe('d4');
  });

  it('shows the text now and then while typing never pauses', () => {
    show(long('a1'));
    let typed = 0;
    // A change every 100ms, never a 400ms pause.
    for (let elapsed = 0; elapsed < MAX_WAIT - 100; elapsed += 100) {
      typed += 1;
      show(long(`t${typed % 10}`));
      wait(100);
    }
    expect(shown()).toBe('a1');
    wait(100);
    expect(shown()).toMatch(/^t\d$/);
  });

  it('is current whenever nobody is typing beside the preview', () => {
    show(long('a1'), false);
    show(long('b2'), false);
    expect(shown()).toBe('b2');
  });

  it('shows the text at once if turned off while a change is waiting', () => {
    show(long('a1'));
    show(long('b2'));
    expect(shown()).toBe('a1');
    show(long('b2'), false);
    expect(shown()).toBe('b2');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('shows the text at once if the build turns out to be quick', () => {
    show(long('a1'));
    show(long('b2'));
    slow.current = 1;
    show(long('c3'));
    expect(shown()).toBe('c3');
  });

  it('has nothing to wait for when the text comes back to what is shown', () => {
    show(long('a1'));
    show(long('b2'));
    show(long('a1'));
    expect(vi.getTimerCount()).toBe(0);
    expect(shown()).toBe('a1');
  });

  it('leaves no timer behind when it goes away', () => {
    show(long('a1'));
    show(long('b2'));
    expect(vi.getTimerCount()).toBe(1);
    act(() => root.unmount());
    expect(vi.getTimerCount()).toBe(0);
    root = createRoot(host);
  });
});

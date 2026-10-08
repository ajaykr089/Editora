import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { View } from '../View';

// jsdom has no layout, so what the browser would say is stated here: the content is `CHARS_PER_ROW` characters
// wide, each row is 24px, and a line is as many rows as its text needs. The measuring is done on blocks inside
// `[data-editor-measurer]`, so that is where the stand-in for offsetHeight applies.
const ROW = 24;
const CHARS_PER_ROW = 10;
const layout = { width: 400 };

let observers: Array<{ callback: () => void; observed: Element[]; disconnected: boolean }> = [];

const flush = async () => {
  for (let i = 0; i < 4; i += 1) await Promise.resolve();
};

let container: HTMLElement;
let view: View;

const gutterRows = () =>
  Array.from(view.getLineNumbersElement().querySelectorAll<HTMLElement>('[data-editor-gutter-content] > div'));
const heights = () => gutterRows().map((row) => row.style.height);

const text = (...lines: string[]) => lines.join('\n');
const rowsOf = (line: string) => `${Math.max(1, Math.ceil(line.length / CHARS_PER_ROW)) * ROW}px`;

/** Puts text in the editor the way the editor core does: set it, then tell the view the line count. */
const setText = async (value: string) => {
  view.setText(value);
  await flush();
};

beforeEach(() => {
  layout.width = 400;
  observers = [];
  vi.stubGlobal(
    'ResizeObserver',
    class {
      entry: { callback: () => void; observed: Element[]; disconnected: boolean };
      constructor(callback: () => void) {
        this.entry = { callback, observed: [], disconnected: false };
        observers.push(this.entry);
      }
      observe(element: Element) {
        this.entry.observed.push(element);
      }
      disconnect() {
        this.entry.disconnected = true;
      }
    },
  );
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => layout.width });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get(this: HTMLElement) {
      if (this.parentElement?.getAttribute('data-editor-measurer') !== 'true') return 0;
      const line = (this.textContent || '').replace(/\u200B/g, '');
      return Math.max(1, Math.ceil(line.length / CHARS_PER_ROW)) * ROW;
    },
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  view = new View(container);
});

afterEach(() => {
  view.destroy();
  container.remove();
  vi.unstubAllGlobals();
  delete (HTMLElement.prototype as any).clientWidth;
  delete (HTMLElement.prototype as any).offsetHeight;
});

describe('line numbers without wrapping', () => {
  it('are one row each, and nothing is measured', async () => {
    view.setLineWrapping(false);
    await setText(text('a', 'x'.repeat(50), '', 'b'));
    expect(heights()).toEqual([`${ROW}px`, `${ROW}px`, `${ROW}px`, `${ROW}px`]);
    expect(container.querySelector('[data-editor-measurer]')).toBeNull();
    expect(observers).toHaveLength(0);
  });
});

describe('line numbers with wrapping', () => {
  beforeEach(() => view.setLineWrapping(true));

  it('are as tall as their line wraps to, so each number sits at the first row of its line', async () => {
    const lines = ['short', 'x'.repeat(25), '', 'y'.repeat(10), 'z'.repeat(11)];
    await setText(text(...lines));
    expect(heights()).toEqual(lines.map(rowsOf));
    expect(heights()).toEqual(['24px', '72px', '24px', '24px', '48px']);
    // One number per line: they are not renumbered per row, which is what let them end before the text did.
    expect(gutterRows().map((row) => row.textContent)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('add up to the height of the text, so the gutter and the content end together', async () => {
    const lines = Array.from({ length: 30 }, (_, i) => 'w'.repeat(i * 3));
    await setText(text(...lines));
    const total = gutterRows().reduce((sum, row) => sum + parseFloat(row.style.height), 0);
    expect(total).toBe(lines.reduce((sum, line) => sum + parseFloat(rowsOf(line)), 0));
  });

  it('follow a line that wraps to more rows without the number of lines changing', async () => {
    await setText(text('one', 'two', 'three'));
    expect(heights()).toEqual(['24px', '24px', '24px']);
    // Typing in line 2 lengthens it: the editor reports the same number of lines.
    view.setText(text('one', 'two ' + 'x'.repeat(20), 'three'));
    view.updateLineNumbers(3);
    await flush();
    expect(heights()).toEqual(['24px', '72px', '24px']);
    view.setText(text('one', 'two', 'three'));
    view.updateLineNumbers(3);
    await flush();
    expect(heights()).toEqual(['24px', '24px', '24px']);
  });

  it('follow lines being added and removed', async () => {
    await setText(text('a', 'b'));
    await setText(text('a', 'b'.repeat(15), 'c', 'd'));
    expect(heights()).toEqual(['24px', '48px', '24px', '24px']);
    await setText('only');
    expect(heights()).toEqual(['24px']);
  });

  it('measure the text, never markup in it', async () => {
    await setText(text('<b>bold</b> & <i>it</i>', 'next'));
    expect(heights()).toEqual([rowsOf('<b>bold</b> & <i>it</i>'), '24px']);
    const measurer = container.querySelector('[data-editor-measurer]')!;
    expect(measurer.querySelector('b, i')).toBeNull();
  });

  it('leave nothing behind in the hidden copy it measures with', async () => {
    await setText(text('a', 'b'.repeat(40)));
    const measurer = container.querySelector('[data-editor-measurer]') as HTMLElement;
    expect(measurer.children).toHaveLength(0);
    expect(measurer.getAttribute('aria-hidden')).toBe('true');
    expect(measurer.style.visibility).toBe('hidden');
  });

  it('measures once for any number of updates in the same task', async () => {
    const build = vi.spyOn(View.prototype as any, 'measureWrappedLines');
    view.setText('a');
    view.updateLineNumbers(1);
    view.updateLineNumbers(1);
    view.updateLineNumbers(1);
    await flush();
    expect(build).toHaveBeenCalledTimes(1);
    build.mockRestore();
  });

  it('wrap to the width of the content, and measure again when it changes', async () => {
    const line = 'x'.repeat(30);
    await setText(text(line, 'b'));
    expect(heights()).toEqual(['72px', '24px']);

    // The editor is resized: the observer on the content fires.
    expect(observers).toHaveLength(1);
    expect(observers[0].observed).toHaveLength(1);
    layout.width = 200;
    observers[0].callback();
    await flush();
    // (the stand-in layout does not depend on the width, so the heights are the same: what is checked is that
    // the width the measuring copy is given is the content's)
    const measurer = container.querySelector('[data-editor-measurer]') as HTMLElement;
    expect(measurer.style.width).toBe('200px');
  });

  it('wait for an editor that is not shown, which has no width to wrap to', async () => {
    layout.width = 0;
    await setText(text('a', 'x'.repeat(30)));
    expect(heights()).toEqual(['24px', '24px']);
    // It is shown: the observer fires and the lines are measured.
    layout.width = 400;
    observers[0].callback();
    await flush();
    expect(heights()).toEqual(['24px', '72px']);
  });

  it('keep one row per line while folded blocks make the text on screen differ from the document', async () => {
    await setText(text('a', 'x'.repeat(30)));
    expect(heights()).toEqual(['24px', '72px']);
    (view as any).contentElement.__lceFoldPlaceholderSources = new Map([['fold-1', 'hidden source']]);
    view.updateLineNumbers(2);
    await flush();
    expect(heights()).toEqual(['24px', '24px']);
  });

  it('go back to one row each when wrapping is turned off, and stop observing', async () => {
    await setText(text('a', 'x'.repeat(30)));
    expect(heights()).toEqual(['24px', '72px']);
    view.setLineWrapping(false);
    expect(heights()).toEqual(['24px', '24px']);
    expect(observers[0].disconnected).toBe(true);
    view.updateLineNumbers(2);
    await flush();
    expect(heights()).toEqual(['24px', '24px']);
  });

  it('does not measure for an editor that was destroyed', async () => {
    const measure = vi.spyOn(View.prototype as any, 'measureWrappedLines');
    view.destroy();
    view.updateLineNumbers(3);
    await flush();
    expect(measure).not.toHaveBeenCalled();
    measure.mockRestore();
  });

  it('stop when the editor is destroyed, even with a measurement waiting', async () => {
    view.setText('a');
    view.updateLineNumbers(1);
    view.destroy();
    await flush();
    expect(observers[0].disconnected).toBe(true);
  });
});

describe('what is placed by line, with wrapping', () => {
  beforeEach(() => view.setLineWrapping(true));

  const decorationTops = (selector: string) =>
    Array.from(container.querySelectorAll<HTMLElement>(selector)).map((element) => [element.style.top, element.style.height]);

  it('sits at the top of its line and covers every row of it', async () => {
    await setText(text('a', 'x'.repeat(25), 'c', 'd'));
    view.setDecorations(
      [{ id: 'active', line: 2 }, { id: 'later', line: 3 }] as any,
      [{ id: 'mark', line: 1, label: '!' }] as any,
    );
    // Line 1 (the second) starts after one 24px row and is 3 rows tall; line 2 starts after 4 rows.
    expect(decorationTops('.lce-decoration-gutter')).toEqual([['24px', '72px']]);
    expect(decorationTops('.lce-decoration-line')).toEqual([['96px', '24px'], ['120px', '24px']]);
  });

  it('moves when the lines are measured after it was placed', async () => {
    view.setText(text('a', 'x'.repeat(25), 'c'));
    view.setDecorations([{ id: 'c', line: 2 }] as any, []);
    // Before the first measurement every line is one row.
    expect(decorationTops('.lce-decoration-line')).toEqual([['48px', '24px']]);
    await flush();
    expect(decorationTops('.lce-decoration-line')).toEqual([['96px', '24px']]);
  });

  it('is not changed without wrapping', async () => {
    view.setLineWrapping(false);
    await setText(text('a', 'x'.repeat(25), 'c'));
    view.setDecorations([{ id: 'c', line: 2 }] as any, []);
    expect(decorationTops('.lce-decoration-line')).toEqual([['48px', '24px']]);
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEditor, CodeFoldingExtension } from '../index';

// While something was folded, the gutter numbered the shown lines 1, 2, 3... (so the lines below a fold got the
// wrong numbers), and line decorations (the active line, indent guides, diagnostics markers) were placed by document
// line, so they sat as many lines too low as the fold hid.
let container: HTMLElement;
let editor: ReturnType<typeof createEditor>;

const source = ['interface User {', '  id: number;', '}', '', 'function greet() {', '  const a = 1;', '  return a;', '}', '', 'const done = true;'].join('\n');

const gutterLabels = () =>
  Array.from(container.querySelectorAll('[data-editor-gutter-content] > div')).map((row) => row.textContent);
const decoration = (id: string) =>
  container.querySelector(`[data-editor-line-decorations] [data-decoration-id="marks::${id}"]`) as HTMLElement | null;

const frames = async () => {
  for (let i = 0; i < 5; i++) await Promise.resolve();
};

beforeEach(async () => {
  Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  // Decorations are applied in an animation frame; run them at once.
  (globalThis as any).__raf = globalThis.requestAnimationFrame;
  let frame = 0;
  (globalThis as any).requestAnimationFrame = (callback: FrameRequestCallback) => {
    queueMicrotask(() => callback(performance.now()));
    return ++frame;
  };
  container = document.createElement('div');
  document.body.appendChild(container);
  editor = createEditor(container, { value: source, extensions: [new CodeFoldingExtension()] });
  editor.setDecorations('marks', [
    { id: 'after', type: 'line', line: 9 },
    { id: 'inside', type: 'line', line: 5 },
    { id: 'before', type: 'line', line: 1 },
  ]);
  editor.getView().getContentElement().focus();
  editor.setCursor({ line: 4, column: 3 });
  await frames();
  editor.executeCommand('fold');
  await frames();
});

afterEach(() => {
  editor.destroy();
  container.remove();
  (globalThis as any).requestAnimationFrame = (globalThis as any).__raf;
  delete (Range.prototype as any).getClientRects;
  delete (Range.prototype as any).getBoundingClientRect;
});

describe('a folded document', () => {
  it('numbers the gutter with the document lines', () => {
    expect(editor.getView().getContentElement().querySelector('[data-lce-fold-placeholder]')).not.toBeNull();
    expect(gutterLabels()).toEqual(['1', '2', '3', '4', '5', '9', '10']);
  });

  it('places line decorations on the lines as shown, and hides those inside the fold', async () => {
    expect(decoration('before')!.style.top).toBe('24px');
    expect(decoration('after')!.style.top).toBe(`${6 * 24}px`);
    expect(decoration('inside')).toBeNull();
  });

  it('goes back to document numbering and places when unfolded', async () => {
    editor.setCursor({ line: 4, column: 3 });
    editor.executeCommand('unfold');
    await frames();
    expect(gutterLabels()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    expect(decoration('after')!.style.top).toBe(`${9 * 24}px`);
    expect(decoration('inside')!.style.top).toBe(`${5 * 24}px`);
  });
});

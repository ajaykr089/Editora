import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEditor, DiagnosticsExtension } from '../index';

// With no diagnostics the status box stayed over the code and told every user of the editor to
// "Add diagnostics with setDiagnostics(...) or the setDiagnostics command."
let container: HTMLElement;

beforeEach(() => {
  Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  container.remove();
  delete (Range.prototype as any).getClientRects;
  delete (Range.prototype as any).getBoundingClientRect;
});

describe('diagnostics status box', () => {
  it('is hidden while there is nothing to report, and shows the diagnostics when there are some', () => {
    const editor = createEditor(container, { value: 'let a = 1;', extensions: [new DiagnosticsExtension()] });
    const box = () => container.querySelector('[data-lce-diagnostics-status]') as HTMLElement;
    expect(box().style.display).toBe('none');
    expect(box().textContent).not.toMatch(/setDiagnostics/);

    editor.executeCommand('setDiagnostics', [
      { range: { start: { line: 0, column: 4 }, end: { line: 0, column: 5 } }, message: 'Unused variable', severity: 'warning' },
    ]);
    expect(box().style.display).toBe('');
    expect(box().textContent).toContain('Unused variable');

    editor.executeCommand('setDiagnostics', []);
    expect(box().style.display).toBe('none');
    editor.destroy();
  });
});

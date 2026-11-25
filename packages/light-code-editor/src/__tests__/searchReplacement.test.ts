import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEditor, SearchExtension } from '../index';
import { expandSearchReplacement } from '../searchReplacement';

// A regular-expression Replace put "$1" itself into the document: capture groups were never expanded.
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

const result = (match: string, groups: Array<string | undefined> = [], namedGroups?: Record<string, string | undefined>) => ({
  range: { start: { line: 0, column: 0 }, end: { line: 0, column: match.length } },
  match,
  groups,
  namedGroups,
});

describe('expandSearchReplacement', () => {
  it('expands numbered and named groups, the whole match and $$', () => {
    const r = result('2026-11-25', ['2026', '11', '25'], { y: '2026', m: '11', d: '25' });
    expect(expandSearchReplacement('$3/$2/$1', r)).toBe('25/11/2026');
    expect(expandSearchReplacement('$<d>.$<m>.$<y>', r)).toBe('25.11.2026');
    expect(expandSearchReplacement('[$&] [$0] $$1', r)).toBe('[2026-11-25] [2026-11-25] $1');
  });

  it('reads $12 as group 1 then "2" when there is no group 12, and leaves unknown groups as typed', () => {
    const r = result('ab', ['a']);
    expect(expandSearchReplacement('$12', r)).toBe('a2');
    expect(expandSearchReplacement('$5 $<nope>', r)).toBe('$5 $<nope>');
  });

  it('gives an empty string for a group that did not take part', () => {
    expect(expandSearchReplacement('<$1>', result('x', [undefined]))).toBe('<>');
  });
});

describe('replace in the editor', () => {
  it('expands groups in replaceAll with regex on, and not with regex off', () => {
    const editor = createEditor(container, { value: 'foo(1)\nbar(2)' });
    expect(editor.replaceAll('(\\w+)\\((\\d)\\)', '$2:$1', { regex: true })).toBe(2);
    expect(editor.getValue()).toBe('1:foo\n2:bar');
    editor.setValue('cost $1');
    editor.replaceAll('cost', 'price $1');
    expect(editor.getValue()).toBe('price $1 $1');
    editor.destroy();
  });

  it('expands groups when the find panel replaces one match', () => {
    const editor = createEditor(container, { value: 'let a = b;\nlet c = d;', extensions: [new SearchExtension()] });
    editor.getView().getContentElement().focus();
    editor.executeCommand('replace');
    const find = container.querySelector('input[aria-label="Find"]') as HTMLInputElement;
    const replace = container.querySelector('input[aria-label="Replace with"]') as HTMLInputElement;
    const regexToggle = container.querySelector('label[title="Regular expression"] input') as HTMLInputElement;
    regexToggle.checked = true;
    regexToggle.dispatchEvent(new Event('change', { bubbles: true }));
    find.value = '(\\w) = (\\w)';
    replace.value = '$2 = $1';
    replace.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    expect(editor.getValue()).toBe('let b = a;\nlet c = d;');
    editor.destroy();
  });
});

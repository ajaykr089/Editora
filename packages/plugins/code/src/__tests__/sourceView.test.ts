import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CodePlugin } from '../CodePlugin.native';
import { formatSourceHtml, removeFormattingWhitespace } from '../sourceFormat';

// Opening the source view and pressing Save without touching anything changed the document: the formatter put
// every tag on its own line and trimmed the text between tags, so `foo<b>bar</b>baz` read "foo bar baz" and a
// <pre> lost its leading spaces.

const SAMPLE =
  '<h2>Title</h2><p>foo<b>bar</b>baz and <i>x</i>.</p><pre>  a\n    b</pre>' +
  '<ul><li>one</li><li>two<br>three</li></ul>' +
  '<table><tbody><tr><td><p>a <em>b</em></p></td></tr></tbody></table>';

describe('formatSourceHtml', () => {
  it('puts blocks on lines of their own and leaves inline content and <pre> as they are', () => {
    expect(formatSourceHtml(SAMPLE)).toBe(
      [
        '<h2>Title</h2>',
        '<p>foo<b>bar</b>baz and <i>x</i>.</p>',
        '<pre>  a\n    b</pre>',
        '<ul>',
        '  <li>one</li>',
        '  <li>two<br>three</li>',
        '</ul>',
        '<table>',
        '  <tbody>',
        '    <tr>',
        '      <td>',
        '        <p>a <em>b</em></p>',
        '      </td>',
        '    </tr>',
        '  </tbody>',
        '</table>',
      ].join('\n'),
    );
  });

  it('gives back the same HTML once the formatting whitespace is taken out', () => {
    expect(removeFormattingWhitespace(formatSourceHtml(SAMPLE))).toBe(SAMPLE);
  });

  it('leaves content that is not made of blocks alone', () => {
    expect(formatSourceHtml('plain <b>bold</b> text')).toBe('plain <b>bold</b> text');
  });

  it('keeps whitespace inside inline content and <pre> when removing formatting whitespace', () => {
    const typed = '<div>\n  <p>a <b>b</b> </p>\n  <pre> x\n</pre>\n</div>';
    expect(removeFormattingWhitespace(typed)).toBe('<div><p>a <b>b</b> </p><pre> x\n</pre></div>');
  });
});

describe('the source view', () => {
  beforeEach(() => {
    // jsdom has no layout; the code editor measures text ranges.
    Object.defineProperty(Range.prototype, 'getClientRects', { configurable: true, writable: true, value: () => [] });
    Object.defineProperty(Range.prototype, 'getBoundingClientRect', { configurable: true, writable: true, value: () => new DOMRect() });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete (Range.prototype as any).getClientRects;
    delete (Range.prototype as any).getBoundingClientRect;
  });

  const openSourceView = async (html: string) => {
    const content = document.createElement('div');
    content.className = 'rte-content';
    content.setAttribute('contenteditable', 'true');
    content.innerHTML = html;
    document.body.appendChild(content);
    const range = document.createRange();
    range.setStart(content.querySelector('p')!.firstChild!, 1);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);

    (CodePlugin().commands as any).toggleSourceView();
    // The code editor is created in the next animation frame.
    for (let i = 0; i < 20 && !document.querySelector('.rte-source-editor-overlay [data-lce-editor-container]'); i++) {
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(document.querySelector('.rte-source-editor-overlay [data-lce-editor-container]')).not.toBeNull();
    return content;
  };

  it('leaves the document exactly as it was when Save is pressed without an edit', async () => {
    const content = await openSourceView(SAMPLE);
    const before = content.innerHTML;
    let inputs = 0;
    content.addEventListener('input', () => inputs++);

    (document.querySelector('.rte-source-editor-btn-save') as HTMLButtonElement).click();

    expect(document.querySelector('.rte-source-editor-overlay')).toBeNull();
    expect(content.innerHTML).toBe(before);
    expect(inputs).toBe(0);
  });

  /** Replaces the text of the code editor the way the browser would: the DOM changes, then `input`. */
  const editSource = (text: string) => {
    const box = document.querySelector('.rte-source-editor-overlay [role="textbox"]') as HTMLElement;
    box.textContent = text;
    box.dispatchEvent(new Event('input', { bubbles: true }));
  };

  it('saves an edit as one undo step', async () => {
    const content = await openSourceView('<p>one</p>');
    const recorded: unknown[][] = [];
    (window as any).execEditorCommand = (command: string, ...args: unknown[]) => {
      if (command === 'recordDomTransaction') recorded.push(args);
      return true;
    };

    editSource('<p>two</p>');
    (document.querySelector('.rte-source-editor-btn-save') as HTMLButtonElement).click();

    expect(content.innerHTML).toBe('<p>two</p>');
    expect(recorded).toEqual([[content, '<p>one</p>', '<p>two</p>']]);
    delete (window as any).execEditorCommand;
  });
});

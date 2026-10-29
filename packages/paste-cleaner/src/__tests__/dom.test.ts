import { attachPasteCleaner, insertHtml } from '../dom';

function editor(html: string): HTMLElement {
  document.body.innerHTML = `<div contenteditable="true">${html}</div>`;
  return document.querySelector<HTMLElement>('[contenteditable]')!;
}

function caret(node: Node, offset: number): void {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  const selection = document.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
}

function paste(target: HTMLElement, data: Record<string, string>): ClipboardEvent {
  const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent;
  Object.defineProperty(event, 'clipboardData', {
    value: { getData: (type: string) => data[type] ?? '', files: [] },
  });
  target.dispatchEvent(event);
  return event;
}

describe('insertHtml', () => {
  it('splits the paragraph around pasted blocks and joins the edge paragraphs', () => {
    const root = editor('<p>Hello world</p>');
    caret(root.querySelector('p')!.firstChild!, 6);
    insertHtml(root, '<p>big</p><h2>Title</h2><p>small</p>');
    expect(root.innerHTML).toBe('<p>Hello big</p><h2>Title</h2><p>smallworld</p>');
  });

  it('inserts inline content in place', () => {
    const root = editor('<p>Hello world</p>');
    caret(root.querySelector('p')!.firstChild!, 6);
    insertHtml(root, '<strong>big </strong>');
    expect(root.innerHTML).toBe('<p>Hello <strong>big </strong>world</p>');
  });

  it('puts block content at the end of a paragraph after it', () => {
    const root = editor('<p>Intro</p>');
    caret(root.querySelector('p')!.firstChild!, 5);
    insertHtml(root, '<ul><li>a</li></ul>');
    expect(root.innerHTML).toBe('<p>Intro</p><ul><li>a</li></ul>');
  });

  it('keeps pasted blocks as lines inside a table cell', () => {
    const root = editor('<table><tbody><tr><td>x</td></tr></tbody></table>');
    caret(root.querySelector('td')!.firstChild!, 1);
    insertHtml(root, '<p>one</p><p>two</p>');
    expect(root.querySelector('td')!.innerHTML).toBe('xone<br>two');
  });
});

describe('attachPasteCleaner', () => {
  it('cleans the clipboard HTML and reports the result', () => {
    const root = editor('<p>Start: </p>');
    caret(root.querySelector('p')!.firstChild!, 7);
    const results: unknown[] = [];
    const cleaner = attachPasteCleaner(root, { insertMode: 'range', onPaste: (result) => results.push(result) });
    const event = paste(root, { 'text/html': '<b style="font-weight:normal" id="docs-internal-guid-1"><span style="font-weight:700">Bold</span> text</b>', 'text/plain': 'Bold text' });
    expect(event.defaultPrevented).toBe(true);
    expect(root.innerHTML).toBe('<p>Start: <strong>Bold</strong> text</p>');
    expect(cleaner.lastResult?.source).toBe('google-docs');
    expect(results).toHaveLength(1);
    cleaner.detach();
  });

  it('pastes plain text with Shift+Mod+V', () => {
    const root = editor('<p>x</p>');
    caret(root.querySelector('p')!.firstChild!, 1);
    attachPasteCleaner(root, { insertMode: 'range' });
    const mac = /mac/i.test(navigator.platform);
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'V', shiftKey: true, metaKey: mac, ctrlKey: !mac, bubbles: true }));
    paste(root, { 'text/html': '<h1>Big</h1>', 'text/plain': 'Big' });
    expect(root.innerHTML).toBe('<p>xBig</p>');
  });

  it('lets the browser paste when transform returns false', () => {
    const root = editor('<p>x</p>');
    attachPasteCleaner(root, { transform: () => false });
    expect(paste(root, { 'text/plain': 'y' }).defaultPrevented).toBe(false);
  });
});

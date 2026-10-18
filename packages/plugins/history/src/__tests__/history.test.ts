import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { recordDomTransaction, undoDom, redoDom } from '../HistoryPlugin.native';

let editor: HTMLElement;

const pause = (ms: number) => vi.setSystemTime(Date.now() + ms);

/** What the host does for one keystroke: change the DOM, then report the change with its input type and data. */
const keystroke = (inputType: string, apply: (text: Text) => void, data: string | null = null) => {
  const text = editor.querySelector('p')!.firstChild as Text;
  const before = editor.innerHTML;
  apply(text);
  recordDomTransaction(editor, before, editor.innerHTML, { inputType, data });
};
const typeChars = (chars: string) => {
  for (const ch of chars) keystroke('insertText', (text) => { text.data += ch; }, ch);
};
const backspace = (count = 1) => {
  for (let i = 0; i < count; i++) keystroke('deleteContentBackward', (text) => { text.data = text.data.slice(0, -1); });
};
const content = () => editor.textContent;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T10:00:00Z'));
  document.body.innerHTML = '<div class="rte-editor"><div class="rte-content" contenteditable="true"><p>Start</p></div></div>';
  editor = document.querySelector('.rte-content') as HTMLElement;
});

afterEach(() => {
  // Leave nothing for the next test to undo.
  while (undoDom(editor)) { /* empty the stack */ }
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('history: typing is grouped', () => {
  it('takes back a run of letters with one undo', () => {
    typeChars(' abc');
    expect(content()).toBe('Start abc');
    // " " ends nothing yet (it is the first key of the run) but joins the run it starts: " " | "abc"
    undoDom(editor);
    expect(content()).toBe('Start ');
    undoDom(editor);
    expect(content()).toBe('Start');
  });

  it('takes back one word at a time, the word keeping its trailing space', () => {
    typeChars('hello world again');
    expect(content()).toBe('Starthello world again');
    undoDom(editor);
    expect(content()).toBe('Starthello world ');
    undoDom(editor);
    expect(content()).toBe('Starthello ');
    undoDom(editor);
    expect(content()).toBe('Start');
  });

  it('starts a new step after a pause', () => {
    typeChars('abc');
    pause(1500);
    typeChars('def');
    undoDom(editor);
    expect(content()).toBe('Startabc');
    undoDom(editor);
    expect(content()).toBe('Start');
  });

  it('does not join keystrokes less than a second apart, however long the run is', () => {
    for (let i = 0; i < 30; i++) {
      typeChars('xxxx');
      pause(900);
    }
    // 27 seconds of typing without a long pause: a step is capped at 8 seconds, so it is not a single undo...
    let steps = 0;
    while (undoDom(editor)) steps++;
    expect(steps).toBeGreaterThanOrEqual(3);
    // ...and not one step per letter (120 letters) either.
    expect(steps).toBeLessThanOrEqual(5);
  });

  it('keeps more than one hundred typed letters undoable as a few steps', () => {
    typeChars('a'.repeat(250));
    let steps = 0;
    while (undoDom(editor)) steps++;
    expect(steps).toBe(1);
    expect(content()).toBe('Start');
  });

  it('starts a new step when the pointer is pressed in the editor', () => {
    typeChars('abc');
    editor.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    typeChars('def');
    undoDom(editor);
    expect(content()).toBe('Startabc');
  });

  it('starts a new step when a caret key is pressed', () => {
    typeChars('abc');
    editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    typeChars('def');
    undoDom(editor);
    expect(content()).toBe('Startabc');
  });

  it('does not close a step for a key that does not move the caret', () => {
    typeChars('abc');
    editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    typeChars('def');
    undoDom(editor);
    expect(content()).toBe('Start');
  });

  it('keeps typing and deleting as separate steps', () => {
    typeChars('abcd');
    backspace(2);
    expect(content()).toBe('Startab');
    undoDom(editor);
    expect(content()).toBe('Startabcd');
    undoDom(editor);
    expect(content()).toBe('Start');
  });

  it('groups consecutive deletes', () => {
    backspace(3);
    expect(content()).toBe('St');
    undoDom(editor);
    expect(content()).toBe('Start');
  });

  it('never merges a change that is not typing and ends the run before it', () => {
    typeChars('abc');
    const before = editor.innerHTML;
    editor.querySelector('p')!.innerHTML = '<strong>Startabc</strong>';
    recordDomTransaction(editor, before, editor.innerHTML);
    const strongBefore = editor.innerHTML;
    (editor.querySelector('strong')!.firstChild as Text).data += 'd';
    recordDomTransaction(editor, strongBefore, editor.innerHTML, { inputType: 'insertText', data: 'd' });
    undoDom(editor);
    expect(editor.innerHTML).toBe('<p><strong>Startabc</strong></p>');
    undoDom(editor);
    expect(editor.innerHTML).toBe('<p>Startabc</p>');
    undoDom(editor);
    expect(content()).toBe('Start');
  });

  it('does not merge keystrokes when something else changed the content in between', () => {
    typeChars('abc');
    editor.querySelector('p')!.firstChild!.textContent = 'Startabc and a change made elsewhere';
    typeChars('d');
    undoDom(editor);
    expect(content()).toBe('Startabc and a change made elsewhere');
  });

  it('starts a fresh step for typing after an undo instead of growing the one before', () => {
    typeChars('one');
    pause(1500);
    typeChars('two');
    undoDom(editor);
    expect(content()).toBe('Startone');
    typeChars('X');
    undoDom(editor);
    expect(content()).toBe('Startone');
    undoDom(editor);
    expect(content()).toBe('Start');
  });

  it('redoes a whole run and drops the redo stack on new typing', () => {
    typeChars('abc');
    undoDom(editor);
    expect(content()).toBe('Start');
    redoDom(editor);
    expect(content()).toBe('Startabc');
    undoDom(editor);
    typeChars('Z');
    expect(redoDom(editor)).toBe(false);
    expect(content()).toBe('StartZ');
  });

  it('still ignores an identical transaction recorded twice', () => {
    const before = editor.innerHTML;
    editor.querySelector('p')!.firstChild!.textContent = 'Start!';
    expect(recordDomTransaction(editor, before, editor.innerHTML)).toBe(true);
    expect(recordDomTransaction(editor, before, editor.innerHTML)).toBe(false);
    undoDom(editor);
    expect(content()).toBe('Start');
    expect(undoDom(editor)).toBe(false);
  });
});

describe('history: the caret after undo and redo', () => {
  const caret = () => {
    const range = window.getSelection()!.getRangeAt(0);
    return { text: (range.startContainer as Text).data, offset: range.startOffset };
  };

  it('puts the caret where the typed text was, not at the start of the document', () => {
    typeChars(' abc');
    undoDom(editor);
    // Undone back to "Start " + "abc" removed: caret sits after "Start ".
    expect(caret()).toEqual({ text: 'Start ', offset: 6 });
  });

  it('puts the caret back after the text that redo restores', () => {
    typeChars('abc');
    undoDom(editor);
    redoDom(editor);
    expect(caret()).toEqual({ text: 'Startabc', offset: 8 });
  });

  it('puts the caret after the restored text when a delete is undone', () => {
    backspace(3);
    undoDom(editor);
    expect(caret()).toEqual({ text: 'Start', offset: 5 });
  });

  it('places the caret in a later paragraph', () => {
    editor.innerHTML = '<p>One</p><p>Two</p>';
    const second = editor.querySelectorAll('p')[1].firstChild as Text;
    const before = editor.innerHTML;
    second.data = 'Two plus';
    recordDomTransaction(editor, before, editor.innerHTML, { inputType: 'insertText', data: 'x' });
    undoDom(editor);
    expect(editor.innerHTML).toBe('<p>One</p><p>Two</p>');
    const range = window.getSelection()!.getRangeAt(0);
    expect(range.startContainer.textContent).toBe('Two');
    expect(range.startOffset).toBe(3);
  });

  it('keeps the caret after a trailing space that the browser turned between a no-break and a normal space', () => {
    // Chrome types a trailing space as &nbsp; and turns it into a normal space when the next word follows.
    editor.innerHTML = '<p>Start The quick&nbsp;</p>';
    const before = editor.innerHTML;
    editor.innerHTML = '<p>Start The quick brown&nbsp;</p>';
    recordDomTransaction(editor, before, editor.innerHTML, { inputType: 'insertText', data: ' ' });
    undoDom(editor);
    expect(editor.textContent).toBe('Start The quick\u00a0');
    const range = window.getSelection()!.getRangeAt(0);
    expect((range.startContainer as Text).data).toBe('Start The quick\u00a0');
    expect(range.startOffset).toBe(16);
  });

  it('does not take the caret away from another field that has focus', () => {
    document.body.insertAdjacentHTML('beforeend', '<input id="other">');
    const other = document.getElementById('other') as HTMLInputElement;
    other.focus();
    window.getSelection()!.removeAllRanges();
    typeChars('abc');
    undoDom(editor);
    expect(document.activeElement).toBe(other);
    expect(window.getSelection()!.rangeCount).toBe(0);
  });
});

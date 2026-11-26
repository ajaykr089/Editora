import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';

// An input event with no beforeinput before it (a plugin's own edit, or Chromium's execCommand, which fires none)
// is sanitized, and when that changes the HTML the content is replaced. The editor then put the old range back,
// but that range pointed into the nodes that had just been replaced, so the selection fell to the start of the
// document. Chromium reports insertUnorderedList half-way, with the list still inside the paragraph, which the
// sanitizer moves out: turning two selected paragraphs into a list lost the selection, and the next list command
// (Numbered list, say) changed only the first item.

async function mount() {
  const el = document.createElement('editora-editor') as any;
  document.body.appendChild(el);
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  const content = el.querySelector('.editora-content') as HTMLElement;
  expect(content, 'editor content element').toBeTruthy();
  await new Promise((r) => setTimeout(r, 200));
  return content;
}

describe('sanitizing content after an input event', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    (RichTextEditorElement as any).__globalPluginLoader = new PluginLoader();
    if (!customElements.get('editora-editor')) {
      customElements.define('editora-editor', RichTextEditorElement);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps the selection on the same text when it replaces the content', async () => {
    const content = await mount();
    // What Chromium leaves while it runs insertUnorderedList: a list inside a paragraph (built by hand, since
    // parsing HTML would already move the list out).
    content.innerHTML = '';
    const paragraph = document.createElement('p');
    const list = document.createElement('ul');
    ['alpha', 'beta'].forEach((text) => {
      const item = document.createElement('li');
      item.textContent = text;
      list.appendChild(item);
    });
    paragraph.appendChild(list);
    content.appendChild(paragraph);
    const items = content.querySelectorAll('li');
    const range = document.createRange();
    range.setStart(items[0].firstChild!, 0);
    range.setEnd(items[1].firstChild!, 4);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);

    content.dispatchEvent(new Event('input', { bubbles: true }));

    expect(content.querySelector('p > ul')).toBeNull();
    const kept = window.getSelection()!.getRangeAt(0);
    expect(kept.startContainer.isConnected).toBe(true);
    expect(kept.toString()).toBe('alphabeta');
  });

  it('keeps a caret on the same character', async () => {
    const content = await mount();
    content.innerHTML = '<p>one <b onclick="alert(1)">two</b> three</p>';
    const tail = content.querySelector('b')!.nextSibling!;
    const range = document.createRange();
    range.setStart(tail, 3);
    range.collapse(true);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);

    content.dispatchEvent(new Event('input', { bubbles: true }));

    expect(content.querySelector('b')!.hasAttribute('onclick')).toBe(false);
    const caret = window.getSelection()!.getRangeAt(0);
    const head = document.createRange();
    head.selectNodeContents(content);
    head.setEnd(caret.startContainer, caret.startOffset);
    expect(head.toString()).toBe('one two th');
  });
});

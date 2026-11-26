import { afterEach, describe, expect, it } from 'vitest';
import { openLinkDialog } from '../LinkPlugin.native';

// Every link the dialog wrote carried target="_self" (what a link does anyway), noise in the saved HTML.

function setUp(html: string) {
  document.body.innerHTML = `<div class="rte-content" contenteditable="true">${html}</div>`;
  return document.querySelector('.rte-content') as HTMLElement;
}

function selectText(root: HTMLElement, text: string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const at = node.textContent!.indexOf(text);
    if (at < 0) continue;
    const range = document.createRange();
    range.setStart(node, at);
    range.setEnd(node, at + text.length);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
    return;
  }
}

function submitDialog({ url, newTab }: { url?: string; newTab: boolean }) {
  const dialog = document.querySelector('.link-dialog-overlay') as HTMLElement;
  if (url !== undefined) (dialog.querySelector('#link-url') as HTMLInputElement).value = url;
  (dialog.querySelector('#link-target') as HTMLInputElement).checked = newTab;
  (dialog.querySelector('#link-form') as HTMLFormElement).dispatchEvent(new Event('submit', { cancelable: true }));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('the link dialog', () => {
  it('writes no target for a link that opens in the same tab', () => {
    const root = setUp('<p>read the docs</p>');
    selectText(root, 'docs');
    openLinkDialog();
    submitDialog({ url: 'https://example.com/docs', newTab: false });
    expect(root.innerHTML).toBe('<p>read the <a href="https://example.com/docs">docs</a></p>');
  });

  it('writes target and rel for a new tab, and takes both away again', () => {
    const root = setUp('<p>read the docs</p>');
    selectText(root, 'docs');
    openLinkDialog();
    submitDialog({ url: 'https://example.com/docs', newTab: true });
    const link = root.querySelector('a')!;
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');

    selectText(root, 'docs');
    openLinkDialog();
    submitDialog({ newTab: false });
    expect(root.innerHTML).toBe('<p>read the <a href="https://example.com/docs">docs</a></p>');
  });
});

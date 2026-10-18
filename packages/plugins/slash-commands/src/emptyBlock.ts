const BLOCK_TAGS = /^(P|DIV|H[1-6]|LI|BLOCKQUOTE|PRE|TD|TH)$/;
const CONTENT_ELEMENTS = 'br, img, video, audio, iframe, hr, table, svg, canvas, object, embed, [contenteditable="false"]';

/**
 * Deleting the typed `/query` can leave the caret in a block with nothing in it. A block without any content
 * has no height, so the browser cannot keep a caret in it: block commands (heading, quote, list...) then act on
 * a neighbouring block instead. Putting the placeholder `<br>` back keeps the caret, and the command, in the
 * block the user typed in. Returns the block that was fixed, if any.
 */
export function keepCaretBlockSelectable(editor: HTMLElement, caret: Range): HTMLElement | null {
  let node: Node | null = caret.startContainer;
  if (node.nodeType !== Node.ELEMENT_NODE) node = node.parentNode;

  let block: HTMLElement | null = null;
  while (node && node !== editor) {
    if (node instanceof HTMLElement && BLOCK_TAGS.test(node.tagName)) {
      block = node;
      break;
    }
    node = node.parentNode;
  }
  if (!block || !editor.contains(block)) return null;

  if ((block.textContent ?? '') !== '' || block.querySelector(CONTENT_ELEMENTS)) return null;

  // Deleting the typed text left an empty text node: drop it, so the block holds just the placeholder.
  Array.from(block.childNodes).forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE && (child as Text).data === '') block.removeChild(child);
  });
  block.appendChild(document.createElement('br'));
  caret.setStart(block, 0);
  caret.collapse(true);
  return block;
}

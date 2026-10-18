/**
 * Some browsers answer `insertUnorderedList` / `insertOrderedList` on a paragraph with the list *inside* the
 * paragraph (`<p><ul>...</ul></p>`). That is not valid HTML: the next time the content is parsed the paragraph
 * closes in front of the list, leaving an empty `<p></p>` before it and another after it. This lifts every list out
 * of the paragraph it was put in (text that sat beside it keeps a paragraph of its own) and leaves the caret
 * where it was.
 */
export function liftListsOutOfParagraphs(root: HTMLElement): void {
  const lists = Array.from(root.querySelectorAll('ul, ol')).filter(
    (list) => list.parentElement?.tagName === 'P' && root.contains(list.parentElement),
  );
  if (lists.length === 0) return;

  const selection = root.ownerDocument.defaultView?.getSelection() ?? null;
  // Plain values, not a Range: a Range is live and moves with the nodes that are about to be moved.
  const current = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  const saved =
    current && root.contains(current.commonAncestorContainer)
      ? {
          startContainer: current.startContainer,
          startOffset: current.startOffset,
          endContainer: current.endContainer,
          endOffset: current.endOffset,
        }
      : null;

  lists.forEach((list) => {
    const paragraph = list.parentElement as HTMLElement | null;
    // An earlier list of the same paragraph may already have replaced it.
    if (!paragraph || paragraph.tagName !== 'P' || !paragraph.parentNode) return;

    const parent = paragraph.parentNode;
    const before: Node[] = [];
    const after: Node[] = [];
    let seenList = false;
    Array.from(paragraph.childNodes).forEach((child) => {
      if (child === list) {
        seenList = true;
      } else if (seenList) {
        after.push(child);
      } else {
        before.push(child);
      }
    });

    // Whitespace around the list is not content: do not keep a paragraph for it.
    const hasContent = (nodes: Node[]) =>
      nodes.some((node) => (node.nodeType === Node.TEXT_NODE ? (node.textContent ?? '').trim() !== '' : true));

    const makeParagraph = (nodes: Node[]) => {
      const copy = paragraph.cloneNode(false) as HTMLElement;
      nodes.forEach((node) => copy.appendChild(node));
      return copy;
    };

    if (hasContent(before)) parent.insertBefore(makeParagraph(before), paragraph);
    parent.insertBefore(list, paragraph);
    if (hasContent(after)) parent.insertBefore(makeParagraph(after), paragraph);
    parent.removeChild(paragraph);
  });

  // Moving nodes collapses a selection that was inside them; put it back.
  if (saved && selection && root.contains(saved.startContainer) && root.contains(saved.endContainer)) {
    const range = root.ownerDocument.createRange();
    range.setStart(saved.startContainer, saved.startOffset);
    range.setEnd(saved.endContainer, saved.endOffset);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

/** A paragraph with nothing in it at all: no text, no placeholder `<br>`, no element. */
function isEmptyParagraph(node: Node | null): node is HTMLElement {
  return (
    node instanceof HTMLElement &&
    node.tagName === 'P' &&
    (node.textContent ?? '') === '' &&
    node.querySelector('*') === null
  );
}

/**
 * Making a paragraph a list splits it, and Chromium leaves an empty `<p></p>` where it split: one in front of
 * the list and one behind it. They have no height, so the document looks right, but they are stray blocks that
 * the caret and the next block command trip over. A blank line the user typed has its placeholder `<br>` and is
 * not touched: only a paragraph with nothing in it that sits right beside a list goes.
 */
export function removeEmptyParagraphsAroundLists(root: HTMLElement): void {
  const neighbour = (from: Node, direction: 'previousSibling' | 'nextSibling'): Node | null => {
    let node = from[direction];
    // Whitespace between blocks is not a block.
    while (node && node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() === '') node = node[direction];
    return node;
  };

  root.querySelectorAll('ul, ol').forEach((list) => {
    if (list.parentNode !== root && list.parentElement?.closest('ul, ol')) return;

    for (const direction of ['previousSibling', 'nextSibling'] as const) {
      let next = neighbour(list, direction);
      while (isEmptyParagraph(next)) {
        const empty = next;
        next = neighbour(empty, direction);
        empty.parentNode?.removeChild(empty);
      }
    }
  });
}

const CARET_BLOCKS = /^(P|LI|H[1-6]|BLOCKQUOTE|PRE|DIV|TD|TH)$/;

function caretBlockOf(root: HTMLElement, node: Node | null): HTMLElement | null {
  let current: Node | null = node;
  while (current && current !== root) {
    if (current instanceof HTMLElement && CARET_BLOCKS.test(current.tagName)) return current;
    current = current.parentNode;
  }
  return null;
}

/** How many characters of text lie between the start of the caret's block and the caret; null if not a plain caret. */
export function getCaretOffsetInBlock(root: HTMLElement): number | null {
  const selection = root.ownerDocument.defaultView?.getSelection();
  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return null;

  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer)) return null;
  const block = caretBlockOf(root, range.startContainer);
  if (!block) return null;

  const head = root.ownerDocument.createRange();
  head.selectNodeContents(block);
  head.setEnd(range.startContainer, range.startOffset);
  return head.toString().length;
}

/**
 * Puts the caret back at a character offset of the block it is in. Turning a line into a list item leaves the caret
 * at the start of the item (the browser moves it to the element, in front of the text), so a word typed next went
 * in front of the line instead of after it.
 */
export function restoreCaretOffsetInBlock(root: HTMLElement, offset: number): void {
  const selection = root.ownerDocument.defaultView?.getSelection();
  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return;

  const current = selection.getRangeAt(0);
  if (!root.contains(current.startContainer)) return;
  const block = caretBlockOf(root, current.startContainer);
  if (!block) return;

  const walker = root.ownerDocument.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  let remaining = Math.max(0, offset);
  let last: Text | null = null;
  let node: Node | null;
  const range = root.ownerDocument.createRange();
  while ((node = walker.nextNode())) {
    const text = node as Text;
    last = text;
    if (remaining <= text.data.length) {
      range.setStart(text, remaining);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    remaining -= text.data.length;
  }

  // A block with no text (a placeholder line break only) keeps its caret where the browser put it.
  if (last) {
    range.setStart(last, last.data.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

import { recordDomHistory } from '../../shared/historyHelpers';
import { restoreBoundaries, saveBoundaries, selectedListItems, unwrapSelectedListItems } from './listMarkup';

/**
 * The keys a word processor gives a list, which the browsers do not:
 *
 * - Tab nests the item under the one before it; Shift+Tab moves a nested item out one level. (Tab used to take the
 *   focus out of the editor. Shift+Tab on a top-level item is still the browser's, so the focus can always leave.)
 * - Enter in an empty item moves it out one level, or makes it a paragraph at the top level. (Firefox made a <div>.)
 * - Backspace at the start of an item does the same. (At the start of the first item it did nothing at all.)
 */

const isList = (node: Element | null): node is HTMLOListElement | HTMLUListElement =>
  !!node && (node.tagName === 'UL' || node.tagName === 'OL');

/** The editable Editora content the selection is in, or null. */
function editableContentOf(node: Node | null): HTMLElement | null {
  const element = node instanceof Element ? node : node?.parentElement ?? null;
  const content = element?.closest<HTMLElement>('.rte-content, .editora-content') ?? null;
  if (!content || !content.isContentEditable) return null;
  const host = element?.closest('[contenteditable]');
  if (host && host.getAttribute('contenteditable') === 'false') return null;
  return content;
}

/** A list item that belongs to a list the list plugin owns (not a checklist). */
function plainItem(item: HTMLLIElement | null): item is HTMLLIElement {
  const list = item?.parentElement ?? null;
  return isList(list) && list.getAttribute('data-type') !== 'checklist';
}

/** The item `item` is nested in, if any: its list sits inside that item. */
function parentItemOf(item: HTMLLIElement): HTMLLIElement | null {
  const outer = item.parentElement?.parentElement;
  return outer && outer.tagName === 'LI' ? (outer as HTMLLIElement) : null;
}

/** Nests `items` (neighbours in one list) under the item before the first of them. */
function sink(items: HTMLLIElement[]): boolean {
  const first = items[0];
  const previous = first.previousElementSibling as HTMLLIElement | null;
  const list = first.parentElement;
  if (!previous || previous.tagName !== 'LI' || !isList(list)) return false;

  let nested = Array.from(previous.children).reverse().find((child) => child.tagName === list.tagName) as HTMLElement | undefined;
  if (!nested || nested !== previous.lastElementChild) {
    nested = document.createElement(list.tagName.toLowerCase());
    previous.appendChild(nested);
  }
  items.forEach((item) => nested!.appendChild(item));
  return true;
}

/**
 * Moves a nested item out one level, right after the item it was nested in. Items that came after it in the nested
 * list stay below it, nested under it now, so the order of the text does not change.
 */
function lift(item: HTMLLIElement): boolean {
  const parentItem = parentItemOf(item);
  const list = item.parentElement;
  if (!parentItem || !isList(list)) return false;

  const following: Element[] = [];
  for (let next = item.nextElementSibling; next; next = next.nextElementSibling) following.push(next);
  if (following.length > 0) {
    const rest = document.createElement(list.tagName.toLowerCase());
    following.forEach((node) => rest.appendChild(node));
    item.appendChild(rest);
  }
  parentItem.parentNode!.insertBefore(item, parentItem.nextSibling);
  if (list.children.length === 0) list.remove();
  return true;
}

function isEmptyItem(item: HTMLLIElement): boolean {
  return (item.textContent ?? '').trim() === '' && !item.querySelector('img, video, iframe, ul, ol, table');
}

/** True when nothing of the item's own text comes before the caret. */
function caretAtItemStart(item: HTMLLIElement, range: Range): boolean {
  const head = document.createRange();
  head.selectNodeContents(item);
  head.setEnd(range.startContainer, range.startOffset);
  return head.toString() === '';
}

/** Runs `change` as one undoable edit, keeping the selection where it was (or at the start of `change`'s block). */
function edit(content: HTMLElement, range: Range, change: () => boolean | Node | null): boolean {
  const beforeHTML = content.innerHTML;
  const saved = saveBoundaries(content, range);
  const result = change();
  if (!result) return false;
  restoreBoundaries(content, saved, result instanceof Node ? result : null);
  recordDomHistory(content, beforeHTML);
  content.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}

export function handleListKeyDown(event: KeyboardEvent): void {
  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
  if (event.key !== 'Tab' && event.key !== 'Enter' && event.key !== 'Backspace') return;
  if (event.key !== 'Tab' && event.shiftKey) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  const content = editableContentOf(range.startContainer);
  // Only a key pressed in that editor: not one typed into a dialog or field that happens to be open over it.
  if (!content || !(event.target instanceof Node) || !content.contains(event.target)) return;

  const startElement = range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement;
  const item = (startElement?.closest('li') ?? null) as HTMLLIElement | null;
  if (!item || !content.contains(item) || !plainItem(item)) return;

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      // A top-level item: leave Shift+Tab to the browser, so the focus can always get out of the editor.
      if (!parentItemOf(item)) return;
      event.preventDefault();
      edit(content, range, () => lift(item));
      return;
    }
    // Tab nests every selected item of this list (the selection may cover several).
    const items = (selectedListItems(content, range) ?? [item]).filter((candidate) => candidate.parentElement === item.parentElement);
    event.preventDefault();
    edit(content, range, () => sink(items.length > 0 ? items : [item]));
    return;
  }

  if (!range.collapsed) return;
  const wanted = event.key === 'Enter' ? isEmptyItem(item) : caretAtItemStart(item, range);
  if (!wanted) return;

  event.preventDefault();
  edit(content, range, () => {
    if (parentItemOf(item)) return lift(item) ? item : null;
    return unwrapSelectedListItems(content, item.parentElement!.tagName as 'UL' | 'OL')?.[0] ?? null;
  });
}

let installed = false;

/** Listens for the list keys once per page, before the editor's own handlers (and the table's Tab) see them. */
export function installListKeys(): void {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  document.addEventListener('keydown', handleListKeyDown, true);
}

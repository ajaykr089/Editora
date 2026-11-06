/**
 * Menus, dropdowns and popovers render a copy of their light-DOM content inside their own panel
 * and leave the original in place. The browser never shows the original (it sits in a hidden or
 * unassigned slot), but anything reading the light DOM did: Testing Library found every menu
 * item twice, and so could any tool walking the DOM rather than the rendered accessibility tree.
 *
 * `hideCloneSource` marks the original `aria-hidden` (only if the author had not set it), and
 * `revealClone` removes that mark from the copy, so the copy is the one exposed.
 */
const MARK = 'data-ui-clone-source';

export function hideCloneSource(source: Element | null | undefined): void {
  if (!source || source.hasAttribute(MARK)) return;
  if (source.hasAttribute('aria-hidden')) return;
  source.setAttribute('aria-hidden', 'true');
  source.setAttribute(MARK, '');
}

export function revealClone<T extends Element>(clone: T): T {
  if (clone.hasAttribute(MARK)) {
    clone.removeAttribute(MARK);
    clone.removeAttribute('aria-hidden');
  }
  return clone;
}

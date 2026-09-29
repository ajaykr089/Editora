import * as Y from 'yjs';
import { reconcileDomFromY, reconcileYFromDom } from './reconcile';

/**
 * Keeps a contentEditable DOM subtree and a Y.XmlFragment in sync in both
 * directions. Local DOM mutations are reconciled into the fragment inside a
 * transaction tagged with this instance as the origin; remote-origin
 * updates to the fragment are reconciled back onto the DOM, with the
 * MutationObserver disabled for the duration so applying a remote change
 * doesn't loop back around as a "local" one.
 */
export class YjsDomBinding {
  private readonly observer: MutationObserver;
  private pending = false;

  constructor(
    private readonly root: HTMLElement,
    private readonly doc: Y.Doc,
    private readonly fragment: Y.XmlFragment
  ) {
    if (this.fragment.length === 0 && this.root.childNodes.length > 0) {
      // First client to open this room - seed the shared doc from local content.
      this.doc.transact(() => reconcileYFromDom(this.fragment, this.root), this);
    } else {
      // Joining a room that already has content - adopt it, discarding
      // whatever placeholder content the editor mounted with.
      reconcileDomFromY(this.root, this.fragment, this.root.ownerDocument);
    }

    this.observer = new MutationObserver(() => this.scheduleLocalSync());
    this.observer.observe(this.root, { childList: true, characterData: true, subtree: true, attributes: true });

    this.fragment.observeDeep((_events, transaction) => {
      if (transaction.origin === this) return; // our own write, DOM already matches
      this.applyRemoteToDom();
    });
  }

  private scheduleLocalSync(): void {
    if (this.pending) return;
    this.pending = true;
    queueMicrotask(() => {
      this.pending = false;
      this.doc.transact(() => reconcileYFromDom(this.fragment, this.root), this);
    });
  }

  private applyRemoteToDom(): void {
    const selection = this.captureSelection();
    this.observer.disconnect();
    try {
      reconcileDomFromY(this.root, this.fragment, this.root.ownerDocument);
    } finally {
      this.observer.observe(this.root, { childList: true, characterData: true, subtree: true, attributes: true });
    }
    if (selection) this.restoreSelection(selection);
  }

  /** Child-index path from `root` down to a text node, for selection round-tripping. */
  private pathTo(node: Node, offset: number): { path: number[]; offset: number } | null {
    if (!this.root.contains(node)) return null;
    const path: number[] = [];
    let current: Node | null = node;
    while (current && current !== this.root) {
      const parent: Node | null = current.parentNode;
      if (!parent) return null;
      path.unshift(Array.prototype.indexOf.call(parent.childNodes, current));
      current = parent;
    }
    return { path, offset };
  }

  private resolvePath(path: number[]): Node | null {
    let node: Node = this.root;
    for (const index of path) {
      const child: ChildNode | undefined = node.childNodes[index];
      if (!child) return null;
      node = child;
    }
    return node;
  }

  private captureSelection(): { anchor: { path: number[]; offset: number }; focus: { path: number[]; offset: number } } | null {
    const sel = this.root.ownerDocument.defaultView?.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.anchorNode || !sel.focusNode) return null;
    const anchor = this.pathTo(sel.anchorNode, sel.anchorOffset);
    const focus = this.pathTo(sel.focusNode, sel.focusOffset);
    if (!anchor || !focus) return null;
    return { anchor, focus };
  }

  private restoreSelection(captured: { anchor: { path: number[]; offset: number }; focus: { path: number[]; offset: number } }): void {
    const sel = this.root.ownerDocument.defaultView?.getSelection();
    if (!sel) return;
    const anchorNode = this.resolvePath(captured.anchor.path);
    const focusNode = this.resolvePath(captured.focus.path);
    if (!anchorNode || !focusNode) return;
    try {
      const anchorOffset = Math.min(captured.anchor.offset, (anchorNode.textContent ?? '').length);
      const focusOffset = Math.min(captured.focus.offset, (focusNode.textContent ?? '').length);
      sel.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
    } catch {
      // Selection endpoints no longer valid (e.g. the exact text was
      // deleted by a remote peer) - leave focus wherever the browser put it.
    }
  }

  destroy(): void {
    this.observer.disconnect();
  }
}

import type { Awareness } from 'y-protocols/awareness';
import type { CollaborationUser, CursorState } from './types';

const STYLE_ID = 'editora-collaboration-cursor-styles';

function ensureStylesInjected(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .editora-collab-caret {
      position: fixed;
      width: 2px;
      pointer-events: none;
      z-index: 2147483000;
      transition: top 0.08s ease, left 0.08s ease;
    }
    .editora-collab-caret__label {
      position: absolute;
      top: -1.3em;
      left: -1px;
      white-space: nowrap;
      font-size: 11px;
      line-height: 1.4;
      padding: 1px 5px;
      border-radius: 3px;
      color: #fff;
      font-family: system-ui, sans-serif;
      pointer-events: none;
    }
    .editora-collab-selection {
      position: fixed;
      pointer-events: none;
      z-index: 2147482999;
      opacity: 0.25;
    }
  `;
  document.head.appendChild(style);
}

type RemoteCursor = Omit<CursorState, 'user' | 'clientId'>;

const SAFE_COLOR = /^(?:#[0-9a-f]{3,8}|[a-z]{3,20}|(?:rgb|hsl)a?\([\d\s.,%/-]+\))$/i;
const FALLBACK_COLOR = '#64748b';

/**
 * Awareness state is written by other clients, so none of its shape can be trusted: a peer (or a
 * buggy build of this plugin) can publish a numeric name, a non-array path or an object where a
 * colour belongs, and the render code would throw from inside the awareness 'change' handler.
 */
export function readUser(value: unknown): CollaborationUser | null {
  if (!value || typeof value !== 'object') return null;
  const { name, color } = value as Record<string, unknown>;
  if (typeof name !== 'string' || name.length === 0) return null;
  return {
    name: name.slice(0, 64),
    color: typeof color === 'string' && SAFE_COLOR.test(color.trim()) ? color.trim() : FALLBACK_COLOR
  };
}

function isPath(value: unknown): value is number[] {
  return Array.isArray(value) && value.length <= 256 && value.every((index) => Number.isInteger(index) && index >= 0);
}

function readCursor(value: unknown): RemoteCursor | null {
  if (!value || typeof value !== 'object') return null;
  const cursor = value as Record<string, unknown>;
  if (!isPath(cursor.anchorPath)) return null;
  const offset = (raw: unknown) => (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 0);
  return {
    anchorPath: cursor.anchorPath,
    anchorOffset: offset(cursor.anchorOffset),
    focusPath: isPath(cursor.focusPath) ? cursor.focusPath : undefined,
    focusOffset: offset(cursor.focusOffset)
  };
}

/** Path -> DOM node resolution mirroring YjsDomBinding's path capture format. */
function resolvePath(root: HTMLElement, path: number[]): Node | null {
  let node: Node = root;
  for (const index of path) {
    const child: ChildNode | undefined = node.childNodes[index];
    if (!child) return null;
    node = child;
  }
  return node;
}

function pathTo(root: HTMLElement, node: Node, offset: number): { path: number[]; offset: number } | null {
  if (!root.contains(node)) return null;
  const path: number[] = [];
  let current: Node | null = node;
  while (current && current !== root) {
    const parent: Node | null = current.parentNode;
    if (!parent) return null;
    path.unshift(Array.prototype.indexOf.call(parent.childNodes, current));
    current = parent;
  }
  return { path, offset };
}

export class CollaborationAwareness {
  private readonly caretElements = new Map<number, { caret: HTMLElement; selectionBox: HTMLElement }>();
  private pendingBroadcast = false;
  private readonly onSelectionChange = () => this.scheduleBroadcast();
  private readonly onAwarenessChange = () => this.renderRemoteCursors();
  private readonly onViewportChange = () => this.renderRemoteCursors();

  constructor(
    private readonly root: HTMLElement,
    private readonly awareness: Awareness,
    private readonly user: CollaborationUser
  ) {
    ensureStylesInjected();
    this.awareness.setLocalStateField('user', this.user);
    document.addEventListener('selectionchange', this.onSelectionChange);
    this.awareness.on('change', this.onAwarenessChange);
    window.addEventListener('scroll', this.onViewportChange, true);
    window.addEventListener('resize', this.onViewportChange);
  }

  private scheduleBroadcast(): void {
    if (this.pendingBroadcast) return;
    this.pendingBroadcast = true;
    queueMicrotask(() => {
      this.pendingBroadcast = false;
      this.broadcastCursor();
    });
  }

  private broadcastCursor(): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.anchorNode || !sel.focusNode) {
      this.awareness.setLocalStateField('cursor', null);
      return;
    }
    if (!this.root.contains(sel.anchorNode) || !this.root.contains(sel.focusNode)) {
      this.awareness.setLocalStateField('cursor', null);
      return;
    }

    const anchor = pathTo(this.root, sel.anchorNode, sel.anchorOffset);
    const focus = pathTo(this.root, sel.focusNode, sel.focusOffset);
    if (!anchor || !focus) return;

    const cursor: Omit<CursorState, 'user' | 'clientId'> = {
      anchorPath: anchor.path,
      anchorOffset: anchor.offset,
      focusPath: sel.isCollapsed ? undefined : focus.path,
      focusOffset: sel.isCollapsed ? undefined : focus.offset
    };
    this.awareness.setLocalStateField('cursor', cursor);
  }

  private renderRemoteCursors(): void {
    const states = this.awareness.getStates() as Map<number, { user?: unknown; cursor?: unknown } | null>;
    const seen = new Set<number>();

    states.forEach((state, clientId) => {
      if (clientId === this.awareness.clientID) return;
      const user = readUser(state?.user);
      const cursor = readCursor(state?.cursor);
      if (!user || !cursor) {
        this.removeCursor(clientId);
        return;
      }
      seen.add(clientId);
      this.renderCursor(clientId, user, cursor);
    });

    for (const clientId of Array.from(this.caretElements.keys())) {
      if (!seen.has(clientId)) this.removeCursor(clientId);
    }
  }

  private renderCursor(clientId: number, user: CollaborationUser, cursor: RemoteCursor): void {
    const anchorNode = resolvePath(this.root, cursor.anchorPath);
    if (!anchorNode) {
      this.removeCursor(clientId);
      return;
    }

    let entry = this.caretElements.get(clientId);
    if (!entry) {
      const caret = document.createElement('div');
      caret.className = 'editora-collab-caret';
      const label = document.createElement('div');
      label.className = 'editora-collab-caret__label';
      caret.appendChild(label);
      const selectionBox = document.createElement('div');
      selectionBox.className = 'editora-collab-selection';
      document.body.appendChild(selectionBox);
      document.body.appendChild(caret);
      entry = { caret, selectionBox };
      this.caretElements.set(clientId, entry);
    }

    const label = entry.caret.firstElementChild as HTMLElement;
    label.textContent = user.name;
    label.style.backgroundColor = user.color;
    entry.caret.style.backgroundColor = user.color;
    entry.selectionBox.style.backgroundColor = user.color;

    try {
      const range = document.createRange();
      const anchorOffset = Math.min(cursor.anchorOffset, (anchorNode.textContent ?? '').length);
      range.setStart(anchorNode, anchorOffset);
      range.setEnd(anchorNode, anchorOffset);
      const rect = range.getBoundingClientRect();
      entry.caret.style.top = `${rect.top}px`;
      entry.caret.style.left = `${rect.left}px`;
      entry.caret.style.height = `${rect.height || 16}px`;

      if (cursor.focusPath) {
        const focusNode = resolvePath(this.root, cursor.focusPath);
        if (focusNode) {
          const focusOffset = Math.min(cursor.focusOffset ?? 0, (focusNode.textContent ?? '').length);
          const selRange = document.createRange();
          selRange.setStart(anchorNode, anchorOffset);
          selRange.setEnd(focusNode, focusOffset);
          const selRect = selRange.getBoundingClientRect();
          entry.selectionBox.style.display = 'block';
          entry.selectionBox.style.top = `${selRect.top}px`;
          entry.selectionBox.style.left = `${selRect.left}px`;
          entry.selectionBox.style.width = `${selRect.width}px`;
          entry.selectionBox.style.height = `${selRect.height}px`;
        }
      } else {
        entry.selectionBox.style.display = 'none';
      }
    } catch {
      this.removeCursor(clientId);
    }
  }

  private removeCursor(clientId: number): void {
    const entry = this.caretElements.get(clientId);
    if (!entry) return;
    entry.caret.remove();
    entry.selectionBox.remove();
    this.caretElements.delete(clientId);
  }

  destroy(): void {
    document.removeEventListener('selectionchange', this.onSelectionChange);
    this.awareness.off('change', this.onAwarenessChange);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
    this.awareness.setLocalState(null);
    for (const clientId of Array.from(this.caretElements.keys())) this.removeCursor(clientId);
  }
}

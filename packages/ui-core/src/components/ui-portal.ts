import { ElementBase } from '../ElementBase';

type PortalStrategy = 'append' | 'prepend';

type PortaledNode = {
  node: Node;
  anchor: Comment;
};

const style = `
  :host {
    display: contents;
    color-scheme: light dark;
    --ui-portal-color: var(--ui-color-text, inherit);
    color: var(--ui-portal-color);
  }

  .source {
    display: contents;
  }

  :host([headless]) .source {
    display: block;
  }

  @media (prefers-reduced-motion: reduce) {
    .source {
      scroll-behavior: auto;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-portal-color: var(--ui-color-text, inherit);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-portal-color: CanvasText;
    }
  }
`;

function normalizeStrategy(raw: string | null): PortalStrategy {
  return raw === 'prepend' ? 'prepend' : 'append';
}

function isRenderableNode(node: Node): boolean {
  if (node.nodeType === Node.ELEMENT_NODE) return true;
  if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
  return false;
}

function canMountNode(node: Node): boolean {
  if (node.nodeType === Node.ELEMENT_NODE) return true;
  if (node.nodeType === Node.TEXT_NODE) return true;
  return false;
}

export class UIPortal extends ElementBase {
  static get observedAttributes() {
    return ['target', 'headless', 'strategy', 'disabled'];
  }

  private _headless = false;
  private _strategy: PortalStrategy = 'append';
  private _target: HTMLElement | null = null;
  private _slot: HTMLSlotElement | null = null;
  private _entries: PortaledNode[] = [];
  private _syncing = false;
  private _guardTimer: number | null = null;
  private _targetObserver: MutationObserver | null = null;

  constructor() {
    super();
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onTargetMutations = this._onTargetMutations.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._syncConfig();
    this._mountAllFromSlot();
  }

  override disconnectedCallback(): void {
    if (this._guardTimer != null) {
      window.clearTimeout(this._guardTimer);
      this._guardTimer = null;
    }
    if (this._slot) {
      this._slot.removeEventListener('slotchange', this._onSlotChange as EventListener);
      this._slot = null;
    }
    this._disconnectTargetObserver();
    this._restoreAll();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;
    this._syncConfig();
    if (this._headless) {
      this._restoreAll();
      return;
    }
    if (name === 'target' || name === 'strategy' || name === 'disabled' || name === 'headless') {
      this._moveAllToTarget();
    }
  }

  private _syncConfig(): void {
    this._headless = this.hasAttribute('headless') || this.hasAttribute('disabled');
    this._strategy = normalizeStrategy(this.getAttribute('strategy'));
    this._target = this._resolveTarget();
    this._connectTargetObserver();
  }

  private _resolveTarget(): HTMLElement {
    const selector = this.getAttribute('target');
    if (selector) {
      const resolved = document.querySelector(selector);
      if (resolved instanceof HTMLElement) return resolved;
      this.dispatchEvent(
        new CustomEvent('target-missing', {
          detail: { target: selector },
          bubbles: true
        })
      );
    }
    return document.body;
  }

  private _connectTargetObserver(): void {
    this._disconnectTargetObserver();
    if (!this._target || typeof MutationObserver === 'undefined') return;
    this._targetObserver = new MutationObserver(this._onTargetMutations);
    this._targetObserver.observe(this._target, { childList: true, subtree: true });
  }

  private _disconnectTargetObserver(): void {
    if (!this._targetObserver) return;
    this._targetObserver.disconnect();
    this._targetObserver = null;
  }

  private _onTargetMutations(): void {
    if (this._syncing) return;
    // If external code removes a node that we own, drop that entry safely.
    let changed = false;
    this._entries = this._entries.filter((entry) => {
      if (entry.node.isConnected) return true;
      try {
        if (entry.anchor.parentNode) entry.anchor.parentNode.removeChild(entry.anchor);
      } catch {
        // no-op
      }
      changed = true;
      return false;
    });
    if (changed) {
      this.dispatchEvent(new CustomEvent('sync', { detail: { count: this._entries.length }, bubbles: true }));
    }
  }

  private _beginSync(): void {
    this._syncing = true;
    if (this._guardTimer != null) window.clearTimeout(this._guardTimer);
    this._guardTimer = window.setTimeout(() => {
      this._syncing = false;
      this._guardTimer = null;
    }, 0);
  }

  private _findEntry(node: Node): PortaledNode | undefined {
    return this._entries.find((entry) => entry.node === node);
  }

  private _portalNode(node: Node): void {
    if (!this._target || this._headless || !canMountNode(node)) return;
    if (this._findEntry(node)) return;
    if (!this.contains(node)) return;

    const anchor = document.createComment('ui-portal-anchor');
    const parent = node.parentNode;
    if (!parent) return;

    this._beginSync();
    parent.insertBefore(anchor, node);
    if (this._strategy === 'prepend') {
      this._target.insertBefore(node, this._target.firstChild);
    } else {
      this._target.appendChild(node);
    }
    this._entries.push({ node, anchor });
  }

  private _restoreEntry(entry: PortaledNode): void {
    const { node, anchor } = entry;
    this._beginSync();
    if (anchor.parentNode) {
      anchor.parentNode.insertBefore(node, anchor);
      anchor.parentNode.removeChild(anchor);
    }
  }

  private _restoreAll(): void {
    if (!this._entries.length) return;
    const snapshot = [...this._entries];
    this._entries = [];
    snapshot.forEach((entry) => this._restoreEntry(entry));
    this.dispatchEvent(new CustomEvent('unmount', { detail: { count: snapshot.length }, bubbles: true }));
  }

  private _moveAllToTarget(): void {
    if (this._headless) {
      this._restoreAll();
      return;
    }
    const entries = [...this._entries];
    this._entries = [];
    entries.forEach((entry) => {
      const anchor = entry.anchor;
      const node = entry.node;
      if (anchor.parentNode) {
        this._beginSync();
        if (this._strategy === 'prepend') this._target!.insertBefore(node, this._target!.firstChild);
        else this._target!.appendChild(node);
        this._entries.push({ node, anchor });
      }
    });
    this.dispatchEvent(new CustomEvent('mount', { detail: { count: this._entries.length }, bubbles: true }));
  }

  private _mountAllFromSlot(): void {
    if (this._headless) return;
    const slot = this._slot || (this.root.querySelector('slot') as HTMLSlotElement | null);
    if (!slot) return;
    const assigned = slot.assignedNodes({ flatten: true }).filter((node) => isRenderableNode(node));
    assigned.forEach((node) => this._portalNode(node));
    if (assigned.length) {
      this.dispatchEvent(new CustomEvent('mount', { detail: { count: this._entries.length }, bubbles: true }));
    }
  }

  private _pruneDetachedEntries(): void {
    if (!this._entries.length) return;
    this._entries = this._entries.filter((entry) => {
      if (entry.node.isConnected) return true;
      try {
        if (entry.anchor.parentNode) entry.anchor.parentNode.removeChild(entry.anchor);
      } catch {
        // no-op
      }
      return false;
    });
  }

  private _onSlotChange(): void {
    if (this._syncing || this._headless) return;
    this._pruneDetachedEntries();
    this._mountAllFromSlot();
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="source" part="source">
        <slot></slot>
      </div>
    `);

    if (this._slot) {
      this._slot.removeEventListener('slotchange', this._onSlotChange as EventListener);
      this._slot = null;
    }
    const slot = this.root.querySelector('slot') as HTMLSlotElement | null;
    if (!slot) return;
    this._slot = slot;
    this._slot.addEventListener('slotchange', this._onSlotChange as EventListener);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-portal')) {
  customElements.define('ui-portal', UIPortal);
}

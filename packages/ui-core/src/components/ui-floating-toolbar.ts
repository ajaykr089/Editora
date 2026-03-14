import { ElementBase } from '../ElementBase';

type ToolbarPlacement = 'top' | 'bottom' | 'auto';
type ToolbarAlign = 'start' | 'center' | 'end';
type ToolbarCloseReason =
  | 'outside'
  | 'escape'
  | 'anchor-hidden'
  | 'anchor-missing'
  | 'programmatic'
  | 'disabled';

export type UIFloatingToolbarRequestCloseDetail = {
  reason: ToolbarCloseReason;
};

export type UIFloatingToolbarChangeDetail = {
  open: boolean;
  reason?: ToolbarCloseReason;
};

const style = `
  :host {
    position: fixed;
    inset: 0;
    z-index: var(--ui-floating-toolbar-z, 1300);
    pointer-events: none;
    display: none;
    color-scheme: light dark;

    --ui-floating-toolbar-bg: var(--ui-color-surface, #ffffff);
    --ui-floating-toolbar-color: var(--ui-color-text, #0f172a);
    --ui-floating-toolbar-muted: var(--ui-color-muted, #64748b);
    --ui-floating-toolbar-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-floating-toolbar-border: 1px solid var(--ui-floating-toolbar-border-color);
    --ui-floating-toolbar-radius: 12px;
    --ui-floating-toolbar-shadow:
      none;
    --ui-floating-toolbar-padding: 6px;
    --ui-floating-toolbar-gap: 6px;
    --ui-floating-toolbar-focus-ring: var(--ui-color-focus-ring, #2563eb);
    --ui-floating-toolbar-accent: var(--ui-color-primary, #2563eb);
    --ui-floating-toolbar-backdrop: none;
    --ui-floating-toolbar-x: 0px;
    --ui-floating-toolbar-y: 0px;
    --ui-floating-toolbar-enter-y: -4px;
    --ui-floating-toolbar-duration: 170ms;
    --ui-floating-toolbar-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  :host([open]) {
    display: block;
  }

  .panel {
    position: fixed;
    left: 0;
    top: 0;
    box-sizing: border-box;
    pointer-events: auto;
    min-inline-size: min(180px, calc(100vw - 16px));
    max-inline-size: min(560px, calc(100vw - 16px));
    border-radius: var(--ui-floating-toolbar-radius);
    border: var(--ui-floating-toolbar-border);
    background: var(--ui-floating-toolbar-bg);
    color: var(--ui-floating-toolbar-color);
    box-shadow: var(--ui-floating-toolbar-shadow);
    backdrop-filter: var(--ui-floating-toolbar-backdrop);
    padding: var(--ui-floating-toolbar-padding);
    display: grid;
    gap: var(--ui-floating-toolbar-gap);
    outline: none;
    transform:
      translate3d(
        var(--ui-floating-toolbar-x, 0px),
        calc(var(--ui-floating-toolbar-y, 0px) + var(--ui-floating-toolbar-enter-y, -4px)),
        0
      )
      scale(0.985);
    opacity: 0;
    transition:
      transform var(--ui-floating-toolbar-duration) var(--ui-floating-toolbar-easing),
      opacity var(--ui-floating-toolbar-duration) ease,
      border-color var(--ui-floating-toolbar-duration) var(--ui-floating-toolbar-easing),
      box-shadow var(--ui-floating-toolbar-duration) var(--ui-floating-toolbar-easing);
    transform-origin: var(--ui-floating-toolbar-origin-x, 50%) var(--ui-floating-toolbar-origin-y, 100%);
    will-change: transform, opacity;
  }

  :host([open]) .panel {
    opacity: 1;
    transform:
      translate3d(var(--ui-floating-toolbar-x, 0px), var(--ui-floating-toolbar-y, 0px), 0)
      scale(1);
  }

  .panel[data-side="bottom"] {
    --ui-floating-toolbar-enter-y: 4px;
    --ui-floating-toolbar-origin-y: 0%;
  }

  .row {
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ui-floating-toolbar-gap);
  }

  .row[hidden] {
    display: none;
  }

  ::slotted([slot="toolbar"]) {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--ui-floating-toolbar-gap);
    min-width: 0;
  }

  :host([shape="square"]) {
    --ui-floating-toolbar-radius: 6px;
  }

  :host([shape="soft"]) {
    --ui-floating-toolbar-radius: 18px;
  }

  :host([density="compact"]) {
    --ui-floating-toolbar-padding: 4px;
    --ui-floating-toolbar-gap: 4px;
  }

  :host([density="comfortable"]) {
    --ui-floating-toolbar-padding: 8px;
    --ui-floating-toolbar-gap: 8px;
  }

  :host([elevation="none"]) {
    --ui-floating-toolbar-shadow: none;
  }

  :host([elevation="low"]) {
    --ui-floating-toolbar-shadow:
      0 1px 4px rgba(2, 6, 23, 0.12),
      0 12px 26px rgba(2, 6, 23, 0.16);
  }

  :host([elevation="high"]) {
    --ui-floating-toolbar-shadow:
      0 4px 14px rgba(2, 6, 23, 0.18),
      0 26px 62px rgba(2, 6, 23, 0.26);
  }

  :host([variant="flat"]) {
    --ui-floating-toolbar-shadow: none;
    --ui-floating-toolbar-backdrop: none;
  }

  :host([variant="soft"]) {
    --ui-floating-toolbar-bg: color-mix(in srgb, var(--ui-floating-toolbar-accent) 8%, var(--ui-color-surface, #ffffff));
    --ui-floating-toolbar-border-color: color-mix(in srgb, var(--ui-floating-toolbar-accent) 30%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="glass"]) {
    --ui-floating-toolbar-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 74%, transparent);
    --ui-floating-toolbar-backdrop: blur(12px) saturate(1.08);
  }

  :host([variant="contrast"]) {
    --ui-floating-toolbar-bg: #0f172a;
    --ui-floating-toolbar-color: #f8fafc;
    --ui-floating-toolbar-muted: #93a4bd;
    --ui-floating-toolbar-border-color: #334155;
    --ui-floating-toolbar-focus-ring: #93c5fd;
  }

  :host([tone="success"]) {
    --ui-floating-toolbar-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-floating-toolbar-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-floating-toolbar-accent: var(--ui-color-danger, #dc2626);
  }

  :host([disabled]) .panel {
    opacity: 0.62;
    pointer-events: none;
  }

  :host([headless]) .panel {
    display: none !important;
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-floating-toolbar-border: 2px solid var(--ui-floating-toolbar-border-color);
      --ui-floating-toolbar-shadow: none;
      --ui-floating-toolbar-backdrop: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-floating-toolbar-bg: Canvas;
      --ui-floating-toolbar-color: CanvasText;
      --ui-floating-toolbar-muted: CanvasText;
      --ui-floating-toolbar-border-color: CanvasText;
      --ui-floating-toolbar-border: 1px solid CanvasText;
      --ui-floating-toolbar-shadow: none;
      --ui-floating-toolbar-focus-ring: Highlight;
    }

    .panel,
    ::slotted([slot="toolbar"]) {
      forced-color-adjust: none;
      border-color: CanvasText;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .panel {
      transition: none !important;
    }
  }
`;

function parseNumber(raw: string | null, fallback: number): number {
  if (raw == null || raw === '') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = raw.trim().toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isAnchorVisible(anchor: HTMLElement): boolean {
  if (!document.body.contains(anchor)) return false;
  const style = window.getComputedStyle(anchor);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  if (Number.parseFloat(style.opacity || '1') <= 0) return false;
  return anchor.getClientRects().length > 0;
}

function readPlacement(value: string | null): ToolbarPlacement {
  if (value === 'top' || value === 'bottom') return value;
  return 'auto';
}

function readAlign(value: string | null): ToolbarAlign {
  if (value === 'start' || value === 'end') return value;
  return 'center';
}

function uniqueFocusableFrom(nodes: Element[]): HTMLElement[] {
  const selector =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const list: HTMLElement[] = [];
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    if (node.matches(selector)) list.push(node);
    list.push(...Array.from(node.querySelectorAll<HTMLElement>(selector)));
  });
  return Array.from(new Set(list));
}

export class UIFloatingToolbar extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'anchor-id',
      'headless',
      'disabled',
      'placement',
      'align',
      'offset',
      'close-on-outside',
      'close-on-escape',
      'aria-label',
      'aria-labelledby',
      'variant',
      'density',
      'shape',
      'elevation',
      'tone'
    ];
  }

  private _anchor: HTMLElement | null = null;
  private _panel: HTMLElement | null = null;
  private _toolbarSlot: HTMLSlotElement | null = null;
  private _defaultSlot: HTMLSlotElement | null = null;
  private _raf: number | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _mutationObserver: MutationObserver | null = null;
  private _globalListenersBound = false;
  private _isOpen = false;
  private _closeReason: ToolbarCloseReason = 'programmatic';

  private _onWindowChangeBound = this._onWindowChange.bind(this);
  private _onDocumentPointerDownBound = this._onDocumentPointerDown.bind(this);
  private _onDocumentKeyDownBound = this._onDocumentKeyDown.bind(this);
  private _onPanelKeyDownBound = this._onPanelKeyDown.bind(this);
  private _onSlotChangeBound = this._onSlotChange.bind(this);

  override connectedCallback(): void {
    super.connectedCallback();
    this._syncAnchorFromAttribute();
    this._syncOpenState();
    this._schedulePosition();
  }

  override disconnectedCallback(): void {
    this._unbindGlobalListeners();
    this._teardownObservers();
    if (this._raf != null) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'anchor-id') {
      this._syncAnchorFromAttribute();
      if (this.hasAttribute('open') && !this._anchor) this._requestClose('anchor-missing');
      this._schedulePosition();
      return;
    }

    if (name === 'open') {
      this._syncOpenState();
      this._schedulePosition();
      return;
    }

    if (name === 'disabled') {
      if (this.hasAttribute('disabled') && this.hasAttribute('open')) this._requestClose('disabled');
      return;
    }

    if (name === 'headless') {
      this._syncOpenState();
      this._schedulePosition();
      return;
    }

    if (name === 'aria-label' || name === 'aria-labelledby') {
      this._syncPanelA11y();
      return;
    }

    if (name === 'placement' || name === 'align' || name === 'offset') {
      this._schedulePosition();
    }
  }

  showForAnchorId(anchorId: string): void {
    if (this.hasAttribute('disabled') || !anchorId) return;
    const anchor = document.getElementById(anchorId);
    if (!anchor) {
      this._requestClose('anchor-missing');
      return;
    }
    this._anchor = anchor;
    this.setAttribute('anchor-id', anchorId);
    this.openToolbar();
  }

  hide(): void {
    this.closeToolbar('programmatic');
  }

  openToolbar(): void {
    if (this.hasAttribute('disabled')) return;
    if (!this.hasAttribute('open')) this.setAttribute('open', '');
    this._schedulePosition();
  }

  closeToolbar(reason: ToolbarCloseReason = 'programmatic'): void {
    if (!this.hasAttribute('open')) return;
    this._closeReason = reason;
    this.removeAttribute('open');
  }

  private _syncOpenState(): void {
    const nextOpen = this.hasAttribute('open') && !this.hasAttribute('headless') && !this.hasAttribute('disabled');
    if (nextOpen === this._isOpen) {
      if (nextOpen) this._schedulePosition();
      return;
    }

    this._isOpen = nextOpen;
    if (nextOpen) {
      this._bindGlobalListeners();
      this._ensureObservers();
      this._dispatchOpenEvents();
      this._schedulePosition();
      return;
    }

    this._unbindGlobalListeners();
    this._teardownObservers();
    if (this._raf != null) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }

    this._dispatchCloseEvents(this._closeReason);
    this._closeReason = 'programmatic';
  }

  private _dispatchOpenEvents(): void {
    this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
    this.dispatchEvent(
      new CustomEvent<UIFloatingToolbarChangeDetail>('change', {
        bubbles: true,
        composed: true,
        detail: { open: true }
      })
    );
  }

  private _dispatchCloseEvents(reason: ToolbarCloseReason): void {
    this.dispatchEvent(
      new CustomEvent<{ reason: ToolbarCloseReason }>('close', {
        bubbles: true,
        composed: true,
        detail: { reason }
      })
    );
    this.dispatchEvent(
      new CustomEvent<UIFloatingToolbarChangeDetail>('change', {
        bubbles: true,
        composed: true,
        detail: { open: false, reason }
      })
    );
  }

  private _requestClose(reason: ToolbarCloseReason): void {
    if (!this.hasAttribute('open')) return;

    const req = new CustomEvent<UIFloatingToolbarRequestCloseDetail>('request-close', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    this.dispatchEvent(req);

    const uiReq = new CustomEvent<UIFloatingToolbarRequestCloseDetail>('ui-request-close', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    this.dispatchEvent(uiReq);

    if (req.defaultPrevented || uiReq.defaultPrevented) return;
    this.closeToolbar(reason);
  }

  private _syncAnchorFromAttribute(): void {
    const anchorId = this.getAttribute('anchor-id');
    if (!anchorId) {
      this._anchor = null;
      return;
    }
    this._anchor = document.getElementById(anchorId);
  }

  private _schedulePosition(): void {
    if (!this.hasAttribute('open') || this.hasAttribute('headless') || this.hasAttribute('disabled')) return;
    if (this._raf != null) cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => {
      this._raf = null;
      this._position();
    });
  }

  private _ensureObservers(): void {
    if (this._resizeObserver && this._mutationObserver) return;

    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => this._schedulePosition());
      if (this._panel) {
        try {
          this._resizeObserver.observe(this._panel);
        } catch {
          // no-op
        }
      }
      if (this._anchor) {
        try {
          this._resizeObserver.observe(this._anchor);
        } catch {
          // no-op
        }
      }
    }

    if (typeof MutationObserver !== 'undefined' && this._anchor) {
      this._mutationObserver = new MutationObserver(() => this._schedulePosition());
      try {
        this._mutationObserver.observe(this._anchor, { attributes: true, childList: false, subtree: false });
      } catch {
        // no-op
      }
    }
  }

  private _teardownObservers(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
    }
  }

  private _refreshObservers(): void {
    if (!this._isOpen) return;
    this._teardownObservers();
    this._ensureObservers();
  }

  private _bindGlobalListeners(): void {
    if (this._globalListenersBound) return;
    window.addEventListener('scroll', this._onWindowChangeBound, true);
    window.addEventListener('resize', this._onWindowChangeBound);
    document.addEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.addEventListener('keydown', this._onDocumentKeyDownBound, true);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners(): void {
    if (!this._globalListenersBound) return;
    window.removeEventListener('scroll', this._onWindowChangeBound, true);
    window.removeEventListener('resize', this._onWindowChangeBound);
    document.removeEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.removeEventListener('keydown', this._onDocumentKeyDownBound, true);
    this._globalListenersBound = false;
  }

  private _position(): void {
    if (!this.hasAttribute('open') || this.hasAttribute('headless') || this.hasAttribute('disabled')) return;
    if (!this._anchor) {
      this._requestClose('anchor-missing');
      return;
    }
    if (!isAnchorVisible(this._anchor)) {
      this._requestClose('anchor-hidden');
      return;
    }
    if (!this._panel) return;

    const anchorRect = this._anchor.getBoundingClientRect();
    const panelRect = this._panel.getBoundingClientRect();
    const viewportPadding = 8;
    const offset = Math.max(0, parseNumber(this.getAttribute('offset'), 8));
    const placement = readPlacement(this.getAttribute('placement'));
    const align = readAlign(this.getAttribute('align'));

    const spaceTop = anchorRect.top - viewportPadding;
    const spaceBottom = window.innerHeight - anchorRect.bottom - viewportPadding;
    const wantsBottom = placement === 'bottom';
    const shouldPlaceBottom = wantsBottom || (placement === 'auto' && spaceBottom > spaceTop && spaceTop < panelRect.height + offset);
    const side = shouldPlaceBottom ? 'bottom' : 'top';

    let y = shouldPlaceBottom ? anchorRect.bottom + offset : anchorRect.top - panelRect.height - offset;
    y = clamp(y, viewportPadding, window.innerHeight - panelRect.height - viewportPadding);

    let x = anchorRect.left + anchorRect.width / 2 - panelRect.width / 2;
    if (align === 'start') x = anchorRect.left;
    if (align === 'end') x = anchorRect.right - panelRect.width;
    x = clamp(x, viewportPadding, window.innerWidth - panelRect.width - viewportPadding);

    this.style.setProperty('--ui-floating-toolbar-x', `${Math.round(x)}px`);
    this.style.setProperty('--ui-floating-toolbar-y', `${Math.round(y)}px`);
    this.style.setProperty('--ui-floating-toolbar-origin-x', align === 'start' ? '0%' : align === 'end' ? '100%' : '50%');
    this._panel.setAttribute('data-side', side);
  }

  private _onWindowChange(): void {
    if (!this.hasAttribute('open')) return;
    this._schedulePosition();
  }

  private _onDocumentPointerDown(event: PointerEvent): void {
    if (!this.hasAttribute('open')) return;
    if (!toBool(this.getAttribute('close-on-outside'), true)) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    if (this._anchor && path.includes(this._anchor)) return;
    this._requestClose('outside');
  }

  private _onDocumentKeyDown(event: KeyboardEvent): void {
    if (!this.hasAttribute('open')) return;
    if (event.key !== 'Escape') return;
    if (!toBool(this.getAttribute('close-on-escape'), true)) return;
    event.preventDefault();
    this._requestClose('escape');
  }

  private _onPanelKeyDown(event: KeyboardEvent): void {
    if (!this._panel) return;
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;

    const focusables = this._getFocusableItems();
    if (focusables.length === 0) return;

    const active = document.activeElement as HTMLElement | null;
    const currentIndex = active ? focusables.indexOf(active) : -1;
    let nextIndex = currentIndex;

    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = focusables.length - 1;
    else if (event.key === 'ArrowRight') nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % focusables.length;
    else if (event.key === 'ArrowLeft') nextIndex = currentIndex < 0 ? focusables.length - 1 : (currentIndex - 1 + focusables.length) % focusables.length;

    const next = focusables[nextIndex];
    if (!next) return;
    event.preventDefault();
    next.focus();
  }

  private _getFocusableItems(): HTMLElement[] {
    const toolbarNodes = this._toolbarSlot?.assignedElements({ flatten: true }) || [];
    const defaultNodes = this._defaultSlot?.assignedElements({ flatten: true }) || [];
    return uniqueFocusableFrom([...toolbarNodes, ...defaultNodes]);
  }

  private _onSlotChange(): void {
    this._syncRowVisibility();
    this._schedulePosition();
  }

  private _syncRowVisibility(): void {
    const toolbarRow = this.root.querySelector('.row-toolbar') as HTMLElement | null;
    const defaultRow = this.root.querySelector('.row-default') as HTMLElement | null;
    if (!toolbarRow || !defaultRow) return;

    const hasToolbarItems = (this._toolbarSlot?.assignedNodes({ flatten: true }) || []).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
      return node.nodeType === Node.ELEMENT_NODE;
    });

    const hasDefaultItems = (this._defaultSlot?.assignedNodes({ flatten: true }) || []).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
      return node.nodeType === Node.ELEMENT_NODE;
    });

    if (hasToolbarItems) toolbarRow.removeAttribute('hidden');
    else toolbarRow.setAttribute('hidden', '');

    if (hasDefaultItems) defaultRow.removeAttribute('hidden');
    else defaultRow.setAttribute('hidden', '');
  }

  private _syncPanelA11y(): void {
    if (!this._panel) return;
    const labelledBy = this.getAttribute('aria-labelledby');
    const ariaLabel = this.getAttribute('aria-label') || (!labelledBy ? 'Floating toolbar' : null);

    if (labelledBy) this._panel.setAttribute('aria-labelledby', labelledBy);
    else this._panel.removeAttribute('aria-labelledby');

    if (ariaLabel) this._panel.setAttribute('aria-label', ariaLabel);
    else this._panel.removeAttribute('aria-label');
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <section class="panel" part="panel" role="toolbar" aria-orientation="horizontal" tabindex="-1">
        <div class="row row-toolbar" part="row-toolbar">
          <slot name="toolbar"></slot>
        </div>
        <div class="row row-default" part="row-default">
          <slot></slot>
        </div>
      </section>
    `);

    this._panel = this.root.querySelector('.panel') as HTMLElement | null;
    this._toolbarSlot = this.root.querySelector('slot[name="toolbar"]') as HTMLSlotElement | null;
    this._defaultSlot = this.root.querySelector('slot:not([name])') as HTMLSlotElement | null;

    this._panel?.removeEventListener('keydown', this._onPanelKeyDownBound as EventListener);
    this._panel?.addEventListener('keydown', this._onPanelKeyDownBound as EventListener);

    this._toolbarSlot?.removeEventListener('slotchange', this._onSlotChangeBound as EventListener);
    this._defaultSlot?.removeEventListener('slotchange', this._onSlotChangeBound as EventListener);
    this._toolbarSlot?.addEventListener('slotchange', this._onSlotChangeBound as EventListener);
    this._defaultSlot?.addEventListener('slotchange', this._onSlotChangeBound as EventListener);

    this._syncPanelA11y();
    this._syncRowVisibility();
    this._refreshObservers();
    this._schedulePosition();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-floating-toolbar')) {
  customElements.define('ui-floating-toolbar', UIFloatingToolbar);
}

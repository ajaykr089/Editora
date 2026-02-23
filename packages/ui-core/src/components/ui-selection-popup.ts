import { ElementBase } from '../ElementBase';

type PopupPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

const style = `
  :host {
    --ui-selection-popup-z: 1280;
    --ui-selection-popup-offset: 10px;
    --ui-selection-popup-radius: 12px;
    --ui-selection-popup-padding: 8px;
    --ui-selection-popup-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-selection-popup-color: var(--ui-color-text, #0f172a);
    --ui-selection-popup-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-selection-popup-border: 1px solid var(--ui-selection-popup-border-color);
    --ui-selection-popup-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-selection-popup-accent: var(--ui-color-primary, #2563eb);
    --ui-selection-popup-shadow:
      0 12px 30px rgba(2, 6, 23, 0.16),
      0 32px 58px rgba(2, 6, 23, 0.14);
    color-scheme: light dark;
    position: fixed;
    inset: 0;
    display: none;
    pointer-events: none;
    z-index: var(--ui-selection-popup-z);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  :host([open]) {
    display: block;
  }

  .popup {
    position: fixed;
    left: 0;
    top: 0;
    pointer-events: auto;
    min-inline-size: min(180px, calc(100vw - 16px));
    max-inline-size: min(420px, calc(100vw - 16px));
    border: var(--ui-selection-popup-border);
    border-radius: var(--ui-selection-popup-radius);
    background: var(--ui-selection-popup-bg);
    color: var(--ui-selection-popup-color);
    box-shadow: var(--ui-selection-popup-shadow);
    padding: var(--ui-selection-popup-padding);
    transform:
      translate3d(var(--ui-selection-popup-x, 0px), var(--ui-selection-popup-y, 0px), 0)
      scale(0.96);
    transform-origin: var(--ui-selection-popup-origin-x, 50%) var(--ui-selection-popup-origin-y, 50%);
    opacity: 0;
    transition: transform 150ms cubic-bezier(0.2, 0.72, 0.2, 1), opacity 140ms ease;
    backdrop-filter: saturate(1.08) blur(12px);
  }

  :host([open]) .popup {
    opacity: 1;
    transform:
      translate3d(var(--ui-selection-popup-x, 0px), var(--ui-selection-popup-y, 0px), 0)
      scale(1);
  }

  .content {
    display: grid;
    gap: 6px;
  }

  .arrow {
    position: absolute;
    inline-size: 10px;
    block-size: 10px;
    background: inherit;
    border-left: var(--ui-selection-popup-border);
    border-top: var(--ui-selection-popup-border);
    display: none;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  :host([arrow]) .arrow {
    display: block;
  }

  .popup[data-placement="top"] .arrow {
    left: var(--ui-selection-popup-arrow-x, 50%);
    top: calc(100% - 1px);
    transform: translate(-50%, -50%) rotate(225deg);
  }

  .popup[data-placement="bottom"] .arrow {
    left: var(--ui-selection-popup-arrow-x, 50%);
    top: 0;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .popup[data-placement="left"] .arrow {
    left: calc(100% - 1px);
    top: var(--ui-selection-popup-arrow-y, 50%);
    transform: translate(-50%, -50%) rotate(135deg);
  }

  .popup[data-placement="right"] .arrow {
    left: 0;
    top: var(--ui-selection-popup-arrow-y, 50%);
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  :host([strategy="absolute"]) .popup {
    position: absolute;
  }

  :host([size="sm"]) {
    --ui-selection-popup-padding: 6px;
    --ui-selection-popup-radius: 10px;
  }

  :host([size="lg"]) {
    --ui-selection-popup-padding: 10px;
    --ui-selection-popup-radius: 14px;
  }

  :host([variant="surface"]) {
    --ui-selection-popup-bg: var(--ui-color-surface, #ffffff);
    --ui-selection-popup-shadow:
      0 8px 20px rgba(2, 6, 23, 0.14),
      0 20px 42px rgba(2, 6, 23, 0.1);
  }

  :host([variant="soft"]) {
    --ui-selection-popup-bg: color-mix(in srgb, var(--ui-selection-popup-accent) 10%, var(--ui-color-surface, #ffffff));
    --ui-selection-popup-border-color: color-mix(in srgb, var(--ui-selection-popup-accent) 28%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="glass"]) {
    --ui-selection-popup-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 70%, transparent);
    --ui-selection-popup-shadow:
      0 14px 36px rgba(2, 6, 23, 0.2),
      0 34px 62px rgba(2, 6, 23, 0.16);
  }

  :host([variant="contrast"]) {
    --ui-selection-popup-bg: #0f172a;
    --ui-selection-popup-color: #e2e8f0;
    --ui-selection-popup-border-color: #334155;
    --ui-selection-popup-focus: #93c5fd;
    --ui-selection-popup-shadow:
      0 16px 42px rgba(2, 6, 23, 0.42),
      0 34px 72px rgba(2, 6, 23, 0.38);
  }

  :host([tone="success"]) {
    --ui-selection-popup-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-selection-popup-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-selection-popup-accent: var(--ui-color-danger, #dc2626);
  }

  :host([radius="none"]) {
    --ui-selection-popup-radius: 0px;
  }

  :host([radius="large"]) {
    --ui-selection-popup-radius: 18px;
  }

  :host([radius="full"]) {
    --ui-selection-popup-radius: 999px;
  }

  :host([headless]) .popup {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .popup {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-selection-popup-border: 2px solid var(--ui-selection-popup-border-color);
      --ui-selection-popup-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-selection-popup-bg: Canvas;
      --ui-selection-popup-color: CanvasText;
      --ui-selection-popup-border-color: CanvasText;
      --ui-selection-popup-focus: Highlight;
      --ui-selection-popup-shadow: none;
    }
  }
`;

function parseNumber(raw: string | null, fallback: number): number {
  if (raw == null || raw === '') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isTruthyAttr(raw: string | null, fallback = false): boolean {
  if (raw == null) return fallback;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export class UISelectionPopup extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'anchor-id',
      'headless',
      'placement',
      'offset',
      'strategy',
      'arrow',
      'variant',
      'tone',
      'radius',
      'size',
      'close-on-outside',
      'close-on-escape'
    ];
  }

  private _anchor: HTMLElement | null = null;
  private _popup: HTMLElement | null = null;
  private _raf: number | null = null;
  private _previousFocused: HTMLElement | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _mutationObserver: MutationObserver | null = null;
  private _globalListenersBound = false;

  constructor() {
    super();
    this._onDocumentPointerDown = this._onDocumentPointerDown.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onWindowChange = this._onWindowChange.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);

    this._syncAnchorFromAttribute();
    this._syncOpenLifecycle(false);
    this._schedulePosition();
  }

  override disconnectedCallback(): void {
    this._unbindGlobalListeners();
    this._teardownObservers();
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);

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
    }

    if (name === 'open') {
      this._syncOpenLifecycle(oldValue != null);
      this.dispatchEvent(
        new CustomEvent(newValue != null ? 'open' : 'close', {
          bubbles: true,
          composed: true
        })
      );
    }

    if (this.isConnected) this.requestRender();
    this._schedulePosition();
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(next: boolean) {
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  openFor(anchorId: string): void {
    if (!anchorId) return;
    const anchor = document.getElementById(anchorId);
    if (!anchor) return;
    this._anchor = anchor;
    this.setAttribute('anchor-id', anchorId);
    this.setAttribute('open', '');
    this._schedulePosition();
  }

  close(): void {
    this.removeAttribute('open');
  }

  private _syncAnchorFromAttribute(): void {
    const anchorId = this.getAttribute('anchor-id');
    if (!anchorId) {
      this._anchor = null;
      return;
    }
    this._anchor = document.getElementById(anchorId);
  }

  private _syncOpenLifecycle(wasOpen: boolean): void {
    const isOpen = this.open;
    if (!wasOpen && isOpen) {
      this._previousFocused = (document.activeElement as HTMLElement | null) || null;
      this._bindGlobalListeners();
      this._ensureObservers();
      this._schedulePosition();
    }
    if (wasOpen && !isOpen) {
      this._unbindGlobalListeners();
      this._teardownObservers();
      if (this._raf != null) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }
      const restore = this._anchor || this._previousFocused;
      if (restore && typeof restore.focus === 'function') {
        try {
          restore.focus({ preventScroll: true });
        } catch {
          restore.focus();
        }
      }
      this._previousFocused = null;
    }
  }

  private _onWindowChange(): void {
    if (!this.open) return;
    this._schedulePosition();
  }

  private _onSlotChange(): void {
    if (!this.open) return;
    this._schedulePosition();
  }

  private _onDocumentPointerDown(event: PointerEvent): void {
    if (!this.open) return;
    if (!isTruthyAttr(this.getAttribute('close-on-outside'), true)) return;

    const path = event.composedPath();
    if (path.includes(this)) return;
    if (this._anchor && path.includes(this._anchor)) return;
    this.close();
  }

  private _onDocumentKeyDown(event: KeyboardEvent): void {
    if (!this.open) return;
    if (!isTruthyAttr(this.getAttribute('close-on-escape'), true)) return;
    if (event.key !== 'Escape') return;
    event.stopPropagation();
    this.close();
  }

  private _schedulePosition(): void {
    if (!this.open) return;
    if (this._raf != null) cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => {
      this._raf = null;
      this._position();
    });
  }

  private _bindGlobalListeners(): void {
    if (this._globalListenersBound) return;
    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.addEventListener('keydown', this._onDocumentKeyDown, true);
    window.addEventListener('scroll', this._onWindowChange, true);
    window.addEventListener('resize', this._onWindowChange);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners(): void {
    if (!this._globalListenersBound) return;
    document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.removeEventListener('keydown', this._onDocumentKeyDown, true);
    window.removeEventListener('scroll', this._onWindowChange, true);
    window.removeEventListener('resize', this._onWindowChange);
    this._globalListenersBound = false;
  }

  private _ensureObservers(): void {
    if (this._resizeObserver == null && typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => this._schedulePosition());
      this._resizeObserver.observe(this);
    }

    if (this._mutationObserver == null && typeof MutationObserver !== 'undefined') {
      this._mutationObserver = new MutationObserver(() => this._schedulePosition());
      this._mutationObserver.observe(this, { childList: true, subtree: true, characterData: true });
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

  private _candidateFor(
    placement: Exclude<PopupPlacement, 'auto'>,
    anchorRect: DOMRect,
    popupRect: DOMRect,
    offset: number
  ): { placement: Exclude<PopupPlacement, 'auto'>; x: number; y: number } {
    if (placement === 'top') {
      return {
        placement,
        x: anchorRect.left + anchorRect.width / 2 - popupRect.width / 2,
        y: anchorRect.top - popupRect.height - offset
      };
    }

    if (placement === 'bottom') {
      return {
        placement,
        x: anchorRect.left + anchorRect.width / 2 - popupRect.width / 2,
        y: anchorRect.bottom + offset
      };
    }

    if (placement === 'left') {
      return {
        placement,
        x: anchorRect.left - popupRect.width - offset,
        y: anchorRect.top + anchorRect.height / 2 - popupRect.height / 2
      };
    }

    return {
      placement,
      x: anchorRect.right + offset,
      y: anchorRect.top + anchorRect.height / 2 - popupRect.height / 2
    };
  }

  private _overflowScore(x: number, y: number, width: number, height: number, viewportPadding: number): number {
    const maxX = window.innerWidth - viewportPadding;
    const maxY = window.innerHeight - viewportPadding;
    const right = x + width;
    const bottom = y + height;

    const overflowLeft = Math.max(0, viewportPadding - x);
    const overflowTop = Math.max(0, viewportPadding - y);
    const overflowRight = Math.max(0, right - maxX);
    const overflowBottom = Math.max(0, bottom - maxY);

    return overflowLeft + overflowTop + overflowRight + overflowBottom;
  }

  private _position(): void {
    const popup = this._popup;
    if (!popup || !this.open || !this._anchor) return;
    if (!document.body.contains(this._anchor)) {
      this.close();
      return;
    }

    const anchorRect = this._anchor.getBoundingClientRect();
    if (anchorRect.width === 0 && anchorRect.height === 0) return;

    const popupRect = popup.getBoundingClientRect();
    if (popupRect.width === 0 || popupRect.height === 0) return;

    const preferred = (this.getAttribute('placement') || 'top') as PopupPlacement;
    const offset = parseNumber(this.getAttribute('offset'), 10);
    const viewportPadding = 8;

    const orderedPlacements: Array<Exclude<PopupPlacement, 'auto'>> = [];
    const pushPlacement = (p: Exclude<PopupPlacement, 'auto'>) => {
      if (!orderedPlacements.includes(p)) orderedPlacements.push(p);
    };

    if (preferred === 'auto') {
      pushPlacement('top');
      pushPlacement('bottom');
      pushPlacement('right');
      pushPlacement('left');
    } else {
      pushPlacement(preferred as Exclude<PopupPlacement, 'auto'>);
      const opposite: Record<Exclude<PopupPlacement, 'auto'>, Exclude<PopupPlacement, 'auto'>> = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      };
      pushPlacement(opposite[preferred as Exclude<PopupPlacement, 'auto'>]);
      pushPlacement('top');
      pushPlacement('bottom');
      pushPlacement('right');
      pushPlacement('left');
    }

    let best = this._candidateFor(orderedPlacements[0], anchorRect, popupRect, offset);
    let bestScore = this._overflowScore(best.x, best.y, popupRect.width, popupRect.height, viewportPadding);

    for (const placement of orderedPlacements) {
      const candidate = this._candidateFor(placement, anchorRect, popupRect, offset);
      const score = this._overflowScore(candidate.x, candidate.y, popupRect.width, popupRect.height, viewportPadding);
      if (score < bestScore) {
        best = candidate;
        bestScore = score;
        if (score === 0) break;
      }
    }

    const maxX = Math.max(viewportPadding, window.innerWidth - popupRect.width - viewportPadding);
    const maxY = Math.max(viewportPadding, window.innerHeight - popupRect.height - viewportPadding);
    let x = clamp(best.x, viewportPadding, maxX);
    let y = clamp(best.y, viewportPadding, maxY);

    const absoluteStrategy = (this.getAttribute('strategy') || 'fixed') === 'absolute';
    if (absoluteStrategy) {
      x += window.scrollX || 0;
      y += window.scrollY || 0;
    }

    popup.style.setProperty('--ui-selection-popup-x', `${Math.round(x)}px`);
    popup.style.setProperty('--ui-selection-popup-y', `${Math.round(y)}px`);
    popup.dataset.placement = best.placement;

    const anchorCenterX = anchorRect.left + anchorRect.width / 2;
    const anchorCenterY = anchorRect.top + anchorRect.height / 2;
    const popupViewportX = absoluteStrategy ? x - (window.scrollX || 0) : x;
    const popupViewportY = absoluteStrategy ? y - (window.scrollY || 0) : y;
    const arrowX = clamp(anchorCenterX - popupViewportX, 12, popupRect.width - 12);
    const arrowY = clamp(anchorCenterY - popupViewportY, 12, popupRect.height - 12);
    popup.style.setProperty('--ui-selection-popup-arrow-x', `${Math.round(arrowX)}px`);
    popup.style.setProperty('--ui-selection-popup-arrow-y', `${Math.round(arrowY)}px`);

    const originX = best.placement === 'left' ? '100%' : best.placement === 'right' ? '0%' : `${Math.round(arrowX)}px`;
    const originY = best.placement === 'top' ? '100%' : best.placement === 'bottom' ? '0%' : `${Math.round(arrowY)}px`;
    popup.style.setProperty('--ui-selection-popup-origin-x', originX);
    popup.style.setProperty('--ui-selection-popup-origin-y', originY);
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="popup" part="popup" role="dialog" aria-label="Selection popup">
        <span class="arrow" part="arrow" aria-hidden="true"></span>
        <div class="content" part="content">
          <slot name="content"></slot>
          <slot></slot>
        </div>
      </div>
    `);

    this._popup = this.root.querySelector('.popup') as HTMLElement | null;
    this._schedulePosition();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-selection-popup')) {
  customElements.define('ui-selection-popup', UISelectionPopup);
}

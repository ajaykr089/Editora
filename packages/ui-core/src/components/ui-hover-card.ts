import { ElementBase } from '../ElementBase';

type HoverCardPlacement = 'top' | 'bottom' | 'left' | 'right';

const style = `
  :host {
    --ui-hover-card-z: 1700;
    --ui-hover-card-radius: 14px;
    --ui-hover-card-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-hover-card-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-hover-card-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-hover-card-border: 1px solid var(--ui-hover-card-border-color);
    --ui-hover-card-shadow:
      0 2px 8px rgba(2, 6, 23, 0.08),
      0 26px 54px rgba(2, 6, 23, 0.18);
    --ui-hover-card-padding: 12px;
    --ui-hover-card-min-width: 220px;
    --ui-hover-card-max-width: min(380px, calc(100vw - 16px));
    --ui-hover-card-backdrop: none;
    --ui-hover-card-arrow-size: 10px;
    --ui-hover-card-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-hover-card-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    color-scheme: light dark;
    position: relative;
    display: inline-flex;
    width: fit-content;
    min-width: 0;
  }

  .anchor {
    display: inline-flex;
    min-width: 0;
  }

  .panel {
    position: fixed;
    left: 0;
    top: 0;
    width: max-content;
    min-width: var(--ui-hover-card-min-width);
    max-width: var(--ui-hover-card-max-width);
    box-sizing: border-box;
    border-radius: var(--ui-hover-card-radius);
    border: var(--ui-hover-card-border);
    background: var(--ui-hover-card-bg);
    color: var(--ui-hover-card-color);
    box-shadow: var(--ui-hover-card-shadow);
    backdrop-filter: var(--ui-hover-card-backdrop);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(6px) scale(0.985);
    transform-origin: top center;
    transition:
      opacity 170ms cubic-bezier(0.2, 0.9, 0.24, 1),
      transform 170ms cubic-bezier(0.2, 0.9, 0.24, 1),
      visibility 170ms ease;
    z-index: var(--ui-hover-card-z);
    overflow: visible;
    isolation: isolate;
  }

  :host([open]) .panel[data-ready="true"] {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0) scale(1);
  }

  .panel[data-placement="top"] {
    transform-origin: bottom center;
  }

  .panel[data-placement="left"] {
    transform-origin: center right;
  }

  .panel[data-placement="right"] {
    transform-origin: center left;
  }

  .panel-body {
    position: relative;
    z-index: 1;
    min-width: 0;
    padding: var(--ui-hover-card-padding);
    display: grid;
    gap: 8px;
    font: 500 13px/1.45 "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
  }

  .arrow {
    position: absolute;
    width: var(--ui-hover-card-arrow-size);
    height: var(--ui-hover-card-arrow-size);
    background: var(--ui-hover-card-bg);
    border: var(--ui-hover-card-border);
    transform: rotate(45deg);
    pointer-events: none;
  }

  .panel[data-placement="bottom"] .arrow {
    left: calc(var(--ui-hover-card-arrow-x, 24px) - (var(--ui-hover-card-arrow-size) / 2));
    top: calc(var(--ui-hover-card-arrow-size) * -0.56);
    border-right: none;
    border-bottom: none;
  }

  .panel[data-placement="top"] .arrow {
    left: calc(var(--ui-hover-card-arrow-x, 24px) - (var(--ui-hover-card-arrow-size) / 2));
    bottom: calc(var(--ui-hover-card-arrow-size) * -0.56);
    border-left: none;
    border-top: none;
  }

  .panel[data-placement="right"] .arrow {
    top: calc(var(--ui-hover-card-arrow-y, 24px) - (var(--ui-hover-card-arrow-size) / 2));
    left: calc(var(--ui-hover-card-arrow-size) * -0.56);
    border-right: none;
    border-top: none;
  }

  .panel[data-placement="left"] .arrow {
    top: calc(var(--ui-hover-card-arrow-y, 24px) - (var(--ui-hover-card-arrow-size) / 2));
    right: calc(var(--ui-hover-card-arrow-size) * -0.56);
    border-left: none;
    border-bottom: none;
  }

  :host([variant="line"]) {
    --ui-hover-card-shadow: none;
  }

  :host([variant="line"]) .panel {
    border-color: color-mix(in srgb, var(--ui-hover-card-accent) 26%, var(--ui-hover-card-border-color));
  }

  :host([variant="glass"]) {
    --ui-hover-card-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 86%, #ffffff 14%),
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, transparent)
      ),
      var(--ui-color-surface, #ffffff);
    --ui-hover-card-backdrop: blur(12px) saturate(1.08);
  }

  :host([variant="contrast"]) {
    --ui-hover-card-bg: #0f172a;
    --ui-hover-card-color: #e2e8f0;
    --ui-hover-card-border-color: #334155;
    --ui-hover-card-focus-ring: #93c5fd;
    --ui-hover-card-shadow:
      0 2px 8px rgba(2, 6, 23, 0.24),
      0 30px 62px rgba(2, 6, 23, 0.4);
  }

  :host([variant="contrast"]) .arrow {
    background: #0f172a;
    border-color: #334155;
  }

  :host([variant="minimal"]) {
    --ui-hover-card-shadow: none;
    --ui-hover-card-border-color: color-mix(in srgb, var(--ui-hover-card-accent) 20%, var(--ui-color-border, #cbd5e1));
    --ui-hover-card-padding: 10px;
  }

  :host([variant="elevated"]) {
    --ui-hover-card-bg: linear-gradient(
      160deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, #ffffff 8%),
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 99%, transparent)
    );
    --ui-hover-card-shadow:
      0 2px 10px rgba(2, 6, 23, 0.12),
      0 34px 72px rgba(2, 6, 23, 0.22);
  }

  :host([tone="success"]) {
    --ui-hover-card-accent: #16a34a;
  }

  :host([tone="warning"]) {
    --ui-hover-card-accent: #d97706;
  }

  :host([tone="danger"]) {
    --ui-hover-card-accent: #dc2626;
  }

  :host([density="compact"]) {
    --ui-hover-card-padding: 9px;
  }

  :host([density="compact"]) .panel-body {
    font-size: 12px;
    gap: 6px;
  }

  :host([density="comfortable"]) {
    --ui-hover-card-padding: 15px;
  }

  :host([density="comfortable"]) .panel-body {
    font-size: 14px;
    gap: 10px;
  }

  :host([shape="square"]) {
    --ui-hover-card-radius: 4px;
  }

  :host([shape="soft"]) {
    --ui-hover-card-radius: 20px;
  }

  :host([elevation="none"]) {
    --ui-hover-card-shadow: none;
  }

  :host([elevation="low"]) {
    --ui-hover-card-shadow:
      0 1px 3px rgba(2, 6, 23, 0.06),
      0 16px 30px rgba(2, 6, 23, 0.11);
  }

  :host([elevation="high"]) {
    --ui-hover-card-shadow:
      0 2px 10px rgba(2, 6, 23, 0.1),
      0 36px 74px rgba(2, 6, 23, 0.24);
  }

  :host([headless]) .panel {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .panel {
      transition: none !important;
      transform: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-hover-card-border: 2px solid var(--ui-hover-card-border-color);
      --ui-hover-card-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-hover-card-bg: Canvas;
      --ui-hover-card-color: CanvasText;
      --ui-hover-card-border-color: CanvasText;
      --ui-hover-card-shadow: none;
      --ui-hover-card-backdrop: none;
    }

    .panel,
    .arrow {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
    }
  }
`;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizePlacement(value: string | null): HoverCardPlacement {
  if (value === 'top' || value === 'left' || value === 'right') return value;
  return 'bottom';
}

export class UIHoverCard extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'headless',
      'delay',
      'close-delay',
      'placement',
      'offset',
      'variant',
      'tone',
      'density',
      'shape',
      'elevation'
    ];
  }

  private _openTimer: number | null = null;
  private _closeTimer: number | null = null;
  private _positionRaf: number | null = null;
  private _isOpen = false;
  private _globalListenersBound = false;

  constructor() {
    super();
    this._onPointerEnter = this._onPointerEnter.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onFocusOut = this._onFocusOut.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onDocumentPointerDown = this._onDocumentPointerDown.bind(this);
    this._onViewportChange = this._onViewportChange.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('pointerenter', this._onPointerEnter);
    this.addEventListener('pointerleave', this._onPointerLeave);
    this.addEventListener('focusin', this._onFocusIn);
    this.addEventListener('focusout', this._onFocusOut);
    this.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);
    this._syncOpenState();
  }

  override disconnectedCallback(): void {
    this.removeEventListener('pointerenter', this._onPointerEnter);
    this.removeEventListener('pointerleave', this._onPointerLeave);
    this.removeEventListener('focusin', this._onFocusIn);
    this.removeEventListener('focusout', this._onFocusOut);
    this.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._unbindGlobalListeners();
    this._clearTimers();
    if (this._positionRaf != null) {
      cancelAnimationFrame(this._positionRaf);
      this._positionRaf = null;
    }
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'open' || name === 'headless') {
      this._syncOpenState();
      return;
    }

    if (this._isOpen && (name === 'placement' || name === 'offset' || name === 'density' || name === 'shape')) {
      this._schedulePosition();
    }
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(value: boolean) {
    if (value) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  get delay(): number {
    const value = Number(this.getAttribute('delay'));
    return Number.isFinite(value) && value >= 0 ? value : 120;
  }

  set delay(value: number) {
    this.setAttribute('delay', String(value));
  }

  get closeDelay(): number {
    const value = Number(this.getAttribute('close-delay'));
    if (Number.isFinite(value) && value >= 0) return value;
    return this.delay;
  }

  set closeDelay(value: number) {
    this.setAttribute('close-delay', String(value));
  }

  private _onSlotChange(): void {
    if (this._isOpen) this._schedulePosition();
  }

  private _getPanel(): HTMLElement | null {
    return this.root.querySelector('.panel') as HTMLElement | null;
  }

  private _getAnchor(): HTMLElement {
    const slottedTrigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
    if (slottedTrigger) return slottedTrigger;

    const defaultTrigger = Array.from(this.children).find((node) => {
      if (!(node instanceof HTMLElement)) return false;
      return !node.hasAttribute('slot') || node.getAttribute('slot') === 'trigger';
    }) as HTMLElement | undefined;

    return defaultTrigger || this;
  }

  private _isNodeWithinComponent(node: Node | null): boolean {
    if (!node) return false;
    if (node === this) return true;
    if (this.contains(node)) return true;
    if (this.root.contains(node)) return true;
    return false;
  }

  private _clearTimers(): void {
    if (this._openTimer != null) {
      window.clearTimeout(this._openTimer);
      this._openTimer = null;
    }

    if (this._closeTimer != null) {
      window.clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  private _scheduleOpen(delay: number): void {
    this._clearTimers();
    this._openTimer = window.setTimeout(() => {
      this._openTimer = null;
      this.open = true;
    }, Math.max(0, delay));
  }

  private _scheduleClose(delay: number): void {
    this._clearTimers();
    this._closeTimer = window.setTimeout(() => {
      this._closeTimer = null;
      this.open = false;
    }, Math.max(0, delay));
  }

  private _onPointerEnter(): void {
    if (this.hasAttribute('headless')) return;
    if (this._isOpen) {
      this._clearTimers();
      return;
    }
    this._scheduleOpen(this.delay);
  }

  private _onPointerLeave(event: PointerEvent): void {
    const next = event.relatedTarget as Node | null;
    if (this._isNodeWithinComponent(next)) return;
    this._scheduleClose(this.closeDelay);
  }

  private _onFocusIn(): void {
    if (this.hasAttribute('headless')) return;
    this._clearTimers();
    this.open = true;
  }

  private _onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (this._isNodeWithinComponent(next)) return;
    this._scheduleClose(this.closeDelay);
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (!this._isOpen || event.key !== 'Escape') return;

    event.preventDefault();
    this.open = false;

    const anchor = this._getAnchor();
    try {
      anchor.focus();
    } catch {
      // no-op
    }
  }

  private _onDocumentPointerDown(event: PointerEvent): void {
    if (!this._isOpen) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    this.open = false;
  }

  private _onViewportChange(): void {
    if (!this._isOpen) return;
    this._schedulePosition();
  }

  private _syncOpenState(): void {
    const nowOpen = this.hasAttribute('open') && !this.hasAttribute('headless');

    if (nowOpen === this._isOpen) {
      this._syncPanelA11y();
      if (nowOpen) {
        this._bindGlobalListeners();
        this._schedulePosition();
      } else {
        this._unbindGlobalListeners();
      }
      return;
    }

    this._isOpen = nowOpen;
    this._syncPanelA11y();
    const panel = this._getPanel();

    if (nowOpen) {
      this._bindGlobalListeners();
      if (panel) panel.setAttribute('data-ready', 'false');
      this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
      this.dispatchEvent(new CustomEvent('show', { bubbles: true }));
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { open: true } }));
      this._schedulePosition();
      return;
    }

    this._unbindGlobalListeners();
    this._clearTimers();
    if (this._positionRaf != null) {
      cancelAnimationFrame(this._positionRaf);
      this._positionRaf = null;
    }

    if (panel) panel.setAttribute('data-ready', 'false');

    this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    this.dispatchEvent(new CustomEvent('hide', { bubbles: true }));
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { open: false } }));
  }

  private _syncPanelA11y(): void {
    const panel = this._getPanel();
    if (!panel) return;
    panel.setAttribute('aria-hidden', this._isOpen ? 'false' : 'true');
    if (!this._isOpen) panel.setAttribute('data-ready', 'false');
  }

  private _bindGlobalListeners(): void {
    if (this._globalListenersBound) return;
    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    window.addEventListener('resize', this._onViewportChange);
    window.addEventListener('scroll', this._onViewportChange, true);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners(): void {
    if (!this._globalListenersBound) return;
    document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    window.removeEventListener('resize', this._onViewportChange);
    window.removeEventListener('scroll', this._onViewportChange, true);
    this._globalListenersBound = false;
  }

  private _schedulePosition(): void {
    if (!this._isOpen) return;
    if (this._positionRaf != null) cancelAnimationFrame(this._positionRaf);
    this._positionRaf = requestAnimationFrame(() => {
      this._positionRaf = null;
      this._positionPanel();
    });
  }

  private _positionPanel(): void {
    const panel = this._getPanel();
    if (!panel || !this._isOpen) return;

    const anchor = this._getAnchor();
    if (!anchor || !anchor.isConnected) {
      this.open = false;
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    if (anchorRect.width === 0 && anchorRect.height === 0) {
      this.open = false;
      return;
    }

    const panelRect = panel.getBoundingClientRect();
    const width = panelRect.width || panel.offsetWidth || 220;
    const height = panelRect.height || panel.offsetHeight || 80;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edgeGap = 8;
    const rawOffset = Number(this.getAttribute('offset'));
    const offset = Number.isFinite(rawOffset) ? rawOffset : 10;

    let placement = normalizePlacement(this.getAttribute('placement'));

    const fitsTop = anchorRect.top - offset - height >= edgeGap;
    const fitsBottom = anchorRect.bottom + offset + height <= viewportHeight - edgeGap;
    const fitsLeft = anchorRect.left - offset - width >= edgeGap;
    const fitsRight = anchorRect.right + offset + width <= viewportWidth - edgeGap;

    if (placement === 'top' && !fitsTop && fitsBottom) placement = 'bottom';
    if (placement === 'bottom' && !fitsBottom && fitsTop) placement = 'top';
    if (placement === 'left' && !fitsLeft && fitsRight) placement = 'right';
    if (placement === 'right' && !fitsRight && fitsLeft) placement = 'left';

    let left = 0;
    let top = 0;

    if (placement === 'top') {
      left = anchorRect.left + (anchorRect.width - width) / 2;
      top = anchorRect.top - height - offset;
    } else if (placement === 'bottom') {
      left = anchorRect.left + (anchorRect.width - width) / 2;
      top = anchorRect.bottom + offset;
    } else if (placement === 'left') {
      left = anchorRect.left - width - offset;
      top = anchorRect.top + (anchorRect.height - height) / 2;
    } else {
      left = anchorRect.right + offset;
      top = anchorRect.top + (anchorRect.height - height) / 2;
    }

    left = clamp(left, edgeGap, viewportWidth - width - edgeGap);
    top = clamp(top, edgeGap, viewportHeight - height - edgeGap);

    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
    panel.setAttribute('data-placement', placement);

    const arrowX = clamp(anchorRect.left + anchorRect.width / 2 - left, 14, width - 14);
    const arrowY = clamp(anchorRect.top + anchorRect.height / 2 - top, 14, height - 14);
    panel.style.setProperty('--ui-hover-card-arrow-x', `${Math.round(arrowX)}px`);
    panel.style.setProperty('--ui-hover-card-arrow-y', `${Math.round(arrowY)}px`);
    panel.setAttribute('data-ready', 'true');
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="anchor" part="anchor">
        <slot name="trigger"></slot>
        <slot></slot>
      </div>
      <div
        class="panel"
        part="panel"
        role="dialog"
        aria-modal="false"
        aria-hidden="${this._isOpen ? 'false' : 'true'}"
        tabindex="-1"
        data-placement="bottom"
        data-ready="false"
      >
        <div class="arrow" part="arrow" aria-hidden="true"></div>
        <div class="panel-body" part="body"><slot name="card"></slot></div>
      </div>
    `);

    this._syncPanelA11y();
    if (this._isOpen) this._schedulePosition();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-hover-card')) {
  customElements.define('ui-hover-card', UIHoverCard);
}

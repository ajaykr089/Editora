import { ElementBase } from '../ElementBase';
import { createPortalContainer } from '../portal';
import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import { createPositioner, type PositionerHandle, type PositionerPlacement } from '../primitives/positioner';

const style = `
  .popover-shell {
    --ui-popover-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-popover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent) 0%,
        color-mix(in srgb, var(--ui-color-surface-elevated, #f8fafc) 24%, var(--ui-color-surface, #ffffff)) 100%
      );
    --ui-popover-text: var(--ui-color-text, #0f172a);
    --ui-popover-muted: var(--ui-color-muted, #64748b);
    --ui-popover-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-popover-border: 1px solid var(--ui-popover-border-color);
    --ui-popover-shadow:
      0 14px 34px rgba(15, 23, 42, 0.12),
      0 28px 64px rgba(15, 23, 42, 0.08);
    --ui-popover-radius: 14px;
    --ui-popover-padding: 14px;
    --ui-popover-backdrop: none;
    --ui-popover-font-size: var(--ui-default-font-size, var(--font-size-2, var(--ui-font-size-md, 14px)));
    --ui-popover-line-height: var(--ui-default-line-height, var(--line-height-2, 20px));
    --ui-popover-letter-spacing: var(--ui-default-letter-spacing, var(--letter-spacing-2, 0em));
  }

  .popover-shell[data-size="sm"],
  .popover-shell[data-size="1"] {
    --ui-popover-radius: 12px;
    --ui-popover-padding: 10px;
    --ui-popover-font-size: 13px;
    --ui-popover-line-height: 18px;
  }

  .popover-shell[data-size="md"],
  .popover-shell[data-size="2"] {
    --ui-popover-radius: 14px;
    --ui-popover-padding: 14px;
  }

  .popover-shell[data-size="lg"],
  .popover-shell[data-size="3"] {
    --ui-popover-radius: 18px;
    --ui-popover-padding: 18px;
    --ui-popover-font-size: 15px;
    --ui-popover-line-height: 22px;
  }

  .popover-shell[data-tone="neutral"] {
    --ui-popover-accent: var(--ui-color-muted, #64748b);
  }

  .popover-shell[data-tone="brand"],
  .popover-shell[data-tone="info"] {
    --ui-popover-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
  }

  .popover-shell[data-tone="success"] {
    --ui-popover-accent: var(--ui-color-success, #16a34a);
  }

  .popover-shell[data-tone="warning"] {
    --ui-popover-accent: var(--ui-color-warning, #d97706);
  }

  .popover-shell[data-tone="danger"] {
    --ui-popover-accent: var(--ui-color-danger, #dc2626);
  }

  .popover-shell[data-variant="soft"] {
    --ui-popover-bg: color-mix(in srgb, var(--ui-popover-accent) 8%, var(--ui-color-surface, #ffffff));
    --ui-popover-border-color: color-mix(in srgb, var(--ui-popover-accent) 24%, var(--ui-color-border, #cbd5e1));
    --ui-popover-shadow:
      0 10px 24px color-mix(in srgb, var(--ui-popover-accent) 12%, rgba(15, 23, 42, 0.08)),
      0 24px 48px rgba(15, 23, 42, 0.06);
  }

  .popover-shell[data-variant="solid"] {
    --ui-popover-bg: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-popover-accent) 16%, var(--ui-color-surface, #ffffff)) 0%,
      color-mix(in srgb, var(--ui-popover-accent) 12%, var(--ui-color-surface-elevated, #f8fafc)) 100%
    );
    --ui-popover-border-color: color-mix(in srgb, var(--ui-popover-accent) 30%, var(--ui-color-border, #cbd5e1));
    --ui-popover-shadow:
      0 14px 32px color-mix(in srgb, var(--ui-popover-accent) 14%, rgba(15, 23, 42, 0.08)),
      0 28px 60px rgba(15, 23, 42, 0.08);
  }

  .popover-shell[data-variant="glass"] {
    --ui-popover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 88%, #ffffff 12%),
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 72%, transparent)
      );
    --ui-popover-border-color: color-mix(in srgb, var(--ui-popover-accent) 12%, rgba(255, 255, 255, 0.38));
    --ui-popover-backdrop: var(--base-panel-backdrop, var(--backdrop-filter-panel, blur(18px) saturate(1.08)));
    --ui-popover-shadow:
      0 18px 38px rgba(15, 23, 42, 0.14),
      0 34px 72px rgba(15, 23, 42, 0.1);
  }

  .popover-shell[data-variant="contrast"] {
    --ui-popover-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-popover-accent) 22%, #0f172a 78%) 0%,
        color-mix(in srgb, var(--ui-popover-accent) 12%, #020617 88%) 100%
      );
    --ui-popover-text: #e2e8f0;
    --ui-popover-muted: color-mix(in srgb, #e2e8f0 72%, transparent);
    --ui-popover-border-color: color-mix(in srgb, var(--ui-popover-accent) 26%, rgba(248, 250, 252, 0.28));
    --ui-popover-shadow:
      0 20px 42px rgba(2, 6, 23, 0.42),
      0 36px 80px rgba(2, 6, 23, 0.34);
  }

  .popover-shell[data-variant="minimal"] {
    --ui-popover-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 94%, transparent);
    --ui-popover-border-color: color-mix(in srgb, var(--ui-popover-accent) 10%, transparent);
    --ui-popover-shadow: none;
  }

  .popover-shell[data-elevation="none"] {
    --ui-popover-shadow: none;
  }

  .popover-shell[data-elevation="low"] {
    --ui-popover-shadow:
      0 8px 18px rgba(15, 23, 42, 0.08),
      0 18px 40px rgba(15, 23, 42, 0.06);
  }

  .popover-shell[data-elevation="high"] {
    --ui-popover-shadow:
      0 18px 38px rgba(15, 23, 42, 0.16),
      0 32px 72px rgba(15, 23, 42, 0.12);
  }

  .panel {
    color-scheme: light dark;
    --ui-popover-focus: var(--ui-color-focus-ring, #2563eb);
    background: var(--ui-popover-bg);
    color: var(--ui-popover-text);
    border: var(--ui-popover-border);
    border-radius: var(--ui-popover-radius);
    padding: var(--ui-popover-padding);
    box-shadow: var(--ui-popover-shadow);
    backdrop-filter: var(--ui-popover-backdrop);
    font: 500 var(--ui-popover-font-size)/var(--ui-popover-line-height) var(--ui-font-family, system-ui, sans-serif);
    letter-spacing: var(--ui-popover-letter-spacing);
    opacity: 0;
    transform: translateY(6px) scale(0.99);
    transition: opacity var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease), transform var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease);
    position: relative;
    min-inline-size: min(180px, calc(100vw - 24px));
    max-inline-size: min(360px, calc(100vw - 24px));
  }
  .panel.show { opacity: 1; transform: translateY(0) scale(1); }

  .content {
    display: grid;
    gap: 10px;
    min-inline-size: 0;
  }

  .content > :first-child {
    margin-top: 0;
  }

  .content > :last-child {
    margin-bottom: 0;
  }

  /* arrow (positioned from portal.ts when present) */
  .arrow {
    position: absolute;
    width: 14px;
    height: 8px;
    background: transparent;
    transform-origin: center;
    left: 50%;
    top: -8px;
    margin-left: -7px;
    transition:
      left var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease),
      top var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease),
      opacity 120ms ease,
      transform var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease);
    will-change: left, top;
  }

  .arrow::before,
  .arrow::after {
    content: "";
    position: absolute;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }

  .arrow::before {
    inset: 0;
    background: var(--ui-popover-border-color);
  }

  .arrow::after {
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 0;
    background: var(--ui-popover-bg);
  }

  [data-placement^="bottom"] .arrow {
    top: -8px;
    bottom: auto;
    left: 50%;
    right: auto;
    margin-left: -7px;
    margin-top: 0;
    transform: rotate(0deg);
  }

  [data-placement^="top"] .arrow {
    top: auto;
    bottom: -8px;
    left: 50%;
    right: auto;
    margin-left: -7px;
    margin-top: 0;
    transform: rotate(180deg);
  }

  [data-placement^="left"] .arrow {
    top: 50%;
    bottom: auto;
    left: auto;
    right: -11px;
    margin-left: 0;
    margin-top: -4px;
    transform: rotate(90deg);
  }

  [data-placement^="right"] .arrow {
    top: 50%;
    bottom: auto;
    left: -11px;
    right: auto;
    margin-left: 0;
    margin-top: -4px;
    transform: rotate(-90deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .panel { transition: none !important; transform: none !important; }
  }

  @media (prefers-contrast: more) {
    .panel {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    .popover-shell {
      --ui-popover-bg: Canvas;
      --ui-popover-text: CanvasText;
      --ui-popover-border-color: CanvasText;
      --ui-popover-border: 1px solid CanvasText;
      --ui-popover-focus: Highlight;
      --ui-popover-shadow: none;
    }

    .panel {
      backdrop-filter: none;
    }

    .panel,
    .arrow {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }
  }
`;

export class UIPopover extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'placement',
      'offset',
      'flip',
      'shift',
      'close-on-escape',
      'close-on-outside',
      'variant',
      'tone',
      'size',
      'radius',
      'elevation'
    ];
  }
  private _portalEl: HTMLElement | null = null;
  private _panelEl: HTMLElement | null = null;
  private _positioner: PositionerHandle | null = null;
  private _layer: DismissableLayerHandle | null = null;
  private _onHostClick: (e: Event) => void;
  private _isOpen = false;
  private _restoreFocusEl: HTMLElement | null = null;
  private _contentObserver: MutationObserver | null = null;
  private _hostObserver: MutationObserver | null = null;
  private _syncPortalScheduled = false;

  constructor() {
    super();
    this._onHostClick = this._handleHostClick.bind(this);
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'open') {
      this._syncOpenState();
      return;
    }
    if (this._isOpen && this._portalEl?.isConnected) {
      if (
        name === 'placement' ||
        name === 'offset' ||
        name === 'flip' ||
        name === 'shift' ||
        name === 'variant' ||
        name === 'tone' ||
        name === 'size' ||
        name === 'radius' ||
        name === 'elevation'
      ) {
        this._mountPortal();
      } else if (name === 'close-on-escape' || name === 'close-on-outside') {
        this._syncDismissableLayer();
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._onHostClick);
    this._observeHost();
    this._syncOpenState();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onHostClick);
    this._hostObserver?.disconnect();
    this._hostObserver = null;
    this._teardownPortal();
    super.disconnectedCallback();
  }

  private _handleHostClick(e: Event) {
    const trigger = this._getTrigger();
    if (!trigger) return;
    const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
    const target = e.target instanceof Node ? e.target : null;
    const hitTrigger = path.includes(trigger) || (!!target && (trigger === target || trigger.contains(target)));
    if (hitTrigger) this.toggle();
  }

  open() { this.setAttribute('open', ''); }
  close() { this.removeAttribute('open'); }
  toggle() { this.hasAttribute('open') ? this.close() : this.open(); }
  updatePosition() { this._positioner?.update(); }

  private _getTrigger(): HTMLElement | null {
    return this.querySelector('[slot="trigger"]') as HTMLElement | null;
  }

  private _buildPortalContent(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'popover-shell';
    wrapper.style.pointerEvents = 'auto';
    const variant = this.getAttribute('variant');
    if (variant) wrapper.dataset.variant = variant;
    const tone = this.getAttribute('tone');
    if (tone) wrapper.dataset.tone = tone;
    const size = this.getAttribute('size');
    if (size) wrapper.dataset.size = size;
    const elevation = this.getAttribute('elevation');
    if (elevation) wrapper.dataset.elevation = elevation;
    const radius = this.getAttribute('radius');
    if (radius && radius.trim()) {
      const trimmed = radius.trim();
      const normalized = /^-?\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed;
      wrapper.style.setProperty('--ui-popover-radius', normalized);
    }
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    wrapper.appendChild(styleEl);

    const panel = document.createElement('div');
    panel.className = 'panel show';
    this._panelEl = panel;

    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    panel.appendChild(arrow);

    const source = this.querySelector('[slot="content"]');
    const content = document.createElement('div');
    content.className = 'content';
    if (source) content.appendChild(source.cloneNode(true));
    panel.appendChild(content);
    wrapper.appendChild(panel);
    return wrapper;
  }

  private _getContentSource(): HTMLElement | null {
    return this.querySelector('[slot="content"]') as HTMLElement | null;
  }

  private _placement(): PositionerPlacement {
    const placement = this.getAttribute('placement') as PositionerPlacement | null;
    if (!placement) return 'bottom';
    return placement;
  }

  private _offset(): number {
    const value = Number(this.getAttribute('offset'));
    return Number.isFinite(value) ? value : 8;
  }

  private _closeOnEscape(): boolean {
    return this.getAttribute('close-on-escape') !== 'false';
  }

  private _closeOnOutside(): boolean {
    return this.getAttribute('close-on-outside') !== 'false';
  }

  private _syncDismissableLayer(): void {
    const trigger = this._getTrigger();
    if (!trigger || !this._panelEl) return;
    this._layer?.destroy();
    this._layer = createDismissableLayer({
      node: this._panelEl,
      trigger,
      closeOnEscape: this._closeOnEscape(),
      closeOnPointerOutside: this._closeOnOutside(),
      onDismiss: () => this.close()
    });
  }

  private _teardownPortal(): void {
    this._contentObserver?.disconnect();
    this._contentObserver = null;
    this._layer?.destroy();
    this._layer = null;
    this._positioner?.destroy();
    this._positioner = null;
    this._panelEl = null;
    if (this._portalEl?.parentElement) {
      try {
        this._portalEl.parentElement.removeChild(this._portalEl);
      } catch {
        // no-op
      }
    }
    this._portalEl = null;
  }

  private _schedulePortalSync(): void {
    if (this._syncPortalScheduled || !this._isOpen) return;
    this._syncPortalScheduled = true;
    queueMicrotask(() => {
      this._syncPortalScheduled = false;
      if (!this._isOpen) return;
      this._mountPortal();
    });
  }

  private _observeContent(): void {
    this._contentObserver?.disconnect();
    this._contentObserver = null;
    const source = this._getContentSource();
    if (!source || typeof MutationObserver === 'undefined') return;

    this._contentObserver = new MutationObserver(() => this._schedulePortalSync());
    this._contentObserver.observe(source, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  private _observeHost(): void {
    this._hostObserver?.disconnect();
    this._hostObserver = null;
    if (typeof MutationObserver === 'undefined') return;
    this._hostObserver = new MutationObserver(() => this._schedulePortalSync());
    this._hostObserver.observe(this, {
      childList: true,
      subtree: false,
    });
  }

  private _mountPortal(): void {
    const trigger = this._getTrigger();
    if (!trigger) return;
    this._teardownPortal();
    this._portalEl = this._buildPortalContent();
    const root = createPortalContainer();
    if (!root) return;
    root.appendChild(this._portalEl);
    this._observeContent();

    this._positioner = createPositioner({
      anchor: trigger,
      floating: this._portalEl,
      placement: this._placement(),
      offset: this._offset(),
      shift: this.getAttribute('shift') !== 'false',
      flip: this.getAttribute('flip') !== 'false',
      arrow: this._portalEl.querySelector('.arrow') as HTMLElement | null
    });

    this._syncDismissableLayer();
  }

  private _syncOpenState(): void {
    const nowOpen = this.hasAttribute('open');
    if (nowOpen === this._isOpen) {
      if (nowOpen) {
        if (!this._portalEl || !this._portalEl.isConnected) {
          this._mountPortal();
        } else {
          this._positioner?.update();
        }
      }
      return;
    }

    this._isOpen = nowOpen;
    if (nowOpen) {
      this._restoreFocusEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      this._mountPortal();
      this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
      this.dispatchEvent(new CustomEvent('open-change', { detail: { open: true }, bubbles: true, composed: true }));
      return;
    }
    this._teardownPortal();
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('open-change', { detail: { open: false }, bubbles: true, composed: true }));

    const trigger = this._getTrigger();
    const fallback = this._restoreFocusEl;
    this._restoreFocusEl = null;
    const focusTarget = (trigger && trigger.isConnected ? trigger : fallback) || null;
    if (focusTarget && focusTarget.isConnected) {
      try {
        focusTarget.focus();
      } catch {
        // no-op
      }
    }
  }

  protected render() {
    this.setContent(`<slot name="trigger"></slot>`);
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-popover')) {
  customElements.define('ui-popover', UIPopover);
}

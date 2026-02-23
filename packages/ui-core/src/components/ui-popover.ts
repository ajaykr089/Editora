import { ElementBase } from '../ElementBase';
import { showPortalFor } from '../portal';

const style = `
  .panel {
    color-scheme: light dark;
    --ui-popover-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-popover-text: var(--ui-color-text, #0f172a);
    --ui-popover-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-popover-shadow: 0 18px 42px rgba(2, 6, 23, 0.2);
    --ui-popover-focus: var(--ui-color-focus-ring, #2563eb);
    background: var(--ui-popover-bg);
    color: var(--ui-popover-text);
    border: 1px solid var(--ui-popover-border);
    border-radius: 10px;
    padding: 8px;
    box-shadow: var(--ui-popover-shadow);
    opacity: 0;
    transform: translateY(6px) scale(0.99);
    transition: opacity var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease), transform var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease);
    position: relative;
  }
  .panel.show { opacity: 1; transform: translateY(0) scale(1); }

  /* arrow (positioned from portal.ts when present) */
  .arrow {
    position: absolute;
    width: 12px;
    height: 12px;
    background: var(--ui-popover-bg);
    transform: rotate(45deg);
    box-shadow: -2px -2px 6px color-mix(in srgb, var(--ui-popover-text) 12%, transparent);
    left: 50%;
    top: -6px;
    margin-left: -6px;
    transition: left var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease), top var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease), opacity 120ms ease;
    will-change: left, top;
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
    .panel {
      --ui-popover-bg: Canvas;
      --ui-popover-text: CanvasText;
      --ui-popover-border: CanvasText;
      --ui-popover-focus: Highlight;
      --ui-popover-shadow: none;
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
  static get observedAttributes() { return ['open']; }
  private _portalEl: HTMLElement | null = null;
  private _cleanup: (() => void) | undefined = undefined;
  private _onHostClick: (e: Event) => void;
  private _onDocumentPointerDown: (e: PointerEvent) => void;
  private _onDocumentKeyDown: (e: KeyboardEvent) => void;
  private _isOpen = false;
  private _globalListenersBound = false;
  private _restoreFocusEl: HTMLElement | null = null;

  constructor() {
    super();
    this._onHostClick = this._handleHostClick.bind(this);
    this._onDocumentPointerDown = this._handleDocumentPointerDown.bind(this);
    this._onDocumentKeyDown = this._handleDocumentKeyDown.bind(this);
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'open') this._syncOpenState();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._onHostClick);
    this._syncOpenState();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onHostClick);
    this._unbindGlobalListeners();
    this._teardownPortal();
    super.disconnectedCallback();
  }

  private _handleHostClick(e: Event) {
    // support clicking any element inside a slotted trigger (use composedPath)
    const path = e.composedPath() as any[];
    const triggerEl = path.find((p) => p && p.getAttribute && p.getAttribute('slot') === 'trigger') as HTMLElement | undefined;
    if (triggerEl) this.toggle();
  }

  private _handleDocumentPointerDown(event: PointerEvent): void {
    if (!this._isOpen) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    if (this._portalEl && path.includes(this._portalEl)) return;
    this.close();
  }

  private _handleDocumentKeyDown(event: KeyboardEvent): void {
    if (!this._isOpen) return;
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this.close();
  }

  open() { this.setAttribute('open', ''); }
  close() { this.removeAttribute('open'); }
  toggle() { this.hasAttribute('open') ? this.close() : this.open(); }

  private _getTrigger(): HTMLElement | null {
    return this.querySelector('[slot="trigger"]') as HTMLElement | null;
  }

  private _bindGlobalListeners(): void {
    if (this._globalListenersBound) return;
    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.addEventListener('keydown', this._onDocumentKeyDown);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners(): void {
    if (!this._globalListenersBound) return;
    document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    this._globalListenersBound = false;
  }

  private _buildPortalContent(): HTMLElement {
    const wrapper = document.createElement('div');
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    wrapper.appendChild(styleEl);

    const panel = document.createElement('div');
    panel.className = 'panel show';

    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    panel.appendChild(arrow);

    const source = this.querySelector('[slot="content"]');
    if (source) panel.appendChild(source.cloneNode(true));
    wrapper.appendChild(panel);
    return wrapper;
  }

  private _teardownPortal(): void {
    if (this._cleanup) {
      try {
        this._cleanup();
      } catch {
        // no-op
      }
      this._cleanup = undefined;
    }
    this._portalEl = null;
  }

  private _mountPortal(): void {
    const trigger = this._getTrigger();
    if (!trigger) return;
    this._teardownPortal();
    this._portalEl = this._buildPortalContent();
    const cleanup = showPortalFor(trigger, this._portalEl, { placement: 'bottom', shift: true });
    this._cleanup = typeof cleanup === 'function' ? cleanup : undefined;
  }

  private _syncOpenState(): void {
    const nowOpen = this.hasAttribute('open');
    if (nowOpen === this._isOpen) {
      if (nowOpen) {
        this._bindGlobalListeners();
        if (!this._portalEl || !this._portalEl.isConnected) {
          this._mountPortal();
        }
      } else {
        this._unbindGlobalListeners();
      }
      return;
    }

    this._isOpen = nowOpen;
    if (nowOpen) {
      this._bindGlobalListeners();
      this._restoreFocusEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      this._mountPortal();
      this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
      return;
    }
    this._unbindGlobalListeners();
    this._teardownPortal();
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));

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

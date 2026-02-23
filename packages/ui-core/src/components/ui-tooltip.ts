import { ElementBase } from '../ElementBase';
import { showPortalFor } from '../portal';

type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

const style = `
  .tooltip {
    color-scheme: light dark;
    --ui-tooltip-bg: color-mix(in srgb, #0f172a 92%, #111827 8%);
    --ui-tooltip-color: #f8fafc;
    --ui-tooltip-border: color-mix(in srgb, #334155 58%, transparent);
    --ui-tooltip-shadow:
      0 8px 18px rgba(2, 6, 23, 0.32),
      0 20px 36px rgba(2, 6, 23, 0.28);
    --ui-tooltip-radius: 10px;
    --ui-tooltip-padding-y: 7px;
    --ui-tooltip-padding-x: 10px;
    --ui-tooltip-font-size: 12px;

    position: absolute;
    pointer-events: auto;
    max-inline-size: min(320px, calc(100vw - 16px));
    border: 1px solid var(--ui-tooltip-border);
    border-radius: var(--ui-tooltip-radius);
    background: var(--ui-tooltip-bg);
    color: var(--ui-tooltip-color);
    box-shadow: var(--ui-tooltip-shadow);
    padding: var(--ui-tooltip-padding-y) var(--ui-tooltip-padding-x);
    font: 500 var(--ui-tooltip-font-size)/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    opacity: 0;
    transform: translateY(4px) scale(0.98);
    transition: opacity 140ms ease, transform 140ms ease;
    z-index: 3000;
  }

  .tooltip.show {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .tooltip[data-size="sm"] {
    --ui-tooltip-font-size: 11px;
    --ui-tooltip-padding-y: 5px;
    --ui-tooltip-padding-x: 8px;
    --ui-tooltip-radius: 8px;
  }

  .tooltip[data-size="lg"] {
    --ui-tooltip-font-size: 13px;
    --ui-tooltip-padding-y: 9px;
    --ui-tooltip-padding-x: 12px;
    --ui-tooltip-radius: 11px;
  }

  .tooltip[data-variant="soft"] {
    --ui-tooltip-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 16%, #0f172a 84%);
    --ui-tooltip-border: color-mix(in srgb, var(--ui-color-primary, #2563eb) 40%, transparent);
  }

  .tooltip[data-variant="contrast"] {
    --ui-tooltip-bg: #f8fafc;
    --ui-tooltip-color: #0f172a;
    --ui-tooltip-border: color-mix(in srgb, #94a3b8 66%, transparent);
    --ui-tooltip-shadow:
      0 8px 16px rgba(15, 23, 42, 0.15),
      0 18px 32px rgba(15, 23, 42, 0.12);
  }

  .tooltip[data-variant="minimal"] {
    --ui-tooltip-shadow: none;
    --ui-tooltip-border: transparent;
    --ui-tooltip-radius: 8px;
  }

  .tooltip[data-tone="success"] {
    --ui-tooltip-bg: color-mix(in srgb, var(--ui-color-success, #16a34a) 84%, #052e16 16%);
    --ui-tooltip-border: color-mix(in srgb, var(--ui-color-success, #16a34a) 42%, transparent);
  }

  .tooltip[data-tone="warning"] {
    --ui-tooltip-bg: color-mix(in srgb, var(--ui-color-warning, #d97706) 84%, #451a03 16%);
    --ui-tooltip-border: color-mix(in srgb, var(--ui-color-warning, #d97706) 42%, transparent);
  }

  .tooltip[data-tone="danger"] {
    --ui-tooltip-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 84%, #450a0a 16%);
    --ui-tooltip-border: color-mix(in srgb, var(--ui-color-danger, #dc2626) 42%, transparent);
  }

  .tooltip-content {
    min-inline-size: 0;
    overflow-wrap: anywhere;
  }

  .arrow {
    position: absolute;
    inline-size: 9px;
    block-size: 9px;
    background: var(--ui-tooltip-bg);
    border-left: 1px solid var(--ui-tooltip-border);
    border-top: 1px solid var(--ui-tooltip-border);
    transform: rotate(45deg);
    left: 50%;
    top: -5px;
    margin-left: -4px;
    pointer-events: none;
  }

  .tooltip[data-placement="bottom"] .arrow {
    top: -5px;
  }

  .tooltip[data-placement="top"] .arrow {
    top: auto;
    bottom: -5px;
    transform: rotate(225deg);
  }

  .tooltip[data-placement="left"] .arrow {
    left: auto;
    right: -5px;
    top: 50%;
    margin-left: 0;
    margin-top: -4px;
    transform: rotate(135deg);
  }

  .tooltip[data-placement="right"] .arrow {
    left: -5px;
    top: 50%;
    margin-left: 0;
    margin-top: -4px;
    transform: rotate(-45deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .tooltip {
      transition: none !important;
      transform: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .tooltip {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    .tooltip {
      --ui-tooltip-bg: Canvas;
      --ui-tooltip-color: CanvasText;
      --ui-tooltip-border: CanvasText;
      --ui-tooltip-shadow: none;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isTruthy(raw: string | null): boolean {
  if (raw == null) return false;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function parseNumber(raw: string | null, fallback: number): number {
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function parsePlacement(raw: string | null): TooltipPlacement {
  if (raw === 'top' || raw === 'right' || raw === 'bottom' || raw === 'left') return raw;
  return 'top';
}

function triggerSet(raw: string | null): Set<string> {
  const input = (raw || 'hover focus').trim().toLowerCase();
  if (!input) return new Set(['hover', 'focus']);
  return new Set(input.split(/[\s,]+/).filter(Boolean));
}

export class UITooltip extends ElementBase {
  static get observedAttributes() {
    return [
      'text',
      'placement',
      'open',
      'disabled',
      'headless',
      'variant',
      'size',
      'tone',
      'delay',
      'close-delay',
      'trigger',
      'offset',
      'interactive',
      'arrow',
      'aria-label'
    ];
  }

  private _portalEl: HTMLElement | null = null;
  private _cleanup: (() => void) | null = null;
  private _id: string = `ui-tooltip-${Math.random().toString(36).slice(2, 9)}`;
  private _isOpen = false;
  private _syncingOpenAttr = false;
  private _openTimer: ReturnType<typeof setTimeout> | null = null;
  private _closeTimer: ReturnType<typeof setTimeout> | null = null;
  private _pointerInsidePortal = false;
  private _onPortalMouseEnter: EventListener;
  private _onPortalMouseLeave: EventListener;

  constructor() {
    super();
    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onFocusOut = this._onFocusOut.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onPortalMouseEnter = this._handlePortalMouseEnter.bind(this);
    this._onPortalMouseLeave = this._handlePortalMouseLeave.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('mouseenter', this._onMouseEnter as EventListener);
    this.addEventListener('mouseleave', this._onMouseLeave as EventListener);
    this.addEventListener('focusin', this._onFocusIn as EventListener);
    this.addEventListener('focusout', this._onFocusOut as EventListener);
    this.addEventListener('click', this._onClick as EventListener);
    this.addEventListener('keydown', this._onKeyDown as EventListener);

    if (this.hasAttribute('open')) {
      this._scheduleShow(0);
    }
  }

  override disconnectedCallback(): void {
    this.removeEventListener('mouseenter', this._onMouseEnter as EventListener);
    this.removeEventListener('mouseleave', this._onMouseLeave as EventListener);
    this.removeEventListener('focusin', this._onFocusIn as EventListener);
    this.removeEventListener('focusout', this._onFocusOut as EventListener);
    this.removeEventListener('click', this._onClick as EventListener);
    this.removeEventListener('keydown', this._onKeyDown as EventListener);

    this._clearTimers();
    this.hide();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'open' && !this._syncingOpenAttr) {
      if (this.hasAttribute('open')) this._scheduleShow(0);
      else this._scheduleHide(0);
      return;
    }

    if (name === 'disabled' && this.hasAttribute('disabled')) {
      this.hide();
      return;
    }

    if (this._isOpen && ['text', 'placement', 'variant', 'size', 'tone', 'headless', 'offset', 'arrow', 'aria-label'].includes(name)) {
      this._renderPortalContent();
      this._reposition();
      return;
    }

    if (this.isConnected) this.requestRender();
  }

  private _clearTimers(): void {
    if (this._openTimer) {
      clearTimeout(this._openTimer);
      this._openTimer = null;
    }

    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  private _triggerEnabled(type: 'hover' | 'focus' | 'click' | 'manual'): boolean {
    const triggers = triggerSet(this.getAttribute('trigger'));
    if (triggers.has('manual')) return type === 'manual';
    return triggers.has(type);
  }

  private _scheduleShow(delayMs?: number): void {
    if (this.hasAttribute('disabled')) return;
    this._clearTimers();

    const delay = typeof delayMs === 'number' ? delayMs : parseNumber(this.getAttribute('delay'), 250);
    this._openTimer = setTimeout(() => {
      this.show();
      this._openTimer = null;
    }, Math.max(0, delay));
  }

  private _scheduleHide(delayMs?: number): void {
    this._clearTimers();

    const delay = typeof delayMs === 'number' ? delayMs : parseNumber(this.getAttribute('close-delay'), 120);
    this._closeTimer = setTimeout(() => {
      if (this.hasAttribute('interactive') && this._pointerInsidePortal) {
        this._closeTimer = null;
        return;
      }
      this.hide();
      this._closeTimer = null;
    }, Math.max(0, delay));
  }

  private _ensurePortalEl(): HTMLElement {
    if (this._portalEl) return this._portalEl;

    const portal = document.createElement('div');
    portal.className = 'tooltip';
    portal.id = this._id;
    portal.setAttribute('role', 'tooltip');

    if (!this.hasAttribute('headless')) {
      const styleEl = document.createElement('style');
      styleEl.textContent = style;
      portal.appendChild(styleEl);
    }

    const content = document.createElement('div');
    content.className = 'tooltip-content';
    portal.appendChild(content);

    portal.addEventListener('mouseenter', this._onPortalMouseEnter);
    portal.addEventListener('mouseleave', this._onPortalMouseLeave);

    this._portalEl = portal;
    return portal;
  }

  private _handlePortalMouseEnter(): void {
    this._pointerInsidePortal = true;
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  private _handlePortalMouseLeave(): void {
    this._pointerInsidePortal = false;
    if (this.hasAttribute('interactive')) {
      this._scheduleHide();
    }
  }

  private _renderPortalContent(): void {
    const portal = this._ensurePortalEl();
    const text = this.getAttribute('text') || this.getAttribute('aria-label') || '';
    const placement = parsePlacement(this.getAttribute('placement'));
    const variant = this.getAttribute('variant') || 'default';
    const size = this.getAttribute('size') || 'md';
    const tone = this.getAttribute('tone') || 'default';
    const showArrow = !this.hasAttribute('arrow') || isTruthy(this.getAttribute('arrow'));

    portal.setAttribute('data-variant', variant);
    portal.setAttribute('data-size', size);
    portal.setAttribute('data-tone', tone);
    portal.setAttribute('data-placement', placement);

    const content = portal.querySelector('.tooltip-content') as HTMLElement | null;
    if (content) content.textContent = text;

    const existingArrow = portal.querySelector('.arrow');
    if (showArrow && !existingArrow) {
      const arrow = document.createElement('div');
      arrow.className = 'arrow';
      portal.appendChild(arrow);
    }

    if (!showArrow && existingArrow) {
      existingArrow.remove();
    }
  }

  private _reposition(): void {
    if (!this._portalEl) return;
    if (this._cleanup) this._cleanup();

    const placement = parsePlacement(this.getAttribute('placement'));
    const offset = parseNumber(this.getAttribute('offset'), 8);
    this._cleanup = showPortalFor(this as unknown as HTMLElement, this._portalEl, {
      placement,
      offset,
      shift: true,
      flip: true
    }) as (() => void) | null;
  }

  private _syncOpenAttr(next: boolean): void {
    this._syncingOpenAttr = true;
    try {
      if (next) {
        if (!this.hasAttribute('open')) this.setAttribute('open', '');
      } else if (this.hasAttribute('open')) {
        this.removeAttribute('open');
      }
    } finally {
      this._syncingOpenAttr = false;
    }
  }

  show(): void {
    if (this.hasAttribute('disabled')) return;

    const text = this.getAttribute('text') || this.getAttribute('aria-label') || '';
    if (!text.trim()) return;

    this._renderPortalContent();
    this._reposition();

    if (this._portalEl) {
      this._portalEl.classList.add('show');
      this.setAttribute('aria-describedby', this._id);
    }

    const wasOpen = this._isOpen;
    this._isOpen = true;
    this._syncOpenAttr(true);

    if (!wasOpen) {
      this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
      this.dispatchEvent(new CustomEvent('change', { detail: { open: true }, bubbles: true, composed: true }));
    }
  }

  hide(): void {
    this._clearTimers();

    if (this._cleanup) {
      this._cleanup();
      this._cleanup = null;
    }

    if (this._portalEl?.parentElement) {
      this._portalEl.parentElement.removeChild(this._portalEl);
    }

    this._pointerInsidePortal = false;
    this.removeAttribute('aria-describedby');

    const wasOpen = this._isOpen;
    this._isOpen = false;
    this._syncOpenAttr(false);

    if (wasOpen) {
      this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
      this.dispatchEvent(new CustomEvent('change', { detail: { open: false }, bubbles: true, composed: true }));
    }
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return false;
  }

  private _onMouseEnter(): void {
    if (!this._triggerEnabled('hover')) return;
    this._scheduleShow();
  }

  private _onMouseLeave(): void {
    if (!this._triggerEnabled('hover')) return;
    this._scheduleHide();
  }

  private _onFocusIn(): void {
    if (!this._triggerEnabled('focus')) return;
    this._scheduleShow(0);
  }

  private _onFocusOut(event: FocusEvent): void {
    if (!this._triggerEnabled('focus')) return;

    const next = event.relatedTarget as Node | null;
    if (next && this.contains(next)) return;
    this._scheduleHide(0);
  }

  private _onClick(): void {
    if (!this._triggerEnabled('click')) return;
    if (this._isOpen) this.hide();
    else this._scheduleShow(0);
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this._isOpen) {
      event.preventDefault();
      this.hide();
    }
  }

  protected override render(): void {
    this.setContent('<slot></slot>');
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-tooltip')) {
  customElements.define('ui-tooltip', UITooltip);
}

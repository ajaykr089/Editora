import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-flex;
    --ui-badge-font-size: 12px;
    --ui-badge-font-weight: 620;
    --ui-badge-line-height: 1.2;
    --ui-badge-gap: 6px;
    --ui-badge-radius: 999px;
    --ui-badge-padding-block: 5px;
    --ui-badge-padding-inline: 10px;
    --ui-badge-border-width: 1px;
    --ui-badge-accent: var(--ui-color-primary, #2563eb);
    --ui-badge-bg: color-mix(in srgb, var(--ui-badge-accent) 10%, var(--ui-color-surface, #ffffff));
    --ui-badge-color: color-mix(in srgb, var(--ui-badge-accent) 78%, var(--ui-color-text, #0f172a) 22%);
    --ui-badge-border: color-mix(in srgb, var(--ui-badge-accent) 20%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-badge-shadow: none;
    --ui-badge-dot-size: 7px;
    --ui-badge-dot-color: currentColor;
    --ui-badge-remove-size: 16px;
    --ui-badge-remove-bg: color-mix(in srgb, var(--ui-badge-color) 10%, transparent);
    --ui-badge-remove-bg-hover: color-mix(in srgb, var(--ui-badge-color) 18%, transparent);
    --ui-badge-remove-color: currentColor;
    --ui-badge-duration: 160ms;
    --ui-badge-max-inline-size: none;
    color-scheme: light dark;
  }

  :host([tone="neutral"]) {
    --ui-badge-accent: color-mix(in srgb, var(--ui-color-muted, #64748b) 74%, var(--ui-color-text, #0f172a) 26%);
  }

  :host([tone="info"]) {
    --ui-badge-accent: var(--ui-color-primary, #2563eb);
  }

  :host([tone="success"]) {
    --ui-badge-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-badge-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-badge-accent: var(--ui-color-danger, #dc2626);
  }

  :host([tone="purple"]) {
    --ui-badge-accent: #7c3aed;
  }

  .badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-inline-size: 0;
    gap: var(--ui-badge-gap);
    font-size: var(--ui-badge-font-size);
    font-weight: var(--ui-badge-font-weight);
    line-height: var(--ui-badge-line-height);
    border-radius: var(--ui-badge-radius);
    border: var(--ui-badge-border-width) solid var(--ui-badge-border);
    background: var(--ui-badge-bg);
    color: var(--ui-badge-color);
    padding: var(--ui-badge-padding-block) var(--ui-badge-padding-inline);
    box-shadow: var(--ui-badge-shadow);
    white-space: nowrap;
    user-select: none;
    letter-spacing: 0.01em;
    transition:
      transform var(--ui-badge-duration) cubic-bezier(0.2, 0.8, 0.2, 1),
      box-shadow var(--ui-badge-duration) cubic-bezier(0.2, 0.8, 0.2, 1),
      border-color var(--ui-badge-duration) cubic-bezier(0.2, 0.8, 0.2, 1),
      background-color var(--ui-badge-duration) cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity var(--ui-badge-duration) cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .badge::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background:
      linear-gradient(180deg, color-mix(in srgb, #ffffff 34%, transparent), transparent 42%),
      radial-gradient(120% 80% at 100% 0%, color-mix(in srgb, var(--ui-badge-accent) 20%, transparent), transparent 62%);
  }

  :host([variant="solid"]) {
    --ui-badge-bg: var(--ui-badge-accent);
    --ui-badge-color: #ffffff;
    --ui-badge-border: color-mix(in srgb, var(--ui-badge-accent) 72%, #0f172a);
    --ui-badge-shadow: 0 1px 2px rgba(15, 23, 42, 0.08), 0 10px 20px color-mix(in srgb, var(--ui-badge-accent) 28%, rgba(15, 23, 42, 0.22));
    --ui-badge-dot-color: #ffffff;
  }

  :host([variant="outline"]) {
    --ui-badge-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 84%, transparent);
    --ui-badge-border: color-mix(in srgb, var(--ui-badge-accent) 42%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-badge-shadow: none;
  }

  :host([variant="ghost"]) {
    --ui-badge-bg: transparent;
    --ui-badge-border: color-mix(in srgb, var(--ui-badge-accent) 24%, transparent);
    --ui-badge-shadow: none;
  }

  :host([size="xs"]),
  :host([size="1"]),
  :host([size="sm"]) {
    --ui-badge-font-size: 11px;
    --ui-badge-padding-block: 3px;
    --ui-badge-padding-inline: 8px;
    --ui-badge-gap: 5px;
    --ui-badge-dot-size: 6px;
    --ui-badge-remove-size: 14px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-badge-font-size: 13px;
    --ui-badge-padding-block: 6px;
    --ui-badge-padding-inline: 12px;
    --ui-badge-gap: 7px;
    --ui-badge-dot-size: 8px;
    --ui-badge-remove-size: 18px;
  }

  :host([size="xl"]) {
    --ui-badge-font-size: 14px;
    --ui-badge-padding-block: 8px;
    --ui-badge-padding-inline: 14px;
    --ui-badge-gap: 8px;
    --ui-badge-dot-size: 9px;
    --ui-badge-remove-size: 20px;
  }

  :host([pill]) {
    --ui-badge-radius: 9999px;
  }

  :host([radius="none"]) {
    --ui-badge-radius: 0;
  }

  :host([radius="sm"]) {
    --ui-badge-radius: 8px;
  }

  :host([radius="md"]),
  :host([radius="large"]) {
    --ui-badge-radius: 12px;
  }

  :host([radius="lg"]) {
    --ui-badge-radius: 16px;
  }

  :host([radius="full"]) {
    --ui-badge-radius: 9999px;
  }

  :host([interactive]) {
    cursor: pointer;
  }

  :host([interactive]):focus-visible {
    outline: none;
  }

  :host([interactive]):focus-visible .badge {
    border-color: color-mix(in srgb, var(--ui-badge-accent) 52%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-badge-accent) 26%, transparent),
      0 10px 22px rgba(15, 23, 42, 0.14);
  }

  :host([interactive]:not([disabled])):hover .badge {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--ui-badge-accent) 36%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.08), 0 14px 26px rgba(15, 23, 42, 0.14);
  }

  :host([interactive]:not([disabled])):active .badge {
    transform: translateY(0) scale(0.985);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08), 0 8px 16px rgba(15, 23, 42, 0.14);
  }

  :host([state="loading"]) {
    --ui-badge-border: color-mix(in srgb, var(--ui-badge-accent) 44%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
  }

  :host([state="error"]) {
    --ui-badge-accent: var(--ui-color-danger, #dc2626);
    --ui-badge-border: color-mix(in srgb, var(--ui-badge-accent) 46%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
  }

  :host([state="success"]) {
    --ui-badge-accent: var(--ui-color-success, #16a34a);
    --ui-badge-border: color-mix(in srgb, var(--ui-badge-accent) 46%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
  }

  :host([state="error"]) .badge,
  :host([state="success"]) .badge {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ui-badge-accent) 18%, transparent), var(--ui-badge-shadow);
  }

  .dot {
    width: var(--ui-badge-dot-size);
    height: var(--ui-badge-dot-size);
    border-radius: 999px;
    background: var(--ui-badge-dot-color);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-badge-dot-color) 24%, transparent);
    flex: 0 0 auto;
  }

  :host([state="loading"]) .dot {
    animation: ui-badge-pulse 1s ease-in-out infinite;
  }

  .spinner {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid color-mix(in srgb, currentColor 20%, transparent);
    border-top-color: currentColor;
    box-sizing: border-box;
    animation: ui-badge-spin 820ms linear infinite;
    flex: 0 0 auto;
  }

  .icon-slot,
  .label-wrap {
    display: inline-flex;
    align-items: center;
    min-inline-size: 0;
    position: relative;
    z-index: 1;
  }

  .icon-slot[hidden],
  .label-wrap[hidden],
  .dot[hidden],
  .spinner[hidden],
  .remove-btn[hidden] {
    display: none;
  }

  .icon-slot {
    line-height: 1;
    font-size: 0.95em;
  }

  .label {
    overflow: hidden;
    text-overflow: ellipsis;
    max-inline-size: var(--ui-badge-max-inline-size);
  }

  :host([truncate]) .label {
    max-inline-size: var(--ui-badge-max-inline-size, 20ch);
  }

  :host([icon-only]) .badge {
    justify-content: center;
    min-inline-size: calc(2 * var(--ui-badge-padding-inline) + 1em);
  }

  .remove-btn {
    position: relative;
    z-index: 1;
    border: none;
    inline-size: var(--ui-badge-remove-size);
    block-size: var(--ui-badge-remove-size);
    border-radius: 999px;
    padding: 0;
    margin-inline-start: 2px;
    background: var(--ui-badge-remove-bg);
    color: var(--ui-badge-remove-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    line-height: 1;
    transition: background-color var(--ui-badge-duration) cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .remove-btn:hover {
    background: var(--ui-badge-remove-bg-hover);
  }

  .remove-btn:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-badge-accent) 60%, var(--ui-color-focus-ring, #2563eb));
    outline-offset: 1px;
  }

  .remove-btn svg {
    inline-size: 10px;
    block-size: 10px;
    pointer-events: none;
  }

  .visually-hidden {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) .badge {
    opacity: 0.55;
    filter: saturate(0.76);
    box-shadow: none;
    transform: none !important;
  }

  :host([disabled]) .remove-btn {
    opacity: 0.65;
  }

  :host([headless]) .badge {
    display: none;
  }

  @keyframes ui-badge-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes ui-badge-pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.45;
      transform: scale(0.88);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .badge,
    .remove-btn,
    .spinner,
    .dot {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .badge {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    .badge,
    .remove-btn {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border: 1px solid CanvasText;
      box-shadow: none;
    }
    .dot {
      background: CanvasText;
      box-shadow: none;
    }
    .spinner {
      border-color: CanvasText;
      border-top-color: Highlight;
    }
    :host([interactive]):focus-visible .badge {
      outline: 2px solid Highlight;
      outline-offset: 2px;
    }
  }
`;

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type BadgeRemoveDetail = {
  text: string;
  source: 'button';
};

export class UIBadge extends ElementBase {
  static get observedAttributes() {
    return [
      'text',
      'tone',
      'variant',
      'size',
      'pill',
      'dot',
      'radius',
      'disabled',
      'interactive',
      'removable',
      'auto-remove',
      'icon-only',
      'truncate',
      'max-width',
      'state',
      'headless',
    ];
  }

  private _removeBtn: HTMLButtonElement | null = null;
  private _managedRole = false;
  private _managedTabIndex = false;
  private _managedAriaDisabled = false;
  private _managedAriaBusy = false;
  private _managedAriaLabel = false;
  private _lastLabelText = '';

  constructor() {
    super();
    this._onRemoveClick = this._onRemoveClick.bind(this);
    this._onHostKeyDown = this._onHostKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this._onHostKeyDown);
    this._syncInteractiveA11y();
    this._syncBusyState();
  }

  disconnectedCallback() {
    this._detachListeners();
    this.removeEventListener('keydown', this._onHostKeyDown);
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'interactive' || name === 'disabled') this._syncInteractiveA11y();
    if (name === 'state') this._syncBusyState();
    if (this.isConnected) this.requestRender();
  }

  protected render() {
    this._syncInteractiveA11y();
    this._syncBusyState();

    const text = (this.getAttribute('text') || '').trim();
    const hasDot = this.hasAttribute('dot');
    const removable = this.hasAttribute('removable');
    const iconOnly = this.hasAttribute('icon-only');
    const loading = this.getAttribute('state') === 'loading';
    const hasIcon = this.querySelector('[slot="icon"]') !== null;
    const hasSlotText = (this.textContent || '').trim().length > 0;
    const hasLabel = !iconOnly && (text.length > 0 || hasSlotText);
    this._lastLabelText = text || (this.textContent || '').trim();

    let vars = '';
    const maxWidth = this.getAttribute('max-width');
    if (maxWidth) vars += `--ui-badge-max-inline-size:${maxWidth};`;

    if (iconOnly && !this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', this._lastLabelText || 'Badge');
      this._managedAriaLabel = true;
    } else if (!iconOnly && this._managedAriaLabel) {
      this.removeAttribute('aria-label');
      this._managedAriaLabel = false;
    }

    this.setContent(`
      <style>${style}</style>
      <span class="badge" part="base" style="${vars}">
        <span class="dot" part="dot" aria-hidden="true" ${hasDot ? '' : 'hidden'}></span>
        <span class="spinner" part="spinner" aria-hidden="true" ${loading ? '' : 'hidden'}></span>
        <span class="icon-slot" part="icon" ${hasIcon ? '' : 'hidden'}><slot name="icon"></slot></span>
        <span class="label-wrap" part="label-wrap" ${hasLabel ? '' : 'hidden'}>
          <span class="label" part="label"><slot>${escapeHtml(text)}</slot></span>
        </span>
        <button
          type="button"
          class="remove-btn"
          part="remove"
          aria-label="Remove badge"
          ${removable ? '' : 'hidden'}
          ${this.hasAttribute('disabled') || loading ? 'disabled' : ''}
        >
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
        <span class="visually-hidden" aria-live="polite" ${loading ? '' : 'hidden'}>Loading</span>
      </span>
    `);

    this._detachListeners();
    this._removeBtn = this.root.querySelector('.remove-btn');
    if (this._removeBtn) {
      this._removeBtn.addEventListener('click', this._onRemoveClick);
    }
  }

  private _syncInteractiveA11y() {
    const interactive = this.hasAttribute('interactive');
    const disabled = this.hasAttribute('disabled');

    if (interactive) {
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'button');
        this._managedRole = true;
      }
      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', disabled ? '-1' : '0');
        this._managedTabIndex = true;
      } else if (this._managedTabIndex) {
        this.setAttribute('tabindex', disabled ? '-1' : '0');
      }
      if (!this.hasAttribute('aria-disabled') || this._managedAriaDisabled) {
        this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
        this._managedAriaDisabled = true;
      }
      return;
    }

    if (this._managedRole) {
      this.removeAttribute('role');
      this._managedRole = false;
    }
    if (this._managedTabIndex) {
      this.removeAttribute('tabindex');
      this._managedTabIndex = false;
    }
    if (this._managedAriaDisabled) {
      this.removeAttribute('aria-disabled');
      this._managedAriaDisabled = false;
    }
  }

  private _syncBusyState() {
    const busy = this.getAttribute('state') === 'loading';
    if (busy) {
      if (!this.hasAttribute('aria-busy') || this._managedAriaBusy) {
        this.setAttribute('aria-busy', 'true');
        this._managedAriaBusy = true;
      }
      return;
    }
    if (this._managedAriaBusy) {
      this.removeAttribute('aria-busy');
      this._managedAriaBusy = false;
    }
  }

  private _detachListeners() {
    if (!this._removeBtn) return;
    this._removeBtn.removeEventListener('click', this._onRemoveClick);
    this._removeBtn = null;
  }

  private _onHostKeyDown(event: KeyboardEvent) {
    if (!this.hasAttribute('interactive') || this.hasAttribute('disabled')) return;
    const target = event.target as HTMLElement | null;
    if (target && typeof target.closest === 'function' && target.closest('.remove-btn')) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.click();
  }

  private _onRemoveClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.hasAttribute('disabled') || this.getAttribute('state') === 'loading') return;

    const detail: BadgeRemoveDetail = {
      text: this._lastLabelText,
      source: 'button',
    };
    const removeEvent = new CustomEvent<BadgeRemoveDetail>('remove', {
      detail,
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    this.dispatchEvent(removeEvent);
    this.dispatchEvent(
      new CustomEvent<BadgeRemoveDetail>('ui-remove', {
        detail,
        bubbles: true,
        composed: true,
      })
    );

    if (!removeEvent.defaultPrevented && this.hasAttribute('auto-remove')) {
      this.remove();
    }
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-badge')) {
  customElements.define('ui-badge', UIBadge);
}

import { ElementBase } from '../ElementBase';

type AlertTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type AlertVariant = 'surface' | 'soft' | 'outline' | 'solid';
type AlertLayout = 'inline' | 'banner';
type AlertSize = 'sm' | 'md' | 'lg';
type AlertElevation = 'none' | 'low' | 'high';
type AlertIndicator = 'line' | 'none';

const style = `
  :host {
    display: block;
    --ui-alert-radius: var(--base-alert-radius, var(--ui-radius, 4px));
    --ui-alert-padding-y: var(--base-alert-padding-y, 14px);
    --ui-alert-padding-x: var(--base-alert-padding-x, 16px);
    --ui-alert-gap: var(--base-alert-gap, var(--ui-default-gap, 8px));
    --ui-alert-border-color: color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.16)) 84%, transparent);
    --ui-alert-border: var(--base-alert-border, 1px solid var(--ui-alert-border-color));
    --ui-alert-surface-base: var(--base-alert-bg, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
    --ui-alert-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, var(--ui-alert-surface-base));
    --ui-alert-color: var(--ui-color-text, var(--ui-text, #202020));
    --ui-alert-muted: color-mix(in srgb, var(--ui-alert-color) 62%, var(--ui-color-muted, var(--ui-muted, #64748b)) 38%);
    --ui-alert-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-alert-shadow: var(--base-alert-shadow, var(--shadow-2, none));
    --ui-alert-icon-bg: color-mix(in srgb, var(--ui-alert-accent) 14%, transparent);
    --ui-alert-icon-color: var(--ui-alert-accent);
    --ui-alert-dismiss-bg: color-mix(in srgb, var(--ui-alert-color) 10%, transparent);
    --ui-alert-dismiss-bg-hover: color-mix(in srgb, var(--ui-alert-color) 18%, transparent);
    --ui-alert-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-alert-title-size: var(--ui-default-font-size, 14px);
    --ui-alert-title-line-height: var(--ui-default-line-height, 20px);
    --ui-alert-title-weight: 650;
    --ui-alert-description-size: 13px;
    --ui-alert-description-line-height: 20px;
    --ui-alert-icon-size: var(--base-alert-icon-size, 26px);
    --ui-alert-dismiss-size: var(--base-alert-dismiss-size, 28px);
    --ui-alert-duration: var(--ui-motion-base, 180ms);
    --ui-alert-easing: var(--ui-motion-easing, cubic-bezier(0.2, 0.8, 0.2, 1));
    color-scheme: light dark;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-alert-padding-y: 10px;
    --ui-alert-padding-x: 12px;
    --ui-alert-gap: 10px;
    --ui-alert-title-size: 13px;
    --ui-alert-title-line-height: 18px;
    --ui-alert-description-size: 12px;
    --ui-alert-description-line-height: 18px;
    --ui-alert-icon-size: 24px;
    --ui-alert-dismiss-size: 26px;
  }

  :host([size="md"]),
  :host([size="2"]) {
    --ui-alert-padding-y: var(--base-alert-padding-y, 14px);
    --ui-alert-padding-x: var(--base-alert-padding-x, 16px);
    --ui-alert-gap: var(--base-alert-gap, var(--ui-default-gap, 8px));
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-alert-padding-y: 18px;
    --ui-alert-padding-x: 20px;
    --ui-alert-gap: 14px;
    --ui-alert-title-size: 15px;
    --ui-alert-title-line-height: 22px;
    --ui-alert-description-size: 14px;
    --ui-alert-description-line-height: 22px;
    --ui-alert-icon-size: 30px;
    --ui-alert-dismiss-size: 30px;
  }

  :host([hidden]) {
    display: none;
  }

  .alert {
    position: relative;
    border-radius: var(--ui-alert-radius);
    border: var(--ui-alert-border);
    background: var(--ui-alert-bg);
    color: var(--ui-alert-color);
    box-shadow: var(--ui-alert-shadow);
    padding: var(--ui-alert-padding-y) var(--ui-alert-padding-x);
    overflow: clip;
    transition:
      border-color var(--ui-alert-duration) var(--ui-alert-easing),
      background var(--ui-alert-duration) var(--ui-alert-easing),
      box-shadow var(--ui-alert-duration) var(--ui-alert-easing);
  }

  .alert::before {
    content: '';
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: 3px;
    background: linear-gradient(180deg, var(--ui-alert-accent) 0%, color-mix(in srgb, var(--ui-alert-accent) 72%, #0f172a) 100%);
    pointer-events: none;
  }

  :host([indicator="none"]) .alert::before {
    display: none;
  }

  .row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: flex-start;
    gap: var(--ui-alert-gap);
  }

  .icon-wrap {
    margin-top: 1px;
    width: var(--ui-alert-icon-size);
    min-width: var(--ui-alert-icon-size);
    height: var(--ui-alert-icon-size);
    border-radius: 999px;
    background: var(--ui-alert-icon-bg);
    color: var(--ui-alert-icon-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-alert-accent) 24%, transparent);
  }

  .icon {
    width: 16px;
    min-width: 16px;
    height: 16px;
    font-size: 14px;
    line-height: 1;
  }

  .content {
    min-width: 0;
    display: grid;
    gap: 4px;
  }

  .title {
    font-size: var(--ui-alert-title-size);
    font-weight: var(--ui-alert-title-weight);
    letter-spacing: var(--ui-default-letter-spacing, 0em);
    line-height: var(--ui-alert-title-line-height);
  }

  .description {
    font-size: var(--ui-alert-description-size);
    line-height: var(--ui-alert-description-line-height);
    color: var(--ui-alert-muted);
  }

  .dismiss {
    border: none;
    background: var(--ui-alert-dismiss-bg);
    color: inherit;
    border-radius: max(8px, calc(var(--ui-alert-radius) - 4px));
    width: var(--ui-alert-dismiss-size);
    height: var(--ui-alert-dismiss-size);
    line-height: 1;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition:
      background var(--ui-alert-duration) var(--ui-alert-easing),
      transform 120ms ease;
  }

  .dismiss:hover {
    background: var(--ui-alert-dismiss-bg-hover);
  }

  .dismiss:active {
    transform: translateY(1px);
  }

  .dismiss:focus-visible {
    outline: 2px solid var(--ui-alert-focus-ring);
    outline-offset: 1px;
  }

  .actions {
    margin-top: 10px;
    display: inline-flex;
    gap: 8px;
    flex-wrap: wrap;
    min-height: 0;
  }

  .actions[data-empty="true"] {
    display: none;
  }

  :host([layout="banner"]) .alert {
    border-radius: 0 0 var(--ui-alert-radius) var(--ui-alert-radius);
    border-left: 0;
    border-right: 0;
    box-shadow: none;
    padding-inline: 16px;
  }

  :host([variant="outline"]) .alert {
    --ui-alert-bg: color-mix(in srgb, var(--ui-alert-surface-base) 86%, transparent);
    --ui-alert-shadow: none;
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-alert-accent) 30%, var(--ui-alert-border-color));
  }

  :host([variant="solid"]) .alert {
    --ui-alert-bg: var(--ui-alert-accent);
    --ui-alert-color: #ffffff;
    --ui-alert-muted: color-mix(in srgb, #ffffff 82%, transparent);
    --ui-alert-border: 1px solid color-mix(in srgb, #000000 18%, transparent);
    --ui-alert-icon-bg: color-mix(in srgb, #ffffff 20%, transparent);
    --ui-alert-icon-color: #ffffff;
    --ui-alert-dismiss-bg: color-mix(in srgb, #ffffff 16%, transparent);
    --ui-alert-dismiss-bg-hover: color-mix(in srgb, #ffffff 24%, transparent);
    --ui-alert-focus-ring: color-mix(in srgb, #ffffff 74%, var(--ui-alert-accent) 26%);
  }

  :host([variant="surface"]) .alert {
    --ui-alert-bg: var(--ui-alert-surface-base);
    --ui-alert-border: 1px solid var(--ui-alert-border-color);
  }

  :host([elevation="none"]) .alert {
    --ui-alert-shadow: none;
  }

  :host([elevation="low"]) .alert {
    --ui-alert-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 10px 22px rgba(15, 23, 42, 0.09);
  }

  :host([elevation="high"]) .alert {
    --ui-alert-shadow: 0 2px 10px rgba(15, 23, 42, 0.08), 0 26px 54px rgba(15, 23, 42, 0.16);
  }

  :host([tone="info"]) .alert {
    --ui-alert-accent: var(--ui-color-primary, #2563eb);
    --ui-alert-bg: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, var(--ui-color-surface, #ffffff)) 0%,
      color-mix(in srgb, var(--ui-color-primary, #2563eb) 7%, var(--ui-color-surface, #ffffff)) 100%
    );
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 28%, var(--ui-color-border, rgba(15, 23, 42, 0.2)));
  }
  :host([tone="success"]) .alert {
    --ui-alert-accent: var(--ui-color-success, #16a34a);
    --ui-alert-bg: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-success, #16a34a) 14%, var(--ui-color-surface, #ffffff)) 0%,
      color-mix(in srgb, var(--ui-color-success, #16a34a) 10%, var(--ui-color-surface, #ffffff)) 100%
    );
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-color-success, #16a34a) 30%, var(--ui-color-border, rgba(15, 23, 42, 0.2)));
  }
  :host([tone="warning"]) .alert {
    --ui-alert-accent: var(--ui-color-warning, #d97706);
    --ui-alert-bg: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-warning, #f59e0b) 16%, var(--ui-color-surface, #ffffff)) 0%,
      color-mix(in srgb, var(--ui-color-warning, #f59e0b) 12%, var(--ui-color-surface, #ffffff)) 100%
    );
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-color-warning, #f59e0b) 34%, var(--ui-color-border, rgba(15, 23, 42, 0.2)));
  }
  :host([tone="danger"]) .alert {
    --ui-alert-accent: var(--ui-color-danger, #dc2626);
    --ui-alert-bg: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-danger, #dc2626) 13%, var(--ui-color-surface, #ffffff)) 0%,
      color-mix(in srgb, var(--ui-color-danger, #dc2626) 10%, var(--ui-color-surface, #ffffff)) 100%
    );
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-color-danger, #dc2626) 30%, var(--ui-color-border, rgba(15, 23, 42, 0.2)));
  }

  :host([layout="banner"][variant="solid"]) .alert {
    border-top: 0;
  }

  :host([headless]) .alert {
    display: none;
  }

  @media (max-width: 720px) {
    :host {
      --ui-alert-padding-y: 12px;
      --ui-alert-padding-x: 12px;
      --ui-alert-gap: 10px;
    }
    .icon-wrap {
      width: 24px;
      min-width: 24px;
      height: 24px;
    }
    .dismiss {
      width: 26px;
      height: 26px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .alert,
    .dismiss {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .alert {
      box-shadow: none;
      border-width: 2px;
    }
    .dismiss {
      background: transparent;
      border: 1px solid currentColor;
    }
  }

  @media (forced-colors: active) {
    .alert,
    .dismiss {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border: 1px solid CanvasText;
      box-shadow: none;
    }
    .dismiss:hover {
      background: Highlight;
      color: HighlightText;
      border-color: Highlight;
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

function normalizeTone(value: string | null): AlertTone {
  if (value === 'neutral' || value === 'success' || value === 'warning' || value === 'danger') return value;
  return 'info';
}

function normalizeVariant(value: string | null): AlertVariant {
  if (value === 'surface' || value === 'outline' || value === 'solid' || value === 'soft') return value;
  return 'surface';
}

function normalizeSize(value: string | null): AlertSize {
  if (value === 'sm' || value === 'lg') return value;
  if (value === '1') return 'sm';
  if (value === '3') return 'lg';
  return 'md';
}

function normalizeLayout(value: string | null): AlertLayout {
  if (value === 'banner') return 'banner';
  return 'inline';
}

function normalizeElevation(value: string | null): AlertElevation {
  if (value === 'none' || value === 'low' || value === 'high') return value;
  return 'low';
}

function normalizeIndicator(value: string | null): AlertIndicator {
  if (value === 'none') return 'none';
  return 'line';
}

function normalizeRadius(value: string | null, fallback = 'var(--base-alert-radius, var(--ui-radius, 4px))'): string {
  if (!value || !value.trim()) return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'full' || normalized === 'pill') return '999px';
  if (normalized === 'square' || normalized === 'none') return '0px';
  if (/^-?\d+(\.\d+)?$/.test(normalized)) return `${normalized}px`;
  return value.trim();
}

function hasSlottedChild(host: Element, slotName?: string): boolean {
  return Array.from(host.children).some((child) => {
    if (!(child instanceof HTMLElement)) return false;
    const slot = child.getAttribute('slot') || '';
    return slotName ? slot === slotName : slot === '';
  });
}

function defaultToneIcon(tone: AlertTone): string {
  if (tone === 'success') {
    return '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10.2 8.3 13.4 15 6.8"></path></svg>';
  }
  if (tone === 'warning') {
    return '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3.6 17 16.4H3L10 3.6Z"></path><path d="M10 8v3.4"></path><circle cx="10" cy="14.1" r="0.9" fill="currentColor" stroke="none"></circle></svg>';
  }
  if (tone === 'danger') {
    return '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.1"></circle><path d="m7.5 7.5 5 5M12.5 7.5l-5 5"></path></svg>';
  }
  return '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.1"></circle><path d="M10 13v-3.8"></path><circle cx="10" cy="6.5" r="0.9" fill="currentColor" stroke="none"></circle></svg>';
}

export class UIAlert extends ElementBase {
  static get observedAttributes() {
    return ['title', 'description', 'dismissible', 'tone', 'variant', 'layout', 'headless', 'hidden', 'size', 'radius', 'elevation', 'indicator'];
  }

  private _dismissBtn: HTMLButtonElement | null = null;
  private _actionsSlot: HTMLSlotElement | null = null;

  constructor() {
    super();
    this._onDismiss = this._onDismiss.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  disconnectedCallback() {
    if (this._dismissBtn) {
      this._dismissBtn.removeEventListener('click', this._onDismiss);
      this._dismissBtn = null;
    }
    if (this._actionsSlot) {
      this._actionsSlot.removeEventListener('slotchange', this._onSlotChange);
      this._actionsSlot = null;
    }
    super.disconnectedCallback();
  }

  get open() {
    return !this.hasAttribute('hidden');
  }

  set open(value: boolean) {
    if (value) this.removeAttribute('hidden');
    else this.setAttribute('hidden', '');
  }

  connectedCallback() {
    super.connectedCallback();
    this._syncHostStyles();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'radius') {
      this._syncHostStyles();
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  private _onDismiss(event: Event) {
    event.preventDefault();
    const closeEvent = new CustomEvent('close', { bubbles: true, cancelable: true });
    this.dispatchEvent(closeEvent);
    if (!closeEvent.defaultPrevented) {
      this.open = false;
    }
  }

  private _onSlotChange() {
    const actions = this.root.querySelector('.actions') as HTMLElement | null;
    if (!actions || !this._actionsSlot) return;
    const hasAssigned = this._actionsSlot.assignedNodes({ flatten: true }).length > 0;
    actions.setAttribute('data-empty', hasAssigned ? 'false' : 'true');
  }

  private _syncHostStyles() {
    const radius = this.getAttribute('radius');
    if (radius && radius.trim()) {
      this.style.setProperty('--ui-alert-radius', normalizeRadius(radius));
      return;
    }
    this.style.removeProperty('--ui-alert-radius');
  }

  protected render() {
    const title = this.getAttribute('title') || '';
    const description = this.getAttribute('description') || '';
    const dismissible = this.hasAttribute('dismissible');
    const tone = normalizeTone(this.getAttribute('tone'));
    const variant = normalizeVariant(this.getAttribute('variant'));
    const layout = normalizeLayout(this.getAttribute('layout'));
    const size = normalizeSize(this.getAttribute('size'));
    const elevation = normalizeElevation(this.getAttribute('elevation'));
    const indicator = normalizeIndicator(this.getAttribute('indicator'));
    const role = tone === 'danger' || tone === 'warning' ? 'alert' : 'status';
    const ariaLive = role === 'alert' ? 'assertive' : 'polite';
    const hasTitleSlot = hasSlottedChild(this, 'title');
    const hasDescriptionSlot = hasSlottedChild(this);
    const hasActions = hasSlottedChild(this, 'actions');
    const titleMarkup =
      title || hasTitleSlot
        ? `<div class="title" part="title"><slot name="title">${escapeHtml(title)}</slot></div>`
        : '';
    const descriptionMarkup =
      description || hasDescriptionSlot
        ? `<div class="description" part="description"><slot>${escapeHtml(description)}</slot></div>`
        : '';
    const dismissLabel = tone === 'danger' ? 'Dismiss critical alert' : 'Dismiss alert';

    this.setContent(`
      <style>${style}</style>
      <section class="alert tone-${tone} variant-${variant} layout-${layout} size-${size} elevation-${elevation} indicator-${indicator}" part="base" role="${role}" aria-live="${ariaLive}" aria-atomic="true">
        <div class="row">
          <span class="icon-wrap" part="icon-wrap" aria-hidden="true">
            <span class="icon" part="icon">
              <slot name="icon">${defaultToneIcon(tone)}</slot>
            </span>
          </span>
          <div class="content">
            ${titleMarkup}
            ${descriptionMarkup}
            <div class="actions" part="actions" data-empty="${hasActions ? 'false' : 'true'}">
              <slot name="actions"></slot>
            </div>
          </div>
          ${
            dismissible
              ? `<button class="dismiss" part="dismiss" type="button" aria-label="${dismissLabel}">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                    <path d="m6 6 8 8M14 6l-8 8"></path>
                  </svg>
                </button>`
              : ''
          }
        </div>
      </section>
    `);

    if (this._dismissBtn) {
      this._dismissBtn.removeEventListener('click', this._onDismiss);
    }
    this._dismissBtn = this.root.querySelector('.dismiss');
    if (this._dismissBtn) {
      this._dismissBtn.addEventListener('click', this._onDismiss);
    }

    if (this._actionsSlot) {
      this._actionsSlot.removeEventListener('slotchange', this._onSlotChange);
    }
    this._actionsSlot = this.root.querySelector('slot[name="actions"]');
    if (this._actionsSlot) {
      this._actionsSlot.addEventListener('slotchange', this._onSlotChange);
      this._onSlotChange();
    }
  }

  protected override shouldRenderOnAttributeChange(
    name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    if (name === 'radius') return false;
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-alert')) {
  customElements.define('ui-alert', UIAlert);
}

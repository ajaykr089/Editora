import { ElementBase } from '../ElementBase';

type AlertTone = 'info' | 'success' | 'warning' | 'danger';
type AlertVariant = 'soft' | 'outline' | 'solid';
type AlertLayout = 'inline' | 'banner';

const style = `
  :host {
    display: block;
    --ui-alert-radius: 14px;
    --ui-alert-padding-y: 14px;
    --ui-alert-padding-x: 16px;
    --ui-alert-gap: 12px;
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.16)) 84%, transparent);
    --ui-alert-bg: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-primary, #2563eb) 8%, var(--ui-color-surface, #ffffff)) 0%,
      color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, var(--ui-color-surface, #ffffff)) 100%
    );
    --ui-alert-color: var(--ui-color-text, #0f172a);
    --ui-alert-muted: color-mix(in srgb, var(--ui-color-text, #0f172a) 62%, var(--ui-color-muted, #64748b) 38%);
    --ui-alert-accent: var(--ui-color-primary, #2563eb);
    --ui-alert-shadow: none;
    --ui-alert-icon-bg: color-mix(in srgb, var(--ui-alert-accent) 14%, transparent);
    --ui-alert-icon-color: var(--ui-alert-accent);
    --ui-alert-dismiss-bg: color-mix(in srgb, var(--ui-alert-color) 10%, transparent);
    --ui-alert-dismiss-bg-hover: color-mix(in srgb, var(--ui-alert-color) 18%, transparent);
    --ui-alert-focus-ring: var(--ui-color-focus-ring, #2563eb);
    --ui-alert-duration: 170ms;
    --ui-alert-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
    color-scheme: light dark;
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

  .row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: flex-start;
    gap: var(--ui-alert-gap);
  }

  .icon-wrap {
    margin-top: 1px;
    width: 26px;
    min-width: 26px;
    height: 26px;
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
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.01em;
    line-height: 1.35;
  }

  .description {
    font-size: 13px;
    line-height: 1.5;
    color: var(--ui-alert-muted);
  }

  .dismiss {
    border: none;
    background: var(--ui-alert-dismiss-bg);
    color: inherit;
    border-radius: 9px;
    width: 28px;
    height: 28px;
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
    --ui-alert-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 86%, transparent);
    --ui-alert-shadow: none;
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-alert-accent) 44%, var(--ui-color-border, rgba(15, 23, 42, 0.2)));
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
  if (value === 'success' || value === 'warning' || value === 'danger') return value;
  return 'info';
}

function normalizeVariant(value: string | null): AlertVariant {
  if (value === 'outline' || value === 'solid') return value;
  return 'soft';
}

function normalizeLayout(value: string | null): AlertLayout {
  if (value === 'banner') return 'banner';
  return 'inline';
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
    return ['title', 'description', 'dismissible', 'tone', 'variant', 'layout', 'headless', 'hidden'];
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

  protected render() {
    const title = this.getAttribute('title') || '';
    const description = this.getAttribute('description') || '';
    const dismissible = this.hasAttribute('dismissible');
    const tone = normalizeTone(this.getAttribute('tone'));
    const variant = normalizeVariant(this.getAttribute('variant'));
    const layout = normalizeLayout(this.getAttribute('layout'));
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
      <section class="alert tone-${tone} variant-${variant} layout-${layout}" part="base" role="${role}" aria-live="${ariaLive}" aria-atomic="true">
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
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-alert')) {
  customElements.define('ui-alert', UIAlert);
}

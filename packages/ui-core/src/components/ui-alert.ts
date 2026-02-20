import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-alert-radius: 12px;
    --ui-alert-padding-y: 12px;
    --ui-alert-padding-x: 14px;
    --ui-alert-border: 1px solid var(--ui-color-border, rgba(15, 23, 42, 0.18));
    --ui-alert-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, var(--ui-color-surface, #ffffff));
    --ui-alert-color: var(--ui-color-text, #1e3a8a);
    --ui-alert-shadow: var(--ui-shadow-sm, 0 8px 20px rgba(15, 23, 42, 0.08));
    --ui-alert-dismiss-bg: color-mix(in srgb, var(--ui-color-text, #0f172a) 10%, transparent);
    --ui-alert-dismiss-bg-hover: color-mix(in srgb, var(--ui-color-text, #0f172a) 18%, transparent);
    color-scheme: light dark;
  }

  :host([hidden]) {
    display: none;
  }

  .alert {
    border-radius: var(--ui-alert-radius);
    border: var(--ui-alert-border);
    background: var(--ui-alert-bg);
    color: var(--ui-alert-color);
    box-shadow: var(--ui-alert-shadow);
    padding: var(--ui-alert-padding-y) var(--ui-alert-padding-x);
    display: grid;
    gap: 8px;
  }

  .row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .icon {
    margin-top: 1px;
    width: 18px;
    min-width: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    line-height: 1;
  }

  .content {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 3px;
  }

  .title {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.25;
  }

  .description {
    font-size: 13px;
    line-height: 1.45;
    opacity: 0.96;
  }

  .dismiss {
    border: none;
    background: var(--ui-alert-dismiss-bg);
    color: inherit;
    border-radius: 8px;
    width: 24px;
    height: 24px;
    line-height: 1;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    margin-left: auto;
  }

  .dismiss:hover {
    background: var(--ui-alert-dismiss-bg-hover);
  }

  .dismiss:focus-visible {
    outline: 2px solid var(--ui-color-focus-ring, #2563eb);
    outline-offset: 2px;
  }

  .actions {
    display: inline-flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-left: 28px;
  }

  :host([layout="banner"]) .alert {
    border-radius: 0;
    border-left: 0;
    border-right: 0;
    box-shadow: none;
    padding: 14px 16px;
  }

  :host([variant="outline"]) .alert {
    --ui-alert-bg: transparent;
    --ui-alert-shadow: none;
  }

  :host([variant="solid"]) .alert {
    --ui-alert-color: #ffffff;
  }

  :host([tone="info"]) .alert {
    --ui-alert-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 13%, var(--ui-color-surface, #ffffff));
    --ui-alert-color: var(--ui-color-primary, #1d4ed8);
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent);
  }
  :host([tone="success"]) .alert {
    --ui-alert-bg: color-mix(in srgb, var(--ui-color-success, #16a34a) 16%, var(--ui-color-surface, #ffffff));
    --ui-alert-color: var(--ui-color-success, #166534);
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-color-success, #16a34a) 40%, transparent);
  }
  :host([tone="warning"]) .alert {
    --ui-alert-bg: color-mix(in srgb, var(--ui-color-warning, #f59e0b) 20%, var(--ui-color-surface, #ffffff));
    --ui-alert-color: color-mix(in srgb, var(--ui-color-warning, #f59e0b) 78%, black);
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-color-warning, #f59e0b) 38%, transparent);
  }
  :host([tone="danger"]) .alert {
    --ui-alert-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 18%, var(--ui-color-surface, #ffffff));
    --ui-alert-color: var(--ui-color-danger, #b91c1c);
    --ui-alert-border: 1px solid color-mix(in srgb, var(--ui-color-danger, #dc2626) 40%, transparent);
  }

  :host([variant="solid"][tone="info"]) .alert { --ui-alert-bg: var(--ui-color-primary, #2563eb); }
  :host([variant="solid"][tone="success"]) .alert { --ui-alert-bg: var(--ui-color-success, #16a34a); }
  :host([variant="solid"][tone="warning"]) .alert { --ui-alert-bg: var(--ui-color-warning, #d97706); }
  :host([variant="solid"][tone="danger"]) .alert { --ui-alert-bg: var(--ui-color-danger, #dc2626); }

  :host([headless]) .alert {
    display: none;
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
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class UIAlert extends ElementBase {
  static get observedAttributes() {
    return ['title', 'description', 'dismissible', 'tone', 'variant', 'layout', 'headless', 'hidden'];
  }

  private _dismissBtn: HTMLButtonElement | null = null;

  constructor() {
    super();
    this._onDismiss = this._onDismiss.bind(this);
  }

  disconnectedCallback() {
    if (this._dismissBtn) {
      this._dismissBtn.removeEventListener('click', this._onDismiss);
      this._dismissBtn = null;
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

  protected render() {
    const title = this.getAttribute('title') || '';
    const description = this.getAttribute('description') || '';
    const dismissible = this.hasAttribute('dismissible');
    const tone = this.getAttribute('tone') || 'info';
    const role = tone === 'danger' || tone === 'warning' ? 'alert' : 'status';

    this.setContent(`
      <style>${style}</style>
      <section class="alert" role="${role}">
        <div class="row">
          <span class="icon" part="icon" aria-hidden="true">
            <slot name="icon">!</slot>
          </span>
          <div class="content">
            ${title ? `<div class="title" part="title"><slot name="title">${escapeHtml(title)}</slot></div>` : '<slot name="title"></slot>'}
            ${description ? `<div class="description" part="description"><slot>${escapeHtml(description)}</slot></div>` : '<slot></slot>'}
          </div>
          ${dismissible ? '<button class="dismiss" type="button" aria-label="Dismiss alert">x</button>' : ''}
        </div>
        <div class="actions" part="actions"><slot name="actions"></slot></div>
      </section>
    `);

    if (this._dismissBtn) {
      this._dismissBtn.removeEventListener('click', this._onDismiss);
    }
    this._dismissBtn = this.root.querySelector('.dismiss');
    if (this._dismissBtn) {
      this._dismissBtn.addEventListener('click', this._onDismiss);
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-alert')) {
  customElements.define('ui-alert', UIAlert);
}

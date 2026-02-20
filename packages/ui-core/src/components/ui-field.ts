import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    width: 100%;
    --ui-field-gap: 6px;
    --ui-field-label-color: var(--ui-color-text, #0f172a);
    --ui-field-description-color: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-field-error-color: var(--ui-color-danger, var(--ui-error, #dc2626));
    color-scheme: light dark;
  }
  .field {
    width: 100%;
    display: grid;
    gap: var(--ui-field-gap);
  }
  :host([orientation="horizontal"]) .field {
    grid-template-columns: 180px 1fr;
    align-items: start;
    column-gap: 12px;
  }
  .meta {
    min-width: 0;
    display: grid;
    gap: 4px;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
  }
  .label {
    font-size: 13px;
    font-weight: 600;
    color: var(--ui-field-label-color);
    cursor: pointer;
  }
  .required {
    color: var(--ui-field-error-color);
    margin-left: 4px;
  }
  .description {
    font-size: 12px;
    color: var(--ui-field-description-color);
    line-height: 1.35;
  }
  .control {
    min-width: 0;
  }
  .error {
    font-size: 12px;
    color: var(--ui-field-error-color);
    min-height: 1em;
  }
  .error:empty {
    display: none;
  }
  :host([invalid]) .label {
    color: var(--ui-field-error-color);
  }
  :host([headless]) .field {
    display: none;
  }

  @media (prefers-contrast: more) {
    .label,
    .description,
    .error {
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-field-label-color: CanvasText;
      --ui-field-description-color: CanvasText;
      --ui-field-error-color: CanvasText;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class UIField extends ElementBase {
  static get observedAttributes() {
    return ['label', 'description', 'error', 'for', 'required', 'invalid', 'orientation', 'headless'];
  }

  private _uid = Math.random().toString(36).slice(2, 8);

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick as EventListener);
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    super.disconnectedCallback();
  }

  private _focusControl() {
    const explicitFor = this.getAttribute('for');
    if (explicitFor) {
      const control = document.getElementById(explicitFor);
      if (control && typeof (control as HTMLElement).focus === 'function') {
        (control as HTMLElement).focus();
        return;
      }
    }

    const directFocusable = this.querySelector(
      'ui-input, ui-textarea, input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement | null;
    if (directFocusable && typeof directFocusable.focus === 'function') {
      directFocusable.focus();
    }
  }

  private _onRootClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.label')) return;
    this._focusControl();
  }

  protected render() {
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const error = this.getAttribute('error') || '';
    const required = this.hasAttribute('required');
    const htmlFor = this.getAttribute('for') || '';

    this.setContent(`
      <style>${style}</style>
      <div class="field">
        <div class="meta">
          <div class="top">
            <label class="label" ${htmlFor ? `for="${escapeHtml(htmlFor)}"` : ''} id="${this._uid}-label">
              <slot name="label">${escapeHtml(label)}</slot>
              ${required ? '<span class="required" aria-hidden="true">*</span>' : ''}
            </label>
            <slot name="actions"></slot>
          </div>
          <div class="description" id="${this._uid}-description"><slot name="description">${escapeHtml(description)}</slot></div>
        </div>

        <div class="control" aria-labelledby="${this._uid}-label" aria-describedby="${this._uid}-description ${this._uid}-error">
          <slot></slot>
          <div class="error" id="${this._uid}-error"><slot name="error">${escapeHtml(error)}</slot></div>
        </div>
      </div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-field')) {
  customElements.define('ui-field', UIField);
}

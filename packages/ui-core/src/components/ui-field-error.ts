import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-field-error-color: var(--ui-color-danger, var(--ui-error, #dc2626));
    --ui-field-error-size: 12px;
    --ui-field-error-weight: 600;
    --ui-field-error-line-height: 1.45;
    --ui-field-error-bg: transparent;
    --ui-field-error-border: 0;
    --ui-field-error-radius: 0;
    --ui-field-error-padding: 0;
    color-scheme: light dark;
    display: block;
    min-width: 0;
    color: var(--ui-field-error-color);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    min-width: 0;
    margin: 0;
    display: block;
    box-sizing: border-box;
    padding: var(--ui-field-error-padding);
    border: var(--ui-field-error-border);
    border-radius: var(--ui-field-error-radius);
    background: var(--ui-field-error-bg);
    color: inherit;
    font-size: var(--ui-field-error-size);
    font-weight: var(--ui-field-error-weight);
    line-height: var(--ui-field-error-line-height);
    letter-spacing: 0.01em;
  }

  :host([variant="soft"]) {
    --ui-field-error-bg: color-mix(in srgb, var(--ui-field-error-color) 9%, transparent);
    --ui-field-error-border: 1px solid color-mix(in srgb, var(--ui-field-error-color) 22%, transparent);
    --ui-field-error-radius: 10px;
    --ui-field-error-padding: 8px 10px;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-field-error-size: 11px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-field-error-size: 13px;
  }

  :host(:not([active])),
  :host([hidden]),
  .root[hidden] {
    display: none !important;
  }

  @media (forced-colors: active) {
    :host {
      --ui-field-error-color: CanvasText;
      --ui-field-error-bg: Canvas;
      --ui-field-error-border: 1px solid CanvasText;
    }

    .root {
      forced-color-adjust: none;
      background: var(--ui-field-error-bg);
      color: var(--ui-field-error-color);
      border-color: CanvasText;
    }
  }
`;

function ensureId(el: HTMLElement, suffix: string): string {
  if (!el.id) el.id = `ui-field-error-${suffix}-${Math.random().toString(36).slice(2, 9)}`;
  return el.id;
}

function uniqueTokens(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function applyTokenAttribute(target: HTMLElement, name: string, token: string, enabled: boolean): void {
  const current = (target.getAttribute(name) || '').split(/\s+/).filter(Boolean);
  const next = enabled ? uniqueTokens([...current, token]) : current.filter((value) => value !== token);
  if (next.length) target.setAttribute(name, next.join(' '));
  else target.removeAttribute(name);
}

export class UIFieldError extends ElementBase {
  static get observedAttributes(): string[] {
    return ['for', 'active', 'hidden'];
  }

  private _target: HTMLElement | null = null;
  private _errorId = '';

  connectedCallback(): void {
    super.connectedCallback();
    this._syncAssociation();
  }

  disconnectedCallback(): void {
    this._clearAssociation();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'for' || name === 'active' || name === 'hidden') {
      this._syncAssociation();
    }
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <p class="root" part="root" role="alert" aria-live="polite"><slot></slot></p>
    `);
  }

  private _resolveTarget(): HTMLElement | null {
    const targetId = this.getAttribute('for');
    if (!targetId) return null;
    const root = this.getRootNode();
    if (root instanceof Document || root instanceof ShadowRoot) {
      return root.getElementById(targetId);
    }
    return document.getElementById(targetId);
  }

  private _clearAssociation(): void {
    if (this._target && this._errorId) {
      applyTokenAttribute(this._target, 'aria-describedby', this._errorId, false);
      if (this._target.getAttribute('aria-errormessage') === this._errorId) {
        this._target.removeAttribute('aria-errormessage');
      }
      if (this._target.getAttribute('aria-invalid') === 'true' && !this._target.hasAttribute('data-ui-invalid-persist')) {
        this._target.removeAttribute('aria-invalid');
      }
    }
    this._target = null;
  }

  private _syncAssociation(): void {
    this._clearAssociation();
    if (!this.hasAttribute('active') || this.hasAttribute('hidden')) return;
    const target = this._resolveTarget();
    if (!target) return;
    this._errorId = ensureId(this, 'msg');
    this._target = target;
    applyTokenAttribute(target, 'aria-describedby', this._errorId, true);
    target.setAttribute('aria-errormessage', this._errorId);
    target.setAttribute('aria-invalid', 'true');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-field-error': UIFieldError;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-field-error')) {
  customElements.define('ui-field-error', UIFieldError);
}

import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-description-color: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-description-size: 12px;
    --ui-description-weight: 500;
    --ui-description-line-height: 1.45;
    --ui-description-bg: transparent;
    --ui-description-border: 0;
    --ui-description-radius: 0;
    --ui-description-padding: 0;
    color-scheme: light dark;
    display: block;
    min-width: 0;
    color: var(--ui-description-color);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    min-width: 0;
    margin: 0;
    display: block;
    box-sizing: border-box;
    padding: var(--ui-description-padding);
    border: var(--ui-description-border);
    border-radius: var(--ui-description-radius);
    background: var(--ui-description-bg);
    color: inherit;
    font-size: var(--ui-description-size);
    font-weight: var(--ui-description-weight);
    line-height: var(--ui-description-line-height);
    letter-spacing: 0.01em;
  }

  :host([tone="brand"]) { --ui-description-color: var(--ui-color-primary, #2563eb); }
  :host([tone="success"]) { --ui-description-color: var(--ui-color-success, #16a34a); }
  :host([tone="warning"]) { --ui-description-color: var(--ui-color-warning, #d97706); }
  :host([tone="danger"]) { --ui-description-color: var(--ui-color-danger, #dc2626); }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-description-size: 11px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-description-size: 13px;
  }

  :host([variant="soft"]) {
    --ui-description-bg: color-mix(in srgb, var(--ui-description-color) 8%, transparent);
    --ui-description-border: 1px solid color-mix(in srgb, var(--ui-description-color) 16%, transparent);
    --ui-description-radius: 10px;
    --ui-description-padding: 8px 10px;
  }

  :host([variant="surface"]) {
    --ui-description-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-description-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 58%, transparent);
    --ui-description-radius: 10px;
    --ui-description-padding: 8px 10px;
  }

  :host([hidden]),
  .root[hidden] {
    display: none !important;
  }

  @media (forced-colors: active) {
    :host {
      --ui-description-color: CanvasText;
      --ui-description-bg: Canvas;
      --ui-description-border: 1px solid CanvasText;
    }

    .root {
      forced-color-adjust: none;
      background: var(--ui-description-bg);
      color: var(--ui-description-color);
      border-color: CanvasText;
    }
  }
`;

function ensureId(el: HTMLElement, suffix: string): string {
  if (!el.id) el.id = `ui-description-${suffix}-${Math.random().toString(36).slice(2, 9)}`;
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

export class UIDescription extends ElementBase {
  static get observedAttributes(): string[] {
    return ['for', 'hidden'];
  }

  private _target: HTMLElement | null = null;
  private _descriptionId = '';

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
    if (name === 'for' || name === 'hidden') {
      this._syncAssociation();
    }
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <p class="root" part="root"><slot></slot></p>
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
    if (this._target && this._descriptionId) {
      applyTokenAttribute(this._target, 'aria-describedby', this._descriptionId, false);
    }
    this._target = null;
  }

  private _syncAssociation(): void {
    this._clearAssociation();
    if (this.hasAttribute('hidden')) return;
    const target = this._resolveTarget();
    if (!target) return;
    this._descriptionId = ensureId(this, 'desc');
    this._target = target;
    applyTokenAttribute(target, 'aria-describedby', this._descriptionId, true);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-description': UIDescription;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-description')) {
  customElements.define('ui-description', UIDescription);
}

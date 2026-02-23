import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-label-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-label-muted: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-label-error: var(--ui-color-danger, var(--ui-error, #dc2626));
    --ui-label-bg: transparent;
    --ui-label-border: 1px solid transparent;
    --ui-label-radius: 10px;
    --ui-label-pad-x: 0px;
    --ui-label-pad-y: 0px;
    --ui-label-shadow: none;
    --ui-label-font-size: 13px;
    --ui-label-font-weight: 600;
    --ui-label-gap: 4px;
    --ui-label-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    color-scheme: light dark;
    display: inline-flex;
    min-width: 0;
  }

  .root {
    min-width: 0;
    display: grid;
    gap: var(--ui-label-gap);
    color: var(--ui-label-color);
    background: var(--ui-label-bg);
    border: var(--ui-label-border);
    border-radius: var(--ui-label-radius);
    padding: var(--ui-label-pad-y) var(--ui-label-pad-x);
    box-shadow: var(--ui-label-shadow);
    transition: color 160ms ease, background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
  }

  .label {
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font: var(--ui-label-font-weight) var(--ui-label-font-size)/1.35 "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    color: inherit;
  }

  .required {
    color: var(--ui-label-error);
    font-size: calc(var(--ui-label-font-size) - 1px);
    line-height: 1;
    transform: translateY(-0.5px);
  }

  .description {
    margin: 0;
    min-width: 0;
    color: var(--ui-label-muted);
    font: 500 calc(var(--ui-label-font-size) - 1px)/1.4 "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
  }

  .description[hidden] {
    display: none;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-label-font-size: 12px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-label-font-size: 14px;
  }

  :host([variant="surface"]) {
    --ui-label-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-label-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 65%, transparent);
    --ui-label-pad-x: 8px;
    --ui-label-pad-y: 6px;
    --ui-label-shadow: 0 1px 3px rgba(2, 6, 23, 0.05);
  }

  :host([variant="soft"]) {
    --ui-label-bg: color-mix(in srgb, var(--ui-label-accent) 10%, transparent);
    --ui-label-border: 1px solid color-mix(in srgb, var(--ui-label-accent) 18%, transparent);
    --ui-label-pad-x: 8px;
    --ui-label-pad-y: 6px;
  }

  :host([variant="contrast"]) {
    --ui-label-color: #e2e8f0;
    --ui-label-muted: #93a4bd;
    --ui-label-bg: #0f172a;
    --ui-label-border: 1px solid #334155;
    --ui-label-pad-x: 9px;
    --ui-label-pad-y: 7px;
    --ui-label-shadow: 0 2px 8px rgba(2, 6, 23, 0.24);
  }

  :host([variant="minimal"]) {
    --ui-label-bg: transparent;
    --ui-label-border: 0;
    --ui-label-pad-x: 0;
    --ui-label-pad-y: 0;
    --ui-label-shadow: none;
  }

  :host([variant="elevated"]) {
    --ui-label-bg: linear-gradient(
      165deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, #ffffff 8%),
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent)
    );
    --ui-label-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 64%, transparent);
    --ui-label-pad-x: 9px;
    --ui-label-pad-y: 7px;
    --ui-label-shadow:
      0 1px 4px rgba(2, 6, 23, 0.07),
      0 10px 20px rgba(2, 6, 23, 0.1);
  }

  :host([tone="brand"]) { --ui-label-color: var(--ui-color-primary, var(--ui-primary, #2563eb)); }
  :host([tone="success"]) { --ui-label-color: var(--ui-color-success, var(--ui-success, #16a34a)); }
  :host([tone="warning"]) { --ui-label-color: var(--ui-color-warning, var(--ui-warning, #d97706)); }
  :host([tone="danger"]) { --ui-label-color: var(--ui-color-danger, var(--ui-error, #dc2626)); }

  :host([shape="square"]) { --ui-label-radius: 4px; }
  :host([shape="soft"]) { --ui-label-radius: 16px; }

  :host([density="compact"]) {
    --ui-label-gap: 2px;
  }

  :host([density="comfortable"]) {
    --ui-label-gap: 6px;
  }

  :host([disabled]) .label {
    cursor: not-allowed;
    opacity: 0.6;
  }

  :host(:not([disabled])) .label:hover {
    color: color-mix(in srgb, var(--ui-label-color) 84%, var(--ui-label-accent));
  }

  :host([headless]) .root {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .root {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-label-border: 2px solid color-mix(in srgb, var(--ui-label-color) 44%, transparent);
      --ui-label-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-label-color: CanvasText;
      --ui-label-muted: CanvasText;
      --ui-label-bg: Canvas;
      --ui-label-border: 1px solid CanvasText;
      --ui-label-shadow: none;
    }

    .root {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
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

function hasSlotContent(slot: HTMLSlotElement | null): boolean {
  if (!slot) return false;
  const nodes = slot.assignedNodes({ flatten: true });
  if (!nodes.length) return false;
  return nodes.some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
    return node.nodeType === Node.ELEMENT_NODE;
  });
}

function isFocusableElement(node: HTMLElement): boolean {
  if (node.hasAttribute('disabled') || node.getAttribute('aria-disabled') === 'true') return false;
  const styles = window.getComputedStyle(node);
  if (styles.display === 'none' || styles.visibility === 'hidden') return false;
  return true;
}

export class UILabel extends ElementBase {
  static get observedAttributes() {
    return [
      'for',
      'required',
      'description',
      'variant',
      'tone',
      'size',
      'density',
      'shape',
      'disabled',
      'headless'
    ];
  }

  private _uid = Math.random().toString(36).slice(2, 9);

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
    this._onRootFocusIn = this._onRootFocusIn.bind(this);
    this._onRootFocusOut = this._onRootFocusOut.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick as EventListener);
    this.root.addEventListener('focusin', this._onRootFocusIn as EventListener);
    this.root.addEventListener('focusout', this._onRootFocusOut as EventListener);
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);
    this._syncDescriptionVisibility();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    this.root.removeEventListener('focusin', this._onRootFocusIn as EventListener);
    this.root.removeEventListener('focusout', this._onRootFocusOut as EventListener);
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);
    super.disconnectedCallback();
  }

  private _resolveControl(): HTMLElement | null {
    const htmlFor = this.getAttribute('for');
    if (htmlFor) {
      const target = document.getElementById(htmlFor);
      if (target instanceof HTMLElement && isFocusableElement(target)) return target;
    }

    const candidates = [
      this.nextElementSibling,
      this.parentElement,
      this.closest('[role="group"], form, ui-form, fieldset, .field, [data-field]') as Element | null
    ];

    for (const root of candidates) {
      if (!root) continue;
      const control = root.querySelector(
        'ui-input, ui-textarea, ui-select, ui-combobox, input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement | null;
      if (control && isFocusableElement(control)) return control;
    }

    return null;
  }

  private _focusControl(): void {
    const control = this._resolveControl();
    if (!control) return;

    try {
      control.focus({ preventScroll: true });
    } catch {
      control.focus();
    }
  }

  private _onRootClick(event: MouseEvent): void {
    if (this.hasAttribute('disabled')) return;

    const target = event.target as HTMLElement | null;
    if (!target?.closest('.label')) return;

    this._focusControl();
    this.dispatchEvent(new CustomEvent('click', { bubbles: true }));
  }

  private _onRootFocusIn(): void {
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true }));
  }

  private _onRootFocusOut(): void {
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true }));
  }

  private _onSlotChange(): void {
    this._syncDescriptionVisibility();
  }

  private _syncDescriptionVisibility(): void {
    const descText = (this.getAttribute('description') || '').trim();
    const descSlot = this.root.querySelector('slot[name="description"]') as HTMLSlotElement | null;
    const visible = !!descText || hasSlotContent(descSlot);
    const descriptionEl = this.root.querySelector('.description') as HTMLElement | null;

    if (!descriptionEl) return;
    if (visible) descriptionEl.removeAttribute('hidden');
    else descriptionEl.setAttribute('hidden', '');
  }

  protected override render(): void {
    const htmlFor = this.getAttribute('for') || '';
    const description = this.getAttribute('description') || '';
    const required = this.hasAttribute('required');

    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <label class="label" id="${this._uid}-label" part="label" ${htmlFor ? `for="${escapeHtml(htmlFor)}"` : ''}>
          <slot></slot>
          ${required ? '<span class="required" aria-hidden="true">*</span>' : ''}
        </label>
        <p class="description" id="${this._uid}-description" part="description">
          <slot name="description">${escapeHtml(description)}</slot>
        </p>
      </div>
    `);

    this._syncDescriptionVisibility();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-label')) {
  customElements.define('ui-label', UILabel);
}

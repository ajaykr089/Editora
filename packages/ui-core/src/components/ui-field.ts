import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-field-gap: 8px;
    --ui-field-label-width: 192px;
    --ui-field-radius: 14px;
    --ui-field-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-field-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-field-label-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-field-description-color: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-field-error-color: var(--ui-color-danger, var(--ui-error, #dc2626));
    --ui-field-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-field-border: 1px solid var(--ui-field-border-color);
    --ui-field-shadow:
      0 1px 3px rgba(2, 6, 23, 0.04),
      0 10px 20px rgba(2, 6, 23, 0.05);
    --ui-field-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-field-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-field-shell-bg: color-mix(in srgb, var(--ui-field-bg) 93%, transparent);
    --ui-field-shell-border: color-mix(in srgb, var(--ui-field-border-color) 88%, transparent);
    color-scheme: light dark;
    display: block;
    width: 100%;
    min-width: 0;
  }

  .frame {
    width: 100%;
    min-width: 0;
    display: grid;
    gap: var(--ui-field-gap);
    color: var(--ui-field-color);
    background: var(--ui-field-bg);
    border: var(--ui-field-border);
    border-radius: var(--ui-field-radius);
    box-shadow: var(--ui-field-shadow);
    padding: 12px;
    box-sizing: border-box;
    transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
  }

  :host([orientation="horizontal"]) .frame {
    grid-template-columns: minmax(120px, var(--ui-field-label-width)) minmax(0, 1fr);
    align-items: start;
    column-gap: 14px;
  }

  .meta {
    min-width: 0;
    display: grid;
    gap: 5px;
    align-content: start;
  }

  .label-row {
    min-width: 0;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
  }

  .label {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--ui-field-label-color);
    font: 600 13px/1.35 "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-align: left;
    cursor: pointer;
  }

  .required {
    color: var(--ui-field-error-color);
    font-size: 12px;
    line-height: 1;
    transform: translateY(-0.5px);
  }

  .actions {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    color: var(--ui-field-description-color);
  }

  .description,
  .error {
    margin: 0;
    min-width: 0;
    font-size: 12px;
    line-height: 1.4;
    letter-spacing: 0.01em;
  }

  .description {
    color: var(--ui-field-description-color);
  }

  .description[hidden],
  .error[hidden] {
    display: none;
  }

  .control-wrap {
    min-width: 0;
    display: grid;
    gap: 8px;
  }

  .control-shell {
    min-width: 0;
    padding: 8px;
    border-radius: calc(var(--ui-field-radius) - 5px);
    border: 1px solid var(--ui-field-shell-border);
    background: var(--ui-field-shell-bg);
    transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
  }

  .control {
    min-width: 0;
  }

  .error {
    color: var(--ui-field-error-color);
  }

  .frame:focus-within {
    border-color: color-mix(in srgb, var(--ui-field-focus-ring) 56%, var(--ui-field-border-color));
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--ui-field-focus-ring) 24%, transparent),
      var(--ui-field-shadow);
  }

  .frame:focus-within .control-shell {
    border-color: color-mix(in srgb, var(--ui-field-focus-ring) 62%, var(--ui-field-shell-border));
  }

  :host([invalid]) {
    --ui-field-label-color: var(--ui-field-error-color);
    --ui-field-border-color: color-mix(in srgb, var(--ui-field-error-color) 46%, transparent);
    --ui-field-shell-border: color-mix(in srgb, var(--ui-field-error-color) 56%, transparent);
  }

  :host([variant="surface"]) {
    --ui-field-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-field-shadow:
      0 1px 3px rgba(2, 6, 23, 0.05),
      0 12px 26px rgba(2, 6, 23, 0.08);
  }

  :host([variant="outline"]) {
    --ui-field-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 90%, transparent);
    --ui-field-shadow: none;
    --ui-field-shell-bg: color-mix(in srgb, var(--ui-field-bg) 92%, transparent);
  }

  :host([variant="soft"]) {
    --ui-field-bg: color-mix(in srgb, var(--ui-field-accent) 7%, var(--ui-color-surface, #ffffff));
    --ui-field-border-color: color-mix(in srgb, var(--ui-field-accent) 24%, var(--ui-color-border, #cbd5e1));
    --ui-field-shell-bg: color-mix(in srgb, var(--ui-field-accent) 10%, var(--ui-color-surface, #ffffff));
    --ui-field-shell-border: color-mix(in srgb, var(--ui-field-accent) 30%, var(--ui-field-border-color));
    --ui-field-shadow:
      0 1px 4px rgba(2, 6, 23, 0.04),
      0 8px 20px rgba(2, 6, 23, 0.06);
  }

  :host([variant="contrast"]) {
    --ui-field-bg: #0f172a;
    --ui-field-color: #e2e8f0;
    --ui-field-label-color: #f8fafc;
    --ui-field-description-color: #93a4bd;
    --ui-field-border-color: #334155;
    --ui-field-shell-bg: #0b1220;
    --ui-field-shell-border: #334155;
    --ui-field-focus-ring: #93c5fd;
    --ui-field-shadow:
      0 2px 8px rgba(2, 6, 23, 0.2),
      0 22px 44px rgba(2, 6, 23, 0.34);
  }

  :host([variant="minimal"]) {
    --ui-field-bg: transparent;
    --ui-field-border: 0;
    --ui-field-shadow: none;
    --ui-field-shell-bg: transparent;
    --ui-field-shell-border: color-mix(in srgb, var(--ui-field-accent) 26%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="minimal"]) .frame {
    padding: 0;
  }

  :host([variant="minimal"]) .control-shell {
    padding: 8px 0;
    border-left: none;
    border-right: none;
    border-top: none;
    border-radius: 0;
  }

  :host([variant="elevated"]) {
    --ui-field-bg: linear-gradient(
      160deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, #ffffff 8%),
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent)
    );
    --ui-field-shadow:
      0 2px 10px rgba(2, 6, 23, 0.08),
      0 20px 40px rgba(2, 6, 23, 0.12);
    --ui-field-shell-bg: color-mix(in srgb, #ffffff 72%, var(--ui-field-bg));
  }

  :host([tone="success"]) {
    --ui-field-accent: #16a34a;
  }

  :host([tone="warning"]) {
    --ui-field-accent: #d97706;
  }

  :host([tone="danger"]) {
    --ui-field-accent: #dc2626;
    --ui-field-error-color: #dc2626;
  }

  :host([density="compact"]) {
    --ui-field-gap: 6px;
  }

  :host([density="compact"]) .frame {
    padding: 9px;
  }

  :host([density="compact"]) .label {
    font-size: 12px;
  }

  :host([density="compact"]) .description,
  :host([density="compact"]) .error {
    font-size: 11px;
  }

  :host([density="comfortable"]) {
    --ui-field-gap: 10px;
  }

  :host([density="comfortable"]) .frame {
    padding: 15px;
  }

  :host([density="comfortable"]) .label {
    font-size: 14px;
  }

  :host([density="comfortable"]) .description,
  :host([density="comfortable"]) .error {
    font-size: 13px;
  }

  :host([shape="square"]) {
    --ui-field-radius: 4px;
  }

  :host([shape="soft"]) {
    --ui-field-radius: 20px;
  }

  :host([headless]) {
    --ui-field-bg: transparent;
    --ui-field-border: 0;
    --ui-field-shadow: none;
    --ui-field-shell-bg: transparent;
    --ui-field-shell-border: transparent;
  }

  :host([headless]) .frame {
    padding: 0;
    border: none;
    border-radius: 0;
    box-shadow: none;
    gap: 6px;
    background: transparent;
  }

  :host([headless]) .control-shell {
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
  }

  @media (prefers-reduced-motion: reduce) {
    .frame,
    .control-shell {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-field-border: 2px solid var(--ui-field-border-color);
    }

    .control-shell {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-field-bg: Canvas;
      --ui-field-color: CanvasText;
      --ui-field-label-color: CanvasText;
      --ui-field-description-color: CanvasText;
      --ui-field-error-color: CanvasText;
      --ui-field-border-color: CanvasText;
      --ui-field-shell-bg: Canvas;
      --ui-field-shell-border: CanvasText;
      --ui-field-shadow: none;
    }

    .frame,
    .control-shell {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
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

function slotHasMeaningfulContent(slot: HTMLSlotElement | null): boolean {
  if (!slot) return false;
  const nodes = slot.assignedNodes({ flatten: true });
  if (!nodes.length) return false;

  return nodes.some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
    return node.nodeType === Node.ELEMENT_NODE;
  });
}

function isFocusable(node: HTMLElement): boolean {
  if (node.hasAttribute('disabled') || node.getAttribute('aria-disabled') === 'true') return false;
  const styles = window.getComputedStyle(node);
  if (styles.display === 'none' || styles.visibility === 'hidden') return false;
  return true;
}

function uniqueIds(existing: string[]): string[] {
  return Array.from(new Set(existing.filter(Boolean)));
}

export class UIField extends ElementBase {
  static get observedAttributes() {
    return [
      'label',
      'description',
      'error',
      'for',
      'required',
      'invalid',
      'orientation',
      'headless',
      'variant',
      'tone',
      'density',
      'shape',
      'label-width'
    ];
  }

  private _uid = Math.random().toString(36).slice(2, 9);

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick as EventListener);
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);
    this._syncDerivedState();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'label-width') {
      const width = this.getAttribute('label-width');
      if (width) this.style.setProperty('--ui-field-label-width', width);
      else this.style.removeProperty('--ui-field-label-width');
    }

    if (name === 'label' || name === 'description' || name === 'error' || name === 'required' || name === 'for') {
      if (this.isConnected) this.requestRender();
      return;
    }

    this._syncDerivedState();
  }

  private _onSlotChange(): void {
    this._syncDerivedState();
  }

  private _onRootClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (!target.closest('.label')) return;
    this._focusControl();
  }

  private _focusControl(): void {
    const control = this._resolveControlElement();
    if (!control) return;

    try {
      control.focus({ preventScroll: true });
    } catch {
      control.focus();
    }
  }

  private _resolveControlElement(): HTMLElement | null {
    const explicitFor = this.getAttribute('for');
    if (explicitFor) {
      const target = document.getElementById(explicitFor);
      if (target instanceof HTMLElement && isFocusable(target)) return target;
    }

    const slot = this.root.querySelector('slot:not([name])') as HTMLSlotElement | null;
    const assigned = slot?.assignedElements({ flatten: true }) || [];

    for (const element of assigned) {
      if (!(element instanceof HTMLElement)) continue;
      if (isFocusable(element)) return element;

      const nested = element.querySelector(
        'ui-input, ui-textarea, ui-select, ui-combobox, input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement | null;
      if (nested && isFocusable(nested)) return nested;
    }

    const fallback = this.querySelector(
      'ui-input, ui-textarea, ui-select, ui-combobox, input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement | null;

    if (fallback && isFocusable(fallback)) return fallback;
    return null;
  }

  private _syncDerivedState(): void {
    const descSlot = this.root.querySelector('slot[name="description"]') as HTMLSlotElement | null;
    const errorSlot = this.root.querySelector('slot[name="error"]') as HTMLSlotElement | null;

    const descText = (this.getAttribute('description') || '').trim();
    const errorText = (this.getAttribute('error') || '').trim();

    const descVisible = !!descText || slotHasMeaningfulContent(descSlot);
    const errorVisible = !!errorText || slotHasMeaningfulContent(errorSlot);

    const descEl = this.root.querySelector('.description') as HTMLElement | null;
    const errorEl = this.root.querySelector('.error') as HTMLElement | null;

    if (descEl) {
      if (descVisible) descEl.removeAttribute('hidden');
      else descEl.setAttribute('hidden', '');
    }

    if (errorEl) {
      if (errorVisible) errorEl.removeAttribute('hidden');
      else errorEl.setAttribute('hidden', '');
    }

    this._syncControlA11y(descVisible, errorVisible);
  }

  private _syncControlA11y(descVisible: boolean, errorVisible: boolean): void {
    const control = this._resolveControlElement();
    if (!control) return;

    const labelId = `${this._uid}-label`;
    const descId = `${this._uid}-description`;
    const errorId = `${this._uid}-error`;

    if (!control.hasAttribute('aria-label')) {
      control.setAttribute('aria-labelledby', labelId);
    }

    const existing = (control.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter((id) => id && id !== descId && id !== errorId);

    if (descVisible) existing.push(descId);
    if (errorVisible) existing.push(errorId);

    const describedBy = uniqueIds(existing);
    if (describedBy.length) control.setAttribute('aria-describedby', describedBy.join(' '));
    else control.removeAttribute('aria-describedby');

    const invalid = this.hasAttribute('invalid') || errorVisible;
    if (invalid) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');

    if (this.hasAttribute('required')) control.setAttribute('aria-required', 'true');
    else control.removeAttribute('aria-required');
  }

  protected override render(): void {
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const error = this.getAttribute('error') || '';
    const required = this.hasAttribute('required');
    const htmlFor = this.getAttribute('for') || '';

    this.setContent(`
      <style>${style}</style>
      <div class="frame" part="field">
        <div class="meta" part="meta">
          <div class="label-row" part="top">
            <label class="label" id="${this._uid}-label" ${htmlFor ? `for="${escapeHtml(htmlFor)}"` : ''}>
              <slot name="label">${escapeHtml(label)}</slot>
              ${required ? '<span class="required" aria-hidden="true">*</span>' : ''}
            </label>
            <div class="actions" part="actions"><slot name="actions"></slot></div>
          </div>
          <p class="description" id="${this._uid}-description" part="description">
            <slot name="description">${escapeHtml(description)}</slot>
          </p>
        </div>

        <div class="control-wrap" part="control-wrap">
          <div class="control-shell" part="control-shell">
            <div class="control" part="control"><slot></slot></div>
          </div>
          <p class="error" id="${this._uid}-error" part="error" aria-live="polite">
            <slot name="error">${escapeHtml(error)}</slot>
          </p>
        </div>
      </div>
    `);

    this._syncDerivedState();
  }

  protected override shouldRenderOnAttributeChange(
    name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return name === 'label' || name === 'description' || name === 'error' || name === 'required' || name === 'for';
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-field')) {
  customElements.define('ui-field', UIField);
}

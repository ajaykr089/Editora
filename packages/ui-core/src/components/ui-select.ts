import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-select-width: var(--ui-width, min(320px, 100%));
    --ui-select-min-height: 40px;
    --ui-select-padding-x: 12px;
    --ui-select-radius: var(--ui-radius, 12px);
    --ui-select-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-select-border: 1px solid var(--ui-select-border-color);
    --ui-select-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-select-text: var(--ui-color-text, #0f172a);
    --ui-select-muted: var(--ui-color-muted, #64748b);
    --ui-select-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-select-accent: var(--ui-color-primary, #2563eb);
    --ui-select-shadow:
      0 1px 2px rgba(2, 6, 23, 0.06),
      0 12px 24px rgba(2, 6, 23, 0.1);
    --ui-select-label: var(--ui-select-text);
    --ui-select-description: var(--ui-select-muted);
    --ui-select-error: var(--ui-color-danger, #dc2626);
    --ui-select-success: var(--ui-color-success, #16a34a);
    --ui-select-placeholder: color-mix(in srgb, var(--ui-select-text) 46%, transparent);
    color-scheme: light dark;
    display: inline-grid;
    inline-size: var(--ui-select-width);
    min-inline-size: min(220px, 100%);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    min-inline-size: 0;
    display: grid;
    gap: 8px;
    color: var(--ui-select-text);
  }

  .meta {
    display: grid;
    gap: 4px;
  }

  .label {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--ui-select-label);
    font: 600 13px/1.35 "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
  }

  .required {
    color: var(--ui-select-error);
    font-size: 12px;
    line-height: 1;
  }

  .description {
    margin: 0;
    color: var(--ui-select-description);
    font-size: 12px;
    line-height: 1.4;
  }

  .control {
    min-inline-size: 0;
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 8px;
    min-block-size: var(--ui-select-min-height);
    border: var(--ui-select-border);
    border-radius: var(--ui-select-radius);
    background: var(--ui-select-bg);
    box-shadow: var(--ui-select-shadow);
    padding-inline: 10px;
    transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease, transform 160ms ease;
    backdrop-filter: saturate(1.08) blur(10px);
  }

  .control:focus-within {
    border-color: color-mix(in srgb, var(--ui-select-focus) 62%, var(--ui-select-border-color));
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--ui-select-focus) 18%, transparent),
      var(--ui-select-shadow);
  }

  .control[data-has-leading="false"] {
    grid-template-columns: minmax(0, 1fr) auto auto;
  }

  .control[data-has-trailing="false"] {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .control[data-has-leading="false"][data-has-trailing="false"] {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .leading,
  .trailing {
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: color-mix(in srgb, var(--ui-select-text) 64%, transparent);
    line-height: 1;
  }

  .leading[hidden],
  .trailing[hidden],
  .description[hidden],
  .label[hidden],
  .error[hidden],
  .meta[hidden] {
    display: none;
  }

  .select-wrap {
    min-inline-size: 0;
    position: relative;
    display: grid;
    align-items: center;
  }

  select {
    inline-size: 100%;
    min-inline-size: 0;
    block-size: calc(var(--ui-select-min-height) - 2px);
    box-sizing: border-box;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ui-select-text);
    font: 500 14px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: 8px 24px 8px 2px;
    margin: 0;
    appearance: none;
    cursor: pointer;
    text-overflow: ellipsis;
  }

  select:disabled {
    cursor: not-allowed;
  }

  .indicator {
    pointer-events: none;
    inline-size: 18px;
    block-size: 18px;
    display: inline-grid;
    place-items: center;
    color: color-mix(in srgb, var(--ui-select-text) 60%, transparent);
    transform-origin: 50% 48%;
    transition: transform 140ms ease, color 140ms ease;
  }

  .indicator::before {
    content: "";
    inline-size: 8px;
    block-size: 8px;
    border-right: 1.8px solid currentColor;
    border-bottom: 1.8px solid currentColor;
    transform: rotate(45deg) translateY(-1px);
  }

  .control:focus-within .indicator {
    color: var(--ui-select-focus);
    transform: translateY(1px);
  }

  .error {
    margin: 0;
    color: var(--ui-select-error);
    font-size: 12px;
    line-height: 1.35;
  }

  :host([disabled]) .control {
    opacity: 0.62;
    filter: saturate(0.85);
    box-shadow: none;
  }

  :host([disabled]) .leading,
  :host([disabled]) .trailing,
  :host([disabled]) .indicator {
    color: color-mix(in srgb, var(--ui-select-text) 38%, transparent);
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-select-min-height: 34px;
    --ui-select-padding-x: 10px;
  }

  :host([size="sm"]) select,
  :host([size="1"]) select {
    font-size: 12px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-select-min-height: 46px;
    --ui-select-padding-x: 13px;
  }

  :host([size="lg"]) select,
  :host([size="3"]) select {
    font-size: 15px;
  }

  :host([variant="surface"]) {
    --ui-select-bg: var(--ui-color-surface-alt, #f8fafc);
    --ui-select-shadow: 0 1px 2px rgba(2, 6, 23, 0.05);
  }

  :host([variant="soft"]) {
    --ui-select-bg: color-mix(in srgb, var(--ui-select-accent) 8%, var(--ui-color-surface, #ffffff));
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-accent) 30%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="filled"]) {
    --ui-select-bg: color-mix(in srgb, var(--ui-select-text) 5%, var(--ui-color-surface, #ffffff));
    --ui-select-border: 1px solid transparent;
    --ui-select-shadow: none;
  }

  :host([variant="glass"]) {
    --ui-select-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 72%, transparent);
    --ui-select-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 50%, transparent);
    --ui-select-shadow:
      0 8px 18px rgba(2, 6, 23, 0.1),
      0 26px 52px rgba(2, 6, 23, 0.08);
  }

  :host([variant="contrast"]) {
    --ui-select-bg: #0f172a;
    --ui-select-text: #e2e8f0;
    --ui-select-label: #e2e8f0;
    --ui-select-description: #93a4bd;
    --ui-select-border-color: #334155;
    --ui-select-focus: #93c5fd;
    --ui-select-shadow: 0 10px 30px rgba(2, 6, 23, 0.35);
  }

  :host([tone="success"]) {
    --ui-select-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-select-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-select-accent: var(--ui-color-danger, #dc2626);
  }

  :host([density="compact"]) .root {
    gap: 6px;
  }

  :host([density="comfortable"]) .root {
    gap: 10px;
  }

  :host([radius="none"]) {
    --ui-select-radius: 0px;
  }

  :host([radius="large"]) {
    --ui-select-radius: 16px;
  }

  :host([radius="full"]) {
    --ui-select-radius: 999px;
  }

  :host([validation="success"]),
  :host([data-valid="true"]) {
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-success) 62%, transparent);
  }

  :host([validation="warning"]) {
    --ui-select-border-color: color-mix(in srgb, var(--ui-color-warning, #d97706) 62%, transparent);
  }

  :host([validation="error"]),
  :host([invalid]),
  :host([data-invalid="true"]) {
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-error) 68%, transparent);
    --ui-select-label: var(--ui-select-error);
  }

  :host([validation="error"]) .control,
  :host([invalid]) .control,
  :host([data-invalid="true"]) .control {
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--ui-select-error) 18%, transparent),
      var(--ui-select-shadow);
  }

  :host([headless]) .root {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .indicator {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-select-border: 2px solid var(--ui-select-border-color);
      --ui-select-shadow: none;
    }

    .control:focus-within {
      box-shadow: none;
      outline: 2px solid var(--ui-select-focus);
      outline-offset: 1px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-select-bg: Canvas;
      --ui-select-text: CanvasText;
      --ui-select-label: CanvasText;
      --ui-select-description: CanvasText;
      --ui-select-border-color: CanvasText;
      --ui-select-focus: Highlight;
      --ui-select-error: CanvasText;
      --ui-select-success: CanvasText;
      --ui-select-shadow: none;
    }

    .indicator::before {
      border-right-color: CanvasText;
      border-bottom-color: CanvasText;
    }
  }
`;

function isTruthyAttr(raw: string | null): boolean {
  if (raw == null) return false;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class UISelect extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'disabled',
      'required',
      'placeholder',
      'name',
      'tabindex',
      'headless',
      'size',
      'variant',
      'tone',
      'density',
      'radius',
      'label',
      'description',
      'error',
      'aria-label',
      'validation',
      'invalid',
      'data-invalid',
      'data-valid'
    ];
  }

  private _select: HTMLSelectElement | null = null;
  private _observer: MutationObserver | null = null;
  private _formUnregister: (() => void) | null = null;
  private _uid = Math.random().toString(36).slice(2, 8);

  constructor() {
    super();
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onFocusOut = this._onFocusOut.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.root.addEventListener('input', this._onInput as EventListener, true);
    this.root.addEventListener('change', this._onChange as EventListener, true);
    this.root.addEventListener('focusin', this._onFocusIn as EventListener);
    this.root.addEventListener('focusout', this._onFocusOut as EventListener);
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);

    this._observer = new MutationObserver(() => {
      this.requestRender();
    });
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['value', 'selected', 'disabled', 'label', 'slot']
    });

    this._attachFormRegistration();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('input', this._onInput as EventListener, true);
    this.root.removeEventListener('change', this._onChange as EventListener, true);
    this.root.removeEventListener('focusin', this._onFocusIn as EventListener);
    this.root.removeEventListener('focusout', this._onFocusOut as EventListener);
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);

    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }

    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'name') this._attachFormRegistration();

    const liveAttrs = new Set([
      'value',
      'disabled',
      'required',
      'placeholder',
      'name',
      'tabindex',
      'headless',
      'size',
      'variant',
      'tone',
      'density',
      'radius',
      'aria-label',
      'validation',
      'invalid',
      'data-invalid',
      'data-valid'
    ]);

    if (this._select && liveAttrs.has(name)) {
      if (name === 'placeholder') this._syncOptions(this._select);
      this._syncControlState();
      return;
    }

    if (this.isConnected) this.requestRender();
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    const normalized = String(next || '');
    if (normalized === this.value) return;
    this.setAttribute('value', normalized);
  }

  get disabled(): boolean {
    return isTruthyAttr(this.getAttribute('disabled'));
  }

  set disabled(next: boolean) {
    if (next) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  focus(options?: FocusOptions): void {
    if (this._select) {
      this._select.focus(options);
      return;
    }
    super.focus(options);
  }

  blur(): void {
    if (this._select) {
      this._select.blur();
      return;
    }
    super.blur();
  }

  private _onInput(event: Event): void {
    if (event.target !== this._select || !this._select || this.disabled) return;
    this._commitValue(this._select.value, 'input');
  }

  private _onChange(event: Event): void {
    if (event.target !== this._select || !this._select || this.disabled) return;
    this._commitValue(this._select.value, 'change');
  }

  private _onFocusIn(event: FocusEvent): void {
    if (event.target !== this._select) return;
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  }

  private _onFocusOut(event: FocusEvent): void {
    if (event.target !== this._select) return;
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  }

  private _onSlotChange(): void {
    this.requestRender();
  }

  private _commitValue(nextValue: string, eventName: 'input' | 'change'): void {
    const current = this.getAttribute('value');
    if (current !== nextValue) this.setAttribute('value', nextValue);

    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { value: nextValue },
        bubbles: true,
        composed: true
      })
    );
  }

  private _attachFormRegistration(): void {
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }

    const name = this.getAttribute('name');
    if (!name) return;

    const rootNode = this.getRootNode();
    const rootHost = rootNode instanceof ShadowRoot ? (rootNode.host as HTMLElement | null) : null;
    const parentForm = rootHost?.closest?.('ui-form') || this.closest('ui-form');

    if (!parentForm || typeof (parentForm as any).registerField !== 'function') return;

    this._formUnregister = (parentForm as any).registerField(name, {
      name,
      getValue: () => this.value,
      setValue: (next: string) => {
        this.value = next;
      },
      validate: async () => {
        if (!this._select) return { valid: true };
        const valid = this._select.checkValidity();
        return { valid, message: this._select.validationMessage || undefined };
      },
      setError: (message?: string) => {
        if (message) {
          this.setAttribute('validation', 'error');
          this.setAttribute('error', message);
        } else {
          if (this.getAttribute('validation') === 'error') this.removeAttribute('validation');
          this.removeAttribute('error');
        }
      }
    });
  }

  private _hasSlotContent(name: string): boolean {
    const selector = `[slot="${name}"]`;
    const node = this.querySelector(selector);
    return !!node;
  }

  private _syncOptions(select: HTMLSelectElement): void {
    select.innerHTML = '';

    const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
    const placeholder = this.getAttribute('placeholder') || '';

    if (placeholder) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = placeholder;
      option.disabled = required;
      option.hidden = required;
      select.appendChild(option);
    }

    const source = Array.from(this.children).filter((node) => {
      if (!(node instanceof HTMLElement)) return false;
      const tag = node.tagName.toLowerCase();
      return tag === 'option' || tag === 'optgroup';
    });

    source.forEach((node) => {
      select.appendChild(node.cloneNode(true));
    });

    if (this.hasAttribute('value')) {
      const next = this.getAttribute('value') || '';
      if (select.value !== next) select.value = next;
    } else if (placeholder) {
      select.value = '';
    }
  }

  private _syncControlState(): void {
    const select = this._select;
    if (!select) return;

    const labelAttr = this.getAttribute('label') || '';
    const ariaLabel = this.getAttribute('aria-label') || labelAttr || 'Select';
    const disabled = this.disabled;
    const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
    const name = this.getAttribute('name') || '';
    const tabindex = this.getAttribute('tabindex');
    const isInvalid =
      (this.hasAttribute('validation') && this.getAttribute('validation') === 'error') ||
      this.hasAttribute('invalid') ||
      this.getAttribute('data-invalid') === 'true';

    select.disabled = disabled;
    select.required = required;
    select.name = name;
    select.setAttribute('aria-label', ariaLabel);

    if (tabindex != null) select.setAttribute('tabindex', tabindex);
    else select.removeAttribute('tabindex');

    if (isInvalid) select.setAttribute('aria-invalid', 'true');
    else select.removeAttribute('aria-invalid');

    if (this.hasAttribute('value')) {
      const next = this.getAttribute('value') || '';
      if (select.value !== next) select.value = next;
    }
  }

  protected override render(): void {
    const labelAttr = this.getAttribute('label') || '';
    const descriptionAttr = this.getAttribute('description') || '';
    const errorAttr = this.getAttribute('error') || '';
    const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
    const disabled = this.disabled;
    const name = this.getAttribute('name') || '';
    const tabindex = this.getAttribute('tabindex');
    const ariaLabel = this.getAttribute('aria-label') || labelAttr || 'Select';

    const hasLabel = !!labelAttr || this._hasSlotContent('label');
    const hasDescription = !!descriptionAttr || this._hasSlotContent('description');
    const hasError = !!errorAttr || this._hasSlotContent('error');
    const hasLeading = this._hasSlotContent('leading');
    const hasTrailing = this._hasSlotContent('trailing');

    const descriptionId = `${this._uid}-description`;
    const errorId = `${this._uid}-error`;
    const describedBy = [hasDescription ? descriptionId : '', hasError ? errorId : ''].filter(Boolean).join(' ');

    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="meta" part="meta" ${hasLabel || hasDescription ? '' : 'hidden'}>
          <label class="label" part="label" id="${this._uid}-label" ${hasLabel ? '' : 'hidden'}>
            <slot name="label">${escapeHtml(labelAttr)}</slot>
            ${required ? '<span class="required" aria-hidden="true">*</span>' : ''}
          </label>
          <p class="description" part="description" id="${descriptionId}" ${hasDescription ? '' : 'hidden'}>
            <slot name="description">${escapeHtml(descriptionAttr)}</slot>
          </p>
        </div>
        <div class="control" part="control" data-has-leading="${hasLeading}" data-has-trailing="${hasTrailing}">
          <span class="leading" part="leading" ${hasLeading ? '' : 'hidden'}>
            <slot name="leading"></slot>
          </span>
          <span class="select-wrap" part="select-wrap">
            <select
              part="select"
              ${disabled ? 'disabled' : ''}
              ${required ? 'required' : ''}
              ${name ? `name="${escapeHtml(name)}"` : ''}
              ${tabindex != null ? `tabindex="${escapeHtml(tabindex)}"` : ''}
              aria-label="${escapeHtml(ariaLabel)}"
              ${describedBy ? `aria-describedby="${escapeHtml(describedBy)}"` : ''}
              ${(this.hasAttribute('validation') && this.getAttribute('validation') === 'error') || this.hasAttribute('invalid') ? 'aria-invalid="true"' : ''}
            ></select>
          </span>
          <span class="trailing" part="trailing" ${hasTrailing ? '' : 'hidden'}>
            <slot name="trailing"></slot>
          </span>
          <span class="indicator" part="indicator" aria-hidden="true"></span>
        </div>
        <p class="error" part="error" id="${errorId}" ${hasError ? '' : 'hidden'}>
          <slot name="error">${escapeHtml(errorAttr)}</slot>
        </p>
      </div>
    `);

    const select = this.root.querySelector('select') as HTMLSelectElement | null;
    this._select = select;
    if (select) {
      this._syncOptions(select);
      this._syncControlState();
    }
  }

  protected override shouldRenderOnAttributeChange(
    name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return name === 'label' || name === 'description' || name === 'error';
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-select')) {
  customElements.define('ui-select', UISelect);
}

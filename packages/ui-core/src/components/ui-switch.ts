import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-switch-width: 44px;
    --ui-switch-height: 24px;
    --ui-switch-padding: 2px;
    --ui-switch-radius: 999px;
    --ui-switch-gap: 12px;
    --ui-switch-track-bg: var(--ui-color-surface-alt, #e2e8f0);
    --ui-switch-track-hover: color-mix(in srgb, var(--ui-switch-track-bg) 84%, var(--ui-color-muted, #64748b));
    --ui-switch-track-border: var(--ui-color-border, #cbd5e1);
    --ui-switch-thumb-bg: var(--ui-color-surface, #ffffff);
    --ui-switch-thumb-color: var(--ui-color-muted, #64748b);
    --ui-switch-label: var(--ui-color-text, #0f172a);
    --ui-switch-description: var(--ui-color-muted, #64748b);
    --ui-switch-accent: var(--ui-switch-checked-bg, var(--ui-color-primary, #2563eb));
    --ui-switch-accent-hover: color-mix(in srgb, var(--ui-switch-accent) 86%, #0f172a);
    --ui-switch-accent-contrast: var(--ui-color-primary-foreground, #ffffff);
    --ui-switch-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-switch-shadow: none;
    --ui-switch-thumb-shadow: none;
    --ui-switch-elevation: none;
    --ui-switch-transition: 170ms cubic-bezier(0.22, 0.8, 0.2, 1);
    --ui-switch-thumb-shift: calc(var(--ui-switch-width) - var(--ui-switch-height));

    color-scheme: light dark;
    display: inline-flex;
    min-inline-size: 0;
    vertical-align: middle;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  :host(:dir(rtl)) {
    --ui-switch-thumb-shift: calc((var(--ui-switch-width) - var(--ui-switch-height)) * -1);
  }

  .shell {
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--ui-switch-gap);
    color: var(--ui-switch-label);
    cursor: pointer;
  }

  .control {
    inline-size: var(--ui-switch-width);
    block-size: var(--ui-switch-height);
    border: 1px solid var(--ui-switch-track-border);
    border-radius: var(--ui-switch-radius);
    background: var(--ui-switch-track-bg);
    box-shadow: var(--ui-switch-elevation);
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    transition:
      background-color var(--ui-switch-transition),
      border-color var(--ui-switch-transition),
      box-shadow var(--ui-switch-transition),
      transform var(--ui-switch-transition);
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    outline: none;
  }

  .thumb {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: var(--ui-switch-padding);
    inline-size: calc(var(--ui-switch-height) - (var(--ui-switch-padding) * 2));
    block-size: calc(var(--ui-switch-height) - (var(--ui-switch-padding) * 2));
    border-radius: calc(var(--ui-switch-radius) - var(--ui-switch-padding));
    background: var(--ui-switch-thumb-bg);
    box-shadow: var(--ui-switch-thumb-shadow);
    display: inline-grid;
    place-items: center;
    color: var(--ui-switch-thumb-color);
    transition:
      transform var(--ui-switch-transition),
      background-color var(--ui-switch-transition),
      color var(--ui-switch-transition),
      box-shadow var(--ui-switch-transition);
    overflow: hidden;
    transform: translateY(-50%);
  }

  .thumb-icon,
  .spinner {
    grid-area: 1 / 1;
    inline-size: 10px;
    block-size: 10px;
    transition: opacity 140ms ease, transform 140ms ease;
  }

  .thumb-icon {
    display: inline-grid;
    place-items: center;
    font-size: 9px;
    line-height: 10px;
  }

  .icon-on {
    opacity: 0;
    transform: scale(0.86);
  }

  .icon-off {
    opacity: 1;
    transform: scale(1);
  }

  .spinner {
    position: absolute;
    border-radius: 999px;
    border: 1.5px solid color-mix(in srgb, currentColor 25%, transparent);
    border-top-color: currentColor;
    opacity: 0;
    animation: ui-switch-spin 700ms linear infinite;
  }

  .label-wrap {
    min-inline-size: 0;
    display: grid;
    gap: 2px;
  }

  .label,
  .description {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .label {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: -0.005em;
  }

  .description {
    color: var(--ui-switch-description);
    font-size: 12px;
    line-height: 1.35;
  }

  .label[hidden],
  .description[hidden],
  .label-wrap[hidden] {
    display: none;
  }

  :host([checked]) .control {
    background: var(--ui-switch-accent);
    border-color: color-mix(in srgb, var(--ui-switch-accent) 76%, #0f172a);
  }

  :host([checked]) .thumb {
    transform: translate(var(--ui-switch-thumb-shift), -50%);
    color: var(--ui-switch-accent);
  }

  :host([checked]) .icon-on {
    opacity: 1;
    transform: scale(1);
  }

  :host([checked]) .icon-off {
    opacity: 0;
    transform: scale(0.86);
  }

  :host([checked]) .control {
    color: var(--ui-switch-accent-contrast);
  }

  :host(:not([disabled]):not([loading])) .control:hover {
    background: var(--ui-switch-track-hover);
  }

  :host([checked]:not([disabled]):not([loading])) .control:hover {
    background: var(--ui-switch-accent-hover);
  }

  :host(:not([disabled]):not([loading])) .control:active {
    transform: scale(0.98);
  }

  :host(:focus-visible) .control,
  .control:focus-visible {
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-switch-focus) 28%, transparent),
      var(--ui-switch-elevation);
  }

  :host([disabled]) .shell,
  :host([loading]) .shell {
    cursor: not-allowed;
  }

  :host([disabled]) .control,
  :host([loading]) .control {
    opacity: 0.56;
    box-shadow: none;
    transform: none;
    cursor: not-allowed;
  }

  :host([loading]) .spinner {
    opacity: 1;
  }

  :host([loading]) .thumb-icon {
    opacity: 0;
    transform: scale(0.8);
  }

  :host([disabled]) .label-wrap,
  :host([loading]) .label-wrap {
    opacity: 0.7;
  }

  :host([size="sm"]) {
    --ui-switch-width: 36px;
    --ui-switch-height: 20px;
    --ui-switch-padding: 2px;
    --ui-switch-gap: 10px;
  }

  :host([size="sm"]) .label {
    font-size: 13px;
  }

  :host([size="sm"]) .description {
    font-size: 11px;
  }

  :host([size="lg"]) {
    --ui-switch-width: 52px;
    --ui-switch-height: 28px;
    --ui-switch-padding: 3px;
    --ui-switch-gap: 12px;
  }

  :host([size="lg"]) .label {
    font-size: 15px;
  }

  :host([shape="rounded"]) {
    --ui-switch-radius: 10px;
  }

  :host([shape="square"]) {
    --ui-switch-radius: 6px;
  }

  :host([shape="pill"]) {
    --ui-switch-radius: 999px;
  }

  :host([elevation="none"]) {
    --ui-switch-elevation: none;
    --ui-switch-thumb-shadow: none;
  }

  :host([elevation="high"]) {
    --ui-switch-elevation: 0 2px 4px rgba(15, 23, 42, 0.1), 0 12px 30px rgba(15, 23, 42, 0.14);
    --ui-switch-thumb-shadow: 0 2px 6px rgba(15, 23, 42, 0.24);
  }

  :host([variant="soft"]) {
    --ui-switch-track-bg: color-mix(in srgb, var(--ui-switch-accent) 14%, var(--ui-color-surface, #ffffff));
    --ui-switch-track-hover: color-mix(in srgb, var(--ui-switch-accent) 22%, var(--ui-color-surface, #ffffff));
    --ui-switch-track-border: color-mix(in srgb, var(--ui-switch-accent) 34%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="outline"]) {
    --ui-switch-track-bg: transparent;
    --ui-switch-track-hover: color-mix(in srgb, var(--ui-switch-accent) 12%, transparent);
    --ui-switch-track-border: color-mix(in srgb, var(--ui-switch-accent) 54%, var(--ui-color-border, #cbd5e1));
    --ui-switch-elevation: none;
  }

  :host([variant="minimal"]) {
    --ui-switch-track-bg: transparent;
    --ui-switch-track-hover: color-mix(in srgb, var(--ui-color-surface-alt, #e2e8f0) 75%, transparent);
    --ui-switch-track-border: transparent;
    --ui-switch-elevation: none;
  }

  :host([variant="contrast"]) {
    --ui-switch-track-bg: #1f2937;
    --ui-switch-track-hover: #334155;
    --ui-switch-track-border: #475569;
    --ui-switch-thumb-bg: #e2e8f0;
    --ui-switch-thumb-color: #334155;
    --ui-switch-label: #e2e8f0;
    --ui-switch-description: #9ca3af;
    --ui-switch-accent: #93c5fd;
    --ui-switch-accent-hover: #60a5fa;
    --ui-switch-accent-contrast: #0f172a;
    --ui-switch-focus: #93c5fd;
  }

  :host([tone="success"]) {
    --ui-switch-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-switch-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-switch-accent: var(--ui-color-danger, #dc2626);
  }

  :host([headless]) .control {
    display: none;
  }

  :host([headless]) .shell {
    gap: 0;
  }

  @keyframes ui-switch-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .thumb,
    .thumb-icon,
    .spinner {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .control {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-switch-track-bg: Canvas;
      --ui-switch-track-hover: Canvas;
      --ui-switch-track-border: CanvasText;
      --ui-switch-thumb-bg: Canvas;
      --ui-switch-thumb-color: CanvasText;
      --ui-switch-label: CanvasText;
      --ui-switch-description: CanvasText;
      --ui-switch-accent: Highlight;
      --ui-switch-accent-hover: Highlight;
      --ui-switch-focus: Highlight;
      --ui-switch-elevation: none;
      --ui-switch-thumb-shadow: none;
    }

    :host([checked]) .control {
      border-color: Highlight;
    }

    :host([checked]) .thumb {
      color: Highlight;
      background: HighlightText;
    }
  }
`;

const TEMPLATE_ATTRS = new Set(['label', 'description']);

function isTruthy(raw: string | null): boolean {
  if (raw == null) return false;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hasInteractiveInPath(path: EventTarget[]): boolean {
  for (const target of path) {
    if (!(target instanceof HTMLElement)) continue;
    if (
      target.matches(
        'a,button,input,select,textarea,[contenteditable="true"],[data-ui-switch-no-toggle]'
      )
    ) {
      return true;
    }
  }
  return false;
}

export class UISwitch extends ElementBase {
  static get observedAttributes() {
    return [
      'checked',
      'disabled',
      'headless',
      'loading',
      'size',
      'variant',
      'tone',
      'shape',
      'elevation',
      'label',
      'description',
      'name',
      'value',
      'required',
      'tabindex',
      'aria-label'
    ];
  }

  private _control: HTMLButtonElement | null = null;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);
    this._syncAria();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (TEMPLATE_ATTRS.has(name)) {
      super.attributeChangedCallback(name, oldValue, newValue);
      return;
    }

    this._syncAria();
  }

  get checked(): boolean {
    return this.hasAttribute('checked');
  }

  set checked(next: boolean) {
    if (next) this.setAttribute('checked', '');
    else this.removeAttribute('checked');
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled') || this.hasAttribute('loading');
  }

  set disabled(next: boolean) {
    if (next) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  toggle(force?: boolean): void {
    if (this.disabled) return;

    const next = typeof force === 'boolean' ? force : !this.checked;
    if (next === this.checked) {
      this._syncAria();
      return;
    }

    this.checked = next;
    this._syncAria();

    const detail = {
      checked: next,
      value: this.getAttribute('value') || 'on',
      name: this.getAttribute('name') || '',
      required: isTruthy(this.getAttribute('required'))
    };

    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _syncAria(): void {
    const checked = this.checked;
    const disabled = this.disabled;
    const loading = this.hasAttribute('loading');
    const required = isTruthy(this.getAttribute('required'));

    this.setAttribute('role', 'switch');
    this.setAttribute('aria-checked', checked ? 'true' : 'false');
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.setAttribute('aria-busy', loading ? 'true' : 'false');
    if (required) this.setAttribute('aria-required', 'true');
    else this.removeAttribute('aria-required');

    const rememberedTabIndex = this.getAttribute('data-ui-switch-tabindex');
    if (disabled) {
      if (rememberedTabIndex == null) {
        this.setAttribute('data-ui-switch-tabindex', this.getAttribute('tabindex') || '');
      }
      if (this.getAttribute('tabindex') !== '-1') {
        this.setAttribute('tabindex', '-1');
      }
    } else if (rememberedTabIndex != null) {
      if (rememberedTabIndex) this.setAttribute('tabindex', rememberedTabIndex);
      else this.removeAttribute('tabindex');
      this.removeAttribute('data-ui-switch-tabindex');
    } else if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    if (this._control) {
      this._control.disabled = disabled;
    }
  }

  private _onClick(event: MouseEvent): void {
    if (this.disabled) return;

    const path = event.composedPath();
    const clickedControl = path.some(
      (target) => target instanceof HTMLElement && target.classList.contains('control')
    );
    if (!clickedControl && hasInteractiveInPath(path)) return;

    const target = event.target;
    const clickedShell = target instanceof HTMLElement ? target.closest('.shell') : null;
    if (!clickedShell) return;

    this.toggle();
    this.focus({ preventScroll: true });
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (this.disabled || event.defaultPrevented) return;

    const target = event.target;
    if (target instanceof HTMLElement && target !== this && !target.closest('.control')) {
      return;
    }

    const rtl = getComputedStyle(this).direction === 'rtl';

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.toggle(rtl);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.toggle(!rtl);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.toggle(false);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.toggle(true);
    }
  }

  private _onSlotChange(): void {
    this.requestRender();
  }

  protected override render(): void {
    const checked = this.checked;
    const disabled = this.disabled;
    const label = (this.getAttribute('label') || '').trim();
    const description = (this.getAttribute('description') || '').trim();
    const hasDefaultSlotContent = Array.from(this.childNodes).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      const element = node as Element;
      return !element.getAttribute('slot');
    });
    const hasDescriptionSlot = !!this.querySelector('[slot="description"]');
    const showLabel = !!label || hasDefaultSlotContent;
    const showDescription = !!description || hasDescriptionSlot;
    const showLabelWrap = showLabel || showDescription;

    this.setContent(`
      <style>${style}</style>
      <span class="shell" part="shell">
        <button
          type="button"
          class="control"
          part="control"
          aria-hidden="true"
          tabindex="-1"
          ${disabled ? 'disabled' : ''}
        >
          <span class="thumb" part="thumb">
            <span class="spinner" aria-hidden="true"></span>
            <span class="thumb-icon icon-on" aria-hidden="true">✓</span>
            <span class="thumb-icon icon-off" aria-hidden="true">•</span>
          </span>
        </button>
        <span class="label-wrap" part="label-wrap" ${showLabelWrap ? '' : 'hidden'}>
          <span class="label" part="label" ${showLabel ? '' : 'hidden'}><slot>${escapeHtml(label)}</slot></span>
          <span class="description" part="description" ${showDescription ? '' : 'hidden'}><slot name="description">${escapeHtml(description)}</slot></span>
        </span>
      </span>
    `);

    this._control = this.root.querySelector('.control') as HTMLButtonElement | null;
    this._syncAria();

    // Keep checked state reflected in initial paint for forced-colors/high-contrast AT combinations.
    this.setAttribute('aria-checked', checked ? 'true' : 'false');
  }

  protected override shouldRenderOnAttributeChange(
    name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return TEMPLATE_ATTRS.has(name);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-switch')) {
  customElements.define('ui-switch', UISwitch);
}

import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-switch-width: 44px;
    --ui-switch-height: 26px;
    --ui-switch-padding: 3px;
    --ui-switch-radius: 999px;
    --ui-switch-bg: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-switch-bg-hover: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 80%, #94a3b8);
    --ui-switch-thumb: #ffffff;
    --ui-switch-thumb-border: color-mix(in srgb, #0f172a 12%, transparent);
    --ui-switch-text: var(--ui-color-text, #0f172a);
    --ui-switch-muted: var(--ui-color-muted, #64748b);
    --ui-switch-accent: var(--ui-switch-checked-bg, var(--ui-color-primary, #2563eb));
    --ui-switch-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-switch-shadow:
      0 1px 2px rgba(15, 23, 42, 0.08),
      0 10px 24px rgba(15, 23, 42, 0.12);
    --ui-switch-thumb-shadow:
      0 2px 6px rgba(15, 23, 42, 0.22),
      0 0 0 1px var(--ui-switch-thumb-border);
    --ui-switch-transition: 180ms cubic-bezier(0.22, 0.7, 0.2, 1);

    color-scheme: light dark;
    display: inline-flex;
    min-inline-size: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .shell {
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--ui-switch-text);
  }

  .control {
    inline-size: var(--ui-switch-width);
    block-size: var(--ui-switch-height);
    border: 1px solid color-mix(in srgb, var(--ui-switch-bg) 70%, #0f172a 8%);
    border-radius: var(--ui-switch-radius);
    background: var(--ui-switch-bg);
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
    inset-block-start: var(--ui-switch-padding);
    inset-inline-start: var(--ui-switch-padding);
    inline-size: calc(var(--ui-switch-height) - (var(--ui-switch-padding) * 2));
    block-size: calc(var(--ui-switch-height) - (var(--ui-switch-padding) * 2));
    border-radius: 999px;
    background: var(--ui-switch-thumb);
    box-shadow: var(--ui-switch-thumb-shadow);
    display: inline-grid;
    place-items: center;
    color: color-mix(in srgb, var(--ui-switch-accent) 76%, #0f172a 24%);
    transition:
      transform var(--ui-switch-transition),
      background-color var(--ui-switch-transition),
      color var(--ui-switch-transition),
      box-shadow var(--ui-switch-transition);
  }

  .thumb-icon {
    font-size: 10px;
    line-height: 1;
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 150ms ease, transform 150ms ease;
  }

  .thumb-icon-on {
    opacity: 0;
  }

  .thumb-icon-off {
    opacity: 1;
    transform: scale(1);
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
    font-size: 13px;
    font-weight: 600;
    line-height: 1.2;
  }

  .description {
    color: var(--ui-switch-muted);
    font-size: 12px;
    line-height: 1.25;
  }

  .description[hidden],
  .label[hidden] {
    display: none;
  }

  :host([checked]) .control {
    background: color-mix(in srgb, var(--ui-switch-accent) 88%, #ffffff 12%);
    border-color: color-mix(in srgb, var(--ui-switch-accent) 74%, #0f172a 26%);
    box-shadow: var(--ui-switch-shadow);
  }

  :host([checked]) .thumb {
    transform: translateX(calc(var(--ui-switch-width) - var(--ui-switch-height)));
  }

  :host([checked]) .thumb-icon-on {
    opacity: 1;
    transform: scale(1);
  }

  :host([checked]) .thumb-icon-off {
    opacity: 0;
    transform: scale(0.8);
  }

  :host(:not([disabled])) .control:hover {
    background: var(--ui-switch-bg-hover);
  }

  :host([checked]:not([disabled])) .control:hover {
    background: color-mix(in srgb, var(--ui-switch-accent) 82%, #0f172a 18%);
  }

  :host(:not([disabled])) .control:active {
    transform: scale(0.98);
  }

  :host(:focus-visible) .control,
  .control:focus-visible {
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-switch-focus) 28%, transparent),
      var(--ui-switch-shadow);
  }

  :host([loading]) .control {
    cursor: progress;
  }

  :host([disabled]) .control {
    opacity: 0.56;
    cursor: not-allowed;
    box-shadow: none;
  }

  :host([disabled]) .label-wrap {
    opacity: 0.66;
  }

  :host([size="sm"]) {
    --ui-switch-width: 36px;
    --ui-switch-height: 22px;
    --ui-switch-padding: 2px;
  }

  :host([size="lg"]) {
    --ui-switch-width: 52px;
    --ui-switch-height: 30px;
    --ui-switch-padding: 3px;
  }

  :host([variant="soft"]) {
    --ui-switch-bg: color-mix(in srgb, var(--ui-switch-accent) 18%, var(--ui-color-surface, #ffffff));
    --ui-switch-bg-hover: color-mix(in srgb, var(--ui-switch-accent) 24%, var(--ui-color-surface, #ffffff));
  }

  :host([variant="outline"]) .control {
    background: transparent;
    border-color: color-mix(in srgb, var(--ui-switch-accent) 48%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="contrast"]) {
    --ui-switch-bg: #1e293b;
    --ui-switch-bg-hover: #334155;
    --ui-switch-thumb: #e2e8f0;
    --ui-switch-text: #e2e8f0;
    --ui-switch-muted: #94a3b8;
    --ui-switch-accent: #93c5fd;
    --ui-switch-focus: #93c5fd;
  }

  :host([variant="minimal"]) .control {
    border-color: transparent;
    box-shadow: none;
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

  @media (prefers-reduced-motion: reduce) {
    .control,
    .thumb,
    .thumb-icon {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .control {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-switch-bg: Canvas;
      --ui-switch-bg-hover: Canvas;
      --ui-switch-thumb: Canvas;
      --ui-switch-text: CanvasText;
      --ui-switch-muted: CanvasText;
      --ui-switch-accent: Highlight;
      --ui-switch-focus: Highlight;
      --ui-switch-shadow: none;
      --ui-switch-thumb-shadow: none;
    }

    .control {
      border-color: CanvasText;
    }

    :host([checked]) .control {
      border-color: Highlight;
      background: Highlight;
    }

    :host([checked]) .thumb {
      background: HighlightText;
    }
  }
`;

function isTruthy(raw: string | null): boolean {
  if (raw == null) return false;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
      'label',
      'description',
      'name',
      'value',
      'required'
    ];
  }

  private _control: HTMLButtonElement | null = null;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
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

    this.setAttribute('role', 'switch');
    this.setAttribute('aria-checked', checked ? 'true' : 'false');
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', disabled ? '-1' : '0');
    } else if (disabled) {
      this.setAttribute('tabindex', '-1');
    } else if (this.getAttribute('tabindex') === '-1') {
      this.setAttribute('tabindex', '0');
    }

    if (this._control) {
      this._control.setAttribute('aria-checked', checked ? 'true' : 'false');
      this._control.setAttribute('aria-disabled', disabled ? 'true' : 'false');
      this._control.disabled = disabled;
    }
  }

  private _onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (!target.closest('.control')) return;
    this.toggle();
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.toggle(false);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.toggle(true);
    }
  }

  protected override render(): void {
    const checked = this.checked;
    const disabled = this.disabled;
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const hasDefaultSlotContent = Array.from(this.childNodes).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      const element = node as Element;
      return !element.getAttribute('slot');
    });
    const hasDescriptionSlot = !!this.querySelector('[slot="description"]');
    const showLabel = !!label || hasDefaultSlotContent;
    const showDescription = !!description || hasDescriptionSlot;

    this.setContent(`
      <style>${style}</style>
      <span class="shell" part="shell">
        <button
          type="button"
          class="control"
          part="control"
          role="switch"
          aria-checked="${checked ? 'true' : 'false'}"
          aria-disabled="${disabled ? 'true' : 'false'}"
          ${disabled ? 'disabled' : ''}
        >
          <span class="thumb" part="thumb">
            <span class="thumb-icon thumb-icon-on" aria-hidden="true">✓</span>
            <span class="thumb-icon thumb-icon-off" aria-hidden="true">•</span>
          </span>
        </button>
        <span class="label-wrap" part="label-wrap">
          <span class="label" part="label" ${showLabel ? '' : 'hidden'}><slot>${escapeHtml(label)}</slot></span>
          <span class="description" part="description" ${showDescription ? '' : 'hidden'}><slot name="description">${escapeHtml(description)}</slot></span>
        </span>
      </span>
    `);

    this._control = this.root.querySelector('.control') as HTMLButtonElement | null;
    this._syncAria();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-switch')) {
  customElements.define('ui-switch', UISwitch);
}

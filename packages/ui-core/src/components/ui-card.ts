import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-card-radius: var(--base-card-radius, var(--ui-radius, 4px));
    --ui-card-bg: var(--base-card-bg, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
    --ui-card-color: var(--ui-color-text, var(--ui-text, #202020));
    --ui-card-border-color: color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.16)) 82%, transparent);
    --ui-card-border: var(--base-card-border, 1px solid var(--ui-card-border-color));
    --ui-card-shadow: var(--base-card-shadow, var(--shadow-2, none));
    --ui-card-padding: 16px;
    --ui-card-gap: var(--ui-default-gap, 8px);
    --ui-card-header-gap: 4px;
    --ui-card-title-size: 18px;
    --ui-card-title-line-height: 24px;
    --ui-card-description-size: 14px;
    --ui-card-description-line-height: 20px;
    --ui-card-footer-size: 13px;
    --ui-card-footer-line-height: 18px;
    --ui-card-media-min-height: 148px;
    --ui-card-backdrop: none;
    --ui-card-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    display: block;
    min-inline-size: 0;
    box-sizing: border-box;
    color-scheme: light dark;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-card-padding: 12px;
    --ui-card-gap: 8px;
    --ui-card-header-gap: 3px;
    --ui-card-title-size: 16px;
    --ui-card-title-line-height: 22px;
    --ui-card-description-size: 13px;
    --ui-card-description-line-height: 18px;
    --ui-card-footer-size: 12px;
    --ui-card-footer-line-height: 16px;
    --ui-card-media-min-height: 112px;
  }

  :host([size="md"]),
  :host([size="2"]) {
    --ui-card-padding: 16px;
    --ui-card-gap: var(--ui-default-gap, 8px);
    --ui-card-header-gap: 4px;
    --ui-card-title-size: 18px;
    --ui-card-title-line-height: 24px;
    --ui-card-description-size: 14px;
    --ui-card-description-line-height: 20px;
    --ui-card-footer-size: 13px;
    --ui-card-footer-line-height: 18px;
    --ui-card-media-min-height: 148px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-card-padding: 24px;
    --ui-card-gap: 12px;
    --ui-card-header-gap: 6px;
    --ui-card-title-size: 22px;
    --ui-card-title-line-height: 30px;
    --ui-card-description-size: 16px;
    --ui-card-description-line-height: 24px;
    --ui-card-footer-size: 14px;
    --ui-card-footer-line-height: 20px;
    --ui-card-media-min-height: 196px;
  }

  :host([tone="info"]) {
    --ui-card-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
  }

  :host([tone="success"]) {
    --ui-card-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-card-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-card-accent: var(--ui-color-danger, #dc2626);
  }

  :host([variant="outline"]) {
    --ui-card-shadow: none;
    --ui-card-bg: color-mix(in srgb, var(--color-panel-solid, var(--ui-color-surface, #ffffff)) 96%, transparent);
    --ui-card-border-color: color-mix(in srgb, var(--ui-card-accent) 18%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
  }

  :host([variant="soft"]) {
    --ui-card-bg: color-mix(in srgb, var(--ui-card-accent) 6%, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
    --ui-card-shadow: none;
    --ui-card-border-color: color-mix(in srgb, var(--ui-card-accent) 12%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
  }

  :host([variant="ghost"]) {
    --ui-card-bg: transparent;
    --ui-card-shadow: none;
    --ui-card-border-color: color-mix(in srgb, var(--ui-card-accent) 10%, transparent);
  }

  :host([variant="solid"]) {
    --ui-card-bg: color-mix(in srgb, var(--ui-card-accent) 14%, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
    --ui-card-border-color: color-mix(in srgb, var(--ui-card-accent) 24%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-card-shadow:
      0 1px 3px rgba(15, 23, 42, 0.06),
      0 18px 36px color-mix(in srgb, var(--ui-card-accent) 10%, rgba(15, 23, 42, 0.08));
  }

  :host([variant="glass"]) {
    --ui-card-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-panel-solid, var(--ui-color-surface, #ffffff)) 88%, #ffffff 12%),
        color-mix(in srgb, var(--color-panel-solid, var(--ui-color-surface, #ffffff)) 94%, transparent)
      );
    --ui-card-backdrop: var(--base-panel-backdrop, var(--backdrop-filter-panel, blur(16px)));
  }

  :host([elevation="none"]) {
    --ui-card-shadow: none;
  }

  :host([elevation="low"]) {
    --ui-card-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 8px 18px rgba(15, 23, 42, 0.08);
  }

  :host([elevation="high"]) {
    --ui-card-shadow:
      0 2px 8px rgba(15, 23, 42, 0.08),
      0 26px 54px rgba(15, 23, 42, 0.16);
  }

  :host([interactive]) {
    cursor: pointer;
  }

  :host([interactive]) .card {
    transition:
      transform 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      box-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      border-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
  }

  :host([interactive]:not([disabled])):hover .card {
    transform: translateY(-1px);
    box-shadow:
      0 2px 8px rgba(15, 23, 42, 0.08),
      0 28px 56px rgba(15, 23, 42, 0.14);
    border-color: color-mix(in srgb, var(--ui-card-accent) 18%, var(--ui-card-border-color));
  }

  :host([interactive]:not([disabled])):focus-visible {
    outline: none;
  }

  :host([interactive]:not([disabled])):focus-visible .card {
    border-color: color-mix(in srgb, var(--ui-card-accent) 24%, var(--ui-card-border-color));
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-card-accent) 20%, transparent),
      var(--ui-card-shadow);
  }

  :host([interactive]:not([disabled])):active .card {
    transform: translateY(0);
  }

  :host([disabled]) {
    opacity: 0.64;
    pointer-events: none;
  }

  .card {
    display: grid;
    gap: var(--ui-card-gap);
    min-inline-size: 0;
    box-sizing: border-box;
    border-radius: var(--ui-card-radius);
    border: var(--ui-card-border);
    background: var(--ui-card-bg);
    color: var(--ui-card-color);
    box-shadow: var(--ui-card-shadow);
    backdrop-filter: var(--ui-card-backdrop);
    overflow: hidden;
  }

  .section {
    min-inline-size: 0;
    box-sizing: border-box;
  }

  .header,
  .body,
  .footer {
    padding-inline: var(--ui-card-padding);
  }

  .header {
    padding-top: var(--ui-card-padding);
  }

  .body {
    display: grid;
    gap: var(--ui-card-gap);
  }

  .footer {
    padding-bottom: var(--ui-card-padding);
  }

  .header[hidden],
  .footer[hidden],
  .media[hidden],
  .inset[hidden] {
    display: none;
  }

  .body:first-child {
    padding-top: var(--ui-card-padding);
  }

  .body:last-child {
    padding-bottom: var(--ui-card-padding);
  }

  .media {
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: var(--ui-card-media-min-height);
    line-height: 0;
  }

  .media ::slotted(*) {
    display: block;
    inline-size: 100%;
    max-inline-size: 100%;
  }

  .inset {
    min-inline-size: 0;
  }

  .inset ::slotted(*) {
    display: block;
    inline-size: 100%;
    max-inline-size: 100%;
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-card-border: 2px solid var(--ui-card-border-color);
      --ui-card-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-card-bg: Canvas;
      --ui-card-color: CanvasText;
      --ui-card-border-color: CanvasText;
      --ui-card-shadow: none;
    }

    .card {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
    }
  }
`;

function normalizeRadius(value: string | null): string {
  if (!value || !value.trim()) return 'var(--base-card-radius, var(--ui-radius, 4px))';
  const trimmed = value.trim().toLowerCase();
  if (trimmed === 'full') return '999px';
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`;
  return value;
}

export class UICard extends ElementBase {
  static get observedAttributes() {
    return ['variant', 'size', 'radius', 'tone', 'elevation', 'interactive', 'disabled', 'tabindex', 'role'];
  }

  private _slotCleanup: Array<() => void> = [];
  private _onKeyDownBound = this._onKeyDown.bind(this);

  override connectedCallback(): void {
    super.connectedCallback();
    this._syncHostStyles();
    this.addEventListener('keydown', this._onKeyDownBound);
    this._syncAccessibilityState();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._onKeyDownBound);
    this._cleanupSlotListeners();
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;
    if (name === 'radius') this._syncHostStyles();
    if (name === 'interactive' || name === 'disabled' || name === 'tabindex' || name === 'role') {
      this._syncAccessibilityState();
    }
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <article class="card" part="card" role="group">
        <div class="section media" part="media" hidden>
          <slot name="media"></slot>
        </div>
        <div class="section inset" part="inset" hidden>
          <slot name="inset"></slot>
        </div>
        <div class="section header" part="header" hidden>
          <slot name="header"></slot>
        </div>
        <div class="section body" part="body">
          <slot></slot>
        </div>
        <div class="section footer" part="footer" hidden>
          <slot name="footer"></slot>
        </div>
      </article>
    `);

    this._syncHostStyles();
    this._bindSlotListeners();
    this._syncSlotState();
  }

  private _syncHostStyles(): void {
    this.style.setProperty('--ui-card-radius', normalizeRadius(this.getAttribute('radius')));
  }

  private _syncAccessibilityState(): void {
    const interactive = this.hasAttribute('interactive');
    const disabled = this.hasAttribute('disabled');
    if (!interactive) {
      if (this.getAttribute('role') === 'button') this.removeAttribute('role');
      this.removeAttribute('aria-disabled');
      if (this.getAttribute('tabindex') === '0' || this.getAttribute('tabindex') === '-1') {
        this.removeAttribute('tabindex');
      }
      return;
    }

    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', disabled ? '-1' : '0');
    } else if (disabled && this.getAttribute('tabindex') !== '-1') {
      this.setAttribute('tabindex', '-1');
    }
  }

  private _cleanupSlotListeners(): void {
    for (const cleanup of this._slotCleanup) cleanup();
    this._slotCleanup = [];
  }

  private _bindSlotListeners(): void {
    this._cleanupSlotListeners();
    const slots = this.root.querySelectorAll('slot');
    slots.forEach((slot) => {
      const onChange = () => this._syncSlotState();
      slot.addEventListener('slotchange', onChange);
      this._slotCleanup.push(() => slot.removeEventListener('slotchange', onChange));
    });
  }

  private _syncSlotState(): void {
    this._toggleSection('media');
    this._toggleSection('inset');
    this._toggleSection('header');
    this._toggleSection('footer');
  }

  private _toggleSection(name: 'media' | 'inset' | 'header' | 'footer'): void {
    const slot = this.root.querySelector(`slot[name="${name}"]`) as HTMLSlotElement | null;
    const section = this.root.querySelector(`.${name}`) as HTMLElement | null;
    if (!slot || !section) return;
    const assigned = slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      return true;
    });
    section.hidden = !assigned;
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (!this.hasAttribute('interactive') || this.hasAttribute('disabled')) return;
    if (event.defaultPrevented) return;
    if (event.target !== this) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-card': UICard;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-card')) {
  customElements.define('ui-card', UICard);
}

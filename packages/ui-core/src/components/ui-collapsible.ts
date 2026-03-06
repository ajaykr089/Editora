import { ElementBase } from '../ElementBase';

type CollapsibleState = 'idle' | 'loading' | 'error' | 'success';
type CollapsibleSize = 'sm' | 'md' | 'lg';
type CollapsibleVariant = 'default' | 'subtle' | 'outline' | 'ghost';
type CollapsibleTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type CollapsibleIconPosition = 'left' | 'right';
type CollapsibleToggleSource = 'pointer' | 'keyboard' | 'api';

type CollapsibleToggleDetail = {
  open: boolean;
  previousOpen: boolean;
  source: CollapsibleToggleSource;
};

const style = `
  :host {
    --ui-collapsible-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 94%, transparent);
    --ui-collapsible-surface: color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, #ffffff 2%);
    --ui-collapsible-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    --ui-collapsible-text: var(--ui-color-text, #0f172a);
    --ui-collapsible-muted: var(--ui-color-muted, #64748b);
    --ui-collapsible-accent: var(--ui-color-primary, #2563eb);
    --ui-collapsible-radius: 14px;
    --ui-collapsible-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);

    --ui-collapsible-header-min-h: 46px;
    --ui-collapsible-padding-x: 14px;
    --ui-collapsible-padding-y: 11px;

    --ui-collapsible-duration: 170ms;
    --ui-collapsible-easing: cubic-bezier(0.2, 0.8, 0.2, 1);

    display: block;
    min-inline-size: 0;
    color-scheme: light dark;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }

  :host([size="sm"]) {
    --ui-collapsible-header-min-h: 40px;
    --ui-collapsible-padding-x: 12px;
    --ui-collapsible-padding-y: 9px;
  }

  :host([size="lg"]) {
    --ui-collapsible-header-min-h: 52px;
    --ui-collapsible-padding-x: 16px;
    --ui-collapsible-padding-y: 13px;
  }

  :host([tone="neutral"]) {
    --ui-collapsible-accent: color-mix(in srgb, var(--ui-color-muted, #64748b) 82%, var(--ui-color-text, #0f172a) 18%);
  }

  :host([tone="info"]) {
    --ui-collapsible-accent: var(--ui-color-primary, #2563eb);
  }

  :host([tone="success"]) {
    --ui-collapsible-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-collapsible-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-collapsible-accent: var(--ui-color-danger, #dc2626);
  }

  :host([state="error"]) {
    --ui-collapsible-accent: var(--ui-color-danger, #dc2626);
  }

  :host([state="success"]) {
    --ui-collapsible-accent: var(--ui-color-success, #16a34a);
  }

  .shell {
    border: 1px solid var(--ui-collapsible-border);
    border-radius: var(--ui-collapsible-radius);
    background: linear-gradient(164deg, var(--ui-collapsible-surface), var(--ui-collapsible-bg));
    color: var(--ui-collapsible-text);
    box-shadow: var(--ui-collapsible-shadow);
    overflow: clip;
    transition:
      border-color var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      box-shadow var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      background-color var(--ui-collapsible-duration) var(--ui-collapsible-easing);
  }

  :host([variant="subtle"]) .shell {
    background: color-mix(in srgb, var(--ui-collapsible-accent) 5%, var(--ui-collapsible-bg));
  }

  :host([variant="outline"]) .shell {
    background: transparent;
    box-shadow: none;
    border-color: color-mix(in srgb, var(--ui-collapsible-accent) 30%, var(--ui-collapsible-border));
  }

  :host([variant="ghost"]) .shell {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
  }

  .shell[data-open="true"] {
    border-color: color-mix(in srgb, var(--ui-collapsible-accent) 34%, var(--ui-collapsible-border));
  }

  .shell[data-disabled="true"] {
    opacity: 0.72;
  }

  .trigger {
    inline-size: 100%;
    min-block-size: var(--ui-collapsible-header-min-h);
    border: 0;
    margin: 0;
    background: color-mix(in srgb, var(--ui-collapsible-surface) 94%, transparent);
    color: var(--ui-collapsible-text);
    cursor: pointer;
    text-align: left;
    font: inherit;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: var(--ui-collapsible-padding-y) var(--ui-collapsible-padding-x);
    transition:
      background-color var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      color var(--ui-collapsible-duration) var(--ui-collapsible-easing);
  }

  .trigger:hover {
    background: color-mix(in srgb, var(--ui-collapsible-accent) 7%, var(--ui-collapsible-surface));
  }

  .trigger:active {
    transform: translateY(1px);
  }

  .trigger:focus-visible {
    outline: 2px solid var(--ui-collapsible-accent);
    outline-offset: -2px;
    position: relative;
    z-index: 1;
  }

  .shell[data-disabled="true"] .trigger,
  .trigger[disabled] {
    cursor: not-allowed;
  }

  .leading {
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .heading {
    min-inline-size: 0;
    display: grid;
    gap: 2px;
  }

  .title {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    line-height: 1.3;
    font-weight: 650;
    letter-spacing: 0.01em;
  }

  .caption {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    line-height: 1.25;
    color: var(--ui-collapsible-muted);
  }

  .trailing {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-inline-size: 0;
  }

  .meta {
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--ui-collapsible-muted);
    font-size: 12px;
    line-height: 1;
    white-space: nowrap;
  }

  .icon {
    inline-size: 16px;
    block-size: 16px;
    color: color-mix(in srgb, var(--ui-collapsible-accent) 74%, var(--ui-collapsible-text));
    transition:
      transform var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      color var(--ui-collapsible-duration) var(--ui-collapsible-easing);
    flex: 0 0 auto;
  }

  .shell[data-open="true"] .icon {
    transform: rotate(180deg);
  }

  :host([icon-position="left"]) .shell[data-open="true"] .icon {
    transform: rotate(-180deg);
  }

  .panel {
    display: grid;
    grid-template-rows: 0fr;
    border-top: 1px solid transparent;
    transition:
      grid-template-rows var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      border-color var(--ui-collapsible-duration) var(--ui-collapsible-easing);
  }

  .shell[data-open="true"] .panel {
    grid-template-rows: 1fr;
    border-top-color: color-mix(in srgb, var(--ui-collapsible-accent) 20%, var(--ui-collapsible-border));
  }

  .panel-inner {
    min-block-size: 0;
    overflow: hidden;
    padding: 0 var(--ui-collapsible-padding-x);
    color: color-mix(in srgb, var(--ui-collapsible-text) 90%, var(--ui-collapsible-muted) 10%);
    font-size: 14px;
    line-height: 1.55;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-4px);
    pointer-events: none;
    transition:
      opacity var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      transform var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      padding var(--ui-collapsible-duration) var(--ui-collapsible-easing),
      visibility var(--ui-collapsible-duration) var(--ui-collapsible-easing);
  }

  .shell[data-open="true"] .panel-inner {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
    padding: 10px var(--ui-collapsible-padding-x) 14px;
  }

  .state-note {
    margin: 0;
    padding: 0 var(--ui-collapsible-padding-x) 10px;
    font-size: 12px;
    line-height: 1.35;
    color: var(--ui-collapsible-muted);
  }

  :host([state="loading"]) .state-note {
    color: var(--ui-color-warning, #d97706);
  }

  :host([state="error"]) .state-note {
    color: var(--ui-color-danger, #dc2626);
  }

  :host([state="success"]) .state-note {
    color: var(--ui-color-success, #16a34a);
  }

  :host([headless]) .shell {
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  :host([headless]) .trigger {
    background: transparent;
    padding-inline: 0;
  }

  :host([headless]) .trigger:hover {
    background: transparent;
  }

  :host([headless]) .panel-inner,
  :host([headless]) .state-note {
    padding-inline: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .shell,
    .trigger,
    .icon,
    .panel,
    .panel-inner {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .shell,
    .trigger,
    .panel {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-collapsible-bg: Canvas;
      --ui-collapsible-surface: Canvas;
      --ui-collapsible-border: CanvasText;
      --ui-collapsible-text: CanvasText;
      --ui-collapsible-muted: CanvasText;
      --ui-collapsible-accent: Highlight;
      --ui-collapsible-shadow: none;
    }

    .shell,
    .trigger,
    .panel,
    .panel-inner,
    .state-note {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }
  }
`;

function isTruthyAttr(value: string | null): boolean {
  return value !== null && value.toLowerCase() !== 'false' && value !== '0';
}

function normalizeState(value: string | null): CollapsibleState {
  if (value === 'loading' || value === 'error' || value === 'success') return value;
  return 'idle';
}

function normalizeSize(value: string | null): CollapsibleSize {
  if (value === 'sm' || value === 'lg') return value;
  return 'md';
}

function normalizeVariant(value: string | null): CollapsibleVariant {
  if (value === 'subtle' || value === 'outline' || value === 'ghost') return value;
  return 'default';
}

function normalizeTone(value: string | null): CollapsibleTone {
  if (value === 'neutral' || value === 'info' || value === 'success' || value === 'warning' || value === 'danger') {
    return value;
  }
  return 'neutral';
}

function normalizeIconPosition(value: string | null): CollapsibleIconPosition {
  if (value === 'left') return 'left';
  return 'right';
}

function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `ui-collapsible-${Math.random().toString(36).slice(2, 10)}`;
}

export class UICollapsible extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'headless',
      'disabled',
      'readonly',
      'state',
      'size',
      'variant',
      'tone',
      'icon-position',
      'close-on-escape'
    ];
  }

  private _uid = uid();

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this._applyOpenState();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'open' || name === 'disabled' || name === 'readonly') {
      const applied = this._applyOpenState();
      if (applied && name === 'open') return;
    }

    this.requestRender();
  }

  get open(): boolean {
    return isTruthyAttr(this.getAttribute('open'));
  }

  set open(value: boolean) {
    const next = Boolean(value);
    if (next === this.open) return;
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  get headless(): boolean {
    return this.hasAttribute('headless');
  }

  set headless(value: boolean) {
    if (value === this.headless) return;
    if (value) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled') || this.state === 'loading';
  }

  set disabled(value: boolean) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get readonly(): boolean {
    return this.hasAttribute('readonly');
  }

  set readonly(value: boolean) {
    if (value) this.setAttribute('readonly', '');
    else this.removeAttribute('readonly');
  }

  get state(): CollapsibleState {
    return normalizeState(this.getAttribute('state'));
  }

  set state(value: CollapsibleState) {
    const normalized = normalizeState(value);
    if (normalized === 'idle') this.removeAttribute('state');
    else this.setAttribute('state', normalized);
  }

  get size(): CollapsibleSize {
    return normalizeSize(this.getAttribute('size'));
  }

  set size(value: CollapsibleSize) {
    const normalized = normalizeSize(value);
    if (normalized === 'md') this.removeAttribute('size');
    else this.setAttribute('size', normalized);
  }

  get variant(): CollapsibleVariant {
    return normalizeVariant(this.getAttribute('variant'));
  }

  set variant(value: CollapsibleVariant) {
    const normalized = normalizeVariant(value);
    if (normalized === 'default') this.removeAttribute('variant');
    else this.setAttribute('variant', normalized);
  }

  get tone(): CollapsibleTone {
    return normalizeTone(this.getAttribute('tone'));
  }

  set tone(value: CollapsibleTone) {
    const normalized = normalizeTone(value);
    if (normalized === 'neutral') this.removeAttribute('tone');
    else this.setAttribute('tone', normalized);
  }

  get iconPosition(): CollapsibleIconPosition {
    return normalizeIconPosition(this.getAttribute('icon-position'));
  }

  set iconPosition(value: CollapsibleIconPosition) {
    const normalized = normalizeIconPosition(value);
    if (normalized === 'right') this.removeAttribute('icon-position');
    else this.setAttribute('icon-position', normalized);
  }

  private _closeOnEscape(): boolean {
    const raw = this.getAttribute('close-on-escape');
    if (raw == null) return true;
    return isTruthyAttr(raw);
  }

  private _stateNote(): string {
    const state = this.state;
    if (state === 'loading') return 'Updating section…';
    if (state === 'error') return 'Unable to sync this section.';
    if (state === 'success') return 'Section synced successfully.';
    return '';
  }

  private _applyOpenState(): boolean {
    const trigger = this.root.querySelector('.trigger') as HTMLButtonElement | null;
    const shell = this.root.querySelector('.shell') as HTMLElement | null;
    const panel = this.root.querySelector('.panel') as HTMLElement | null;
    const panelInner = this.root.querySelector('.panel-inner') as HTMLElement | null;

    if (!trigger || !shell || !panel || !panelInner) return false;

    const open = this.open;
    const disabled = this.disabled || this.readonly;

    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    trigger.disabled = disabled;

    shell.dataset.open = open ? 'true' : 'false';
    shell.dataset.disabled = disabled ? 'true' : 'false';

    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) panelInner.removeAttribute('inert');
    else panelInner.setAttribute('inert', '');

    return true;
  }

  private _setOpenFromUser(nextOpen: boolean, source: CollapsibleToggleSource): void {
    if (this.disabled || this.readonly) return;

    const previousOpen = this.open;
    if (nextOpen === previousOpen) return;

    this.open = nextOpen;

    const detail: CollapsibleToggleDetail = {
      open: this.open,
      previousOpen,
      source
    };

    this.dispatchEvent(new CustomEvent('toggle', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('ui-toggle', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('ui-change', { detail, bubbles: true, composed: true }));
  }

  private _onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const trigger = target.closest('.trigger');
    if (!trigger) return;

    this._setOpenFromUser(!this.open, 'pointer');
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    if (!this.open) return;
    if (!this._closeOnEscape()) return;
    if (!event.composedPath().includes(this)) return;

    event.preventDefault();
    this._setOpenFromUser(false, 'keyboard');

    const trigger = this.root.querySelector('.trigger') as HTMLButtonElement | null;
    if (!trigger) return;
    queueMicrotask(() => {
      try {
        trigger.focus({ preventScroll: true });
      } catch {
        trigger.focus();
      }
    });
  }

  private _indicatorMarkup(): string {
    return `
      <span class="icon" part="icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 7.5 10 12.5 15 7.5"></path>
        </svg>
      </span>
    `;
  }

  protected override render(): void {
    const open = this.open;
    const disabled = this.disabled || this.readonly;
    const triggerId = `${this._uid}-trigger`;
    const panelId = `${this._uid}-panel`;
    const state = this.state;
    const size = this.size;
    const variant = this.variant;
    const tone = this.tone;
    const iconPosition = this.iconPosition;
    const stateNote = this._stateNote();

    if (size !== 'md') this.setAttribute('size', size);
    else this.removeAttribute('size');

    if (variant !== 'default') this.setAttribute('variant', variant);
    else this.removeAttribute('variant');

    if (tone !== 'neutral') this.setAttribute('tone', tone);
    else this.removeAttribute('tone');

    if (state !== 'idle') this.setAttribute('state', state);
    else this.removeAttribute('state');

    if (iconPosition !== 'right') this.setAttribute('icon-position', iconPosition);
    else this.removeAttribute('icon-position');

    this.setContent(`
      <style>${style}</style>
      <section class="shell" part="base" data-open="${open ? 'true' : 'false'}" data-disabled="${disabled ? 'true' : 'false'}">
        <button
          id="${triggerId}"
          class="trigger"
          part="header trigger"
          type="button"
          aria-controls="${panelId}"
          aria-expanded="${open ? 'true' : 'false'}"
          ${disabled ? 'disabled' : ''}
        >
          <span class="leading">
            ${iconPosition === 'left' ? this._indicatorMarkup() : ''}
            <span class="heading">
              <span class="title"><slot name="header">Details</slot></span>
              <span class="caption"><slot name="caption"></slot></span>
            </span>
          </span>
          <span class="trailing">
            <span class="meta"><slot name="meta"></slot></span>
            ${iconPosition === 'right' ? this._indicatorMarkup() : ''}
          </span>
        </button>

        <div
          id="${panelId}"
          class="panel"
          part="content panel"
          role="region"
          aria-labelledby="${triggerId}"
          aria-hidden="${open ? 'false' : 'true'}"
        >
          <div class="panel-inner" part="content-inner" ${open ? '' : 'inert'}><slot></slot></div>
        </div>

        ${stateNote ? `<p class="state-note" part="state-note">${stateNote}</p>` : ''}
      </section>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-collapsible')) {
  customElements.define('ui-collapsible', UICollapsible);
}

export type { CollapsibleToggleDetail };

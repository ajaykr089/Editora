import { ElementBase } from '../ElementBase';
import { createPortalContainer } from '../portal';
import { findFirstEnabledIndex, findIndexByValue, findLastEnabledIndex } from '../primitives/collection';
import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import { resolveListboxActiveIndex } from '../primitives/listbox';
import { createPositioner, type PositionerHandle } from '../primitives/positioner';
import './ui-listbox';
import { UIListbox } from './ui-listbox';

const style = `
  :host {
    --ui-select-width: var(--ui-width, min(340px, 100%));
    --ui-select-min-height: 42px;
    --ui-select-radius: var(--ui-radius, 10px);
    --ui-select-padding-x: 12px;
    --ui-select-gap: 8px;

    --ui-select-bg: var(--ui-color-surface, #ffffff);
    --ui-select-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-select-border: 1px solid var(--ui-select-border-color);
    --ui-select-text: var(--ui-color-text, #0f172a);
    --ui-select-muted: var(--ui-color-muted, #64748b);
    --ui-select-placeholder: color-mix(in srgb, var(--ui-select-text) 44%, transparent);
    --ui-select-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-select-accent: var(--ui-color-primary, #2563eb);
    --ui-select-success: var(--ui-color-success, #16a34a);
    --ui-select-warning: var(--ui-color-warning, #d97706);
    --ui-select-error: var(--ui-color-danger, #dc2626);

    --ui-select-shadow: none;
    --ui-select-elevation: none;
    --ui-select-menu-shadow: none;

    --ui-select-label: var(--ui-select-text);
    --ui-select-description: var(--ui-select-muted);
    --ui-select-indicator-color: color-mix(in srgb, var(--ui-select-text) 58%, transparent);
    --ui-select-transition: 170ms cubic-bezier(0.22, 0.8, 0.2, 1);
    --ui-select-menu-z: 1550;

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
    font: 600 13px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
    display: block;
    min-block-size: var(--ui-select-min-height);
    border: var(--ui-select-border);
    border-radius: var(--ui-select-radius);
    background: var(--ui-select-bg);
    box-shadow: var(--ui-select-elevation);
    padding: 0;
    transition:
      border-color var(--ui-select-transition),
      box-shadow var(--ui-select-transition),
      background-color var(--ui-select-transition),
      transform var(--ui-select-transition),
      opacity var(--ui-select-transition);
  }

  .control[data-open="true"] {
    border-color: color-mix(in srgb, var(--ui-select-focus) 62%, var(--ui-select-border-color));
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--ui-select-focus) 18%, transparent),
      var(--ui-select-elevation);
  }

  .leading,
  .trailing {
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: color-mix(in srgb, var(--ui-select-text) 64%, transparent);
    line-height: 1;
    pointer-events: none;
  }

  .leading {
    position: absolute;
    inset-inline-start: var(--ui-select-padding-x);
    inset-block-start: 50%;
    transform: translateY(-50%);
  }

  .trailing {
    position: absolute;
    inset-inline-end: calc(var(--ui-select-padding-x) + 24px);
    inset-block-start: 50%;
    transform: translateY(-50%);
  }

  .leading[hidden],
  .trailing[hidden],
  .description[hidden],
  .label[hidden],
  .error[hidden],
  .meta[hidden] {
    display: none;
  }

  .trigger {
    inline-size: 100%;
    min-inline-size: 0;
    block-size: calc(var(--ui-select-min-height) - 2px);
    box-sizing: border-box;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ui-select-text);
    font: 500 14px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: 8px calc(var(--ui-select-padding-x) + 24px) 8px var(--ui-select-padding-x);
    margin: 0;
    cursor: pointer;
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .control[data-has-leading="true"] .trigger {
    padding-inline-start: calc(var(--ui-select-padding-x) + 24px);
  }

  .control[data-has-trailing="true"] .trigger {
    padding-inline-end: calc(var(--ui-select-padding-x) + 48px);
  }

  .trigger:focus-visible {
    outline: none;
  }

  .value {
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .control[data-placeholder-shown="true"] .value {
    color: var(--ui-select-placeholder);
  }

  .indicator,
  .spinner {
    inline-size: 18px;
    block-size: 18px;
    display: grid;
    place-items: center;
    line-height: 1;
    position: absolute;
    inset-inline-end: var(--ui-select-padding-x);
    inset-block-start: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .indicator {
    pointer-events: none;
    color: var(--ui-select-indicator-color);
    transform-origin: 50% 48%;
    transition: transform var(--ui-select-transition), color var(--ui-select-transition), opacity var(--ui-select-transition);
  }

  .indicator::before {
    content: "";
    inline-size: 8px;
    block-size: 8px;
    border-right: 1.8px solid currentColor;
    border-bottom: 1.8px solid currentColor;
    transform: rotate(45deg) translateY(-1px);
  }

  .control[data-open="true"] .indicator {
    color: var(--ui-select-focus);
    transform: translateY(calc(-50% + 1px)) rotate(180deg);
  }

  .spinner {
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, var(--ui-select-accent) 22%, transparent);
    border-top-color: var(--ui-select-accent);
    opacity: 0;
    pointer-events: none;
    inset-block-start: calc(50% - 9px);
    transform: none;
    animation: ui-select-spin 760ms linear infinite;
  }

  .error {
    margin: 0;
    color: var(--ui-select-error);
    font-size: 12px;
    line-height: 1.35;
  }

  :host([disabled]) .control,
  :host([loading]) .control {
    opacity: 0.62;
    filter: saturate(0.9);
    box-shadow: none;
  }

  :host([disabled]) .trigger,
  :host([loading]) .trigger {
    cursor: not-allowed;
  }

  :host([loading]) .indicator {
    opacity: 0;
  }

  :host([loading]) .spinner {
    opacity: 1;
  }

  :host([disabled]) .leading,
  :host([disabled]) .trailing,
  :host([disabled]) .indicator,
  :host([loading]) .leading,
  :host([loading]) .trailing,
  :host([loading]) .indicator {
    color: color-mix(in srgb, var(--ui-select-text) 38%, transparent);
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-select-min-height: 34px;
    --ui-select-padding-x: 10px;
    --ui-select-gap: 6px;
  }

  :host([size="sm"]) .trigger,
  :host([size="1"]) .trigger {
    font-size: 12px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-select-min-height: 46px;
    --ui-select-padding-x: 13px;
    --ui-select-gap: 9px;
  }

  :host([size="lg"]) .trigger,
  :host([size="3"]) .trigger {
    font-size: 15px;
  }

  :host([density="compact"]) .root {
    gap: 6px;
  }

  :host([density="comfortable"]) .root {
    gap: 10px;
  }

  :host([shape="square"]),
  :host([radius="none"]) {
    --ui-select-radius: 4px;
  }

  :host([shape="rounded"]) {
    --ui-select-radius: 10px;
  }

  :host([shape="pill"]),
  :host([radius="full"]) {
    --ui-select-radius: 999px;
  }

  :host([radius="large"]) {
    --ui-select-radius: 16px;
  }

  :host([elevation="none"]) {
    --ui-select-elevation: none;
  }

  :host([elevation="high"]) {
    --ui-select-elevation: 0 2px 4px rgba(2, 6, 23, 0.1), 0 16px 34px rgba(2, 6, 23, 0.14);
  }

  :host([variant="surface"]) {
    --ui-select-bg: var(--ui-color-surface-alt, #f8fafc);
    --ui-select-elevation: 0 1px 2px rgba(2, 6, 23, 0.05);
  }

  :host([variant="soft"]) {
    --ui-select-bg: color-mix(in srgb, var(--ui-select-accent) 8%, var(--ui-color-surface, #ffffff));
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-accent) 30%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="filled"]) {
    --ui-select-bg: color-mix(in srgb, var(--ui-select-text) 5%, var(--ui-color-surface, #ffffff));
    --ui-select-border: 1px solid transparent;
    --ui-select-elevation: none;
  }

  :host([variant="outline"]) {
    --ui-select-bg: transparent;
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-accent) 42%, var(--ui-color-border, #cbd5e1));
    --ui-select-elevation: none;
  }

  :host([variant="line"]) .control {
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  :host([variant="minimal"]) .control,
  :host([variant="ghost"]) .control {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
  }

  :host([variant="solid"]) {
    --ui-select-bg: var(--ui-select-accent);
    --ui-select-text: var(--ui-color-primary-foreground, #ffffff);
    --ui-select-label: var(--ui-color-primary-foreground, #ffffff);
    --ui-select-description: color-mix(in srgb, var(--ui-color-primary-foreground, #ffffff) 72%, transparent);
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-accent) 76%, #0f172a 24%);
    --ui-select-focus: color-mix(in srgb, #ffffff 72%, var(--ui-select-accent));
    --ui-select-indicator-color: color-mix(in srgb, #ffffff 88%, transparent);
  }

  :host([variant="glass"]) {
    --ui-select-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 72%, transparent);
    --ui-select-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 50%, transparent);
    --ui-select-elevation: 0 8px 18px rgba(2, 6, 23, 0.1), 0 26px 52px rgba(2, 6, 23, 0.08);
  }

  :host([variant="glass"]) .control {
    -webkit-backdrop-filter: saturate(1.08) blur(10px);
    backdrop-filter: saturate(1.08) blur(10px);
  }

  :host([variant="contrast"]) {
    --ui-select-bg: #0f172a;
    --ui-select-text: #e2e8f0;
    --ui-select-label: #e2e8f0;
    --ui-select-description: #93a4bd;
    --ui-select-border-color: #334155;
    --ui-select-focus: #93c5fd;
    --ui-select-indicator-color: #9fb3cf;
    --ui-select-elevation: 0 10px 30px rgba(2, 6, 23, 0.35);
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

  :host([validation="success"]),
  :host([data-valid="true"]) {
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-success) 64%, transparent);
  }

  :host([validation="warning"]) {
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-warning) 62%, transparent);
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
      var(--ui-select-elevation);
  }

  :host([headless]) .root {
    display: none;
  }

  @keyframes ui-select-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .indicator,
    .spinner,
    .trigger {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-select-border: 2px solid var(--ui-select-border-color);
      --ui-select-elevation: none;
    }

    .control[data-open="true"] {
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
      --ui-select-elevation: none;
      --ui-select-indicator-color: CanvasText;
    }

    .indicator::before {
      border-right-color: CanvasText;
      border-bottom-color: CanvasText;
    }
  }
`;

const menuStyle = `
  .menu {
    position: absolute;
    box-sizing: border-box;
    min-width: 180px;
    max-width: min(420px, calc(100vw - 8px));
    max-height: min(320px, calc(100vh - 12px));
    overflow-y: auto;
    overflow-x: hidden;
    border: var(--ui-select-border, 1px solid rgba(148, 163, 184, 0.55));
    border-radius: var(--ui-select-radius, 10px);
    background: var(--ui-select-bg, #ffffff);
    color: var(--ui-select-text, #0f172a);
    box-shadow: var(--ui-select-menu-shadow, var(--ui-select-elevation, none));
    padding: 6px;
    z-index: var(--ui-select-menu-z, 1550);
    transform-origin: top center;
    animation: ui-select-menu-enter 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
    scrollbar-gutter: stable both-edges;
  }

  .menu[data-placement="top"] {
    transform-origin: bottom center;
  }

  .menu-group {
    color: var(--ui-select-muted, #64748b);
    font: 650 11px/1.3 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 8px 10px 5px;
  }

  .menu-item {
    inline-size: 100%;
    min-inline-size: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    border: 1px solid transparent;
    border-radius: calc(var(--ui-select-radius, 10px) - 4px);
    background: transparent;
    color: inherit;
    padding: 8px 10px;
    text-align: left;
    font: 500 13px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
    transition:
      background-color 130ms ease,
      border-color 130ms ease,
      color 130ms ease,
      transform 130ms ease;
  }

  .menu-item:hover,
  .menu-item[data-active="true"] {
    background: color-mix(in srgb, var(--ui-select-accent, #2563eb) 12%, transparent);
    border-color: color-mix(in srgb, var(--ui-select-accent, #2563eb) 22%, transparent);
  }

  .menu-item:active {
    transform: translateY(1px);
    background: color-mix(in srgb, var(--ui-select-accent, #2563eb) 18%, transparent);
  }

  .menu-item[aria-selected="true"] {
    background: color-mix(in srgb, var(--ui-select-accent, #2563eb) 16%, transparent);
    border-color: color-mix(in srgb, var(--ui-select-accent, #2563eb) 28%, transparent);
  }

  .menu-item[aria-disabled="true"] {
    opacity: 0.52;
    cursor: not-allowed;
  }

  .menu-item-label {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .menu-item-check {
    inline-size: 14px;
    block-size: 14px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, currentColor 24%, transparent);
    background: transparent;
    opacity: 0;
    transition: opacity 130ms ease;
  }

  .menu-item[aria-selected="true"] .menu-item-check {
    opacity: 1;
    background: color-mix(in srgb, var(--ui-select-accent, #2563eb) 84%, #ffffff);
    border-color: color-mix(in srgb, var(--ui-select-accent, #2563eb) 75%, transparent);
  }

  .menu-empty {
    margin: 0;
    padding: 10px;
    color: var(--ui-select-muted, #64748b);
    font-size: 12px;
    line-height: 1.4;
    text-align: center;
  }

  @keyframes ui-select-menu-enter {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

type SelectOption = {
  value: string;
  label: string;
  disabled: boolean;
  group: string;
};

type CloseReason = 'outside' | 'escape' | 'select' | 'tab' | 'programmatic' | 'disabled';

function isTruthyAttr(raw: string | null): boolean {
  if (raw == null) return false;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const LIVE_ATTRS = new Set([
  'value',
  'disabled',
  'loading',
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
  'shape',
  'elevation',
  'aria-label',
  'validation',
  'invalid',
  'data-invalid',
  'data-valid',
  'close-on-scroll'
]);

const SELECT_TOKEN_NAMES = [
  '--ui-select-bg',
  '--ui-select-border',
  '--ui-select-border-color',
  '--ui-select-text',
  '--ui-select-muted',
  '--ui-select-placeholder',
  '--ui-select-focus',
  '--ui-select-accent',
  '--ui-select-radius',
  '--ui-select-elevation',
  '--ui-select-menu-shadow',
  '--ui-select-menu-z'
];

export class UISelect extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'disabled',
      'loading',
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
      'shape',
      'elevation',
      'label',
      'description',
      'error',
      'aria-label',
      'validation',
      'invalid',
      'data-invalid',
      'data-valid',
      'close-on-scroll'
    ];
  }

  private _control: HTMLElement | null = null;
  private _trigger: HTMLButtonElement | null = null;
  private _valueEl: HTMLElement | null = null;
  private _observer: MutationObserver | null = null;
  private _formUnregister: (() => void) | null = null;

  // names intentionally match ElementBase teardown helpers
  private _portalEl: HTMLElement | null = null;
  private _positioner: PositionerHandle | null = null;
  private _dismissableLayer: DismissableLayerHandle | null = null;

  private _uid = Math.random().toString(36).slice(2, 8);
  private _open = false;
  private _activeIndex = -1;
  private _options: SelectOption[] = [];
  private _menuItems: HTMLButtonElement[] = [];
  private _optionsFingerprint = '';
  private _rebuildRaf = 0;

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
    this._onRootKeyDown = this._onRootKeyDown.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onFocusOut = this._onFocusOut.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onDocumentScroll = this._onDocumentScroll.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.root.addEventListener('click', this._onRootClick);
    this.root.addEventListener('keydown', this._onRootKeyDown as EventListener);
    this.root.addEventListener('focusin', this._onFocusIn as EventListener);
    this.root.addEventListener('focusout', this._onFocusOut as EventListener);
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);

    this._observer = new MutationObserver((records) => {
      // Ignore host-only attribute churn (for example, internal value sync).
      const hasMeaningfulOptionMutation = records.some((record) => {
        if (record.type === 'childList') return true;
        if (record.type !== 'attributes') return false;
        return record.target !== this;
      });

      if (!hasMeaningfulOptionMutation) return;

      const optionsChanged = this._syncOptionsData();
      if (this._open && optionsChanged) this._schedulePortalRebuild();
    });

    this._observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['value', 'selected', 'disabled', 'label', 'slot', 'data-label', 'data-value']
    });

    this._attachFormRegistration();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClick);
    this.root.removeEventListener('keydown', this._onRootKeyDown as EventListener);
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

    if (this._rebuildRaf) {
      cancelAnimationFrame(this._rebuildRaf);
      this._rebuildRaf = 0;
    }

    this._closeMenu('programmatic');
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'name') this._attachFormRegistration();

    if (this._trigger && LIVE_ATTRS.has(name)) {
      if (name === 'placeholder' || name === 'required') this._syncOptionsData();
      this._syncControlState();
      if (this._open && name !== 'value') this._syncPortalVisualState();
      if (this._open) this._syncPortalSelectionState();
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
    return isTruthyAttr(this.getAttribute('disabled')) || isTruthyAttr(this.getAttribute('loading'));
  }

  set disabled(next: boolean) {
    if (next) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get closeOnScroll(): boolean {
    return isTruthyAttr(this.getAttribute('close-on-scroll')) || !this.hasAttribute('close-on-scroll');
  }

  set closeOnScroll(next: boolean) {
    this.setAttribute('close-on-scroll', next ? 'true' : 'false');
  }

  focus(options?: FocusOptions): void {
    if (this._trigger) {
      this._trigger.focus(options);
      return;
    }
    super.focus(options);
  }

  blur(): void {
    if (this._trigger) {
      this._trigger.blur();
      return;
    }
    super.blur();
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.closest('.trigger')) {
      if (this.disabled) {
        this._closeMenu('disabled');
        return;
      }
      if (this._open) this._closeMenu('programmatic');
      else this._openMenu();
    }
  }

  private _onRootKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target || target !== this._trigger || this.disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this._open) this._openMenu();
        this._moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this._open) this._openMenu();
        this._moveActive(-1);
        break;
      case 'Home':
        if (!this._open) return;
        event.preventDefault();
        this._setActiveIndex(this._firstEnabledIndex());
        break;
      case 'End':
        if (!this._open) return;
        event.preventDefault();
        this._setActiveIndex(this._lastEnabledIndex());
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (!this._open) {
          this._openMenu();
          return;
        }
        this._selectActiveOption();
        break;
      }
      case 'Escape':
        if (!this._open) return;
        event.preventDefault();
        this._closeMenu('escape');
        break;
      case 'Tab':
        if (this._open) this._closeMenu('tab');
        break;
      default:
        break;
    }
  }

  private _onFocusIn(event: FocusEvent): void {
    if (event.target !== this._trigger) return;
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  }

  private _onFocusOut(event: FocusEvent): void {
    if (event.target !== this._trigger) return;
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  }

  private _onSlotChange(): void {
    this.requestRender();
  }

  private _onDocumentScroll(event: Event): void {
    if (!this._open || !this.closeOnScroll) return;
    const path = typeof (event as any).composedPath === 'function' ? (event as any).composedPath() : [];
    if (this._portalEl && path.includes(this._portalEl)) return;
    this._closeMenu('outside');
  }

  private _emitValue(eventName: 'input' | 'change', nextValue: string): void {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { value: nextValue },
        bubbles: true,
        composed: true
      })
    );
  }

  private _applyValueFromUser(nextValue: string): void {
    const current = this.getAttribute('value') || '';
    if (current !== nextValue) {
      this.setAttribute('value', nextValue);
      this._emitValue('input', nextValue);
      this._emitValue('change', nextValue);
    }
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
        const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
        if (!required) return { valid: true };
        const valid = this.value.trim().length > 0;
        return { valid, message: valid ? undefined : 'This field is required.' };
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
    return !!this.querySelector(`[slot="${name}"]`);
  }

  private _buildOptionsFromChildren(): SelectOption[] {
    const options: SelectOption[] = [];

    const pushOption = (opt: HTMLOptionElement, group: string) => {
      const label = (opt.label || opt.textContent || opt.value || '').trim();
      const value = opt.value ?? '';
      options.push({
        value: String(value),
        label: label || String(value),
        disabled: !!opt.disabled,
        group
      });
    };

    Array.from(this.children).forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const tag = node.tagName.toLowerCase();
      if (tag === 'option') {
        pushOption(node as HTMLOptionElement, '');
        return;
      }

      if (tag === 'optgroup') {
        const groupEl = node as HTMLOptGroupElement;
        const groupLabel = (groupEl.label || groupEl.getAttribute('label') || '').trim();
        Array.from(groupEl.children).forEach((child) => {
          if (child instanceof HTMLOptionElement) pushOption(child, groupLabel);
        });
      }
    });

    const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
    const placeholder = (this.getAttribute('placeholder') || '').trim();

    if (placeholder && !required) {
      options.unshift({ value: '', label: placeholder, disabled: false, group: '' });
    }

    return options;
  }

  private _computeOptionsFingerprint(options: SelectOption[]): string {
    if (!options.length) return '';
    return options
      .map((option) => `${option.value}\u0001${option.label}\u0001${option.disabled ? '1' : '0'}\u0001${option.group}`)
      .join('\u0002');
  }

  private _schedulePortalRebuild(): void {
    if (!this._open || this._rebuildRaf) return;
    this._rebuildRaf = requestAnimationFrame(() => {
      this._rebuildRaf = 0;
      if (this._open) this._rebuildPortal();
    });
  }

  private _firstEnabledIndex(): number {
    return findFirstEnabledIndex(this._options, (option) => option.disabled);
  }

  private _lastEnabledIndex(): number {
    return findLastEnabledIndex(this._options, (option) => option.disabled);
  }

  private _selectedIndex(): number {
    return findIndexByValue(this._options, this.value, (option) => option.value);
  }

  private _listbox(): UIListbox | null {
    return this._portalEl instanceof UIListbox ? this._portalEl : null;
  }

  private _setActiveIndex(index: number): void {
    if (index === this._activeIndex) return;

    const previousIndex = this._activeIndex;
    this._activeIndex = index;

    const previousItem = previousIndex >= 0 ? this._menuItems[previousIndex] : null;
    if (previousItem) previousItem.removeAttribute('data-active');

    const activeItem = index >= 0 ? this._menuItems[index] : null;
    if (activeItem) {
      this._listbox()?.setActiveItem(activeItem, {
        focus: false,
        owner: this._trigger,
        scroll: true
      });
    } else {
      this._listbox()?.clearActive();
      if (this._trigger) this._trigger.removeAttribute('aria-activedescendant');
    }
  }

  private _moveActive(step: 1 | -1): void {
    if (!this._options.length) return;
    const current = this._activeIndex >= 0 ? this._menuItems[this._activeIndex] : null;
    const moved = this._listbox()?.move(step, {
      current,
      focus: false,
      owner: this._trigger,
      scroll: true
    }) || null;
    if (!moved) return;
    const next = Number((moved as HTMLButtonElement).dataset.index || '-1');
    if (next >= 0) this._activeIndex = next;
  }

  private _selectActiveOption(): void {
    if (this._activeIndex < 0) return;
    const option = this._options[this._activeIndex];
    if (!option || option.disabled) return;
    this._applyValueFromUser(option.value);
    this._closeMenu('select');
  }

  private _syncOptionsData(): boolean {
    const nextOptions = this._buildOptionsFromChildren();
    const nextFingerprint = this._computeOptionsFingerprint(nextOptions);
    const optionsChanged = nextFingerprint !== this._optionsFingerprint;

    this._options = nextOptions;
    this._optionsFingerprint = nextFingerprint;

    const hasValueAttr = this.hasAttribute('value');
    const current = this.getAttribute('value') || '';
    const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
    const placeholder = (this.getAttribute('placeholder') || '').trim();

    const hasMatch = this._options.some((opt) => opt.value === current);

    if (!hasValueAttr) {
      const fallback = placeholder ? '' : (this._options.find((opt) => !opt.disabled)?.value || '');
      this.setAttribute('value', fallback);
    } else if (!hasMatch) {
      const fallback = !required ? '' : (this._options.find((opt) => !opt.disabled)?.value || '');
      if (current !== fallback) this.setAttribute('value', fallback);
    }

    if (this._open) this._syncPortalSelectionState();
    return optionsChanged;
  }

  private _currentDisplayText(): string {
    const value = this.value;
    const placeholder = (this.getAttribute('placeholder') || '').trim();

    if (value === '' && placeholder) return placeholder;

    const selected = this._options.find((opt) => opt.value === value);
    if (selected) return selected.label;

    return value;
  }

  private _syncControlState(): void {
    const trigger = this._trigger;
    const control = this._control;
    const valueEl = this._valueEl;
    if (!trigger || !control || !valueEl) return;

    const labelAttr = this.getAttribute('label') || '';
    const ariaLabel = this.getAttribute('aria-label') || labelAttr || 'Select';
    const loading = isTruthyAttr(this.getAttribute('loading'));
    const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
    const tabindex = this.getAttribute('tabindex');
    const isInvalid =
      (this.hasAttribute('validation') && this.getAttribute('validation') === 'error') ||
      this.hasAttribute('invalid') ||
      this.getAttribute('data-invalid') === 'true';

    const displayValue = this._currentDisplayText();
    const placeholder = (this.getAttribute('placeholder') || '').trim();
    const isPlaceholderShown = !!placeholder && this.value === '';

    valueEl.textContent = displayValue;
    control.setAttribute('data-placeholder-shown', isPlaceholderShown ? 'true' : 'false');
    control.setAttribute('data-open', this._open ? 'true' : 'false');

    trigger.disabled = this.disabled;
    trigger.setAttribute('aria-label', ariaLabel);
    trigger.setAttribute('aria-expanded', this._open ? 'true' : 'false');
    trigger.setAttribute('aria-busy', loading ? 'true' : 'false');
    trigger.setAttribute('aria-required', required ? 'true' : 'false');

    if (isInvalid) trigger.setAttribute('aria-invalid', 'true');
    else trigger.removeAttribute('aria-invalid');

    if (tabindex != null && !this.disabled) trigger.setAttribute('tabindex', tabindex);
    else if (!this.disabled) trigger.setAttribute('tabindex', '0');
    else trigger.setAttribute('tabindex', '-1');

    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    this.setAttribute('aria-busy', loading ? 'true' : 'false');
  }

  private _applyPortalTokens(menu: HTMLElement): void {
    const computed = window.getComputedStyle(this);
    SELECT_TOKEN_NAMES.forEach((token) => {
      const value = computed.getPropertyValue(token).trim();
      if (value) menu.style.setProperty(token, value);
      else menu.style.removeProperty(token);
    });
  }

  private _buildPortalContent(): HTMLElement {
    const menu = document.createElement('ui-listbox') as UIListbox;
    menu.className = 'menu';
    menu.id = `${this._uid}-listbox`;
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('item-selector', '.menu-item[data-index]');
    menu.setAttribute('item-role', 'option');
    menu.setAttribute('active-attribute', 'data-active');
    this._menuItems = [];

    const styleEl = document.createElement('style');
    styleEl.textContent = menuStyle;
    menu.appendChild(styleEl);

    if (!this._options.length) {
      const empty = document.createElement('p');
      empty.className = 'menu-empty';
      empty.textContent = 'No options available';
      menu.appendChild(empty);
      return menu;
    }

    let previousGroup = '__none__';
    this._options.forEach((option, index) => {
      if (option.group && option.group !== previousGroup) {
        const groupLabel = document.createElement('div');
        groupLabel.className = 'menu-group';
        groupLabel.setAttribute('role', 'presentation');
        groupLabel.textContent = option.group;
        menu.appendChild(groupLabel);
        previousGroup = option.group;
      }

      if (!option.group) previousGroup = '__none__';

      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'menu-item';
      item.id = `${this._uid}-opt-${index}`;
      item.setAttribute('role', 'option');
      item.setAttribute('data-index', String(index));
      item.setAttribute('aria-selected', option.value === this.value ? 'true' : 'false');
      item.setAttribute('aria-disabled', option.disabled ? 'true' : 'false');
      item.tabIndex = -1;
      if (option.disabled) item.disabled = true;

      const label = document.createElement('span');
      label.className = 'menu-item-label';
      label.textContent = option.label;

      const check = document.createElement('span');
      check.className = 'menu-item-check';
      check.setAttribute('aria-hidden', 'true');

      item.appendChild(label);
      item.appendChild(check);

      menu.appendChild(item);
      this._menuItems.push(item);
    });

    menu.refresh();

    menu.addEventListener('click', (event) => {
      const target = event.target as HTMLElement | null;
      const item = target?.closest('.menu-item[data-index]') as HTMLButtonElement | null;
      if (!item) return;

      const index = Number(item.dataset.index || '-1');
      const option = this._options[index];
      if (!option || option.disabled) return;

      this._setActiveIndex(index);
      this._applyValueFromUser(option.value);
      this._closeMenu('select');
      this.focus();
    });

    menu.addEventListener(
      'pointermove',
      (event) => {
        const target = event.target as HTMLElement | null;
        const item = target?.closest('.menu-item[data-index]') as HTMLButtonElement | null;
        if (!item) return;

        const index = Number(item.dataset.index || '-1');
        if (index < 0 || index === this._activeIndex) return;

        const option = this._options[index];
        if (!option || option.disabled) return;
        this._setActiveIndex(index);
      },
      { passive: true }
    );

    return menu;
  }

  private _syncPortalSelectionState(): void {
    const menu = this._portalEl;
    if (!menu) return;

    const selectedIndex = this._selectedIndex();
    this._menuItems.forEach((item) => {
      const index = Number(item.dataset.index || '-1');
      const isSelected = index === selectedIndex;
      item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    this._setActiveIndex(
      resolveListboxActiveIndex(this._options, {
        selectedIndex,
        getDisabled: (option) => option.disabled
      })
    );
  }

  private _syncPortalVisualState(): void {
    const menu = this._portalEl;
    const trigger = this._trigger;
    if (!menu || !trigger) return;

    this._applyPortalTokens(menu);
    const anchor = this._control || trigger;
    const anchorWidth = Math.round(anchor.getBoundingClientRect().width);
    menu.style.width = `${Math.max(anchorWidth, 180)}px`;
    this._positioner?.update();
  }

  private _openMenu(): void {
    if (this._open || this.disabled) return;

    this._syncOptionsData();
    const trigger = this._trigger;
    if (!trigger) return;
    const anchor = this._control || trigger;

    this._closeMenu('programmatic');

    const menu = this._buildPortalContent();
    this._portalEl = menu;
    this._applyPortalTokens(menu);

    const anchorWidth = Math.round(anchor.getBoundingClientRect().width);
    menu.style.width = `${Math.max(anchorWidth, 180)}px`;
    const root = createPortalContainer();
    if (!root) {
      this._portalEl = null;
      return;
    }
    root.appendChild(menu);

    this._positioner = createPositioner({
      anchor,
      floating: menu,
      placement: 'bottom',
      offset: 6,
      flip: true,
      shift: true,
      fitViewport: true,
      observeScroll: false
    });
    this._dismissableLayer = createDismissableLayer({
      node: menu,
      trigger: anchor,
      closeOnEscape: true,
      closeOnPointerOutside: true,
      onDismiss: (reason) => {
        if (reason === 'outside-pointer') {
          this._closeMenu('outside');
          return;
        }
        if (reason === 'escape-key') {
          this._closeMenu('escape');
        }
      }
    });
    this._open = true;

    window.addEventListener('scroll', this._onDocumentScroll, true);

    this._syncPortalSelectionState();
    this._syncControlState();
  }

  private _closeMenu(_reason: CloseReason): void {
    if (!this._open && !this._portalEl && !this._positioner && !this._dismissableLayer) return;

    if (this._rebuildRaf) {
      cancelAnimationFrame(this._rebuildRaf);
      this._rebuildRaf = 0;
    }

    window.removeEventListener('scroll', this._onDocumentScroll, true);

    this._open = false;
    this._dismissableLayer?.destroy();
    this._dismissableLayer = null;
    this._positioner?.destroy();
    this._positioner = null;

    if (this._portalEl?.parentElement) {
      try {
        this._portalEl.parentElement.removeChild(this._portalEl);
      } catch {
        // no-op
      }
    }

    this._portalEl = null;
    this._menuItems = [];
    this._activeIndex = -1;
    this._syncControlState();
  }

  private _rebuildPortal(): void {
    if (!this._open) return;

    const wasOpen = this._open;
    this._closeMenu('programmatic');
    if (wasOpen) this._openMenu();
  }

  protected override render(): void {
    const labelAttr = this.getAttribute('label') || '';
    const descriptionAttr = this.getAttribute('description') || '';
    const errorAttr = this.getAttribute('error') || '';
    const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
    const ariaLabel = this.getAttribute('aria-label') || labelAttr || 'Select';

    const hasLabel = !!labelAttr || this._hasSlotContent('label');
    const hasDescription = !!descriptionAttr || this._hasSlotContent('description');
    const hasError = !!errorAttr || this._hasSlotContent('error');
    const hasLeading = this._hasSlotContent('leading');
    const hasTrailing = this._hasSlotContent('trailing');

    const labelId = `${this._uid}-label`;
    const descriptionId = `${this._uid}-description`;
    const errorId = `${this._uid}-error`;
    const triggerId = `${this._uid}-trigger`;
    const listboxId = `${this._uid}-listbox`;

    const describedBy = [hasDescription ? descriptionId : '', hasError ? errorId : ''].filter(Boolean).join(' ');

    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="meta" part="meta" ${hasLabel || hasDescription ? '' : 'hidden'}>
          <label class="label" part="label" id="${labelId}" for="${triggerId}" ${hasLabel ? '' : 'hidden'}>
            <slot name="label">${escapeHtml(labelAttr)}</slot>
            ${required ? '<span class="required" aria-hidden="true">*</span>' : ''}
          </label>
          <p class="description" part="description" id="${descriptionId}" ${hasDescription ? '' : 'hidden'}>
            <slot name="description">${escapeHtml(descriptionAttr)}</slot>
          </p>
        </div>
        <div class="control" part="control" data-has-leading="${hasLeading}" data-has-trailing="${hasTrailing}" data-placeholder-shown="false" data-open="false">
          <span class="leading" part="leading" ${hasLeading ? '' : 'hidden'}>
            <slot name="leading"></slot>
          </span>
          <button
            id="${triggerId}"
            type="button"
            class="trigger"
            part="trigger"
            role="combobox"
            aria-haspopup="listbox"
            aria-controls="${listboxId}"
            aria-expanded="false"
            aria-label="${escapeHtml(ariaLabel)}"
            ${hasLabel ? `aria-labelledby="${labelId}"` : ''}
            ${describedBy ? `aria-describedby="${escapeHtml(describedBy)}"` : ''}
          >
            <span class="value" part="value"></span>
          </button>
          <span class="trailing" part="trailing" ${hasTrailing ? '' : 'hidden'}>
            <slot name="trailing"></slot>
          </span>
          <span class="indicator" part="indicator" aria-hidden="true"></span>
          <span class="spinner" part="spinner" aria-hidden="true"></span>
        </div>
        <p class="error" part="error" id="${errorId}" ${hasError ? '' : 'hidden'}>
          <slot name="error">${escapeHtml(errorAttr)}</slot>
        </p>
      </div>
    `);

    this._control = this.root.querySelector('.control') as HTMLElement | null;
    this._trigger = this.root.querySelector('.trigger') as HTMLButtonElement | null;
    this._valueEl = this.root.querySelector('.value') as HTMLElement | null;

    this._syncOptionsData();
    this._syncControlState();
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

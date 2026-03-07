import { ElementBase } from '../ElementBase';

type WizardStepState = 'default' | 'complete' | 'success' | 'warning' | 'error';

type WizardStep = {
  index: number;
  value: string;
  title: string;
  description: string;
  optional: boolean;
  disabled: boolean;
  state: WizardStepState;
  node: HTMLElement;
};

type VisualStepState = 'upcoming' | 'current' | 'complete' | 'success' | 'warning' | 'error';

const style = `
  :host {
    --ui-wizard-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-wizard-surface: color-mix(in srgb, var(--ui-color-surface, #ffffff) 99%, transparent);
    --ui-wizard-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-wizard-text: var(--ui-color-text, #0f172a);
    --ui-wizard-muted: var(--ui-color-muted, #64748b);
    --ui-wizard-accent: var(--ui-color-primary, #2563eb);
    --ui-wizard-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-wizard-success: var(--ui-color-success, #16a34a);
    --ui-wizard-warning: var(--ui-color-warning, #d97706);
    --ui-wizard-danger: var(--ui-color-danger, #dc2626);

    --ui-wizard-radius: 14px;
    --ui-wizard-gap: 12px;
    --ui-wizard-padding: 12px;
    --ui-wizard-step-min-width: 180px;
    --ui-wizard-duration: 160ms;
    --ui-wizard-progress: 0%;

    display: block;
    min-inline-size: 0;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .frame {
    border: 1px solid var(--ui-wizard-border);
    border-radius: var(--ui-wizard-radius);
    background: var(--ui-wizard-bg);
    color: var(--ui-wizard-text);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 14px 30px rgba(15, 23, 42, 0.08);
    padding: var(--ui-wizard-padding);
    display: grid;
    gap: var(--ui-wizard-gap);
    transition: border-color var(--ui-wizard-duration) ease, box-shadow var(--ui-wizard-duration) ease;
  }

  .frame[aria-busy="true"] {
    cursor: progress;
  }

  .status {
    display: grid;
    gap: 8px;
  }

  .status[hidden],
  .title[hidden],
  .description[hidden],
  .stepper[hidden],
  .controls[hidden],
  .empty[hidden] {
    display: none;
  }

  .title {
    margin: 0;
    font-size: 14px;
    line-height: 1.35;
    font-weight: 650;
    letter-spacing: 0.01em;
  }

  .description {
    margin: 0;
    font-size: 12px;
    line-height: 1.45;
    color: var(--ui-wizard-muted);
  }

  .status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .status-step {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .status-value {
    font-size: 11px;
    color: var(--ui-wizard-muted);
    font-weight: 600;
  }

  .progress {
    inline-size: 100%;
    block-size: 6px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-wizard-border) 84%, transparent);
    overflow: hidden;
    position: relative;
  }

  .progress::after {
    content: "";
    position: absolute;
    inset: 0;
    inline-size: var(--ui-wizard-progress);
    border-radius: inherit;
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--ui-wizard-accent) 72%, #ffffff 28%),
      var(--ui-wizard-accent)
    );
    transition: inline-size var(--ui-wizard-duration) cubic-bezier(0.22, 0.8, 0.2, 1);
  }

  .stepper {
    display: flex;
    align-items: stretch;
    gap: 10px;
    min-inline-size: 0;
    overflow: auto hidden;
    padding: 2px;
    scrollbar-gutter: stable both-edges;
  }

  .step-item {
    position: relative;
    flex: 1 1 0;
    min-inline-size: var(--ui-wizard-step-min-width);
  }

  .step-item::after {
    content: "";
    position: absolute;
    top: 22px;
    left: calc(100% + 5px);
    inline-size: 10px;
    block-size: 2px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-wizard-border) 84%, transparent);
  }

  .step-item[data-last="true"]::after {
    display: none;
  }

  .step-item[data-complete="true"]::after,
  .step-item[data-status="success"]::after {
    background: color-mix(in srgb, var(--ui-wizard-success) 68%, transparent);
  }

  .step {
    min-inline-size: 0;
    inline-size: 100%;
    border: 1px solid color-mix(in srgb, var(--ui-wizard-border) 88%, transparent);
    border-radius: 12px;
    background: var(--ui-wizard-surface);
    padding: 8px 10px;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 8px;
    align-items: center;
    cursor: pointer;
    color: inherit;
    text-align: left;
    transition:
      border-color var(--ui-wizard-duration) ease,
      background-color var(--ui-wizard-duration) ease,
      box-shadow var(--ui-wizard-duration) ease,
      transform var(--ui-wizard-duration) ease;
  }

  .step:hover {
    border-color: color-mix(in srgb, var(--ui-wizard-accent) 34%, var(--ui-wizard-border));
    background: color-mix(in srgb, var(--ui-wizard-accent) 7%, var(--ui-wizard-surface));
  }

  .step:active {
    transform: translateY(1px);
  }

  .step:focus-visible {
    outline: 2px solid var(--ui-wizard-focus);
    outline-offset: 1px;
  }

  .step[disabled] {
    opacity: 0.46;
    cursor: not-allowed;
  }

  .step[data-active="true"] {
    border-color: color-mix(in srgb, var(--ui-wizard-accent) 46%, transparent);
    background: color-mix(in srgb, var(--ui-wizard-accent) 13%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-wizard-accent) 26%, transparent);
  }

  .step-badge {
    position: relative;
    inline-size: 22px;
    block-size: 22px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--ui-wizard-border) 82%, transparent);
    display: grid;
    place-items: center;
    font-size: 11px;
    line-height: 1;
    font-weight: 700;
    background: color-mix(in srgb, var(--ui-wizard-surface) 92%, transparent);
    color: var(--ui-wizard-muted);
  }

  .step[data-active="true"] .step-badge::after {
    content: "";
    position: absolute;
    inset: -5px;
    border-radius: inherit;
    border: 1px solid color-mix(in srgb, var(--ui-wizard-accent) 52%, transparent);
    opacity: 0.45;
    animation: ui-wizard-step-pulse 1.8s ease-out infinite;
    pointer-events: none;
  }

  .step[data-status="complete"] .step-badge,
  .step[data-status="success"] .step-badge {
    border-color: color-mix(in srgb, var(--ui-wizard-success) 54%, transparent);
    background: color-mix(in srgb, var(--ui-wizard-success) 18%, transparent);
    color: color-mix(in srgb, var(--ui-wizard-success) 84%, #0f172a 16%);
  }

  .step[data-status="warning"] .step-badge {
    border-color: color-mix(in srgb, var(--ui-wizard-warning) 54%, transparent);
    background: color-mix(in srgb, var(--ui-wizard-warning) 18%, transparent);
    color: color-mix(in srgb, var(--ui-wizard-warning) 88%, #0f172a 12%);
  }

  .step[data-status="error"] .step-badge {
    border-color: color-mix(in srgb, var(--ui-wizard-danger) 56%, transparent);
    background: color-mix(in srgb, var(--ui-wizard-danger) 20%, transparent);
    color: color-mix(in srgb, var(--ui-wizard-danger) 90%, #0f172a 10%);
  }

  .step-main {
    min-inline-size: 0;
    display: grid;
    gap: 2px;
  }

  .step-title,
  .step-description {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .step-title {
    font-size: 12px;
    line-height: 1.3;
    font-weight: 620;
  }

  .step-description {
    font-size: 11px;
    line-height: 1.25;
    color: var(--ui-wizard-muted);
  }

  .panel {
    min-inline-size: 0;
    border: 1px solid color-mix(in srgb, var(--ui-wizard-border) 78%, transparent);
    border-radius: calc(var(--ui-wizard-radius) - 4px);
    background: color-mix(in srgb, var(--ui-wizard-surface) 97%, transparent);
    padding: 12px;
  }

  .panel ::slotted([slot="step"]) {
    display: block;
    min-inline-size: 0;
  }

  .empty {
    margin: 0;
    font-size: 12px;
    line-height: 1.45;
    color: var(--ui-wizard-muted);
    text-align: center;
    padding: 10px;
    border-radius: 10px;
    border: 1px dashed color-mix(in srgb, var(--ui-wizard-border) 90%, transparent);
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }

  .group {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-inline-size: 0;
  }

  .btn {
    border: 1px solid color-mix(in srgb, var(--ui-wizard-border) 84%, transparent);
    border-radius: 10px;
    background: color-mix(in srgb, var(--ui-wizard-surface) 98%, transparent);
    color: var(--ui-wizard-text);
    font: 600 12px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    padding: 9px 13px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition:
      border-color var(--ui-wizard-duration) ease,
      background-color var(--ui-wizard-duration) ease,
      transform var(--ui-wizard-duration) ease,
      box-shadow var(--ui-wizard-duration) ease;
  }

  .btn:hover {
    border-color: color-mix(in srgb, var(--ui-wizard-accent) 34%, var(--ui-wizard-border));
  }

  .btn:active {
    transform: translateY(1px);
  }

  .btn:focus-visible {
    outline: 2px solid var(--ui-wizard-focus);
    outline-offset: 1px;
  }

  .btn[disabled] {
    opacity: 0.42;
    cursor: not-allowed;
    transform: none;
  }

  .btn.primary {
    border-color: color-mix(in srgb, var(--ui-wizard-accent) 44%, transparent);
    background: color-mix(in srgb, var(--ui-wizard-accent) 16%, transparent);
    color: color-mix(in srgb, var(--ui-wizard-accent) 86%, #0f172a 14%);
  }

  .btn.primary[data-loading="true"] {
    pointer-events: none;
  }

  .btn.primary[data-loading="true"]::after {
    content: "";
    inline-size: 12px;
    block-size: 12px;
    border-radius: 999px;
    border: 1.8px solid color-mix(in srgb, currentColor 22%, transparent);
    border-top-color: currentColor;
    animation: ui-wizard-spin 760ms linear infinite;
  }

  :host([busy]) .step,
  :host([busy]) .btn {
    pointer-events: none;
  }

  :host([orientation="vertical"]) .stepper {
    flex-direction: column;
    overflow: visible;
  }

  :host([orientation="vertical"]) .step-item {
    min-inline-size: 0;
  }

  :host([orientation="vertical"]) .step-item::after {
    top: calc(100% + 5px);
    left: 10px;
    inline-size: 2px;
    block-size: 10px;
  }

  :host([density="compact"]) {
    --ui-wizard-gap: 8px;
    --ui-wizard-padding: 10px;
    --ui-wizard-step-min-width: 160px;
  }

  :host([density="comfortable"]) {
    --ui-wizard-gap: 14px;
    --ui-wizard-padding: 14px;
    --ui-wizard-step-min-width: 196px;
  }

  :host([shape="square"]) {
    --ui-wizard-radius: 6px;
  }

  :host([shape="pill"]) {
    --ui-wizard-radius: 20px;
  }

  :host([variant="soft"]) {
    --ui-wizard-bg: color-mix(in srgb, var(--ui-wizard-accent) 6%, var(--ui-color-surface, #ffffff));
    --ui-wizard-surface: color-mix(in srgb, var(--ui-wizard-accent) 4%, var(--ui-color-surface, #ffffff));
  }

  :host([variant="glass"]) {
    --ui-wizard-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 76%, transparent);
    --ui-wizard-surface: color-mix(in srgb, var(--ui-color-surface, #ffffff) 88%, transparent);
  }

  :host([variant="flat"]) .frame {
    box-shadow: none;
  }

  :host([variant="minimal"]) .frame {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }

  :host([variant="minimal"]) .panel {
    background: transparent;
  }

  :host([variant="contrast"]) {
    --ui-wizard-bg: #0f172a;
    --ui-wizard-surface: #0b1322;
    --ui-wizard-border: #334155;
    --ui-wizard-text: #e2e8f0;
    --ui-wizard-muted: #93a4bd;
    --ui-wizard-accent: #93c5fd;
    --ui-wizard-focus: #93c5fd;
    --ui-wizard-success: #4ade80;
    --ui-wizard-warning: #fbbf24;
    --ui-wizard-danger: #f87171;
  }

  :host([headless]) .frame {
    display: none;
  }

  @keyframes ui-wizard-step-pulse {
    0% {
      transform: scale(0.9);
      opacity: 0.45;
    }
    70% {
      transform: scale(1.2);
      opacity: 0;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }

  @keyframes ui-wizard-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 720px) {
    .stepper {
      gap: 8px;
    }

    .step-item {
      min-inline-size: 148px;
    }

    .controls {
      justify-content: stretch;
    }

    .group {
      inline-size: 100%;
      justify-content: space-between;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .frame,
    .step,
    .btn,
    .progress::after,
    .step-badge::after,
    .btn.primary::after {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .frame {
      box-shadow: none;
    }

    .step,
    .btn,
    .panel {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-wizard-bg: Canvas;
      --ui-wizard-surface: Canvas;
      --ui-wizard-border: CanvasText;
      --ui-wizard-text: CanvasText;
      --ui-wizard-muted: CanvasText;
      --ui-wizard-accent: Highlight;
      --ui-wizard-focus: Highlight;
      --ui-wizard-success: Highlight;
      --ui-wizard-warning: Highlight;
      --ui-wizard-danger: Highlight;
    }

    .frame,
    .step,
    .panel,
    .btn,
    .progress,
    .progress::after,
    .step-badge,
    .step-item::after {
      forced-color-adjust: none;
      box-shadow: none;
      border-color: CanvasText;
      background: Canvas;
      color: CanvasText;
    }

    .progress::after,
    .step[data-active="true"] .step-badge::after,
    .btn.primary[data-loading="true"]::after {
      animation: none !important;
      border-color: Highlight;
      background: Highlight;
    }

    .step[data-active="true"],
    .btn.primary {
      border-color: Highlight;
      color: Highlight;
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

function isTruthy(raw: string | null): boolean {
  if (raw == null) return false;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

let wizardInstanceId = 0;

export class UIWizard extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'linear',
      'show-stepper',
      'stepper-position',
      'hide-controls',
      'variant',
      'headless',
      'keep-mounted',
      'next-label',
      'prev-label',
      'finish-label',
      'aria-label',
      'orientation',
      'density',
      'shape',
      'show-progress',
      'busy',
      'title',
      'description',
      'empty-label'
    ];
  }

  private _observer: MutationObserver | null = null;
  private readonly _instanceId = ++wizardInstanceId;
  private _isSyncingValueAttribute = false;

  private _stepButtons: HTMLButtonElement[] = [];
  private _progressEl: HTMLElement | null = null;
  private _progressRow: HTMLElement | null = null;
  private _statusStepEl: HTMLElement | null = null;
  private _statusValueEl: HTMLElement | null = null;
  private _prevBtn: HTMLButtonElement | null = null;
  private _nextBtn: HTMLButtonElement | null = null;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);

    this._observer = new MutationObserver((records) => {
      const shouldRender = records.some((record) => {
        if (record.type === 'childList') {
          return record.target === this;
        }

        if (record.type !== 'attributes') return false;
        const target = record.target as HTMLElement;
        const attribute = record.attributeName || '';

        if (attribute === 'slot') {
          return target.getAttribute('slot') === 'step' || target.matches('[slot="step"]');
        }

        const stepNode = target.closest('[slot="step"]') as HTMLElement | null;
        if (!stepNode) return false;
        if (target !== stepNode) return false;

        return (
          attribute === 'data-value' ||
          attribute === 'data-title' ||
          attribute === 'data-description' ||
          attribute === 'data-optional' ||
          attribute === 'data-disabled' ||
          attribute === 'data-state' ||
          attribute === 'disabled'
        );
      });

      if (shouldRender) this.requestRender();
    });

    this._observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['slot', 'data-value', 'data-title', 'data-description', 'data-optional', 'data-disabled', 'data-state', 'disabled']
    });
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'value') {
      if (!this._isSyncingValueAttribute) this._syncValueUi();
      return;
    }

    if (this.isConnected) this.requestRender();
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    const normalized = String(next || '');
    if (!normalized) this.removeAttribute('value');
    else this.setAttribute('value', normalized);
  }

  private _isBusy(): boolean {
    return isTruthy(this.getAttribute('busy')) || this.hasAttribute('busy');
  }

  private _steps(): WizardStep[] {
    const nodes = Array.from(this.children).filter((node): node is HTMLElement => {
      return node instanceof HTMLElement && node.getAttribute('slot') === 'step';
    });

    return nodes.map((node, index) => {
      const rawState = (node.getAttribute('data-state') || '').trim().toLowerCase();
      const state: WizardStepState =
        rawState === 'complete' || rawState === 'success' || rawState === 'warning' || rawState === 'error'
          ? (rawState as WizardStepState)
          : 'default';

      return {
        index,
        value: node.getAttribute('data-value') || String(index + 1),
        title: node.getAttribute('data-title') || node.getAttribute('title') || `Step ${index + 1}`,
        description: node.getAttribute('data-description') || '',
        optional: isTruthy(node.getAttribute('data-optional')),
        disabled: node.hasAttribute('disabled') || isTruthy(node.getAttribute('data-disabled')),
        state,
        node
      };
    });
  }

  private _tabId(index: number): string {
    return `ui-wizard-${this._instanceId}-tab-${index}`;
  }

  private _panelId(index: number): string {
    return `ui-wizard-${this._instanceId}-panel-${index}`;
  }

  private _activeIndex(steps: WizardStep[]): number {
    if (!steps.length) return -1;

    const current = this.getAttribute('value') || '';
    if (current) {
      const byValue = steps.findIndex((step) => step.value === current);
      if (byValue >= 0) return byValue;
    }

    const firstEnabled = steps.find((step) => !step.disabled) || steps[0];
    if (firstEnabled && this.getAttribute('value') !== firstEnabled.value) {
      this.setAttribute('value', firstEnabled.value);
    }

    return steps.findIndex((step) => step.value === firstEnabled.value);
  }

  private _visualStatus(step: WizardStep, index: number, activeIndex: number): VisualStepState {
    if (step.state === 'error') return 'error';
    if (step.state === 'warning') return 'warning';
    if (step.state === 'success') return 'success';
    if (step.state === 'complete') return 'complete';
    if (index < activeIndex) return 'complete';
    if (index === activeIndex) return 'current';
    return 'upcoming';
  }

  private _syncPanels(steps: WizardStep[], activeIndex: number): void {
    const keepMounted = this.hasAttribute('keep-mounted');

    steps.forEach((step, index) => {
      const active = index === activeIndex;
      const panelId = this._panelId(index);
      const tabId = this._tabId(index);

      step.node.id = panelId;
      step.node.setAttribute('role', 'tabpanel');
      step.node.setAttribute('aria-labelledby', tabId);
      step.node.setAttribute('tabindex', active ? '0' : '-1');
      step.node.setAttribute('data-active', active ? 'true' : 'false');
      step.node.setAttribute('aria-hidden', active ? 'false' : 'true');

      if (keepMounted) step.node.hidden = false;
      else step.node.hidden = !active;
    });
  }

  private _attemptChange(steps: WizardStep[], activeIndex: number, targetIndex: number, trigger: string): boolean {
    if (this._isBusy()) return false;
    if (targetIndex === activeIndex) return true;
    if (targetIndex < 0 || targetIndex >= steps.length) return false;

    const target = steps[targetIndex];
    if (!target || target.disabled) return false;
    if (this.hasAttribute('linear') && targetIndex > activeIndex + 1) return false;

    const current = steps[activeIndex];
    const before = new CustomEvent('before-change', {
      detail: {
        currentIndex: activeIndex,
        nextIndex: targetIndex,
        currentValue: current?.value || '',
        nextValue: target.value,
        trigger
      },
      bubbles: true,
      composed: true,
      cancelable: true
    });

    if (!this.dispatchEvent(before)) return false;

    this.value = target.value;

    const detail = { index: targetIndex, value: target.value, title: target.title, trigger };
    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('step-change', { detail, bubbles: true, composed: true }));
    return true;
  }

  goTo(step: number | string): boolean {
    const steps = this._steps();
    if (!steps.length) return false;

    const activeIndex = this._activeIndex(steps);
    const targetIndex = typeof step === 'number' ? step : steps.findIndex((entry) => entry.value === String(step));
    return this._attemptChange(steps, activeIndex, targetIndex, 'api');
  }

  next(): boolean {
    const steps = this._steps();
    if (!steps.length) return false;

    const activeIndex = this._activeIndex(steps);
    if (activeIndex >= steps.length - 1) {
      if (this._isBusy()) return false;
      const detail = { index: activeIndex, value: steps[activeIndex]?.value || '', title: steps[activeIndex]?.title || '' };
      this.dispatchEvent(new CustomEvent('complete', { detail, bubbles: true, composed: true }));
      return true;
    }

    return this._attemptChange(steps, activeIndex, activeIndex + 1, 'next');
  }

  prev(): boolean {
    const steps = this._steps();
    if (!steps.length) return false;

    const activeIndex = this._activeIndex(steps);
    return this._attemptChange(steps, activeIndex, activeIndex - 1, 'prev');
  }

  private _onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.closest('.btn-prev')) {
      this.prev();
      return;
    }

    if (target.closest('.btn-next')) {
      this.next();
      return;
    }

    const stepTrigger = target.closest('.step') as HTMLButtonElement | null;
    if (!stepTrigger) return;

    const index = Number(stepTrigger.getAttribute('data-index'));
    if (!Number.isInteger(index)) return;

    const steps = this._steps();
    const activeIndex = this._activeIndex(steps);
    this._attemptChange(steps, activeIndex, index, 'stepper');
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    const rtl = orientation === 'horizontal' && getComputedStyle(this).direction === 'rtl';

    const nextArrow = orientation === 'vertical' ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const prevArrow = orientation === 'vertical' ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';

    if (event.altKey && event.key === nextArrow) {
      event.preventDefault();
      this.next();
      return;
    }

    if (event.altKey && event.key === prevArrow) {
      event.preventDefault();
      this.prev();
      return;
    }

    const target = event.target as HTMLElement | null;
    const step = target?.closest('.step') as HTMLButtonElement | null;
    if (!step) return;

    const enabledSteps = this._stepButtons.filter((button) => !button.disabled);
    if (!enabledSteps.length) return;

    const index = enabledSteps.indexOf(step);
    if (index < 0) return;

    if (event.key === nextArrow) {
      event.preventDefault();
      enabledSteps[(index + 1) % enabledSteps.length].focus();
      return;
    }

    if (event.key === prevArrow) {
      event.preventDefault();
      enabledSteps[(index - 1 + enabledSteps.length) % enabledSteps.length].focus();
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      (event.key === 'Home' ? enabledSteps[0] : enabledSteps[enabledSteps.length - 1]).focus();
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      step.click();
    }
  }

  private _syncValueUi(): void {
    if (!this.isConnected) return;
    if (!this.root.querySelector('.frame')) {
      this.requestRender();
      return;
    }

    const steps = this._steps();
    if (!steps.length) return;

    this._isSyncingValueAttribute = true;
    let activeIndex = -1;
    try {
      activeIndex = this._activeIndex(steps);
    } finally {
      this._isSyncingValueAttribute = false;
    }

    this._syncPanels(steps, activeIndex);

    this._stepButtons.forEach((button, index) => {
      const selected = index === activeIndex;
      const visual = this._visualStatus(steps[index], index, activeIndex);
      button.setAttribute('data-active', selected ? 'true' : 'false');
      button.setAttribute('data-status', visual);
      button.setAttribute('aria-selected', selected ? 'true' : 'false');
      button.setAttribute('tabindex', selected ? '0' : '-1');

      const badge = button.querySelector('.step-badge') as HTMLElement | null;
      if (badge) {
        if (visual === 'complete' || visual === 'success') badge.textContent = '✓';
        else if (visual === 'warning') badge.textContent = '!';
        else if (visual === 'error') badge.textContent = '×';
        else badge.textContent = String(index + 1);
      }

      const container = button.closest('.step-item') as HTMLElement | null;
      if (container) {
        container.setAttribute('data-status', visual);
        container.setAttribute('data-complete', index < activeIndex ? 'true' : 'false');
        container.setAttribute('data-current', selected ? 'true' : 'false');
      }
    });

    const total = steps.length;
    const percent = total <= 1 || activeIndex < 0 ? 0 : Math.round((activeIndex / (total - 1)) * 100);
    if (this._progressEl) this._progressEl.style.setProperty('--ui-wizard-progress', `${percent}%`);
    if (this._statusStepEl) this._statusStepEl.textContent = `Step ${Math.max(1, activeIndex + 1)} of ${total}`;
    if (this._statusValueEl) this._statusValueEl.textContent = `${percent}%`;

    const busy = this._isBusy();

    if (this._prevBtn) {
      this._prevBtn.disabled = activeIndex <= 0 || busy;
    }

    if (this._nextBtn) {
      const atLast = activeIndex >= total - 1;
      const nextLabel = this.getAttribute('next-label') || 'Next';
      const finishLabel = this.getAttribute('finish-label') || 'Finish';
      this._nextBtn.textContent = atLast ? finishLabel : nextLabel;
      this._nextBtn.setAttribute('data-loading', busy ? 'true' : 'false');
      this._nextBtn.disabled = busy || activeIndex < 0 || steps[activeIndex]?.disabled === true;
    }

    const frame = this.root.querySelector('.frame') as HTMLElement | null;
    if (frame) frame.setAttribute('aria-busy', busy ? 'true' : 'false');

    if (this._progressRow) {
      const showProgress = this.getAttribute('show-progress') !== 'false' && total > 0;
      if (showProgress) this._progressRow.removeAttribute('hidden');
      else this._progressRow.setAttribute('hidden', '');
    }
  }

  protected override render(): void {
    const steps = this._steps();
    const activeIndex = this._activeIndex(steps);
    this._syncPanels(steps, activeIndex);

    const title = this.getAttribute('title') || '';
    const description = this.getAttribute('description') || '';

    const showStepper = this.getAttribute('show-stepper') !== 'false' && steps.length > 0;
    const showProgress = this.getAttribute('show-progress') !== 'false' && steps.length > 0;
    const stepperPosition = this.getAttribute('stepper-position') === 'bottom' ? 'bottom' : 'top';
    const hideControls = this.hasAttribute('hide-controls') || steps.length === 0;

    const prevLabel = this.getAttribute('prev-label') || 'Previous';
    const nextLabel = this.getAttribute('next-label') || 'Next';
    const finishLabel = this.getAttribute('finish-label') || 'Finish';

    const emptyLabel = this.getAttribute('empty-label') || 'No wizard steps configured. Add elements with slot="step".';

    const stepper = showStepper
      ? `
          <div
            class="stepper"
            part="stepper"
            role="tablist"
            aria-orientation="${this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal'}"
            aria-label="${escapeHtml(this.getAttribute('aria-label') || 'Wizard steps')}"
          >
            ${steps
              .map((step, index) => {
                const visual = this._visualStatus(step, index, activeIndex);
                const tabId = this._tabId(index);
                const panelId = this._panelId(index);
                const badge = visual === 'complete' || visual === 'success' ? '✓' : visual === 'warning' ? '!' : visual === 'error' ? '×' : String(index + 1);
                return `
                  <div class="step-item" part="step-item" data-index="${index}" data-last="${index === steps.length - 1 ? 'true' : 'false'}" data-status="${visual}" data-complete="${index < activeIndex ? 'true' : 'false'}" data-current="${index === activeIndex ? 'true' : 'false'}">
                    <button
                      type="button"
                      class="step"
                      part="step"
                      id="${tabId}"
                      role="tab"
                      aria-controls="${panelId}"
                      data-index="${index}"
                      data-active="${index === activeIndex ? 'true' : 'false'}"
                      data-status="${visual}"
                      aria-selected="${index === activeIndex ? 'true' : 'false'}"
                      aria-disabled="${step.disabled ? 'true' : 'false'}"
                      tabindex="${index === activeIndex ? '0' : '-1'}"
                      ${step.disabled ? 'disabled' : ''}
                    >
                      <span class="step-badge" part="step-badge">${badge}</span>
                      <span class="step-main" part="step-main">
                        <span class="step-title" part="step-title">${escapeHtml(step.title)}${step.optional ? ' (optional)' : ''}</span>
                        ${step.description ? `<span class="step-description" part="step-description">${escapeHtml(step.description)}</span>` : ''}
                      </span>
                    </button>
                  </div>
                `;
              })
              .join('')}
          </div>
        `
      : '<div class="stepper" hidden></div>';

    const atFirst = activeIndex <= 0;
    const atLast = activeIndex >= steps.length - 1;

    this.setContent(`
      <style>${style}</style>
      <section class="frame" part="frame" role="group" aria-label="${escapeHtml(this.getAttribute('aria-label') || 'Wizard')}" aria-busy="${this._isBusy() ? 'true' : 'false'}">
        <h3 class="title" part="title" ${title ? '' : 'hidden'}>${escapeHtml(title)}</h3>
        <p class="description" part="description" ${description ? '' : 'hidden'}>${escapeHtml(description)}</p>

        <div class="status" part="status" ${showProgress ? '' : 'hidden'}>
          <div class="status-row">
            <span class="status-step" part="status-step"></span>
            <span class="status-value" part="status-value"></span>
          </div>
          <div class="progress" part="progress"></div>
        </div>

        ${stepperPosition === 'top' ? stepper : ''}

        <div class="panel" part="panel" ${steps.length ? '' : 'hidden'}><slot></slot></div>
        <p class="empty" part="empty" ${steps.length ? 'hidden' : ''}>${escapeHtml(emptyLabel)}</p>

        ${stepperPosition === 'bottom' ? stepper : ''}

        <div class="controls" part="controls" ${hideControls ? 'hidden' : ''}>
          <div class="group" part="controls-start"><slot name="controls-start"></slot></div>
          <div class="group" part="controls-end">
            <button type="button" class="btn btn-prev" part="button-prev" ${atFirst ? 'disabled' : ''}>${escapeHtml(prevLabel)}</button>
            <button type="button" class="btn primary btn-next" part="button-next" data-loading="${this._isBusy() ? 'true' : 'false'}">${escapeHtml(atLast ? finishLabel : nextLabel)}</button>
            <slot name="controls-end"></slot>
          </div>
        </div>
      </section>
    `);

    this._stepButtons = Array.from(this.root.querySelectorAll<HTMLButtonElement>('.step'));
    this._progressEl = this.root.querySelector('.progress') as HTMLElement | null;
    this._progressRow = this.root.querySelector('.status') as HTMLElement | null;
    this._statusStepEl = this.root.querySelector('.status-step') as HTMLElement | null;
    this._statusValueEl = this.root.querySelector('.status-value') as HTMLElement | null;
    this._prevBtn = this.root.querySelector('.btn-prev') as HTMLButtonElement | null;
    this._nextBtn = this.root.querySelector('.btn-next') as HTMLButtonElement | null;

    this._syncValueUi();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-wizard')) {
  customElements.define('ui-wizard', UIWizard);
}

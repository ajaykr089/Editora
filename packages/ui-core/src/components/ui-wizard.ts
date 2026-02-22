import { ElementBase } from '../ElementBase';

type WizardStep = {
  index: number;
  value: string;
  title: string;
  description: string;
  optional: boolean;
  disabled: boolean;
  node: HTMLElement;
};

const style = `
  :host {
    --ui-wizard-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-wizard-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    --ui-wizard-text: var(--ui-color-text, #0f172a);
    --ui-wizard-muted: var(--ui-color-muted, #64748b);
    --ui-wizard-accent: var(--ui-color-primary, #2563eb);
    --ui-wizard-focus: var(--ui-color-focus-ring, #2563eb);

    display: block;
    min-inline-size: 0;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .frame {
    border: 1px solid var(--ui-wizard-border);
    border-radius: 16px;
    background: var(--ui-wizard-bg);
    color: var(--ui-wizard-text);
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
    padding: 12px;
    display: grid;
    gap: 12px;
  }

  .stepper {
    display: flex;
    align-items: center;
    gap: 8px;
    min-inline-size: 0;
    overflow: auto;
    padding-bottom: 2px;
  }

  .step {
    min-inline-size: 0;
    border: 1px solid color-mix(in srgb, var(--ui-wizard-border) 82%, transparent);
    border-radius: 12px;
    background: color-mix(in srgb, var(--ui-wizard-bg) 98%, transparent);
    padding: 8px 10px;
    display: grid;
    gap: 2px;
    cursor: pointer;
    color: inherit;
    text-align: left;
    transition: border-color 120ms ease, background-color 120ms ease;
  }

  .step:hover {
    border-color: color-mix(in srgb, var(--ui-wizard-accent) 34%, var(--ui-wizard-border));
    background: color-mix(in srgb, var(--ui-wizard-accent) 8%, transparent);
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
    border-color: color-mix(in srgb, var(--ui-wizard-accent) 44%, transparent);
    background: color-mix(in srgb, var(--ui-wizard-accent) 13%, transparent);
  }

  .step-title {
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }

  .step-description {
    font-size: 11px;
    color: var(--ui-wizard-muted);
    white-space: nowrap;
  }

  .panel {
    min-inline-size: 0;
  }

  .panel ::slotted([slot="step"]) {
    display: block;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .controls[hidden] {
    display: none;
  }

  .group {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn {
    border: 1px solid color-mix(in srgb, var(--ui-wizard-border) 84%, transparent);
    border-radius: 10px;
    background: color-mix(in srgb, var(--ui-wizard-bg) 98%, transparent);
    color: var(--ui-wizard-text);
    font: 600 12px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    padding: 8px 12px;
    cursor: pointer;
    transition: border-color 120ms ease, background-color 120ms ease;
  }

  .btn:hover {
    border-color: color-mix(in srgb, var(--ui-wizard-accent) 34%, var(--ui-wizard-border));
  }

  .btn:focus-visible {
    outline: 2px solid var(--ui-wizard-focus);
    outline-offset: 1px;
  }

  .btn[disabled] {
    opacity: 0.42;
    cursor: not-allowed;
  }

  .btn.primary {
    border-color: color-mix(in srgb, var(--ui-wizard-accent) 42%, transparent);
    background: color-mix(in srgb, var(--ui-wizard-accent) 17%, transparent);
    color: color-mix(in srgb, var(--ui-wizard-accent) 86%, #0f172a 14%);
  }

  :host([variant="contrast"]) {
    --ui-wizard-bg: #0f172a;
    --ui-wizard-border: #334155;
    --ui-wizard-text: #e2e8f0;
    --ui-wizard-muted: #93a4bd;
    --ui-wizard-accent: #93c5fd;
    --ui-wizard-focus: #93c5fd;
  }

  :host([variant="minimal"]) .frame {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }

  :host([headless]) .frame {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .frame,
    .step,
    .btn {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .frame {
      box-shadow: none;
    }

    .step,
    .btn {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-wizard-bg: Canvas;
      --ui-wizard-border: CanvasText;
      --ui-wizard-text: CanvasText;
      --ui-wizard-muted: CanvasText;
      --ui-wizard-accent: Highlight;
      --ui-wizard-focus: Highlight;
    }

    .frame,
    .step,
    .btn {
      forced-color-adjust: none;
      box-shadow: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }

    .step[data-active="true"],
    .btn.primary {
      border-color: Highlight;
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
      'aria-label'
    ];
  }

  private _observer: MutationObserver | null = null;
  private readonly _instanceId = ++wizardInstanceId;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);

    this._observer = new MutationObserver(() => {
      this.requestRender();
    });

    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['slot', 'data-value', 'data-title', 'data-description', 'data-optional', 'data-disabled', 'disabled']
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

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    const normalized = String(next || '');
    if (!normalized) this.removeAttribute('value');
    else this.setAttribute('value', normalized);
  }

  private _steps(): WizardStep[] {
    const nodes = Array.from(this.querySelectorAll('[slot="step"]')) as HTMLElement[];
    return nodes.map((node, index) => ({
      index,
      value: node.getAttribute('data-value') || String(index + 1),
      title: node.getAttribute('data-title') || node.getAttribute('title') || `Step ${index + 1}`,
      description: node.getAttribute('data-description') || '',
      optional: isTruthy(node.getAttribute('data-optional')),
      disabled: node.hasAttribute('disabled') || isTruthy(node.getAttribute('data-disabled')),
      node
    }));
  }

  private _activeIndex(steps: WizardStep[]): number {
    if (!steps.length) return -1;
    const current = this.getAttribute('value') || '';
    if (current) {
      const byValue = steps.findIndex((step) => step.value === current);
      if (byValue >= 0) return byValue;
    }

    const first = steps.find((step) => !step.disabled) || steps[0];
    if (first && this.getAttribute('value') !== first.value) this.setAttribute('value', first.value);
    return steps.findIndex((step) => step.value === first.value);
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
      if (!keepMounted) step.node.hidden = !active;
      else step.node.hidden = false;
    });
  }

  private _tabId(index: number): string {
    return `ui-wizard-${this._instanceId}-tab-${index}`;
  }

  private _panelId(index: number): string {
    return `ui-wizard-${this._instanceId}-panel-${index}`;
  }

  private _attemptChange(steps: WizardStep[], activeIndex: number, targetIndex: number, trigger: string): boolean {
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
    const active = this._activeIndex(steps);
    const target = typeof step === 'number' ? step : steps.findIndex((entry) => entry.value === String(step));
    return this._attemptChange(steps, active, target, 'api');
  }

  next(): boolean {
    const steps = this._steps();
    if (!steps.length) return false;
    const active = this._activeIndex(steps);
    if (active >= steps.length - 1) {
      const detail = { index: active, value: steps[active]?.value || '', title: steps[active]?.title || '' };
      this.dispatchEvent(new CustomEvent('complete', { detail, bubbles: true, composed: true }));
      return true;
    }
    return this._attemptChange(steps, active, active + 1, 'next');
  }

  prev(): boolean {
    const steps = this._steps();
    if (!steps.length) return false;
    const active = this._activeIndex(steps);
    return this._attemptChange(steps, active, active - 1, 'prev');
  }

  private _onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const prevBtn = target.closest('.btn-prev');
    if (prevBtn) {
      this.prev();
      return;
    }

    const nextBtn = target.closest('.btn-next');
    if (nextBtn) {
      this.next();
      return;
    }

    const stepTrigger = target.closest('.step') as HTMLButtonElement | null;
    if (stepTrigger) {
      const index = Number(stepTrigger.getAttribute('data-index'));
      if (!Number.isInteger(index)) return;
      const steps = this._steps();
      const active = this._activeIndex(steps);
      this._attemptChange(steps, active, index, 'stepper');
    }
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const rtl = getComputedStyle(this).direction === 'rtl';
    const nextArrow = rtl ? 'ArrowLeft' : 'ArrowRight';
    const prevArrow = rtl ? 'ArrowRight' : 'ArrowLeft';

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

    const steps = Array.from(this.root.querySelectorAll<HTMLButtonElement>('.step:not([disabled])'));
    if (!steps.length) return;
    const index = steps.indexOf(step);
    if (index < 0) return;

    if (event.key === nextArrow || event.key === 'ArrowDown') {
      event.preventDefault();
      steps[(index + 1) % steps.length].focus();
      return;
    }

    if (event.key === prevArrow || event.key === 'ArrowUp') {
      event.preventDefault();
      steps[(index - 1 + steps.length) % steps.length].focus();
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      (event.key === 'Home' ? steps[0] : steps[steps.length - 1]).focus();
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      step.click();
    }
  }

  protected override render(): void {
    const steps = this._steps();
    const active = this._activeIndex(steps);
    this._syncPanels(steps, active);

    const showStepper = this.getAttribute('show-stepper') !== 'false';
    const stepperPosition = this.getAttribute('stepper-position') === 'bottom' ? 'bottom' : 'top';
    const hideControls = this.hasAttribute('hide-controls');

    const prevLabel = this.getAttribute('prev-label') || 'Previous';
    const nextLabel = this.getAttribute('next-label') || 'Next';
    const finishLabel = this.getAttribute('finish-label') || 'Finish';

    const stepper = showStepper
      ? `
          <div class="stepper" part="stepper" role="tablist" aria-orientation="horizontal" aria-label="${escapeHtml(this.getAttribute('aria-label') || 'Wizard steps')}">
            ${steps
              .map((step, index) => {
                const tabId = this._tabId(index);
                const panelId = this._panelId(index);
                return `
                <button
                  type="button"
                  class="step"
                  part="step"
                  id="${tabId}"
                  role="tab"
                  aria-controls="${panelId}"
                  data-index="${index}"
                  data-active="${index === active ? 'true' : 'false'}"
                  aria-selected="${index === active ? 'true' : 'false'}"
                  aria-disabled="${step.disabled ? 'true' : 'false'}"
                  tabindex="${index === active ? '0' : '-1'}"
                  ${step.disabled ? 'disabled' : ''}
                >
                  <span class="step-title">${escapeHtml(step.title)}${step.optional ? ' (optional)' : ''}</span>
                  ${step.description ? `<span class="step-description">${escapeHtml(step.description)}</span>` : ''}
                </button>
              `;
              })
              .join('')}
          </div>
        `
      : '';

    const atFirst = active <= 0;
    const atLast = active >= steps.length - 1;

    this.setContent(`
      <style>${style}</style>
      <section class="frame" part="frame">
        ${stepperPosition === 'top' ? stepper : ''}
        <div class="panel" part="panel"><slot></slot></div>
        ${stepperPosition === 'bottom' ? stepper : ''}
        <div class="controls" part="controls" ${hideControls ? 'hidden' : ''}>
          <div class="group"><slot name="controls-start"></slot></div>
          <div class="group">
            <button type="button" class="btn btn-prev" part="button-prev" ${atFirst ? 'disabled' : ''}>${escapeHtml(prevLabel)}</button>
            <button type="button" class="btn primary btn-next" part="button-next">${escapeHtml(atLast ? finishLabel : nextLabel)}</button>
            <slot name="controls-end"></slot>
          </div>
        </div>
      </section>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-wizard')) {
  customElements.define('ui-wizard', UIWizard);
}

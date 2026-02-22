import { ElementBase } from '../ElementBase';

type StepInput = {
  value?: string;
  label?: string;
  description?: string;
  optional?: boolean;
  disabled?: boolean;
  state?: 'default' | 'complete' | 'error' | 'warning';
};

type StepItem = {
  index: number;
  value: string;
  label: string;
  description: string;
  optional: boolean;
  disabled: boolean;
  state: 'default' | 'complete' | 'error' | 'warning';
};

const style = `
  :host {
    --ui-stepper-gap: 8px;
    --ui-stepper-radius: 12px;
    --ui-stepper-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 95%, transparent);
    --ui-stepper-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    --ui-stepper-text: var(--ui-color-text, #0f172a);
    --ui-stepper-muted: var(--ui-color-muted, #64748b);
    --ui-stepper-accent: var(--ui-color-primary, #2563eb);
    --ui-stepper-focus: var(--ui-color-focus-ring, #2563eb);

    display: block;
    min-inline-size: 0;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .frame {
    border: 1px solid var(--ui-stepper-border);
    border-radius: var(--ui-stepper-radius);
    background: var(--ui-stepper-bg);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    padding: 10px;
  }

  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: stretch;
    gap: var(--ui-stepper-gap);
    min-inline-size: 0;
  }

  :host([orientation="vertical"]) .list {
    flex-direction: column;
  }

  .item {
    flex: 1 1 0;
    min-inline-size: 0;
    display: grid;
    gap: 6px;
  }

  .trigger {
    min-inline-size: 0;
    inline-size: 100%;
    border: 1px solid color-mix(in srgb, var(--ui-stepper-border) 82%, transparent);
    border-radius: 11px;
    background: color-mix(in srgb, var(--ui-stepper-bg) 98%, transparent);
    color: var(--ui-stepper-text);
    padding: 8px 10px;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 8px;
    align-items: center;
    text-align: left;
    cursor: pointer;
    transition: border-color 130ms ease, background-color 130ms ease, color 130ms ease;
  }

  .trigger:hover {
    border-color: color-mix(in srgb, var(--ui-stepper-accent) 34%, var(--ui-stepper-border));
    background: color-mix(in srgb, var(--ui-stepper-accent) 8%, transparent);
  }

  .trigger:focus-visible {
    outline: 2px solid var(--ui-stepper-focus);
    outline-offset: 1px;
  }

  .trigger[disabled] {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .index {
    inline-size: 20px;
    block-size: 20px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--ui-stepper-border) 82%, transparent);
    display: inline-grid;
    place-items: center;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
  }

  .meta {
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
    font-size: 12px;
    font-weight: 600;
  }

  .description {
    font-size: 11px;
    color: var(--ui-stepper-muted);
  }

  .connector {
    inline-size: 100%;
    block-size: 2px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-stepper-border) 82%, transparent);
  }

  :host([orientation="vertical"]) .connector {
    inline-size: 2px;
    block-size: 14px;
    margin-inline-start: 9px;
  }

  .item[data-state="current"] .trigger {
    border-color: color-mix(in srgb, var(--ui-stepper-accent) 46%, transparent);
    background: color-mix(in srgb, var(--ui-stepper-accent) 13%, transparent);
  }

  .item[data-state="current"] .index,
  .item[data-state="complete"] .index {
    border-color: color-mix(in srgb, var(--ui-stepper-accent) 44%, transparent);
    background: color-mix(in srgb, var(--ui-stepper-accent) 18%, transparent);
    color: color-mix(in srgb, var(--ui-stepper-accent) 86%, #0f172a 14%);
  }

  .item[data-state="complete"] .connector {
    background: color-mix(in srgb, var(--ui-stepper-accent) 52%, transparent);
  }

  .item[data-state="error"] .trigger {
    border-color: color-mix(in srgb, var(--ui-color-danger, #dc2626) 50%, transparent);
  }

  :host([variant="contrast"]) {
    --ui-stepper-bg: #0f172a;
    --ui-stepper-border: #334155;
    --ui-stepper-text: #e2e8f0;
    --ui-stepper-muted: #93a4bd;
    --ui-stepper-accent: #93c5fd;
    --ui-stepper-focus: #93c5fd;
  }

  :host([variant="minimal"]) .frame {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }

  :host([size="sm"]) {
    --ui-stepper-gap: 6px;
  }

  :host([size="lg"]) {
    --ui-stepper-gap: 10px;
  }

  :host([headless]) .frame {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .trigger,
    .frame {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-stepper-border: color-mix(in srgb, var(--ui-stepper-text) 70%, transparent);
    }

    .frame {
      box-shadow: none;
    }

    .trigger {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-stepper-bg: Canvas;
      --ui-stepper-border: CanvasText;
      --ui-stepper-text: CanvasText;
      --ui-stepper-muted: CanvasText;
      --ui-stepper-accent: Highlight;
      --ui-stepper-focus: Highlight;
    }

    .frame,
    .trigger,
    .index,
    .connector {
      forced-color-adjust: none;
      box-shadow: none;
    }

    .frame,
    .trigger {
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }

    .item[data-state="current"] .trigger,
    .item[data-state="complete"] .trigger {
      border-color: Highlight;
    }

    .item[data-state="complete"] .connector {
      background: Highlight;
    }

    .index {
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
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

function parseSteps(raw: string | null): StepInput[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => entry && typeof entry === 'object') as StepInput[];
  } catch {
    return [];
  }
}

function isTruthy(raw: string | null): boolean {
  if (raw == null) return false;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

export class UIStepper extends ElementBase {
  static get observedAttributes() {
    return [
      'steps',
      'value',
      'orientation',
      'variant',
      'size',
      'clickable',
      'linear',
      'headless',
      'aria-label'
    ];
  }

  private _observer: MutationObserver | null = null;

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
      if (this.hasAttribute('steps')) return;
      this.requestRender();
    });

    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['slot', 'data-value', 'data-label', 'data-description', 'data-optional', 'data-disabled', 'data-state', 'disabled']
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

  private _fromSlots(): StepItem[] {
    const nodes = Array.from(this.querySelectorAll('[slot="step"], [data-step]')) as HTMLElement[];
    return nodes.map((node, index) => {
      const value = node.getAttribute('data-value') || String(index + 1);
      const label = node.getAttribute('data-label') || node.getAttribute('title') || node.textContent?.trim() || `Step ${index + 1}`;
      const description = node.getAttribute('data-description') || '';
      const optional = isTruthy(node.getAttribute('data-optional'));
      const disabled = node.hasAttribute('disabled') || isTruthy(node.getAttribute('data-disabled'));
      const stateRaw = node.getAttribute('data-state');
      const state = stateRaw === 'complete' || stateRaw === 'error' || stateRaw === 'warning' ? stateRaw : 'default';
      return { index, value, label, description, optional, disabled, state };
    });
  }

  private _fromAttr(): StepItem[] {
    return parseSteps(this.getAttribute('steps')).map((entry, index) => {
      const state = entry.state === 'complete' || entry.state === 'error' || entry.state === 'warning' ? entry.state : 'default';
      return {
        index,
        value: entry.value != null ? String(entry.value) : String(index + 1),
        label: entry.label != null ? String(entry.label) : `Step ${index + 1}`,
        description: entry.description != null ? String(entry.description) : '',
        optional: !!entry.optional,
        disabled: !!entry.disabled,
        state
      };
    });
  }

  private _steps(): StepItem[] {
    const fromAttr = this._fromAttr();
    return fromAttr.length ? fromAttr : this._fromSlots();
  }

  private _activeIndex(steps: StepItem[]): number {
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

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    const normalized = String(next || '');
    if (!normalized) this.removeAttribute('value');
    else this.setAttribute('value', normalized);
  }

  goTo(step: number | string): boolean {
    const steps = this._steps();
    if (!steps.length) return false;
    const activeIndex = this._activeIndex(steps);
    const targetIndex = typeof step === 'number' ? step : steps.findIndex((entry) => entry.value === String(step));
    if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= steps.length) return false;
    return this._selectIndex(steps, activeIndex, targetIndex, 'api');
  }

  next(): boolean {
    const steps = this._steps();
    const activeIndex = this._activeIndex(steps);
    if (activeIndex < 0) return false;
    const target = Math.min(steps.length - 1, activeIndex + 1);
    return this._selectIndex(steps, activeIndex, target, 'next');
  }

  prev(): boolean {
    const steps = this._steps();
    const activeIndex = this._activeIndex(steps);
    if (activeIndex < 0) return false;
    const target = Math.max(0, activeIndex - 1);
    return this._selectIndex(steps, activeIndex, target, 'prev');
  }

  private _selectIndex(steps: StepItem[], activeIndex: number, targetIndex: number, trigger: string): boolean {
    if (targetIndex === activeIndex) return true;

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

    const detail = {
      index: targetIndex,
      value: target.value,
      label: target.label,
      trigger
    };

    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('select', { detail, bubbles: true, composed: true }));
    return true;
  }

  private _onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    const trigger = target?.closest('.trigger') as HTMLButtonElement | null;
    if (!trigger) return;

    if (!this.hasAttribute('clickable') && !this.hasAttribute('linear')) return;
    const index = Number(trigger.getAttribute('data-index'));
    if (!Number.isInteger(index)) return;

    const steps = this._steps();
    const activeIndex = this._activeIndex(steps);
    this._selectIndex(steps, activeIndex, index, 'click');
  }

  private _moveFocus(current: HTMLElement, delta: number): void {
    const triggers = Array.from(this.root.querySelectorAll<HTMLButtonElement>('.trigger:not([disabled])'));
    if (!triggers.length) return;
    const index = triggers.indexOf(current as HTMLButtonElement);
    if (index < 0) return;
    const next = (index + delta + triggers.length) % triggers.length;
    triggers[next].focus();
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const trigger = target?.closest('.trigger') as HTMLButtonElement | null;
    if (!trigger) return;

    const vertical = this.getAttribute('orientation') === 'vertical';
    const rtl = !vertical && getComputedStyle(this).direction === 'rtl';
    const forward = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';

    if (event.key === forward) {
      event.preventDefault();
      this._moveFocus(trigger, 1);
      return;
    }

    if (event.key === back) {
      event.preventDefault();
      this._moveFocus(trigger, -1);
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      const triggers = Array.from(this.root.querySelectorAll<HTMLButtonElement>('.trigger:not([disabled])'));
      if (!triggers.length) return;
      event.preventDefault();
      (event.key === 'Home' ? triggers[0] : triggers[triggers.length - 1]).focus();
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      trigger.click();
    }
  }

  protected override render(): void {
    const steps = this._steps();
    const activeIndex = this._activeIndex(steps);
    const ariaLabel = this.getAttribute('aria-label') || 'Stepper';

    const items = steps
      .map((step, index) => {
        const status = step.state !== 'default'
          ? step.state
          : index < activeIndex
            ? 'complete'
            : index === activeIndex
              ? 'current'
              : 'upcoming';

        return `
          <li class="item" part="item" data-state="${status}" data-active="${index === activeIndex ? 'true' : 'false'}">
            <button
              type="button"
              class="trigger"
              part="trigger"
              data-index="${index}"
              aria-current="${index === activeIndex ? 'step' : 'false'}"
              aria-disabled="${step.disabled ? 'true' : 'false'}"
              ${step.disabled ? 'disabled' : ''}
            >
              <span class="index" part="index">${index < activeIndex ? '✓' : index + 1}</span>
              <span class="meta" part="meta">
                <span class="label">${escapeHtml(step.label)}${step.optional ? ' (optional)' : ''}</span>
                ${step.description ? `<span class="description">${escapeHtml(step.description)}</span>` : ''}
              </span>
            </button>
            ${index < steps.length - 1 ? '<span class="connector" part="connector"></span>' : ''}
          </li>
        `;
      })
      .join('');

    this.setContent(`
      <style>${style}</style>
      <section class="frame" part="frame" role="group" aria-label="${escapeHtml(ariaLabel)}">
        <ol class="list" part="list">${items}</ol>
      </section>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-stepper')) {
  customElements.define('ui-stepper', UIStepper);
}

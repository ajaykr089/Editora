import { ElementBase } from '../ElementBase';
import { clampTime, formatTime, parseTimeInput } from './date-time-utils';

type TimeSegment = 'hour' | 'minute' | 'second' | 'meridiem';
type TimeFieldSource = 'api' | 'keyboard' | 'clear' | 'form';
type TimeParts = { hours: number; minutes: number; seconds: number };
let timeFieldUid = 0;

const style = `
  :host {
    --ui-time-field-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    --ui-time-field-border: 1px solid var(--ui-time-field-border-color);
    --ui-time-field-radius: var(--ui-radius, 12px);
    --ui-time-field-bg: var(--ui-color-surface, #ffffff);
    --ui-time-field-text: var(--ui-color-text, #0f172a);
    --ui-time-field-muted: var(--ui-color-muted, #64748b);
    --ui-time-field-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-time-field-danger: var(--ui-color-danger, #dc2626);
    display: block;
    inline-size: 100%;
    min-inline-size: 0;
    color: var(--ui-time-field-text);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color-scheme: light dark;
  }

  .root {
    display: grid;
    gap: 8px;
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
    color: var(--ui-time-field-muted);
    font: 600 13px/1.35 "IBM Plex Sans", "Inter", sans-serif;
  }

  .required {
    color: var(--ui-time-field-danger);
    font-size: 12px;
    line-height: 1;
  }

  .description,
  .error {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    letter-spacing: 0.01em;
  }

  .description {
    color: var(--ui-time-field-muted);
  }

  .error {
    color: var(--ui-time-field-danger);
  }

  .shell {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    min-block-size: 44px;
    padding: 0 10px;
    border: var(--ui-time-field-border);
    border-radius: var(--ui-time-field-radius);
    background: var(--ui-time-field-bg);
    transition: border-color 160ms ease, box-shadow 160ms ease;
    box-sizing: border-box;
  }

  .shell[data-focused="true"] {
    border-color: color-mix(in srgb, var(--ui-time-field-focus) 58%, var(--ui-time-field-border-color));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-time-field-focus) 22%, transparent);
  }

  .shell[data-invalid="true"] {
    border-color: color-mix(in srgb, var(--ui-time-field-danger) 62%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-time-field-danger) 18%, transparent);
  }

  .segment {
    border: none;
    background: transparent;
    color: inherit;
    min-inline-size: 0;
    padding: 6px 4px;
    border-radius: 8px;
    font: 600 15px/1.2 "Inter", "IBM Plex Sans", sans-serif;
    cursor: pointer;
    transition: background-color 120ms ease, color 120ms ease;
    text-transform: uppercase;
  }

  .segment[data-empty="true"] {
    color: color-mix(in srgb, var(--ui-time-field-text) 38%, transparent);
  }

  .segment[data-active="true"] {
    background: color-mix(in srgb, var(--ui-time-field-focus) 16%, transparent);
  }

  .segment:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-time-field-focus) 56%, transparent);
    outline-offset: 1px;
  }

  .literal {
    color: color-mix(in srgb, var(--ui-time-field-text) 42%, transparent);
    font: 600 14px/1 "Inter", "IBM Plex Sans", sans-serif;
  }

  .label[hidden],
  .description[hidden],
  .error[hidden],
  .meta[hidden] {
    display: none;
  }

  :host([disabled]) .shell {
    opacity: 0.68;
  }

  :host([disabled]) .segment,
  :host([readonly]) .segment {
    cursor: default;
  }
`;

function parseStoredTime(value: string | null, seconds: boolean): TimeParts | null {
  return parseTimeInput(value || '', true) || null;
}

function hour12Parts(parts: TimeParts): { hour: number; meridiem: 'AM' | 'PM' } {
  const displayHour = parts.hours % 12 || 12;
  return { hour: displayHour, meridiem: parts.hours >= 12 ? 'PM' : 'AM' };
}

function to24Hour(hour: number, meridiem: 'AM' | 'PM'): number {
  if (meridiem === 'AM') return hour === 12 ? 0 : hour;
  return hour === 12 ? 12 : hour + 12;
}

function segmentPlaceholder(segment: TimeSegment): string {
  if (segment === 'meridiem') return 'AM';
  return segment === 'hour' ? 'HH' : segment === 'minute' ? 'MM' : 'SS';
}

export class UITimeField extends ElementBase {
  static formAssociated = true;

  static get observedAttributes() {
    return ['value', 'min', 'max', 'format', 'seconds', 'label', 'description', 'data-error', 'required', 'disabled', 'readonly', 'name', 'locale'];
  }

  private _value: string | null = null;
  private _activeSegment: TimeSegment = 'hour';
  private _segmentButtons = new Map<TimeSegment, HTMLButtonElement>();
  private _segmentsEl: HTMLElement | null = null;
  private _shellEl: HTMLElement | null = null;
  private _errorEl: HTMLElement | null = null;
  private _formUnregister: (() => void) | null = null;
  private _bufferBySegment: Record<'hour' | 'minute' | 'second', string> = { hour: '', minute: '', second: '' };
  private _bufferTimer: number | null = null;
  private _internals: ElementInternals | null = null;
  private _uid = `ui-time-field-${++timeFieldUid}`;
  private _defaultValue: string | null = null;

  constructor() {
    super();
    try {
      this._internals = typeof this.attachInternals === 'function' ? this.attachInternals() : null;
    } catch {
      this._internals = null;
    }
    this._onSegmentKeyDown = this._onSegmentKeyDown.bind(this);
    this._onSegmentClick = this._onSegmentClick.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onFocusOut = this._onFocusOut.bind(this);
  }

  get value(): string {
    return this._value || '';
  }

  set value(next: string) {
    this._setValue(next || null, 'api');
  }

  clearValue(): void {
    this._setValue(null, 'clear');
  }

  formResetCallback(): void {
    this._setValue(this._defaultValue, 'form');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this._defaultValue == null) this._defaultValue = this.getAttribute('value');
    this._registerWithForm();
  }

  override disconnectedCallback(): void {
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }
    if (this._bufferTimer != null) {
      window.clearTimeout(this._bufferTimer);
      this._bufferTimer = null;
    }
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'value') this._value = this._normalizeTimeValue(newValue);
    if (name === 'name' && this.isConnected) this._registerWithForm();
    if (this._shellEl) this._syncUi();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="root">
        <div class="meta" hidden>
          <div class="label" hidden><span class="label-text"></span><span class="required" hidden>*</span></div>
          <div class="description" hidden></div>
        </div>
        <div class="shell" part="shell" data-focused="false" data-invalid="false">
          <div class="segments" part="segments"></div>
        </div>
        <div class="error" part="error" hidden></div>
      </div>
    `);

    this._segmentsEl = this.root.querySelector('.segments');
    this._shellEl = this.root.querySelector('.shell');
    this._errorEl = this.root.querySelector('.error');
    this._shellEl?.addEventListener('focusin', this._onFocusIn);
    this._shellEl?.addEventListener('focusout', this._onFocusOut);

    this._value = this._normalizeTimeValue(this.getAttribute('value'));
    this._syncFormValue();
    this._syncUi();
  }

  private _showSeconds(): boolean {
    return this.hasAttribute('seconds');
  }

  private _is12h(): boolean {
    return (this.getAttribute('format') || '').toLowerCase() === '12h';
  }

  private _normalizeTimeValue(value: string | null): string | null {
    const parsed = parseTimeInput(value || '', true);
    if (!parsed) return null;
    const normalized = formatTime(parsed, this._showSeconds());
    const min = this.getAttribute('min');
    const max = this.getAttribute('max');
    return clampTime(normalized, min, max);
  }

  private _partsOrFallback(): TimeParts {
    return parseStoredTime(this._value, this._showSeconds()) || parseStoredTime(this.getAttribute('min'), this._showSeconds()) || { hours: 9, minutes: 0, seconds: 0 };
  }

  private _order(): TimeSegment[] {
    const order: TimeSegment[] = ['hour', 'minute'];
    if (this._showSeconds()) order.push('second');
    if (this._is12h()) order.push('meridiem');
    return order;
  }

  private _focusSegment(segment: TimeSegment): void {
    this._activeSegment = segment;
    this._syncUi();
    this._segmentButtons.get(segment)?.focus();
  }

  private _moveSegmentFocus(step: 1 | -1): void {
    const order = this._order();
    const index = order.indexOf(this._activeSegment);
    const next = order[(index + step + order.length) % order.length];
    this._focusSegment(next);
  }

  private _setBuffer(segment: 'hour' | 'minute' | 'second', value: string): void {
    this._bufferBySegment[segment] = value;
    if (this._bufferTimer != null) window.clearTimeout(this._bufferTimer);
    this._bufferTimer = window.setTimeout(() => {
      this._bufferBySegment.hour = '';
      this._bufferBySegment.minute = '';
      this._bufferBySegment.second = '';
      this._bufferTimer = null;
    }, 900);
  }

  private _applyParts(parts: TimeParts, source: TimeFieldSource): void {
    const normalized = this._normalizeTimeValue(formatTime(parts, this._showSeconds()));
    this._setValue(normalized, source);
  }

  private _setValue(next: string | null, source: TimeFieldSource): void {
    const normalized = this._normalizeTimeValue(next);
    if (normalized === this._value) {
      this._syncFormValue();
      this._syncUi();
      return;
    }
    const previousValue = this._value;
    this._value = normalized;
    if (normalized) this.setAttribute('value', normalized);
    else this.removeAttribute('value');
    this._syncFormValue();
    this._syncUi();
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: normalized, previousValue, source },
        bubbles: true,
        composed: true
      })
    );
  }

  private _syncFormValue(): void {
    try {
      this._internals?.setFormValue(this.value || '');
    } catch {
      // ignore unsupported form-associated environments
    }
  }

  private _increment(segment: TimeSegment, delta: 1 | -1): void {
    const parts = this._partsOrFallback();
    if (segment === 'meridiem') {
      parts.hours = (parts.hours + 12) % 24;
      this._applyParts(parts, 'keyboard');
      return;
    }

    const totalSeconds = parts.hours * 3600 + parts.minutes * 60 + parts.seconds;
    const step = segment === 'hour' ? 3600 : segment === 'minute' ? 60 : 1;
    const normalized = (totalSeconds + (delta * step) + 86400) % 86400;
    const next: TimeParts = {
      hours: Math.floor(normalized / 3600),
      minutes: Math.floor((normalized % 3600) / 60),
      seconds: normalized % 60
    };
    this._applyParts(next, 'keyboard');
  }

  private _applyNumericInput(segment: 'hour' | 'minute' | 'second', digit: string): void {
    const nextBuffer = `${this._bufferBySegment[segment]}${digit}`.slice(-2);
    this._setBuffer(segment, nextBuffer);
    if (nextBuffer.length < 2) return;

    const parts = this._partsOrFallback();
    const value = Number(nextBuffer);
    if (!Number.isFinite(value)) return;

    if (segment === 'hour') {
      if (this._is12h()) {
        const { meridiem } = hour12Parts(parts);
        const hour = Math.min(Math.max(value, 1), 12);
        parts.hours = to24Hour(hour, meridiem);
      } else {
        parts.hours = Math.min(Math.max(value, 0), 23);
      }
    } else if (segment === 'minute') {
      parts.minutes = Math.min(Math.max(value, 0), 59);
    } else {
      parts.seconds = Math.min(Math.max(value, 0), 59);
    }

    this._applyParts(parts, 'keyboard');
    this._moveSegmentFocus(1);
  }

  private _onSegmentClick(event: Event): void {
    const segment = (event.currentTarget as HTMLElement).getAttribute('data-segment') as TimeSegment | null;
    if (!segment) return;
    this._focusSegment(segment);
  }

  private _onSegmentKeyDown(event: KeyboardEvent): void {
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return;
    const segment = (event.currentTarget as HTMLElement).getAttribute('data-segment') as TimeSegment | null;
    if (!segment) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this._moveSegmentFocus(-1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this._moveSegmentFocus(1);
      return;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      this._increment(segment, event.key === 'ArrowUp' ? 1 : -1);
      return;
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      this.clearValue();
      return;
    }
    if (segment === 'meridiem' && /^[ap]$/i.test(event.key)) {
      event.preventDefault();
      const parts = this._partsOrFallback();
      const nextMeridiem = event.key.toLowerCase() === 'a' ? 'AM' : 'PM';
      const current12 = hour12Parts(parts).hour;
      parts.hours = to24Hour(current12, nextMeridiem);
      this._applyParts(parts, 'keyboard');
      return;
    }
    if (/^\d$/.test(event.key) && segment !== 'meridiem') {
      event.preventDefault();
      this._applyNumericInput(segment, event.key);
    }
  }

  private _registerWithForm(): void {
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }

    try {
      const rootNode = this.getRootNode() as Document | ShadowRoot;
      const host = (rootNode as ShadowRoot).host as HTMLElement | undefined;
      const formFromHost = host?.closest?.('ui-form') || null;
      const parentForm = formFromHost || this.closest('ui-form');
      const name = this.getAttribute('name');
      if (parentForm && typeof (parentForm as any).registerField === 'function' && name) {
        this._formUnregister = (parentForm as any).registerField(name, {
          name,
          getValue: () => this.value,
          setValue: (next: any) => this._setValue(next ? String(next) : null, 'form'),
          validate: async () => {
            if (this.hasAttribute('required') && !this.value) {
              return { valid: false, message: 'Time is required' };
            }
            return { valid: true };
          },
          setError: (message?: string) => {
            if (message) this.setAttribute('data-error', message);
            else this.removeAttribute('data-error');
            this._syncUi();
          }
        });
      }
    } catch {
      // ignore outside form controller
    }
  }

  private _onFocusIn(): void {
    this._shellEl?.setAttribute('data-focused', 'true');
  }

  private _onFocusOut(event: FocusEvent): void {
    if (this._shellEl?.contains(event.relatedTarget as Node | null)) return;
    this._shellEl?.setAttribute('data-focused', 'false');
  }

  private _syncUi(): void {
    if (!this._segmentsEl || !this._shellEl || !this._errorEl) return;
    const activeElement = this.root.activeElement as HTMLElement | null;
    const shouldRestoreFocus = !!activeElement && this._segmentsEl.contains(activeElement);

    const label = (this.getAttribute('label') || '').trim();
    const description = (this.getAttribute('description') || '').trim();
    const error = (this.getAttribute('data-error') || '').trim();
    const metaEl = this.root.querySelector('.meta') as HTMLElement;
    const labelEl = this.root.querySelector('.label') as HTMLElement;
    const labelText = this.root.querySelector('.label-text') as HTMLElement;
    const requiredEl = this.root.querySelector('.required') as HTMLElement;
    const descriptionEl = this.root.querySelector('.description') as HTMLElement;
    const labelId = `${this._uid}-label`;
    const descriptionId = `${this._uid}-description`;
    const errorId = `${this._uid}-error`;

    metaEl.hidden = !label && !description;
    labelEl.hidden = !label;
    labelEl.id = label ? labelId : '';
    labelText.textContent = label;
    requiredEl.hidden = !this.hasAttribute('required');
    descriptionEl.hidden = !description;
    descriptionEl.id = description ? descriptionId : '';
    descriptionEl.textContent = description;
    this._errorEl.hidden = !error;
    this._errorEl.id = error ? errorId : '';
    this._errorEl.textContent = error;
    this._shellEl.setAttribute('data-invalid', error ? 'true' : 'false');
    this._shellEl.setAttribute('role', 'group');
    if (label) this._shellEl.setAttribute('aria-labelledby', labelId);
    else this._shellEl.removeAttribute('aria-labelledby');
    const describedBy = [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(' ');
    if (describedBy) this._shellEl.setAttribute('aria-describedby', describedBy);
    else this._shellEl.removeAttribute('aria-describedby');
    this._shellEl.setAttribute('aria-invalid', error ? 'true' : 'false');
    this._shellEl.setAttribute('aria-required', this.hasAttribute('required') ? 'true' : 'false');
    this._shellEl.setAttribute('aria-disabled', this.hasAttribute('disabled') ? 'true' : 'false');
    this._shellEl.setAttribute('aria-readonly', this.hasAttribute('readonly') ? 'true' : 'false');
    const parts = parseStoredTime(this._value, this._showSeconds());
    const order = this._order();
    const nextChildren: Node[] = [];
    this._segmentButtons.clear();
    const twelveParts = parts ? hour12Parts(parts) : null;

    order.forEach((segment, index) => {
      if (index > 0) {
        const literal = document.createElement('span');
        literal.className = 'literal';
        literal.textContent = segment === 'meridiem' ? ' ' : ':';
        nextChildren.push(literal);
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'segment';
      button.setAttribute('data-segment', segment);
      button.setAttribute('data-active', this._activeSegment === segment ? 'true' : 'false');
      button.setAttribute('data-empty', parts ? 'false' : 'true');
      button.setAttribute('aria-label', segment === 'hour' ? 'Hour' : segment === 'minute' ? 'Minute' : segment === 'second' ? 'Second' : 'AM or PM');
      button.tabIndex = this._activeSegment === segment ? 0 : -1;
      button.disabled = this.hasAttribute('disabled');
      button.addEventListener('click', this._onSegmentClick);
      button.addEventListener('keydown', this._onSegmentKeyDown);

      if (!parts) {
        button.textContent = segmentPlaceholder(segment);
      } else if (segment === 'hour') {
        const hour = this._is12h() ? twelveParts!.hour : parts.hours;
        button.textContent = String(hour).padStart(2, '0');
      } else if (segment === 'minute') {
        button.textContent = String(parts.minutes).padStart(2, '0');
      } else if (segment === 'second') {
        button.textContent = String(parts.seconds).padStart(2, '0');
      } else {
        button.textContent = twelveParts!.meridiem;
      }

      this._segmentButtons.set(segment, button);
      nextChildren.push(button);
    });

    this._segmentsEl.replaceChildren(...nextChildren);

    if (shouldRestoreFocus) {
      const nextFocused = this._segmentButtons.get(this._activeSegment);
      try {
        nextFocused?.focus({ preventScroll: true });
      } catch {
        nextFocused?.focus();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-time-field': UITimeField;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-time-field')) {
  customElements.define('ui-time-field', UITimeField);
}

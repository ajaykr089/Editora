import { ElementBase } from '../ElementBase';
import { parseISO } from './ui-calendar';
import { clampDateIso, normalizeDateIso, normalizeLocale } from './date-time-utils';

type DateSegment = 'month' | 'day' | 'year';
type DateFieldSource = 'api' | 'keyboard' | 'clear' | 'form';
type DateParts = { year: number; month: number; day: number };
let dateFieldUid = 0;

const style = `
  :host {
    --ui-date-field-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    --ui-date-field-border: 1px solid var(--ui-date-field-border-color);
    --ui-date-field-radius: var(--ui-radius, 12px);
    --ui-date-field-bg: var(--ui-color-surface, #ffffff);
    --ui-date-field-text: var(--ui-color-text, #0f172a);
    --ui-date-field-muted: var(--ui-color-muted, #64748b);
    --ui-date-field-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-date-field-danger: var(--ui-color-danger, #dc2626);
    display: block;
    inline-size: 100%;
    min-inline-size: 0;
    color: var(--ui-date-field-text);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color-scheme: light dark;
  }

  .root {
    display: grid;
    gap: 8px;
    min-inline-size: 0;
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
    color: var(--ui-date-field-muted);
    font: 600 13px/1.35 "IBM Plex Sans", "Inter", sans-serif;
  }

  .required {
    color: var(--ui-date-field-danger);
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
    color: var(--ui-date-field-muted);
  }

  .error {
    color: var(--ui-date-field-danger);
  }

  .shell {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    min-block-size: 44px;
    padding: 0 10px;
    border: var(--ui-date-field-border);
    border-radius: var(--ui-date-field-radius);
    background: var(--ui-date-field-bg);
    transition: border-color 160ms ease, box-shadow 160ms ease;
    box-sizing: border-box;
  }

  .shell[data-focused="true"] {
    border-color: color-mix(in srgb, var(--ui-date-field-focus) 58%, var(--ui-date-field-border-color));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-date-field-focus) 22%, transparent);
  }

  .shell[data-invalid="true"] {
    border-color: color-mix(in srgb, var(--ui-date-field-danger) 62%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-date-field-danger) 18%, transparent);
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
  }

  .segment[data-empty="true"] {
    color: color-mix(in srgb, var(--ui-date-field-text) 38%, transparent);
  }

  .segment[data-active="true"] {
    background: color-mix(in srgb, var(--ui-date-field-focus) 16%, transparent);
  }

  .segment:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-date-field-focus) 56%, transparent);
    outline-offset: 1px;
  }

  .literal {
    color: color-mix(in srgb, var(--ui-date-field-text) 42%, transparent);
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

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function toIso(parts: DateParts): string {
  return `${String(parts.year).padStart(4, '0')}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

function parseIsoParts(value: string | null): DateParts | null {
  if (!value) return null;
  const parsed = parseISO(value);
  if (!parsed) return null;
  return { year: parsed.y, month: parsed.m, day: parsed.d };
}

function clampDay(parts: DateParts): DateParts {
  return { ...parts, day: Math.min(parts.day, daysInMonth(parts.year, parts.month)) };
}

function moveDateSegment(parts: DateParts, segment: DateSegment, delta: 1 | -1): DateParts {
  if (segment === 'day') {
    const next = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
    next.setUTCDate(next.getUTCDate() + delta);
    return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1, day: next.getUTCDate() };
  }

  if (segment === 'month') {
    const monthIndex = parts.month - 1 + delta;
    const next = new Date(Date.UTC(parts.year, monthIndex, 1));
    return clampDay({ year: next.getUTCFullYear(), month: next.getUTCMonth() + 1, day: parts.day });
  }

  return clampDay({ ...parts, year: Math.max(1, parts.year + delta) });
}

function resolveDateLayout(locale: string): Array<{ type: 'segment'; segment: DateSegment } | { type: 'literal'; value: string }> {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC'
    }).formatToParts(new Date(Date.UTC(2026, 10, 21)));

    return parts
      .map((part) => {
        if (part.type === 'month' || part.type === 'day' || part.type === 'year') {
          return { type: 'segment', segment: part.type };
        }
        if (part.type === 'literal') {
          return { type: 'literal', value: part.value };
        }
        return null;
      })
      .filter(Boolean) as Array<{ type: 'segment'; segment: DateSegment } | { type: 'literal'; value: string }>;
  } catch {
    return [
      { type: 'segment', segment: 'month' },
      { type: 'literal', value: '/' },
      { type: 'segment', segment: 'day' },
      { type: 'literal', value: '/' },
      { type: 'segment', segment: 'year' }
    ];
  }
}

function segmentPlaceholder(segment: DateSegment): string {
  if (segment === 'year') return 'YYYY';
  return segment === 'month' ? 'MM' : 'DD';
}

export class UIDateField extends ElementBase {
  static formAssociated = true;

  static get observedAttributes() {
    return ['value', 'min', 'max', 'locale', 'label', 'description', 'data-error', 'required', 'disabled', 'readonly', 'name'];
  }

  private _value: string | null = null;
  private _activeSegment: DateSegment = 'month';
  private _segmentButtons = new Map<DateSegment, HTMLButtonElement>();
  private _segmentsEl: HTMLElement | null = null;
  private _shellEl: HTMLElement | null = null;
  private _errorEl: HTMLElement | null = null;
  private _formUnregister: (() => void) | null = null;
  private _bufferBySegment: Record<DateSegment, string> = { month: '', day: '', year: '' };
  private _bufferTimer: number | null = null;
  private _internals: ElementInternals | null = null;
  private _uid = `ui-date-field-${++dateFieldUid}`;
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
    if (name === 'value') {
      this._value = this._normalizeDateValue(newValue);
    }
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

    this._value = this._normalizeDateValue(this.getAttribute('value'));
    this._syncFormValue();
    this._syncUi();
  }

  private _normalizeDateValue(value: string | null): string | null {
    const normalized = normalizeDateIso(value);
    if (!normalized) return null;
    const min = normalizeDateIso(this.getAttribute('min'));
    const max = normalizeDateIso(this.getAttribute('max'));
    return clampDateIso(normalized, min, max);
  }

  private _partsOrFallback(): DateParts {
    return parseIsoParts(this._value) || parseIsoParts(normalizeDateIso(this.getAttribute('min'))) || { year: 2026, month: 1, day: 1 };
  }

  private _segmentOrder(): DateSegment[] {
    return resolveDateLayout(normalizeLocale(this.getAttribute('locale')))
      .filter((entry): entry is { type: 'segment'; segment: DateSegment } => entry.type === 'segment')
      .map((entry) => entry.segment);
  }

  private _moveSegmentFocus(step: 1 | -1): void {
    const order = this._segmentOrder();
    const index = order.indexOf(this._activeSegment);
    const next = order[(index + step + order.length) % order.length];
    this._focusSegment(next);
  }

  private _focusSegment(segment: DateSegment): void {
    this._activeSegment = segment;
    this._syncUi();
    this._segmentButtons.get(segment)?.focus();
  }

  private _applyParts(parts: DateParts, source: DateFieldSource): void {
    const normalized = this._normalizeDateValue(toIso(clampDay(parts)));
    this._setValue(normalized, source);
  }

  private _setValue(next: string | null, source: DateFieldSource): void {
    const normalized = this._normalizeDateValue(next);
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

  private _setBuffer(segment: DateSegment, value: string): void {
    this._bufferBySegment[segment] = value;
    if (this._bufferTimer != null) window.clearTimeout(this._bufferTimer);
    this._bufferTimer = window.setTimeout(() => {
      this._bufferBySegment.month = '';
      this._bufferBySegment.day = '';
      this._bufferBySegment.year = '';
      this._bufferTimer = null;
    }, 900);
  }

  private _applyNumericInput(segment: DateSegment, digit: string): void {
    const nextBuffer = `${this._bufferBySegment[segment]}${digit}`.slice(segment === 'year' ? -4 : -2);
    this._setBuffer(segment, nextBuffer);

    const targetLength = segment === 'year' ? 4 : 2;
    if (nextBuffer.length < targetLength) return;

    const parts = this._partsOrFallback();
    const value = Number(nextBuffer);
    if (!Number.isFinite(value)) return;

    if (segment === 'month') parts.month = Math.min(Math.max(value, 1), 12);
    if (segment === 'day') parts.day = Math.min(Math.max(value, 1), 31);
    if (segment === 'year') parts.year = Math.min(Math.max(value, 1), 9999);

    this._applyParts(parts, 'keyboard');
    if (segment !== 'year') this._moveSegmentFocus(1);
  }

  private _onSegmentClick(event: Event): void {
    const target = event.currentTarget as HTMLButtonElement;
    const segment = target.getAttribute('data-segment') as DateSegment | null;
    if (!segment) return;
    this._focusSegment(segment);
  }

  private _onSegmentKeyDown(event: KeyboardEvent): void {
    if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return;
    const segment = (event.currentTarget as HTMLElement).getAttribute('data-segment') as DateSegment | null;
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
      const next = moveDateSegment(this._partsOrFallback(), segment, event.key === 'ArrowUp' ? 1 : -1);
      this._applyParts(next, 'keyboard');
      return;
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      this.clearValue();
      return;
    }
    if (/^\d$/.test(event.key)) {
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
              return { valid: false, message: 'Date is required' };
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
    const parts = parseIsoParts(this._value);
    const layout = resolveDateLayout(normalizeLocale(this.getAttribute('locale')));
    const segmentOrder = layout
      .filter((entry): entry is { type: 'segment'; segment: DateSegment } => entry.type === 'segment')
      .map((entry) => entry.segment);
    if (!segmentOrder.includes(this._activeSegment)) {
      this._activeSegment = segmentOrder[0] || 'month';
    }
    const nextChildren: Node[] = [];
    this._segmentButtons.clear();

    layout.forEach((entry) => {
      if (entry.type === 'literal') {
        const literal = document.createElement('span');
        literal.className = 'literal';
        literal.textContent = entry.value;
        nextChildren.push(literal);
        return;
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'segment';
      button.setAttribute('data-segment', entry.segment);
      button.setAttribute('data-active', this._activeSegment === entry.segment ? 'true' : 'false');
      button.setAttribute('data-empty', parts ? 'false' : 'true');
      button.setAttribute('aria-label', entry.segment === 'month' ? 'Month' : entry.segment === 'day' ? 'Day' : 'Year');
      button.tabIndex = this._activeSegment === entry.segment ? 0 : -1;
      button.disabled = this.hasAttribute('disabled');
      button.addEventListener('click', this._onSegmentClick);
      button.addEventListener('keydown', this._onSegmentKeyDown);

      if (!parts) {
        button.textContent = segmentPlaceholder(entry.segment);
      } else if (entry.segment === 'year') {
        button.textContent = String(parts.year).padStart(4, '0');
      } else if (entry.segment === 'month') {
        button.textContent = String(parts.month).padStart(2, '0');
      } else {
        button.textContent = String(parts.day).padStart(2, '0');
      }

      this._segmentButtons.set(entry.segment, button);
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
    'ui-date-field': UIDateField;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-date-field')) {
  customElements.define('ui-date-field', UIDateField);
}

import { ElementBase } from '../ElementBase';

type RadioOrientation = 'vertical' | 'horizontal';
type RadioSize = 'sm' | 'md' | 'lg';
type RadioVariant = 'default' | 'card' | 'segmented';
type RadioTone = 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

type RadioOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

const style = `
  :host {
    display: block;
    width: 100%;
    color-scheme: light dark;

    --ui-radio-gap: 8px;
    --ui-radio-pad-y: 10px;
    --ui-radio-pad-x: 12px;
    --ui-radio-radius: 12px;
    --ui-radio-dot-size: 10px;
    --ui-radio-control-size: 18px;

    --ui-radio-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 94%, transparent);
    --ui-radio-bg-hover: color-mix(in srgb, var(--ui-color-surface, #ffffff) 80%, #f8fafc 20%);
    --ui-radio-bg-selected: color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, var(--ui-color-surface, #ffffff));
    --ui-radio-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-radio-border-selected: var(--ui-color-primary, #2563eb);
    --ui-radio-text: var(--ui-color-text, #0f172a);
    --ui-radio-muted: #64748b;
    --ui-radio-shadow: 0 1px 2px rgba(2, 6, 23, 0.05);
    --ui-radio-ring: color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent);
  }

  .root {
    display: grid;
    gap: var(--ui-radio-gap);
  }

  :host([orientation="horizontal"]) .root {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    align-items: stretch;
  }

  .option {
    all: unset;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 10px;
    width: 100%;
    border-radius: var(--ui-radio-radius);
    border: 1px solid var(--ui-radio-border);
    background: var(--ui-radio-bg);
    box-shadow: var(--ui-radio-shadow);
    color: var(--ui-radio-text);
    padding: var(--ui-radio-pad-y) var(--ui-radio-pad-x);
    cursor: pointer;
    transition:
      border-color 140ms ease,
      background-color 140ms ease,
      box-shadow 180ms ease,
      transform 140ms ease;
  }

  .option:hover {
    background: var(--ui-radio-bg-hover);
  }

  .option:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ui-radio-ring), var(--ui-radio-shadow);
  }

  .option[data-checked="true"] {
    border-color: var(--ui-radio-border-selected);
    background: var(--ui-radio-bg-selected);
  }

  .option[data-disabled="true"] {
    opacity: 0.56;
    cursor: not-allowed;
    transform: none !important;
  }

  .control {
    position: relative;
    inline-size: var(--ui-radio-control-size);
    block-size: var(--ui-radio-control-size);
    border-radius: 999px;
    border: 1.5px solid color-mix(in srgb, var(--ui-radio-border-selected) 44%, var(--ui-radio-border));
    background: color-mix(in srgb, var(--ui-radio-bg) 88%, white 12%);
    display: grid;
    place-items: center;
    transition: border-color 140ms ease, background-color 140ms ease;
  }

  .dot {
    inline-size: var(--ui-radio-dot-size);
    block-size: var(--ui-radio-dot-size);
    border-radius: 999px;
    background: var(--ui-radio-border-selected);
    transform: scale(0.25);
    opacity: 0;
    transition: transform 170ms cubic-bezier(0.22, 0.9, 0.24, 1), opacity 140ms ease;
  }

  .option[data-checked="true"] .dot {
    opacity: 1;
    transform: scale(1);
  }

  .text {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .label {
    font: 600 13px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
    letter-spacing: 0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .description {
    font: 500 12px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
    color: var(--ui-radio-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :host([variant="card"]) .option {
    border-radius: 14px;
    box-shadow:
      0 1px 3px rgba(2, 6, 23, 0.06),
      0 10px 24px rgba(2, 6, 23, 0.08);
  }

  :host([variant="segmented"]) .root {
    gap: 0;
    border: 1px solid var(--ui-radio-border);
    border-radius: calc(var(--ui-radio-radius) + 2px);
    overflow: hidden;
  }

  :host([variant="segmented"]) .option {
    border-radius: 0;
    border: 0;
    box-shadow: none;
    border-inline-end: 1px solid var(--ui-radio-border);
  }

  :host([variant="segmented"][orientation="horizontal"]) .option:last-child,
  :host([variant="segmented"][orientation="vertical"]) .option:last-child {
    border-inline-end: 0;
  }

  :host([variant="segmented"][orientation="vertical"]) .option {
    border-inline-end: 0;
    border-bottom: 1px solid var(--ui-radio-border);
  }

  :host([variant="segmented"][orientation="vertical"]) .option:last-child {
    border-bottom: 0;
  }

  :host([size="sm"]) {
    --ui-radio-pad-y: 8px;
    --ui-radio-pad-x: 10px;
    --ui-radio-control-size: 16px;
    --ui-radio-dot-size: 8px;
    --ui-radio-gap: 6px;
    --ui-radio-radius: 10px;
  }

  :host([size="lg"]) {
    --ui-radio-pad-y: 12px;
    --ui-radio-pad-x: 14px;
    --ui-radio-control-size: 20px;
    --ui-radio-dot-size: 11px;
    --ui-radio-gap: 10px;
    --ui-radio-radius: 14px;
  }

  :host([tone="neutral"]) { --ui-radio-border-selected: #64748b; }
  :host([tone="success"]) { --ui-radio-border-selected: #16a34a; }
  :host([tone="warning"]) { --ui-radio-border-selected: #d97706; }
  :host([tone="danger"]) { --ui-radio-border-selected: #dc2626; }
  :host([tone="info"]) { --ui-radio-border-selected: #0ea5e9; }

  :host([disabled]) .option {
    cursor: not-allowed;
  }

  :host([headless]) .root {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .option,
    .dot {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .option,
    .control {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    .option {
      forced-color-adjust: none;
      background: Canvas;
      border-color: CanvasText;
      color: CanvasText;
      box-shadow: none;
    }

    .option[data-checked="true"] {
      border-color: Highlight;
      background: HighlightText;
      color: Highlight;
    }

    .control {
      border-color: CanvasText;
      background: Canvas;
    }

    .dot {
      background: Highlight;
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

function normalizeOrientation(raw: string | null): RadioOrientation {
  return raw === 'horizontal' ? 'horizontal' : 'vertical';
}

function normalizeSize(raw: string | null): RadioSize {
  if (raw === 'sm' || raw === 'lg') return raw;
  return 'md';
}

function normalizeVariant(raw: string | null): RadioVariant {
  if (raw === 'card' || raw === 'segmented') return raw;
  return 'default';
}

function normalizeTone(raw: string | null): RadioTone {
  if (raw === 'neutral' || raw === 'success' || raw === 'warning' || raw === 'danger' || raw === 'info') return raw;
  return 'brand';
}

export class UIRadioGroup extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'disabled',
      'required',
      'name',
      'orientation',
      'variant',
      'size',
      'tone',
      'options',
      'headless'
    ];
  }

  private _value = '';
  private _disabled = false;
  private _required = false;
  private _orientation: RadioOrientation = 'vertical';
  private _focusIndex = -1;
  private _options: RadioOption[] = [];
  private _observer: MutationObserver | null = null;

  private readonly _onClickBound = (event: Event) => this._onClick(event);
  private readonly _onKeydownBound = (event: Event) => this._onKeydown(event as KeyboardEvent);

  constructor() {
    super();
  }

  override connectedCallback(): void {
    this._syncFromAttributes();
    super.connectedCallback();
    this.root.addEventListener('click', this._onClickBound);
    this.root.addEventListener('keydown', this._onKeydownBound);
    if (typeof MutationObserver !== 'undefined') {
      if (!this._observer) {
        this._observer = new MutationObserver(() => {
          if (this.hasAttribute('options')) return;
          this._syncFromAttributes();
          this.requestRender();
        });
      }
      this._observer.observe(this, { childList: true, subtree: true, characterData: true });
    }
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClickBound);
    this.root.removeEventListener('keydown', this._onKeydownBound);
    this._observer?.disconnect();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this._syncFromAttributes();
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'value') {
      this.dispatchEvent(
        new CustomEvent('valuechange', {
          detail: { value: this._value },
          bubbles: true,
          composed: true
        })
      );
    }
  }

  get value(): string {
    return this._value;
  }

  set value(next: string) {
    const normalized = String(next || '');
    if (normalized === this._value) return;
    this.setAttribute('value', normalized);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(next: boolean) {
    if (next) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  private _syncFromAttributes(): void {
    this._value = this.getAttribute('value') || '';
    this._disabled = this.hasAttribute('disabled');
    this._required = this.hasAttribute('required');
    this._orientation = normalizeOrientation(this.getAttribute('orientation'));
    this._options = this._collectOptions();

    if (this._focusIndex < 0 || this._focusIndex >= this._options.length || this._options[this._focusIndex]?.disabled) {
      const selected = this._findSelectedIndex();
      this._focusIndex = selected >= 0 ? selected : this._findFirstEnabledIndex();
    }
  }

  private _collectOptions(): RadioOption[] {
    const attr = this.getAttribute('options');
    if (attr && attr.trim()) {
      try {
        const parsed = JSON.parse(attr);
        if (Array.isArray(parsed)) {
          const mapped = parsed
            .map((entry, index) => {
              if (typeof entry === 'string') {
                return { value: entry, label: entry, disabled: false } as RadioOption;
              }
              if (entry && typeof entry === 'object') {
                const value = String((entry as any).value ?? `option-${index + 1}`);
                const label = String((entry as any).label ?? value);
                const description =
                  (entry as any).description == null ? undefined : String((entry as any).description);
                const disabled = Boolean((entry as any).disabled);
                return { value, label, description, disabled } as RadioOption;
              }
              return null;
            })
            .filter(Boolean) as RadioOption[];
          if (mapped.length) return mapped;
        }
      } catch {
        // ignore invalid options JSON and fallback to slotted declarative options
      }
    }

    const nodes = Array.from(this.children).filter(
      (node) => node instanceof HTMLElement && node.hasAttribute('data-radio')
    ) as HTMLElement[];

    return nodes.map((node, index) => {
      const rawValue = node.getAttribute('data-value') || node.getAttribute('value');
      const label = (node.getAttribute('data-label') || node.textContent || '').trim();
      const value = (rawValue || label || `option-${index + 1}`).trim();
      const description = (node.getAttribute('data-description') || '').trim() || undefined;
      const disabled = node.hasAttribute('data-disabled') || node.getAttribute('aria-disabled') === 'true';
      return { value, label: label || value, description, disabled };
    });
  }

  private _findSelectedIndex(): number {
    const idx = this._options.findIndex((item) => item.value === this._value && !item.disabled);
    if (idx >= 0) return idx;
    if (!this._value) return this._findFirstEnabledIndex();
    return -1;
  }

  private _findFirstEnabledIndex(): number {
    return this._options.findIndex((item) => !item.disabled);
  }

  private _selectIndex(index: number, reason: 'click' | 'keyboard'): void {
    if (this._disabled) return;
    const option = this._options[index];
    if (!option || option.disabled) return;

    const changed = this._value !== option.value;
    this._focusIndex = index;

    if (changed) {
      this._value = option.value;
      if (this.getAttribute('value') !== option.value) {
        this.setAttribute('value', option.value);
      } else {
        this.requestRender();
      }

      const detail = { value: option.value, option: { ...option }, reason, name: this.getAttribute('name') || undefined };
      this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
      this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
    } else {
      this.requestRender();
    }

    this._focusOption(index);
  }

  private _moveSelection(step: number): void {
    const total = this._options.length;
    if (!total) return;

    let next = this._focusIndex >= 0 ? this._focusIndex : this._findSelectedIndex();
    if (next < 0) next = 0;

    for (let i = 0; i < total; i += 1) {
      next = (next + step + total) % total;
      if (!this._options[next]?.disabled) {
        this._selectIndex(next, 'keyboard');
        return;
      }
    }
  }

  private _focusOption(index: number): void {
    const next = this.root.querySelector<HTMLElement>(`.option[data-index="${index}"]`);
    if (next) next.focus();
  }

  private _onClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const option = target.closest('.option') as HTMLElement | null;
    if (!option) return;
    const idx = Number(option.getAttribute('data-index'));
    if (Number.isNaN(idx)) return;
    this._selectIndex(idx, 'click');
  }

  private _onKeydown(event: KeyboardEvent): void {
    if (this._disabled) return;

    const key = event.key;
    const isHorizontal = this._orientation === 'horizontal';

    if ((key === 'ArrowRight' && isHorizontal) || key === 'ArrowDown') {
      event.preventDefault();
      this._moveSelection(1);
      return;
    }

    if ((key === 'ArrowLeft' && isHorizontal) || key === 'ArrowUp') {
      event.preventDefault();
      this._moveSelection(-1);
      return;
    }

    if (key === 'Home') {
      event.preventDefault();
      const first = this._findFirstEnabledIndex();
      if (first >= 0) this._selectIndex(first, 'keyboard');
      return;
    }

    if (key === 'End') {
      event.preventDefault();
      for (let i = this._options.length - 1; i >= 0; i -= 1) {
        if (!this._options[i]?.disabled) {
          this._selectIndex(i, 'keyboard');
          return;
        }
      }
      return;
    }

    if (key === ' ' || key === 'Enter') {
      event.preventDefault();
      const idx = this._focusIndex >= 0 ? this._focusIndex : this._findSelectedIndex();
      if (idx >= 0) this._selectIndex(idx, 'keyboard');
    }
  }

  protected render(): void {
    const size = normalizeSize(this.getAttribute('size'));
    const variant = normalizeVariant(this.getAttribute('variant'));
    const tone = normalizeTone(this.getAttribute('tone'));
    const orientation = normalizeOrientation(this.getAttribute('orientation'));

    this.setAttribute('role', 'radiogroup');
    this.setAttribute('aria-disabled', this._disabled ? 'true' : 'false');
    this.setAttribute('aria-required', this._required ? 'true' : 'false');
    this.setAttribute('aria-orientation', orientation);

    const selectedIndex = this._findSelectedIndex();
    const effectiveSelected = selectedIndex >= 0 ? selectedIndex : this._findFirstEnabledIndex();

    if (this._focusIndex < 0 || this._focusIndex >= this._options.length || this._options[this._focusIndex]?.disabled) {
      this._focusIndex = effectiveSelected;
    }

    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root" data-size="${size}" data-variant="${variant}" data-tone="${tone}">
        ${this._options
          .map((item, index) => {
            const checked = index === effectiveSelected;
            const disabled = this._disabled || Boolean(item.disabled);
            const tabIndex = index === this._focusIndex ? 0 : -1;
            return `
              <button
                type="button"
                class="option"
                part="option"
                role="radio"
                data-index="${index}"
                data-value="${escapeHtml(item.value)}"
                data-checked="${checked ? 'true' : 'false'}"
                data-disabled="${disabled ? 'true' : 'false'}"
                aria-checked="${checked ? 'true' : 'false'}"
                aria-disabled="${disabled ? 'true' : 'false'}"
                tabindex="${tabIndex}"
              >
                <span class="control" part="control"><span class="dot" part="dot"></span></span>
                <span class="text" part="text">
                  <span class="label" part="label">${escapeHtml(item.label)}</span>
                  ${item.description ? `<span class="description" part="description">${escapeHtml(item.description)}</span>` : ''}
                </span>
              </button>
            `;
          })
          .join('')}
      </div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-radio-group')) {
  customElements.define('ui-radio-group', UIRadioGroup);
}

import { ElementBase } from '../ElementBase';

type GroupValue = string | string[];

const style = `
  :host {
    --ui-toggle-group-gap: 8px;
    --ui-toggle-group-padding: 6px;
    --ui-toggle-group-radius: 12px;
    --ui-toggle-group-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-toggle-group-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-toggle-group-shadow:
      0 1px 2px rgba(15, 23, 42, 0.04),
      0 10px 24px rgba(15, 23, 42, 0.08);

    color-scheme: light dark;
    display: inline-flex;
    min-inline-size: 0;
    box-sizing: border-box;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .group {
    min-inline-size: 0;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ui-toggle-group-gap);
    padding: var(--ui-toggle-group-padding);
    border: 1px solid var(--ui-toggle-group-border);
    border-radius: var(--ui-toggle-group-radius);
    background: var(--ui-toggle-group-bg);
    box-shadow: var(--ui-toggle-group-shadow);
  }

  :host([orientation="vertical"]) .group {
    flex-direction: column;
    align-items: stretch;
  }

  :host([variant="soft"]) {
    --ui-toggle-group-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 8%, var(--ui-color-surface, #ffffff));
    --ui-toggle-group-border: color-mix(in srgb, var(--ui-color-primary, #2563eb) 24%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="minimal"]) .group {
    border-color: transparent;
    box-shadow: none;
    background: transparent;
    padding: 0;
  }

  :host([variant="contrast"]) {
    --ui-toggle-group-bg: #0f172a;
    --ui-toggle-group-border: #334155;
    --ui-toggle-group-shadow:
      0 10px 24px rgba(2, 6, 23, 0.42),
      0 24px 50px rgba(2, 6, 23, 0.38);
  }

  :host([size="sm"]) {
    --ui-toggle-group-gap: 6px;
    --ui-toggle-group-padding: 4px;
    --ui-toggle-group-radius: 10px;
  }

  :host([size="lg"]) {
    --ui-toggle-group-gap: 10px;
    --ui-toggle-group-padding: 8px;
    --ui-toggle-group-radius: 14px;
  }

  :host([density="compact"]) {
    --ui-toggle-group-gap: 5px;
    --ui-toggle-group-padding: 4px;
  }

  :host([density="comfortable"]) {
    --ui-toggle-group-gap: 10px;
    --ui-toggle-group-padding: 8px;
  }

  :host([headless]) .group {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .group {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .group {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-toggle-group-bg: Canvas;
      --ui-toggle-group-border: CanvasText;
      --ui-toggle-group-shadow: none;
    }
  }
`;

function parseMaybeJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function normalizeValue(raw: string | null, multiple: boolean): GroupValue {
  if (!multiple) return raw || '';
  if (!raw) return [];

  const parsed = parseMaybeJson(raw);
  if (Array.isArray(parsed)) return parsed.map((entry) => String(entry));

  if (raw.includes(',')) {
    return raw
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [raw];
}

function serializeValue(value: GroupValue, multiple: boolean): string {
  if (!multiple) return String(value || '');
  return JSON.stringify(Array.isArray(value) ? value : [String(value)]);
}

export class UIToggleGroup extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'multiple',
      'disabled',
      'headless',
      'orientation',
      'variant',
      'size',
      'density',
      'allow-empty',
      'required',
      'activation',
      'aria-label'
    ];
  }

  private _observer: MutationObserver | null = null;
  private _isSyncing = false;

  constructor() {
    super();
    this._onToggleEvent = this._onToggleEvent.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('change', this._onToggleEvent as EventListener);
    this.addEventListener('keydown', this._onKeyDown as EventListener);

    this._observer = new MutationObserver(() => {
      if (this._isSyncing) return;
      this._syncChildren();
    });

    this._observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
      attributeFilter: ['value', 'data-value', 'disabled', 'pressed', 'data-disabled']
    });

    this._syncChildren();
  }

  override disconnectedCallback(): void {
    this.removeEventListener('change', this._onToggleEvent as EventListener);
    this.removeEventListener('keydown', this._onKeyDown as EventListener);
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    super.disconnectedCallback();
  }

  get multiple(): boolean {
    return this.hasAttribute('multiple');
  }

  set multiple(next: boolean) {
    if (next) this.setAttribute('multiple', '');
    else this.removeAttribute('multiple');
  }

  get value(): GroupValue {
    return normalizeValue(this.getAttribute('value'), this.multiple);
  }

  set value(next: GroupValue) {
    const serialized = serializeValue(next, this.multiple);
    if (!this.multiple && !serialized) {
      if (this.hasAttribute('value')) this.removeAttribute('value');
      this._syncChildren();
      return;
    }
    if (this.getAttribute('value') !== serialized) this.setAttribute('value', serialized);
    this._syncChildren();
  }

  private _toggles(): HTMLElement[] {
    return Array.from(this.querySelectorAll('ui-toggle')) as HTMLElement[];
  }

  private _toggleValue(toggle: HTMLElement, index: number): string {
    return toggle.getAttribute('value') || toggle.getAttribute('data-value') || toggle.textContent?.trim() || String(index);
  }

  private _selectedSet(): Set<string> {
    const values = this.value;
    if (Array.isArray(values)) return new Set(values.map((entry) => String(entry)));
    return values ? new Set([String(values)]) : new Set();
  }

  private _setGroupValue(next: GroupValue, emit = true): void {
    const serialized = serializeValue(next, this.multiple);
    const current = this.getAttribute('value') || '';

    if ((!this.multiple && !serialized && !current) || current === serialized) {
      this._syncChildren();
      return;
    }

    if (!this.multiple && !serialized) this.removeAttribute('value');
    else this.setAttribute('value', serialized);

    this._syncChildren();

    if (!emit) return;
    const detail = {
      value: this.multiple ? (Array.isArray(next) ? next : [String(next)]) : String(next || ''),
      values: this.multiple ? (Array.isArray(next) ? next : [String(next)]) : (next ? [String(next)] : []),
      multiple: this.multiple
    };

    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _syncChildren(): void {
    const toggles = this._toggles();
    const disabledGroup = this.hasAttribute('disabled');
    const selected = this._selectedSet();
    const setFlag = (toggle: HTMLElement, name: string, enabled: boolean) => {
      const hasAttr = toggle.hasAttribute(name);
      if (enabled && !hasAttr) toggle.setAttribute(name, '');
      if (!enabled && hasAttr) toggle.removeAttribute(name);
    };
    const setAttr = (toggle: HTMLElement, name: string, value: string) => {
      if (toggle.getAttribute(name) !== value) toggle.setAttribute(name, value);
    };

    let firstEnabled = -1;
    let activeIndex = -1;

    this._isSyncing = true;
    try {
      toggles.forEach((toggle, index) => {
        const value = this._toggleValue(toggle, index);
        const userDisabled = toggle.hasAttribute('data-disabled') || toggle.getAttribute('aria-disabled') === 'true';
        const shouldDisable = disabledGroup || userDisabled;

        if (shouldDisable) {
          setFlag(toggle, 'disabled', true);
          setFlag(toggle, 'data-group-disabled', disabledGroup && !userDisabled);
        } else if (toggle.hasAttribute('data-group-disabled')) {
          setFlag(toggle, 'disabled', false);
          setFlag(toggle, 'data-group-disabled', false);
        }

        const isPressed = selected.has(value);
        setFlag(toggle, 'pressed', isPressed);
        if (isPressed) {
          if (activeIndex < 0) activeIndex = index;
        }

        if (!toggle.hasAttribute('disabled') && firstEnabled < 0) firstEnabled = index;
      });

      const focusIndex = activeIndex >= 0 ? activeIndex : firstEnabled;
      toggles.forEach((toggle, index) => {
        if (toggle.hasAttribute('disabled')) {
          setAttr(toggle, 'tabindex', '-1');
          return;
        }
        setAttr(toggle, 'tabindex', index === focusIndex ? '0' : '-1');
      });
    } finally {
      this._isSyncing = false;
    }
  }

  private _onToggleEvent(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target || target.tagName.toLowerCase() !== 'ui-toggle') return;
    if (this.hasAttribute('disabled')) return;

    const toggles = this._toggles();
    const index = toggles.indexOf(target);
    if (index < 0) return;

    const toggleValue = this._toggleValue(target, index);
    const pressed = (event as CustomEvent<{ pressed?: boolean }>).detail?.pressed ?? target.hasAttribute('pressed');

    if (this.multiple) {
      const selected = this._selectedSet();
      if (pressed) selected.add(toggleValue);
      else selected.delete(toggleValue);
      this._setGroupValue(Array.from(selected), true);
      return;
    }

    const allowEmpty = this.hasAttribute('allow-empty') && !this.hasAttribute('required');
    if (pressed) {
      this._setGroupValue(toggleValue, true);
      return;
    }

    if (allowEmpty) this._setGroupValue('', true);
    else {
      const current = String(this.value || '');
      this._setGroupValue(current || toggleValue, false);
    }
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target || target.tagName.toLowerCase() !== 'ui-toggle') return;

    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    const activation = this.getAttribute('activation') === 'manual' ? 'manual' : 'auto';

    const enabled = this._toggles().filter((toggle) => !toggle.hasAttribute('disabled'));
    if (enabled.length < 2) return;

    const currentIndex = enabled.indexOf(target);
    if (currentIndex < 0) return;

    const move = (nextIndex: number) => {
      const resolved = enabled[(nextIndex + enabled.length) % enabled.length];
      enabled.forEach((toggle) => toggle.setAttribute('tabindex', toggle === resolved ? '0' : '-1'));
      (resolved as HTMLElement).focus();
      if (activation === 'auto') {
        (resolved as any).toggle?.(true);
      }
    };

    if ((orientation === 'horizontal' && event.key === 'ArrowRight') || (orientation === 'vertical' && event.key === 'ArrowDown')) {
      event.preventDefault();
      move(currentIndex + 1);
      return;
    }

    if ((orientation === 'horizontal' && event.key === 'ArrowLeft') || (orientation === 'vertical' && event.key === 'ArrowUp')) {
      event.preventDefault();
      move(currentIndex - 1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      move(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      move(enabled.length - 1);
    }
  }

  protected override render(): void {
    const role = this.multiple ? 'group' : 'radiogroup';
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    const ariaLabel = this.getAttribute('aria-label') || 'Toggle group';

    this.setContent(`
      <style>${style}</style>
      <div class="group" part="group" role="${role}" aria-label="${ariaLabel}" aria-orientation="${orientation}">
        <slot></slot>
      </div>
    `);

    this._syncChildren();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-toggle-group')) {
  customElements.define('ui-toggle-group', UIToggleGroup);
}

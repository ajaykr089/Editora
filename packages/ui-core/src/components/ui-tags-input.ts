import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-tags-input-padding: 10px 12px;
    --ui-tags-input-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    --ui-tags-input-border: 1px solid var(--ui-tags-input-border-color);
    --ui-tags-input-radius: var(--ui-radius, 12px);
    --ui-tags-input-bg: var(--ui-color-surface, #ffffff);
    --ui-tags-input-text: var(--ui-color-text, #0f172a);
    --ui-tags-input-muted: var(--ui-color-muted, #64748b);
    --ui-tags-input-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-tags-input-danger: var(--ui-color-danger, #dc2626);
    --ui-tags-input-chip-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, transparent);
    --ui-tags-input-chip-text: color-mix(in srgb, var(--ui-color-primary, #2563eb) 82%, #0f172a 18%);
    --ui-tags-input-chip-remove-bg: color-mix(in srgb, currentColor 8%, transparent);
    --ui-tags-input-min-height: 44px;
    display: block;
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
    color: var(--ui-tags-input-text);
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
    min-inline-size: 0;
  }

  .label {
    margin: 0;
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--ui-tags-input-muted);
    font: 600 13px/1.35 "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
  }

  .required {
    color: var(--ui-tags-input-danger);
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
    color: var(--ui-tags-input-muted);
  }

  .error {
    color: var(--ui-tags-input-danger);
  }

  .shell {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-block-size: var(--ui-tags-input-min-height);
    box-sizing: border-box;
    padding: 8px 10px;
    border: var(--ui-tags-input-border);
    border-radius: var(--ui-tags-input-radius);
    background: var(--ui-tags-input-bg);
    transition: border-color 170ms ease, box-shadow 170ms ease;
  }

  .shell[data-focused="true"] {
    border-color: color-mix(in srgb, var(--ui-tags-input-focus) 58%, var(--ui-tags-input-border-color));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-tags-input-focus) 22%, transparent);
  }

  .shell[data-invalid="true"] {
    border-color: color-mix(in srgb, var(--ui-tags-input-danger) 62%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-tags-input-danger) 16%, transparent);
  }

  .chips {
    display: contents;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-inline-size: 0;
    max-inline-size: 100%;
    padding: 6px 8px 6px 10px;
    border-radius: 999px;
    background: var(--ui-tags-input-chip-bg);
    color: var(--ui-tags-input-chip-text);
    font: 600 12px/1.2 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .chip-label {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chip-remove {
    inline-size: 18px;
    block-size: 18px;
    border: none;
    border-radius: 999px;
    padding: 0;
    display: inline-grid;
    place-items: center;
    background: var(--ui-tags-input-chip-remove-bg);
    color: inherit;
    cursor: pointer;
    font: 700 11px/1 "Inter", sans-serif;
  }

  .chip-remove:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-tags-input-focus) 56%, transparent);
    outline-offset: 1px;
  }

  .input {
    flex: 1 1 120px;
    min-inline-size: 96px;
    border: none;
    background: transparent;
    color: inherit;
    outline: none;
    font: 500 14px/1.4 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: 4px 2px;
    margin: 0;
  }

  .input::placeholder {
    color: color-mix(in srgb, var(--ui-tags-input-text) 42%, transparent);
  }

  .assist {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    color: var(--ui-tags-input-muted);
    font-size: 11px;
    line-height: 1.35;
  }

  .counter {
    white-space: nowrap;
  }

  .label[hidden],
  .description[hidden],
  .error[hidden],
  .meta[hidden],
  .assist[hidden] {
    display: none;
  }

  :host([disabled]) .shell {
    opacity: 0.68;
  }

  :host([disabled]) .input,
  :host([disabled]) .chip-remove,
  :host([readonly]) .chip-remove {
    pointer-events: none;
  }
`;

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function parseSerializedTags(raw: string | null): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((entry) => String(entry).trim()).filter(Boolean);
      }
    } catch {
      // fall through to delimiter parsing
    }
  }
  return trimmed.split(',').map((entry) => entry.trim()).filter(Boolean);
}

function serializeTags(tags: readonly string[]): string {
  if (!tags.length) return '';
  if (tags.some((tag) => tag.includes(',') || tag.includes('\n'))) {
    return JSON.stringify(tags);
  }
  return tags.join(', ');
}

function normalizeTag(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export class UITagsInput extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'label',
      'description',
      'placeholder',
      'data-error',
      'required',
      'disabled',
      'readonly',
      'name',
      'max-tags',
      'counter'
    ];
  }

  private _tags: string[] = [];
  private _draft = '';
  private _suppressValueAttr = false;
  private _formUnregister: (() => void) | null = null;
  private _rootEl: HTMLElement | null = null;
  private _shellEl: HTMLElement | null = null;
  private _chipsEl: HTMLElement | null = null;
  private _inputEl: HTMLInputElement | null = null;
  private _labelEl: HTMLElement | null = null;
  private _descriptionEl: HTMLElement | null = null;
  private _errorEl: HTMLElement | null = null;
  private _assistEl: HTMLElement | null = null;
  private _counterEl: HTMLElement | null = null;
  private _focused = false;

  constructor() {
    super();
    this._onInput = this._onInput.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onFocusOut = this._onFocusOut.bind(this);
    this._onPaste = this._onPaste.bind(this);
    this._onShellClick = this._onShellClick.bind(this);
    this._onChipClick = this._onChipClick.bind(this);
  }

  get value(): string[] {
    return [...this._tags];
  }

  set value(next: string[] | string) {
    const parsed = Array.isArray(next) ? next.map((entry) => normalizeTag(String(entry))).filter(Boolean) : parseSerializedTags(String(next ?? ''));
    this._applyTags(parsed, 'api');
  }

  addTag(tag: string): boolean {
    return this._addTag(tag, 'api');
  }

  removeTag(tagOrIndex: string | number): void {
    if (typeof tagOrIndex === 'number') {
      if (tagOrIndex < 0 || tagOrIndex >= this._tags.length) return;
      this._removeTagAt(tagOrIndex, 'api');
      return;
    }
    const index = this._tags.indexOf(tagOrIndex);
    if (index >= 0) this._removeTagAt(index, 'api');
  }

  clearTags(): void {
    this._applyTags([], 'api');
  }

  focusInput(): void {
    this._inputEl?.focus();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._registerWithForm();
  }

  override disconnectedCallback(): void {
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'name' && this.isConnected) this._registerWithForm();
    if (name === 'value' && !this._suppressValueAttr) {
      const parsed = parseSerializedTags(newValue);
      if (!arraysEqual(parsed, this._tags)) this._tags = parsed;
    }
    if (this._rootEl) this._syncUi();
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
          <div class="chips" part="chips"></div>
          <input class="input" part="input" type="text" />
        </div>
        <div class="error" part="error" hidden></div>
        <div class="assist" hidden>
          <div class="hint">Press Enter or comma to create a tag.</div>
          <div class="counter"></div>
        </div>
      </div>
    `);

    this._rootEl = this.root.querySelector('.root');
    this._shellEl = this.root.querySelector('.shell');
    this._chipsEl = this.root.querySelector('.chips');
    this._inputEl = this.root.querySelector('.input');
    this._labelEl = this.root.querySelector('.label');
    this._descriptionEl = this.root.querySelector('.description');
    this._errorEl = this.root.querySelector('.error');
    this._assistEl = this.root.querySelector('.assist');
    this._counterEl = this.root.querySelector('.counter');

    this._inputEl?.addEventListener('input', this._onInput);
    this._inputEl?.addEventListener('keydown', this._onKeyDown);
    this._inputEl?.addEventListener('focus', this._onFocusIn);
    this._inputEl?.addEventListener('blur', this._onFocusOut);
    this._inputEl?.addEventListener('paste', this._onPaste);
    this._shellEl?.addEventListener('click', this._onShellClick);
    this.root.addEventListener('click', this._onChipClick);

    this._tags = parseSerializedTags(this.getAttribute('value'));
    this._syncUi();
  }

  private _readOnly(): boolean {
    return this.hasAttribute('readonly');
  }

  private _disabled(): boolean {
    return this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false';
  }

  private _allowDuplicates(): boolean {
    return this.hasAttribute('allow-duplicates');
  }

  private _maxTags(): number | null {
    const raw = this.getAttribute('max-tags');
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : null;
  }

  private _emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private _setValueAttr(tags: readonly string[]): void {
    const serialized = serializeTags(tags);
    this._suppressValueAttr = true;
    try {
      if (!serialized) this.removeAttribute('value');
      else if (this.getAttribute('value') !== serialized) this.setAttribute('value', serialized);
    } finally {
      this._suppressValueAttr = false;
    }
  }

  private _applyTags(next: string[], source: string): boolean {
    const normalized = next.map((entry) => normalizeTag(entry)).filter(Boolean);
    const deduped = this._allowDuplicates() ? normalized : normalized.filter((tag, index) => normalized.indexOf(tag) === index);
    const limited = this._maxTags() != null ? deduped.slice(0, this._maxTags() as number) : deduped;
    if (arraysEqual(limited, this._tags)) {
      this._syncUi();
      return false;
    }

    const previousValue = [...this._tags];
    this._tags = [...limited];
    this._setValueAttr(this._tags);
    this._syncUi();
    this._emit('change', { value: [...this._tags], previousValue, source });
    return true;
  }

  private _addTag(raw: string, source: string): boolean {
    if (this._disabled() || this._readOnly()) return false;
    const tag = normalizeTag(raw);
    if (!tag) return false;

    if (!this._allowDuplicates() && this._tags.includes(tag)) {
      this._syncUi('Duplicate tag');
      return false;
    }

    const maxTags = this._maxTags();
    if (maxTags != null && this._tags.length >= maxTags) {
      this._syncUi(`Maximum ${maxTags} tags`);
      return false;
    }

    const changed = this._applyTags([...this._tags, tag], source);
    if (changed) this._emit('tag-add', { tag, value: [...this._tags], source });
    return changed;
  }

  private _removeTagAt(index: number, source: string): void {
    if (this._disabled() || this._readOnly()) return;
    const tag = this._tags[index];
    if (!tag) return;
    const next = this._tags.filter((_, currentIndex) => currentIndex !== index);
    const changed = this._applyTags(next, source);
    if (changed) this._emit('tag-remove', { tag, index, value: [...this._tags], source });
  }

  private _commitDraft(source: string): void {
    const draft = this._draft;
    this._draft = '';
    if (this._inputEl) this._inputEl.value = '';
    this._addTag(draft, source);
    this._syncUi();
  }

  private _syncUi(transientError?: string): void {
    if (!this._shellEl || !this._chipsEl || !this._inputEl || !this._labelEl || !this._descriptionEl || !this._errorEl || !this._assistEl || !this._counterEl) return;

    const label = (this.getAttribute('label') || '').trim();
    const description = (this.getAttribute('description') || '').trim();
    const externalError = (this.getAttribute('data-error') || '').trim();
    const required = this.hasAttribute('required');
    const disabled = this._disabled();
    const readOnly = this._readOnly();
    const maxTags = this._maxTags();
    const showCounter = this.hasAttribute('counter') || maxTags != null;
    const invalid = !!externalError || !!transientError || (required && this._tags.length === 0 && this.hasAttribute('invalid'));

    this._labelEl.hidden = !label;
    this._labelEl.querySelector('.label-text')!.textContent = label;
    (this._labelEl.querySelector('.required') as HTMLElement).hidden = !required;
    this._descriptionEl.hidden = !description;
    this._descriptionEl.textContent = description;
    (this.root.querySelector('.meta') as HTMLElement).hidden = !label && !description;

    this._shellEl.setAttribute('data-focused', this._focused ? 'true' : 'false');
    this._shellEl.setAttribute('data-invalid', invalid ? 'true' : 'false');

    this._inputEl.disabled = disabled;
    this._inputEl.readOnly = readOnly;
    this._inputEl.placeholder = this._tags.length === 0 ? (this.getAttribute('placeholder') || 'Add tags') : '';
    this._inputEl.value = this._draft;

    const shouldDisableEntry = disabled || (maxTags != null && this._tags.length >= maxTags);
    this._inputEl.setAttribute('aria-disabled', shouldDisableEntry ? 'true' : 'false');

    this._chipsEl.replaceChildren(...this._tags.map((tag, index) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.setAttribute('part', 'chip');

      const labelEl = document.createElement('span');
      labelEl.className = 'chip-label';
      labelEl.textContent = tag;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip-remove';
      button.setAttribute('data-index', String(index));
      button.setAttribute('aria-label', `Remove ${tag}`);
      button.textContent = '×';
      button.disabled = disabled || readOnly;

      chip.append(labelEl, button);
      return chip;
    }));

    const message = transientError || externalError;
    this._errorEl.hidden = !message;
    this._errorEl.textContent = message;

    this._assistEl.hidden = !showCounter;
    this._counterEl.textContent = maxTags != null ? `${this._tags.length}/${maxTags}` : String(this._tags.length);
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
          getValue: () => [...this._tags],
          setValue: (next: any) => {
            if (Array.isArray(next)) this._applyTags(next.map((entry) => String(entry)), 'form');
            else this._applyTags(parseSerializedTags(String(next ?? '')), 'form');
          },
          validate: async () => {
            if (this.hasAttribute('required') && this._tags.length === 0) {
              return { valid: false, message: 'At least one tag is required' };
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
      // keep resilient outside ui-form
    }
  }

  private _onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this._draft = target?.value || '';
    this._emit('input', { draft: this._draft, value: [...this._tags] });
    this._syncUi();
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this._commitDraft('keyboard');
      return;
    }

    if (event.key === 'Backspace' && !this._draft) {
      this._removeTagAt(this._tags.length - 1, 'keyboard');
    }
  }

  private _onPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text') || '';
    if (!/[,\n]/.test(pasted)) return;
    event.preventDefault();
    const tokens = pasted.split(/[,\n]+/).map(normalizeTag).filter(Boolean);
    if (!tokens.length) return;
    this._draft = '';
    if (this._inputEl) this._inputEl.value = '';
    this._applyTags([...this._tags, ...tokens], 'paste');
  }

  private _onFocusIn(): void {
    this._focused = true;
    this._syncUi();
  }

  private _onFocusOut(): void {
    this._focused = false;
    if (this.hasAttribute('add-on-blur') && this._draft) this._commitDraft('blur');
    else this._syncUi();
  }

  private _onShellClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('.chip-remove')) return;
    this._inputEl?.focus();
  }

  private _onChipClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    const button = target?.closest('.chip-remove') as HTMLButtonElement | null;
    if (!button) return;
    const index = Number(button.getAttribute('data-index'));
    if (Number.isFinite(index)) this._removeTagAt(index, 'remove-button');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-tags-input': UITagsInput;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-tags-input')) {
  customElements.define('ui-tags-input', UITagsInput);
}

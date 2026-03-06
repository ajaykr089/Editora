import { ElementBase } from '../ElementBase';
import { FormController } from '../form';

type NativeControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type NativeControlQueryOptions = {
  includeDisabled?: boolean;
};
type NativeValidationResult = {
  valid: boolean;
  errors: Record<string, string | undefined>;
  firstInvalid: HTMLElement | null;
};
type FormStateTone = 'default' | 'success' | 'warning' | 'error';

const CONTENT_ATTRS = new Set(['heading', 'title', 'description', 'state-text', 'loading-text']);

const style = `
  :host {
    --ui-form-gap: 12px;
    --ui-form-radius: 14px;
    --ui-form-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-form-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-form-muted: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-form-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 66%, transparent);
    --ui-form-border: 1px solid var(--ui-form-border-color);
    --ui-form-shadow:
      0 1px 3px rgba(2, 6, 23, 0.05),
      0 14px 30px rgba(2, 6, 23, 0.1);
    --ui-form-padding: 16px;
    --ui-form-header-gap: 12px;
    --ui-form-header-border: color-mix(in srgb, var(--ui-form-border-color) 84%, transparent);
    --ui-form-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-form-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-form-status-bg: color-mix(in srgb, var(--ui-form-bg) 94%, transparent);
    --ui-form-status-border: color-mix(in srgb, var(--ui-form-border-color) 84%, transparent);
    --ui-form-status-text: var(--ui-form-muted);
    color-scheme: light dark;
    display: block;
    width: 100%;
    min-width: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .form {
    width: 100%;
    min-width: 0;
    margin: 0;
    display: grid;
    gap: var(--ui-form-gap);
    box-sizing: border-box;
    color: var(--ui-form-color);
    background: var(--ui-form-bg);
    border: var(--ui-form-border);
    border-radius: var(--ui-form-radius);
    box-shadow: var(--ui-form-shadow);
    padding: var(--ui-form-padding);
    transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease, opacity 140ms ease;
  }

  .header {
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: var(--ui-form-header-gap);
    align-items: start;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--ui-form-header-border);
  }

  .header[hidden],
  .heading[hidden],
  .title[hidden],
  .description[hidden],
  .actions[hidden],
  .footer[hidden],
  .status[hidden],
  .status-text[hidden],
  .title-text[hidden],
  .description-text[hidden] {
    display: none !important;
  }

  .heading {
    min-width: 0;
    display: grid;
    gap: 4px;
  }

  .title {
    margin: 0;
    min-width: 0;
    font: 650 16px/1.3 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    color: inherit;
  }

  .description {
    margin: 0;
    min-width: 0;
    font-size: 12px;
    line-height: 1.45;
    letter-spacing: 0.01em;
    color: var(--ui-form-muted);
  }

  .actions {
    min-width: 0;
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .body {
    min-width: 0;
    display: grid;
    gap: var(--ui-form-gap);
  }

  .status {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 28px;
    padding: 0 10px;
    border-radius: calc(var(--ui-form-radius) - 6px);
    border: 1px solid var(--ui-form-status-border);
    background: var(--ui-form-status-bg);
    color: var(--ui-form-status-text);
    font: 550 12px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
  }

  .status::before {
    content: '';
    inline-size: 8px;
    block-size: 8px;
    border-radius: 999px;
    background: currentColor;
    opacity: 0.72;
    flex: 0 0 auto;
  }

  .status[data-tone="warning"] {
    --ui-form-status-bg: color-mix(in srgb, var(--ui-color-warning, #d97706) 12%, transparent);
    --ui-form-status-border: color-mix(in srgb, var(--ui-color-warning, #d97706) 44%, var(--ui-form-border-color));
    --ui-form-status-text: color-mix(in srgb, var(--ui-color-warning, #d97706) 90%, #111827 10%);
  }

  .status[data-tone="error"] {
    --ui-form-status-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 12%, transparent);
    --ui-form-status-border: color-mix(in srgb, var(--ui-color-danger, #dc2626) 44%, var(--ui-form-border-color));
    --ui-form-status-text: color-mix(in srgb, var(--ui-color-danger, #dc2626) 88%, #111827 12%);
  }

  .status[data-tone="success"] {
    --ui-form-status-bg: color-mix(in srgb, var(--ui-color-success, #16a34a) 12%, transparent);
    --ui-form-status-border: color-mix(in srgb, var(--ui-color-success, #16a34a) 44%, var(--ui-form-border-color));
    --ui-form-status-text: color-mix(in srgb, var(--ui-color-success, #16a34a) 90%, #111827 10%);
  }

  .status[data-tone="loading"] {
    --ui-form-status-bg: color-mix(in srgb, var(--ui-form-accent) 12%, transparent);
    --ui-form-status-border: color-mix(in srgb, var(--ui-form-accent) 44%, var(--ui-form-border-color));
    --ui-form-status-text: color-mix(in srgb, var(--ui-form-accent) 90%, #111827 10%);
  }

  .footer {
    min-width: 0;
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding-top: 2px;
  }

  :host([variant="surface"]) {
    --ui-form-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-form-padding: 16px;
    --ui-form-shadow:
      0 1px 3px rgba(2, 6, 23, 0.05),
      0 14px 28px rgba(2, 6, 23, 0.08);
  }

  :host([variant="outline"]) {
    --ui-form-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, transparent);
    --ui-form-padding: 14px;
    --ui-form-shadow: none;
  }

  :host([variant="soft"]) {
    --ui-form-bg: color-mix(in srgb, var(--ui-form-accent) 6%, var(--ui-color-surface, #ffffff));
    --ui-form-border-color: color-mix(in srgb, var(--ui-form-accent) 26%, var(--ui-color-border, #cbd5e1));
    --ui-form-padding: 16px;
    --ui-form-shadow:
      0 1px 4px rgba(2, 6, 23, 0.04),
      0 12px 24px rgba(2, 6, 23, 0.06);
  }

  :host([variant="contrast"]) {
    --ui-form-bg: #0f172a;
    --ui-form-color: #e2e8f0;
    --ui-form-muted: #93a4bd;
    --ui-form-border-color: #334155;
    --ui-form-padding: 16px;
    --ui-form-focus-ring: #93c5fd;
    --ui-form-shadow:
      0 2px 8px rgba(2, 6, 23, 0.24),
      0 26px 52px rgba(2, 6, 23, 0.38);
  }

  :host([variant="minimal"]) {
    --ui-form-bg: transparent;
    --ui-form-border: 0;
    --ui-form-shadow: none;
    --ui-form-padding: 0;
  }

  :host([variant="elevated"]) {
    --ui-form-bg: var(--ui-color-surface, #ffffff);
    --ui-form-shadow:
      0 2px 10px rgba(2, 6, 23, 0.1),
      0 28px 56px rgba(2, 6, 23, 0.16);
  }

  :host([tone="success"]) {
    --ui-form-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-form-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-form-accent: var(--ui-color-danger, #dc2626);
  }

  :host([density="compact"]) {
    --ui-form-gap: 10px;
    --ui-form-header-gap: 10px;
  }

  :host([density="comfortable"]) {
    --ui-form-gap: 14px;
    --ui-form-header-gap: 14px;
  }

  :host([shape="square"]) {
    --ui-form-radius: 4px;
  }

  :host([shape="soft"]) {
    --ui-form-radius: 22px;
  }

  :host([elevation="none"]) {
    --ui-form-shadow: none;
  }

  :host([elevation="low"]) {
    --ui-form-shadow:
      0 1px 3px rgba(2, 6, 23, 0.05),
      0 10px 20px rgba(2, 6, 23, 0.08);
  }

  :host([elevation="high"]) {
    --ui-form-shadow:
      0 3px 14px rgba(2, 6, 23, 0.12),
      0 32px 64px rgba(2, 6, 23, 0.2);
  }

  :host([loading]) .form {
    opacity: 0.82;
    pointer-events: none;
  }

  :host([disabled]) .form {
    opacity: 0.7;
    pointer-events: none;
  }

  :host([dirty]) .form {
    border-color: color-mix(in srgb, var(--ui-form-accent) 38%, var(--ui-form-border-color));
  }

  :host(:focus-within) .form {
    border-color: color-mix(in srgb, var(--ui-form-focus-ring) 56%, var(--ui-form-border-color));
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--ui-form-focus-ring) 20%, transparent),
      var(--ui-form-shadow);
  }

  :host([state="success"]) .form {
    border-color: color-mix(in srgb, var(--ui-color-success, #16a34a) 44%, var(--ui-form-border-color));
  }

  :host([state="warning"]) .form {
    border-color: color-mix(in srgb, var(--ui-color-warning, #d97706) 44%, var(--ui-form-border-color));
  }

  :host([state="error"]) .form {
    border-color: color-mix(in srgb, var(--ui-color-danger, #dc2626) 44%, var(--ui-form-border-color));
  }

  :host([headless]) .form {
    display: block;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    padding: 0;
    gap: 0;
  }

  :host([headless]) .header,
  :host([headless]) .status,
  :host([headless]) .footer {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .form {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-form-border: 2px solid var(--ui-form-border-color);
      --ui-form-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-form-bg: Canvas;
      --ui-form-color: CanvasText;
      --ui-form-muted: CanvasText;
      --ui-form-border-color: CanvasText;
      --ui-form-shadow: none;
      --ui-form-status-bg: Canvas;
      --ui-form-status-border: CanvasText;
      --ui-form-status-text: CanvasText;
    }

    .form,
    .status {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
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

function slotHasMeaningfulContent(slot: HTMLSlotElement | null): boolean {
  if (!slot) return false;
  const nodes = slot.assignedNodes({ flatten: true });
  if (!nodes.length) return false;

  return nodes.some((node) => {
    if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
    return node.nodeType === Node.ELEMENT_NODE;
  });
}

function toBool(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = raw.trim().toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function isNativeControl(node: Element): node is NativeControl {
  const tag = node.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select';
}

function normalizeForSnapshot(value: any): any {
  if (value == null) return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof File !== 'undefined' && value instanceof File) {
    return {
      __file: true,
      name: value.name,
      size: value.size,
      type: value.type,
      lastModified: value.lastModified
    };
  }
  if (Array.isArray(value)) return value.map((entry) => normalizeForSnapshot(entry));
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, any>).sort(([a], [b]) => a.localeCompare(b));
    const out: Record<string, any> = {};
    entries.forEach(([key, entry]) => {
      out[key] = normalizeForSnapshot(entry);
    });
    return out;
  }
  return value;
}

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) return value.map((entry) => cloneValue(entry)) as unknown as T;
  if (value && typeof value === 'object') {
    if (typeof File !== 'undefined' && value instanceof File) return value;
    if (value instanceof Date) return new Date(value.getTime()) as unknown as T;
    const out: Record<string, any> = {};
    Object.entries(value as Record<string, any>).forEach(([key, entry]) => {
      out[key] = cloneValue(entry);
    });
    return out as T;
  }
  return value;
}

function readState(raw: string | null): FormStateTone {
  if (raw === 'success' || raw === 'warning' || raw === 'error') return raw;
  return 'default';
}

export class UIForm extends ElementBase {
  static get observedAttributes() {
    return [
      'novalidate',
      'variant',
      'tone',
      'density',
      'shape',
      'elevation',
      'gap',
      'headless',
      'loading',
      'autosave',
      'autosave-delay',
      'guard-unsaved',
      'dirty',
      'disabled',
      'heading',
      'title',
      'description',
      'state',
      'state-text',
      'loading-text',
      'aria-label',
      'aria-labelledby'
    ];
  }

  private _controller = new FormController();
  private _submitting = false;
  private _autosaveTimer: ReturnType<typeof setTimeout> | null = null;
  private _initTimer: ReturnType<typeof setTimeout> | null = null;
  private _dirtyFrame: number | null = null;
  private _initialSnapshot = '';
  private _cleanValues: Record<string, any> = {};
  private _dirty = false;
  private _dirtyAttrSyncing = false;
  private _uid = Math.random().toString(36).slice(2, 10);

  private _formEl: HTMLFormElement | null = null;
  private _headerEl: HTMLElement | null = null;
  private _headingEl: HTMLElement | null = null;
  private _titleEl: HTMLElement | null = null;
  private _descriptionEl: HTMLElement | null = null;
  private _titleTextEl: HTMLElement | null = null;
  private _descriptionTextEl: HTMLElement | null = null;
  private _actionsEl: HTMLElement | null = null;
  private _statusEl: HTMLElement | null = null;
  private _statusTextEl: HTMLElement | null = null;
  private _footerEl: HTMLElement | null = null;
  private _titleSlot: HTMLSlotElement | null = null;
  private _headingSlot: HTMLSlotElement | null = null;
  private _descriptionSlot: HTMLSlotElement | null = null;
  private _actionsSlot: HTMLSlotElement | null = null;
  private _statusSlot: HTMLSlotElement | null = null;
  private _footerSlot: HTMLSlotElement | null = null;

  private _descriptionVisible = false;
  private _statusVisible = false;

  constructor() {
    super();
    this._onNativeSubmit = this._onNativeSubmit.bind(this);
    this._onValueEvent = this._onValueEvent.bind(this);
    this._onBeforeUnload = this._onBeforeUnload.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.hasAttribute('title') && !this.hasAttribute('heading')) {
      const legacyTitle = this.getAttribute('title');
      if (legacyTitle != null) this.setAttribute('heading', legacyTitle);
      this.removeAttribute('title');
    }
    this.root.addEventListener('submit', this._onNativeSubmit as EventListener);
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);
    this.addEventListener('input', this._onValueEvent as EventListener);
    this.addEventListener('change', this._onValueEvent as EventListener);

    if (this.hasAttribute('guard-unsaved') && typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this._onBeforeUnload as EventListener);
    }

    this._initTimer = setTimeout(() => {
      const baseline = this.getValues();
      this._setBaseline(baseline, false);
      this._initTimer = null;
    }, 0);
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('submit', this._onNativeSubmit as EventListener);
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this.removeEventListener('input', this._onValueEvent as EventListener);
    this.removeEventListener('change', this._onValueEvent as EventListener);

    if (this._initTimer) {
      clearTimeout(this._initTimer);
      this._initTimer = null;
    }
    if (this._autosaveTimer) {
      clearTimeout(this._autosaveTimer);
      this._autosaveTimer = null;
    }
    if (this._dirtyFrame != null) {
      if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(this._dirtyFrame);
      clearTimeout(this._dirtyFrame);
      this._dirtyFrame = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this._onBeforeUnload as EventListener);
    }
    super.disconnectedCallback();
  }

  private _onNativeSubmit(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target?.classList.contains('form')) return;

    event.preventDefault();
    event.stopPropagation();
    if (this.hasAttribute('disabled')) return;
    void this.submit();
  }

  registerField(name: string, field: any) {
    return this._controller.registerField(name, field);
  }

  setValue(name: string, value: any): void {
    this._controller.setValue(name, value);
    this._setNativeValue(name, value, this._groupNativeControls({ includeDisabled: true }));
    this._scheduleDirtyRefresh();
  }

  setValues(values: Record<string, any>): void {
    if (!values || typeof values !== 'object') return;
    const groupedControls = this._groupNativeControls({ includeDisabled: true });
    Object.entries(values).forEach(([name, value]) => {
      this._controller.setValue(name, value);
      this._setNativeValue(name, value, groupedControls);
    });
    this._scheduleDirtyRefresh();
  }

  getValues() {
    const values: Record<string, any> = { ...this._controller.getValues() };
    const skipNames = new Set(Object.keys(values));
    const nativeValues = this._collectNativeValues(skipNames, this._groupNativeControls());
    Object.assign(values, nativeValues);
    return values;
  }

  private _queryNativeControls(options: NativeControlQueryOptions = {}): NativeControl[] {
    const { includeDisabled = false } = options;
    const controls = Array.from(this.querySelectorAll('input[name],textarea[name],select[name]'));
    return controls.filter((node): node is NativeControl => {
      if (!isNativeControl(node)) return false;
      const owner = node.closest('ui-form');
      if (owner !== this) return false;
      if (!includeDisabled && node.matches(':disabled')) return false;
      return true;
    });
  }

  private _groupNativeControls(options: NativeControlQueryOptions = {}): Map<string, NativeControl[]> {
    const grouped = new Map<string, NativeControl[]>();
    this._queryNativeControls(options).forEach((control) => {
      const name = control.getAttribute('name') || '';
      if (!name) return;
      const list = grouped.get(name) || [];
      list.push(control);
      grouped.set(name, list);
    });
    return grouped;
  }

  private _collectNativeValues(skipNames: Set<string>, grouped: Map<string, NativeControl[]>): Record<string, any> {
    const output: Record<string, any> = {};

    grouped.forEach((controls, name) => {
      if (skipNames.has(name)) return;
      const first = controls[0];
      if (!first) return;

      if (first instanceof HTMLInputElement && first.type === 'radio') {
        const selected = controls.find((control) => control instanceof HTMLInputElement && control.checked) as HTMLInputElement | undefined;
        output[name] = selected ? selected.value : '';
        return;
      }

      if (first instanceof HTMLInputElement && first.type === 'checkbox') {
        if (controls.length === 1) {
          output[name] = first.checked;
          return;
        }
        output[name] = controls
          .filter((control): control is HTMLInputElement => control instanceof HTMLInputElement && control.checked)
          .map((control) => control.value || 'on');
        return;
      }

      if (first instanceof HTMLSelectElement && first.multiple) {
        output[name] = Array.from(first.selectedOptions).map((option) => option.value);
        return;
      }

      if (first instanceof HTMLInputElement && first.type === 'file') {
        output[name] = Array.from(first.files || []);
        return;
      }

      output[name] = (first as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    });

    return output;
  }

  private _setNativeValue(name: string, value: any, grouped?: Map<string, NativeControl[]>): void {
    const controls = (grouped || this._groupNativeControls({ includeDisabled: true })).get(name) || [];
    if (!controls.length) return;
    const first = controls[0];
    if (!first) return;

    if (first instanceof HTMLInputElement && first.type === 'radio') {
      const next = String(value ?? '');
      controls.forEach((control) => {
        if (control instanceof HTMLInputElement) control.checked = control.value === next;
      });
      return;
    }

    if (first instanceof HTMLInputElement && first.type === 'checkbox') {
      if (controls.length === 1) {
        const next = typeof value === 'boolean' ? value : !!value;
        first.checked = next;
        return;
      }

      const selected = Array.isArray(value) ? value.map((entry) => String(entry)) : [];
      controls.forEach((control) => {
        if (!(control instanceof HTMLInputElement)) return;
        control.checked = selected.includes(control.value || 'on');
      });
      return;
    }

    if (first instanceof HTMLSelectElement && first.multiple) {
      const selected = Array.isArray(value) ? value.map((entry) => String(entry)) : [];
      Array.from(first.options).forEach((option) => {
        option.selected = selected.includes(option.value);
      });
      return;
    }

    if (first instanceof HTMLInputElement && first.type === 'file') return;
    (first as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value = String(value ?? '');
  }

  async validate() {
    const controlled = await this._controller.validateAll();
    const native = this._validateNativeControls();
    const result = {
      valid: controlled.valid && native.valid,
      errors: { ...native.errors, ...controlled.errors }
    };

    this.dispatchEvent(
      new CustomEvent('validate', {
        bubbles: true,
        composed: true,
        detail: result
      })
    );

    return result;
  }

  private _validateNativeControls(): NativeValidationResult {
    const errors: Record<string, string | undefined> = {};
    let firstInvalid: HTMLElement | null = null;
    let valid = true;
    const grouped = this._groupNativeControls();

    grouped.forEach((controls, name) => {
      for (const control of controls) {
        if (!(control as any).willValidate) continue;
        const isValid = (control as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).checkValidity();
        if (isValid) continue;

        valid = false;
        if (!errors[name]) errors[name] = (control as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).validationMessage || 'invalid';
        if (!firstInvalid) firstInvalid = control;
        break;
      }
    });

    return { valid, errors, firstInvalid };
  }

  async submit() {
    if (this._submitting || this.hasAttribute('loading') || this.hasAttribute('disabled')) return false;

    this._submitting = true;
    const alreadyLoading = this.hasAttribute('loading');
    if (!alreadyLoading) this.setAttribute('loading', '');

    try {
      const values = this.getValues();
      const shouldSkipValidation = this.hasAttribute('novalidate');

      if (!shouldSkipValidation) {
        const controlled = await this._controller.validateAll();
        const native = this._validateNativeControls();
        const errors = { ...native.errors, ...controlled.errors };
        const valid = controlled.valid && native.valid;

        this.dispatchEvent(
          new CustomEvent('validate', {
            bubbles: true,
            composed: true,
            detail: { valid, errors }
          })
        );

        if (!valid) {
          this.dispatchEvent(
            new CustomEvent('invalid', {
              bubbles: true,
              composed: true,
              detail: { errors, values }
            })
          );
          this._focusFirstInvalid(native.firstInvalid, errors);
          return false;
        }
      }

      this.dispatchEvent(
        new CustomEvent('submit', {
          bubbles: true,
          composed: true,
          detail: { values }
        })
      );
      this.markClean(values);
      return true;
    } finally {
      this._submitting = false;
      if (!alreadyLoading) this.removeAttribute('loading');
    }
  }

  private _focusFirstInvalid(nativeInvalid: HTMLElement | null, errors: Record<string, string | undefined>): void {
    if (nativeInvalid) {
      nativeInvalid.focus();
      return;
    }

    const firstName = Object.entries(errors).find(([, message]) => !!message)?.[0];
    if (!firstName) return;

    const selectorSafeName = firstName.replace(/"/g, '\\"');
    const candidate = this.querySelector(`[name="${selectorSafeName}"]`) as HTMLElement | null;
    if (!candidate || typeof candidate.focus !== 'function') return;
    candidate.focus();
  }

  async requestSubmit() {
    return this.submit();
  }

  reset(values?: Record<string, any>): void {
    if (values && typeof values === 'object') {
      this.setValues(values);
      this.markClean(values);
      return;
    }

    this.setValues(this._cleanValues);
    this.markClean(this._cleanValues);
  }

  get dirty(): boolean {
    return this._dirty;
  }

  isDirty(): boolean {
    return this._dirty;
  }

  markClean(values?: Record<string, any>): void {
    if (values && typeof values === 'object') {
      this._setBaseline(values);
      return;
    }
    this._setBaseline(this.getValues());
  }

  private _setBaseline(values: Record<string, any>, emit = true): void {
    this._cleanValues = cloneValue(values || {});
    this._initialSnapshot = this._snapshot(this._cleanValues);
    this._setDirty(false, emit);
  }

  private _snapshot(values?: Record<string, any>): string {
    const source = values && typeof values === 'object' ? values : this.getValues();
    try {
      return JSON.stringify(normalizeForSnapshot(source || {}));
    } catch {
      return '';
    }
  }

  private _setDirty(next: boolean, emit = true): void {
    if (this._dirty === next) return;
    this._dirty = next;
    this._dirtyAttrSyncing = true;
    if (next) this.setAttribute('dirty', '');
    else if (this.hasAttribute('dirty')) this.removeAttribute('dirty');
    this._dirtyAttrSyncing = false;

    this._syncStatus();
    this._syncFormAttrs();

    if (emit) {
      this.dispatchEvent(
        new CustomEvent('dirty-change', {
          bubbles: true,
          composed: true,
          detail: { dirty: next, values: this.getValues() }
        })
      );
    }
  }

  private _scheduleDirtyRefresh(): void {
    if (this._dirtyFrame != null) return;
    if (typeof requestAnimationFrame === 'function') {
      this._dirtyFrame = requestAnimationFrame(() => {
        this._dirtyFrame = null;
        this._refreshDirtyState();
      });
      return;
    }
    this._dirtyFrame = window.setTimeout(() => {
      this._dirtyFrame = null;
      this._refreshDirtyState();
    }, 16) as unknown as number;
  }

  private _refreshDirtyState(): void {
    const next = this._snapshot() !== this._initialSnapshot;
    this._setDirty(next);

    if (!this.hasAttribute('autosave')) return;
    if (!next || this.hasAttribute('loading')) {
      if (this._autosaveTimer) {
        clearTimeout(this._autosaveTimer);
        this._autosaveTimer = null;
      }
      return;
    }

    const delayRaw = Number(this.getAttribute('autosave-delay') || 800);
    const delay = Number.isFinite(delayRaw) && delayRaw >= 0 ? delayRaw : 800;
    if (this._autosaveTimer) clearTimeout(this._autosaveTimer);
    this._autosaveTimer = setTimeout(() => {
      this._autosaveTimer = null;
      if (!this._dirty) return;
      this.dispatchEvent(
        new CustomEvent('autosave', {
          bubbles: true,
          composed: true,
          detail: { values: this.getValues(), dirty: this._dirty }
        })
      );
    }, delay);
  }

  private _onValueEvent(event: Event): void {
    const target = event.target as Element | null;
    if (!target || target === this) return;
    const owner = target.closest('ui-form');
    if (owner && owner !== this) return;
    this._scheduleDirtyRefresh();
  }

  private _onBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.hasAttribute('guard-unsaved') || !this._dirty) return;
    event.preventDefault();
    event.returnValue = '';
  }

  private _onSlotChange(): void {
    this._syncStructure();
    this._syncStatus();
    this._syncFormAttrs();
    this._scheduleDirtyRefresh();
  }

  private _syncGap(): void {
    const gap = this.getAttribute('gap');
    if (gap) this.style.setProperty('--ui-form-gap', gap);
    else this.style.removeProperty('--ui-form-gap');
  }

  private _syncFormAttrs(): void {
    const form = this._formEl;
    if (!form) return;

    form.setAttribute('aria-busy', this.hasAttribute('loading') ? 'true' : 'false');
    const disabled = this.hasAttribute('disabled');
    form.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    if (disabled) form.setAttribute('inert', '');
    else form.removeAttribute('inert');
    if (this.hasAttribute('novalidate')) form.setAttribute('novalidate', '');
    else form.removeAttribute('novalidate');

    const ariaLabel = this.getAttribute('aria-label');
    const ariaLabelledBy = this.getAttribute('aria-labelledby');
    if (ariaLabel) form.setAttribute('aria-label', ariaLabel);
    else form.removeAttribute('aria-label');
    if (ariaLabelledBy) form.setAttribute('aria-labelledby', ariaLabelledBy);
    else form.removeAttribute('aria-labelledby');

    const describedBy: string[] = [];
    if (this._descriptionVisible) describedBy.push(`${this._uid}-description`);
    if (this._statusVisible) describedBy.push(`${this._uid}-status`);
    if (describedBy.length) form.setAttribute('aria-describedby', describedBy.join(' '));
    else form.removeAttribute('aria-describedby');
  }

  private _syncStructure(): void {
    const titleAttr = (this.getAttribute('heading') || this.getAttribute('title') || '').trim();
    const descriptionAttr = (this.getAttribute('description') || '').trim();

    const hasHeadingSlot = slotHasMeaningfulContent(this._headingSlot);
    const hasTitleSlot = slotHasMeaningfulContent(this._titleSlot);
    const hasDescriptionSlot = slotHasMeaningfulContent(this._descriptionSlot);
    const hasActions = slotHasMeaningfulContent(this._actionsSlot);
    const hasFooter = slotHasMeaningfulContent(this._footerSlot);

    const hasTitle = !!titleAttr || hasHeadingSlot || hasTitleSlot;
    const hasDescription = !!descriptionAttr || hasDescriptionSlot;
    const hasHeading = hasTitle || hasDescription;
    const hasHeader = hasHeading || hasActions;

    if (this._titleTextEl) {
      this._titleTextEl.textContent = titleAttr;
      if (!titleAttr || hasHeadingSlot || hasTitleSlot) this._titleTextEl.setAttribute('hidden', '');
      else this._titleTextEl.removeAttribute('hidden');
    }

    if (this._descriptionTextEl) {
      this._descriptionTextEl.textContent = descriptionAttr;
      if (!descriptionAttr || hasDescriptionSlot) this._descriptionTextEl.setAttribute('hidden', '');
      else this._descriptionTextEl.removeAttribute('hidden');
    }

    if (this._titleEl) {
      if (hasTitle) this._titleEl.removeAttribute('hidden');
      else this._titleEl.setAttribute('hidden', '');
    }
    if (this._descriptionEl) {
      if (hasDescription) this._descriptionEl.removeAttribute('hidden');
      else this._descriptionEl.setAttribute('hidden', '');
    }
    if (this._headingEl) {
      if (hasHeading) this._headingEl.removeAttribute('hidden');
      else this._headingEl.setAttribute('hidden', '');
    }
    if (this._actionsEl) {
      if (hasActions) this._actionsEl.removeAttribute('hidden');
      else this._actionsEl.setAttribute('hidden', '');
    }
    if (this._headerEl) {
      if (hasHeader) this._headerEl.removeAttribute('hidden');
      else this._headerEl.setAttribute('hidden', '');
    }
    if (this._footerEl) {
      if (hasFooter) this._footerEl.removeAttribute('hidden');
      else this._footerEl.setAttribute('hidden', '');
    }

    this._descriptionVisible = hasDescription;
  }

  private _deriveStatusTextAndTone(): { text: string; tone: string } {
    const loading = this.hasAttribute('loading');
    const state = readState(this.getAttribute('state'));
    const stateText = (this.getAttribute('state-text') || '').trim();
    const loadingText = (this.getAttribute('loading-text') || '').trim() || 'Saving changes...';

    if (loading) return { text: loadingText, tone: 'loading' };
    if (stateText) return { text: stateText, tone: state };
    if (state === 'success') return { text: 'Saved', tone: 'success' };
    if (state === 'warning') return { text: 'Needs attention', tone: 'warning' };
    if (state === 'error') return { text: 'Validation errors present', tone: 'error' };
    if (this._dirty) return { text: 'Unsaved changes', tone: 'warning' };
    return { text: '', tone: 'default' };
  }

  private _syncStatus(): void {
    if (!this._statusEl || !this._statusTextEl) return;
    const hasStatusSlot = slotHasMeaningfulContent(this._statusSlot);
    const status = this._deriveStatusTextAndTone();

    if (hasStatusSlot) {
      this._statusTextEl.setAttribute('hidden', '');
    } else {
      this._statusTextEl.textContent = status.text;
      if (status.text) this._statusTextEl.removeAttribute('hidden');
      else this._statusTextEl.setAttribute('hidden', '');
    }

    const shouldShow = hasStatusSlot || !!status.text;
    if (shouldShow) this._statusEl.removeAttribute('hidden');
    else this._statusEl.setAttribute('hidden', '');

    this._statusEl.setAttribute('data-tone', status.tone);
    this._statusVisible = shouldShow;
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'title') {
      if (newValue != null && !this.hasAttribute('heading')) {
        this.setAttribute('heading', newValue);
      }
      if (this.hasAttribute('title')) this.removeAttribute('title');
      return;
    }

    if (CONTENT_ATTRS.has(name)) {
      this._syncStructure();
      this._syncStatus();
      this._syncFormAttrs();
      return;
    }

    if (name === 'gap') {
      this._syncGap();
      return;
    }

    if (name === 'dirty') {
      if (!this._dirtyAttrSyncing) {
        const nextDirty = this.hasAttribute('dirty');
        this._dirty = nextDirty;
        this._syncStatus();
        this._syncFormAttrs();
      }
      return;
    }

    if (name === 'loading' || name === 'novalidate' || name === 'state' || name === 'state-text' || name === 'loading-text' || name === 'disabled') {
      this._syncStatus();
      this._syncFormAttrs();
      return;
    }

    if (name === 'guard-unsaved') {
      if (typeof window === 'undefined') return;
      if (this.hasAttribute('guard-unsaved')) {
        window.addEventListener('beforeunload', this._onBeforeUnload as EventListener);
      } else {
        window.removeEventListener('beforeunload', this._onBeforeUnload as EventListener);
      }
      return;
    }

    if (name === 'aria-label' || name === 'aria-labelledby') {
      this._syncFormAttrs();
    }
  }

  protected override render(): void {
    this._syncGap();
    const title = this.getAttribute('heading') || this.getAttribute('title') || '';
    const description = this.getAttribute('description') || '';

    this.setContent(`
      <style>${style}</style>
      <form
        class="form"
        part="form"
        aria-busy="${this.hasAttribute('loading') ? 'true' : 'false'}"
        ${this.hasAttribute('novalidate') ? 'novalidate' : ''}
      >
        <header class="header" part="header">
          <div class="heading" part="heading">
            <h2 class="title" id="${this._uid}-title" part="title">
              <slot name="heading"></slot>
              <slot name="title"></slot>
              <span class="title-text">${escapeHtml(title)}</span>
            </h2>
            <p class="description" id="${this._uid}-description" part="description">
              <slot name="description"></slot>
              <span class="description-text">${escapeHtml(description)}</span>
            </p>
          </div>
          <div class="actions" part="actions"><slot name="actions"></slot></div>
        </header>

        <div class="body" part="body"><slot></slot></div>

        <div class="status" id="${this._uid}-status" part="status" role="status" aria-live="polite">
          <span class="status-text"></span>
          <slot name="status"></slot>
        </div>

        <footer class="footer" part="footer"><slot name="footer"></slot></footer>
      </form>
    `);

    this._formEl = this.root.querySelector('.form') as HTMLFormElement | null;
    this._headerEl = this.root.querySelector('.header') as HTMLElement | null;
    this._headingEl = this.root.querySelector('.heading') as HTMLElement | null;
    this._titleEl = this.root.querySelector('.title') as HTMLElement | null;
    this._descriptionEl = this.root.querySelector('.description') as HTMLElement | null;
    this._titleTextEl = this.root.querySelector('.title-text') as HTMLElement | null;
    this._descriptionTextEl = this.root.querySelector('.description-text') as HTMLElement | null;
    this._actionsEl = this.root.querySelector('.actions') as HTMLElement | null;
    this._statusEl = this.root.querySelector('.status') as HTMLElement | null;
    this._statusTextEl = this.root.querySelector('.status-text') as HTMLElement | null;
    this._footerEl = this.root.querySelector('.footer') as HTMLElement | null;
    this._headingSlot = this.root.querySelector('slot[name="heading"]') as HTMLSlotElement | null;
    this._titleSlot = this.root.querySelector('slot[name="title"]') as HTMLSlotElement | null;
    this._descriptionSlot = this.root.querySelector('slot[name="description"]') as HTMLSlotElement | null;
    this._actionsSlot = this.root.querySelector('slot[name="actions"]') as HTMLSlotElement | null;
    this._statusSlot = this.root.querySelector('slot[name="status"]') as HTMLSlotElement | null;
    this._footerSlot = this.root.querySelector('slot[name="footer"]') as HTMLSlotElement | null;

    this._syncStructure();
    this._syncStatus();
    this._syncFormAttrs();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-form')) {
  customElements.define('ui-form', UIForm);
}

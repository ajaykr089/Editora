import { ElementBase } from '../ElementBase';
import { FormController } from '../form';

const style = `
  :host {
    --ui-form-gap: 12px;
    --ui-form-radius: 16px;
    --ui-form-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-form-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-form-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 62%, transparent);
    --ui-form-border: 1px solid var(--ui-form-border-color);
    --ui-form-shadow:
      0 1px 3px rgba(2, 6, 23, 0.05),
      0 14px 28px rgba(2, 6, 23, 0.08);
    --ui-form-padding: 16px;
    --ui-form-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-form-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    color-scheme: light dark;
    display: block;
    width: 100%;
    min-width: 0;
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
    transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease, opacity 140ms ease;
  }

  :host([variant="surface"]) {
    --ui-form-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-form-padding: 16px;
    --ui-form-shadow:
      0 1px 3px rgba(2, 6, 23, 0.05),
      0 14px 28px rgba(2, 6, 23, 0.08);
  }

  :host([variant="outline"]) {
    --ui-form-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 90%, transparent);
    --ui-form-padding: 14px;
    --ui-form-shadow: none;
  }

  :host([variant="soft"]) {
    --ui-form-bg: color-mix(in srgb, var(--ui-form-accent) 6%, var(--ui-color-surface, #ffffff));
    --ui-form-border-color: color-mix(in srgb, var(--ui-form-accent) 24%, var(--ui-color-border, #cbd5e1));
    --ui-form-padding: 16px;
    --ui-form-shadow:
      0 1px 4px rgba(2, 6, 23, 0.04),
      0 12px 24px rgba(2, 6, 23, 0.06);
  }

  :host([variant="contrast"]) {
    --ui-form-bg: #0f172a;
    --ui-form-color: #e2e8f0;
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
    --ui-form-bg: linear-gradient(
      165deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 94%, #ffffff 6%),
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 99%, transparent)
    );
    --ui-form-shadow:
      0 2px 10px rgba(2, 6, 23, 0.1),
      0 28px 56px rgba(2, 6, 23, 0.16);
  }

  :host([tone="success"]) {
    --ui-form-accent: #16a34a;
  }

  :host([tone="warning"]) {
    --ui-form-accent: #d97706;
  }

  :host([tone="danger"]) {
    --ui-form-accent: #dc2626;
  }

  :host([density="compact"]) {
    --ui-form-gap: 10px;
  }

  :host([density="comfortable"]) {
    --ui-form-gap: 14px;
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
    opacity: 0.72;
    filter: saturate(0.9);
    pointer-events: none;
  }

  :host([dirty]) .form {
    border-color: color-mix(in srgb, var(--ui-form-accent) 38%, var(--ui-form-border-color));
  }

  :host(:focus-within) .form {
    border-color: color-mix(in srgb, var(--ui-form-focus-ring) 52%, var(--ui-form-border-color));
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--ui-form-focus-ring) 22%, transparent),
      var(--ui-form-shadow);
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
      --ui-form-border-color: CanvasText;
      --ui-form-shadow: none;
    }

    .form {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
    }
  }
`;

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
      'dirty'
    ];
  }

  private _controller = new FormController();
  private _submitting = false;
  private _autosaveTimer: ReturnType<typeof setTimeout> | null = null;
  private _initTimer: ReturnType<typeof setTimeout> | null = null;
  private _initialSnapshot = '';
  private _dirty = false;

  constructor() {
    super();
    this._onNativeSubmit = this._onNativeSubmit.bind(this);
    this._onValueEvent = this._onValueEvent.bind(this);
    this._onBeforeUnload = this._onBeforeUnload.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('submit', this._onNativeSubmit as EventListener);
    this.addEventListener('input', this._onValueEvent as EventListener);
    this.addEventListener('change', this._onValueEvent as EventListener);
    if (this.hasAttribute('guard-unsaved')) {
      window.addEventListener('beforeunload', this._onBeforeUnload as EventListener);
    }
    this._initTimer = setTimeout(() => {
      this._initialSnapshot = this._snapshot();
      this._setDirty(false, false);
      this._initTimer = null;
    }, 0);
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('submit', this._onNativeSubmit as EventListener);
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
    window.removeEventListener('beforeunload', this._onBeforeUnload as EventListener);
    super.disconnectedCallback();
  }

  private _onNativeSubmit(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target?.classList.contains('form')) return;

    event.preventDefault();
    event.stopPropagation();
    void this.submit();
  }

  registerField(name: string, field: any) {
    return this._controller.registerField(name, field);
  }

  setValue(name: string, value: any): void {
    this._controller.setValue(name, value);
    this._refreshDirtyState();
  }

  setValues(values: Record<string, any>): void {
    if (!values || typeof values !== 'object') return;

    Object.entries(values).forEach(([name, value]) => {
      this._controller.setValue(name, value);
    });
    this._refreshDirtyState();
  }

  getValues() {
    return this._controller.getValues();
  }

  async validate() {
    const result = await this._controller.validateAll();
    this.dispatchEvent(
      new CustomEvent('validate', {
        bubbles: true,
        composed: true,
        detail: result
      })
    );
    return result;
  }

  async submit() {
    if (this._submitting || this.hasAttribute('loading')) return false;

    this._submitting = true;
    const alreadyLoading = this.hasAttribute('loading');
    if (!alreadyLoading) this.setAttribute('loading', '');

    try {
      const values = this._controller.getValues();
      const shouldSkipValidation = this.hasAttribute('novalidate');

      if (!shouldSkipValidation) {
        const { valid, errors } = await this._controller.validateAll();
        if (!valid) {
          this.dispatchEvent(
            new CustomEvent('invalid', {
              bubbles: true,
              composed: true,
              detail: { errors, values }
            })
          );
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

  async requestSubmit() {
    return this.submit();
  }

  reset(values?: Record<string, any>): void {
    if (values && typeof values === 'object') {
      this.setValues(values);
      this.markClean(values);
      return;
    }

    const current = this._controller.getValues();
    Object.keys(current).forEach((name) => {
      this._controller.setValue(name, '');
    });
    this.markClean();
  }

  get dirty(): boolean {
    return this._dirty;
  }

  isDirty(): boolean {
    return this._dirty;
  }

  markClean(values?: Record<string, any>): void {
    if (values && typeof values === 'object') {
      this._initialSnapshot = this._snapshot(values);
    } else {
      this._initialSnapshot = this._snapshot();
    }
    this._setDirty(false);
  }

  private _snapshot(values?: Record<string, any>): string {
    const source = values && typeof values === 'object' ? values : this._controller.getValues();
    try {
      return JSON.stringify(source || {});
    } catch {
      return '';
    }
  }

  private _setDirty(next: boolean, emit = true): void {
    if (this._dirty === next) return;
    this._dirty = next;
    if (next) this.setAttribute('dirty', '');
    else if (this.hasAttribute('dirty')) this.removeAttribute('dirty');

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

  private _refreshDirtyState(): void {
    const next = this._snapshot() !== this._initialSnapshot;
    this._setDirty(next);

    if (!this.hasAttribute('autosave')) return;
    if (!next) {
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
      const values = this.getValues();
      this.dispatchEvent(
        new CustomEvent('autosave', {
          bubbles: true,
          composed: true,
          detail: { values, dirty: this._dirty }
        })
      );
    }, delay);
  }

  private _onValueEvent(event: Event): void {
    const target = event.target;
    if (!target) return;
    if (target === this || target === this.root) return;
    this._refreshDirtyState();
  }

  private _onBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.hasAttribute('guard-unsaved') || !this._dirty) return;
    event.preventDefault();
    event.returnValue = '';
  }

  private _syncGap(): void {
    const gap = this.getAttribute('gap');
    if (gap) this.style.setProperty('--ui-form-gap', gap);
    else this.style.removeProperty('--ui-form-gap');
  }

  private _syncFormAttrs(): void {
    const form = this.root.querySelector('.form') as HTMLFormElement | null;
    if (!form) return;
    form.setAttribute('aria-busy', this.hasAttribute('loading') ? 'true' : 'false');
    if (this.hasAttribute('novalidate')) form.setAttribute('novalidate', '');
    else form.removeAttribute('novalidate');
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'gap') {
      this._syncGap();
      return;
    }

    if (name === 'loading' || name === 'novalidate') {
      this._syncFormAttrs();
      return;
    }

    if (name !== 'guard-unsaved' || oldValue === newValue) return;
    if (this.hasAttribute('guard-unsaved')) {
      window.addEventListener('beforeunload', this._onBeforeUnload as EventListener);
    } else {
      window.removeEventListener('beforeunload', this._onBeforeUnload as EventListener);
    }
  }

  protected override render(): void {
    this._syncGap();

    this.setContent(`
      <style>${style}</style>
      <form
        class="form"
        part="form"
        role="form"
        aria-busy="${this.hasAttribute('loading') ? 'true' : 'false'}"
        ${this.hasAttribute('novalidate') ? 'novalidate' : ''}
      >
        <slot></slot>
      </form>
    `);
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

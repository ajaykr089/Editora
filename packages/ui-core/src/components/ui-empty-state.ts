import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-empty-bg: linear-gradient(180deg, var(--ui-color-surface, #ffffff), var(--ui-color-surface-alt, #f8fafc));
    --ui-empty-border: 1px dashed color-mix(in srgb, var(--ui-color-border, rgba(51, 65, 85, 0.28)) 88%, transparent);
    --ui-empty-radius: 16px;
    --ui-empty-padding: 28px;
    --ui-empty-title: var(--ui-color-text, #0f172a);
    --ui-empty-description: var(--ui-color-muted, #64748b);
    --ui-empty-icon-bg: color-mix(in srgb, var(--ui-color-muted, #64748b) 18%, transparent);
    --ui-empty-icon-color: color-mix(in srgb, var(--ui-color-text, #334155) 82%, transparent);
    --ui-empty-shadow: var(--ui-shadow-md, 0 10px 34px rgba(15, 23, 42, 0.08));
    --ui-empty-action-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 14%, transparent);
    --ui-empty-action-border: color-mix(in srgb, var(--ui-color-primary, #2563eb) 36%, transparent);
    --ui-empty-action-color: var(--ui-color-primary, #1d4ed8);
    --ui-empty-action-bg-hover: color-mix(in srgb, var(--ui-color-primary, #2563eb) 22%, transparent);
    color-scheme: light dark;
  }

  .card {
    display: grid;
    justify-items: center;
    gap: 12px;
    text-align: center;
    background: var(--ui-empty-bg);
    border: var(--ui-empty-border);
    border-radius: var(--ui-empty-radius);
    padding: var(--ui-empty-padding);
    box-shadow: var(--ui-empty-shadow);
  }

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--ui-empty-icon-color);
    background: var(--ui-empty-icon-bg);
    font-size: 20px;
    line-height: 1;
  }

  .title {
    margin: 0;
    color: var(--ui-empty-title);
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  .description {
    margin: 0;
    color: var(--ui-empty-description);
    font-size: 14px;
    line-height: 1.45;
    max-width: 520px;
  }

  .actions {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 2px;
  }

  .default-action {
    border: 1px solid var(--ui-empty-action-border);
    background: var(--ui-empty-action-bg);
    color: var(--ui-empty-action-color);
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  .default-action:hover {
    background: var(--ui-empty-action-bg-hover);
  }

  .default-action:focus-visible {
    outline: 2px solid var(--ui-color-focus-ring, #2563eb);
    outline-offset: 2px;
  }

  :host([compact]) .card {
    padding: 18px;
    gap: 10px;
  }

  :host([compact]) .icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  :host([tone="success"]) {
    --ui-empty-icon-color: var(--ui-color-success, #166534);
    --ui-empty-icon-bg: color-mix(in srgb, var(--ui-color-success, #16a34a) 20%, transparent);
  }

  :host([tone="warning"]) {
    --ui-empty-icon-color: color-mix(in srgb, var(--ui-color-warning, #f59e0b) 80%, black);
    --ui-empty-icon-bg: color-mix(in srgb, var(--ui-color-warning, #f59e0b) 24%, transparent);
  }

  :host([tone="danger"]) {
    --ui-empty-icon-color: var(--ui-color-danger, #b91c1c);
    --ui-empty-icon-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 22%, transparent);
  }

  :host([headless]) .card {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .default-action {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .card {
      box-shadow: none;
      border-width: 2px;
    }
    .default-action {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    .card,
    .icon,
    .default-action {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border: 1px solid CanvasText;
      box-shadow: none;
    }
    .default-action:hover {
      background: Highlight;
      color: HighlightText;
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

export class UIEmptyState extends ElementBase {
  static get observedAttributes() {
    return ['title', 'description', 'action-label', 'tone', 'compact', 'headless'];
  }

  private _actionBtn: HTMLButtonElement | null = null;

  constructor() {
    super();
    this._onActionClick = this._onActionClick.bind(this);
  }

  disconnectedCallback() {
    if (this._actionBtn) {
      this._actionBtn.removeEventListener('click', this._onActionClick);
      this._actionBtn = null;
    }
    super.disconnectedCallback();
  }

  private _onActionClick() {
    this.dispatchEvent(new CustomEvent('action', { bubbles: true }));
  }

  protected render() {
    if (this._actionBtn) {
      this._actionBtn.removeEventListener('click', this._onActionClick);
      this._actionBtn = null;
    }

    const title = this.getAttribute('title') || 'No results found';
    const description = this.getAttribute('description') || 'Try adjusting your filters or creating a new record.';
    const actionLabel = this.getAttribute('action-label') || '';

    this.setContent(`
      <style>${style}</style>
      <section class="card" role="status" aria-live="polite">
        <div class="icon" part="icon" aria-hidden="true">
          <slot name="icon">i</slot>
        </div>
        <h3 class="title" part="title">
          <slot name="title">${escapeHtml(title)}</slot>
        </h3>
        <p class="description" part="description">
          <slot name="description">${escapeHtml(description)}</slot>
        </p>
        <div class="actions" part="actions">
          <slot name="actions"></slot>
          ${actionLabel ? `<button type="button" class="default-action">${escapeHtml(actionLabel)}</button>` : ''}
        </div>
      </section>
    `);

    this._actionBtn = this.root.querySelector('.default-action');
    if (this._actionBtn) {
      this._actionBtn.addEventListener('click', this._onActionClick);
    }
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return true;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-empty-state')) {
  customElements.define('ui-empty-state', UIEmptyState);
}

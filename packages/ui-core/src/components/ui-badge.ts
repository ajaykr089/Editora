import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-flex;
    --ui-badge-font-size: 12px;
    --ui-badge-font-weight: 600;
    --ui-badge-line-height: 1.2;
    --ui-badge-gap: 6px;
    --ui-badge-radius: 999px;
    --ui-badge-padding-y: 5px;
    --ui-badge-padding-x: 10px;
    --ui-badge-border: 1px solid transparent;
    --ui-badge-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 11%, var(--ui-color-surface, #ffffff));
    --ui-badge-color: var(--ui-color-text, #1e293b);
    --ui-badge-shadow: var(--ui-shadow-sm, 0 4px 12px rgba(15, 23, 42, 0.08));
    --ui-badge-dot-size: 7px;
    --ui-badge-dot-color: currentColor;
    --ui-badge-remove-bg: color-mix(in srgb, var(--ui-color-text, #0f172a) 10%, transparent);
    --ui-badge-remove-bg-hover: color-mix(in srgb, var(--ui-color-text, #0f172a) 18%, transparent);
    color-scheme: light dark;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--ui-badge-gap);
    font-size: var(--ui-badge-font-size);
    font-weight: var(--ui-badge-font-weight);
    line-height: var(--ui-badge-line-height);
    border-radius: var(--ui-badge-radius);
    border: var(--ui-badge-border);
    background: var(--ui-badge-bg);
    color: var(--ui-badge-color);
    padding: var(--ui-badge-padding-y) var(--ui-badge-padding-x);
    box-shadow: var(--ui-badge-shadow);
    letter-spacing: 0.01em;
    user-select: none;
    white-space: nowrap;
    transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease, border-color 120ms ease;
  }

  :host(:hover) .badge {
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
  }

  .dot {
    width: var(--ui-badge-dot-size);
    height: var(--ui-badge-dot-size);
    border-radius: 999px;
    background: var(--ui-badge-dot-color);
    flex: 0 0 auto;
  }

  .icon-slot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-size: 0.95em;
  }

  .remove-btn {
    border: none;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    padding: 0;
    background: var(--ui-badge-remove-bg);
    color: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 11px;
    line-height: 1;
    transition: background-color 120ms ease;
  }

  .remove-btn:hover {
    background: var(--ui-badge-remove-bg-hover);
  }

  .remove-btn:focus-visible {
    outline: 2px solid var(--ui-color-focus-ring, #2563eb);
    outline-offset: 2px;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-badge-font-size: 11px;
    --ui-badge-padding-y: 4px;
    --ui-badge-padding-x: 8px;
    --ui-badge-gap: 5px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-badge-font-size: 13px;
    --ui-badge-padding-y: 6px;
    --ui-badge-padding-x: 11px;
    --ui-badge-gap: 7px;
  }

  :host([variant="solid"]) .badge {
    --ui-badge-bg: color-mix(in srgb, var(--ui-badge-color) 18%, #ffffff);
    --ui-badge-border: 1px solid color-mix(in srgb, var(--ui-badge-color) 18%, transparent);
  }

  :host([variant="soft"]) .badge {
    --ui-badge-bg: color-mix(in srgb, var(--ui-badge-color) 10%, #ffffff);
    --ui-badge-border: 1px solid color-mix(in srgb, var(--ui-badge-color) 12%, transparent);
  }

  :host([variant="outline"]) .badge {
    --ui-badge-bg: rgba(255, 255, 255, 0.7);
    --ui-badge-border: 1px solid color-mix(in srgb, var(--ui-badge-color) 26%, transparent);
    box-shadow: none;
  }

  :host([variant="ghost"]) .badge {
    --ui-badge-bg: transparent;
    --ui-badge-border: 1px dashed color-mix(in srgb, var(--ui-badge-color) 22%, transparent);
    box-shadow: none;
  }

  :host([tone="neutral"]) .badge { --ui-badge-color: #334155; }
  :host([tone="info"]) .badge { --ui-badge-color: var(--ui-color-primary, #1d4ed8); }
  :host([tone="success"]) .badge { --ui-badge-color: var(--ui-color-success, #15803d); }
  :host([tone="warning"]) .badge { --ui-badge-color: var(--ui-color-warning, #b45309); }
  :host([tone="danger"]) .badge { --ui-badge-color: var(--ui-color-danger, #b91c1c); }
  :host([tone="purple"]) .badge { --ui-badge-color: #7c3aed; }

  :host([pill]) { --ui-badge-radius: 9999px; }
  :host([radius="none"]) { --ui-badge-radius: 0; }
  :host([radius="large"]) { --ui-badge-radius: 14px; }
  :host([radius="full"]) { --ui-badge-radius: 9999px; }

  :host([disabled]) .badge {
    opacity: 0.55;
    pointer-events: none;
    transform: none !important;
    box-shadow: none !important;
  }

  :host([headless]) .badge {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .badge,
    .remove-btn {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .badge {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    .badge,
    .remove-btn {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border: 1px solid CanvasText;
      box-shadow: none;
    }
    .dot {
      background: CanvasText;
    }
    :host(:hover) .badge,
    .remove-btn:hover {
      background: Highlight;
      color: HighlightText;
      border-color: Highlight;
      transform: none;
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

export class UIBadge extends ElementBase {
  static get observedAttributes() {
    return [
      'text',
      'tone',
      'variant',
      'size',
      'pill',
      'dot',
      'radius',
      'disabled',
      'removable',
      'auto-remove',
      'icon-only',
      'headless'
    ];
  }

  private _removeBtn: HTMLButtonElement | null = null;

  constructor() {
    super();
    this._onRemoveClick = this._onRemoveClick.bind(this);
  }

  disconnectedCallback() {
    this._detachListeners();
    super.disconnectedCallback();
  }

  protected render() {
    const text = this.getAttribute('text') || '';
    const removable = this.hasAttribute('removable');
    const hasDot = this.hasAttribute('dot');
    const iconOnly = this.hasAttribute('icon-only');

    this.setContent(`
      <style>${style}</style>
      <span class="badge" part="badge">
        ${hasDot ? '<span class="dot" part="dot" aria-hidden="true"></span>' : ''}
        <span class="icon-slot" part="icon"><slot name="icon"></slot></span>
        ${iconOnly ? '' : `<span class="label" part="label"><slot>${escapeHtml(text)}</slot></span>`}
        ${removable ? '<button type="button" class="remove-btn" part="remove" aria-label="Remove badge">✕</button>' : ''}
      </span>
    `);

    this._detachListeners();
    this._removeBtn = this.root.querySelector('.remove-btn');
    if (this._removeBtn) {
      this._removeBtn.addEventListener('click', this._onRemoveClick);
    }
  }

  private _detachListeners() {
    if (!this._removeBtn) return;
    this._removeBtn.removeEventListener('click', this._onRemoveClick);
    this._removeBtn = null;
  }

  private _onRemoveClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.hasAttribute('disabled')) return;

    const removeEvent = new CustomEvent('remove', {
      bubbles: true,
      cancelable: true
    });
    this.dispatchEvent(removeEvent);

    if (!removeEvent.defaultPrevented && this.hasAttribute('auto-remove')) {
      this.remove();
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-badge')) {
  customElements.define('ui-badge', UIBadge);
}

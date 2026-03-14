import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-fieldset-gap: 10px;
    --ui-fieldset-radius: 16px;
    --ui-fieldset-bg: var(--ui-color-surface, var(--ui-surface, #ffffff));
    --ui-fieldset-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-fieldset-muted: var(--ui-color-muted, var(--ui-muted, #64748b));
    --ui-fieldset-error: var(--ui-color-danger, var(--ui-error, #dc2626));
    --ui-fieldset-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 68%, transparent);
    --ui-fieldset-border: 1px solid var(--ui-fieldset-border-color);
    --ui-fieldset-shadow: none;
    --ui-fieldset-padding: 14px;
    color-scheme: light dark;
    display: block;
    min-width: 0;
    color: var(--ui-fieldset-color);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .frame {
    min-width: 0;
    margin: 0;
    padding: var(--ui-fieldset-padding);
    display: grid;
    gap: var(--ui-fieldset-gap);
    border: var(--ui-fieldset-border);
    border-radius: var(--ui-fieldset-radius);
    background: var(--ui-fieldset-bg);
    box-shadow: var(--ui-fieldset-shadow);
    box-sizing: border-box;
  }

  .legend-row {
    min-width: 0;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    padding: 0;
  }

  .legend {
    min-width: 0;
    margin: 0;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: 650 13px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    color: inherit;
  }

  .required {
    color: var(--ui-fieldset-error);
    font-size: 12px;
    line-height: 1;
  }

  .actions,
  .footer {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .actions {
    justify-content: flex-end;
  }

  .description,
  .error {
    margin: 0;
    min-width: 0;
    font-size: 12px;
    line-height: 1.45;
    letter-spacing: 0.01em;
  }

  .description {
    color: var(--ui-fieldset-muted);
  }

  .error {
    color: var(--ui-fieldset-error);
    font-weight: 600;
  }

  .body {
    min-width: 0;
    display: grid;
    gap: var(--ui-fieldset-gap);
  }

  .legend-row[hidden],
  .legend[hidden],
  .actions[hidden],
  .description[hidden],
  .error[hidden],
  .footer[hidden] {
    display: none !important;
  }

  :host([orientation="horizontal"]) .body {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    align-items: start;
  }

  :host([variant="surface"]) {
    --ui-fieldset-shadow:
      0 1px 3px rgba(2, 6, 23, 0.05),
      0 12px 26px rgba(2, 6, 23, 0.08);
  }

  :host([variant="outline"]) {
    --ui-fieldset-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, transparent);
  }

  :host([variant="soft"]) {
    --ui-fieldset-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, var(--ui-color-surface, #ffffff));
    --ui-fieldset-border-color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 26%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="contrast"]) {
    --ui-fieldset-bg: #0f172a;
    --ui-fieldset-color: #e2e8f0;
    --ui-fieldset-muted: #93a4bd;
    --ui-fieldset-border-color: #334155;
  }

  :host([tone="success"]) {
    --ui-fieldset-border-color: color-mix(in srgb, var(--ui-color-success, #16a34a) 40%, transparent);
  }

  :host([tone="warning"]) {
    --ui-fieldset-border-color: color-mix(in srgb, var(--ui-color-warning, #d97706) 40%, transparent);
  }

  :host([tone="danger"]),
  :host([invalid]) {
    --ui-fieldset-border-color: color-mix(in srgb, var(--ui-fieldset-error) 42%, transparent);
  }

  :host([density="compact"]) {
    --ui-fieldset-gap: 8px;
    --ui-fieldset-padding: 12px;
  }

  :host([density="comfortable"]) {
    --ui-fieldset-gap: 12px;
    --ui-fieldset-padding: 16px;
  }

  :host([shape="square"]) {
    --ui-fieldset-radius: 4px;
  }

  :host([shape="soft"]) {
    --ui-fieldset-radius: 24px;
  }

  :host([headless]) .frame {
    padding: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
  }

  @media (forced-colors: active) {
    :host {
      --ui-fieldset-bg: Canvas;
      --ui-fieldset-color: CanvasText;
      --ui-fieldset-muted: CanvasText;
      --ui-fieldset-border-color: CanvasText;
      --ui-fieldset-error: CanvasText;
    }

    .frame {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
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

function ensureId(el: HTMLElement, suffix: string): string {
  if (!el.id) el.id = `ui-fieldset-${suffix}-${Math.random().toString(36).slice(2, 9)}`;
  return el.id;
}

function uniqueIds(existing: string[]): string[] {
  return Array.from(new Set(existing.filter(Boolean)));
}

export class UIFieldset extends ElementBase {
  static get observedAttributes(): string[] {
    return [
      'legend',
      'description',
      'error',
      'required',
      'invalid',
      'orientation',
      'variant',
      'tone',
      'density',
      'shape',
      'headless'
    ];
  }

  private _stateSyncQueued = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);
    this._scheduleStateSync();
  }

  disconnectedCallback(): void {
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'legend' || name === 'description' || name === 'error' || name === 'required') {
      if (this.isConnected) this.requestRender();
      return;
    }
    if (name === 'invalid') this._scheduleStateSync();
  }

  protected render(): void {
    const legend = this.getAttribute('legend') || '';
    const description = this.getAttribute('description') || '';
    const error = this.getAttribute('error') || '';
    const required = this.hasAttribute('required');

    this.setContent(`
      <style>${style}</style>
      <fieldset class="frame" part="frame">
        <div class="legend-row">
          <legend class="legend" part="legend">
            <slot name="legend">${legend ? escapeHtml(legend) : ''}</slot>
            <span class="required" ${required ? '' : 'hidden'} aria-hidden="true">*</span>
          </legend>
          <div class="actions" part="actions">
            <slot name="actions"></slot>
          </div>
        </div>
        <p class="description" part="description">
          <slot name="description">${description ? escapeHtml(description) : ''}</slot>
        </p>
        <div class="body" part="body">
          <slot></slot>
        </div>
        <p class="error" part="error">
          <slot name="error">${error ? escapeHtml(error) : ''}</slot>
        </p>
        <div class="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </fieldset>
    `);

    this._updateVisibility();
    this._syncAria();
  }

  private _onSlotChange = (): void => {
    this._updateVisibility();
    this._scheduleStateSync();
  };

  private _scheduleStateSync(): void {
    if (this._stateSyncQueued) return;
    this._stateSyncQueued = true;
    queueMicrotask(() => {
      this._stateSyncQueued = false;
      if (!this.isConnected) return;
      this._syncAria();
    });
  }

  private _updateVisibility(): void {
    const legendSlot = this.root.querySelector('slot[name="legend"]') as HTMLSlotElement | null;
    const descriptionSlot = this.root.querySelector('slot[name="description"]') as HTMLSlotElement | null;
    const actionsSlot = this.root.querySelector('slot[name="actions"]') as HTMLSlotElement | null;
    const errorSlot = this.root.querySelector('slot[name="error"]') as HTMLSlotElement | null;
    const footerSlot = this.root.querySelector('slot[name="footer"]') as HTMLSlotElement | null;

    const hasLegend = !!this.getAttribute('legend') || slotHasMeaningfulContent(legendSlot);
    const hasDescription = !!this.getAttribute('description') || slotHasMeaningfulContent(descriptionSlot);
    const hasActions = slotHasMeaningfulContent(actionsSlot);
    const hasError = !!this.getAttribute('error') || slotHasMeaningfulContent(errorSlot);
    const hasFooter = slotHasMeaningfulContent(footerSlot);

    const legendRow = this.root.querySelector('.legend-row') as HTMLElement | null;
    const legendEl = this.root.querySelector('.legend') as HTMLElement | null;
    const actionsEl = this.root.querySelector('.actions') as HTMLElement | null;
    const descriptionEl = this.root.querySelector('.description') as HTMLElement | null;
    const errorEl = this.root.querySelector('.error') as HTMLElement | null;
    const footerEl = this.root.querySelector('.footer') as HTMLElement | null;

    if (legendRow) legendRow.toggleAttribute('hidden', !hasLegend && !hasActions);
    if (legendEl) legendEl.toggleAttribute('hidden', !hasLegend);
    if (actionsEl) actionsEl.toggleAttribute('hidden', !hasActions);
    if (descriptionEl) descriptionEl.toggleAttribute('hidden', !hasDescription);
    if (errorEl) errorEl.toggleAttribute('hidden', !hasError);
    if (footerEl) footerEl.toggleAttribute('hidden', !hasFooter);
  }

  private _syncAria(): void {
    const fieldset = this.root.querySelector('.frame') as HTMLFieldSetElement | null;
    const legend = this.root.querySelector('.legend') as HTMLElement | null;
    const description = this.root.querySelector('.description') as HTMLElement | null;
    const error = this.root.querySelector('.error') as HTMLElement | null;
    if (!fieldset) return;

    if (legend && !legend.hasAttribute('hidden')) {
      fieldset.setAttribute('aria-labelledby', ensureId(legend, 'legend'));
    } else {
      fieldset.removeAttribute('aria-labelledby');
    }

    const describedBy = uniqueIds([
      description && !description.hasAttribute('hidden') ? ensureId(description, 'description') : '',
      error && !error.hasAttribute('hidden') ? ensureId(error, 'error') : ''
    ]);

    if (describedBy.length) fieldset.setAttribute('aria-describedby', describedBy.join(' '));
    else fieldset.removeAttribute('aria-describedby');

    if (this.hasAttribute('invalid') || (error && !error.hasAttribute('hidden'))) {
      fieldset.setAttribute('aria-invalid', 'true');
    } else {
      fieldset.removeAttribute('aria-invalid');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-fieldset': UIFieldset;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-fieldset')) {
  customElements.define('ui-fieldset', UIFieldset);
}

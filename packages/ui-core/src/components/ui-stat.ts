import { ElementBase } from '../ElementBase';
import './ui-icon';

/*
 * A key figure with its label: the web component behind React's Stat and MetricCard, so apps
 * without React (plain HTML, Vue, Svelte) get the same stat tiles.
 *
 *   ui-stat with label, value, trend, tone and icon attributes; ui-metric-card is the card form.
 *
 * Text comes from attributes or, for rich content, from slots of the same name (label, value,
 * description, meta, trend, icon); anything else in the element goes below.
 */

const TONES: Record<string, string> = {
  neutral: 'var(--ui-color-muted, #475569)',
  brand: 'var(--ui-color-accent-text, var(--ui-color-primary, #2563eb))',
  info: 'var(--ui-color-info-text, var(--ui-color-info, #0e7490))',
  success: 'var(--ui-color-success-text, var(--ui-color-success, #15803d))',
  warning: 'var(--ui-color-warning-text, var(--ui-color-warning, #b45309))',
  danger: 'var(--ui-color-danger-text, var(--ui-color-danger, #c81e1e))'
};

const style = `
  :host {
    --ui-stat-accent: ${TONES.neutral};
    --ui-stat-label-size: 12px;
    --ui-stat-value-size: 24px;
    --ui-stat-meta-size: 12px;
    --ui-stat-icon-size: 16px;
    --ui-stat-gap: 8px;
    --ui-stat-padding: 14px;
    display: block;
    min-inline-size: 0;
    color: var(--ui-color-text, #0f172a);
    font-family: var(--ui-font-family, inherit);
  }
  :host([hidden]) { display: none; }
${Object.entries(TONES)
  .filter(([tone]) => tone !== 'neutral')
  .map(([tone, color]) => `  :host([tone="${tone}"]) { --ui-stat-accent: ${color}; }`)
  .join('\n')}
  :host([size="sm"]) {
    --ui-stat-value-size: 20px;
    --ui-stat-meta-size: 11px;
    --ui-stat-icon-size: 14px;
    --ui-stat-gap: 6px;
    --ui-stat-padding: 12px;
  }
  :host([size="lg"]) {
    --ui-stat-label-size: 13px;
    --ui-stat-value-size: 30px;
    --ui-stat-meta-size: 13px;
    --ui-stat-icon-size: 18px;
    --ui-stat-gap: 10px;
    --ui-stat-padding: 16px;
  }
  .stat {
    display: grid;
    gap: var(--ui-stat-gap);
    min-inline-size: 0;
  }
  :host([variant="card"]) .stat {
    padding: var(--ui-stat-padding);
    border: 1px solid var(--ui-color-border, #dbe4ef);
    border-radius: var(--base-card-radius, calc(var(--ui-radius, 6px) + 2px));
    background: var(--ui-color-surface, #ffffff);
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-inline-size: 0;
  }
  .label {
    min-inline-size: 0;
    color: var(--ui-color-muted, #526175);
    font-size: var(--ui-stat-label-size);
    line-height: 1.35;
  }
  .icon {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: calc(var(--ui-stat-icon-size) + 12px);
    min-block-size: calc(var(--ui-stat-icon-size) + 12px);
    border-radius: 999px;
    color: var(--ui-stat-accent);
    background: color-mix(in srgb, var(--ui-stat-accent) 12%, transparent);
  }
  .value {
    font-size: var(--ui-stat-value-size);
    font-weight: 700;
    line-height: 1.05;
    font-variant-numeric: tabular-nums;
  }
  .description,
  .meta {
    color: var(--ui-color-muted, #526175);
    font-size: var(--ui-stat-meta-size);
    line-height: 1.45;
  }
  .foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
  .trend {
    color: var(--ui-stat-accent);
    font-size: var(--ui-stat-meta-size);
    font-weight: 600;
    line-height: 1.35;
  }
  [hidden] { display: none !important; }
`;

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const SLOTS = ['label', 'value', 'description', 'meta', 'trend', 'icon'] as const;

export class UIStat extends ElementBase {
  static get observedAttributes() {
    return ['label', 'value', 'description', 'meta', 'trend', 'icon', 'tone', 'size', 'variant'];
  }

  private _observer: MutationObserver | null = null;

  connectedCallback() {
    super.connectedCallback();
    // A slot filled or emptied after mount shows or hides its row.
    if (!this._observer && typeof MutationObserver !== 'undefined') {
      this._observer = new MutationObserver(() => this.requestRender());
      this._observer.observe(this, { childList: true, attributes: true, attributeFilter: ['slot'], subtree: false });
    }
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    this._observer = null;
    super.disconnectedCallback();
  }

  protected shouldRenderOnAttributeChange(name: string): boolean {
    // tone, size and variant are CSS only
    return !['tone', 'size', 'variant'].includes(name);
  }

  private _has(name: (typeof SLOTS)[number]): boolean {
    return !!(this.getAttribute(name) || '').trim() || !!this.querySelector(`:scope > [slot="${name}"]`);
  }

  private _text(name: string): string {
    return escapeHtml(this.getAttribute(name) || '');
  }

  protected render(): void {
    const icon = (this.getAttribute('icon') || '').trim();
    const iconMarkup = icon ? `<ui-icon name="${escapeHtml(icon)}" decorative style="--ui-icon-size: var(--ui-stat-icon-size)"></ui-icon>` : '';
    const hasFoot = this._has('meta') || this._has('trend');
    this.setContent(`
      <style>${style}</style>
      <div class="stat" part="base">
        <div class="head" part="head">
          <div class="label" part="label"><slot name="label">${this._text('label')}</slot></div>
          <span class="icon" part="icon" aria-hidden="true" ${this._has('icon') ? '' : 'hidden'}><slot name="icon">${iconMarkup}</slot></span>
        </div>
        <div class="value" part="value"><slot name="value">${this._text('value')}</slot></div>
        <div class="description" part="description" ${this._has('description') ? '' : 'hidden'}><slot name="description">${this._text('description')}</slot></div>
        <div class="foot" part="foot" ${hasFoot ? '' : 'hidden'}>
          <span class="meta" part="meta" ${this._has('meta') ? '' : 'hidden'}><slot name="meta">${this._text('meta')}</slot></span>
          <span class="trend" part="trend" ${this._has('trend') ? '' : 'hidden'}><slot name="trend">${this._text('trend')}</slot></span>
        </div>
        <slot></slot>
      </div>
    `);
  }
}

/** `ui-stat` in a bordered card (React's MetricCard). */
export class UIMetricCard extends UIStat {
  connectedCallback() {
    if (!this.hasAttribute('variant')) this.setAttribute('variant', 'card');
    super.connectedCallback();
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('ui-stat')) customElements.define('ui-stat', UIStat);
  if (!customElements.get('ui-metric-card')) customElements.define('ui-metric-card', UIMetricCard);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-stat': UIStat;
    'ui-metric-card': UIMetricCard;
  }
}

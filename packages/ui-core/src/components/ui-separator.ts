import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-separator-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 80%, transparent);
    --ui-separator-thickness: 1px;
    --ui-separator-gap: 10px;
    --ui-separator-margin-block: 12px;
    --ui-separator-margin-inline: 0px;
    --ui-separator-label-color: var(--ui-color-muted, #64748b);
    --ui-separator-glow: 0 0 0 transparent;
    color-scheme: light dark;
    display: block;
    inline-size: 100%;
    min-inline-size: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    inline-size: 100%;
    min-inline-size: 0;
    margin: var(--ui-separator-margin-block) var(--ui-separator-margin-inline);
  }

  .line {
    inline-size: 100%;
    block-size: var(--ui-separator-thickness);
    border-radius: 999px;
    background: var(--ui-separator-color);
    box-shadow: var(--ui-separator-glow);
  }

  .group {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: var(--ui-separator-gap);
  }

  .group[data-has-label="false"] {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }

  .label {
    font-size: 11px;
    line-height: 1.3;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ui-separator-label-color);
    white-space: nowrap;
  }

  .label[hidden] {
    display: none;
  }

  :host([orientation="vertical"]) {
    display: inline-grid;
    inline-size: auto;
    block-size: 100%;
    min-block-size: 24px;
  }

  :host([orientation="vertical"]) .root {
    inline-size: auto;
    block-size: 100%;
    margin: var(--ui-separator-margin-inline) var(--ui-separator-margin-block);
    display: inline-grid;
    align-items: stretch;
  }

  :host([orientation="vertical"]) .line {
    inline-size: var(--ui-separator-thickness);
    block-size: 100%;
    min-block-size: 24px;
  }

  :host([orientation="vertical"]) .group {
    grid-template-columns: none;
    grid-template-rows: 1fr;
    gap: 0;
  }

  :host([orientation="vertical"]) .label {
    display: none !important;
  }

  :host([inset="sm"]) {
    --ui-separator-margin-inline: 10px;
  }

  :host([inset="md"]) {
    --ui-separator-margin-inline: 18px;
  }

  :host([inset="lg"]) {
    --ui-separator-margin-inline: 28px;
  }

  :host([size="thin"]) {
    --ui-separator-thickness: 1px;
  }

  :host([size="medium"]) {
    --ui-separator-thickness: 2px;
  }

  :host([size="thick"]) {
    --ui-separator-thickness: 3px;
  }

  :host([tone="brand"]) {
    --ui-separator-color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 38%, transparent);
    --ui-separator-label-color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 68%, var(--ui-color-muted, #64748b));
  }

  :host([tone="success"]) {
    --ui-separator-color: color-mix(in srgb, var(--ui-color-success, #16a34a) 40%, transparent);
    --ui-separator-label-color: color-mix(in srgb, var(--ui-color-success, #16a34a) 70%, var(--ui-color-muted, #64748b));
  }

  :host([tone="warning"]) {
    --ui-separator-color: color-mix(in srgb, var(--ui-color-warning, #d97706) 40%, transparent);
    --ui-separator-label-color: color-mix(in srgb, var(--ui-color-warning, #d97706) 70%, var(--ui-color-muted, #64748b));
  }

  :host([tone="danger"]) {
    --ui-separator-color: color-mix(in srgb, var(--ui-color-danger, #dc2626) 40%, transparent);
    --ui-separator-label-color: color-mix(in srgb, var(--ui-color-danger, #dc2626) 70%, var(--ui-color-muted, #64748b));
  }

  :host([variant="dashed"]) .line {
    background: repeating-linear-gradient(
      to right,
      var(--ui-separator-color) 0 9px,
      transparent 9px 16px
    );
  }

  :host([orientation="vertical"][variant="dashed"]) .line {
    background: repeating-linear-gradient(
      to bottom,
      var(--ui-separator-color) 0 9px,
      transparent 9px 16px
    );
  }

  :host([variant="dotted"]) .line {
    background:
      radial-gradient(circle at center, var(--ui-separator-color) 1px, transparent 1.8px)
      center / 8px 100% repeat-x;
  }

  :host([orientation="vertical"][variant="dotted"]) .line {
    background:
      radial-gradient(circle at center, var(--ui-separator-color) 1px, transparent 1.8px)
      center / 100% 8px repeat-y;
  }

  :host([variant="gradient"]) .line {
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--ui-separator-color) 18%,
      var(--ui-separator-color) 82%,
      transparent 100%
    );
  }

  :host([orientation="vertical"][variant="gradient"]) .line {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      var(--ui-separator-color) 18%,
      var(--ui-separator-color) 82%,
      transparent 100%
    );
  }

  :host([variant="glow"]) {
    --ui-separator-glow:
      0 0 0 1px color-mix(in srgb, var(--ui-separator-color) 20%, transparent),
      0 0 18px color-mix(in srgb, var(--ui-separator-color) 24%, transparent);
  }

  :host([headless]) .root {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .line {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-separator-thickness: 2px;
      --ui-separator-color: color-mix(in srgb, var(--ui-separator-color) 88%, CanvasText);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-separator-color: CanvasText;
      --ui-separator-label-color: CanvasText;
      --ui-separator-glow: none;
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


export class UISeparator extends ElementBase {
  static get observedAttributes() {
    return ['orientation', 'headless', 'variant', 'tone', 'size', 'inset', 'label', 'decorative'];
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (this.isConnected) this.requestRender();
  }

  protected override render(): void {
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    const decorative = this.hasAttribute('decorative');
    const label = this.getAttribute('label') || '';
    const hasLabel = orientation === 'horizontal' && (label.length > 0 || !!this.querySelector('[slot="label"]'));
    const role = decorative ? 'presentation' : 'separator';

    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root" role="${role}" ${decorative ? '' : `aria-orientation="${orientation}"`}>
        <div class="group" part="group" data-has-label="${hasLabel}">
          <span class="line line-start" part="line line-start"></span>
          <span class="label" part="label" ${hasLabel ? '' : 'hidden'}>
            <slot name="label">${escapeHtml(label)}</slot>
          </span>
          <span class="line line-end" part="line line-end" ${hasLabel ? '' : 'hidden'}></span>
        </div>
      </div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-separator')) {
  customElements.define('ui-separator', UISeparator);
}

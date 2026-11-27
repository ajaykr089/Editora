import { ElementBase } from '../ElementBase';

/**
 * Body text with the type scale built in.
 *
 *   <ui-text variant="lead">A short introduction.</ui-text>
 *   <ui-text variant="muted" size="sm">Last edited 2 minutes ago</ui-text>
 *   <ui-text inline variant="code">npm install</ui-text>
 *
 * `variant`: body (default) | lead | large | small | muted | caption | code | overline.
 * Also `size` (xs | sm | md | lg | xl), `weight` (regular | medium | semibold | bold), `tone`
 * (default | muted | brand | success | warning | danger), `align` (start | center | end),
 * `inline` (flows inside a line instead of being a block), `truncate` (one line with an
 * ellipsis) and `lines` (clamp to that many lines).
 */
const style = `
  :host {
    --ui-text-size: var(--ui-font-size-md, 0.875rem);
    --ui-text-line-height: 1.6;
    --ui-text-weight: 400;
    --ui-text-color: var(--ui-color-text, #0f172a);
    color-scheme: light dark;
    display: block;
    margin: 0;
    color: var(--ui-text-color);
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
    font-size: var(--ui-text-size);
    font-weight: var(--ui-text-weight);
    line-height: var(--ui-text-line-height);
    overflow-wrap: anywhere;
  }

  :host([hidden]) { display: none; }
  :host([inline]) { display: inline; }

  :host([variant="lead"]) {
    --ui-text-size: 1.125rem;
    --ui-text-line-height: 1.55;
    --ui-text-color: var(--ui-color-text-secondary, var(--ui-color-muted, #475569));
  }
  :host([variant="large"]) { --ui-text-size: 1rem; --ui-text-weight: 600; --ui-text-line-height: 1.5; }
  :host([variant="small"]) { --ui-text-size: var(--ui-font-size-sm, 0.8125rem); --ui-text-weight: 500; --ui-text-line-height: 1.4; }
  :host([variant="muted"]) { --ui-text-size: var(--ui-font-size-sm, 0.8125rem); --ui-text-color: var(--ui-color-muted, #526175); }
  :host([variant="caption"]) { --ui-text-size: 0.75rem; --ui-text-line-height: 1.4; --ui-text-color: var(--ui-color-muted, #526175); }
  :host([variant="overline"]) {
    --ui-text-size: 0.6875rem;
    --ui-text-weight: 600;
    --ui-text-line-height: 1.4;
    --ui-text-color: var(--ui-color-muted, #526175);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  :host([variant="code"]) {
    --ui-text-size: 0.875em;
    --ui-text-line-height: inherit;
    font-family: var(--ui-font-family-code, var(--ui-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace));
    padding: 0.15em 0.35em;
    border-radius: var(--ui-control-radius-1, 4px);
    background: var(--ui-color-fill, color-mix(in srgb, var(--ui-color-text, #0f172a) 7%, transparent));
  }
  :host([variant="code"]:not([inline])) { display: inline-block; }

  :host([size="xs"]) { --ui-text-size: 0.75rem; }
  :host([size="sm"]) { --ui-text-size: var(--ui-font-size-sm, 0.8125rem); }
  :host([size="md"]) { --ui-text-size: var(--ui-font-size-md, 0.875rem); }
  :host([size="lg"]) { --ui-text-size: var(--ui-font-size-lg, 1rem); }
  :host([size="xl"]) { --ui-text-size: 1.125rem; }

  :host([weight="regular"]) { --ui-text-weight: 400; }
  :host([weight="medium"]) { --ui-text-weight: 500; }
  :host([weight="semibold"]) { --ui-text-weight: 600; }
  :host([weight="bold"]) { --ui-text-weight: 700; }

  :host([tone="muted"]) { --ui-text-color: var(--ui-color-muted, #526175); }
  :host([tone="brand"]) { --ui-text-color: var(--ui-color-accent-text, var(--ui-color-primary, #2563eb)); }
  :host([tone="success"]) { --ui-text-color: var(--ui-color-success-text, var(--ui-color-success, #15803d)); }
  :host([tone="warning"]) { --ui-text-color: var(--ui-color-warning-text, var(--ui-color-warning, #b45309)); }
  :host([tone="danger"]) { --ui-text-color: var(--ui-color-danger-text, var(--ui-color-danger, #dc2626)); }

  :host([align="center"]) { text-align: center; }
  :host([align="end"]) { text-align: end; }

  :host([truncate]) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :host([lines]) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--ui-text-lines, 2);
    overflow: hidden;
  }

  @media (forced-colors: active) {
    :host { --ui-text-color: CanvasText; }
    :host([variant="code"]) { border: 1px solid CanvasText; }
  }
`;

export class UIText extends ElementBase {
  static get observedAttributes() {
    return ['lines'];
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    this.syncLines();
    return false;
  }

  override connectedCallback(): void {
    this.syncLines();
    super.connectedCallback();
  }

  private syncLines(): void {
    const lines = Number.parseInt(this.getAttribute('lines') || '', 10);
    if (Number.isFinite(lines) && lines > 0) this.style.setProperty('--ui-text-lines', String(lines));
    else this.style.removeProperty('--ui-text-lines');
  }

  protected override render(): void {
    this.setContent(`<style>${style}</style><slot></slot>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-text')) {
  customElements.define('ui-text', UIText);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-text': UIText;
  }
}

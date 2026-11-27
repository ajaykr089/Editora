import { ElementBase } from '../ElementBase';

/**
 * A heading with the type scale built in.
 *
 *   <ui-heading level="1">Billing</ui-heading>
 *   <ui-heading level="3" size="lg" tone="muted">Invoices</ui-heading>
 *
 * The host is the heading (`role="heading"` + `aria-level`), so screen-reader heading navigation
 * finds it. `level` (1-6, default 2) sets the outline level and the default size; `size`
 * (xs | sm | md | lg | xl | 2xl | 3xl | 4xl) changes only the look. Also `weight` (regular |
 * medium | semibold | bold), `tone` (default | muted | brand), `align` (start | center | end),
 * `truncate` (one line with an ellipsis), `balance` (balanced line breaks).
 */
const style = `
  :host {
    --ui-heading-size: 1.5rem;
    --ui-heading-line-height: 1.25;
    --ui-heading-weight: 650;
    --ui-heading-tracking: -0.015em;
    --ui-heading-color: var(--ui-color-text-strong, var(--ui-color-text, #0f172a));
    color-scheme: light dark;
    display: block;
    margin: 0;
    color: var(--ui-heading-color);
    font-family: var(--ui-font-family-heading, var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif));
    font-size: var(--ui-heading-size);
    font-weight: var(--ui-heading-weight);
    line-height: var(--ui-heading-line-height);
    letter-spacing: var(--ui-heading-tracking);
    overflow-wrap: anywhere;
  }

  :host([hidden]) { display: none; }

  :host([data-size="xs"]) { --ui-heading-size: 0.875rem; --ui-heading-line-height: 1.4; --ui-heading-tracking: 0; }
  :host([data-size="sm"]) { --ui-heading-size: 1rem; --ui-heading-line-height: 1.4; --ui-heading-tracking: -0.005em; }
  :host([data-size="md"]) { --ui-heading-size: 1.125rem; --ui-heading-line-height: 1.35; --ui-heading-tracking: -0.01em; }
  :host([data-size="lg"]) { --ui-heading-size: 1.25rem; --ui-heading-line-height: 1.3; }
  :host([data-size="xl"]) { --ui-heading-size: 1.5rem; --ui-heading-line-height: 1.25; }
  :host([data-size="2xl"]) { --ui-heading-size: 1.875rem; --ui-heading-line-height: 1.2; --ui-heading-tracking: -0.02em; }
  :host([data-size="3xl"]) { --ui-heading-size: 2.25rem; --ui-heading-line-height: 1.15; --ui-heading-tracking: -0.025em; }
  :host([data-size="4xl"]) { --ui-heading-size: 3rem; --ui-heading-line-height: 1.08; --ui-heading-tracking: -0.03em; --ui-heading-weight: 750; }

  :host([weight="regular"]) { --ui-heading-weight: 400; }
  :host([weight="medium"]) { --ui-heading-weight: 500; }
  :host([weight="semibold"]) { --ui-heading-weight: 600; }
  :host([weight="bold"]) { --ui-heading-weight: 700; }

  :host([tone="muted"]) { --ui-heading-color: var(--ui-color-muted, #526175); }
  :host([tone="brand"]) { --ui-heading-color: var(--ui-color-accent-text, var(--ui-color-primary, #2563eb)); }

  :host([align="center"]) { text-align: center; }
  :host([align="end"]) { text-align: end; }
  :host([balance]) { text-wrap: balance; }

  :host([truncate]) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @media (forced-colors: active) {
    :host { --ui-heading-color: CanvasText; }
  }
`;

const SIZES = new Set(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']);
const SIZE_FOR_LEVEL: Record<number, string> = { 1: '3xl', 2: '2xl', 3: 'xl', 4: 'lg', 5: 'md', 6: 'sm' };

export function headingLevel(value: string | null): number {
  const level = Number.parseInt(value || '', 10);
  return Number.isFinite(level) && level >= 1 && level <= 6 ? level : 2;
}

export class UIHeading extends ElementBase {
  static get observedAttributes() {
    return ['level', 'size'];
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    this.syncSemantics();
    return false;
  }

  override connectedCallback(): void {
    this.syncSemantics();
    super.connectedCallback();
  }

  private syncSemantics(): void {
    const level = headingLevel(this.getAttribute('level'));
    const size = (this.getAttribute('size') || '').trim();
    this.setAttribute('role', 'heading');
    this.setAttribute('aria-level', String(level));
    this.setAttribute('data-size', SIZES.has(size) ? size : SIZE_FOR_LEVEL[level]);
  }

  protected override render(): void {
    this.setContent(`<style>${style}</style><slot></slot>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-heading')) {
  customElements.define('ui-heading', UIHeading);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-heading': UIHeading;
  }
}

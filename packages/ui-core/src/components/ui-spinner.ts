import { ElementBase } from '../ElementBase';
import { escapeHtml } from '../primitives/escape-html';

/**
 * A loading indicator.
 *
 * By default it is a polite status: assistive technology hears its label ("Loading" unless `label`
 * is set) once, when it appears. Set `decorative` when the spinner sits inside something that
 * already says it is busy (a button with `loading`, a region with `aria-busy`), so it is not
 * announced twice.
 *
 * Attributes: `size` (xs | sm | md | lg | xl, or a CSS length), `tone` (current | brand | neutral |
 * success | warning | danger), `variant` (ring | dots | bars), `label`, `decorative`, `speed`
 * (slow | normal | fast).
 */
const style = `
  :host {
    --ui-spinner-size: 16px;
    --ui-spinner-thickness: max(1.5px, calc(var(--ui-spinner-size) / 8));
    --ui-spinner-color: currentColor;
    --ui-spinner-track: color-mix(in srgb, var(--ui-spinner-color) 18%, transparent);
    --ui-spinner-duration: 0.75s;
    color-scheme: light dark;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    inline-size: var(--ui-spinner-size);
    block-size: var(--ui-spinner-size);
    vertical-align: middle;
    line-height: 0;
  }

  :host([hidden]) { display: none; }

  :host([size="xs"]) { --ui-spinner-size: 12px; }
  :host([size="sm"]) { --ui-spinner-size: 14px; }
  :host([size="md"]) { --ui-spinner-size: 16px; }
  :host([size="lg"]) { --ui-spinner-size: 24px; }
  :host([size="xl"]) { --ui-spinner-size: 32px; }

  :host([tone="brand"]) { --ui-spinner-color: var(--ui-color-primary, #2563eb); }
  :host([tone="neutral"]) { --ui-spinner-color: var(--ui-color-muted, #64748b); }
  :host([tone="success"]) { --ui-spinner-color: var(--ui-color-success, #15803d); }
  :host([tone="warning"]) { --ui-spinner-color: var(--ui-color-warning, #b45309); }
  :host([tone="danger"]) { --ui-spinner-color: var(--ui-color-danger, #dc2626); }

  :host([speed="slow"]) { --ui-spinner-duration: 1.2s; }
  :host([speed="fast"]) { --ui-spinner-duration: 0.5s; }

  .spinner {
    position: relative;
    display: block;
    inline-size: 100%;
    block-size: 100%;
    box-sizing: border-box;
  }

  .ring {
    border-radius: 999px;
    border: var(--ui-spinner-thickness) solid var(--ui-spinner-track);
    border-block-start-color: var(--ui-spinner-color);
    animation: ui-spinner-rotate var(--ui-spinner-duration) linear infinite;
  }

  .dots,
  .bars {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dots i,
  .bars i {
    display: block;
    background: var(--ui-spinner-color);
    animation: ui-spinner-pulse calc(var(--ui-spinner-duration) * 1.6) ease-in-out infinite;
  }

  .dots i {
    inline-size: 26%;
    block-size: 26%;
    border-radius: 999px;
  }

  .bars i {
    inline-size: 18%;
    block-size: 100%;
    border-radius: 1px;
    transform-origin: center;
    animation-name: ui-spinner-bar;
  }

  .dots i:nth-child(2), .bars i:nth-child(2) { animation-delay: calc(var(--ui-spinner-duration) * 0.2); }
  .dots i:nth-child(3), .bars i:nth-child(3) { animation-delay: calc(var(--ui-spinner-duration) * 0.4); }

  .label {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes ui-spinner-rotate {
    to { transform: rotate(360deg); }
  }

  @keyframes ui-spinner-pulse {
    0%, 80%, 100% { opacity: 0.25; transform: scale(0.75); }
    40% { opacity: 1; transform: scale(1); }
  }

  @keyframes ui-spinner-bar {
    0%, 80%, 100% { opacity: 0.35; transform: scaleY(0.45); }
    40% { opacity: 1; transform: scaleY(1); }
  }

  /* Without motion the spinner still has to read as "busy": rotation becomes a slow fade. */
  @media (prefers-reduced-motion: reduce) {
    .ring {
      animation: ui-spinner-breathe 1.6s ease-in-out infinite;
      border-color: var(--ui-spinner-color);
      border-inline-end-color: var(--ui-spinner-track);
      border-block-end-color: var(--ui-spinner-track);
    }
    .dots i, .bars i {
      animation: ui-spinner-breathe 1.6s ease-in-out infinite;
      transform: none;
    }
  }

  @keyframes ui-spinner-breathe {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
  }

  @media (forced-colors: active) {
    :host { --ui-spinner-color: CanvasText; --ui-spinner-track: GrayText; }
  }
`;

const NAMED_SIZES = new Set(['xs', 'sm', 'md', 'lg', 'xl']);

export class UISpinner extends ElementBase {
  static get observedAttributes() {
    return ['size', 'variant', 'label', 'decorative'];
  }

  protected override shouldRenderOnAttributeChange(name: string): boolean {
    if (name === 'size') {
      this.syncSize();
      return false;
    }
    return true;
  }

  override connectedCallback(): void {
    this.syncSize();
    super.connectedCallback();
  }

  private syncSize(): void {
    const size = (this.getAttribute('size') || '').trim();
    if (size && !NAMED_SIZES.has(size)) {
      const value = /^\d+(\.\d+)?$/.test(size) ? `${size}px` : size;
      this.style.setProperty('--ui-spinner-size', value);
    } else {
      this.style.removeProperty('--ui-spinner-size');
    }
  }

  protected override render(): void {
    const variant = this.getAttribute('variant');
    const decorative = this.hasAttribute('decorative');
    const label = (this.getAttribute('label') || '').trim() || 'Loading';

    // The host carries the role so a parent's aria-describedby / querySelector('[role=status]')
    // finds it; the label is real text so it is read in every screen reader (aria-label on a
    // status is ignored by some).
    if (decorative) {
      this.setAttribute('aria-hidden', 'true');
      this.removeAttribute('role');
    } else {
      if (this.getAttribute('aria-hidden') === 'true') this.removeAttribute('aria-hidden');
      if (!this.hasAttribute('role')) this.setAttribute('role', 'status');
    }

    const shape = variant === 'dots' || variant === 'bars'
      ? `<span class="spinner ${variant}" part="spinner"><i></i><i></i><i></i></span>`
      : '<span class="spinner ring" part="spinner"></span>';

    this.setContent(`
      <style>${style}</style>
      ${shape}
      ${decorative ? '' : `<span class="label" part="label">${escapeHtml(label)}</span>`}
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-spinner')) {
  customElements.define('ui-spinner', UISpinner);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-spinner': UISpinner;
  }
}

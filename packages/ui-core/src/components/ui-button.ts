import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-padding: 8px 12px;
    --ui-min-height: 36px;    /* customizable min-height */
    --ui-width: auto;        /* optional fixed width (use with care) */
    display: inline-block;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial;
  }

  :host([block]) { display: block; width: 100%; }

  button {
    position: relative;
    padding: var(--ui-padding);
    border-radius: var(--ui-radius, 6px);
    background: var(--ui-primary, #2563eb);
    color: var(--ui-foreground, white);
    border: none;
    cursor: pointer;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    min-height: var(--ui-min-height, 36px);
    width: var(--ui-width, auto);
    box-sizing: border-box;
    transition: transform 160ms cubic-bezier(.2,.9,.2,1),
                box-shadow 160ms cubic-bezier(.2,.9,.2,1),
                background-color 160ms linear;
    will-change: transform, box-shadow;
  }

  button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
  }

  /* Hover / active — only apply transform/box-shadow globally; background-color changes are variant-scoped */
  :host([data-animation]) button:not([disabled]):hover {
    transform: translateY(-2px);
    box-shadow: var(--ui-shadow-sm);
  }
  :host([data-animation]) button:not([disabled]):active {
    transform: translateY(0) scale(0.995);
    box-shadow: none;
  }

  /* Variant-specific hover backgrounds (prevent disappearance for ghost/secondary/headless) */
  :host([data-animation][variant="primary"]) button:not([disabled]):hover {
    background-color: var(--ui-primary-hover, var(--ui-primary));
    color: var(--ui-foreground, white);
  }
  :host([data-animation][variant="danger"]) button:not([disabled]):hover {
    background-color: #b91c1c;
    color: white;
  }

  /* Subtle elevation for "elevated" variants when animation is enabled */
  :host([data-animation][variant="primary"]) button { box-shadow: none; }
  :host([data-animation][variant="primary"]) button:not([disabled]):hover { box-shadow: var(--ui-shadow-md); }

  /* Variants */
  button.btn--primary { background: var(--ui-primary, #2563eb); color: var(--ui-foreground, white); }
  /* secondary border is configurable via --ui-border (fallback keeps previous look) */
  button.btn--secondary { background: transparent; color: var(--ui-primary, #2563eb); border: var(--ui-border, 1px solid rgba(0,0,0,0.08)); }
  button.btn--ghost { background: transparent; color: var(--ui-primary, #2563eb); box-shadow: none; border: none; }
  button.btn--danger { background: #dc2626; color: white; }

  /* theme variants */
  :host([theme="dark"]) { --ui-primary: #1e40af; --ui-primary-hover: #1c3aa0; --ui-foreground: #ffffff; }
  :host([theme="brand"]) { --ui-primary: #7c3aed; --ui-primary-hover: #6d28d9; --ui-foreground: #ffffff; }

  /* Sizes */
  :host([size="sm"]) button { padding: 4px 8px; font-size: 12px; min-height: 28px; }
  :host([size="lg"]) button { padding: 10px 16px; font-size: 16px; min-height: 44px; }

  /* Headless: no styles applied by host */
  :host([headless]) button { all: unset; display: inline-flex; align-items: center; gap: 8px; }

  /* Icon */
  .icon { display: inline-flex; width: 16px; height: 16px; align-items: center; justify-content: center; }

  /* Loading */
  .spinner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.18);
    border-top-color: rgba(255,255,255,0.95);
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Animation variations */
  :host([data-animation="scale"]) button:not([disabled]):hover {
    transform-origin: center;
    transform: translate3d(0, -2px, 0) scale(1.02);
    z-index: 1;
    backface-visibility: hidden;
  }
  :host([data-animation="none"]) button:not([disabled]){ transition: none; }
  :host([data-animation="pulse"]) button:not([disabled]):hover{ animation: pulse 900ms infinite; }
  @keyframes pulse { 0%{ transform: translateY(0); }50%{ transform: translateY(-2px);}100%{ transform: translateY(0);} }

  /* Ripple on active (simple pseudo-element) */
  button::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 240ms ease, transform 360ms ease;
    transform: scale(0.8);
    background: rgba(255,255,255,0.06);
  }
  button:active::after { opacity: 1; transform: scale(1); transition: opacity 120ms ease; }

  button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`;
export class UIButton extends ElementBase {
  static get observedAttributes() {
    return ['disabled', 'variant', 'size', 'headless', 'loading', 'icon', 'block', 'animation', 'theme'];
  }

  constructor() {
    super();
  }

  protected render() {
    const disabled = this.hasAttribute('disabled');
    const headless = this.hasAttribute('headless');
    const loading = this.hasAttribute('loading');
    const variant = (this.getAttribute('variant') || 'primary') as string;
    const size = (this.getAttribute('size') || 'md') as string;
    const icon = this.getAttribute('icon');
    const block = this.hasAttribute('block');

      const animation = this.getAttribute('animation');
    const btnClass = `btn--${variant}`;
    const sizeAttr = size;

    const innerDisabled = disabled || loading ? 'disabled' : '';
    const spinnerHtml = loading ? `<span class="spinner" aria-hidden="true"></span>` : '';
    const iconHtml = icon ? `<ui-icon name="${icon}" class="icon" aria-hidden="true"></ui-icon>` : '';

    if (animation) this.setAttribute('data-animation', animation); else this.removeAttribute('data-animation');
    this.setAttribute('data-variant', variant);
    if (block) this.setAttribute('data-block', 'true'); else this.removeAttribute('data-block');

    this.setContent(`
      ${headless ? '' : `<style>${style}</style>`}
      <button class="${btnClass}" ${innerDisabled} part="button" aria-busy="${loading ? 'true' : 'false'}" data-size="${sizeAttr}">
        ${loading ? spinnerHtml : iconHtml}
        <slot></slot>
      </button>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-button')) {
  customElements.define('ui-button', UIButton);
}

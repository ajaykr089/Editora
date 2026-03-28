const style = `
  :host {
    display: inline-flex;
    vertical-align: middle;
    color: inherit;
    min-inline-size: 0;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: inherit;
    min-inline-size: 0;
    color: inherit;
    font: inherit;
    text-decoration: inherit;
    text-underline-offset: inherit;
  }

  a[aria-disabled="true"] {
    pointer-events: none;
    cursor: default;
    opacity: 0.6;
  }
`;

export class UIAnchor extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['href', 'target', 'rel', 'download', 'hreflang', 'referrerpolicy', 'ping', 'type', 'aria-label', 'title'];
  }

  private readonly anchorEl: HTMLAnchorElement;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${style}</style>
      <a part="anchor">
        <slot></slot>
      </a>
    `;
    this.anchorEl = root.querySelector('a') as HTMLAnchorElement;
  }

  connectedCallback(): void {
    this.syncAttributes();
  }

  attributeChangedCallback(): void {
    this.syncAttributes();
  }

  private syncAttributes(): void {
    const href = this.getAttribute('href');

    this.syncAttribute('href');
    this.syncAttribute('target');
    this.syncAttribute('rel');
    this.syncAttribute('download');
    this.syncAttribute('hreflang');
    this.syncAttribute('referrerpolicy');
    this.syncAttribute('ping');
    this.syncAttribute('type');
    this.syncAttribute('aria-label');
    this.syncAttribute('title');

    if (href) {
      this.anchorEl.removeAttribute('aria-disabled');
    } else {
      this.anchorEl.removeAttribute('href');
      this.anchorEl.setAttribute('aria-disabled', 'true');
    }
  }

  private syncAttribute(name: string): void {
    const value = this.getAttribute(name);
    if (value == null) {
      this.anchorEl.removeAttribute(name);
      return;
    }
    this.anchorEl.setAttribute(name, value);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-anchor')) {
  customElements.define('ui-anchor', UIAnchor);
}

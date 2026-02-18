export abstract class ElementBase extends HTMLElement {
  protected root: ShadowRoot;
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  protected setContent(html: string) {
    this.root.innerHTML = html;
  }

  protected abstract render(): void;
}

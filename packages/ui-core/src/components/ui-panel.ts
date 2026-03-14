import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    min-inline-size: 0;
    min-block-size: 0;
    box-sizing: border-box;
    position: relative;
  }

  .panel {
    inline-size: 100%;
    block-size: 100%;
    min-inline-size: 0;
    min-block-size: 0;
    box-sizing: border-box;
  }
`;

export class UIPanel extends ElementBase {
  static get observedAttributes() {
    return ['collapsed'];
  }

  collapse(): void {
    this.setAttribute('collapsed', '');
    (this.closest('ui-panel-group') as any)?.collapsePanel?.(this);
  }

  expand(): void {
    this.removeAttribute('collapsed');
    (this.closest('ui-panel-group') as any)?.expandPanel?.(this);
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="panel" part="panel">
        <slot></slot>
      </div>
    `);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-panel': UIPanel;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-panel')) {
  customElements.define('ui-panel', UIPanel);
}

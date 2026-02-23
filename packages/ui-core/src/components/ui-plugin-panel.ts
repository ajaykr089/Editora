import { ElementBase } from '../ElementBase';

const style = `
  :host {
    position: fixed;
    display: block;
    z-index: 1120;
    pointer-events: none;
    color-scheme: light dark;
    --ui-plugin-panel-width: min(340px, 92vw);
    --ui-plugin-panel-height: min(280px, 44vh);
    --ui-plugin-panel-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 94%, transparent);
    --ui-plugin-panel-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-plugin-panel-radius: 14px;
    --ui-plugin-panel-shadow: 0 18px 48px rgba(15, 23, 42, 0.16);
    --ui-plugin-panel-color: var(--ui-color-text, #0f172a);
  }

  .panel {
    pointer-events: auto;
    position: fixed;
    box-sizing: border-box;
    background: var(--ui-plugin-panel-bg);
    border: var(--ui-plugin-panel-border);
    border-radius: var(--ui-plugin-panel-radius);
    box-shadow: var(--ui-plugin-panel-shadow);
    color: var(--ui-plugin-panel-color);
    backdrop-filter: saturate(1.1) blur(10px);
    opacity: 0;
    transform: translate3d(0, 6px, 0) scale(0.985);
    transition: opacity 180ms ease, transform 180ms ease;
    display: grid;
  }

  :host([open]) .panel {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }

  :host([position="right"]) .panel,
  :host(:not([position])) .panel {
    top: 16px;
    right: 16px;
    width: var(--ui-plugin-panel-width);
    max-height: calc(100vh - 32px);
  }

  :host([position="left"]) .panel {
    top: 16px;
    left: 16px;
    width: var(--ui-plugin-panel-width);
    max-height: calc(100vh - 32px);
  }

  :host([position="bottom"]) .panel {
    left: 50%;
    bottom: 16px;
    transform: translate3d(-50%, 8px, 0) scale(0.985);
    width: min(760px, calc(100vw - 32px));
    max-height: var(--ui-plugin-panel-height);
  }

  :host([open][position="bottom"]) .panel {
    transform: translate3d(-50%, 0, 0) scale(1);
  }

  :host(:not([open])) .panel {
    pointer-events: none;
    opacity: 0;
  }

  :host([headless]) .panel {
    display: none !important;
  }

  @media (prefers-contrast: more) {
    .panel {
      border-width: 2px;
      box-shadow: none;
      backdrop-filter: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-plugin-panel-bg: Canvas;
      --ui-plugin-panel-border: 1px solid CanvasText;
      --ui-plugin-panel-shadow: none;
      --ui-plugin-panel-color: CanvasText;
    }

    .panel {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
      backdrop-filter: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .panel {
      transition: none !important;
    }
  }
`;

export class UIPluginPanel extends ElementBase {
  static get observedAttributes() {
    return ['open', 'position', 'headless'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (this.isConnected) this.requestRender();
    if (name === 'open' && oldValue !== newValue) {
      this.dispatchEvent(new CustomEvent(newValue != null ? 'open' : 'close', { bubbles: true }));
    }
  }

  protected render() {
    this.setContent(`
      <style>${style}</style>
      <aside class="panel" part="panel" role="complementary" aria-label="Plugin panel">
        <slot></slot>
      </aside>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-plugin-panel')) {
  customElements.define('ui-plugin-panel', UIPluginPanel);
}

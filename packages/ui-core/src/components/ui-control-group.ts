import { ElementBase } from '../ElementBase';

const style = `
  :host {
    --ui-control-group-gap: 10px;
    --ui-control-group-row-gap: 10px;
    --ui-control-group-padding: 0;
    --ui-control-group-radius: 0;
    --ui-control-group-bg: transparent;
    --ui-control-group-border: 0;
    color-scheme: light dark;
    display: block;
    min-width: 0;
  }

  .group {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ui-control-group-gap);
    box-sizing: border-box;
    padding: var(--ui-control-group-padding);
    border: var(--ui-control-group-border);
    border-radius: var(--ui-control-group-radius);
    background: var(--ui-control-group-bg);
  }

  :host([orientation="horizontal"]) .group {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    column-gap: var(--ui-control-group-gap);
    row-gap: var(--ui-control-group-row-gap);
  }

  :host([variant="soft"]) {
    --ui-control-group-padding: 10px;
    --ui-control-group-radius: 14px;
    --ui-control-group-bg: color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, transparent);
    --ui-control-group-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 52%, transparent);
  }

  :host([variant="surface"]) {
    --ui-control-group-padding: 10px;
    --ui-control-group-radius: 14px;
    --ui-control-group-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 97%, transparent);
    --ui-control-group-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 58%, transparent);
  }

  :host([density="compact"]) {
    --ui-control-group-gap: 8px;
    --ui-control-group-row-gap: 8px;
  }

  :host([density="comfortable"]) {
    --ui-control-group-gap: 12px;
    --ui-control-group-row-gap: 12px;
  }

  :host([hidden]),
  .group[hidden] {
    display: none !important;
  }

  @media (forced-colors: active) {
    :host {
      --ui-control-group-bg: Canvas;
      --ui-control-group-border: 1px solid CanvasText;
    }

    .group {
      forced-color-adjust: none;
      background: var(--ui-control-group-bg);
      border-color: CanvasText;
    }
  }
`;

export class UIControlGroup extends ElementBase {
  static get observedAttributes(): string[] {
    return ['label', 'aria-label', 'aria-labelledby', 'aria-describedby', 'orientation', 'variant', 'density', 'hidden'];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._syncA11y();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'label' || name.startsWith('aria-')) {
      this._syncA11y();
    }
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="group" part="group" role="group">
        <slot></slot>
      </div>
    `);
    this._syncA11y();
  }

  private _syncA11y(): void {
    const group = this.root.querySelector('.group') as HTMLElement | null;
    if (!group) return;
    const label = this.getAttribute('label') || this.getAttribute('aria-label');
    if (label) group.setAttribute('aria-label', label);
    else group.removeAttribute('aria-label');

    const labelledBy = this.getAttribute('aria-labelledby');
    if (labelledBy) group.setAttribute('aria-labelledby', labelledBy);
    else group.removeAttribute('aria-labelledby');

    const describedBy = this.getAttribute('aria-describedby');
    if (describedBy) group.setAttribute('aria-describedby', describedBy);
    else group.removeAttribute('aria-describedby');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-control-group': UIControlGroup;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-control-group')) {
  customElements.define('ui-control-group', UIControlGroup);
}

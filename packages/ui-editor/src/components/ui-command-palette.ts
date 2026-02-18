import { ElementBase } from '@editora/ui-core';

const style = `
  .palette { width: 520px; max-width: 90vw; background: white; border-radius: 8px; box-shadow: 0 12px 40px rgba(0,0,0,0.12); padding: 8px; }
  .list { max-height: 300px; overflow: auto; }
  .item { padding: 8px; cursor: pointer; }
`;

export class UICommandPalette extends ElementBase {
  static get observedAttributes() { return ['open']; }
  constructor() { super(); }

  open() { this.setAttribute('open',''); }
  close() { this.removeAttribute('open'); }

  protected render() {
    const open = this.hasAttribute('open');
    if (!open) { this.setContent(''); return; }
    const html = `<div class="palette" role="dialog" aria-modal="true">
      <input part="search" placeholder="Type a command..." />
      <div class="list"><slot></slot></div>
    </div>`;
    this.setContent(`<style>${style}</style>${html}`);
    // wire clicks from slotted items
    const items = Array.from(this.querySelectorAll('[slot="command"]'));
    items.forEach((it, i) => {
      (it as HTMLElement).addEventListener('click', () => this.dispatchEvent(new CustomEvent('select', { detail: { index: i } })));
    });
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-command-palette')) {
  customElements.define('ui-command-palette', UICommandPalette);
}

import { ElementBase } from '../ElementBase';

const style = `
  :host { display: block; }
  .nav { display: flex; gap: 8px; margin-bottom: 8px; }
  .tab { padding: 6px 8px; cursor: pointer; border-radius: 4px; }
  .tab[aria-selected="true"] { background: var(--ui-primary, #2563eb); color: var(--ui-foreground, #fff); }
`;

export class UITabs extends ElementBase {
  static get observedAttributes() { return ['selected']; }

  constructor() { super(); }

  protected render() {
    const selected = this.getAttribute('selected') || '0';
    const tabs = Array.from(this.querySelectorAll('[slot="tab"]'));
    const panels = Array.from(this.querySelectorAll('[slot="panel"]'));
    const nav = tabs.map((t, i) => `<div class="tab" role="tab" data-index="${i}" aria-selected="${String(i === Number(selected))}">${(t as HTMLElement).innerHTML}</div>`).join('');
    this.setContent(`<style>${style}</style><div class="nav" role="tablist">${nav}</div><div class="panels"></div>`);
    const navEl = this.root.querySelector('.nav') as HTMLElement;
    const panelsEl = this.root.querySelector('.panels') as HTMLElement;
    panelsEl.innerHTML = '';
    panels.forEach((p, i) => {
      const node = (p as HTMLElement).cloneNode(true) as HTMLElement;
      node.style.display = i === Number(selected) ? 'block' : 'none';
      panelsEl.appendChild(node);
    });
    navEl.querySelectorAll('.tab').forEach((el) => el.addEventListener('click', (e) => {
      const idx = Number((e.currentTarget as HTMLElement).getAttribute('data-index'));
      this.setAttribute('selected', String(idx));
      this.dispatchEvent(new CustomEvent('change', { detail: { selected: idx } }));
      this.render();
    }));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-tabs')) {
  customElements.define('ui-tabs', UITabs);
}

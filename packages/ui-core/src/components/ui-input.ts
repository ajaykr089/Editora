import { ElementBase } from '../ElementBase';

const style = `
  :host { display: inline-block; }
  input {
    padding: 8px 10px;
    border-radius: var(--ui-radius, 6px);
    border: 1px solid rgba(0,0,0,0.12);
    font-size: 14px;
    font-family: inherit;
  }
`;

export class UIInput extends ElementBase {
  static get observedAttributes() { return ['value','placeholder','disabled']; }
  private _input!: HTMLInputElement;

  constructor() { super(); }

  get value() { return this.getAttribute('value') || ''; }
  set value(v: string) { this.setAttribute('value', v); }

  protected render() {
    const headless = this.hasAttribute('headless');
    const value = this.getAttribute('value') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const disabled = this.hasAttribute('disabled');
    this.setContent(`${headless ? '' : `<style>${style}</style>`}<input part="input" value="${value}" placeholder="${placeholder}" ${disabled ? 'disabled' : ''} />`);
    this._input = this.root.querySelector('input') as HTMLInputElement;
    if (this._input) {
      this._input.addEventListener('input', (e) => {
        this.setAttribute('value', (e.target as HTMLInputElement).value);
        this.dispatchEvent(new CustomEvent('input', { detail: { value: (e.target as HTMLInputElement).value }, bubbles: true }));
      });
      this._input.addEventListener('change', (e) => {
        this.dispatchEvent(new CustomEvent('change', { detail: { value: (e.target as HTMLInputElement).value }, bubbles: true }));
      });
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-input')) {
  customElements.define('ui-input', UIInput);
}

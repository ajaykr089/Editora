import { ElementBase } from '../ElementBase';
import { createFocusScope, type FocusScopeHandle } from '../primitives/focus-scope';

const style = `
  :host {
    display: contents;
    color-scheme: light dark;
  }
`;

function parseAutoFocus(value: string | null): 'first' | 'selected' | 'container' | 'none' {
  if (value === 'selected' || value === 'container' || value === 'none') return value;
  return 'first';
}

function isTruthy(value: string | null): boolean {
  if (value == null) return false;
  const normalized = value.toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

export class UIFocusScope extends ElementBase {
  static get observedAttributes() {
    return ['active', 'trapped', 'loop', 'restore-focus', 'auto-focus', 'inert-others', 'headless'];
  }

  private _scope: FocusScopeHandle | null = null;
  private _onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    if (!this.hasAttribute('active')) return;
    const active = document.activeElement;
    if (active && !this.contains(active)) return;
    this.dispatchEvent(
      new CustomEvent('escape', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true
      })
    );
  };

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this._onKeyDown, true);
    this._syncScope();
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this._onKeyDown, true);
    this._destroyScope();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this._syncScope();
  }

  get initialFocus(): HTMLElement | null {
    return this.querySelector('[data-ui-initial-focus], [autofocus]') as HTMLElement | null;
  }

  get finalFocus(): HTMLElement | null {
    return this.querySelector('[data-ui-final-focus]') as HTMLElement | null;
  }

  activate(): void {
    this.setAttribute('active', '');
  }

  deactivate(): void {
    this.removeAttribute('active');
  }

  focusFirst(): void {
    this._scope?.focusFirst();
  }

  focusInitial(): void {
    this._scope?.focusInitial();
  }

  private _destroyScope(): void {
    this._scope?.destroy();
    this._scope = null;
  }

  private _syncScope(): void {
    if (!this.isConnected) return;
    if (this.hasAttribute('headless') || !this.hasAttribute('active')) {
      this._destroyScope();
      return;
    }

    this._destroyScope();
    this._scope = createFocusScope({
      node: this,
      trapped: !this.hasAttribute('trapped') || isTruthy(this.getAttribute('trapped')),
      loop: !this.hasAttribute('loop') || isTruthy(this.getAttribute('loop')),
      restoreFocus: !this.hasAttribute('restore-focus') || isTruthy(this.getAttribute('restore-focus')),
      autoFocus: parseAutoFocus(this.getAttribute('auto-focus')),
      initialFocus: this.initialFocus,
      finalFocus: this.finalFocus,
      inertOthers: isTruthy(this.getAttribute('inert-others'))
    });
    this.dispatchEvent(new CustomEvent('focus-scope-mount', { bubbles: true, composed: true }));
  }

  protected render(): void {
    this.setContent(`<style>${style}</style><slot></slot>`);
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-focus-scope')) {
  customElements.define('ui-focus-scope', UIFocusScope);
}

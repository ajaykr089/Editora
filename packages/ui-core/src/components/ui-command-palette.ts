import { ElementBase } from '../ElementBase';
import OverlayManager from '../overlayManager';
import './ui-command';
import type { UICommand, UICommandSelectDetail } from './ui-command';

const style = `
  :host {
    position: fixed;
    inset: 0;
    z-index: var(--ui-command-z, 1300);
    display: none;
    color-scheme: light dark;
    --ui-command-backdrop: rgba(2, 6, 23, 0.52);
  }

  :host([open]) {
    display: grid;
    place-items: start center;
    padding-top: min(16vh, 120px);
    box-sizing: border-box;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: var(--ui-command-backdrop);
    backdrop-filter: blur(4px) saturate(1.05);
  }

  .panel {
    position: relative;
    width: min(680px, calc(100vw - 24px));
    max-height: min(76vh, 720px);
    transform: translateY(8px) scale(0.985);
    opacity: 0;
    transition: transform 170ms ease, opacity 170ms ease;
  }

  :host([open]) .panel {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  .command {
    max-height: min(76vh, 720px);
  }

  :host([headless]) .overlay,
  :host([headless]) .panel {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .panel {
      transition: none !important;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-command-backdrop: rgba(0, 0, 0, 0.72);
    }
  }
`;

export class UICommandPalette extends ElementBase {
  static get observedAttributes() {
    return ['open', 'headless', 'placeholder', 'empty-text', 'query'];
  }

  private _command: UICommand | null = null;
  private _globalListenersBound = false;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onSelect = this._onSelect.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this._syncOpenState();
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this._command?.removeEventListener('select', this._onSelect as EventListener);
    this._unbindGlobalListeners();
    try {
      OverlayManager.unregister(this as unknown as HTMLElement);
      OverlayManager.releaseLock();
    } catch {}
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'open') {
      this._syncOpenState();
      this.dispatchEvent(new CustomEvent(newValue != null ? 'open' : 'close', { bubbles: true }));
      return;
    }
    if (name === 'placeholder' || name === 'empty-text') {
      if (this.isConnected) this.requestRender();
      return;
    }
    if (name === 'query') {
      const next = newValue || '';
      if (this._command && this._command.query !== next) this._command.query = next;
      return;
    }
    if (name === 'headless' && this.isConnected) {
      this.requestRender();
    }
  }

  openPalette() {
    this.setAttribute('open', '');
  }

  closePalette() {
    this.removeAttribute('open');
  }

  get query(): string {
    const attributeValue = this.getAttribute('query');
    if (typeof attributeValue === 'string') return attributeValue;
    return this._command?.query ?? '';
  }

  set query(next: string) {
    const normalized = next || '';
    if (normalized) this.setAttribute('query', normalized);
    else this.removeAttribute('query');
    if (this._command && this._command.query !== normalized) this._command.query = normalized;
  }

  focusSearch(): void {
    this._command?.focusSearch();
  }

  clearQuery(): void {
    this.query = '';
  }

  private _syncOpenState() {
    if (this.hasAttribute('open')) {
      this._bindGlobalListeners();
      try {
        OverlayManager.register(this as unknown as HTMLElement);
        OverlayManager.acquireLock();
      } catch {}
      setTimeout(() => {
        this._command?.focusSearch();
      }, 0);
    } else {
      this._unbindGlobalListeners();
      this._command?.clearQuery();
      try {
        OverlayManager.unregister(this as unknown as HTMLElement);
        OverlayManager.releaseLock();
      } catch {}
    }
  }

  protected render() {
    const placeholder = this.getAttribute('placeholder') || 'Search commands...';
    const emptyText = this.getAttribute('empty-text') || 'No commands found.';

    this.setContent(`
      <style>${style}</style>
      <div class="overlay" part="overlay"></div>
      <section class="panel" part="panel" role="dialog" aria-modal="true" aria-label="Command palette">
        <ui-command class="command" part="command" placeholder="${placeholder}" empty-text="${emptyText}">
          <slot slot="command" name="command"></slot>
        </ui-command>
      </section>
    `);

    const nextCommand = this.root.querySelector('ui-command') as UICommand | null;
    if (this._command && this._command !== nextCommand) {
      this._command.removeEventListener('select', this._onSelect as EventListener);
    }
    this._command = nextCommand;
    this._command?.addEventListener('select', this._onSelect as EventListener);
    if (this._command && this._command.query !== this.query) {
      this._command.query = this.query;
    }
  }

  private _bindGlobalListeners() {
    if (this._globalListenersBound) return;
    document.addEventListener('keydown', this._onKeyDown as EventListener);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners() {
    if (!this._globalListenersBound) return;
    document.removeEventListener('keydown', this._onKeyDown as EventListener);
    this._globalListenersBound = false;
  }

  private _onClick(event: Event) {
    const target = event.target as HTMLElement | null;
    if (target?.classList.contains('overlay')) {
      this.closePalette();
    }
  }

  private _onSelect(_event: Event) {
    this.closePalette();
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (!this.hasAttribute('open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePalette();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-command-palette': UICommandPalette;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-command-palette')) {
  customElements.define('ui-command-palette', UICommandPalette);
}

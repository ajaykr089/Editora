import { ElementBase } from '../ElementBase';
import OverlayManager from '../overlayManager';

const style = `
  :host {
    position: fixed;
    inset: 0;
    z-index: 1180;
    display: none;
    color-scheme: light dark;
    --ui-command-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-command-text: var(--ui-color-text, #0f172a);
    --ui-command-muted: var(--ui-color-muted, #64748b);
    --ui-command-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 68%, transparent);
    --ui-command-accent: var(--ui-color-primary, #2563eb);
    --ui-command-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-command-radius: 16px;
    --ui-command-shadow: 0 28px 70px rgba(2, 6, 23, 0.26);
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
    overflow: hidden;
    border: var(--ui-command-border);
    border-radius: var(--ui-command-radius);
    background: var(--ui-command-bg);
    color: var(--ui-command-text);
    box-shadow: var(--ui-command-shadow);
    display: grid;
    grid-template-rows: auto 1fr;
    transform: translateY(8px) scale(0.985);
    opacity: 0;
    transition: transform 170ms ease, opacity 170ms ease;
  }

  :host([open]) .panel {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  .search {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    box-sizing: border-box;
    padding: 14px 16px;
    font-size: 15px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.1);
    color: inherit;
  }

  .search:focus-visible {
    outline: 2px solid var(--ui-command-focus);
    outline-offset: -2px;
  }

  .list {
    overflow: auto;
    padding: 8px;
    display: grid;
    gap: 4px;
  }

  ::slotted([slot="command"]) {
    display: block;
    border-radius: 10px;
    padding: 10px 10px;
    font-size: 13px;
    color: var(--ui-command-text);
    line-height: 1.35;
    cursor: pointer;
    user-select: none;
    outline: none;
    transition: background-color 120ms ease;
  }

  ::slotted([slot="command"]:hover),
  ::slotted([slot="command"]:focus-visible),
  ::slotted([slot="command"][data-active="true"]) {
    background: color-mix(in srgb, var(--ui-command-accent) 14%, transparent);
  }

  ::slotted([slot="command"][hidden]) {
    display: none !important;
  }

  .empty {
    padding: 12px 10px 14px;
    color: var(--ui-command-muted);
    font-size: 12px;
    text-align: center;
  }

  .empty[hidden] {
    display: none;
  }

  :host([headless]) .overlay,
  :host([headless]) .panel {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .panel,
    ::slotted([slot="command"]) {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .panel {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-command-bg: Canvas;
      --ui-command-text: CanvasText;
      --ui-command-muted: CanvasText;
      --ui-command-border: 1px solid CanvasText;
      --ui-command-backdrop: rgba(0, 0, 0, 0.72);
      --ui-command-accent: Highlight;
      --ui-command-focus: Highlight;
      --ui-command-shadow: none;
    }

    .panel,
    .search,
    ::slotted([slot="command"]) {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }

    ::slotted([slot="command"]:hover),
    ::slotted([slot="command"]:focus-visible),
    ::slotted([slot="command"][data-active="true"]) {
      border-color: Highlight;
    }
  }
`;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export class UICommandPalette extends ElementBase {
  static get observedAttributes() {
    return ['open', 'headless', 'placeholder', 'empty-text'];
  }

  private _commands: HTMLElement[] = [];
  private _visible: HTMLElement[] = [];
  private _active = -1;
  private _input: HTMLInputElement | null = null;
  private _slot: HTMLSlotElement | null = null;
  private _query = '';

  constructor() {
    super();
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    document.addEventListener('keydown', this._onKeyDown as EventListener);
    this._syncSlotListener();
    this._collectCommands();
    this._syncOpenState();
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    document.removeEventListener('keydown', this._onKeyDown as EventListener);
    if (this._slot) this._slot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._slot = null;
    try {
      OverlayManager.unregister(this as unknown as HTMLElement);
      OverlayManager.releaseLock();
    } catch {}
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'open' && oldValue !== newValue) {
      this._syncOpenState();
      this.dispatchEvent(new CustomEvent(newValue != null ? 'open' : 'close', { bubbles: true }));
    }
  }

  openPalette() {
    this.setAttribute('open', '');
  }

  closePalette() {
    this.removeAttribute('open');
  }

  private _syncOpenState() {
    if (this.hasAttribute('open')) {
      try {
        OverlayManager.register(this as unknown as HTMLElement);
        OverlayManager.acquireLock();
      } catch {}
      setTimeout(() => {
        this._input?.focus();
      }, 0);
    } else {
      try {
        OverlayManager.unregister(this as unknown as HTMLElement);
        OverlayManager.releaseLock();
      } catch {}
      this._active = -1;
    }
  }

  protected render() {
    const placeholder = this.getAttribute('placeholder') || 'Search commands...';
    const emptyText = this.getAttribute('empty-text') || 'No commands found.';
    this.setContent(`
      <style>${style}</style>
      <div class="overlay" part="overlay"></div>
      <section class="panel" part="panel" role="dialog" aria-modal="true" aria-label="Command palette">
        <input class="search" part="search" type="text" placeholder="${placeholder}" />
        <div class="list" part="list" role="listbox" aria-label="Command options">
          <slot name="command"></slot>
          <div class="empty" part="empty" hidden>${emptyText}</div>
        </div>
      </section>
    `);

    this._input = this.root.querySelector('.search');
    if (this._input) this._input.addEventListener('input', this._onInput);
    this._syncSlotListener();
    this._collectCommands();
    this._applyFilter();
  }

  private _syncSlotListener() {
    const next = this.root.querySelector('slot[name="command"]') as HTMLSlotElement | null;
    if (this._slot && this._slot !== next) {
      this._slot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (next && this._slot !== next) {
      next.addEventListener('slotchange', this._onSlotChange as EventListener);
    }
    this._slot = next;
  }

  private _onSlotChange() {
    this._collectCommands();
    this._applyFilter();
  }

  private _collectCommands() {
    this._commands = this._slot ? (this._slot.assignedElements({ flatten: true }) as HTMLElement[]) : [];
    this._commands.forEach((command, index) => {
      command.setAttribute('role', 'option');
      command.setAttribute('tabindex', '-1');
      command.setAttribute('data-index', String(index));
    });
  }

  private _applyFilter() {
    const query = normalize(this._query);
    this._visible = this._commands.filter((command) => {
      if (!query) return true;
      const text = normalize(command.textContent || '');
      return text.includes(query);
    });

    this._commands.forEach((command) => {
      if (this._visible.includes(command)) command.removeAttribute('hidden');
      else command.setAttribute('hidden', '');
      command.removeAttribute('data-active');
    });

    if (this._visible.length > 0) {
      this._active = Math.max(0, Math.min(this._active, this._visible.length - 1));
      this._visible[this._active].setAttribute('data-active', 'true');
    } else {
      this._active = -1;
    }

    const empty = this.root.querySelector('.empty') as HTMLElement | null;
    if (empty) {
      if (this._visible.length === 0) empty.removeAttribute('hidden');
      else empty.setAttribute('hidden', '');
    }
  }

  private _selectActive() {
    if (this._active < 0) return;
    const item = this._visible[this._active];
    if (!item) return;
    const indexRaw = item.getAttribute('data-index');
    const index = indexRaw == null ? -1 : Number(indexRaw);
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { index },
        bubbles: true
      })
    );
    this.closePalette();
  }

  private _move(delta: number) {
    if (this._visible.length === 0) return;
    this._active += delta;
    if (this._active < 0) this._active = this._visible.length - 1;
    if (this._active >= this._visible.length) this._active = 0;

    this._visible.forEach((item, index) => {
      if (index === this._active) item.setAttribute('data-active', 'true');
      else item.removeAttribute('data-active');
    });

    this._visible[this._active].scrollIntoView({ block: 'nearest' });
  }

  private _onInput(event: Event) {
    this._query = (event.target as HTMLInputElement).value || '';
    this._applyFilter();
  }

  private _onClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target) return;

    if (target.classList.contains('overlay')) {
      this.closePalette();
      return;
    }

    const path = event.composedPath();
    const command = this._commands.find((entry) => path.includes(entry));
    if (!command) return;
    if (command.hasAttribute('hidden')) return;

    const indexRaw = command.getAttribute('data-index');
    const index = indexRaw == null ? -1 : Number(indexRaw);
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { index },
        bubbles: true
      })
    );
    this.closePalette();
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (!this.hasAttribute('open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePalette();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._move(1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._move(-1);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      this._selectActive();
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-command-palette')) {
  customElements.define('ui-command-palette', UICommandPalette);
}

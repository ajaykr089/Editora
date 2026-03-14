import { ElementBase } from '../ElementBase';
import './ui-listbox';
import type { UIListbox } from './ui-listbox';

const style = `
  :host {
    display: grid;
    grid-template-rows: auto 1fr;
    min-inline-size: 0;
    min-block-size: 0;
    color-scheme: light dark;
    --ui-command-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-command-text: var(--ui-color-text, #0f172a);
    --ui-command-muted: var(--ui-color-muted, #64748b);
    --ui-command-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 68%, transparent);
    --ui-command-accent: var(--ui-color-primary, #2563eb);
    --ui-command-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-command-radius: 16px;
    --ui-command-shadow: none;
    border: var(--ui-command-border);
    border-radius: var(--ui-command-radius);
    background: var(--ui-command-bg);
    color: var(--ui-command-text);
    box-shadow: var(--ui-command-shadow);
    overflow: hidden;
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
    min-block-size: 0;
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

  @media (prefers-reduced-motion: reduce) {
    ::slotted([slot="command"]) {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
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
      --ui-command-accent: Highlight;
      --ui-command-focus: Highlight;
      --ui-command-shadow: none;
    }

    :host,
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

function commandSearchText(command: HTMLElement): string {
  return normalize(
    command.getAttribute('aria-label') ||
      command.getAttribute('data-label') ||
      [
        command.getAttribute('data-value') || '',
        command.getAttribute('data-keywords') || '',
        command.textContent || ''
      ].join(' ')
  );
}

function flattenAssignedCommands(slot: HTMLSlotElement | null): HTMLElement[] {
  if (!slot) return [];
  const assigned = slot.assignedElements({ flatten: true });
  const commands: HTMLElement[] = [];
  for (const element of assigned) {
    if (element instanceof HTMLSlotElement) {
      commands.push(...flattenAssignedCommands(element));
      continue;
    }
    if (element instanceof HTMLElement && element.getAttribute('slot') === 'command') {
      commands.push(element);
    }
  }
  return commands;
}

export type UICommandSelectDetail = {
  index: number;
  item: HTMLElement;
  label: string;
  value?: string;
};

export class UICommand extends ElementBase {
  static get observedAttributes() {
    return ['placeholder', 'empty-text'];
  }

  private _commands: HTMLElement[] = [];
  private _visible: HTMLElement[] = [];
  private _active = -1;
  private _input: HTMLInputElement | null = null;
  private _listbox: UIListbox | null = null;
  private _slot: HTMLSlotElement | null = null;
  private _query = '';

  constructor() {
    super();
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClick = this._onClick.bind(this);
  }

  get query(): string {
    return this._query;
  }

  set query(next: string) {
    const normalized = next || '';
    if (normalized === this._query) return;
    const previousValue = this._query;
    this._query = normalized;
    if (this._input) this._input.value = normalized;
    this._applyFilter();
    this.dispatchEvent(
      new CustomEvent('query-change', {
        detail: { value: normalized, previousValue },
        bubbles: true,
        composed: true
      })
    );
  }

  focusSearch(): void {
    this._input?.focus();
  }

  clearQuery(): void {
    this.query = '';
  }

  refreshCommands(): void {
    this._collectCommands();
    this._applyFilter();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this._syncSlotListener();
    this.refreshCommands();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this._input?.removeEventListener('input', this._onInput);
    this._input?.removeEventListener('keydown', this._onKeyDown);
    if (this._slot) this._slot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._slot = null;
    this._input = null;
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'placeholder') {
      if (this._input) this._input.placeholder = newValue || 'Search commands...';
      return;
    }
    if (name === 'empty-text') {
      const empty = this.root.querySelector('.empty') as HTMLElement | null;
      if (empty) empty.textContent = newValue || 'No commands found.';
    }
  }

  protected override render(): void {
    if (this._input) {
      this._input.removeEventListener('input', this._onInput);
      this._input.removeEventListener('keydown', this._onKeyDown);
    }

    const placeholder = this.getAttribute('placeholder') || 'Search commands...';
    const emptyText = this.getAttribute('empty-text') || 'No commands found.';

    this.setContent(`
      <style>${style}</style>
      <input class="search" part="search" type="text" placeholder="${placeholder}" />
      <ui-listbox class="list" part="list" role="listbox" aria-label="Command options" item-selector="[slot=&quot;command&quot;]" item-role="option" active-attribute="data-active">
        <slot name="command"></slot>
        <div class="empty" part="empty" hidden>${emptyText}</div>
      </ui-listbox>
    `);

    this._input = this.root.querySelector('.search');
    this._listbox = this.root.querySelector('ui-listbox') as UIListbox | null;
    if (this._listbox) this._listbox.container = this;
    if (this._input) {
      this._input.value = this._query;
      this._input.addEventListener('input', this._onInput);
      this._input.addEventListener('keydown', this._onKeyDown);
    }
    this._syncSlotListener();
    this.refreshCommands();
  }

  private _syncSlotListener(): void {
    const next = this.root.querySelector('slot[name="command"]') as HTMLSlotElement | null;
    if (this._slot && this._slot !== next) {
      this._slot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (next && this._slot !== next) {
      next.addEventListener('slotchange', this._onSlotChange as EventListener);
    }
    this._slot = next;
  }

  private _onSlotChange(): void {
    this.refreshCommands();
  }

  private _collectCommands(): void {
    this._commands = flattenAssignedCommands(this._slot);
    this._commands.forEach((command, index) => {
      command.setAttribute('data-index', String(index));
    });
    if (this._listbox) this._listbox.items = this._commands;
    this._listbox?.refresh();
  }

  private _applyFilter(): void {
    const query = normalize(this._query);
    this._visible = this._commands.filter((command) => !query || commandSearchText(command).includes(query));

    this._commands.forEach((command) => {
      if (this._visible.includes(command)) command.removeAttribute('hidden');
      else command.setAttribute('hidden', '');
    });

    if (this._visible.length > 0) {
      this._active = Math.max(0, Math.min(this._active, this._visible.length - 1));
      this._listbox?.setActiveItem(this._visible[this._active], {
        focus: false,
        owner: this._input,
        scroll: true
      });
    } else {
      this._active = -1;
      this._listbox?.clearActive();
      if (this._input) this._input.removeAttribute('aria-activedescendant');
    }

    const empty = this.root.querySelector('.empty') as HTMLElement | null;
    if (empty) {
      if (this._visible.length === 0) empty.removeAttribute('hidden');
      else empty.setAttribute('hidden', '');
    }
  }

  private _selectCommand(command: HTMLElement | null): void {
    if (!command) return;
    const indexRaw = command.getAttribute('data-index');
    const index = indexRaw == null ? -1 : Number(indexRaw);
    this.dispatchEvent(
      new CustomEvent<UICommandSelectDetail>('select', {
        detail: {
          index,
          item: command,
          label: command.getAttribute('data-label') || (command.textContent || '').trim(),
          value: command.getAttribute('data-value') || undefined
        },
        bubbles: true,
        composed: true
      })
    );
  }

  private _move(delta: 1 | -1): void {
    if (this._visible.length === 0) return;
    const current = this._active >= 0 ? this._visible[this._active] : null;
    const next = this._listbox?.move(delta, {
      current,
      focus: false,
      owner: this._input,
      scroll: true
    }) || null;
    if (!next) return;
    this._active = this._visible.indexOf(next);
  }

  private _onInput(event: Event): void {
    this.query = (event.target as HTMLInputElement).value || '';
  }

  private _onKeyDown(event: KeyboardEvent): void {
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
    if (event.key === 'Home') {
      event.preventDefault();
      const next = this._listbox?.focusBoundary('first', { focus: false, owner: this._input, scroll: true }) || null;
      if (next) this._active = this._visible.indexOf(next);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      const next = this._listbox?.focusBoundary('last', { focus: false, owner: this._input, scroll: true }) || null;
      if (next) this._active = this._visible.indexOf(next);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      this._selectCommand(this._active >= 0 ? this._visible[this._active] : null);
    }
  }

  private _onClick(event: Event): void {
    const path = event.composedPath();
    const command = this._commands.find((entry) => path.includes(entry));
    if (!command || command.hasAttribute('hidden')) return;
    this._selectCommand(command);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-command': UICommand;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-command')) {
  customElements.define('ui-command', UICommand);
}

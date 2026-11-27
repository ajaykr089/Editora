import { ElementBase } from '../ElementBase';
import { escapeHtml } from '../primitives/escape-html';

/**
 * A keyboard key or shortcut.
 *
 *   <ui-kbd>Esc</ui-kbd>
 *   <ui-kbd keys="Ctrl+Shift+P"></ui-kbd>       three keys joined by "+"
 *   <ui-kbd keys='["⌘", "K"]' separator=""></ui-kbd>
 *
 * A shortcut renders as nested <kbd> elements, the HTML spec's markup for a key combination.
 * `keys` is "+"-separated (a literal plus key is written "Ctrl++") or a JSON array. Attributes:
 * `size` (sm | md | lg), `variant` (outline | soft | ghost), `separator` (shown between keys,
 * default "+").
 */
const style = `
  :host {
    --ui-kbd-font-size: 0.75em;
    --ui-kbd-height: 1.75em;
    --ui-kbd-padding-inline: 0.45em;
    --ui-kbd-radius: var(--ui-control-radius-1, 4px);
    --ui-kbd-bg: var(--ui-color-surface, #ffffff);
    --ui-kbd-color: var(--ui-color-text-secondary, var(--ui-color-text, #334155));
    --ui-kbd-border: color-mix(in srgb, var(--ui-color-text, #0f172a) 22%, var(--ui-color-surface, #ffffff));
    --ui-kbd-shadow: inset 0 -1px 0 color-mix(in srgb, var(--ui-color-text, #0f172a) 16%, transparent);
    color-scheme: light dark;
    display: inline-flex;
    vertical-align: baseline;
    font-family: var(--ui-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  }

  :host([hidden]) { display: none; }
  :host([size="sm"]) { --ui-kbd-font-size: 0.6875em; --ui-kbd-height: 1.5em; --ui-kbd-padding-inline: 0.35em; }
  :host([size="lg"]) { --ui-kbd-font-size: 0.875em; --ui-kbd-height: 2em; --ui-kbd-padding-inline: 0.55em; }

  :host([variant="soft"]) {
    --ui-kbd-bg: var(--ui-color-fill, color-mix(in srgb, var(--ui-color-text, #0f172a) 7%, transparent));
    --ui-kbd-border: transparent;
    --ui-kbd-shadow: none;
  }

  :host([variant="ghost"]) {
    --ui-kbd-bg: transparent;
    --ui-kbd-border: transparent;
    --ui-kbd-shadow: none;
    --ui-kbd-padding-inline: 0.15em;
  }

  .combo {
    display: inline-flex;
    align-items: center;
    gap: 0.25em;
    font: inherit;
  }

  .key {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-inline-size: var(--ui-kbd-height);
    block-size: var(--ui-kbd-height);
    padding: 0 var(--ui-kbd-padding-inline);
    border: 1px solid var(--ui-kbd-border);
    border-radius: var(--ui-kbd-radius);
    background: var(--ui-kbd-bg);
    box-shadow: var(--ui-kbd-shadow);
    color: var(--ui-kbd-color);
    font: inherit;
    font-size: var(--ui-kbd-font-size);
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
  }

  .sep {
    color: var(--ui-color-muted, #64748b);
    font-size: var(--ui-kbd-font-size);
  }

  @media (forced-colors: active) {
    .key { border-color: CanvasText; background: Canvas; color: CanvasText; box-shadow: none; }
  }
`;

/** Splits "Ctrl+Shift+P" into keys; "Ctrl++" is Ctrl and the plus key. A JSON array is taken as is. */
export function parseKbdKeys(value: string | null): string[] {
  const raw = (value || '').trim();
  if (!raw) return [];
  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((key) => String(key)).filter((key) => key.length > 0);
    } catch {
      // Not JSON after all: fall through to the "+" syntax.
    }
  }
  if (raw === '+') return ['+'];
  const keys: string[] = [];
  let current = '';
  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];
    if (char === '+' && current.trim()) {
      keys.push(current.trim());
      current = '';
      continue;
    }
    // A "+" that starts a key (after a separator, or at the very end) is the plus key itself.
    current += char;
  }
  if (current.trim()) keys.push(current.trim());
  return keys;
}

export class UIKbd extends ElementBase {
  static get observedAttributes() {
    return ['keys', 'separator'];
  }

  protected override render(): void {
    const keys = parseKbdKeys(this.getAttribute('keys'));
    const separator = this.hasAttribute('separator') ? this.getAttribute('separator') || '' : '+';

    if (keys.length === 0) {
      this.setContent(`<style>${style}</style><kbd class="key" part="key"><slot></slot></kbd>`);
      return;
    }

    const items = keys.map((key, index) => {
      const sep = index > 0 && separator ? `<span class="sep" part="separator">${escapeHtml(separator)}</span>` : '';
      return `${sep}<kbd class="key" part="key">${escapeHtml(key)}</kbd>`;
    });
    const content = keys.length === 1 ? items[0] : `<kbd class="combo" part="combo">${items.join('')}</kbd>`;
    this.setContent(`<style>${style}</style>${content}`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-kbd')) {
  customElements.define('ui-kbd', UIKbd);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-kbd': UIKbd;
  }
}

import { ElementBase } from '../ElementBase';

/**
 * One field frame around a text control and its addons: icons, units, buttons, a keyboard hint, a
 * spinner, or a toolbar above or below a textarea (a chat composer).
 *
 *   <ui-input-group>
 *     <svg slot="start" …></svg>
 *     <input type="search" aria-label="Search" placeholder="Search…" />
 *     <kbd slot="end">⌘K</kbd>
 *   </ui-input-group>
 *
 *   <ui-input-group>
 *     <textarea aria-label="Message"></textarea>
 *     <div slot="bottom">…attach, model picker, send button…</div>
 *   </ui-input-group>
 *
 * The group draws the border, background, hover and focus ring; the control inside (a native
 * <input>/<textarea>/<select>, or `ui-input`, `ui-textarea`, `ui-select`) loses its own frame.
 * Addons go in the `start`/`end` slots (beside the control) or `top`/`bottom` (full-width rows).
 * Clicking an addon that is not itself interactive focuses the control, as a <label> would.
 * Attributes: `size` (sm | md | lg), `invalid`, `disabled` (also disables the control).
 */
const style = `
  :host {
    --ui-input-group-height: var(--ui-control-height-2, 32px);
    --ui-input-group-radius: var(--ui-control-radius-2, var(--ui-radius, 6px));
    --ui-input-group-border-color: var(--ui-color-field-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 52%, var(--ui-color-surface, #ffffff)));
    --ui-input-group-bg: var(--ui-color-surface, #ffffff);
    --ui-input-group-color: var(--ui-color-text, #0f172a);
    --ui-input-group-addon-color: var(--ui-color-muted, #526175);
    --ui-input-group-ring: var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    --ui-input-group-pad-x: var(--ui-control-padding-inline-2, 12px);
    --ui-input-group-font-size: var(--ui-control-font-size-2, 14px);
    color-scheme: light dark;
    display: block;
    inline-size: 100%;
    min-inline-size: 0;
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
  }

  :host([hidden]) { display: none; }
  :host([size="sm"]) {
    --ui-input-group-height: var(--ui-control-height-1, 28px);
    --ui-input-group-pad-x: var(--ui-control-padding-inline-1, 10px);
    --ui-input-group-font-size: var(--ui-control-font-size-1, 13px);
    --ui-input-group-radius: var(--ui-control-radius-1, var(--ui-radius, 6px));
  }
  :host([size="lg"]) {
    --ui-input-group-height: var(--ui-control-height-3, 40px);
    --ui-input-group-pad-x: var(--ui-control-padding-inline-3, 14px);
    --ui-input-group-font-size: var(--ui-control-font-size-3, 16px);
  }

  .frame {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      "top top top"
      "start control end"
      "bottom bottom bottom";
    align-items: center;
    box-sizing: border-box;
    min-block-size: var(--ui-input-group-height);
    border: 1px solid var(--ui-input-group-border-color);
    border-radius: var(--ui-input-group-radius);
    background: var(--ui-input-group-bg);
    color: var(--ui-input-group-color);
    font-size: var(--ui-input-group-font-size);
    cursor: text;
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }

  .frame:hover:not(:focus-within) {
    border-color: var(--ui-color-field-border-hover, var(--ui-input-group-border-color));
  }

  .frame:focus-within {
    border-color: var(--ui-input-group-ring);
    outline: var(--ui-ring-width, 2px) solid var(--ui-input-group-ring);
    outline-offset: -1px;
  }

  :host([invalid]) .frame,
  :host([invalid]) .frame:hover {
    border-color: var(--ui-color-danger, #dc2626);
  }
  :host([invalid]) .frame:focus-within {
    --ui-input-group-ring: var(--ui-color-danger, #dc2626);
  }

  :host([disabled]) .frame {
    cursor: not-allowed;
    opacity: 0.6;
    background: var(--ui-color-surface-alt, var(--ui-input-group-bg));
  }

  .control { grid-area: control; display: flex; align-items: stretch; min-inline-size: 0; align-self: stretch; }
  .start { grid-area: start; }
  .end { grid-area: end; }
  .top { grid-area: top; }
  .bottom { grid-area: bottom; }

  .start,
  .end {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--ui-input-group-addon-color);
    white-space: nowrap;
  }
  .start { padding-inline-start: var(--ui-input-group-pad-x); }
  .end { padding-inline-end: calc(var(--ui-input-group-pad-x) - 4px); }
  .start[data-empty],
  .end[data-empty],
  .top[data-empty],
  .bottom[data-empty] { display: none; }

  .top,
  .bottom {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px calc(var(--ui-input-group-pad-x) - 4px);
    color: var(--ui-input-group-addon-color);
    min-inline-size: 0;
  }
  .top { border-block-end: 1px solid color-mix(in srgb, var(--ui-input-group-border-color) 45%, transparent); }
  .bottom { border-block-start: 1px solid color-mix(in srgb, var(--ui-input-group-border-color) 45%, transparent); }
  :host([borderless-rows]) .top,
  :host([borderless-rows]) .bottom { border: 0; }

  /* The control inside gives up its own frame: the group draws it. */
  .control ::slotted(input),
  .control ::slotted(textarea),
  .control ::slotted(select) {
    flex: 1 1 auto;
    min-inline-size: 0;
    box-sizing: border-box;
    margin: 0;
    border: 0;
    border-radius: 0;
    outline: none;
    background: transparent;
    color: inherit;
    font: inherit;
    padding-inline: var(--ui-input-group-pad-x);
    min-block-size: calc(var(--ui-input-group-height) - 2px);
  }
  .control ::slotted(textarea) {
    padding-block: 8px;
    resize: vertical;
    line-height: 1.5;
    min-block-size: calc(var(--ui-input-group-height) * 2);
  }
  .control ::slotted(*:not(input):not(textarea):not(select)) {
    flex: 1 1 auto;
    min-inline-size: 0;
    --ui-input-border: none;
    --ui-input-bg: transparent;
    --ui-input-border-radius: 0px;
    --ui-textarea-border: transparent;
    --ui-textarea-bg: transparent;
    --ui-textarea-radius: 0px;
    --ui-select-radius: 0px;
    --ui-color-field-border-hover: transparent;
    --ui-ring-width: 0px;
  }
  :host([data-has-start]) .control ::slotted(input),
  :host([data-has-start]) .control ::slotted(select) { padding-inline-start: 8px; }
  :host([data-has-end]) .control ::slotted(input),
  :host([data-has-end]) .control ::slotted(select) { padding-inline-end: 8px; }

  ::slotted([slot="start"]),
  ::slotted([slot="end"]) { flex: none; }
  ::slotted(svg[slot]) { inline-size: 16px; block-size: 16px; }

  @media (forced-colors: active) {
    .frame { border-color: CanvasText; }
    .frame:focus-within { outline-color: Highlight; }
  }
`;

const INTERACTIVE = 'a[href],button,input,select,textarea,summary,[tabindex],[contenteditable=""],[contenteditable="true"],ui-button,ui-select,ui-dropdown,ui-menu,ui-toggle,ui-switch,ui-checkbox';
const CONTROL_SELECTOR = 'input,textarea,select,ui-input,ui-textarea,ui-select,ui-combobox,ui-number-field,ui-password-field';

export class UIInputGroup extends ElementBase {
  static get observedAttributes() {
    return ['disabled', 'invalid'];
  }

  private readonly onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || this.hasAttribute('disabled')) return;
    const path = event.composedPath();
    // Interactive addons (a send button, a menu) keep their own click.
    for (const node of path) {
      if (node === this) break;
      if (node instanceof Element && node.matches(INTERACTIVE)) return;
    }
    const control = this.control();
    if (!control) return;
    event.preventDefault();
    (control as HTMLElement).focus();
  };

  constructor() {
    super();
    this.root.addEventListener('slotchange', () => this.syncSlots());
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('pointerdown', this.onPointerDown);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('pointerdown', this.onPointerDown);
    super.disconnectedCallback();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    this.syncState();
    return false;
  }

  /** The text control inside the group (the element that receives focus). */
  control(): HTMLElement | null {
    for (const child of Array.from(this.children)) {
      if (child.getAttribute('slot')) continue;
      if (child.matches(CONTROL_SELECTOR)) return child as HTMLElement;
      const nested = child.querySelector(CONTROL_SELECTOR);
      if (nested) return nested as HTMLElement;
    }
    return null;
  }

  private syncState(): void {
    const control = this.control();
    if (!control) return;
    const disabled = this.hasAttribute('disabled');
    if (disabled) {
      // Only take ownership of a state the app did not set: removing ours must not undo theirs.
      if (!control.hasAttribute('disabled')) {
        control.setAttribute('disabled', '');
        control.setAttribute('data-group-disabled', '');
      }
    } else if (control.hasAttribute('data-group-disabled')) {
      control.removeAttribute('disabled');
      control.removeAttribute('data-group-disabled');
    }
    if (this.hasAttribute('invalid')) {
      if (control.getAttribute('aria-invalid') !== 'true') {
        control.setAttribute('aria-invalid', 'true');
        control.setAttribute('data-group-invalid', '');
      }
    } else if (control.hasAttribute('data-group-invalid')) {
      control.removeAttribute('aria-invalid');
      control.removeAttribute('data-group-invalid');
    }
  }

  private syncSlots(): void {
    for (const name of ['start', 'end', 'top', 'bottom']) {
      const slot = this.root.querySelector(`slot[name="${name}"]`) as HTMLSlotElement | null;
      const wrapper = slot?.parentElement;
      if (!slot || !wrapper) continue;
      const filled = slot.assignedNodes({ flatten: true }).some((node) => node.nodeType === 1 || (node.textContent || '').trim());
      wrapper.toggleAttribute('data-empty', !filled);
      if (name === 'start' || name === 'end') this.toggleAttribute(`data-has-${name}`, filled);
    }
    this.syncState();
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="frame" part="frame">
        <div class="top" part="top" data-empty><slot name="top"></slot></div>
        <div class="start" part="start" data-empty><slot name="start"></slot></div>
        <div class="control" part="control"><slot></slot></div>
        <div class="end" part="end" data-empty><slot name="end"></slot></div>
        <div class="bottom" part="bottom" data-empty><slot name="bottom"></slot></div>
      </div>
    `);
    this.syncSlots();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-input-group')) {
  customElements.define('ui-input-group', UIInputGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-input-group': UIInputGroup;
  }
}

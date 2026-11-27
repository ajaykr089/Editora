import { ElementBase } from '../ElementBase';

/**
 * A styled native <select>: the platform picker (the wheel on iOS, the sheet on Android), native
 * form submission, validation and autofill, with the library's field look.
 *
 *   <ui-native-select>
 *     <select name="country" aria-label="Country">
 *       <option value="in">India</option>
 *       <option value="us">United States</option>
 *     </select>
 *   </ui-native-select>
 *
 * The <select> stays in your markup (light DOM), so <form>, FormData, labels (`<label for>`) and
 * frameworks' bindings work on it directly. The wrapper adds the frame, the chevron and the states;
 * `disabled`, `required` and `:user-invalid` come from the select itself. Use `ui-select` instead
 * when options need rich content, search or custom rendering. Attributes: `size` (sm | md | lg),
 * `variant` (outline | soft | ghost), `invalid` (marks the select `aria-invalid`).
 */
const style = `
  :host {
    --ui-native-select-height: var(--ui-control-height-2, 32px);
    --ui-native-select-radius: var(--ui-control-radius-2, var(--ui-radius, 6px));
    --ui-native-select-pad-x: var(--ui-control-padding-inline-2, 12px);
    --ui-native-select-font-size: var(--ui-control-font-size-2, 14px);
    --ui-native-select-border: var(--ui-color-field-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 52%, var(--ui-color-surface, #ffffff)));
    --ui-native-select-bg: var(--ui-color-surface, #ffffff);
    --ui-native-select-color: var(--ui-color-text, #0f172a);
    --ui-native-select-ring: var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    --ui-native-select-chevron: var(--ui-color-muted, #526175);
    color-scheme: light dark;
    position: relative;
    display: inline-flex;
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
    vertical-align: middle;
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
  }

  :host([hidden]) { display: none; }
  :host([inline]) { inline-size: auto; }

  :host([size="sm"]) {
    --ui-native-select-height: var(--ui-control-height-1, 28px);
    --ui-native-select-pad-x: var(--ui-control-padding-inline-1, 10px);
    --ui-native-select-font-size: var(--ui-control-font-size-1, 13px);
    --ui-native-select-radius: var(--ui-control-radius-1, var(--ui-radius, 6px));
  }
  :host([size="lg"]) {
    --ui-native-select-height: var(--ui-control-height-3, 40px);
    --ui-native-select-pad-x: var(--ui-control-padding-inline-3, 14px);
    --ui-native-select-font-size: var(--ui-control-font-size-3, 16px);
  }

  :host([variant="soft"]) {
    --ui-native-select-bg: var(--ui-color-fill, color-mix(in srgb, var(--ui-color-text, #0f172a) 6%, transparent));
    --ui-native-select-border: transparent;
  }
  :host([variant="ghost"]) {
    --ui-native-select-bg: transparent;
    --ui-native-select-border: transparent;
  }

  ::slotted(select) {
    -webkit-appearance: none;
    appearance: none;
    box-sizing: border-box;
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: var(--ui-native-select-height);
    margin: 0;
    padding-block: 0;
    padding-inline: var(--ui-native-select-pad-x) calc(var(--ui-native-select-pad-x) + 20px);
    border: 1px solid var(--ui-native-select-border);
    border-radius: var(--ui-native-select-radius);
    background: var(--ui-native-select-bg);
    color: var(--ui-native-select-color);
    font: inherit;
    font-size: var(--ui-native-select-font-size);
    line-height: 1.25;
    text-overflow: ellipsis;
    cursor: pointer;
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }

  ::slotted(select:hover:not(:disabled):not(:focus-visible)) {
    border-color: var(--ui-color-field-border-hover, var(--ui-native-select-border));
  }

  ::slotted(select:focus-visible) {
    border-color: var(--ui-native-select-ring);
    outline: var(--ui-ring-width, 2px) solid var(--ui-native-select-ring);
    outline-offset: -1px;
  }

  ::slotted(select:disabled) {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ::slotted(select[aria-invalid="true"]),
  ::slotted(select:user-invalid) {
    border-color: var(--ui-color-danger, #dc2626);
    --ui-native-select-ring: var(--ui-color-danger, #dc2626);
  }

  /* A list box (multiple or size > 1) shows its options inline: no chevron, no fixed height. */
  :host([data-listbox]) ::slotted(select) {
    padding: 4px;
    min-block-size: 0;
    cursor: default;
  }
  :host([data-listbox]) .chevron { display: none; }

  .chevron {
    position: absolute;
    inset-inline-end: calc(var(--ui-native-select-pad-x) - 2px);
    inset-block-start: 50%;
    inline-size: 16px;
    block-size: 16px;
    margin-block-start: -8px;
    color: var(--ui-native-select-chevron);
    pointer-events: none;
  }

  :host([data-disabled]) .chevron { opacity: 0.6; }

  @media (forced-colors: active) {
    ::slotted(select) { border-color: CanvasText; }
    .chevron { color: CanvasText; }
  }
`;

const CHEVRON = '<svg class="chevron" part="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>';

export class UINativeSelect extends ElementBase {
  static get observedAttributes() {
    return ['invalid'];
  }

  private observer: MutationObserver | null = null;
  private observed: HTMLSelectElement | null = null;

  constructor() {
    super();
    this.root.addEventListener('slotchange', () => this.sync());
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.sync();
  }

  override disconnectedCallback(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.observed = null;
    super.disconnectedCallback();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    this.sync();
    return false;
  }

  /** The wrapped <select>. */
  get select(): HTMLSelectElement | null {
    return this.querySelector(':scope > select');
  }

  private sync(): void {
    const select = this.select;
    if (select !== this.observed) {
      this.observer?.disconnect();
      this.observed = select;
      if (select && typeof MutationObserver !== 'undefined') {
        this.observer = this.observer || new MutationObserver(() => this.sync());
        this.observer.observe(select, { attributes: true, attributeFilter: ['disabled', 'multiple', 'size'] });
        this.observer.observe(this, { childList: true });
      }
    }
    if (!select) return;
    this.toggleAttribute('data-listbox', select.multiple || select.size > 1);
    this.toggleAttribute('data-disabled', select.disabled);
    if (this.hasAttribute('invalid')) {
      if (select.getAttribute('aria-invalid') !== 'true') {
        select.setAttribute('aria-invalid', 'true');
        select.setAttribute('data-wrapper-invalid', '');
      }
    } else if (select.hasAttribute('data-wrapper-invalid')) {
      select.removeAttribute('aria-invalid');
      select.removeAttribute('data-wrapper-invalid');
    }
  }

  protected override render(): void {
    this.setContent(`<style>${style}</style><slot></slot>${CHEVRON}`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-native-select')) {
  customElements.define('ui-native-select', UINativeSelect);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-native-select': UINativeSelect;
  }
}

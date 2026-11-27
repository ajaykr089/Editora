import { ElementBase } from '../ElementBase';

/**
 * Joins related buttons (and inputs, selects, menus) into one control.
 *
 *   <ui-button-group aria-label="Text alignment">
 *     <button>Left</button> <button>Center</button> <button>Right</button>
 *   </ui-button-group>
 *
 * Works with `ui-button`, `ui-split-button`, `ui-input`, `ui-select`, `ui-native-select` and
 * native buttons, inputs and selects.
 *
 * The host is a `role="group"`; give it an `aria-label` when the buttons' purpose is not obvious
 * from their text. Children touch and share borders: inner corners are squared and each child after
 * the first overlaps the previous border by one pixel; a hovered or focused child is raised so its
 * border and focus ring are fully visible. A nested <ui-button-group> stays a separate cluster
 * with a gap. Attributes: `orientation` (horizontal | vertical), `size` (passed to child buttons
 * that set none), `detached` (spaced buttons that keep their own corners).
 */
const style = `
  :host {
    --ui-button-group-radius: var(--ui-control-radius-2, var(--ui-radius, 6px));
    --ui-button-group-gap: 8px;
    color-scheme: light dark;
    display: inline-flex;
    align-items: stretch;
    vertical-align: middle;
    isolation: isolate;
  }

  :host([hidden]) { display: none; }
  :host([orientation="vertical"]) { flex-direction: column; }

  ::slotted(*) {
    position: relative;
    flex: 0 0 auto;
  }

  /* Raise the child under the pointer or holding focus so its border/ring is not covered. */
  ::slotted(:hover) { z-index: 1; }
  ::slotted(:focus-within),
  ::slotted(:focus-visible) { z-index: 2; }

  :host(:not([detached])) ::slotted(:not(:first-child)) { margin-inline-start: -1px; }
  :host([orientation="vertical"]:not([detached])) ::slotted(:not(:first-child)) { margin-inline-start: 0; margin-block-start: -1px; }

  /* ui-button reads its corners from --ui-btn-radius (physical order); native controls take
     logical radii directly. */
  :host(:not([detached])) ::slotted(:not(:first-child):not(:last-child)) {
    --ui-btn-radius: 0px;
    --ui-input-border-radius: 0px;
    --ui-select-radius: 0px;
    border-radius: 0;
  }

  :host(:not([detached]):not([orientation="vertical"])) ::slotted(:first-child:not(:last-child)) {
    --ui-btn-radius: var(--ui-button-group-radius) 0 0 var(--ui-button-group-radius);
    --ui-input-border-radius: var(--ui-button-group-radius) 0 0 var(--ui-button-group-radius);
    --ui-select-radius: var(--ui-button-group-radius) 0 0 var(--ui-button-group-radius);
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host(:not([detached]):not([orientation="vertical"])) ::slotted(:last-child:not(:first-child)) {
    --ui-btn-radius: 0 var(--ui-button-group-radius) var(--ui-button-group-radius) 0;
    --ui-input-border-radius: 0 var(--ui-button-group-radius) var(--ui-button-group-radius) 0;
    --ui-select-radius: 0 var(--ui-button-group-radius) var(--ui-button-group-radius) 0;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  :host(:not([detached]):not([orientation="vertical"]):dir(rtl)) ::slotted(:first-child:not(:last-child)) {
    --ui-btn-radius: 0 var(--ui-button-group-radius) var(--ui-button-group-radius) 0;
    --ui-input-border-radius: 0 var(--ui-button-group-radius) var(--ui-button-group-radius) 0;
    --ui-select-radius: 0 var(--ui-button-group-radius) var(--ui-button-group-radius) 0;
  }

  :host(:not([detached]):not([orientation="vertical"]):dir(rtl)) ::slotted(:last-child:not(:first-child)) {
    --ui-btn-radius: var(--ui-button-group-radius) 0 0 var(--ui-button-group-radius);
    --ui-input-border-radius: var(--ui-button-group-radius) 0 0 var(--ui-button-group-radius);
    --ui-select-radius: var(--ui-button-group-radius) 0 0 var(--ui-button-group-radius);
  }

  :host([orientation="vertical"]:not([detached])) ::slotted(:first-child:not(:last-child)) {
    --ui-btn-radius: var(--ui-button-group-radius) var(--ui-button-group-radius) 0 0;
    --ui-input-border-radius: var(--ui-button-group-radius) var(--ui-button-group-radius) 0 0;
    --ui-select-radius: var(--ui-button-group-radius) var(--ui-button-group-radius) 0 0;
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }

  :host([orientation="vertical"]:not([detached])) ::slotted(:last-child:not(:first-child)) {
    --ui-btn-radius: 0 0 var(--ui-button-group-radius) var(--ui-button-group-radius);
    --ui-input-border-radius: 0 0 var(--ui-button-group-radius) var(--ui-button-group-radius);
    --ui-select-radius: 0 0 var(--ui-button-group-radius) var(--ui-button-group-radius);
    border-start-start-radius: 0;
    border-start-end-radius: 0;
  }

  /* Filled buttons have no border to share: a hairline keeps them readable as separate buttons.
     It is the later button's outer shadow, painted over the 1px it overlaps the previous one. */
  :host(:not([detached])) ::slotted(ui-button:not(:first-child):not([variant="secondary"]):not([variant="ghost"]):not([variant="outline"]):not([variant="link"])) {
    box-shadow: -1px 0 0 0 var(--ui-button-group-divider, color-mix(in srgb, var(--ui-color-background, #ffffff) 45%, transparent));
  }
  :host(:not([detached]):dir(rtl)) ::slotted(ui-button:not(:first-child):not([variant="secondary"]):not([variant="ghost"]):not([variant="outline"]):not([variant="link"])) {
    box-shadow: 1px 0 0 0 var(--ui-button-group-divider, color-mix(in srgb, var(--ui-color-background, #ffffff) 45%, transparent));
  }
  :host([orientation="vertical"]:not([detached])) ::slotted(ui-button:not(:first-child):not([variant="secondary"]):not([variant="ghost"]):not([variant="outline"]):not([variant="link"])) {
    box-shadow: 0 -1px 0 0 var(--ui-button-group-divider, color-mix(in srgb, var(--ui-color-background, #ffffff) 45%, transparent));
  }

  /* Nested groups and separators are clusters, not joined children. */
  :host(:not([detached])) ::slotted(ui-button-group) {
    --ui-btn-radius: initial;
    margin-inline-start: 0;
    margin-block-start: 0;
  }
  ::slotted(ui-button-group:not(:first-child)) { margin-inline-start: var(--ui-button-group-gap) !important; }
  :host([orientation="vertical"]) ::slotted(ui-button-group:not(:first-child)) { margin-inline-start: 0 !important; margin-block-start: var(--ui-button-group-gap) !important; }

  :host([detached]) { gap: var(--ui-button-group-gap); }

  ::slotted(ui-separator) {
    --ui-separator-margin-block: 0px;
    --ui-separator-margin-inline: 0px;
    align-self: stretch;
    z-index: 3;
  }
`;

const SIZED_TAGS = new Set(['ui-button', 'ui-split-button', 'ui-input', 'ui-select', 'ui-native-select']);

export class UIButtonGroup extends ElementBase {
  static get observedAttributes() {
    return ['orientation', 'size'];
  }

  private observer: MutationObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncChildren();
    if (!this.observer && typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.syncChildren());
      this.observer.observe(this, { childList: true });
    }
  }

  override disconnectedCallback(): void {
    this.observer?.disconnect();
    this.observer = null;
    super.disconnectedCallback();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    this.syncChildren();
    return false;
  }

  private syncChildren(): void {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'group');
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    // aria-orientation is only meaningful on composite roles; on a plain group it is ignored, so it
    // is set only for a toolbar role an app chose.
    if (this.getAttribute('role') === 'toolbar') this.setAttribute('aria-orientation', orientation);

    const size = this.getAttribute('size');
    const vertical = orientation === 'vertical';
    for (const child of Array.from(this.children)) {
      const tag = child.localName;
      // A vertical stack reads as one column: buttons fill its width.
      if (tag === 'ui-button' || tag === 'ui-split-button') {
        if (vertical && !child.hasAttribute('block')) {
          child.setAttribute('block', '');
          child.setAttribute('data-group-block', '');
        } else if (!vertical && child.hasAttribute('data-group-block')) {
          child.removeAttribute('block');
          child.removeAttribute('data-group-block');
        }
      }
      if (!SIZED_TAGS.has(tag)) continue;
      const ours = child.hasAttribute('data-group-size');
      if (size && (!child.hasAttribute('size') || ours)) {
        if (child.getAttribute('size') !== size) child.setAttribute('size', size);
        child.setAttribute('data-group-size', '');
      } else if (!size && ours) {
        child.removeAttribute('size');
        child.removeAttribute('data-group-size');
      }
    }
  }

  protected override render(): void {
    this.setContent(`<style>${style}</style><slot></slot>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-button-group')) {
  customElements.define('ui-button-group', UIButtonGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-button-group': UIButtonGroup;
  }
}

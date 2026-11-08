/**
 * The floating layer a picker opens its panel in.
 *
 * Pickers used to append their panel to `document.body`, outside the element. There it lost the
 * theme variables a scoped ThemeProvider sets on a wrapper, the app could only reach it with
 * global class selectors, and a modal `<dialog>` made it inert. The layer now lives inside the
 * picker's own shadow root, so CSS variables inherit from wherever the picker sits and
 * `::part()` reaches the panel. Where the Popover API exists the layer is shown in the top
 * layer, which keeps it above any stacking context and unaffected by a transformed or clipping
 * ancestor; elsewhere it is a fixed-position element as before.
 *
 * The layer host has its own shadow root, so the panel's markup and styles stay apart from the
 * field's (both use classes such as `.footer` and `.action`), and events from the panel reach
 * the field's root listeners retargeted to the layer host instead of to a panel button.
 */
export type PickerLayer = {
  /** The element mounted in the picker's shadow root (the popover). */
  host: HTMLElement;
  /** Where the panel markup goes; listeners on it see the real event targets. */
  container: HTMLElement;
  /** True when `node` is the layer or inside it, including nodes retargeted to the host. */
  contains(node: Node | null | undefined): boolean;
  /**
   * Puts the layer back if the picker's first render replaced its shadow content (a picker
   * created with `open` makes its layer before it renders), and shows it again.
   */
  attach(): void;
  destroy(): void;
};

/** Parts any picker panel uses; names a panel does not have are ignored by `exportparts`. */
export const PICKER_LAYER_PARTS = ['popover', 'sheet', 'header', 'calendar', 'time', 'presets', 'footer', 'clear', 'cancel', 'apply'];

const LAYER_HOST_STYLE = [
  'position: fixed',
  'inset: 0',
  'margin: 0',
  'padding: 0',
  'border: 0',
  'inline-size: auto',
  'block-size: auto',
  'max-inline-size: none',
  'max-block-size: none',
  'overflow: visible',
  'background: transparent',
  'color: inherit',
  'pointer-events: none'
].join('; ');

export function createPickerLayer(
  owner: ShadowRoot,
  className: string,
  parts: string[] = PICKER_LAYER_PARTS
): PickerLayer {
  const host = document.createElement('div');
  host.setAttribute('data-picker-layer', '');
  host.setAttribute('exportparts', parts.join(', '));
  host.style.cssText = LAYER_HOST_STYLE;
  const shadow = host.attachShadow({ mode: 'open' });
  const container = document.createElement('div');
  container.className = className;
  shadow.appendChild(container);
  const supportsPopover = typeof (host as HTMLElement & { showPopover?: () => void }).showPopover === 'function';
  if (supportsPopover) host.setAttribute('popover', 'manual');

  const show = () => {
    if (!supportsPopover || !host.isConnected) return;
    try {
      if (!host.matches(':popover-open')) host.showPopover();
    } catch {
      // Not in a document yet: it stays a fixed-position element until the next attach().
    }
  };
  const attach = () => {
    if (host.parentNode !== owner) owner.appendChild(host);
    show();
  };
  attach();

  return {
    host,
    container,
    contains(node) {
      if (!node) return false;
      return node === host || host.contains(node) || container.contains(node);
    },
    attach,
    destroy() {
      if (supportsPopover) {
        try {
          if (host.matches(':popover-open')) host.hidePopover();
        } catch {
          // no-op
        }
      }
      host.remove();
    }
  };
}

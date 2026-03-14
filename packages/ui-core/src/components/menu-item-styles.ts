type SharedMenuItemStyleOptions = {
  scopes: string[];
  prefix: string;
  itemSelectors?: string[];
  shortcutSelectors?: string[];
  activeStateSelectors?: string[];
};

const DEFAULT_ITEM_SELECTORS = [
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '.item',
  '[data-menu-item]',
];

const DEFAULT_SHORTCUT_SELECTORS = ['.shortcut'];

function scopedSelectors(scopes: string[], selectors: string[]): string {
  return scopes
    .flatMap((scope) => selectors.map((selector) => `${scope} ${selector}`))
    .join(',\n  ');
}

function itemStateSelectors(itemSelectors: string[], pseudo: ':hover' | ':focus-visible'): string[] {
  return itemSelectors.map((selector) => `${selector}${pseudo}`);
}

function itemAttrSelectors(itemSelectors: string[], attribute: string): string[] {
  return itemSelectors.map((selector) => `${selector}${attribute}`);
}

export function createSharedMenuItemCss(options: SharedMenuItemStyleOptions): string {
  const itemSelectors = options.itemSelectors ?? DEFAULT_ITEM_SELECTORS;
  const shortcutSelectors = options.shortcutSelectors ?? DEFAULT_SHORTCUT_SELECTORS;
  const activeStateSelectors = options.activeStateSelectors ?? [];
  const prefix = options.prefix;
  const items = scopedSelectors(options.scopes, itemSelectors);
  const hoverFocus = scopedSelectors(options.scopes, [
    ...itemStateSelectors(itemSelectors, ':hover'),
    ...itemStateSelectors(itemSelectors, ':focus-visible'),
    ...activeStateSelectors,
  ]);
  const focusVisible = scopedSelectors(options.scopes, itemStateSelectors(itemSelectors, ':focus-visible'));
  const disabled = scopedSelectors(options.scopes, itemAttrSelectors(itemSelectors, '[aria-disabled="true"]'));
  const danger = scopedSelectors(options.scopes, itemAttrSelectors(itemSelectors, '[data-tone="danger"]'));
  const success = scopedSelectors(options.scopes, itemAttrSelectors(itemSelectors, '[data-tone="success"]'));
  const warning = scopedSelectors(options.scopes, itemAttrSelectors(itemSelectors, '[data-tone="warning"]'));
  const separators = scopedSelectors(options.scopes, ['.separator', '[role="separator"]']);
  const labels = scopedSelectors(options.scopes, ['.label']);
  const labelText = scopedSelectors(options.scopes, ['.label .text']);
  const labelCaption = scopedSelectors(options.scopes, ['.label .caption']);
  const sectionLabel = scopedSelectors(options.scopes, ['.section-label']);
  const icons = scopedSelectors(options.scopes, ['.icon']);
  const selectionIcons = scopedSelectors(options.scopes, ['.selection-icon']);
  const checkedCheckbox = scopedSelectors(options.scopes, ['[role="menuitemcheckbox"][aria-checked="true"] .selection-icon::before']);
  const checkedRadio = scopedSelectors(options.scopes, ['[role="menuitemradio"][aria-checked="true"] .selection-icon::before']);
  const shortcuts = scopedSelectors(options.scopes, shortcutSelectors);
  const submenuArrow = scopedSelectors(options.scopes, ['.submenu-arrow']);

  return `
  ${sectionLabel} {
    padding: 6px 10px 4px;
    color: color-mix(in srgb, var(${prefix}-color, #0f172a) 54%, transparent);
    font: 600 11px/1.4 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  ${separators} {
    height: 1px;
    margin: var(${prefix}-separator-margin, 6px 10px);
    background: color-mix(in srgb, var(${prefix}-border-color, rgba(15, 23, 42, 0.14)) 86%, transparent);
    border-radius: 999px;
  }

  ${items} {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(${prefix}-item-gap, 10px);
    inline-size: 100%;
    min-height: var(${prefix}-item-min-height, 36px);
    padding: var(${prefix}-item-pad-y, 8px) var(${prefix}-item-pad-x, 10px);
    border-radius: var(${prefix}-item-radius, 8px);
    box-sizing: border-box;
    color: inherit;
    font: var(${prefix}-item-font-weight, 400) var(${prefix}-item-font-size, 14px)/var(${prefix}-item-line-height, 20px) Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    letter-spacing: var(--ui-default-letter-spacing, 0em);
    outline: none;
    cursor: default;
    scroll-margin: var(${prefix}-padding, 6px) 0;
    user-select: none;
    transition:
      background-color 130ms ease,
      box-shadow 130ms ease,
      color 130ms ease,
      transform 130ms ease;
  }

  ${hoverFocus} {
    background: var(${prefix}-item-hover-bg);
    color: var(${prefix}-item-active-color, inherit);
  }

  ${focusVisible} {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(${prefix}-ring, #2563eb) 42%, transparent);
  }

  ${disabled} {
    opacity: 0.46;
    pointer-events: none;
  }

  ${danger} {
    color: #dc2626;
  }

  ${success} {
    color: #15803d;
  }

  ${warning} {
    color: #b45309;
  }

  ${icons} {
    display: inline-grid;
    place-items: center;
    inline-size: 16px;
    block-size: 16px;
    flex: 0 0 16px;
    color: color-mix(in srgb, currentColor 72%, transparent);
  }

  ${selectionIcons} {
    position: relative;
    display: inline-grid;
    place-items: center;
    inline-size: 16px;
    block-size: 16px;
    flex: 0 0 16px;
    border-radius: 999px;
    color: currentColor;
    opacity: 0;
  }

  ${checkedCheckbox} {
    content: '';
    inline-size: 8px;
    block-size: 8px;
    border-radius: 2px;
    background: currentColor;
  }

  ${checkedRadio} {
    content: '';
    inline-size: 8px;
    block-size: 8px;
    border-radius: 999px;
    background: currentColor;
  }

  ${scopedSelectors(options.scopes, [
    '[role="menuitemcheckbox"][aria-checked="true"] .selection-icon',
    '[role="menuitemradio"][aria-checked="true"] .selection-icon'
  ])} {
    opacity: 1;
  }

  ${labels} {
    min-width: 0;
    display: grid;
    flex: 1 1 auto;
    overflow: hidden;
    gap: 1px;
  }

  ${labelText} {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: inherit;
    line-height: inherit;
    letter-spacing: inherit;
  }

  ${labelCaption} {
    color: color-mix(in srgb, currentColor 58%, transparent);
    font-size: calc(var(${prefix}-item-font-size, 14px) - 1px);
    line-height: 1.35;
    letter-spacing: inherit;
  }

  ${shortcuts} {
    margin-left: auto;
    padding-left: 14px;
    flex: 0 0 auto;
    min-width: max-content;
    color: color-mix(in srgb, currentColor 54%, transparent);
    font-size: calc(var(${prefix}-item-font-size, 14px) - 1px);
    line-height: 1;
    letter-spacing: inherit;
    white-space: nowrap;
  }

  ${submenuArrow} {
    margin-left: 6px;
    flex: 0 0 auto;
    color: color-mix(in srgb, currentColor 54%, transparent);
    font-size: 12px;
  }
`;
}

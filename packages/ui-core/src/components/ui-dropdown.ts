import { ElementBase } from '../ElementBase';
import { createSharedMenuItemCss } from './menu-item-styles';

type DropdownPlacement = 'top' | 'bottom' | 'left' | 'right';
type DropdownCloseReason = 'outside' | 'escape' | 'select' | 'trigger' | 'tab' | 'programmatic' | 'disabled';

type DropdownItem = HTMLElement & { disabled?: boolean };

export type UIDropdownChangeDetail = {
  open: boolean;
  reason?: DropdownCloseReason;
};

export type UIDropdownSelectDetail = {
  value?: string;
  label?: string;
  checked?: boolean;
  item?: HTMLElement;
};

export type UIDropdownRequestCloseDetail = {
  reason: DropdownCloseReason;
};

const ITEM_SELECTOR = [
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '.item',
  '[data-menu-item]'
].join(', ');

const style = `
  :host {
    --ui-dropdown-bg: var(
      --ui-dropdown-menu-bg,
      var(--base-dropdown-bg, color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent))
    );
    --ui-dropdown-color: var(--ui-dropdown-menu-color, var(--base-dropdown-color, var(--ui-color-text, #0f172a)));
    --ui-dropdown-muted: var(--ui-dropdown-menu-muted, color-mix(in srgb, var(--ui-dropdown-color) 62%, transparent));
    --ui-dropdown-border-color: var(
      --ui-dropdown-menu-border-color,
      color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.14)) 86%, transparent)
    );
    --ui-dropdown-border: var(--ui-dropdown-menu-border, var(--base-dropdown-border, 1px solid var(--ui-dropdown-border-color)));
    --ui-dropdown-shadow: var(--ui-dropdown-menu-shadow, var(--base-dropdown-shadow, 0 10px 24px rgba(15, 23, 42, 0.14)));
    --ui-dropdown-radius: var(--ui-dropdown-menu-radius, var(--base-dropdown-radius, var(--ui-radius, 4px)));
    --ui-dropdown-padding: var(--ui-dropdown-menu-padding, var(--base-dropdown-content-padding, 0px));
    --ui-dropdown-min-width: var(--ui-dropdown-menu-min-width, var(--base-dropdown-min-width, 224px));
    --ui-dropdown-gap: 8px;
    --ui-dropdown-ring: var(--ui-dropdown-menu-ring, var(--ui-color-primary, #2563eb));
    --ui-dropdown-backdrop: none;
    --ui-dropdown-item-radius: var(--base-dropdown-item-radius, 0px);
    --ui-dropdown-item-gap: var(--base-dropdown-item-gap, 10px);
    --ui-dropdown-item-min-height: var(--base-dropdown-item-height, 36px);
    --ui-dropdown-item-pad-y: var(--base-dropdown-item-padding-y, 8px);
    --ui-dropdown-item-pad-x: var(--base-dropdown-item-padding-x, 12px);
    --ui-dropdown-item-font-size: var(--base-dropdown-item-font-size, var(--ui-default-font-size, 14px));
    --ui-dropdown-item-font-weight: 500;
    --ui-dropdown-item-line-height: var(--base-dropdown-item-line-height, var(--ui-default-line-height, 20px));
    --ui-dropdown-separator-margin: var(--base-dropdown-separator-margin, 6px 10px);
    --ui-dropdown-item-hover-bg: color-mix(in srgb, var(--ui-dropdown-ring) 10%, transparent);
    --ui-dropdown-item-active-bg: color-mix(in srgb, var(--ui-dropdown-ring) 15%, transparent);
    --ui-dropdown-item-checked-bg: color-mix(in srgb, var(--ui-dropdown-ring) 13%, transparent);
    --ui-dropdown-item-active-color: color-mix(in srgb, var(--ui-dropdown-color) 92%, #020617 8%);
    --ui-dropdown-item-secondary-active-color: color-mix(in srgb, var(--ui-dropdown-item-active-color) 78%, transparent);
    --ui-dropdown-duration: var(--ui-motion-short, 150ms);
    --ui-dropdown-easing: var(--ui-motion-easing, cubic-bezier(0.2, 0.8, 0.2, 1));
    --ui-dropdown-available-width: calc(100vw - 16px);
    --ui-dropdown-available-height: 440px;
    color-scheme: light dark;
    display: inline-grid;
    min-inline-size: 0;
    position: relative;
    isolation: isolate;
    z-index: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  :host([open]) {
    z-index: 40;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.62;
  }

  .root {
    min-inline-size: 0;
    position: relative;
    display: inline-grid;
  }

  .trigger {
    display: inline-flex;
    width: fit-content;
    min-inline-size: 0;
  }

  .content-slot {
    display: none !important;
  }

  .panel {
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: calc(100% + var(--ui-dropdown-gap));
    z-index: 24;
    pointer-events: auto;
    inline-size: max-content;
    min-inline-size: max(100%, var(--ui-dropdown-min-width));
  }

  .panel[hidden] {
    display: none;
  }

  .panel[data-placement="top"] {
    inset-block-start: auto;
    inset-block-end: calc(100% + var(--ui-dropdown-gap));
  }

  .panel[data-placement="right"] {
    inset-block-start: 0;
    inset-inline-start: calc(100% + var(--ui-dropdown-gap));
  }

  .panel[data-placement="left"] {
    inset-block-start: 0;
    inset-inline-start: auto;
    inset-inline-end: calc(100% + var(--ui-dropdown-gap));
  }

  .menu {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
    min-inline-size: 100%;
    max-inline-size: min(var(--ui-dropdown-available-width), calc(100vw - 16px));
    max-block-size: min(440px, var(--ui-dropdown-available-height));
    padding: var(--ui-dropdown-padding);
    border: var(--ui-dropdown-border);
    border-radius: var(--ui-dropdown-radius);
    box-sizing: border-box;
    overflow: auto;
    isolation: isolate;
    background: var(--ui-dropdown-bg);
    color: var(--ui-dropdown-color);
    box-shadow: var(--ui-dropdown-shadow);
    outline: none;
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--ui-dropdown-border-color) 82%, transparent) transparent;
    scrollbar-gutter: auto;
  }

  .menu::-webkit-scrollbar {
    width: 8px;
  }

  .menu::-webkit-scrollbar-track {
    background: transparent;
  }

  .menu::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--ui-dropdown-border-color) 82%, transparent);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  .menu:hover::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--ui-dropdown-ring) 28%, var(--ui-dropdown-border-color));
    background-clip: padding-box;
  }

  .menu[data-size='sm'],
  .menu[data-density='compact'] {
    --ui-dropdown-item-gap: 8px;
    --ui-dropdown-item-min-height: 32px;
    --ui-dropdown-item-pad-y: 6px;
    --ui-dropdown-item-pad-x: 8px;
    --ui-dropdown-item-font-size: 13px;
    --ui-dropdown-item-line-height: 18px;
    --ui-dropdown-separator-margin: 4px 8px;
  }

  .menu[data-size='lg'],
  .menu[data-density='comfortable'] {
    --ui-dropdown-item-gap: 12px;
    --ui-dropdown-item-min-height: 40px;
    --ui-dropdown-item-pad-y: 9px;
    --ui-dropdown-item-pad-x: 12px;
    --ui-dropdown-item-font-size: 15px;
    --ui-dropdown-item-line-height: 22px;
    --ui-dropdown-separator-margin: 8px 12px;
  }

  .menu[data-elevation='none'] {
    --ui-dropdown-shadow: none;
  }

  .menu[data-elevation='low'] {
    --ui-dropdown-shadow: 0 10px 24px rgba(2, 6, 23, 0.14);
  }

  .menu[data-elevation='high'] {
    --ui-dropdown-shadow: 0 16px 36px rgba(2, 6, 23, 0.18);
  }

  .menu[data-variant='soft'] {
    --ui-dropdown-bg: color-mix(in srgb, var(--base-dropdown-bg, var(--color-panel-solid, #ffffff)) 94%, var(--accent-surface, transparent));
  }

  .menu[data-variant='filled'] {
    --ui-dropdown-bg: color-mix(in srgb, var(--ui-dropdown-ring) 8%, var(--base-dropdown-bg, var(--color-panel-solid, #ffffff)));
    --ui-dropdown-border-color: color-mix(in srgb, var(--ui-dropdown-ring) 24%, var(--ui-dropdown-border-color));
  }

  .menu[data-variant='outline'] {
    --ui-dropdown-shadow: none;
    --ui-dropdown-border-color: color-mix(in srgb, var(--ui-dropdown-ring) 34%, var(--ui-dropdown-border-color));
  }

  .menu[data-variant='line'] {
    --ui-dropdown-shadow: none;
    --ui-dropdown-padding: 0px;
    --ui-dropdown-item-radius: 0px;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    background: color-mix(in srgb, var(--ui-dropdown-bg) 98%, transparent);
  }

  .menu[data-variant='flat'],
  .menu[data-variant='minimal'],
  .menu[data-variant='ghost'] {
    --ui-dropdown-shadow: none;
  }

  .menu[data-variant='glass'] {
    --ui-dropdown-bg: color-mix(in srgb, var(--base-dropdown-bg, var(--color-panel-solid, #ffffff)) 94%, white 6%);
    --ui-dropdown-border-color: color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.14)) 70%, transparent);
    --ui-dropdown-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
  }

  .menu[data-variant='solid'] {
    --ui-dropdown-bg: var(--ui-dropdown-ring);
    --ui-dropdown-color: var(--ui-color-foreground-on-primary, #ffffff);
    --ui-dropdown-muted: color-mix(in srgb, var(--ui-color-foreground-on-primary, #ffffff) 72%, transparent);
    --ui-dropdown-border-color: color-mix(in srgb, var(--ui-dropdown-ring) 76%, #0f172a 24%);
    --ui-dropdown-item-active-color: color-mix(in srgb, #0f172a 82%, var(--ui-color-foreground-on-primary, #ffffff) 18%);
    --ui-dropdown-item-secondary-active-color: color-mix(in srgb, #0f172a 62%, var(--ui-color-foreground-on-primary, #ffffff) 38%);
    --ui-dropdown-item-hover-bg: color-mix(in srgb, #ffffff 12%, transparent);
    --ui-dropdown-item-active-bg: color-mix(in srgb, #ffffff 18%, transparent);
    --ui-dropdown-item-checked-bg: color-mix(in srgb, #ffffff 16%, transparent);
  }

  .menu[data-variant='contrast'] {
    --ui-dropdown-bg: #0f172a;
    --ui-dropdown-color: #f8fafc;
    --ui-dropdown-muted: #94a3b8;
    --ui-dropdown-border-color: #334155;
    --ui-dropdown-ring: #93c5fd;
    --ui-dropdown-item-active-color: #f8fafc;
    --ui-dropdown-item-secondary-active-color: color-mix(in srgb, #f8fafc 82%, transparent);
    --ui-dropdown-item-hover-bg: color-mix(in srgb, #ffffff 12%, transparent);
    --ui-dropdown-item-active-bg: color-mix(in srgb, #ffffff 18%, transparent);
    --ui-dropdown-item-checked-bg: color-mix(in srgb, #ffffff 16%, transparent);
  }

  .menu[data-tone='info'] {
    --ui-dropdown-ring: var(--ui-color-primary, #2563eb);
  }

  .menu[data-tone='neutral'] {
    --ui-dropdown-ring: color-mix(in srgb, var(--ui-color-muted, #64748b) 60%, var(--ui-dropdown-color));
  }

  .menu[data-tone='danger'] {
    --ui-dropdown-ring: var(--ui-color-danger, #dc2626);
    --ui-dropdown-item-hover-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 12%, transparent);
    --ui-dropdown-item-active-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 18%, transparent);
    --ui-dropdown-item-checked-bg: color-mix(in srgb, var(--ui-color-danger, #dc2626) 16%, transparent);
  }

  .menu[data-tone='success'] {
    --ui-dropdown-ring: var(--ui-color-success, #16a34a);
    --ui-dropdown-item-hover-bg: color-mix(in srgb, var(--ui-color-success, #16a34a) 12%, transparent);
    --ui-dropdown-item-active-bg: color-mix(in srgb, var(--ui-color-success, #16a34a) 18%, transparent);
    --ui-dropdown-item-checked-bg: color-mix(in srgb, var(--ui-color-success, #16a34a) 16%, transparent);
  }

  .menu[data-tone='warning'] {
    --ui-dropdown-ring: var(--ui-color-warning, #d97706);
    --ui-dropdown-item-hover-bg: color-mix(in srgb, var(--ui-color-warning, #d97706) 15%, transparent);
    --ui-dropdown-item-active-bg: color-mix(in srgb, var(--ui-color-warning, #d97706) 20%, transparent);
    --ui-dropdown-item-checked-bg: color-mix(in srgb, var(--ui-color-warning, #d97706) 17%, transparent);
  }

  ${createSharedMenuItemCss({
    scopes: ['.menu'],
    prefix: '--ui-dropdown',
    shortcutSelectors: ['.shortcut', '.meta'],
    activeStateSelectors: [
      '.item[data-active="true"]',
      '[role="menuitem"][data-active="true"]',
      '[role="menuitemcheckbox"][data-active="true"]',
      '[role="menuitemradio"][data-active="true"]',
      '[data-menu-item][data-active="true"]'
    ]
  })}

  .menu [role='menuitem'],
  .menu [role='menuitemcheckbox'],
  .menu [role='menuitemradio'],
  .menu .item,
  .menu [data-menu-item] {
    justify-content: space-between;
    border: 1px solid transparent;
    border-radius: var(--ui-dropdown-item-radius);
    background: transparent;
    box-shadow: none;
    --ui-box-radius: var(--ui-dropdown-item-radius);
    --ui-box-border: none;
    --ui-box-border-color: transparent;
    --ui-box-shadow: none;
    --ui-box-bg: transparent;
    --ui-box-color: inherit;
    --ui-box-backdrop: none;
    transition:
      background-color 120ms ease,
      border-color 120ms ease,
      color 120ms ease;
  }

  .menu [role='menuitemcheckbox'],
  .menu [role='menuitemradio'] {
    justify-content: flex-start;
  }

  .menu [role='menuitemcheckbox'][aria-checked='true'],
  .menu [role='menuitemradio'][aria-checked='true'],
  .menu .item[aria-checked='true'],
  .menu [data-menu-item][aria-checked='true'] {
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-dropdown-ring) 18%, transparent) 0%,
      color-mix(in srgb, var(--ui-dropdown-ring) 12%, transparent) 100%
    );
    border-color: color-mix(in srgb, var(--ui-dropdown-ring) 30%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-dropdown-ring) 12%, transparent);
    color: var(--ui-dropdown-item-active-color);
  }

  .menu [role='menuitemcheckbox'][aria-checked='true'] .label .caption,
  .menu [role='menuitemradio'][aria-checked='true'] .label .caption,
  .menu .item[aria-checked='true'] .label .caption,
  .menu [data-menu-item][aria-checked='true'] .label .caption,
  .menu [role='menuitemcheckbox'][aria-checked='true'] .shortcut,
  .menu [role='menuitemradio'][aria-checked='true'] .shortcut,
  .menu .item[aria-checked='true'] .shortcut,
  .menu [data-menu-item][aria-checked='true'] .shortcut,
  .menu [role='menuitemcheckbox'][aria-checked='true'] .meta,
  .menu [role='menuitemradio'][aria-checked='true'] .meta,
  .menu .item[aria-checked='true'] .meta,
  .menu [data-menu-item][aria-checked='true'] .meta,
  .menu [role='menuitemcheckbox'][aria-checked='true'] .icon,
  .menu [role='menuitemradio'][aria-checked='true'] .icon,
  .menu .item[aria-checked='true'] .icon,
  .menu [data-menu-item][aria-checked='true'] .icon,
  .menu [role='menuitemcheckbox'][aria-checked='true'] .submenu-arrow,
  .menu [role='menuitemradio'][aria-checked='true'] .submenu-arrow,
  .menu .item[aria-checked='true'] .submenu-arrow,
  .menu [data-menu-item][aria-checked='true'] .submenu-arrow {
    color: var(--ui-dropdown-item-secondary-active-color);
  }

  .menu [role='menuitem']:hover,
  .menu [role='menuitemcheckbox']:hover,
  .menu [role='menuitemradio']:hover,
  .menu .item:hover,
  .menu [data-menu-item]:hover,
  .menu [role='menuitem'][data-active='true'],
  .menu [role='menuitemcheckbox'][data-active='true'],
  .menu [role='menuitemradio'][data-active='true'],
  .menu .item[data-active='true'],
  .menu [data-menu-item][data-active='true'] {
    background: var(--ui-dropdown-item-hover-bg);
    border-color: color-mix(in srgb, var(--ui-dropdown-ring) 24%, transparent);
  }

  .menu [role='menuitem'][data-active='true'],
  .menu [role='menuitemcheckbox'][data-active='true'],
  .menu [role='menuitemradio'][data-active='true'],
  .menu .item[data-active='true'],
  .menu [data-menu-item][data-active='true'] {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-dropdown-ring) 12%, transparent);
  }

  .menu [role='menuitem']:hover .label .caption,
  .menu [role='menuitemcheckbox']:hover .label .caption,
  .menu [role='menuitemradio']:hover .label .caption,
  .menu .item:hover .label .caption,
  .menu [data-menu-item]:hover .label .caption,
  .menu [role='menuitem'][data-active='true'] .label .caption,
  .menu [role='menuitemcheckbox'][data-active='true'] .label .caption,
  .menu [role='menuitemradio'][data-active='true'] .label .caption,
  .menu .item[data-active='true'] .label .caption,
  .menu [data-menu-item][data-active='true'] .label .caption,
  .menu [role='menuitem']:hover .shortcut,
  .menu [role='menuitemcheckbox']:hover .shortcut,
  .menu [role='menuitemradio']:hover .shortcut,
  .menu .item:hover .shortcut,
  .menu [data-menu-item]:hover .shortcut,
  .menu [role='menuitem'][data-active='true'] .shortcut,
  .menu [role='menuitemcheckbox'][data-active='true'] .shortcut,
  .menu [role='menuitemradio'][data-active='true'] .shortcut,
  .menu .item[data-active='true'] .shortcut,
  .menu [data-menu-item][data-active='true'] .shortcut,
  .menu [role='menuitem']:hover .meta,
  .menu [role='menuitemcheckbox']:hover .meta,
  .menu [role='menuitemradio']:hover .meta,
  .menu .item:hover .meta,
  .menu [data-menu-item]:hover .meta,
  .menu [role='menuitem'][data-active='true'] .meta,
  .menu [role='menuitemcheckbox'][data-active='true'] .meta,
  .menu [role='menuitemradio'][data-active='true'] .meta,
  .menu .item[data-active='true'] .meta,
  .menu [data-menu-item][data-active='true'] .meta,
  .menu [role='menuitem']:hover .icon,
  .menu [role='menuitemcheckbox']:hover .icon,
  .menu [role='menuitemradio']:hover .icon,
  .menu .item:hover .icon,
  .menu [data-menu-item]:hover .icon,
  .menu [role='menuitem'][data-active='true'] .icon,
  .menu [role='menuitemcheckbox'][data-active='true'] .icon,
  .menu [role='menuitemradio'][data-active='true'] .icon,
  .menu .item[data-active='true'] .icon,
  .menu [data-menu-item][data-active='true'] .icon,
  .menu [role='menuitem']:hover .submenu-arrow,
  .menu [role='menuitemcheckbox']:hover .submenu-arrow,
  .menu [role='menuitemradio']:hover .submenu-arrow,
  .menu .item:hover .submenu-arrow,
  .menu [data-menu-item]:hover .submenu-arrow,
  .menu [role='menuitem'][data-active='true'] .submenu-arrow,
  .menu [role='menuitemcheckbox'][data-active='true'] .submenu-arrow,
  .menu [role='menuitemradio'][data-active='true'] .submenu-arrow,
  .menu .item[data-active='true'] .submenu-arrow,
  .menu [data-menu-item][data-active='true'] .submenu-arrow {
    color: var(--ui-dropdown-item-secondary-active-color);
  }

  .menu [role='menuitem']:focus-visible,
  .menu [role='menuitemcheckbox']:focus-visible,
  .menu [role='menuitemradio']:focus-visible,
  .menu .item:focus-visible,
  .menu [data-menu-item]:focus-visible {
    border-color: color-mix(in srgb, var(--ui-dropdown-ring) 30%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-dropdown-ring) 18%, transparent);
  }

  .menu [role='menuitemcheckbox']:active,
  .menu [role='menuitemradio']:active,
  .menu [role='menuitem']:active,
  .menu .item:active,
  .menu [data-menu-item]:active {
    background: var(--ui-dropdown-item-active-bg);
  }

  .menu .description {
    margin-top: 2px;
    color: var(--ui-dropdown-muted);
    font-size: calc(var(--ui-dropdown-item-font-size) - 1px);
    line-height: 1.35;
    white-space: normal;
  }

  .menu [aria-disabled='true'],
  .menu [disabled] {
    opacity: 0.46;
    pointer-events: none;
  }

  .menu .empty-state {
    padding: 10px 12px;
    font: 500 12px/1.45 Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    letter-spacing: 0.01em;
    color: var(--ui-dropdown-muted);
  }

  @media (prefers-contrast: more) {
    .menu {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    .menu {
      forced-color-adjust: none;
      border-color: CanvasText;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
    }

    .menu [role='menuitem'],
    .menu [role='menuitemcheckbox'],
    .menu [role='menuitemradio'],
    .menu .item,
    .menu [data-menu-item],
    .menu .empty-state {
      border: 1px solid transparent;
      background: Canvas;
      color: CanvasText;
    }

    .menu [role='menuitem']:hover,
    .menu [role='menuitem']:focus-visible,
    .menu [role='menuitemcheckbox']:hover,
    .menu [role='menuitemcheckbox']:focus-visible,
    .menu [role='menuitemradio']:hover,
    .menu [role='menuitemradio']:focus-visible,
    .menu .item:hover,
    .menu .item:focus-visible,
    .menu [data-menu-item]:hover,
    .menu [data-menu-item]:focus-visible {
      background: Highlight;
      color: HighlightText;
    }
  }
`;

function normalizePlacement(value: string | null): DropdownPlacement {
  if (value === 'top' || value === 'left' || value === 'right') return value;
  return 'bottom';
}

function normalizeDropdownSize(value: string | null): 'sm' | 'md' | 'lg' {
  const normalized = (value || '').trim().toLowerCase();
  if (normalized === 'sm' || normalized === '1' || normalized === 'compact') return 'sm';
  if (normalized === 'lg' || normalized === '3' || normalized === 'comfortable') return 'lg';
  return 'md';
}

function normalizeDropdownRadius(value: string | null): string | null {
  const normalized = (value || '').trim().toLowerCase();
  if (!normalized || normalized === 'default') return null;
  if (normalized === 'none') return '0px';
  if (normalized === 'sm') return '8px';
  if (normalized === 'md') return '12px';
  if (normalized === 'lg' || normalized === 'large') return '16px';
  if (normalized === 'full' || normalized === 'pill') return '999px';
  if (normalized === 'square') return '6px';
  if (normalized === 'soft' || normalized === 'rounded') return '14px';
  if (/^\d+(\.\d+)?$/.test(normalized)) return `${normalized}px`;
  if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(normalized)) return normalized;
  return value;
}

function readVariantValue(host: HTMLElement, name: string): string {
  return host.getAttribute(name) || '';
}

function toBool(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = raw.trim().toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function isDisabledItem(item: DropdownItem): boolean {
  return item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true' || item.disabled === true;
}

function getItemLabel(item: DropdownItem): string {
  return (item.getAttribute('aria-label') || item.textContent || '').trim();
}

function focusWithoutScroll(target: HTMLElement | null): void {
  if (!target) return;
  try {
    target.focus({ preventScroll: true });
  } catch {
    target.focus();
  }
}

function scrollItemIntoContainer(item: HTMLElement, container: HTMLElement): void {
  const itemTop = item.offsetTop;
  const itemBottom = itemTop + item.offsetHeight;
  const viewTop = container.scrollTop;
  const viewBottom = viewTop + container.clientHeight;

  if (itemTop < viewTop) {
    container.scrollTop = itemTop;
    return;
  }

  if (itemBottom > viewBottom) {
    container.scrollTop = Math.max(0, itemBottom - container.clientHeight);
  }
}

function cloneContentTree(source: HTMLElement): HTMLElement {
  return cloneNodeForMenu(source) as HTMLElement;
}

function cloneNodeForMenu(node: Node): Node {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent || '');
  }

  if (!(node instanceof HTMLElement)) {
    return node.cloneNode(false);
  }

  const isBoxHost = node.tagName === 'UI-BOX';
  const clone = document.createElement(isBoxHost ? 'div' : node.tagName.toLowerCase());

  Array.from(node.attributes).forEach((attr) => {
    if (attr.name === 'slot') return;
    clone.setAttribute(attr.name, attr.value);
  });

  Array.from(node.childNodes).forEach((child) => {
    clone.appendChild(cloneNodeForMenu(child));
  });

  return clone;
}

function nextEnabledIndex(items: DropdownItem[], startIndex: number, step: 1 | -1): number {
  for (let index = startIndex + step; index >= 0 && index < items.length; index += step) {
    if (!isDisabledItem(items[index])) return index;
  }
  return -1;
}

function resolveTypeaheadMatch(items: DropdownItem[], query: string, current: DropdownItem | null): DropdownItem | null {
  if (!query) return null;
  const enabled = items.filter((item) => !isDisabledItem(item));
  if (!enabled.length) return null;

  const currentIndex = current ? enabled.indexOf(current) : -1;
  for (let offset = 1; offset <= enabled.length; offset += 1) {
    const item = enabled[(currentIndex + offset + enabled.length) % enabled.length];
    if (getItemLabel(item).toLowerCase().startsWith(query)) return item;
  }

  return null;
}

const DROPDOWN_VISUAL_ATTRS = new Set(['variant', 'density', 'shape', 'elevation', 'tone', 'size', 'radius']);
const DROPDOWN_A11Y_ATTRS = new Set(['aria-label', 'aria-labelledby', 'aria-describedby']);
const DROPDOWN_TOKEN_NAMES = [
  '--ui-dropdown-bg',
  '--ui-dropdown-color',
  '--ui-dropdown-muted',
  '--ui-dropdown-border-color',
  '--ui-dropdown-border',
  '--ui-dropdown-shadow',
  '--ui-dropdown-radius',
  '--ui-dropdown-padding',
  '--ui-dropdown-min-width',
  '--ui-dropdown-gap',
  '--ui-dropdown-ring',
  '--ui-dropdown-backdrop',
  '--ui-dropdown-item-radius',
  '--ui-dropdown-item-font-weight',
  '--ui-dropdown-item-hover-bg',
  '--ui-dropdown-item-active-bg',
  '--ui-dropdown-item-checked-bg',
  '--ui-dropdown-item-active-color',
  '--ui-dropdown-duration',
  '--ui-dropdown-easing'
];

export class UIDropdown extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'disabled',
      'placement',
      'variant',
      'size',
      'density',
      'radius',
      'shape',
      'elevation',
      'tone',
      'close-on-select',
      'close-on-scroll',
      'typeahead',
      'aria-label',
      'aria-labelledby',
      'aria-describedby'
    ];
  }

  private _isOpen = false;
  private _panelEl: HTMLElement | null = null;
  private _portalEl: HTMLElement | null = null;
  private _menuId: string;
  private _triggerId: string;
  private _restoreFocusEl: HTMLElement | null = null;
  private _typeaheadBuffer = '';
  private _typeaheadTimer: number | null = null;
  private _placement: DropdownPlacement = 'bottom';
  private _openListenersBound = false;
  private _openFrame = 0;
  private _checkboxState = new Map<number, boolean>();
  private _radioState = new Map<string, number>();

  constructor() {
    super();
    this._menuId = `ui-dropdown-menu-${Math.random().toString(36).slice(2, 10)}`;
    this._triggerId = `ui-dropdown-trigger-${Math.random().toString(36).slice(2, 10)}`;
    this._onHostClick = this._onHostClick.bind(this);
    this._onHostKeyDown = this._onHostKeyDown.bind(this);
    this._onDocumentPointerDown = this._onDocumentPointerDown.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._onHostClick);
    this.addEventListener('keydown', this._onHostKeyDown as EventListener);
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);
    this._syncOpenState();
    this._syncTriggerA11y();
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this._onHostClick);
    this.removeEventListener('keydown', this._onHostKeyDown as EventListener);
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._teardownOpenListeners();
    if (this._openFrame) cancelAnimationFrame(this._openFrame);
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'open') {
      this._syncOpenState();
      return;
    }

    if (name === 'close-on-select' || name === 'close-on-scroll' || name === 'typeahead') return;

    if (name === 'disabled') {
      if (this.hasAttribute('disabled') && this._isOpen) this.close('disabled');
      this._syncTriggerA11y();
      return;
    }

    if (this._isOpen && (name === 'placement' || DROPDOWN_VISUAL_ATTRS.has(name))) {
      this._syncMenuPresentation();
      this._schedulePanelSync();
      return;
    }

    if (this._isOpen && DROPDOWN_A11Y_ATTRS.has(name)) {
      this._syncMenuA11y();
    }
  }

  open(): void {
    if (this.hasAttribute('disabled')) return;
    if (!this.hasAttribute('open')) this.setAttribute('open', '');
  }

  close(reason: DropdownCloseReason = 'programmatic'): void {
    if (!this.hasAttribute('open') && !this._isOpen) return;
    this._close(reason);
  }

  closeDropdown(reason: DropdownCloseReason = 'programmatic'): void {
    if (!this.hasAttribute('open') && !this._isOpen) return;
    if (reason === 'programmatic') {
      this.close(reason);
      return;
    }
    this._requestClose(reason);
  }

  toggle(): void {
    if (this._isOpen) {
      this._requestClose('trigger');
      return;
    }
    this.open();
  }

  get closeOnSelect(): boolean {
    return toBool(this.getAttribute('close-on-select'), true);
  }

  set closeOnSelect(value: boolean) {
    this.setAttribute('close-on-select', value ? 'true' : 'false');
  }

  get closeOnScroll(): boolean {
    return toBool(this.getAttribute('close-on-scroll'), true);
  }

  set closeOnScroll(value: boolean) {
    this.setAttribute('close-on-scroll', value ? 'true' : 'false');
  }

  get typeahead(): boolean {
    return toBool(this.getAttribute('typeahead'), true);
  }

  set typeahead(value: boolean) {
    this.setAttribute('typeahead', value ? 'true' : 'false');
  }

  private _getTrigger(): HTMLElement | null {
    return this.querySelector('[slot="trigger"]') as HTMLElement | null;
  }

  private _getContentSource(): HTMLElement | null {
    return this.querySelector('[slot="content"]') as HTMLElement | null;
  }

  private _getMenu(): HTMLElement | null {
    return this._portalEl;
  }

  private _isFocusable(node: HTMLElement): boolean {
    if (!node || !node.isConnected) return false;
    if ((node as HTMLButtonElement).disabled) return false;
    if (node.getAttribute('aria-hidden') === 'true') return false;
    if (!isBrowser()) return true;
    const computed = window.getComputedStyle(node);
    return computed.display !== 'none' && computed.visibility !== 'hidden';
  }

  private _currentFocusedItem(): DropdownItem | null {
    const active = ((this.root as ShadowRoot & { activeElement?: Element | null }).activeElement ||
      document.activeElement) as Element | null;
    if (!(active instanceof HTMLElement)) return null;
    return active.closest(ITEM_SELECTOR) as DropdownItem | null;
  }

  private _queryItems(includeDisabled = true): DropdownItem[] {
    const menu = this._getMenu();
    if (!menu) return [];
    const items = Array.from(menu.querySelectorAll<DropdownItem>(ITEM_SELECTOR));
    return includeDisabled ? items : items.filter((item) => !isDisabledItem(item));
  }

  private _requestClose(reason: DropdownCloseReason): void {
    if (!this._isOpen) return;

    const requestClose = new CustomEvent<UIDropdownRequestCloseDetail>('request-close', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    this.dispatchEvent(requestClose);

    const uiRequestClose = new CustomEvent<UIDropdownRequestCloseDetail>('ui-request-close', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    this.dispatchEvent(uiRequestClose);

    if (requestClose.defaultPrevented || uiRequestClose.defaultPrevented) return;
    this.close(reason);
  }

  private _close(reason: DropdownCloseReason, options: { restoreFocus?: boolean } = {}): void {
    if (this._openFrame) cancelAnimationFrame(this._openFrame);
    this._openFrame = 0;
    this._isOpen = false;
    this._teardownOpenListeners();
    if (this.hasAttribute('open')) this.removeAttribute('open');
    this._syncControlState();
    this._syncTriggerA11y();
    this._clearActiveItem();
    this._clearMenuContent();
    this._resetTypeahead();

    this.dispatchEvent(
      new CustomEvent<UIDropdownChangeDetail>('change', {
        bubbles: true,
        composed: true,
        detail: { open: false, reason }
      })
    );
    this.dispatchEvent(
      new CustomEvent<{ reason: DropdownCloseReason }>('close', {
        bubbles: true,
        composed: true,
        detail: { reason }
      })
    );

    if (options.restoreFocus !== false) {
      const trigger = this._getTrigger();
      if (trigger && this._isFocusable(trigger)) focusWithoutScroll(trigger);
      else if (this._restoreFocusEl && this._isFocusable(this._restoreFocusEl)) focusWithoutScroll(this._restoreFocusEl);
    }

    this._restoreFocusEl = null;
  }

  private _syncOpenState(): void {
    const nextOpen = this.hasAttribute('open') && !this.hasAttribute('disabled');
    if (nextOpen === this._isOpen) {
      this._syncControlState();
      this._syncTriggerA11y();
      if (nextOpen) {
        this._syncMenuPresentation();
        this._syncMenuA11y();
        this._schedulePanelSync();
      }
      return;
    }

    if (nextOpen) {
      this._isOpen = true;
      this._restoreFocusEl = document.activeElement as HTMLElement | null;
      this._renderMenuContent();
      this._syncMenuPresentation();
      this._syncMenuA11y();
      this._syncControlState();
      this._syncTriggerA11y();
      this._attachOpenListeners();

      this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
      this.dispatchEvent(
        new CustomEvent<UIDropdownChangeDetail>('change', {
          bubbles: true,
          composed: true,
          detail: { open: true }
        })
      );

      this._schedulePanelSync('first');
      return;
    }

    this._close('programmatic', { restoreFocus: false });
  }

  private _attachOpenListeners(): void {
    if (this._openListenersBound) return;
    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    this._openListenersBound = true;
  }

  private _teardownOpenListeners(): void {
    if (!this._openListenersBound) return;
    document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    this._openListenersBound = false;
  }

  private _syncTriggerA11y(): void {
    const trigger = this._getTrigger();
    if (!trigger) return;

    if (!trigger.id) trigger.id = this._triggerId;
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', this._isOpen ? 'true' : 'false');
    if (this._isOpen) trigger.setAttribute('aria-controls', this._menuId);
    else trigger.removeAttribute('aria-controls');

    if (this.hasAttribute('disabled')) {
      trigger.setAttribute('aria-disabled', 'true');
      trigger.setAttribute('tabindex', '-1');
      return;
    }

    if (trigger.getAttribute('aria-disabled') === 'true') trigger.removeAttribute('aria-disabled');
    if (trigger.getAttribute('tabindex') === '-1') trigger.removeAttribute('tabindex');
  }

  private _renderMenuContent(): void {
    const menu = this._getMenu();
    if (!menu) return;

    menu.replaceChildren();
    const source = this._getContentSource();
    if (source) menu.appendChild(cloneContentTree(source));

    if (!menu.querySelector(ITEM_SELECTOR)) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No items';
      menu.appendChild(empty);
    }

    this._syncMenuItemSemantics();
  }

  private _syncMenuItemSemantics(): void {
    this._queryItems(true).forEach((item, index) => {
      if (!item.getAttribute('role')) item.setAttribute('role', 'menuitem');
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '-1');
      item.dataset.sourceIndex = String(index);
      if (item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true') item.setAttribute('aria-disabled', 'true');
      const role = item.getAttribute('role');
      if ((role === 'menuitemcheckbox' || role === 'menuitemradio') && !item.hasAttribute('aria-checked')) {
        item.setAttribute('aria-checked', 'false');
      }
      this._applyStoredItemState(item, index);
    });
  }

  private _clearMenuContent(): void {
    const menu = this._getMenu();
    if (!menu) return;
    menu.replaceChildren();
  }

  private _applyStoredItemState(item: DropdownItem, index: number): void {
    const role = item.getAttribute('role');
    if (role === 'menuitemcheckbox') {
      if (!this._checkboxState.has(index)) return;
      const checked = this._checkboxState.get(index) === true;
      item.setAttribute('aria-checked', checked ? 'true' : 'false');
      item.setAttribute('data-state', checked ? 'checked' : 'unchecked');
      return;
    }

    if (role !== 'menuitemradio') return;
    const group = item.getAttribute('data-group') || item.getAttribute('name') || '__default__';
    if (!this._radioState.has(group)) return;
    const checked = this._radioState.get(group) === index;
    item.setAttribute('aria-checked', checked ? 'true' : 'false');
    item.setAttribute('data-state', checked ? 'checked' : 'unchecked');
  }

  private _syncMenuPresentation(): void {
    const menu = this._getMenu();
    if (!menu) return;

    const computed = isBrowser() ? window.getComputedStyle(this) : null;
    if (computed) {
      DROPDOWN_TOKEN_NAMES.forEach((token) => {
        const value = computed.getPropertyValue(token).trim();
        if (value) menu.style.setProperty(token, value);
        else menu.style.removeProperty(token);
      });
    }

    const variant = readVariantValue(this, 'variant');
    const size = normalizeDropdownSize(this.getAttribute('size') || this.getAttribute('density'));
    const density = readVariantValue(this, 'density');
    const shape = readVariantValue(this, 'shape');
    const elevation = readVariantValue(this, 'elevation');
    const tone = readVariantValue(this, 'tone');
    const normalizedRadius = normalizeDropdownRadius(this.getAttribute('radius') || shape || null);

    if (variant && variant !== 'default') menu.setAttribute('data-variant', variant);
    else menu.removeAttribute('data-variant');

    if (size !== 'md') menu.setAttribute('data-size', size);
    else menu.removeAttribute('data-size');

    if (density && density !== 'default') menu.setAttribute('data-density', density);
    else menu.removeAttribute('data-density');

    if (shape && shape !== 'default') menu.setAttribute('data-shape', shape);
    else menu.removeAttribute('data-shape');

    if (elevation && elevation !== 'default') menu.setAttribute('data-elevation', elevation);
    else menu.removeAttribute('data-elevation');

    if (tone && tone !== 'default' && tone !== 'brand') menu.setAttribute('data-tone', tone);
    else menu.removeAttribute('data-tone');

    if (normalizedRadius) {
      menu.style.setProperty('--ui-dropdown-radius', normalizedRadius);
      menu.style.setProperty('--ui-dropdown-item-radius', normalizedRadius === '999px' ? '999px' : `max(0px, calc(${normalizedRadius} - 2px))`);
      return;
    }

    menu.style.removeProperty('--ui-dropdown-radius');
    menu.style.removeProperty('--ui-dropdown-item-radius');
  }

  private _syncMenuA11y(): void {
    const menu = this._getMenu();
    if (!menu) return;

    const trigger = this._getTrigger();
    const ariaLabel = this.getAttribute('aria-label') || '';
    const explicitLabelledBy = this.getAttribute('aria-labelledby') || '';
    const explicitDescribedBy = this.getAttribute('aria-describedby') || '';
    const labelledBy = explicitLabelledBy || (!ariaLabel && trigger?.id ? trigger.id : '');

    if (ariaLabel) menu.setAttribute('aria-label', ariaLabel);
    else menu.removeAttribute('aria-label');

    if (labelledBy) menu.setAttribute('aria-labelledby', labelledBy);
    else menu.removeAttribute('aria-labelledby');

    if (explicitDescribedBy) menu.setAttribute('aria-describedby', explicitDescribedBy);
    else menu.removeAttribute('aria-describedby');
  }

  private _syncControlState(): void {
    const panel = this._panelEl;
    const menu = this._getMenu();
    if (!panel || !menu) return;

    panel.hidden = !this._isOpen;
    panel.setAttribute('data-placement', this._placement);
  }

  private _schedulePanelSync(focusBoundary?: 'first' | 'last'): void {
    if (this._openFrame) cancelAnimationFrame(this._openFrame);
    this._openFrame = requestAnimationFrame(() => {
      this._openFrame = 0;
      this._syncPanelState();
      if (focusBoundary === 'first') this._focusFirstItem();
      if (focusBoundary === 'last') this._focusLastItem();
    });
  }

  private _syncPanelState(): void {
    const panel = this._panelEl;
    if (!panel || !this._isOpen) return;

    this._placement = this._resolvePlacement();
    panel.setAttribute('data-placement', this._placement);
    this.style.setProperty('--ui-dropdown-available-width', `${Math.max(0, Math.floor(this._availableWidth(this._placement)))}px`);
    this.style.setProperty('--ui-dropdown-available-height', `${Math.max(0, Math.floor(this._availableHeight(this._placement)))}px`);
  }

  private _availableWidth(placement: DropdownPlacement): number {
    const trigger = this._getTrigger();
    if (!trigger || !isBrowser()) return 380;
    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    if (placement === 'left') return rect.left - 12;
    if (placement === 'right') return viewportWidth - rect.right - 12;
    return viewportWidth - rect.left - 12;
  }

  private _availableHeight(placement: DropdownPlacement): number {
    const trigger = this._getTrigger();
    if (!trigger || !isBrowser()) return 440;
    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    if (placement === 'top') return rect.top - 12;
    return viewportHeight - rect.bottom - 12;
  }

  private _resolvePlacement(): DropdownPlacement {
    const preferred = normalizePlacement(this.getAttribute('placement'));
    const trigger = this._getTrigger();
    const menu = this._getMenu();
    if (!trigger || !menu || !isBrowser()) return preferred;

    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const belowSpace = Math.max(0, viewportHeight - rect.bottom - 12);
    const aboveSpace = Math.max(0, rect.top - 12);
    const rightSpace = Math.max(0, viewportWidth - rect.right - 12);
    const leftSpace = Math.max(0, rect.left - 12);
    const menuHeight = Math.min(Math.max(menu.scrollHeight, menu.offsetHeight) + 4, 320);
    const menuWidth = Math.min(Math.max(menu.scrollWidth, menu.offsetWidth) + 4, 360);

    if (preferred === 'top') return aboveSpace >= menuHeight || aboveSpace > belowSpace ? 'top' : 'bottom';
    if (preferred === 'left') return leftSpace >= menuWidth || leftSpace > rightSpace ? 'left' : 'right';
    if (preferred === 'right') return rightSpace >= menuWidth || rightSpace >= leftSpace ? 'right' : 'left';
    return belowSpace >= menuHeight || belowSpace >= aboveSpace ? 'bottom' : 'top';
  }

  private _clearActiveItem(): void {
    this._queryItems(true).forEach((item) => item.removeAttribute('data-active'));
  }

  private _setActiveItem(item: DropdownItem | null, options: { focus?: boolean; scroll?: boolean } = {}): void {
    this._clearActiveItem();
    if (!item) return;
    item.setAttribute('data-active', 'true');
    if (options.focus) focusWithoutScroll(item);
    if (options.scroll) {
      const menu = this._getMenu();
      if (menu) scrollItemIntoContainer(item, menu);
    }
  }

  private _focusFirstItem(): void {
    const items = this._queryItems(false);
    this._setActiveItem(items[0] || null, { focus: true, scroll: true });
  }

  private _focusLastItem(): void {
    const items = this._queryItems(false);
    this._setActiveItem(items[items.length - 1] || null, { focus: true, scroll: true });
  }

  private _moveFocus(step: 1 | -1): void {
    const items = this._queryItems(true);
    if (!items.length) return;
    const current = this._currentFocusedItem() || this._queryItems(true).find((item) => item.getAttribute('data-active') === 'true') || null;
    const currentIndex = current ? items.indexOf(current) : step > 0 ? -1 : items.length;
    const nextIndex = nextEnabledIndex(items, currentIndex, step);
    if (nextIndex >= 0) {
      this._setActiveItem(items[nextIndex], { focus: true, scroll: true });
      return;
    }
    if (step > 0) this._focusFirstItem();
    else this._focusLastItem();
  }

  private _resetTypeahead(): void {
    this._typeaheadBuffer = '';
    if (this._typeaheadTimer != null) {
      window.clearTimeout(this._typeaheadTimer);
      this._typeaheadTimer = null;
    }
  }

  private _isTypeaheadKey(event: KeyboardEvent): boolean {
    if (event.ctrlKey || event.metaKey || event.altKey) return false;
    return event.key.length === 1 && /\S/.test(event.key);
  }

  private _handleTypeahead(event: KeyboardEvent): boolean {
    if (!this.typeahead || !this._isTypeaheadKey(event)) return false;

    const key = event.key.toLowerCase();
    this._typeaheadBuffer = `${this._typeaheadBuffer}${key}`.slice(0, 24);
    if (this._typeaheadTimer != null) window.clearTimeout(this._typeaheadTimer);
    this._typeaheadTimer = window.setTimeout(() => this._resetTypeahead(), 460);

    const match = resolveTypeaheadMatch(this._queryItems(true), this._typeaheadBuffer, this._currentFocusedItem());
    if (!match) return false;
    this._setActiveItem(match, { focus: true, scroll: true });
    event.preventDefault();
    return true;
  }

  private _querySourceItems(): DropdownItem[] {
    const source = this._getContentSource();
    if (!source) return [];
    return Array.from(source.querySelectorAll<DropdownItem>(ITEM_SELECTOR));
  }

  private _applySelectionBehavior(item: DropdownItem): void {
    const role = item.getAttribute('role');
    const sourceIndex = Number(item.dataset.sourceIndex || '-1');

    if (role === 'menuitemcheckbox') {
      const nextChecked = item.getAttribute('aria-checked') !== 'true';
      item.setAttribute('aria-checked', nextChecked ? 'true' : 'false');
      item.setAttribute('data-state', nextChecked ? 'checked' : 'unchecked');
      if (sourceIndex >= 0) this._checkboxState.set(sourceIndex, nextChecked);
      return;
    }

    if (role !== 'menuitemradio') return;

    const group = item.getAttribute('data-group') || item.getAttribute('name') || '';
    const groupKey = group || '__default__';
    if (sourceIndex >= 0) this._radioState.set(groupKey, sourceIndex);
    this._queryItems(true)
      .filter((entry) => entry.getAttribute('role') === 'menuitemradio')
      .forEach((radio) => {
        const radioGroup = radio.getAttribute('data-group') || radio.getAttribute('name') || '';
        if (groupKey && (radioGroup || '__default__') !== groupKey) return;
        const checked = radio === item;
        radio.setAttribute('aria-checked', checked ? 'true' : 'false');
        radio.setAttribute('data-state', checked ? 'checked' : 'unchecked');
      });
  }

  private _findMenuItemFromEvent(event: Event): DropdownItem | null {
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    for (const entry of path) {
      if (entry instanceof HTMLElement && entry.matches(ITEM_SELECTOR)) return entry as DropdownItem;
    }
    const target = event.target;
    if (target instanceof HTMLElement) return target.closest(ITEM_SELECTOR) as DropdownItem | null;
    return null;
  }

  private _isEventInsideTrigger(event: Event): boolean {
    const trigger = this._getTrigger();
    if (!trigger) return false;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    return path.includes(trigger);
  }

  private _emitSelect(item: DropdownItem): void {
    const detail: UIDropdownSelectDetail = {
      value: item.getAttribute('data-value') || item.getAttribute('value') || undefined,
      label: item.getAttribute('aria-label') || item.textContent?.trim() || undefined,
      checked: item.getAttribute('aria-checked') === 'true',
      item
    };

    this.dispatchEvent(
      new CustomEvent<UIDropdownSelectDetail>('select', {
        bubbles: true,
        composed: true,
        detail
      })
    );
  }

  private _onHostClick(event: Event): void {
    if (this.hasAttribute('disabled')) return;

    const item = this._isOpen ? this._findMenuItemFromEvent(event) : null;
    if (item && this._getMenu()?.contains(item) && !isDisabledItem(item)) {
      this._applySelectionBehavior(item);
      this._setActiveItem(item, { focus: true, scroll: true });
      this._emitSelect(item);
      if (this.closeOnSelect) this._requestClose('select');
      return;
    }

    if (!this._isEventInsideTrigger(event)) return;

    event.preventDefault();
    if (this._isOpen) {
      this._requestClose('trigger');
      return;
    }
    this.open();
  }

  private _onHostKeyDown(event: KeyboardEvent): void {
    if (!this._isOpen) {
      if (!this._isEventInsideTrigger(event)) return;
      if (!['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) return;

      event.preventDefault();
      this.open();
      this._schedulePanelSync(event.key === 'ArrowUp' ? 'last' : 'first');
      return;
    }

    if (this._handleTypeahead(event)) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this._requestClose('escape');
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._moveFocus(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._moveFocus(-1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this._focusFirstItem();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this._focusLastItem();
      return;
    }

    if (event.key === 'Tab') {
      this._requestClose('tab');
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      const item = this._currentFocusedItem();
      if (!item || !this._getMenu()?.contains(item) || isDisabledItem(item)) return;
      event.preventDefault();
      item.click();
    }
  }

  private _onDocumentPointerDown(event: Event): void {
    if (!this._isOpen) return;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    if (path.includes(this)) return;
    this._requestClose('outside');
  }

  private _onSlotChange(): void {
    this._syncTriggerA11y();
    if (!this._isOpen) return;
    this._renderMenuContent();
    this._syncMenuPresentation();
    this._syncMenuA11y();
    this._schedulePanelSync();
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="trigger" part="trigger">
          <slot name="trigger"></slot>
        </div>
        <div class="panel" part="panel" hidden data-placement="bottom">
          <div
            id="${this._menuId}"
            class="menu"
            role="menu"
            aria-orientation="vertical"
            tabindex="-1"
          ></div>
        </div>
      </div>
      <div class="content-slot" aria-hidden="true">
        <slot name="content"></slot>
      </div>
      <slot></slot>
    `);

    this._panelEl = this.root.querySelector('.panel') as HTMLElement | null;
    this._portalEl = this.root.querySelector('.menu') as HTMLElement | null;
    this._syncMenuPresentation();
    this._syncMenuA11y();
    this._syncTriggerA11y();
    this._syncControlState();
    if (this._isOpen) {
      this._renderMenuContent();
      this._schedulePanelSync();
    } else {
      this._clearMenuContent();
    }
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-dropdown')) {
  customElements.define('ui-dropdown', UIDropdown);
}

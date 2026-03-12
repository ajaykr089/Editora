import { ElementBase } from '../ElementBase';
import { createPortalContainer } from '../portal';
import { findTypeaheadMatch } from '../primitives/collection';
import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import {
  focusRovingItem,
  getRovingFocusBoundaryIndex,
  moveRovingFocusIndex,
  resolveRovingFocusIndex,
  syncRovingTabStops
} from '../primitives/roving-focus-group';
import { createPositioner, type PositionerHandle, type PositionerPlacement } from '../primitives/positioner';
import './ui-listbox';
import { UIListbox } from './ui-listbox';
import { createSharedMenuItemCss } from './menu-item-styles';

type MenubarReason = 'click' | 'keyboard' | 'programmatic';
type PanelPlacement = 'top' | 'bottom' | 'left' | 'right';
type MenubarItem = HTMLElement;
type PanelItem = HTMLElement & { disabled?: boolean };
const PANEL_SUBMENU_SELECTOR = ':scope > .submenu';

const PORTAL_THEME_VARIABLES = [
  '--ui-color-primary',
  '--ui-color-primary-hover',
  '--ui-color-foreground-on-primary',
  '--ui-color-background',
  '--ui-color-surface',
  '--ui-color-surface-alt',
  '--ui-color-text',
  '--ui-color-muted',
  '--ui-color-border',
  '--ui-color-focus-ring',
  '--ui-color-success',
  '--ui-color-danger',
  '--ui-color-warning',
  '--ui-primary',
  '--ui-primary-hover',
  '--ui-foreground',
  '--ui-background',
  '--ui-surface',
  '--ui-surface-alt',
  '--ui-text',
  '--ui-muted',
  '--ui-border',
  '--ui-focus-ring',
  '--ui-radius',
  '--color-background',
  '--color-surface',
  '--color-panel',
  '--color-panel-solid',
  '--color-panel-translucent',
  '--color-overlay',
  '--accent-contrast',
  '--accent-surface',
  '--accent-indicator',
  '--accent-track'
] as const;

const PORTAL_THEME_SCALES = [
  { prefix: '--accent-', from: 1, to: 12 },
  { prefix: '--accent-a', from: 1, to: 12 },
  { prefix: '--gray-', from: 1, to: 12 },
  { prefix: '--gray-a', from: 1, to: 12 },
  { prefix: '--black-a', from: 1, to: 12 },
  { prefix: '--white-a', from: 1, to: 12 },
  { prefix: '--shadow-', from: 1, to: 6 },
  { prefix: '--radius-', from: 1, to: 6 }
] as const;

function normalizeMenubarSize(value: string | null): 'sm' | 'md' | 'lg' {
  if (value === 'sm' || value === '1' || value === 'compact') return 'sm';
  if (value === 'lg' || value === '3' || value === 'comfortable') return 'lg';
  return 'md';
}

function normalizeMenubarRadius(value: string | null): string | null {
  if (!value || value === 'default') return null;
  if (value === 'none' || value === 'square') return '0px';
  if (value === 'sm') return '8px';
  if (value === 'md' || value === 'soft') return '12px';
  if (value === 'lg') return '16px';
  if (value === 'full') return '999px';
  if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`;
  if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(value)) return value;
  return null;
}

const hostStyle = `
  :host {
    --ui-menubar-gap: var(--base-menubar-gap, 6px);
    --ui-menubar-padding: var(--base-menubar-padding, 6px);
    --ui-menubar-radius: var(--base-menubar-radius, var(--ui-radius, 4px));
    --ui-menubar-bg: var(--base-menubar-bg, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
    --ui-menubar-border: var(--base-menubar-border, 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 86%, transparent));
    --ui-menubar-shadow: var(--base-menubar-shadow, var(--shadow-2, none));
    --ui-menubar-item-radius: var(--base-menubar-item-radius, calc(var(--ui-menubar-radius) - 2px));
    --ui-menubar-item-pad-x: var(--base-menubar-item-padding-x, 14px);
    --ui-menubar-item-pad-y: var(--base-menubar-item-padding-y, 9px);
    --ui-menubar-item-font-size: var(--base-menubar-item-font-size, 14px);
    --ui-menubar-item-weight: var(--base-menubar-item-font-weight, 600);
    --ui-menubar-item-line-height: var(--base-menubar-item-line-height, 20px);
    --ui-menubar-item-color: var(--ui-color-text, var(--ui-text, #334155));
    --ui-menubar-item-hover-bg: color-mix(in srgb, var(--ui-menubar-ring) 12%, transparent);
    --ui-menubar-item-active-bg: color-mix(in srgb, var(--ui-menubar-ring) 16%, transparent);
    --ui-menubar-item-active-color: var(--accent-12, var(--ui-menubar-item-color));
    --ui-menubar-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-menubar-panel-bg: var(--base-menubar-panel-bg, var(--base-menu-bg, var(--color-panel-solid, #ffffff)));
    --ui-menubar-panel-color: var(--base-menubar-panel-color, var(--ui-color-text, #0f172a));
    --ui-menubar-panel-border: var(--base-menubar-panel-border, var(--base-menu-border, 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 80%, transparent)));
    --ui-menubar-panel-shadow: var(--base-menubar-panel-shadow, var(--base-menu-shadow, var(--shadow-5)));
    --ui-menubar-panel-radius: var(--base-menubar-panel-radius, var(--base-menu-radius, var(--radius-4)));
    --ui-menubar-panel-padding: var(--base-menubar-panel-padding, var(--base-context-menu-padding, var(--base-menu-content-padding, 8px)));
    --ui-menubar-panel-min-width: var(--base-menubar-panel-min-width, var(--base-menu-min-width, 232px));
    --ui-menubar-panel-item-radius: var(--base-menubar-panel-item-radius, var(--base-context-menu-item-radius, var(--base-menu-item-radius, calc(var(--ui-menubar-panel-radius) - 2px))));
    --ui-menubar-panel-item-gap: var(--base-menubar-panel-item-gap, var(--base-context-menu-item-gap, var(--base-menu-item-gap, 10px)));
    --ui-menubar-panel-item-min-height: var(--base-menubar-panel-item-height, var(--base-context-menu-item-height, var(--base-menu-item-height, 36px)));
    --ui-menubar-panel-item-pad-y: var(--base-menubar-panel-item-padding-y, var(--base-context-menu-item-padding-y, var(--base-menu-item-padding-y, 8px)));
    --ui-menubar-panel-item-pad-x: var(--base-menubar-panel-item-padding-x, var(--base-context-menu-item-padding-x, var(--base-menu-item-padding-x, 12px)));
    --ui-menubar-panel-item-font-size: var(--base-menubar-panel-item-font-size, var(--base-context-menu-item-font-size, var(--base-menu-item-font-size, 14px)));
    --ui-menubar-panel-item-font-weight: 400;
    --ui-menubar-panel-item-line-height: var(--base-menubar-panel-item-line-height, var(--base-context-menu-item-line-height, var(--base-menu-item-line-height, 20px)));
    --ui-menubar-panel-separator-margin: var(--base-menubar-panel-separator-margin, var(--base-context-menu-separator-margin, var(--base-menu-separator-margin, 6px 10px)));
    --ui-menubar-panel-item-hover-bg: color-mix(in srgb, var(--ui-menubar-ring) 12%, transparent);
    --ui-menubar-panel-item-active-color: var(--accent-12, var(--ui-menubar-panel-color));
    --ui-menubar-z: 1570;
    color-scheme: light dark;
    display: inline-block;
    position: relative;
  }

  :host([headless]) .bar {
    display: none !important;
  }

  .bar {
    display: inline-flex;
    align-items: center;
    gap: var(--ui-menubar-gap);
    padding: var(--ui-menubar-padding);
    border-radius: var(--ui-menubar-radius);
    background: var(--ui-menubar-bg);
    border: var(--ui-menubar-border);
    box-shadow: var(--ui-menubar-shadow);
    position: relative;
  }

  :host([orientation="vertical"]) .bar {
    display: inline-grid;
    justify-items: stretch;
    min-width: 180px;
  }

  :host([variant="flat"]) .bar {
    box-shadow: none;
  }

  :host([variant="soft"]),
  :host([variant="glass"]) {
    --ui-menubar-bg: color-mix(in srgb, var(--base-menubar-bg, var(--color-panel-solid, #ffffff)) 94%, var(--accent-surface, transparent));
  }

  :host([variant="contrast"]) .bar {
    --ui-menubar-bg: #0f172a;
    --ui-menubar-item-color: #e2e8f0;
    --ui-menubar-item-hover-bg: color-mix(in srgb, #ffffff 16%, transparent);
    --ui-menubar-item-active-bg: color-mix(in srgb, #ffffff 20%, transparent);
    --ui-menubar-item-active-color: #ffffff;
    --ui-menubar-ring: #93c5fd;
    border-color: #334155;
  }

  :host([variant="outline"]) .bar,
  :host([variant="line"]) .bar {
    box-shadow: none;
    border-color: color-mix(in srgb, var(--ui-menubar-item-color, #334155) 26%, transparent);
  }

  :host([size="sm"]),
  :host([size="1"]),
  :host([density="compact"]) {
    --ui-menubar-gap: 4px;
    --ui-menubar-padding: 4px;
    --ui-menubar-item-radius: 6px;
    --ui-menubar-item-pad-x: 10px;
    --ui-menubar-item-pad-y: 6px;
    --ui-menubar-item-font-size: 12px;
    --ui-menubar-item-line-height: 18px;
  }

  :host([size="lg"]),
  :host([size="3"]),
  :host([density="comfortable"]) {
    --ui-menubar-gap: 8px;
    --ui-menubar-padding: 7px;
    --ui-menubar-item-radius: 10px;
    --ui-menubar-item-pad-x: 16px;
    --ui-menubar-item-pad-y: 10px;
    --ui-menubar-item-font-size: 14px;
    --ui-menubar-item-line-height: 22px;
  }

  :host([elevation="none"]) .bar {
    box-shadow: none;
  }

  :host([elevation="high"]) .bar {
    --ui-menubar-shadow:
      0 24px 56px rgba(2, 6, 23, 0.14),
      0 3px 12px rgba(2, 6, 23, 0.08);
  }

  :host([tone="danger"]) {
    --ui-menubar-ring: #ef4444;
    --ui-menubar-item-active-bg: color-mix(in srgb, #ef4444 18%, transparent);
    --ui-menubar-item-active-color: #b91c1c;
  }

  :host([tone="success"]) {
    --ui-menubar-ring: #16a34a;
    --ui-menubar-item-active-bg: color-mix(in srgb, #16a34a 18%, transparent);
    --ui-menubar-item-active-color: #166534;
  }

  :host([tone="warning"]) {
    --ui-menubar-ring: #d97706;
    --ui-menubar-item-active-bg: color-mix(in srgb, #f59e0b 20%, transparent);
    --ui-menubar-item-active-color: #b45309;
  }

  ::slotted([slot="item"]) {
    appearance: none;
    border: 0;
    background: transparent;
    border-radius: var(--ui-menubar-item-radius);
    padding: var(--ui-menubar-item-pad-y) var(--ui-menubar-item-pad-x);
    color: var(--ui-menubar-item-color);
    font: var(--ui-menubar-item-weight) var(--ui-menubar-item-font-size)/var(--ui-menubar-item-line-height) Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    letter-spacing: var(--ui-default-letter-spacing, 0em);
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    outline: none;
    transition: background-color 120ms ease, color 120ms ease, transform 120ms ease;
  }

  ::slotted([slot="item"]:hover),
  ::slotted([slot="item"]:focus-visible) {
    background: var(--ui-menubar-item-hover-bg);
  }

  ::slotted([slot="item"][data-active="true"]) {
    background: var(--ui-menubar-item-active-bg);
    color: var(--ui-menubar-item-active-color);
  }

  ::slotted([slot="item"]:focus-visible) {
    box-shadow: inset 0 0 0 2px var(--ui-menubar-ring);
  }

  .content-slot {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    ::slotted([slot="item"]) {
      transition: none !important;
    }
  }

  @media (forced-colors: active) {
    .bar {
      forced-color-adjust: none;
      border-color: CanvasText;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
    }

    ::slotted([slot="item"]) {
      forced-color-adjust: none;
      border: 1px solid transparent;
      background: Canvas;
      color: CanvasText;
    }

    ::slotted([slot="item"]:hover),
    ::slotted([slot="item"]:focus-visible),
    ::slotted([slot="item"][data-active="true"]) {
      background: Highlight;
      color: HighlightText;
      border-color: Highlight;
    }
  }
`;

const panelStyle = `
  .ui-menubar-portal {
    position: absolute;
    pointer-events: auto;
    z-index: var(--ui-menubar-z, 1570);
  }

  .ui-menubar-portal .surface {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: var(--ui-menubar-panel-min-width, 232px);
    max-width: min(360px, calc(100vw - 16px));
    overflow: visible;
    isolation: isolate;
    padding: var(--ui-menubar-panel-padding, 6px);
    box-sizing: border-box;
    border: var(--ui-menubar-panel-border, 1px solid rgba(15, 23, 42, 0.14));
    border-radius: var(--ui-menubar-panel-radius, 12px);
    background: var(--ui-menubar-panel-bg, #fff);
    color: var(--ui-menubar-panel-color, #0f172a);
    box-shadow: var(--ui-menubar-panel-shadow);
    opacity: 0;
    transform: translateY(5px) scale(0.984);
    transform-origin: top left;
    animation: ui-menubar-panel-enter 160ms cubic-bezier(0.2, 0.9, 0.24, 1) forwards;
    outline: none;
    will-change: transform, opacity;
  }

  .ui-menubar-portal .surface[data-placement="top"] {
    transform-origin: bottom left;
  }

  .ui-menubar-portal .surface[data-placement="left"] {
    transform-origin: center right;
  }

  .ui-menubar-portal .surface[data-placement="right"] {
    transform-origin: center left;
  }

  .ui-menubar-portal[data-variant="flat"] .surface {
    box-shadow: none;
  }

  .ui-menubar-portal[data-variant="soft"] .surface,
  .ui-menubar-portal[data-variant="glass"] .surface {
    --ui-menubar-panel-bg: color-mix(in srgb, var(--base-menubar-panel-bg, var(--base-menu-bg, #ffffff)) 94%, var(--accent-surface, transparent));
  }

  .ui-menubar-portal[data-variant="contrast"] .surface {
    --ui-menubar-panel-bg: #0f172a;
    --ui-menubar-panel-color: #f8fafc;
    --ui-menubar-panel-border: 1px solid #334155;
    --ui-menubar-panel-item-hover-bg: color-mix(in srgb, #ffffff 12%, transparent);
  }

  .ui-menubar-portal[data-variant="outline"] .surface,
  .ui-menubar-portal[data-variant="line"] .surface {
    box-shadow: none;
    border-color: color-mix(in srgb, var(--ui-menubar-panel-color, #0f172a) 26%, transparent);
  }

  .ui-menubar-portal[data-size="sm"] .surface,
  .ui-menubar-portal[data-density="compact"] .surface {
    --ui-menubar-panel-padding: 4px;
    --ui-menubar-panel-item-radius: 6px;
    --ui-menubar-panel-item-gap: 8px;
    --ui-menubar-panel-item-min-height: 30px;
    --ui-menubar-panel-item-pad-y: 5px;
    --ui-menubar-panel-item-pad-x: 9px;
    --ui-menubar-panel-item-font-size: 12px;
    --ui-menubar-panel-separator-margin: 4px 8px;
  }

  .ui-menubar-portal[data-size="lg"] .surface,
  .ui-menubar-portal[data-density="comfortable"] .surface {
    --ui-menubar-panel-padding: 8px;
    --ui-menubar-panel-item-radius: 10px;
    --ui-menubar-panel-item-gap: 12px;
    --ui-menubar-panel-item-min-height: 40px;
    --ui-menubar-panel-item-pad-y: 9px;
    --ui-menubar-panel-item-pad-x: 13px;
    --ui-menubar-panel-item-font-size: 14px;
    --ui-menubar-panel-separator-margin: 7px 11px;
  }

  .ui-menubar-portal[data-elevation="none"] .surface {
    box-shadow: none;
  }

  .ui-menubar-portal[data-elevation="low"] .surface {
    --ui-menubar-panel-shadow:
      0 14px 30px rgba(2, 6, 23, 0.17),
      0 2px 7px rgba(2, 6, 23, 0.08);
  }

  .ui-menubar-portal[data-elevation="high"] .surface {
    --ui-menubar-panel-shadow:
      0 32px 72px rgba(2, 6, 23, 0.28),
      0 6px 18px rgba(2, 6, 23, 0.14);
  }

  ${createSharedMenuItemCss({
    scopes: ['.ui-menubar-portal .content-host'],
    prefix: '--ui-menubar-panel',
    shortcutSelectors: ['.shortcut', '.meta'],
    activeStateSelectors: [
      '.item[data-submenu-open="true"]',
      '[role="menuitem"][data-submenu-open="true"]',
      '[role="menuitemcheckbox"][data-submenu-open="true"]',
      '[role="menuitemradio"][data-submenu-open="true"]',
      '[data-menu-item][data-submenu-open="true"]',
      '.item[data-active="true"]',
      '[role="menuitem"][data-active="true"]',
      '[role="menuitemcheckbox"][data-active="true"]',
      '[role="menuitemradio"][data-active="true"]',
      '[data-menu-item][data-active="true"]'
    ]
  })}

  .ui-menubar-portal[data-variant="solid"] .content-host [role="menuitem"]:hover,
  .ui-menubar-portal[data-variant="solid"] .content-host [role="menuitem"]:focus-visible,
  .ui-menubar-portal[data-variant="solid"] .content-host [role="menuitemcheckbox"]:hover,
  .ui-menubar-portal[data-variant="solid"] .content-host [role="menuitemcheckbox"]:focus-visible,
  .ui-menubar-portal[data-variant="solid"] .content-host [role="menuitemradio"]:hover,
  .ui-menubar-portal[data-variant="solid"] .content-host [role="menuitemradio"]:focus-visible,
  .ui-menubar-portal[data-variant="solid"] .content-host .item:hover,
  .ui-menubar-portal[data-variant="solid"] .content-host .item:focus-visible,
  .ui-menubar-portal[data-variant="solid"] .content-host [data-menu-item]:hover,
  .ui-menubar-portal[data-variant="solid"] .content-host [data-menu-item]:focus-visible,
  .ui-menubar-portal[data-variant="solid"] .content-host [role="menuitem"][data-active="true"],
  .ui-menubar-portal[data-variant="solid"] .content-host [role="menuitemcheckbox"][data-active="true"],
  .ui-menubar-portal[data-variant="solid"] .content-host [role="menuitemradio"][data-active="true"],
  .ui-menubar-portal[data-variant="solid"] .content-host .item[data-active="true"],
  .ui-menubar-portal[data-variant="solid"] .content-host [data-menu-item][data-active="true"] {
    background: color-mix(in srgb, var(--ui-menubar-ring) 12%, transparent);
    color: var(--accent-12, var(--ui-menubar-panel-color, #0f172a));
  }

  .ui-menubar-portal .content-host {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
    max-width: 100%;
  }

  .ui-menubar-portal .state-row {
    display: none;
    margin: 0 2px 6px;
    min-height: 24px;
    padding: 0 8px;
    border-radius: 8px;
    border: 1px solid color-mix(in srgb, var(--ui-menubar-panel-color, #0f172a) 12%, transparent);
    background: color-mix(in srgb, var(--ui-menubar-panel-bg, #ffffff) 92%, transparent);
    color: color-mix(in srgb, var(--ui-menubar-panel-color, #0f172a) 64%, transparent);
    font: 600 11px/24px Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    user-select: none;
  }

  .ui-menubar-portal .content-host .submenu {
    position: absolute;
    top: -6px;
    left: calc(100% + 4px);
    min-width: max(220px, 100%);
    padding: var(--ui-menubar-panel-padding, 6px);
    border: var(--ui-menubar-panel-border, 1px solid rgba(15, 23, 42, 0.14));
    border-radius: var(--ui-menubar-panel-radius, 12px);
    background: var(--ui-menubar-panel-bg, #fff);
    color: var(--ui-menubar-panel-color, #0f172a);
    box-shadow: var(--ui-menubar-panel-shadow);
    opacity: 0;
    visibility: hidden;
    transform: translateY(4px) scale(0.985);
    transform-origin: top left;
    pointer-events: none;
    transition:
      opacity 150ms cubic-bezier(0.2, 0.9, 0.24, 1),
      transform 150ms cubic-bezier(0.2, 0.9, 0.24, 1);
    z-index: 2;
  }

  .ui-menubar-portal .content-host .item[data-submenu-open="true"] > .submenu,
  .ui-menubar-portal .content-host [role="menuitem"][data-submenu-open="true"] > .submenu,
  .ui-menubar-portal .content-host [role="menuitemcheckbox"][data-submenu-open="true"] > .submenu,
  .ui-menubar-portal .content-host [role="menuitemradio"][data-submenu-open="true"] > .submenu,
  .ui-menubar-portal .content-host [data-menu-item][data-submenu-open="true"] > .submenu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }

  .ui-menubar-portal .content-host .item[data-submenu-side="left"] > .submenu,
  .ui-menubar-portal .content-host [role="menuitem"][data-submenu-side="left"] > .submenu,
  .ui-menubar-portal .content-host [role="menuitemcheckbox"][data-submenu-side="left"] > .submenu,
  .ui-menubar-portal .content-host [role="menuitemradio"][data-submenu-side="left"] > .submenu,
  .ui-menubar-portal .content-host [data-menu-item][data-submenu-side="left"] > .submenu {
    left: auto;
    right: calc(100% + 4px);
    transform-origin: top right;
  }

  .ui-menubar-portal .content-host .item[data-submenu-align="up"] > .submenu,
  .ui-menubar-portal .content-host [role="menuitem"][data-submenu-align="up"] > .submenu,
  .ui-menubar-portal .content-host [role="menuitemcheckbox"][data-submenu-align="up"] > .submenu,
  .ui-menubar-portal .content-host [role="menuitemradio"][data-submenu-align="up"] > .submenu,
  .ui-menubar-portal .content-host [data-menu-item][data-submenu-align="up"] > .submenu {
    top: auto;
    bottom: -6px;
  }

  .ui-menubar-portal .empty-state {
    padding: 10px 12px;
    font: 500 12px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
    letter-spacing: 0.01em;
    opacity: 0.72;
  }

  @keyframes ui-menubar-panel-enter {
    from {
      opacity: 0;
      transform: translateY(5px) scale(0.984);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ui-menubar-portal .surface {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-contrast: more) {
    .ui-menubar-portal .surface {
      border-width: 2px;
      box-shadow: none;
    }
  }
`;

function normalizePlacement(value: string | null): PanelPlacement {
  if (value === 'top' || value === 'left' || value === 'right') return value;
  return 'bottom';
}

function toPositionerPlacement(value: string | null): PositionerPlacement {
  const placement = normalizePlacement(value);
  if (placement === 'top') return 'top';
  if (placement === 'left') return 'left';
  if (placement === 'right') return 'right';
  return 'bottom';
}

function toBooleanAttribute(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function clampIndex(index: number, length: number): number {
  if (length <= 0) return -1;
  if (Number.isNaN(index)) return 0;
  if (index < 0) return 0;
  if (index >= length) return length - 1;
  return index;
}

function panelItemSelector(): string {
  return [
    '[role="menuitem"]',
    '[role="menuitemcheckbox"]',
    '[role="menuitemradio"]',
    '.item',
    '[data-menu-item]'
  ].join(', ');
}

function isDisabledPanelItem(item: PanelItem): boolean {
  return item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true' || !!item.disabled;
}

function firstMatchingPanelItemFromEvent(event: Event): PanelItem | null {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
  for (const entry of path) {
    if (!(entry instanceof HTMLElement)) continue;
    if (entry.matches(panelItemSelector())) return entry as PanelItem;
  }
  const target = event.target;
  if (target instanceof HTMLElement) return target.closest(panelItemSelector()) as PanelItem | null;
  return null;
}

function isDisabledBarItem(item: MenubarItem): boolean {
  return item.hasAttribute('disabled') || (item as HTMLButtonElement).disabled;
}

function readVariantValue(host: HTMLElement, name: string): string {
  return host.getAttribute(name) || '';
}

export class UIMenubar extends ElementBase {
  static get observedAttributes() {
    return [
      'selected',
      'open',
      'headless',
      'loop',
      'orientation',
      'variant',
      'size',
      'density',
      'radius',
      'shape',
      'elevation',
      'tone',
      'placement',
      'close-on-select',
      'close-on-scroll',
      'typeahead'
    ];
  }

  private _items: MenubarItem[] = [];
  private _contents: HTMLElement[] = [];
  private _itemSlot: HTMLSlotElement | null = null;
  private _contentSlot: HTMLSlotElement | null = null;
  private _uid = Math.random().toString(36).slice(2, 8);
  private _ignoreSelected = false;
  private _open = false;
  private _portalEl: HTMLElement | null = null;
  private _portalSurfaceEl: HTMLElement | null = null;
  private _portalContentHostEl: UIListbox | null = null;
  private _positioner: PositionerHandle | null = null;
  private _dismissableLayer: DismissableLayerHandle | null = null;
  private _panelForIndex = -1;
  private _typeaheadBuffer = '';
  private _typeaheadTimer: number | null = null;
  private _submenuRaf: number | null = null;
  private _globalListenersBound = false;
  private _focusIndex = -1;

  private _setPanelFlag(name: string, enabled: boolean): void {
    if (!this._portalEl) return;
    if (enabled) this._portalEl.setAttribute(`data-${name}`, 'true');
    else this._portalEl.removeAttribute(`data-${name}`);
  }

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onDocKeyDown = this._onDocKeyDown.bind(this);
    this._onDocScroll = this._onDocScroll.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onPanelPointerOver = this._onPanelPointerOver.bind(this);
    this._onPanelPointerLeave = this._onPanelPointerLeave.bind(this);
    this._onPanelFocusIn = this._onPanelFocusIn.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('mousemove', this._onMouseMove as EventListener);
    this._attachSlotListeners();
    this._syncHostVisualState();
    this._syncState();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('mousemove', this._onMouseMove as EventListener);
    this._unbindGlobalListeners();
    this._detachSlotListeners();
    this._teardownPanel();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'selected' && this._ignoreSelected) return;
    if (name === 'radius' || name === 'shape') this._syncHostVisualState();
    this._syncBarA11y();
    if (
      this._open &&
      name === 'placement'
    ) {
      this._rebuildPanel();
      return;
    }
    if (
      this._open &&
      (name === 'variant' ||
        name === 'size' ||
        name === 'density' ||
        name === 'radius' ||
        name === 'shape' ||
        name === 'elevation' ||
        name === 'tone')
    ) {
      this._syncPanelVisualState();
      return;
    }
    this._syncState();
  }

  protected render(): void {
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    this.setContent(`
      <style>${hostStyle}</style>
      <div class="bar" part="bar" role="menubar" aria-orientation="${orientation}">
        <slot name="item"></slot>
      </div>
      <div class="content-slot" aria-hidden="true">
        <slot name="content"></slot>
      </div>
      <slot></slot>
    `);
    this._attachSlotListeners();
    this._syncStructure();
    this._syncHostVisualState();
    this._syncBarA11y();
    if (this._open && !this._portalEl) this._rebuildPanel();
    else if (this._open) this._positioner?.update();
  }

  open(): void {
    if (this.hasAttribute('headless')) return;
    this.setAttribute('open', '');
  }

  close(): void {
    this.removeAttribute('open');
  }

  toggle(): void {
    if (this.hasAttribute('open')) this.close();
    else this.open();
  }

  get closeOnSelect(): boolean {
    return toBooleanAttribute(this.getAttribute('close-on-select'), true);
  }

  set closeOnSelect(value: boolean) {
    this.setAttribute('close-on-select', value ? 'true' : 'false');
  }

  get closeOnScroll(): boolean {
    return toBooleanAttribute(this.getAttribute('close-on-scroll'), true);
  }

  set closeOnScroll(value: boolean) {
    this.setAttribute('close-on-scroll', value ? 'true' : 'false');
  }

  get typeahead(): boolean {
    return toBooleanAttribute(this.getAttribute('typeahead'), true);
  }

  set typeahead(value: boolean) {
    this.setAttribute('typeahead', value ? 'true' : 'false');
  }

  private _attachSlotListeners(): void {
    const itemSlot = this.root.querySelector('slot[name="item"]') as HTMLSlotElement | null;
    const contentSlot = this.root.querySelector('slot[name="content"]') as HTMLSlotElement | null;

    if (this._itemSlot && this._itemSlot !== itemSlot) {
      this._itemSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (this._contentSlot && this._contentSlot !== contentSlot) {
      this._contentSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (itemSlot && this._itemSlot !== itemSlot) {
      itemSlot.addEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (contentSlot && this._contentSlot !== contentSlot) {
      contentSlot.addEventListener('slotchange', this._onSlotChange as EventListener);
    }

    this._itemSlot = itemSlot;
    this._contentSlot = contentSlot;
  }

  private _detachSlotListeners(): void {
    if (this._itemSlot) this._itemSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    if (this._contentSlot) this._contentSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._itemSlot = null;
    this._contentSlot = null;
  }

  private _syncBarA11y(): void {
    const bar = this.root.querySelector('.bar') as HTMLElement | null;
    if (!bar) return;
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
    bar.setAttribute('aria-orientation', orientation);
  }

  private _syncHostVisualState(): void {
    const normalizedRadius = normalizeMenubarRadius(this.getAttribute('radius') || this.getAttribute('shape'));
    if (normalizedRadius) {
      this.style.setProperty('--ui-menubar-radius', normalizedRadius);
      this.style.setProperty('--ui-menubar-item-radius', normalizedRadius === '999px' ? '999px' : `calc(${normalizedRadius} - 2px)`);
      this.style.setProperty('--ui-menubar-panel-radius', normalizedRadius);
      this.style.setProperty('--ui-menubar-panel-item-radius', normalizedRadius === '999px' ? '999px' : `calc(${normalizedRadius} - 2px)`);
    } else {
      this.style.removeProperty('--ui-menubar-radius');
      this.style.removeProperty('--ui-menubar-item-radius');
      this.style.removeProperty('--ui-menubar-panel-radius');
      this.style.removeProperty('--ui-menubar-panel-item-radius');
    }
  }

  private _onSlotChange(): void {
    this._syncState();
  }

  private _loopEnabled(): boolean {
    return toBooleanAttribute(this.getAttribute('loop'), true);
  }

  private _isOpenAttribute(): boolean {
    return this.hasAttribute('open') && !this.hasAttribute('headless');
  }

  private _selectedIndex(): number {
    const raw = this.getAttribute('selected');
    if (raw == null || raw === '') return this._items.length > 0 ? 0 : -1;
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return this._items.length > 0 ? 0 : -1;
    if (parsed < 0) return -1;
    return clampIndex(parsed, this._items.length);
  }

  private _setSelectedAttribute(index: number): void {
    this._ignoreSelected = true;
    this.setAttribute('selected', String(index));
    this._ignoreSelected = false;
  }

  private _moveIndex(current: number, delta: number): number {
    if (this._items.length === 0) return -1;
    const loop = this._loopEnabled();
    let next = current + delta;
    if (next < 0) next = loop ? this._items.length - 1 : 0;
    if (next >= this._items.length) next = loop ? 0 : this._items.length - 1;
    return next;
  }

  private _syncState(): void {
    this._syncStructure();

    const nextOpen = this._isOpenAttribute() && this._selectedIndex() >= 0 && this._items.length > 0;
    if (nextOpen !== this._open) {
      this._open = nextOpen;
      if (nextOpen) {
        this._bindGlobalListeners();
        this._rebuildPanel();
        this.dispatchEvent(
          new CustomEvent('open', {
            detail: { selected: this._selectedIndex() },
            bubbles: true
          })
        );
      } else {
        this._unbindGlobalListeners();
        const previous = this._panelForIndex >= 0 ? this._panelForIndex : this._selectedIndex();
        this._teardownPanel();
        this.dispatchEvent(new CustomEvent('close', { detail: { previous }, bubbles: true }));
      }
      return;
    }

    if (this._open) {
      this._bindGlobalListeners();
      const selected = this._selectedIndex();
      if (selected !== this._panelForIndex || !this._portalEl) this._rebuildPanel();
    } else {
      this._unbindGlobalListeners();
      this._teardownPanel();
    }
  }

  private _bindGlobalListeners(): void {
    if (this._globalListenersBound) return;
    document.addEventListener('keydown', this._onDocKeyDown as EventListener);
    document.addEventListener('scroll', this._onDocScroll as EventListener, true);
    this._globalListenersBound = true;
  }

  private _unbindGlobalListeners(): void {
    if (!this._globalListenersBound) return;
    document.removeEventListener('keydown', this._onDocKeyDown as EventListener);
    document.removeEventListener('scroll', this._onDocScroll as EventListener, true);
    this._globalListenersBound = false;
  }

  private _syncStructure(): void {
    this._items = this._itemSlot ? (this._itemSlot.assignedElements({ flatten: true }) as MenubarItem[]) : [];
    this._contents = this._contentSlot ? (this._contentSlot.assignedElements({ flatten: true }) as HTMLElement[]) : [];

    const selected = this._selectedIndex();
    const focusIndex = resolveRovingFocusIndex(this._items, {
      activeIndex: this._focusIndex,
      selectedIndex: selected,
      getDisabled: isDisabledBarItem
    });
    this._focusIndex = focusIndex;
    const isOpen = this._isOpenAttribute();

    this._items.forEach((item, index) => {
      const active = selected === index;
      const itemId = item.id || `ui-menubar-item-${this._uid}-${index}`;
      const panelId = this._contents[index]?.id || `ui-menubar-content-${this._uid}-${index}`;
      item.id = itemId;
      item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', index === focusIndex && !isDisabledBarItem(item) ? '0' : '-1');
      item.setAttribute('aria-haspopup', 'menu');
      item.setAttribute('aria-expanded', active && isOpen ? 'true' : 'false');
      item.setAttribute('aria-controls', panelId);
      item.setAttribute('data-active', active ? 'true' : 'false');
    });
    syncRovingTabStops(this._items, this._items[focusIndex] || null, { activeAttribute: null });

    this._contents.forEach((content, index) => {
      const panelId = content.id || `ui-menubar-content-${this._uid}-${index}`;
      content.id = panelId;
      content.setAttribute('role', 'menu');
      content.setAttribute('tabindex', '-1');
      content.setAttribute('aria-hidden', selected === index && isOpen ? 'false' : 'true');
      if (this._items[index]) content.setAttribute('aria-labelledby', this._items[index].id);
      else content.removeAttribute('aria-labelledby');
    });
  }

  private _hydratePanelItems(panel: HTMLElement): void {
    const items = Array.from(panel.querySelectorAll<PanelItem>(panelItemSelector()));
    items.forEach((item, index) => {
      if (!item.getAttribute('role')) item.setAttribute('role', 'menuitem');
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '-1');
      if (!item.hasAttribute('data-index')) item.setAttribute('data-index', String(index));
      if (!item.classList.contains('item')) item.classList.add('item');
    });
  }

  private _queryPanelItemsIn(container?: HTMLElement | null): PanelItem[] {
    return (this._panelListbox()?.queryEnabledItems({ container: container || this._panelListbox() }) || []) as PanelItem[];
  }

  private _submenuFor(item: PanelItem): HTMLElement | null {
    return item.querySelector(PANEL_SUBMENU_SELECTOR) as HTMLElement | null;
  }

  private _setOpenPanelBranch(item: PanelItem | null, expandCurrentSubmenu: boolean): void {
    const host = this._panelListbox();
    if (!host) return;
    host.querySelectorAll<HTMLElement>('[data-submenu-open="true"]').forEach((node) => node.removeAttribute('data-submenu-open'));
    if (!item) return;

    const branch: PanelItem[] = [];
    let current: HTMLElement | null = item;
    while (current) {
      const submenu = current.closest('.submenu') as HTMLElement | null;
      if (!submenu) break;
      const owner = submenu.parentElement;
      if (!(owner instanceof HTMLElement) || !owner.matches(panelItemSelector())) break;
      branch.unshift(owner as PanelItem);
      current = owner;
    }

    branch.forEach((owner) => owner.setAttribute('data-submenu-open', 'true'));
    if (expandCurrentSubmenu && this._submenuFor(item)) item.setAttribute('data-submenu-open', 'true');
  }

  private _openPanelSubmenu(item: PanelItem, focusFirstChild: boolean): boolean {
    const submenu = this._submenuFor(item);
    if (!submenu || isDisabledPanelItem(item)) return false;
    this._setOpenPanelBranch(item, true);
    this._schedulePanelSubmenuLayout();
    if (!focusFirstChild) return true;
    const first = this._panelListbox()?.focusBoundary('first', {
      container: submenu,
      focus: true,
      owner: this._panelSurface(),
      scroll: true
    }) as PanelItem | null;
    if (first) this._setOpenPanelBranch(first, false);
    return true;
  }

  private _closeParentPanelSubmenu(item: PanelItem): boolean {
    const submenu = item.closest('.submenu') as HTMLElement | null;
    if (!submenu) return false;
    const owner = submenu.parentElement;
    if (!(owner instanceof HTMLElement) || !owner.matches(panelItemSelector())) return false;
    this._focusPanelItem(owner as PanelItem);
    this._setOpenPanelBranch(owner as PanelItem, false);
    owner.removeAttribute('data-submenu-open');
    return true;
  }

  private _clearPanelSubmenuState(): void {
    const host = this._panelListbox();
    if (!host) return;
    host.querySelectorAll<HTMLElement>('[data-submenu-open="true"]').forEach((node) => node.removeAttribute('data-submenu-open'));
  }

  private _schedulePanelSubmenuLayout(): void {
    if (this._submenuRaf != null) cancelAnimationFrame(this._submenuRaf);
    this._submenuRaf = requestAnimationFrame(() => {
      this._submenuRaf = null;
      this._layoutPanelSubmenus();
    });
  }

  private _layoutPanelSubmenus(): void {
    const host = this._panelListbox();
    if (!host) return;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const submenus = Array.from(host.querySelectorAll<HTMLElement>('.item > .submenu, [role="menuitem"] > .submenu, [role="menuitemcheckbox"] > .submenu, [role="menuitemradio"] > .submenu, [data-menu-item] > .submenu'));
    submenus.forEach((submenu) => {
      const owner = submenu.parentElement;
      if (!(owner instanceof HTMLElement)) return;
      owner.removeAttribute('data-submenu-side');
      owner.removeAttribute('data-submenu-align');

      const previousDisplay = submenu.style.display;
      const previousVisibility = submenu.style.visibility;
      const previousPointerEvents = submenu.style.pointerEvents;
      const previousOpacity = submenu.style.opacity;
      const previousTransform = submenu.style.transform;

      submenu.style.display = 'grid';
      submenu.style.visibility = 'hidden';
      submenu.style.pointerEvents = 'none';
      submenu.style.opacity = '0';
      submenu.style.transform = 'none';

      const ownerRect = owner.getBoundingClientRect();
      const submenuRect = submenu.getBoundingClientRect();

      if (ownerRect.right + 4 + submenuRect.width > viewportWidth - 8 && ownerRect.left - 4 - submenuRect.width >= 8) {
        owner.setAttribute('data-submenu-side', 'left');
      }
      if (ownerRect.top + submenuRect.height > viewportHeight - 8 && ownerRect.bottom - submenuRect.height >= 8) {
        owner.setAttribute('data-submenu-align', 'up');
      }

      submenu.style.display = previousDisplay;
      submenu.style.visibility = previousVisibility;
      submenu.style.pointerEvents = previousPointerEvents;
      submenu.style.opacity = previousOpacity;
      submenu.style.transform = previousTransform;
    });
  }

  private _panelListbox(): UIListbox | null {
    return this._portalContentHostEl;
  }

  private _panelSurface(): HTMLElement | null {
    return this._portalSurfaceEl;
  }

  private _buildPanelContent(selectedIndex: number): HTMLElement {
    const source = this._contents[selectedIndex];
    const portal = document.createElement('div');
    portal.className = 'ui-menubar-portal';
    portal.style.position = 'absolute';
    portal.style.pointerEvents = 'auto';
    portal.innerHTML = `
      <style>${panelStyle}</style>
      <div class="surface menu-panel" part="menu" role="menu" aria-hidden="false" aria-busy="false" tabindex="-1">
        <div class="state-row" part="state"></div>
        <ui-listbox class="content-host" slot="menu" role="menu" item-selector="${panelItemSelector().replace(/"/g, '&quot;')}" direct-item-selector=":scope > [slot=&quot;menu&quot;] > ${panelItemSelector().replace(/"/g, '&quot;')}" item-role="menuitem" active-attribute="data-active"></ui-listbox>
      </div>
    `;

    const panel = portal.querySelector('ui-listbox.content-host') as UIListbox | null;
    const surface = portal.querySelector('.surface') as HTMLElement | null;
    if (!panel || !surface) return portal;
    surface.id = source?.id || `ui-menubar-panel-${this._uid}-${selectedIndex}`;
    surface.setAttribute('aria-labelledby', this._items[selectedIndex]?.id || '');

    this._applyPanelVariantData(portal);
    this._applyPanelTokens(portal);

    if (source) {
      const clone = source.cloneNode(true) as HTMLElement;
      clone.setAttribute('slot', 'menu');
      panel.appendChild(clone);
    }

    this._hydratePanelItems(panel);
    panel.refresh();
    if (!panel.querySelector(panelItemSelector())) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No items';
      panel.appendChild(empty);
    }

    portal.addEventListener('click', (event: MouseEvent) => {
      const item = firstMatchingPanelItemFromEvent(event);
      if (!item || isDisabledPanelItem(item)) return;
      if (this._submenuFor(item)) {
        event.preventDefault();
        this._openPanelSubmenu(item, true);
        return;
      }

      this._applyPanelSelectionBehavior(item);

      const itemIndexRaw = item.getAttribute('data-index');
      const itemIndex =
        itemIndexRaw != null && !Number.isNaN(Number(itemIndexRaw)) ? Number(itemIndexRaw) : undefined;
      this.dispatchEvent(
        new CustomEvent('select', {
          detail: {
            selected: selectedIndex,
            index: itemIndex,
            value: item.getAttribute('data-value') || item.getAttribute('value') || undefined,
            label: item.getAttribute('aria-label') || item.textContent?.trim() || undefined,
            checked: item.getAttribute('aria-checked') === 'true',
            item
          },
          bubbles: true
        })
      );

      if (this.closeOnSelect) this.close();
      else this._focusPanelItem(item);
    });

    portal.addEventListener('pointerover', this._onPanelPointerOver as EventListener);
    portal.addEventListener('pointerleave', this._onPanelPointerLeave as EventListener);
    portal.addEventListener('focusin', this._onPanelFocusIn as EventListener);

    return portal;
  }

  private _applyPanelVariantData(panel: HTMLElement): void {
    const variant = readVariantValue(this, 'variant');
    const size = normalizeMenubarSize(this.getAttribute('size') || this.getAttribute('density'));
    const density = readVariantValue(this, 'density');
    const radius = this.getAttribute('radius');
    const shape = readVariantValue(this, 'shape');
    const elevation = readVariantValue(this, 'elevation');
    const tone = readVariantValue(this, 'tone');

    const normalizedVariant =
      variant === 'default' || variant === '' ? '' :
      variant === 'glass' ? 'soft' :
      variant === 'line' ? 'outline' :
      variant;

    if (normalizedVariant) panel.setAttribute('data-variant', normalizedVariant);
    else panel.removeAttribute('data-variant');
    if (size !== 'md') panel.setAttribute('data-size', size);
    else panel.removeAttribute('data-size');
    if (density && density !== 'default') panel.setAttribute('data-density', density);
    else panel.removeAttribute('data-density');
    if (radius) panel.setAttribute('data-radius', radius);
    else panel.removeAttribute('data-radius');
    if (shape && shape !== 'default') panel.setAttribute('data-shape', shape);
    else panel.removeAttribute('data-shape');
    if (elevation && elevation !== 'default') panel.setAttribute('data-elevation', elevation);
    else panel.removeAttribute('data-elevation');
    if (tone && tone !== 'default' && tone !== 'brand') panel.setAttribute('data-tone', tone);
    else panel.removeAttribute('data-tone');
    if (this._open) panel.setAttribute('data-open', 'true');
    else panel.removeAttribute('data-open');
    const normalizedRadius = normalizeMenubarRadius(radius || shape || null);
    if (normalizedRadius) {
      panel.style.setProperty('--ui-menubar-panel-radius', normalizedRadius);
      panel.style.setProperty('--ui-menubar-panel-item-radius', normalizedRadius === '999px' ? '999px' : `calc(${normalizedRadius} - 2px)`);
    } else {
      panel.style.removeProperty('--ui-menubar-panel-radius');
      panel.style.removeProperty('--ui-menubar-panel-item-radius');
    }
  }

  private _applyPanelTokens(panel: HTMLElement): void {
    const computed = window.getComputedStyle(this);
    const tokenNames = [
      '--ui-color-primary',
      '--ui-color-primary-hover',
      '--ui-color-foreground-on-primary',
      '--ui-color-background',
      '--ui-color-surface',
      '--ui-color-surface-alt',
      '--ui-color-text',
      '--ui-color-muted',
      '--ui-color-border',
      '--ui-color-focus-ring',
      '--ui-color-success',
      '--ui-color-danger',
      '--ui-color-warning',
      '--ui-primary',
      '--ui-primary-hover',
      '--ui-foreground',
      '--ui-background',
      '--ui-surface',
      '--ui-surface-alt',
      '--ui-text',
      '--ui-muted',
      '--ui-border',
      '--ui-focus-ring',
      '--ui-radius',
      '--color-background',
      '--color-surface',
      '--color-panel',
      '--color-panel-solid',
      '--color-panel-translucent',
      '--color-overlay',
      '--accent-contrast',
      '--accent-surface',
      '--accent-indicator',
      '--accent-track',
      '--ui-menubar-ring',
      '--ui-menubar-z',
      '--ui-menubar-panel-bg',
      '--ui-menubar-panel-color',
      '--ui-menubar-panel-border',
      '--ui-menubar-panel-shadow',
      '--ui-menubar-panel-radius',
      '--ui-menubar-panel-padding',
      '--ui-menubar-panel-min-width',
      '--ui-menubar-panel-item-radius',
      '--ui-menubar-panel-item-gap',
      '--ui-menubar-panel-item-min-height',
      '--ui-menubar-panel-item-pad-y',
      '--ui-menubar-panel-item-pad-x',
      '--ui-menubar-panel-item-font-size',
      '--ui-menubar-panel-item-font-weight',
      '--ui-menubar-panel-item-line-height',
      '--ui-menubar-panel-separator-margin',
      '--ui-menubar-panel-item-hover-bg',
      '--ui-menubar-panel-item-active-color'
    ];
    tokenNames.forEach((token) => {
      const value = computed.getPropertyValue(token).trim();
      if (value) panel.style.setProperty(token, value);
      else panel.style.removeProperty(token);
    });
    PORTAL_THEME_VARIABLES.forEach((token) => {
      const value = computed.getPropertyValue(token).trim();
      if (value) panel.style.setProperty(token, value);
      else panel.style.removeProperty(token);
    });
    PORTAL_THEME_SCALES.forEach(({ prefix, from, to }) => {
      for (let index = from; index <= to; index += 1) {
        const token = `${prefix}${index}`;
        const value = computed.getPropertyValue(token).trim();
        if (value) panel.style.setProperty(token, value);
        else panel.style.removeProperty(token);
      }
    });
  }

  private _syncPanelVisualState(): void {
    const panel = this._portalEl;
    if (!panel) return;
    this._setPanelFlag('open', this._open);
    this._applyPanelVariantData(panel);
    this._applyPanelTokens(panel);
    const surface = this._panelSurface();
    if (surface) {
      surface.setAttribute('aria-hidden', 'false');
      surface.setAttribute('aria-busy', 'false');
      surface.removeAttribute('hidden');
      surface.style.display = 'block';
      surface.style.visibility = 'visible';
      surface.style.opacity = '1';
      surface.style.transform = 'translateY(0px) scale(1)';
      surface.style.pointerEvents = 'auto';
    }
    const stateRow = panel.querySelector('.state-row') as HTMLElement | null;
    if (stateRow) stateRow.textContent = '';
    this._schedulePanelSubmenuLayout();
  }

  private _rebuildPanel(): void {
    if (!this._open) return;
    const selected = this._selectedIndex();
    const anchor = this._items[selected];
    if (selected < 0 || !anchor) {
      this._teardownPanel();
      return;
    }

    this._teardownPanel();
    const panel = this._buildPanelContent(selected);
    this._portalEl = panel;
    this._portalSurfaceEl = panel.querySelector('.surface') as HTMLElement | null;
    this._portalContentHostEl = panel.querySelector('ui-listbox.content-host') as UIListbox | null;
    this._panelForIndex = selected;
    const root = createPortalContainer();
    if (!root) {
      this._portalEl = null;
      this._panelForIndex = -1;
      return;
    }
    root.appendChild(panel);

    this._positioner = createPositioner({
      anchor,
      floating: this._panelSurface() || panel,
      placement: toPositionerPlacement(this.getAttribute('placement')),
      offset: 6,
      flip: true,
      shift: true,
      fitViewport: true,
      observeScroll: false
    });

    this._dismissableLayer = createDismissableLayer({
      node: this._panelSurface() || panel,
      trigger: anchor,
      closeOnEscape: true,
      closeOnPointerOutside: true,
      onDismiss: () => this.close()
    });
  }

  private _teardownPanel(): void {
    this._dismissableLayer?.destroy();
    this._dismissableLayer = null;
    this._positioner?.destroy();
    this._positioner = null;

    if (this._portalEl?.parentElement) {
      try {
        this._portalEl.parentElement.removeChild(this._portalEl);
      } catch {
        // no-op
      }
    }

    this._portalEl = null;
    this._portalSurfaceEl = null;
    this._portalContentHostEl = null;
    this._panelForIndex = -1;
    if (this._submenuRaf != null) {
      cancelAnimationFrame(this._submenuRaf);
      this._submenuRaf = null;
    }
    this._resetTypeahead();
  }

  private _selectIndex(index: number, reason: MenubarReason): void {
    const previous = this._selectedIndex();
    const next = clampIndex(index, this._items.length);
    if (next < 0) return;

    this._setSelectedAttribute(next);
    this.setAttribute('open', '');
    this._syncState();

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { selected: next, previous, open: true, reason },
        bubbles: true
      })
    );
  }

  private _focusItem(index: number): void {
    const target = this._items[index];
    if (!target) return;
    this._focusIndex = index;
    syncRovingTabStops(this._items, target, { activeAttribute: null });
    focusRovingItem(target);
  }

  private _queryPanelItems(): PanelItem[] {
    return this._queryPanelItemsIn(this._panelListbox());
  }

  private _focusPanelItem(item: PanelItem | null): void {
    if (!item) return;
    this._panelListbox()?.setActiveItem(item, { focus: true, owner: this._panelSurface(), scroll: true });
  }

  private _focusPanelFirst(): void {
    this._panelListbox()?.focusBoundary('first', { focus: true, owner: this._panelSurface(), scroll: true });
  }

  private _focusPanelLast(): void {
    this._panelListbox()?.focusBoundary('last', { focus: true, owner: this._panelSurface(), scroll: true });
  }

  private _movePanelFocus(step: 1 | -1): void {
    const active = document.activeElement as HTMLElement | null;
    const current = active && this._portalEl?.contains(active) ? (active.closest(panelItemSelector()) as PanelItem | null) : null;
    const container = (current?.closest('.submenu') as HTMLElement | null) || this._panelListbox();
    const moved = this._panelListbox()?.move(step, {
      container,
      current: active && this._portalEl?.contains(active) ? active : null,
      focus: true,
      owner: this._panelSurface(),
      scroll: true
    }) || null;
    if (!moved) {
      this._focusPanelFirst();
    }
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

  private _typeaheadOnBar(event: KeyboardEvent): boolean {
    if (!this.typeahead) return false;
    if (!this._isTypeaheadKey(event)) return false;

    this._typeaheadBuffer = `${this._typeaheadBuffer}${event.key.toLowerCase()}`.slice(0, 24);
    if (this._typeaheadTimer != null) window.clearTimeout(this._typeaheadTimer);
    this._typeaheadTimer = window.setTimeout(() => this._resetTypeahead(), 420);

    const focusIndex = this._items.findIndex((item) => item === event.target || item.contains(event.target as Node));
    const matchedIndex = findTypeaheadMatch(this._items, this._typeaheadBuffer, {
      startIndex: focusIndex,
      getLabel: (item) => item.getAttribute('aria-label') || item.textContent || '',
      getDisabled: isDisabledBarItem
    });
    if (matchedIndex < 0) return false;

    event.preventDefault();
    this._focusItem(matchedIndex);
    if (this._open) this._selectIndex(matchedIndex, 'keyboard');
    return true;
  }

  private _typeaheadOnPanel(event: KeyboardEvent): boolean {
    if (!this.typeahead) return false;
    if (!this._isTypeaheadKey(event)) return false;

    this._typeaheadBuffer = `${this._typeaheadBuffer}${event.key.toLowerCase()}`.slice(0, 24);
    if (this._typeaheadTimer != null) window.clearTimeout(this._typeaheadTimer);
    this._typeaheadTimer = window.setTimeout(() => this._resetTypeahead(), 420);

    const active = document.activeElement as HTMLElement | null;
    const current = active && this._portalEl?.contains(active) ? (active.closest(panelItemSelector()) as PanelItem | null) : null;
    const container = (current?.closest('.submenu') as HTMLElement | null) || this._panelListbox();
    const matched = this._panelListbox()?.typeahead(this._typeaheadBuffer, {
      container,
      current: active && this._portalEl?.contains(active) ? active : null,
      focus: true,
      owner: this._panelSurface(),
      scroll: true
    }) || null;
    if (!matched) return false;

    event.preventDefault();
    return true;
  }

  private _applyPanelSelectionBehavior(item: PanelItem): void {
    const role = item.getAttribute('role');
    if (role === 'menuitemcheckbox') {
      const nextChecked = item.getAttribute('aria-checked') !== 'true';
      item.setAttribute('aria-checked', nextChecked ? 'true' : 'false');
      item.setAttribute('data-state', nextChecked ? 'checked' : 'unchecked');
      return;
    }
    if (role !== 'menuitemradio') return;

    const panel = (item.closest('.submenu') as HTMLElement | null) || this._panelListbox();
    if (!panel) return;
    const group = item.getAttribute('data-group') || item.getAttribute('name') || '';
    const radios = Array.from(panel.querySelectorAll<PanelItem>('[role="menuitemradio"]'));
    radios.forEach((radio) => {
      if (group) {
        const radioGroup = radio.getAttribute('data-group') || radio.getAttribute('name') || '';
        if (radioGroup !== group) return;
      }
      radio.setAttribute('aria-checked', 'false');
      radio.setAttribute('data-state', 'unchecked');
    });
    item.setAttribute('aria-checked', 'true');
    item.setAttribute('data-state', 'checked');
  }

  private _onClick(event: MouseEvent): void {
    const path = event.composedPath();
    const index = this._items.findIndex((item) => path.includes(item));
    if (index < 0) return;

    this._focusItem(index);
    const selected = this._selectedIndex();
    if (selected === index && this._open) {
      this.close();
      this._syncState();
      return;
    }
    this._selectIndex(index, 'click');
  }

  private _onMouseMove(event: MouseEvent): void {
    if (!this._open) return;
    const path = event.composedPath();
    const index = this._items.findIndex((item) => path.includes(item));
    if (index < 0) return;
    if (index === this._selectedIndex()) return;
    this._selectIndex(index, 'programmatic');
  }

  private _onDocScroll(event: Event): void {
    if (!this._open || !this.closeOnScroll) return;
    const path = typeof (event as any).composedPath === 'function' ? (event as any).composedPath() : [];
    if (this._portalEl && path.includes(this._portalEl)) return;
    this.close();
  }

  private _onPanelPointerOver(event: PointerEvent): void {
    if (!this._open) return;
    const item = firstMatchingPanelItemFromEvent(event);
    if (!item || isDisabledPanelItem(item)) return;
    const container = (item.closest('.submenu') as HTMLElement | null) || this._panelListbox();
    this._panelListbox()?.setActiveItem(item, {
      container,
      focus: false,
      owner: this._panelSurface(),
      scroll: false
    });
    if (this._submenuFor(item)) this._openPanelSubmenu(item, false);
    else this._setOpenPanelBranch(item, false);
  }

  private _onPanelPointerLeave(event: PointerEvent): void {
    if (!(event.currentTarget instanceof HTMLElement)) return;
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    this._clearPanelSubmenuState();
  }

  private _onPanelFocusIn(event: FocusEvent): void {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const item = target.closest(panelItemSelector()) as PanelItem | null;
    if (!item) return;
    if (this._submenuFor(item)) this._setOpenPanelBranch(item, true);
    else this._setOpenPanelBranch(item, false);
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const focusIndex = this._items.findIndex((item) => item === event.target || item.contains(event.target as Node));
    if (focusIndex < 0) return;

    const dir = getComputedStyle(this).direction === 'rtl' ? 'rtl' : 'ltr';
    let handled = false;
    let next = focusIndex;
    const fallbackIndex = resolveRovingFocusIndex(this._items, {
      activeIndex: focusIndex,
      selectedIndex: this._selectedIndex(),
      getDisabled: isDisabledBarItem
    });

    if (event.key === 'ArrowRight') {
      next = moveRovingFocusIndex(this._items, focusIndex, dir === 'rtl' ? -1 : 1, {
        wrap: this._loopEnabled(),
        fallbackIndex,
        getDisabled: isDisabledBarItem
      });
      handled = true;
    } else if (event.key === 'ArrowLeft') {
      next = moveRovingFocusIndex(this._items, focusIndex, dir === 'rtl' ? 1 : -1, {
        wrap: this._loopEnabled(),
        fallbackIndex,
        getDisabled: isDisabledBarItem
      });
      handled = true;
    } else if (event.key === 'Home') {
      next = getRovingFocusBoundaryIndex(this._items, 'first', isDisabledBarItem);
      handled = true;
    } else if (event.key === 'End') {
      next = getRovingFocusBoundaryIndex(this._items, 'last', isDisabledBarItem);
      handled = true;
    } else if (event.key === 'Enter' || event.key === ' ') {
      this._selectIndex(focusIndex, 'keyboard');
      handled = true;
    } else if (event.key === 'ArrowDown') {
      this._selectIndex(focusIndex, 'keyboard');
      setTimeout(() => this._focusPanelFirst(), 0);
      handled = true;
    } else if (event.key === 'ArrowUp') {
      this._selectIndex(focusIndex, 'keyboard');
      setTimeout(() => this._focusPanelLast(), 0);
      handled = true;
    }

    if (!handled && this._typeaheadOnBar(event)) return;

    if (handled) {
      event.preventDefault();
      if (next >= 0 && next !== focusIndex) {
        this._focusItem(next);
        if (this._open) this._selectIndex(next, 'keyboard');
      }
    }
  }

  private _onDocKeyDown(event: KeyboardEvent): void {
    if (!this._open) return;

    const insidePanel = !!this._portalEl && event.composedPath().includes(this._portalEl);
    if (!insidePanel) {
      return;
    }

    if (this._typeaheadOnPanel(event)) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._movePanelFocus(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._movePanelFocus(-1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this._focusPanelFirst();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this._focusPanelLast();
      return;
    }

    const active = document.activeElement as HTMLElement | null;
    const item = active?.closest(panelItemSelector()) as PanelItem | null;

    if (event.key === 'ArrowRight') {
      if (item && this._openPanelSubmenu(item, true)) {
        event.preventDefault();
        return;
      }
    }

    if (event.key === 'ArrowLeft') {
      if (item && this._closeParentPanelSubmenu(item)) {
        event.preventDefault();
        return;
      }
    }

    if (event.key === 'Tab') {
      this.close();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      if (!active || !this._portalEl?.contains(active)) return;
      if (!item || isDisabledPanelItem(item)) return;
      event.preventDefault();
      if (this._openPanelSubmenu(item, true)) return;
      item.click();
    }
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-menubar')) {
  customElements.define('ui-menubar', UIMenubar);
}

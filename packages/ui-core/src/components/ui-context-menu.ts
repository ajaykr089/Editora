import { ElementBase } from '../ElementBase';
import { createPortalContainer } from '../portal';
import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import { createSharedMenuItemCss } from './menu-item-styles';
import './ui-listbox';
import type { UIListbox } from './ui-listbox';

type Point = { x: number; y: number };
type RectLike = { top: number; left: number; right: number; bottom: number; width: number; height: number };
type ContextMenuState = 'idle' | 'loading' | 'error' | 'success';
type ContextMenuPlacement = 'bottom' | 'top' | 'left' | 'right';
type ContextMenuOpenSource = 'api' | 'contextmenu' | 'anchor' | 'outside' | 'select' | 'escape' | 'attribute';
type MenuLikeItem = HTMLElement & { disabled?: boolean };

type ContextMenuOpenDetail = {
  open: boolean;
  previousOpen: boolean;
  source: ContextMenuOpenSource;
};

const ITEM_SELECTOR = '.menuitem, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [data-menu-item]';
const ROOT_ITEM_SELECTOR = [
  ':scope > .menuitem',
  ':scope > [role="menuitem"]',
  ':scope > [role="menuitemcheckbox"]',
  ':scope > [role="menuitemradio"]',
  ':scope > [data-menu-item]'
].join(', ');
const SUBMENU_SELECTOR = ':scope > .submenu';
const POSITION_GAP = 8;
const ANCHOR_OFFSET = 6;
const TYPEAHEAD_RESET_MS = 420;
const SUBMENU_INTENT_MS = 110;
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
const PORTAL_CONTEXT_MENU_VARIABLES = [
  '--base-context-menu-bg',
  '--base-context-menu-radius',
  '--base-context-menu-shadow',
  '--base-context-menu-min-width',
  '--base-context-menu-padding',
  '--base-context-menu-item-radius',
  '--base-context-menu-item-gap',
  '--base-context-menu-item-height',
  '--base-context-menu-item-padding-y',
  '--base-context-menu-item-padding-x',
  '--base-context-menu-item-font-size',
  '--base-context-menu-item-line-height',
  '--base-context-menu-submenu-radius',
  '--base-context-menu-submenu-padding'
] as const;

const shadowStyle = `
  :host {
    position: fixed;
    inset: 0;
    display: block;
    pointer-events: none;
    z-index: var(--ui-context-menu-z, 1600);
    color-scheme: light dark;

    --ui-context-menu-bg: var(--base-context-menu-bg, var(--color-panel-solid, var(--ui-color-surface, var(--ui-surface, #ffffff))));
    --ui-context-menu-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-context-menu-border-color: color-mix(in srgb, var(--ui-color-border, var(--ui-border, #cbd5e1)) 86%, transparent);
    --ui-context-menu-border: 1px solid var(--ui-context-menu-border-color);
    --ui-context-menu-radius: var(--base-context-menu-radius, var(--ui-radius, 4px));
    --ui-context-menu-shadow: var(--base-context-menu-shadow, var(--shadow-5));
    --ui-context-menu-min-width: var(--base-context-menu-min-width, 240px);
    --ui-context-menu-padding: var(--base-context-menu-padding, 6px);
    --ui-context-menu-transition: 150ms cubic-bezier(0.2, 0.9, 0.24, 1);
    --ui-context-menu-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-context-menu-submenu-gap: 4px;
    --ui-context-menu-item-radius: var(--base-context-menu-item-radius, calc(var(--ui-context-menu-radius) - 1px));
    --ui-context-menu-item-gap: var(--base-context-menu-item-gap, 12px);
    --ui-context-menu-item-min-height: var(--base-context-menu-item-height, 36px);
    --ui-context-menu-item-pad-y: var(--base-context-menu-item-padding-y, 8px);
    --ui-context-menu-item-pad-x: var(--base-context-menu-item-padding-x, 10px);
    --ui-context-menu-item-font-size: var(--base-context-menu-item-font-size, 14px);
    --ui-context-menu-item-font-weight: 400;
    --ui-context-menu-item-line-height: var(--base-context-menu-item-line-height, 20px);
    --ui-context-menu-item-hover-bg: color-mix(in srgb, var(--gray-a4, rgba(15, 23, 42, 0.08)) 82%, transparent);
    --ui-context-menu-item-active-color: inherit;
    --ui-context-menu-separator-margin: 6px 10px;
    --ui-context-menu-submenu-radius: var(--base-context-menu-submenu-radius, var(--ui-context-menu-radius));
    --ui-context-menu-submenu-padding: var(--base-context-menu-submenu-padding, 6px);
    --ui-context-menu-status-bg: color-mix(in srgb, var(--ui-context-menu-bg) 92%, transparent);
    --ui-context-menu-status-border: color-mix(in srgb, var(--ui-context-menu-border-color) 76%, transparent);
    --ui-context-menu-status-text: color-mix(in srgb, var(--ui-context-menu-color) 64%, transparent);
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-context-menu-padding: 4px;
    --ui-context-menu-item-gap: 8px;
    --ui-context-menu-item-min-height: 32px;
    --ui-context-menu-item-pad-y: 6px;
    --ui-context-menu-item-pad-x: 8px;
    --ui-context-menu-item-font-size: 13px;
    --ui-context-menu-item-line-height: 18px;
    --ui-context-menu-separator-margin: 4px 8px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-context-menu-padding: 8px;
    --ui-context-menu-item-gap: 12px;
    --ui-context-menu-item-min-height: 40px;
    --ui-context-menu-item-pad-y: 9px;
    --ui-context-menu-item-pad-x: 12px;
    --ui-context-menu-item-font-size: 15px;
    --ui-context-menu-item-line-height: 22px;
    --ui-context-menu-separator-margin: 8px 12px;
  }

  :host([radius="none"]) {
    --ui-context-menu-radius: 0px;
    --ui-context-menu-item-radius: 0px;
    --ui-context-menu-submenu-radius: 0px;
  }

  :host([radius="sm"]) {
    --ui-context-menu-radius: 8px;
    --ui-context-menu-item-radius: 7px;
    --ui-context-menu-submenu-radius: 8px;
  }

  :host([radius="md"]) {
    --ui-context-menu-radius: 12px;
    --ui-context-menu-item-radius: 10px;
    --ui-context-menu-submenu-radius: 12px;
  }

  :host([radius="lg"]) {
    --ui-context-menu-radius: 16px;
    --ui-context-menu-item-radius: 14px;
    --ui-context-menu-submenu-radius: 16px;
  }

  :host([radius="full"]) {
    --ui-context-menu-radius: 999px;
    --ui-context-menu-item-radius: 999px;
    --ui-context-menu-submenu-radius: 20px;
  }

  :host([shape="square"]) {
    --ui-context-menu-radius: 6px;
    --ui-context-menu-item-radius: 4px;
    --ui-context-menu-submenu-radius: 6px;
  }

  :host([shape="soft"]) {
    --ui-context-menu-radius: 16px;
    --ui-context-menu-item-radius: 12px;
    --ui-context-menu-submenu-radius: 14px;
  }

  :host([density="compact"]) {
    --ui-context-menu-padding: 4px;
    --ui-context-menu-item-gap: 8px;
    --ui-context-menu-item-min-height: 32px;
    --ui-context-menu-item-pad-y: 6px;
    --ui-context-menu-item-pad-x: 8px;
    --ui-context-menu-item-font-size: 12px;
    --ui-context-menu-separator-margin: 4px 8px;
  }

  :host([density="comfortable"]) {
    --ui-context-menu-padding: 8px;
    --ui-context-menu-item-gap: 12px;
    --ui-context-menu-item-min-height: 40px;
    --ui-context-menu-item-pad-y: 9px;
    --ui-context-menu-item-pad-x: 12px;
    --ui-context-menu-item-font-size: 14px;
    --ui-context-menu-separator-margin: 8px 12px;
  }

  :host([elevation="none"]) {
    --ui-context-menu-shadow: none;
  }

  :host([elevation="low"]) {
    --ui-context-menu-shadow:
      0 16px 34px rgba(15, 23, 42, 0.14),
      0 4px 10px rgba(15, 23, 42, 0.08);
  }

  :host([elevation="high"]) {
    --ui-context-menu-shadow:
      0 36px 72px rgba(15, 23, 42, 0.24),
      0 10px 24px rgba(15, 23, 42, 0.12);
  }

  :host([variant="surface"]) {
    --ui-context-menu-shadow: var(--base-context-menu-shadow, var(--shadow-4));
  }

  :host([variant="soft"]) {
    --ui-context-menu-bg: color-mix(in srgb, var(--base-context-menu-bg, var(--color-panel-solid, #ffffff)) 94%, var(--accent-surface, transparent));
    --ui-context-menu-item-hover-bg: color-mix(in srgb, var(--ui-context-menu-ring) 13%, transparent);
  }

  :host([variant="solid"]) {
    --ui-context-menu-item-hover-bg: color-mix(in srgb, var(--ui-context-menu-ring) 88%, #0f172a 12%);
    --ui-context-menu-item-active-color: var(--ui-color-foreground-on-primary, var(--ui-foreground, #ffffff));
  }

  :host([variant="outline"]) {
    --ui-context-menu-shadow: none;
    --ui-context-menu-bg: var(--base-context-menu-bg, var(--color-panel-solid, #ffffff));
    --ui-context-menu-item-hover-bg: color-mix(in srgb, var(--ui-context-menu-ring) 8%, transparent);
  }

  :host([variant="flat"]) {
    --ui-context-menu-shadow: none;
  }

  :host([variant="contrast"]) {
    --ui-context-menu-bg: #0f172a;
    --ui-context-menu-color: #f8fafc;
    --ui-context-menu-border-color: #334155;
    --ui-context-menu-ring: #93c5fd;
    --ui-context-menu-item-hover-bg: color-mix(in srgb, #ffffff 12%, transparent);
  }

  :host([tone="danger"]) {
    --ui-context-menu-ring: #ef4444;
    --ui-context-menu-item-hover-bg: color-mix(in srgb, #ef4444 12%, transparent);
    --ui-context-menu-item-active-color: inherit;
  }

  :host([tone="success"]) {
    --ui-context-menu-ring: #16a34a;
    --ui-context-menu-item-hover-bg: color-mix(in srgb, #16a34a 12%, transparent);
    --ui-context-menu-item-active-color: inherit;
  }

  :host([tone="warning"]) {
    --ui-context-menu-ring: #d97706;
    --ui-context-menu-item-hover-bg: color-mix(in srgb, #d97706 12%, transparent);
    --ui-context-menu-item-active-color: inherit;
  }

  :host([tone="info"]) {
    --ui-context-menu-ring: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-context-menu-item-hover-bg: color-mix(in srgb, var(--ui-color-primary, var(--ui-primary, #2563eb)) 12%, transparent);
    --ui-context-menu-item-active-color: inherit;
  }

  :host([tone="neutral"]) {
    --ui-context-menu-ring: color-mix(in srgb, var(--ui-color-muted, #64748b) 60%, var(--ui-color-text, #0f172a));
    --ui-context-menu-item-hover-bg: color-mix(in srgb, var(--ui-color-muted, #64748b) 12%, transparent);
    --ui-context-menu-item-active-color: inherit;
  }

  .surface {
    position: fixed;
    left: 0;
    top: 0;
    min-width: var(--ui-context-menu-min-width);
    max-width: min(360px, calc(100vw - 16px));
    padding: var(--ui-context-menu-padding);
    border: var(--ui-context-menu-border);
    border-radius: var(--ui-context-menu-radius);
    background: var(--ui-context-menu-bg);
    color: var(--ui-context-menu-color);
    box-shadow: var(--ui-context-menu-shadow);
    overflow: visible;
    isolation: isolate;
    opacity: 0;
    transform: translateY(4px) scale(0.985);
    transform-origin: top left;
    transition:
      opacity var(--ui-context-menu-transition),
      transform var(--ui-context-menu-transition),
      border-color var(--ui-context-menu-transition),
      box-shadow var(--ui-context-menu-transition);
    pointer-events: none;
    outline: none;
  }

  :host([open]) .surface {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }

  :host([disabled]) .surface,
  :host([state="loading"]) .surface,
  :host([headless]) .surface {
    pointer-events: none;
  }

  :host([headless]) .surface {
    display: none;
  }

  .state-row {
    display: none;
    margin: 0 2px 6px;
    min-height: 24px;
    padding: 0 8px;
    border-radius: 8px;
    border: 1px solid var(--ui-context-menu-status-border);
    background: var(--ui-context-menu-status-bg);
    color: var(--ui-context-menu-status-text);
    font: 600 11px/24px Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    user-select: none;
  }

  :host([state="loading"]) .state-row,
  :host([state="error"]) .state-row,
  :host([state="success"]) .state-row {
    display: block;
  }

  :host([state="loading"]) {
    --ui-context-menu-status-bg: color-mix(in srgb, #f59e0b 16%, transparent);
    --ui-context-menu-status-border: color-mix(in srgb, #f59e0b 46%, var(--ui-context-menu-border-color));
    --ui-context-menu-status-text: #a16207;
  }

  :host([state="error"]) {
    --ui-context-menu-status-bg: color-mix(in srgb, #ef4444 14%, transparent);
    --ui-context-menu-status-border: color-mix(in srgb, #ef4444 46%, var(--ui-context-menu-border-color));
    --ui-context-menu-status-text: #b91c1c;
  }

  :host([state="success"]) {
    --ui-context-menu-status-bg: color-mix(in srgb, #16a34a 14%, transparent);
    --ui-context-menu-status-border: color-mix(in srgb, #16a34a 46%, var(--ui-context-menu-border-color));
    --ui-context-menu-status-text: #15803d;
  }
`;

const lightDomStyle = `
  ui-context-menu [slot="menu"],
  ui-context-menu [slot="content"] {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  ${createSharedMenuItemCss({
    scopes: ['ui-context-menu [slot="menu"]', 'ui-context-menu [slot="content"]'],
    prefix: '--ui-context-menu',
    itemSelectors: ['.menuitem', '[role="menuitem"]', '[role="menuitemcheckbox"]', '[role="menuitemradio"]', '[data-menu-item]'],
    activeStateSelectors: ['.menuitem[data-submenu-open="true"]', '[role="menuitem"][data-submenu-open="true"]'],
  })}

  ui-context-menu [slot="menu"] .submenu,
  ui-context-menu [slot="content"] .submenu {
    position: absolute;
    top: -6px;
    left: calc(100% + var(--ui-context-menu-submenu-gap, 4px));
    min-width: max(220px, 100%);
    padding: var(--ui-context-menu-submenu-padding, 6px);
    border: 1px solid var(--ui-context-menu-border-color, rgba(15, 23, 42, 0.14));
    border-radius: var(--ui-context-menu-submenu-radius, 10px);
    background: var(--ui-context-menu-bg, #ffffff);
    color: var(--ui-context-menu-color, #0f172a);
    box-shadow: var(--ui-context-menu-shadow, 0 24px 56px rgba(15, 23, 42, 0.18));
    opacity: 0;
    visibility: hidden;
    transform: translateY(4px) scale(0.985);
    transform-origin: top left;
    pointer-events: none;
    transition: opacity 150ms cubic-bezier(0.2, 0.9, 0.24, 1), transform 150ms cubic-bezier(0.2, 0.9, 0.24, 1);
    z-index: 1;
  }

  ui-context-menu [slot="menu"] .menuitem[data-submenu-open="true"] > .submenu,
  ui-context-menu [slot="menu"] [role="menuitem"][data-submenu-open="true"] > .submenu,
  ui-context-menu [slot="content"] .menuitem[data-submenu-open="true"] > .submenu,
  ui-context-menu [slot="content"] [role="menuitem"][data-submenu-open="true"] > .submenu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }

  ui-context-menu [slot="menu"] .menuitem[data-submenu-side="left"] > .submenu,
  ui-context-menu [slot="menu"] [role="menuitem"][data-submenu-side="left"] > .submenu,
  ui-context-menu [slot="content"] .menuitem[data-submenu-side="left"] > .submenu,
  ui-context-menu [slot="content"] [role="menuitem"][data-submenu-side="left"] > .submenu {
    left: auto;
    right: calc(100% + var(--ui-context-menu-submenu-gap, 4px));
    transform-origin: top right;
  }

  ui-context-menu [slot="menu"] .menuitem[data-submenu-align="up"] > .submenu,
  ui-context-menu [slot="menu"] [role="menuitem"][data-submenu-align="up"] > .submenu,
  ui-context-menu [slot="content"] .menuitem[data-submenu-align="up"] > .submenu,
  ui-context-menu [slot="content"] [role="menuitem"][data-submenu-align="up"] > .submenu {
    top: auto;
    bottom: -6px;
  }
`;

function ensureLightDomStyle(): void {
  if (typeof document === 'undefined') return;
  const styleId = 'ui-context-menu-light-dom-style';
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = lightDomStyle;
  document.head.appendChild(style);
}

function scopeCssRules(css: string, scope: string): string {
  return css.replace(/(^|})\s*([^@}{][^{}]*)\{/g, (match, boundary: string, selectorGroup: string) => {
    const scopedSelectors = selectorGroup
      .split(',')
      .map((selector) => selector.trim())
      .filter(Boolean)
      .map((selector) => (selector.startsWith(scope) ? selector : `${scope} ${selector}`))
      .join(', ');
    return `${boundary}\n${scopedSelectors} {`;
  });
}

function toPortalShadowStyle(css: string): string {
  const withHostSelectors = css
    .replace(/:host\(\[([a-z-]+)(?:="([^"]+)")?\]\)/g, (_match, name: string, value?: string) => {
      if (value != null) return `.ui-context-menu-portal[data-${name}="${value}"]`;
      return `.ui-context-menu-portal[data-${name}="true"]`;
    })
    .replace(/:host/g, '.ui-context-menu-portal');
  return scopeCssRules(withHostSelectors, '.ui-context-menu-portal');
}

function toPortalLightDomStyle(css: string): string {
  return css.replace(/(^|,)\s*ui-context-menu\b/gm, (match, boundary: string) => `${boundary} .ui-context-menu-portal`);
}

const portalStyle = `${toPortalShadowStyle(shadowStyle)}\n${toPortalLightDomStyle(lightDomStyle)}`;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toPoint(x: number | Point, y?: number): Point {
  if (typeof x === 'number') return { x, y: typeof y === 'number' ? y : 0 };
  return x;
}

function parsePlacement(value: string | null): ContextMenuPlacement {
  if (value === 'top' || value === 'left' || value === 'right') return value;
  return 'bottom';
}

function normalizeMenuSize(value: string | null): 'sm' | 'md' | 'lg' | '' {
  if (!value) return '';
  const normalized = value.trim().toLowerCase();
  if (normalized === '1') return 'sm';
  if (normalized === '2') return 'md';
  if (normalized === '3') return 'lg';
  if (normalized === 'sm' || normalized === 'md' || normalized === 'lg') return normalized;
  if (normalized === 'compact') return 'sm';
  if (normalized === 'comfortable') return 'lg';
  return '';
}

function normalizeMenuRadius(value: string | null): string {
  if (!value) return '';
  const normalized = value.trim().toLowerCase();
  if (!normalized) return '';
  if (normalized === 'none') return '0px';
  if (normalized === 'sm') return '8px';
  if (normalized === 'md') return '12px';
  if (normalized === 'lg') return '16px';
  if (normalized === 'full') return '999px';
  if (normalized === 'square') return '6px';
  if (normalized === 'soft') return '16px';
  if (/^\d+(\.\d+)?$/.test(normalized)) return `${normalized}px`;
  return value;
}

function isVisible(node: HTMLElement): boolean {
  if (!node.isConnected) return false;
  if (node.hidden) return false;
  const style = window.getComputedStyle(node);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  return true;
}

function isElementVisibleInDom(node: HTMLElement): boolean {
  if (!node.isConnected) return false;
  const style = window.getComputedStyle(node);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  const rect = node.getBoundingClientRect();
  if (rect.width > 0 || rect.height > 0) return true;
  const styleWidth = Number.parseFloat(style.width || '0');
  const styleHeight = Number.parseFloat(style.height || '0');
  return styleWidth > 0 || styleHeight > 0;
}

function isDisabled(item: MenuLikeItem): boolean {
  const ariaDisabled = item.getAttribute('aria-disabled');
  return item.hasAttribute('disabled') || ariaDisabled === 'true' || item.disabled === true;
}

function normalizeText(value: string | null | undefined): string {
  return (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function getItemText(item: MenuLikeItem): string {
  return normalizeText(item.getAttribute('aria-label') || item.textContent);
}

function findInPath(path: EventTarget[]): MenuLikeItem | null {
  for (const part of path) {
    if (!(part instanceof HTMLElement)) continue;
    if (part.matches(ITEM_SELECTOR)) return part as MenuLikeItem;
  }
  return null;
}

function findFirstEnabled(items: MenuLikeItem[]): MenuLikeItem | null {
  return items.find((item) => !isDisabled(item)) || null;
}

function findLastEnabled(items: MenuLikeItem[]): MenuLikeItem | null {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (!isDisabled(items[index])) return items[index];
  }
  return null;
}

function getRectForPoint(point: Point): RectLike {
  return {
    top: point.y,
    left: point.x,
    right: point.x,
    bottom: point.y,
    width: 0,
    height: 0
  };
}

function computeMenuPosition(anchorRect: RectLike, menuWidth: number, menuHeight: number, placement: ContextMenuPlacement, offset: number) {
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  const maxX = Math.max(POSITION_GAP, viewportWidth - menuWidth - POSITION_GAP);
  const maxY = Math.max(POSITION_GAP, viewportHeight - menuHeight - POSITION_GAP);

  let resolvedPlacement = placement;
  let x = placement === 'left'
    ? anchorRect.left - menuWidth - offset
    : placement === 'right'
      ? anchorRect.right + offset
      : anchorRect.left;
  let y = placement === 'top'
    ? anchorRect.top - menuHeight - offset
    : placement === 'bottom'
      ? anchorRect.bottom + offset
      : anchorRect.top;

  if (placement === 'top' || placement === 'bottom') {
    if (resolvedPlacement === 'bottom' && y + menuHeight > viewportHeight - POSITION_GAP && anchorRect.top - menuHeight - offset >= POSITION_GAP) {
      resolvedPlacement = 'top';
      y = anchorRect.top - menuHeight - offset;
    } else if (resolvedPlacement === 'top' && y < POSITION_GAP && anchorRect.bottom + offset + menuHeight <= viewportHeight - POSITION_GAP) {
      resolvedPlacement = 'bottom';
      y = anchorRect.bottom + offset;
    }
  } else if (placement === 'left' || placement === 'right') {
    if (resolvedPlacement === 'right' && x + menuWidth > viewportWidth - POSITION_GAP && anchorRect.left - menuWidth - offset >= POSITION_GAP) {
      resolvedPlacement = 'left';
      x = anchorRect.left - menuWidth - offset;
    } else if (resolvedPlacement === 'left' && x < POSITION_GAP && anchorRect.right + offset + menuWidth <= viewportWidth - POSITION_GAP) {
      resolvedPlacement = 'right';
      x = anchorRect.right + offset;
    }
  }

  x = clamp(x, POSITION_GAP, maxX);
  y = clamp(y, POSITION_GAP, maxY);

  return {
    x: Math.round(x),
    y: Math.round(y),
    placement: resolvedPlacement,
    maxWidth: Math.max(160, viewportWidth - POSITION_GAP * 2),
    maxHeight: Math.max(120, viewportHeight - POSITION_GAP * 2)
  };
}

export class UIContextMenu extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'headless',
      'variant',
      'size',
      'radius',
      'density',
      'shape',
      'elevation',
      'tone',
      'close-on-select',
      'close-on-escape',
      'typeahead',
      'state',
      'state-text',
      'disabled',
      'placement'
    ];
  }

  private _isOpen = false;
  private _anchorEl: HTMLElement | null = null;
  private _point: Point = { x: 0, y: 0 };
  private _restoreFocusEl: HTMLElement | null = null;
  private _portalEl: HTMLElement | null = null;
  private _portalSurfaceEl: HTMLElement | null = null;
  private _portalContentHostEl: UIListbox | null = null;
  private _dismissableLayer: DismissableLayerHandle | null = null;
  private _contentAnchor: Comment | null = null;
  private _contentSourceEl: HTMLElement | null = null;
  private _contentOriginalParent: Node | null = null;
  private _positionRaf: number | null = null;
  private _submenuRaf: number | null = null;
  private _anchorTrackRaf: number | null = null;
  private _typeaheadBuffer = '';
  private _typeaheadTimer: number | null = null;
  private _submenuIntentTimer: number | null = null;
  private _submenuIntentItem: MenuLikeItem | null = null;
  private _hoveredItem: MenuLikeItem | null = null;
  private _lastAnchorRect: RectLike | null = null;
  private _resizeListenerBound = false;
  private _scrollListenerBound = false;
  private _nextOpenSource: ContextMenuOpenSource = 'attribute';

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
    this._onRootKeyDown = this._onRootKeyDown.bind(this);
    this._onRootPointerOver = this._onRootPointerOver.bind(this);
    this._onRootPointerLeave = this._onRootPointerLeave.bind(this);
    this._onRootFocusIn = this._onRootFocusIn.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
    this._onViewportChange = this._onViewportChange.bind(this);
    this._trackAnchorLayout = this._trackAnchorLayout.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    ensureLightDomStyle();
    this.addEventListener('contextmenu', this._onContextMenu as EventListener);
    this._syncVisualState();
    this._syncOpenState();
  }

  override disconnectedCallback(): void {
    this.removeEventListener('contextmenu', this._onContextMenu as EventListener);
    this._unbindGlobalListeners();
    this._cancelScheduledWork();
    this._teardownPortal();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'open') {
      this._syncOpenState();
      return;
    }

    if (name === 'headless') {
      if (this.headless && this._isOpen) this.close();
      this._syncSurfaceState();
      this._syncPortalVisualState();
      return;
    }

    if (name === 'disabled') {
      if (this.isDisabled && this._isOpen) this._setOpen(false, 'attribute');
      this._syncSurfaceState();
      this._syncPortalVisualState();
      return;
    }

    if (name === 'state' || name === 'state-text') {
      this._syncPortalVisualState();
      if (this.isConnected) this.requestRender();
      return;
    }

    if (name === 'variant' || name === 'size' || name === 'radius' || name === 'density' || name === 'shape' || name === 'elevation' || name === 'tone') {
      this._syncVisualState();
    }

    if (this._isOpen && (name === 'placement' || name === 'variant' || name === 'size' || name === 'radius' || name === 'density' || name === 'shape' || name === 'elevation' || name === 'tone')) {
      this._syncPortalVisualState();
      this._schedulePosition();
      this._scheduleSubmenuLayout();
    }
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(value: boolean) {
    this._setOpen(value, 'api');
  }

  get headless(): boolean {
    return this.hasAttribute('headless');
  }

  set headless(value: boolean) {
    if (value) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  get closeOnSelect(): boolean {
    const raw = this.getAttribute('close-on-select');
    return raw == null ? true : raw !== 'false' && raw !== '0';
  }

  set closeOnSelect(value: boolean) {
    this.setAttribute('close-on-select', value ? 'true' : 'false');
  }

  get closeOnEscape(): boolean {
    const raw = this.getAttribute('close-on-escape');
    return raw == null ? true : raw !== 'false' && raw !== '0';
  }

  set closeOnEscape(value: boolean) {
    this.setAttribute('close-on-escape', value ? 'true' : 'false');
  }

  get typeahead(): boolean {
    const raw = this.getAttribute('typeahead');
    return raw == null ? true : raw !== 'false' && raw !== '0';
  }

  set typeahead(value: boolean) {
    this.setAttribute('typeahead', value ? 'true' : 'false');
  }

  get state(): ContextMenuState {
    const raw = (this.getAttribute('state') || 'idle').toLowerCase();
    if (raw === 'loading' || raw === 'error' || raw === 'success') return raw;
    return 'idle';
  }

  set state(value: ContextMenuState) {
    if (value === 'idle') this.removeAttribute('state');
    else this.setAttribute('state', value);
  }

  get isDisabled(): boolean {
    const raw = this.getAttribute('disabled');
    return raw == null ? false : raw !== 'false' && raw !== '0';
  }

  set disabled(value: boolean) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  openAt(pointOrX: Point | number, y?: number): void {
    if (this.headless || this.isDisabled) return;
    this._anchorEl = null;
    this._point = toPoint(pointOrX, y);
    if (this._isOpen) {
      this._syncGlobalListeners(true);
      this._syncDismissableLayer();
      this._schedulePosition();
      this._scheduleSubmenuLayout();
      return;
    }
    this._setOpen(true, 'api');
  }

  openForAnchor(anchor: HTMLElement): void {
    if (this.headless || this.isDisabled) return;
    this._anchorEl = anchor;
    const rect = anchor.getBoundingClientRect();
    this._point = { x: rect.left, y: rect.bottom };
    if (this._isOpen) {
      this._syncGlobalListeners(true);
      this._syncDismissableLayer();
      this._schedulePosition();
      this._scheduleSubmenuLayout();
      return;
    }
    this._setOpen(true, 'anchor');
  }

  openForAnchorId(anchorId: string): void {
    const anchor = typeof document !== 'undefined' ? document.getElementById(anchorId) : null;
    if (anchor) this.openForAnchor(anchor);
  }

  showForAnchorId(anchorId: string): void {
    this.openForAnchorId(anchorId);
  }

  openFor(anchorOrId: HTMLElement | string): void {
    if (typeof anchorOrId === 'string') {
      this.openForAnchorId(anchorOrId);
      return;
    }
    this.openForAnchor(anchorOrId);
  }

  close(): void {
    this._setOpen(false, 'api');
  }

  getPortalContentHost(): HTMLElement | null {
    return this._portalContentHostEl;
  }

  refreshLayout(): void {
    if (!this._isOpen) return;
    this._normalizeMenuSemantics();
    this._schedulePosition();
    this._scheduleSubmenuLayout();
  }

  private _surface(): HTMLElement | null {
    return this._portalSurfaceEl || (this.root.querySelector('.surface') as HTMLElement | null);
  }

  private _listbox(): UIListbox | null {
    return this._portalContentHostEl || (this.root.querySelector('ui-listbox.content-host') as UIListbox | null);
  }

  private _menuHost(): HTMLElement | null {
    return this._contentSourceEl || this._portalContentHostEl || (this.querySelector('[slot="menu"]') as HTMLElement | null) || (this.querySelector('[slot="content"]') as HTMLElement | null);
  }

  private _stateText(): string {
    const explicit = this.getAttribute('state-text');
    if (explicit) return explicit;
    if (this.state === 'loading') return 'Loading actions';
    if (this.state === 'error') return 'Action unavailable';
    if (this.state === 'success') return 'Action ready';
    return '';
  }

  private _emitOpenState(open: boolean, previousOpen: boolean, source: ContextMenuOpenSource): void {
    const detail: ContextMenuOpenDetail = { open, previousOpen, source };
    this.dispatchEvent(new CustomEvent(open ? 'open' : 'close', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent(open ? 'ui-open' : 'ui-close', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail: { ...detail }, bubbles: true, composed: true }));
  }

  private _setOpen(next: boolean, source: ContextMenuOpenSource): void {
    if (next === this.open) return;
    if (next && (this.headless || this.isDisabled)) return;
    this._nextOpenSource = source;
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  private _syncOpenState(): void {
    const nowOpen = this.hasAttribute('open');
    const source = this._nextOpenSource;
    this._nextOpenSource = 'attribute';

    if (nowOpen === this._isOpen) {
      this._syncGlobalListeners(nowOpen);
      if (nowOpen) {
        if (!this._portalEl || !this._portalEl.isConnected) this._mountPortal();
        this._syncPortalVisualState();
        this._syncSurfaceState();
        this._syncDismissableLayer();
        this._schedulePosition();
        this._scheduleSubmenuLayout();
      } else {
        this._syncSurfaceState();
      }
      return;
    }

    this._isOpen = nowOpen;
    this._syncGlobalListeners(nowOpen);

    if (nowOpen) {
      this._restoreFocusEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      this._mountPortal();
      this._normalizeMenuSemantics();
      this._syncSurfaceState();
      this._emitOpenState(true, false, source);
      this._schedulePosition();
      this._scheduleSubmenuLayout();
      requestAnimationFrame(() => {
        this._focusFirstItem();
      });
      return;
    }

    this._clearSubmenuState();
    this._cancelScheduledWork();
    this._teardownPortal();
    this._syncSurfaceState();
    this._anchorEl = null;
    this._emitOpenState(false, true, source);

    if (this._restoreFocusEl?.isConnected) {
      try {
        this._restoreFocusEl.focus();
      } catch {
        // no-op
      }
    }
    this._restoreFocusEl = null;
  }

  private _syncSurfaceState(): void {
    const surface = this._surface();
    if (!surface) return;
    const visible = this._isOpen && !this.headless;
    const interactive = visible && !this.isDisabled && this.state !== 'loading';
    surface.setAttribute('aria-hidden', this._isOpen ? 'false' : 'true');
    surface.setAttribute('aria-busy', this.state === 'loading' ? 'true' : 'false');
    if (this._isOpen) surface.removeAttribute('hidden');
    else surface.setAttribute('hidden', '');
    surface.style.display = this.headless ? 'none' : 'block';
    surface.style.visibility = visible ? 'visible' : 'hidden';
    surface.style.opacity = visible ? '1' : '0';
    surface.style.transform = visible ? 'translateY(0) scale(1)' : 'translateY(4px) scale(0.985)';
    surface.style.pointerEvents = interactive ? 'auto' : 'none';
  }

  private _syncVisualState(): void {
    const normalizedSize = normalizeMenuSize(this.getAttribute('size') || this.getAttribute('density'));
    if (normalizedSize && normalizedSize !== 'md') this.setAttribute('data-ui-context-menu-size', normalizedSize);
    else this.removeAttribute('data-ui-context-menu-size');

    if (normalizedSize === 'sm') {
      this.style.setProperty('--ui-context-menu-padding', '4px');
      this.style.setProperty('--ui-context-menu-item-gap', '8px');
      this.style.setProperty('--ui-context-menu-item-min-height', '32px');
      this.style.setProperty('--ui-context-menu-item-pad-y', '6px');
      this.style.setProperty('--ui-context-menu-item-pad-x', '8px');
      this.style.setProperty('--ui-context-menu-item-font-size', '13px');
      this.style.setProperty('--ui-context-menu-item-line-height', '18px');
      this.style.setProperty('--ui-context-menu-separator-margin', '4px 8px');
    } else if (normalizedSize === 'lg') {
      this.style.setProperty('--ui-context-menu-padding', '8px');
      this.style.setProperty('--ui-context-menu-item-gap', '12px');
      this.style.setProperty('--ui-context-menu-item-min-height', '40px');
      this.style.setProperty('--ui-context-menu-item-pad-y', '9px');
      this.style.setProperty('--ui-context-menu-item-pad-x', '12px');
      this.style.setProperty('--ui-context-menu-item-font-size', '15px');
      this.style.setProperty('--ui-context-menu-item-line-height', '22px');
      this.style.setProperty('--ui-context-menu-separator-margin', '8px 12px');
    } else {
      this.style.removeProperty('--ui-context-menu-padding');
      this.style.removeProperty('--ui-context-menu-item-gap');
      this.style.removeProperty('--ui-context-menu-item-min-height');
      this.style.removeProperty('--ui-context-menu-item-pad-y');
      this.style.removeProperty('--ui-context-menu-item-pad-x');
      this.style.removeProperty('--ui-context-menu-item-font-size');
      this.style.removeProperty('--ui-context-menu-item-line-height');
      this.style.removeProperty('--ui-context-menu-separator-margin');
    }

    const normalizedRadius = normalizeMenuRadius(this.getAttribute('radius') || this.getAttribute('shape'));
    if (normalizedRadius) {
      this.style.setProperty('--ui-context-menu-radius', normalizedRadius);
      this.style.setProperty('--ui-context-menu-item-radius', normalizedRadius);
      this.style.setProperty('--ui-context-menu-submenu-radius', normalizedRadius);
    } else {
      this.style.removeProperty('--ui-context-menu-radius');
      this.style.removeProperty('--ui-context-menu-item-radius');
      this.style.removeProperty('--ui-context-menu-submenu-radius');
    }
  }

  private _syncGlobalListeners(open: boolean): void {
    const shouldBindResize = open;
    const shouldBindScroll = open && !!this._anchorEl;

    if (shouldBindResize && !this._resizeListenerBound) {
      window.addEventListener('resize', this._onViewportChange);
      this._resizeListenerBound = true;
    } else if (!shouldBindResize && this._resizeListenerBound) {
      window.removeEventListener('resize', this._onViewportChange);
      this._resizeListenerBound = false;
    }

    if (shouldBindScroll && !this._scrollListenerBound) {
      window.addEventListener('scroll', this._onViewportChange, true);
      this._scrollListenerBound = true;
    } else if (!shouldBindScroll && this._scrollListenerBound) {
      window.removeEventListener('scroll', this._onViewportChange, true);
      this._scrollListenerBound = false;
    }

    if (open && this._anchorEl) this._startAnchorTracking();
    else this._stopAnchorTracking();
  }

  private _unbindGlobalListeners(): void {
    this._syncGlobalListeners(false);
  }

  private _bindPortalInteractionListeners(): void {
    if (!this._portalEl) return;
    this._portalEl.addEventListener('click', this._onRootClick as EventListener);
    this._portalEl.addEventListener('keydown', this._onRootKeyDown as EventListener);
    this._portalEl.addEventListener('pointerover', this._onRootPointerOver as EventListener);
    this._portalEl.addEventListener('pointerleave', this._onRootPointerLeave as EventListener);
    this._portalEl.addEventListener('focusin', this._onRootFocusIn as EventListener);
  }

  private _unbindPortalInteractionListeners(): void {
    if (!this._portalEl) return;
    this._portalEl.removeEventListener('click', this._onRootClick as EventListener);
    this._portalEl.removeEventListener('keydown', this._onRootKeyDown as EventListener);
    this._portalEl.removeEventListener('pointerover', this._onRootPointerOver as EventListener);
    this._portalEl.removeEventListener('pointerleave', this._onRootPointerLeave as EventListener);
    this._portalEl.removeEventListener('focusin', this._onRootFocusIn as EventListener);
  }

  private _setPortalFlag(name: string, active: boolean): void {
    if (!this._portalEl) return;
    if (active) this._portalEl.setAttribute(`data-${name}`, 'true');
    else this._portalEl.removeAttribute(`data-${name}`);
  }

  private _syncPortalThemeVariables(): void {
    if (!this._portalEl) return;
    const computed = getComputedStyle(this);
    const syncVar = (name: string) => {
      const value = computed.getPropertyValue(name).trim();
      if (value) this._portalEl!.style.setProperty(name, value);
      else this._portalEl!.style.removeProperty(name);
    };

    PORTAL_THEME_VARIABLES.forEach(syncVar);
    PORTAL_CONTEXT_MENU_VARIABLES.forEach(syncVar);
    PORTAL_THEME_SCALES.forEach(({ prefix, from, to }) => {
      for (let index = from; index <= to; index += 1) syncVar(`${prefix}${index}`);
    });
  }

  private _syncPortalVisualState(): void {
    if (!this._portalEl) return;
    const normalizedSize = normalizeMenuSize(this.getAttribute('size') || this.getAttribute('density'));
    const normalizedRadius = normalizeMenuRadius(this.getAttribute('radius') || this.getAttribute('shape'));
    this._syncPortalThemeVariables();
    this._setPortalFlag('open', this._isOpen);
    this._setPortalFlag('headless', this.headless);
    this._setPortalFlag('disabled', this.isDisabled);

    const variant = this.getAttribute('variant');
    const size = normalizeMenuSize(this.getAttribute('size') || this.getAttribute('density'));
    const density = this.getAttribute('density');
    const radius = this.getAttribute('radius');
    const shape = this.getAttribute('shape');
    const elevation = this.getAttribute('elevation');
    const tone = this.getAttribute('tone');
    const placement = this.getAttribute('placement');

    if (variant) this._portalEl.setAttribute('data-variant', variant);
    else this._portalEl.removeAttribute('data-variant');
    if (size && size !== 'md') this._portalEl.setAttribute('data-size', size);
    else this._portalEl.removeAttribute('data-size');
    if (density) this._portalEl.setAttribute('data-density', density);
    else this._portalEl.removeAttribute('data-density');
    if (radius) this._portalEl.setAttribute('data-radius', radius);
    else this._portalEl.removeAttribute('data-radius');
    if (shape) this._portalEl.setAttribute('data-shape', shape);
    else this._portalEl.removeAttribute('data-shape');
    if (elevation) this._portalEl.setAttribute('data-elevation', elevation);
    else this._portalEl.removeAttribute('data-elevation');
    if (tone) this._portalEl.setAttribute('data-tone', tone);
    else this._portalEl.removeAttribute('data-tone');
    if (placement) this._portalEl.setAttribute('data-placement-request', placement);
    else this._portalEl.removeAttribute('data-placement-request');

    if (normalizedSize === 'sm') {
      this._portalEl.style.setProperty('--ui-context-menu-padding', '4px');
      this._portalEl.style.setProperty('--ui-context-menu-item-gap', '8px');
      this._portalEl.style.setProperty('--ui-context-menu-item-min-height', '32px');
      this._portalEl.style.setProperty('--ui-context-menu-item-pad-y', '6px');
      this._portalEl.style.setProperty('--ui-context-menu-item-pad-x', '8px');
      this._portalEl.style.setProperty('--ui-context-menu-item-font-size', '13px');
      this._portalEl.style.setProperty('--ui-context-menu-item-line-height', '18px');
      this._portalEl.style.setProperty('--ui-context-menu-separator-margin', '4px 8px');
    } else if (normalizedSize === 'lg') {
      this._portalEl.style.setProperty('--ui-context-menu-padding', '8px');
      this._portalEl.style.setProperty('--ui-context-menu-item-gap', '12px');
      this._portalEl.style.setProperty('--ui-context-menu-item-min-height', '40px');
      this._portalEl.style.setProperty('--ui-context-menu-item-pad-y', '9px');
      this._portalEl.style.setProperty('--ui-context-menu-item-pad-x', '12px');
      this._portalEl.style.setProperty('--ui-context-menu-item-font-size', '15px');
      this._portalEl.style.setProperty('--ui-context-menu-item-line-height', '22px');
      this._portalEl.style.setProperty('--ui-context-menu-separator-margin', '8px 12px');
    } else {
      this._portalEl.style.removeProperty('--ui-context-menu-padding');
      this._portalEl.style.removeProperty('--ui-context-menu-item-gap');
      this._portalEl.style.removeProperty('--ui-context-menu-item-min-height');
      this._portalEl.style.removeProperty('--ui-context-menu-item-pad-y');
      this._portalEl.style.removeProperty('--ui-context-menu-item-pad-x');
      this._portalEl.style.removeProperty('--ui-context-menu-item-font-size');
      this._portalEl.style.removeProperty('--ui-context-menu-item-line-height');
      this._portalEl.style.removeProperty('--ui-context-menu-separator-margin');
    }

    if (normalizedRadius) {
      this._portalEl.style.setProperty('--ui-context-menu-radius', normalizedRadius);
      this._portalEl.style.setProperty('--ui-context-menu-item-radius', normalizedRadius);
      this._portalEl.style.setProperty('--ui-context-menu-submenu-radius', normalizedRadius);
    } else {
      this._portalEl.style.removeProperty('--ui-context-menu-radius');
      this._portalEl.style.removeProperty('--ui-context-menu-item-radius');
      this._portalEl.style.removeProperty('--ui-context-menu-submenu-radius');
    }

    if (this.state !== 'idle') this._portalEl.setAttribute('data-state', this.state);
    else this._portalEl.removeAttribute('data-state');

    const stateRow = this._portalEl.querySelector('.state-row') as HTMLElement | null;
    if (stateRow) stateRow.textContent = this._stateText();
  }

  private _moveContentIntoPortal(): void {
    if (this._contentSourceEl) return;
    const source = (this.querySelector('[slot="menu"]') as HTMLElement | null) || (this.querySelector('[slot="content"]') as HTMLElement | null);
    const host = this._portalContentHostEl;
    if (!source || !host) return;
    this._contentOriginalParent = source.parentNode;
    this._contentAnchor = document.createComment('ui-context-menu-anchor');
    if (this._contentOriginalParent) {
      this._contentOriginalParent.insertBefore(this._contentAnchor, source);
    }
    this._contentSourceEl = source;
    host.appendChild(source);
  }

  private _restoreContentFromPortal(): void {
    const source = this._contentSourceEl;
    if (!source) return;
    const anchor = this._contentAnchor;
    const parent = this._contentOriginalParent;
    if (anchor?.parentNode) {
      anchor.parentNode.insertBefore(source, anchor);
      anchor.parentNode.removeChild(anchor);
    } else if (parent) {
      parent.appendChild(source);
    }
    this._contentSourceEl = null;
    this._contentAnchor = null;
    this._contentOriginalParent = null;
  }

  private _mountPortal(): void {
    if (this._portalEl?.isConnected) return;
    const root = createPortalContainer();
    if (!root) return;

    const portal = document.createElement('div');
    portal.className = 'ui-context-menu-portal';
    portal.style.position = 'absolute';
    portal.style.pointerEvents = 'auto';
    portal.innerHTML = `
      <style>${portalStyle}</style>
      <div class="surface" part="menu" role="menu" aria-hidden="true" aria-busy="false" tabindex="-1">
        <div class="state-row" part="state"></div>
        <ui-listbox class="content-host" slot="menu" role="menu" item-selector="${ITEM_SELECTOR.replace(/"/g, '&quot;')}" direct-item-selector="${ROOT_ITEM_SELECTOR.replace(/"/g, '&quot;')}" item-role="menuitem" active-attribute="data-active"></ui-listbox>
      </div>
    `;

    root.appendChild(portal);
    this._portalEl = portal;
    this._portalSurfaceEl = portal.querySelector('.surface') as HTMLElement | null;
    this._portalContentHostEl = portal.querySelector('ui-listbox.content-host') as UIListbox | null;
    this._moveContentIntoPortal();
    this._portalContentHostEl?.refresh();
    this._syncPortalVisualState();
    this._syncSurfaceState();
    this._bindPortalInteractionListeners();
    this._syncDismissableLayer();
  }

  private _teardownPortal(): void {
    this._dismissableLayer?.destroy();
    this._dismissableLayer = null;
    this._unbindPortalInteractionListeners();
    this._restoreContentFromPortal();
    this._portalContentHostEl = null;
    this._portalSurfaceEl = null;
    if (this._portalEl?.parentElement) {
      try {
        this._portalEl.parentElement.removeChild(this._portalEl);
      } catch {
        // no-op
      }
    }
    this._portalEl = null;
  }

  private _syncDismissableLayer(): void {
    const node = this._portalSurfaceEl;
    if (!node || !this._isOpen) {
      this._dismissableLayer?.destroy();
      this._dismissableLayer = null;
      return;
    }
    this._dismissableLayer?.destroy();
    this._dismissableLayer = createDismissableLayer({
      node,
      trigger: this._anchorEl || this,
      closeOnEscape: this.closeOnEscape,
      closeOnPointerOutside: true,
      closeOnFocusOutside: true,
      onDismiss: (reason) => {
        const source: ContextMenuOpenSource = reason === 'escape-key' ? 'escape' : 'outside';
        this._setOpen(false, source);
      }
    });
  }

  private _cancelScheduledWork(): void {
    if (this._positionRaf != null) {
      cancelAnimationFrame(this._positionRaf);
      this._positionRaf = null;
    }
    if (this._submenuRaf != null) {
      cancelAnimationFrame(this._submenuRaf);
      this._submenuRaf = null;
    }
    this._stopAnchorTracking();
    this._cancelSubmenuIntent();
    this._resetTypeahead();
  }

  private _captureAnchorRect(): RectLike | null {
    if (!this._anchorEl) return null;
    const rect = this._anchorEl.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  }

  private _startAnchorTracking(): void {
    if (!this._isOpen || !this._anchorEl || this._anchorTrackRaf != null) return;
    this._lastAnchorRect = this._captureAnchorRect();
    this._anchorTrackRaf = requestAnimationFrame(this._trackAnchorLayout);
  }

  private _stopAnchorTracking(): void {
    if (this._anchorTrackRaf != null) {
      cancelAnimationFrame(this._anchorTrackRaf);
      this._anchorTrackRaf = null;
    }
    this._lastAnchorRect = null;
  }

  private _trackAnchorLayout(): void {
    this._anchorTrackRaf = null;
    if (!this._isOpen || !this._anchorEl) return;
    const nextRect = this._captureAnchorRect();
    const previousRect = this._lastAnchorRect;
    this._lastAnchorRect = nextRect;
    if (!nextRect) {
      this.close();
      return;
    }
    const moved = !!previousRect && (
      nextRect.top !== previousRect.top ||
      nextRect.left !== previousRect.left ||
      nextRect.right !== previousRect.right ||
      nextRect.bottom !== previousRect.bottom ||
      nextRect.width !== previousRect.width ||
      nextRect.height !== previousRect.height
    );
    if (moved) {
      this._positionMenu();
      this._layoutSubmenus();
    }
    this._anchorTrackRaf = requestAnimationFrame(this._trackAnchorLayout);
  }

  private _resetTypeahead(): void {
    this._typeaheadBuffer = '';
    if (this._typeaheadTimer != null) {
      window.clearTimeout(this._typeaheadTimer);
      this._typeaheadTimer = null;
    }
  }

  private _normalizeMenuSemantics(): void {
    const menu = this._menuHost();
    if (!menu) return;
    this._listbox()?.syncItemSemantics({ container: menu });
  }

  private _queryMenuItems(container?: HTMLElement | null): MenuLikeItem[] {
    const source = container || this._menuHost();
    if (!source) return [];
    return (this._listbox()?.queryItems({ container: source }) || []).filter((item) => isVisible(item)) as MenuLikeItem[];
  }

  private _submenuFor(item: MenuLikeItem): HTMLElement | null {
    return item.querySelector(SUBMENU_SELECTOR) as HTMLElement | null;
  }

  private _clearHighlights(): void {
    this._hoveredItem = null;
  }

  private _focusItem(item: MenuLikeItem | null): void {
    if (!item) return;
    this._clearHighlights();
    const container = (item.closest('.submenu') as HTMLElement | null) || this._menuHost();
    this._listbox()?.setActiveItem(item, {
      container,
      focus: true,
      owner: this._surface(),
      scroll: true
    });
    this._setOpenBranch(item, false);
  }

  private _focusFirstItem(): void {
    const first = this._listbox()?.focusBoundary('first', {
      container: this._menuHost(),
      focus: true,
      owner: this._surface(),
      scroll: true
    }) as MenuLikeItem | null;
    if (first) {
      this._setOpenBranch(first, false);
      return;
    }
    const surface = this._surface();
    if (!surface) return;
    try {
      surface.focus({ preventScroll: true });
    } catch {
      surface.focus();
    }
  }

  private _focusLastItem(): void {
    const last = this._listbox()?.focusBoundary('last', {
      container: this._menuHost(),
      focus: true,
      owner: this._surface(),
      scroll: true
    }) as MenuLikeItem | null;
    if (last) this._setOpenBranch(last, false);
  }

  private _findCurrentItem(event?: Event): MenuLikeItem | null {
    if (event && typeof event.composedPath === 'function') {
      const fromPath = findInPath(event.composedPath());
      if (fromPath) return fromPath;
    }
    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      const current = active.closest(ITEM_SELECTOR);
      if (current instanceof HTMLElement) return current as MenuLikeItem;
    }
    if (this._hoveredItem?.isConnected) return this._hoveredItem;
    return null;
  }

  private _moveFocus(current: MenuLikeItem, direction: 'next' | 'prev' | 'first' | 'last'): void {
    const container = (current.closest('.submenu') as HTMLElement | null) || this._menuHost();
    if (!container) return;
    if (direction === 'first') {
      const first = this._listbox()?.focusBoundary('first', {
        container,
        focus: true,
        owner: this._surface(),
        scroll: true
      }) as MenuLikeItem | null;
      if (first) this._setOpenBranch(first, false);
      return;
    }
    if (direction === 'last') {
      const last = this._listbox()?.focusBoundary('last', {
        container,
        focus: true,
        owner: this._surface(),
        scroll: true
      }) as MenuLikeItem | null;
      if (last) this._setOpenBranch(last, false);
      return;
    }
    const moved = this._listbox()?.move(direction === 'next' ? 1 : -1, {
      container,
      current,
      focus: true,
      owner: this._surface(),
      scroll: true
    }) as MenuLikeItem | null;
    if (moved) this._setOpenBranch(moved, false);
  }

  private _setOpenBranch(item: MenuLikeItem | null, expandCurrentSubmenu: boolean): void {
    const menu = this._menuHost();
    if (!menu) return;
    menu.querySelectorAll<HTMLElement>('[data-submenu-open="true"]').forEach((node) => node.removeAttribute('data-submenu-open'));
    if (!item) return;

    const branch: MenuLikeItem[] = [];
    let current: HTMLElement | null = item;
    while (current) {
      const submenu = current.closest('.submenu') as HTMLElement | null;
      if (!submenu) break;
      const owner = submenu.parentElement;
      if (!(owner instanceof HTMLElement) || !owner.matches(ITEM_SELECTOR)) break;
      branch.unshift(owner as MenuLikeItem);
      current = owner;
    }

    branch.forEach((owner) => owner.setAttribute('data-submenu-open', 'true'));
    if (expandCurrentSubmenu && this._submenuFor(item)) item.setAttribute('data-submenu-open', 'true');
  }

  private _openSubmenu(item: MenuLikeItem, focusFirstChild: boolean): boolean {
    this._cancelSubmenuIntent();
    const submenu = this._submenuFor(item);
    if (!submenu || isDisabled(item)) return false;
    this._setOpenBranch(item, true);
    this._scheduleSubmenuLayout();
    if (!focusFirstChild) return true;
    const first = this._listbox()?.focusBoundary('first', {
      container: submenu,
      focus: true,
      owner: this._surface(),
      scroll: true
    }) as MenuLikeItem | null;
    if (first) this._setOpenBranch(first, false);
    return true;
  }

  private _closeParentSubmenu(item: MenuLikeItem): boolean {
    const submenu = item.closest('.submenu') as HTMLElement | null;
    if (!submenu) return false;
    const owner = submenu.parentElement;
    if (!(owner instanceof HTMLElement) || !owner.matches(ITEM_SELECTOR)) return false;
    this._focusItem(owner as MenuLikeItem);
    this._setOpenBranch(owner as MenuLikeItem, false);
    owner.removeAttribute('data-submenu-open');
    return true;
  }

  private _clearSubmenuState(): void {
    this._cancelSubmenuIntent();
    this._hoveredItem = null;
    const menu = this._menuHost();
    if (!menu) return;
    menu.querySelectorAll<HTMLElement>('[data-submenu-open="true"]').forEach((item) => item.removeAttribute('data-submenu-open'));
    this._listbox()?.clearActive({ container: menu });
  }

  private _handleTypeahead(event: KeyboardEvent, current: MenuLikeItem | null): boolean {
    if (!this.typeahead) return false;
    if (event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1 || !/\S/.test(event.key)) return false;

    const container = (current?.closest('.submenu') as HTMLElement | null) || this._menuHost();
    if (!container) return false;

    this._typeaheadBuffer = `${this._typeaheadBuffer}${event.key}`.slice(-24);
    if (this._typeaheadTimer != null) window.clearTimeout(this._typeaheadTimer);
    this._typeaheadTimer = window.setTimeout(() => this._resetTypeahead(), TYPEAHEAD_RESET_MS);
    const matched = this._listbox()?.typeahead(this._typeaheadBuffer, {
      container,
      current,
      focus: true,
      owner: this._surface(),
      scroll: true
    }) as MenuLikeItem | null;
    if (!matched) return false;
    event.preventDefault();
    this._setOpenBranch(matched, false);
    return true;
  }

  private _applySelectionBehavior(item: MenuLikeItem): void {
    const role = item.getAttribute('role');
    if (role === 'menuitemcheckbox') {
      const next = item.getAttribute('aria-checked') !== 'true';
      item.setAttribute('aria-checked', next ? 'true' : 'false');
      item.setAttribute('data-state', next ? 'checked' : 'unchecked');
      return;
    }
    if (role !== 'menuitemradio') return;

    const container = (item.closest('.submenu') as HTMLElement | null) || this._menuHost();
    if (!container) return;
    const group = item.getAttribute('data-group') || item.getAttribute('name') || '';
    container.querySelectorAll<MenuLikeItem>('[role="menuitemradio"]').forEach((radio) => {
      const radioGroup = radio.getAttribute('data-group') || radio.getAttribute('name') || '';
      if (group && radioGroup !== group) return;
      radio.setAttribute('aria-checked', 'false');
      radio.setAttribute('data-state', 'unchecked');
    });

    item.setAttribute('aria-checked', 'true');
    item.setAttribute('data-state', 'checked');
  }

  private _emitSelect(item: MenuLikeItem): void {
    const menu = this._menuHost();
    const allItems = menu ? Array.from(menu.querySelectorAll<MenuLikeItem>(ITEM_SELECTOR)) : [];
    const index = allItems.indexOf(item);
    this.dispatchEvent(new CustomEvent('select', {
      bubbles: true,
      composed: true,
      detail: {
        index,
        value: item.getAttribute('data-value') || item.getAttribute('value') || undefined,
        label: item.getAttribute('aria-label') || item.textContent?.trim() || undefined,
        checked: item.getAttribute('aria-checked') === 'true',
        item
      }
    }));
  }

  private _schedulePosition(): void {
    if (!this._isOpen) return;
    if (this._positionRaf != null) cancelAnimationFrame(this._positionRaf);
    this._positionRaf = requestAnimationFrame(() => {
      this._positionRaf = null;
      this._positionMenu();
    });
  }

  private _positionMenu(): void {
    const surface = this._surface();
    if (!surface) return;
    if (this._anchorEl && !isElementVisibleInDom(this._anchorEl)) {
      this.close();
      return;
    }

    const anchorRect = this._anchorEl ? this._anchorEl.getBoundingClientRect() : getRectForPoint(this._point);
    const rect = surface.getBoundingClientRect();
    const width = rect.width || surface.offsetWidth || 240;
    const height = rect.height || surface.offsetHeight || 0;
    const placement = parsePlacement(this.getAttribute('placement'));
    const position = computeMenuPosition(anchorRect, width, height, placement, this._anchorEl ? ANCHOR_OFFSET : 0);

    surface.style.left = `${position.x}px`;
    surface.style.top = `${position.y}px`;
    surface.style.maxWidth = `${position.maxWidth}px`;
    surface.style.maxHeight = `${position.maxHeight}px`;
    surface.setAttribute('data-placement', position.placement);
  }

  private _scheduleSubmenuLayout(): void {
    if (!this._isOpen) return;
    if (this._submenuRaf != null) cancelAnimationFrame(this._submenuRaf);
    this._submenuRaf = requestAnimationFrame(() => {
      this._submenuRaf = null;
      this._layoutSubmenus();
    });
  }

  private _layoutSubmenus(): void {
    const menu = this._menuHost();
    if (!menu) return;

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const submenus = Array.from(menu.querySelectorAll<HTMLElement>('.menuitem > .submenu, [role="menuitem"] > .submenu'));

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

      if (ownerRect.right + POSITION_GAP + submenuRect.width > viewportWidth && ownerRect.left - POSITION_GAP - submenuRect.width >= POSITION_GAP) {
        owner.setAttribute('data-submenu-side', 'left');
      }

      if (ownerRect.top + submenuRect.height > viewportHeight - POSITION_GAP && ownerRect.bottom - submenuRect.height >= POSITION_GAP) {
        owner.setAttribute('data-submenu-align', 'up');
      }

      submenu.style.display = previousDisplay;
      submenu.style.visibility = previousVisibility;
      submenu.style.pointerEvents = previousPointerEvents;
      submenu.style.opacity = previousOpacity;
      submenu.style.transform = previousTransform;
    });
  }

  private _onRootClick(event: MouseEvent): void {
    if (!this._isOpen || this.isDisabled || this.state === 'loading') return;
    const item = this._findCurrentItem(event);
    if (!item || isDisabled(item)) return;

    if (this._submenuFor(item)) {
      this._openSubmenu(item, true);
      return;
    }

    this._applySelectionBehavior(item);
    this._emitSelect(item);

    if (this.closeOnSelect) {
      this._setOpen(false, 'select');
    } else {
      this._focusItem(item);
    }
  }

  private _onRootPointerOver(event: PointerEvent): void {
    if (!this._isOpen) return;
    const item = this._findCurrentItem(event);
    if (!item || isDisabled(item)) return;
    this._hoveredItem = item;
    if (this._submenuFor(item)) {
      this._scheduleSubmenuIntent(item);
      return;
    }
    this._cancelSubmenuIntent();
    this._setOpenBranch(item, false);
  }

  private _onRootPointerLeave(): void {
    this._cancelSubmenuIntent();
    this._clearHighlights();
  }

  private _onRootFocusIn(event: FocusEvent): void {
    if (!this._isOpen) return;
    this._cancelSubmenuIntent();
    const item = this._findCurrentItem(event);
    if (!item || isDisabled(item)) return;
    const container = (item.closest('.submenu') as HTMLElement | null) || this._menuHost();
    this._listbox()?.setActiveItem(item, {
      container,
      focus: false,
      owner: this._surface(),
      scroll: false
    });
    this._setOpenBranch(item, false);
  }

  private _cancelSubmenuIntent(): void {
    if (this._submenuIntentTimer != null) {
      window.clearTimeout(this._submenuIntentTimer);
      this._submenuIntentTimer = null;
    }
    this._submenuIntentItem = null;
  }

  private _scheduleSubmenuIntent(item: MenuLikeItem): void {
    if (this._submenuIntentItem === item && this._submenuIntentTimer != null) return;
    this._cancelSubmenuIntent();
    this._submenuIntentItem = item;
    this._submenuIntentTimer = window.setTimeout(() => {
      this._submenuIntentTimer = null;
      const pending = this._submenuIntentItem;
      this._submenuIntentItem = null;
      if (!pending || !pending.isConnected || !this._isOpen) return;
      this._setOpenBranch(pending, true);
      this._scheduleSubmenuLayout();
    }, SUBMENU_INTENT_MS);
  }

  private _onRootKeyDown(event: KeyboardEvent): void {
    if (!this._isOpen) return;
    const current = this._findCurrentItem(event);
    if (this._handleTypeahead(event, current)) return;

    if (event.key === 'Escape') {
      if (!this.closeOnEscape) return;
      event.preventDefault();
      this._setOpen(false, 'escape');
      return;
    }

    if (this.isDisabled || this.state === 'loading') return;

    if (!current) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this._focusFirstItem();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this._focusLastItem();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._moveFocus(current, 'next');
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._moveFocus(current, 'prev');
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this._moveFocus(current, 'first');
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this._moveFocus(current, 'last');
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this._openSubmenu(current, true);
      return;
    }

    if (event.key === 'ArrowLeft') {
      if (this._closeParentSubmenu(current)) event.preventDefault();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      current.click();
    }
  }

  private _onContextMenu(event: MouseEvent): void {
    if (this.headless || this.isDisabled) return;
    if (event.defaultPrevented) return;
    if (event.target instanceof HTMLElement && event.target.closest('[slot="menu"], [slot="content"]')) return;
    event.preventDefault();
    this._anchorEl = null;
    this._point = { x: event.clientX, y: event.clientY };
    this._setOpen(true, 'contextmenu');
  }

  private _onViewportChange(): void {
    if (!this._isOpen) return;
    this._schedulePosition();
    this._scheduleSubmenuLayout();
  }

  protected render(): void {
    const stateText = escapeHtml(this._stateText());
    this.setContent(`
      <style>${shadowStyle}</style>
      <div class="surface" part="menu" role="menu" aria-hidden="true" aria-busy="false" tabindex="-1">
        <div class="state-row" part="state" data-state="${this.state}">${stateText}</div>
        <ui-listbox class="content-host" part="content" slot="menu" role="menu" item-selector="${ITEM_SELECTOR.replace(/"/g, '&quot;')}" direct-item-selector="${ROOT_ITEM_SELECTOR.replace(/"/g, '&quot;')}" item-role="menuitem" active-attribute="data-active">
          <slot name="menu"></slot>
          <slot name="content"></slot>
        </ui-listbox>
      </div>
      <slot></slot>
    `);
    this._syncSurfaceState();
    if (this._isOpen) {
      this._normalizeMenuSemantics();
      this._syncPortalVisualState();
      this._schedulePosition();
      this._scheduleSubmenuLayout();
    }
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-context-menu')) {
  customElements.define('ui-context-menu', UIContextMenu);
}

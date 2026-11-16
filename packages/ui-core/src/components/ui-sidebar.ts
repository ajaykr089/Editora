import { ElementBase } from '../ElementBase';
import { requestNavigate } from '../primitives/navigate';
import './ui-icon';

type SidebarTone = 'default' | 'brand' | 'success' | 'warning' | 'danger';

type SidebarItemInput = {
  value?: string;
  label?: string;
  href?: string;
  target?: string;
  rel?: string;
  icon?: string;
  iconHtml?: string;
  contentHtml?: string;
  badge?: string;
  description?: string;
  section?: string;
  disabled?: boolean;
  active?: boolean;
  tone?: SidebarTone;
  children?: SidebarItemInput[];
};

type NormalizedSidebarItem = Omit<SidebarItemInput, 'children'> & {
  id: string;
  label: string;
  value: string;
  section: string;
  children: NormalizedSidebarItem[];
  depth: number;
};

type SidebarSelectDetail = {
  index: number;
  value: string;
  label: string;
  item?: SidebarItemInput;
};

const DEFAULT_WIDTHS = {
  sm: { expanded: 220, collapsed: 64, min: 168, max: 300 },
  md: { expanded: 236, collapsed: 72, min: 180, max: 320 },
  lg: { expanded: 268, collapsed: 80, min: 192, max: 360 }
};

const VISUAL_ONLY_ATTRIBUTES = new Set([
  'variant',
  'size',
  'density',
  'tone',
  'radius',
  'item-radius',
  'item-gap',
  'row-gap',
  'item-padding-x',
  'item-padding-y',
  'item-height',
  'item-font-size',
  'item-line-height',
  'section-label-transform',
  'elevation',
  'position',
  'rail',
  'headless'
]);

const NON_RENDER_WIDTH_ATTRIBUTES = new Set([
  'width',
  'min-width',
  'max-width',
  'collapsed-width',
  'storage-key',
  'auto-save'
]);

const template = (body: string) => `
  <style>
    :host {
      --ui-sidebar-bg: var(--base-sidebar-bg, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
      --ui-sidebar-color: var(--ui-color-text, var(--ui-text, #202020));
      --ui-sidebar-muted: color-mix(in srgb, var(--ui-sidebar-color) 72%, transparent);
      --ui-sidebar-border: var(--base-sidebar-border, 1px solid var(--ui-color-line-subtle, color-mix(in srgb, var(--gray-a5, rgba(15, 23, 42, 0.16)) 82%, transparent)));
      --ui-sidebar-radius: var(--base-sidebar-radius, calc(var(--ui-radius, 6px) + 2px));
      --ui-sidebar-shadow: var(--base-sidebar-shadow, none);
      --ui-sidebar-padding: var(--base-sidebar-padding, 12px);
      --ui-sidebar-gap: var(--base-sidebar-gap, 14px);
      --ui-sidebar-header-padding: var(--base-sidebar-header-padding, 4px 4px 10px);
      --ui-sidebar-item-radius: var(--base-sidebar-item-radius, var(--ui-control-radius-2, var(--ui-radius, 6px)));
      --ui-sidebar-item-height: var(--base-sidebar-item-height, var(--ui-control-height-2, 32px));
      --ui-sidebar-item-padding-x: var(--base-sidebar-item-padding-x, 10px);
      --ui-sidebar-item-padding-y: var(--base-sidebar-item-padding-y, 4px);
      --ui-sidebar-item-gap: var(--base-sidebar-item-gap, 8px);
      --ui-sidebar-row-gap: var(--base-sidebar-row-gap, 2px);
      --ui-sidebar-item-font-size: var(--base-sidebar-item-font-size, var(--ui-control-font-size-2, 14px));
      --ui-sidebar-item-line-height: var(--base-sidebar-item-line-height, 20px);
      --ui-sidebar-section-gap: var(--base-sidebar-section-gap, 4px);
      --ui-sidebar-item-font-weight: var(--base-sidebar-item-font-weight, 500);
      --ui-sidebar-item-active-font-weight: var(--base-sidebar-item-active-font-weight, 600);
      --ui-sidebar-icon-color: var(--base-sidebar-icon-color, color-mix(in srgb, var(--ui-sidebar-color) 62%, transparent));
      --ui-sidebar-indicator: var(--base-sidebar-indicator, transparent);
      --ui-sidebar-section-label-size: var(--base-sidebar-section-label-size, 12px);
      --ui-sidebar-section-label-spacing: var(--base-sidebar-section-label-spacing, 0.01em);
      --ui-sidebar-section-label-transform: var(--base-sidebar-section-label-transform, none);
      --ui-sidebar-section-label-color: var(--base-sidebar-section-label-color, var(--ui-sidebar-muted));
      --ui-sidebar-submenu-indent: var(--base-sidebar-submenu-indent, 20px);
      --ui-sidebar-promo-radius: var(--base-sidebar-promo-radius, 4px);
      --ui-sidebar-promo-padding: var(--base-sidebar-promo-padding, 20px);
      --ui-sidebar-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
      --ui-sidebar-accent-contrast: var(--ui-color-foreground-on-primary, var(--ui-foreground, #ffffff));
      --ui-sidebar-item-hover: color-mix(in srgb, var(--ui-sidebar-color) 6%, transparent);
      --ui-sidebar-item-active-bg: color-mix(in srgb, var(--ui-sidebar-accent) 11%, transparent);
      --ui-sidebar-item-active-color: var(--ui-sidebar-color);
      --ui-sidebar-item-border: transparent;
      --ui-sidebar-control-bg: color-mix(in srgb, var(--ui-sidebar-bg) 88%, transparent);
      --ui-sidebar-control-hover: color-mix(in srgb, var(--ui-sidebar-accent) 10%, var(--ui-sidebar-bg));
      --ui-sidebar-promo-bg: color-mix(in srgb, var(--ui-sidebar-accent) 9%, var(--ui-sidebar-bg-solid, var(--ui-color-surface, #ffffff)));
      --ui-sidebar-promo-color: var(--ui-sidebar-color);
      --ui-sidebar-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
      --ui-sidebar-width: 236px;
      --ui-sidebar-current-width: 236px;
      --ui-sidebar-min-width: 180px;
      --ui-sidebar-max-width: 320px;
      --ui-sidebar-collapsed-width: 72px;
      display: block;
      min-inline-size: 0;
      inline-size: var(--ui-sidebar-current-width);
      box-sizing: border-box;
      color-scheme: light dark;
      transition: inline-size 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    :host([size="sm"]),
    :host([size="1"]) {
      --ui-sidebar-padding: 8px;
      --ui-sidebar-gap: 10px;
      --ui-sidebar-item-radius: 4px;
      --ui-sidebar-item-height: 40px;
      --ui-sidebar-item-padding-x: 12px;
      --ui-sidebar-item-padding-y: 8px;
      --ui-sidebar-item-gap: 10px;
      --ui-sidebar-item-font-size: 14px;
      --ui-sidebar-item-line-height: 20px;
      --ui-sidebar-section-gap: 8px;
      --ui-sidebar-promo-padding: 16px;
    }

    :host([size="lg"]),
    :host([size="3"]) {
      --ui-sidebar-padding: 12px;
      --ui-sidebar-gap: 12px;
      --ui-sidebar-item-radius: 4px;
      --ui-sidebar-item-height: 50px;
      --ui-sidebar-item-padding-x: 12px;
      --ui-sidebar-item-padding-y: 8px;
      --ui-sidebar-item-gap: 16px;
      --ui-sidebar-item-font-size: 16px;
      --ui-sidebar-item-line-height: 24px;
      --ui-sidebar-promo-padding: 20px;
    }

    :host([density="compact"]) {
      --ui-sidebar-gap: 10px;
      --ui-sidebar-section-gap: 8px;
      --ui-sidebar-item-height: calc(var(--ui-sidebar-item-height) - 4px);
      --ui-sidebar-item-padding-y: max(6px, calc(var(--ui-sidebar-item-padding-y) - 2px));
      --ui-sidebar-item-gap: max(8px, calc(var(--ui-sidebar-item-gap) - 2px));
    }

    :host([density="comfortable"]) {
      --ui-sidebar-gap: 14px;
      --ui-sidebar-section-gap: 12px;
      --ui-sidebar-item-height: calc(var(--ui-sidebar-item-height) + 4px);
      --ui-sidebar-item-padding-y: calc(var(--ui-sidebar-item-padding-y) + 2px);
      --ui-sidebar-item-gap: calc(var(--ui-sidebar-item-gap) + 2px);
    }

    :host([variant="surface"]) {
      --ui-sidebar-item-hover: color-mix(in srgb, var(--ui-sidebar-accent) 10%, transparent);
      --ui-sidebar-item-active-bg: color-mix(in srgb, var(--ui-sidebar-accent) 14%, var(--base-sidebar-bg, var(--color-panel-solid, #ffffff)));
      --ui-sidebar-item-active-color: var(--ui-sidebar-color);
      --ui-sidebar-item-border: transparent;
    }

    :host([variant="soft"]) {
      --ui-sidebar-bg: color-mix(in srgb, var(--ui-sidebar-accent) 8%, var(--base-sidebar-bg, var(--color-panel-solid, #ffffff)));
      --ui-sidebar-item-hover: color-mix(in srgb, var(--ui-sidebar-accent) 12%, transparent);
      --ui-sidebar-item-active-bg: color-mix(in srgb, var(--ui-sidebar-accent) 18%, var(--base-sidebar-bg, var(--color-panel-solid, #ffffff)));
      --ui-sidebar-item-active-color: var(--ui-sidebar-color);
      --ui-sidebar-item-border: transparent;
      --ui-sidebar-shadow: none;
    }

    :host([variant="floating"]) {
      --ui-sidebar-bg: color-mix(in srgb, var(--base-sidebar-bg, var(--color-panel-solid, #ffffff)) 82%, transparent);
      --ui-sidebar-item-hover: color-mix(in srgb, var(--ui-sidebar-accent) 10%, transparent);
      --ui-sidebar-item-active-bg: color-mix(in srgb, var(--ui-sidebar-accent) 16%, var(--base-sidebar-bg, var(--color-panel-solid, #ffffff)));
      --ui-sidebar-item-active-color: var(--ui-sidebar-color);
      --ui-sidebar-item-border: transparent;
      --ui-sidebar-shadow: 0 24px 44px rgba(15, 23, 42, 0.16);
      --ui-sidebar-border: 1px solid color-mix(in srgb, var(--gray-a5, rgba(15, 23, 42, 0.16)) 72%, transparent);
    }

    /* A dark sidebar beside a light page: neutral near-black, the brand only on the current item. */
    :host([variant="contrast"]) {
      --ui-sidebar-bg: #141416;
      --ui-sidebar-bg-solid: #141416;
      --ui-sidebar-color: #ededef;
      --ui-sidebar-muted: color-mix(in srgb, #ededef 64%, transparent);
      --ui-sidebar-icon-color: color-mix(in srgb, #ededef 56%, transparent);
      --ui-sidebar-border: 1px solid #26262b;
      --ui-sidebar-item-hover: color-mix(in srgb, #ffffff 7%, transparent);
      --ui-sidebar-item-active-bg: color-mix(in srgb, #ffffff 10%, transparent);
      --ui-sidebar-item-active-color: #ffffff;
      /* the brand lifted towards white, so a dark brand colour still shows on the near-black */
      --ui-sidebar-indicator: color-mix(in srgb, var(--ui-sidebar-accent) 62%, #ffffff);
      --ui-sidebar-control-bg: color-mix(in srgb, #ffffff 6%, transparent);
      --ui-sidebar-control-hover: color-mix(in srgb, #ffffff 10%, transparent);
      --ui-sidebar-shadow: none;
      --ui-sidebar-promo-bg: color-mix(in srgb, #ffffff 6%, transparent);
      --ui-sidebar-promo-color: #ededef;
      --ui-sidebar-focus-ring: color-mix(in srgb, var(--ui-sidebar-accent) 70%, #ffffff);
    }

    /* Blends into the page canvas; with Layout variant="shell" inset the content sits on a raised card. */
    :host([variant="inset"]) {
      --base-sidebar-outline: none;
      --ui-sidebar-bg: transparent;
      --ui-sidebar-border: none;
      --ui-sidebar-shadow: none;
      --ui-sidebar-radius: 0px;
      --ui-sidebar-item-hover: color-mix(in srgb, var(--ui-sidebar-color) 7%, transparent);
      --ui-sidebar-item-active-bg: var(--ui-color-surface, #ffffff);
      --ui-sidebar-item-border: color-mix(in srgb, var(--ui-sidebar-color) 9%, transparent);
    }

    :host([variant="inset"]) .item-button[aria-current="page"],
    :host([variant="inset"]) .item-button[data-active="true"] {
      box-shadow: 0 1px 2px color-mix(in srgb, #000 8%, transparent);
    }

    /* The current item is marked by a bar in the brand colour (as on GitHub or Vercel). */
    :host([variant="indicator"]) {
      --base-sidebar-outline: none;
      --ui-sidebar-bg: transparent;
      --ui-sidebar-border: none;
      --ui-sidebar-shadow: none;
      --ui-sidebar-item-active-bg: color-mix(in srgb, var(--ui-sidebar-accent) 7%, transparent);
      --ui-sidebar-item-active-color: var(--ui-color-accent-text, var(--ui-sidebar-accent));
      --ui-sidebar-indicator: var(--ui-sidebar-accent);
    }

    /* Rounded pills, filled with the brand tint when current (as in Material 3). */
    :host([variant="pill"]) {
      --base-sidebar-outline: none;
      --ui-sidebar-bg: transparent;
      --ui-sidebar-border: none;
      --ui-sidebar-shadow: none;
      --ui-sidebar-item-radius: 999px;
      --ui-sidebar-item-height: calc(var(--ui-control-height-2, 32px) + 4px);
      --ui-sidebar-item-padding-x: 14px;
      --ui-sidebar-item-active-bg: color-mix(in srgb, var(--ui-sidebar-accent) 16%, transparent);
      --ui-sidebar-item-active-color: var(--ui-color-accent-text, var(--ui-sidebar-color));
    }

    :host([variant="minimal"]) {
      --base-sidebar-outline: none;
      --ui-sidebar-bg: transparent;
      --ui-sidebar-border: none;
      --ui-sidebar-shadow: none;
      --ui-sidebar-item-hover: color-mix(in srgb, var(--ui-sidebar-accent) 8%, transparent);
      --ui-sidebar-item-active-bg: color-mix(in srgb, var(--ui-sidebar-accent) 14%, transparent);
      --ui-sidebar-item-active-color: var(--ui-sidebar-color);
      --ui-sidebar-item-border: transparent;
    }

    :host([variant="split"]) {
      --ui-sidebar-radius: 0px;
      --ui-sidebar-border: none;
      --ui-sidebar-shadow: none;
      --ui-sidebar-item-hover: color-mix(in srgb, var(--ui-sidebar-accent) 8%, transparent);
      --ui-sidebar-item-active-bg: color-mix(in srgb, var(--ui-sidebar-accent) 12%, transparent);
      --ui-sidebar-item-active-color: var(--ui-sidebar-color);
      --ui-sidebar-item-border: transparent;
      border-inline-end: 1px solid color-mix(in srgb, var(--gray-a5, rgba(15, 23, 42, 0.16)) 82%, transparent);
    }

    :host([tone="success"]) {
      --ui-sidebar-accent: var(--ui-color-success, #15803d);
    }

    :host([tone="warning"]) {
      --ui-sidebar-accent: var(--ui-color-warning, #b45309);
    }

    :host([tone="danger"]) {
      --ui-sidebar-accent: var(--ui-color-danger, #dc2626);
    }

    :host([radius="none"]) {
      --ui-sidebar-radius: 0px;
      --ui-sidebar-item-radius: 0px;
      --ui-sidebar-promo-radius: 0px;
    }

    :host([radius="sm"]) {
      --ui-sidebar-radius: 8px;
      --ui-sidebar-item-radius: 8px;
      --ui-sidebar-promo-radius: 12px;
    }

    :host([radius="md"]) {
      --ui-sidebar-radius: 12px;
      --ui-sidebar-item-radius: 12px;
      --ui-sidebar-promo-radius: 16px;
    }

    :host([radius="lg"]) {
      --ui-sidebar-radius: 18px;
      --ui-sidebar-item-radius: 16px;
      --ui-sidebar-promo-radius: 20px;
    }

    :host([radius="full"]) {
      --ui-sidebar-radius: 28px;
      --ui-sidebar-item-radius: 999px;
      --ui-sidebar-promo-radius: 24px;
    }

    :host([elevation="none"]) {
      --ui-sidebar-shadow: none;
    }

    :host([elevation="low"]) {
      --ui-sidebar-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
    }

    :host([elevation="high"]) {
      --ui-sidebar-shadow: 0 32px 64px rgba(15, 23, 42, 0.2);
    }

    :host([position="right"]) .shell {
      border-inline-start: var(--ui-sidebar-border);
      border-inline-end: none;
    }

    :host([collapsed]) {
      inline-size: var(--ui-sidebar-current-width);
    }

    :host([headless]) .shell {
      background: transparent;
      border: none;
      box-shadow: none;
    }

    .shell {
      position: relative;
      display: flex;
      flex-direction: column;
      min-inline-size: 0;
      min-block-size: 100%;
      inline-size: var(--ui-sidebar-current-width);
      padding: var(--ui-sidebar-padding);
      gap: var(--ui-sidebar-gap);
      box-sizing: border-box;
      border: var(--ui-sidebar-border);
      border-radius: var(--ui-sidebar-radius);
      background: var(--ui-sidebar-bg);
      color: var(--ui-sidebar-color);
      box-shadow: var(--ui-sidebar-shadow);
      overflow: hidden;
      backdrop-filter: blur(14px) saturate(1.08);
    }

    .shell::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      box-shadow: var(--base-sidebar-outline, inset 0 0 0 1px color-mix(in srgb, currentColor 8%, transparent));
    }

    .header-wrap,
    .search-wrap,
    .footer-wrap,
    .promo-wrap {
      min-inline-size: 0;
    }

    .header-wrap[hidden],
    .search-wrap[hidden],
    .footer-wrap[hidden],
    .promo-wrap[hidden] {
      display: none;
    }

    .header-wrap {
      padding: var(--ui-sidebar-header-padding);
    }

    .header-wrap ::slotted(*) {
      min-inline-size: 0;
      color: inherit;
    }

    .search-wrap ::slotted(*) {
      display: block;
      min-inline-size: 0;
    }

    .nav {
      min-inline-size: 0;
      display: flex;
      flex-direction: column;
      gap: var(--ui-sidebar-gap);
      flex: 1 1 auto;
      overflow-y: auto;
      overflow-x: hidden;
      padding-inline-end: 2px;
    }

    .nav::-webkit-scrollbar {
      width: 8px;
    }

    .nav::-webkit-scrollbar-thumb {
      border-radius: 999px;
      background: color-mix(in srgb, currentColor 12%, transparent);
    }

    .section {
      display: grid;
      gap: var(--ui-sidebar-section-gap);
    }

    .section-label {
      padding-inline: 10px;
      font-size: var(--ui-sidebar-section-label-size);
      letter-spacing: var(--ui-sidebar-section-label-spacing);
      line-height: 1.4;
      font-weight: 500;
      text-transform: var(--ui-sidebar-section-label-transform);
      margin-block-end: 2px;
      color: var(--ui-sidebar-section-label-color);
    }

    .section-items {
      display: grid;
      /* The space between rows (--ui-sidebar-item-gap is the space inside a row); was a fixed 8px. */
      gap: var(--ui-sidebar-row-gap);
    }

    .item {
      display: grid;
      gap: 8px;
    }

    .item-button {
      min-inline-size: 0;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--ui-sidebar-item-gap);
      inline-size: 100%;
      min-block-size: var(--ui-sidebar-item-height);
      padding: var(--ui-sidebar-item-padding-y) var(--ui-sidebar-item-padding-x);
      border: 1px solid transparent;
      border-radius: var(--ui-sidebar-item-radius);
      box-sizing: border-box;
      background: transparent;
      color: inherit;
      cursor: pointer;
      text-align: left;
      text-decoration: none;
      font-family: var(--ui-font-family, Inter, system-ui, sans-serif);
      font-size: var(--ui-sidebar-item-font-size);
      line-height: var(--ui-sidebar-item-line-height);
      font-weight: var(--ui-sidebar-item-font-weight);
      letter-spacing: var(--ui-default-letter-spacing, 0em);
      position: relative;
      transition:
        background-color 140ms ease,
        border-color 140ms ease,
        color 140ms ease,
        transform 140ms ease,
        box-shadow 140ms ease;
    }

    .item-button:hover {
      background: var(--ui-sidebar-item-hover);
    }

    .item-button:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--ui-ring-color, var(--ui-sidebar-focus-ring));
    }

    .item-button[aria-current="page"],
    .item-button[data-active="true"] {
      background: var(--ui-sidebar-item-active-bg);
      color: var(--ui-sidebar-item-active-color);
      border-color: var(--ui-sidebar-item-border);
      font-weight: var(--ui-sidebar-item-active-font-weight);
    }

    /* The bar beside the current item (transparent unless a variant sets --ui-sidebar-indicator). */
    .item-button[aria-current="page"]::before,
    .item-button[data-active="true"]::before {
      content: '';
      position: absolute;
      inset-block: 7px;
      inset-inline-start: 0;
      inline-size: 3px;
      border-radius: 999px;
      background: var(--ui-sidebar-indicator);
    }

    .item-button:hover .icon-wrap,
    .item-button[aria-current="page"] .icon-wrap,
    .item-button[data-active="true"] .icon-wrap,
    .item-button[data-has-active="true"] .icon-wrap {
      color: currentColor;
    }

    /* A closed group that holds the current page shows it in its label. */
    .item-button[data-has-active="true"] {
      color: var(--ui-sidebar-item-active-color);
    }

    .item-button[aria-disabled="true"] {
      opacity: 0.48;
      cursor: not-allowed;
      pointer-events: none;
    }

    .item-button[data-tone="danger"] .item-label,
    .item-button[data-tone="danger"] .meta {
      color: var(--ui-color-danger-text, color-mix(in srgb, var(--ui-color-danger, #dc2626) 84%, var(--ui-color-text, #0f172a)));
    }

    .icon-wrap,
    .arrow-wrap {
      display: inline-grid;
      place-items: center;
      inline-size: 20px;
      block-size: 20px;
      flex: 0 0 20px;
      color: var(--ui-sidebar-icon-color);
      transition: color 140ms ease;
    }

    .arrow-wrap {
      inline-size: 16px;
      block-size: 16px;
      transition: transform 140ms ease;
    }

    .arrow-wrap svg {
      inline-size: 14px;
      block-size: 14px;
      display: block;
    }

    .item[data-expanded="true"] > .item-button .arrow-wrap {
      transform: rotate(90deg);
    }

    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 100%;
      block-size: 100%;
      font-size: 0;
      line-height: 1;
    }

    .icon :is(svg) {
      inline-size: 17px;
      block-size: 17px;
      display: block;
    }

    .copy {
      min-inline-size: 0;
      display: grid;
      gap: 4px;
      align-content: center;
      font-size: var(--ui-sidebar-item-font-size);
      line-height: var(--ui-sidebar-item-line-height);
    }

    .copy.custom-copy > * {
      min-inline-size: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .copy.custom-copy > :first-child {
      font-family: var(--ui-font-family, Inter, system-ui, sans-serif);
      font-size: var(--ui-sidebar-item-font-size);
      line-height: var(--ui-sidebar-item-line-height);
      font-weight: inherit;
      letter-spacing: var(--ui-default-letter-spacing, 0em);
      color: inherit;
    }

    .copy.custom-copy > :not(:first-child) {
      font-size: calc(var(--ui-sidebar-item-font-size) - 2px);
      line-height: calc(var(--ui-sidebar-item-line-height) - 2px);
      font-weight: 500;
      color: color-mix(in srgb, currentColor 70%, transparent);
    }

    .item-label,
    .item-description {
      min-inline-size: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-label {
      font-family: var(--ui-font-family, Inter, system-ui, sans-serif);
      font-size: var(--ui-sidebar-item-font-size);
      line-height: var(--ui-sidebar-item-line-height);
      font-weight: inherit;
      letter-spacing: var(--ui-default-letter-spacing, 0em);
      color: inherit;
    }

    .item-description {
      font-size: calc(var(--ui-sidebar-item-font-size) - 2px);
      line-height: calc(var(--ui-sidebar-item-line-height) - 2px);
      font-weight: 500;
      color: color-mix(in srgb, currentColor 70%, transparent);
    }

    .meta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
      min-inline-size: max-content;
      color: color-mix(in srgb, currentColor 66%, transparent);
      font-size: calc(var(--ui-sidebar-item-font-size) - 1px);
      font-weight: 600;
      line-height: var(--ui-sidebar-item-line-height);
    }

    .end-wrap {
      min-inline-size: 0;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      margin-inline-start: auto;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-inline-size: 20px;
      min-block-size: 18px;
      padding-inline: 6px;
      border-radius: 999px;
      background: color-mix(in srgb, currentColor 9%, transparent);
      color: inherit;
      font-size: 11px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }

    .submenu {
      display: grid;
      grid-template-rows: 0fr;
      margin-inline-start: calc(var(--ui-sidebar-item-padding-x) + 9px);
      padding-inline-start: 8px;
      border-inline-start: 1px solid color-mix(in srgb, currentColor 13%, transparent);
      opacity: 0;
      transform: translateY(-4px);
      pointer-events: none;
      transition:
        grid-template-rows 180ms cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 140ms ease,
        transform 140ms ease;
    }

    .submenu-inner {
      min-height: 0;
      overflow: hidden;
      display: grid;
      gap: var(--ui-sidebar-row-gap);
      padding-block: 0;
      transition: padding-block 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .item[data-expanded="true"] > .submenu {
      grid-template-rows: 1fr;
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .item[data-expanded="true"] > .submenu > .submenu-inner {
      padding-block: 2px 0;
    }

    .promo-wrap ::slotted(*) {
      display: block;
      min-inline-size: 0;
    }

    .footer-wrap {
      margin-top: auto;
      color: color-mix(in srgb, currentColor 66%, transparent);
      font-size: 13px;
      line-height: 18px;
    }

    .resize-handle {
      position: absolute;
      inset-block: 16px;
      /* a 24px target (WCAG 2.5.8) centred on the edge, so half of it sits outside the sidebar */
      inset-inline-end: -12px;
      inline-size: 24px;
      cursor: ew-resize;
      background: transparent;
      border: none;
      padding: 0;
      opacity: 0;
      transition: opacity 120ms ease;
    }

    .resize-handle::before {
      content: '';
      position: absolute;
      inset-block: 6px;
      inset-inline-end: 10.5px;
      inline-size: 3px;
      border-radius: 999px;
      background: color-mix(in srgb, currentColor 20%, transparent);
    }

    .shell:hover .resize-handle,
    .resize-handle:focus-visible {
      opacity: 1;
    }

    :host([position="right"]) .resize-handle {
      inset-inline-end: auto;
      inset-inline-start: -12px;
      cursor: ew-resize;
    }

    :host([position="right"]) .resize-handle::before {
      inset-inline-end: auto;
      inset-inline-start: 10.5px;
    }

    :host(:not([resizable])) .resize-handle {
      display: none;
    }

    :host([collapsed]) .resize-handle {
      display: none;
    }

    :host([collapsed]) .section-label,
    :host([collapsed]) .item-description,
    :host([collapsed]) .meta,
    :host([collapsed]) .end-wrap,
    :host([collapsed]) .copy,
    :host([collapsed]) .search-wrap,
    :host([collapsed]) .promo-wrap,
    :host([collapsed]) .footer-wrap {
      display: none;
    }

    :host([collapsed]) .header-wrap {
      padding-inline: 0;
      display: flex;
      justify-content: center;
    }

    :host([collapsed]) .item-button {
      grid-template-columns: 1fr;
      justify-items: center;
      padding: 0;
      gap: 0;
      inline-size: calc(100% - 4px);
      min-inline-size: var(--ui-sidebar-item-height);
    }

    :host([collapsed]) .arrow-wrap,
    :host([collapsed]) .submenu {
      display: none;
    }

    :host([rail]) .shell {
      padding-inline: max(10px, calc(var(--ui-sidebar-padding) - 4px));
    }


    /* layout="dual": the top-level items as an icon rail, the open area's pages in a panel beside it. */
    :host([layout="dual"]) {
      --ui-sidebar-rail-width: var(--base-sidebar-rail-width, 72px);
      --ui-sidebar-rail-bg: var(--base-sidebar-rail-bg, color-mix(in srgb, var(--ui-sidebar-color) 3%, transparent));
      --ui-sidebar-rail-border: color-mix(in srgb, var(--ui-sidebar-color) 9%, transparent);
      inline-size: calc(var(--ui-sidebar-rail-width) + var(--ui-sidebar-current-width));
    }

    :host([layout="dual"][collapsed]),
    :host([layout="dual"][data-panel-empty]) {
      inline-size: var(--ui-sidebar-rail-width);
    }

    :host([layout="dual"]) .shell {
      flex-direction: row;
      padding: 0;
      gap: 0;
      inline-size: 100%;
    }

    :host([layout="dual"][position="right"]) .shell {
      flex-direction: row-reverse;
    }

    .rail {
      flex: 0 0 var(--ui-sidebar-rail-width);
      inline-size: var(--ui-sidebar-rail-width);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 10px 4px;
      box-sizing: border-box;
      background: var(--ui-sidebar-rail-bg);
      border-inline-end: 1px solid var(--ui-sidebar-rail-border);
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: none;
    }

    :host([position="right"]) .rail {
      border-inline-end: none;
      border-inline-start: 1px solid var(--ui-sidebar-rail-border);
    }

    :host([layout="dual"][collapsed]) .rail,
    :host([layout="dual"][data-panel-empty]) .rail {
      border-inline: none;
    }

    .rail-start,
    .rail-end {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .rail-start[hidden],
    .rail-end[hidden] {
      display: none;
    }

    .rail-start {
      padding-block-end: 6px;
    }

    .rail-end {
      margin-block-start: auto;
      padding-block-start: 8px;
    }

    .rail-items {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 2px;
      inline-size: 100%;
    }

    .rail-divider {
      block-size: 1px;
      margin: 6px 10px;
      background: var(--ui-sidebar-rail-border);
    }

    :host([layout="dual"]) .rail .item-button,
    :host([layout="dual"][collapsed]) .rail .item-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      inline-size: 100%;
      min-inline-size: 0;
      min-block-size: 52px;
      padding: 6px 0;
      border-radius: calc(var(--ui-sidebar-item-radius) + 2px);
      text-align: center;
    }

    .rail .item-button::before {
      inset-block: 12px;
      inset-inline-start: -4px;
    }

    /* The rail marks hover and the open area on the icon pill, not the whole tile (as in Material 3). */
    :host([layout="dual"]) .rail .item-button,
    :host([layout="dual"]) .rail .item-button:hover,
    :host([layout="dual"]) .rail .item-button[aria-current="page"],
    :host([layout="dual"]) .rail .item-button[aria-expanded="true"] {
      background: transparent;
      border-color: transparent;
      box-shadow: none;
    }

    :host([layout="dual"]) .rail .item-button:focus-visible {
      box-shadow: 0 0 0 2px var(--ui-ring-color, var(--ui-sidebar-focus-ring));
    }

    .rail .icon-wrap {
      position: relative;
      inline-size: 44px;
      block-size: 30px;
      flex: 0 0 auto;
      box-sizing: border-box;
      border: 1px solid transparent;
      border-radius: 999px;
      transition: color 140ms ease, background-color 140ms ease, border-color 140ms ease;
    }

    .rail .item-button:hover .icon-wrap {
      background: var(--ui-sidebar-item-hover);
    }

    .rail .item-button[aria-current="page"] .icon-wrap,
    .rail .item-button[aria-expanded="true"] .icon-wrap,
    :host([collapsed]) .rail .item-button[data-has-active="true"] .icon-wrap {
      background: var(--ui-sidebar-item-active-bg);
      border-color: var(--ui-sidebar-item-border);
      color: var(--ui-sidebar-item-active-color);
    }

    :host([variant="inset"]) .rail .item-button[aria-current="page"] .icon-wrap,
    :host([variant="inset"]) .rail .item-button[aria-expanded="true"] .icon-wrap,
    :host([variant="inset"][collapsed]) .rail .item-button[data-has-active="true"] .icon-wrap {
      box-shadow: 0 1px 2px color-mix(in srgb, #000 8%, transparent);
    }

    .rail-label {
      max-inline-size: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 11px;
      line-height: 14px;
      font-weight: 500;
      color: var(--ui-sidebar-muted);
    }

    .rail .item-button:hover .rail-label,
    .rail .item-button[aria-current="page"] .rail-label,
    .rail .item-button[aria-expanded="true"] .rail-label,
    .rail .item-button[data-has-active="true"] .rail-label {
      color: var(--ui-sidebar-color);
    }

    .rail .item-button[aria-expanded="true"] .rail-label,
    .rail .item-button[aria-current="page"] .rail-label {
      font-weight: 600;
    }

    .rail .badge {
      position: absolute;
      inset-block-start: -5px;
      inset-inline-end: -4px;
      min-inline-size: 16px;
      min-block-size: 16px;
      padding-inline: 4px;
      font-size: 10px;
      background: var(--ui-sidebar-accent);
      color: var(--ui-sidebar-accent-contrast);
    }

    .panel {
      flex: 1 1 auto;
      min-inline-size: 0;
      display: flex;
      flex-direction: column;
      gap: var(--ui-sidebar-gap);
      padding: var(--ui-sidebar-padding);
      box-sizing: border-box;
      overflow: hidden;
    }

    :host([layout="dual"][collapsed]) .panel,
    :host([layout="dual"][data-panel-empty]) .panel {
      display: none;
    }

    .panel-title {
      display: grid;
      gap: 2px;
      padding: 6px 10px 2px;
    }

    .panel-title-label {
      font-size: 15px;
      line-height: 22px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--ui-sidebar-color);
    }

    .panel-title-description {
      font-size: 12px;
      line-height: 16px;
      color: var(--ui-sidebar-muted);
    }

    /* The panel is never in icon-only mode, whatever "collapsed" does to the classic list. */
    :host([layout="dual"]) .panel .copy {
      display: grid;
    }

    @media (prefers-reduced-motion: reduce) {
      :host,
      .item-button,
      .arrow-wrap {
        transition: none !important;
      }
    }

    @media (forced-colors: active) {
      :host {
        --ui-sidebar-bg: Canvas;
        --ui-sidebar-color: CanvasText;
        --ui-sidebar-muted: CanvasText;
        --ui-sidebar-border: 1px solid CanvasText;
        --ui-sidebar-item-hover: Highlight;
        --ui-sidebar-item-active-bg: Highlight;
        --ui-sidebar-item-active-color: HighlightText;
        --ui-sidebar-item-border: Highlight;
        --ui-sidebar-control-bg: Canvas;
        --ui-sidebar-control-hover: Highlight;
        --ui-sidebar-promo-bg: Canvas;
        --ui-sidebar-promo-color: CanvasText;
        --ui-sidebar-focus-ring: Highlight;
        --ui-sidebar-shadow: none;
      }

      .shell,
      .item-button,
      .badge,
      .submenu,
      .resize-handle::before {
        forced-color-adjust: none;
      }

      .shell,
      .badge {
        background: Canvas;
        color: CanvasText;
        border-color: CanvasText;
        box-shadow: none;
      }

      .item-button {
        background: Canvas;
        color: CanvasText;
        border-color: transparent;
      }

      .item-button:hover,
      .item-button[aria-current="page"],
      .item-button[data-active="true"] {
        background: Highlight;
        color: HighlightText;
        border-color: Highlight;
      }

      .submenu {
        border-inline-start-color: CanvasText;
      }

      .resize-handle::before {
        background: CanvasText;
      }
    }
  </style>
  ${body}
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeRadius(value: string | null): string | null {
  if (!value) return null;
  const next = value.trim();
  if (!next) return null;
  if (['none', 'sm', 'md', 'lg', 'full'].includes(next)) return next;
  if (/^\d+(\.\d+)?$/.test(next)) return `${next}px`;
  return next;
}

function normalizeMetric(value: string | null): string | null {
  if (!value) return null;
  const next = value.trim();
  if (!next) return null;
  if (/^\d+(\.\d+)?$/.test(next)) return `${next}px`;
  return next;
}

function normalizeSize(value: string | null): 'sm' | 'md' | 'lg' {
  if (value === 'sm' || value === '1') return 'sm';
  if (value === 'lg' || value === '3') return 'lg';
  return 'md';
}

function parsePx(value: string | null | undefined, fallback: number): number {
  if (!value) return fallback;
  const numeric = Number.parseFloat(String(value));
  return Number.isFinite(numeric) ? numeric : fallback;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'item';
}

export class UISidebar extends ElementBase {
  static get observedAttributes() {
    return [
      'collapsed',
      'collapsible',
      'rail',
      'resizable',
      'position',
      'value',
      'items',
      'layout',
      'variant',
      'size',
      'density',
      'tone',
      'show-icons',
      'show-badges',
      'item-radius',
      'item-gap',
      'row-gap',
      'item-padding-x',
      'item-padding-y',
      'item-height',
      'item-font-size',
      'item-line-height',
      'section-label-transform',
      'search-query',
      'headless',
      'width',
      'min-width',
      'max-width',
      'collapsed-width',
      'storage-key',
      'auto-save',
      'radius',
      'elevation'
    ];
  }

  private _observer: MutationObserver | null = null;
  private _resizeCleanup: (() => void) | null = null;
  private _responsiveCleanup: (() => void) | null = null;
  private _responsiveAutoCollapsed = false;
  private _userCollapsePreference = false;
  private _expanded = new Set<string>();
  /** The value whose parent groups were last opened for it (each new value opens them once). */
  private _autoExpandedFor: string | null = null;
  private _autoExpandPending = false;
  private _dragging = false;
  /** layout="dual": the value of the top-level item whose pages fill the panel. */
  private _area: string | null = null;
  private _lastExpandedWidth = 0;
  private _handleSearchInput = (event: Event): void => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | null;
    if (!target) return;
    const searchSlotHost = (target as HTMLElement).closest('[slot="search"]');
    if (!searchSlotHost || !this.contains(searchSlotHost)) return;
    const value = typeof target.value === 'string' ? target.value : '';
    if (value) this.setAttribute('search-query', value);
    else this.removeAttribute('search-query');
    this.dispatchEvent(new CustomEvent('search-change', { detail: { query: value }, bubbles: true }));
  };

  connectedCallback() {
    super.connectedCallback();
    this._observeLightDom();
    this._bindResponsiveCollapse();
    this.addEventListener('input', this._handleSearchInput as EventListener, true);
    this.addEventListener('change', this._handleSearchInput as EventListener, true);
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    this._observer = null;
    this._resizeCleanup?.();
    this._resizeCleanup = null;
    this._responsiveCleanup?.();
    this._responsiveCleanup = null;
    this.removeEventListener('input', this._handleSearchInput as EventListener, true);
    this.removeEventListener('change', this._handleSearchInput as EventListener, true);
    super.disconnectedCallback();
  }

  protected shouldRenderOnAttributeChange(name: string): boolean {
    if (NON_RENDER_WIDTH_ATTRIBUTES.has(name)) return false;
    if (VISUAL_ONLY_ATTRIBUTES.has(name)) return false;
    if (name === 'collapsed') return false;
    if (name === 'value') return false;
    if (name === 'radius') return false;
    return true;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'radius' && this.isConnected) {
      const next = normalizeRadius(newValue);
      if (next && next !== newValue) {
        this.setAttribute('radius', next);
        return;
      }
    }
    if (!this.isConnected) return;
    if (NON_RENDER_WIDTH_ATTRIBUTES.has(name)) {
      this._applySizing();
      return;
    }
    if (name === 'radius') {
      this._applyRadius();
      return;
    }
    if (
      name === 'item-radius' ||
      name === 'item-gap' ||
      name === 'row-gap' ||
      name === 'item-padding-x' ||
      name === 'item-padding-y' ||
      name === 'item-height' ||
      name === 'item-font-size' ||
      name === 'item-line-height'
    ) {
      this._applyItemMetrics();
      return;
    }
    if (VISUAL_ONLY_ATTRIBUTES.has(name)) return;
    if (name === 'collapsed') {
      if (this.hasAttribute('collapsed')) this._expanded.clear();
      if (this._isDual()) {
        const collapsed = this.hasAttribute('collapsed');
        this.root.querySelectorAll<HTMLElement>('.rail .item-button[data-action="area"]').forEach((button) => {
          button.setAttribute('aria-expanded', !collapsed && button.dataset.value === this._area ? 'true' : 'false');
        });
      }
      this._applySizing();
      this._syncExpandedDom();
      return;
    }
    if (name === 'value') {
      if (this._isDual()) {
        const area = this._areaFor(this.value);
        if (area && area.value !== this._area) {
          this._area = area.value;
          this.requestRender();
          return;
        }
      }
      this._syncActiveDom();
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    if (!next) this.removeAttribute('value');
    else this.setAttribute('value', next);
  }

  collapse(): void {
    if (!this.hasAttribute('collapsible')) return;
    if (this.hasAttribute('collapsed')) return;
    this._userCollapsePreference = true;
    this._lastExpandedWidth = this._currentExpandedWidth();
    this.setAttribute('collapsed', '');
    this.dispatchEvent(new CustomEvent('toggle', { detail: { collapsed: true }, bubbles: true }));
    this.dispatchEvent(new CustomEvent('collapse-change', { detail: { collapsed: true }, bubbles: true }));
  }

  expand(): void {
    if (!this.hasAttribute('collapsible')) return;
    if (!this.hasAttribute('collapsed')) return;
    this._userCollapsePreference = true;
    this.removeAttribute('collapsed');
    this.dispatchEvent(new CustomEvent('toggle', { detail: { collapsed: false }, bubbles: true }));
    this.dispatchEvent(new CustomEvent('collapse-change', { detail: { collapsed: false }, bubbles: true }));
  }

  toggle(force?: boolean): void {
    const next = typeof force === 'boolean' ? force : !this.hasAttribute('collapsed');
    if (next) this.collapse();
    else this.expand();
  }

  protected render(): void {
    // When the current item sits inside a group, open the group once for that value, so the
    // reader can see where they are. The user can still close it afterwards.
    // It only counts as done once the value is among the items: frameworks often set `value`
    // before `items`.
    this._autoExpandPending = !!this.value && this.value !== this._autoExpandedFor;
    if (this._isDual()) {
      this._renderDual();
      return;
    }
    this.removeAttribute('data-panel-empty');
    const sections = this._buildSections();
    if (this._autoExpandPending && this._flattenItems(this._collectItems()).some((item) => item.value === this.value)) {
      this._autoExpandedFor = this.value;
    }
    this._autoExpandPending = false;
    const headerHidden = !this.querySelector('[slot="header"]');
    const searchHidden = !this.querySelector('[slot="search"]');
    const footerHidden = !this.querySelector('[slot="footer"]');
    const promoHidden = !this.querySelector('[slot="promo"]');

    const body = `
      <aside class="shell" part="shell">
        <div class="header-wrap" part="header" ${headerHidden ? 'hidden' : ''}><slot name="header"></slot></div>
        <div class="search-wrap" part="search" ${searchHidden ? 'hidden' : ''}><slot name="search"></slot></div>
        <nav class="nav" part="nav" aria-label="${escapeHtml(this.getAttribute('aria-label') || 'Sidebar')}">
          ${sections}
        </nav>
        <div class="promo-wrap" part="promo" ${promoHidden ? 'hidden' : ''}><slot name="promo"></slot></div>
        <div class="footer-wrap" part="footer" ${footerHidden ? 'hidden' : ''}><slot name="footer"></slot></div>
        <button class="resize-handle" part="resize-handle" type="button" aria-label="Resize sidebar"></button>
      </aside>
    `;

    this.setContent(template(body));
    this._applyItemMetrics();
    this._applyRadius();
    this._applySizing();
    this._bindInteractions();
    this._syncActiveDom();
    this._syncExpandedDom();
  }

  private _observeLightDom(): void {
    if (this._observer) return;
    this._observer = new MutationObserver((records) => {
      if (records.some((record) => record.type === 'childList' || (record.type === 'attributes' && (record.target as Element).slot))) {
        this.requestRender();
      }
    });
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['slot', 'data-value', 'data-href', 'data-target', 'data-rel', 'data-section', 'data-active', 'data-badge', 'data-description', 'data-content-html', 'data-icon', 'data-tone', 'data-disabled']
    });
  }

  private _isDual(): boolean {
    return this.getAttribute('layout') === 'dual';
  }

  /** The top-level item that is, or holds, `value`. */
  private _areaFor(value: string, items = this._collectItems()): NormalizedSidebarItem | undefined {
    if (!value) return undefined;
    return items.find((item) => item.children.length && (item.value === value || this._containsValue(item.children, value)));
  }

  private _renderDual(): void {
    const items = this._collectItems();
    const areas = items.filter((item) => item.children.length);
    let area = areas.find((item) => item.value === this._area);
    if (!area) area = this._areaFor(this.value, items) || areas[0];
    this._area = area ? area.value : null;
    if (this.value && this._flattenItems(items).some((item) => item.value === this.value)) {
      this._autoExpandedFor = this.value;
    }
    if (area) this.removeAttribute('data-panel-empty');
    else this.setAttribute('data-panel-empty', '');

    const label = this.getAttribute('aria-label') || 'Sidebar';
    const rail = items
      .map((item, index) => {
        const divider = index > 0 && item.section !== items[index - 1].section ? '<div class="rail-divider" role="presentation"></div>' : '';
        return divider + this._renderRailItem(item, area);
      })
      .join('');

    let panelBody = '';
    if (area) {
      const query = this.getAttribute('search-query') || '';
      const children = this._filterItems(area.children, query).map((child) => ({
        ...child,
        // Children inherit the area's section: only a section of their own labels a group.
        section: child.section === area!.section ? '' : child.section
      }));
      const groups = this._groupItems(children);
      panelBody = groups.length
        ? groups
            .map(({ label: sectionLabel, items: groupItems }) => `
              <section class="section" part="section">
                ${sectionLabel ? `<div class="section-label" part="section-label">${escapeHtml(sectionLabel)}</div>` : ''}
                <div class="section-items">${groupItems.map((item, index) => this._renderItem(item, `${area!.id}-${index}`)).join('')}</div>
              </section>`)
            .join('')
        : `<section class="section" part="section"><div class="section-items"><div class="item"><div class="item-button" aria-disabled="true"><span class="copy"><span class="item-label">No matches found</span><span class="item-description">Try a different search term.</span></span></div></div></div></section>`;
    }
    this._autoExpandPending = false;

    const has = (slot: string) => !!this.querySelector(`[slot="${slot}"]`);
    const description = area?.description ? `<span class="panel-title-description">${escapeHtml(area.description)}</span>` : '';
    const body = `
      <aside class="shell" part="shell">
        <nav class="rail" part="rail" aria-label="${escapeHtml(label)}">
          <div class="rail-start" part="rail-start" ${has('rail-start') ? '' : 'hidden'}><slot name="rail-start"></slot></div>
          <div class="rail-items">${rail}</div>
          <div class="rail-end" part="rail-end" ${has('rail-end') ? '' : 'hidden'}><slot name="rail-end"></slot></div>
        </nav>
        <div class="panel" part="panel" id="panel">
          <div class="header-wrap" part="header" ${has('header') ? '' : 'hidden'}><slot name="header"></slot></div>
          ${area ? `<div class="panel-title" part="panel-title"><span class="panel-title-label" id="panel-title">${escapeHtml(area.label)}</span>${description}</div>` : ''}
          <div class="search-wrap" part="search" ${has('search') ? '' : 'hidden'}><slot name="search"></slot></div>
          <nav class="nav" part="nav" aria-labelledby="panel-title">${panelBody}</nav>
          <div class="promo-wrap" part="promo" ${has('promo') ? '' : 'hidden'}><slot name="promo"></slot></div>
          <div class="footer-wrap" part="footer" ${has('footer') ? '' : 'hidden'}><slot name="footer"></slot></div>
        </div>
        <button class="resize-handle" part="resize-handle" type="button" aria-label="Resize sidebar"></button>
      </aside>
    `;

    this.setContent(template(body));
    this._applyItemMetrics();
    this._applyRadius();
    this._applySizing();
    this._bindInteractions();
    this._syncActiveDom();
    this._syncExpandedDom();
  }

  private _renderRailItem(item: NormalizedSidebarItem, area: NormalizedSidebarItem | undefined): string {
    const isArea = !!item.children.length;
    const isOpen = isArea && !!area && area.value === item.value && !this.hasAttribute('collapsed');
    const holdsActive = isArea && !!this.value && this._containsValue(item.children, this.value);
    const isActive = !isArea && (this.value ? this.value === item.value : !!item.active);
    const isLink = !isArea && !!item.href;
    const tag = isLink ? 'a' : 'button';
    const icon = this._renderIcon(item, 20) || `<span aria-hidden="true">${escapeHtml(item.label.charAt(0).toUpperCase())}</span>`;
    const badge = item.badge && this.getAttribute('show-badges') !== 'false' ? `<span class="badge" part="badge">${escapeHtml(item.badge)}</span>` : '';
    const attrs = [
      isLink ? `href="${escapeHtml(item.href || '')}"` : 'type="button"',
      isLink && item.target ? `target="${escapeHtml(item.target)}"` : '',
      isLink && item.rel ? `rel="${escapeHtml(item.rel)}"` : '',
      `data-action="${isArea ? 'area' : isLink ? 'navigate' : 'select'}"`,
      `data-item-id="${escapeHtml(item.id)}"`,
      `data-value="${escapeHtml(item.value)}"`,
      isArea ? `aria-expanded="${isOpen ? 'true' : 'false'}" aria-controls="panel"` : '',
      isActive ? 'aria-current="page" data-active="true"' : '',
      holdsActive ? 'data-has-active="true"' : '',
      `aria-disabled="${item.disabled ? 'true' : 'false'}"`,
      item.description ? `title="${escapeHtml(item.description)}"` : ''
    ].filter(Boolean).join(' ');
    return `
      <div class="item rail-item" data-item-id="${escapeHtml(item.id)}" data-value="${escapeHtml(item.value)}">
        <${tag} class="item-button" part="item rail-item" ${attrs}>
          <span class="icon-wrap" part="icon"><span class="icon">${icon}</span>${badge}</span>
          <span class="rail-label">${escapeHtml(item.label)}</span>
        </${tag}>
      </div>`;
  }

  /** Rail click on an area: open its pages; on the open one, fold the panel away (when collapsible). */
  private _openArea(value: string): void {
    const collapsed = this.hasAttribute('collapsed');
    if (value === this._area && !collapsed) {
      if (this.hasAttribute('collapsible')) this.collapse();
      return;
    }
    const changed = value !== this._area;
    this._area = value;
    if (collapsed) {
      this._userCollapsePreference = true;
      this.removeAttribute('collapsed');
      this.dispatchEvent(new CustomEvent('toggle', { detail: { collapsed: false }, bubbles: true }));
      this.dispatchEvent(new CustomEvent('collapse-change', { detail: { collapsed: false }, bubbles: true }));
    }
    if (changed || collapsed) {
      this.render();
      Array.from(this.root.querySelectorAll<HTMLElement>('.rail .item-button')).find((button) => button.dataset.value === value)?.focus();
    }
    this.dispatchEvent(new CustomEvent('area-change', { detail: { value }, bubbles: true }));
  }

  private _buildSections(): string {
    const groups = this._groupItems(this._filterItems(this._collectItems(), this.getAttribute('search-query') || ''));
    if (!groups.length) {
      return `
        <section class="section" part="section">
          <div class="section-items">
            <div class="item">
              <div class="item-button" aria-disabled="true">
                <span class="copy">
                  <span class="item-label">No matches found</span>
                  <span class="item-description">Try a different search term.</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      `;
    }
    return groups
      .map(({ label, items }) => {
    const title = label ? `<div class="section-label" part="section-label">${escapeHtml(label)}</div>` : '';
        return `
          <section class="section" part="section">
            ${title}
            <div class="section-items">${items.map((item, index) => this._renderItem(item, `${slugify(label || 'general')}-${index}`)).join('')}</div>
          </section>
        `;
      })
      .join('');
  }

  private _renderItem(item: NormalizedSidebarItem, fallbackId: string): string {
    const id = item.id || fallbackId;
    const isActive = this.value ? this.value === item.value : !!item.active;
    const containsActive = !!item.children.length && !!this.value && this._containsValue(item.children, this.value);
    if (containsActive && this._autoExpandPending && !this.hasAttribute('collapsed')) this._expanded.add(id);
    const isExpanded = this._expanded.has(id);
    const showIcons = this.getAttribute('show-icons') !== 'false';
    const showBadges = this.getAttribute('show-badges') !== 'false';
    const description = item.description ? `<div class="item-description">${escapeHtml(item.description)}</div>` : '';
    const content = item.contentHtml
      ? `<span class="copy custom-copy">${item.contentHtml}</span>`
      : `<span class="copy">
            <span class="item-label">${escapeHtml(item.label)}</span>
            ${description}
          </span>`;
    const renderedIcon = showIcons ? this._renderIcon(item) : '';
    const badge = showBadges && item.badge ? `<span class="badge" part="badge">${escapeHtml(item.badge)}</span>` : '';
    const arrow = item.children.length
      ? `<span class="arrow-wrap" part="arrow" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true"><path d="M6 3.75L10.25 8L6 12.25" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`
      : '';
    const icon = renderedIcon
      ? `<span class="icon-wrap" part="icon"><span class="icon">${renderedIcon}</span></span>`
      : '';
    const end = badge || arrow ? `<span class="end-wrap">${badge ? `<span class="meta">${badge}</span>` : ''}${arrow}</span>` : '';
    const isLink = !!item.href && !item.children.length;
    const activeAttrs = isActive
      ? ' aria-current="page" data-active="true"'
      : containsActive ? ' data-has-active="true"' : '';
    const expandedAttr = item.children.length ? ` aria-expanded="${isExpanded && !this.hasAttribute('collapsed') ? 'true' : 'false'}"` : '';
    const disabledAttrs = item.disabled ? ' aria-disabled="true"' : ' aria-disabled="false"';
    const toneAttr = item.tone && item.tone !== 'default' ? ` data-tone="${escapeHtml(item.tone)}"` : '';
    const hrefAttr = isLink ? ` href="${escapeHtml(item.href || '')}"` : '';
    const targetAttr = isLink && item.target ? ` target="${escapeHtml(item.target)}"` : '';
    const relAttr = isLink && item.rel ? ` rel="${escapeHtml(item.rel)}"` : '';
    const submenu = item.children.length
      ? `<div class="submenu" part="submenu"><div class="submenu-inner">${item.children
          .map((child, index) => this._renderItem(child, `${id}-${index}`))
          .join('')}</div></div>`
      : '';
    const tagName = isLink ? 'a' : 'button';
    const typeAttr = isLink ? '' : ' type="button"';

    return `
      <div class="item" data-item-id="${escapeHtml(id)}" data-value="${escapeHtml(item.value)}" ${isExpanded ? 'data-expanded="true"' : ''}>
        <${tagName}
          class="item-button"
          part="item"
          ${typeAttr}
          data-action="${item.children.length ? 'toggle' : isLink ? 'navigate' : 'select'}"
          data-item-id="${escapeHtml(id)}"
          data-value="${escapeHtml(item.value)}"
          ${hrefAttr}
          ${targetAttr}
          ${relAttr}
          ${activeAttrs}
          ${expandedAttr}
          ${disabledAttrs}
          ${toneAttr}
        >
          ${icon}
          ${content}
          ${end}
        </${tagName}>
        ${submenu}
      </div>
    `;
  }

  private _collectItems(): NormalizedSidebarItem[] {
    const itemsAttr = this.getAttribute('items');
    const source = itemsAttr ? this._parseItems(itemsAttr) : this._parseSlottedItems();
    return this._normalizeItems(source);
  }

  private _parseItems(value: string): SidebarItemInput[] {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private _parseSlottedItems(): SidebarItemInput[] {
    return Array.from(this.querySelectorAll('[slot="item"]')).map((node) => this._parseSlottedItem(node as HTMLElement));
  }

  private _parseSlottedItem(element: HTMLElement): SidebarItemInput {
    let children: SidebarItemInput[] = [];
    const rawChildren = element.dataset.children;
    if (rawChildren) {
      try {
        const parsed = JSON.parse(rawChildren);
        if (Array.isArray(parsed)) children = parsed;
      } catch {
        children = [];
      }
    }
    return {
      value: element.dataset.value || element.textContent?.trim() || 'item',
      label: element.dataset.label || element.textContent?.trim() || element.dataset.value || 'Item',
      href: element.dataset.href,
      target: element.dataset.target,
      rel: element.dataset.rel,
      icon: element.dataset.icon,
      iconHtml: element.dataset.iconHtml,
      contentHtml: element.dataset.contentHtml,
      badge: element.dataset.badge,
      description: element.dataset.description,
      section: element.dataset.section,
      disabled: element.hasAttribute('data-disabled'),
      active: element.hasAttribute('data-active'),
      tone: (element.dataset.tone as SidebarTone | undefined) || 'default',
      children
    };
  }

  private _renderIcon(item: Pick<SidebarItemInput, 'icon' | 'iconHtml'>, size = 16): string {
    const html = String(item.iconHtml || '').trim();
    if (html) return html;
    const value = String(item.icon || '').trim();
    if (!value) return '';
    // An icon name ('receipt', 'chart-pie') is an Editora icon, as in every other component;
    // anything else (an emoji, a letter) is shown as text, as before.
    if (/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(value) && value.length > 1) {
      return `<ui-icon name="${escapeHtml(value)}" size="${size}" decorative></ui-icon>`;
    }
    return escapeHtml(value);
  }

  private _normalizeItems(items: SidebarItemInput[], depth = 0, parentSection = ''): NormalizedSidebarItem[] {
    return items.map((item, index) => {
      const label = item.label?.trim() || item.value?.trim() || `Item ${index + 1}`;
      const value = item.value?.trim() || slugify(label);
      const section = item.section?.trim() || parentSection || '';
      const id = `${slugify(section || 'nav')}-${slugify(value)}-${depth}-${index}`;
      const children = this._normalizeItems(item.children || [], depth + 1, section);
      return {
        ...item,
        id,
        label,
        value,
        section,
        children,
        depth
      };
    });
  }

  private _groupItems(items: NormalizedSidebarItem[]): Array<{ label: string; items: NormalizedSidebarItem[] }> {
    const groups: Array<{ label: string; items: NormalizedSidebarItem[] }> = [];
    const map = new Map<string, { label: string; items: NormalizedSidebarItem[] }>();
    for (const item of items) {
      const key = item.section || '';
      const existing = map.get(key);
      if (existing) {
        existing.items.push(item);
        continue;
      }
      const next = { label: key, items: [item] };
      map.set(key, next);
      groups.push(next);
    }
    return groups;
  }

  private _filterItems(items: NormalizedSidebarItem[], query: string): NormalizedSidebarItem[] {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;
    return items
      .map((item) => {
        const selfMatches = [item.label, item.description, item.value, item.section]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));
        const filteredChildren = selfMatches ? item.children : this._filterItems(item.children, normalizedQuery);
        if (!selfMatches && !filteredChildren.length) return null;
        return {
          ...item,
          children: filteredChildren
        };
      })
      .filter((item): item is NormalizedSidebarItem => !!item);
  }

  private _bindInteractions(): void {
    this.root.querySelectorAll<HTMLElement>('.item-button').forEach((button) => {
      button.onclick = (event) => {
        const target = event.currentTarget as HTMLElement;
        const action = target.dataset.action;
        const id = target.dataset.itemId || '';
        const value = target.dataset.value || '';
        if (target.getAttribute('aria-disabled') === 'true') return;
        if (action === 'area') {
          event.preventDefault();
          this._openArea(value);
          return;
        }
        if (action === 'toggle') {
          event.preventDefault();
          this._toggleExpanded(id);
          return;
        }
        if (action === 'navigate') {
          this._selectValue(value);
          this._handleNavigate(event, target, value);
          return;
        }
        event.preventDefault();
        this._selectValue(value);
      };
      button.onkeydown = (event) => {
        const target = event.currentTarget as HTMLElement;
        const id = target.dataset.itemId || '';
        const value = target.dataset.value || '';
        if (event.key === 'ArrowRight' && target.dataset.action === 'toggle') {
          event.preventDefault();
          this._expanded.add(id);
          this._syncExpandedDom();
        } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && target.closest('.rail')) {
          // The rail is one stop in the tab order's eyes, but arrows walk it (as in a toolbar).
          event.preventDefault();
          const buttons = Array.from(this.root.querySelectorAll<HTMLElement>('.rail .item-button'));
          const next = buttons[(buttons.indexOf(target) + (event.key === 'ArrowDown' ? 1 : buttons.length - 1)) % buttons.length];
          next?.focus();
        } else if (event.key === 'ArrowRight' && target.dataset.action === 'area') {
          event.preventDefault();
          if (target.getAttribute('aria-expanded') !== 'true') this._openArea(value);
          this.root.querySelector<HTMLElement>('.panel .item-button:not([aria-disabled="true"])')?.focus();
        } else if (event.key === 'ArrowLeft' && target.closest('.panel') && !target.closest('.submenu') && target.dataset.action !== 'toggle') {
          event.preventDefault();
          this.root.querySelector<HTMLElement>('.rail .item-button[aria-expanded="true"]')?.focus();
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          this._expanded.delete(id);
          this._syncExpandedDom();
        } else if (event.key === 'Enter' && target.dataset.action === 'navigate') {
          // Leave Enter on a link to the browser: it fires the click that selects and navigates.
          // Preventing it here meant a keyboard user could never follow a link item.
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (target.dataset.action === 'area') this._openArea(value);
          else if (target.dataset.action === 'toggle') this._toggleExpanded(id);
          else if (target.dataset.action === 'navigate') target.click();
          else this._selectValue(value);
        }
      };
    });

    const handle = this.root.querySelector<HTMLElement>('.resize-handle');
    if (!handle) return;
    handle.onkeydown = (event) => this._handleResizeKey(event);
    handle.onpointerdown = (event) => this._startResize(event);
  }

  // Link items: the shared navigate contract (primitives/navigate.ts).
  private _handleNavigate(event: MouseEvent, link: HTMLElement, value: string): void {
    const items = this._flattenItems(this._collectItems());
    const index = items.findIndex((item) => item.value === value);
    const item = items[index];
    const href = link.getAttribute('href') || '';
    if (requestNavigate(this, { index, value, label: item?.label || value, href, item }, event, link.getAttribute('target') || '')) {
      event.preventDefault();
    }
  }

  private _toggleExpanded(id: string): void {
    if (this.hasAttribute('collapsed')) return;
    if (this._expanded.has(id)) this._expanded.delete(id);
    else this._expanded.add(id);
    this._syncExpandedDom();
  }

  private _syncExpandedDom(): void {
    this.root.querySelectorAll<HTMLElement>('.item').forEach((item) => {
      const id = item.dataset.itemId || '';
      const expanded = this._expanded.has(id) && !this.hasAttribute('collapsed');
      if (expanded) item.setAttribute('data-expanded', 'true');
      else item.removeAttribute('data-expanded');
      const toggle = item.querySelector<HTMLElement>(':scope > .item-button[data-action="toggle"]');
      if (toggle) toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  private _containsValue(items: NormalizedSidebarItem[], value: string): boolean {
    return items.some((item) => item.value === value || this._containsValue(item.children, value));
  }

  private _selectValue(value: string): void {
    this.value = value;
    const items = this._flattenItems(this._collectItems());
    const index = items.findIndex((item) => item.value === value);
    const selected = items[index];
    const detail: SidebarSelectDetail = {
      index,
      value,
      label: selected?.label || value,
      item: selected
    };
    this.dispatchEvent(new CustomEvent('select', { detail, bubbles: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true }));
  }

  private _syncActiveDom(): void {
    const current = this.value;
    this.root.querySelectorAll<HTMLElement>('.item-button').forEach((button) => {
      const selected = current && button.dataset.value === current;
      if (selected) {
        button.setAttribute('data-active', 'true');
        button.setAttribute('aria-current', 'page');
      } else {
        button.removeAttribute('data-active');
        button.removeAttribute('aria-current');
      }
    });
    // Groups holding the current item: mark them, and open them once for a new value.
    const openForValue = !!current && current !== this._autoExpandedFor && !this.hasAttribute('collapsed');
    if (current && Array.from(this.root.querySelectorAll<HTMLElement>('.item-button')).some((b) => b.dataset.value === current)) {
      this._autoExpandedFor = current;
    }
    this.root.querySelectorAll<HTMLElement>('.item').forEach((item) => {
      const toggle = item.querySelector<HTMLElement>(':scope > .item-button[data-action="toggle"]');
      if (!toggle) return;
      const holds = !!current && Array.from(item.querySelectorAll<HTMLElement>(':scope > .submenu .item-button')).some((b) => b.dataset.value === current);
      if (holds) toggle.setAttribute('data-has-active', 'true');
      else toggle.removeAttribute('data-has-active');
      if (holds && openForValue) this._expanded.add(item.dataset.itemId || '');
    });
    if (openForValue) this._syncExpandedDom();
    this.root.querySelectorAll<HTMLElement>('.rail .item-button[data-action="area"]').forEach((button) => {
      const area = current ? this._areaFor(current) : undefined;
      if (area && area.value === button.dataset.value) button.setAttribute('data-has-active', 'true');
      else button.removeAttribute('data-has-active');
    });
  }

  private _flattenItems(items: NormalizedSidebarItem[]): NormalizedSidebarItem[] {
    return items.flatMap((item) => [item, ...this._flattenItems(item.children)]);
  }

  private _applySizing(): void {
    const size = normalizeSize(this.getAttribute('size'));
    const defaults = DEFAULT_WIDTHS[size];
    const width = parsePx(this.getAttribute('width'), defaults.expanded);
    const min = parsePx(this.getAttribute('min-width'), defaults.min);
    const max = parsePx(this.getAttribute('max-width'), defaults.max);
    const collapsed = parsePx(this.getAttribute('collapsed-width'), defaults.collapsed);
    const restored = this._restoreWidth(width);
    const expandedWidth = Math.min(Math.max(restored, min), max);
    const currentWidth = this.hasAttribute('collapsed') ? collapsed : expandedWidth;
    this.style.setProperty('--ui-sidebar-width', `${expandedWidth}px`);
    this.style.setProperty('--ui-sidebar-min-width', `${min}px`);
    this.style.setProperty('--ui-sidebar-max-width', `${max}px`);
    this.style.setProperty('--ui-sidebar-collapsed-width', `${collapsed}px`);
    this.style.setProperty('--ui-sidebar-current-width', `${currentWidth}px`);
    if (!this._isDual()) this.style.setProperty('inline-size', `${currentWidth}px`);
    else if (this.hasAttribute('collapsed') || this.hasAttribute('data-panel-empty')) this.style.setProperty('inline-size', 'var(--ui-sidebar-rail-width)');
    // Dual: the rail plus the panel (width / min-width / max-width size the panel).
    else this.style.setProperty('inline-size', `calc(var(--ui-sidebar-rail-width) + ${expandedWidth}px)`);
  }

  private _applyRadius(): void {
    const radius = this.getAttribute('radius');
    const itemRadius = this.getAttribute('item-radius');
    if (!radius || ['none', 'sm', 'md', 'lg', 'full'].includes(radius)) {
      this.style.removeProperty('--ui-sidebar-radius');
      if (!itemRadius) this.style.removeProperty('--ui-sidebar-item-radius');
      this.style.removeProperty('--ui-sidebar-promo-radius');
      return;
    }
    const numeric = normalizeRadius(radius) || radius;
    this.style.setProperty('--ui-sidebar-radius', numeric);
    if (!itemRadius) this.style.setProperty('--ui-sidebar-item-radius', numeric);
    this.style.setProperty('--ui-sidebar-promo-radius', numeric);
  }

  private _applyItemMetrics(): void {
    const itemRadius = normalizeRadius(this.getAttribute('item-radius'));
    const itemGap = normalizeMetric(this.getAttribute('item-gap'));
    const rowGap = normalizeMetric(this.getAttribute('row-gap'));
    const itemPaddingX = normalizeMetric(this.getAttribute('item-padding-x'));
    const itemPaddingY = normalizeMetric(this.getAttribute('item-padding-y'));
    const itemHeight = normalizeMetric(this.getAttribute('item-height'));
    const itemFontSize = normalizeMetric(this.getAttribute('item-font-size'));
    const itemLineHeight = normalizeMetric(this.getAttribute('item-line-height'));

    this._setOptionalCssVar('--ui-sidebar-item-radius', itemRadius);
    this._setOptionalCssVar('--ui-sidebar-item-gap', itemGap);
    this._setOptionalCssVar('--ui-sidebar-row-gap', rowGap);
    this._setOptionalCssVar('--ui-sidebar-item-padding-x', itemPaddingX);
    this._setOptionalCssVar('--ui-sidebar-item-padding-y', itemPaddingY);
    this._setOptionalCssVar('--ui-sidebar-item-height', itemHeight);
    this._setOptionalCssVar('--ui-sidebar-item-font-size', itemFontSize);
    this._setOptionalCssVar('--ui-sidebar-item-line-height', itemLineHeight);
  }

  private _setOptionalCssVar(name: string, value: string | null): void {
    if (!value) {
      this.style.removeProperty(name);
      return;
    }
    this.style.setProperty(name, value);
  }

  private _restoreWidth(fallback: number): number {
    if (!this.hasAttribute('auto-save')) return fallback;
    const key = this.getAttribute('storage-key');
    if (!key) return fallback;
    try {
      const stored = window.localStorage.getItem(`ui-sidebar:${key}`);
      if (!stored) return fallback;
      const parsed = Number.parseFloat(stored);
      return Number.isFinite(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  private _persistWidth(width: number): void {
    if (!this.hasAttribute('auto-save')) return;
    const key = this.getAttribute('storage-key');
    if (!key) return;
    try {
      window.localStorage.setItem(`ui-sidebar:${key}`, `${width}`);
    } catch {
      // ignore storage failures
    }
  }

  private _currentExpandedWidth(): number {
    const current = Number.parseFloat(this.style.getPropertyValue('--ui-sidebar-width'));
    if (Number.isFinite(current) && current > 0) return current;
    return parsePx(this.getAttribute('width'), DEFAULT_WIDTHS[normalizeSize(this.getAttribute('size'))].expanded);
  }

  private _bindResponsiveCollapse(): void {
    this._responsiveCleanup?.();
    this._responsiveCleanup = null;
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(max-width: 767px)');
    const sync = () => this._syncResponsiveCollapse(media.matches);
    if (typeof media.addEventListener === 'function') media.addEventListener('change', sync);
    else if (typeof media.addListener === 'function') media.addListener(sync);
    this._responsiveCleanup = () => {
      if (typeof media.removeEventListener === 'function') media.removeEventListener('change', sync);
      else if (typeof media.removeListener === 'function') media.removeListener(sync);
    };
    sync();
  }

  private _syncResponsiveCollapse(isSmall: boolean): void {
    if (!this.hasAttribute('collapsible')) return;
    if (isSmall) {
      if (!this.hasAttribute('collapsed') && !this._userCollapsePreference) {
        this._responsiveAutoCollapsed = true;
        this._lastExpandedWidth = this._currentExpandedWidth();
        this.setAttribute('collapsed', '');
        this.dispatchEvent(new CustomEvent('toggle', { detail: { collapsed: true, source: 'responsive' }, bubbles: true }));
        this.dispatchEvent(new CustomEvent('collapse-change', { detail: { collapsed: true, source: 'responsive' }, bubbles: true }));
      }
      return;
    }
    if (this._responsiveAutoCollapsed && !this._userCollapsePreference) {
      this._responsiveAutoCollapsed = false;
      if (this.hasAttribute('collapsed')) {
        this.removeAttribute('collapsed');
        this.dispatchEvent(new CustomEvent('toggle', { detail: { collapsed: false, source: 'responsive' }, bubbles: true }));
        this.dispatchEvent(new CustomEvent('collapse-change', { detail: { collapsed: false, source: 'responsive' }, bubbles: true }));
      }
    }
  }

  private _emitWidthChange(source: string): void {
    const detail = {
      width: parsePx(this.style.getPropertyValue('--ui-sidebar-width'), 0),
      collapsedWidth: parsePx(this.style.getPropertyValue('--ui-sidebar-collapsed-width'), 0),
      minWidth: parsePx(this.style.getPropertyValue('--ui-sidebar-min-width'), 0),
      maxWidth: parsePx(this.style.getPropertyValue('--ui-sidebar-max-width'), 0),
      source
    };
    this.dispatchEvent(new CustomEvent('width-change', { detail, bubbles: true }));
  }

  private _handleResizeKey(event: KeyboardEvent): void {
    const isRight = this.getAttribute('position') === 'right';
    const direction = isRight ? -1 : 1;
    const width = this._currentExpandedWidth();
    const min = parsePx(this.style.getPropertyValue('--ui-sidebar-min-width'), width);
    const max = parsePx(this.style.getPropertyValue('--ui-sidebar-max-width'), width);
    let next = width;
    if (event.key === 'ArrowRight') next = width + 16 * direction;
    else if (event.key === 'ArrowLeft') next = width - 16 * direction;
    else if (event.key === 'Home') next = min;
    else if (event.key === 'End') next = max;
    else return;
    event.preventDefault();
    next = Math.min(Math.max(next, min), max);
    this.style.setProperty('--ui-sidebar-width', `${next}px`);
    if (!this.hasAttribute('collapsed')) {
      this.style.setProperty('--ui-sidebar-current-width', `${next}px`);
      this.style.setProperty('inline-size', this._isDual() ? `calc(var(--ui-sidebar-rail-width) + ${next}px)` : `${next}px`);
    }
    this._persistWidth(next);
    this._emitWidthChange('keyboard');
  }

  private _startResize(event: PointerEvent): void {
    if (!this.hasAttribute('resizable')) return;
    event.preventDefault();
    const isRight = this.getAttribute('position') === 'right';
    const startX = event.clientX;
    const startWidth = this._currentExpandedWidth();
    const min = parsePx(this.style.getPropertyValue('--ui-sidebar-min-width'), startWidth);
    const max = parsePx(this.style.getPropertyValue('--ui-sidebar-max-width'), startWidth);
    this._dragging = true;
    this.dispatchEvent(new CustomEvent('resize-start', { detail: { width: startWidth }, bubbles: true }));

    const move = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX;
      const width = isRight ? startWidth - delta : startWidth + delta;
      const next = Math.min(Math.max(width, min), max);
      this.style.setProperty('--ui-sidebar-width', `${next}px`);
      if (!this.hasAttribute('collapsed')) {
        this.style.setProperty('--ui-sidebar-current-width', `${next}px`);
        this.style.setProperty('inline-size', this._isDual() ? `calc(var(--ui-sidebar-rail-width) + ${next}px)` : `${next}px`);
      }
      this.dispatchEvent(new CustomEvent('resize', { detail: { width: next }, bubbles: true }));
    };

    const up = () => {
      if (!this._dragging) return;
      this._dragging = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      const width = this._currentExpandedWidth();
      this._persistWidth(width);
      this._emitWidthChange('pointer');
      this.dispatchEvent(new CustomEvent('resize-end', { detail: { width }, bubbles: true }));
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    this._resizeCleanup = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-sidebar')) {
  customElements.define('ui-sidebar', UISidebar);
}

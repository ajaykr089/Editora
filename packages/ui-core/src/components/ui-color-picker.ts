import { ElementBase } from '../ElementBase'
import {
  computePopoverPosition,
  eventOriginatesWithin,
  isTruthyAttr,
  lockBodyScroll,
  rafThrottle,
  shouldUseMobileSheet
} from './date-time-utils'
import {
  formatHexDisplay,
  formatHslDisplay,
  formatRgbDisplay,
  HSLA,
  HSVA,
  hslaToRgba,
  normalizeRgba,
  parseColor,
  RGBA,
  rgbaToHsla,
  rgbaToHsva,
  hsvaToRgba
} from './color-utils'

/**
 * ui-color-picker
 *
 * attributes:
 * - value, format(hex|rgb|hsl), alpha, disabled, readonly, size(sm|md|lg), variant(default|contrast)
 * - state(idle|loading|error|success), tone(neutral|brand|success|warning|danger), close-on-escape
 * - mode(inline|popover), open, placeholder, presets(JSON array), recent, max-recent, persist
 * - aria-label, aria-labelledby, aria-describedby
 *
 * methods:
 * - setColor(value), getColor(), openPopover(), closePopover(), focus()
 *
 * events:
 * - input / change: { value, hex, rgba, hsla, source }
 * - invalid: { raw, reason }
 * - open / close / ui-open / ui-close: { open, previousOpen, source }
 */

type ColorFormat = 'hex' | 'rgb' | 'hsl'
type ColorSource = 'drag' | 'slider' | 'text' | 'preset' | 'recent' | 'eyedropper'
type DragTarget = 'sv' | 'hue' | 'alpha'
type ColorPickerState = 'idle' | 'loading' | 'error' | 'success'
type ColorPickerTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'
type OpenSource = 'api' | 'toggle' | 'outside' | 'escape' | 'apply' | 'attribute'

type ColorDetail = {
  value: string
  hex: string
  rgba: RGBA
  hsla: HSLA
  source: ColorSource
}

type OpenDetail = {
  open: boolean
  previousOpen: boolean
  source: OpenSource
}

type PanelRefs = {
  panel: HTMLElement
  label: HTMLElement | null
  valueText: HTMLElement | null
  preview: HTMLElement | null
  status: HTMLElement | null
  sv: HTMLElement | null
  svThumb: HTMLElement | null
  hue: HTMLElement | null
  hueThumb: HTMLElement | null
  alphaRow: HTMLElement | null
  alpha: HTMLElement | null
  alphaThumb: HTMLElement | null
  tabHex: HTMLButtonElement | null
  tabRgb: HTMLButtonElement | null
  tabHsl: HTMLButtonElement | null
  groupHex: HTMLElement | null
  groupRgb: HTMLElement | null
  groupHsl: HTMLElement | null
  inputHex: HTMLInputElement | null
  inputR: HTMLInputElement | null
  inputG: HTMLInputElement | null
  inputB: HTMLInputElement | null
  inputA1: HTMLInputElement | null
  inputH: HTMLInputElement | null
  inputS: HTMLInputElement | null
  inputL: HTMLInputElement | null
  inputA2: HTMLInputElement | null
  copyHex: HTMLButtonElement | null
  copyRgb: HTMLButtonElement | null
  eyedropper: HTMLButtonElement | null
  clear: HTMLButtonElement | null
  apply: HTMLButtonElement | null
  presets: HTMLElement | null
  recent: HTMLElement | null
  recentTitle: HTMLElement | null
  error: HTMLElement | null
  live: HTMLElement | null
}

const DEFAULT_COLOR = '#2563eb'
const RECENT_STORAGE_KEY = 'editora:ui-color-picker:recent'
const CHEVRON_ICON = `
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="m5.6 7.6 4.4 4.6 4.4-4.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`

const style = `
  :host {
    --ui-cp-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-cp-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-cp-text: var(--ui-color-text, #0f172a);
    --ui-cp-muted: var(--ui-color-muted, #64748b);
    --ui-cp-accent: var(--ui-color-primary, #2563eb);
    --ui-cp-success: var(--ui-color-success, #16a34a);
    --ui-cp-warning: var(--ui-color-warning, #d97706);
    --ui-cp-danger: var(--ui-color-danger, #dc2626);
    --ui-cp-radius: 14px;
    --ui-cp-shadow: none;
    --ui-cp-padding: 10px;
    --ui-cp-duration: 160ms;
    --ui-cp-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
    --ui-cp-z: 1600;
    --ui-cp-thumb: #ffffff;
    --ui-cp-thumb-ring: color-mix(in srgb, var(--ui-cp-accent) 44%, transparent);
    --ui-cp-checker-a: #e2e8f0;
    --ui-cp-checker-b: #f8fafc;
    --ui-cp-swatch-size: 22px;
    --ui-cp-gap: 8px;
    color-scheme: light dark;
    display: inline-block;
    min-inline-size: min(260px, 100%);
    inline-size: min(100%, var(--ui-width, 312px));
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-cp-text);
  }

  :host([size="sm"]) {
    --ui-cp-padding: 8px;
    --ui-cp-gap: 7px;
    --ui-cp-swatch-size: 20px;
  }

  :host([size="lg"]) {
    --ui-cp-padding: 12px;
    --ui-cp-gap: 10px;
    --ui-cp-swatch-size: 24px;
  }

  :host([variant="contrast"]) {
    --ui-cp-bg: #0f172a;
    --ui-cp-border: #334155;
    --ui-cp-text: #e2e8f0;
    --ui-cp-muted: #93a4bd;
    --ui-cp-accent: #93c5fd;
    --ui-cp-checker-a: #475569;
    --ui-cp-checker-b: #334155;
    --ui-cp-shadow: 0 18px 40px rgba(2, 6, 23, 0.55);
  }

  :host([tone="neutral"]) {
    --ui-cp-accent: color-mix(in srgb, var(--ui-cp-text) 38%, var(--ui-cp-muted) 62%);
  }

  :host([tone="success"]) {
    --ui-cp-accent: var(--ui-cp-success);
  }

  :host([tone="warning"]) {
    --ui-cp-accent: var(--ui-cp-warning);
  }

  :host([tone="danger"]) {
    --ui-cp-accent: var(--ui-cp-danger);
  }

  :host([state="error"]) {
    --ui-cp-accent: var(--ui-cp-danger);
  }

  :host([state="success"]) {
    --ui-cp-accent: var(--ui-cp-success);
  }

  .root {
    display: grid;
    gap: 8px;
  }

  .trigger-wrap[hidden] {
    display: none;
  }

  .trigger {
    inline-size: 100%;
    min-block-size: 38px;
    border-radius: calc(var(--ui-cp-radius) - 2px);
    border: 1px solid var(--ui-cp-border);
    background: var(--ui-cp-bg);
    color: var(--ui-cp-text);
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.08);
    padding: 0 10px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 8px;
    text-align: left;
    cursor: pointer;
    transition:
      border-color var(--ui-cp-duration) var(--ui-cp-ease),
      background-color var(--ui-cp-duration) var(--ui-cp-ease),
      box-shadow var(--ui-cp-duration) var(--ui-cp-ease),
      color var(--ui-cp-duration) var(--ui-cp-ease);
  }

  .trigger:hover {
    border-color: color-mix(in srgb, var(--ui-cp-accent) 32%, var(--ui-cp-border));
    box-shadow: 0 2px 8px rgba(2, 6, 23, 0.12);
  }

  .trigger:active {
    transform: translateY(1px);
  }

  .trigger:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-cp-accent) 64%, transparent);
    outline-offset: 1px;
  }

  .trigger[disabled] {
    cursor: not-allowed;
    opacity: 0.62;
  }

  .trigger-preview {
    inline-size: 16px;
    block-size: 16px;
    border-radius: 6px;
    border: 1px solid color-mix(in srgb, var(--ui-cp-border) 88%, transparent);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);
    background: #2563eb;
  }

  .trigger-value {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font: 600 12px/1.2 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .trigger-chevron {
    inline-size: 14px;
    block-size: 14px;
    display: inline-grid;
    place-items: center;
    color: color-mix(in srgb, var(--ui-cp-text) 70%, transparent);
  }

  .trigger-chevron svg {
    inline-size: 14px;
    block-size: 14px;
    pointer-events: none;
  }

  .panel-inline[hidden] {
    display: none !important;
  }

  .panel {
    border: 1px solid var(--ui-cp-border);
    border-radius: var(--ui-cp-radius);
    background: var(--ui-cp-bg);
    box-shadow: var(--ui-cp-shadow);
    padding: var(--ui-cp-padding);
    display: grid;
    gap: var(--ui-cp-gap);
    min-inline-size: 0;
    transition:
      border-color var(--ui-cp-duration) var(--ui-cp-ease),
      box-shadow var(--ui-cp-duration) var(--ui-cp-ease),
      background-color var(--ui-cp-duration) var(--ui-cp-ease),
      opacity var(--ui-cp-duration) var(--ui-cp-ease);
  }

  .panel[data-state="error"] {
    border-color: color-mix(in srgb, var(--ui-cp-danger) 46%, var(--ui-cp-border));
  }

  .panel[data-state="success"] {
    border-color: color-mix(in srgb, var(--ui-cp-success) 42%, var(--ui-cp-border));
  }

  .panel[data-state="loading"] {
    opacity: 0.92;
  }

  .panel,
  .panel * {
    box-sizing: border-box;
  }

  .header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
    align-items: center;
  }

  .heading {
    min-inline-size: 0;
    display: grid;
    gap: 4px;
  }

  .label {
    font: 700 13px/1.2 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-cp-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .value {
    font: 500 11px/1.2 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-cp-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-actions {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .preview {
    inline-size: 20px;
    block-size: 20px;
    border-radius: 6px;
    border: 1px solid color-mix(in srgb, var(--ui-cp-border) 86%, transparent);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.32);
    background: #2563eb;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    min-block-size: 20px;
    border-radius: 999px;
    padding: 0 8px;
    border: 1px solid color-mix(in srgb, var(--ui-cp-accent) 36%, var(--ui-cp-border));
    background: color-mix(in srgb, var(--ui-cp-accent) 12%, transparent);
    color: color-mix(in srgb, var(--ui-cp-accent) 82%, var(--ui-cp-text));
    font: 650 10px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .status-pill[hidden] {
    display: none !important;
  }

  .icon-btn {
    border: 1px solid color-mix(in srgb, var(--ui-cp-border) 84%, transparent);
    background: color-mix(in srgb, var(--ui-cp-bg) 94%, transparent);
    color: var(--ui-cp-text);
    min-inline-size: 32px;
    block-size: 30px;
    border-radius: 9px;
    padding: 0 8px;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    font: 600 11px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    transition:
      border-color var(--ui-cp-duration) var(--ui-cp-ease),
      background-color var(--ui-cp-duration) var(--ui-cp-ease),
      color var(--ui-cp-duration) var(--ui-cp-ease);
  }

  .icon-btn:hover {
    background: color-mix(in srgb, var(--ui-cp-accent) 12%, transparent);
    border-color: color-mix(in srgb, var(--ui-cp-accent) 34%, var(--ui-cp-border));
  }

  .icon-btn:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-cp-accent) 62%, transparent);
    outline-offset: 1px;
  }

  .icon-btn[hidden] {
    display: none !important;
  }

  .icon-btn[disabled] {
    opacity: 0.52;
    cursor: not-allowed;
  }

  .body {
    display: grid;
    gap: 8px;
  }

  .sv {
    position: relative;
    inline-size: 100%;
    block-size: clamp(128px, 16vw, 156px);
    border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--ui-cp-border) 82%, transparent);
    overflow: visible;
    cursor: crosshair;
    touch-action: none;
    background:
      linear-gradient(to top, #000, transparent),
      linear-gradient(to right, #fff, #f00);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-cp-border) 42%, transparent);
  }

  .sv:focus-visible,
  .slider:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-cp-accent) 64%, transparent);
    outline-offset: 1px;
  }

  .thumb {
    position: absolute;
    inline-size: 12px;
    block-size: 12px;
    margin-inline-start: -6px;
    margin-block-start: -6px;
    border-radius: 999px;
    background: var(--ui-cp-thumb);
    border: 2px solid rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 1px rgba(2, 6, 23, 0.35), 0 0 0 4px color-mix(in srgb, var(--ui-cp-thumb-ring) 28%, transparent);
    pointer-events: none;
    transform: translate3d(0, 0, 0);
  }

  .slider {
    position: relative;
    block-size: 12px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--ui-cp-border) 82%, transparent);
    cursor: pointer;
    touch-action: none;
    overflow: visible;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-cp-border) 40%, transparent);
  }

  .slider.hue {
    background: linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
  }

  .slider.alpha {
    background-image:
      linear-gradient(45deg, var(--ui-cp-checker-a) 25%, transparent 25%),
      linear-gradient(-45deg, var(--ui-cp-checker-a) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--ui-cp-checker-a) 75%),
      linear-gradient(-45deg, transparent 75%, var(--ui-cp-checker-a) 75%),
      linear-gradient(to right, transparent, rgba(0, 0, 0, 1));
    background-size: 10px 10px, 10px 10px, 10px 10px, 10px 10px, 100% 100%;
    background-position: 0 0, 0 5px, 5px -5px, -5px 0, 0 0;
    background-color: var(--ui-cp-checker-b);
  }

  .slider-thumb {
    position: absolute;
    inset-block-start: 50%;
    inline-size: 12px;
    block-size: 12px;
    margin-inline-start: -6px;
    margin-block-start: -6px;
    border-radius: 999px;
    background: var(--ui-cp-thumb);
    border: 2px solid rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 1px rgba(2, 6, 23, 0.3);
    pointer-events: none;
  }

  .alpha-row[hidden] {
    display: none !important;
  }

  .footer {
    display: grid;
    gap: 8px;
  }

  .tabs {
    display: inline-grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border: 1px solid color-mix(in srgb, var(--ui-cp-border) 84%, transparent);
    border-radius: 10px;
    overflow: hidden;
  }

  .tab {
    border: 0;
    background: transparent;
    color: var(--ui-cp-muted);
    min-block-size: 30px;
    font: 650 11px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
    transition:
      background-color var(--ui-cp-duration) var(--ui-cp-ease),
      color var(--ui-cp-duration) var(--ui-cp-ease);
  }

  .tab[data-active="true"] {
    background: color-mix(in srgb, var(--ui-cp-accent) 15%, transparent);
    color: var(--ui-cp-text);
  }

  .tab:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-cp-accent) 64%, transparent);
    outline-offset: -2px;
  }

  .group {
    display: grid;
    gap: 8px;
    min-inline-size: 0;
  }

  .group[hidden] {
    display: none !important;
  }

  .input-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
    gap: 6px;
  }

  .input-row[data-fields="3"] {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }

  .field {
    display: grid;
    gap: 4px;
    min-inline-size: 0;
  }

  .field > span {
    font: 600 10px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-cp-muted);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .input {
    min-inline-size: 0;
    inline-size: 100%;
    min-block-size: 28px;
    border-radius: 8px;
    border: 1px solid color-mix(in srgb, var(--ui-cp-border) 86%, transparent);
    background: color-mix(in srgb, var(--ui-cp-bg) 95%, transparent);
    color: var(--ui-cp-text);
    font: 600 11px/1.1 "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace;
    padding: 0 7px;
    max-inline-size: 100%;
    overflow: hidden;
  }

  .input:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-cp-accent) 64%, transparent);
    outline-offset: 1px;
  }

  .swatches-wrap {
    display: grid;
    gap: 6px;
  }

  .swatches-title {
    font: 600 10px/1.2 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-cp-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .swatch {
    inline-size: var(--ui-cp-swatch-size);
    block-size: var(--ui-cp-swatch-size);
    border-radius: 8px;
    border: 1px solid color-mix(in srgb, var(--ui-cp-border) 84%, transparent);
    background: #2563eb;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.32);
    padding: 0;
    transition:
      transform var(--ui-cp-duration) var(--ui-cp-ease),
      box-shadow var(--ui-cp-duration) var(--ui-cp-ease),
      border-color var(--ui-cp-duration) var(--ui-cp-ease);
  }

  .swatch:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--ui-cp-accent) 40%, var(--ui-cp-border));
    box-shadow: 0 2px 8px rgba(2, 6, 23, 0.18);
  }

  .swatch[data-selected="true"] {
    outline: 2px solid color-mix(in srgb, var(--ui-cp-accent) 72%, transparent);
    outline-offset: 1px;
  }

  .swatch:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-cp-accent) 64%, transparent);
    outline-offset: 1px;
  }

  .error {
    min-block-size: 16px;
    color: var(--ui-color-danger, #dc2626);
    font: 500 11px/1.2 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .error[hidden] {
    display: none !important;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
  }

  .actions .btn {
    min-block-size: 28px;
    border-radius: 9px;
    border: 1px solid color-mix(in srgb, var(--ui-cp-border) 84%, transparent);
    background: color-mix(in srgb, var(--ui-cp-bg) 95%, transparent);
    color: var(--ui-cp-text);
    font: 650 12px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: 0 10px;
    cursor: pointer;
    transition:
      border-color var(--ui-cp-duration) var(--ui-cp-ease),
      background-color var(--ui-cp-duration) var(--ui-cp-ease),
      color var(--ui-cp-duration) var(--ui-cp-ease);
  }

  .actions .btn[data-tone="primary"] {
    border-color: color-mix(in srgb, var(--ui-cp-accent) 62%, transparent);
    background: color-mix(in srgb, var(--ui-cp-accent) 18%, transparent);
  }

  .actions .btn[hidden] {
    display: none !important;
  }

  .live {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    border: 0;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }

  :host([disabled]) .panel,
  :host([disabled]) .trigger,
  :host([state="loading"]) .panel,
  :host([state="loading"]) .trigger {
    opacity: 0.66;
    pointer-events: none;
  }

  @media (max-width: 440px) {
    .sv {
      block-size: 132px;
    }

    .input-row,
    .input-row[data-fields="3"] {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .icon-btn,
    .tab,
    .panel,
    .trigger {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .panel,
    .trigger,
    .icon-btn,
    .tab,
    .input,
    .swatch,
    .actions .btn {
      border-width: 2px;
      box-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-cp-bg: Canvas;
      --ui-cp-border: CanvasText;
      --ui-cp-text: CanvasText;
      --ui-cp-muted: CanvasText;
      --ui-cp-accent: Highlight;
      --ui-cp-shadow: none;
      --ui-cp-thumb: Canvas;
    }

    .panel,
    .trigger,
    .icon-btn,
    .tab,
    .input,
    .swatch,
    .actions .btn,
    .preview,
    .trigger-preview,
    .sv,
    .slider {
      forced-color-adjust: none;
      background: Canvas;
      border-color: CanvasText;
      color: CanvasText;
      box-shadow: none;
    }

    .tab[data-active="true"],
    .actions .btn[data-tone="primary"] {
      background: Highlight;
      color: HighlightText;
      border-color: Highlight;
    }
  }
`

const overlayStyle = `
  .overlay {
    position: fixed;
    inset: 0;
    z-index: var(--ui-cp-z, 1600);
    pointer-events: none;
  }

  .popover-shell {
    position: absolute;
    pointer-events: auto;
    inline-size: min(320px, calc(100vw - 16px));
  }

  .sheet-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.52);
    pointer-events: auto;
  }

  .sheet-shell {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
    pointer-events: auto;
    padding: 8px;
  }

  .sheet-shell .panel {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    inline-size: min(100%, 520px);
    margin: 0 auto;
    max-block-size: min(84vh, 680px);
    overflow: auto;
  }
`

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function approximately(a: number, b: number): boolean {
  return Math.abs(a - b) <= 0.0005
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export class UIColorPicker extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'format',
      'alpha',
      'disabled',
      'readonly',
      'size',
      'variant',
      'state',
      'tone',
      'mode',
      'open',
      'close-on-escape',
      'placeholder',
      'presets',
      'recent',
      'max-recent',
      'persist',
      'aria-label',
      'aria-labelledby',
      'aria-describedby'
    ]
  }

  private _syncing = false
  private _initialized = false
  private _rgba: RGBA = normalizeRgba(parseColor(DEFAULT_COLOR) || { r: 37, g: 99, b: 235, a: 1 })
  private _hsva: HSVA = rgbaToHsva(this._rgba)
  private _format: ColorFormat = 'hex'
  private _open = false
  private _error = ''
  private _presets: string[] = []
  private _recentColors: string[] = []
  private _panelCache = new WeakMap<HTMLElement, PanelRefs>()
  private _overlay: HTMLDivElement | null = null
  private _overlayRoot: ShadowRoot | null = null
  private _releaseScrollLock: (() => void) | null = null
  private _restoreFocusEl: HTMLElement | null = null
  private _isSheetOpen = false
  private _dragTarget: DragTarget | null = null
  private _dragPointerId = -1
  private _dragRect: DOMRect | null = null
  private _dragX = 0
  private _dragY = 0
  private _dragRaf = 0
  private _dragChanged = false
  private _dragSource: ColorSource = 'drag'
  private _renderingSwatches = false

  private _scheduleOverlayPosition = rafThrottle(() => this._positionOverlay())

  private readonly _onRootClickBound = (event: Event) => this._onPanelClick(event, 'root')
  private readonly _onRootInputBound = (event: Event) => this._onPanelInput(event, 'root')
  private readonly _onRootChangeBound = (event: Event) => this._onPanelChange(event, 'root')
  private readonly _onRootKeyDownBound = (event: KeyboardEvent) => this._onPanelKeyDown(event, 'root')
  private readonly _onRootPointerDownBound = (event: PointerEvent) => this._onPanelPointerDown(event, 'root')
  private readonly _onRootPointerMoveBound = (event: PointerEvent) => this._onPanelPointerMove(event)
  private readonly _onRootPointerUpBound = (event: PointerEvent) => this._onPanelPointerUp(event)
  private readonly _onRootPointerCancelBound = (event: PointerEvent) => this._onPanelPointerCancel(event)
  private readonly _onDocumentPointerDownBound = (event: PointerEvent) => this._onDocumentPointerDown(event)
  private readonly _onDocumentKeyDownBound = (event: KeyboardEvent) => this._onDocumentKeyDown(event)
  private readonly _onWindowResizeBound = () => this._scheduleOverlayPosition.run()
  private readonly _onWindowScrollBound = (event: Event) => {
    if (eventOriginatesWithin(event, [this._overlay])) return
    this._scheduleOverlayPosition.run()
  }

  constructor() {
    super()
    this._applyValueAttribute(false)
    this._applyFormatAttribute()
    this._open = this.hasAttribute('open')
    this._parsePresetsAttribute()
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this._bindRootEvents()
    this._loadRecent()
    if (!this._isPopoverMode() && this._open) {
      this._open = false
      this._syncOpenAttribute(false)
    }
  }

  override disconnectedCallback(): void {
    this._cancelDragFrame()
    this._stopDrag(false)
    this._destroyOverlay()
    this.root.removeEventListener('click', this._onRootClickBound)
    this.root.removeEventListener('input', this._onRootInputBound)
    this.root.removeEventListener('change', this._onRootChangeBound)
    this.root.removeEventListener('keydown', this._onRootKeyDownBound as EventListener)
    this.root.removeEventListener('pointerdown', this._onRootPointerDownBound as EventListener)
    this.root.removeEventListener('pointermove', this._onRootPointerMoveBound as EventListener)
    this.root.removeEventListener('pointerup', this._onRootPointerUpBound as EventListener)
    this.root.removeEventListener('pointercancel', this._onRootPointerCancelBound as EventListener)
    super.disconnectedCallback()
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return
    switch (name) {
      case 'value':
        if (!this._syncing) this._applyValueAttribute(true)
        break
      case 'format':
        this._applyFormatAttribute()
        break
      case 'presets':
        this._parsePresetsAttribute()
        break
      case 'open':
        if (!this._syncing) this._open = this.hasAttribute('open')
        break
      case 'disabled':
      case 'state':
        if ((this.hasAttribute('disabled') || this._isLoading()) && this._open) this._setOpen(false, 'attribute')
        break
      case 'alpha': {
        if (!this._alphaEnabled()) {
          this._rgba = normalizeRgba({ ...this._rgba, a: 1 })
          this._hsva = { ...this._hsva, a: 1 }
          this._syncValueAttribute()
        }
        break
      }
      default:
        break
    }

    if (!this.isConnected) return
    this.requestRender()
  }

  get value(): string {
    return this.getAttribute('value') || this._serializeValue()
  }

  set value(next: string) {
    this.setColor(next)
  }

  get format(): ColorFormat {
    return this._format
  }

  set format(next: ColorFormat) {
    this.setAttribute('format', next)
  }

  get alpha(): boolean {
    return this._alphaEnabled()
  }

  set alpha(next: boolean) {
    if (next) this.setAttribute('alpha', '')
    else this.removeAttribute('alpha')
  }

  get open(): boolean {
    return this._open
  }

  set open(next: boolean) {
    this._setOpen(next, 'api')
  }

  setColor(value: string): void {
    const parsed = parseColor(value || '')
    if (!parsed) {
      this._setInvalid(value, 'Invalid color format')
      return
    }
    this._error = ''
    this._applyRgba(parsed, false)
    this._syncValueAttribute()
    this._updateUI(false)
  }

  getColor(): { hex: string; rgba: RGBA; hsva: HSVA } {
    const rgba = normalizeRgba(this._rgba)
    return {
      hex: formatHexDisplay(rgba, this._alphaEnabled()),
      rgba,
      hsva: { ...this._hsva }
    }
  }

  openPopover(): void {
    this._setOpen(true, 'api')
  }

  closePopover(): void {
    this._setOpen(false, 'api')
  }

  override focus(): void {
    const target = this.root.querySelector('.trigger') as HTMLElement | null
    const fallback = this.root.querySelector('[data-cp="sv"]') as HTMLElement | null
    ;(target || fallback || this).focus()
  }

  protected render(): void {
    if (!this._initialized) {
      this._initialized = true
      this.setContent(this._buildTemplate(), { force: true })
    }

    if (!this._isPopoverMode() && this._open) {
      this._open = false
      this._syncOpenAttribute(false)
    }

    if (this._isPopoverMode() && this._open) {
      this._ensureOverlay()
      this._renderOverlayTemplate()
      this._scheduleOverlayPosition.run()
    } else {
      this._destroyOverlay()
    }

    this._updateUI(false)
  }

  private _bindRootEvents(): void {
    this.root.removeEventListener('click', this._onRootClickBound)
    this.root.removeEventListener('input', this._onRootInputBound)
    this.root.removeEventListener('change', this._onRootChangeBound)
    this.root.removeEventListener('keydown', this._onRootKeyDownBound as EventListener)
    this.root.removeEventListener('pointerdown', this._onRootPointerDownBound as EventListener)
    this.root.removeEventListener('pointermove', this._onRootPointerMoveBound as EventListener)
    this.root.removeEventListener('pointerup', this._onRootPointerUpBound as EventListener)
    this.root.removeEventListener('pointercancel', this._onRootPointerCancelBound as EventListener)

    this.root.addEventListener('click', this._onRootClickBound)
    this.root.addEventListener('input', this._onRootInputBound)
    this.root.addEventListener('change', this._onRootChangeBound)
    this.root.addEventListener('keydown', this._onRootKeyDownBound as EventListener)
    this.root.addEventListener('pointerdown', this._onRootPointerDownBound as EventListener)
    this.root.addEventListener('pointermove', this._onRootPointerMoveBound as EventListener)
    this.root.addEventListener('pointerup', this._onRootPointerUpBound as EventListener)
    this.root.addEventListener('pointercancel', this._onRootPointerCancelBound as EventListener)
  }

  private _eventHTMLElement(event: Event): HTMLElement | null {
    const path = typeof event.composedPath === 'function' ? event.composedPath() : []
    for (const item of path) {
      if (item instanceof HTMLElement) return item
    }
    const target = event.target
    return target instanceof HTMLElement ? target : null
  }

  private _buildTemplate(): string {
    return `
      <style>${style}</style>
      <section class="root">
        <div class="trigger-wrap" data-role="trigger-wrap">
          <button
            type="button"
            class="trigger"
            data-action="toggle-popover"
            part="frame preview"
            aria-haspopup="dialog"
            aria-expanded="false"
          >
            <span class="trigger-preview" data-role="trigger-preview"></span>
            <span class="trigger-value" data-role="trigger-value"></span>
            <span class="trigger-chevron" aria-hidden="true">${CHEVRON_ICON}</span>
          </button>
        </div>
        <div class="panel-inline" data-role="inline-panel" part="popover">
          ${this._panelMarkup('inline')}
        </div>
      </section>
    `
  }

  private _panelMarkup(scope: 'inline' | 'overlay'): string {
    return `
      <section class="panel" data-cp-panel="${scope}" part="frame popover">
        <header class="header" part="header">
          <div class="heading">
            <span class="label" part="title" data-role="label">Color picker</span>
            <span class="value" part="description" data-role="value"></span>
          </div>
          <div class="header-actions">
            <span class="preview" data-role="preview" part="preview"></span>
            <span class="status-pill" data-role="status" part="status" hidden></span>
            <button type="button" class="icon-btn" data-action="copy-hex" part="copy" title="Copy HEX">HEX</button>
            <button type="button" class="icon-btn" data-action="copy-rgb" part="copy" title="Copy RGB">RGB</button>
            <button type="button" class="icon-btn" data-action="eyedropper" part="copy" title="Eyedropper">Pick</button>
          </div>
        </header>

        <div class="body" part="body">
          <div class="sv" part="sv" data-cp="sv" role="slider" tabindex="0" aria-label="Saturation and value">
            <span class="thumb" data-role="sv-thumb"></span>
          </div>
          <div class="slider hue" part="hue" data-cp="hue" role="slider" tabindex="0" aria-label="Hue">
            <span class="slider-thumb" data-role="hue-thumb"></span>
          </div>
          <div class="alpha-row" data-role="alpha-row">
            <div class="slider alpha" part="alpha" data-cp="alpha" role="slider" tabindex="0" aria-label="Alpha">
              <span class="slider-thumb" data-role="alpha-thumb"></span>
            </div>
          </div>
        </div>

        <footer class="footer" part="footer">
          <div class="tabs" part="tabs">
            <button type="button" class="tab" data-action="format" data-format="hex">HEX</button>
            <button type="button" class="tab" data-action="format" data-format="rgb">RGB</button>
            <button type="button" class="tab" data-action="format" data-format="hsl">HSL</button>
          </div>

          <div class="group" data-format-group="hex">
            <div class="field">
              <span>Value</span>
              <input class="input" data-input="hex" part="input" spellcheck="false" autocomplete="off" />
            </div>
          </div>

          <div class="group" data-format-group="rgb" hidden>
            <div class="input-row" data-fields="4">
              <label class="field"><span>R</span><input class="input" data-input="r" type="number" part="input" min="0" max="255" /></label>
              <label class="field"><span>G</span><input class="input" data-input="g" type="number" part="input" min="0" max="255" /></label>
              <label class="field"><span>B</span><input class="input" data-input="b" type="number" part="input" min="0" max="255" /></label>
              <label class="field"><span>A</span><input class="input" data-input="a1" type="number" part="input" min="0" max="1" step="0.01" /></label>
            </div>
          </div>

          <div class="group" data-format-group="hsl" hidden>
            <div class="input-row" data-fields="4">
              <label class="field"><span>H</span><input class="input" data-input="h" type="number" part="input" min="0" max="360" /></label>
              <label class="field"><span>S</span><input class="input" data-input="s" type="number" part="input" min="0" max="100" /></label>
              <label class="field"><span>L</span><input class="input" data-input="l" type="number" part="input" min="0" max="100" /></label>
              <label class="field"><span>A</span><input class="input" data-input="a2" type="number" part="input" min="0" max="1" step="0.01" /></label>
            </div>
          </div>

          <div class="swatches-wrap">
            <div class="swatches-title">Presets</div>
            <div class="swatches" data-role="presets" part="swatches"></div>
            <div class="swatches-title" data-role="recent-title" part="recent">Recent</div>
            <div class="swatches" data-role="recent" part="recent"></div>
          </div>

          <div class="error" data-role="error" part="error" hidden></div>

          <div class="actions">
            <button type="button" class="btn" data-action="clear" part="clear">Clear</button>
            <button type="button" class="btn" data-tone="primary" data-action="apply" part="apply">Done</button>
          </div>
        </footer>

        <div class="live" data-role="live" aria-live="polite"></div>
      </section>
    `
  }

  private _renderOverlayTemplate(): void {
    if (!this._overlay || !this._overlayRoot) return
    this._syncOverlayHostAttributes()
    const sheet = this._isMobileSheet()
    const marker = sheet ? 'sheet' : 'popover'
    if (this._overlay.dataset.mode === marker) return
    this._overlay.dataset.mode = marker
    this._overlayRoot.innerHTML = `
      <style>${style}${overlayStyle}</style>
      <section class="overlay">
        ${sheet ? '<div class="sheet-backdrop" data-action="close-popover"></div>' : ''}
        <div class="${sheet ? 'sheet-shell' : 'popover-shell'}">
          ${this._panelMarkup('overlay')}
        </div>
      </section>
    `
    if (sheet && !this._isSheetOpen) {
      this._isSheetOpen = true
      this._releaseScrollLock = lockBodyScroll()
    }
    if (!sheet && this._isSheetOpen) {
      this._isSheetOpen = false
      if (this._releaseScrollLock) {
        this._releaseScrollLock()
        this._releaseScrollLock = null
      }
    }
  }

  private _isPopoverMode(): boolean {
    return (this.getAttribute('mode') || 'inline') === 'popover'
  }

  private _state(): ColorPickerState {
    const raw = (this.getAttribute('state') || 'idle').trim().toLowerCase()
    if (raw === 'loading' || raw === 'error' || raw === 'success') return raw
    return 'idle'
  }

  private _tone(): ColorPickerTone {
    const raw = (this.getAttribute('tone') || 'brand').trim().toLowerCase()
    if (raw === 'neutral' || raw === 'success' || raw === 'warning' || raw === 'danger') return raw
    return 'brand'
  }

  private _closeOnEscape(): boolean {
    return isTruthyAttr(this.getAttribute('close-on-escape'), true)
  }

  private _syncOverlayHostAttributes(): void {
    if (!this._overlay) return
    const sync = (name: string) => {
      const value = this.getAttribute(name)
      if (value == null) this._overlay!.removeAttribute(name)
      else this._overlay!.setAttribute(name, value)
    }
    const syncBool = (name: string) => {
      if (this.hasAttribute(name)) this._overlay!.setAttribute(name, '')
      else this._overlay!.removeAttribute(name)
    }
    sync('size')
    sync('variant')
    sync('state')
    sync('tone')
    sync('close-on-escape')
    sync('aria-label')
    sync('aria-labelledby')
    sync('aria-describedby')
    syncBool('disabled')
    syncBool('readonly')
  }

  private _isMobileSheet(): boolean {
    return shouldUseMobileSheet(this.getAttribute('mode') || 'inline')
  }

  private _alphaEnabled(): boolean {
    return isTruthyAttr(this.getAttribute('alpha'), false)
  }

  private _recentEnabled(): boolean {
    return isTruthyAttr(this.getAttribute('recent'), true)
  }

  private _persistRecent(): boolean {
    return isTruthyAttr(this.getAttribute('persist'), false)
  }

  private _isDisabled(): boolean {
    return this.hasAttribute('disabled')
  }

  private _isReadonly(): boolean {
    return this.hasAttribute('readonly')
  }

  private _isLoading(): boolean {
    return this._state() === 'loading'
  }

  private _maxRecent(): number {
    const parsed = Number(this.getAttribute('max-recent') || 8)
    if (!Number.isFinite(parsed) || parsed < 1) return 8
    return Math.max(1, Math.min(24, Math.trunc(parsed)))
  }

  private _labelText(): string {
    return this.getAttribute('aria-label') || 'Color picker'
  }

  private _placeholder(): string {
    return this.getAttribute('placeholder') || 'Select color'
  }

  private _applyFormatAttribute(): void {
    const raw = (this.getAttribute('format') || 'hex').trim().toLowerCase()
    if (raw === 'rgb' || raw === 'hsl' || raw === 'hex') {
      this._format = raw
      return
    }
    this._format = 'hex'
  }

  private _applyValueAttribute(emitInvalid: boolean): void {
    const raw = this.getAttribute('value')
    if (!raw) {
      this._applyRgba(parseColor(DEFAULT_COLOR) || this._rgba, false)
      return
    }
    const parsed = parseColor(raw)
    if (!parsed) {
      if (emitInvalid) this._setInvalid(raw, 'Unable to parse color value')
      return
    }
    this._error = ''
    this._applyRgba(parsed, false)
  }

  private _parsePresetsAttribute(): void {
    const raw = this.getAttribute('presets')
    if (!raw) {
      this._presets = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0ea5e9']
      return
    }
    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) {
        this._presets = []
        return
      }
      const result: string[] = []
      for (const item of parsed) {
        if (typeof item !== 'string') continue
        const color = parseColor(item)
        if (!color) continue
        const normalized = formatHexDisplay(this._normalizeByAlpha(color), this._alphaEnabled())
        if (!result.includes(normalized)) result.push(normalized)
      }
      this._presets = result
    } catch {
      this._presets = []
    }
  }

  private _loadRecent(): void {
    if (!this._recentEnabled()) {
      this._recentColors = []
      return
    }
    if (!this._persistRecent() || typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(RECENT_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return
      this._recentColors = parsed
        .filter((item): item is string => typeof item === 'string')
        .map((item) => parseColor(item))
        .filter((item): item is RGBA => !!item)
        .map((item) => formatHexDisplay(this._normalizeByAlpha(item), this._alphaEnabled()))
        .slice(0, this._maxRecent())
    } catch {
      this._recentColors = []
    }
  }

  private _persistRecentColors(): void {
    if (!this._persistRecent() || typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(this._recentColors))
    } catch {
      // ignore storage errors
    }
  }

  private _normalizeByAlpha(rgba: RGBA): RGBA {
    if (!this._alphaEnabled()) return normalizeRgba({ ...rgba, a: 1 })
    return normalizeRgba(rgba)
  }

  private _applyRgba(next: RGBA, keepHueForGray: boolean): void {
    const normalized = this._normalizeByAlpha(next)
    const hsva = rgbaToHsva(normalized)
    if (keepHueForGray && hsva.s === 0) hsva.h = this._hsva.h
    this._rgba = normalized
    this._hsva = {
      h: clamp(hsva.h, 0, 360),
      s: clamp(hsva.s, 0, 100),
      v: clamp(hsva.v, 0, 100),
      a: clamp(hsva.a, 0, 1)
    }
  }

  private _serializeValue(format: ColorFormat = this._format): string {
    if (format === 'rgb') return formatRgbDisplay(this._rgba, this._alphaEnabled())
    if (format === 'hsl') return formatHslDisplay(this._rgba, this._alphaEnabled())
    return formatHexDisplay(this._rgba, this._alphaEnabled())
  }

  private _currentHex(): string {
    return formatHexDisplay(this._rgba, this._alphaEnabled())
  }

  private _eventDetail(source: ColorSource): ColorDetail {
    return {
      value: this._serializeValue(),
      hex: this._currentHex(),
      rgba: { ...this._rgba },
      hsla: rgbaToHsla(this._rgba),
      source
    }
  }

  private _emitInput(source: ColorSource): void {
    this.dispatchEvent(new CustomEvent<ColorDetail>('input', { detail: this._eventDetail(source), bubbles: true, composed: true }))
  }

  private _emitChange(source: ColorSource): void {
    this.dispatchEvent(new CustomEvent<ColorDetail>('change', { detail: this._eventDetail(source), bubbles: true, composed: true }))
    this._announce(this._serializeValue())
  }

  private _setInvalid(raw: string, reason: string): void {
    this._error = reason
    this.dispatchEvent(
      new CustomEvent<{ raw: string; reason: string }>('invalid', {
        detail: { raw, reason },
        bubbles: true,
        composed: true
      })
    )
    this._updateUI(false)
  }

  private _announce(message: string): void {
    this._forEachPanel((refs) => {
      if (refs.live) refs.live.textContent = `Color changed to ${message}`
    })
  }

  private _setOpen(next: boolean, source: OpenSource = 'api'): void {
    if (!this._isPopoverMode()) return
    if (next && (this._isDisabled() || this._isLoading())) return
    if (this._open === next) return
    const previousOpen = this._open
    this._open = next
    this._syncOpenAttribute(next)
    const detail: OpenDetail = { open: next, previousOpen, source }
    if (next) {
      this._restoreFocusEl = typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null
      this.dispatchEvent(new CustomEvent<OpenDetail>('open', { detail, bubbles: true, composed: true }))
      this.dispatchEvent(new CustomEvent<OpenDetail>('ui-open', { detail, bubbles: true, composed: true }))
    } else {
      this.dispatchEvent(new CustomEvent<OpenDetail>('close', { detail, bubbles: true, composed: true }))
      this.dispatchEvent(new CustomEvent<OpenDetail>('ui-close', { detail, bubbles: true, composed: true }))
    }
    this.requestRender()
    if (!next && this._restoreFocusEl && this._restoreFocusEl.isConnected) {
      try {
        this._restoreFocusEl.focus()
      } catch {
        // ignore focus errors
      }
      this._restoreFocusEl = null
    }
    if (next) {
      queueMicrotask(() => this._focusFirstOpenControl())
    }
  }

  private _focusFirstOpenControl(): void {
    if (!this._open) return
    const panel = this._getCurrentPanel()
    const target = panel?.querySelector('[data-cp="sv"]') as HTMLElement | null
    if (!target) return
    try {
      target.focus()
    } catch {
      // ignore focus errors
    }
  }

  private _syncValueAttribute(): void {
    const next = this._serializeValue()
    this._syncing = true
    try {
      if (this.getAttribute('value') !== next) this.setAttribute('value', next)
    } finally {
      this._syncing = false
    }
  }

  private _syncOpenAttribute(next: boolean): void {
    this._syncing = true
    try {
      if (next) {
        if (!this.hasAttribute('open')) this.setAttribute('open', '')
      } else if (this.hasAttribute('open')) {
        this.removeAttribute('open')
      }
    } finally {
      this._syncing = false
    }
  }

  private _ensureOverlay(): void {
    if (this._overlay || typeof document === 'undefined') return
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.inset = '0'
    overlay.style.zIndex = 'var(--ui-cp-z, 1600)'
    overlay.style.pointerEvents = 'auto'
    const root = overlay.attachShadow({ mode: 'open' })
    overlay.addEventListener('click', (event) => this._onPanelClick(event, 'overlay'))
    overlay.addEventListener('input', (event) => this._onPanelInput(event, 'overlay'))
    overlay.addEventListener('change', (event) => this._onPanelChange(event, 'overlay'))
    overlay.addEventListener('keydown', (event) => this._onPanelKeyDown(event as KeyboardEvent, 'overlay'))
    overlay.addEventListener('pointerdown', (event) => this._onPanelPointerDown(event as PointerEvent, 'overlay'))
    overlay.addEventListener('pointermove', (event) => this._onPanelPointerMove(event as PointerEvent))
    overlay.addEventListener('pointerup', (event) => this._onPanelPointerUp(event as PointerEvent))
    overlay.addEventListener('pointercancel', (event) => this._onPanelPointerCancel(event as PointerEvent))
    document.body.appendChild(overlay)
    this._overlay = overlay
    this._overlayRoot = root
    this._syncOverlayHostAttributes()

    document.addEventListener('pointerdown', this._onDocumentPointerDownBound, true)
    document.addEventListener('keydown', this._onDocumentKeyDownBound)
    window.addEventListener('resize', this._onWindowResizeBound)
    window.addEventListener('scroll', this._onWindowScrollBound, { passive: true, capture: true })
  }

  private _destroyOverlay(): void {
    this._scheduleOverlayPosition.cancel()
    if (typeof document !== 'undefined') {
      document.removeEventListener('pointerdown', this._onDocumentPointerDownBound, true)
      document.removeEventListener('keydown', this._onDocumentKeyDownBound)
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this._onWindowResizeBound)
      window.removeEventListener('scroll', this._onWindowScrollBound, true)
    }
    if (this._overlay && this._overlay.parentElement) {
      this._overlay.parentElement.removeChild(this._overlay)
    }
    this._overlay = null
    this._overlayRoot = null
    this._panelCache = new WeakMap()

    if (this._isSheetOpen) {
      this._isSheetOpen = false
      if (this._releaseScrollLock) {
        this._releaseScrollLock()
        this._releaseScrollLock = null
      }
    }
  }

  private _positionOverlay(): void {
    if (!this._overlayRoot || !this._open || this._isMobileSheet()) return
    const trigger = this.root.querySelector('.trigger') as HTMLElement | null
    const shell = this._overlayRoot.querySelector('.popover-shell') as HTMLElement | null
    if (!trigger || !shell) return
    const panel = shell.querySelector('.panel') as HTMLElement | null
    if (!panel) return
    const currentPlacement = shell.getAttribute('data-placement')
    const pos = computePopoverPosition(
      trigger.getBoundingClientRect(),
      panel.getBoundingClientRect(),
      8,
      8,
      currentPlacement === 'top' ? 'top' : currentPlacement === 'bottom' ? 'bottom' : null
    )
    shell.style.top = `${Math.round(pos.top)}px`
    shell.style.left = `${Math.round(pos.left)}px`
    shell.setAttribute('data-placement', pos.placement)
  }

  private _onDocumentPointerDown(event: PointerEvent): void {
    if (!this._overlay || !this._open) return
    const path = typeof event.composedPath === 'function' ? event.composedPath() : []
    if (path.includes(this)) return
    const overlayPanel = this._overlayRoot?.querySelector('[data-cp-panel="overlay"]') as HTMLElement | null
    if (overlayPanel && path.includes(overlayPanel)) return
    this._setOpen(false, 'outside')
  }

  private _onDocumentKeyDown(event: KeyboardEvent): void {
    if (!this._open || !this._isPopoverMode()) return
    if (event.key === 'Tab') {
      this._trapOverlayFocus(event)
      return
    }
    if (event.key !== 'Escape' || !this._closeOnEscape()) return
    event.preventDefault()
    this._setOpen(false, 'escape')
  }

  private _focusableInPanel(panel: HTMLElement): HTMLElement[] {
    const candidates = panel.querySelectorAll<HTMLElement>(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"]),[contenteditable="true"]'
    )
    return Array.from(candidates).filter((el) => {
      if (el.hasAttribute('disabled')) return false
      if (el.getAttribute('aria-hidden') === 'true') return false
      if (el.tabIndex < 0) return false
      return el.getClientRects().length > 0
    })
  }

  private _trapOverlayFocus(event: KeyboardEvent): void {
    const panel = this._overlayRoot?.querySelector('[data-cp-panel="overlay"]') as HTMLElement | null
    if (!panel) return
    const focusables = this._focusableInPanel(panel)
    if (!focusables.length) {
      event.preventDefault()
      panel.focus()
      return
    }
    const rootNode = panel.getRootNode()
    const active = (rootNode instanceof ShadowRoot
      ? rootNode.activeElement
      : panel.ownerDocument.activeElement) as HTMLElement | null
    const current = active ? focusables.indexOf(active) : -1
    if (event.shiftKey) {
      if (current <= 0) {
        event.preventDefault()
        focusables[focusables.length - 1].focus()
      }
      return
    }
    if (current === -1 || current === focusables.length - 1) {
      event.preventDefault()
      focusables[0].focus()
    }
  }

  private _forEachPanel(run: (refs: PanelRefs) => void): void {
    const inlinePanel = this.root.querySelector('[data-cp-panel="inline"]') as HTMLElement | null
    if (inlinePanel) run(this._panelRefs(inlinePanel))
    const overlayPanel = this._overlayRoot?.querySelector('[data-cp-panel="overlay"]') as HTMLElement | null
    if (overlayPanel) run(this._panelRefs(overlayPanel))
  }

  private _panelRefs(panel: HTMLElement): PanelRefs {
    const cached = this._panelCache.get(panel)
    if (cached) return cached
    const refs: PanelRefs = {
      panel,
      label: panel.querySelector('[data-role="label"]') as HTMLElement | null,
      valueText: panel.querySelector('[data-role="value"]') as HTMLElement | null,
      preview: panel.querySelector('[data-role="preview"]') as HTMLElement | null,
      status: panel.querySelector('[data-role="status"]') as HTMLElement | null,
      sv: panel.querySelector('[data-cp="sv"]') as HTMLElement | null,
      svThumb: panel.querySelector('[data-role="sv-thumb"]') as HTMLElement | null,
      hue: panel.querySelector('[data-cp="hue"]') as HTMLElement | null,
      hueThumb: panel.querySelector('[data-role="hue-thumb"]') as HTMLElement | null,
      alphaRow: panel.querySelector('[data-role="alpha-row"]') as HTMLElement | null,
      alpha: panel.querySelector('[data-cp="alpha"]') as HTMLElement | null,
      alphaThumb: panel.querySelector('[data-role="alpha-thumb"]') as HTMLElement | null,
      tabHex: panel.querySelector('[data-format="hex"]') as HTMLButtonElement | null,
      tabRgb: panel.querySelector('[data-format="rgb"]') as HTMLButtonElement | null,
      tabHsl: panel.querySelector('[data-format="hsl"]') as HTMLButtonElement | null,
      groupHex: panel.querySelector('[data-format-group="hex"]') as HTMLElement | null,
      groupRgb: panel.querySelector('[data-format-group="rgb"]') as HTMLElement | null,
      groupHsl: panel.querySelector('[data-format-group="hsl"]') as HTMLElement | null,
      inputHex: panel.querySelector('[data-input="hex"]') as HTMLInputElement | null,
      inputR: panel.querySelector('[data-input="r"]') as HTMLInputElement | null,
      inputG: panel.querySelector('[data-input="g"]') as HTMLInputElement | null,
      inputB: panel.querySelector('[data-input="b"]') as HTMLInputElement | null,
      inputA1: panel.querySelector('[data-input="a1"]') as HTMLInputElement | null,
      inputH: panel.querySelector('[data-input="h"]') as HTMLInputElement | null,
      inputS: panel.querySelector('[data-input="s"]') as HTMLInputElement | null,
      inputL: panel.querySelector('[data-input="l"]') as HTMLInputElement | null,
      inputA2: panel.querySelector('[data-input="a2"]') as HTMLInputElement | null,
      copyHex: panel.querySelector('[data-action="copy-hex"]') as HTMLButtonElement | null,
      copyRgb: panel.querySelector('[data-action="copy-rgb"]') as HTMLButtonElement | null,
      eyedropper: panel.querySelector('[data-action="eyedropper"]') as HTMLButtonElement | null,
      clear: panel.querySelector('[data-action="clear"]') as HTMLButtonElement | null,
      apply: panel.querySelector('[data-action="apply"]') as HTMLButtonElement | null,
      presets: panel.querySelector('[data-role="presets"]') as HTMLElement | null,
      recent: panel.querySelector('[data-role="recent"]') as HTMLElement | null,
      recentTitle: panel.querySelector('[data-role="recent-title"]') as HTMLElement | null,
      error: panel.querySelector('[data-role="error"]') as HTMLElement | null,
      live: panel.querySelector('[data-role="live"]') as HTMLElement | null
    }
    this._panelCache.set(panel, refs)
    return refs
  }

  private _getCurrentPanel(): HTMLElement | null {
    if (this._isPopoverMode() && this._open && this._overlayRoot) {
      return this._overlayRoot.querySelector('[data-cp-panel="overlay"]') as HTMLElement | null
    }
    return this.root.querySelector('[data-cp-panel="inline"]') as HTMLElement | null
  }

  private _updateUI(skipSwatches: boolean, liveOnly = false): void {
    const triggerWrap = this.root.querySelector('[data-role="trigger-wrap"]') as HTMLElement | null
    const trigger = this.root.querySelector('.trigger') as HTMLButtonElement | null
    const triggerValue = this.root.querySelector('[data-role="trigger-value"]') as HTMLElement | null
    const triggerPreview = this.root.querySelector('[data-role="trigger-preview"]') as HTMLElement | null
    const inlinePanelWrap = this.root.querySelector('[data-role="inline-panel"]') as HTMLElement | null

    const modePopover = this._isPopoverMode()
    const state = this._state()
    const tone = this._tone()
    const loading = state === 'loading'
    const disabled = this._isDisabled()
    const readonly = this._isReadonly()
    const triggerText = this._serializeValue() || this._placeholder()

    if (triggerWrap) triggerWrap.hidden = !modePopover
    if (trigger) {
      trigger.disabled = disabled || loading
      trigger.dataset.state = state
      trigger.dataset.tone = tone
      trigger.setAttribute('aria-expanded', modePopover && this._open ? 'true' : 'false')
      this._applyAria(trigger)
    }
    if (triggerValue) triggerValue.textContent = triggerText
    if (triggerPreview) triggerPreview.style.background = formatRgbDisplay(this._rgba, true)
    if (inlinePanelWrap) inlinePanelWrap.hidden = modePopover

    this._forEachPanel((refs) => this._updatePanel(refs, { skipSwatches, disabled, readonly, loading, state, tone, modePopover, liveOnly }))
  }

  private _updatePanel(
    refs: PanelRefs,
    opts: {
      skipSwatches: boolean
      disabled: boolean
      readonly: boolean
      loading: boolean
      state: ColorPickerState
      tone: ColorPickerTone
      modePopover: boolean
      liveOnly: boolean
    }
  ): void {
    const rgba = this._rgba
    const hsla = rgbaToHsla(rgba)
    const hsva = this._hsva
    const hueForBg = `hsl(${Math.round(hsva.h)} 100% 50%)`
    const isOverlayPanel = refs.panel.getAttribute('data-cp-panel') === 'overlay'
    const hasError = Boolean(this._error) || opts.state === 'error'
    const blocked = opts.disabled || opts.readonly || opts.loading

    this._applyAria(refs.panel)
    refs.panel.dataset.state = hasError ? 'error' : opts.state
    refs.panel.dataset.tone = opts.tone
    refs.panel.setAttribute('aria-busy', opts.loading ? 'true' : 'false')
    if (isOverlayPanel && opts.modePopover) {
      refs.panel.setAttribute('role', 'dialog')
      refs.panel.setAttribute('aria-modal', 'true')
      refs.panel.tabIndex = -1
    } else {
      refs.panel.removeAttribute('role')
      refs.panel.removeAttribute('aria-modal')
      refs.panel.removeAttribute('tabindex')
    }
    if (refs.label) refs.label.textContent = this._labelText()
    if (refs.valueText) refs.valueText.textContent = this._serializeValue()
    if (refs.preview) refs.preview.style.background = formatRgbDisplay(rgba, true)
    if (refs.status) {
      let status = ''
      if (hasError) status = 'Error'
      else if (opts.state === 'loading') status = 'Syncing'
      else if (opts.state === 'success') status = 'Saved'
      refs.status.hidden = !status
      refs.status.textContent = status
      refs.status.dataset.tone = opts.tone
    }

    if (refs.sv) {
      refs.sv.style.background = `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueForBg})`
      refs.sv.setAttribute('aria-valuetext', `Saturation ${Math.round(hsva.s)}%, Value ${Math.round(hsva.v)}%`)
      refs.sv.setAttribute('aria-disabled', blocked ? 'true' : 'false')
      refs.sv.tabIndex = blocked ? -1 : 0
    }
    if (refs.svThumb) {
      const safeS = clamp(hsva.s, 1, 99)
      const safeV = clamp(100 - hsva.v, 1, 99)
      refs.svThumb.style.left = `${safeS}%`
      refs.svThumb.style.top = `${safeV}%`
    }

    if (refs.hue) {
      refs.hue.setAttribute('aria-valuemin', '0')
      refs.hue.setAttribute('aria-valuemax', '360')
      refs.hue.setAttribute('aria-valuenow', String(Math.round(hsva.h)))
      refs.hue.setAttribute('aria-disabled', blocked ? 'true' : 'false')
      refs.hue.tabIndex = blocked ? -1 : 0
    }
    if (refs.hueThumb) refs.hueThumb.style.left = `${clamp((hsva.h / 360) * 100, 1, 99)}%`

    if (refs.alphaRow) refs.alphaRow.hidden = !this._alphaEnabled()
    if (refs.alpha) {
      refs.alpha.setAttribute('aria-valuemin', '0')
      refs.alpha.setAttribute('aria-valuemax', '100')
      refs.alpha.setAttribute('aria-valuenow', String(Math.round(hsva.a * 100)))
      refs.alpha.setAttribute('aria-disabled', blocked || !this._alphaEnabled() ? 'true' : 'false')
      refs.alpha.tabIndex = blocked ? -1 : 0
      refs.alpha.style.backgroundImage = `
        linear-gradient(45deg, var(--ui-cp-checker-a) 25%, transparent 25%),
        linear-gradient(-45deg, var(--ui-cp-checker-a) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--ui-cp-checker-a) 75%),
        linear-gradient(-45deg, transparent 75%, var(--ui-cp-checker-a) 75%),
        linear-gradient(to right, rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 0), rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 1))
      `
    }
    if (refs.alphaThumb) refs.alphaThumb.style.left = `${clamp(hsva.a * 100, 1, 99)}%`

    const rootNode = refs.panel.getRootNode()
    const active = rootNode instanceof ShadowRoot ? rootNode.activeElement : refs.panel.ownerDocument.activeElement
    const preserve = active && refs.panel.contains(active) ? active.getAttribute('data-input') : null

    if (refs.inputHex && preserve !== 'hex') refs.inputHex.value = formatHexDisplay(rgba, this._alphaEnabled())
    if (refs.inputR && preserve !== 'r') refs.inputR.value = String(rgba.r)
    if (refs.inputG && preserve !== 'g') refs.inputG.value = String(rgba.g)
    if (refs.inputB && preserve !== 'b') refs.inputB.value = String(rgba.b)
    if (refs.inputA1 && preserve !== 'a1') refs.inputA1.value = this._alphaEnabled() ? String(Number(rgba.a.toFixed(3))) : '1'
    if (refs.inputH && preserve !== 'h') refs.inputH.value = String(Math.round(hsla.h))
    if (refs.inputS && preserve !== 's') refs.inputS.value = String(Math.round(hsla.s))
    if (refs.inputL && preserve !== 'l') refs.inputL.value = String(Math.round(hsla.l))
    if (refs.inputA2 && preserve !== 'a2') refs.inputA2.value = this._alphaEnabled() ? String(Number(rgba.a.toFixed(3))) : '1'

    if (opts.liveOnly) return

    if (refs.tabHex) refs.tabHex.dataset.active = String(this._format === 'hex')
    if (refs.tabRgb) refs.tabRgb.dataset.active = String(this._format === 'rgb')
    if (refs.tabHsl) refs.tabHsl.dataset.active = String(this._format === 'hsl')
    if (refs.groupHex) refs.groupHex.hidden = this._format !== 'hex'
    if (refs.groupRgb) refs.groupRgb.hidden = this._format !== 'rgb'
    if (refs.groupHsl) refs.groupHsl.hidden = this._format !== 'hsl'
    if (refs.inputA1) refs.inputA1.disabled = !this._alphaEnabled() || blocked
    if (refs.inputA2) refs.inputA2.disabled = !this._alphaEnabled() || blocked

    if (refs.error) {
      const errorText = this._error || (opts.state === 'error' ? 'Unable to validate current color value.' : '')
      refs.error.hidden = !errorText
      refs.error.textContent = errorText
    }

    const blockInteract = blocked
    if (refs.copyHex) refs.copyHex.disabled = opts.disabled || opts.loading
    if (refs.copyRgb) refs.copyRgb.disabled = opts.disabled || opts.loading
    if (refs.eyedropper) {
      const hasEyeDropper = typeof window !== 'undefined' && typeof (window as any).EyeDropper === 'function'
      refs.eyedropper.hidden = !hasEyeDropper
      refs.eyedropper.disabled = blockInteract || !hasEyeDropper
    }
    if (refs.clear) refs.clear.disabled = blockInteract
    if (refs.apply) {
      refs.apply.hidden = !opts.modePopover
      refs.apply.disabled = blockInteract
    }

    const inputs = refs.panel.querySelectorAll('.input')
    inputs.forEach((input) => {
      const el = input as HTMLInputElement
      el.disabled = blockInteract
    })

    if (!opts.skipSwatches && !this._renderingSwatches) {
      this._renderingSwatches = true
      try {
        this._renderSwatches(refs)
      } finally {
        this._renderingSwatches = false
      }
    }
  }

  private _renderSwatches(refs: PanelRefs): void {
    const selected = this._currentHex().toLowerCase()
    if (refs.presets) {
      refs.presets.innerHTML = this._presets
        .map((color) => {
          const parsed = parseColor(color)
          if (!parsed) return ''
          const normalized = formatHexDisplay(this._normalizeByAlpha(parsed), this._alphaEnabled())
          const selectedAttr = normalized.toLowerCase() === selected ? ' data-selected="true"' : ''
          return `<button type="button" class="swatch" part="swatch" data-action="preset" data-color="${escapeHtml(normalized)}"${selectedAttr} title="${escapeHtml(normalized)}" style="background:${escapeHtml(formatRgbDisplay(parsed, true))}"></button>`
        })
        .join('')
    }

    if (refs.recentTitle) refs.recentTitle.hidden = !this._recentEnabled() || this._recentColors.length === 0
    if (refs.recent) {
      refs.recent.hidden = !this._recentEnabled() || this._recentColors.length === 0
      refs.recent.innerHTML = this._recentColors
        .map((color) => {
          const parsed = parseColor(color)
          if (!parsed) return ''
          const normalized = formatHexDisplay(this._normalizeByAlpha(parsed), this._alphaEnabled())
          const selectedAttr = normalized.toLowerCase() === selected ? ' data-selected="true"' : ''
          return `<button type="button" class="swatch" part="swatch recent" data-action="recent" data-color="${escapeHtml(normalized)}"${selectedAttr} title="${escapeHtml(normalized)}" style="background:${escapeHtml(formatRgbDisplay(parsed, true))}"></button>`
        })
        .join('')
    }
  }

  private _onPanelClick(event: Event, _scope: 'root' | 'overlay'): void {
    const target = this._eventHTMLElement(event)
    if (!target) return
    const actionEl = target.closest<HTMLElement>('[data-action]')
    if (!actionEl) return
    if (this._isDisabled()) return

    const action = actionEl.getAttribute('data-action')
    if (action === 'close-popover') {
      this._setOpen(false, 'outside')
      return
    }

    if (action === 'toggle-popover') {
      if (!this._isPopoverMode()) return
      this._setOpen(!this._open, 'toggle')
      return
    }

    if (this._isLoading()) return

    if (action === 'format') {
      const format = actionEl.getAttribute('data-format') as ColorFormat | null
      if (!format) return
      this.setAttribute('format', format)
      this._error = ''
      this._updateUI(false)
      return
    }

    if (action === 'copy-hex') {
      this._copyToClipboard(this._currentHex())
      return
    }

    if (action === 'copy-rgb') {
      this._copyToClipboard(formatRgbDisplay(this._rgba, this._alphaEnabled()))
      return
    }

    if (action === 'eyedropper') {
      this._openEyeDropper()
      return
    }

    if (action === 'clear') {
      if (this._isReadonly()) return
      const parsed = parseColor(DEFAULT_COLOR)
      if (parsed) {
        this._applyRgba(parsed, false)
        this._error = ''
        this._syncValueAttribute()
        this._emitInput('text')
        this._emitChange('text')
        this._pushRecent(this._currentHex())
        this._updateUI(false)
      }
      return
    }

    if (action === 'apply') {
      this._setOpen(false, 'apply')
      return
    }

    if (action === 'preset' || action === 'recent') {
      if (this._isReadonly()) return
      const raw = actionEl.getAttribute('data-color') || ''
      const parsed = parseColor(raw)
      if (!parsed) return
      const source: ColorSource = action === 'preset' ? 'preset' : 'recent'
      this._applyRgba(parsed, true)
      this._error = ''
      this._syncValueAttribute()
      this._emitInput(source)
      this._emitChange(source)
      this._pushRecent(this._currentHex())
      this._updateUI(false)
      return
    }
  }

  private _onPanelInput(event: Event, _scope: 'root' | 'overlay'): void {
    const target = this._eventHTMLElement(event)
    if (!(target instanceof HTMLInputElement)) return
    if (!target.hasAttribute('data-input')) return
    event.stopPropagation()
    if (this._isDisabled() || this._isReadonly() || this._isLoading()) return

    const parsed = this._parseInputsFromPanel(target.closest('[data-cp-panel]') as HTMLElement | null)
    if (!parsed) {
      this._error = ''
      return
    }
    this._error = ''
    this._applyRgba(parsed, true)
    this._emitInput('text')
    this._updateUI(true, true)
  }

  private _onPanelChange(event: Event, _scope: 'root' | 'overlay'): void {
    const target = this._eventHTMLElement(event)
    if (!(target instanceof HTMLInputElement)) return
    if (!target.hasAttribute('data-input')) return
    event.stopPropagation()
    if (this._isDisabled() || this._isReadonly() || this._isLoading()) return

    const panel = target.closest('[data-cp-panel]') as HTMLElement | null
    const parsed = this._parseInputsFromPanel(panel)
    if (!parsed) {
      const raw = target.value || ''
      this._setInvalid(raw, 'Invalid input values')
      return
    }
    this._error = ''
    this._applyRgba(parsed, true)
    this._syncValueAttribute()
    this._emitInput('text')
    this._emitChange('text')
    this._pushRecent(this._currentHex())
    this._updateUI(false)
  }

  private _onPanelKeyDown(event: KeyboardEvent, _scope: 'root' | 'overlay'): void {
    const target = this._eventHTMLElement(event)
    if (!target) return
    if (this._isDisabled() || this._isLoading()) return

    if (target instanceof HTMLInputElement && target.hasAttribute('data-input') && event.key === 'Enter') {
      event.preventDefault()
      const parsed = this._parseInputsFromPanel(target.closest('[data-cp-panel]') as HTMLElement | null)
      if (!parsed) {
        this._setInvalid(target.value || '', 'Invalid input values')
        return
      }
      this._error = ''
      this._applyRgba(parsed, true)
      this._syncValueAttribute()
      this._emitInput('text')
      this._emitChange('text')
      this._pushRecent(this._currentHex())
      this._updateUI(false)
      return
    }

    const cp = target.getAttribute('data-cp') as DragTarget | null
    if (!cp || this._isReadonly() || this._isLoading()) return
    const step = event.shiftKey ? 5 : 1
    let changed = false
    const next = { ...this._hsva }

    if (cp === 'sv') {
      if (event.key === 'ArrowLeft') {
        next.s = clamp(next.s - step, 0, 100)
        changed = true
      } else if (event.key === 'ArrowRight') {
        next.s = clamp(next.s + step, 0, 100)
        changed = true
      } else if (event.key === 'ArrowUp') {
        next.v = clamp(next.v + step, 0, 100)
        changed = true
      } else if (event.key === 'ArrowDown') {
        next.v = clamp(next.v - step, 0, 100)
        changed = true
      } else if (event.key === 'Home') {
        next.s = 0
        next.v = 100
        changed = true
      } else if (event.key === 'End') {
        next.s = 100
        next.v = 0
        changed = true
      }
      if (changed) {
        event.preventDefault()
        this._commitHsva(next, 'drag')
      }
      return
    }

    if (cp === 'hue') {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        next.h = clamp(next.h - step, 0, 360)
        changed = true
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        next.h = clamp(next.h + step, 0, 360)
        changed = true
      } else if (event.key === 'Home') {
        next.h = 0
        changed = true
      } else if (event.key === 'End') {
        next.h = 360
        changed = true
      }
      if (changed) {
        event.preventDefault()
        this._commitHsva(next, 'slider')
      }
      return
    }

    if (cp === 'alpha' && this._alphaEnabled()) {
      const alphaStep = event.shiftKey ? 0.1 : 0.01
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        next.a = clamp(next.a - alphaStep, 0, 1)
        changed = true
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        next.a = clamp(next.a + alphaStep, 0, 1)
        changed = true
      } else if (event.key === 'Home') {
        next.a = 0
        changed = true
      } else if (event.key === 'End') {
        next.a = 1
        changed = true
      }
      if (changed) {
        event.preventDefault()
        this._commitHsva(next, 'slider')
      }
    }
  }

  private _commitHsva(next: HSVA, source: ColorSource): void {
    this._setHsva(next)
    this._syncValueAttribute()
    this._emitInput(source)
    this._emitChange(source)
    this._pushRecent(this._currentHex())
    this._updateUI(false)
  }

  private _parseInputsFromPanel(panel: HTMLElement | null): RGBA | null {
    if (!panel) return null
    const refs = this._panelRefs(panel)
    if (this._format === 'hex') {
      const raw = refs.inputHex?.value || ''
      const normalized = raw.trim().startsWith('#') ? raw.trim() : `#${raw.trim()}`
      const parsed = parseColor(normalized)
      return parsed ? this._normalizeByAlpha(parsed) : null
    }
    if (this._format === 'rgb') {
      const r = Number(refs.inputR?.value ?? '')
      const g = Number(refs.inputG?.value ?? '')
      const b = Number(refs.inputB?.value ?? '')
      const a = this._alphaEnabled() ? Number(refs.inputA1?.value ?? '') : 1
      if (![r, g, b, a].every((item) => Number.isFinite(item))) return null
      return this._normalizeByAlpha({ r, g, b, a })
    }

    const h = Number(refs.inputH?.value ?? '')
    const s = Number(refs.inputS?.value ?? '')
    const l = Number(refs.inputL?.value ?? '')
    const a = this._alphaEnabled() ? Number(refs.inputA2?.value ?? '') : 1
    if (![h, s, l, a].every((item) => Number.isFinite(item))) return null
    const hsla: HSLA = {
      h: clamp(h, 0, 360),
      s: clamp(s, 0, 100),
      l: clamp(l, 0, 100),
      a: clamp(a, 0, 1)
    }
    return this._normalizeByAlpha(hslaToRgba(hsla))
  }

  private _onPanelPointerDown(event: PointerEvent, _scope: 'root' | 'overlay'): void {
    if (this._isDisabled() || this._isReadonly() || this._isLoading()) return
    const target = this._eventHTMLElement(event)
    if (!target) return
    const cp = target.closest<HTMLElement>('[data-cp]')?.getAttribute('data-cp') as DragTarget | null
    if (!cp) return
    if (cp === 'alpha' && !this._alphaEnabled()) return
    const track = target.closest<HTMLElement>(`[data-cp="${cp}"]`)
    if (!track) return

    event.preventDefault()
    this._dragTarget = cp
    this._dragPointerId = event.pointerId
    this._dragRect = track.getBoundingClientRect()
    this._dragX = event.clientX
    this._dragY = event.clientY
    this._dragChanged = false
    this._dragSource = cp === 'sv' ? 'drag' : 'slider'
    try {
      track.setPointerCapture(event.pointerId)
    } catch {
      // no-op
    }
    this._applyDragPointer(true)
  }

  private _onPanelPointerMove(event: PointerEvent): void {
    if (!this._dragTarget || event.pointerId !== this._dragPointerId) return
    this._dragX = event.clientX
    this._dragY = event.clientY
    if (this._dragRaf) return
    this._dragRaf = requestAnimationFrame(() => {
      this._dragRaf = 0
      this._applyDragPointer(true)
    })
  }

  private _onPanelPointerUp(event: PointerEvent): void {
    if (!this._dragTarget || event.pointerId !== this._dragPointerId) return
    this._dragX = event.clientX
    this._dragY = event.clientY
    this._applyDragPointer(true)
    this._stopDrag(true)
  }

  private _onPanelPointerCancel(event: PointerEvent): void {
    if (!this._dragTarget || event.pointerId !== this._dragPointerId) return
    this._stopDrag(false)
  }

  private _cancelDragFrame(): void {
    if (!this._dragRaf) return
    cancelAnimationFrame(this._dragRaf)
    this._dragRaf = 0
  }

  private _applyDragPointer(emitInput: boolean): void {
    if (!this._dragTarget || !this._dragRect) return
    const rect = this._dragRect
    const x = clamp(this._dragX - rect.left, 0, rect.width || 1)
    const y = clamp(this._dragY - rect.top, 0, rect.height || 1)

    const next = { ...this._hsva }
    if (this._dragTarget === 'sv') {
      next.s = clamp((x / Math.max(rect.width, 1)) * 100, 0, 100)
      next.v = clamp(100 - (y / Math.max(rect.height, 1)) * 100, 0, 100)
    } else if (this._dragTarget === 'hue') {
      next.h = clamp((x / Math.max(rect.width, 1)) * 360, 0, 360)
    } else if (this._dragTarget === 'alpha') {
      next.a = clamp(x / Math.max(rect.width, 1), 0, 1)
    }

    const changed = this._setHsva(next)
    if (!changed) return
    this._dragChanged = true
    if (emitInput) this._emitInput(this._dragSource)
    this._updateUI(true, true)
  }

  private _setHsva(next: HSVA): boolean {
    const normalized: HSVA = {
      h: clamp(next.h, 0, 360),
      s: clamp(next.s, 0, 100),
      v: clamp(next.v, 0, 100),
      a: this._alphaEnabled() ? clamp(next.a, 0, 1) : 1
    }

    const old = this._hsva
    if (
      approximately(old.h, normalized.h) &&
      approximately(old.s, normalized.s) &&
      approximately(old.v, normalized.v) &&
      approximately(old.a, normalized.a)
    ) {
      return false
    }

    this._hsva = normalized
    this._rgba = this._normalizeByAlpha(hsvaToRgba(this._hsva))
    this._error = ''
    return true
  }

  private _stopDrag(commit: boolean): void {
    this._cancelDragFrame()
    const shouldCommit = commit && this._dragChanged
    this._dragTarget = null
    this._dragPointerId = -1
    this._dragRect = null
    this._dragChanged = false

    if (shouldCommit) {
      this._syncValueAttribute()
      this._emitChange(this._dragSource)
      this._pushRecent(this._currentHex())
      this._updateUI(false)
    }
  }

  private _pushRecent(hex: string): void {
    if (!this._recentEnabled()) return
    const normalized = (hex || '').trim().toUpperCase()
    if (!normalized) return
    this._recentColors = [normalized, ...this._recentColors.filter((item) => item.toUpperCase() !== normalized)].slice(
      0,
      this._maxRecent()
    )
    this._persistRecentColors()
  }

  private async _openEyeDropper(): Promise<void> {
    if (this._isDisabled() || this._isReadonly() || this._isLoading()) return
    if (typeof window === 'undefined') return
    const EyeDropperCtor = (window as any).EyeDropper
    if (typeof EyeDropperCtor !== 'function') return
    try {
      const picker = new EyeDropperCtor()
      const result = await picker.open()
      const parsed = parseColor(result?.sRGBHex || '')
      if (!parsed) return
      this._applyRgba(parsed, true)
      this._error = ''
      this._syncValueAttribute()
      this._emitInput('eyedropper')
      this._emitChange('eyedropper')
      this._pushRecent(this._currentHex())
      this._updateUI(false)
    } catch {
      // User-cancelled eyedropper should stay silent.
    }
  }

  private async _copyToClipboard(value: string): Promise<void> {
    if (!value || this._isDisabled()) return
    let success = false
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value)
        success = true
      } catch {
        success = false
      }
    }
    if (!success && typeof document !== 'undefined') {
      const el = document.createElement('textarea')
      el.value = value
      el.setAttribute('readonly', '')
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      try {
        success = document.execCommand('copy')
      } catch {
        success = false
      } finally {
        if (el.parentElement) el.parentElement.removeChild(el)
      }
    }

    const message = success ? `Copied ${value}` : `Unable to copy ${value}`
    const maybeGlobalToast = typeof window !== 'undefined' ? (window as any).showToast : null
    if (typeof maybeGlobalToast === 'function') {
      try {
        maybeGlobalToast(message)
      } catch {
        this.dispatchEvent(new CustomEvent('toast', { detail: { message }, bubbles: true, composed: true }))
      }
    } else {
      this.dispatchEvent(new CustomEvent('toast', { detail: { message }, bubbles: true, composed: true }))
    }
  }

  private _applyAria(el: HTMLElement): void {
    const ariaLabelledby = this.getAttribute('aria-labelledby')
    const ariaDescribedby = this.getAttribute('aria-describedby')
    const ariaLabel = this.getAttribute('aria-label')

    if (ariaLabelledby) el.setAttribute('aria-labelledby', ariaLabelledby)
    else el.removeAttribute('aria-labelledby')

    if (ariaDescribedby) el.setAttribute('aria-describedby', ariaDescribedby)
    else el.removeAttribute('aria-describedby')

    if (ariaLabel) el.setAttribute('aria-label', ariaLabel)
    else if (!ariaLabelledby) el.setAttribute('aria-label', 'Color picker')
  }
}

if (!customElements.get('ui-color-picker')) {
  customElements.define('ui-color-picker', UIColorPicker)
}

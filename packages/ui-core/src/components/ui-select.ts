import { ElementBase } from '../ElementBase';
import { findFirstEnabledIndex, findIndexByValue, findLastEnabledIndex } from '../primitives/collection';
import { resolveListboxActiveIndex } from '../primitives/listbox';
import './ui-listbox';
import { UIListbox } from './ui-listbox';

const style = `
  :host {
    --ui-select-width: var(--ui-width, min(340px, 100%));
    --ui-select-min-height: var(--base-select-height-md, 42px);
    --ui-select-radius: var(--base-select-radius, var(--ui-radius, 4px));
    --ui-select-padding-x: var(--base-select-padding-x, 12px);

    --ui-select-bg: var(--base-select-bg, var(--ui-color-surface, #ffffff));
    --ui-select-border: var(--base-select-border, 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent));
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-border) 100%, transparent);
    --ui-select-text: var(--ui-color-text, #0f172a);
    --ui-select-muted: var(--ui-color-muted, #64748b);
    --ui-select-placeholder: color-mix(in srgb, var(--ui-select-text) 44%, transparent);
    --ui-select-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-select-accent: var(--ui-color-primary, #2563eb);
    --ui-select-success: var(--ui-color-success, #16a34a);
    --ui-select-warning: var(--ui-color-warning, #d97706);
    --ui-select-error: var(--ui-color-danger, #dc2626);

    --ui-select-shadow: var(--base-select-shadow, none);
    --ui-select-elevation: var(--ui-select-shadow);
    --ui-select-menu-bg: var(--base-select-menu-bg, color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent));
    --ui-select-menu-color: var(--base-select-menu-color, var(--ui-select-text));
    --ui-select-menu-border-color: color-mix(in srgb, var(--ui-select-border-color) 82%, transparent);
    --ui-select-menu-border: 1px solid var(--ui-select-menu-border-color);
    --ui-select-menu-radius: var(--base-select-menu-radius, var(--ui-select-radius));
    --ui-select-menu-shadow:
      0 14px 34px rgba(15, 23, 42, 0.16),
      0 3px 10px rgba(15, 23, 42, 0.08);
    --ui-select-menu-padding: 0px;
    --ui-select-menu-gap: 8px;
    --ui-select-menu-max-height: min(320px, var(--ui-select-available-height, 320px));
    --ui-select-menu-item-height: 38px;
    --ui-select-menu-item-radius: 0px;
    --ui-select-menu-item-border-color: color-mix(in srgb, var(--ui-select-border-color) 72%, transparent);

    --ui-select-label: var(--base-select-label-color, var(--ui-select-text));
    --ui-select-description: var(--base-select-description-color, var(--ui-select-muted));
    --ui-select-indicator-color: color-mix(in srgb, var(--ui-select-text) 58%, transparent);
    --ui-select-transition: 170ms cubic-bezier(0.22, 0.8, 0.2, 1);

    color-scheme: light dark;
    display: inline-grid;
    inline-size: var(--ui-select-width);
    min-inline-size: min(220px, 100%);
    position: relative;
    isolation: isolate;
    z-index: 0;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  :host([open]) {
    z-index: 40;
  }

  .root {
    min-inline-size: 0;
    display: grid;
    gap: 8px;
    color: var(--ui-select-text);
  }

  .content-slot {
    display: none;
  }

  .meta {
    display: grid;
    gap: 4px;
  }

  .label {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--ui-select-label);
    font: 600 13px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
  }

  .required {
    color: var(--ui-select-error);
    font-size: 12px;
    line-height: 1;
  }

  .description {
    margin: 0;
    color: var(--ui-select-description);
    font-size: 12px;
    line-height: 1.4;
  }

  .field-shell {
    position: relative;
    min-inline-size: 0;
  }

  .control {
    min-inline-size: 0;
    position: relative;
    display: block;
    min-block-size: var(--ui-select-min-height);
    border: var(--ui-select-border);
    border-radius: var(--ui-select-radius);
    background: var(--ui-select-bg);
    box-shadow: var(--ui-select-elevation);
    padding: 0;
    transition:
      border-color var(--ui-select-transition),
      box-shadow var(--ui-select-transition),
      background-color var(--ui-select-transition),
      transform var(--ui-select-transition),
      opacity var(--ui-select-transition);
  }

  .control[data-open="true"],
  .control:focus-within {
    border-color: color-mix(in srgb, var(--ui-select-focus) 62%, var(--ui-select-border-color));
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--ui-select-focus) 18%, transparent),
      var(--ui-select-elevation);
  }

  .leading,
  .trailing {
    min-inline-size: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: color-mix(in srgb, var(--ui-select-text) 64%, transparent);
    line-height: 1;
    pointer-events: none;
  }

  .leading {
    position: absolute;
    inset-inline-start: var(--ui-select-padding-x);
    inset-block-start: 50%;
    transform: translateY(-50%);
  }

  .trailing {
    position: absolute;
    inset-inline-end: calc(var(--ui-select-padding-x) + 24px);
    inset-block-start: 50%;
    transform: translateY(-50%);
  }

  .leading[hidden],
  .trailing[hidden],
  .description[hidden],
  .label[hidden],
  .error[hidden],
  .meta[hidden],
  .panel[hidden] {
    display: none;
  }

  .trigger {
    inline-size: 100%;
    min-inline-size: 0;
    block-size: calc(var(--ui-select-min-height) - 2px);
    box-sizing: border-box;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ui-select-text);
    font: 500 14px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: 8px calc(var(--ui-select-padding-x) + 24px) 8px var(--ui-select-padding-x);
    margin: 0;
    cursor: pointer;
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .control[data-has-leading="true"] .trigger {
    padding-inline-start: calc(var(--ui-select-padding-x) + 24px);
  }

  .control[data-has-trailing="true"] .trigger {
    padding-inline-end: calc(var(--ui-select-padding-x) + 48px);
  }

  .trigger:focus-visible {
    outline: none;
  }

  .value {
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .control[data-placeholder-shown="true"] .value {
    color: var(--ui-select-placeholder);
  }

  .indicator,
  .spinner {
    inline-size: 18px;
    block-size: 18px;
    display: grid;
    place-items: center;
    line-height: 1;
    position: absolute;
    inset-inline-end: var(--ui-select-padding-x);
    inset-block-start: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .indicator {
    color: var(--ui-select-indicator-color);
    transform-origin: 50% 48%;
    transition: transform var(--ui-select-transition), color var(--ui-select-transition), opacity var(--ui-select-transition);
  }

  .indicator::before {
    content: "";
    inline-size: 8px;
    block-size: 8px;
    border-right: 1.8px solid currentColor;
    border-bottom: 1.8px solid currentColor;
    transform: rotate(45deg) translateY(-1px);
  }

  .control[data-open="true"] .indicator {
    color: var(--ui-select-focus);
    transform: translateY(calc(-50% + 1px)) rotate(180deg);
  }

  .spinner {
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, var(--ui-select-accent) 22%, transparent);
    border-top-color: var(--ui-select-accent);
    opacity: 0;
    inset-block-start: calc(50% - 9px);
    transform: none;
    animation: ui-select-spin 760ms linear infinite;
  }

  .panel {
    position: absolute;
    inset-inline: 0;
    inset-block-start: calc(100% + var(--ui-select-menu-gap));
    z-index: 24;
    pointer-events: auto;
  }

  .panel[data-placement="top"] {
    inset-block-start: auto;
    inset-block-end: calc(100% + var(--ui-select-menu-gap));
  }

  .menu {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 0;
    min-inline-size: 100%;
    max-inline-size: 100%;
    max-block-size: var(--ui-select-menu-max-height);
    overflow-y: auto;
    overflow-x: hidden;
    border: var(--ui-select-menu-border);
    border-radius: var(--ui-select-menu-radius);
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--ui-select-accent) 3%, transparent) 0%, transparent 100%),
      var(--ui-select-menu-bg);
    color: var(--ui-select-menu-color);
    box-shadow: var(--ui-select-menu-shadow);
    padding: var(--ui-select-menu-padding);
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--ui-select-menu-border-color) 82%, transparent) transparent;
    scrollbar-gutter: auto;
    backdrop-filter: saturate(1.04) blur(10px);
  }

  .menu::-webkit-scrollbar {
    width: 8px;
  }

  .menu::-webkit-scrollbar-track {
    background: transparent;
  }

  .menu::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--ui-select-menu-border-color) 82%, transparent);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  .menu:hover::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--ui-select-accent) 28%, var(--ui-select-menu-border-color));
    background-clip: padding-box;
  }

  .panel[data-placement="top"] .menu {
    transform-origin: bottom center;
    animation: ui-select-menu-enter-top 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .panel[data-placement="bottom"] .menu {
    transform-origin: top center;
    animation: ui-select-menu-enter-bottom 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .menu-group {
    color: color-mix(in srgb, var(--ui-select-muted) 88%, transparent);
    font: 700 11px/1.3 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 9px 10px 5px;
  }

  .menu-item {
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: var(--ui-select-menu-item-height);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border: 1px solid transparent;
    border-radius: var(--ui-select-menu-item-radius);
    background: transparent;
    color: inherit;
    padding: 9px 10px;
    text-align: left;
    font: 500 13px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
    transition:
      background-color 130ms ease,
      border-color 130ms ease,
      color 130ms ease,
      transform 130ms ease,
      box-shadow 130ms ease;
  }

  .menu-item[data-check-placement="start"] {
    justify-content: flex-start;
  }

  .menu-item[data-edge-start="true"] {
    border-start-start-radius: max(0px, calc(var(--ui-select-menu-radius) - 1px));
    border-start-end-radius: max(0px, calc(var(--ui-select-menu-radius) - 1px));
  }

  .menu-item[data-edge-end="true"] {
    border-end-start-radius: max(0px, calc(var(--ui-select-menu-radius) - 1px));
    border-end-end-radius: max(0px, calc(var(--ui-select-menu-radius) - 1px));
  }

  :host([option-border]) .menu-item {
    border-color: var(--ui-select-menu-item-border-color);
  }

  .menu-item:hover,
  .menu-item[data-active="true"] {
    background: color-mix(in srgb, var(--ui-select-accent) 12%, transparent);
    border-color: color-mix(in srgb, var(--ui-select-accent) 24%, transparent);
  }

  .menu-item[data-active="true"] {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-select-accent) 12%, transparent);
  }

  .menu-item:active {
    transform: translateY(1px);
    background: color-mix(in srgb, var(--ui-select-accent) 18%, transparent);
  }

  .menu-item[aria-selected="true"] {
    background: linear-gradient(180deg, color-mix(in srgb, var(--ui-select-accent) 18%, transparent) 0%, color-mix(in srgb, var(--ui-select-accent) 12%, transparent) 100%);
    border-color: color-mix(in srgb, var(--ui-select-accent) 30%, transparent);
    color: color-mix(in srgb, var(--ui-select-menu-color) 92%, var(--ui-select-accent));
  }

  .menu-item[aria-disabled="true"] {
    opacity: 0.52;
    cursor: not-allowed;
    transform: none;
  }

  .menu-item-label {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .menu-item-check {
    inline-size: 14px;
    block-size: 14px;
    display: inline-grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, currentColor 24%, transparent);
    background: transparent;
    opacity: 0;
    transition: opacity 130ms ease, background-color 130ms ease, border-color 130ms ease;
    flex: 0 0 auto;
  }

  .menu-item-check[hidden] {
    display: none;
  }

  .menu-item-check::before {
    content: "";
    inline-size: 6px;
    block-size: 6px;
    border-radius: 999px;
    background: currentColor;
  }

  .menu-item[aria-selected="true"] .menu-item-check {
    opacity: 1;
    background: color-mix(in srgb, var(--ui-select-accent) 84%, #ffffff);
    border-color: color-mix(in srgb, var(--ui-select-accent) 75%, transparent);
    color: var(--ui-color-primary-foreground, #ffffff);
  }

  .menu-empty {
    margin: 0;
    padding: 10px;
    color: var(--ui-select-muted);
    font-size: 12px;
    line-height: 1.4;
    text-align: center;
  }

  .error {
    margin: 0;
    color: var(--ui-select-error);
    font-size: 12px;
    line-height: 1.35;
  }

  :host([disabled]) .control,
  :host([loading]) .control {
    opacity: 0.62;
    filter: saturate(0.9);
    box-shadow: none;
  }

  :host([disabled]) .trigger,
  :host([loading]) .trigger {
    cursor: not-allowed;
  }

  :host([loading]) .indicator {
    opacity: 0;
  }

  :host([loading]) .spinner {
    opacity: 1;
  }

  :host([disabled]) .leading,
  :host([disabled]) .trailing,
  :host([disabled]) .indicator,
  :host([loading]) .leading,
  :host([loading]) .trailing,
  :host([loading]) .indicator {
    color: color-mix(in srgb, var(--ui-select-text) 38%, transparent);
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-select-min-height: 34px;
    --ui-select-padding-x: 10px;
    --ui-select-menu-gap: 6px;
    --ui-select-menu-item-height: 34px;
  }

  :host([size="sm"]) .trigger,
  :host([size="1"]) .trigger {
    font-size: 12px;
  }

  :host([size="sm"]) .menu-item,
  :host([size="1"]) .menu-item {
    font-size: 12px;
    padding: 8px 9px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-select-min-height: 46px;
    --ui-select-padding-x: 13px;
    --ui-select-menu-gap: 10px;
    --ui-select-menu-item-height: 42px;
  }

  :host([size="lg"]) .trigger,
  :host([size="3"]) .trigger {
    font-size: 15px;
  }

  :host([size="lg"]) .menu-item,
  :host([size="3"]) .menu-item {
    font-size: 14px;
    padding: 10px 12px;
  }

  :host([density="compact"]) .root {
    gap: 6px;
  }

  :host([density="comfortable"]) .root {
    gap: 10px;
  }

  :host([shape="square"]),
  :host([radius="none"]) {
    --ui-select-radius: 4px;
  }

  :host([shape="rounded"]) {
    --ui-select-radius: 10px;
  }

  :host([shape="pill"]),
  :host([radius="full"]) {
    --ui-select-radius: 999px;
  }

  :host([radius="large"]) {
    --ui-select-radius: 16px;
  }

  :host([elevation="none"]) {
    --ui-select-elevation: none;
  }

  :host([elevation="high"]) {
    --ui-select-elevation: 0 2px 4px rgba(2, 6, 23, 0.1), 0 16px 34px rgba(2, 6, 23, 0.14);
  }

  :host([variant="surface"]) {
    --ui-select-bg: var(--ui-color-surface-alt, #f8fafc);
    --ui-select-elevation: 0 1px 2px rgba(2, 6, 23, 0.05);
  }

  :host([variant="soft"]) {
    --ui-select-bg: color-mix(in srgb, var(--ui-select-accent) 8%, var(--ui-color-surface, #ffffff));
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-accent) 30%, var(--ui-color-border, #cbd5e1));
    --ui-select-menu-bg: color-mix(in srgb, var(--ui-select-accent) 5%, var(--ui-color-surface, #ffffff));
  }

  :host([variant="filled"]) {
    --ui-select-bg: color-mix(in srgb, var(--ui-select-text) 5%, var(--ui-color-surface, #ffffff));
    --ui-select-border: 1px solid transparent;
    --ui-select-elevation: none;
  }

  :host([variant="outline"]) {
    --ui-select-bg: transparent;
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-accent) 42%, var(--ui-color-border, #cbd5e1));
    --ui-select-elevation: none;
  }

  :host([variant="line"]) .control {
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  :host([variant="minimal"]) .control,
  :host([variant="ghost"]) .control {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
  }

  :host([variant="solid"]) {
    --ui-select-bg: var(--ui-select-accent);
    --ui-select-text: var(--ui-color-primary-foreground, #ffffff);
    --ui-select-label: var(--ui-color-primary-foreground, #ffffff);
    --ui-select-description: color-mix(in srgb, var(--ui-color-primary-foreground, #ffffff) 72%, transparent);
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-accent) 76%, #0f172a 24%);
    --ui-select-focus: color-mix(in srgb, #ffffff 72%, var(--ui-select-accent));
    --ui-select-indicator-color: color-mix(in srgb, #ffffff 88%, transparent);
    --ui-select-menu-bg: color-mix(in srgb, var(--ui-select-accent) 20%, #08111f 80%);
    --ui-select-menu-color: var(--ui-color-primary-foreground, #ffffff);
  }

  :host([variant="glass"]) {
    --ui-select-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 72%, transparent);
    --ui-select-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 50%, transparent);
    --ui-select-elevation: 0 8px 18px rgba(2, 6, 23, 0.1), 0 26px 52px rgba(2, 6, 23, 0.08);
    --ui-select-menu-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 80%, transparent);
  }

  :host([variant="glass"]) .control,
  :host([variant="glass"]) .menu {
    -webkit-backdrop-filter: saturate(1.08) blur(10px);
    backdrop-filter: saturate(1.08) blur(10px);
  }

  :host([variant="contrast"]) {
    --ui-select-bg: #0f172a;
    --ui-select-text: #e2e8f0;
    --ui-select-label: #e2e8f0;
    --ui-select-description: #93a4bd;
    --ui-select-border-color: #334155;
    --ui-select-focus: #93c5fd;
    --ui-select-indicator-color: #9fb3cf;
    --ui-select-elevation: 0 10px 30px rgba(2, 6, 23, 0.35);
    --ui-select-menu-bg: #0b1324;
    --ui-select-menu-color: #e2e8f0;
    --ui-select-menu-border-color: #334155;
  }

  :host([tone="success"]) {
    --ui-select-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-select-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-select-accent: var(--ui-color-danger, #dc2626);
  }

  :host([validation="success"]),
  :host([data-valid="true"]) {
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-success) 64%, transparent);
  }

  :host([validation="warning"]) {
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-warning) 62%, transparent);
  }

  :host([validation="error"]),
  :host([invalid]),
  :host([data-invalid="true"]) {
    --ui-select-border-color: color-mix(in srgb, var(--ui-select-error) 68%, transparent);
    --ui-select-label: var(--ui-select-error);
  }

  :host([validation="error"]) .control,
  :host([invalid]) .control,
  :host([data-invalid="true"]) .control {
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--ui-select-error) 18%, transparent),
      var(--ui-select-elevation);
  }

  :host([headless]) .root {
    display: none;
  }

  @keyframes ui-select-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes ui-select-menu-enter-bottom {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes ui-select-menu-enter-top {
    from {
      opacity: 0;
      transform: translateY(4px) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .indicator,
    .spinner,
    .trigger,
    .menu,
    .menu-item {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    :host {
      --ui-select-border: 2px solid var(--ui-select-border-color);
      --ui-select-elevation: none;
      --ui-select-menu-border: 2px solid var(--ui-select-menu-border-color);
      --ui-select-menu-shadow: none;
    }

    .control[data-open="true"],
    .control:focus-within {
      box-shadow: none;
      outline: 2px solid var(--ui-select-focus);
      outline-offset: 1px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-select-bg: Canvas;
      --ui-select-text: CanvasText;
      --ui-select-label: CanvasText;
      --ui-select-description: CanvasText;
      --ui-select-border-color: CanvasText;
      --ui-select-focus: Highlight;
      --ui-select-error: CanvasText;
      --ui-select-success: CanvasText;
      --ui-select-elevation: none;
      --ui-select-indicator-color: CanvasText;
      --ui-select-menu-bg: Canvas;
      --ui-select-menu-color: CanvasText;
      --ui-select-menu-border-color: CanvasText;
      --ui-select-menu-shadow: none;
    }

    .indicator::before {
      border-right-color: CanvasText;
      border-bottom-color: CanvasText;
    }
  }
`;

type SelectOption = {
  value: string;
  label: string;
  disabled: boolean;
  group: string;
};

type PanelPlacement = 'top' | 'bottom';

function isTruthyAttr(raw: string | null): boolean {
  if (raw == null) return false;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeLengthValue(raw: string | null): string | null {
  if (!raw) return null;
  const value = String(raw).trim();
  if (!value) return null;
  if (value === 'none') return '4px';
  if (value === 'full') return '999px';
  if (value === 'large') return '16px';
  if (/^-?\\d+(\\.\\d+)?$/.test(value)) return `${value}px`;
  return value;
}

const LIVE_ATTRS = new Set([
  'value',
  'disabled',
  'loading',
  'required',
  'placeholder',
  'name',
  'tabindex',
  'headless',
  'size',
  'variant',
  'tone',
  'density',
  'radius',
  'shape',
  'elevation',
  'option-border',
  'show-check',
  'check-placement',
  'label',
  'description',
  'error',
  'aria-label',
  'validation',
  'invalid',
  'data-invalid',
  'data-valid',
  'close-on-scroll'
]);

export class UISelect extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'disabled',
      'loading',
      'required',
      'placeholder',
      'name',
      'tabindex',
      'headless',
      'size',
      'variant',
      'tone',
      'density',
      'radius',
      'shape',
      'elevation',
      'option-border',
      'show-check',
      'check-placement',
      'label',
      'description',
      'error',
      'aria-label',
      'validation',
      'invalid',
      'data-invalid',
      'data-valid',
      'close-on-scroll'
    ];
  }

  private _controlEl: HTMLElement | null = null;
  private _triggerEl: HTMLButtonElement | null = null;
  private _valueEl: HTMLElement | null = null;
  private _panelEl: HTMLElement | null = null;
  private _menuEl: UIListbox | null = null;
  private _observer: MutationObserver | null = null;
  private _formUnregister: (() => void) | null = null;
  private _uid = Math.random().toString(36).slice(2, 8);
  private _options: SelectOption[] = [];
  private _menuItems: HTMLButtonElement[] = [];
  private _optionsFingerprint = '';
  private _open = false;
  private _activeIndex = -1;
  private _placement: PanelPlacement = 'bottom';

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
    this._onRootKeyDown = this._onRootKeyDown.bind(this);
    this._onRootPointerDown = this._onRootPointerDown.bind(this);
    this._onRootPointerMove = this._onRootPointerMove.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onDocumentPointerDown = this._onDocumentPointerDown.bind(this);
    this._onWindowResize = this._onWindowResize.bind(this);
    this._onWindowScroll = this._onWindowScroll.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.root.addEventListener('click', this._onRootClick);
    this.root.addEventListener('keydown', this._onRootKeyDown as EventListener);
    this.root.addEventListener('pointerdown', this._onRootPointerDown as EventListener);
    this.root.addEventListener('pointermove', this._onRootPointerMove as EventListener, { passive: true });
    this.root.addEventListener('slotchange', this._onSlotChange as EventListener);

    this._observer = new MutationObserver((records) => {
      const hasMeaningfulOptionMutation = records.some((record) => {
        if (!(record.target instanceof HTMLElement)) return record.type === 'childList';
        if (record.target === this) return record.type === 'childList';
        const tag = record.target.tagName.toLowerCase();
        return tag === 'option' || tag === 'optgroup';
      });

      if (!hasMeaningfulOptionMutation) return;
      const optionsChanged = this._syncOptionsData();
      if (optionsChanged && this._open) this._renderMenu();
    });

    this._observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['value', 'selected', 'disabled', 'label', 'slot']
    });

    this._attachFormRegistration();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClick);
    this.root.removeEventListener('keydown', this._onRootKeyDown as EventListener);
    this.root.removeEventListener('pointerdown', this._onRootPointerDown as EventListener);
    this.root.removeEventListener('pointermove', this._onRootPointerMove as EventListener);
    this.root.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._teardownOpenListeners();
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }
    super.disconnectedCallback();
  }

  protected override shouldRenderOnAttributeChange(name: string): boolean {
    return !LIVE_ATTRS.has(name);
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'name') this._attachFormRegistration();

    if (this._triggerEl && LIVE_ATTRS.has(name)) {
      if (name === 'value' || name === 'placeholder' || name === 'required') {
        this._syncOptionsData();
        if (this._open) this._renderMenu();
      }
      if ((name === 'show-check' || name === 'check-placement') && this._open) {
        this._renderMenu();
      }
      this._syncControlState();
      if (this.disabled && this._open) this._closeMenu({ restoreFocus: false });
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  get value(): string {
    return this.getAttribute('value') || '';
  }

  set value(next: string) {
    const normalized = String(next || '');
    if (normalized === this.value) return;
    this.setAttribute('value', normalized);
  }

  get disabled(): boolean {
    return isTruthyAttr(this.getAttribute('disabled')) || isTruthyAttr(this.getAttribute('loading'));
  }

  set disabled(next: boolean) {
    if (next) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get closeOnScroll(): boolean {
    return isTruthyAttr(this.getAttribute('close-on-scroll')) || !this.hasAttribute('close-on-scroll');
  }

  set closeOnScroll(next: boolean) {
    this.setAttribute('close-on-scroll', next ? 'true' : 'false');
  }

  get showCheck(): boolean {
    return isTruthyAttr(this.getAttribute('show-check'));
  }

  set showCheck(next: boolean) {
    if (next) this.setAttribute('show-check', 'true');
    else this.removeAttribute('show-check');
  }

  focus(options?: FocusOptions): void {
    if (this._triggerEl) {
      this._triggerEl.focus(options);
      return;
    }
    super.focus(options);
  }

  blur(): void {
    if (this._triggerEl) {
      this._triggerEl.blur();
      return;
    }
    super.blur();
  }

  private _onSlotChange(): void {
    this.requestRender();
  }

  private _onRootPointerDown(event: PointerEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.closest('.menu-item')) {
      event.preventDefault();
    }
  }

  private _onRootPointerMove(event: PointerEvent): void {
    if (!this._open) return;
    const target = event.target as HTMLElement | null;
    const item = target?.closest('.menu-item[data-index]') as HTMLButtonElement | null;
    if (!item) return;
    const index = Number(item.dataset.index || '-1');
    const option = this._options[index];
    if (!option || option.disabled || index === this._activeIndex) return;
    this._setActiveIndex(index);
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.closest('.trigger')) {
      if (this.disabled) return;
      if (this._open) this._closeMenu({ restoreFocus: false });
      else this._openMenu();
      return;
    }

    const item = target.closest('.menu-item[data-index]') as HTMLButtonElement | null;
    if (!item) return;

    const index = Number(item.dataset.index || '-1');
    const option = this._options[index];
    if (!option || option.disabled) return;
    this._applyValueFromUser(option.value);
    this._closeMenu();
  }

  private _onRootKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target || (target !== this._triggerEl && !target.closest('.menu'))) return;
    if (this.disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this._open) {
          this._openMenu();
        } else {
          this._moveActive(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this._open) {
          this._openMenu();
        } else {
          this._moveActive(-1);
        }
        break;
      case 'Home':
        if (!this._open) return;
        event.preventDefault();
        this._setActiveIndex(this._firstEnabledIndex());
        break;
      case 'End':
        if (!this._open) return;
        event.preventDefault();
        this._setActiveIndex(this._lastEnabledIndex());
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (!this._open) {
          this._openMenu();
          return;
        }
        this._selectActiveOption();
        break;
      }
      case 'Escape':
        if (!this._open) return;
        event.preventDefault();
        this._closeMenu();
        break;
      case 'Tab':
        if (this._open) this._closeMenu({ restoreFocus: false });
        break;
      default:
        break;
    }
  }

  private _onDocumentPointerDown(event: Event): void {
    if (!this._open) return;
    const path = typeof (event as { composedPath?: () => EventTarget[] }).composedPath === 'function'
      ? (event as { composedPath: () => EventTarget[] }).composedPath()
      : [];
    if (path.includes(this) || path.includes(this.root)) return;
    this._closeMenu({ restoreFocus: false });
  }

  private _onWindowResize(): void {
    if (!this._open) return;
    this._syncPanelPlacement();
  }

  private _onWindowScroll(event: Event): void {
    if (!this._open) return;
    const path = typeof (event as { composedPath?: () => EventTarget[] }).composedPath === 'function'
      ? (event as { composedPath: () => EventTarget[] }).composedPath()
      : [];
    if (path.includes(this) || path.includes(this.root)) return;
    if (this.closeOnScroll) {
      this._closeMenu({ restoreFocus: false });
      return;
    }
    this._syncPanelPlacement();
  }

  private _attachOpenListeners(): void {
    document.addEventListener('pointerdown', this._onDocumentPointerDown, true);
    window.addEventListener('resize', this._onWindowResize, { passive: true });
    window.addEventListener('scroll', this._onWindowScroll, true);
  }

  private _teardownOpenListeners(): void {
    document.removeEventListener('pointerdown', this._onDocumentPointerDown, true);
    window.removeEventListener('resize', this._onWindowResize);
    window.removeEventListener('scroll', this._onWindowScroll, true);
  }

  private _emitValue(eventName: 'input' | 'change', nextValue: string): void {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { value: nextValue },
        bubbles: true,
        composed: true
      })
    );
  }

  private _applyValueFromUser(nextValue: string): void {
    const current = this.getAttribute('value') || '';
    if (current === nextValue) return;
    this.setAttribute('value', nextValue);
    this._emitValue('input', nextValue);
    this._emitValue('change', nextValue);
  }

  private _attachFormRegistration(): void {
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }

    const name = this.getAttribute('name');
    if (!name) return;

    const rootNode = this.getRootNode();
    const rootHost = rootNode instanceof ShadowRoot ? (rootNode.host as HTMLElement | null) : null;
    const parentForm = rootHost?.closest?.('ui-form') || this.closest('ui-form');
    if (!parentForm || typeof (parentForm as any).registerField !== 'function') return;

    this._formUnregister = (parentForm as any).registerField(name, {
      name,
      getValue: () => this.value,
      setValue: (next: string) => {
        this.value = next;
      },
      validate: async () => {
        const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
        if (!required) return { valid: true };
        const valid = this.value.trim().length > 0;
        return { valid, message: valid ? undefined : 'This field is required.' };
      },
      setError: (message?: string) => {
        if (message) {
          this.setAttribute('validation', 'error');
          this.setAttribute('error', message);
        } else {
          if (this.getAttribute('validation') === 'error') this.removeAttribute('validation');
          this.removeAttribute('error');
        }
      }
    });
  }

  private _hasSlotContent(name: string): boolean {
    return !!this.querySelector(`[slot="${name}"]`);
  }

  private _setValueAttr(next: string): void {
    const normalized = String(next ?? '');
    if (this.getAttribute('value') === normalized) return;
    this.setAttribute('value', normalized);
  }

  private _buildOptionsFromChildren(): SelectOption[] {
    const options: SelectOption[] = [];

    const pushOption = (opt: HTMLOptionElement, group: string) => {
      const label = (opt.label || opt.textContent || opt.value || '').trim();
      const value = String(opt.value ?? '');
      options.push({
        value,
        label: label || value,
        disabled: !!opt.disabled,
        group
      });
    };

    const unnamedChildren = Array.from(this.children).filter((node) => {
      if (!(node instanceof HTMLElement)) return false;
      return !node.hasAttribute('slot');
    });

    unnamedChildren.forEach((node) => {
      const tag = node.tagName.toLowerCase();
      if (tag === 'option') {
        pushOption(node as HTMLOptionElement, '');
        return;
      }

      if (tag === 'optgroup') {
        const group = node as HTMLOptGroupElement;
        const groupLabel = (group.label || '').trim();
        Array.from(group.children).forEach((child) => {
          if (!(child instanceof HTMLOptionElement)) return;
          options.push({
            value: String(child.value ?? ''),
            label: (child.label || child.textContent || child.value || '').trim() || String(child.value ?? ''),
            disabled: !!child.disabled || !!group.disabled,
            group: groupLabel
          });
        });
      }
    });

    const placeholder = (this.getAttribute('placeholder') || '').trim();
    const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
    const hasExplicitEmptyValue = options.some((option) => option.value === '');

    if (placeholder && !required && !hasExplicitEmptyValue) {
      options.unshift({ value: '', label: placeholder, disabled: false, group: '' });
    }

    return options;
  }

  private _computeOptionsFingerprint(options: SelectOption[]): string {
    return options.map((option) => `${option.value}\u0001${option.label}\u0001${option.disabled ? '1' : '0'}\u0001${option.group}`).join('\u0002');
  }

  private _firstEnabledIndex(): number {
    return findFirstEnabledIndex(this._options, (option) => option.disabled);
  }

  private _lastEnabledIndex(): number {
    return findLastEnabledIndex(this._options, (option) => option.disabled);
  }

  private _selectedIndex(): number {
    return findIndexByValue(this._options, this.value, (option) => option.value);
  }

  private _checkPlacement(): 'start' | 'end' {
    return this.getAttribute('check-placement') === 'start' ? 'start' : 'end';
  }

  private _syncOptionsData(): boolean {
    const nextOptions = this._buildOptionsFromChildren();
    const nextFingerprint = this._computeOptionsFingerprint(nextOptions);
    const optionsChanged = nextFingerprint !== this._optionsFingerprint;

    this._options = nextOptions;
    this._optionsFingerprint = nextFingerprint;

    const current = this.getAttribute('value') || '';
    const hasValueAttr = this.hasAttribute('value');
    const hasMatch = this._options.some((option) => option.value === current);
    const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
    const firstEnabled = this._options.find((option) => !option.disabled)?.value || '';
    const fallback = !required && this._options.some((option) => option.value === '') ? '' : firstEnabled;

    if (!hasValueAttr) {
      this._setValueAttr(fallback);
    } else if (!hasMatch) {
      this._setValueAttr(fallback);
    }

    return optionsChanged;
  }

  private _currentDisplayText(): string {
    const value = this.value;
    const placeholder = (this.getAttribute('placeholder') || '').trim();
    if (value === '' && placeholder) return placeholder;
    const selected = this._options.find((option) => option.value === value);
    return selected?.label || value;
  }

  private _setActiveIndex(index: number): void {
    if (!this._menuEl) return;
    if (index === this._activeIndex) return;

    this._activeIndex = index;
    const item = index >= 0 ? this._menuItems[index] || null : null;
    this._menuEl.setActiveItem(item, {
      focus: false,
      owner: this._triggerEl,
      scroll: true
    });
  }

  private _moveActive(step: 1 | -1): void {
    if (!this._menuEl || !this._options.length) return;
    const current = this._activeIndex >= 0 ? this._menuItems[this._activeIndex] : null;
    const moved = this._menuEl.move(step, {
      current,
      focus: false,
      owner: this._triggerEl,
      scroll: true
    }) as HTMLButtonElement | null;
    if (!moved) return;
    const next = Number(moved.dataset.index || '-1');
    if (next >= 0) this._activeIndex = next;
  }

  private _selectActiveOption(): void {
    if (this._activeIndex < 0) return;
    const option = this._options[this._activeIndex];
    if (!option || option.disabled) return;
    this._applyValueFromUser(option.value);
    this._closeMenu();
  }

  private _renderMenu(): void {
    const menu = this._menuEl;
    if (!menu) return;

    menu.replaceChildren();
    this._menuItems = [];

    if (!this._options.length) {
      const empty = document.createElement('p');
      empty.className = 'menu-empty';
      empty.textContent = 'No options available';
      menu.appendChild(empty);
      menu.refresh();
      return;
    }

    let previousGroup = '__none__';
    this._options.forEach((option, index) => {
      if (option.group && option.group !== previousGroup) {
        const groupLabel = document.createElement('div');
        groupLabel.className = 'menu-group';
        groupLabel.setAttribute('role', 'presentation');
        groupLabel.textContent = option.group;
        menu.appendChild(groupLabel);
        previousGroup = option.group;
      }

      if (!option.group) previousGroup = '__none__';

      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'menu-item';
      item.id = `${this._uid}-opt-${index}`;
      item.setAttribute('role', 'option');
      item.setAttribute('data-index', String(index));
      item.setAttribute('data-value', option.value);
      item.setAttribute('aria-selected', option.value === this.value ? 'true' : 'false');
      item.setAttribute('aria-disabled', option.disabled ? 'true' : 'false');
      item.tabIndex = -1;
      if (option.disabled) item.disabled = true;

      const label = document.createElement('span');
      label.className = 'menu-item-label';
      label.textContent = option.label;

      const check = document.createElement('span');
      check.className = 'menu-item-check';
      check.setAttribute('aria-hidden', 'true');
      const showCheck = this.showCheck;
      const checkPlacement = this._checkPlacement();
      check.hidden = !showCheck;
      item.setAttribute('data-check-placement', checkPlacement);

      if (showCheck && checkPlacement === 'start') {
        item.append(check, label);
      } else {
        item.append(label, check);
      }
      menu.appendChild(item);
      this._menuItems.push(item);
    });

    const firstItem = this._menuItems[0] || null;
    const lastItem = this._menuItems[this._menuItems.length - 1] || null;
    if (firstItem) firstItem.setAttribute('data-edge-start', 'true');
    if (lastItem) lastItem.setAttribute('data-edge-end', 'true');

    menu.refresh();
    this._syncMenuSelectionState();
    this._syncPanelPlacement();
  }

  private _syncMenuSelectionState(): void {
    if (!this._menuEl) return;
    const selectedIndex = this._selectedIndex();

    this._menuItems.forEach((item) => {
      const index = Number(item.dataset.index || '-1');
      item.setAttribute('aria-selected', index === selectedIndex ? 'true' : 'false');
    });

    this._activeIndex = resolveListboxActiveIndex(this._options, {
      selectedIndex,
      getDisabled: (option) => option.disabled
    });
    const activeItem = this._activeIndex >= 0 ? this._menuItems[this._activeIndex] || null : null;
    this._menuEl.setActiveItem(activeItem, {
      focus: false,
      owner: this._triggerEl,
      scroll: true
    });
  }

  private _syncPanelPlacement(): void {
    const panel = this._panelEl;
    const control = this._controlEl;
    const menu = this._menuEl;
    if (!panel || !control || !menu || !this._open) return;

    const controlRect = control.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const belowSpace = Math.max(0, viewportHeight - controlRect.bottom - 12);
    const aboveSpace = Math.max(0, controlRect.top - 12);
    const menuHeight = Math.min(Math.max(menu.scrollHeight, menu.offsetHeight) + 4, 320);
    const placeTop = belowSpace < menuHeight && aboveSpace > belowSpace;

    this._placement = placeTop ? 'top' : 'bottom';
    panel.setAttribute('data-placement', this._placement);
    panel.style.setProperty('--ui-select-available-height', `${Math.floor(placeTop ? aboveSpace : belowSpace)}px`);
  }

  private _openMenu(): void {
    if (this._open || this.disabled) return;
    this._syncOptionsData();
    this._open = true;
    this._syncControlState();
    this._renderMenu();
    this._attachOpenListeners();
  }

  private _closeMenu(options: { restoreFocus?: boolean } = {}): void {
    if (!this._open) return;
    this._open = false;
    this._activeIndex = -1;
    this._teardownOpenListeners();
    this._syncControlState();

    if (options.restoreFocus !== false) {
      try {
        this._triggerEl?.focus({ preventScroll: true });
      } catch {
        this._triggerEl?.focus();
      }
    }
  }

  private _syncControlState(): void {
    const trigger = this._triggerEl;
    const control = this._controlEl;
    const valueEl = this._valueEl;
    const panel = this._panelEl;
    if (!trigger || !control || !valueEl || !panel) return;

    const labelAttr = this.getAttribute('label') || '';
    const descriptionAttr = this.getAttribute('description') || '';
    const errorAttr = this.getAttribute('error') || '';
    const ariaLabel = this.getAttribute('aria-label') || labelAttr || 'Select';
    const loading = isTruthyAttr(this.getAttribute('loading'));
    const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
    const tabindex = this.getAttribute('tabindex');
    const isInvalid =
      (this.hasAttribute('validation') && this.getAttribute('validation') === 'error') ||
      this.hasAttribute('invalid') ||
      this.getAttribute('data-invalid') === 'true';
    const customRadius = normalizeLengthValue(this.getAttribute('radius'));

    const labelEl = this.root.querySelector('.label') as HTMLElement | null;
    const labelText = this.root.querySelector('.label-text') as HTMLElement | null;
    const descriptionEl = this.root.querySelector('.description') as HTMLElement | null;
    const descriptionText = this.root.querySelector('.description-text') as HTMLElement | null;
    const errorEl = this.root.querySelector('.error') as HTMLElement | null;
    const errorText = this.root.querySelector('.error-text') as HTMLElement | null;
    const metaEl = this.root.querySelector('.meta') as HTMLElement | null;
    const requiredEl = this.root.querySelector('.required') as HTMLElement | null;

    const hasLabel = !!labelAttr || this._hasSlotContent('label');
    const hasDescription = !!descriptionAttr || this._hasSlotContent('description');
    const hasError = !!errorAttr || this._hasSlotContent('error');
    const hasLeading = this._hasSlotContent('leading');
    const hasTrailing = this._hasSlotContent('trailing');
    const placeholder = (this.getAttribute('placeholder') || '').trim();
    const isPlaceholderShown = !!placeholder && this.value === '';

    if (labelText) labelText.textContent = labelAttr;
    if (descriptionText) descriptionText.textContent = descriptionAttr;
    if (errorText) errorText.textContent = errorAttr;

    if (labelEl) labelEl.hidden = !hasLabel;
    if (descriptionEl) descriptionEl.hidden = !hasDescription;
    if (errorEl) errorEl.hidden = !hasError;
    if (metaEl) metaEl.hidden = !hasLabel && !hasDescription;
    if (requiredEl) requiredEl.hidden = !required;

    valueEl.textContent = this._currentDisplayText();
    control.setAttribute('data-open', this._open ? 'true' : 'false');
    control.setAttribute('data-placeholder-shown', isPlaceholderShown ? 'true' : 'false');
    control.setAttribute('data-has-leading', String(hasLeading));
    control.setAttribute('data-has-trailing', String(hasTrailing));

    trigger.disabled = this.disabled;
    trigger.setAttribute('aria-label', ariaLabel);
    trigger.setAttribute('aria-expanded', this._open ? 'true' : 'false');
    trigger.setAttribute('aria-busy', loading ? 'true' : 'false');
    trigger.setAttribute('aria-required', required ? 'true' : 'false');

    if (isInvalid) trigger.setAttribute('aria-invalid', 'true');
    else trigger.removeAttribute('aria-invalid');

    if (tabindex != null && !this.disabled) trigger.setAttribute('tabindex', tabindex);
    else if (!this.disabled) trigger.setAttribute('tabindex', '0');
    else trigger.setAttribute('tabindex', '-1');

    panel.hidden = !this._open;
    panel.setAttribute('data-placement', this._placement);
    if (this._open) trigger.setAttribute('aria-controls', `${this._uid}-listbox`);
    else trigger.removeAttribute('aria-controls');

    if (customRadius && !['none', 'full', 'large'].includes(this.getAttribute('radius') || '')) {
      this.style.setProperty('--ui-select-radius', customRadius);
    } else {
      this.style.removeProperty('--ui-select-radius');
    }

    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    this.setAttribute('aria-busy', loading ? 'true' : 'false');
    this.toggleAttribute('open', this._open);
    if (this._open) this._syncPanelPlacement();
  }

  protected override render(): void {
    const labelAttr = this.getAttribute('label') || '';
    const descriptionAttr = this.getAttribute('description') || '';
    const errorAttr = this.getAttribute('error') || '';
    const required = isTruthyAttr(this.getAttribute('required')) || this.hasAttribute('required');
    const ariaLabel = this.getAttribute('aria-label') || labelAttr || 'Select';

    const hasLabel = !!labelAttr || this._hasSlotContent('label');
    const hasDescription = !!descriptionAttr || this._hasSlotContent('description');
    const hasError = !!errorAttr || this._hasSlotContent('error');
    const hasLeading = this._hasSlotContent('leading');
    const hasTrailing = this._hasSlotContent('trailing');

    const labelId = `${this._uid}-label`;
    const descriptionId = `${this._uid}-description`;
    const errorId = `${this._uid}-error`;
    const triggerId = `${this._uid}-trigger`;
    const listboxId = `${this._uid}-listbox`;
    const describedBy = [hasDescription ? descriptionId : '', hasError ? errorId : ''].filter(Boolean).join(' ');

    this.setContent(`
      <style>${style}</style>
      <slot class="content-slot"></slot>
      <div class="root" part="root">
        <div class="meta" part="meta" ${hasLabel || hasDescription ? '' : 'hidden'}>
          <label class="label" part="label" id="${labelId}" for="${triggerId}" ${hasLabel ? '' : 'hidden'}>
            <slot name="label"><span class="label-text">${escapeHtml(labelAttr)}</span></slot>
            <span class="required" aria-hidden="true" ${required ? '' : 'hidden'}>*</span>
          </label>
          <p class="description" part="description" id="${descriptionId}" ${hasDescription ? '' : 'hidden'}>
            <slot name="description"><span class="description-text">${escapeHtml(descriptionAttr)}</span></slot>
          </p>
        </div>
        <div class="field-shell" part="field-shell">
          <div class="control" part="control" data-has-leading="${hasLeading}" data-has-trailing="${hasTrailing}" data-open="false">
            <span class="leading" part="leading" ${hasLeading ? '' : 'hidden'}>
              <slot name="leading"></slot>
            </span>
            <button
              id="${triggerId}"
              type="button"
              class="trigger native"
              part="trigger"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded="false"
              aria-label="${escapeHtml(ariaLabel)}"
              ${hasLabel ? `aria-labelledby="${labelId}"` : ''}
              ${describedBy ? `aria-describedby="${escapeHtml(describedBy)}"` : ''}
            >
              <span class="value" part="value"></span>
            </button>
            <span class="trailing" part="trailing" ${hasTrailing ? '' : 'hidden'}>
              <slot name="trailing"></slot>
            </span>
            <span class="indicator" part="indicator" aria-hidden="true"></span>
            <span class="spinner" part="spinner" aria-hidden="true"></span>
          </div>
          <div class="panel" part="panel" hidden data-placement="bottom">
            <ui-listbox
              id="${listboxId}"
              class="menu"
              role="listbox"
              item-selector=".menu-item[data-index]"
              item-role="option"
              active-attribute="data-active"
            ></ui-listbox>
          </div>
        </div>
        <p class="error" part="error" id="${errorId}" ${hasError ? '' : 'hidden'}>
          <slot name="error"><span class="error-text">${escapeHtml(errorAttr)}</span></slot>
        </p>
      </div>
    `);

    this._controlEl = this.root.querySelector('.control') as HTMLElement | null;
    this._triggerEl = this.root.querySelector('.trigger') as HTMLButtonElement | null;
    this._valueEl = this.root.querySelector('.value') as HTMLElement | null;
    this._panelEl = this.root.querySelector('.panel') as HTMLElement | null;
    this._menuEl = this.root.querySelector('.menu') as UIListbox | null;

    this._syncOptionsData();
    this._renderMenu();
    if (!this._open && this._panelEl) this._panelEl.hidden = true;
    this._syncControlState();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-select')) {
  customElements.define('ui-select', UISelect);
}

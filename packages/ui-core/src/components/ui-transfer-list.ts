import { ElementBase } from '../ElementBase';

type TransferOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

type TransferSelectionIndicator = 'checkbox' | 'tick' | 'none';

const style = `
  :host {
    --ui-transfer-accent: var(--ui-color-primary, #2563eb);
    --ui-transfer-text: var(--ui-color-text, #0f172a);
    --ui-transfer-muted: var(--ui-color-muted, #64748b);
    --ui-transfer-shell-bg: transparent;
    --ui-transfer-shell-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 84%, transparent);
    --ui-transfer-shell-border: 1px solid var(--ui-transfer-shell-border-color);
    --ui-transfer-shell-shadow: none;
    --ui-transfer-shell-backdrop: none;
    --ui-transfer-panel-bg: var(--ui-color-surface, #ffffff);
    --ui-transfer-panel-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    --ui-transfer-panel-border: 1px solid var(--ui-transfer-panel-border-color);
    --ui-transfer-panel-shadow: none;
    --ui-transfer-panel-backdrop: none;
    --ui-transfer-item-bg: color-mix(in srgb, var(--ui-transfer-panel-bg) 96%, transparent);
    --ui-transfer-item-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    --ui-transfer-item-border: 1px solid var(--ui-transfer-item-border-color);
    --ui-transfer-item-hover-bg: color-mix(in srgb, var(--ui-transfer-accent) 6%, var(--ui-transfer-panel-bg));
    --ui-transfer-item-hover-border-color: color-mix(in srgb, var(--ui-transfer-accent) 12%, var(--ui-transfer-item-border-color));
    --ui-transfer-item-selected-bg: color-mix(in srgb, var(--ui-transfer-accent) 11%, var(--ui-transfer-panel-bg));
    --ui-transfer-item-selected-border-color: color-mix(in srgb, var(--ui-transfer-accent) 28%, var(--ui-transfer-item-border-color));
    --ui-transfer-item-selected-shadow: 0 0 0 1px color-mix(in srgb, var(--ui-transfer-accent) 10%, transparent);
    --ui-transfer-action-bg: color-mix(in srgb, var(--ui-transfer-accent) 8%, var(--ui-transfer-panel-bg));
    --ui-transfer-action-color: var(--ui-transfer-text);
    --ui-transfer-action-border-color: color-mix(in srgb, var(--ui-transfer-accent) 18%, var(--ui-color-border, #cbd5e1));
    --ui-transfer-action-border: 1px solid var(--ui-transfer-action-border-color);
    --ui-transfer-action-shadow: none;
    --ui-transfer-action-hover-bg: color-mix(in srgb, var(--ui-transfer-accent) 14%, var(--ui-transfer-panel-bg));
    --ui-transfer-action-disabled-bg: color-mix(in srgb, var(--ui-transfer-panel-bg) 96%, transparent);
    --ui-transfer-action-disabled-color: color-mix(in srgb, var(--ui-transfer-muted) 72%, transparent);
    --ui-transfer-check-accent: var(--ui-transfer-accent);
    --ui-transfer-indicator-size: 18px;
    --ui-transfer-gap: 16px;
    --ui-transfer-shell-padding: 16px;
    --ui-transfer-panel-padding: 12px;
    --ui-transfer-panel-gap: 10px;
    --ui-transfer-panel-radius: 20px;
    --ui-transfer-shell-radius: calc(var(--ui-transfer-panel-radius) + 8px);
    --ui-transfer-item-radius: 14px;
    --ui-transfer-action-radius: 14px;
    --ui-transfer-label-size: 14px;
    --ui-transfer-label-line-height: 20px;
    --ui-transfer-description-size: 13px;
    --ui-transfer-description-line-height: 18px;
    --ui-transfer-title-size: 13px;
    --ui-transfer-title-line-height: 18px;
    --ui-transfer-summary-size: 12px;
    --ui-transfer-summary-line-height: 16px;
    --ui-transfer-item-title-size: 14px;
    --ui-transfer-item-title-line-height: 20px;
    --ui-transfer-item-description-size: 12px;
    --ui-transfer-item-description-line-height: 16px;
    --ui-transfer-button-size: 13px;
    --ui-transfer-button-line-height: 18px;
    --ui-transfer-icon-size: 18px;
    --ui-transfer-action-gap: 2px;
    --ui-transfer-action-padding-block: 10px;
    --ui-transfer-action-padding-inline: 14px;
    --ui-transfer-action-min-inline-size: 104px;
    --ui-transfer-action-compact-inline-size: 56px;
    --ui-transfer-action-min-block-size: 54px;
    --ui-transfer-action-icon-box-size: 20px;
    --ui-transfer-item-padding: 12px;
    --ui-transfer-item-gap: 12px;
    --ui-transfer-panel-min-height: 320px;
    display: block;
    min-inline-size: 0;
    box-sizing: border-box;
    color: var(--ui-transfer-text);
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    contain: layout style paint;
    content-visibility: auto;
    contain-intrinsic-size: 760px;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-transfer-gap: 12px;
    --ui-transfer-shell-padding: 12px;
    --ui-transfer-panel-padding: 10px;
    --ui-transfer-panel-gap: 8px;
    --ui-transfer-panel-radius: 16px;
    --ui-transfer-item-radius: 12px;
    --ui-transfer-action-radius: 12px;
    --ui-transfer-label-size: 13px;
    --ui-transfer-label-line-height: 18px;
    --ui-transfer-description-size: 12px;
    --ui-transfer-description-line-height: 16px;
    --ui-transfer-title-size: 12px;
    --ui-transfer-title-line-height: 16px;
    --ui-transfer-summary-size: 11px;
    --ui-transfer-summary-line-height: 15px;
    --ui-transfer-item-title-size: 13px;
    --ui-transfer-item-title-line-height: 18px;
    --ui-transfer-item-description-size: 11px;
    --ui-transfer-item-description-line-height: 15px;
    --ui-transfer-button-size: 12px;
    --ui-transfer-button-line-height: 16px;
    --ui-transfer-icon-size: 16px;
    --ui-transfer-action-gap: 2px;
    --ui-transfer-action-padding-block: 8px;
    --ui-transfer-action-padding-inline: 12px;
    --ui-transfer-action-min-inline-size: 92px;
    --ui-transfer-action-compact-inline-size: 44px;
    --ui-transfer-action-min-block-size: 44px;
    --ui-transfer-action-icon-box-size: 18px;
    --ui-transfer-item-padding: 10px;
    --ui-transfer-item-gap: 10px;
    --ui-transfer-panel-min-height: 280px;
  }

  :host([size="md"]),
  :host([size="2"]) {
    --ui-transfer-gap: 16px;
    --ui-transfer-shell-padding: 16px;
    --ui-transfer-panel-padding: 12px;
    --ui-transfer-panel-gap: 10px;
    --ui-transfer-panel-radius: 20px;
    --ui-transfer-item-radius: 14px;
    --ui-transfer-action-radius: 14px;
    --ui-transfer-label-size: 14px;
    --ui-transfer-label-line-height: 20px;
    --ui-transfer-description-size: 13px;
    --ui-transfer-description-line-height: 18px;
    --ui-transfer-title-size: 13px;
    --ui-transfer-title-line-height: 18px;
    --ui-transfer-summary-size: 12px;
    --ui-transfer-summary-line-height: 16px;
    --ui-transfer-item-title-size: 14px;
    --ui-transfer-item-title-line-height: 20px;
    --ui-transfer-item-description-size: 12px;
    --ui-transfer-item-description-line-height: 16px;
    --ui-transfer-button-size: 13px;
    --ui-transfer-button-line-height: 18px;
    --ui-transfer-icon-size: 18px;
    --ui-transfer-action-gap: 2px;
    --ui-transfer-action-padding-block: 10px;
    --ui-transfer-action-padding-inline: 14px;
    --ui-transfer-action-min-inline-size: 104px;
    --ui-transfer-action-compact-inline-size: 56px;
    --ui-transfer-action-min-block-size: 54px;
    --ui-transfer-action-icon-box-size: 20px;
    --ui-transfer-item-padding: 12px;
    --ui-transfer-item-gap: 12px;
    --ui-transfer-panel-min-height: 320px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-transfer-gap: 18px;
    --ui-transfer-shell-padding: 18px;
    --ui-transfer-panel-padding: 14px;
    --ui-transfer-panel-gap: 12px;
    --ui-transfer-panel-radius: 24px;
    --ui-transfer-item-radius: 16px;
    --ui-transfer-action-radius: 16px;
    --ui-transfer-label-size: 15px;
    --ui-transfer-label-line-height: 22px;
    --ui-transfer-description-size: 14px;
    --ui-transfer-description-line-height: 20px;
    --ui-transfer-title-size: 14px;
    --ui-transfer-title-line-height: 20px;
    --ui-transfer-summary-size: 13px;
    --ui-transfer-summary-line-height: 18px;
    --ui-transfer-item-title-size: 15px;
    --ui-transfer-item-title-line-height: 22px;
    --ui-transfer-item-description-size: 13px;
    --ui-transfer-item-description-line-height: 18px;
    --ui-transfer-button-size: 14px;
    --ui-transfer-button-line-height: 18px;
    --ui-transfer-icon-size: 20px;
    --ui-transfer-action-gap: 4px;
    --ui-transfer-action-padding-block: 12px;
    --ui-transfer-action-padding-inline: 16px;
    --ui-transfer-action-min-inline-size: 118px;
    --ui-transfer-action-compact-inline-size: 64px;
    --ui-transfer-action-min-block-size: 62px;
    --ui-transfer-action-icon-box-size: 24px;
    --ui-transfer-item-padding: 14px;
    --ui-transfer-item-gap: 14px;
    --ui-transfer-panel-min-height: 360px;
  }

  :host([tone="neutral"]) {
    --ui-transfer-accent: #334155;
  }

  :host([tone="brand"]),
  :host([tone="info"]) {
    --ui-transfer-accent: var(--ui-color-primary, #2563eb);
  }

  :host([tone="success"]) {
    --ui-transfer-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-transfer-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-transfer-accent: var(--ui-color-danger, #dc2626);
  }

  :host([variant="soft"]) {
    --ui-transfer-shell-bg: color-mix(in srgb, var(--ui-transfer-accent) 4%, transparent);
    --ui-transfer-panel-bg: color-mix(in srgb, var(--ui-transfer-accent) 5%, var(--ui-color-surface, #ffffff));
    --ui-transfer-panel-border-color: color-mix(in srgb, var(--ui-transfer-accent) 16%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="solid"]) {
    --ui-transfer-shell-bg: color-mix(in srgb, var(--ui-transfer-accent) 8%, transparent);
    --ui-transfer-shell-border-color: color-mix(in srgb, var(--ui-transfer-accent) 18%, var(--ui-color-border, #cbd5e1));
    --ui-transfer-panel-bg: color-mix(in srgb, var(--ui-transfer-accent) 12%, var(--ui-color-surface, #ffffff));
    --ui-transfer-panel-border-color: color-mix(in srgb, var(--ui-transfer-accent) 24%, var(--ui-color-border, #cbd5e1));
    --ui-transfer-panel-shadow:
      0 1px 3px rgba(15, 23, 42, 0.05),
      0 18px 36px color-mix(in srgb, var(--ui-transfer-accent) 8%, rgba(15, 23, 42, 0.06));
    --ui-transfer-action-bg: color-mix(in srgb, var(--ui-transfer-accent) 18%, var(--ui-transfer-panel-bg));
    --ui-transfer-action-hover-bg: color-mix(in srgb, var(--ui-transfer-accent) 24%, var(--ui-transfer-panel-bg));
  }

  :host([variant="glass"]) {
    --ui-transfer-shell-bg: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 82%, #ffffff 18%),
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 94%, transparent)
    );
    --ui-transfer-shell-backdrop: blur(18px);
    --ui-transfer-panel-bg: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 88%, #ffffff 12%),
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent)
    );
    --ui-transfer-panel-backdrop: blur(12px);
  }

  :host([variant="contrast"]) {
    --ui-transfer-text: #f8fafc;
    --ui-transfer-muted: rgba(226, 232, 240, 0.82);
    --ui-transfer-shell-bg: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-transfer-accent) 18%, #0f172a 82%),
      color-mix(in srgb, var(--ui-transfer-accent) 10%, #020617 90%)
    );
    --ui-transfer-shell-border-color: color-mix(in srgb, var(--ui-transfer-accent) 28%, rgba(248, 250, 252, 0.24));
    --ui-transfer-shell-shadow: 0 24px 54px rgba(2, 6, 23, 0.36);
    --ui-transfer-panel-bg: color-mix(in srgb, rgba(15, 23, 42, 0.92) 86%, var(--ui-transfer-accent) 14%);
    --ui-transfer-panel-border-color: color-mix(in srgb, var(--ui-transfer-accent) 20%, rgba(248, 250, 252, 0.16));
    --ui-transfer-item-bg: color-mix(in srgb, rgba(15, 23, 42, 0.74) 88%, transparent);
    --ui-transfer-item-border-color: rgba(148, 163, 184, 0.18);
    --ui-transfer-item-hover-bg: color-mix(in srgb, var(--ui-transfer-accent) 18%, rgba(15, 23, 42, 0.86));
    --ui-transfer-item-selected-bg: color-mix(in srgb, var(--ui-transfer-accent) 26%, rgba(15, 23, 42, 0.9));
    --ui-transfer-action-bg: color-mix(in srgb, var(--ui-transfer-accent) 24%, rgba(15, 23, 42, 0.92));
    --ui-transfer-action-color: #f8fafc;
    --ui-transfer-action-border-color: color-mix(in srgb, var(--ui-transfer-accent) 26%, rgba(248, 250, 252, 0.22));
    --ui-transfer-action-hover-bg: color-mix(in srgb, var(--ui-transfer-accent) 34%, rgba(15, 23, 42, 0.94));
    --ui-transfer-action-disabled-bg: rgba(15, 23, 42, 0.76);
    --ui-transfer-action-disabled-color: rgba(148, 163, 184, 0.74);
  }

  :host([variant="minimal"]) {
    --ui-transfer-shell-bg: transparent;
    --ui-transfer-shell-border: none;
    --ui-transfer-shell-shadow: none;
    --ui-transfer-panel-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 94%, transparent);
    --ui-transfer-panel-border-color: color-mix(in srgb, var(--ui-transfer-accent) 10%, transparent);
    --ui-transfer-panel-shadow: none;
    --ui-transfer-action-bg: transparent;
    --ui-transfer-action-border-color: color-mix(in srgb, var(--ui-transfer-accent) 16%, var(--ui-color-border, #cbd5e1));
    --ui-transfer-action-hover-bg: color-mix(in srgb, var(--ui-transfer-accent) 10%, transparent);
  }

  :host([elevation="none"]) {
    --ui-transfer-shell-shadow: none;
    --ui-transfer-panel-shadow: none;
    --ui-transfer-action-shadow: none;
  }

  :host([elevation="low"]) {
    --ui-transfer-shell-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 10px 20px rgba(15, 23, 42, 0.06);
    --ui-transfer-panel-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 10px 24px rgba(15, 23, 42, 0.08);
    --ui-transfer-action-shadow: 0 8px 18px color-mix(in srgb, var(--ui-transfer-accent) 8%, rgba(15, 23, 42, 0.08));
  }

  :host([elevation="high"]) {
    --ui-transfer-shell-shadow:
      0 2px 10px rgba(15, 23, 42, 0.08),
      0 24px 54px rgba(15, 23, 42, 0.14);
    --ui-transfer-panel-shadow:
      0 2px 10px rgba(15, 23, 42, 0.08),
      0 28px 60px rgba(15, 23, 42, 0.16);
    --ui-transfer-action-shadow: 0 14px 28px color-mix(in srgb, var(--ui-transfer-accent) 12%, rgba(15, 23, 42, 0.1));
  }

  :host([disabled]) {
    opacity: 0.68;
  }

  .root {
    display: grid;
    gap: 10px;
    min-inline-size: 0;
  }

  .label,
  .description,
  .error {
    margin: 0;
  }

  .label {
    font-size: var(--ui-transfer-label-size);
    line-height: var(--ui-transfer-label-line-height);
    font-weight: 700;
    color: var(--ui-transfer-text);
  }

  .description,
  .error {
    font-size: var(--ui-transfer-description-size);
    line-height: var(--ui-transfer-description-line-height);
    color: var(--ui-transfer-muted);
  }

  .error {
    color: var(--ui-color-danger, #dc2626);
    font-weight: 600;
  }

  .shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: var(--ui-transfer-gap);
    align-items: stretch;
    padding: var(--ui-transfer-shell-padding);
    border: var(--ui-transfer-shell-border);
    border-radius: var(--ui-transfer-shell-radius);
    background: var(--ui-transfer-shell-bg);
    box-shadow: var(--ui-transfer-shell-shadow);
    backdrop-filter: var(--ui-transfer-shell-backdrop);
    min-inline-size: 0;
  }

  .panel {
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: var(--ui-transfer-panel-gap);
    min-block-size: var(--ui-transfer-panel-min-height);
    min-inline-size: 0;
    padding: var(--ui-transfer-panel-padding);
    border: var(--ui-transfer-panel-border);
    border-radius: var(--ui-transfer-panel-radius);
    background: var(--ui-transfer-panel-bg);
    box-shadow: var(--ui-transfer-panel-shadow);
    backdrop-filter: var(--ui-transfer-panel-backdrop);
  }

  .panel-header {
    display: grid;
    gap: 6px;
    min-inline-size: 0;
  }

  .panel-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-inline-size: 0;
  }

  .panel-title {
    min-inline-size: 0;
    font-size: var(--ui-transfer-title-size);
    line-height: var(--ui-transfer-title-line-height);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ui-transfer-muted);
  }

  .panel-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 28px;
    min-block-size: 24px;
    padding-inline: 8px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-transfer-accent) 12%, transparent);
    color: color-mix(in srgb, var(--ui-transfer-accent) 76%, var(--ui-transfer-text));
    font-size: var(--ui-transfer-summary-size);
    line-height: 1;
    font-weight: 700;
  }

  .panel-help,
  .summary,
  .empty {
    font-size: var(--ui-transfer-summary-size);
    line-height: var(--ui-transfer-summary-line-height);
    color: var(--ui-transfer-muted);
  }

  .list {
    display: grid;
    align-content: start;
    gap: 6px;
    overflow: auto;
    min-block-size: 0;
    min-inline-size: 0;
  }

  .item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: var(--ui-transfer-item-gap);
    align-items: center;
    min-inline-size: 0;
    padding: var(--ui-transfer-item-padding);
    border: var(--ui-transfer-item-border);
    border-radius: var(--ui-transfer-item-radius);
    background: var(--ui-transfer-item-bg);
    cursor: pointer;
    user-select: none;
    transition:
      background 160ms ease,
      border-color 160ms ease,
      box-shadow 160ms ease,
      transform 160ms ease;
  }

  .item:hover {
    background: var(--ui-transfer-item-hover-bg);
    border-color: var(--ui-transfer-item-hover-border-color);
  }

  .item:focus-visible {
    outline: none;
    border-color: color-mix(in srgb, var(--ui-transfer-accent) 26%, var(--ui-transfer-item-border-color));
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-transfer-accent) 14%, transparent),
      var(--ui-transfer-item-selected-shadow);
  }

  .item[data-selected="true"] {
    background: var(--ui-transfer-item-selected-bg);
    border-color: var(--ui-transfer-item-selected-border-color);
    box-shadow: var(--ui-transfer-item-selected-shadow);
  }

  .item[aria-disabled="true"] {
    opacity: 0.54;
    pointer-events: none;
  }

  .indicator {
    display: inline-grid;
    place-items: center;
    inline-size: var(--ui-transfer-indicator-size);
    block-size: var(--ui-transfer-indicator-size);
    align-self: center;
    justify-self: center;
    flex-shrink: 0;
  }

  .indicator-box {
    display: inline-grid;
    place-items: center;
    inline-size: 100%;
    block-size: 100%;
    border-radius: 6px;
    border: 1.5px solid color-mix(in srgb, var(--ui-transfer-check-accent) 24%, var(--ui-color-border, #cbd5e1));
    background: color-mix(in srgb, var(--ui-transfer-panel-bg) 96%, transparent);
    transition:
      background 160ms ease,
      border-color 160ms ease,
      box-shadow 160ms ease;
  }

  .indicator-mark {
    font-size: 12px;
    line-height: 1;
    font-weight: 800;
    color: color-mix(in srgb, var(--ui-transfer-check-accent) 86%, var(--ui-transfer-text));
    opacity: 0;
    transform: scale(0.85);
    transition:
      opacity 140ms ease,
      transform 140ms ease;
  }

  .item[data-selected="true"] .indicator-box {
    background: color-mix(in srgb, var(--ui-transfer-check-accent) 16%, var(--ui-transfer-panel-bg));
    border-color: color-mix(in srgb, var(--ui-transfer-check-accent) 42%, var(--ui-color-border, #cbd5e1));
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--ui-transfer-check-accent) 10%, transparent);
  }

  .item[data-selected="true"] .indicator-mark {
    opacity: 1;
    transform: scale(1);
  }

  :host([selection-indicator="tick"]) .indicator-box {
    border: none;
    background: transparent;
    box-shadow: none;
  }

  :host([selection-indicator="tick"]) .indicator-mark {
    font-size: 15px;
    color: color-mix(in srgb, var(--ui-transfer-check-accent) 88%, var(--ui-transfer-text));
  }

  :host([selection-indicator="tick"]) .item[data-selected="false"] .indicator-mark {
    opacity: 0.2;
    transform: scale(0.9);
  }

  :host([selection-indicator="none"]) .item {
    grid-template-columns: minmax(0, 1fr);
  }

  :host([selection-indicator="none"]) .indicator {
    display: none;
  }

  .item-copy {
    min-inline-size: 0;
    align-self: center;
  }

  .item-title {
    display: block;
    min-inline-size: 0;
    font-size: var(--ui-transfer-item-title-size);
    line-height: var(--ui-transfer-item-title-line-height);
    font-weight: 600;
    color: var(--ui-transfer-text);
  }

  .item-description {
    display: block;
    margin-top: 3px;
    min-inline-size: 0;
    font-size: var(--ui-transfer-item-description-size);
    line-height: var(--ui-transfer-item-description-line-height);
    color: var(--ui-transfer-muted);
  }

  .actions {
    display: grid;
    align-content: center;
    gap: 10px;
  }

  .move-btn {
    appearance: none;
    display: inline-grid;
    justify-items: center;
    align-content: center;
    justify-content: center;
    place-items: center;
    text-align: center;
    gap: var(--ui-transfer-action-gap);
    min-inline-size: var(--ui-transfer-action-min-inline-size);
    min-block-size: var(--ui-transfer-action-min-block-size);
    padding: var(--ui-transfer-action-padding-block) var(--ui-transfer-action-padding-inline);
    border: var(--ui-transfer-action-border);
    border-radius: var(--ui-transfer-action-radius);
    background: var(--ui-transfer-action-bg);
    color: var(--ui-transfer-action-color);
    box-shadow: var(--ui-transfer-action-shadow);
    cursor: pointer;
    transition:
      background 160ms ease,
      border-color 160ms ease,
      transform 160ms ease,
      box-shadow 160ms ease;
  }

  .move-btn[data-compact="true"] {
    min-inline-size: var(--ui-transfer-action-compact-inline-size);
    padding-inline: max(10px, calc(var(--ui-transfer-action-padding-inline) - 2px));
  }

  .move-btn:hover:not(:disabled) {
    background: var(--ui-transfer-action-hover-bg);
    transform: translateY(-1px);
  }

  .move-btn:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-transfer-accent) 16%, transparent),
      var(--ui-transfer-action-shadow);
  }

  .move-btn:disabled {
    background: var(--ui-transfer-action-disabled-bg);
    color: var(--ui-transfer-action-disabled-color);
    border-color: color-mix(in srgb, var(--ui-transfer-action-border-color) 68%, transparent);
    box-shadow: none;
    cursor: not-allowed;
  }

  .move-btn-icon {
    display: inline-grid;
    place-items: center;
    inline-size: var(--ui-transfer-action-icon-box-size);
    block-size: var(--ui-transfer-action-icon-box-size);
    line-height: 0;
  }

  .move-btn-icon svg {
    inline-size: var(--ui-transfer-icon-size);
    block-size: var(--ui-transfer-icon-size);
    display: block;
  }

  .move-btn-text {
    font-size: var(--ui-transfer-button-size);
    line-height: var(--ui-transfer-button-line-height);
    font-weight: 700;
  }

  .move-btn-count {
    font-size: var(--ui-transfer-summary-size);
    line-height: 1;
    opacity: 0.78;
  }

  :host([disabled]) .item,
  :host([disabled]) .move-btn {
    pointer-events: none;
  }

  @media (max-width: 760px) {
    .shell {
      grid-template-columns: minmax(0, 1fr);
    }

    .actions {
      grid-auto-flow: column;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .move-btn {
      min-inline-size: 0;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseOptions(value: string | null): TransferOption[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    const output: TransferOption[] = [];
    parsed.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;
      const next: TransferOption = {
        value: String((entry as any).value ?? ''),
        label: String((entry as any).label ?? (entry as any).value ?? ''),
        disabled: !!(entry as any).disabled
      };
      if ((entry as any).description) next.description = String((entry as any).description);
      if (!next.value) return;
      output.push(next);
    });
    return output;
  } catch {
    return [];
  }
}

function parseValues(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((entry) => String(entry)) : [];
  } catch {
    return [];
  }
}

function pruneSelection(source: Set<string>, allowed: Set<string>): Set<string> {
  return new Set(Array.from(source).filter((value) => allowed.has(value)));
}

function getSelectionIndicator(value: string | null): TransferSelectionIndicator {
  if (value === 'tick' || value === 'none') return value;
  return 'checkbox';
}

function parseBooleanAttribute(value: string | null, fallback: boolean): boolean {
  if (value == null) return fallback;
  if (value === '' || value === 'true' || value === '1' || value === 'yes') return true;
  if (value === 'false' || value === '0' || value === 'no') return false;
  return fallback;
}

function renderActionChevron(direction: 'left' | 'right'): string {
  const path = direction === 'right' ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true"><path d="${path}"/></svg>`;
}

export class UITransferList extends ElementBase {
  static get observedAttributes(): string[] {
    return [
      'options',
      'value',
      'label',
      'description',
      'error',
      'name',
      'disabled',
      'variant',
      'tone',
      'size',
      'radius',
      'elevation',
      'available-label',
      'selected-label',
      'available-empty-label',
      'selected-empty-label',
      'selection-indicator',
      'add-action-label',
      'remove-action-label',
      'show-action-labels',
      'show-action-counts',
      'show-panel-counts'
    ];
  }

  private _options: TransferOption[] = [];
  private _value: string[] = [];
  private _selectedAvailable = new Set<string>();
  private _selectedChosen = new Set<string>();
  private _formUnregister: (() => void) | null = null;
  private _suppressValueAttr = false;

  get value(): string[] {
    return [...this._value];
  }

  set value(next: string[]) {
    this._applyValue(next, 'api');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._registerWithForm();
  }

  override disconnectedCallback(): void {
    if (this._formUnregister) this._formUnregister();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'options') this._options = parseOptions(newValue);
    if (name === 'value' && !this._suppressValueAttr) this._value = parseValues(newValue);
    if (name === 'name' && this.isConnected) this._registerWithForm();
    if (name === 'disabled') {
      this._selectedAvailable.clear();
      this._selectedChosen.clear();
    }
    if (this.isConnected) this.requestRender();
  }

  protected render(): void {
    if (!this._options.length) this._options = parseOptions(this.getAttribute('options'));
    if (!this._value.length && this.getAttribute('value')) this._value = parseValues(this.getAttribute('value'));

    const chosen = new Set(this._value);
    const available = this._options.filter((option) => !chosen.has(option.value));
    const selected = this._options.filter((option) => chosen.has(option.value));
    const availableValues = new Set(available.map((option) => option.value));
    const chosenValues = new Set(selected.map((option) => option.value));
    this._selectedAvailable = pruneSelection(this._selectedAvailable, availableValues);
    this._selectedChosen = pruneSelection(this._selectedChosen, chosenValues);

    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const error = this.getAttribute('error') || '';
    const availableLabel = this.getAttribute('available-label') || 'Available';
    const selectedLabel = this.getAttribute('selected-label') || 'Selected';
    const availableEmptyLabel = this.getAttribute('available-empty-label') || 'No items available to add.';
    const selectedEmptyLabel = this.getAttribute('selected-empty-label') || 'No items selected yet.';
    const selectionIndicator = getSelectionIndicator(this.getAttribute('selection-indicator'));
    const addActionLabel = this.getAttribute('add-action-label') || 'Add selected';
    const removeActionLabel = this.getAttribute('remove-action-label') || 'Remove selected';
    const showActionLabels = parseBooleanAttribute(this.getAttribute('show-action-labels'), true);
    const showActionCounts = parseBooleanAttribute(this.getAttribute('show-action-counts'), true);
    const showPanelCounts = parseBooleanAttribute(this.getAttribute('show-panel-counts'), true);
    const radius = this.getAttribute('radius');
    const rootStyle = radius ? ` style="--ui-transfer-panel-radius:${escapeHtml(radius)};"` : '';

    const renderIndicator = () => {
      if (selectionIndicator === 'none') return '';
      return `<span class="indicator" part="indicator" aria-hidden="true"><span class="indicator-box"><span class="indicator-mark">✓</span></span></span>`;
    };
    const renderActionLabel = (label: string) => (showActionLabels ? `<span class="move-btn-text">${escapeHtml(label)}</span>` : '');
    const renderActionCount = (count: number) => (showActionCounts ? `<span class="move-btn-count">${count}</span>` : '');

    const availableItems = available.length
      ? available
          .map(
            (option) => `<div
              class="item"
              part="item available-item"
              role="option"
              data-side="available"
              data-value="${escapeHtml(option.value)}"
              data-selected="${this._selectedAvailable.has(option.value)}"
              aria-selected="${this._selectedAvailable.has(option.value) ? 'true' : 'false'}"
              aria-disabled="${option.disabled ? 'true' : 'false'}"
              tabindex="${option.disabled ? '-1' : '0'}"
            >
              ${renderIndicator()}
              <div class="item-copy">
                <span class="item-title">${escapeHtml(option.label)}</span>
                ${option.description ? `<span class="item-description">${escapeHtml(option.description)}</span>` : ''}
              </div>
            </div>`
          )
          .join('')
      : `<div class="empty" part="empty">${escapeHtml(availableEmptyLabel)}</div>`;

    const selectedItems = selected.length
      ? selected
          .map(
            (option) => `<div
              class="item"
              part="item selected-item"
              role="option"
              data-side="chosen"
              data-value="${escapeHtml(option.value)}"
              data-selected="${this._selectedChosen.has(option.value)}"
              aria-selected="${this._selectedChosen.has(option.value) ? 'true' : 'false'}"
              aria-disabled="${option.disabled ? 'true' : 'false'}"
              tabindex="${option.disabled ? '-1' : '0'}"
            >
              ${renderIndicator()}
              <div class="item-copy">
                <span class="item-title">${escapeHtml(option.label)}</span>
                ${option.description ? `<span class="item-description">${escapeHtml(option.description)}</span>` : ''}
              </div>
            </div>`
          )
          .join('')
      : `<div class="empty" part="empty">${escapeHtml(selectedEmptyLabel)}</div>`;

    this.setContent(`
      <style>${style}</style>
      <div class="root"${rootStyle} part="root">
        ${label ? `<p class="label" part="label">${escapeHtml(label)}</p>` : ''}
        ${description ? `<p class="description" part="description">${escapeHtml(description)}</p>` : ''}
        <div class="shell" part="shell">
          <section class="panel" part="panel panel-available">
            <div class="panel-header" part="panel-header">
              <div class="panel-heading">
                <div class="panel-title">${escapeHtml(availableLabel)}</div>
                ${showPanelCounts ? `<span class="panel-count" part="count">${available.length}</span>` : ''}
              </div>
              <div class="panel-help">Choose entries to move into the selected list.</div>
            </div>
            <div class="list" part="list available-list" data-list="available" role="listbox" aria-multiselectable="true">${availableItems}</div>
            <div class="summary" part="summary">${available.length} available</div>
          </section>
          <div class="actions" part="actions">
            <button class="move-btn" part="action-button action-add" data-compact="${!showActionLabels && !showActionCounts}" data-action="add" type="button"${this._selectedAvailable.size ? '' : ' disabled'}>
              <span class="move-btn-icon" aria-hidden="true">${renderActionChevron('right')}</span>
              ${renderActionLabel(addActionLabel)}
              ${renderActionCount(this._selectedAvailable.size || 0)}
            </button>
            <button class="move-btn" part="action-button action-remove" data-compact="${!showActionLabels && !showActionCounts}" data-action="remove" type="button"${this._selectedChosen.size ? '' : ' disabled'}>
              <span class="move-btn-icon" aria-hidden="true">${renderActionChevron('left')}</span>
              ${renderActionLabel(removeActionLabel)}
              ${renderActionCount(this._selectedChosen.size || 0)}
            </button>
          </div>
          <section class="panel" part="panel panel-selected">
            <div class="panel-header" part="panel-header">
              <div class="panel-heading">
                <div class="panel-title">${escapeHtml(selectedLabel)}</div>
                ${showPanelCounts ? `<span class="panel-count" part="count">${selected.length}</span>` : ''}
              </div>
              <div class="panel-help">Use the remove action to send items back.</div>
            </div>
            <div class="list" part="list selected-list" data-list="chosen" role="listbox" aria-multiselectable="true">${selectedItems}</div>
            <div class="summary" part="summary">${selected.length} selected</div>
          </section>
        </div>
        ${error ? `<p class="error" part="error">${escapeHtml(error)}</p>` : ''}
      </div>
    `);

    this.root.querySelectorAll('.item').forEach((item) => item.addEventListener('click', (event) => this._toggleItem(event)));
    this.root.querySelectorAll('.item').forEach((item) => item.addEventListener('keydown', (event) => this._onItemKeyDown(event as KeyboardEvent)));
    this.root.querySelectorAll('.move-btn').forEach((button) => button.addEventListener('click', (event) => this._move(event)));
  }

  private _toggleItem(event: Event): void {
    if (this.hasAttribute('disabled')) return;
    const item = event.currentTarget as HTMLElement;
    const side = item.getAttribute('data-side');
    const value = item.getAttribute('data-value') || '';
    if (!value) return;
    const targetSet = side === 'chosen' ? this._selectedChosen : this._selectedAvailable;
    if (targetSet.has(value)) targetSet.delete(value);
    else targetSet.add(value);

    item.setAttribute('data-selected', targetSet.has(value) ? 'true' : 'false');
    item.setAttribute('aria-selected', targetSet.has(value) ? 'true' : 'false');
    this._syncActionButtons();
  }

  private _onItemKeyDown(event: KeyboardEvent): void {
    const item = event.currentTarget as HTMLElement;
    const side = item.getAttribute('data-side');
    if (!side) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._toggleItem(event);
      return;
    }

    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    const list = this.root.querySelector(`[data-list="${side}"]`);
    const items = Array.from(list?.querySelectorAll('.item[tabindex="0"]') || []) as HTMLElement[];
    if (!items.length) return;
    const currentIndex = items.indexOf(item);

    if (event.key === 'Home') {
      items[0]?.focus();
      return;
    }
    if (event.key === 'End') {
      items[items.length - 1]?.focus();
      return;
    }

    const nextIndex = event.key === 'ArrowDown' ? Math.min(items.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
    items[nextIndex]?.focus();
  }

  private _move(event: Event): void {
    if (this.hasAttribute('disabled')) return;
    const action = (event.currentTarget as HTMLElement).getAttribute('data-action');
    if (action === 'add') {
      const next = [...this._value, ...Array.from(this._selectedAvailable).filter((value) => !this._value.includes(value))];
      this._selectedAvailable.clear();
      this._applyValue(next, 'transfer-right');
      return;
    }
    if (action === 'remove') {
      const remove = new Set(this._selectedChosen);
      const next = this._value.filter((value) => !remove.has(value));
      this._selectedChosen.clear();
      this._applyValue(next, 'transfer-left');
    }
  }

  private _applyValue(next: string[], source: string): void {
    const knownValues = new Set(this._options.map((option) => option.value));
    const deduped = Array.from(new Set(next.filter((entry) => entry && (knownValues.size === 0 || knownValues.has(entry)))));
    const previousValue = [...this._value];
    this._value = deduped;
    this._suppressValueAttr = true;
    try {
      if (deduped.length) this.setAttribute('value', JSON.stringify(deduped));
      else this.removeAttribute('value');
    } finally {
      this._suppressValueAttr = false;
    }
    if (deduped.length > 0) this.removeAttribute('invalid');
    this.requestRender();
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: [...this._value],
          previousValue,
          selectedItems: this._options.filter((option) => this._value.includes(option.value)),
          source
        },
        bubbles: true,
        composed: true
      })
    );
  }

  private _syncActionButtons(): void {
    const add = this.root.querySelector('[data-action="add"]') as HTMLButtonElement | null;
    const remove = this.root.querySelector('[data-action="remove"]') as HTMLButtonElement | null;
    if (add) {
      add.disabled = this._selectedAvailable.size === 0;
      const count = add.querySelector('.move-btn-count');
      if (count) count.textContent = String(this._selectedAvailable.size);
    }
    if (remove) {
      remove.disabled = this._selectedChosen.size === 0;
      const count = remove.querySelector('.move-btn-count');
      if (count) count.textContent = String(this._selectedChosen.size);
    }
  }

  private _registerWithForm(): void {
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }
    try {
      const rootNode = this.getRootNode() as Document | ShadowRoot;
      const host = (rootNode as ShadowRoot).host as HTMLElement | undefined;
      const formFromHost = host?.closest?.('ui-form') || null;
      const parentForm = formFromHost || this.closest('ui-form');
      const name = this.getAttribute('name');
      if (parentForm && typeof (parentForm as any).registerField === 'function' && name) {
        this._formUnregister = (parentForm as any).registerField(name, {
          name,
          getValue: () => [...this._value],
          setValue: (next: any) => {
            const values = Array.isArray(next) ? next.map((entry) => String(entry)) : [];
            this._applyValue(values, 'api');
          },
          validate: async () => ({ valid: !this.hasAttribute('required') || this._value.length > 0, message: 'Select at least one item.' }),
          setError: (message?: string) => {
            if (message) {
              this.setAttribute('error', message);
              this.setAttribute('invalid', '');
            } else {
              this.removeAttribute('error');
              this.removeAttribute('invalid');
            }
            this.requestRender();
          }
        });
      }
    } catch {}
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-transfer-list': UITransferList;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-transfer-list')) {
  customElements.define('ui-transfer-list', UITransferList);
}

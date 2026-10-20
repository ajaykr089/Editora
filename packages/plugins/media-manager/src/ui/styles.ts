/** The stylesheet for the media dialogs, the selection frame and the floating toolbar. Injected once, on first use. */

export const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark';

export const injectMediaDialogStyles = (): void => {
  if (typeof document === 'undefined' || document.getElementById('rte-media-dialog-styles')) return;

  const style = document.createElement('style');
  style.id = 'rte-media-dialog-styles';
  style.textContent = `
    .rte-media-overlay {
      --rte-media-overlay-bg: rgba(15, 23, 36, 0.56);
      --rte-media-bg: #ffffff;
      --rte-media-text: #101828;
      --rte-media-muted: #5f6b7d;
      --rte-media-border: #d6dbe4;
      --rte-media-surface: #f7f9fc;
      --rte-media-surface-hover: #eef2f7;
      --rte-media-accent: #1560e8;
      --rte-media-primary: #101828;
      --rte-media-primary-hover: #2a3345;
      --rte-media-primary-text: #ffffff;
      --rte-media-accent-hover: #165fd6;
      --rte-media-danger: #dc3545;
      --rte-media-danger-hover: #b92735;
      --rte-media-danger-text: #b92735;
      --rte-media-ring: rgba(31, 117, 254, 0.18);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--rte-media-overlay-bg);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      padding: 16px;
      box-sizing: border-box;
    }

    .rte-media-overlay.rte-ui-theme-dark {
      --rte-media-overlay-bg: rgba(2, 8, 20, 0.72);
      --rte-media-bg: #202938;
      --rte-media-text: #e8effc;
      --rte-media-muted: #a5b1c5;
      --rte-media-border: #49566c;
      --rte-media-surface: #2a3444;
      --rte-media-surface-hover: #344256;
      --rte-media-accent: #1f6feb;
      --rte-media-accent-hover: #4598f4;
      --rte-media-primary: #e8effc;
      --rte-media-primary-hover: #ffffff;
      --rte-media-primary-text: #101828;
      --rte-media-danger: #ff7b72;
      --rte-media-danger-hover: #ff645b;
      --rte-media-danger-text: #ffa39d;
      --rte-media-ring: rgba(88, 166, 255, 0.22);
    }

    .rte-media-dialog {
      width: min(92vw, 640px);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--rte-media-bg);
      color: var(--rte-media-text);
      border: 1px solid var(--rte-media-border);
      border-radius: 12px;
      box-shadow: 0 24px 48px rgba(10, 15, 24, 0.28);
    }

    .rte-media-dialog.rte-media-dialog-compact {
      width: min(92vw, 520px);
    }

    .rte-media-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--rte-media-border);
      background: linear-gradient(180deg, rgba(127, 154, 195, 0.08) 0%, rgba(127, 154, 195, 0) 100%);
    }

    .rte-media-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--rte-media-text);
    }

    .rte-media-close-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--rte-media-muted);
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
      transition: background-color 0.16s ease, color 0.16s ease;
    }

    .rte-media-close-btn:hover {
      background: var(--rte-media-surface-hover);
      color: var(--rte-media-text);
    }

    .rte-media-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid var(--rte-media-border);
      gap: 0;
    }

    .rte-media-tab {
      border: none;
      border-right: 1px solid var(--rte-media-border);
      padding: 12px 14px;
      background: var(--rte-media-surface);
      color: var(--rte-media-muted);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.16s ease, color 0.16s ease;
    }

    .rte-media-tab:last-child {
      border-right: none;
    }

    .rte-media-tab:hover {
      background: var(--rte-media-surface-hover);
      color: var(--rte-media-text);
    }

    .rte-media-tab.active {
      background: var(--rte-media-accent);
      color: #fff;
    }

    .rte-media-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .rte-media-field {
      margin-bottom: 16px;
    }

    .rte-media-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }

    .rte-media-label {
      display: block;
      margin-bottom: 8px;
      color: var(--rte-media-text);
      font-size: 14px;
      font-weight: 600;
    }

    .rte-media-input,
    .rte-media-textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      border: 1px solid var(--rte-media-border);
      border-radius: 8px;
      background: var(--rte-media-surface);
      color: var(--rte-media-text);
      font-size: 14px;
      transition: border-color 0.16s ease, box-shadow 0.16s ease;
    }

    .rte-media-input::placeholder,
    .rte-media-textarea::placeholder {
      color: var(--rte-media-muted);
    }

    .rte-media-input:focus,
    .rte-media-textarea:focus {
      outline: none;
      border-color: var(--rte-media-accent);
      box-shadow: 0 0 0 3px var(--rte-media-ring);
    }

    .rte-media-textarea {
      min-height: 92px;
      resize: vertical;
      font-family: inherit;
    }

    .rte-media-dropzone {
      border: 2px dashed var(--rte-media-border);
      border-radius: 12px;
      padding: 36px 18px;
      text-align: center;
      cursor: pointer;
      background: var(--rte-media-surface);
      transition: border-color 0.16s ease, background-color 0.16s ease;
    }

    .rte-media-dropzone:hover,
    .rte-media-dropzone.is-dragover {
      border-color: var(--rte-media-accent);
      background: var(--rte-media-surface-hover);
    }

    .rte-media-dropzone-icon {
      font-size: 40px;
      margin-bottom: 10px;
      line-height: 1;
    }

    .rte-media-dropzone-title {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--rte-media-text);
    }

    .rte-media-muted {
      margin: 0 0 8px 0;
      color: var(--rte-media-muted);
      font-size: 14px;
    }

    .rte-media-hint {
      margin: 0;
      color: var(--rte-media-muted);
      font-size: 12px;
    }

    .rte-media-progress {
      margin-top: 16px;
    }

    .rte-media-progress-track {
      height: 8px;
      border-radius: 999px;
      background: var(--rte-media-surface);
      overflow: hidden;
      border: 1px solid var(--rte-media-border);
    }

    .rte-media-progress-bar {
      height: 100%;
      width: 0;
      background: var(--rte-media-accent);
      transition: width 0.3s ease;
    }

    .rte-media-progress-text {
      margin-top: 8px;
      text-align: center;
      color: var(--rte-media-muted);
      font-size: 13px;
    }

    .rte-media-progress-actions {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }

    .rte-media-error {
      margin: 12px 0 0;
      padding: 8px 12px;
      border: 1px solid var(--rte-media-danger);
      border-radius: 8px;
      color: var(--rte-media-danger);
      font-size: 13px;
      line-height: 1.4;
    }

    .rte-media-error[hidden] {
      display: none;
    }

    .rte-media-preview {
      border: 1px solid var(--rte-media-border);
      border-radius: 10px;
      padding: 10px;
      text-align: center;
      background: var(--rte-media-surface);
    }

    .rte-media-preview img,
    .rte-media-preview video {
      max-width: 100%;
      max-height: 240px;
    }

    .rte-media-helper {
      margin-top: 8px;
      margin-bottom: 0;
      font-size: 12px;
      color: var(--rte-media-muted);
      line-height: 1.5;
    }

    .rte-media-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid var(--rte-media-border);
      background: var(--rte-media-surface);
    }

    .rte-media-footer.rte-media-footer-spread {
      justify-content: space-between;
      align-items: center;
    }

    .rte-media-btn {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease;
    }

    .rte-media-btn-secondary {
      background: var(--rte-media-bg);
      border-color: var(--rte-media-border);
      color: var(--rte-media-text);
    }

    .rte-media-btn-secondary:hover {
      background: var(--rte-media-surface-hover);
    }

    .rte-media-btn-primary {
      background: var(--rte-media-primary);
      color: var(--rte-media-primary-text);
    }

    .rte-media-btn-primary:hover {
      background: var(--rte-media-primary-hover);
    }

    .rte-media-btn-primary:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .rte-media-btn-danger {
      background: var(--rte-media-danger);
      color: #fff;
    }

    .rte-media-btn-danger:hover {
      background: var(--rte-media-danger-hover);
    }

    .rte-media-checkbox-label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--rte-media-text);
      font-size: 14px;
      cursor: pointer;
    }

    .rte-media-checkbox-label input {
      accent-color: var(--rte-media-accent);
    }

    .rte-media-actions {
      display: flex;
      gap: 10px;
    }

    .rte-media-spacer {
      flex: 1;
    }


    /* ── The media picker ─────────────────────────────────────────────── */
    .rte-media-dialog.rte-mp {
      width: min(96vw, 980px);
      height: min(88vh, 640px);
      max-height: none;
      position: relative;
      border-radius: 16px;
    }

    .rte-mp-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--rte-media-border);
    }

    .rte-mp-header .rte-media-title {
      font-size: 16px;
      flex: none;
    }

    .rte-mp-search {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      height: 34px;
      padding: 0 10px;
      border: 1px solid var(--rte-media-border);
      border-radius: 8px;
      background: var(--rte-media-surface);
      color: var(--rte-media-muted);
    }

    .rte-mp-search:focus-within {
      border-color: var(--rte-media-accent);
      box-shadow: 0 0 0 3px var(--rte-media-ring);
    }

    .rte-mp-search input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--rte-media-text);
      font-size: 14px;
    }

    .rte-mp-search[hidden] {
      display: none;
    }

    .rte-mp-spacer {
      flex: 1;
    }

    .rte-mp-body {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: 168px minmax(0, 1fr) 272px;
    }

    .rte-mp.no-details .rte-mp-body {
      grid-template-columns: 168px minmax(0, 1fr);
    }

    .rte-mp-nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 12px 8px;
      border-right: 1px solid var(--rte-media-border);
      background: var(--rte-media-surface);
    }

    .rte-mp-nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 8px 10px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--rte-media-muted);
      font-size: 14px;
      text-align: left;
      cursor: pointer;
    }

    .rte-mp-nav-item:hover {
      background: var(--rte-media-surface-hover);
      color: var(--rte-media-text);
    }

    .rte-mp-nav-item[aria-selected="true"] {
      background: var(--rte-media-ring);
      color: var(--rte-media-text);
      font-weight: 600;
    }

    .rte-mp-nav-item[aria-selected="true"] svg {
      color: var(--rte-media-accent);
    }

    .rte-mp-nav-item:focus-visible,
    .rte-mp-chip:focus-visible,
    .rte-mp-tile:focus-visible,
    .rte-mp-icon-btn:focus-visible {
      outline: 2px solid var(--rte-media-accent);
      outline-offset: 2px;
    }

    .rte-mp-badge {
      margin-left: auto;
      min-width: 18px;
      padding: 0 6px;
      border-radius: 999px;
      background: var(--rte-media-accent);
      color: #fff;
      font-size: 11px;
      line-height: 18px;
      text-align: center;
    }

    .rte-mp-main {
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .rte-mp-view {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .rte-mp-view[hidden] {
      display: none;
    }

    .rte-mp-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 14px 16px 0;
    }

    .rte-mp-chip {
      padding: 6px 16px;
      border: 1px solid var(--rte-media-border);
      border-radius: 999px;
      background: transparent;
      color: var(--rte-media-muted);
      font-size: 13px;
      cursor: pointer;
    }

    .rte-mp-chip:hover {
      background: var(--rte-media-surface-hover);
    }

    .rte-mp-chip[aria-pressed="true"] {
      background: var(--rte-media-text);
      border-color: var(--rte-media-text);
      color: var(--rte-media-bg);
    }

    .rte-mp-scroll {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding: 12px 16px 16px;
    }

    .rte-mp-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
      gap: 10px;
    }

    .rte-mp-tile {
      position: relative;
      aspect-ratio: 1;
      border: 0;
      border-radius: 12px;
      overflow: hidden;
      background: var(--rte-media-surface-hover);
      color: var(--rte-media-muted);
      cursor: pointer;
      box-shadow: inset 0 0 0 1px var(--rte-media-border);
      transition: box-shadow 0.12s ease, transform 0.12s ease;
    }

    .rte-mp-tile:hover {
      box-shadow: inset 0 0 0 1px var(--rte-media-muted);
    }

    .rte-mp-tile[aria-selected="true"],
    .rte-mp-tile.is-selected {
      box-shadow: inset 0 0 0 3px var(--rte-media-accent);
    }

    .rte-mp-tile-pick {
      position: absolute;
      inset: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
      border-radius: inherit;
    }

    .rte-mp-tile-pick:focus-visible {
      outline: 2px solid var(--rte-media-accent);
      outline-offset: -4px;
    }

    .rte-mp-tile img,
    .rte-mp-tile video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      pointer-events: none;
    }

    .rte-mp-tile img.rte-mp-fade {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .rte-mp-tile img.rte-mp-fade.is-loaded {
      opacity: 1;
    }

    .rte-mp-tile img.is-broken {
      display: none;
    }

    .rte-mp-tile-name {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 14px 8px 6px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.62) 100%);
      color: #fff;
      font-size: 12px;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0;
      transition: opacity 0.12s ease;
    }

    .rte-mp-tile:hover .rte-mp-tile-name,
    .rte-mp-tile:focus-visible .rte-mp-tile-name,
    .rte-mp-tile:focus-within .rte-mp-tile-name,
    .rte-mp-tile.is-selected .rte-mp-tile-name,
    .rte-mp-tile[aria-selected="true"] .rte-mp-tile-name {
      opacity: 1;
    }

    .rte-mp-tile-check {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 22px;
      height: 22px;
      display: none;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--rte-media-accent);
      color: #fff;
    }

    .rte-mp-tile[aria-selected="true"] .rte-mp-tile-check,
    .rte-mp-tile.is-selected .rte-mp-tile-check {
      display: flex;
    }

    .rte-mp-tile-kind {
      position: absolute;
      left: 8px;
      top: 8px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
    }

    .rte-mp-tile-icon {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rte-mp-tile.is-skeleton {
      cursor: default;
      animation: rte-mp-pulse 1.2s ease-in-out infinite;
    }

    @keyframes rte-mp-pulse {
      50% { opacity: 0.55; }
    }

    .rte-mp-tile.is-uploading,
    .rte-mp-tile.is-failed {
      cursor: default;
    }

    .rte-mp-progress {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 4px;
      background: rgba(0, 0, 0, 0.35);
    }

    .rte-mp-progress > span {
      display: block;
      height: 100%;
      width: 0;
      background: var(--rte-media-accent);
      transition: width 0.15s ease;
    }

    .rte-mp-tile-status {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      font-size: 12px;
      text-align: center;
      line-height: 1.3;
    }

    .rte-mp-tile.is-failed .rte-mp-tile-status {
      background: rgba(120, 20, 28, 0.82);
    }

    .rte-mp-tile-actions {
      position: absolute;
      top: 6px;
      right: 6px;
      display: flex;
      gap: 4px;
    }

    .rte-mp-icon-btn {
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.62);
      color: #fff;
      cursor: pointer;
    }

    .rte-mp-icon-btn:hover {
      background: rgba(0, 0, 0, 0.82);
    }

    .rte-mp-more {
      display: block;
      margin: 14px auto 0;
    }

    .rte-mp-empty,
    .rte-mp-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 240px;
      padding: 24px;
      text-align: center;
      color: var(--rte-media-muted);
    }

    .rte-mp-empty strong,
    .rte-mp-error strong {
      color: var(--rte-media-text);
      font-size: 15px;
    }

    .rte-mp-error {
      color: var(--rte-media-danger);
    }

    .rte-mp-dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 28px 16px;
      border: 2px dashed var(--rte-media-border);
      border-radius: 14px;
      background: var(--rte-media-surface);
      color: var(--rte-media-muted);
      text-align: center;
      cursor: pointer;
      transition: border-color 0.12s ease, background 0.12s ease;
    }

    .rte-mp-dropzone:hover,
    .rte-mp-dropzone.is-dragover {
      border-color: var(--rte-media-accent);
      background: var(--rte-media-ring);
    }

    .rte-mp-dropzone:focus-visible {
      outline: 2px solid var(--rte-media-accent);
      outline-offset: 2px;
    }

    .rte-mp-dropzone strong {
      color: var(--rte-media-text);
      font-size: 15px;
    }

    .rte-mp-dropzone-icon {
      color: var(--rte-media-accent);
      margin-bottom: 4px;
    }

    .rte-mp-queue {
      margin: 16px 0 0;
      padding: 0;
      list-style: none;
    }

    .rte-mp-drop-veil {
      position: absolute;
      inset: 0;
      z-index: 5;
      display: none;
      align-items: center;
      justify-content: center;
      border-radius: inherit;
      background: var(--rte-media-ring);
      border: 3px dashed var(--rte-media-accent);
      color: var(--rte-media-accent);
      font-size: 18px;
      font-weight: 600;
      pointer-events: none;
    }

    .rte-mp.is-dropping .rte-mp-drop-veil {
      display: flex;
    }

    .rte-mp-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
      overflow: auto;
    }

    .rte-mp-details {
      min-height: 0;
      overflow: auto;
      padding: 16px;
      border-left: 1px solid var(--rte-media-border);
      background: var(--rte-media-surface);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .rte-mp-details[hidden] {
      display: none;
    }

    .rte-mp-preview {
      border-radius: 10px;
      overflow: hidden;
      background: var(--rte-media-surface-hover);
      box-shadow: inset 0 0 0 1px var(--rte-media-border);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 110px;
    }

    .rte-mp-preview img,
    .rte-mp-preview video {
      display: block;
      max-width: 100%;
      max-height: 200px;
    }

    .rte-mp-meta-name {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--rte-media-text);
      word-break: break-word;
    }

    .rte-mp-meta {
      margin: 2px 0 0;
      font-size: 12px;
      color: var(--rte-media-muted);
    }

    .rte-mp-hint {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--rte-media-muted);
    }

    .rte-mp-hint.is-warning {
      color: var(--rte-media-danger-text);
    }

    .rte-mp-embed-status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      min-height: 22px;
      font-size: 13px;
    }

    .rte-mp-embed-status.is-ok {
      color: var(--rte-media-text);
    }

    .rte-mp-embed-status.is-ok svg {
      color: var(--rte-media-accent);
    }

    .rte-mp-embed-status.is-error {
      color: var(--rte-media-danger-text);
    }

    .rte-mp-suggest {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-left: auto;
      padding: 2px 8px;
      border: 1px solid var(--rte-media-border);
      border-radius: 999px;
      background: transparent;
      color: var(--rte-media-text);
      font-size: 12px;
      cursor: pointer;
    }

    .rte-mp-suggest:hover {
      background: var(--rte-media-surface-hover);
    }

    .rte-mp-suggest:disabled {
      opacity: 0.6;
      cursor: progress;
    }

    .rte-mp-suggest:focus-visible {
      outline: 2px solid var(--rte-media-accent);
      outline-offset: 2px;
    }


    .rte-mp-viewtools {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }

    .rte-mp-viewtools[hidden] {
      display: none;
    }

    .rte-mp-sort {
      height: 34px;
      padding: 0 8px 0 12px;
      border: 1px solid var(--rte-media-border);
      border-radius: 8px;
      background: var(--rte-media-bg);
      color: var(--rte-media-text);
      font-size: 14px;
    }

    .rte-mp-sort:focus-visible,
    .rte-mp-iconbtn:focus-visible {
      outline: 2px solid var(--rte-media-accent);
      outline-offset: 2px;
    }

    .rte-mp-layout {
      display: flex;
      gap: 4px;
    }

    .rte-mp-iconbtn {
      width: 34px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--rte-media-border);
      border-radius: 8px;
      background: transparent;
      color: var(--rte-media-muted);
      cursor: pointer;
    }

    .rte-mp-iconbtn:hover {
      background: var(--rte-media-surface-hover);
    }

    .rte-mp-iconbtn[aria-pressed="true"] {
      border-color: var(--rte-media-text);
      background: var(--rte-media-surface-hover);
      color: var(--rte-media-text);
    }

    .rte-mp-tile-duration {
      position: absolute;
      right: 8px;
      bottom: 8px;
      z-index: 1;
      padding: 2px 6px;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.64);
      color: #fff;
      font-size: 11px;
      font-variant-numeric: tabular-nums;
    }

    .rte-mp-tile.has-duration .rte-mp-tile-name {
      padding-right: 58px;
    }

    .rte-mp-tile-meta {
      display: none;
    }

    /* A file going up: an outline where it will land, the preview faded, and how far it has got. */
    .rte-mp-tile.is-uploading {
      background: var(--rte-media-surface);
      box-shadow: none;
    }

    .rte-mp-tile.is-uploading::after {
      content: "";
      position: absolute;
      inset: 0;
      border: 1.5px dashed var(--rte-media-border);
      border-radius: inherit;
      pointer-events: none;
    }

    .rte-mp-tile.is-uploading img,
    .rte-mp-tile.is-uploading video {
      opacity: 0.22;
    }

    .rte-mp-tile.is-uploading .rte-mp-tile-status {
      background: transparent;
      color: var(--rte-media-text);
      font-weight: 600;
    }

    .rte-mp-tile.is-uploading .rte-mp-progress {
      left: 12px;
      right: 12px;
      bottom: 12px;
      border-radius: 2px;
      background: var(--rte-media-border);
    }

    .rte-mp-drop-hint {
      margin: 18px 0 0;
      text-align: center;
      font-size: 13px;
      color: var(--rte-media-muted);
    }

    /* The list layout: a row for each file, with the picture small at the start. */
    .rte-mp-grid.is-list {
      grid-template-columns: minmax(0, 1fr);
      gap: 4px;
    }

    .rte-mp-grid.is-list .rte-mp-tile {
      aspect-ratio: auto;
      height: 56px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 68px;
      border-radius: 10px;
      background: transparent;
      box-shadow: none;
      color: var(--rte-media-text);
    }

    .rte-mp-grid.is-list .rte-mp-tile:hover {
      background: var(--rte-media-surface-hover);
      box-shadow: none;
    }

    .rte-mp-grid.is-list .rte-mp-tile[aria-selected="true"] {
      background: var(--rte-media-ring);
      box-shadow: inset 0 0 0 2px var(--rte-media-accent);
    }

    .rte-mp-grid.is-list .rte-mp-tile img,
    .rte-mp-grid.is-list .rte-mp-tile video {
      right: auto;
      width: 56px;
      border-radius: 10px;
    }

    .rte-mp-grid.is-list .rte-mp-tile-icon {
      right: auto;
      width: 56px;
    }

    .rte-mp-grid.is-list .rte-mp-tile-name {
      position: static;
      flex: 1;
      min-width: 0;
      padding: 0 !important;
      background: none;
      color: var(--rte-media-text);
      font-size: 14px;
      opacity: 1;
    }

    .rte-mp-grid.is-list .rte-mp-tile-meta {
      display: block;
      padding-right: 44px;
      font-size: 12px;
      color: var(--rte-media-muted);
      white-space: nowrap;
    }

    .rte-mp-grid.is-list .rte-mp-tile-check {
      top: 50%;
      transform: translateY(-50%);
    }

    .rte-mp-grid.is-list .rte-mp-tile-kind,
    .rte-mp-grid.is-list .rte-mp-tile-duration {
      display: none;
    }

    .rte-mp-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .rte-mp-actions .rte-mp-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin: 0;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
    }
    .rte-mp-label-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .rte-mp-footer {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-top: 1px solid var(--rte-media-border);
    }

    .rte-mp-count {
      flex: 1;
      font-size: 13px;
      color: var(--rte-media-muted);
    }

    .rte-mp-sr {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }

    @media (max-width: 860px) {
      .rte-mp-body,
      .rte-mp.no-details .rte-mp-body {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: auto minmax(0, 1fr) auto;
      }

      .rte-mp-nav {
        flex-direction: row;
        padding: 8px;
        border-right: 0;
        border-bottom: 1px solid var(--rte-media-border);
        overflow-x: auto;
      }

      .rte-mp-nav-item {
        width: auto;
        white-space: nowrap;
      }

      .rte-mp-details {
        box-sizing: border-box;
        max-height: min(30vh, 220px);
        padding: 12px 16px;
        border-left: 0;
        border-top: 1px solid var(--rte-media-border);
        display: grid;
        grid-template-columns: 96px minmax(0, 1fr);
        align-items: start;
        gap: 10px 12px;
      }

      .rte-mp-details[hidden] {
        display: none;
      }

      .rte-mp-details > * {
        grid-column: 1 / -1;
      }

      .rte-mp-details > .rte-mp-preview {
        grid-column: 1;
        min-height: 64px;
      }

      .rte-mp-details > .rte-mp-preview + div {
        grid-column: 2;
      }

      .rte-mp-details textarea {
        min-height: 0;
        height: 48px;
      }

      .rte-mp-preview img,
      .rte-mp-preview video {
        max-height: 96px;
      }
    }

    @media (max-width: 520px) {
      .rte-media-overlay {
        padding: 0;
        align-items: flex-end;
      }

      .rte-media-dialog.rte-mp {
        width: 100vw;
        height: 94vh;
        border-radius: 16px 16px 0 0;
      }

      .rte-mp-header {
        flex-wrap: wrap;
      }

      .rte-mp-search {
        order: 3;
        flex-basis: 100%;
        max-width: none;
      }

      .rte-mp-grid {
        grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .rte-mp-tile,
      .rte-mp-tile img.rte-mp-fade,
      .rte-mp-progress > span,
      .rte-mp-dropzone {
        transition: none;
      }

      .rte-mp-tile.is-skeleton {
        animation: none;
      }
    }

    .media-floating-toolbar {
      --rte-media-toolbar-bg: #ffffff;
      --rte-media-toolbar-border: #d6dbe4;
      --rte-media-toolbar-text: #344054;
      --rte-media-toolbar-hover-bg: #f3f6fb;
      --rte-media-toolbar-hover-text: #101828;
      --rte-media-toolbar-active-bg: #e6edf7;
      --rte-media-toolbar-separator: #d9e1eb;
      --rte-media-toolbar-danger-hover-bg: #fee2e2;
      --rte-media-toolbar-danger-hover-text: #b42318;
      position: fixed;
      display: none;
      align-items: center;
      gap: 2px;
      padding: 4px;
      border: 1px solid var(--rte-media-toolbar-border);
      border-radius: 8px;
      background: var(--rte-media-toolbar-bg);
      color: var(--rte-media-toolbar-text);
      box-shadow: 0 10px 24px rgba(15, 23, 36, 0.18);
      z-index: 10000;
      pointer-events: auto;
      backdrop-filter: blur(6px);
    }

    .media-floating-toolbar.rte-ui-theme-dark,
    ${DARK_THEME_SELECTOR} .media-floating-toolbar {
      --rte-media-toolbar-bg: #24303f;
      --rte-media-toolbar-border: #4a5a71;
      --rte-media-toolbar-text: #d9e6fb;
      --rte-media-toolbar-hover-bg: #33445a;
      --rte-media-toolbar-hover-text: #f4f8ff;
      --rte-media-toolbar-active-bg: #415875;
      --rte-media-toolbar-separator: #566884;
      --rte-media-toolbar-danger-hover-bg: #5f2a32;
      --rte-media-toolbar-danger-hover-text: #ffd7d5;
      box-shadow: 0 16px 30px rgba(2, 8, 20, 0.42);
    }

    .media-floating-toolbar-btn {
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: inherit;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.16s ease, color 0.16s ease, transform 0.12s ease;
    }

    .media-floating-toolbar-btn:hover {
      background: var(--rte-media-toolbar-hover-bg);
      color: var(--rte-media-toolbar-hover-text);
    }

    .media-floating-toolbar-btn:active {
      background: var(--rte-media-toolbar-active-bg);
      transform: scale(0.96);
    }

    .media-floating-toolbar-btn.btn-remove:hover {
      background: var(--rte-media-toolbar-danger-hover-bg);
      color: var(--rte-media-toolbar-danger-hover-text);
    }

    /* While editing, an embedded player does not take the mouse: a click on it selects its figure instead. */
    [contenteditable="true"] figure.rte-embed iframe {
      pointer-events: none;
    }

    .media-resize-handle {
      position: fixed;
      width: 12px;
      height: 12px;
      margin: -6px 0 0 -6px;
      box-sizing: border-box;
      background: #1f6feb;
      border: 2px solid #fff;
      border-radius: 50%;
      z-index: 10001;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
      touch-action: none;
    }

    /* A finger needs more to hold on to than a mouse does. */
    @media (pointer: coarse) {
      .media-resize-handle {
        width: 24px;
        height: 24px;
        margin: -12px 0 0 -12px;
      }
    }

    .rte-mp-pending {
      position: fixed;
      z-index: 10000;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-sizing: border-box;
      border-radius: 8px;
      background-color: rgba(127, 127, 127, 0.22);
      background-size: cover;
      background-position: center;
      color: #fff;
      font: 13px/1.4 system-ui, sans-serif;
      overflow: hidden;
    }

    .rte-mp-pending::before {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
    }

    .rte-mp-pending > * {
      position: relative;
    }

    .rte-mp-pending .rte-mp-icon-btn {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .rte-mp-pending-bar {
      width: 60%;
      max-width: 220px;
      height: 4px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.35);
      overflow: hidden;
    }

    .rte-mp-pending-bar > span {
      display: block;
      width: 0;
      height: 100%;
      background: #fff;
      transition: width 0.15s ease;
    }

    /* The picture the upload stands in for shows through the shade. */
    .rte-mp-pending-label {
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .media-resize-label {
      position: fixed;
      z-index: 10002;
      padding: 2px 8px;
      border-radius: 6px;
      background: rgba(15, 23, 36, 0.86);
      color: #fff;
      font: 12px/1.6 system-ui, sans-serif;
      pointer-events: none;
    }

    .media-floating-toolbar-btn[aria-pressed="true"] {
      background: var(--rte-media-toolbar-active-bg);
      color: var(--rte-media-toolbar-hover-text);
    }

    .media-floating-toolbar-btn:focus-visible,
    .media-size-menu-item:focus-visible {
      outline: 2px solid #1f6feb;
      outline-offset: 1px;
    }

    .media-size-menu {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      min-width: 150px;
      padding: 4px;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--rte-media-toolbar-border);
      border-radius: 8px;
      background: var(--rte-media-toolbar-bg);
      box-shadow: 0 10px 24px rgba(15, 23, 36, 0.18);
    }

    .media-size-menu-item {
      padding: 7px 10px;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: var(--rte-media-toolbar-text);
      font-size: 13px;
      text-align: left;
      cursor: pointer;
    }

    .media-size-menu-item:hover {
      background: var(--rte-media-toolbar-hover-bg);
      color: var(--rte-media-toolbar-hover-text);
    }

    .media-floating-toolbar-separator {
      width: 1px;
      height: 20px;
      margin: 0 2px;
      background: var(--rte-media-toolbar-separator);
    }
  `;

  document.head.appendChild(style);
};

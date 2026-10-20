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
      --rte-media-accent-hover: #165fd6;
      --rte-media-danger: #dc3545;
      --rte-media-danger-hover: #b92735;
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
      --rte-media-danger: #ff7b72;
      --rte-media-danger-hover: #ff645b;
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
      background: var(--rte-media-accent);
      color: #fff;
    }

    .rte-media-btn-primary:hover {
      background: var(--rte-media-accent-hover);
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

    .media-floating-toolbar-separator {
      width: 1px;
      height: 20px;
      margin: 0 2px;
      background: var(--rte-media-toolbar-separator);
    }
  `;

  document.head.appendChild(style);
};

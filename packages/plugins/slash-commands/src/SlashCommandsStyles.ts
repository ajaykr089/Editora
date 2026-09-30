const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark';

let stylesInjected = false;

export function ensureStylesInjected(): void {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;

  const style = document.createElement('style');
  style.id = 'rte-slash-commands-styles';
  style.textContent = `
    .rte-slash-panel {
      width: min(225px, calc(100vw - 16px));
      max-height: min(360px, calc(100vh - 24px));
      overflow: hidden;
      border: 1px solid #d9dfeb;
      border-radius: 0px;
      background: #ffffff;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
      z-index: 2147483646;
    }

    .rte-slash-list {
      max-height: min(340px, calc(100vh - 32px));
      overflow: auto;
      padding: 0px;
      display: grid;
      gap: 1px;
    }

    .rte-slash-item {
      width: 100%;
      border: none;
      background: transparent;
      color: #0f172a;
      border-radius: 0px;
      padding: 6px 9px;
      text-align: left;
      display: grid;
      gap: 0px;
      cursor: pointer;
      font: inherit;
    }

    .rte-slash-item:hover,
    .rte-slash-item.active {
      background: #eff6ff;
      color: #1d4ed8;
    }

    .rte-slash-item-title {
      font-size: 13px;
      font-weight: 600;
      line-height: 1.35;
    }

    .rte-slash-item-description {
      font-size: 12px;
      color: #64748b;
      line-height: 1.35;
    }

    .rte-slash-item mark {
      background: rgba(59, 130, 246, 0.16);
      color: inherit;
      padding: 0 2px;
      border-radius: 3px;
    }

    .rte-slash-empty {
      font-size: 13px;
      color: #64748b;
      text-align: center;
      padding: 12px;
    }

    ${DARK_THEME_SELECTOR} .rte-slash-panel,
    .rte-slash-panel.rte-slash-theme-dark {
      border-color: #364152;
      background: #1f2937;
      box-shadow: 0 22px 44px rgba(0, 0, 0, 0.48);
    }

    ${DARK_THEME_SELECTOR} .rte-slash-item,
    .rte-slash-panel.rte-slash-theme-dark .rte-slash-item {
      color: #e5e7eb;
    }

    ${DARK_THEME_SELECTOR} .rte-slash-item:hover,
    ${DARK_THEME_SELECTOR} .rte-slash-item.active,
    .rte-slash-panel.rte-slash-theme-dark .rte-slash-item:hover,
    .rte-slash-panel.rte-slash-theme-dark .rte-slash-item.active {
      background: #334155;
      color: #bfdbfe;
    }

    ${DARK_THEME_SELECTOR} .rte-slash-item-description,
    ${DARK_THEME_SELECTOR} .rte-slash-empty,
    .rte-slash-panel.rte-slash-theme-dark .rte-slash-item-description,
    .rte-slash-panel.rte-slash-theme-dark .rte-slash-empty {
      color: #9ca3af;
    }
  `;

  document.head.appendChild(style);
}


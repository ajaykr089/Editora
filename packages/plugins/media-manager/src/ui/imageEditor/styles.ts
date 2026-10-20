/** The stylesheet of the image editor. It borrows the colours of the dialog stylesheet (`--rte-media-*`). */
export const injectImageEditorStyles = (): void => {
  if (typeof document === 'undefined' || document.getElementById('rte-image-editor-styles')) return;

  const style = document.createElement('style');
  style.id = 'rte-image-editor-styles';
  style.textContent = `
    .rte-media-dialog.rte-ie {
      width: min(96vw, 980px);
      height: min(90vh, 700px);
      max-height: none;
    }

    .rte-ie-body {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 300px;
    }

    .rte-ie-stage {
      position: relative;
      min-width: 0;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow: auto;
      background-color: var(--rte-media-surface-hover);
      background-image:
        linear-gradient(45deg, rgba(127, 127, 127, 0.16) 25%, transparent 25%, transparent 75%, rgba(127, 127, 127, 0.16) 75%),
        linear-gradient(45deg, rgba(127, 127, 127, 0.16) 25%, transparent 25%, transparent 75%, rgba(127, 127, 127, 0.16) 75%);
      background-size: 16px 16px;
      background-position: 0 0, 8px 8px;
    }

    .rte-ie-canvas-wrap {
      position: relative;
      flex: none;
      line-height: 0;
      box-shadow: 0 2px 18px rgba(0, 0, 0, 0.3);
    }

    .rte-ie-canvas-wrap canvas {
      display: block;
    }

    .rte-ie-status {
      color: var(--rte-media-muted);
      font-size: 14px;
      text-align: center;
      max-width: 360px;
    }

    .rte-ie-status.is-error {
      color: var(--rte-media-danger-text);
    }

    .rte-ie-crop-layer {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .rte-ie-crop-layer[hidden] {
      display: none;
    }

    .rte-ie-crop {
      position: absolute;
      box-sizing: border-box;
      border: 2px solid #fff;
      /* The shade over what will be cut away. */
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)),
        linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)),
        linear-gradient(90deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)),
        linear-gradient(90deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45));
      background-size: 100% 1px, 100% 1px, 1px 100%, 1px 100%;
      background-position: 0 33.33%, 0 66.66%, 33.33% 0, 66.66% 0;
      background-repeat: no-repeat;
      cursor: move;
      pointer-events: auto;
      touch-action: none;
    }

    .rte-ie-crop:focus-visible {
      outline: 2px solid #1f6feb;
      outline-offset: 2px;
    }

    .rte-ie-handle {
      position: absolute;
      width: 14px;
      height: 14px;
      box-sizing: border-box;
      background: #fff;
      border: 2px solid #1f6feb;
      border-radius: 50%;
      margin: -7px 0 0 -7px;
    }

    @media (pointer: coarse) {
      .rte-ie-handle {
        width: 24px;
        height: 24px;
        margin: -12px 0 0 -12px;
      }
    }

    .rte-ie-handle-nw { left: 0; top: 0; cursor: nwse-resize; }
    .rte-ie-handle-n { left: 50%; top: 0; cursor: ns-resize; }
    .rte-ie-handle-ne { left: 100%; top: 0; cursor: nesw-resize; }
    .rte-ie-handle-e { left: 100%; top: 50%; cursor: ew-resize; }
    .rte-ie-handle-se { left: 100%; top: 100%; cursor: nwse-resize; }
    .rte-ie-handle-s { left: 50%; top: 100%; cursor: ns-resize; }
    .rte-ie-handle-sw { left: 0; top: 100%; cursor: nesw-resize; }
    .rte-ie-handle-w { left: 0; top: 50%; cursor: ew-resize; }

    .rte-ie-panel {
      min-height: 0;
      overflow: auto;
      padding: 14px 16px;
      border-left: 1px solid var(--rte-media-border);
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .rte-ie-section {
      border: 0;
      padding: 0;
      margin: 0;
      min-width: 0;
    }

    .rte-ie-section > legend {
      padding: 0;
      margin-bottom: 8px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--rte-media-muted);
    }

    .rte-ie-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .rte-ie-tool {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border: 1px solid var(--rte-media-border);
      border-radius: 8px;
      background: transparent;
      color: var(--rte-media-text);
      font-size: 13px;
      cursor: pointer;
    }

    .rte-ie-tool:hover {
      background: var(--rte-media-surface-hover);
    }

    .rte-ie-tool[aria-pressed="true"] {
      background: var(--rte-media-text);
      border-color: var(--rte-media-text);
      color: var(--rte-media-bg);
    }

    .rte-ie-tool:focus-visible,
    .rte-ie-select:focus-visible {
      outline: 2px solid var(--rte-media-accent);
      outline-offset: 2px;
    }

    .rte-ie-tool:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .rte-ie-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .rte-ie-chips .rte-ie-tool {
      padding: 4px 10px;
      border-radius: 999px;
    }

    .rte-ie-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
    }

    .rte-ie-row label {
      font-size: 13px;
      color: var(--rte-media-muted);
      flex: none;
    }

    .rte-ie-row input[type="number"],
    .rte-ie-select {
      flex: 1;
      min-width: 0;
      height: 34px;
      padding: 0 8px;
      border: 1px solid var(--rte-media-border);
      border-radius: 8px;
      background: var(--rte-media-bg);
      color: var(--rte-media-text);
      font-size: 14px;
    }

    .rte-ie-row input[type="range"] {
      flex: 1;
      accent-color: var(--rte-media-accent);
    }

    .rte-ie-quality {
      min-width: 3ch;
      text-align: right;
      font-size: 13px;
      color: var(--rte-media-muted);
    }

    .rte-ie-summary {
      margin: 0;
      padding: 10px 12px;
      border-radius: 8px;
      background: var(--rte-media-surface);
      font-size: 13px;
      line-height: 1.5;
      color: var(--rte-media-muted);
    }

    .rte-ie-summary strong {
      color: var(--rte-media-text);
    }

    .rte-ie-footer-error {
      flex: 1;
      margin: 0;
      font-size: 13px;
      color: var(--rte-media-danger-text);
    }

    @media (max-width: 760px) {
      .rte-ie-body {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(240px, 1.1fr) minmax(0, 1fr);
      }

      .rte-ie-panel {
        border-left: 0;
        border-top: 1px solid var(--rte-media-border);
      }
    }

    @media (max-width: 520px) {
      .rte-media-overlay {
        padding: 0;
        align-items: flex-end;
      }

      .rte-media-dialog.rte-ie {
        width: 100vw;
        height: 96vh;
        border-radius: 16px 16px 0 0;
      }
    }
  `;
  document.head.appendChild(style);
};

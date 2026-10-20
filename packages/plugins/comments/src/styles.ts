export const COMMENTS_STYLE_ID = 'rte-comments-panel-styles';

export const COMMENTS_CSS = `
  .rte-comments-panel,
  .rte-comments-panel * {
    box-sizing: border-box;
  }

  .rte-comments-panel {
    --rte-comments-panel-width: min(340px, 42vw);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: var(--rte-comments-panel-width);
    display: flex;
    flex-direction: column;
    background: var(--rte-color-bg-primary, #ffffff);
    color: var(--rte-color-text-primary, #111827);
    border-left: 1px solid var(--rte-color-border-light, #e5e7eb);
    box-shadow: -8px 0 24px rgba(15, 23, 42, 0.08);
    font-size: 13px;
    line-height: 1.45;
    transform: translateX(100%);
    opacity: 0;
    pointer-events: none;
    transition: transform 180ms ease, opacity 180ms ease;
    /* Above the editor's sticky toolbar (z-index 100): on a narrow screen the panel lies over the editor, and
       under the toolbar its header, and the button that closes it, could not be clicked. */
    z-index: 110;
  }

  .rte-comments-panel.is-open {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
  }

  /* The panel's width is set on the editor itself, not only on the panel: the toolbar and the text make room for the
     panel with a margin of that width, and a variable set on the panel is not visible to them (the margin was
     silently 0, so the panel lay over the toolbar and the text and its header could not be reached). */
  [data-rte-comments-open="true"] {
    --rte-comments-panel-width: min(340px, 42vw);
  }

  /* The toolbar's wrapper is the element that is as wide as the editor, and it sits above the panel (it is sticky,
     z-index 100): it has to give up the panel's width too, or its empty right-hand end covers the panel's header. */
  [data-rte-comments-open="true"] :is(.rte-toolbar-wrapper, .rte-toolbar:not(.rte-toolbar-wrapper .rte-toolbar), .editora-toolbar, .rte-content, .editora-content, .editora-statusbar, .editora-statusbar-container) {
    margin-right: var(--rte-comments-panel-width);
    transition: margin-right 180ms ease;
  }

  .rte-comments-panel :is(button, textarea, [role="tab"]):focus-visible {
    outline: 2px solid var(--rte-color-border-focus, #2563eb);
    outline-offset: 1px;
  }

  /* ---- Header and tabs ---- */

  .rte-comments-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 12px 12px 8px 16px;
  }

  .rte-comments-title {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .rte-comments-title h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.3;
  }

  .rte-comments-count {
    min-width: 20px;
    padding: 0 6px;
    border-radius: 999px;
    background: var(--rte-color-bg-tertiary, #e2e8f0);
    color: var(--rte-color-text-secondary, #475569);
    font-size: 11px;
    font-weight: 600;
    line-height: 20px;
    text-align: center;
  }

  .rte-comments-header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .rte-comments-tabs {
    display: flex;
    gap: 2px;
    margin: 0 16px;
    padding: 2px;
    border-radius: 8px;
    background: var(--rte-color-bg-tertiary, #eef2f6);
  }

  .rte-comments-tab {
    flex: 1;
    border: 0;
    border-radius: 6px;
    padding: 5px 8px;
    background: transparent;
    color: var(--rte-color-text-secondary, #475569);
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
  }

  .rte-comments-tab:hover {
    color: var(--rte-color-text-primary, #0f172a);
  }

  .rte-comments-tab[aria-selected="true"] {
    background: var(--rte-color-bg-primary, #ffffff);
    color: var(--rte-color-text-primary, #0f172a);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
  }

  .rte-comments-tab-count {
    margin-left: 4px;
    font-weight: 400;
    color: var(--rte-color-text-muted, #64748b);
  }

  .rte-comments-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 12px 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* ---- Buttons ---- */

  .rte-comment-icon-btn,
  .rte-comments-new,
  .rte-comments-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--rte-color-text-secondary, #475569);
    font: inherit;
    cursor: pointer;
  }

  .rte-comment-icon-btn,
  .rte-comments-close {
    width: 28px;
    height: 28px;
    padding: 0;
  }

  .rte-comments-new {
    height: 28px;
    padding: 0 10px 0 8px;
    font-size: 12px;
    font-weight: 500;
    color: var(--rte-color-primary, #2563eb);
  }

  .rte-comment-icon-btn:hover,
  .rte-comments-new:hover,
  .rte-comments-close:hover {
    background: var(--rte-color-bg-hover, #f1f5f9);
    color: var(--rte-color-text-primary, #0f172a);
  }

  .rte-comments-new:hover {
    color: var(--rte-color-primary-hover, #1d4ed8);
  }

  .rte-comment-icon-btn[data-action="resolve"]:hover {
    background: color-mix(in srgb, var(--rte-color-success, #15803d) 14%, transparent);
    color: var(--rte-color-success, #15803d);
  }

  .rte-comment-icon-btn svg,
  .rte-comments-new svg,
  .rte-comments-close svg {
    width: 16px;
    height: 16px;
    flex: none;
  }

  .rte-comment-btn {
    border: 1px solid var(--rte-color-border, #d1d5db);
    border-radius: 7px;
    padding: 5px 12px;
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    background: var(--rte-color-bg-primary, #ffffff);
    color: var(--rte-color-text-secondary, #334155);
  }

  .rte-comment-btn:hover {
    background: var(--rte-color-bg-hover, #f1f5f9);
    color: var(--rte-color-text-primary, #0f172a);
  }

  .rte-comment-btn.ghost {
    border-color: transparent;
    background: transparent;
  }

  .rte-comment-btn.primary {
    border-color: var(--rte-color-primary, #2563eb);
    background: var(--rte-color-primary, #2563eb);
    color: var(--rte-color-text-inverse, #ffffff);
  }

  .rte-comment-btn.primary:hover {
    background: var(--rte-color-primary-hover, #1d4ed8);
    border-color: var(--rte-color-primary-hover, #1d4ed8);
    color: var(--rte-color-text-inverse, #ffffff);
  }

  .rte-comment-btn:disabled,
  .rte-comment-btn.primary:disabled {
    border-color: var(--rte-color-border-light, #e2e8f0);
    background: var(--rte-color-bg-tertiary, #e2e8f0);
    color: var(--rte-color-text-muted, #64748b);
    cursor: not-allowed;
  }

  /* ---- Cards (a thread, and the form for a new comment) ---- */

  .rte-comment-item,
  .rte-comment-composer {
    border: 1px solid var(--rte-color-border-light, #e5e7eb);
    border-radius: 10px;
    background: var(--rte-color-bg-primary, #ffffff);
    padding: 12px;
    transition: border-color 120ms ease, box-shadow 120ms ease;
  }

  .rte-comment-item:hover {
    border-color: var(--rte-color-border, #cbd5e1);
  }

  .rte-comment-item.is-active,
  .rte-comment-composer {
    border-color: var(--rte-color-primary, #2563eb);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--rte-color-primary, #2563eb) 14%, transparent);
  }

  .rte-comment-item.resolved .rte-comment-text,
  .rte-comment-item.resolved .rte-comment-selection {
    color: var(--rte-color-text-secondary, #475569);
  }

  .rte-comment-header,
  .rte-comment-reply-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rte-comment-avatar {
    flex: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: #ffffff;
    font-size: 11px;
    font-weight: 600;
    line-height: 28px;
    text-align: center;
    user-select: none;
  }

  .rte-comment-avatar.small {
    width: 22px;
    height: 22px;
    font-size: 9px;
    line-height: 22px;
  }

  .rte-comment-meta {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .rte-comment-author {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    color: var(--rte-color-text-primary, #0f172a);
  }

  .rte-comment-date {
    font-size: 11px;
    line-height: 1.3;
    color: var(--rte-color-text-muted, #64748b);
  }

  .rte-comment-header-actions {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .rte-comment-more {
    position: relative;
  }

  .rte-comment-menu {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    z-index: 2;
    min-width: 140px;
    padding: 4px;
    border: 1px solid var(--rte-color-border, #d1d5db);
    border-radius: 8px;
    background: var(--rte-color-bg-primary, #ffffff);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);
  }

  .rte-comment-menu[hidden] {
    display: none;
  }

  .rte-comment-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    border: 0;
    border-radius: 6px;
    padding: 6px 8px;
    background: transparent;
    color: var(--rte-color-text-primary, #0f172a);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
  }

  .rte-comment-menu-item svg {
    width: 15px;
    height: 15px;
    flex: none;
  }

  .rte-comment-menu-item:hover,
  .rte-comment-menu-item:focus-visible {
    background: var(--rte-color-bg-hover, #f1f5f9);
  }

  .rte-comment-menu-item.danger {
    color: var(--rte-color-danger, #b91c1c);
  }

  .rte-comment-menu-item.danger:hover,
  .rte-comment-menu-item.danger:focus-visible {
    background: color-mix(in srgb, var(--rte-color-danger, #b91c1c) 10%, transparent);
  }

  /* What the comment is about: one line of the quoted text. */
  .rte-comment-selection {
    display: block;
    width: 100%;
    margin: 10px 0 0;
    padding: 4px 8px;
    border: 0;
    border-left: 3px solid var(--rte-color-warning, #d97706);
    border-radius: 0 4px 4px 0;
    background: var(--rte-color-bg-secondary, #f8fafc);
    color: var(--rte-color-text-secondary, #475569);
    font: inherit;
    font-size: 12px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button.rte-comment-selection {
    cursor: pointer;
  }

  button.rte-comment-selection:hover {
    background: var(--rte-color-bg-hover, #f1f5f9);
  }

  .rte-comment-text {
    margin-top: 10px;
    font-size: 13px;
    line-height: 1.5;
    color: var(--rte-color-text-primary, #0f172a);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .rte-comment-status {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    font-size: 11px;
    color: var(--rte-color-success, #15803d);
  }

  .rte-comment-status svg {
    width: 12px;
    height: 12px;
  }

  /* ---- Replies ---- */

  .rte-comment-replies {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--rte-color-border-light, #e5e7eb);
  }

  .rte-comment-reply-text {
    margin: 4px 0 0 30px;
    font-size: 13px;
    line-height: 1.5;
    color: var(--rte-color-text-primary, #0f172a);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .rte-comment-more-replies {
    align-self: flex-start;
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--rte-color-primary, #2563eb);
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
  }

  .rte-comment-more-replies:hover {
    text-decoration: underline;
  }

  /* ---- Reply box: one line until it is used ---- */

  .rte-comment-reply-box {
    margin-top: 12px;
  }

  .new-comment-textarea,
  .rte-comment-reply-textarea {
    display: block;
    width: 100%;
    resize: none;
    min-height: 34px;
    max-height: 160px;
    font: inherit;
    font-size: 13px;
    line-height: 1.45;
    border: 1px solid var(--rte-color-border, #d1d5db);
    border-radius: 8px;
    background: var(--rte-color-bg-primary, #ffffff);
    color: var(--rte-color-text-primary, #0f172a);
    padding: 7px 10px;
    outline: none;
  }

  .new-comment-textarea {
    min-height: 64px;
  }

  .new-comment-textarea::placeholder,
  .rte-comment-reply-textarea::placeholder {
    color: var(--rte-color-text-muted, #64748b);
  }

  .new-comment-textarea:focus,
  .rte-comment-reply-textarea:focus {
    border-color: var(--rte-color-border-focus, #2563eb);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--rte-color-border-focus, #2563eb) 20%, transparent);
  }

  .rte-comment-form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    margin-top: 8px;
  }

  .rte-comment-reply-box:not(:focus-within):not(.has-text) .rte-comment-form-actions {
    display: none;
  }

  /* ---- New comment ---- */

  .rte-comment-composer .rte-comment-selection {
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding-right: 4px;
  }

  .rte-comment-composer .rte-comment-selection span {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rte-comment-composer .rte-comment-selection .rte-comment-icon-btn {
    width: 22px;
    height: 22px;
  }

  .rte-comment-composer-hint {
    margin: 0 0 8px;
    font-size: 12px;
    color: var(--rte-color-text-muted, #64748b);
  }

  .rte-comment-error {
    margin: 8px 0 0;
    font-size: 12px;
    color: var(--rte-color-danger, #b91c1c);
  }

  /* ---- Empty state ---- */

  .rte-comments-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 36px 16px;
    text-align: center;
    color: var(--rte-color-text-muted, #64748b);
  }

  .rte-comments-empty svg {
    width: 32px;
    height: 32px;
    margin-bottom: 4px;
    opacity: 0.6;
  }

  .rte-comments-empty strong {
    font-size: 14px;
    font-weight: 600;
    color: var(--rte-color-text-primary, #0f172a);
  }

  .rte-comments-empty p {
    margin: 0;
    max-width: 240px;
    font-size: 12px;
  }

  /* ---- The highlighted text in the document ---- */

  .rte-comment-anchor {
    background: rgba(250, 204, 21, 0.34);
    border-bottom: 2px solid rgba(217, 119, 6, 0.75);
    border-radius: 2px;
    cursor: pointer;
    transition: outline-color 120ms ease, box-shadow 120ms ease;
  }

  .rte-comment-anchor.rte-comment-anchor-resolved {
    background: rgba(148, 163, 184, 0.2);
    border-bottom-color: rgba(100, 116, 139, 0.6);
  }

  .rte-comment-anchor.highlighted {
    outline: 2px solid var(--rte-color-primary, #2563eb);
    outline-offset: 2px;
  }

  :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-comments-panel {
    box-shadow: -10px 0 28px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 900px) {
    [data-rte-comments-open="true"],
    .rte-comments-panel {
      --rte-comments-panel-width: min(420px, 100%);
    }

    .rte-comments-panel {
      box-shadow: -12px 0 28px rgba(15, 23, 42, 0.2);
    }

    [data-rte-comments-open="true"] :is(.rte-toolbar-wrapper, .rte-toolbar:not(.rte-toolbar-wrapper .rte-toolbar), .editora-toolbar, .rte-content, .editora-content, .editora-statusbar, .editora-statusbar-container) {
      margin-right: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .rte-comments-panel,
    .rte-comment-item,
    .rte-comment-composer,
    .rte-comment-anchor,
    [data-rte-comments-open="true"] :is(.rte-toolbar-wrapper, .rte-toolbar, .editora-toolbar, .rte-content, .editora-content, .editora-statusbar, .editora-statusbar-container) {
      transition: none;
    }
  }
`;

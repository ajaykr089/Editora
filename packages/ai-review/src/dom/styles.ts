const STYLE_ID = 'air-styles';

const CSS_TEXT = `
:root {
  --air-del-bg: rgba(220, 38, 38, 0.1);
  --air-del-fg: #b42318;
  --air-ins-bg: rgba(22, 163, 74, 0.13);
  --air-ins-fg: #116c35;
  --air-accent: #5b4bdb;
  --air-surface: #ffffff;
  --air-surface-2: #f6f6f8;
  --air-border: #dcdce3;
  --air-text: #1d1d24;
  --air-muted: #5d5d6b;
  --air-shadow: 0 8px 24px rgba(15, 15, 30, 0.14), 0 1px 3px rgba(15, 15, 30, 0.08);
}
.dark, [data-theme="dark"], [theme="dark"], .editora-theme-dark, .rte-theme-dark, .air-dark {
  --air-del-bg: rgba(248, 113, 113, 0.16);
  --air-del-fg: #fca5a5;
  --air-ins-bg: rgba(74, 222, 128, 0.16);
  --air-ins-fg: #86efac;
  --air-accent: #a99dff;
  --air-surface: #1f1f27;
  --air-surface-2: #2a2a34;
  --air-border: #3b3b48;
  --air-text: #ececf1;
  --air-muted: #a9a9b8;
  --air-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}
del.air-del {
  background: var(--air-del-bg);
  color: var(--air-del-fg);
  text-decoration: line-through;
  text-decoration-thickness: 1px;
  border-radius: 2px;
  cursor: pointer;
}
ins.air-ins {
  background: var(--air-ins-bg);
  color: var(--air-ins-fg);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  border-radius: 2px;
  cursor: pointer;
}
del.air-del + ins.air-ins { margin-left: 2px; }
[data-air-provisional] { opacity: 0.6; cursor: default; }
del.air-del.air-active, ins.air-ins.air-active { outline: 2px solid var(--air-accent); outline-offset: 1px; }
.air-stale { text-decoration-style: dotted !important; opacity: 0.7; }
[data-air-active-block] { background: linear-gradient(90deg, rgba(91, 75, 219, 0.07), transparent 70%); border-radius: 4px; }
[data-air-streaming] [data-air-active-block]::after {
  content: '';
  display: inline-block;
  width: 0.5em;
  height: 1em;
  margin-left: 2px;
  vertical-align: text-bottom;
  border-radius: 1px;
  background: var(--air-accent);
  animation: air-blink 1s steps(2) infinite;
}
@keyframes air-blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { [data-air-streaming] [data-air-active-block]::after { animation: none; } }

.air-ui, .air-ui * { box-sizing: border-box; }
.air-ui[hidden], .air-ui [hidden] { display: none !important; }
.air-ui {
  font: 13px/1.4 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: var(--air-text);
}
.air-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  margin: 6px 8px;
  background: var(--air-surface-2);
  border: 1px solid var(--air-border);
  border-radius: 8px;
  position: sticky;
  top: 0;
  z-index: 5;
}
.air-bar .air-status { flex: 1 1 auto; min-width: 10em; display: flex; align-items: center; gap: 8px; }
.air-bar .air-status-icon { width: 16px; height: 16px; flex: none; color: var(--air-accent); }
.air-bar[data-state="streaming"] .air-status-icon { animation: air-spin 1.2s linear infinite; }
@keyframes air-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .air-bar[data-state="streaming"] .air-status-icon { animation: none; } }
.air-bar[data-state="error"] { border-color: var(--air-del-fg); }
.air-bar[data-state="error"] .air-status-icon { color: var(--air-del-fg); }
.air-btn {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid var(--air-border);
  background: var(--air-surface);
  color: var(--air-text);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
}
.air-btn:hover { background: var(--air-surface-2); }
.air-btn:focus-visible, .air-input:focus-visible, .air-select:focus-visible, .air-menu-item:focus-visible {
  outline: 2px solid var(--air-accent);
  outline-offset: 1px;
}
.air-btn[disabled] { opacity: 0.45; cursor: not-allowed; }
.air-btn-primary { background: var(--air-accent); border-color: var(--air-accent); color: #fff; }
.air-btn-primary:hover { background: var(--air-accent); filter: brightness(1.08); }
.air-btn-icon { width: 28px; padding: 0; }
.air-btn svg { width: 16px; height: 16px; }
.air-btn-accept { color: var(--air-ins-fg); }
.air-btn-reject { color: var(--air-del-fg); }

.air-pop {
  position: absolute;
  z-index: 2147483000;
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--air-surface);
  border: 1px solid var(--air-border);
  border-radius: 8px;
  box-shadow: var(--air-shadow);
}

.air-menu {
  position: absolute;
  z-index: 2147483000;
  width: min(340px, calc(100vw - 16px));
  padding: 8px;
  background: var(--air-surface);
  border: 1px solid var(--air-border);
  border-radius: 10px;
  box-shadow: var(--air-shadow);
}
.air-menu form { display: flex; gap: 6px; }
.air-input, .air-select {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 32px;
  padding: 4px 8px;
  border: 1px solid var(--air-border);
  border-radius: 6px;
  background: var(--air-surface);
  color: var(--air-text);
  font: inherit;
}
.air-menu-list { list-style: none; margin: 6px 0 0; padding: 0; }
.air-menu-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--air-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.air-menu-item:hover, .air-menu-item[aria-selected="true"] { background: var(--air-surface-2); }
.air-menu-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--air-border);
  color: var(--air-muted);
  font-size: 12px;
}
.air-link { border: 0; background: none; padding: 2px 4px; color: var(--air-accent); font: inherit; cursor: pointer; border-radius: 4px; }
.air-link:focus-visible { outline: 2px solid var(--air-accent); }

.air-dialog {
  width: min(440px, calc(100vw - 32px));
  padding: 0;
  border: 1px solid var(--air-border);
  border-radius: 12px;
  background: var(--air-surface);
  color: var(--air-text);
  box-shadow: var(--air-shadow);
}
.air-dialog::backdrop { background: rgba(10, 10, 20, 0.4); }
.air-dialog form { display: grid; gap: 12px; padding: 18px; }
.air-dialog h2 { margin: 0; font-size: 16px; }
.air-field { display: grid; gap: 4px; }
.air-field label { font-weight: 600; }
.air-hint { margin: 0; color: var(--air-muted); font-size: 12px; }
.air-check { display: flex; gap: 8px; align-items: center; }
.air-dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }
.air-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); border: 0; white-space: nowrap; }
`;

const DARK_HOST = '[data-theme="dark"], [theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark';

/** Floating UI lives in <body>, outside the editor's theme: copy a dark theme over explicitly. */
export function applyTheme(element: HTMLElement, origin: Element): void {
  const dark = Boolean(origin.closest(DARK_HOST)) || Boolean(origin.ownerDocument.documentElement.closest(DARK_HOST)) || Boolean(origin.ownerDocument.body?.matches(DARK_HOST));
  element.classList.toggle('air-dark', dark);
}

export function ensureStyles(doc: Document = document): void {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS_TEXT;
  doc.head.appendChild(style);
}

export const ICONS = {
  sparkle:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 15l6-6 6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>',
  alert:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
};

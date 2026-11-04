const STYLE_ID = 'eag-styles';
const DARK_HOST = '[data-theme="dark"], [theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark';

const CSS_TEXT = `
.eag-panel {
  --eag-surface: #ffffff; --eag-surface-2: #f6f6f8; --eag-border: #dcdce3; --eag-text: #1d1d24; --eag-muted: #5d5d6b;
  --eag-accent: #5b4bdb; --eag-on-accent: #ffffff; --eag-error: #b42318; --eag-shadow: 0 8px 24px rgba(15, 15, 30, 0.14), 0 1px 3px rgba(15, 15, 30, 0.08);
  position: fixed; z-index: 2147483002; width: min(360px, calc(100vw - 32px)); max-height: min(620px, calc(100vh - 32px));
  display: flex; flex-direction: column; gap: 10px; padding: 14px; box-sizing: border-box;
  border: 1px solid var(--eag-border); border-radius: 12px; background: var(--eag-surface); color: var(--eag-text);
  box-shadow: var(--eag-shadow); font: 13px/1.45 system-ui, -apple-system, sans-serif;
}
.eag-panel.eag-dark {
  --eag-surface: #1f1f27; --eag-surface-2: #2a2a34; --eag-border: #3b3b48; --eag-text: #ececf1; --eag-muted: #a9a9b8;
  --eag-accent: #a99dff; --eag-on-accent: #15151b; --eag-error: #fca5a5; --eag-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}
.eag-panel *, .eag-panel *::before { box-sizing: border-box; }
.eag-panel header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.eag-panel h2 { margin: 0; font-size: 14px; font-weight: 600; }
.eag-model { color: var(--eag-muted); font-size: 12px; }
.eag-presets { display: flex; flex-wrap: wrap; gap: 6px; }
.eag-chip { font: inherit; font-size: 12px; padding: 4px 9px; border-radius: 999px; border: 1px solid var(--eag-border); background: var(--eag-surface-2); color: var(--eag-text); cursor: pointer; }
.eag-chip:hover { border-color: var(--eag-accent); }
.eag-form { display: flex; flex-direction: column; gap: 8px; }
.eag-form textarea {
  font: inherit; width: 100%; min-height: 64px; max-height: 180px; resize: vertical; padding: 8px 10px; border-radius: 8px;
  border: 1px solid var(--eag-border); background: var(--eag-surface); color: var(--eag-text);
}
.eag-row { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.eag-row select { font: inherit; font-size: 12px; padding: 5px 6px; border-radius: 7px; border: 1px solid var(--eag-border); background: var(--eag-surface); color: var(--eag-text); max-width: 100%; }
.eag-btn { font: inherit; font-size: 12.5px; padding: 6px 11px; border-radius: 7px; border: 1px solid var(--eag-border); background: var(--eag-surface); color: var(--eag-text); cursor: pointer; }
.eag-btn:hover { background: var(--eag-surface-2); }
.eag-btn:disabled { opacity: 0.55; cursor: default; }
.eag-btn-primary { background: var(--eag-accent); border-color: var(--eag-accent); color: var(--eag-on-accent); }
.eag-btn-primary:hover { background: var(--eag-accent); filter: brightness(1.08); }
.eag-btn:focus-visible, .eag-chip:focus-visible, .eag-form textarea:focus-visible, .eag-row select:focus-visible { outline: 2px solid var(--eag-accent); outline-offset: 2px; }
.eag-spacer { flex: 1; }
.eag-log { list-style: none; margin: 0; padding: 0; overflow: auto; flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; }
.eag-log li { padding: 5px 8px; border-radius: 7px; background: var(--eag-surface-2); overflow-wrap: anywhere; }
.eag-log li[data-kind="error"] { color: var(--eag-error); }
.eag-log li[data-kind="answer"] { background: transparent; border: 1px solid var(--eag-border); }
.eag-log li[data-kind="tool"] { color: var(--eag-muted); font-size: 12px; }
.eag-status { margin: 0; color: var(--eag-muted); font-size: 12px; min-height: 1.4em; }
.eag-panel [hidden] { display: none !important; }
@media (prefers-reduced-motion: no-preference) { .eag-busy::after { content: '…'; animation: eag-dots 1.2s steps(4) infinite; } }
@keyframes eag-dots { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }
`;

export function ensureStyles(doc: Document = document): void {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS_TEXT;
  doc.head.appendChild(style);
}

/** The panel lives in <body>, outside the editor's theme: copy a dark theme over explicitly. */
export function applyTheme(element: HTMLElement, origin: Element): void {
  const dark = Boolean(origin.closest(DARK_HOST)) || Boolean(origin.ownerDocument.body?.matches(DARK_HOST));
  element.classList.toggle('eag-dark', dark);
}

export const AGENT_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 7V4"/><circle cx="12" cy="3" r="1"/><path d="M9 12v1M15 12v1"/><path d="M9.5 16h5"/></svg>';

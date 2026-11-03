import type { OriginKind } from '../core/types.js';

const STYLE_ID = 'eda-authorship-styles';
const DARK_HOST = '[data-theme="dark"], [theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark';

export const HIGHLIGHT_PREFIX = 'eda-auth-';
/** Kinds shown when highlights are turned on (typed and pre-existing text stay plain). */
export const DEFAULT_HIGHLIGHT_KINDS: OriginKind[] = ['pasted', 'ai', 'collaborator', 'tool', 'external'];

const KIND_VARS = (['typed', 'pasted', 'ai', 'collaborator', 'tool', 'external', 'existing'] as OriginKind[])
  .map((kind) => `::highlight(${HIGHLIGHT_PREFIX}${kind}) { background-color: var(--eda-${kind}-bg); }\n.eda-overlay-${kind} { background-color: var(--eda-${kind}-bg); }\n.eda-swatch-${kind} { background-color: var(--eda-${kind}-swatch); }`)
  .join('\n');

const CSS_TEXT = `
:root {
  --eda-typed-bg: rgba(34, 197, 94, 0.16);
  --eda-pasted-bg: rgba(245, 158, 11, 0.28);
  --eda-ai-bg: rgba(139, 92, 246, 0.24);
  --eda-collaborator-bg: rgba(59, 130, 246, 0.22);
  --eda-tool-bg: rgba(20, 184, 166, 0.22);
  --eda-external-bg: rgba(220, 38, 38, 0.16);
  --eda-existing-bg: rgba(107, 114, 128, 0.16);
  --eda-typed-swatch: #22a35a;
  --eda-pasted-swatch: #d48806;
  --eda-ai-swatch: #7c5cf0;
  --eda-collaborator-swatch: #3b7ddd;
  --eda-tool-swatch: #13a394;
  --eda-external-swatch: #d14343;
  --eda-existing-swatch: #8a8f98;
  --eda-surface: #ffffff;
  --eda-surface-2: #f6f6f8;
  --eda-border: #dcdce3;
  --eda-text: #1d1d24;
  --eda-muted: #5d5d6b;
  --eda-accent: #5b4bdb;
  --eda-shadow: 0 8px 24px rgba(15, 15, 30, 0.14), 0 1px 3px rgba(15, 15, 30, 0.08);
}
.dark, [data-theme="dark"], [theme="dark"], .editora-theme-dark, .rte-theme-dark, .eda-dark {
  --eda-typed-bg: rgba(74, 222, 128, 0.16);
  --eda-pasted-bg: rgba(251, 191, 36, 0.24);
  --eda-ai-bg: rgba(167, 139, 250, 0.26);
  --eda-collaborator-bg: rgba(96, 165, 250, 0.24);
  --eda-tool-bg: rgba(45, 212, 191, 0.2);
  --eda-external-bg: rgba(248, 113, 113, 0.2);
  --eda-existing-bg: rgba(156, 163, 175, 0.18);
  --eda-typed-swatch: #4ade80;
  --eda-pasted-swatch: #fbbf24;
  --eda-ai-swatch: #a78bfa;
  --eda-collaborator-swatch: #60a5fa;
  --eda-tool-swatch: #2dd4bf;
  --eda-external-swatch: #f87171;
  --eda-existing-swatch: #9ca3af;
  --eda-surface: #1f1f27;
  --eda-surface-2: #2a2a34;
  --eda-border: #3b3b48;
  --eda-text: #ececf1;
  --eda-muted: #a9a9b8;
  --eda-accent: #a99dff;
  --eda-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}
${KIND_VARS}
.eda-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 2147483000; }
.eda-overlay > div { position: fixed; border-radius: 2px; }
.eda-tooltip {
  position: fixed; z-index: 2147483001; pointer-events: none; max-width: 280px;
  padding: 6px 9px; border-radius: 7px; font: 12px/1.4 system-ui, -apple-system, sans-serif;
  background: var(--eda-text); color: var(--eda-surface); box-shadow: var(--eda-shadow);
}
.eda-tooltip[hidden] { display: none; }
.eda-tooltip b { font-weight: 600; }
.eda-tooltip span { display: block; opacity: 0.75; }
[data-command="toggleAuthorship"] { position: relative; }
[data-eda-recording="true"] [data-command="toggleAuthorship"]::after {
  content: ''; position: absolute; top: 4px; right: 4px; width: 6px; height: 6px; border-radius: 50%;
  background: #e5484d; box-shadow: 0 0 0 1.5px var(--eda-surface);
}
.eda-panel {
  position: fixed; z-index: 2147483002; width: min(340px, calc(100vw - 32px)); max-height: min(560px, calc(100vh - 32px)); overflow: auto;
  padding: 14px; border: 1px solid var(--eda-border); border-radius: 12px; background: var(--eda-surface); color: var(--eda-text);
  box-shadow: var(--eda-shadow); font: 13px/1.45 system-ui, -apple-system, sans-serif; box-sizing: border-box;
}
.eda-panel *, .eda-replay * { box-sizing: border-box; }
.eda-panel h2 { margin: 0 0 2px; font-size: 14px; font-weight: 600; }
.eda-panel .eda-status { margin: 0 0 12px; color: var(--eda-muted); font-size: 12px; display: flex; align-items: center; gap: 6px; }
.eda-panel .eda-status::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--eda-muted); }
.eda-panel .eda-status[data-recording="true"]::before { background: #e5484d; }
.eda-bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; background: var(--eda-surface-2); margin-bottom: 10px; }
.eda-bar > span { display: block; height: 100%; }
.eda-kinds { list-style: none; margin: 0 0 12px; padding: 0; }
.eda-kinds li { display: flex; align-items: center; gap: 8px; padding: 3px 0; }
.eda-kinds label { display: flex; align-items: center; gap: 8px; flex: 1; cursor: pointer; }
.eda-kinds input { margin: 0; accent-color: var(--eda-accent); }
.eda-swatch { width: 10px; height: 10px; border-radius: 3px; flex: none; }
.eda-kinds .eda-share { color: var(--eda-muted); font-variant-numeric: tabular-nums; }
.eda-section { margin: 0 0 12px; }
.eda-section h3 { margin: 0 0 4px; font-size: 12px; font-weight: 600; color: var(--eda-muted); text-transform: uppercase; letter-spacing: 0.03em; }
.eda-section ul { margin: 0; padding: 0 0 0 16px; }
.eda-section p { margin: 0; }
.eda-caret { padding: 7px 9px; border-radius: 8px; background: var(--eda-surface-2); margin-bottom: 12px; min-height: 2.4em; }
.eda-actions { display: flex; flex-wrap: wrap; gap: 6px; }
.eda-btn {
  font: inherit; font-size: 12.5px; padding: 6px 10px; border-radius: 7px; border: 1px solid var(--eda-border);
  background: var(--eda-surface); color: var(--eda-text); cursor: pointer;
}
.eda-btn:hover { background: var(--eda-surface-2); }
.eda-btn:focus-visible, .eda-kinds input:focus-visible { outline: 2px solid var(--eda-accent); outline-offset: 2px; }
.eda-btn-primary { background: var(--eda-accent); border-color: var(--eda-accent); color: #fff; }
.eda-btn-primary:hover { background: var(--eda-accent); filter: brightness(1.08); }
.eda-dark .eda-btn-primary, .dark .eda-btn-primary, [data-theme="dark"] .eda-btn-primary { color: #15151b; }
.eda-replay-backdrop { position: fixed; inset: 0; z-index: 2147483003; background: rgba(10, 10, 20, 0.45); display: flex; align-items: center; justify-content: center; padding: 16px; }
.eda-replay {
  width: min(760px, 100%); max-height: calc(100vh - 32px); display: flex; flex-direction: column; gap: 10px;
  padding: 16px; border-radius: 14px; background: var(--eda-surface); color: var(--eda-text); box-shadow: var(--eda-shadow);
  font: 13px/1.45 system-ui, -apple-system, sans-serif;
}
.eda-replay header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.eda-replay h2 { margin: 0; font-size: 15px; }
.eda-replay-text {
  flex: 1; min-height: 220px; overflow: auto; padding: 12px 14px; border: 1px solid var(--eda-border); border-radius: 10px;
  background: var(--eda-surface-2); white-space: pre-wrap; overflow-wrap: anywhere; font: 14px/1.6 ui-serif, Georgia, serif;
}
.eda-replay-text .eda-caret-mark { display: inline-block; width: 2px; height: 1.1em; vertical-align: text-bottom; background: var(--eda-accent); margin-left: 1px; }
.eda-replay-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.eda-replay-controls input[type="range"] { flex: 1; min-width: 160px; accent-color: var(--eda-accent); }
.eda-replay-controls select { font: inherit; padding: 5px 6px; border-radius: 7px; border: 1px solid var(--eda-border); background: var(--eda-surface); color: var(--eda-text); }
.eda-replay-time { color: var(--eda-muted); font-variant-numeric: tabular-nums; font-size: 12px; min-width: 9em; }
.eda-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (prefers-reduced-motion: reduce) { .eda-replay-text .eda-caret-mark { display: none; } }
`;

export function ensureStyles(doc: Document = document): void {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS_TEXT;
  doc.head.appendChild(style);
}

/** Floating UI lives in <body>, outside the editor's theme: copy a dark theme over explicitly. */
export function applyTheme(element: HTMLElement, origin: Element): void {
  const dark = Boolean(origin.closest(DARK_HOST)) || Boolean(origin.ownerDocument.body?.matches(DARK_HOST));
  element.classList.toggle('eda-dark', dark);
}

export const ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/><path d="M15 20h5"/></svg>';

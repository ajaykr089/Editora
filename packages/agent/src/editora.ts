/**
 * Editora plugin: an "Agent" toolbar button and Mod+Shift+K shortcut that
 * open a chat panel. The agent reads and edits the whole document; its
 * edits appear as suggestions to accept or reject, and an accepted run is
 * one undo step.
 *
 *   import { AgentPlugin } from '@editora/agent/editora';
 *   import { createOllamaAgentProvider } from '@editora/agent';
 *   editor.setConfig({ plugins: ['bold', 'history', AgentPlugin({ provider: createOllamaAgentProvider() })], toolbar: '... | openAgent' });
 */
import { attachAgent, type AgentController, type AttachAgentOptions } from './dom/attach.js';
import { createAgentPanel, type AgentPanel, type AgentPanelLabels } from './dom/panel.js';
import { connectMcpBridge, type McpBridgeConnection } from './dom/mcp-client.js';
import { AGENT_ICON } from './dom/styles.js';

/** The subset of @editora/core's Plugin type this plugin fills in. */
export interface EditoraPlugin {
  name: string;
  toolbar?: Array<{ label: string; command?: string; icon?: string; shortcut?: string; type?: 'button' }>;
  commands?: Record<string, (...args: any[]) => any>;
  keymap?: Record<string, string>;
  init?: (context: { editorElement?: unknown }) => void;
  destroy?: () => void;
}

export interface AgentPluginOptions extends Omit<AttachAgentOptions, 'onReviewEnd'> {
  /** Toolbar button label (default "Agent"). */
  label?: string;
  /** Shortcut that opens the panel (default Mod-Shift-k); false for none. */
  shortcut?: string | false;
  labels?: Partial<AgentPanelLabels>;
  /** Let an MCP client (Claude Desktop, Claude Code, Cursor) edit this editor through `editora-mcp`. */
  mcp?: { url: string; token: string };
  /** Called with each editor's controller. */
  onReady?: (controller: AgentController) => void;
}

interface CommandContext {
  editorElement?: unknown;
  contentElement?: unknown;
}

interface Attached {
  controller: AgentController;
  panel: AgentPanel;
  host: Element | null;
  bridge: McpBridgeConnection | null;
}

const CONTENT_SELECTOR = '.rte-content, .editora-content';
const EDITOR_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';

function contentOf(element: Element | null): HTMLElement | null {
  if (!element) return null;
  if (element.matches(CONTENT_SELECTOR)) return element as HTMLElement;
  return element.querySelector<HTMLElement>(CONTENT_SELECTOR);
}

function resolveContent(context?: CommandContext): HTMLElement | null {
  if (context?.contentElement instanceof HTMLElement) return context.contentElement;
  if (context?.editorElement instanceof HTMLElement) {
    const content = contentOf(context.editorElement);
    if (content) return content;
  }
  const explicit = (window as any)[COMMAND_EDITOR_CONTEXT_KEY];
  if (explicit instanceof HTMLElement) {
    const content = contentOf(explicit.closest(EDITOR_SELECTOR) ?? explicit);
    if (content) return content;
  }
  const selection = window.getSelection();
  const node = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).startContainer : null;
  const fromSelection = (node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : node?.parentElement)?.closest<HTMLElement>(CONTENT_SELECTOR);
  if (fromSelection) return fromSelection;
  const active = document.activeElement?.closest<HTMLElement>(CONTENT_SELECTOR);
  return active ?? document.querySelector<HTMLElement>(CONTENT_SELECTOR);
}

/** `Mod-Shift-k` style shortcut -> event test. Mod is Cmd on Apple platforms, Ctrl elsewhere. */
function shortcutMatcher(shortcut: string): (event: KeyboardEvent) => boolean {
  const parts = shortcut.toLowerCase().split('-');
  const key = parts.pop() ?? '';
  const apple = typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);
  const want = {
    ctrl: parts.includes('ctrl') || (parts.includes('mod') && !apple),
    meta: parts.includes('meta') || parts.includes('cmd') || (parts.includes('mod') && apple),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
  };
  return (event) => event.key.toLowerCase() === key && event.ctrlKey === want.ctrl && event.metaKey === want.meta && event.shiftKey === want.shift && event.altKey === want.alt;
}

function recordHistory(content: HTMLElement, beforeHTML: string, afterHTML: string): void {
  if (beforeHTML === afterHTML) return;
  const w = window as any;
  try {
    if (typeof w.execEditorCommand === 'function') w.execEditorCommand('recordDomTransaction', content, beforeHTML, afterHTML);
    else if (typeof w.executeEditorCommand === 'function') w.executeEditorCommand('recordDomTransaction', { editor: content, beforeHTML, afterHTML });
  } catch {
    // History plugin not loaded.
  }
  // Let the editor's change listeners (onChange, autosave) see the result.
  content.dispatchEvent(new Event('input', { bubbles: true }));
}

export function AgentPlugin(options: AgentPluginOptions = {}): EditoraPlugin {
  const attached = new Map<HTMLElement, Attached>();
  const hosts = new Set<Element>();

  const attach = (content: HTMLElement): Attached => {
    for (const [element, entry] of attached) {
      if (!element.isConnected) {
        entry.bridge?.close();
        entry.panel.destroy();
        entry.controller.destroy();
        attached.delete(element);
      }
    }
    let entry = attached.get(content);
    if (entry) return entry;
    const controller = attachAgent(content, { ...options, onReviewEnd: (info) => recordHistory(content, info.beforeHTML, info.afterHTML) });
    const panel = createAgentPanel(controller, { labels: options.labels });
    const bridge = options.mcp ? connectMcpBridge(controller, options.mcp) : null;
    entry = { controller, panel, host: content.closest(EDITOR_SELECTOR), bridge };
    attached.set(content, entry);
    options.onReady?.(controller);
    return entry;
  };

  const withEntry = (context: CommandContext | undefined, run: (entry: Attached) => unknown) => {
    const content = resolveContent(context);
    if (!content) return false;
    return run(attach(content));
  };

  const open = (entry: Attached) => entry.panel.show(entry.host?.querySelector('[data-command="openAgent"]') ?? null);

  const shortcut = options.shortcut === undefined ? 'Mod-Shift-k' : options.shortcut;
  // Editora's editor does not dispatch plugin keymaps yet, so listen for the shortcut here.
  const matchesShortcut = shortcut ? shortcutMatcher(shortcut) : null;
  const onKeyDown = (event: KeyboardEvent) => {
    if (!matchesShortcut?.(event)) return;
    const content = (event.target as Element | null)?.closest?.<HTMLElement>(CONTENT_SELECTOR);
    if (!content) return;
    event.preventDefault();
    event.stopPropagation();
    open(attach(content));
  };
  if (matchesShortcut && typeof document !== 'undefined') document.addEventListener('keydown', onKeyDown, true);

  return {
    name: 'agent',
    toolbar: [{ label: options.label ?? 'Agent', command: 'openAgent', icon: AGENT_ICON, ...(shortcut ? { shortcut } : {}) }],
    init(context) {
      const host = context?.editorElement;
      if (!(host instanceof Element)) return;
      hosts.add(host);
      // With MCP the editor must be reachable before anyone opens the panel.
      if (!options.mcp) return;
      const ready = () => {
        const content = contentOf(host);
        if (content) attach(content);
      };
      if (contentOf(host)) ready();
      else host.addEventListener('editor-ready', ready, { once: true });
    },
    commands: {
      openAgent: (_value?: unknown, context?: CommandContext) =>
        withEntry(context, (entry) => {
          if (entry.panel.open) entry.panel.close();
          else open(entry);
          return true;
        }),
      runAgent: (instruction?: unknown, context?: CommandContext) =>
        withEntry(context, (entry) => (typeof instruction === 'string' && instruction ? entry.panel.run(instruction) : false)),
      stopAgent: (_value?: unknown, context?: CommandContext) => withEntry(context, (entry) => (entry.controller.stop(), true)),
      /** The controller for the current editor. */
      getAgent: (_value?: unknown, context?: CommandContext) => withEntry(context, (entry) => entry.controller),
    },
    keymap: shortcut ? { [shortcut]: 'openAgent' } : {},
    destroy() {
      if (typeof document !== 'undefined') document.removeEventListener('keydown', onKeyDown, true);
      for (const entry of attached.values()) {
        entry.bridge?.close();
        entry.panel.destroy();
        entry.controller.destroy();
      }
      attached.clear();
      hosts.clear();
    },
  };
}

export { attachAgent } from './dom/attach.js';
export type { AgentController, AttachAgentOptions } from './dom/attach.js';

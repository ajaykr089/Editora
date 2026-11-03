/**
 * Editora plugin: records authorship for the editor from the moment it is
 * ready, marks the toolbar button with a red dot while recording, and opens
 * a panel with highlights, a summary, replay and export.
 *
 *   import { AuthorshipPlugin } from '@editora/authorship/editora';
 *   editor.setConfig({ plugins: ['bold', 'history', AuthorshipPlugin({ author: 'Ana' })], toolbar: '... | toggleAuthorship' });
 */
import { attachAuthorship, type AttachAuthorshipOptions, type AuthorshipController } from './dom/attach.js';
import { createHighlighter, type Highlighter } from './dom/highlight.js';
import type { AuthorshipLabels } from './dom/labels.js';
import { createAuthorshipPanel, type AuthorshipPanel } from './dom/panel.js';
import { openReplayView } from './dom/replay-view.js';
import { ICON } from './dom/styles.js';
import type { OriginKind } from './core/types.js';

/** The subset of @editora/core's Plugin type this plugin fills in. */
export interface EditoraPlugin {
  name: string;
  toolbar?: Array<{ label: string; command?: string; icon?: string; type?: 'button' }>;
  commands?: Record<string, (...args: any[]) => any>;
  init?: (context: { editorElement?: unknown }) => void;
  destroy?: () => void;
}

export interface AuthorshipPluginOptions extends Omit<AttachAuthorshipOptions, 'autoStart'> {
  /** Start recording when the editor is ready (default true; adding the plugin is the opt-in). */
  autoStart?: boolean;
  /** Kinds shaded when the panel is open. */
  highlight?: OriginKind[];
  labels?: Partial<AuthorshipLabels>;
  /** Toolbar button label (default "Authorship"). */
  label?: string;
  /** Called by the panel's Export button instead of downloading a file. */
  onExport?: (json: string) => void;
  /** Called with each editor's controller once it is recording (to save `serialize()` with the content). */
  onReady?: (controller: AuthorshipController) => void;
}

interface CommandContext {
  editorElement?: unknown;
  contentElement?: unknown;
}

interface Attached {
  controller: AuthorshipController;
  highlighter: Highlighter;
  panel: AuthorshipPanel;
  host: Element | null;
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
  const active = document.activeElement?.closest<HTMLElement>(CONTENT_SELECTOR);
  return active ?? document.querySelector<HTMLElement>(CONTENT_SELECTOR);
}

export function AuthorshipPlugin(options: AuthorshipPluginOptions = {}): EditoraPlugin {
  const attached = new Map<HTMLElement, Attached>();
  // Editors this plugin was configured on (from init); without any (React), the first editor used.
  const hosts = new Set<Element>();

  const setRecording = (entry: Attached) => {
    entry.host?.setAttribute('data-eda-recording', String(entry.controller.recording));
    const button = entry.host?.querySelector('[data-command="toggleAuthorship"]');
    button?.setAttribute('aria-label', `${options.label ?? 'Authorship'}${entry.controller.recording ? ' (recording)' : ''}`);
  };

  const attach = (content: HTMLElement): Attached => {
    for (const [element, entry] of attached) {
      if (!element.isConnected) {
        entry.panel.destroy();
        entry.highlighter.destroy();
        entry.controller.destroy();
        attached.delete(element);
      }
    }
    let entry = attached.get(content);
    if (entry) return entry;
    const controller = attachAuthorship(content, { ...options, autoStart: false });
    const highlighter = createHighlighter(controller, { kinds: options.highlight, labels: options.labels });
    const host = content.closest(EDITOR_SELECTOR);
    const panel = createAuthorshipPanel(controller, highlighter, {
      labels: options.labels,
      onExport: options.onExport,
      onReplay: () => {
        const state = controller.serialize();
        if (state.log) openReplayView(state.log, { origins: state.origins, labels: options.labels, themeFrom: content });
      },
    });
    entry = { controller, highlighter, panel, host };
    attached.set(content, entry);
    const current = entry;
    controller.on('start', () => setRecording(current));
    controller.on('stop', () => setRecording(current));
    if (options.autoStart !== false) controller.start();
    setRecording(entry);
    options.onReady?.(controller);
    return entry;
  };

  const attachHost = (host: Element) => {
    const content = contentOf(host);
    if (content) attach(content);
  };

  // Lazy attach: the first focus or input in an editor this plugin belongs to.
  const onFirstUse = (event: Event) => {
    const content = (event.target as Element | null)?.closest?.<HTMLElement>(CONTENT_SELECTOR);
    if (!content || attached.has(content)) return;
    const host = content.closest(EDITOR_SELECTOR);
    if (hosts.size && (!host || !hosts.has(host))) return;
    attach(content);
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('focusin', onFirstUse, true);
    document.addEventListener('beforeinput', onFirstUse, true);
  }

  const withEntry = (context: CommandContext | undefined, run: (entry: Attached, content: HTMLElement) => void) => {
    const content = resolveContent(context);
    if (!content) return false;
    run(attach(content), content);
    return true;
  };

  return {
    name: 'authorship',
    toolbar: [{ label: options.label ?? 'Authorship', command: 'toggleAuthorship', icon: ICON }],
    init(context) {
      const host = context?.editorElement;
      if (!(host instanceof Element)) return;
      hosts.add(host);
      const ready = () => attachHost(host);
      if (contentOf(host)) ready();
      else host.addEventListener('editor-ready', ready, { once: true });
    },
    commands: {
      toggleAuthorship: (_value?: unknown, context?: CommandContext) =>
        withEntry(context, (entry) => {
          const button = entry.host?.querySelector('[data-command="toggleAuthorship"]');
          entry.panel.toggle(button ?? null);
        }),
      toggleAuthorshipHighlights: (_value?: unknown, context?: CommandContext) =>
        withEntry(context, (entry) => (entry.highlighter.visible ? entry.highlighter.hide() : entry.highlighter.show())),
      startAuthorship: (_value?: unknown, context?: CommandContext) => withEntry(context, (entry) => entry.controller.start()),
      stopAuthorship: (_value?: unknown, context?: CommandContext) => withEntry(context, (entry) => entry.controller.stop()),
      openAuthorshipReplay: (_value?: unknown, context?: CommandContext) =>
        withEntry(context, (entry, content) => {
          const state = entry.controller.serialize();
          if (state.log) openReplayView(state.log, { origins: state.origins, labels: options.labels, themeFrom: content });
        }),
      /** The controller for the current editor (serialize, report, expect). */
      getAuthorship: (_value?: unknown, context?: CommandContext) => {
        const content = resolveContent(context);
        return content ? attach(content).controller : null;
      },
    },
    destroy() {
      if (typeof document !== 'undefined') {
        document.removeEventListener('focusin', onFirstUse, true);
        document.removeEventListener('beforeinput', onFirstUse, true);
      }
      for (const entry of attached.values()) {
        entry.panel.destroy();
        entry.highlighter.destroy();
        entry.controller.destroy();
        entry.host?.removeAttribute('data-eda-recording');
      }
      attached.clear();
      hosts.clear();
    },
  };
}

export { attachAuthorship } from './dom/attach.js';
export type { AuthorshipController, AttachAuthorshipOptions } from './dom/attach.js';

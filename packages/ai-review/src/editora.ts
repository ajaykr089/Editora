/**
 * Editora plugin: an "AI" toolbar button and Mod+J shortcut that open the
 * Ask-AI menu; the rewrite comes back as suggestions to accept or reject.
 *
 *   import { AIReviewPlugin } from '@editora/ai-review/editora';
 *   editor.setConfig({ plugins: ['bold', 'italic', 'history', AIReviewPlugin()] });
 */
import { attachAIReview, type AIReviewController, type AttachOptions } from './dom/attach';
import { ICONS } from './dom/styles';

/** The subset of @editora/core's Plugin type this plugin fills in. */
export interface EditoraPlugin {
  name: string;
  toolbar?: Array<{ label: string; command?: string; icon?: string; shortcut?: string; type?: 'button' }>;
  commands?: Record<string, (...args: any[]) => any>;
  keymap?: Record<string, string>;
  destroy?: () => void;
}

export interface AIReviewPluginOptions extends Omit<AttachOptions, 'barHost'> {
  /** Toolbar button label (default "AI"). */
  label?: string;
  /** Shortcut that opens the menu (default Mod-j); false for none. */
  shortcut?: string | false;
}

interface CommandContext {
  editorElement?: unknown;
  contentElement?: unknown;
}

const CONTENT_SELECTOR = '.rte-content, .editora-content';
const EDITOR_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';

function contentOf(element: Element | null): HTMLElement | null {
  if (!element) return null;
  if (element.matches('[contenteditable="true"]')) return element as HTMLElement;
  return element.querySelector<HTMLElement>(CONTENT_SELECTOR) ?? element.querySelector<HTMLElement>('[contenteditable="true"]');
}

function resolveContent(context?: CommandContext): HTMLElement | null {
  if (context?.contentElement instanceof HTMLElement) return context.contentElement;
  if (context?.editorElement instanceof HTMLElement) {
    const content = contentOf(context.editorElement);
    if (content) return content;
  }

  // Toolbar clicks record which editor they came from.
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
  return (event) =>
    event.key.toLowerCase() === key &&
    event.ctrlKey === want.ctrl &&
    event.metaKey === want.meta &&
    event.shiftKey === want.shift &&
    event.altKey === want.alt;
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

export function AIReviewPlugin(options: AIReviewPluginOptions = {}): EditoraPlugin {
  const controllers = new Map<HTMLElement, AIReviewController>();

  const controllerFor = (content: HTMLElement): AIReviewController => {
    for (const [element, controller] of controllers) {
      if (!element.isConnected) {
        controller.destroy();
        controllers.delete(element);
      }
    }
    let controller = controllers.get(content);
    if (!controller) {
      controller = attachAIReview(content, {
        ...options,
        onEnd: (info) => {
          if (!info.cancelled || info.accepted > 0) recordHistory(content, info.beforeHTML, info.afterHTML);
          options.onEnd?.(info);
        },
      });
      controllers.set(content, controller);
    }
    return controller;
  };

  const withContent = (context: CommandContext | undefined, run: (controller: AIReviewController, content: HTMLElement) => void) => {
    const content = resolveContent(context);
    if (!content) return false;
    run(controllerFor(content), content);
    return true;
  };

  const shortcut = options.shortcut === undefined ? 'Mod-j' : options.shortcut;

  // Editora's editor does not dispatch plugin keymaps yet, so listen for the shortcut here.
  const matchesShortcut = shortcut ? shortcutMatcher(shortcut) : null;
  const onKeyDown = (event: KeyboardEvent) => {
    if (!matchesShortcut?.(event)) return;
    const target = event.target as Element | null;
    const content = target?.closest?.<HTMLElement>(CONTENT_SELECTOR);
    if (!content) return;
    event.preventDefault();
    event.stopPropagation();
    controllerFor(content).openMenu(null);
  };
  if (matchesShortcut && typeof document !== 'undefined') document.addEventListener('keydown', onKeyDown, true);

  return {
    name: 'aiReview',
    toolbar: [
      {
        label: options.label ?? 'AI',
        command: 'openAIReview',
        icon: ICONS.sparkle.replace('<svg ', '<svg width="24" height="24" '),
        ...(shortcut ? { shortcut } : {}),
      },
    ],
    commands: {
      openAIReview: (_value?: unknown, context?: CommandContext) =>
        withContent(context, (controller, content) => {
          const host = content.closest(EDITOR_SELECTOR) ?? content.parentElement;
          const button = host?.querySelector('[data-command="openAIReview"]');
          // From the toolbar, open under the button; from the keyboard, under the selection.
          const fromToolbar = button && (document.activeElement === button || button.matches(':hover'));
          controller.openMenu(fromToolbar ? button : null);
        }),
      aiRewrite: (instruction?: unknown, context?: CommandContext) =>
        withContent(context, (controller) => {
          void controller.rewrite(typeof instruction === 'string' && instruction ? instruction : 'improve').catch(() => undefined);
        }),
      aiReviewAcceptAll: (_value?: unknown, context?: CommandContext) =>
        withContent(context, (controller) => controller.current?.acceptAll()),
      aiReviewRejectAll: (_value?: unknown, context?: CommandContext) =>
        withContent(context, (controller) => controller.current?.rejectAll()),
      aiReviewSettings: (_value?: unknown, context?: CommandContext) =>
        withContent(context, (controller) => void controller.openSettings()),
    },
    keymap: shortcut ? { [shortcut]: 'openAIReview' } : {},
    destroy() {
      if (typeof document !== 'undefined') document.removeEventListener('keydown', onKeyDown, true);
      controllers.forEach((controller) => controller.destroy());
      controllers.clear();
    },
  };
}

export { attachAIReview } from './dom/attach';
export type { AIReviewController, AttachOptions } from './dom/attach';

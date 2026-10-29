/**
 * Editora plugin: an "Accessibility" toolbar button that shows problems next
 * to the content and offers fixes. Every fix is one undo step.
 *
 *   import { ContentA11yPlugin } from '@editora/content-a11y/editora';
 *   editor.setConfig({ plugins: ['heading', 'bold', 'link', 'history', ContentA11yPlugin({ minHeadingLevel: 2 })] });
 */
import { fixContent } from './check';
import { attachContentChecker, type ContentChecker, type ContentCheckerOptions } from './overlay';

export interface EditoraPlugin {
  name: string;
  toolbar?: Array<{ label: string; command?: string; icon?: string; type?: 'button' }>;
  commands?: Record<string, (...args: any[]) => any>;
  destroy?: () => void;
}

export interface ContentA11yPluginOptions extends Omit<ContentCheckerOptions, 'onFix' | 'markers'> {
  /** Show the markers as soon as the editor loads instead of on the first button press (default false). */
  showOnLoad?: boolean;
}

interface CommandContext {
  editorElement?: unknown;
  contentElement?: unknown;
}

const CONTENT_SELECTOR = '.rte-content, .editora-content';
const EDITOR_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';

const ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="4.5" r="1.8"/><path d="M5 8.5l7 1.5 7-1.5M12 10v5M9 21l3-6 3 6"/></svg>';

function resolveContent(context?: CommandContext): HTMLElement | null {
  if (context?.contentElement instanceof HTMLElement) return context.contentElement;
  const host = context?.editorElement instanceof HTMLElement ? context.editorElement : (window as any)[COMMAND_EDITOR_CONTEXT_KEY];
  if (host instanceof HTMLElement) {
    const editor = host.closest(EDITOR_SELECTOR) ?? host;
    const content = editor.matches(CONTENT_SELECTOR) ? editor : editor.querySelector<HTMLElement>(CONTENT_SELECTOR);
    if (content) return content as HTMLElement;
  }
  const selection = window.getSelection();
  const node = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).startContainer : null;
  const fromSelection = (node?.nodeType === 1 ? (node as Element) : node?.parentElement)?.closest<HTMLElement>(CONTENT_SELECTOR);
  return fromSelection ?? document.activeElement?.closest<HTMLElement>(CONTENT_SELECTOR) ?? document.querySelector<HTMLElement>(CONTENT_SELECTOR);
}

function recordHistory(content: HTMLElement, beforeHTML: string): void {
  const afterHTML = content.innerHTML;
  if (beforeHTML === afterHTML) return;
  const w = window as any;
  try {
    if (typeof w.execEditorCommand === 'function') w.execEditorCommand('recordDomTransaction', content, beforeHTML, afterHTML);
    else if (typeof w.executeEditorCommand === 'function') w.executeEditorCommand('recordDomTransaction', { editor: content, beforeHTML, afterHTML });
  } catch {
    // History plugin not loaded.
  }
  content.dispatchEvent(new Event('input', { bubbles: true }));
}

function updateButton(content: HTMLElement, errors: number, warnings: number, active: boolean): void {
  const host = content.closest(EDITOR_SELECTOR) ?? content.parentElement;
  const button = host?.querySelector<HTMLElement>('[data-command="toggleContentA11y"]');
  if (!button) return;
  const total = errors + warnings;
  button.title = total === 0 ? 'Accessibility: no problems found' : `Accessibility: ${errors} error${errors === 1 ? '' : 's'}, ${warnings} warning${warnings === 1 ? '' : 's'}`;
  button.setAttribute('aria-label', button.title);
  button.setAttribute('aria-pressed', String(active));
  button.style.position = 'relative';
  let badge = button.querySelector<HTMLElement>('.cax-badge');
  if (total === 0) {
    badge?.remove();
    return;
  }
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'cax-badge';
    badge.setAttribute('aria-hidden', 'true');
    Object.assign(badge.style, {
      position: 'absolute', top: '-4px', right: '-4px', minWidth: '16px', height: '16px', padding: '0 4px',
      borderRadius: '8px', background: errors ? '#b42318' : '#8a4b00', color: '#fff', font: '700 10px/16px system-ui, sans-serif',
      textAlign: 'center', pointerEvents: 'none',
    });
    button.appendChild(badge);
  }
  badge.style.background = errors ? '#b42318' : '#8a4b00';
  badge.textContent = String(total);
}

export function ContentA11yPlugin(options: ContentA11yPluginOptions = {}): EditoraPlugin {
  const checkers = new Map<HTMLElement, { checker: ContentChecker; visible: boolean }>();

  const entryFor = (content: HTMLElement) => {
    for (const [element, entry] of checkers) {
      if (!element.isConnected) {
        entry.checker.destroy();
        checkers.delete(element);
      }
    }
    let entry = checkers.get(content);
    if (!entry) {
      const state = { visible: false };
      const checker = attachContentChecker(content, {
        ...options,
        markers: false,
        onChange: (result) => {
          updateButton(content, result.errors, result.warnings, state.visible);
          options.onChange?.(result);
        },
        onFix: ({ beforeHTML }) => recordHistory(content, beforeHTML),
      });
      entry = Object.assign(state, { checker });
      checkers.set(content, entry);
    }
    return entry;
  };

  if (options.showOnLoad && typeof document !== 'undefined') {
    setTimeout(() => {
      document.querySelectorAll<HTMLElement>(CONTENT_SELECTOR).forEach((content) => {
        const entry = entryFor(content);
        entry.visible = true;
        entry.checker.setMarkersVisible(true);
        updateButton(content, entry.checker.result.errors, entry.checker.result.warnings, true);
      });
    }, 0);
  }

  return {
    name: 'contentA11y',
    toolbar: [{ label: 'Accessibility check', command: 'toggleContentA11y', icon: ICON }],
    commands: {
      toggleContentA11y: (_value?: unknown, context?: CommandContext) => {
        const content = resolveContent(context);
        if (!content) return false;
        const entry = entryFor(content);
        entry.visible = !entry.visible;
        entry.checker.check();
        entry.checker.setMarkersVisible(entry.visible);
        updateButton(content, entry.checker.result.errors, entry.checker.result.warnings, entry.visible);
        if (entry.visible) entry.checker.focusNext(1);
        return true;
      },
      /** Apply the fixes that are safe without looking (empty headings, empty links...), as one undo step. */
      fixContentA11y: (_value?: unknown, context?: CommandContext) => {
        const content = resolveContent(context);
        if (!content) return false;
        const before = content.innerHTML;
        fixContent(content, options);
        recordHistory(content, before);
        entryFor(content).checker.check();
        return true;
      },
      /** The latest check result for status UIs. */
      getContentA11yResult: (_value?: unknown, context?: CommandContext) => {
        const content = resolveContent(context);
        return content ? entryFor(content).checker.result : null;
      },
    },
    destroy() {
      checkers.forEach((entry) => entry.checker.destroy());
      checkers.clear();
    },
  };
}

export { checkContent, fixContent } from './check';

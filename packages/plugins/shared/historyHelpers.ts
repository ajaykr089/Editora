/**
 * Shared helpers for recording plugin edits in the editor's undo history.
 *
 * Plugins that mutate the DOM directly (or via execCommand in browsers that don't
 * fire `beforeinput`) never reach the history plugin on their own, so Undo/Redo
 * silently skip their changes. Snapshot the content before the change and call
 * recordDomHistory afterwards.
 */

declare global {
  interface Window {
    execEditorCommand?: (command: string, ...args: any[]) => any;
    executeEditorCommand?: (command: string, ...args: any[]) => any;
  }
}

/**
 * Record `beforeHTML` -> current content as one undoable step. No-op if nothing changed
 * or the history plugin isn't loaded.
 */
export function recordDomHistory(
  editor: HTMLElement | null | undefined,
  beforeHTML: string,
  afterHTML: string | undefined = editor?.innerHTML,
): boolean {
  if (!editor || typeof afterHTML !== 'string' || beforeHTML === afterHTML) return false;

  try {
    if (typeof window.execEditorCommand === 'function') {
      return window.execEditorCommand('recordDomTransaction', editor, beforeHTML, afterHTML) !== false;
    }
    if (typeof window.executeEditorCommand === 'function') {
      return window.executeEditorCommand('recordDomTransaction', { editor, beforeHTML, afterHTML }) !== false;
    }
  } catch {
    // History plugin may be unavailable.
  }
  return false;
}

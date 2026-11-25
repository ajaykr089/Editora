/**
 * Read-Only Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorCore } from '../types';

/**
 * Adds the `setReadOnly` and `toggleReadOnly` commands. There is deliberately no keyboard shortcut: read-only is the
 * page's decision, and a key the reader can press would undo it. (Ctrl+R used to toggle it, which made any read-only
 * editor editable with two key presses and took the browser's reload key away on Windows and Linux.)
 */
export class ReadOnlyExtension implements EditorExtension {
  public readonly name = 'read-only';
  private editor: EditorCore | null = null;

  setup(editor: EditorCore): void {
    this.editor = editor;

    editor.registerCommand('setReadOnly', (readOnly: boolean) => {
      this.setReadOnly(readOnly);
    });

    editor.registerCommand('toggleReadOnly', () => {
      this.setReadOnly(!this.isCurrentlyReadOnly());
    });
  }

  private setReadOnly(readOnly: boolean): void {
    this.editor?.setReadOnly(!!readOnly);
  }

  /** The editor's own state, so a `readOnly: true` option or a direct `editor.setReadOnly()` is reported as well. */
  isCurrentlyReadOnly(): boolean {
    return !!this.editor?.getConfig().readOnly;
  }

  destroy(): void {
    this.editor = null;
  }
}

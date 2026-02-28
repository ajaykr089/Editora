/**
 * Read-Only Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorCore } from '../types';

export class ReadOnlyExtension implements EditorExtension {
  public readonly name = 'read-only';
  private editor: EditorCore | null = null;
  private isReadOnly = false;

  setup(editor: EditorCore): void {
    this.editor = editor;

    // Register read-only commands
    editor.registerCommand('setReadOnly', (readOnly: boolean) => {
      this.setReadOnly(readOnly);
    });

    editor.registerCommand('toggleReadOnly', () => {
      this.toggleReadOnly();
    });

    // Keyboard shortcut for toggling read-only mode
    editor.on('keydown', (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        this.toggleReadOnly();
        return false;
      }
    });
  }

  private setReadOnly(readOnly: boolean): void {
    if (!this.editor) return;

    this.isReadOnly = readOnly;
    this.editor.setReadOnly(readOnly);
  }

  private toggleReadOnly(): void {
    this.setReadOnly(!this.isReadOnly);
  }

  isCurrentlyReadOnly(): boolean {
    return this.isReadOnly;
  }

  destroy(): void {
    this.editor = null;
  }
}

import { createEditor, type EditorAPI, type EditorExtension } from '@editora/light-code-editor';
import '@editora/light-code-editor/light-code-editor.css';

// An extension has a name, a setup() that receives the editor, and a destroy().
class TimestampExtension implements EditorExtension {
  public readonly name = 'timestamp';

  setup(editor: EditorAPI): void {
    // Commands can be run with editor.executeCommand(), a keymap or a menu.
    editor.registerCommand('insertTimestamp', () => {
      const cursor = editor.getCursor();
      const text = `// ${new Date().toISOString()}\n`;
      editor.replace({ start: cursor.position, end: cursor.position }, text);
    });
  }

  destroy(): void {
    // Release anything you created in setup().
  }
}

const editor = createEditor(document.getElementById('editor') as HTMLElement, {
  value: 'const answer = 42;\n',
  extensions: [new TimestampExtension()],
});

editor.executeCommand('insertTimestamp');

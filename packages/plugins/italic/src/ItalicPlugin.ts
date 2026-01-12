import {
  Plugin,
  Command,
  EditorState,
  MarkType
} from '@rte-editor/core';

/**
 * Italic plugin for rich text editor.
 * Provides italic text formatting functionality.
 */
export class ItalicPlugin extends Plugin {
  constructor() {
    super({
      name: 'italic',
      commands: {
        toggleItalic: toggleItalicCommand
      },
      toolbar: {
        items: [{
          id: 'italic',
          icon: 'I', // Simple text icon, can be replaced with SVG component
          label: 'Italic',
          command: 'toggleItalic',
          active: (state: EditorState) => {
            return state.schema.marks.italic.isInSet(state.storedMarks || []);
          }
        }]
      },
      keybindings: {
        'Mod-i': 'toggleItalic', // Ctrl/Cmd + I
        'Mod-I': 'toggleItalic'  // Ctrl/Cmd + Shift + I (for uppercase)
      }
    });
  }
}

/**
 * Command to toggle italic formatting on the current selection.
 */
function toggleItalicCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  const markType = state.schema.marks.italic;
  if (!markType) {
    return false;
  }

  const { from, to, empty } = state.selection;

  if (empty) {
    // Toggle stored marks for cursor position
    if (dispatch) {
      const tr = state.tr;
      if (state.storedMarks) {
        // Remove italic from stored marks
        tr.setStoredMarks(state.storedMarks.filter(mark => mark.type !== markType));
      } else {
        // Add italic to stored marks
        tr.setStoredMarks([markType.create()]);
      }
      dispatch(tr);
    }
    return true;
  } else {
    // Toggle mark on selection range
    if (dispatch) {
      const tr = state.tr;
      const hasMark = state.doc.rangeHasMark(from, to, markType);

      if (hasMark) {
        tr.removeMark(from, to, markType);
      } else {
        tr.addMark(from, to, markType.create());
      }

      dispatch(tr);
    }
    return true;
  }
}

/**
 * Create an italic plugin instance.
 */
export function createItalicPlugin(): ItalicPlugin {
  return new ItalicPlugin();
}
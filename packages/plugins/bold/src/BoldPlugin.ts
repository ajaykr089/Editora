import {
  Plugin,
  Command,
  EditorState,
  MarkType
} from '@rte-editor/core';

/**
 * Bold plugin for rich text editor.
 * Provides bold text formatting functionality.
 */
export class BoldPlugin extends Plugin {
  constructor() {
    super({
      name: 'bold',
      schema: {
        marks: {
          bold: {
            parseDOM: [
              { tag: 'strong' },
              { tag: 'b' },
              { style: 'font-weight', getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null }
            ],
            toDOM: () => ['strong', 0]
          }
        }
      },
      commands: {
        toggleBold: toggleBoldCommand,
        setBold: setBoldCommand,
        unsetBold: unsetBoldCommand
      },
      toolbar: {
        items: [{
          id: 'bold',
          icon: 'B',
          label: 'Bold',
          command: 'toggleBold',
          active: (state: EditorState) => {
            const markType = state.schema.marks.bold;
            return markType ? markType.isInSet(state.storedMarks || []) : false;
          },
          enabled: (state: EditorState) => {
            return !state.selection.empty || !!state.storedMarks;
          }
        }]
      },
      keybindings: {
        'Mod-b': 'toggleBold',
        'Mod-B': 'toggleBold'
      }
    });
  }
}

/**
 * Command to toggle bold formatting on the current selection.
 */
function toggleBoldCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  const markType = state.schema.marks.bold;
  if (!markType) return false;

  const { from, to, empty } = state.selection;

  if (empty) {
    if (dispatch) {
      const tr = state.tr;
      const storedMarks = state.storedMarks || [];
      
      if (markType.isInSet(storedMarks)) {
        tr.setStoredMarks(storedMarks.filter(mark => mark.type !== markType));
      } else {
        tr.setStoredMarks([...storedMarks, markType.create()]);
      }
      dispatch(tr);
    }
    return true;
  } else {
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
 * Command to set bold formatting.
 */
function setBoldCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  const markType = state.schema.marks.bold;
  if (!markType) return false;

  const { from, to, empty } = state.selection;

  if (empty) {
    if (dispatch) {
      const tr = state.tr;
      const storedMarks = state.storedMarks || [];
      if (!markType.isInSet(storedMarks)) {
        tr.setStoredMarks([...storedMarks, markType.create()]);
      }
      dispatch(tr);
    }
    return true;
  } else {
    if (dispatch) {
      const tr = state.tr;
      if (!state.doc.rangeHasMark(from, to, markType)) {
        tr.addMark(from, to, markType.create());
      }
      dispatch(tr);
    }
    return true;
  }
}

/**
 * Command to unset bold formatting.
 */
function unsetBoldCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  const markType = state.schema.marks.bold;
  if (!markType) return false;

  const { from, to, empty } = state.selection;

  if (empty) {
    if (dispatch) {
      const tr = state.tr;
      const storedMarks = state.storedMarks || [];
      tr.setStoredMarks(storedMarks.filter(mark => mark.type !== markType));
      dispatch(tr);
    }
    return true;
  } else {
    if (dispatch) {
      const tr = state.tr;
      tr.removeMark(from, to, markType);
      dispatch(tr);
    }
    return true;
  }
}

/**
 * Create a bold plugin instance.
 */
export function createBoldPlugin(): BoldPlugin {
  return new BoldPlugin();
}
import {
  Plugin,
  Command,
  EditorState,
  NodeType
} from '@rte-editor/core';

/**
 * Heading plugin for rich text editor.
 * Provides heading block functionality (H1-H6).
 */
export class HeadingPlugin extends Plugin {
  constructor() {
    super({
      name: 'heading',
      commands: {
        setHeading: (level: number) => setHeadingCommand(level),
        toggleHeading: (level: number) => toggleHeadingCommand(level)
      },
      toolbar: {
        items: [
          {
            id: 'heading1',
            icon: 'H1',
            label: 'Heading 1',
            command: 'setHeading',
            commandArgs: [1],
            active: (state: EditorState) => isHeadingActive(state, 1)
          },
          {
            id: 'heading2',
            icon: 'H2',
            label: 'Heading 2',
            command: 'setHeading',
            commandArgs: [2],
            active: (state: EditorState) => isHeadingActive(state, 2)
          },
          {
            id: 'heading3',
            icon: 'H3',
            label: 'Heading 3',
            command: 'setHeading',
            commandArgs: [3],
            active: (state: EditorState) => isHeadingActive(state, 3)
          }
        ]
      },
      keybindings: {
        'Mod-Alt-1': 'setHeading(1)',
        'Mod-Alt-2': 'setHeading(2)',
        'Mod-Alt-3': 'setHeading(3)',
        'Mod-Alt-4': 'setHeading(4)',
        'Mod-Alt-5': 'setHeading(5)',
        'Mod-Alt-6': 'setHeading(6)',
        'Mod-Alt-0': 'setHeading(0)' // Convert to paragraph
      }
    });
  }
}

/**
 * Check if a heading of the given level is active at the current selection.
 */
function isHeadingActive(state: EditorState, level: number): boolean {
  const { $from, $to } = state.selection;
  let isActive = false;

  // Check if the selection is within a heading node
  state.doc.nodesBetween($from.pos, $to.pos, (node) => {
    if (node.type.name === 'heading' && node.attrs.level === level) {
      isActive = true;
      return false; // Stop traversal
    }
    return true;
  });

  return isActive;
}

/**
 * Command to set the current block as a heading of the specified level.
 * If level is 0, converts to paragraph.
 */
function setHeadingCommand(level: number): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    const headingType = state.schema.nodes.heading;
    const paragraphType = state.schema.nodes.paragraph;

    if (!headingType || !paragraphType) {
      return false;
    }

    const { $from, $to } = state.selection;
    let applicable = false;

    // Check if we can apply this transformation
    state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      if (node.type.name === 'paragraph' || node.type.name === 'heading') {
        applicable = true;
        return false;
      }
      return true;
    });

    if (!applicable) {
      return false;
    }

    if (dispatch) {
      const tr = state.tr;

      if (level === 0) {
        tr.setBlockType($from.pos, $to.pos, paragraphType);
      } else {
        tr.setBlockType($from.pos, $to.pos, headingType, { level });
      }

      dispatch(tr);
    }

    return true;
  };
}

/**
 * Command to toggle between heading and paragraph at the current selection.
 */
function toggleHeadingCommand(level: number): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    const isActive = isHeadingActive(state, level);

    if (isActive) {
      // Convert to paragraph
      return setHeadingCommand(0)(state, dispatch);
    } else {
      // Convert to heading
      return setHeadingCommand(level)(state, dispatch);
    }
  };
}

/**
 * Create a heading plugin instance.
 */
export function createHeadingPlugin(): HeadingPlugin {
  return new HeadingPlugin();
}
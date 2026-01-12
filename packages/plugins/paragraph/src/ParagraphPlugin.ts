import { Plugin, EditorState } from '@rte-editor/core';

export class ParagraphPlugin extends Plugin {
  constructor() {
    super({
      name: 'paragraph',
      schema: {
        nodes: {
          paragraph: {
            content: 'inline*',
            group: 'block',
            parseDOM: [{ tag: 'p' }],
            toDOM: () => ['p', 0]
          }
        }
      },
      commands: {
        setParagraph: (state: EditorState, dispatch?: any) => {
          if (dispatch) {
            const tr = state.tr.setBlockType(state.selection.from, state.selection.to, state.schema.nodes.paragraph);
            dispatch(tr);
          }
          return true;
        }
      },
      toolbar: {
        items: [{
          id: 'paragraph',
          icon: 'P',
          label: 'Paragraph',
          command: 'setParagraph'
        }]
      }
    });
  }
}

export function createParagraphPlugin(): ParagraphPlugin {
  return new ParagraphPlugin();
}
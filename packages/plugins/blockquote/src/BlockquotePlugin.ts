import { Plugin, EditorState } from '@rte-editor/core';

export class BlockquotePlugin extends Plugin {
  constructor() {
    super({
      name: 'blockquote',
      schema: {
        nodes: {
          blockquote: {
            content: 'block+',
            group: 'block',
            defining: true,
            parseDOM: [{ tag: 'blockquote' }],
            toDOM: () => ['blockquote', 0]
          }
        }
      },
      commands: {
        toggleBlockquote: (state: EditorState, dispatch?: any) => {
          const blockquoteType = state.schema.nodes.blockquote;
          const paragraphType = state.schema.nodes.paragraph;
          
          if (dispatch) {
            const { from, to } = state.selection;
            const tr = state.tr;
            
            // Check if already in blockquote
            let inBlockquote = false;
            state.doc.nodesBetween(from, to, (node, pos, parent) => {
              if (parent && parent.type === blockquoteType) {
                inBlockquote = true;
                return false;
              }
            });
            
            if (inBlockquote) {
              // Remove blockquote
              tr.setBlockType(from, to, paragraphType);
            } else {
              // Add blockquote
              tr.wrapIn(blockquoteType);
            }
            
            dispatch(tr);
          }
          return true;
        }
      },
      toolbar: {
        items: [{
          id: 'blockquote',
          icon: '❝',
          label: 'Quote',
          command: 'toggleBlockquote'
        }]
      },
      keybindings: {
        'Mod-Shift-.': 'toggleBlockquote'
      }
    });
  }
}

export function createBlockquotePlugin(): BlockquotePlugin {
  return new BlockquotePlugin();
}
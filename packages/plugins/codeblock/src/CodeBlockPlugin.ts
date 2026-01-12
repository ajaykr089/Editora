import { Plugin, EditorState } from '@rte-editor/core';

export class CodeBlockPlugin extends Plugin {
  constructor() {
    super({
      name: 'codeblock',
      schema: {
        nodes: {
          code_block: {
            content: 'text*',
            marks: '',
            group: 'block',
            code: true,
            defining: true,
            attrs: {
              language: { default: null }
            },
            parseDOM: [{
              tag: 'pre',
              preserveWhitespace: 'full',
              getAttrs: (node: any) => ({
                language: node.getAttribute('data-language')
              })
            }],
            toDOM: (node: any) => [
              'pre',
              node.attrs.language ? { 'data-language': node.attrs.language } : {},
              ['code', 0]
            ]
          }
        },
        marks: {
          code: {
            parseDOM: [{ tag: 'code' }],
            toDOM: () => ['code', 0]
          }
        }
      },
      commands: {
        toggleCodeBlock: (state: EditorState, dispatch?: any) => {
          const codeBlockType = state.schema.nodes.code_block;
          const paragraphType = state.schema.nodes.paragraph;
          
          if (dispatch) {
            const { from, to } = state.selection;
            const tr = state.tr;
            
            // Check if in code block
            let inCodeBlock = false;
            state.doc.nodesBetween(from, to, (node) => {
              if (node.type === codeBlockType) {
                inCodeBlock = true;
                return false;
              }
            });
            
            if (inCodeBlock) {
              tr.setBlockType(from, to, paragraphType);
            } else {
              tr.setBlockType(from, to, codeBlockType);
            }
            
            dispatch(tr);
          }
          return true;
        },
        toggleCode: (state: EditorState, dispatch?: any) => {
          const codeType = state.schema.marks.code;
          const { from, to } = state.selection;
          
          if (dispatch) {
            const tr = state.tr;
            const hasMark = state.doc.rangeHasMark(from, to, codeType);
            
            if (hasMark) {
              tr.removeMark(from, to, codeType);
            } else {
              tr.addMark(from, to, codeType.create());
            }
            
            dispatch(tr);
          }
          return true;
        }
      },
      toolbar: {
        items: [
          {
            id: 'code_block',
            icon: '{ }',
            label: 'Code Block',
            command: 'toggleCodeBlock'
          },
          {
            id: 'code',
            icon: '</>',
            label: 'Inline Code',
            command: 'toggleCode'
          }
        ]
      },
      keybindings: {
        'Mod-Alt-c': 'toggleCodeBlock',
        'Mod-`': 'toggleCode'
      }
    });
  }
}

export function createCodeBlockPlugin(): CodeBlockPlugin {
  return new CodeBlockPlugin();
}
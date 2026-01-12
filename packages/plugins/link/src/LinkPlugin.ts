import { Plugin, EditorState } from '@rte-editor/core';

export class LinkPlugin extends Plugin {
  constructor() {
    super({
      name: 'link',
      schema: {
        marks: {
          link: {
            attrs: {
              href: {},
              title: { default: null },
              target: { default: null }
            },
            inclusive: false,
            parseDOM: [{
              tag: 'a[href]',
              getAttrs: (dom: any) => ({
                href: dom.getAttribute('href'),
                title: dom.getAttribute('title'),
                target: dom.getAttribute('target')
              })
            }],
            toDOM: (node: any) => ['a', node.attrs, 0]
          }
        }
      },
      commands: {
        toggleLink: (href?: string) => (state: EditorState, dispatch?: any) => {
          const linkType = state.schema.marks.link;
          const { from, to } = state.selection;
          
          if (dispatch) {
            const tr = state.tr;
            const hasMark = state.doc.rangeHasMark(from, to, linkType);
            
            if (hasMark) {
              tr.removeMark(from, to, linkType);
            } else {
              const url = href || prompt('Enter URL:');
              if (url) {
                tr.addMark(from, to, linkType.create({ href: url }));
              }
            }
            
            dispatch(tr);
          }
          return true;
        },
        removeLink: (state: EditorState, dispatch?: any) => {
          const linkType = state.schema.marks.link;
          const { from, to } = state.selection;
          
          if (dispatch) {
            const tr = state.tr.removeMark(from, to, linkType);
            dispatch(tr);
          }
          return true;
        }
      },
      toolbar: {
        items: [
          {
            id: 'link',
            icon: '🔗',
            label: 'Link',
            command: 'toggleLink'
          },
          {
            id: 'unlink',
            icon: '🔗❌',
            label: 'Remove Link',
            command: 'removeLink'
          }
        ]
      },
      keybindings: {
        'Mod-k': 'toggleLink'
      }
    });
  }
}

export function createLinkPlugin(): LinkPlugin {
  return new LinkPlugin();
}
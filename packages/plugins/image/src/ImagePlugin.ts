import { Plugin, EditorState, Fragment, Node } from '@rte-editor/core';

export class ImagePlugin extends Plugin {
  constructor(options: { uploadUrl?: string; maxSize?: number } = {}) {
    super({
      name: 'image',
      schema: {
        nodes: {
          image: {
            inline: true,
            attrs: {
              src: {},
              alt: { default: null },
              title: { default: null },
              width: { default: null },
              height: { default: null }
            },
            group: 'inline',
            draggable: true,
            parseDOM: [{
              tag: 'img[src]',
              getAttrs: (dom: any) => ({
                src: dom.getAttribute('src'),
                title: dom.getAttribute('title'),
                alt: dom.getAttribute('alt'),
                width: dom.getAttribute('width'),
                height: dom.getAttribute('height')
              })
            }],
            toDOM: (node: any) => ['img', node.attrs]
          }
        }
      },
      commands: {
        insertImage: (src?: string, alt?: string) => (state: EditorState, dispatch?: any) => {
          const imageType = state.schema.nodes.image;
          
          if (dispatch) {
            const url = src || prompt('Enter image URL:');
            if (url) {
              const attrs = { src: url };
              if (alt) attrs.alt = alt;
              
              const node = imageType.create(attrs);
              const tr = state.tr.replaceSelectionWith(node);
              dispatch(tr);
            }
          }
          return true;
        },
        uploadImage: (file: File) => (state: EditorState, dispatch?: any) => {
          if (options.maxSize && file.size > options.maxSize) {
            alert('File too large');
            return false;
          }
          
          // Simple file upload simulation
          const reader = new FileReader();
          reader.onload = (e) => {
            const src = e.target?.result as string;
            if (src && dispatch) {
              const imageType = state.schema.nodes.image;
              const node = imageType.create({ src, alt: file.name });
              const tr = state.tr.replaceSelectionWith(node);
              dispatch(tr);
            }
          };
          reader.readAsDataURL(file);
          
          return true;
        }
      },
      toolbar: {
        items: [{
          id: 'image',
          icon: '🖼️',
          label: 'Image',
          command: 'insertImage'
        }]
      }
    });
  }
}

export function createImagePlugin(options?: { uploadUrl?: string; maxSize?: number }): ImagePlugin {
  return new ImagePlugin(options);
}
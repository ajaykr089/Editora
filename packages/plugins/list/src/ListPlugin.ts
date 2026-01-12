import {
  Plugin,
  Command,
  EditorState,
  NodeType
} from '@rte-editor/core';

/**
 * List plugin for rich text editor.
 * Provides ordered and unordered list functionality.
 */
export class ListPlugin extends Plugin {
  constructor() {
    super({
      name: 'list',
      schema: {
        nodes: {
          bullet_list: {
            content: 'list_item+',
            group: 'block',
            parseDOM: [{ tag: 'ul' }],
            toDOM: () => ['ul', 0]
          },
          ordered_list: {
            content: 'list_item+',
            group: 'block',
            attrs: {
              order: { default: 1 }
            },
            parseDOM: [{ 
              tag: 'ol', 
              getAttrs: (dom: any) => ({ 
                order: dom.hasAttribute('start') ? +dom.getAttribute('start') : 1 
              }) 
            }],
            toDOM: (node: any) => node.attrs.order === 1 ? ['ol', 0] : ['ol', { start: node.attrs.order }, 0]
          },
          list_item: {
            content: 'paragraph block*',
            parseDOM: [{ tag: 'li' }],
            toDOM: () => ['li', 0],
            defining: true
          }
        }
      },
      commands: {
        toggleBulletList: toggleBulletListCommand,
        toggleOrderedList: toggleOrderedListCommand,
        liftListItem: liftListItemCommand,
        sinkListItem: sinkListItemCommand
      },
      toolbar: {
        items: [
          {
            id: 'bullet-list',
            icon: '•',
            label: 'Bullet List',
            command: 'toggleBulletList',
            active: (state: EditorState) => isBulletListActive(state)
          },
          {
            id: 'ordered-list',
            icon: '1.',
            label: 'Numbered List',
            command: 'toggleOrderedList',
            active: (state: EditorState) => isOrderedListActive(state)
          }
        ]
      },
      keybindings: {
        'Mod-Shift-8': 'toggleBulletList',
        'Mod-Shift-7': 'toggleOrderedList',
        'Tab': 'sinkListItem',
        'Shift-Tab': 'liftListItem'
      }
    });
  }
}

function isBulletListActive(state: EditorState): boolean {
  const { from, to } = state.selection;
  let isActive = false;

  state.doc.nodesBetween(from, to, (node, pos, parent) => {
    if (parent && parent.type.name === 'bullet_list') {
      isActive = true;
      return false;
    }
  });

  return isActive;
}

function isOrderedListActive(state: EditorState): boolean {
  const { from, to } = state.selection;
  let isActive = false;

  state.doc.nodesBetween(from, to, (node, pos, parent) => {
    if (parent && parent.type.name === 'ordered_list') {
      isActive = true;
      return false;
    }
  });

  return isActive;
}

function toggleBulletListCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  const bulletListType = state.schema.nodes.bullet_list;
  const listItemType = state.schema.nodes.list_item;
  const paragraphType = state.schema.nodes.paragraph;

  if (!bulletListType || !listItemType || !paragraphType) {
    return false;
  }

  const { from, to } = state.selection;

  if (isBulletListActive(state)) {
    if (dispatch) {
      const tr = state.tr.setBlockType(from, to, paragraphType);
      dispatch(tr);
    }
    return true;
  } else {
    if (dispatch) {
      const tr = state.tr;
      tr.wrapIn(bulletListType);
      tr.setBlockType(from, to, listItemType);
      dispatch(tr);
    }
    return true;
  }
}

function toggleOrderedListCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  const orderedListType = state.schema.nodes.ordered_list;
  const listItemType = state.schema.nodes.list_item;
  const paragraphType = state.schema.nodes.paragraph;

  if (!orderedListType || !listItemType || !paragraphType) {
    return false;
  }

  const { from, to } = state.selection;

  if (isOrderedListActive(state)) {
    if (dispatch) {
      const tr = state.tr.setBlockType(from, to, paragraphType);
      dispatch(tr);
    }
    return true;
  } else {
    if (dispatch) {
      const tr = state.tr;
      tr.wrapIn(orderedListType);
      tr.setBlockType(from, to, listItemType);
      dispatch(tr);
    }
    return true;
  }
}

function liftListItemCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  if (dispatch) {
    const tr = state.tr.lift(state.selection.from, state.selection.to);
    dispatch(tr);
  }
  return true;
}

function sinkListItemCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  if (dispatch) {
    const tr = state.tr.wrap(state.selection.from, state.selection.to, state.schema.nodes.list_item);
    dispatch(tr);
  }
  return true;
}

export function createListPlugin(): ListPlugin {
  return new ListPlugin();
}
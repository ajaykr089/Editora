import { Plugin } from '@editora/core';
import { ListPluginProvider } from './ListPluginProvider';

export const ListPlugin = (): Plugin => ({
  name: 'list',
  nodes: {
    bulletList: {
      content: 'listItem+',
      group: 'block',
      parseDOM: [{ tag: 'ul' }],
      toDOM: () => ['ul', 0]
    },
    orderedList: {
      content: 'listItem+',
      group: 'block',
      parseDOM: [{ tag: 'ol' }],
      toDOM: () => ['ol', 0]
    },
    listItem: {
      content: 'paragraph',
      parseDOM: [{ tag: 'li' }],
      toDOM: () => ['li', 0]
    }
  },
  toolbar: [
    {
      label: 'Bullet List',
      command: 'toggleBulletList',
      icon: '•'
    },
    {
      label: 'Ordered List',
      command: 'toggleOrderedList',
      icon: '1.'
    }
  ],
  context: {
    provider: ListPluginProvider
  }
});

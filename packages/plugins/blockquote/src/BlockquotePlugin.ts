import { Plugin } from '@editora/core';

export const BlockquotePlugin = (): Plugin => ({
  name: 'blockquote',
  nodes: {
    blockquote: {
      content: 'block+',
      group: 'block',
      parseDOM: [{ tag: 'blockquote' }],
      toDOM: () => ['blockquote', 0]
    }
  },
  toolbar: [
    {
      label: 'Quote',
      command: 'toggleBlockquote',
      icon: '❝'
    }
  ]
});

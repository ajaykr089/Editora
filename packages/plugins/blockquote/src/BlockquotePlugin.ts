import { Plugin } from '@editora/core';
import { BlockquotePluginProvider } from './BlockquotePluginProvider';

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
  ],
  context: {
    provider: BlockquotePluginProvider
  }
});

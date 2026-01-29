import { Plugin } from '@editora/core';
import { StrikethroughPluginProvider } from './StrikethroughPluginProvider';

export const StrikethroughPlugin = (): Plugin => ({
  name: 'strikethrough',
  marks: {
    strikethrough: {
      parseDOM: [
        { tag: 's' },
        { tag: 'strike' },
        { tag: 'del' }
      ],
      toDOM: () => ['s', 0]
    }
  },
  toolbar: [
    {
      label: 'Strikethrough',
      command: 'toggleStrikethrough',
      icon: 'S̶'
    }
  ],
  context: {
    provider: StrikethroughPluginProvider
  }
});

import { Plugin } from '@rte-editor/core';

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
  ]
});

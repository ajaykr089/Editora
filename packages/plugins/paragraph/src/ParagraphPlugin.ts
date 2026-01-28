import { Plugin } from '@editora/core';

export const ParagraphPlugin = (): Plugin => ({
  name: 'paragraph',
  nodes: {
    doc: {
      content: 'block+'
    },
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM: () => ['p', 0]
    },
    text: {
      group: 'inline'
    }
  }
});

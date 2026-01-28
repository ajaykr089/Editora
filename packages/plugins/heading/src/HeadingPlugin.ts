import { Plugin } from '@editora/core';

export const HeadingPlugin = (): Plugin => ({
  name: 'heading',
  nodes: {
    heading: {
      content: 'inline*',
      group: 'block',
      attrs: { level: { default: 1 } },
      parseDOM: [
        { tag: 'h1', getAttrs: () => ({ level: 1 }) },
        { tag: 'h2', getAttrs: () => ({ level: 2 }) },
        { tag: 'h3', getAttrs: () => ({ level: 3 }) },
        { tag: 'h4', getAttrs: () => ({ level: 4 }) },
        { tag: 'h5', getAttrs: () => ({ level: 5 }) },
        { tag: 'h6', getAttrs: () => ({ level: 6 }) }
      ],
      toDOM: (node) => [`h${node.attrs?.level || 1}`, 0]
    }
  },
  toolbar: [
    {
      label: 'Format',
      command: 'setBlockType',
      type: 'dropdown',
      options: [
        { label: 'Paragraph', value: 'p' },
        { label: 'Heading 1', value: 'h1' },
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
        { label: 'Heading 4', value: 'h4' },
        { label: 'Heading 5', value: 'h5' },
        { label: 'Heading 6', value: 'h6' }
      ]
    }
  ]
});

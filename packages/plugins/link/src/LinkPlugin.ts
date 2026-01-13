import { Plugin } from '@rte-editor/core';

export const LinkPlugin = (): Plugin => ({
  name: 'link',
  marks: {
    link: {
      attrs: { href: {} },
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: (dom) => ({ href: (dom as HTMLElement).getAttribute('href') })
        }
      ],
      toDOM: (node) => ['a', { href: node.attrs?.href }, 0]
    }
  },
  toolbar: [
    {
      label: 'Link',
      command: 'createLink',
      icon: '🔗'
    }
  ]
});

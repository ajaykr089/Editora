import { Plugin } from '@rte-editor/core';

export interface LinkAttrs {
  href: string;
  target?: '_blank' | '_self';
  title?: string;
}

export const LinkPlugin = (): Plugin => ({
  name: 'link',
  marks: {
    link: {
      attrs: {
        href: {},
        target: { default: '_self' },
        title: { default: null }
      },
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: (dom) => ({
            href: (dom as HTMLElement).getAttribute('href'),
            target: (dom as HTMLElement).getAttribute('target') || '_self',
            title: (dom as HTMLElement).getAttribute('title')
          })
        }
      ],
      toDOM: (node) => [
        'a',
        {
          href: node.attrs?.href,
          target: node.attrs?.target,
          title: node.attrs?.title
        },
        0
      ]
    }
  },
  toolbar: [
    {
      label: 'Link',
      command: 'openLinkDialog',
      icon: '🔗'
    }
  ]
});

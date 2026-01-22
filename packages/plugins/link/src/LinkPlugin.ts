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
      icon: '<svg width="24" height="24" focusable="false"><path d="M6.2 12.3a1 1 0 0 1 1.4 1.4l-2 2a2 2 0 1 0 2.6 2.8l4.8-4.8a1 1 0 0 0 0-1.4 1 1 0 1 1 1.4-1.3 2.9 2.9 0 0 1 0 4L9.6 20a3.9 3.9 0 0 1-5.5-5.5l2-2Zm11.6-.6a1 1 0 0 1-1.4-1.4l2-2a2 2 0 1 0-2.6-2.8L11 10.3a1 1 0 0 0 0 1.4A1 1 0 1 1 9.6 13a2.9 2.9 0 0 1 0-4L14.4 4a3.9 3.9 0 0 1 5.5 5.5l-2 2Z" fill-rule="nonzero"></path></svg>'
    }
  ]
});

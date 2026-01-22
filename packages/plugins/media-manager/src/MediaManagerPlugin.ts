import { Plugin } from '@rte-editor/core';

export const MediaManagerPlugin = (): Plugin => ({
  name: 'mediaManager',
  nodes: {
    image: {
      inline: true,
      attrs: {
        src: {},
        alt: { default: '' },
        title: { default: '' },
        width: { default: null },
        height: { default: null }
      },
      group: 'inline',
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: (dom) => ({
            src: (dom as HTMLElement).getAttribute('src'),
            alt: (dom as HTMLElement).getAttribute('alt'),
            title: (dom as HTMLElement).getAttribute('title'),
            width: (dom as HTMLElement).getAttribute('width'),
            height: (dom as HTMLElement).getAttribute('height')
          })
        }
      ],
      toDOM: (node) => [
        'img',
        {
          src: node.attrs?.src,
          alt: node.attrs?.alt,
          title: node.attrs?.title,
          width: node.attrs?.width,
          height: node.attrs?.height
        }
      ]
    },
    video: {
      inline: true,
      attrs: {
        src: {},
        poster: { default: '' },
        width: { default: null },
        height: { default: null },
        controls: { default: true },
        autoplay: { default: false },
        loop: { default: false }
      },
      group: 'inline',
      parseDOM: [
        {
          tag: 'video[src]',
          getAttrs: (dom) => ({
            src: (dom as HTMLElement).getAttribute('src'),
            poster: (dom as HTMLElement).getAttribute('poster'),
            width: (dom as HTMLElement).getAttribute('width'),
            height: (dom as HTMLElement).getAttribute('height'),
            controls: (dom as HTMLElement).hasAttribute('controls'),
            autoplay: (dom as HTMLElement).hasAttribute('autoplay'),
            loop: (dom as HTMLElement).hasAttribute('loop')
          })
        }
      ],
      toDOM: (node) => [
        'video',
        {
          src: node.attrs?.src,
          poster: node.attrs?.poster,
          width: node.attrs?.width,
          height: node.attrs?.height,
          controls: node.attrs?.controls ? '' : null,
          autoplay: node.attrs?.autoplay ? '' : null,
          loop: node.attrs?.loop ? '' : null
        }
      ]
    }
  },
  toolbar: [
    {
      label: 'Image',
      command: 'insertImage',
      icon: '<svg width="24" height="24" focusable="false"><path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm1 2v14h14V5H5Zm4.8 2.6 5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4Z" fill-rule="nonzero"></path></svg>'
    },
    {
      label: 'Video',
      command: 'insertVideo',
      icon: '<svg width="24" height="24" focusable="false"><path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm1 2v14h14V5H5Zm4.8 2.6 5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4Z" fill-rule="nonzero"></path></svg>'
    }
  ]
});

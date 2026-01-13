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
      icon: '🖼️'
    },
    {
      label: 'Video',
      command: 'insertVideo',
      icon: '🎥'
    }
  ]
});

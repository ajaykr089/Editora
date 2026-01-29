import { Plugin } from '@editora/core';
import { TextColorPluginProvider } from './TextColorPluginProvider';

export const TextColorPlugin = (): Plugin => ({
  name: 'textColor',
  marks: {
    textColor: {
      attrs: {
        color: { default: '#000000' }
      },
      parseDOM: [
        {
          tag: 'span[style*=color]',
          getAttrs: (node: HTMLElement) => {
            const style = node.getAttribute('style') || '';
            const colorMatch = style.match(/color:\s*([^;]+)/);
            if (colorMatch) {
              return { color: colorMatch[1] };
            }
            return null;
          }
        }
      ],
      toDOM: (mark) => [
        'span',
        {
          style: `color: ${mark.attrs?.color || '#000000'}`,
          class: 'rte-text-color'
        },
        0
      ]
    }
  },
  toolbar: [
    {
      label: 'Text Color',
      command: 'openTextColorDialog',
      icon: '<svg width="24" height="24" focusable="false"><g fill-rule="evenodd"><path class="tox-icon-text-color__color" d="M3 18h18v3H3z" fill="#000000"></path><path d="M8.7 16h-.8a.5.5 0 0 1-.5-.6l2.7-9c.1-.3.3-.4.5-.4h2.8c.2 0 .4.1.5.4l2.7 9a.5.5 0 0 1-.5.6h-.8a.5.5 0 0 1-.4-.4l-.7-2.2c0-.3-.3-.4-.5-.4h-3.4c-.2 0-.4.1-.5.4l-.7 2.2c0 .3-.2.4-.4.4Zm2.6-7.6-.6 2a.5.5 0 0 0 .5.6h1.6a.5.5 0 0 0 .5-.6l-.6-2c0-.3-.3-.4-.5-.4h-.4c-.2 0-.4.1-.5.4Z"></path></g></svg>'
    }
  ],
  context: {
    provider: TextColorPluginProvider
  }
});

import { Plugin } from '@editora/core';
// import { ItalicPluginProvider } from './ItalicPluginProvider';

export const ItalicPlugin = (): Plugin => ({
  name: 'italic',
  marks: {
    italic: {
      parseDOM: [
        { tag: 'em' },
        { tag: 'i' }
      ],
      toDOM: () => ['em', {}, 0]
    }
  },
  toolbar: [
    {
      label: 'Italic',
      command: 'toggleItalic',
      icon: '<svg width="24" height="24" focusable="false"><path d="m16.7 4.7-.1.9h-.3c-.6 0-1 0-1.4.3-.3.3-.4.6-.5 1.1l-2.1 9.8v.6c0 .5.4.8 1.4.8h.2l-.2.8H8l.2-.8h.2c1.1 0 1.8-.5 2-1.5l2-9.8.1-.5c0-.6-.4-.8-1.4-.8h-.3l.2-.9h5.8Z" fill-rule="evenodd"></path></svg>'
    }
  ],
  // context: {
  //   provider: ItalicPluginProvider
  // }
});

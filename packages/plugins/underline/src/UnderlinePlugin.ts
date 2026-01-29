import { Plugin } from '@editora/core';
import { UnderlinePluginProvider } from './UnderlinePluginProvider';

export const UnderlinePlugin = (): Plugin => ({
  name: 'underline',
  marks: {
    underline: {
      parseDOM: [{ tag: 'u' }],
      toDOM: () => ['u', {}, 0]
    }
  },
  toolbar: [
    {
      label: 'Underline',
      command: 'toggleUnderline',
      icon: '<svg width="24" height="24" focusable="false"><path d="M16 5c.6 0 1 .4 1 1v7c0 2.8-2.2 5-5 5s-5-2.2-5-5V6c0-.6.4-1 1-1s1 .4 1 1v7c0 1.7 1.3 3 3 3s3-1.3 3-3V6c0-.6.4-1 1-1ZM4 17h16c.6 0 1 .4 1 1s-.4 1-1 1H4a1 1 0 1 1 0-2Z" fill-rule="evenodd"></path></svg>'
    }
  ],
  context: {
    provider: UnderlinePluginProvider
  }
});

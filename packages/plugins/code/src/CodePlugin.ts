import { Plugin } from '@editora/core';

export const CodePlugin = (): Plugin => ({
  name: 'code',
  toolbar: [
    {
      label: 'Source',
      command: 'toggleSourceView',
      type: 'button',
      icon: '<>'
    }
  ]
});

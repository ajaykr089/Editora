import { Plugin } from '@editora/core';
// import { CodePluginProvider } from './CodePluginProvider';

export const CodePlugin = (): Plugin => ({
  name: 'code',
  toolbar: [
    {
      label: 'Source',
      command: 'toggleSourceView',
      type: 'button',
      icon: '<>'
    }
  ],
  // context: {
  //   provider: CodePluginProvider
  // }
});

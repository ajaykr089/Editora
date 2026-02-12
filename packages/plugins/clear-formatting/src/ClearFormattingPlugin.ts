import { Plugin } from '@editora/core';
// import { ClearFormattingPluginProvider } from './ClearFormattingPluginProvider';

export const ClearFormattingPlugin = (): Plugin => ({
  name: 'clearFormatting',
  toolbar: [
    {
      label: 'Clear Formatting',
      command: 'clearFormatting',
      icon: '<svg width="24" height="24" focusable="false"><path d="m13.2 6 .4 1.5a1 1 0 0 1-.8 1.2h-.2a1 1 0 0 1-1-.8L11 5.5a1 1 0 0 1 .8-1.2h5.9a1 1 0 1 1 0 2h-4.4Zm-2.6 8.5-.5 1.3a1 1 0 0 0 .5 1.3 1 1 0 0 0 1.3-.5L15.3 9a1 1 0 0 0-.6-1.3 1 1 0 0 0-1.3.6l-3 7.2ZM5.5 11a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2h4.5Zm14.4 0a1 1 0 0 1 0 2h-4.4a1 1 0 0 1 0-2H20ZM8 17a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2h7Zm14.4 0a1 1 0 0 1 0 2h-7a1 1 0 0 1 0-2h7Z" fill-rule="evenodd"></path></svg>',
      shortcut: 'Mod-\\'
    }
  ],
  // context: {
  //   provider: ClearFormattingPluginProvider
  // }
});

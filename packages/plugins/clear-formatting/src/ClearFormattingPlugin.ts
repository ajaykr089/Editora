import { Plugin } from '@rte-editor/core';

export const ClearFormattingPlugin = (): Plugin => ({
  name: 'clearFormatting',
  toolbar: [
    {
      label: 'Clear Formatting',
      command: 'clearFormatting',
      icon: '⌫'
    }
  ]
});

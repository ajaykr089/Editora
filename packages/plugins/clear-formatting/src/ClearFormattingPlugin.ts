import { Plugin } from '@editora/core';
import { ClearFormattingPluginProvider } from './ClearFormattingPluginProvider';

export const ClearFormattingPlugin = (): Plugin => ({
  name: 'clearFormatting',
  toolbar: [
    {
      label: 'Clear Formatting',
      command: 'clearFormatting',
      icon: '␃'
    }
  ],
  context: {
    provider: ClearFormattingPluginProvider
  }
});

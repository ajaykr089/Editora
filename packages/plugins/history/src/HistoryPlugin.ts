import { Plugin } from '@rte-editor/core';

export const HistoryPlugin = (): Plugin => ({
  name: 'history',
  toolbar: [
    {
      label: 'Undo',
      command: 'undo',
      icon: '↶'
    },
    {
      label: 'Redo',
      command: 'redo',
      icon: '↷'
    }
  ]
});

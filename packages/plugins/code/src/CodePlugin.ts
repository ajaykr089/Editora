import { Plugin } from '@rte-editor/core';

export const CodePlugin = (): Plugin => ({
  name: 'code',
  marks: {
    code: {
      parseDOM: [{ tag: 'code' }],
      toDOM: () => ['code', 0]
    }
  },
  toolbar: [
    {
      label: 'Code',
      command: 'toggleCode',
      icon: '<>'
    }
  ]
});

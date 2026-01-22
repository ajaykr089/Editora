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
      icon: '<svg width="24" height="24" focusable="false"><g fill-rule="nonzero"><path d="M9.8 15.7c.3.3.3.8 0 1-.3.4-.9.4-1.2 0l-4.4-4.1a.8.8 0 0 1 0-1.2l4.4-4.2c.3-.3.9-.3 1.2 0 .3.3.3.8 0 1.1L6 12l3.8 3.7ZM14.2 15.7c-.3.3-.3.8 0 1 .4.4.9.4 1.2 0l4.4-4.1c.3-.3.3-.9 0-1.2l-4.4-4.2a.8.8 0 0 0-1.2 0c-.3.3-.3.8 0 1.1L18 12l-3.8 3.7Z"></path></g></svg>'
    }
  ]
});

import { Plugin } from '@editora/core';

export const DocumentManagerPlugin = (): Plugin => ({
  name: 'document-manager',
  toolbar: [
    {
      label: 'Import Word',
      command: 'importWord',
      icon: '<svg width="24" height="24" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3h7.4L19 7.6V15h-2V9h-4V5H5c0-1.1.9-2 2-2Z"></path><path d="M9.5 7A1.5 1.5 0 0 1 11 8.4v7.1A1.5 1.5 0 0 1 9.6 17H2.5A1.5 1.5 0 0 1 1 15.6V8.5A1.5 1.5 0 0 1 2.4 7h7.1Zm-1 2.8-1 2.6-1-2.5v-.1a.6.6 0 0 0-1 0l-.1.1-.9 2.5-1-2.5v-.1a.6.6 0 0 0-1 .4v.1l1.5 4v.1a.6.6 0 0 0 1 0v-.1l1-2.5.9 2.5v.1a.6.6 0 0 0 1 0H8l1.6-4v-.2a.6.6 0 0 0-1.1-.4Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.4 18.2a1 1 0 0 0 1.2 1.6l1.4-1V22a1 1 0 1 0 2 0v-3.1l1.4 1a1 1 0 0 0 1.2-1.7L15 15.8l-3.6 2.4Z"></path></svg>'
    },
    {
      label: 'Export Word',
      command: 'exportWord',
      icon: '<svg width="24" height="24" focusable="false"><path d="M9.5 7A1.5 1.5 0 0 1 11 8.4v7.1A1.5 1.5 0 0 1 9.6 17H2.5A1.5 1.5 0 0 1 1 15.6V8.5A1.5 1.5 0 0 1 2.4 7h7.1Zm-1 2.8-1 2.6-1-2.5v-.1a.6.6 0 0 0-1 0l-.1.1-.9 2.5-1-2.5v-.1a.6.6 0 0 0-1 .4v.1l1.5 4v.1a.6.6 0 0 0 1 0v-.1l1-2.5.9 2.5v.1a.6.6 0 0 0 1 0H8l1.6-4v-.2a.6.6 0 0 0-1.1-.4Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3h7.4L19 7.6V17h-2V9h-4V5H7v3H5V5c0-1.1.9-2 2-2ZM15 17a1 1 0 1 0-2 0v3.1l-1.4-1a1 1 0 1 0-1.2 1.7l3.6 2.4 3.6-2.4a1 1 0 0 0-1.2-1.6l-1.4 1V17Z"></path></svg>'
    },
    {
      label: 'Export PDF',
      command: 'exportPdf',
      icon: '<svg width="24" height="24" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3h7.4L19 7.6V17h-2V9h-4V5H7v3H5V5c0-1.1.9-2 2-2Z"></path><path d="M2.6 15.2v-1.9h1c.6 0 1-.2 1.4-.5.3-.3.5-.7.5-1.2s-.2-.9-.5-1.2a2 2 0 0 0-1.3-.4H1v5.2h1.6Zm.4-3h-.4v-1.1h.5l.6.1.2.5c0 .1 0 .3-.2.4l-.7.1Zm5.7 3 1-.1c.3 0 .5-.2.7-.4l.5-.8c.2-.3.2-.7.2-1.3v-1l-.5-.8c-.2-.3-.4-.5-.7-.6L8.7 10H6.3v5.2h2.4Zm-.4-1.1H8v-3h.4c.5 0 .8.2 1 .4l.2 1.1-.1 1-.3.3-.8.2Zm5.3 1.2V13h2v-1h-2v-1H16V10h-4v5.2h1.6Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M15 17a1 1 0 1 0-2 0v3.1l-1.4-1a1 1 0 1 0-1.2 1.7l3.6 2.4 3.6-2.4a1 1 0 0 0-1.2-1.6l-1.4 1V17Z"></path></svg>'
    }
  ]
});

import { Plugin } from '@editora/core';
// import { ListPluginProvider } from './ListPluginProvider';

export const ListPlugin = (): Plugin => ({
  name: 'list',
  nodes: {
    bulletList: {
      content: 'listItem+',
      group: 'block',
      parseDOM: [{ tag: 'ul' }],
      toDOM: () => ['ul', 0]
    },
    orderedList: {
      content: 'listItem+',
      group: 'block',
      parseDOM: [{ tag: 'ol' }],
      toDOM: () => ['ol', 0]
    },
    listItem: {
      content: 'paragraph',
      parseDOM: [{ tag: 'li' }],
      toDOM: () => ['li', 0]
    }
  },
  toolbar: [
    {
      label: 'Bullet List',
      command: 'toggleBulletList',
      icon: '<svg width="24" height="24" focusable="false"><path d="M11 5h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2ZM4.5 6c0 .4.1.8.4 1 .3.4.7.5 1.1.5.4 0 .8-.1 1-.4.4-.3.5-.7.5-1.1 0-.4-.1-.8-.4-1-.3-.4-.7-.5-1.1-.5-.4 0-.8.1-1 .4-.4.3-.5.7-.5 1.1Zm0 6c0 .4.1.8.4 1 .3.4.7.5 1.1.5.4 0 .8-.1 1-.4.4-.3.5-.7.5-1.1 0-.4-.1-.8-.4-1-.3-.4-.7-.5-1.1-.5-.4 0-.8.1-1 .4-.4.3-.5.7-.5 1.1Zm0 6c0 .4.1.8.4 1 .3.4.7.5 1.1.5.4 0 .8-.1 1-.4.4-.3.5-.7.5-1.1 0-.4-.1-.8-.4-1-.3-.4-.7-.5-1.1-.5-.4 0-.8.1-1 .4-.4.3-.5.7-.5 1.1Z" fill-rule="evenodd"></path></svg>',
      shortcut: 'Mod-Shift-8'
    },
    {
      label: 'Numbered List',
      command: 'toggleOrderedList',
      icon: '<svg width="24" height="24" focusable="false"><path d="M10 17h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 1 1 0-2ZM6 4v3.5c0 .3-.2.5-.5.5a.5.5 0 0 1-.5-.5V5h-.5a.5.5 0 0 1 0-1H6Zm-1 8.8l.2.2h1.3c.3 0 .5.2.5.5s-.2.5-.5.5H4.9a1 1 0 0 1-.9-1V13c0-.4.3-.8.6-1l1.2-.4.2-.3a.2.2 0 0 0 0-.2l-.7.3a.5.5 0 0 1-.7-.3.5.5 0 0 1 .3-.6l.7-.4c.5-.2 1.1 0 1.4.4.3.5.3 1.1-.1 1.5l-1.2.7Zm0 3.7v.5c0 .3.2.5.5.5h1c.3 0 .5.2.5.5s-.2.5-.5.5h-1a1.5 1.5 0 0 1-1.5-1.5v-.5c0-.3.1-.6.3-.8l1.3-1.4c.3-.4.1-.9-.2-1-.1 0-.2 0-.3.2l-.4.5a.5.5 0 0 1-.7.1.5.5 0 0 1-.1-.7l.4-.5c.5-.5 1.2-.6 1.8-.4.6.3 1 .9 1 1.6 0 .4-.2.8-.5 1.1l-1.3 1.4-.3.4Z" fill-rule="evenodd"></path></svg>',
      shortcut: 'Mod-Shift-7'
    }
  ],
  // context: {
  //   provider: ListPluginProvider
  // }
});

import { Plugin } from '@editora/core';

export const BlockquotePlugin = (): Plugin => ({
  name: "blockquote",
  nodes: {
    blockquote: {
      content: "block+",
      group: "block",
      parseDOM: [{ tag: "blockquote" }],
      toDOM: () => ["blockquote", 0],
    },
  },
  toolbar: [
    {
      label: "Quote",
      command: "toggleBlockquote",
      icon: '<svg fill="#000000" height="24px" width="24px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M13,11c0.6,0,1-0.4,1-1s-0.4-1-1-1c-5,0-9,4-9,9c0,2.8,2.2,5,5,5s5-2.2,5-5s-2.2-5-5-5c-0.3,0-0.7,0-1,0.1 C9.3,11.8,11,11,13,11z"></path> <path d="M23,13c-0.3,0-0.7,0-1,0.1c1.3-1.3,3-2.1,5-2.1c0.6,0,1-0.4,1-1s-0.4-1-1-1c-5,0-9,4-9,9c0,2.8,2.2,5,5,5s5-2.2,5-5 S25.8,13,23,13z"></path> </g> </g></svg>',
    },
  ],
  // context: {
  //   provider: BlockquotePluginProvider,
  // },
});

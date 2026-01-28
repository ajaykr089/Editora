import { Plugin } from '@editora/core';

export const EmojisPlugin = (): Plugin => ({
  name: 'emojis',
  toolbar: [{
    label: 'Emojis',
    command: 'insertEmoji',
    icon: '<svg width="24" height="24" focusable="false"><path d="M9 11c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm6 0c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm-3 5.5c2.1 0 4-1.5 4.4-3.5H7.6c.5 2 2.3 3.5 4.4 3.5ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" fill-rule="nonzero"></path></svg>'
  }]
});

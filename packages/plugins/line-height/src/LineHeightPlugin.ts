import { Plugin } from '@editora/core';

export const LineHeightPlugin = (): Plugin => ({
  name: 'lineHeight',
  toolbar: [{
    type: 'inline-menu',
    label: 'Line Height',
    command: 'setLineHeight',
    options: [
      { label: '1.0', value: '1.0' },
      { label: '1.2', value: '1.2' },
      { label: '1.5', value: '1.5' },
      { label: '2.0', value: '2.0' }
    ],
    icon: '<svg width="24" height="24" focusable="false"><path d="M21 5a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zM7 3.6l3.7 3.7a1 1 0 0 1-1.3 1.5h-.1L8 7.3v9.2l1.3-1.3a1 1 0 0 1 1.3 0h.1c.4.4.4 1 0 1.3v.1L7 20.4l-3.7-3.7a1 1 0 0 1 1.3-1.5h.1L6 16.7V7.4L4.7 8.7a1 1 0 0 1-1.3 0h-.1a1 1 0 0 1 0-1.3v-.1L7 3.6z"></path></svg>'
  }]
});

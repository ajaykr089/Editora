import { Plugin } from '@editora/core';

/**
 * Underline Plugin - Native Implementation
 * 
 * Adds underline formatting support with native command implementation.
 * Matches React version UI/UX exactly.
 */
export const UnderlinePlugin = (): Plugin => ({
  name: 'underline',
  
  // Schema definition for underline mark
  marks: {
    underline: {
      parseDOM: [{ tag: 'u' }],
      toDOM: () => ['u', {}, 0]
    }
  },
  
  // Toolbar button configuration (matching React version exactly)
  toolbar: [
    {
      label: 'Underline',
      command: 'toggleUnderline',
      icon: '<svg width="24" height="24" focusable="false"><path d="M16 5c.6 0 1 .4 1 1v7c0 2.8-2.2 5-5 5s-5-2.2-5-5V6c0-.6.4-1 1-1s1 .4 1 1v7c0 1.7 1.3 3 3 3s3-1.3 3-3V6c0-.6.4-1 1-1ZM4 17h16c.6 0 1 .4 1 1s-.4 1-1 1H4a1 1 0 1 1 0-2Z" fill-rule="evenodd"></path></svg>',
      shortcut: 'Mod-u'
    }
  ],
  
  // Native command implementations
  commands: {
    /**
     * Toggle underline formatting on current selection
     */
    toggleUnderline: () => {
      document.execCommand('underline', false);
      return true;
    }
  },
  
  // Keyboard shortcuts
  keymap: {
    'Mod-u': 'toggleUnderline',
    'Mod-U': 'toggleUnderline'
  }
});

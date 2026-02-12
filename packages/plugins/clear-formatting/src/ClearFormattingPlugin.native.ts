import { Plugin } from '@editora/core';

/**
 * Clear Formatting Plugin - Framework Agnostic
 * 
 * Removes all formatting from selected text with native command implementation.
 * No React dependency required.
 */
export const ClearFormattingPlugin = (): Plugin => ({
  name: "clearFormatting",

  // Toolbar button configuration
  toolbar: [
    {
      label: "Clear Formatting",
      command: "clearFormatting",
      icon: '<svg width="24" height="24" focusable="false"><path d="M13.2 6a1 1 0 0 1 0 .2l-2.6 10a1 1 0 0 1-1 .8h-.2a.8.8 0 0 1-.8-1l2.6-10H8a1 1 0 1 1 0-2h9a1 1 0 0 1 0 2h-3.8ZM5 18h7a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Zm13 1.5L16.5 18 15 19.5a.7.7 0 0 1-1-1l1.5-1.5-1.5-1.5a.7.7 0 0 1 1-1l1.5 1.5 1.5-1.5a.7.7 0 0 1 1 1L17.5 17l1.5 1.5a.7.7 0 0 1-1 1Z" fill-rule="evenodd"></path></svg>',
      shortcut: "Mod-\\",
    },
  ],

  // Native command implementations
  commands: {
    /**
     * Remove all formatting from current selection
     */
    clearFormatting: () => {
      document.execCommand("removeFormat", false);
      return true;
    },
  },

  // Keyboard shortcuts
  keymap: {
    "Mod-\\": "clearFormatting",
  },
});

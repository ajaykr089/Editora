import { Plugin } from '@editora/core';

/**
 * Blockquote Plugin - Framework Agnostic
 * 
 * Adds blockquote support with native command implementation.
 * No React dependency required.
 */
export const BlockquotePlugin = (): Plugin => ({
  name: "blockquote",

  // Schema definition for blockquote node
  nodes: {
    blockquote: {
      content: "block+",
      group: "block",
      parseDOM: [{ tag: "blockquote" }],
      toDOM: () => ["blockquote", 0],
    },
  },

  // Toolbar button configuration
  toolbar: [
    {
      label: "Quote",
      command: "toggleBlockquote",
      icon: '<svg fill="#000000" height="24px" width="24px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M13,11c0.6,0,1-0.4,1-1s-0.4-1-1-1c-5,0-9,4-9,9c0,2.8,2.2,5,5,5s5-2.2,5-5s-2.2-5-5-5c-0.3,0-0.7,0-1,0.1 C9.3,11.8,11,11,13,11z"></path> <path d="M23,13c-0.3,0-0.7,0-1,0.1c1.3-1.3,3-2.1,5-2.1c0.6,0,1-0.4,1-1s-0.4-1-1-1c-5,0-9,4-9,9c0,2.8,2.2,5,5,5s5-2.2,5-5 S25.8,13,23,13z"></path> </g> </g></svg>',
      shortcut: "Mod-Shift-9",
    },
  ],

  // Native command implementations
  commands: {
    /**
     * Toggle blockquote formatting on current selection
     */
    toggleBlockquote: () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return false;

      // Check if already in blockquote
      let node = selection.anchorNode;
      let isInBlockquote = false;

      while (node && node !== document.body) {
        if (node.nodeName === "BLOCKQUOTE") {
          isInBlockquote = true;
          break;
        }
        node = node.parentNode;
      }

      if (isInBlockquote) {
        // Remove blockquote
        document.execCommand("formatBlock", false, "p");
      } else {
        // Add blockquote
        document.execCommand("formatBlock", false, "blockquote");
      }

      return true;
    },
  },

  // Keyboard shortcuts
  keymap: {
    "Mod-Shift-9": "toggleBlockquote",
  },
});

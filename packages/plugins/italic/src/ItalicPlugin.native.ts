import { Plugin } from '@editora/core';

/**
 * Italic Plugin - Native Implementation
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 * 
 * Provides italic text formatting with:
 * - Semantic <em> tag output
 * - Support for <i>, <em>, and inline font-style
 * - Keyboard shortcut (Cmd/Ctrl+I)
 * - Global command registration
 */

/**
 * Toggle italic formatting on current selection
 */
export const toggleItalic = (): boolean => {
  document.execCommand('italic', false);
  return true;
};

/**
 * Register commands globally
 */
const registerCommand = (command: string, handler: () => void): void => {
  if (typeof window !== 'undefined') {
    (window as any).registerEditorCommand?.(command, handler);
  }
};

/**
 * Initialize global command registration
 */
const initializeCommands = (): void => {
  registerCommand('toggleItalic', toggleItalic);
};

// Initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCommands);
  } else {
    initializeCommands();
  }
}

export const ItalicPlugin = (): Plugin => ({
  name: 'italic',
  
  marks: {
    italic: {
      parseDOM: [
        { tag: 'i' },
        { tag: 'em' },
        {
          style: 'font-style=italic'
        }
      ],
      toDOM: () => ['em', 0]
    }
  },
  
  toolbar: [
    {
      label: 'Italic',
      command: 'toggleItalic',
      type: 'button',
      icon: '<svg width="24" height="24" focusable="false"><path d="M16.7 4.7l-.1.9h-.3c-.6 0-1 0-1.4.3-.3.3-.4.6-.5 1.1l-2.1 9.8v.6c0 .5.4.8 1.4.8h.2l-.2.8H8l.2-.8h.2c1.1 0 1.8-.5 2-1.5l2-9.8.1-.5c0-.6-.4-.8-1.4-.8h-.3l.2-.9h5.8Z" fill-rule="evenodd"></path></svg>',
      shortcut: 'Mod-i'
    }
  ],
  
  commands: {
    toggleItalic
  },
  
  keymap: {
    'Mod-i': 'toggleItalic',
    'Mod-I': 'toggleItalic'
  }
});

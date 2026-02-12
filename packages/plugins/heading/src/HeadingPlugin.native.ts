import { Plugin } from '@editora/core';

/**
 * Heading Plugin - Framework Agnostic
 * 
 * Adds heading support (H1-H6) with native command implementation.
 * No React dependency required.
 */
export const HeadingPlugin = (): Plugin => {
  const setBlockTypeImpl = (level: string) => {
    try {
      document.execCommand('formatBlock', false, level);
      return true;
    } catch (error) {
      console.error(`Failed to set block type to ${level}:`, error);
      return false;
    }
  };

  return {
    name: 'heading',
    
    // Toolbar button configuration with dropdown
    toolbar: [
      {
        label: 'Heading',
        command: 'setBlockType',
        type: 'dropdown',
        options: [
          { value: 'p', label: 'Paragraph' },
          { value: 'h1', label: 'Heading 1' },
          { value: 'h2', label: 'Heading 2' },
          { value: 'h3', label: 'Heading 3' },
          { value: 'h4', label: 'Heading 4' },
          { value: 'h5', label: 'Heading 5' },
          { value: 'h6', label: 'Heading 6' }
        ],
        icon: '<svg width="24" height="24" focusable="false"><path d="M16.1 8.6 14.2 4l-1.4.5 2.8 7.4c.1.4.5.6.9.6h.1c.4-.1.6-.5.6-.9l1.8-4.8-1.4-.5-1.5 2.3ZM4 11.5h6V10H4v1.5ZM18.5 3v1L17 7l.9.9L20.7 3h-2.2ZM5.5 12h1v7h1v-7h1v-.5h-3V12Zm4 0h1v7h1v-7h1v-.5h-3V12Zm10 1.5a2 2 0 0 0-2-2h-1v7.5h1v-2.7h1a2 2 0 0 0 2-2v-.8Zm-2 1.3h-1v-2.3h1a.8.8 0 1 1 0 1.6v.7Z" fill-rule="evenodd"></path></svg>'
      }
    ],
    
    // Native command implementations
    commands: {
      /**
       * Set block type to specific heading level or paragraph
       */
      setBlockType: (level?: string) => {
        if (!level) return false;
        return setBlockTypeImpl(level);
      },
      
      /**
       * Set heading level 1
       */
      setHeading1: () => setBlockTypeImpl('h1'),
      
      /**
       * Set heading level 2
       */
      setHeading2: () => setBlockTypeImpl('h2'),
      
      /**
       * Set heading level 3
       */
      setHeading3: () => setBlockTypeImpl('h3'),
      
      /**
       * Set to paragraph
       */
      setParagraph: () => setBlockTypeImpl('p')
    },
    
    // Keyboard shortcuts
    keymap: {
      'Mod-Alt-1': 'setHeading1',
      'Mod-Alt-2': 'setHeading2',
      'Mod-Alt-3': 'setHeading3',
      'Mod-Alt-0': 'setParagraph'
    }
  };
};

import { Plugin } from '@editora/core';

/**
 * Bold Plugin - Framework Agnostic
 * 
 * Adds bold formatting support with native command implementation.
 * No React dependency required.
 */
export const BoldPlugin = (): Plugin => ({
  name: "bold",

  // Schema definition for bold mark
  marks: {
    bold: {
      parseDOM: [
        { tag: "strong" },
        { tag: "b" },
        {
          style: "font-weight",
          getAttrs: (value: string | HTMLElement) => {
            const weight =
              typeof value === "string"
                ? value
                : (value as HTMLElement).style.fontWeight;
            return /^(bold(er)?|[5-9]\d{2,})$/.test(weight) && null;
          },
        },
      ],
      toDOM: () => ["strong", 0],
    },
  },

  // Toolbar button configuration
  toolbar: [
    {
      label: "Bold",
      command: "toggleBold",
      icon: '<svg width="24" height="24" focusable="false"><path d="M7.8 19c-.3 0-.5 0-.6-.2l-.2-.5V5.7c0-.2 0-.4.2-.5l.6-.2h5c1.5 0 2.7.3 3.5 1 .7.6 1.1 1.4 1.1 2.5a3 3 0 0 1-.6 1.9c-.4.6-1 1-1.6 1.2.4.1.9.3 1.3.6s.8.7 1 1.2c.4.4.5 1 .5 1.6 0 1.3-.4 2.3-1.3 3-.8.7-2.1 1-3.8 1H7.8Zm5-8.3c.6 0 1.2-.1 1.6-.5.4-.3.6-.7.6-1.3 0-1.1-.8-1.7-2.3-1.7H9.3v3.5h3.4Zm.5 6c.7 0 1.3-.1 1.7-.4.4-.4.6-.9.6-1.5s-.2-1-.7-1.4c-.4-.3-1-.4-2-.4H9.4v3.8h4Z" fill-rule="evenodd"></path></svg>',
      shortcut: "Mod-b",
    },
  ],

  // Native command implementations
  commands: {
    /**
     * Toggle bold formatting on current selection
     */
    toggleBold: () => {
      // Use document.execCommand for now
      // In production, this would manipulate EditorState directly
      document.execCommand("bold", false);
      return true;
    },
  },

  // Keyboard shortcuts
  keymap: {
    "Mod-b": "toggleBold",
    "Mod-B": "toggleBold",
  },
});

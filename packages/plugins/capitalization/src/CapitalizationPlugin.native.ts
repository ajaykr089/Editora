import type { Plugin } from '@editora/core';

/**
 * CapitalizationPlugin - Native implementation for text case transformations
 * 
 * Features:
 * - Convert text to UPPERCASE
 * - Convert text to lowercase
 * - Convert text to Title Case
 * - Useful for formatting headings, names, acronyms
 * 
 * Commands:
 * - toUpperCase: Convert selection to UPPERCASE
 * - toLowerCase: Convert selection to lowercase
 * - toTitleCase: Convert selection to Title Case
 */
export const CapitalizationPlugin = (): Plugin => {
  // Define the actual transformation functions
  const toUpperCaseImpl = () => {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const text = range.toString();
        const upperText = text.toUpperCase();

        range.deleteContents();
        range.insertNode(document.createTextNode(upperText));

        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to convert to uppercase:", error);
      return false;
    }
  };

  const toLowerCaseImpl = () => {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const text = range.toString();
        const lowerText = text.toLowerCase();

        range.deleteContents();
        range.insertNode(document.createTextNode(lowerText));

        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to convert to lowercase:", error);
      return false;
    }
  };

  const toTitleCaseImpl = () => {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const text = range.toString();

        // Convert to title case (capitalize first letter of each word)
        const titleText = text.replace(/\w\S*/g, (word) => {
          return (
            word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
          );
        });

        range.deleteContents();
        range.insertNode(document.createTextNode(titleText));

        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to convert to title case:", error);
      return false;
    }
  };

  return {
    name: "capitalization",

    toolbar: [
      {
        label: "Capitalization",
        command: "setCapitalization",
        type: "inline-menu",
        options: [
          { label: "lowercase", value: "lowercase" },
          { label: "UPPERCASE", value: "uppercase" },
          { label: "Title Case", value: "titlecase" },
        ],
        icon: '<svg fill="#000000" width="24" height="24" viewBox="0 0 32.00 32.00" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.192"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>letter--Aa</title><path d="M23,13H18v2h5v2H19a2,2,0,0,0-2,2v2a2,2,0,0,0,2,2h6V15A2,2,0,0,0,23,13Zm0,8H19V19h4Z"></path><path d="M13,9H9a2,2,0,0,0-2,2V23H9V18h4v5h2V11A2,2,0,0,0,13,9ZM9,16V11h4v5Z"></path><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"></rect></g></svg>',
      },
    ],

    commands: {
      setCapitalization: (value?: string) => {
        if (!value) return false;
        
        switch (value) {
          case 'uppercase':
            return toUpperCaseImpl();
          case 'lowercase':
            return toLowerCaseImpl();
          case 'titlecase':
            return toTitleCaseImpl();
          default:
            return false;
        }
      },

      toUpperCase: toUpperCaseImpl,
      toLowerCase: toLowerCaseImpl,
      toTitleCase: toTitleCaseImpl,
    },

    keymap: {
      "Mod-Shift-u": "toUpperCase",
      "Mod-Shift-k": "toLowerCase",
      "Mod-Shift-t": "toTitleCase",
    },
  };
};

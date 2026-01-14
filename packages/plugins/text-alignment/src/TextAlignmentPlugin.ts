import { Plugin } from '@rte-editor/core';

/**
 * Text Alignment Plugin for Rich Text Editor
 *
 * Allows users to set text alignment (left, center, right, justify)
 * for selected paragraphs using execCommand API
 */
export const TextAlignmentPlugin = (): Plugin => ({
  name: 'textAlignment',
  toolbar: [
    {
      label: 'Text Alignment',
      command: 'setTextAlignment',
      type: 'dropdown',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Justify', value: 'justify' }
      ]
    }
  ]
});

/**
 * Text Alignment Commands
 * Uses execCommand for text alignment
 */

// Set text alignment command
export const setTextAlignmentCommand = (alignment?: string) => {
  if (!alignment) return;

  const validAlignments = ['left', 'center', 'right', 'justify'];
  if (!validAlignments.includes(alignment)) return;

  // Apply text alignment using execCommand
  document.execCommand('justifyLeft', false);
  document.execCommand('justifyCenter', false);
  document.execCommand('justifyRight', false);
  document.execCommand('justifyFull', false);

  // Apply the correct alignment
  switch (alignment) {
    case 'left':
      document.execCommand('justifyLeft', false);
      break;
    case 'center':
      document.execCommand('justifyCenter', false);
      break;
    case 'right':
      document.execCommand('justifyRight', false);
      break;
    case 'justify':
      document.execCommand('justifyFull', false);
      break;
  }
};

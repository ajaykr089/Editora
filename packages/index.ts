// Core framework-agnostic editor engine
export * from '@editora/core';

// React integration layer
export * from '@editora/react';

// Re-export commonly used types
export type {
  EditorState,
  Plugin,
  RichTextEditorProps
} from '@editora/core';

// Default export - main React component
export { default } from '@editora/react';
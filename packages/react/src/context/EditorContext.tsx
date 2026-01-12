import React, { createContext, useContext } from 'react';
import { EditorState, Plugin, Editor } from '@rte-editor/core';

/**
 * Editor context value interface.
 */
export interface EditorContextValue {
  state: EditorState;
  dispatch: (tr: any) => void;
  plugins: readonly Plugin[];
  editor: Editor;
  view?: any; // Editor view instance
}

/**
 * React context for editor state and actions.
 */
export const EditorContext = createContext<EditorContextValue | null>(null);

/**
 * Hook to access the current editor context.
 * Must be used within an EditorProvider.
 */
export const useEditorContext = (): EditorContextValue => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};

/**
 * Props for the EditorProvider component.
 */
export interface EditorProviderProps {
  state: EditorState;
  dispatch: (tr: any) => void;
  plugins?: readonly Plugin[];
  editor: Editor;
  view?: any;
  children: React.ReactNode;
}

/**
 * Provider component that makes editor state available to child components.
 */
export const EditorProvider: React.FC<EditorProviderProps> = ({
  state,
  dispatch,
  plugins = [],
  editor,
  view,
  children
}) => {
  const contextValue: EditorContextValue = {
    state,
    dispatch,
    plugins,
    editor,
    view
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};
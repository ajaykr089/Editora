import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { EditorState, Editor, Plugin } from '@rte-editor/core';
import { EditorProvider } from '../context/EditorContext';
import { Toolbar } from './Toolbar';
import { EditorContent } from './EditorContent';

/**
 * Props for the RichTextEditor component.
 */
export interface RichTextEditorProps {
  /** Initial content or controlled value */
  value?: string;

  /** Callback when content changes */
  onChange?: (content: string) => void;

  /** List of plugins to enable */
  plugins?: Plugin[];

  /** Theme name */
  theme?: 'light' | 'dark' | string;

  /** Whether the editor is read-only */
  readOnly?: boolean;

  /** Placeholder text */
  placeholder?: string;

  /** Additional CSS class */
  className?: string;

  /** Whether to show the toolbar */
  showToolbar?: boolean;

  /** Additional props passed to container */
  [key: string]: any;
}

/**
 * Main Rich Text Editor component.
 * This is the primary component users interact with.
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  plugins = [],
  theme = 'light',
  readOnly = false,
  placeholder,
  className,
  showToolbar = true,
  ...props
}) => {
  // Editor instance
  const [editor, setEditor] = useState<Editor | null>(null);
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  // Initialize editor
  useEffect(() => {
    const editorInstance = new Editor({
      content: value || '',
      plugins,
      onUpdate: ({ editor, transaction }) => {
        setEditorState(editor.state);
        onChange?.(editor.getHTML());
      }
    });

    setEditor(editorInstance);
    setEditorState(editorInstance.state);

    return () => {
      editorInstance.destroy();
    };
  }, []);



  // Container ref for DOM access
  const containerRef = useRef<HTMLDivElement>(null);

  // CSS classes
  const containerClasses = [
    'rte-editor',
    `rte-theme-${theme}`,
    readOnly && 'rte-readonly',
    className
  ].filter(Boolean).join(' ');

  if (!editor || !editorState) {
    return <div className="rte-loading">Loading editor...</div>;
  }

  return (
    <EditorProvider
      state={editorState}
      dispatch={(tr) => editor.dispatch(tr)}
      plugins={plugins}
      editor={editor}
    >
      <div
        ref={containerRef}
        className={containerClasses}
        {...props}
      >
        {showToolbar && (
          <Toolbar className="rte-toolbar" />
        )}
        
        <EditorContent
          className="rte-content"
          placeholder={placeholder}
          readOnly={readOnly}
        />
      </div>
    </EditorProvider>
  );
};

// Default export
export default RichTextEditor;
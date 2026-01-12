import React, { useEffect, useRef, useCallback } from 'react';
import { useEditorContext } from '../context/EditorContext';
import { SelectionManager } from '../utils/SelectionManager';

/**
 * Props for the EditorContent component.
 */
export interface EditorContentProps {
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  spellCheck?: boolean;
}

/**
 * EditorContent component that renders the editable document area.
 */
export const EditorContent: React.FC<EditorContentProps> = ({
  className,
  placeholder,
  readOnly = false,
  autoFocus = false,
  spellCheck = true
}) => {
  const { state, editor } = useEditorContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const selectionManager = useRef(new SelectionManager());
  const isInternalUpdate = useRef(false);
  const lastContent = useRef('');

  // Set up editor view
  useEffect(() => {
    if (contentRef.current && editor) {
      editor.setView({
        dom: contentRef.current,
        focus: () => {
          contentRef.current?.focus();
          editor.focus();
        },
        blur: () => {
          contentRef.current?.blur();
          editor.blur();
        },
        updateState: (newState: any) => {
          // Handle state updates from editor
        }
      });

      if (autoFocus) {
        setTimeout(() => contentRef.current?.focus(), 0);
      }
    }
  }, [editor, autoFocus]);

  // Handle input events
  const handleInput = useCallback(() => {
    if (readOnly || isInternalUpdate.current || !contentRef.current) return;
    
    const content = contentRef.current.innerHTML;
    if (content !== lastContent.current) {
      lastContent.current = content;
      // Debounce content updates to prevent excessive re-renders
      setTimeout(() => {
        if (!isInternalUpdate.current) {
          editor.setContent(content);
        }
      }, 10);
    }
  }, [readOnly, editor]);

  // Handle composition events for IME support
  const handleCompositionStart = useCallback(() => {
    isInternalUpdate.current = true;
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isInternalUpdate.current = false;
    handleInput();
  }, [handleInput]);

  // Handle paste events
  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    if (readOnly) return;
    
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');
    
    const content = htmlData || textData;
    if (content) {
      selectionManager.current.saveSelection();
      editor.insertContent(content);
      setTimeout(() => {
        selectionManager.current.restoreSelection();
      }, 0);
    }
  }, [readOnly, editor]);

  // Handle drag and drop
  const handleDrop = useCallback((event: React.DragEvent) => {
    if (readOnly) return;
    
    event.preventDefault();
    const data = event.dataTransfer.getData('text/html') || event.dataTransfer.getData('text/plain');
    
    if (data) {
      editor.insertContent(data);
    }
  }, [readOnly, editor]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    if (!readOnly) {
      event.preventDefault();
    }
  }, [readOnly]);

  // Handle key events
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (readOnly) return;

    const key = event.key;
    const ctrlOrCmd = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;
    const alt = event.altKey;

    // Handle keyboard shortcuts
    if (ctrlOrCmd) {
      let commandName = '';
      
      switch (key.toLowerCase()) {
        case 'b':
          commandName = 'toggleBold';
          break;
        case 'i':
          commandName = 'toggleItalic';
          break;
        case 'u':
          commandName = 'toggleUnderline';
          break;
        case 'z':
          commandName = shift ? 'redo' : 'undo';
          break;
        case 'y':
          commandName = 'redo';
          break;
        case 'a':
          // Select all - let browser handle
          return;
        case 'c':
        case 'x':
        case 'v':
          // Copy/Cut/Paste - let browser handle
          return;
      }
      
      if (commandName) {
        event.preventDefault();
        selectionManager.current.saveSelection();
        editor.executeCommand(commandName);
        setTimeout(() => {
          selectionManager.current.restoreSelection();
        }, 0);
      }
    }

    // Handle special keys
    switch (key) {
      case 'Enter':
        if (ctrlOrCmd) {
          event.preventDefault();
          editor.executeCommand('insertHardBreak');
        }
        break;
      case 'Tab':
        event.preventDefault();
        if (shift) {
          editor.executeCommand('liftListItem');
        } else {
          editor.executeCommand('sinkListItem');
        }
        break;
      case 'Backspace':
      case 'Delete':
        // Let browser handle, but save selection
        selectionManager.current.saveSelection();
        setTimeout(() => {
          handleInput();
        }, 0);
        break;
    }
  }, [readOnly, editor]);

  // Handle focus and blur
  const handleFocus = useCallback(() => {
    if (!readOnly) {
      editor.focus();
    }
  }, [readOnly, editor]);

  const handleBlur = useCallback(() => {
    if (!readOnly && contentRef.current) {
      const content = contentRef.current.innerHTML;
      if (content !== lastContent.current) {
        editor.setContent(content);
      }
      editor.blur();
    }
  }, [readOnly, editor]);

  // Update content when editor state changes
  useEffect(() => {
    if (contentRef.current && editor && !isInternalUpdate.current) {
      const html = editor.getHTML();
      
      if (contentRef.current.innerHTML !== html && html !== lastContent.current) {
        isInternalUpdate.current = true;
        selectionManager.current.saveSelection();
        
        contentRef.current.innerHTML = html;
        lastContent.current = html;
        
        setTimeout(() => {
          selectionManager.current.restoreSelection();
          isInternalUpdate.current = false;
        }, 0);
      }
    }
  }, [state.version, editor]);

  return (
    <div
      ref={contentRef}
      className={`rte-content ${className || ''}`}
      contentEditable={!readOnly}
      suppressContentEditableWarning
      spellCheck={spellCheck}
      onInput={handleInput}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-placeholder={placeholder}
      role="textbox"
      aria-multiline="true"
      aria-label="Rich text editor"
      style={{
        minHeight: '200px',
        padding: '16px',
        outline: 'none',
        lineHeight: '1.6',
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      }}
    />
  );
};
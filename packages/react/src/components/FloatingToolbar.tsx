import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@rte-editor/core';
import "./FloatingToolbar.css";

interface FloatingToolbarProps {
  editor: Editor;
  isEnabled: boolean;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  editor,
  isEnabled
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      setIsVisible(false);
      return;
    }

    const handleSelectionChange = () => {
      // Clear any existing timeout
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setIsVisible(false);
        selectionRef.current = null;
        return;
      }

      const range = selection.getRangeAt(0);
      const selectedText = selection.toString().trim();

      // Only show toolbar if there's actual text selected (not just whitespace)
      if (selectedText.length > 0) {
        const rect = range.getBoundingClientRect();
        const editorRect = document.querySelector('.rte-content')?.getBoundingClientRect();

        if (rect && editorRect) {
          // Position above the selection, centered horizontally
          const top = rect.top - 50; // 50px above selection
          const left = rect.left + (rect.width / 2);

          setPosition({ top, left });

          // Delay showing the toolbar to avoid showing it while user is still selecting
          showTimeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            selectionRef.current = range.cloneRange();
          }, 300); // 300ms delay
        }
      } else {
        setIsVisible(false);
        selectionRef.current = null;
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      // Hide toolbar if clicked outside
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        const selection = window.getSelection();
        const clickedInEditor = document.querySelector('.rte-content')?.contains(e.target as Node);

        // Don't hide if clicking within the editor (user might be adjusting selection)
        if (!clickedInEditor) {
          setIsVisible(false);
          selectionRef.current = null;
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', (e) => {
      // Hide on Escape
      if (e.key === 'Escape') {
        setIsVisible(false);
        selectionRef.current = null;
      }
    });

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mousedown', handleClickOutside);
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
    };
  }, [isEnabled]);

  const handleCommand = (command: string, value?: string) => {
    if (!selectionRef.current) return;

    const contentEl = document.querySelector('.rte-content') as HTMLElement;
    if (contentEl) {
      contentEl.focus();
    }

    const commandMap: Record<string, () => void> = {
      toggleBold: () => document.execCommand('bold', false),
      toggleItalic: () => document.execCommand('italic', false),
      toggleUnderline: () => document.execCommand('underline', false),
      toggleStrikethrough: () => document.execCommand('strikeThrough', false),
      createLink: () => {
        if (typeof window !== 'undefined' && (window as any).executeEditorCommand) {
          (window as any).executeEditorCommand('openLinkDialog');
        }
      },
      clearFormatting: () => {
        // Remove all formatting from selected text
        document.execCommand('removeFormat', false);
        // Also remove links if present
        document.execCommand('unlink', false);
      },
      toggleCode: () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const code = document.createElement('code');
          range.surroundContents(code);
        }
      },
      setBlockType: () => {
        if (value === 'blockquote') {
          // Toggle blockquote - check if current selection is already in a blockquote
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const currentBlock = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
              ? range.commonAncestorContainer.parentElement
              : range.commonAncestorContainer;

            const blockquote = (currentBlock as Element)?.closest?.('blockquote');
            if (blockquote) {
              // Already in blockquote, convert to paragraph
              document.execCommand('formatBlock', false, 'p');
            } else {
              // Not in blockquote, convert to blockquote
              document.execCommand('formatBlock', false, 'blockquote');
            }
          }
        } else if (value) {
          document.execCommand('formatBlock', false, value);
        }
      }
    };

    commandMap[command]?.();
    setIsVisible(false);
    selectionRef.current = null;

    if (contentEl) {
      contentEl.focus();
    }
  };

  if (!isEnabled || !isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      className="floating-toolbar"
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "white",
        border: "1px solid #e1e5e9",
        borderRadius: "6px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        padding: "6px",
        display: "flex",
        gap: "4px",
        alignItems: "center",
      }}
    >
      <button
        className="floating-toolbar-btn"
        onClick={() => handleCommand("toggleBold")}
        title="Bold (Ctrl+B)"
      > 
        <strong>B</strong>
      </button>
      <button
        className="floating-toolbar-btn"
        onClick={() => handleCommand("toggleItalic")}
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </button>

      <button
        className="floating-toolbar-btn"
        onClick={() => handleCommand("toggleUnderline")}
        title="Underline (Ctrl+U)"
      >
        <u>U</u>
      </button>

      <button
        className="floating-toolbar-btn"
        onClick={() => handleCommand("toggleStrikethrough")}
        title="Strikethrough"
      >
        <s>S</s>
      </button>

      <div className="floating-toolbar-separator" />

      <button
        className="floating-toolbar-btn"
        onClick={() => handleCommand("clearFormatting")}
        title="Clear Formatting"
      >
        ⌫
      </button>

      <button
        className="floating-toolbar-btn"
        onClick={() => handleCommand("createLink")}
        title="Insert Link"
      >
        🔗
      </button>

      <button
        className="floating-toolbar-btn"
        onClick={() => handleCommand("toggleCode")}
        title="Code"
      >
        Code
      </button>

      <div className="floating-toolbar-separator" />

      <button
        className="floating-toolbar-btn"
        onClick={() => handleCommand("setBlockType", "blockquote")}
        title="Quote"
      >
        ❝
      </button>
    </div>
  );
};

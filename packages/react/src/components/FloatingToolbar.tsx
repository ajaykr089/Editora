import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@editora/core';

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
  const hostRef = useRef<HTMLSpanElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      setIsVisible(false);
      return;
    }

    // Resolve parent editor container from persistent host node.
    editorContainerRef.current = hostRef.current?.closest('[data-editora-editor]') as HTMLElement;

    const resolveEditorContainer = (range?: Range): HTMLElement | null => {
      if (editorContainerRef.current) return editorContainerRef.current;

      const fromHost = hostRef.current?.closest('[data-editora-editor]') as HTMLElement | null;
      if (fromHost) {
        editorContainerRef.current = fromHost;
        return fromHost;
      }

      const anchor = range?.commonAncestorContainer;
      const anchorElement = anchor
        ? (anchor.nodeType === Node.ELEMENT_NODE ? (anchor as HTMLElement) : anchor.parentElement)
        : null;
      const fromSelection = anchorElement?.closest('[data-editora-editor]') as HTMLElement | null;
      if (fromSelection) {
        editorContainerRef.current = fromSelection;
        return fromSelection;
      }

      return null;
    };

    const getEditorContentElement = (container: HTMLElement | null | undefined): HTMLElement | null => {
      if (!container) return null;
      return (container.querySelector('.rte-content, .editora-content') as HTMLElement | null) || null;
    };

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
      if (range.collapsed) {
        setIsVisible(false);
        selectionRef.current = null;
        return;
      }

      const selectedText = selection.toString().trim();

      // Check if the selection is within THIS editor's content (not another editor instance)
      const editorContainer = resolveEditorContainer(range);
      const editorElement = getEditorContentElement(editorContainer);
      if (!editorElement || !editorElement.contains(range.commonAncestorContainer)) {
        setIsVisible(false);
        selectionRef.current = null;
        return;
      }

      // Only show toolbar if there's actual text selected (not just whitespace)
      if (selectedText.length > 0) {
        const rect = range.getBoundingClientRect();
        const editorRect = editorElement.getBoundingClientRect();
        const toolbarWidth = 300; // Approximate width of floating toolbar

        if (rect && editorRect) {
          // Position above the selection, centered horizontally
          const top = Math.max(8, rect.top - 50); // keep visible near viewport top
          let left = rect.left + (rect.width / 2);

          // Ensure toolbar stays within editor bounds
          const toolbarHalfWidth = toolbarWidth / 2;
          const editorLeft = editorRect.left;
          const editorRight = editorRect.right;

          // If toolbar would overflow left edge, position it at the left edge + padding
          if (left - toolbarHalfWidth < editorLeft) {
            left = editorLeft + toolbarHalfWidth + 10; // 10px padding from edge
          }

          // If toolbar would overflow right edge, position it at the right edge - padding
          if (left + toolbarHalfWidth > editorRight) {
            left = editorRight - toolbarHalfWidth - 10; // 10px padding from edge
          }

          setPosition({ top, left });
          setIsVisible(true);
          selectionRef.current = range.cloneRange();
        }
      } else {
        setIsVisible(false);
        selectionRef.current = null;
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      // Hide toolbar if clicked outside
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        const editorContainer = resolveEditorContainer();
        const selection = window.getSelection();
        // Check if clicking within THIS editor instance
        const clickedInEditor = getEditorContentElement(editorContainer)?.contains(e.target as Node);

        // Don't hide if clicking within the editor (user might be adjusting selection)
        if (!clickedInEditor) {
          setIsVisible(false);
          selectionRef.current = null;
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Hide on Escape
      if (e.key === 'Escape') {
        setIsVisible(false);
        selectionRef.current = null;
      }
    };

    const editorContentEl = getEditorContentElement(resolveEditorContainer());
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    editorContentEl?.addEventListener('mouseup', handleSelectionChange);
    editorContentEl?.addEventListener('keyup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      editorContentEl?.removeEventListener('mouseup', handleSelectionChange);
      editorContentEl?.removeEventListener('keyup', handleSelectionChange);
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
    };
  }, [isEnabled]);

  const handleCommand = (command: string, value?: string) => {
    if (!selectionRef.current) return;

    const contentEl = editorContainerRef.current?.querySelector('.rte-content') as HTMLElement;
    if (contentEl) {
      contentEl.focus();
    }

    const selection = window.getSelection();
    if (selection && selectionRef.current) {
      try {
        selection.removeAllRanges();
        selection.addRange(selectionRef.current);
      } catch {
        // Ignore stale selection ranges and let command execution decide fallback behavior.
      }
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
  };

  if (!isEnabled) {
    return <span ref={hostRef} style={{ display: 'none' }} aria-hidden="true" />;
  }

  return (
    <>
      <span ref={hostRef} style={{ display: 'none' }} aria-hidden="true" />
      {isVisible && (
        <div
          ref={toolbarRef}
          className="floating-toolbar"
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: "translateX(-50%)",
            zIndex: 10000,
            display: "flex",
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
      )}
    </>
  );
};

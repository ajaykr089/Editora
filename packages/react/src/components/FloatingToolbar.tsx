import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@editora/core';
import {
  getToolbarSelectionState,
  isToolbarCommandActive,
  ToolbarSelectionState,
} from '../utils/toolbarSelectionState';

interface FloatingToolbarProps {
  editor: Editor;
  isEnabled: boolean;
  viewportOnlyScan?: boolean;
  readonly?: boolean;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  editor,
  isEnabled,
  viewportOnlyScan = true,
  readonly = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectionState, setSelectionState] = useState<ToolbarSelectionState>(() => getToolbarSelectionState(null));
  const hostRef = useRef<HTMLSpanElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isEnabled || readonly) {
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

    const isRuntimeReadonly = (editorElement: HTMLElement | null): boolean => {
      if (!editorElement) return true;
      if (readonly) return true;

      const contentEditableAttr = editorElement.getAttribute('contenteditable');
      const dataReadonlyAttr = editorElement.getAttribute('data-readonly');
      if (contentEditableAttr === 'false' || dataReadonlyAttr === 'true') return true;

      const hostReadonly = editorElement.closest(
        '[readonly], [data-readonly="true"], .rte-editor[data-readonly="true"], editora-editor[readonly]',
      );
      return Boolean(hostReadonly);
    };

    const isSelectionBackward = (selection: Selection): boolean => {
      if (!selection.anchorNode || !selection.focusNode) return false;

      try {
        const probe = document.createRange();
        probe.setStart(selection.anchorNode, selection.anchorOffset);
        probe.setEnd(selection.focusNode, selection.focusOffset);
        return probe.collapsed;
      } catch {
        return false;
      }
    };

    const getAnchorRectForFloatingToolbar = (selection: Selection, range: Range): DOMRect | null => {
      const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0 || rect.height > 0);
      if (rects.length === 0) return range.getBoundingClientRect();

      // Keep toolbar close to where selection ends (focus side), which matches user intent
      // for long multi-line selections.
      const backward = isSelectionBackward(selection);
      return backward ? rects[0] : rects[rects.length - 1];
    };

    const handleSelectionChange = () => {
      // Clear any existing timeout
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setIsVisible(false);
        setSelectionState(getToolbarSelectionState(null));
        selectionRef.current = null;
        return;
      }

      const range = selection.getRangeAt(0);
      if (range.collapsed) {
        setIsVisible(false);
        setSelectionState(getToolbarSelectionState(null));
        selectionRef.current = null;
        return;
      }

      const selectedText = selection.toString().trim();

      // Check if the selection is within THIS editor's content (not another editor instance)
      const editorContainer = resolveEditorContainer(range);
      const editorElement = getEditorContentElement(editorContainer);
      if (!editorElement || !editorElement.contains(range.commonAncestorContainer)) {
        setIsVisible(false);
        setSelectionState(getToolbarSelectionState(null));
        selectionRef.current = null;
        return;
      }

      if (isRuntimeReadonly(editorElement)) {
        setIsVisible(false);
        setSelectionState(getToolbarSelectionState(null));
        selectionRef.current = null;
        return;
      }

      if (viewportOnlyScan) {
        const rect = editorElement.getBoundingClientRect();
        const inViewport = rect.bottom >= 0 && rect.top <= window.innerHeight;
        const hasFocus = document.activeElement === editorElement || editorElement.contains(document.activeElement);
        if (!inViewport && !hasFocus) {
          setIsVisible(false);
          setSelectionState(getToolbarSelectionState(null));
          selectionRef.current = null;
          return;
        }
      }

      // Only show toolbar if there's actual text selected (not just whitespace)
      if (selectedText.length > 0) {
        const rect = getAnchorRectForFloatingToolbar(selection, range);
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
          setSelectionState(getToolbarSelectionState(editorElement));
          setIsVisible(true);
          selectionRef.current = range.cloneRange();
        }
      } else {
        setIsVisible(false);
        setSelectionState(getToolbarSelectionState(null));
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
    const readonlyObserver =
      editorContentEl &&
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            if (isRuntimeReadonly(editorContentEl)) {
              setIsVisible(false);
              selectionRef.current = null;
            }
          })
        : null;

    if (readonlyObserver && editorContentEl) {
      readonlyObserver.observe(editorContentEl, {
        attributes: true,
        attributeFilter: ['contenteditable', 'data-readonly'],
      });
    }

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
      readonlyObserver?.disconnect();
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
    };
  }, [isEnabled, viewportOnlyScan, readonly]);

  const handleCommand = (command: string, value?: string) => {
    if (readonly) return;
    if (!selectionRef.current) return;

    if (typeof window !== 'undefined') {
      (window as any).__editoraCommandEditorRoot = editorContainerRef.current || null;
    }

    const contentEl = editorContainerRef.current?.querySelector('.rte-content, .editora-content') as HTMLElement;
    if (
      contentEl &&
      (contentEl.getAttribute('contenteditable') === 'false' || contentEl.getAttribute('data-readonly') === 'true')
    ) {
      setIsVisible(false);
      selectionRef.current = null;
      return;
    }

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

    const executeEditorCommand = (commandName: string, commandValue?: string) => {
      if (typeof window !== 'undefined' && (window as any).executeEditorCommand) {
        (window as any).executeEditorCommand(commandName, commandValue);
      }
    };

    const commandMap: Record<string, () => void> = {
      toggleBold: () => executeEditorCommand('toggleBold'),
      toggleItalic: () => executeEditorCommand('toggleItalic'),
      toggleUnderline: () => executeEditorCommand('toggleUnderline'),
      toggleStrikethrough: () => executeEditorCommand('toggleStrikethrough'),
      createLink: () => {
        executeEditorCommand('openLinkDialog');
      },
      clearFormatting: () => {
        executeEditorCommand('clearFormatting');
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
        if (typeof window === 'undefined' || !(window as any).executeEditorCommand) return;
        if (value === 'blockquote') {
          (window as any).executeEditorCommand('toggleBlockquote');
        } else if (value) {
          (window as any).executeEditorCommand('setBlockType', value);
        }
      }
    };

    commandMap[command]?.();
    requestAnimationFrame(() => setSelectionState(getToolbarSelectionState(contentEl || null)));
    setIsVisible(false);
    selectionRef.current = null;
  };

  if (!isEnabled || readonly) {
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
            className={`floating-toolbar-btn ${isToolbarCommandActive('toggleBold', selectionState) ? 'active' : ''}`}
            data-active={isToolbarCommandActive('toggleBold', selectionState) ? 'true' : 'false'}
            aria-pressed={isToolbarCommandActive('toggleBold', selectionState) ? 'true' : 'false'}
            onClick={() => handleCommand("toggleBold")}
            title="Bold (Ctrl+B)"
          > 
            <strong>B</strong>
          </button>
          <button
            className={`floating-toolbar-btn ${isToolbarCommandActive('toggleItalic', selectionState) ? 'active' : ''}`}
            data-active={isToolbarCommandActive('toggleItalic', selectionState) ? 'true' : 'false'}
            aria-pressed={isToolbarCommandActive('toggleItalic', selectionState) ? 'true' : 'false'}
            onClick={() => handleCommand("toggleItalic")}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>

          <button
            className={`floating-toolbar-btn ${isToolbarCommandActive('toggleUnderline', selectionState) ? 'active' : ''}`}
            data-active={isToolbarCommandActive('toggleUnderline', selectionState) ? 'true' : 'false'}
            aria-pressed={isToolbarCommandActive('toggleUnderline', selectionState) ? 'true' : 'false'}
            onClick={() => handleCommand("toggleUnderline")}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>

          <button
            className={`floating-toolbar-btn ${isToolbarCommandActive('toggleStrikethrough', selectionState) ? 'active' : ''}`}
            data-active={isToolbarCommandActive('toggleStrikethrough', selectionState) ? 'true' : 'false'}
            aria-pressed={isToolbarCommandActive('toggleStrikethrough', selectionState) ? 'true' : 'false'}
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
            className={`floating-toolbar-btn ${isToolbarCommandActive('openLinkDialog', selectionState) ? 'active' : ''}`}
            data-active={isToolbarCommandActive('openLinkDialog', selectionState) ? 'true' : 'false'}
            aria-pressed={isToolbarCommandActive('openLinkDialog', selectionState) ? 'true' : 'false'}
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

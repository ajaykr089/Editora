import React, { useRef, useEffect } from 'react';
import { Editor, KeyboardShortcutManager } from '@editora/core';
import { useAutosave } from '../hooks/useAutosave';
import { sanitizePastedHTML, sanitizeInputHTML } from '../utils/sanitizeHTML';

const isStructurallyEmpty = (el: HTMLElement): boolean => {
  const text = (el.textContent || '').replace(/\u200B/g, '').trim();
  if (text.length > 0) return false;

  // If there is embedded/media content, treat as non-empty.
  return !el.querySelector('img, video, table, iframe, hr, pre, blockquote, ul, ol');
};

const setPlaceholderVisualState = (el: HTMLElement, placeholder?: string): void => {
  const hasPlaceholder = Boolean(placeholder);
  const shouldShowPlaceholder = hasPlaceholder && isStructurallyEmpty(el);
  el.classList.toggle('rte-content-empty', shouldShowPlaceholder);
};

interface SelectionOffsets {
  start: number;
  end: number;
}

interface SelectionMarkersSnapshot {
  collapsed: boolean;
  caretId?: string;
  startId?: string;
  endId?: string;
  fallbackOffsets: SelectionOffsets | null;
}

const CARET_MARKER_ATTR = 'data-rte-caret-marker';
const RANGE_START_MARKER_ATTR = 'data-rte-range-start-marker';
const RANGE_END_MARKER_ATTR = 'data-rte-range-end-marker';

const createMarkerId = (): string => Math.random().toString(36).slice(2);

const saveSelectionOffsets = (root: HTMLElement): SelectionOffsets | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return null;

  try {
    const startRange = range.cloneRange();
    startRange.selectNodeContents(root);
    startRange.setEnd(range.startContainer, range.startOffset);

    const endRange = range.cloneRange();
    endRange.selectNodeContents(root);
    endRange.setEnd(range.endContainer, range.endOffset);

    return {
      start: startRange.toString().length,
      end: endRange.toString().length,
    };
  } catch {
    return null;
  }
};

const getTextPositionFromOffset = (
  root: HTMLElement,
  offset: number,
): { node: Node; offset: number } => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  let remaining = Math.max(0, offset);
  let lastTextNode: Node | null = null;

  while (current) {
    lastTextNode = current;
    const textLength = current.textContent?.length ?? 0;
    if (remaining <= textLength) {
      return { node: current, offset: remaining };
    }
    remaining -= textLength;
    current = walker.nextNode();
  }

  if (lastTextNode) {
    return {
      node: lastTextNode,
      offset: lastTextNode.textContent?.length ?? 0,
    };
  }

  return { node: root, offset: root.childNodes.length };
};

const insertSelectionMarkers = (root: HTMLElement): SelectionMarkersSnapshot | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return null;

  const fallbackOffsets = saveSelectionOffsets(root);

  try {
    if (range.collapsed) {
      const caretId = createMarkerId();
      const caretMarker = document.createElement('span');
      caretMarker.setAttribute(CARET_MARKER_ATTR, caretId);
      caretMarker.appendChild(document.createTextNode('\u200B'));

      const collapsedRange = range.cloneRange();
      collapsedRange.insertNode(caretMarker);

      return { collapsed: true, caretId, fallbackOffsets };
    }

    const startId = createMarkerId();
    const endId = createMarkerId();

    const endMarker = document.createElement('span');
    endMarker.setAttribute(RANGE_END_MARKER_ATTR, endId);
    endMarker.appendChild(document.createTextNode('\u200B'));

    const startMarker = document.createElement('span');
    startMarker.setAttribute(RANGE_START_MARKER_ATTR, startId);
    startMarker.appendChild(document.createTextNode('\u200B'));

    const endRange = range.cloneRange();
    endRange.collapse(false);
    endRange.insertNode(endMarker);

    const startRange = range.cloneRange();
    startRange.collapse(true);
    startRange.insertNode(startMarker);

    return { collapsed: false, startId, endId, fallbackOffsets };
  } catch {
    return { collapsed: range.collapsed, fallbackOffsets };
  }
};

const removeSelectionMarkers = (root: HTMLElement): void => {
  root.querySelectorAll(
    `[${CARET_MARKER_ATTR}], [${RANGE_START_MARKER_ATTR}], [${RANGE_END_MARKER_ATTR}]`,
  ).forEach((node) => node.remove());
};

const restoreSelectionFromMarkers = (
  root: HTMLElement,
  snapshot: SelectionMarkersSnapshot | null,
): boolean => {
  if (!snapshot) return false;
  const selection = window.getSelection();
  if (!selection) return false;

  try {
    const range = document.createRange();

    if (snapshot.collapsed && snapshot.caretId) {
      const caretMarker = root.querySelector(`[${CARET_MARKER_ATTR}="${snapshot.caretId}"]`);
      if (!caretMarker || !caretMarker.parentNode) return false;
      range.setStartAfter(caretMarker);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return true;
    }

    if (!snapshot.collapsed && snapshot.startId && snapshot.endId) {
      const startMarker = root.querySelector(`[${RANGE_START_MARKER_ATTR}="${snapshot.startId}"]`);
      const endMarker = root.querySelector(`[${RANGE_END_MARKER_ATTR}="${snapshot.endId}"]`);
      if (!startMarker || !endMarker || !startMarker.parentNode || !endMarker.parentNode) return false;

      range.setStartAfter(startMarker);
      range.setEndBefore(endMarker);
      selection.removeAllRanges();
      selection.addRange(range);
      return true;
    }
  } catch {
    return false;
  }

  return false;
};

const restoreSelectionOffsets = (root: HTMLElement, offsets: SelectionOffsets | null): void => {
  if (!offsets) return;

  const selection = window.getSelection();
  if (!selection) return;

  try {
    const start = getTextPositionFromOffset(root, offsets.start);
    const end = getTextPositionFromOffset(root, offsets.end);

    const range = document.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);

    selection.removeAllRanges();
    selection.addRange(range);
  } catch {
    // If restoration fails, keep browser default caret behavior.
  }
};

interface EditorContentProps {
  editor: Editor;
  defaultValue?: string;
  value?: string;
  readonly?: boolean;
  placeholder?: string;
  onChange?: (html: string) => void;
  pasteConfig?: {
    clean?: boolean;
    keepFormatting?: boolean;
    convertWord?: boolean;
  };
  contentConfig?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    sanitize?: boolean;
    autoHeight?: boolean;
    minHeight?: number;
    maxHeight?: number;
  };
  securityConfig?: {
    sanitizeOnPaste?: boolean;
    sanitizeOnInput?: boolean;
  };
  performanceConfig?: {
    debounceInputMs?: number;
    viewportOnlyScan?: boolean;
  };
  accessibilityConfig?: {
    enableARIA?: boolean;
    keyboardNavigation?: boolean;
    checker?: boolean;
  };
  autosaveConfig?: {
    enabled?: boolean;
    intervalMs?: number;
    storageKey?: string;
    provider?: 'localStorage' | 'api';
    apiUrl?: string;
  };
  contextMenuConfig?: {
    enabled?: boolean;
  };
  spellcheckConfig?: {
    enabled?: boolean;
    provider?: 'browser' | 'local' | 'api';
  };
}

export const EditorContent: React.FC<EditorContentProps> = ({ 
  editor, 
  defaultValue,
  value,
  readonly = false,
  placeholder,
  onChange,
  pasteConfig,
  contentConfig,
  securityConfig,
  performanceConfig,
  accessibilityConfig,
  autosaveConfig,
  contextMenuConfig,
  spellcheckConfig,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const autoHeightEnabled = contentConfig?.autoHeight === true;
  const minEditorHeight = typeof contentConfig?.minHeight === 'number' ? contentConfig.minHeight : 200;
  const maxEditorHeight = typeof contentConfig?.maxHeight === 'number' ? contentConfig.maxHeight : 0;

  const syncAutoHeight = (el: HTMLElement | null): void => {
    if (!el || !autoHeightEnabled) return;

    el.style.height = 'auto';
    const targetHeight = Math.max(minEditorHeight, el.scrollHeight);

    if (maxEditorHeight > 0) {
      el.style.height = `${Math.min(targetHeight, maxEditorHeight)}px`;
      return;
    }

    el.style.height = `${targetHeight}px`;
  };

  // Autosave setup
  const { restore } = useAutosave(
    () => contentRef.current?.innerHTML || '',
    autosaveConfig
  );

  // Set initial content
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Try to restore autosaved content first
    const restoredContent = restore();
    const initialContent = restoredContent ?? value ?? defaultValue ?? '';
    const trimmedInitialContent = initialContent.trim();

    if (trimmedInitialContent) {
      if (contentRef.current.innerHTML !== initialContent) {
        contentRef.current.innerHTML = initialContent;
      }
    } else if (placeholder) {
      // Keep truly empty so CSS placeholder can render.
      contentRef.current.innerHTML = '';
    } else if (!contentRef.current.innerHTML.trim()) {
      contentRef.current.innerHTML = '<p><br></p>';
    }
    
    setPlaceholderVisualState(contentRef.current, placeholder);
    syncAutoHeight(contentRef.current);

    if (restoredContent && onChange) {
      // Notify parent of restored content
      onChange(restoredContent);
    }
  }, []); // Only run on mount

  // Handle controlled value changes
  useEffect(() => {
    if (!contentRef.current || !isControlled) return;
    
    if (value !== contentRef.current.innerHTML) {
      contentRef.current.innerHTML = value;
    }
    setPlaceholderVisualState(contentRef.current, placeholder);
    syncAutoHeight(contentRef.current);
  }, [value, isControlled]);

  useEffect(() => {
    if (!contentRef.current) return;

    const el = contentRef.current;
    if (placeholder) {
      el.setAttribute('data-placeholder', placeholder);

      // Convert structural empty markup (<p><br></p>) to real empty content so placeholder shows.
      if (isStructurallyEmpty(el)) {
        el.innerHTML = '';
      }
      setPlaceholderVisualState(el, placeholder);
      syncAutoHeight(el);
      return;
    }

    el.removeAttribute('data-placeholder');
    setPlaceholderVisualState(el, placeholder);
    syncAutoHeight(el);
  }, [placeholder]);

  useEffect(() => {
    if (!contentRef.current) return;

    const el = contentRef.current;
    const ariaEnabled = accessibilityConfig?.enableARIA !== false;

    if (ariaEnabled) {
      el.setAttribute('role', 'textbox');
      el.setAttribute('aria-multiline', 'true');
      el.setAttribute('aria-disabled', readonly ? 'true' : 'false');
      const label = placeholder?.trim();
      if (label) {
        el.setAttribute('aria-label', label);
      } else {
        el.removeAttribute('aria-label');
      }
    } else {
      el.removeAttribute('role');
      el.removeAttribute('aria-multiline');
      el.removeAttribute('aria-label');
      el.removeAttribute('aria-disabled');
    }
  }, [accessibilityConfig?.enableARIA, placeholder, readonly]);

  useEffect(() => {
    syncAutoHeight(contentRef.current);
  }, [autoHeightEnabled, minEditorHeight, maxEditorHeight, value]);

  useEffect(() => {
    if (!contentRef.current) return;

    const handleInput = () => {
      if (!contentRef.current) return;
      if (readonly) return;

      if (placeholder && isStructurallyEmpty(contentRef.current)) {
        contentRef.current.innerHTML = '';
      }
      
      let html = contentRef.current.innerHTML;
      
      // Sanitize input if enabled
      if (securityConfig?.sanitizeOnInput !== false && contentConfig?.sanitize !== false) {
        const sanitizedHtml = sanitizeInputHTML(html, contentConfig, securityConfig);
        
        // Update content if sanitization changed it
        if (sanitizedHtml !== contentRef.current.innerHTML) {
          // Keep caret/selection stable when sanitization rewrites DOM.
          const snapshot = insertSelectionMarkers(contentRef.current);
          const htmlWithMarkers = contentRef.current.innerHTML;
          const sanitizedWithMarkers = sanitizeInputHTML(htmlWithMarkers, contentConfig, securityConfig);

          contentRef.current.innerHTML = sanitizedWithMarkers;

          const restoredFromMarkers = restoreSelectionFromMarkers(contentRef.current, snapshot);
          if (!restoredFromMarkers) {
            restoreSelectionOffsets(contentRef.current, snapshot?.fallbackOffsets || null);
          }

          removeSelectionMarkers(contentRef.current);
          html = contentRef.current.innerHTML;
        } else {
          html = sanitizedHtml;
        }
      }

      setPlaceholderVisualState(contentRef.current, placeholder);
      syncAutoHeight(contentRef.current);

      if (!onChange) return;
      
      // Debounce onChange if performance config specified
      if (performanceConfig?.debounceInputMs) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          onChange(html);
        }, performanceConfig.debounceInputMs);
      } else {
        onChange(html);
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      if (readonly) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      
      // Get pasted content
      let pastedHTML = e.clipboardData?.getData('text/html');
      const pastedText = e.clipboardData?.getData('text/plain');
      const isWordLikeHTML = !!pastedHTML && /class=["'][^"']*Mso|xmlns:w=|urn:schemas-microsoft-com:office/i.test(pastedHTML);
      
      // If clean paste is enabled, strip formatting
      if (pasteConfig?.clean || !pasteConfig?.keepFormatting) {
        if (pastedText) {
          document.execCommand('insertText', false, pastedText);
        }
        return;
      }

      // If Word conversion is disabled, fallback to plain text for Word/Office payloads.
      if (pasteConfig?.convertWord === false && isWordLikeHTML) {
        if (pastedText) {
          document.execCommand('insertText', false, pastedText);
        }
        return;
      }
      
      // Sanitize pasted HTML if enabled
      if (pastedHTML) {
        if (securityConfig?.sanitizeOnPaste !== false && contentConfig?.sanitize !== false) {
          pastedHTML = sanitizePastedHTML(pastedHTML, contentConfig, securityConfig);
        }
        
        // Insert sanitized HTML
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = pastedHTML;
          
          const fragment = document.createDocumentFragment();
          while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
          }
          
          range.insertNode(fragment);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else if (pastedText) {
        // Fallback to plain text
        document.execCommand('insertText', false, pastedText);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        target.style.resize = 'both';
        target.style.overflow = 'auto';
        target.style.display = 'inline-block';
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (contextMenuConfig?.enabled === false) {
        e.preventDefault();
      }
    };
    
    const handleFocusOrBlur = () => {
      if (!contentRef.current) return;
      if (placeholder && isStructurallyEmpty(contentRef.current)) {
        contentRef.current.innerHTML = '';
      }
      setPlaceholderVisualState(contentRef.current, placeholder);
      syncAutoHeight(contentRef.current);
    };

    const el = contentRef.current;
    el.addEventListener('input', handleInput);
    el.addEventListener('paste', handlePaste);
    el.addEventListener('click', handleClick);
    el.addEventListener('contextmenu', handleContextMenu);
    el.addEventListener('focus', handleFocusOrBlur);
    el.addEventListener('blur', handleFocusOrBlur);

    // Set focus to editor
    if (!readonly) {
      el.focus();
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      el.removeEventListener('input', handleInput);
      el.removeEventListener('paste', handlePaste);
      el.removeEventListener('click', handleClick);
      el.removeEventListener('contextmenu', handleContextMenu);
      el.removeEventListener('focus', handleFocusOrBlur);
      el.removeEventListener('blur', handleFocusOrBlur);
    };
  }, [editor, onChange, pasteConfig, contentConfig, securityConfig, performanceConfig, placeholder, contextMenuConfig, readonly]);

  const nativeSpellcheckEnabled =
    (spellcheckConfig?.enabled ?? false) &&
    (spellcheckConfig?.provider ?? 'browser') === 'browser';

  useEffect(() => {
    if (!contentRef.current || typeof window === 'undefined') return;
    if (readonly) return;

    if (accessibilityConfig?.keyboardNavigation === false) {
      return;
    }

    const manager = new KeyboardShortcutManager();
    const el = contentRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      manager.handleKeyDown(event, (command, params) => {
        if (typeof window !== 'undefined' && (window as any).executeEditorCommand) {
          const editorContainer = contentRef.current?.closest('[data-editora-editor]') as HTMLElement | null;
          (window as any).__editoraCommandEditorRoot = editorContainer || null;
          (window as any).executeEditorCommand(command, params);
        }
      });
    };

    el.addEventListener('keydown', handleKeyDown as any);

    return () => {
      el.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [accessibilityConfig?.keyboardNavigation, readonly]);

  return (
    <div
      ref={contentRef}
      contentEditable={!readonly}
      suppressContentEditableWarning
      spellCheck={readonly ? false : nativeSpellcheckEnabled}
      tabIndex={accessibilityConfig?.keyboardNavigation === false ? -1 : 0}
      aria-keyshortcuts={accessibilityConfig?.keyboardNavigation === false ? undefined : 'Ctrl+B Ctrl+I Ctrl+U Ctrl+Z Ctrl+Y'}
      data-viewport-only-scan={performanceConfig?.viewportOnlyScan ? 'true' : 'false'}
      data-a11y-checker={accessibilityConfig?.checker ? 'true' : 'false'}
      data-readonly={readonly ? 'true' : 'false'}
      className={`rte-content ${readonly ? 'rte-content-readonly' : ''}`}
      style={{
        minHeight: `${minEditorHeight}px`,
        maxHeight: autoHeightEnabled
          ? (maxEditorHeight > 0 ? `${maxEditorHeight}px` : "none")
          : "100%",
        padding: "16px",
        outline: "none",
        border: "1px solid #ddd",
        borderRadius: "0px 0px 4px 4px",
        fontSize: "14px",
        lineHeight: "1.5",
        overflow: autoHeightEnabled ? (maxEditorHeight > 0 ? "auto" : "hidden") : "auto",
        flex: autoHeightEnabled ? undefined : 1,
        boxSizing: "border-box",
        wordWrap: "break-word",
        overflowWrap: "break-word",
      }}
    />
  );
};

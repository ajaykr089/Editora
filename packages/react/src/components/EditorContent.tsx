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
      return;
    }

    el.removeAttribute('data-placeholder');
    setPlaceholderVisualState(el, placeholder);
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
        html = sanitizeInputHTML(html, contentConfig, securityConfig);
        
        // Update content if sanitization changed it
        if (html !== contentRef.current.innerHTML) {
          // Save selection
          const selection = window.getSelection();
          const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
          
          contentRef.current.innerHTML = html;
          
          // Restore selection
          if (range && selection) {
            try {
              selection.removeAllRanges();
              selection.addRange(range);
            } catch (e) {
              // Selection restoration failed, ignore
            }
          }
        }
      }

      setPlaceholderVisualState(contentRef.current, placeholder);

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
        minHeight: "200px",
        maxHeight: "100%",
        padding: "16px",
        outline: "none",
        border: "1px solid #ddd",
        borderRadius: "0px 0px 4px 4px",
        fontSize: "14px",
        lineHeight: "1.5",
        overflow: "auto",
        flex: 1,
        boxSizing: "border-box",
        wordWrap: "break-word",
        overflowWrap: "break-word",
      }}
    />
  );
};

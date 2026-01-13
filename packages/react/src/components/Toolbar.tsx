import React, { useState } from 'react';
import { Editor } from '@rte-editor/core';
import { ToolbarItem } from '@rte-editor/core';
import { useMediaManagerContext } from '../../../plugins/media-manager/src/components/MediaManagerProvider';

interface ToolbarProps {
  editor: Editor;
  onCustomCommand?: (command: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  onCustomCommand
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const items = editor.pluginManager.getToolbarItems();
  const mediaContext = useMediaManagerContext();

  const handleCommand = (command: string, value?: string) => {
    const contentEl = document.querySelector('.rte-content') as HTMLElement;
    if (contentEl) {
      contentEl.focus();
    }

    // Handle custom commands first
    if (command === 'openLinkDialog') {
      onCustomCommand?.(command);
      setOpenDropdown(null);
      return;
    }

    const commandMap: Record<string, () => void> = {
      toggleBold: () => document.execCommand('bold', false),
      toggleItalic: () => document.execCommand('italic', false),
      toggleUnderline: () => document.execCommand('underline', false),
      toggleStrikethrough: () => document.execCommand('strikeThrough', false),
      toggleCode: () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const code = document.createElement('code');
          range.surroundContents(code);
        }
      },
      toggleBulletList: () => document.execCommand('insertUnorderedList', false),
      toggleOrderedList: () => document.execCommand('insertOrderedList', false),
      toggleBlockquote: () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const currentBlock =
            range.commonAncestorContainer.nodeType === Node.TEXT_NODE
              ? range.commonAncestorContainer.parentElement
              : range.commonAncestorContainer;

          const blockquote = (currentBlock as Element)?.closest?.("blockquote");
          if (blockquote) {
            // Already in blockquote, convert to paragraph
            document.execCommand("formatBlock", false, "p");
          } else {
            // Not in blockquote, convert to blockquote
            document.execCommand("formatBlock", false, "blockquote");
          }
        }
      },
      createLink: () => {
        const url = prompt('Enter URL:');
        if (url) document.execCommand('createLink', false, url);
      },
      clearFormatting: () => {
        // Remove all formatting from selected text
        document.execCommand('removeFormat', false);
        // Also remove links if present
        document.execCommand('unlink', false);
      },
      insertImage: () => mediaContext.openImageDialog(),
      insertVideo: () => mediaContext.openVideoDialog(),
      undo: () => document.execCommand('undo', false),
      redo: () => document.execCommand('redo', false),
      setBlockType: () => {
        if (value === "blockquote") {
          // Toggle blockquote - check if current selection is already in a blockquote
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const currentBlock =
              range.commonAncestorContainer.nodeType === Node.TEXT_NODE
                ? range.commonAncestorContainer.parentElement
                : range.commonAncestorContainer;

            const blockquote = (currentBlock as Element)?.closest?.(
              "blockquote"
            );
            if (blockquote) {
              // Already in blockquote, convert to paragraph
              document.execCommand("formatBlock", false, "p");
            } else {
              // Not in blockquote, convert to blockquote
              document.execCommand("formatBlock", false, "blockquote");
            }
          }
        } else if (value) {
          document.execCommand("formatBlock", false, value);
        }
      }
    };

    commandMap[command]?.();
    setOpenDropdown(null);

    if (contentEl) {
      contentEl.focus();
    }
  };

  return (
    <div className="rte-toolbar">
      {items.map((item, idx) => (
        <div key={idx} className="rte-toolbar-item">
          {item.type === 'dropdown' ? (
            <div className="rte-toolbar-dropdown">
              <button
                className="rte-toolbar-button"
                onClick={() => setOpenDropdown(openDropdown === item.command ? null : item.command)}
              >
                {item.label} ▼
              </button>
              {openDropdown === item.command && (
                <div className="rte-toolbar-dropdown-menu">
                  {item.options?.map((opt) => (
                    <div
                      key={opt.value}
                      className="rte-toolbar-dropdown-item"
                      onClick={() => handleCommand(item.command, opt.value)}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              className="rte-toolbar-button"
              onClick={() => handleCommand(item.command)}
              title={item.label}
            >
              {item.icon || item.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { Editor } from '@editora/core';
import { ToolbarItem } from '@editora/core';
import { EditorIcons, EditorIconName } from './EditorIcons';
import { InlineMenu, InlineMenuOption } from './InlineMenu';

interface ToolbarProps {
  editor: Editor;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  editor
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openInlineMenu, setOpenInlineMenu] = useState<string | null>(null);
  const [storedSelection, setStoredSelection] = useState<Range | null>(null);
  const buttonRefs = useRef<Record<string, React.RefObject<HTMLButtonElement>>>({});
  const items = editor.pluginManager.getToolbarItems();

  const getButtonRef = (command: string) => {
    if (!buttonRefs.current[command]) {
      buttonRefs.current[command] = React.createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[command];
  };

  const handleCommand = (command: string, value?: string) => {
    const contentEl = document.querySelector('.rte-content') as HTMLElement;
    if (contentEl) {
      contentEl.focus();
    }

    // Restore stored selection if available (for dropdown and inline-menu commands that need selection)
    if (storedSelection && (command === 'setTextAlignment' || command === 'setFontFamily')) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(storedSelection);
      }
      setStoredSelection(null);
    }

    // Use global command execution
    if (typeof window !== 'undefined' && (window as any).executeEditorCommand) {
      (window as any).executeEditorCommand(command, value);
    }
    setOpenDropdown(null);

    if (contentEl) {
      contentEl.focus();
    }
  };

  const handleDropdownOpen = (command: string) => {
    // Store current selection when opening dropdown
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setStoredSelection(selection.getRangeAt(0).cloneRange());
    }
    setOpenDropdown(openDropdown === command ? null : command);
  };

  const handleInlineMenuOpen = (command: string) => {
    // Store current selection when opening inline menu
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setStoredSelection(selection.getRangeAt(0).cloneRange());
    }
    setOpenInlineMenu(openInlineMenu === command ? null : command);
    setOpenDropdown(null); // Close any open dropdowns
  };

  const handleInlineMenuSelect = (command: string, value: string) => {
    // Restore stored selection if available
    if (storedSelection) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(storedSelection);
      }
      setStoredSelection(null);
    }

    handleCommand(command, value);
    setOpenInlineMenu(null);
  };

  const renderIcon = (iconName?: string, command?: string) => {
    // Handle inline SVG strings from plugins
    if (iconName && iconName.startsWith('<svg') && iconName.endsWith('</svg>')) {
      return <span dangerouslySetInnerHTML={{ __html: iconName }} style={{ display: 'inline-block', width: '24px', height: '24px' }} />;
    }

    // Handle single character icons (B, I, U, S, H)
    if (iconName && iconName.length === 1 && /^[BIUSH]$/.test(iconName)) {
      return <span style={{ fontWeight: 'bold', fontSize: '14px', lineHeight: '1' }}>{iconName}</span>;
    }

    // Handle legacy SVG icons from EditorIcons for existing plugins
    if (command) {
      const commandIconMap: Record<string, EditorIconName> = {
        'toggleBold': 'bold',
        'toggleItalic': 'italic',
        'toggleUnderline': 'underline',
        'toggleStrikethrough': 'strikethrough',
        'importFromWord': 'importWord',
        'exportToWord': 'exportWord',
        'exportToPdf': 'exportPdf',
        'insertLink': 'link',
        'insertImage': 'media',
        'insertVideo': 'video',
        'insertTable': 'table',
        'insertMath': 'math',
        'toggleOrderedList': 'numberedList',
        'toggleBulletList': 'bulletList',
        'setTextAlignment': 'alignLeft',
        'setFontFamily': 'heading',
        'toggleCodeBlock': 'codeBlock',
        'toggleBlockquote': 'blockquote',
        'clearFormatting': 'clearFormatting',
      };

      const commandIconKey = commandIconMap[command];
      if (commandIconKey && EditorIcons[commandIconKey]) {
        const IconComponent = EditorIcons[commandIconKey];
        return <IconComponent />;
      }
    }

    // Final fallback
    return iconName || '⚪';
  };

  return (
    <>
      <div className="rte-toolbar">
        {items.map((item, idx) => (
          <div key={idx} className="rte-toolbar-item">
            {item.type === 'dropdown' ? (
              <div className="rte-toolbar-dropdown">
                <button
                  className="rte-toolbar-button"
                  onClick={() => handleDropdownOpen(item.command)}
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
            ) : item.type === 'inline-menu' ? (
              <div className="rte-toolbar-inline-menu">
                <button
                  ref={getButtonRef(item.command)}
                  className="rte-toolbar-button"
                  onClick={() => handleInlineMenuOpen(item.command)}
                  title={item.label}
                >
                  {renderIcon(item.icon, item.command)}
                </button>
                <InlineMenu
                  isOpen={openInlineMenu === item.command}
                  options={item.options || []}
                  onSelect={(value) => handleInlineMenuSelect(item.command, value)}
                  onClose={() => setOpenInlineMenu(null)}
                  anchorRef={getButtonRef(item.command)}
                />
              </div>
            ) : item.type === 'input' ? (
              <input
                type="text"
                className="rte-toolbar-input"
                placeholder={item.placeholder}
                onChange={(e) => handleCommand(item.command, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCommand(item.command, (e.target as HTMLInputElement).value);
                  }
                }}
                title={item.label}
              />
            ) : (
              <button
                className="rte-toolbar-button"
                onClick={() => handleCommand(item.command)}
                title={item.label}
              >
                {renderIcon(item.icon, item.command)}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

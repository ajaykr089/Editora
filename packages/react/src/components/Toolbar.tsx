import React, { useState } from 'react';
import { Editor } from '@rte-editor/core';
import { ToolbarItem } from '@rte-editor/core';
import { usePluginContext } from './PluginManager';

interface ToolbarProps {
  editor: Editor;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  editor
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [storedSelection, setStoredSelection] = useState<Range | null>(null);
  const items = editor.pluginManager.getToolbarItems();
  const { executeCommand } = usePluginContext();

  const handleCommand = (command: string, value?: string) => {
    console.log(`Executing command: ${command} with value: ${value}`);
    const contentEl = document.querySelector('.rte-content') as HTMLElement;
    if (contentEl) {
      contentEl.focus();
    }

    // Restore stored selection if available (for dropdown commands)
    if (storedSelection && (command === 'setTextAlignment' || command === 'setFontFamily')) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(storedSelection);
      }
      setStoredSelection(null);
    }

    // Use plugin context to execute all commands
    executeCommand(command, value);
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

  return (
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
              {item.icon || item.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

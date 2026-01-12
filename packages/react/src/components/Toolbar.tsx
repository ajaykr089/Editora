import React from 'react';
import { useEditorContext } from '../context/EditorContext';
import { ToolbarItem } from '@rte-editor/core';

/**
 * Props for the Toolbar component.
 */
export interface ToolbarProps {
  className?: string;
  items?: ToolbarItem[];
}

/**
 * Toolbar component that renders editor controls.
 */
export const Toolbar: React.FC<ToolbarProps> = ({ className, items }) => {
  const { state, editor } = useEditorContext();

  // Collect toolbar items from plugins if not provided
  const toolbarItems = items || editor.state.plugins.flatMap(plugin => {
    const config = plugin.getToolbarConfig();
    return config?.items || [];
  });

  // Fallback toolbar if no plugin items
  if (toolbarItems.length === 0) {
    return (
      <div className={`rte-toolbar ${className || ''}`}>
        <button
          className="rte-toolbar-button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.executeCommand('toggleBold');
          }}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          className="rte-toolbar-button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.executeCommand('toggleItalic');
          }}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          className="rte-toolbar-button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.executeCommand('undo');
          }}
          title="Undo"
        >
          ↶
        </button>
      </div>
    );
  }

  const handleCommand = (commandName: string) => {
    editor.executeCommand(commandName);
  };

  return (
    <div className={`rte-toolbar ${className || ''}`}>
      {toolbarItems.map((item) => (
        <ToolbarButton
          key={item.id}
          item={item}
          state={state}
          onCommand={handleCommand}
        />
      ))}
    </div>
  );
};

/**
 * Props for the ToolbarButton component.
 */
interface ToolbarButtonProps {
  item: ToolbarItem;
  state: any;
  onCommand: (command: string) => void;
}

/**
 * Individual toolbar button component.
 */
const ToolbarButton: React.FC<ToolbarButtonProps> = ({ item, state, onCommand }) => {
  const isActive = item.active ? item.active(state) : false;
  const isEnabled = item.enabled ? item.enabled(state) : true;

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent button from stealing focus
    e.preventDefault();
    
    if (isEnabled) {
      onCommand(item.command);
    }
  };

  return (
    <button
      type="button"
      className={`rte-toolbar-button ${
        isActive ? 'rte-toolbar-button--active' : ''
      } ${
        !isEnabled ? 'rte-toolbar-button--disabled' : ''
      }`}
      onMouseDown={handleMouseDown}
      disabled={!isEnabled}
      title={item.label}
      aria-label={item.label}
    >
      {typeof item.icon === 'string' ? (
        <span className="rte-toolbar-button__icon">{item.icon}</span>
      ) : (
        item.icon
      )}
      {item.label && (
        <span className="rte-toolbar-button__label">{item.label}</span>
      )}
    </button>
  );
};

export { ToolbarButton };
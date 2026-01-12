import React from 'react';
import { useEditorContext } from '../context/EditorContext';
import { ToolbarItem, TextSelection, ResolvedPos } from '@rte-editor/core';

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

  const handleCommand = (commandName: string, commandArgs?: any[]) => {
    const domSelection = window.getSelection();
    const editorDom = document.querySelector('.rte-content');
    
    if (domSelection && domSelection.rangeCount > 0 && editorDom) {
      const range = domSelection.getRangeAt(0);
      const from = getDocPosition(editorDom, range.startContainer, range.startOffset);
      const to = getDocPosition(editorDom, range.endContainer, range.endOffset);
      
      const $from = ResolvedPos.resolve(editor.state.doc, from);
      const $to = ResolvedPos.resolve(editor.state.doc, to);
      editor['_state'] = editor.state.update({
        selection: new TextSelection($from, $to)
      });
      
      editor.executeCommand(commandName, ...(commandArgs || []));
      
      requestAnimationFrame(() => {
        const newRange = document.createRange();
        const walker = document.createTreeWalker(editorDom, NodeFilter.SHOW_TEXT);
        let currentPos = 0;
        let startNode: Node | null = null;
        let startOffset = 0;
        let endNode: Node | null = null;
        let endOffset = 0;
        let node: Node | null;
        
        while ((node = walker.nextNode())) {
          const nodeLength = (node.textContent || '').length;
          if (!startNode && currentPos + nodeLength >= from - 1) {
            startNode = node;
            startOffset = from - 1 - currentPos;
          }
          if (!endNode && currentPos + nodeLength >= to - 1) {
            endNode = node;
            endOffset = to - 1 - currentPos;
            break;
          }
          currentPos += nodeLength;
        }
        
        if (startNode && endNode) {
          try {
            newRange.setStart(startNode, Math.max(0, startOffset));
            newRange.setEnd(endNode, Math.max(0, endOffset));
            domSelection.removeAllRanges();
            domSelection.addRange(newRange);
          } catch (e) {
            // Ignore
          }
        }
        
        (editorDom as HTMLElement).focus();
      });
    } else {
      editor.executeCommand(commandName, ...(commandArgs || []));
    }
  };
  
  const getDocPosition = (root: Node, node: Node, offset: number): number => {
    let pos = 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let currentNode: Node | null;
    
    while ((currentNode = walker.nextNode())) {
      if (currentNode === node) {
        return pos + offset + 1;
      }
      pos += (currentNode.textContent || '').length;
    }
    
    return pos + 1;
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
  onCommand: (command: string, commandArgs?: any[]) => void;
}

/**
 * Individual toolbar button component.
 */
const ToolbarButton: React.FC<ToolbarButtonProps> = ({ item, state, onCommand }) => {
  const isActive = item.active ? item.active(state) : false;
  const isEnabled = item.enabled ? item.enabled(state) : true;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isEnabled !== false) {
      onCommand(item.command, item.commandArgs);
    }
  };

  return (
    <button
      type="button"
      className={`rte-toolbar-button ${
        isActive ? 'rte-toolbar-button--active' : ''
      } ${
        isEnabled === false ? 'rte-toolbar-button--disabled' : ''
      }`}
      onMouseDown={handleMouseDown}
      disabled={isEnabled === false}
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
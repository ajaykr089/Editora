import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Editor, ToolbarEngine, ToolbarState, ToolbarItemConfig, ToolbarItem } from '@editora/core';
import './ToolbarContainer.css';

export interface ToolbarContainerProps {
  editor: Editor;
  position?: 'top' | 'bottom';
  sticky?: boolean;
  floating?: boolean;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onStateChange?: (state: ToolbarState) => void;
}

const normalizeToolbarItems = (items: ToolbarItem[]): ToolbarItemConfig[] => {
  return items.map((item) => {
    const id = item.id || item.command;

    switch (item.type) {
      case 'separator':
        return { type: 'separator', id };
      case 'input':
        return {
          id,
          command: item.command,
          placeholder: item.placeholder,
        };
      case 'dropdown':
      case 'inline-menu':
        return {
          id,
          label: item.label,
          command: item.command,
          options: item.options || [],
          icon: item.icon,
        };
      default:
        return {
          id,
          label: item.label,
          command: item.command,
          icon: item.icon,
          shortcut: item.shortcut,
        };
    }
  });
};

/**
 * Feature-complete React wrapper for the framework-agnostic Toolbar system
 * 
 * Features:
 * - Responsive design with "More" overflow menu
 * - Sticky and floating positioning
 * - Top/bottom placement
 * - Full toolbar item support (buttons, dropdowns, inputs, separators)
 * - State management and callbacks
 * - Selection preservation during commands
 */
export const ToolbarContainer = React.forwardRef<HTMLDivElement, ToolbarContainerProps>(
  (
    {
      editor,
      position = 'top',
      sticky = false,
      floating = false,
      responsive = true,
      className = '',
      style = {},
      onStateChange,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const toolbarEngineRef = useRef<ToolbarEngine | null>(null);
    const [toolbarState, setToolbarState] = useState<ToolbarState>({
      isVisible: true,
      isSticky: sticky,
      activeCommand: undefined,
      openDropdown: undefined,
      openMenu: undefined,
    });
    const [overflowItems, setOverflowItems] = useState<ToolbarItemConfig[]>([]);
    const [showOverflowMenu, setShowOverflowMenu] = useState(false);
    const [overflowOpenItem, setOverflowOpenItem] = useState<string | null>(null);
    const overflowMenuRef = useRef<HTMLDivElement>(null);

    // Merge refs
    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(containerRef.current);
        } else {
          ref.current = containerRef.current;
        }
      }
    }, [ref]);

    // Handle overflow menu close on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (overflowMenuRef.current && !overflowMenuRef.current.contains(e.target as Node)) {
          setShowOverflowMenu(false);
        }
      };

      if (showOverflowMenu) {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
      }
    }, [showOverflowMenu]);

    // Initialize toolbar with items from plugins
    useEffect(() => {
      if (!containerRef.current || !editor) {
        return;
      }

      try {
        // Get toolbar items from plugins
        const toolbarItems = normalizeToolbarItems(editor.pluginManager.getToolbarItems());
        
        if (!toolbarItems || toolbarItems.length === 0) {
          console.warn('No toolbar items found');
          return;
        }

        // Create toolbar engine with full configuration
        const config = {
          items: toolbarItems,
          position,
          sticky,
          floating,
          responsive,
          className,
        };

        const toolbarEngine = new ToolbarEngine({
          editor,
          config,
          onCommand: (command: string, value?: string) => {
            // Handle command execution through editor
            editor.execCommand(command, value);
          },
          onStateChange: (state: ToolbarState) => {
            setToolbarState(state);
            onStateChange?.(state);
          },
        });

        // Clear and render the toolbar element
        containerRef.current.innerHTML = '';
        const toolbarElement = toolbarEngine.render();
        containerRef.current.appendChild(toolbarElement);

        // Setup responsive behavior with overflow menu
        let cleanupResponsive: (() => void) | undefined;
        if (responsive) {
          cleanupResponsive = setupResponsiveToolbar(containerRef.current, toolbarItems);
        }

        toolbarEngineRef.current = toolbarEngine;

        // Cleanup function
        return () => {
          cleanupResponsive?.();
          if (toolbarEngineRef.current) {
            toolbarEngineRef.current.destroy();
            toolbarEngineRef.current = null;
          }
        };
      } catch (error) {
        console.error('Error initializing toolbar:', error);
      }
    }, [editor, position, sticky, floating, responsive, className, onStateChange]);

    // Setup responsive toolbar with overflow menu
    const setupResponsiveToolbar = useCallback((container: HTMLElement, items: ToolbarItemConfig[]) => {
      const toolbarWrapper = container.querySelector('.toolbar-wrapper') as HTMLElement;
      if (!toolbarWrapper) return undefined;

      const itemsContainer = toolbarWrapper.querySelector('.toolbar-container') as HTMLElement;
      if (!itemsContainer) return undefined;

      const handleResize = () => {
        const containerWidth = itemsContainer.clientWidth;
        const buttonElements = Array.from(itemsContainer.querySelectorAll('.toolbar-item'));
        
        if (buttonElements.length === 0) return;

        const moreButtonWidth = 50;
        const padding = 16;
        const availableWidth = containerWidth - moreButtonWidth - padding;
        
        let accumulatedWidth = 0;
        let visibleCount = 0;
        const hiddenItems: ToolbarItemConfig[] = [];

        // Calculate which items should be visible
        buttonElements.forEach((button, idx) => {
          const buttonWidth = (button as HTMLElement).offsetWidth + 8; // 8px gap
          
          if (accumulatedWidth + buttonWidth <= availableWidth && idx < items.length) {
            accumulatedWidth += buttonWidth;
            visibleCount++;
            (button as HTMLElement).style.display = 'flex';
          } else {
            (button as HTMLElement).style.display = 'none';
            if (idx < items.length) {
              hiddenItems.push(items[idx]);
            }
          }
        });

        // Show/hide the "More" button
        let moreButton = itemsContainer.querySelector('[data-toolbar-more]') as HTMLElement;
        if (hiddenItems.length > 0) {
          if (!moreButton) {
            moreButton = document.createElement('div');
            moreButton.className = 'toolbar-item';
            moreButton.setAttribute('data-toolbar-more', 'true');
            
            const btn = document.createElement('button');
            btn.className = 'toolbar-button toolbar-more-button';
            btn.textContent = '⋮';
            btn.title = 'More options';
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              setShowOverflowMenu((prev) => !prev);
            });
            
            moreButton.appendChild(btn);
            itemsContainer.appendChild(moreButton);
          }
          setOverflowItems(hiddenItems);
        } else if (moreButton) {
          moreButton.remove();
          setOverflowItems([]);
          setShowOverflowMenu(false);
        }
      };

      // Observe size changes
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(itemsContainer);

      // Initial calculation
      setTimeout(handleResize, 100);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Render overflow menu items
    const renderOverflowItems = () => {
      if (overflowItems.length === 0) return null;

      return (
        <div 
          ref={overflowMenuRef}
          className={`toolbar-overflow-menu ${showOverflowMenu ? 'show' : ''}`}
          style={{
            position: 'absolute',
            [position]: '100%',
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '200px',
            zIndex: 1000,
            display: showOverflowMenu ? 'block' : 'none',
          }}
        >
          {overflowItems.map((item) => {
            if ('type' in item && item.type === 'separator') {
              return (
                <div
                  key={item.id || 'sep'}
                  style={{
                    height: '1px',
                    backgroundColor: '#e5e7eb',
                    margin: '4px 0',
                  }}
                />
              );
            }

            const itemId = (item as any).id || (item as any).command;
            const label = (item as any).label || (item as any).command;
            const options = (item as any).options as Array<{ label: string; value: string }> | undefined;
            const hasOptions = !!options?.length;
            const isOpen = overflowOpenItem === itemId;

            return (
              <div key={itemId}>
                <button
                  className="toolbar-overflow-item"
                  onClick={() => {
                    if (hasOptions) {
                      setOverflowOpenItem(isOpen ? null : itemId);
                      return;
                    }
                    if ((item as any).command) {
                      editor.execCommand((item as any).command);
                    }
                    setShowOverflowMenu(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  {label}
                  {hasOptions && ' ›'}
                </button>
                {hasOptions && isOpen && (
                  <div style={{ padding: '4px 0 8px 12px' }}>
                    {options?.map((opt) => (
                      <button
                        key={`${itemId}-${opt.value}`}
                        className="toolbar-overflow-item"
                        onClick={() => {
                          if ((item as any).command) {
                            editor.execCommand((item as any).command, opt.value);
                          }
                          setShowOverflowMenu(false);
                          setOverflowOpenItem(null);
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '6px 12px',
                          border: 'none',
                          background: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    };

    const combinedStyle: React.CSSProperties = {
      ...style,
      ...(sticky && {
        position: 'sticky',
        [position]: 0,
        zIndex: 999,
      }),
      ...(floating && {
        position: 'fixed',
        [position]: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }),
    };

    return (
      <div
        ref={containerRef}
        className={`toolbar-container-wrapper ${className}`}
        style={combinedStyle}
        data-toolbar-position={position}
        data-toolbar-sticky={sticky}
        data-toolbar-floating={floating}
        data-toolbar-responsive={responsive}
      >
        {renderOverflowItems()}
      </div>
    );
  }
);

ToolbarContainer.displayName = 'ToolbarContainer';

import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@editora/core';
import { ToolbarItem } from '@editora/core';
import { EditorIcons, EditorIconName } from './EditorIcons';
import { InlineMenu, InlineMenuOption } from './InlineMenu';

interface ToolbarProps {
  editor: Editor;
  position?: 'top' | 'bottom';
  sticky?: boolean;
  floating?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  position = 'top',
  sticky = false,
  floating = false
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openInlineMenu, setOpenInlineMenu] = useState<string | null>(null);
  const [storedSelection, setStoredSelection] = useState<Range | null>(null);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const buttonRefs = useRef<Record<string, React.RefObject<HTMLButtonElement>>>({});
  const toolbarRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const items = editor.pluginManager.getToolbarItems();

  // Calculate visible items based on available space
  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!toolbarRef.current || !itemsContainerRef.current) return;

      const toolbarWidth = toolbarRef.current.clientWidth;
      const padding = 16; // 8px on each side
      const moreButtonWidth = 40; // Width of more button
      const gap = 4; // Gap between items
      const availableWidth = toolbarWidth - padding - moreButtonWidth - gap;

      let accumulatedWidth = 0;
      let count = 0;

      const itemElements = itemsContainerRef.current.children;
      for (let i = 0; i < itemElements.length; i++) {
        const element = itemElements[i] as HTMLElement;
        const itemWidth = element.offsetWidth + gap;

        if (accumulatedWidth + itemWidth <= availableWidth) {
          accumulatedWidth += itemWidth;
          count++;
        } else {
          break;
        }
      }

      // Ensure at least one item is visible
      setVisibleCount(Math.max(1, count));
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      calculateVisibleItems();
    });

    // Recalculate on window/container resize
    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleItems();
    });
    
    if (toolbarRef.current) {
      resizeObserver.observe(toolbarRef.current);
    }

    // Watch for DOM changes (new items added)
    const mutationObserver = new MutationObserver(() => {
      calculateVisibleItems();
    });

    if (itemsContainerRef.current) {
      mutationObserver.observe(itemsContainerRef.current, {
        childList: true,
        subtree: true
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [items.length]);

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

  // Don't render toolbar if floating mode is enabled (FloatingToolbar will handle it)
  if (floating) {
    return null;
  }

  const toolbarStyle: React.CSSProperties = {
    ...(sticky && {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }),
    ...(position === 'bottom' && {
      order: 2, // Move to bottom in flex container
    })
  };

  return (
    <>
      <div className="rte-toolbar-wrapper" style={toolbarStyle}>
        {/* Main toolbar row */}
        <div className="rte-toolbar" ref={toolbarRef}>
          <div className="rte-toolbar-items-container" ref={itemsContainerRef}>
            {items.map((item, idx) => (
              <div 
                key={idx} 
                className="rte-toolbar-item"
                style={{
                  display: visibleCount !== null && idx >= visibleCount ? 'none' : 'flex'
                }}
              >
                {item.type === 'dropdown' ? (
                  <div className="rte-toolbar-dropdown">
                    <button
                      className="rte-toolbar-button"
                      data-command={item.command}
                      data-active="false"
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
                      data-command={item.command}
                      data-active="false"
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
                    data-command={item.command}
                    data-active="false"
                    onClick={() => handleCommand(item.command)}
                    title={item.label}
                  >
                    {renderIcon(item.icon, item.command)}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* More button - only show if there are hidden items */}
          {visibleCount !== null && visibleCount < items.length && (
            <button
              ref={moreButtonRef}
              className={`rte-toolbar-more-button ${showMoreMenu ? 'active' : ''}`}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              title="Show more options"
              aria-label="More toolbar options"
            >
              ☰
            </button>
          )}
        </div>

        {/* Hidden items expansion row - slides down inline */}
        {visibleCount !== null && visibleCount < items.length && (
          <div className={`rte-toolbar-expanded-row ${showMoreMenu ? 'show' : ''}`}>
            {items.map((item, idx) => (
              idx >= (visibleCount || 0) && (
                <div key={idx} className="rte-toolbar-item">
                  {item.type === 'dropdown' ? (
                    <div className="rte-toolbar-dropdown">
                      <button
                        className="rte-toolbar-button"
                        data-command={item.command}
                        data-active="false"
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
                        data-command={item.command}
                        data-active="false"
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
                      data-command={item.command}
                      data-active="false"
                      onClick={() => handleCommand(item.command)}
                      title={item.label}
                    >
                      {renderIcon(item.icon, item.command)}
                    </button>
                  )}
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </>
  );
};

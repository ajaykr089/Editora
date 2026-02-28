import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Editor } from '@editora/core';
import { ToolbarItem } from '@editora/core';
import { EditorIcons, EditorIconName } from './EditorIcons';
import { InlineMenu, InlineMenuOption } from './InlineMenu';

type ToolbarItemLike = ToolbarItem | {
  type: 'separator';
  command: string;
  label: string;
};

interface ToolbarProps {
  editor: Editor;
  position?: 'top' | 'bottom';
  sticky?: boolean;
  floating?: boolean;
  readonly?: boolean;
  showMoreOptions?: boolean;
  itemsOverride?: string[] | ToolbarItem[];
}

const normalizeToolbarToken = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '');

const COMMAND_ALIASES: Record<string, string> = {
  undo: 'undo',
  redo: 'redo',
  bold: 'toggleBold',
  italic: 'toggleItalic',
  underline: 'toggleUnderline',
  strikethrough: 'toggleStrikethrough',
  textcolor: 'openTextColorPicker',
  backgroundcolor: 'openBackgroundColorPicker',
  fontsize: 'setFontSize',
  increasefontsize: 'increaseFontSize',
  decreasefontsize: 'decreaseFontSize',
  heading: 'setHeading',
  paragraph: 'setHeading',
  textalignment: 'setTextAlignment',
  direction: 'setDirectionLTR',
  bullist: 'toggleBulletList',
  numlist: 'toggleOrderedList',
  checklist: 'toggleChecklist',
  indent: 'increaseIndent',
  outdent: 'decreaseIndent',
  link: 'openLinkDialog',
  image: 'insertImage',
  video: 'insertVideo',
  table: 'insertTable',
  clearformatting: 'clearFormatting',
};

const resolveToolbarItems = (
  pluginItems: ToolbarItem[],
  itemsOverride?: string[] | ToolbarItem[],
): ToolbarItemLike[] => {
  if (!Array.isArray(itemsOverride) || itemsOverride.length === 0) {
    return pluginItems;
  }

  const hasStringItems = itemsOverride.every((item) => typeof item === 'string');
  if (!hasStringItems) {
    return itemsOverride as ToolbarItem[];
  }

  const byNormalizedCommand = new Map<string, ToolbarItem>();
  const byNormalizedLabel = new Map<string, ToolbarItem>();

  pluginItems.forEach((item) => {
    byNormalizedCommand.set(normalizeToolbarToken(item.command || ''), item);
    byNormalizedLabel.set(normalizeToolbarToken(item.label || ''), item);
  });

  const tokens = (itemsOverride as string[])
    .flatMap((entry) => entry.split(/\s+/))
    .map((entry) => entry.trim())
    .filter(Boolean);

  const resolved: ToolbarItemLike[] = [];
  let separatorCount = 0;

  tokens.forEach((token) => {
    if (token === '|') {
      separatorCount += 1;
      resolved.push({
        type: 'separator',
        command: `__separator__${separatorCount}`,
        label: '|',
      });
      return;
    }

    const normalizedToken = normalizeToolbarToken(token);
    const aliasCommand = COMMAND_ALIASES[normalizedToken];
    const directMatch =
      byNormalizedCommand.get(normalizedToken) ||
      (aliasCommand ? byNormalizedCommand.get(normalizeToolbarToken(aliasCommand)) : undefined) ||
      byNormalizedLabel.get(normalizedToken) ||
      pluginItems.find((item) =>
        normalizeToolbarToken(item.command || '').includes(normalizedToken),
      );

    if (directMatch) {
      resolved.push(directMatch);
    }
  });

  return resolved.length > 0 ? resolved : pluginItems;
};

export const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  position = 'top',
  sticky = false,
  floating = false,
  readonly = false,
  showMoreOptions = true,
  itemsOverride,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openInlineMenu, setOpenInlineMenu] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const storedSelectionRef = useRef<Range | null>(null);
  const storedExpandedSelectionRef = useRef<Range | null>(null);
  const buttonRefs = useRef<Record<string, React.RefObject<HTMLButtonElement>>>({});
  const itemWidthCacheRef = useRef<number[]>([]);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const items = useMemo(
    () => resolveToolbarItems(editor.pluginManager.getToolbarItems(), itemsOverride),
    [editor, itemsOverride],
  );

  const updateStoredSelection = (range: Range | null) => {
    storedSelectionRef.current = range;
    if (range && !range.collapsed) {
      storedExpandedSelectionRef.current = range;
    }
  };

  const getEditorContentElement = (): HTMLElement | null => {
    const editorContainer = toolbarRef.current?.closest('[data-editora-editor]');
    return (editorContainer?.querySelector('.rte-content') as HTMLElement) || null;
  };

  const setActiveCommandEditorContext = () => {
    if (typeof window === 'undefined') return;
    const editorContainer = toolbarRef.current?.closest('[data-editora-editor]') as HTMLElement | null;
    (window as any).__editoraCommandEditorRoot = editorContainer || null;
  };

  const getSelectionInEditor = (): Range | null => {
    const contentEl = getEditorContentElement();
    if (!contentEl) return null;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    if (!contentEl.contains(range.commonAncestorContainer)) return null;

    return range.cloneRange();
  };

  const captureSelectionFromEditor = () => {
    const range = getSelectionInEditor();
    if (range) {
      updateStoredSelection(range);
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      captureSelectionFromEditor();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const shouldPreferExpandedSelection = (command: string): boolean => {
    return [
      'toggleBold',
      'toggleItalic',
      'toggleUnderline',
      'toggleStrikethrough',
      'openTextColorPicker',
      'openBackgroundColorPicker',
      'openLinkDialog',
      'removeLink',
      'toggleCode',
    ].includes(command);
  };

  const restoreSelectionToEditor = (preferExpanded = false) => {
    const contentEl = getEditorContentElement();
    if (!contentEl) return false;

    const selection = window.getSelection();
    if (!selection) return false;

    const hasCurrentSelectionInEditor =
      selection.rangeCount > 0 &&
      contentEl.contains(selection.getRangeAt(0).commonAncestorContainer);

    const candidateRange = preferExpanded
      ? (storedExpandedSelectionRef.current || storedSelectionRef.current)
      : (storedSelectionRef.current || storedExpandedSelectionRef.current);

    if (preferExpanded && candidateRange && candidateRange.collapsed) {
      return false;
    }

    if (candidateRange && contentEl.contains(candidateRange.commonAncestorContainer)) {
      try {
        contentEl.focus({ preventScroll: true });
        selection.removeAllRanges();
        selection.addRange(candidateRange);
        return true;
      } catch {
        // Ignore stale ranges and fallback to caret placement below.
      }
    }

    return hasCurrentSelectionInEditor;
  };

  // Calculate visible items based on available space
  useEffect(() => {
    if (!showMoreOptions) {
      setVisibleCount(null);
      setShowMoreMenu(false);
      itemWidthCacheRef.current = [];
      return;
    }

    let rafId: number | null = null;

    const calculateVisibleItems = () => {
      if (!toolbarRef.current || !itemsContainerRef.current) return;

      const toolbarWidth = toolbarRef.current.clientWidth;
      const padding = 16; // 8px on each side
      const moreButtonWidth = 40; // Width of more button
      const gap = 4; // Gap between items
      const availableWidth = Math.max(0, toolbarWidth - padding - moreButtonWidth - gap);

      let accumulatedWidth = 0;
      let count = 0;

      const itemElements = itemsContainerRef.current.children;
      for (let i = 0; i < itemElements.length; i++) {
        const element = itemElements[i] as HTMLElement;
        const measuredWidth = element.getBoundingClientRect().width;

        // Cache the non-zero width so hidden items keep a stable width estimate.
        if (measuredWidth > 0) {
          itemWidthCacheRef.current[i] = measuredWidth;
        }

        const stableWidth = itemWidthCacheRef.current[i] ?? measuredWidth;
        const itemWidth = (stableWidth > 0 ? stableWidth : 40) + gap;

        if (accumulatedWidth + itemWidth <= availableWidth) {
          accumulatedWidth += itemWidth;
          count++;
        } else {
          break;
        }
      }

      // Ensure at least one item is visible
      const nextVisibleCount = Math.max(1, Math.min(count, itemElements.length));
      setVisibleCount((prev) => (prev === nextVisibleCount ? prev : nextVisibleCount));
    };

    const scheduleCalculation = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(calculateVisibleItems);
    };

    itemWidthCacheRef.current = [];
    scheduleCalculation();

    // Recalculate on window/container resize
    const resizeObserver = new ResizeObserver(() => {
      scheduleCalculation();
    });
    
    if (toolbarRef.current) {
      resizeObserver.observe(toolbarRef.current);
    }

    if (itemsContainerRef.current) {
      resizeObserver.observe(itemsContainerRef.current);
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
    };
  }, [items.length, showMoreOptions]);

  // Auto-close expanded row when all items fit again.
  useEffect(() => {
    if (showMoreMenu && visibleCount !== null && visibleCount >= items.length) {
      setShowMoreMenu(false);
    }
  }, [showMoreMenu, visibleCount, items.length]);

  const getButtonRef = (command: string) => {
    if (!buttonRefs.current[command]) {
      buttonRefs.current[command] = React.createRef<HTMLButtonElement>();
    }
    return buttonRefs.current[command];
  };

  const handleCommand = (command: string, value?: string) => {
    if (readonly) return;
    setActiveCommandEditorContext();
    const skipSelectionRestore =
      command === 'addComment' || command === 'toggleComments';
    if (!skipSelectionRestore) {
      restoreSelectionToEditor(shouldPreferExpandedSelection(command));
    }

    const nativeInlineCommandMap: Record<string, string> = {
      toggleBold: 'bold',
      toggleItalic: 'italic',
      toggleUnderline: 'underline',
    };

    const nativeCommand = nativeInlineCommandMap[command];
    if (nativeCommand) {
      document.execCommand(nativeCommand, false);
      setOpenDropdown(null);
      return;
    }

    // Use global command execution
    if (typeof window !== 'undefined' && (window as any).executeEditorCommand) {
      (window as any).executeEditorCommand(command, value);
    }
    setOpenDropdown(null);
  };

  const handleDropdownOpen = (command: string) => {
    if (readonly) return;
    // Store current selection when opening dropdown
    captureSelectionFromEditor();
    setOpenDropdown(openDropdown === command ? null : command);
  };

  const handleInlineMenuOpen = (command: string) => {
    if (readonly) return;
    // Store current selection when opening inline menu
    captureSelectionFromEditor();
    setOpenInlineMenu(openInlineMenu === command ? null : command);
    setOpenDropdown(null); // Close any open dropdowns
  };

  const handleInlineMenuSelect = (command: string, value: string) => {
    if (readonly) return;
    restoreSelectionToEditor();

    handleCommand(command, value);
    updateStoredSelection(null);
    storedExpandedSelectionRef.current = null;
    setOpenInlineMenu(null);
  };

  const renderIcon = (iconName?: string, command?: string) => {
    // Handle inline SVG strings from plugins
    if (iconName && iconName.startsWith('<svg') && iconName.endsWith('</svg>')) {
      return <span dangerouslySetInnerHTML={{ __html: iconName }} />;
    }

    // Handle single character icons (B, I, U, S, H)
    if (iconName && iconName.length === 1 && /^[BIUSH]$/.test(iconName)) {
      return <span style={{ fontWeight: 'bold', fontSize: '14px', lineHeight: '1' }}>{iconName}</span>;
    }

    // Final fallback
    return iconName || '⚪';
  };

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
  const hasOverflow = showMoreOptions && visibleCount !== null && visibleCount < items.length;

  const handleToolbarMouseDownCapture = (e: React.MouseEvent) => {
    if (readonly) return;
    const target = e.target as HTMLElement;
    const isToolbarAction = target.closest('.rte-toolbar-button, .rte-toolbar-dropdown-item, .rte-toolbar-more-button');
    if (!isToolbarAction) return;

    setActiveCommandEditorContext();
    captureSelectionFromEditor();
    e.preventDefault();
  };

  const renderToolbarItems = (items: ToolbarItemLike[]) => {
    return items.map((item, idx) => {
      const itemCommand = item.command || '';
      return (
        <div
          key={idx}
          className="rte-toolbar-item"
          style={{
            display:
              showMoreOptions && visibleCount !== null && idx >= visibleCount
                ? "none"
                : "flex",
          }}
        >
          {item.type === "separator" ? (
            <div className="rte-toolbar-separator" aria-hidden="true" />
          ) : item.type === "dropdown" ? (
            <div className="rte-toolbar-dropdown">
                <button
                  className="rte-toolbar-button"
                  data-command={itemCommand}
                  data-active="false"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    captureSelectionFromEditor();
                  }}
                  onClick={() => handleDropdownOpen(itemCommand)}
                  disabled={readonly}
                >
                  {item.label} ▼
                </button>
              {openDropdown === itemCommand && (
                <div className="rte-toolbar-dropdown-menu">
                  {item.options?.map((opt) => (
                    <div
                      key={opt.value}
                      className="rte-toolbar-dropdown-item"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleCommand(itemCommand, opt.value)}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : item.type === "inline-menu" ? (
            <button
              ref={getButtonRef(itemCommand)}
              className="rte-toolbar-button"
              data-command={itemCommand}
              data-active="false"
              onMouseDown={(e) => {
                e.preventDefault();
                captureSelectionFromEditor();
              }}
              onClick={() => handleInlineMenuOpen(itemCommand)}
              disabled={readonly}
              title={item.label}
            >
              {renderIcon(item.icon, itemCommand)}
            </button>
          ) : item.type === "input" ? (
            <input
              type="text"
              className={`rte-toolbar-input ${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              placeholder={item.placeholder}
              onChange={(e) => handleCommand(itemCommand, e.target.value)}
              disabled={readonly}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCommand(
                    itemCommand,
                    (e.target as HTMLInputElement).value,
                  );
                }
              }}
              title={item.label}
            />
          ) : item.type === "group" ? (
            <div
              className={`rte-toolbar-group-button ${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              title={`${item.label}`}
            >
              <div
                className={`rte-toolbar-group-items ${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {renderToolbarItems(item.items || [])}
              </div>
            </div>
          ) : (
            <button
              className="rte-toolbar-button"
              data-command={itemCommand}
              data-active="false"
              onMouseDown={(e) => {
                e.preventDefault();
                captureSelectionFromEditor();
              }}
              onClick={() => handleCommand(itemCommand)}
              disabled={readonly}
              title={item.label}
            >
              {renderIcon(item.icon, itemCommand)}
            </button>
          )}
        </div>
      );
    });
  };
  return (
    <>
      <div
        className="rte-toolbar-wrapper"
        style={toolbarStyle}
        onMouseDownCapture={handleToolbarMouseDownCapture}
      >
        {/* Main toolbar row */}
        <div className="rte-toolbar" ref={toolbarRef}>
          <div
            className="rte-toolbar-items-container"
            ref={itemsContainerRef}
            style={showMoreOptions ? undefined : { flexWrap: "wrap" }}
          >
            {renderToolbarItems(items)}
          </div>

          {/* More button - only show if there are hidden items */}
          {hasOverflow && (
            <button
              ref={moreButtonRef}
              className={`rte-toolbar-more-button ${showMoreMenu ? "active" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                captureSelectionFromEditor();
              }}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              disabled={readonly}
              title="Show more options"
              aria-label="More toolbar options"
            >
              ☰
            </button>
          )}
        </div>

        {/* Hidden items expansion row - slides down inline */}
        {hasOverflow && (
          <div
            className={`rte-toolbar-expanded-row ${showMoreMenu ? "show" : ""}`}
          >
            {items.map(
              (item, idx) => {
                if (idx < (visibleCount || 0)) return null;
                const itemCommand = item.command || '';
                return (
                  <div key={idx} className="rte-toolbar-item">
                    {item.type === "separator" ? (
                      <div className="rte-toolbar-separator" aria-hidden="true" />
                    ) : item.type === "dropdown" ? (
                      <div className="rte-toolbar-dropdown">
                        <button
                          className="rte-toolbar-button"
                          data-command={itemCommand}
                          data-active="false"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            captureSelectionFromEditor();
                          }}
                          onClick={() => handleDropdownOpen(itemCommand)}
                          disabled={readonly}
                        >
                          {item.label} ▼
                        </button>
                        {openDropdown === itemCommand && (
                          <div className="rte-toolbar-dropdown-menu">
                            {item.options?.map((opt) => (
                              <div
                                key={opt.value}
                                className="rte-toolbar-dropdown-item"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleCommand(itemCommand, opt.value)}
                              >
                                {opt.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : item.type === "inline-menu" ? (
                      <button
                        ref={getButtonRef(itemCommand)}
                        className="rte-toolbar-button"
                        data-command={itemCommand}
                        data-active="false"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          captureSelectionFromEditor();
                        }}
                        onClick={() => handleInlineMenuOpen(itemCommand)}
                        disabled={readonly}
                        title={item.label}
                      >
                        {renderIcon(item.icon, itemCommand)}
                      </button>
                    ) : item.type === "input" ? (
                      <input
                        type="text"
                        className="rte-toolbar-input"
                        placeholder={item.placeholder}
                        onChange={(e) => handleCommand(itemCommand, e.target.value)}
                        disabled={readonly}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleCommand(
                              itemCommand,
                              (e.target as HTMLInputElement).value,
                            );
                          }
                        }}
                        title={item.label}
                      />
                    ) : (
                      <button
                        className="rte-toolbar-button"
                        data-command={itemCommand}
                        data-active="false"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          captureSelectionFromEditor();
                        }}
                        onClick={() => handleCommand(itemCommand)}
                        disabled={readonly}
                        title={item.label}
                      >
                        {renderIcon(item.icon, itemCommand)}
                      </button>
                    )}
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* Render all inline menus outside toolbar items to prevent width issues */}
      {items.map((item) => {
        if (item.type === "inline-menu") {
          const itemCommand = item.command || '';
          return (
            <InlineMenu
              key={`menu-${itemCommand || 'unknown'}`}
              isOpen={openInlineMenu === itemCommand}
              options={item.options || []}
              onSelect={(value) => handleInlineMenuSelect(itemCommand, value)}
              onClose={() => setOpenInlineMenu(null)}
              anchorRef={getButtonRef(itemCommand)}
            />
          );
        }
        return null;
      })}
    </>
  );
};

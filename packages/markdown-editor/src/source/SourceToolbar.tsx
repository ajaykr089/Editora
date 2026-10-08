import React, { useEffect, useRef, useState } from 'react';
import { ICONS, type IconName } from './icons';
import { fillLabel, type MarkdownEditorLabels } from '../components/labels';
import type { MarkdownCommand } from './commands';

export type ToolbarCommand = MarkdownCommand | 'undo' | 'redo';

interface ButtonSpec {
  command: ToolbarCommand;
  icon: IconName;
  /** Key combination, with `Mod` standing for Cmd on macOS and Ctrl elsewhere. */
  shortcut?: string;
}

// The same order as the rich editor's toolbar: history, heading, text, link and image, lists, quote, code, then
// the blocks that are inserted (table, rule).
const BEFORE_HEADING: ButtonSpec[] = [
  { command: 'undo', icon: 'undo', shortcut: 'Mod+Z' },
  { command: 'redo', icon: 'redo', shortcut: 'Mod+Shift+Z' },
];
const AFTER_HEADING: ButtonSpec[] = [
  { command: 'bold', icon: 'bold', shortcut: 'Mod+B' },
  { command: 'italic', icon: 'italic', shortcut: 'Mod+I' },
  { command: 'strikethrough', icon: 'strikethrough', shortcut: 'Mod+Shift+X' },
  { command: 'link', icon: 'link', shortcut: 'Mod+K' },
  { command: 'image', icon: 'image' },
  { command: 'bulletList', icon: 'bulletList' },
  { command: 'orderedList', icon: 'orderedList' },
  { command: 'taskList', icon: 'taskList' },
  { command: 'quote', icon: 'quote' },
  { command: 'inlineCode', icon: 'inlineCode', shortcut: 'Mod+E' },
  { command: 'codeBlock', icon: 'codeBlock' },
  { command: 'table', icon: 'table' },
  { command: 'horizontalRule', icon: 'horizontalRule' },
];

// The short forms are the glyphs on the button; the long forms are in the labels.
const HEADINGS = [
  { level: 0, short: 'P' },
  { level: 1, short: 'H1' },
  { level: 2, short: 'H2' },
  { level: 3, short: 'H3' },
  { level: 4, short: 'H4' },
  { level: 5, short: 'H5' },
  { level: 6, short: 'H6' },
];

const isMac = (): boolean => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');

const describeShortcut = (shortcut: string): string =>
  shortcut.replace('Mod', isMac() ? '⌘' : 'Ctrl').replace(/\+/g, isMac() ? '' : '+');

export interface SourceToolbarProps {
  labels: MarkdownEditorLabels;
  disabled: boolean;
  /** Heading level of the line the caret is on, 0 for none. */
  headingLevel: number;
  onCommand: (command: ToolbarCommand) => void;
  onHeading: (level: number) => void;
}

export const SourceToolbar: React.FC<SourceToolbarProps> = ({ labels, disabled, headingLevel, onCommand, onHeading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openedByKeyboard = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);

  // Opened from the keyboard, the menu takes focus (on the current level); opened with the mouse it
  // does not, so the text selection the heading applies to is left alone.
  useEffect(() => {
    if (menuOpen && openedByKeyboard.current) {
      menuRef.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
    }
  }, [menuOpen]);

  const buttons = () =>
    Array.from(containerRef.current?.querySelectorAll<HTMLButtonElement>('[data-md-roving]') ?? []).filter(
      (button) => !button.disabled,
    );

  // Clicking a toolbar button must not take the selection away from the text it is about to change.
  const keepSelection = (event: React.MouseEvent) => event.preventDefault();

  // A toolbar is one tab stop; the arrow keys move between its buttons.
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (menuOpen) return;
    const items = buttons();
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    let next = -1;
    if (event.key === 'ArrowRight') next = (current + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (current - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    if (next === -1) return;
    event.preventDefault();
    items[next].focus();
  };

  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = (event: PointerEvent) => {
      if (!(event.target as Element | null)?.closest('.md-heading-menu')) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', close, true);
    return () => document.removeEventListener('pointerdown', close, true);
  }, [menuOpen]);

  const rovingProps = (index: number) => ({
    'data-md-roving': '',
    tabIndex: index === focusIndex ? 0 : -1,
    onFocus: () => setFocusIndex(index),
  });

  const renderButton = (spec: ButtonSpec, index: number) => {
    const shortcut = spec.shortcut ? describeShortcut(spec.shortcut) : '';
    const label = labels.commands[spec.command];
    return (
      <div className="rte-toolbar-item" key={spec.command}>
        <button
          type="button"
          className="rte-toolbar-button"
          data-md-command={spec.command}
          aria-label={label}
          aria-keyshortcuts={spec.shortcut?.replace('Mod', 'Control')}
          title={shortcut ? `${label} (${shortcut})` : label}
          disabled={disabled}
          onMouseDown={keepSelection}
          onClick={() => onCommand(spec.command)}
          {...rovingProps(index)}
        >
          <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[spec.icon] }} />
        </button>
      </div>
    );
  };

  const headingIndex = BEFORE_HEADING.length;
  const headingName = (level: number): string => (level === 0 ? labels.paragraph : fillLabel(labels.headingN, level));
  const current = HEADINGS.find((heading) => heading.level === headingLevel) ?? HEADINGS[0];

  return (
    <div className="rte-toolbar-wrapper md-source-toolbar">
      <div className="rte-toolbar" role="toolbar" aria-label={labels.toolbar} ref={containerRef} onKeyDown={handleKeyDown}>
        <div className="rte-toolbar-items-container" style={{ flexWrap: 'wrap' }}>
          {BEFORE_HEADING.map((spec, i) => renderButton(spec, i))}

          <div className="rte-toolbar-item">
            <div className="rte-toolbar-dropdown md-heading-menu">
              <button
                type="button"
                ref={headingButtonRef}
                className="rte-toolbar-button"
                data-md-command="heading"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label={fillLabel(labels.headingLevel, headingName(current.level))}
                title={labels.heading}
                disabled={disabled}
                onMouseDown={keepSelection}
                onClick={(event) => {
                  // A click with no pointer position is the keyboard (Enter or Space) activating the button.
                  openedByKeyboard.current = event.detail === 0;
                  setMenuOpen((open) => !open);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    openedByKeyboard.current = true;
                    setMenuOpen(true);
                  } else if (event.key === 'Escape') {
                    setMenuOpen(false);
                  }
                }}
                {...rovingProps(headingIndex)}
              >
                {current.short} ▼
              </button>
              {menuOpen && (
                <div
                  className="rte-toolbar-dropdown-menu"
                  ref={menuRef}
                  role="menu"
                  aria-label={labels.headingMenu}
                  onKeyDown={(event) => {
                    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitemradio"]'));
                    const at = items.indexOf(document.activeElement as HTMLElement);
                    if (event.key === 'ArrowDown') items[(at + 1) % items.length]?.focus();
                    else if (event.key === 'ArrowUp') items[(at - 1 + items.length) % items.length]?.focus();
                    else if (event.key === 'Escape' || event.key === 'Tab') {
                      setMenuOpen(false);
                      headingButtonRef.current?.focus();
                    } else return;
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                >
                  {HEADINGS.map((heading) => (
                    <button
                      type="button"
                      key={heading.level}
                      role="menuitemradio"
                      aria-checked={heading.level === headingLevel}
                      aria-label={headingName(heading.level)}
                      className="rte-toolbar-dropdown-item"
                      data-active={heading.level === headingLevel ? 'true' : 'false'}
                      onMouseDown={keepSelection}
                      onClick={() => {
                        setMenuOpen(false);
                        onHeading(heading.level);
                      }}
                    >
                      {heading.short}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {AFTER_HEADING.map((spec, i) => renderButton(spec, headingIndex + 1 + i))}
        </div>
      </div>
    </div>
  );
};

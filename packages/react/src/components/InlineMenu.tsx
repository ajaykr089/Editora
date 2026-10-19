import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface InlineMenuOption {
  label: string;
  value: string;
}

export interface InlineMenuProps {
  isOpen: boolean;
  options: InlineMenuOption[];
  onSelect: (value: string) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  className?: string;
  /** What the menu is for; it names the menu for assistive technology. */
  label?: string;
  /** Set when the menu was opened from the keyboard: the focus then goes into it, on this item. */
  focusRequest?: 'first' | 'last' | null;
}

export const InlineMenu: React.FC<InlineMenuProps> = ({
  isOpen,
  options,
  onSelect,
  onClose,
  anchorRef,
  className = '',
  label,
  focusRequest = null
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const focusedOnOpenRef = useRef(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const calculatePosition = () => {
    if (!isOpen || !anchorRef.current) return;

    setIsDarkTheme(
      Boolean(anchorRef.current.closest('[data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark'))
    );

    const anchorRect = anchorRef.current.getBoundingClientRect();
    const menuRect = menuRef.current?.getBoundingClientRect();
    const menuWidth = menuRect?.width || 120;
    const menuHeight = menuRect?.height || options.length * 36;
    const margin = 8;
    const gap = 4;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = anchorRect.bottom + gap;
    let left = anchorRect.left;

    if (left + menuWidth > viewportWidth - margin) {
      left = viewportWidth - menuWidth - margin;
    }
    if (left < margin) {
      left = margin;
    }

    if (top + menuHeight > viewportHeight - margin) {
      top = anchorRect.top - menuHeight - gap;
    }
    if (top < margin) {
      top = margin;
    }

    setPosition({ top, left });
  };

  useLayoutEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }

    calculatePosition();
    const rafId = window.requestAnimationFrame(calculatePosition);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [isOpen, options.length, anchorRef]);

  const menuItems = (): HTMLElement[] =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

  // An element that is not visible cannot take focus, so wait until the menu has been placed.
  useEffect(() => {
    if (!isOpen) {
      focusedOnOpenRef.current = false;
      return;
    }
    if (!position || !focusRequest || focusedOnOpenRef.current) return;
    focusedOnOpenRef.current = true;
    const items = menuItems();
    (focusRequest === 'last' ? items[items.length - 1] : items[0])?.focus();
  }, [isOpen, position, focusRequest]);

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = menuItems();
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    const move = (to: number) => {
      event.preventDefault();
      items[(to + items.length) % items.length].focus();
    };

    switch (event.key) {
      case 'ArrowDown':
        return move(index + 1);
      case 'ArrowUp':
        return move(index < 0 ? items.length - 1 : index - 1);
      case 'Home':
        return move(0);
      case 'End':
        return move(items.length - 1);
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (index >= 0) items[index].click();
        return;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        onClose();
        anchorRef.current?.focus();
        return;
      case 'Tab':
        onClose();
        return;
      default:
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleReposition = () => {
      calculatePosition();
    };

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isOpen, options.length, anchorRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`rte-inline-menu ${isDarkTheme ? 'rte-inline-menu-theme-dark' : ''} ${className}`}
      role="menu"
      aria-label={label}
      onKeyDown={handleMenuKeyDown}
      style={{
        top: position?.top ?? -9999,
        left: position?.left ?? -9999,
        visibility: position ? 'visible' : 'hidden'
      }}
    >
      {options.map((option) => (
        <div
          key={option.value}
          className="rte-inline-menu-item"
          role="menuitem"
          tabIndex={-1}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() => {
            onSelect(option.value);
            onClose();
          }}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

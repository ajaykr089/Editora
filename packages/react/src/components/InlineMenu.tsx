import React, { useEffect, useRef, useState } from 'react';

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
}

export const InlineMenu: React.FC<InlineMenuProps> = ({
  isOpen,
  options,
  onSelect,
  onClose,
  anchorRef,
  className = ''
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();

      // Use estimated menu dimensions since menu might not be rendered yet
      const estimatedMenuWidth = 120; // minWidth from style
      const estimatedMenuHeight = options.length * 36; // approximate height per item

      // Position the menu below the anchor element
      let top = anchorRect.bottom + 4;
      let left = anchorRect.left;

      // Adjust if menu goes off screen
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left + estimatedMenuWidth > viewportWidth) {
        left = viewportWidth - estimatedMenuWidth - 8;
      }

      if (top + estimatedMenuHeight > viewportHeight) {
        top = anchorRect.top - estimatedMenuHeight - 4;
      }

      setPosition({ top, left });
    }
  }, [isOpen, anchorRef, options.length]);

  // Update position after menu is rendered for more precise positioning
  useEffect(() => {
    if (isOpen && anchorRef.current && menuRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();

      let top = anchorRect.bottom + 4;
      let left = anchorRect.left;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left + menuRect.width > viewportWidth) {
        left = viewportWidth - menuRect.width - 8;
      }

      if (top + menuRect.height > viewportHeight) {
        top = anchorRect.top - menuRect.height - 4;
      }

      setPosition({ top, left });
    }
  }, [isOpen]);

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
      className={`rte-inline-menu ${className}`}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 1000,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        minWidth: '120px',
        maxWidth: '200px'
      }}
    >
      {options.map((option) => (
        <div
          key={option.value}
          className="rte-inline-menu-item"
          onClick={() => {
            onSelect(option.value);
            onClose();
          }}
          style={{
            padding: '8px 12px',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

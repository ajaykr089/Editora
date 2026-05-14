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
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const calculatePosition = () => {
    if (!isOpen || !anchorRef.current) return;

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
      className={`rte-inline-menu ${className}`}
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

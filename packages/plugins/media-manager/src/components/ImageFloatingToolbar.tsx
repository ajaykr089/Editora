import React, { useState, useEffect } from 'react';
import './ImageFloatingToolbar.css';

interface ImageFloatingToolbarProps {
  imageElement: HTMLImageElement;
  onEdit: () => void;
  onRemove: () => void;
  onClose: () => void;
}

export const ImageFloatingToolbar: React.FC<ImageFloatingToolbarProps> = ({
  imageElement,
  onEdit,
  onRemove,
  onClose,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  const normalizeLink = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (
      /^https?:\/\//i.test(trimmed) ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('mailto:') ||
      trimmed.startsWith('tel:')
    ) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const handleLinkClick = () => {
    const existingLink = imageElement.closest('a');
    const currentHref = existingLink?.getAttribute('href') || '';
    const nextHref = window.prompt('Enter link URL (leave blank to remove)', currentHref);

    if (nextHref === null) return;

    const normalized = normalizeLink(nextHref);

    if (!normalized) {
      if (existingLink) {
        existingLink.replaceWith(imageElement);
      }
    } else if (existingLink) {
      existingLink.setAttribute('href', normalized);
      existingLink.setAttribute('target', '_blank');
      existingLink.setAttribute('rel', 'noopener noreferrer');
    } else {
      const link = document.createElement('a');
      link.setAttribute('href', normalized);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      imageElement.replaceWith(link);
      link.appendChild(imageElement);
    }

    const inputEvent = new Event('input', { bubbles: true });
    imageElement.dispatchEvent(inputEvent);
  };

  useEffect(() => {
    const updatePosition = () => {
      const rect = imageElement.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      // Position toolbar above the image
      const top = rect.top + scrollTop - 50;
      const left = rect.left + scrollLeft + rect.width / 2 - 100; // Center toolbar

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        if (!imageElement.contains(e.target as Node)) {
          onClose();
        }
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [imageElement, onClose]);

  return (
    <div
      ref={toolbarRef}
      className="image-floating-toolbar"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <button className="toolbar-button toolbar-edit" onClick={onEdit} title="Edit image">
        ✏️ Edit
      </button>
      <button className="toolbar-button toolbar-link" onClick={handleLinkClick} title="Link">
        🔗
      </button>
      <button className="toolbar-button toolbar-remove" onClick={onRemove} title="Remove image">
        🗑️ Remove
      </button>
    </div>
  );
};

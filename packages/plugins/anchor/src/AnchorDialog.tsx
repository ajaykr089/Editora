import React, { useState, useEffect } from 'react';
import './AnchorDialog.css';

interface AnchorDialogProps {
  isOpen: boolean;
  currentId?: string;
  mode: 'add' | 'edit';
  onSave: (id: string) => void;
  onCancel: () => void;
}

/**
 * AnchorDialog Component
 *
 * Dialog for adding or editing anchor IDs with validation.
 * Prevents duplicate IDs and enforces URL-safe characters.
 */
export const AnchorDialog: React.FC<AnchorDialogProps> = ({
  isOpen,
  currentId = '',
  mode,
  onSave,
  onCancel
}) => {
  const [anchorId, setAnchorId] = useState(currentId);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setAnchorId(currentId);
    setError('');
    setTouched(false);
  }, [currentId, isOpen]);

  const sanitizeId = (id: string): string => {
    return id
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\-_]/g, '-')
      .replace(/^[^a-z_]/, `a-${Math.random().toString(36).substr(2, 5)}`)
      .substring(0, 256);
  };

  const validateId = (id: string): boolean => {
    if (!id || id.trim().length === 0) {
      setError('Anchor ID cannot be empty');
      return false;
    }

    if (id.length > 256) {
      setError('Anchor ID must be less than 256 characters');
      return false;
    }

    if (!/^[a-z_]/.test(id)) {
      setError('Anchor ID must start with a letter or underscore');
      return false;
    }

    if (!/^[a-z0-9\-_]+$/.test(id)) {
      setError('Anchor ID can only contain letters, numbers, hyphens, and underscores');
      return false;
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAnchorId(value);
    setTouched(true);

    if (value.trim()) {
      validateId(value);
    } else {
      setError('');
    }
  };

  const handleSave = () => {
    if (!validateId(anchorId)) {
      return;
    }

    onSave(anchorId);
    setAnchorId('');
    setError('');
    setTouched(false);
  };

  const handleCancel = () => {
    setAnchorId('');
    setError('');
    setTouched(false);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rte-anchor-dialog-overlay">
      <div className="rte-anchor-dialog">
        <div className="rte-anchor-dialog-header">
          <h3>{mode === 'add' ? 'Add Anchor' : 'Edit Anchor'}</h3>
          <button
            className="rte-anchor-dialog-close"
            onClick={handleCancel}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="rte-anchor-dialog-body">
          <div className="rte-anchor-dialog-field">
            <label htmlFor="anchor-id-input">Anchor ID</label>
            <input
              id="anchor-id-input"
              type="text"
              value={anchorId}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g., section-introduction"
              className={`rte-anchor-input ${error && touched ? 'error' : ''}`}
              autoFocus
            />
            {error && touched && (
              <div className="rte-anchor-error-message">{error}</div>
            )}
            <div className="rte-anchor-help-text">
              URL-safe ID (letters, numbers, hyphens, underscores). Must start with letter or underscore.
            </div>
          </div>
        </div>

        <div className="rte-anchor-dialog-footer">
          <button
            className="rte-anchor-dialog-btn rte-anchor-dialog-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="rte-anchor-dialog-btn rte-anchor-dialog-save"
            onClick={handleSave}
            disabled={!anchorId.trim()}
          >
            {mode === 'add' ? 'Add Anchor' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

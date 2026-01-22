import React, { useState, useEffect } from 'react';

interface EmbedIframeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEmbed: (data: { src: string; width: string; height: string; aspectRatio: string }) => void;
  initialData?: {
    src?: string;
    width?: string;
    height?: string;
    aspectRatio?: string;
  };
}

const SIZE_PRESETS = [
  { label: 'Inline Value', value: 'inline', description: 'Custom width and height' },
  { label: 'Responsive - 21x9', value: '21x9', description: 'Ultra-wide (21:9)' },
  { label: 'Responsive - 16x9', value: '16x9', description: 'Widescreen (16:9)' },
  { label: 'Responsive - 4x3', value: '4x3', description: 'Standard (4:3)' },
  { label: 'Responsive - 1x1', value: '1x1', description: 'Square (1:1)' },
];

export const EmbedIframeDialog: React.FC<EmbedIframeDialogProps> = ({
  isOpen,
  onClose,
  onEmbed,
  initialData
}) => {
  const [src, setSrc] = useState(initialData?.src || '');
  const [width, setWidth] = useState(initialData?.width || '100%');
  const [height, setHeight] = useState(initialData?.height || '400px');
  const [selectedSize, setSelectedSize] = useState(initialData?.aspectRatio || 'inline');

  useEffect(() => {
    if (initialData) {
      setSrc(initialData.src || '');
      setWidth(initialData.width || '100%');
      setHeight(initialData.height || '400px');
      setSelectedSize(initialData.aspectRatio || 'inline');
    }
  }, [initialData]);

  const handleSizeChange = (sizeValue: string) => {
    setSelectedSize(sizeValue);

    if (sizeValue === 'inline') {
      setWidth('100%');
      setHeight('400px');
    } else {
      // For responsive presets, set width to 100% and height to auto
      setWidth('100%');
      setHeight('auto');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!src.trim()) {
      alert('Please enter a source URL');
      return;
    }

    let finalWidth = width;
    let finalHeight = height;

    // Apply aspect ratio classes for responsive embeds
    if (selectedSize !== 'inline') {
      finalWidth = '100%';
      finalHeight = 'auto';
    }

    onEmbed({
      src: src.trim(),
      width: finalWidth,
      height: finalHeight,
      aspectRatio: selectedSize
    });

    onClose();
  };

  const handleCancel = () => {
    setSrc(initialData?.src || '');
    setWidth(initialData?.width || '100%');
    setHeight(initialData?.height || '400px');
    setSelectedSize(initialData?.aspectRatio || 'inline');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="rte-dialog-overlay" onClick={onClose}>
      <div className="rte-dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="rte-dialog-header">
          <h3>Embed Iframe</h3>
          <button className="rte-dialog-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="rte-dialog-body">
          {/* Source URL */}
          <div className="rte-form-group">
            <label className="rte-form-label">Source URL</label>
            <input
              type="url"
              className="rte-form-input"
              placeholder="https://example.com"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              required
            />
          </div>

          {/* Size Preset Selection */}
          <div className="rte-form-group">
            <label className="rte-form-label">Size Preset</label>
            <div className="rte-size-presets">
              {SIZE_PRESETS.map((preset) => (
                <label key={preset.value} className="rte-radio-option">
                  <input
                    type="radio"
                    name="sizePreset"
                    value={preset.value}
                    checked={selectedSize === preset.value}
                    onChange={(e) => handleSizeChange(e.target.value)}
                  />
                  <span className="rte-radio-label">
                    <strong>{preset.label}</strong>
                    <br />
                    <small>{preset.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Dimensions (only show for inline) */}
          {selectedSize === 'inline' && (
            <div className="rte-form-row">
              <div className="rte-form-group">
                <label className="rte-form-label">Width</label>
                <input
                  type="text"
                  className="rte-form-input"
                  placeholder="100%"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>
              <div className="rte-form-group">
                <label className="rte-form-label">Height</label>
                <input
                  type="text"
                  className="rte-form-input"
                  placeholder="400px"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Preview */}
          {src && (
            <div className="rte-form-group">
              <label className="rte-form-label">Preview</label>
              <div className="rte-iframe-preview">
                <iframe
                  src={src}
                  width={selectedSize === 'inline' ? width : '100%'}
                  height={selectedSize === 'inline' ? height : '200px'}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    aspectRatio: selectedSize === 'inline' ? 'auto' :
                      selectedSize === '21x9' ? '21/9' :
                      selectedSize === '16x9' ? '16/9' :
                      selectedSize === '4x3' ? '4/3' : '1/1'
                  }}
                  title="Iframe Preview"
                />
              </div>
            </div>
          )}
        </form>

        <div className="rte-dialog-footer">
          <button type="button" className="rte-btn rte-btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="rte-btn rte-btn-primary" onClick={handleSubmit}>
            Embed Iframe
          </button>
        </div>
      </div>
    </div>
  );
};

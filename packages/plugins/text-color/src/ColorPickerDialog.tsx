import React, { useState, useEffect } from 'react';

interface ColorPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  initialColor?: string;
  type: 'text' | 'background';
}

const PRESET_COLORS = [
  '#000000', '#ffffff', '#808080', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb',
  '#a52a2a', '#808000', '#000080', '#008000', '#008080', '#800000'
];

export const ColorPickerDialog: React.FC<ColorPickerDialogProps> = ({
  isOpen,
  onClose,
  onColorSelect,
  initialColor = '#000000',
  type
}) => {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [customColor, setCustomColor] = useState(initialColor);

  useEffect(() => {
    if (initialColor) {
      setSelectedColor(initialColor);
      setCustomColor(initialColor);
    }
  }, [initialColor]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    setSelectedColor(color);
  };

  const handleApply = () => {
    onColorSelect(selectedColor);
    onClose();
  };

  const handleCancel = () => {
    setSelectedColor(initialColor);
    setCustomColor(initialColor);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="rte-dialog-overlay" onClick={onClose}>
      <div className="rte-dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="rte-dialog-header">
          <h3>Choose {type === 'text' ? 'Text' : 'Background'} Color</h3>
          <button className="rte-dialog-close" onClick={onClose}>×</button>
        </div>

        <div className="rte-dialog-body">
          {/* Current Color Preview */}
          <div className="rte-color-preview">
            <div
              className="rte-color-sample"
              style={{
                backgroundColor: selectedColor,
                border: selectedColor === '#ffffff' ? '1px solid #ccc' : 'none'
              }}
            />
            <span className="rte-color-value">{selectedColor.toUpperCase()}</span>
          </div>

          {/* Preset Colors */}
          <div className="rte-color-section">
            <label className="rte-color-label">Preset Colors</label>
            <div className="rte-color-palette">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className={`rte-color-swatch ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  title={color.toUpperCase()}
                />
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div className="rte-color-section">
            <label className="rte-color-label">Custom Color</label>
            <div className="rte-custom-color">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="rte-color-input"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  const color = e.target.value;
                  if (/^#[0-9A-F]{6}$/i.test(color)) {
                    handleColorSelect(color);
                  }
                }}
                placeholder="#000000"
                className="rte-color-text-input"
                pattern="^#[0-9A-F]{6}$"
              />
            </div>
          </div>
        </div>

        <div className="rte-dialog-footer">
          <button type="button" className="rte-btn rte-btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="rte-btn rte-btn-primary" onClick={handleApply}>
            Apply Color
          </button>
        </div>
      </div>
    </div>
  );
};

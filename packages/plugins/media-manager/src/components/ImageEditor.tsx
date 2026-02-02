import React, { useState, useRef, useEffect } from 'react';
import { ImageManipulator } from '../utils/ImageManipulator';
import './ImageEditor.css';

interface ImageEditorProps {
  imageUrl: string;
  onSave: (transformedUrl: string) => void;
  onCancel: () => void;
}

interface Transform {
  crop?: { x: number; y: number; width: number; height: number; aspectRatio?: number };
  resize?: { width?: number; height?: number; maintainAspect?: boolean };
  rotate?: { degrees: number };
  flip?: { horizontal?: boolean; vertical?: boolean };
  compress?: { quality: number; format?: 'jpeg' | 'png' | 'webp' };
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [transform, setTransform] = useState<Transform>({
    compress: { quality: 0.9, format: 'jpeg' },
  });
  const [cropMode, setCropMode] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [quality, setQuality] = useState(90);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const parseDimension = (value: string, fallback: number) => {
    const num = parseInt(value, 10);
    if (Number.isNaN(num)) return Math.max(10, fallback);
    return Math.max(10, num);
  };

  // Load image
  useEffect(() => {
    const loadImage = async () => {
      try {
        const img = await ImageManipulator.loadImage(imageUrl);
        setImage(img);
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setWidthInput(String(img.naturalWidth));
        setHeightInput(String(img.naturalHeight));
        setCropBox({ x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight });
      } catch (error) {
        alert('Failed to load image');
        onCancel();
      }
    };
    loadImage();
  }, [imageUrl, onCancel]);

  // Draw preview
  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);

    if (flipH) ctx.scale(-1, 1);
    if (flipV) ctx.scale(1, -1);

    ctx.rotate((rotation * Math.PI) / 180);

    // Draw image centered
    ctx.drawImage(image, -width / 2, -height / 2, width, height);

    ctx.restore();

    // Draw crop overlay if in crop mode
    if (cropMode) {
      ctx.strokeStyle = 'rgba(0, 150, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(cropBox.x, cropBox.y, cropBox.width, cropBox.height);

      // Draw handles
      const handleSize = 6;
      ctx.fillStyle = '#0096ff';
      // Top-left
      ctx.fillRect(cropBox.x - handleSize / 2, cropBox.y - handleSize / 2, handleSize, handleSize);
      // Top-right
      ctx.fillRect(cropBox.x + cropBox.width - handleSize / 2, cropBox.y - handleSize / 2, handleSize, handleSize);
      // Bottom-left
      ctx.fillRect(cropBox.x - handleSize / 2, cropBox.y + cropBox.height - handleSize / 2, handleSize, handleSize);
      // Bottom-right
      ctx.fillRect(
        cropBox.x + cropBox.width - handleSize / 2,
        cropBox.y + cropBox.height - handleSize / 2,
        handleSize,
        handleSize
      );
    }
  }, [image, width, height, rotation, flipH, flipV, cropMode, cropBox]);

  const handleRotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    if (direction === 'horizontal') {
      setFlipH(!flipH);
    } else {
      setFlipV(!flipV);
    }
  };

  const handleSave = async () => {
    if (!canvasRef.current || !image) return;

    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL(`image/${transform.compress?.format || 'jpeg'}`, quality / 100);
      onSave(dataUrl);
    } catch (error) {
      alert('Failed to process image');
    }
  };

  const handleCropChange = (key: keyof typeof cropBox, value: number) => {
    setCropBox((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="image-editor">
      <div className="image-editor-header">
        <h3>Edit Image</h3>
        <button className="image-editor-close" onClick={onCancel}>
          ×
        </button>
      </div>

      <div className="image-editor-body">
        <div className="editor-canvas-wrapper" ref={canvasContainerRef}>
          <canvas ref={canvasRef} className="editor-canvas" />
        </div>

        <div className="editor-controls">
          {/* Resize Controls */}
          <div className="control-group">
            <label>Dimensions</label>
            <div className="control-inputs">
              <div>
                <label>Width:</label>
                <input
                  type="number"
                  value={widthInput}
                  onChange={(e) => setWidthInput(e.target.value)}
                  onBlur={() => {
                    const parsed = parseDimension(widthInput, width);
                    setWidth(parsed);
                    setWidthInput(String(parsed));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const parsed = parseDimension(widthInput, width);
                      setWidth(parsed);
                      setWidthInput(String(parsed));
                    }
                  }}
                  min="10"
                  step="1"
                />
                <span>px</span>
              </div>
              <div>
                <label>Height:</label>
                <input
                  type="number"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  onBlur={() => {
                    const parsed = parseDimension(heightInput, height);
                    setHeight(parsed);
                    setHeightInput(String(parsed));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const parsed = parseDimension(heightInput, height);
                      setHeight(parsed);
                      setHeightInput(String(parsed));
                    }
                  }}
                  min="10"
                  step="1"
                />
                <span>px</span>
              </div>
            </div>
          </div>

          {/* Rotation Controls */}
          <div className="control-group">
            <label>Rotation: {rotation}°</label>
            <div className="button-group">
              <button onClick={() => handleRotate(90)} title="Rotate 90°">
                ↻ 90°
              </button>
              <button onClick={() => handleRotate(180)} title="Rotate 180°">
                ↻ 180°
              </button>
              <button onClick={() => handleRotate(270)} title="Rotate 270°">
                ↻ 270°
              </button>
              <button onClick={() => setRotation(0)} title="Reset rotation">
                ↺ Reset
              </button>
            </div>
          </div>

          {/* Flip Controls */}
          <div className="control-group">
            <label>Flip</label>
            <div className="button-group">
              <button onClick={() => handleFlip('horizontal')} className={flipH ? 'active' : ''}>
                🔀 Horizontal
              </button>
              <button onClick={() => handleFlip('vertical')} className={flipV ? 'active' : ''}>
                ⇅ Vertical
              </button>
            </div>
          </div>

          {/* Quality/Compression */}
          <div className="control-group">
            <label>Quality: {quality}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="slider"
            />
          </div>

          {/* Format Selection */}
          <div className="control-group">
            <label>Format</label>
            <div className="button-group">
              <button
                onClick={() => setTransform((prev) => ({ 
                  ...prev, 
                  compress: { quality: quality / 100, format: 'jpeg' } 
                }))}
                className={transform.compress?.format === 'jpeg' ? 'active' : ''}
              >
                JPEG
              </button>
              <button
                onClick={() => setTransform((prev) => ({ 
                  ...prev, 
                  compress: { quality: quality / 100, format: 'png' } 
                }))}
                className={transform.compress?.format === 'png' ? 'active' : ''}
              >
                PNG
              </button>
              <button
                onClick={() => setTransform((prev) => ({ 
                  ...prev, 
                  compress: { quality: quality / 100, format: 'webp' } 
                }))}
                className={transform.compress?.format === 'webp' ? 'active' : ''}
              >
                WebP
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="image-editor-footer">
        <button className="editor-button-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button className="editor-button-save" onClick={handleSave}>
          Save & Apply
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MediaManager } from '../MediaManager';
import { MediaItem, MediaManagerConfig } from '../types/media';
import { MediaValidator } from '../utils/MediaValidator';
import { ImageEditor } from './ImageEditor';
import { toast } from '@editora/toast';
import './MediaModal.css';

interface MediaModalProps {
  manager: MediaManager;
  config: MediaManagerConfig;
  type: 'image' | 'video' | 'audio';
  onClose: () => void;
}

type Tab = 'upload' | 'library' | 'url' | 'manipulation';

export const MediaModal: React.FC<MediaModalProps> = ({ manager, config, type, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [url, setUrl] = useState('');
  const [urlWidth, setUrlWidth] = useState('');
  const [urlHeight, setUrlHeight] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>(type);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseDimension = (value: string): number | undefined => {
    const num = parseInt(value, 10);
    if (Number.isNaN(num)) return undefined;
    return Math.max(10, num);
  };

  const maxFileSize = config.upload?.maxFileSize || 52428800; // 50MB default
  const allowedTypes = config.upload?.allowedTypes || [];

  useEffect(() => {
    if (activeTab === 'library' && config.library?.enabled) {
      loadLibrary();
    }
  }, [activeTab]);

  const loadLibrary = async () => {
    try {
      const response = await manager.fetchLibrary(1, 50);
      setLibrary(response.items);
    } catch (error) {
      console.error('Failed to load library:', error);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('drag-over');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over');
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('drag-over');
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file
    const validation = MediaValidator.validate(file, {
      maxSize: maxFileSize,
      allowedTypes: allowedTypes.length > 0 ? allowedTypes : undefined,
      sanitizeFilename: config.security?.sanitizeFilenames
    });

    if (!validation.valid) {
      const errorMessage = validation.errors.join('\n');
      toast.error(`Upload failed: ${validation.errors[0]}`, 4000);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + Math.random() * 40, 90));
      }, 200);

      const uploadedUrl = await manager.uploadFile(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Check if it's base64 (offline mode)
      if (uploadedUrl.startsWith('data:')) {
        toast.info('📌 Image stored as base64 (offline mode)', 3000);
      } else {
        toast.success('✅ Image uploaded successfully', 2500);
      }

      setUrl(uploadedUrl);
      setActiveTab('url');

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMsg, 4000);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleInsertFromUrl = () => {
    if (!url) return;

    const width = parseDimension(urlWidth);
    const height = parseDimension(urlHeight);

    if (type === 'image') {
      manager.insertImage({
        src: url,
        alt: selectedItem?.name || '',
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
      });
    } else {
      manager.insertVideo({
        src: url,
        controls: true,
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
      });
    }

    onClose();
  };

  const handleSelectFromLibrary = (item: MediaItem) => {
    if (type === 'image') {
      manager.insertImage({ src: item.src, alt: item.name });
    } else {
      manager.insertVideo({ src: item.src, controls: true });
    }
    onClose();
  };

  const filteredLibrary = library
    .filter(item => item.type === filterType)
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="media-modal-overlay" onClick={onClose}>
      <div className="media-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="media-modal-header">
          <h2>Insert {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <button className="media-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="media-modal-tabs">
          <button
            className={`media-tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📤 Upload
          </button>
          {config.library?.enabled && (
            <button
              className={`media-tab ${activeTab === 'library' ? 'active' : ''}`}
              onClick={() => setActiveTab('library')}
            >
              📚 Library
            </button>
          )}
          <button
            className={`media-tab ${activeTab === 'url' ? 'active' : ''}`}
            onClick={() => setActiveTab('url')}
          >
            🔗 URL
          </button>
          {config.manipulation?.crop && (
            <button
              className={`media-tab ${activeTab === 'manipulation' ? 'active' : ''}`}
              onClick={() => setActiveTab('manipulation')}
            >
              ✂️ Edit
            </button>
          )}
        </div>

        {/* Content */}
        <div className="media-modal-body">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="media-upload-section">
              <div
                className="media-dropzone"
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="media-dropzone-content">
                  <div className="media-dropzone-icon">📁</div>
                  <p className="media-dropzone-title">Drag and drop your {type} here</p>
                  <p className="media-dropzone-subtitle">or click to browse</p>
                  <p className="media-dropzone-info">
                    Max file size: {(maxFileSize / 1024 / 1024).toFixed(0)}MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'audio/*'}
                  onChange={handleFileInputChange}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </div>

              {uploading && (
                <div className="media-upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p>{Math.round(uploadProgress)}%</p>
                </div>
              )}

              <button
                className="media-upload-button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : `Choose ${type}`}
              </button>
            </div>
          )}

          {/* Library Tab */}
          {activeTab === 'library' && config.library?.enabled && (
            <div className="media-library-section">
              {config.library.searchable && (
                <div className="media-library-search">
                  <input
                    type="text"
                    placeholder="Search media..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              )}

              <div className="media-library-grid">
                {filteredLibrary.length > 0 ? (
                  filteredLibrary.map(item => (
                    <div
                      key={item.id}
                      className="media-library-item"
                      onClick={() => handleSelectFromLibrary(item)}
                    >
                      <div className="media-library-thumbnail">
                        {item.type === 'image' && (
                          <img src={item.thumbnailUrl || item.src} alt={item.name} />
                        )}
                        {item.type === 'video' && (
                          <div className="media-video-placeholder">
                            <span>🎥</span>
                          </div>
                        )}
                        {item.type === 'audio' && (
                          <div className="media-audio-placeholder">
                            <span>🎵</span>
                          </div>
                        )}
                      </div>
                      <div className="media-library-info">
                        <p className="media-library-name">{item.name}</p>
                        <p className="media-library-size">{(item.size / 1024).toFixed(0)}KB</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="media-library-empty">No media found</p>
                )}
              </div>
            </div>
          )}

          {/* URL Tab */}
          {activeTab === 'url' && (
            <div className="media-url-section">
              <div className="media-url-input-group">
                <label>URL</label>
                <input
                  type="text"
                  placeholder={`Enter ${type} URL`}
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                />
              </div>

              {type !== 'audio' && (
                <div className="media-url-dimensions">
                  <div className="media-url-input-group">
                    <label>Width (px)</label>
                    <input
                      type="number"
                      min="10"
                      step="1"
                      placeholder="Auto"
                      value={urlWidth}
                      onChange={e => setUrlWidth(e.target.value)}
                    />
                  </div>
                  <div className="media-url-input-group">
                    <label>Height (px)</label>
                    <input
                      type="number"
                      min="10"
                      step="1"
                      placeholder="Auto"
                      value={urlHeight}
                      onChange={e => setUrlHeight(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {url && (
                <div className="media-url-preview">
                  <label>Preview:</label>
                  <div className="preview-container">
                    {type === 'image' && (
                      <img
                        src={url}
                        alt="Preview"
                        style={{
                          width: parseDimension(urlWidth),
                          height: parseDimension(urlHeight),
                        }}
                      />
                    )}
                    {type === 'video' && (
                      <video
                        src={url}
                        controls
                        style={{
                          width: parseDimension(urlWidth),
                          height: parseDimension(urlHeight),
                        }}
                      />
                    )}
                    {type === 'audio' && <audio src={url} controls />}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manipulation Tab (if enabled) */}
          {activeTab === 'manipulation' && config.manipulation?.crop && (
            <div className="media-manipulation-section">
              {url ? (
                <>
                  <p className="manipulation-info">
                    Select an image from the upload or library tab to edit it
                  </p>
                  <div className="manipulation-controls">
                    <button 
                      className="manipulation-button"
                      onClick={() => setEditingImageUrl(url)}
                    >
                      ✏️ Edit Image
                    </button>
                  </div>
                </>
              ) : (
                <p className="manipulation-empty">Please upload or select an image first</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="media-modal-footer">
          <button className="media-button-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="media-button-insert"
            onClick={handleInsertFromUrl}
            disabled={!url}
          >
            Insert {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      </div>

      {/* Image Editor Modal */}
      {editingImageUrl && (
        <ImageEditor
          imageUrl={editingImageUrl}
          onSave={(transformedUrl) => {
            setUrl(transformedUrl);
            setEditingImageUrl(null);
          }}
          onCancel={() => setEditingImageUrl(null)}
        />
      )}
    </div>
  );
};

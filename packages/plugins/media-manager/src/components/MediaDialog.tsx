import React, { useState, useEffect } from 'react';
import { MediaManager } from '../MediaManager';
import { MediaLibraryItem } from '../types/media';

interface MediaDialogProps {
  manager: MediaManager;
  type: 'image' | 'video';
  onClose: () => void;
}

export const MediaDialog: React.FC<MediaDialogProps> = ({ manager, type, onClose }) => {
  const [tab, setTab] = useState<'upload' | 'library'>('upload');
  const [library, setLibrary] = useState<MediaLibraryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');

  useEffect(() => {
    if (tab === 'library') {
      loadLibrary();
    }
  }, [tab]);

  const loadLibrary = async () => {
    const result = await manager.fetchLibrary();
    setLibrary(result.items.filter(item => item.type === type));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadedUrl = await manager.uploadFile(file);
      setUrl(uploadedUrl);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleInsert = () => {
    if (!url) return;

    if (type === 'image') {
      manager.insertImage({ src: url, alt });
    } else {
      manager.insertVideo({ src: url, controls: true });
    }
    onClose();
  };

  const handleLibrarySelect = (item: MediaLibraryItem) => {
    if (type === 'image') {
      manager.insertImage({ src: item.url, alt: item.name });
    } else {
      manager.insertVideo({ src: item.url, controls: true });
    }
    onClose();
  };

  return (
    <div className="media-dialog-overlay" onClick={onClose}>
      <div className="media-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="media-dialog-header">
          <h2>Insert {type === 'image' ? 'Image' : 'Video'}</h2>
          <button onClick={onClose}>×</button>
        </div>

        <div className="media-dialog-tabs">
          <button
            className={tab === 'upload' ? 'active' : ''}
            onClick={() => setTab('upload')}
          >
            Upload
          </button>
          <button
            className={tab === 'library' ? 'active' : ''}
            onClick={() => setTab('library')}
          >
            Library
          </button>
        </div>

        <div className="media-dialog-content">
          {tab === 'upload' ? (
            <div className="media-upload">
              <div className="media-upload-dropzone">
                <input
                  type="file"
                  accept={type === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileUpload}
                  disabled={uploading}
                  id="media-file-input"
                />
                <label htmlFor="media-file-input">
                  {uploading ? 'Uploading...' : `Drop ${type} here or click to browse`}
                </label>
              </div>
              
              <div className="media-upload-divider">OR</div>
              
              <div className="media-upload-url">
                <input
                  type="text"
                  placeholder={`Enter ${type} URL`}
                  value={url}
                  onChange={handleUrlInput}
                />
                {type === 'image' && (
                  <input
                    type="text"
                    placeholder="Alt text (optional)"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                  />
                )}
              </div>

              {url && (
                <div className="media-upload-preview">
                  <p>Preview:</p>
                  {type === 'image' ? (
                    <img src={url} alt="Preview" />
                  ) : (
                    <video src={url} controls />
                  )}
                </div>
              )}

              <button 
                className="media-upload-insert"
                onClick={handleInsert}
                disabled={!url}
              >
                Insert {type}
              </button>
            </div>
          ) : (
            <div className="media-library">
              {library.map((item) => (
                <div
                  key={item.id}
                  className="media-library-item"
                  onClick={() => handleLibrarySelect(item)}
                >
                  <img src={item.thumbnailUrl} alt={item.name} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

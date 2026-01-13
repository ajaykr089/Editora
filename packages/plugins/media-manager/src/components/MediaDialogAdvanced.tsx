import React, { useState, useEffect } from 'react';
import { MediaManager } from '../MediaManager';
import { MediaLibraryItem } from '../types/media';

interface MediaDialogProps {
  manager: MediaManager;
  type: 'image' | 'video';
  onClose: () => void;
}

interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
}

export const MediaDialog: React.FC<MediaDialogProps> = ({ manager, type, onClose }) => {
  const [view, setView] = useState<'upload' | 'library'>('library');
  const [library, setLibrary] = useState<MediaLibraryItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaLibraryItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    if (view === 'library') {
      loadLibrary();
      loadFolders();
    }
  }, [view, currentFolder]);

  const loadLibrary = async () => {
    const result = await manager.fetchLibrary();
    setLibrary(result.items.filter(item => item.type === type));
  };

  const loadFolders = async () => {
    const response = await fetch('/api/media/folders');
    const data = await response.json();
    setFolders(data);
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

  const handleInsert = () => {
    if (!url) return;

    const attrs: any = { src: url };
    if (alt) attrs.alt = alt;
    if (width) attrs.width = parseInt(width);
    if (height) attrs.height = parseInt(height);

    if (type === 'image') {
      manager.insertImage(attrs);
    } else {
      manager.insertVideo({ ...attrs, controls: true });
    }
    onClose();
  };

  const handleMediaSelect = (item: MediaLibraryItem) => {
    setSelectedMedia(item);
    setUrl(item.url);
    setAlt(item.name);
    setWidth(item.width?.toString() || '');
    setHeight(item.height?.toString() || '');
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    await fetch('/api/media/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newFolderName, parent_id: currentFolder })
    });

    setNewFolderName('');
    setShowNewFolder(false);
    loadFolders();
  };

  const handleMoveToFolder = async (mediaId: string, folderId: string | null) => {
    await fetch(`/api/media/library/${mediaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder_id: folderId })
    });
    loadLibrary();
  };

  const currentFolderItems = folders.filter(f => f.parent_id === currentFolder);

  return (
    <div className="media-dialog-overlay" onClick={onClose}>
      <div className="media-dialog-advanced" onClick={(e) => e.stopPropagation()}>
        <div className="media-dialog-header">
          <h2>Media Manager - {type === 'image' ? 'Images' : 'Videos'}</h2>
          <button onClick={onClose}>×</button>
        </div>

        <div className="media-dialog-body">
          <div className="media-sidebar">
            <div className="media-sidebar-header">
              <h3>Folders</h3>
              <button onClick={() => setShowNewFolder(true)}>+</button>
            </div>
            {showNewFolder && (
              <div className="media-new-folder">
                <input
                  type="text"
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <button onClick={handleCreateFolder}>Create</button>
                <button onClick={() => setShowNewFolder(false)}>Cancel</button>
              </div>
            )}
            <div className="media-folder-list">
              <div
                className={`media-folder-item ${currentFolder === null ? 'active' : ''}`}
                onClick={() => setCurrentFolder(null)}
              >
                📁 All Media
              </div>
              {currentFolderItems.map(folder => (
                <div
                  key={folder.id}
                  className={`media-folder-item ${currentFolder === folder.id ? 'active' : ''}`}
                  onClick={() => setCurrentFolder(folder.id)}
                >
                  📁 {folder.name}
                </div>
              ))}
            </div>
          </div>

          <div className="media-main">
            <div className="media-toolbar">
              <button
                className={view === 'library' ? 'active' : ''}
                onClick={() => setView('library')}
              >
                Library
              </button>
              <button
                className={view === 'upload' ? 'active' : ''}
                onClick={() => setView('upload')}
              >
                Upload
              </button>
            </div>

            {view === 'upload' ? (
              <div className="media-upload-area">
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
              </div>
            ) : (
              <div className="media-library-grid">
                {library.map((item) => (
                  <div
                    key={item.id}
                    className={`media-library-item ${selectedMedia?.id === item.id ? 'selected' : ''}`}
                    onClick={() => handleMediaSelect(item)}
                  >
                    <img src={item.thumbnailUrl} alt={item.name} />
                    <span>{item.name}</span>
                    <select
                      className="media-folder-select"
                      value={item.folder_id || ''}
                      onChange={(e) => handleMoveToFolder(item.id, e.target.value || null)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">Root</option>
                      {folders.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="media-inspector">
            <h3>Properties</h3>
            {selectedMedia || url ? (
              <div className="media-properties">
                {url && (
                  <div className="media-preview">
                    {type === 'image' ? (
                      <img src={url} alt="Preview" />
                    ) : (
                      <video src={url} controls />
                    )}
                  </div>
                )}
                <div className="media-property">
                  <label>URL</label>
                  <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                </div>
                {type === 'image' && (
                  <div className="media-property">
                    <label>Alt Text</label>
                    <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} />
                  </div>
                )}
                <div className="media-property">
                  <label>Width (px)</label>
                  <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
                </div>
                <div className="media-property">
                  <label>Height (px)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                </div>
                <button className="media-insert-btn" onClick={handleInsert}>
                  Insert {type}
                </button>
              </div>
            ) : (
              <p className="media-no-selection">Select a {type} to view properties</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

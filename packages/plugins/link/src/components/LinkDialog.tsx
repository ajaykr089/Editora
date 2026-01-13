import React, { useState, useEffect } from 'react';
import { MediaManager } from '../../../media-manager/src/MediaManager';

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (linkData: LinkData) => void;
  initialText?: string;
  initialUrl?: string;
  mediaManager?: MediaManager;
}

interface LinkData {
  text: string;
  url: string;
  target: '_blank' | '_self';
  title?: string;
}

export const LinkDialog: React.FC<LinkDialogProps> = ({
  isOpen,
  onClose,
  onInsert,
  initialText = '',
  initialUrl = '',
  mediaManager
}) => {
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);
  const [target, setTarget] = useState<'_blank' | '_self'>('_self');
  const [title, setTitle] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  console.log('LinkDialog render:', { isOpen, initialText, initialUrl, mediaManager: !!mediaManager });

  useEffect(() => {
    if (isOpen) {
      console.log('LinkDialog opening with:', { initialText, initialUrl });
      setText(initialText);
      setUrl(initialUrl);
      // Reset other fields when dialog opens
      setTarget('_self');
      setTitle('');
      setShowFileUpload(false);
    }
  }, [isOpen, initialText, initialUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onInsert({
        text: text.trim() || url,
        url: url.trim(),
        target,
        title: title.trim() || undefined
      });
      onClose();
    }
  };

  const handleFileSelect = (file: any) => {
    setUrl(file.url);
    setText(file.name || file.filename);
    setShowFileUpload(false);
  };

  const fetchUploadedFiles = async () => {
    if (mediaManager) {
      try {
        const files = await mediaManager.fetchLibrary(1, 50);
        // Filter for document files
        const docs = files.items.filter((file: any) =>
          ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
           'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
           'text/plain', 'application/rtf'].includes(file.mimeType) ||
          file.mimeType?.startsWith('application/')
        );
        setUploadedFiles(docs);
      } catch (error) {
        console.error('Failed to fetch uploaded files:', error);
      }
    }
  };

  useEffect(() => {
    if (showFileUpload && mediaManager) {
      fetchUploadedFiles();
    }
  }, [showFileUpload, mediaManager]);

  if (!isOpen) return null;

  return (
    <div className="link-dialog-overlay" onClick={onClose}>
      <div className="link-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="link-dialog-header">
          <h3>Insert Link</h3>
          <button className="link-dialog-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="link-dialog-body">
            <div className="form-group">
              <label htmlFor="link-text">Link Text:</label>
              <input
                id="link-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter link text"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="link-url">URL:</label>
              <div className="url-input-group">
                <input
                  id="link-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com or select a file"
                  required
                />
                <button
                  type="button"
                  className="file-select-btn"
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  title="Select from uploaded files"
                >
                  📁
                </button>
              </div>
            </div>

            {showFileUpload && (
              <div className="file-upload-section">
                <h4>Select a File to Link:</h4>
                {uploadedFiles.length === 0 ? (
                  <p>No files available. Upload files first using the media manager.</p>
                ) : (
                  <div className="file-list">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="file-item"
                        onClick={() => handleFileSelect(file)}
                      >
                        <div className="file-icon">
                          {file.type === 'pdf' ? '📄' :
                           file.mimeType?.includes('spreadsheet') ? '📊' :
                           file.mimeType?.includes('document') ? '📝' : '📎'}
                        </div>
                        <div className="file-info">
                          <div className="file-name">{file.name}</div>
                          <div className="file-size">{file.size ? `${Math.round(file.size / 1024)} KB` : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="link-title">Title (optional):</label>
              <input
                id="link-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Link tooltip text"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={target === '_blank'}
                  onChange={(e) => setTarget(e.target.checked ? '_blank' : '_self')}
                />
                Open in new window/tab
              </label>
            </div>
          </div>

          {(() => {
            console.log('Rendering footer buttons, URL:', url, 'URL trimmed:', url.trim());
            return null;
          })()}
          <div className="link-dialog-footer">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={!url.trim()}>
              Insert Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

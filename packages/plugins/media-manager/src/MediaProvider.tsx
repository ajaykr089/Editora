import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { MediaModal } from './components/MediaModal';
import { ImageFloatingToolbar } from './components/ImageFloatingToolbar';
import { ImageEditor } from './components/ImageEditor';
import { RichTextEditorAdapter } from './adapters/EditorAdapter';
import { MediaManager } from './MediaManager';
import { ImageResizer } from './utils/resizable';

import { getMediaManagerConfig } from './constants';
import './components/MediaModal.css';
import './components/ImageFloatingToolbar.css';
import './components/ImageEditor.css';
import './components/MediaResize.css';

interface MediaContextType {
  openImageDialog: () => void;
  openVideoDialog: () => void;
  setManager: (manager: MediaManager | null) => void;
  manager: MediaManager | null;
}

const MediaContext = createContext<MediaContextType | null>(null);

export const useMediaContext = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMediaContext must be used within MediaProvider');
  }
  return context;
};

interface MediaProviderProps {
  children: ReactNode;
}

export const MediaProvider: React.FC<MediaProviderProps> = ({ children }) => {
  const [manager, setManager] = useState<MediaManager | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'image' | 'video'>('image');
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);
  const [editingImageElement, setEditingImageElement] = useState<HTMLImageElement | null>(null);
  const resizerRef = useRef<ImageResizer | null>(null);
  const contentElRef = useRef<HTMLElement | null>(null);

  const openImageDialog = () => {
    setDialogType('image');
    setDialogOpen(true);
  };

  const openVideoDialog = () => {
    setDialogType('video');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleImageSaved = (newUrl: string) => {
    if (editingImageElement) {
      editingImageElement.src = newUrl;
      editingImageElement.dataset.src = newUrl;
    }
    setEditingImageUrl(null);
    setEditingImageElement(null);
    setSelectedImage(null);
    resizerRef.current?.clearSelection();
  };

  useEffect(() => {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const contentEl = document.querySelector('.rte-content') as HTMLElement;
      if (contentEl) {
        contentElRef.current = contentEl;
        const adapter = new RichTextEditorAdapter(contentEl);
        const mediaConfig = getMediaManagerConfig();
        // Ensure config has apiUrl, MediaAPI will handle global fallback
        const configWithDefaults = {
          ...mediaConfig,
          apiUrl: mediaConfig.apiUrl || 'http://localhost:3001/api/' // Will be overridden by MediaAPI if needed
        };
        const mediaManager = new MediaManager(adapter, configWithDefaults);
        setManager(mediaManager);
        setConfig(configWithDefaults);

        // Initialize image resizer
        if (!resizerRef.current) {
          resizerRef.current = new ImageResizer(contentEl);
        }

        // Add click handlers to images
        const addImageClickHandlers = () => {
          const images = contentEl.querySelectorAll('img');
          images.forEach((img) => {
            if (!img.hasAttribute('data-editor-attached')) {
              img.setAttribute('data-editor-attached', 'true');
              img.style.cursor = 'pointer';
              img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedImage(img as HTMLImageElement);
                resizerRef.current?.selectMediaElement(img as HTMLImageElement);
              });
            }
          });
        };

        addImageClickHandlers();

        // Observe for new images being added
        const observer = new MutationObserver(() => {
          addImageClickHandlers();
        });

        observer.observe(contentEl, { childList: true, subtree: true });

        return () => {
          observer.disconnect();
        };
      }
    }, 100); // Small delay to ensure DOM is ready

    // Cleanup on unmount
    return () => {
      if (resizerRef.current) {
        resizerRef.current.destroy();
        resizerRef.current = null;
      }
    };
  }, []);

  React.useEffect(() => {
    // Register commands with global system
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('insertImage', openImageDialog);
      (window as any).registerEditorCommand?.('insertVideo', openVideoDialog);
    }
  }, []);

  const contextValue: MediaContextType = {
    openImageDialog,
    openVideoDialog,
    setManager,
    manager,
  };

  return (
    <MediaContext.Provider value={contextValue}>
      {children}
      {dialogOpen && manager && config && (
        <MediaModal manager={manager} config={config} type={dialogType} onClose={closeDialog} />
      )}
      {selectedImage && contentElRef.current && (
        <ImageFloatingToolbar
          imageElement={selectedImage}
          onEdit={() => {
            // Open image editor directly with the selected image
            setEditingImageUrl(selectedImage.src);
            setEditingImageElement(selectedImage);
          }}
          onRemove={() => {
            selectedImage.remove();
            setSelectedImage(null);
            resizerRef.current?.clearSelection();
          }}
          onClose={() => {
            setSelectedImage(null);
            resizerRef.current?.clearSelection();
          }}
        />
      )}
      {editingImageUrl && (
        <ImageEditor
          imageUrl={editingImageUrl}
          onSave={(transformedUrl) => {
            handleImageSaved(transformedUrl);
          }}
          onCancel={() => {
            setEditingImageUrl(null);
            setEditingImageElement(null);
          }}
        />
      )}
    </MediaContext.Provider>
  );
};

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { MediaDialog } from './components/MediaDialogAdvanced';
import { RichTextEditorAdapter } from './adapters/EditorAdapter';
import { MediaManager } from './MediaManager';
import { ImageResizer } from './utils/resizable';

import { getMediaManagerConfig } from './constants';
import './components/MediaDialogAdvanced.css';
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'image' | 'video'>('image');
  const resizerRef = useRef<ImageResizer | null>(null);

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

  useEffect(() => {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const contentEl = document.querySelector('.rte-content') as HTMLElement;
      if (contentEl) {
        const adapter = new RichTextEditorAdapter(contentEl);
        const config = getMediaManagerConfig();
        // Ensure config has apiUrl, MediaAPI will handle global fallback
        const mediaManager = new MediaManager(adapter, {
          ...config,
          apiUrl: config.apiUrl || 'http://localhost:3001/api/' // Will be overridden by MediaAPI if needed
        });
        setManager(mediaManager);

        // Initialize image resizer
        if (!resizerRef.current) {
          resizerRef.current = new ImageResizer(contentEl);
        }
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
      {dialogOpen && manager && (
        <MediaDialog manager={manager} type={dialogType} onClose={closeDialog} />
      )}
    </MediaContext.Provider>
  );
};

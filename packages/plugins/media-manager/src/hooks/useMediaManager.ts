import { useState, useEffect, useRef } from 'react';
import { MediaManager } from '../MediaManager';
import { RichTextEditorAdapter } from '../adapters/EditorAdapter';
import { MediaManagerConfig } from '../types/media';

export const useMediaManager = (config: MediaManagerConfig) => {
  const [manager, setManager] = useState<MediaManager | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'image' | 'video'>('image');
  const contentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const contentEl = document.querySelector('.rte-content') as HTMLElement;
    if (contentEl) {
      contentRef.current = contentEl;
      const adapter = new RichTextEditorAdapter(contentEl);
      const mediaManager = new MediaManager(adapter, config);
      setManager(mediaManager);
    }
  }, [config]);

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

  return {
    manager,
    dialogOpen,
    dialogType,
    openImageDialog,
    openVideoDialog,
    closeDialog
  };
};

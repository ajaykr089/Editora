import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MediaManager } from '../MediaManager';

interface MediaManagerContextValue {
  manager: MediaManager | null;
  setManager: (manager: MediaManager) => void;
  dialogOpen: boolean;
  dialogType: 'image' | 'video';
  openImageDialog: () => void;
  openVideoDialog: () => void;
  closeDialog: () => void;
}

const MediaManagerContext = createContext<MediaManagerContextValue | null>(null);

export const MediaManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [manager, setManager] = useState<MediaManager | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'image' | 'video'>('image');

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

  return (
    <MediaManagerContext.Provider
      value={{
        manager,
        setManager,
        dialogOpen,
        dialogType,
        openImageDialog,
        openVideoDialog,
        closeDialog
      }}
    >
      {children}
    </MediaManagerContext.Provider>
  );
};

export const useMediaManagerContext = () => {
  const context = useContext(MediaManagerContext);
  if (!context) {
    throw new Error('useMediaManagerContext must be used within MediaManagerProvider');
  }
  return context;
};

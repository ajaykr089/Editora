import React, { useState, useCallback } from 'react';
import { LinkDialog } from './LinkDialog';
import { MediaManager } from '../../../media-manager/src/MediaManager';

interface LinkManagerProps {
  mediaManager?: MediaManager;
  onInsertLink?: (linkData: any) => void;
}

export const LinkManager: React.FC<LinkManagerProps> = ({
  mediaManager,
  onInsertLink
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [initialUrl, setInitialUrl] = useState('');

  const openDialog = useCallback((text = '', url = '') => {
    setSelectedText(text);
    setInitialUrl(url);
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedText('');
    setInitialUrl('');
  }, []);

  const handleInsert = useCallback((linkData: any) => {
    if (onInsertLink) {
      onInsertLink(linkData);
    }
    closeDialog();
  }, [onInsertLink, closeDialog]);

  return (
    <>
      <LinkDialog
        isOpen={dialogOpen}
        onClose={closeDialog}
        onInsert={handleInsert}
        initialText={selectedText}
        initialUrl={initialUrl}
        mediaManager={mediaManager}
      />
    </>
  );
};

// Hook to manage link dialog state
export const useLinkManager = () => {
  const [linkManager, setLinkManager] = useState<{
    openDialog: (text?: string, url?: string) => void;
  } | null>(null);

  const createLinkManager = useCallback((onInsertLink?: (linkData: any) => void, mediaManager?: MediaManager) => {
    return {
      openDialog: (text = '', url = '') => {
        // This will be called by the toolbar button
        // The actual dialog will be rendered by LinkManager component
        const event = new CustomEvent('openLinkDialog', {
          detail: { text, url, onInsertLink, mediaManager }
        });
        window.dispatchEvent(event);
      }
    };
  }, []);

  return { linkManager, createLinkManager };
};

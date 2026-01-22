import React, { ReactNode, useState, useCallback } from 'react';
import { EmojisDialog } from './EmojisDialog';

/**
 * Emojis Provider - Isolated plugin functionality
 *
 * Provides a dialog for inserting emojis organized by categories
 * with tabs for different emoji sets
 */

interface EmojisProviderProps {
  children: ReactNode;
}

export const EmojisProvider: React.FC<EmojisProviderProps> = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  React.useEffect(() => {
    // Register commands with global system
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('insertEmoji', handleInsertEmoji);
    }
  }, []);

  const handleInsertEmoji = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleInsertEmojiChar = useCallback((emoji: string) => {
    // Insert the emoji at cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(emoji));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    setDialogOpen(false);
  }, []);

  return (
    <>
      {children}
      {dialogOpen && (
        <EmojisDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          onInsert={handleInsertEmojiChar}
        />
      )}
    </>
  );
};

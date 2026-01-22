import React, { ReactNode, useState, useCallback } from 'react';
import { SpecialCharactersDialog } from './SpecialCharactersDialog';

/**
 * Special Characters Provider - Isolated plugin functionality
 *
 * Provides a dialog for inserting special characters organized by categories
 * with tabs for different character sets
 */

interface SpecialCharactersProviderProps {
  children: ReactNode;
}

export const SpecialCharactersProvider: React.FC<SpecialCharactersProviderProps> = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  React.useEffect(() => {
    // Register commands with global system
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('insertSpecialCharacter', handleInsertSpecialCharacter);
    }
  }, []);

  const handleInsertSpecialCharacter = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleInsertCharacter = useCallback((character: string) => {
    // Insert the character at cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(character));
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
        <SpecialCharactersDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          onInsert={handleInsertCharacter}
        />
      )}
    </>
  );
};

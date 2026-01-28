import React, { ReactNode, useState, useCallback } from 'react';
import { insertMathCommand, updateMathCommand, MathData, undoMathOperation } from './MathPlugin';
import { MathDialog } from './MathDialog';
import './MathDialog.css';

interface MathProviderProps {
  children: ReactNode;
}

export const MathProvider: React.FC<MathProviderProps> = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMath, setEditingMath] = useState<MathData | null>(null);

  React.useEffect(() => {
    // Register commands with global system
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('insertMath', handleInsertMath);
      (window as any).registerEditorCommand?.('updateMath', handleUpdateMath);
      (window as any).registerEditorCommand?.('undoMath', undoMathOperation);
    }

    // Add double-click listener for math spans (for editing)
    const handleDoubleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mathSpan = target.closest('.math-formula') as HTMLElement;

      if (mathSpan) {
        event.preventDefault();
        event.stopPropagation();

        // Extract math data from the span
        const formula = mathSpan.getAttribute('data-math-formula') || '';
        const format = mathSpan.getAttribute('data-math-format') || 'latex';
        const inline = mathSpan.getAttribute('data-math-inline') === 'true';

        const mathData = {
          formula,
          format: format as 'latex' | 'mathml',
          inline
        };

        // Open dialog in edit mode
        setEditingMath(mathData);
        setDialogOpen(true);
      }
    };

    // Add keyboard shortcut for undo (Ctrl+Z or Cmd+Z)
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        // Check if active element is a math formula
        const target = event.target as HTMLElement;
        if (target.closest('.math-formula')) {
          event.preventDefault();
          undoMathOperation();
        }
      }
    };

    // Add event listeners
    document.addEventListener('dblclick', handleDoubleClick);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('dblclick', handleDoubleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInsertMath = useCallback(() => {
    // Store current selection before dialog opens
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      // Update the stored selection in the plugin
      // We need to call the insertMathCommand to store selection
      insertMathCommand();
    }
    setEditingMath(null);
    setDialogOpen(true);
  }, []);

  const handleUpdateMath = useCallback((mathData: MathData) => {
    setEditingMath(mathData);
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEditingMath(null);
  }, []);

  const handleInsert = useCallback((mathData: MathData) => {
    console.log('MathProvider: handleInsert called with data:', mathData);
    if (editingMath) {
      // We're editing existing math - find the span and update it
      const mathSpans = document.querySelectorAll('.math-formula');
      let targetSpan: HTMLElement | null = null;

      // Find the span that matches the original math data
      for (const span of mathSpans) {
        const formula = span.getAttribute('data-math-formula');
        if (formula === editingMath.formula) {
          targetSpan = span as HTMLElement;
          break;
        }
      }

      if (targetSpan) {
        updateMathCommand(mathData, targetSpan);
      }
    } else {
      // New math insertion
      updateMathCommand(mathData);
    }
    setDialogOpen(false);
    setEditingMath(null);
  }, [editingMath]);

  return (
    <>
      {children}
      {dialogOpen && (
        <MathDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          onInsert={handleInsert}
          initialData={editingMath}
        />
      )}
    </>
  );
};

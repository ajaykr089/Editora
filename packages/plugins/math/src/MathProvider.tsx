import React, { ReactNode, useState, useCallback } from 'react';
import { insertMathCommand, updateMathCommand, MathData } from './MathPlugin';
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
    }

    // Add double-click listener for math spans
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

    // Handle keyboard events for math span deletion and navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      // Check if selection is inside any math formula
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;

      const startMathSpan = startContainer.nodeType === Node.TEXT_NODE
        ? startContainer.parentElement?.closest('.math-formula') as HTMLElement
        : startContainer.nodeType === Node.ELEMENT_NODE
        ? (startContainer as Element).closest('.math-formula') as HTMLElement
        : null;

      const endMathSpan = endContainer.nodeType === Node.TEXT_NODE
        ? endContainer.parentElement?.closest('.math-formula') as HTMLElement
        : endContainer.nodeType === Node.ELEMENT_NODE
        ? (endContainer as Element).closest('.math-formula') as HTMLElement
        : null;

      // If any part of the selection is inside a math span
      const selectedMathSpan = startMathSpan || endMathSpan;

      if (selectedMathSpan) {
        // If a math span is selected and user presses delete/backspace
        if (event.key === 'Delete' || event.key === 'Backspace') {
          event.preventDefault();
          selectedMathSpan.remove();
          return;
        }

        // Prevent cursor from entering math spans
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
            event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          // Allow navigation but ensure cursor doesn't get stuck
          return;
        }

        // Prevent typing inside math spans
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          // Move cursor after the math span
          const newRange = document.createRange();
          newRange.setStartAfter(selectedMathSpan);
          newRange.setEndAfter(selectedMathSpan);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    };

    // Handle click events on math spans to select them entirely
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mathSpan = target.closest('.math-formula') as HTMLElement;

      if (mathSpan) {
        // Select the entire math span
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(mathSpan);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    };

    // Add event listeners
    document.addEventListener('dblclick', handleDoubleClick);
    document.addEventListener('keydown', handleKeyDown);
    //document.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      document.removeEventListener('dblclick', handleDoubleClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
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

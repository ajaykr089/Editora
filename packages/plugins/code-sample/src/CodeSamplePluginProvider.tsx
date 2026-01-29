import React, { ReactNode, useState, useRef } from 'react';
import { insertCodeBlockCommand, editCodeBlockCommand, copyCodeBlockCommand, deleteCodeBlockCommand } from './CodeSamplePlugin';
import { CodeSampleDialog } from './CodeSampleDialog';
import './CodeSampleStyles.css';

interface CodeSamplePluginProviderProps {
  children: ReactNode;
}

interface DialogState {
  isOpen: boolean;
  mode: 'insert' | 'edit';
  codeBlockId?: string;
  code: string;
  language: string;
  savedRange?: Range;
}

/**
 * CodeSamplePluginProvider
 *
 * Registers code block commands and handles code block interactions.
 * Provides dialog for code block insertion/editing.
 */
export const CodeSamplePluginProvider: React.FC<CodeSamplePluginProviderProps> = ({ children }) => {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    mode: 'insert',
    code: '',
    language: 'javascript'
  });
  const commandRegisteredRef = useRef(false);

  React.useEffect(() => {
    // Register code block commands
    if (typeof window !== 'undefined' && !commandRegisteredRef.current) {
      commandRegisteredRef.current = true;

      (window as any).registerEditorCommand?.('insertCodeBlock', () => {
        const selection = window.getSelection();
        let savedRange: Range | undefined;

        if (selection && selection.rangeCount > 0) {
          savedRange = selection.getRangeAt(0).cloneRange();
        }

        setDialogState({
          isOpen: true,
          mode: 'insert',
          code: '',
          language: 'javascript',
          savedRange
        });
      });

      (window as any).registerEditorCommand?.('editCodeBlock', (codeBlockId: string) => {
        const codeBlock = document.getElementById(codeBlockId) as HTMLElement;
        if (!codeBlock) return;

        const code = codeBlock.textContent || '';
        const language = codeBlock.getAttribute('data-lang') || 'javascript';

        setDialogState({
          isOpen: true,
          mode: 'edit',
          codeBlockId,
          code,
          language
        });
      });

      (window as any).registerEditorCommand?.('copyCodeBlock', (codeBlockId: string) => {
        copyCodeBlockCommand(codeBlockId);
      });

      (window as any).registerEditorCommand?.('deleteCodeBlock', (codeBlockId: string) => {
        deleteCodeBlockCommand(codeBlockId);
      });
    }

    // Handle double-click on code blocks to open edit dialog
    const handleCodeBlockDoubleClick = (e: MouseEvent) => {
      const codeBlock = (e.target as HTMLElement).closest('.rte-code-block') as HTMLElement;
      if (!codeBlock) return;

      const codeBlockId = codeBlock.id;
      const code = codeBlock.textContent || '';
      const language = codeBlock.getAttribute('data-lang') || 'javascript';

      setDialogState({
        isOpen: true,
        mode: 'edit',
        codeBlockId,
        code,
        language
      });
    };

    document.addEventListener('dblclick', handleCodeBlockDoubleClick);

    return () => {
      document.removeEventListener('dblclick', handleCodeBlockDoubleClick);
    };
  }, []);

  const handleDialogSave = (code: string, language: string) => {
    if (dialogState.mode === 'insert') {
      // Restore cursor position before inserting
      if (dialogState.savedRange) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(dialogState.savedRange);
        }
      }
      insertCodeBlockCommand(language, code);
    } else if (dialogState.mode === 'edit' && dialogState.codeBlockId) {
      editCodeBlockCommand(dialogState.codeBlockId, language, code);
    }

    setDialogState({
      isOpen: false,
      mode: 'insert',
      code: '',
      language: 'javascript'
    });
  };

  const handleDialogClose = () => {
    setDialogState({
      isOpen: false,
      mode: 'insert',
      code: '',
      language: 'javascript'
    });
  };

  return (
    <>
      {children}
      <CodeSampleDialog
        isOpen={dialogState.isOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        editingCodeId={dialogState.codeBlockId}
        editingCode={dialogState.code}
        editingLanguage={dialogState.language}
      />
    </>
  );
};

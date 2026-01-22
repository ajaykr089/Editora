import React, { ReactNode } from 'react';

interface DocumentManagerPluginProviderProps {
  children: ReactNode;
}

export const DocumentManagerPluginProvider: React.FC<DocumentManagerPluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('importWord', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.docx';
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const editorElement = document.querySelector('[contenteditable="true"]') as HTMLElement;
            if (editorElement) {
              const { importFromWord } = await import('./documentManager');
              const htmlContent = await importFromWord(file);
              editorElement.innerHTML = htmlContent;
              editorElement.dispatchEvent(new Event('input', { bubbles: true }));
            }
          } catch (error) {
            console.error('Import failed:', error);
            alert('Failed to import Word document. Please check the console for details.');
          }
        }
      };
      input.click();
    });

    registerCommand('exportWord', async () => {
      try {
        const editorElement = document.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editorElement) {
          const htmlContent = editorElement.innerHTML;
          const { exportToWord } = await import('./documentManager');
          await exportToWord(htmlContent, 'document.docx');
        }
      } catch (error) {
        console.error('Export failed:', error);
        alert('Failed to export to Word. Please check the console for details.');
      }
    });

    registerCommand('exportPdf', async () => {
      try {
        const editorElement = document.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editorElement) {
          const htmlContent = editorElement.innerHTML;
          const { exportToPdf } = await import('./documentManager');
          await exportToPdf(htmlContent, 'document.pdf', editorElement);
        }
      } catch (error) {
        console.error('Export failed:', error);
        alert('Failed to export to PDF. Please check the console for details.');
      }
    });
  }, []);

  return <>{children}</>;
};

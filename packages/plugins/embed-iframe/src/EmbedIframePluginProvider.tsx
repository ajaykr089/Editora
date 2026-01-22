import React, { ReactNode } from 'react';
import { EmbedIframeDialog } from './EmbedIframeDialog';

interface EmbedIframePluginProviderProps {
  children: ReactNode;
}

export const EmbedIframePluginProvider: React.FC<EmbedIframePluginProviderProps> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('openEmbedIframeDialog', () => {
      setIsDialogOpen(true);
    });
  }, []);

  const handleEmbed = (data: { src: string; width: string; height: string; aspectRatio: string }) => {
    const iframeHtml = `<iframe src="${data.src}" width="${data.width}" height="${data.height}" allowfullscreen frameborder="0" class="${data.aspectRatio !== 'inline' ? `rte-iframe-${data.aspectRatio}` : ''}" data-aspect-ratio="${data.aspectRatio}"></iframe>`;
    document.execCommand('insertHTML', false, iframeHtml);
  };

  return (
    <>
      {children}
      <EmbedIframeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onEmbed={handleEmbed}
      />
    </>
  );
};

import React, { useMemo, useEffect, useRef, useState } from 'react';
import { Editor, PluginManager, Plugin } from '@rte-editor/core';
import { Toolbar } from './Toolbar';
import { EditorContent } from './EditorContent';
import { MediaManagerProvider, useMediaManagerContext } from '../../../plugins/media-manager/src/components/MediaManagerProvider';
import { MediaDialog } from '../../../plugins/media-manager/src/components/MediaDialogAdvanced';
import { RichTextEditorAdapter } from '../../../plugins/media-manager/src/adapters/EditorAdapter';
import { MediaManager } from '../../../plugins/media-manager/src/MediaManager';
import { ImageResizer } from '../../../plugins/media-manager/src/utils/resizable';
import { LinkDialog } from '../../../plugins/link/src/components/LinkDialog';
import '../../../plugins/media-manager/src/components/MediaDialogAdvanced.css';
import '../../../plugins/media-manager/src/components/MediaResize.css';
import '../../../plugins/link/src/components/LinkDialog.css';

interface RichTextEditorProps {
  plugins: Plugin[];
  className?: string;
  mediaConfig?: {
    uploadUrl: string;
    libraryUrl: string;
    maxFileSize: number;
    allowedTypes: string[];
  };
}

const EditorWithMedia: React.FC<RichTextEditorProps> = ({ plugins, className, mediaConfig }) => {
  const editor = useMemo(() => {
    const pluginManager = new PluginManager();
    plugins.forEach(p => pluginManager.register(p));
    return new Editor(pluginManager);
  }, [plugins]);

  const resizerRef = useRef<ImageResizer | null>(null);
  const { setManager, manager, dialogOpen, dialogType, closeDialog } = useMediaManagerContext();
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [initialUrl, setInitialUrl] = useState('');

  const handleInsertLink = (linkData: any) => {
    // Create link using DOM manipulation since we're using contentEditable
    const contentEl = document.querySelector('.rte-content') as HTMLElement;
    if (!contentEl) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Create the link element
    const linkElement = document.createElement('a');
    linkElement.href = linkData.url;
    linkElement.textContent = linkData.text;
    linkElement.target = linkData.target;
    if (linkData.title) {
      linkElement.title = linkData.title;
    }

    // Insert the link
    range.deleteContents();
    range.insertNode(linkElement);

    // Move cursor after the link
    range.setStartAfter(linkElement);
    range.setEndAfter(linkElement);
    selection.removeAllRanges();
    selection.addRange(range);

    // Focus back to editor
    contentEl.focus();

    console.log('Link inserted:', linkData);
    setLinkDialogOpen(false);
  };

  const handleToolbarCommand = (command: string) => {
    console.log('Toolbar command received:', command);
    if (command === 'openLinkDialog') {
      // Get selected text from editor
      const selection = window.getSelection();
      const selectedText = selection?.toString() || '';
      console.log('Opening link dialog with selected text:', selectedText);
      setSelectedText(selectedText);
      setInitialUrl('');
      setLinkDialogOpen(true);
    }
  };

  useEffect(() => {
    if (mediaConfig) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        const contentEl = document.querySelector('.rte-content') as HTMLElement;
        if (contentEl) {
          const adapter = new RichTextEditorAdapter(contentEl);
          const mediaManager = new MediaManager(adapter, mediaConfig);
          setManager(mediaManager);

          // Initialize image resizer
          if (!resizerRef.current) {
            resizerRef.current = new ImageResizer(contentEl);
          }
        }
      }, 100);
    }

    // Cleanup on unmount
    return () => {
      if (resizerRef.current) {
        resizerRef.current.destroy();
        resizerRef.current = null;
      }
    };
  }, [mediaConfig, setManager]);

  return (
    <div className={`rte-editor ${className || ''}`}>
      <Toolbar editor={editor} onCustomCommand={handleToolbarCommand} />
      <EditorContent editor={editor} />
      {dialogOpen && manager && (
        <MediaDialog manager={manager} type={dialogType} onClose={closeDialog} />
      )}
      <LinkDialog
        isOpen={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onInsert={handleInsertLink}
        initialText={selectedText}
        initialUrl={initialUrl}
        mediaManager={manager || undefined}
      />
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  return (
    <MediaManagerProvider>
      <EditorWithMedia {...props} />
    </MediaManagerProvider>
  );
};

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
  const [initialTarget, setInitialTarget] = useState<'_blank' | '_self'>('_self');
  const [initialTitle, setInitialTitle] = useState('');
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [editingLinkElement, setEditingLinkElement] = useState<HTMLAnchorElement | null>(null);

  const handleInsertLink = (linkData: any) => {
    const contentEl = document.querySelector('.rte-content') as HTMLElement;
    if (!contentEl) return;

    if (isEditingLink && selectionRange) {
      // Edit existing link - find the link element in the current selection
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const currentRange = selection.getRangeAt(0);
        const linkElement = currentRange.commonAncestorContainer.nodeType === Node.TEXT_NODE
          ? currentRange.commonAncestorContainer.parentElement
          : currentRange.commonAncestorContainer as Element;

        const link = linkElement?.closest('a') as HTMLAnchorElement;
        if (link) {
          link.href = linkData.url;
          link.textContent = linkData.text;
          link.target = linkData.target;
          if (linkData.title) {
            link.title = linkData.title;
          } else {
            link.removeAttribute('title');
          }

          // Select the edited link
          const range = document.createRange();
          range.selectNodeContents(link);
          selection.removeAllRanges();
          selection.addRange(range);

          console.log('Link edited:', linkData);
        }
      }
    } else {
      // Create new link using DOM manipulation since we're using contentEditable
      let rangeToUse: Range;

      // Use stored range if available, otherwise try current selection
      if (selectionRange) {
        rangeToUse = selectionRange;
      } else {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        rangeToUse = selection.getRangeAt(0);
      }

      // Create the link element
      const linkElement = document.createElement('a');
      linkElement.href = linkData.url;
      linkElement.textContent = linkData.text;
      linkElement.target = linkData.target;
      if (linkData.title) {
        linkElement.title = linkData.title;
      }

      // Insert the link
      rangeToUse.deleteContents();
      rangeToUse.insertNode(linkElement);

      // Move cursor after the link
      rangeToUse.setStartAfter(linkElement);
      rangeToUse.setEndAfter(linkElement);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(rangeToUse);
      }

      console.log('Link inserted:', linkData);
    }

    // Focus back to editor
    contentEl.focus();

    // Reset state
    setLinkDialogOpen(false);
    setSelectionRange(null);
    setIsEditingLink(false);
    setEditingLinkElement(null);
  };

  const handleToolbarCommand = (command: string) => {
    console.log('Toolbar command received:', command);
    if (command === 'openLinkDialog') {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0).cloneRange();
      setSelectionRange(range);

      // Check if selected content contains or is within a link
      const selectedText = selection.toString() || '';

      // Check if the selection is within a link element
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;

      const startLink = startContainer.nodeType === Node.TEXT_NODE
        ? startContainer.parentElement?.closest('a')
        : (startContainer as Element).closest?.('a');

      const endLink = endContainer.nodeType === Node.TEXT_NODE
        ? endContainer.parentElement?.closest('a')
        : (endContainer as Element).closest?.('a');

      const isWithinLink = startLink && endLink && startLink === endLink;
      const containsLink = range.cloneContents().querySelector('a') !== null;

      console.log('Selection analysis:', {
        selectedText,
        startContainer: startContainer.nodeType,
        startLink: !!startLink,
        endLink: !!endLink,
        isWithinLink,
        containsLink
      });

      if (isWithinLink || containsLink) {
        // Edit mode: extract link properties from the actual DOM element
        const linkElement = startLink as HTMLAnchorElement;
        if (linkElement) {
          setIsEditingLink(true);
          setEditingLinkElement(linkElement);
          setSelectedText(linkElement.textContent || '');
          setInitialUrl(linkElement.href);
          setInitialTarget((linkElement.target as '_blank' | '_self') || '_self');
          setInitialTitle(linkElement.title || '');

          // Pre-fill the dialog with existing link attributes
          console.log('Opening link dialog in EDIT mode for link:', {
            href: linkElement.href,
            text: linkElement.textContent,
            target: linkElement.target,
            title: linkElement.title
          });
        } else {
          // Fallback to insert mode if we can't find the link
          setIsEditingLink(false);
          setEditingLinkElement(null);
          setSelectedText(selectedText);
          setInitialUrl('');
          console.log('Opening link dialog in INSERT mode (fallback)');
        }
      } else {
        // Insert mode
        setIsEditingLink(false);
        setEditingLinkElement(null);
        setSelectedText(selectedText);
        setInitialUrl('');
        console.log('Opening link dialog in INSERT mode');
      }

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
        onClose={() => {
          setLinkDialogOpen(false);
          setSelectionRange(null);
          setIsEditingLink(false);
          setEditingLinkElement(null);
        }}
        onInsert={handleInsertLink}
        initialText={selectedText}
        initialUrl={initialUrl}
        initialTarget={initialTarget}
        initialTitle={initialTitle}
        mediaManager={manager || undefined}
        isEditing={isEditingLink}
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

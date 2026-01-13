import React, { useMemo, useEffect, useRef } from 'react';
import { Editor, PluginManager, Plugin } from '@rte-editor/core';
import { Toolbar } from './Toolbar';
import { EditorContent } from './EditorContent';
import { MediaManagerProvider, useMediaManagerContext } from '../../../plugins/media-manager/src/components/MediaManagerProvider';
import { MediaDialog } from '../../../plugins/media-manager/src/components/MediaDialogAdvanced';
import { RichTextEditorAdapter } from '../../../plugins/media-manager/src/adapters/EditorAdapter';
import { MediaManager } from '../../../plugins/media-manager/src/MediaManager';
import { ImageResizer } from '../../../plugins/media-manager/src/utils/resizable';
import '../../../plugins/media-manager/src/components/MediaDialogAdvanced.css';
import '../../../plugins/media-manager/src/components/MediaResize.css';

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
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      {dialogOpen && manager && (
        <MediaDialog manager={manager} type={dialogType} onClose={closeDialog} />
      )}
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

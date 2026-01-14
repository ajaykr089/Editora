import React, { useMemo } from 'react';
import { Editor, PluginManager, Plugin } from '@rte-editor/core';
import { PluginProvider } from './PluginManager';
import { Toolbar } from './Toolbar';
import { EditorContent } from './EditorContent';
import { FloatingToolbar } from './FloatingToolbar';

// Plugin Providers
import { BoldPluginProvider } from './PluginManager';
import { ItalicPluginProvider } from './PluginManager';
import { UnderlinePluginProvider } from './PluginManager';
import { StrikethroughPluginProvider } from './PluginManager';
import { CodePluginProvider } from './PluginManager';
import { ListPluginProvider } from './PluginManager';
import { BlockquotePluginProvider } from './PluginManager';
import { ClearFormattingPluginProvider } from './PluginManager';
import { HistoryPluginProvider } from './PluginManager';
import { HeadingPluginProvider } from './PluginManager';
import { TableProvider } from '../../../plugins/table/src/TableProvider';
import { LinkProvider } from '../../../plugins/link/src/LinkProvider';
import { MediaProvider } from '../../../plugins/media-manager/src/MediaProvider';
import { FontSizeProvider } from '../../../plugins/font-size/src/FontSizeProvider';
import { TextAlignmentProvider } from '../../../plugins/text-alignment/src/TextAlignmentProvider';
import { FontFamilyProvider } from '../../../plugins/font-family/src/FontFamilyProvider';

interface RichTextEditorProps {
  plugins: Plugin[];
  className?: string;
  mediaConfig?: {
    uploadUrl: string;
    libraryUrl: string;
    maxFileSize: number;
    allowedTypes: string[];
  };
  floatingToolbar?: {
    enabled?: boolean;
  };
}

const EditorCore: React.FC<RichTextEditorProps> = ({ plugins, className, mediaConfig, floatingToolbar }) => {
  const editor = useMemo(() => {
    const pluginManager = new PluginManager();
    plugins.forEach(p => pluginManager.register(p));
    return new Editor(pluginManager);
  }, [plugins]);

  const floatingToolbarEnabled = floatingToolbar?.enabled !== false;

  return (
    <PluginProvider plugins={plugins}>
      <BoldPluginProvider>
        <ItalicPluginProvider>
          <UnderlinePluginProvider>
            <StrikethroughPluginProvider>
              <CodePluginProvider>
                <ListPluginProvider>
                  <BlockquotePluginProvider>
                    <ClearFormattingPluginProvider>
                      <HistoryPluginProvider>
                        <HeadingPluginProvider>
                          <TableProvider>
                            <LinkProvider>
                              <MediaProvider mediaConfig={mediaConfig}>
                                <FontSizeProvider>
                                  <TextAlignmentProvider>
                                    <FontFamilyProvider>
                                      <div className={`rte-editor ${className || ''}`}>
                                        <Toolbar
                                          editor={editor}
                                        />
                                        <EditorContent editor={editor} />
                                        <FloatingToolbar
                                          editor={editor}
                                          isEnabled={floatingToolbarEnabled}
                                        />
                                      </div>
                                    </FontFamilyProvider>
                                  </TextAlignmentProvider>
                                </FontSizeProvider>
                              </MediaProvider>
                            </LinkProvider>
                          </TableProvider>
                        </HeadingPluginProvider>
                      </HistoryPluginProvider>
                    </ClearFormattingPluginProvider>
                  </BlockquotePluginProvider>
                </ListPluginProvider>
              </CodePluginProvider>
            </StrikethroughPluginProvider>
          </UnderlinePluginProvider>
        </ItalicPluginProvider>
      </BoldPluginProvider>
    </PluginProvider>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  return <EditorCore {...props} />;
};

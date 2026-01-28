import React, { useMemo } from 'react';
import { Editor, PluginManager, Plugin } from '@rte-editor/core';
import { Toolbar } from './Toolbar';
import { EditorContent } from './EditorContent';
import { FloatingToolbar } from './FloatingToolbar';

// Plugin Providers - now imported from their respective plugin directories
import { BoldPluginProvider } from '../../../plugins/bold/src/BoldPluginProvider';
import { ItalicPluginProvider } from '../../../plugins/italic/src/ItalicPluginProvider';
import { UnderlinePluginProvider } from '../../../plugins/underline/src/UnderlinePluginProvider';
import { StrikethroughPluginProvider } from '../../../plugins/strikethrough/src/StrikethroughPluginProvider';
import { ListPluginProvider } from '../../../plugins/list/src/ListPluginProvider';
import { BlockquotePluginProvider } from '../../../plugins/blockquote/src/BlockquotePluginProvider';
import { ClearFormattingPluginProvider } from '../../../plugins/clear-formatting/src/ClearFormattingPluginProvider';
import { HistoryPluginProvider } from '../../../plugins/history/src/HistoryPluginProvider';

import { IndentPluginProvider } from '../../../plugins/indent/src/IndentPluginProvider';
import { TableProvider } from '../../../plugins/table/src/TableProvider';
import { LinkProvider } from '../../../plugins/link/src/LinkProvider';
import { MediaProvider } from '../../../plugins/media-manager/src/MediaProvider';
import { FontSizeProvider } from '../../../plugins/font-size/src/FontSizeProvider';
import { TextAlignmentProvider } from '../../../plugins/text-alignment/src/TextAlignmentProvider';
import { FontFamilyProvider } from '../../../plugins/font-family/src/FontFamilyProvider';
import { LineHeightProvider } from '../../../plugins/line-height/src/LineHeightProvider';
import { SpecialCharactersProvider } from '../../../plugins/special-characters/src/SpecialCharactersProvider';
import { EmojisProvider } from '../../../plugins/emojis/src/EmojisProvider';
import { TextColorPluginProvider } from '../../../plugins/text-color/src/TextColorPluginProvider';
import { BackgroundColorPluginProvider } from '../../../plugins/background-color/src/BackgroundColorPluginProvider';
import { EmbedIframePluginProvider } from '../../../plugins/embed-iframe/src/EmbedIframePluginProvider';
import { CapitalizationPluginProvider } from '../../../plugins/capitalization/src/CapitalizationPluginProvider';
import { DirectionPluginProvider } from '../../../plugins/direction/src/DirectionPluginProvider';
import { CodePluginProvider } from '../../../plugins/code/src/CodePluginProvider';
import { ChecklistPluginProvider } from '../../../plugins/checklist/src/ChecklistPluginProvider';
import { MathProvider } from '../../../plugins/math/src/MathProvider';
import { DocumentManagerProvider } from '../../../plugins/document-manager/src/DocumentManagerProvider';
import { DocumentManagerPluginProvider } from '../../../plugins/document-manager/src/DocumentManagerPluginProvider';
import { PreviewPluginProvider } from "../../../plugins/preview/src/PreviewPluginProvider";

// Global command registry
const commandRegistry = new Map<string, (params?: any) => void>();

if (typeof window !== 'undefined') {
  (window as any).registerEditorCommand = (command: string, handler: (params?: any) => void) => {
    commandRegistry.set(command, handler);
  };

  (window as any).executeEditorCommand = (command: string, params?: any) => {
    const handler = commandRegistry.get(command);
    if (handler) {
      handler(params);
    } else {
      console.warn(`No handler registered for command: ${command}`);
    }
  };
}

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
    <EmbedIframePluginProvider>
      <BoldPluginProvider>
        <ItalicPluginProvider>
          <UnderlinePluginProvider>
            <StrikethroughPluginProvider>
              <CodePluginProvider>
                <ChecklistPluginProvider>
                  <ListPluginProvider>
                    <BlockquotePluginProvider>
                      <ClearFormattingPluginProvider>
                        <HistoryPluginProvider>
                          <IndentPluginProvider>
                            <TableProvider>
                              <LinkProvider>
                                <MediaProvider>
                                  <FontSizeProvider>
                                    <TextAlignmentProvider>
                                      <FontFamilyProvider>
                                        <LineHeightProvider>
                                          <SpecialCharactersProvider>
                                            <EmojisProvider>
                                              <TextColorPluginProvider>
                                                <BackgroundColorPluginProvider>
                                                  <CapitalizationPluginProvider>
                                                    <DirectionPluginProvider>
                                                      <MathProvider>
                                                        <DocumentManagerProvider>
                                                          <DocumentManagerPluginProvider>
                                                            <PreviewPluginProvider>
                                                              <div
                                                                className={`rte-editor ${className || ""}`}
                                                              >
                                                                <Toolbar
                                                                  editor={
                                                                    editor
                                                                  }
                                                                />
                                                                <EditorContent
                                                                  editor={
                                                                    editor
                                                                  }
                                                                />
                                                                <FloatingToolbar
                                                                  editor={
                                                                    editor
                                                                  }
                                                                  isEnabled={
                                                                    floatingToolbarEnabled
                                                                  }
                                                                />
                                                              </div>
                                                            </PreviewPluginProvider>
                                                          </DocumentManagerPluginProvider>
                                                        </DocumentManagerProvider>
                                                      </MathProvider>
                                                    </DirectionPluginProvider>
                                                  </CapitalizationPluginProvider>
                                                </BackgroundColorPluginProvider>
                                              </TextColorPluginProvider>
                                            </EmojisProvider>
                                          </SpecialCharactersProvider>
                                        </LineHeightProvider>
                                      </FontFamilyProvider>
                                    </TextAlignmentProvider>
                                  </FontSizeProvider>
                                </MediaProvider>
                              </LinkProvider>
                            </TableProvider>
                          </IndentPluginProvider>
                        </HistoryPluginProvider>
                      </ClearFormattingPluginProvider>
                    </BlockquotePluginProvider>
                  </ListPluginProvider>
                </ChecklistPluginProvider>
              </CodePluginProvider>
            </StrikethroughPluginProvider>
          </UnderlinePluginProvider>
        </ItalicPluginProvider>
      </BoldPluginProvider>
    </EmbedIframePluginProvider>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  return <EditorCore {...props} />;
};

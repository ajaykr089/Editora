import type { Meta, StoryObj } from "@storybook/react";
import { RichTextEditor } from "@editora/react";
import {
  ParagraphPlugin,
  HeadingPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  ListPlugin,
  BlockquotePlugin,
  CodePlugin,
  LinkPlugin,
  ClearFormattingPlugin,
  HistoryPlugin,
  TablePlugin,
  MediaManagerPlugin,
  FontSizePlugin,
  FontFamilyPlugin,
  TextAlignmentPlugin,
  MathPlugin,
  DocumentManagerPlugin,
  TextColorPlugin,
  BackgroundColorPlugin,
  SpecialCharactersPlugin,
  EmojisPlugin,
  LineHeightPlugin,
  IndentPlugin,
  EmbedIframePlugin,
  CapitalizationPlugin,
  DirectionPlugin,
  ChecklistPlugin,
  PreviewPlugin,
  FullscreenPlugin,
  AnchorPlugin,
  PrintPlugin,
  PageBreakPlugin,
  FootnotePlugin,
  CodeSamplePlugin
} from "@editora/plugins";
import "@editora/themes/themes/default.css";

const meta: Meta<typeof RichTextEditor> = {
  title: "Editor/RichTextEditor",
  component: RichTextEditor,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
  args: {
    plugins: [
      ParagraphPlugin(),
      HeadingPlugin(),
      BoldPlugin(),
      ItalicPlugin(),
      UnderlinePlugin(),
      StrikethroughPlugin(),
      CodePlugin(),
      ListPlugin(),
      BlockquotePlugin(),
      LinkPlugin(),
      ClearFormattingPlugin(),
      TablePlugin(),
      HistoryPlugin(),
      MediaManagerPlugin(),
      FontSizePlugin(),
      FontFamilyPlugin(),
      TextAlignmentPlugin(),
      MathPlugin(),
      DocumentManagerPlugin(),
      TextColorPlugin(),
      BackgroundColorPlugin(),
      SpecialCharactersPlugin(),
      EmojisPlugin(),
      LineHeightPlugin(),
      IndentPlugin(),
      EmbedIframePlugin(),
      CapitalizationPlugin(),
      DirectionPlugin(),
      ChecklistPlugin(),
      PreviewPlugin(),
      FullscreenPlugin(),
      AnchorPlugin(),
      PrintPlugin(),
      PageBreakPlugin(),
      FootnotePlugin(),
      CodeSamplePlugin()
    ],
    mediaConfig: {
      uploadUrl: "/api/media/upload",
      libraryUrl: "/api/media/library",
      maxFileSize: 5 * 1024 * 1024,
      allowedTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/webm",
      ],
    },
  },
};

export const MinimalPlugins: Story = {
  args: {
    plugins: [ParagraphPlugin(), BoldPlugin(), ItalicPlugin()],
  },
};

export const OnlyFormatting: Story = {
  args: {
    plugins: [ParagraphPlugin(), HeadingPlugin()],
  },
};

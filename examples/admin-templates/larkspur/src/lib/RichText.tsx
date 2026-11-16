import React from 'react';
import { EditoraEditor } from '@editora/react';
import {
  BlockquotePlugin, BoldPlugin, ClearFormattingPlugin, HeadingPlugin, HistoryPlugin, ItalicPlugin, LinkPlugin,
  ListPlugin, StrikethroughPlugin, TablePlugin, TextAlignmentPlugin, UnderlinePlugin, ChecklistPlugin,
} from '@editora/plugins/lite';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/plugins/styles.css';

// Plugins are created once, outside the component, so the editor is not rebuilt on every render.
const BASIC = [BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), LinkPlugin(), ListPlugin(), HistoryPlugin()];
const FULL = [
  HeadingPlugin(), BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), StrikethroughPlugin(), LinkPlugin(), ListPlugin(),
  ChecklistPlugin(), BlockquotePlugin(), TablePlugin(), TextAlignmentPlugin(), ClearFormattingPlugin(), HistoryPlugin(),
];
const TOOLBARS = {
  basic: 'undo redo | bold italic underline | link | bullist numlist',
  full: 'undo redo | heading | bold italic underline strikethrough | link blockquote table | bullist numlist checklist | textAlignment | clearFormatting',
};

type Props = {
  value: string;
  onChange: (html: string) => void;
  variant?: 'basic' | 'full';
  placeholder?: string;
  minHeight?: number;
  id?: string;
  className?: string;
  /** Id of the visible label for the editor. */
  labelledBy?: string;
};

/** The Editora rich-text editor, set up the way Larkspur uses it (mail, notes, journal). */
export function RichText({ value, onChange, variant = 'basic', placeholder, minHeight = 180, id, className, labelledBy }: Props) {
  return (
    <EditoraEditor
      id={id}
      className={className}
      value={value}
      onChange={onChange}
      plugins={variant === 'full' ? FULL : BASIC}
      toolbar={{ items: TOOLBARS[variant], sticky: variant === 'full' }}
      statusbar={{ enabled: variant === 'full' }}
      placeholder={placeholder}
      ariaLabelledBy={labelledBy}
      content={{ minHeight }}
    />
  );
}

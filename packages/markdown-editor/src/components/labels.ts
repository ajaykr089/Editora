/**
 * Every piece of text the markdown editor shows or announces, so it can be translated. Pass `labels` to
 * `MarkdownEditor` with the entries to change; the rest stay English.
 *
 * Not covered: the text of the status bar (counts, "Ln"/"Col"), which `@editora/core` draws, and the toolbar
 * of the rich-text surface (`editorType="rich"`), which belongs to `@editora/react`.
 */

export type MarkdownCommandName =
  | 'undo'
  | 'redo'
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'link'
  | 'image'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'quote'
  | 'inlineCode'
  | 'codeBlock'
  | 'table'
  | 'horizontalRule';

export interface MarkdownEditorLabels {
  /** The title in the header. */
  title: string;
  /** Names of the two switches in the header (read by assistive technology). */
  editorTypeGroup: string;
  viewGroup: string;
  /** Editing surface: the markdown text, or a rich-text surface. */
  source: string;
  richText: string;
  /** Layout: the editing pane, both, or the preview. */
  edit: string;
  split: string;
  preview: string;
  /** Heading above the preview, and its landmark name. */
  previewHeading: string;
  previewRegion: string;
  emptyPreview: string;
  enterFullscreen: string;
  exitFullscreen: string;
  /** Name of the editing area for assistive technology. */
  sourceTextbox: string;
  /** Read after the name of the editing area: how to leave it with the keyboard, since Tab indents there. */
  sourceHint: string;
  /** Language shown in the status bar. */
  statusLanguage: string;

  /** Summary of the collapsed front matter block in the preview. */
  frontMatter: string;
  /** Heading of the footnotes section (read by assistive technology only). */
  footnotes: string;
  /** Link back from a footnote to its reference; {0} is the footnote's label. */
  backToReference: string;
  /** Name of the checkbox of a completed task-list item in the preview (read by assistive technology only). */
  taskDone: string;
  /** Name of the checkbox of an open task-list item in the preview. */
  taskTodo: string;

  toolbar: string;
  /** The heading menu: its title, its name for assistive technology, and the name of the current level ({0}). */
  heading: string;
  headingMenu: string;
  headingLevel: string;
  paragraph: string;
  /** Name of a heading level; {0} is the number. */
  headingN: string;

  /** Name (and tooltip) of each toolbar button. */
  commands: Record<MarkdownCommandName, string>;
}

export type MarkdownEditorLabelsInput = Partial<Omit<MarkdownEditorLabels, 'commands'>> & {
  commands?: Partial<MarkdownEditorLabels['commands']>;
};

export const DEFAULT_LABELS: MarkdownEditorLabels = {
  title: 'Markdown',
  editorTypeGroup: 'Editor type',
  viewGroup: 'Editor view',
  source: 'Source',
  richText: 'Rich text',
  edit: 'Edit',
  split: 'Split',
  preview: 'Preview',
  previewHeading: 'Preview',
  previewRegion: 'Markdown preview',
  emptyPreview: 'Nothing to preview yet.',
  enterFullscreen: 'Enter fullscreen',
  exitFullscreen: 'Exit fullscreen',
  sourceTextbox: 'Markdown source',
  sourceHint: 'Tab indents. Press Escape, then Tab, to leave the editor.',
  statusLanguage: 'Markdown',

  frontMatter: 'Front matter',
  footnotes: 'Footnotes',
  backToReference: 'Back to reference {0}',
  taskDone: 'Completed task',
  taskTodo: 'Open task',

  toolbar: 'Markdown formatting',
  heading: 'Heading',
  headingMenu: 'Heading level',
  headingLevel: 'Heading level: {0}',
  paragraph: 'Paragraph',
  headingN: 'Heading {0}',

  commands: {
    undo: 'Undo',
    redo: 'Redo',
    bold: 'Bold',
    italic: 'Italic',
    strikethrough: 'Strikethrough',
    link: 'Link',
    image: 'Image',
    bulletList: 'Bullet list',
    orderedList: 'Numbered list',
    taskList: 'Task list',
    quote: 'Quote',
    inlineCode: 'Inline code',
    codeBlock: 'Code block',
    table: 'Table',
    horizontalRule: 'Horizontal rule',
  },
};

/** The labels with the given entries replacing the English ones. Anything not a string is ignored. */
export function resolveLabels(input?: MarkdownEditorLabelsInput): MarkdownEditorLabels {
  if (!input) return DEFAULT_LABELS;
  const { commands, ...rest } = input;
  const resolved: MarkdownEditorLabels = { ...DEFAULT_LABELS, commands: { ...DEFAULT_LABELS.commands } };
  for (const key of Object.keys(rest) as Array<keyof Omit<MarkdownEditorLabels, 'commands'>>) {
    const value = rest[key];
    if (typeof value === 'string') resolved[key] = value;
  }
  for (const key of Object.keys(commands ?? {}) as MarkdownCommandName[]) {
    const value = commands?.[key];
    if (key in DEFAULT_LABELS.commands && typeof value === 'string') resolved.commands[key] = value;
  }
  return resolved;
}

/** Fills {0} in a label. */
export const fillLabel = (label: string, value: string | number): string => label.replace('{0}', String(value));

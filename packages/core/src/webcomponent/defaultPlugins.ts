/**
 * Which plugins <editora-editor> loads when the page does not list them in `plugins`.
 */
import { TOOLBAR_ITEM_ALIASES } from '../ui/ToolbarRenderer';

/**
 * The plugins a bare <editora-editor> loads: text formatting, headings, quotes, lists, links, tables and
 * undo/redo. Everything else loads when the page asks for it (see `pluginsForToolbarItems`), or when
 * `plugins` names it.
 */
export const DEFAULT_PLUGINS: readonly string[] = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'clearFormatting',
  'heading',
  'blockquote',
  'list',
  'link',
  'table',
  'history',
];

/**
 * The names `@editora/core/webcomponent` registers its plugins under (see builtInPlugins.ts). A registered
 * plugin that is not one of these, such as one the page registered itself, loads by default.
 */
export const BUILT_IN_PLUGIN_NAMES: ReadonlySet<string> = new Set([
  'bold', 'italic', 'underline', 'strikethrough', 'clearFormatting', 'heading', 'blockquote', 'code',
  'codeSample', 'list', 'checklist', 'textAlignment', 'indent', 'direction', 'textColor', 'backgroundColor',
  'fontSize', 'fontFamily', 'formatPainter', 'format-painter', 'formatpainter', 'lineHeight',
  'capitalization', 'history', 'link', 'table', 'trackChanges', 'versionDiff', 'version-diff', 'versiondiff',
  'conditionalContent', 'conditional-content', 'conditionalcontent', 'dataBinding', 'data-binding',
  'databinding', 'docSchema', 'doc-schema', 'docschema', 'translationWorkflow', 'translation-workflow',
  'translationworkflow', 'contentRules', 'content-rules', 'contentrules', 'citations', 'citation',
  'approvalWorkflow', 'approval-workflow', 'approvalworkflow', 'piiRedaction', 'pii-redaction',
  'piiredaction', 'smartPaste', 'smart-paste', 'smartpaste', 'blocksLibrary', 'blocks-library',
  'blockslibrary', 'mentions', 'mention', 'anchor', 'embedIframe', 'math', 'image', 'mergeTag', 'pageBreak',
  'print', 'preview', 'specialCharacters', 'slashCommands', 'slash-commands', 'spellCheck', 'emojis',
  'a11yChecker', 'comments', 'collaboration', 'document-manager', 'fullscreen', 'template', 'footnote',
]);

/** `plugins="all"` loads every registered plugin, as a bare tag did before 1.1.0. */
export const ALL_PLUGINS_KEYWORD = 'all';

/**
 * The plugin each toolbar command belongs to, under the name the bundles register it by. Kept in step
 * with the plugins by `__tests__/defaultPlugins.registry.test.ts`.
 */
export const TOOLBAR_COMMAND_PLUGINS: Readonly<Record<string, string>> = {
  toggleBold: 'bold',
  toggleItalic: 'italic',
  toggleUnderline: 'underline',
  toggleStrikethrough: 'strikethrough',
  clearFormatting: 'clearFormatting',
  setBlockType: 'heading',
  toggleBlockquote: 'blockquote',
  toggleSourceView: 'code',
  insertCodeBlock: 'codeSample',
  toggleBulletList: 'list',
  toggleOrderedList: 'list',
  toggleChecklist: 'checklist',
  setTextAlignment: 'textAlignment',
  increaseIndent: 'indent',
  decreaseIndent: 'indent',
  setDirectionLTR: 'direction',
  setDirectionRTL: 'direction',
  openTextColorPicker: 'textColor',
  openBackgroundColorPicker: 'backgroundColor',
  fontSize: 'fontSize',
  setFontFamily: 'fontFamily',
  toggleFormatPainter: 'formatPainter',
  setLineHeight: 'lineHeight',
  setCapitalization: 'capitalization',
  undo: 'history',
  redo: 'history',
  openLinkDialog: 'link',
  insertTable: 'table',
  toggleTrackChanges: 'trackChanges',
  openVersionDiff: 'versionDiff',
  conditionalContent: 'conditionalContent',
  openDataBindingDialog: 'dataBinding',
  docSchema: 'docSchema',
  translationWorkflow: 'translationWorkflow',
  contentRules: 'contentRules',
  citations: 'citations',
  approvalWorkflow: 'approvalWorkflow',
  piiRedaction: 'piiRedaction',
  smartPaste: 'smartPaste',
  blocksLibrary: 'blocksLibrary',
  insertMention: 'mentions',
  insertAnchor: 'anchor',
  openEmbedIframeDialog: 'embedIframe',
  insertMath: 'math',
  insertImage: 'image',
  insertVideo: 'image',
  insertMergeTag: 'mergeTag',
  insertPageBreak: 'pageBreak',
  print: 'print',
  togglePreview: 'preview',
  insertSpecialCharacter: 'specialCharacters',
  openSlashCommands: 'slashCommands',
  toggleSpellCheck: 'spellCheck',
  openEmojiDialog: 'emojis',
  toggleA11yChecker: 'a11yChecker',
  addComment: 'comments',
  toggleComments: 'comments',
  importWord: 'document-manager',
  exportWord: 'document-manager',
  exportPdf: 'document-manager',
  toggleFullscreen: 'fullscreen',
  insertTemplate: 'template',
  insertFootnote: 'footnote',
};

/**
 * The plugins a toolbar string needs: `"undo redo | bold | fontSize textColor"` needs history, bold,
 * fontSize and textColor. A name can be a toolbar alias (`bullist`), a command (`toggleBulletList`) or
 * a plugin's registered name; names that match none of them are skipped.
 */
export function pluginsForToolbarItems(items: string | undefined, isRegistered: (name: string) => boolean): string[] {
  if (!items) return [];
  const names: string[] = [];
  for (const token of items.split(/[\s|]+/)) {
    if (!token) continue;
    const command = TOOLBAR_ITEM_ALIASES[token] || token;
    const plugin = TOOLBAR_COMMAND_PLUGINS[command] ?? TOOLBAR_COMMAND_PLUGINS[token] ?? (isRegistered(token) ? token : undefined);
    if (plugin && !names.includes(plugin)) names.push(plugin);
  }
  return names;
}

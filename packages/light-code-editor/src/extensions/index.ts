/**
 * Lightweight Code Editor - Built-in Extensions
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

// Export all built-in extensions
export { LineNumbersExtension } from './LineNumbersExtension';
export { ThemeExtension } from './ThemeExtension';
export { ReadOnlyExtension } from './ReadOnlyExtension';
export { SearchExtension } from './SearchExtension';
export type { SearchExtensionConfig } from './SearchExtension';
export { BracketMatchingExtension } from './BracketMatchingExtension';
export { CodeFoldingExtension } from './CodeFoldingExtension';
export { DiagnosticsExtension } from './DiagnosticsExtension';
export type { DiagnosticsExtensionConfig } from './DiagnosticsExtension';
export { CompletionExtension } from './CompletionExtension';
export type { CompletionExtensionConfig } from './CompletionExtension';
export { FormattingExtension } from './FormattingExtension';
export type { FormattingExtensionConfig } from './FormattingExtension';
export { ContextMenuExtension } from './ContextMenuExtension';
export type {
  ContextMenuExtensionConfig,
  ContextMenuItem,
  ContextMenuCommandItem,
  ContextMenuActionItem,
  ContextMenuSeparatorItem,
} from './ContextMenuExtension';
export { EditingCommandsExtension } from './EditingCommandsExtension';
export type { EditingCommandsExtensionConfig } from './EditingCommandsExtension';
export { ActiveLineAndIndentGuidesExtension } from './ActiveLineAndIndentGuidesExtension';
export type { ActiveLineAndIndentGuidesExtensionConfig } from './ActiveLineAndIndentGuidesExtension';
export { HoverTooltipAndCodeActionsExtension } from './HoverTooltipAndCodeActionsExtension';
export type { HoverTooltipAndCodeActionsExtensionConfig } from './HoverTooltipAndCodeActionsExtension';
export {
  LanguageServiceExtension,
  createLanguageServiceExtensions,
} from './LanguageServiceExtension';
export type {
  LanguageServiceAdapterConfig,
  LanguageServiceExtensionBundle,
} from './LanguageServiceExtension';
export type {
  LanguageServiceCodeAction,
  LanguageServiceCodeActionContext,
  LanguageServiceCodeActionsProvider,
  LanguageServiceDiagnosticsContext,
  LanguageServiceDiagnosticsProvider,
  LanguageServiceDocumentSnapshot,
  LanguageServiceHighlightContext,
  LanguageServiceHighlighter,
  LanguageServiceHoverContext,
  LanguageServiceHoverProvider,
  LanguageServiceHoverResult,
} from '../types';
export { SyntaxHighlightingExtension } from './SyntaxHighlightingExtension';
export { KeymapExtension } from './KeymapExtension';

declare module '@editora/light-code-editor' {
  export type ExtensionCtor = new (...args: any[]) => any;

  export class EditorCore {}
  export function createEditor(...args: any[]): EditorCore;

  export const LineNumbersExtension: ExtensionCtor;
  export const ThemeExtension: ExtensionCtor;
  export const ReadOnlyExtension: ExtensionCtor;
  export const SearchExtension: ExtensionCtor;
  export const BracketMatchingExtension: ExtensionCtor;
  export const CodeFoldingExtension: ExtensionCtor;
  export const SyntaxHighlightingExtension: ExtensionCtor;
}

declare module '@editora/light-code-editor' {
  export type ExtensionCtor = new (...args: any[]) => any;

  export class EditorCore {
    on(event: string, handler: (...args: any[]) => void): void;
    off(event: string, handler?: (...args: any[]) => void): void;
    getValue(): string;
    focus(): void;
    setTheme(theme: string): void;
    setReadOnly(readOnly: boolean): void;
    destroy(): void;
  }
  export function createEditor(...args: any[]): EditorCore;

  export const LineNumbersExtension: ExtensionCtor;
  export const ThemeExtension: ExtensionCtor;
  export const ReadOnlyExtension: ExtensionCtor;
  export const SearchExtension: ExtensionCtor;
  export const BracketMatchingExtension: ExtensionCtor;
  export const CodeFoldingExtension: ExtensionCtor;
  export const SyntaxHighlightingExtension: ExtensionCtor;
}

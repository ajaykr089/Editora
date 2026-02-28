export interface NodeSpec {
  [key: string]: unknown;
}

export interface Node {
  [key: string]: unknown;
}

export class Schema {
  constructor(nodes?: Record<string, NodeSpec>, marks?: Record<string, NodeSpec>);
}

export interface EditorSelection {
  start: number;
  end: number;
  isCollapsed: boolean;
}

export class EditorState {
  doc: unknown;
  selection: EditorSelection;
  schema?: Schema;
  static create(schema?: Schema): EditorState;
  apply(doc: unknown): EditorState;
}

export interface ToolbarItem {
  id?: string;
  label: string;
  command?: string;
  icon?: string;
  type?: "button" | "dropdown" | "input" | "inline-menu" | "separator" | "group";
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  shortcut?: string;
  items?: ToolbarItem[];
}

export interface PluginContext {
  provider?: (props: { children: unknown }) => unknown;
  initialize?: () => void;
  destroy?: () => void;
  onEditorReady?: (editor: unknown) => void;
}

export type PluginMode = "local" | "api" | "hybrid";

export interface PluginConfig {
  mode?: PluginMode;
  apiUrl?: string;
  apiKey?: string;
  timeout?: number;
  fallbackToLocal?: boolean;
  retryAttempts?: number;
  offline?: {
    enabled?: boolean;
    cacheStrategy?: "memory" | "indexeddb" | "localstorage";
  };
  [key: string]: unknown;
}

export type PluginCommandResult =
  | EditorState
  | null
  | boolean
  | void
  | Promise<EditorState | null | boolean | void>;

export type PluginCommand = (...args: any[]) => PluginCommandResult;

export interface Plugin {
  name: string;
  nodes?: Record<string, NodeSpec>;
  marks?: Record<string, NodeSpec>;
  commands?: Record<string, PluginCommand>;
  toolbar?: ToolbarItem[];
  keymap?: Record<string, string | ((...args: unknown[]) => unknown)>;
  context?: PluginContext;
  config?: PluginConfig;
  init?: (...args: any[]) => void | Promise<void>;
  initialize?: (config?: PluginConfig) => void | Promise<void>;
  destroy?: (...args: any[]) => void | Promise<void>;
  executeLocal?: (command: string, ...args: any[]) => unknown;
  executeAPI?: (command: string, ...args: any[]) => Promise<unknown>;
  executeHybrid?: (command: string, ...args: any[]) => Promise<unknown>;
}

export class PluginManager {
  plugins: Plugin[];
  register(plugin: Plugin, config?: PluginConfig): void;
  unregister(pluginName: string): void;
  getPlugin(name: string): Plugin | undefined;
  buildSchema(): Schema;
  getCommands(): Record<string, PluginCommand>;
  getToolbarItems(): ToolbarItem[];
}

export interface EditorOptions {
  element?: HTMLElement;
  toolbarElement?: HTMLElement;
  content?: string;
  plugins?: Plugin[];
  shortcuts?: boolean;
  enableToolbar?: boolean;
  [key: string]: unknown;
}

export class Editor {
  state: EditorState;
  pluginManager: PluginManager;
  constructor(pluginManagerOrOptions: PluginManager | EditorOptions);
  onChange(fn: (state: EditorState) => void): () => void;
  on(event: string, fn: (state: EditorState | string) => void): () => void;
  getElement(): HTMLElement | null;
  execCommand(name: string, value?: unknown): boolean;
  setContent(doc: Node | string): void;
  getContent(): Node | string;
  destroy(): void;
}

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  command: string;
  params?: unknown;
  description?: string;
  preventDefault?: boolean;
}

export interface KeyboardShortcutConfig {
  shortcuts?: KeyboardShortcut[];
  enabled?: boolean;
  customShortcuts?: Record<string, KeyboardShortcut>;
}

export class KeyboardShortcutManager {
  constructor(config?: KeyboardShortcutConfig);
  registerShortcut(shortcut: KeyboardShortcut): void;
  unregisterShortcut(key: string): boolean;
  handleKeyDown(
    event: KeyboardEvent,
    commandHandler?: (command: string, params?: unknown) => void,
  ): boolean;
  enable(): void;
  disable(): void;
  isEnabled(): boolean;
  getAllShortcuts(): KeyboardShortcut[];
  getShortcutForCommand(command: string): KeyboardShortcut | undefined;
  getShortcutsHelp(): string;
}

export interface FloatingToolbarConfig {
  enabled?: boolean;
  items?: string;
  anchorToSelection?: boolean;
}

export class FloatingToolbar {
  constructor(config: FloatingToolbarConfig);
  create(parentElement: HTMLElement): HTMLElement;
  show(x: number, y: number): void;
  hide(): void;
  updatePosition(x: number, y: number): void;
  isVisible(): boolean;
  destroy(): void;
}

export interface StatusBarConfig {
  enabled?: boolean;
  position?: "top" | "bottom";
}

export interface StatusInfo {
  wordCount: number;
  charCount: number;
  lineCount: number;
  cursorPosition?: { line: number; column: number };
  selectionInfo?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
    selectedChars: number;
    selectedWords: number;
  };
}

export class StatusBar {
  constructor(config: StatusBarConfig);
  create(container: HTMLElement): void;
  update(info: Partial<StatusInfo>): void;
  destroy(): void;
}

export interface ToolbarConfig {
  items?: string;
  sticky?: boolean;
  position?: "top" | "bottom";
  floating?: boolean;
}

export interface ToolbarButton {
  id?: string;
  label: string;
  command?: string;
  icon?: string;
  placeholder?: string;
  type?: "button" | "dropdown" | "input" | "separator" | "inline-menu" | "group";
  options?: Array<{ label: string; value: string }>;
  active?: boolean;
  disabled?: boolean;
  items?: ToolbarButton[];
}

export class ToolbarRenderer {
  constructor(config: ToolbarConfig, plugins: Plugin[], pluginLoader?: unknown);
  setCommandHandler(handler: (command: string, value?: unknown) => void): void;
  render(container: HTMLElement): void;
  updateButtonState(
    command: string,
    state: { active?: boolean; disabled?: boolean },
  ): void;
  destroy(): void;
}

export interface EditorEngineConfig {
  toolbar?: ToolbarConfig;
  statusBar?: StatusBarConfig;
  shortcuts?: KeyboardShortcutConfig;
}

export type CommandHandler = (...args: unknown[]) => unknown;

export class CommandRegistry {
  register(command: string, handler: CommandHandler): void;
  unregister(command: string): boolean;
  execute(command: string, ...args: unknown[]): unknown;
  has(command: string): boolean;
  clear(): void;
}

export class EditorEngine {
  constructor(element: HTMLElement, config?: EditorEngineConfig);
  init(): void;
  destroy(): void;
  getContent(): string;
  setContent(content: string): void;
  focus(): void;
  blur(): void;
}

export class DocumentModel {
  [key: string]: unknown;
}

export interface Selection {
  start: number;
  end: number;
}

export interface ConfigSource {
  [key: string]: unknown;
}

export interface EditorConfigDefaults {
  [key: string]: unknown;
}

export class ConfigResolver {
  constructor(defaults?: EditorConfigDefaults);
  resolve(...sources: Array<ConfigSource | undefined>): EditorConfigDefaults;
}

export interface PluginLoadConfig {
  [key: string]: unknown;
}

export class PluginLoader {
  constructor(config?: PluginLoadConfig);
  load(pluginName: string): Promise<Plugin | null>;
}

export interface ReactAdapterOptions {
  [key: string]: unknown;
}

export interface ReactEditorAPI {
  [key: string]: unknown;
}

export class ReactAdapter {
  constructor(options?: ReactAdapterOptions);
  mount(element: HTMLElement): void;
  unmount(): void;
}

export function createReactAdapter(options?: ReactAdapterOptions): ReactAdapter;

export interface VanillaAdapterOptions {
  [key: string]: unknown;
}

export class VanillaAdapter {
  constructor(options?: VanillaAdapterOptions);
  mount(element: HTMLElement): void;
  destroy(): void;
}

export interface EditorAPI {
  getHTML(): string;
  setHTML(html: string): void;
  execCommand(command: string, value?: unknown): void;
  focus(): void;
  blur(): void;
  destroy(): void;
}

export class RichTextEditorElement extends HTMLElement {
  readonly api?: EditorAPI;
  getHTML(): string;
  setHTML(html: string): void;
  setReadonly(readonly: boolean): void;
}

export function initWebComponent(): void;
export function createEditor(options: unknown): VanillaAdapter;
export function createPluginManager(): PluginManager;

export function getCursorPosition(
  contentElement: HTMLElement,
  range: Range,
): { line: number; column: number };

export function getTextOffset(
  rootElement: HTMLElement,
  node: globalThis.Node,
  offset: number,
): number;

export function countLines(contentElement: HTMLElement): number;
export function calculateTextStats(text: string): { words: number; chars: number };
export function getSelectionInfo(
  range: Range,
  cursorPosition: { line: number; column: number },
): {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  selectedChars: number;
  selectedWords: number;
};

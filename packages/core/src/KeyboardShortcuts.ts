/**
 * Keyboard Shortcuts Manager
 * Provides keyboard shortcut handling for the rich text editor.
 */

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean; // Command key on Mac
  command: string;
  params?: any;
  description?: string;
  preventDefault?: boolean;
  /**
   * Runs instead of `command` (a plugin keymap entry that is a function). Returning `false` means it did nothing, so
   * the key is left to the browser.
   */
  run?: (event: KeyboardEvent) => boolean | void;
}

export interface KeyboardShortcutConfig {
  shortcuts?: KeyboardShortcut[];
  enabled?: boolean;
  customShortcuts?: Record<string, KeyboardShortcut>;
  /**
   * The built-in list (Mod+B bold, Mod+Alt+1 heading 1, ...). On by default. The editors turn it off and use the
   * keymaps of the plugins they load, so a key does something only when a plugin for it is there.
   */
  defaults?: boolean;
}

/** A plugin keymap value: a command name, a command with its argument, or a function (see `KeyboardShortcut.run`). */
export type KeymapBinding =
  | string
  | { command: string; params?: unknown }
  | ((event?: KeyboardEvent, ...args: any[]) => boolean | void);

/** Keymap keys name the event key: `Tab`, `Enter`, `ArrowLeft`, `F7`, `Space`. Other names they may use: */
const KEYMAP_KEY_NAMES: Record<string, string> = { space: ' ', esc: 'escape', del: 'delete', left: 'arrowleft', right: 'arrowright', up: 'arrowup', down: 'arrowdown' };

/** The character a punctuation key cap types without Shift, by `event.code`. */
const PUNCTUATION_CODES: Record<string, string> = {
  Period: '.', Comma: ',', Semicolon: ';', Slash: '/', Backslash: '\\', BracketLeft: '[', BracketRight: ']',
  Quote: "'", Minus: '-', Equal: '=', Backquote: '`',
};

export class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private enabled: boolean = true;
  private isMac: boolean;

  constructor(config?: KeyboardShortcutConfig) {
    this.isMac = typeof navigator !== 'undefined' &&
                 navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    if (config?.enabled === false) {
      this.enabled = false;
    }

    // Register default shortcuts
    if (config?.defaults !== false) this.registerDefaultShortcuts();

    // Register custom shortcuts
    if (config?.shortcuts) {
      config.shortcuts.forEach(shortcut => this.registerShortcut(shortcut));
    }

    if (config?.customShortcuts) {
      Object.values(config.customShortcuts).forEach(shortcut => {
        this.registerShortcut(shortcut);
      });
    }
  }

  private registerDefaultShortcuts(): void {
    // Text Formatting Shortcuts
    this.registerShortcut({
      key: 'b',
      ctrl: !this.isMac,
      meta: this.isMac,
      command: 'toggleBold',
      description: 'Bold',
      preventDefault: true
    });

    this.registerShortcut({
      key: 'i',
      ctrl: !this.isMac,
      meta: this.isMac,
      command: 'toggleItalic',
      description: 'Italic',
      preventDefault: true
    });

    this.registerShortcut({
      key: 'u',
      ctrl: !this.isMac,
      meta: this.isMac,
      command: 'toggleUnderline',
      description: 'Underline',
      preventDefault: true
    });

    this.registerShortcut({
      key: 'd',
      ctrl: !this.isMac,
      meta: this.isMac,
      command: 'toggleStrikethrough',
      description: 'Strikethrough',
      preventDefault: true
    });

    // History Shortcuts
    this.registerShortcut({
      key: 'z',
      ctrl: !this.isMac,
      meta: this.isMac,
      command: 'undo',
      description: 'Undo',
      preventDefault: true
    });

    this.registerShortcut({
      key: 'z',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      command: 'redo',
      description: 'Redo',
      preventDefault: true
    });

    this.registerShortcut({
      key: 'y',
      ctrl: !this.isMac,
      meta: this.isMac,
      command: 'redo',
      description: 'Redo',
      preventDefault: true
    });

    // Heading Shortcuts (Ctrl+Alt+1-6)
    for (let i = 1; i <= 6; i++) {
      this.registerShortcut({
        key: String(i),
        ctrl: !this.isMac,
        meta: this.isMac,
        alt: true,
        command: 'setBlockType',
        params: `h${i}`,
        description: `Heading ${i}`,
        preventDefault: true
      });
    }

    // Paragraph shortcut
    this.registerShortcut({
      key: '7',
      ctrl: !this.isMac,
      meta: this.isMac,
      alt: true,
      command: 'setBlockType',
      params: 'p',
      description: 'Paragraph',
      preventDefault: true
    });

    // List Shortcuts
    this.registerShortcut({
      key: '7',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      command: 'toggleOrderedList',
      description: 'Numbered List',
      preventDefault: true
    });

    this.registerShortcut({
      key: '8',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      command: 'toggleBulletList',
      description: 'Bullet List',
      preventDefault: true
    });

    // Link Shortcut
    this.registerShortcut({
      key: 'k',
      ctrl: !this.isMac,
      meta: this.isMac,
      command: 'openLinkDialog',
      description: 'Insert/Edit Link',
      preventDefault: true
    });

    // Code Block Shortcut
    this.registerShortcut({
      key: 'e',
      ctrl: !this.isMac,
      meta: this.isMac,
      alt: true,
      command: 'insertCodeBlock',
      description: 'Code Block',
      preventDefault: true
    });

    // Blockquote Shortcut
    this.registerShortcut({
      key: 'q',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      command: 'toggleBlockquote',
      description: 'Blockquote',
      preventDefault: true
    });

    // Alignment Shortcuts
    this.registerShortcut({
      key: 'l',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      command: 'setTextAlignment',
      params: 'left',
      description: 'Align Left',
      preventDefault: true
    });

    this.registerShortcut({
      key: 'e',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      alt: true,
      command: 'setTextAlignment',
      params: 'center',
      description: 'Align Center',
      preventDefault: true
    });

    this.registerShortcut({
      key: 'r',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      command: 'setTextAlignment',
      params: 'right',
      description: 'Align Right',
      preventDefault: true
    });

    this.registerShortcut({
      key: 'j',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      command: 'setTextAlignment',
      params: 'justify',
      description: 'Justify',
      preventDefault: true
    });

    // Clear Formatting
    this.registerShortcut({
      key: '\\',
      ctrl: !this.isMac,
      meta: this.isMac,
      command: 'clearFormatting',
      description: 'Clear Formatting',
      preventDefault: true
    });

    // Indent/Outdent
    this.registerShortcut({
      key: ']',
      ctrl: !this.isMac,
      meta: this.isMac,
      command: 'increaseIndent',
      description: 'Indent',
      preventDefault: true
    });

    this.registerShortcut({
      key: '[',
      ctrl: !this.isMac,
      meta: this.isMac,
      command: 'decreaseIndent',
      description: 'Outdent',
      preventDefault: true
    });

    // Insert Image
    this.registerShortcut({
      key: 'g',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      command: 'insertImage',
      description: 'Insert Image',
      preventDefault: true
    });

    // Insert Table
    this.registerShortcut({
      key: 't',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      alt: true,
      command: 'insertTable',
      description: 'Insert Table',
      preventDefault: true
    });

    // Fullscreen
    this.registerShortcut({
      key: 'f11',
      command: 'toggleFullscreen',
      description: 'Toggle Fullscreen',
      preventDefault: true
    });

    // Preview
    this.registerShortcut({
      key: 'p',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      command: 'togglePreview',
      description: 'Preview',
      preventDefault: true
    });

    // Print
    this.registerShortcut({
      key: 'p',
      ctrl: !this.isMac,
      meta: this.isMac,
      command: 'print',
      description: 'Print',
      preventDefault: true
    });

    // Special Characters
    this.registerShortcut({
      key: 's',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      alt: true,
      command: 'insertSpecialCharacter',
      description: 'Insert Special Character',
      preventDefault: true
    });

    // Insert Emoji
    this.registerShortcut({
      key: 'm',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      command: 'insertEmoji',
      description: 'Insert Emoji',
      preventDefault: true
    });

    // Checklist
    this.registerShortcut({
      key: '9',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      command: 'toggleChecklist',
      description: 'Checklist',
      preventDefault: true
    });

    // Accessibility Checker
    this.registerShortcut({
      key: 'a',
      ctrl: !this.isMac,
      meta: this.isMac,
      shift: true,
      alt: true,
      command: 'toggleA11yChecker',
      description: 'Accessibility Checker',
      preventDefault: true
    });

    // Spell Check
    this.registerShortcut({
      key: 'F7',
      command: 'toggleSpellCheck',
      description: 'Spell Check',
      preventDefault: true
    });

    // Insert Math
    this.registerShortcut({
      key: 'm',
      ctrl: !this.isMac,
      meta: this.isMac,
      alt: true,
      command: 'insertMath',
      description: 'Insert Math',
      preventDefault: true
    });

    // Insert Footnote
    this.registerShortcut({
      key: 'f',
      ctrl: !this.isMac,
      meta: this.isMac,
      alt: true,
      command: 'insertFootnote',
      description: 'Insert Footnote',
      preventDefault: true
    });
  }

  registerShortcut(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  /**
   * Parses a keymap key such as `Mod-Shift-Enter`, `Mod-Alt-1`, `Shift-Tab` or `F7`. `Mod` is Cmd on a Mac and Ctrl
   * elsewhere; `Ctrl`, `Cmd`/`Meta`, `Alt`/`Option` and `Shift` mean those keys. Returns null for a key it cannot read.
   */
  parseKeymapKey(spec: string): Omit<KeyboardShortcut, 'command'> | null {
    const parts = spec.split(/-(?!$)/);
    const keyName = parts.pop();
    if (!keyName) return null;
    const shortcut: Omit<KeyboardShortcut, 'command'> = { key: '' };
    for (const part of parts) {
      switch (part.toLowerCase()) {
        case 'mod': if (this.isMac) shortcut.meta = true; else shortcut.ctrl = true; break;
        case 'ctrl': case 'control': shortcut.ctrl = true; break;
        case 'cmd': case 'meta': shortcut.meta = true; break;
        case 'alt': case 'option': shortcut.alt = true; break;
        case 'shift': shortcut.shift = true; break;
        default: return null;
      }
    }
    const lower = keyName.toLowerCase();
    shortcut.key = KEYMAP_KEY_NAMES[lower] ?? lower;
    return shortcut;
  }

  /**
   * Registers a plugin's `keymap`. Its entries replace whatever was on the same keys. Function entries are called
   * with the event and `context` (the editor they run in).
   */
  registerKeymap(keymap: Record<string, KeymapBinding> | undefined, context?: unknown): void {
    if (!keymap) return;
    for (const [spec, binding] of Object.entries(keymap)) {
      const parsed = this.parseKeymapKey(spec);
      if (!parsed || binding == null) continue;
      if (typeof binding === 'function') {
        this.registerShortcut({ ...parsed, command: spec, run: (event) => binding(event, context) });
      } else if (typeof binding === 'string') {
        this.registerShortcut({ ...parsed, command: binding });
      } else if (typeof binding === 'object' && typeof binding.command === 'string') {
        this.registerShortcut({ ...parsed, command: binding.command, params: binding.params });
      }
    }
  }

  /** Removes every shortcut. */
  clear(): void {
    this.shortcuts.clear();
  }

  /**
   * Keeps Mod+B, Mod+I and Mod+U from the browser when no plugin uses them: in an editable area Chromium and WebKit
   * format the text themselves, which would add bold, italic or underline to an editor that has none. A plugin's
   * keymap registered afterwards replaces these.
   */
  blockNativeFormattingKeys(): void {
    const keep = () => true;
    this.registerKeymap({ 'Mod-b': keep, 'Mod-i': keep, 'Mod-u': keep });
  }

  unregisterShortcut(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.delete(key);
  }

  private getShortcutKey(shortcut: KeyboardShortcut): string {
    const parts = [];
    if (shortcut.ctrl) parts.push('ctrl');
    if (shortcut.alt) parts.push('alt');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.meta) parts.push('meta');
    parts.push(shortcut.key.toLowerCase());
    return parts.join('+');
  }

  private getEventKey(event: KeyboardEvent, key: string = event.key): string {
    const parts = [];
    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');
    parts.push(key.toLowerCase());
    return parts.join('+');
  }

  /**
   * The key on the keyboard, whatever character it types: `Digit8` is "8" even with Shift held (when `event.key` is
   * "*"), and `KeyB` is "b" when Option changes the character on a Mac.
   */
  private keyFromCode(code: string | undefined): string | null {
    if (!code) return null;
    const match = /^(?:Digit|Key)([0-9A-Z])$/.exec(code);
    if (match) return match[1].toLowerCase();
    return PUNCTUATION_CODES[code] ?? null;
  }

  /**
   * True when the key types a character with AltGr, which Windows and Linux report as Ctrl+Alt: "{" for AltGr+7 and
   * "€" for AltGr+E on a German keyboard. That is typing, not Ctrl+Alt+7 or Ctrl+Alt+E.
   */
  private typesWithAltGr(event: KeyboardEvent, physical: string): boolean {
    if (typeof event.getModifierState === 'function' && event.getModifierState('AltGraph')) return true;
    return event.ctrlKey && event.altKey && !event.metaKey && event.key.length === 1 && event.key.toLowerCase() !== physical;
  }

  /**
   * Runs the shortcut for `event`, if there is one. The key is blocked (preventDefault) only when something ran:
   * - `canRun(command)` returning false (no loaded plugin has that command) leaves the key to the browser, so Cmd+P
   *   still prints and Cmd+[ still goes back in an editor without those plugins;
   * - so does `commandExecutor` or a keymap function returning `false`;
   * - an event a plugin already handled (`defaultPrevented`) is left alone.
   */
  handleKeyDown(
    event: KeyboardEvent,
    commandExecutor: (command: string, params?: any) => boolean | void,
    canRun?: (command: string) => boolean,
  ): boolean {
    if (!this.enabled || event.defaultPrevented) return false;

    // The character first, so layouts where it differs from the key cap keep their shortcuts; then the key itself,
    // with a modifier held. Cmd/Ctrl+Shift+7 and +8 (numbered and bullet list) never matched before: with Shift,
    // `event.key` is "&" and "*".
    let shortcut = this.shortcuts.get(this.getEventKey(event));
    const physical = this.keyFromCode(event.code);
    if (!shortcut && physical && (event.ctrlKey || event.metaKey || event.altKey) && !this.typesWithAltGr(event, physical)) {
      shortcut = this.shortcuts.get(this.getEventKey(event, physical));
    }

    if (!shortcut) return false;

    let result: boolean | void;
    if (shortcut.run) {
      result = shortcut.run(event);
    } else {
      if (canRun && !canRun(shortcut.command)) return false;
      result = commandExecutor(shortcut.command, shortcut.params);
    }
    if (result === false) return false;

    if (shortcut.preventDefault !== false) {
      event.preventDefault();
      event.stopPropagation();
    }
    return true;
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getAllShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  getShortcutForCommand(command: string): KeyboardShortcut | undefined {
    return Array.from(this.shortcuts.values()).find(s => s.command === command);
  }

  getShortcutDescription(shortcut: KeyboardShortcut): string {
    const parts = [];
    if (this.isMac) {
      if (shortcut.meta) parts.push('⌘');
      if (shortcut.ctrl) parts.push('⌃');
      if (shortcut.alt) parts.push('⌥');
      if (shortcut.shift) parts.push('⇧');
    } else {
      if (shortcut.ctrl) parts.push('Ctrl');
      if (shortcut.alt) parts.push('Alt');
      if (shortcut.shift) parts.push('Shift');
    }
    
    // Capitalize single letters
    const key = shortcut.key.length === 1 
      ? shortcut.key.toUpperCase() 
      : shortcut.key;
    
    parts.push(key);
    return parts.join('+');
  }

  getShortcutsHelp(): string {
    const shortcuts = this.getAllShortcuts();
    const grouped = new Map<string, KeyboardShortcut[]>();

    shortcuts.forEach(shortcut => {
      const category = this.getShortcutCategory(shortcut.command);
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(shortcut);
    });

    let help = '# Keyboard Shortcuts\n\n';
    grouped.forEach((shortcuts, category) => {
      help += `## ${category}\n\n`;
      shortcuts.forEach(shortcut => {
        const desc = this.getShortcutDescription(shortcut);
        help += `- **${desc}**: ${shortcut.description || shortcut.command}\n`;
      });
      help += '\n';
    });

    return help;
  }

  private getShortcutCategory(command: string): string {
    if (command.includes('toggle') && 
        (command.includes('Bold') || command.includes('Italic') || 
         command.includes('Underline') || command.includes('Strike') ||
         command.includes('Code') || command.includes('Super') || command.includes('Sub'))) {
      return 'Text Formatting';
    }
    if (command.includes('Heading') || command.includes('Paragraph')) {
      return 'Block Formatting';
    }
    if (command.includes('List') || command.includes('Checklist')) {
      return 'Lists';
    }
    if (command.includes('Alignment') || command.includes('Indent')) {
      return 'Alignment & Indentation';
    }
    if (command.includes('undo') || command.includes('redo')) {
      return 'History';
    }
    if (command.includes('insert')) {
      return 'Insert';
    }
    if (command.includes('find') || command.includes('replace')) {
      return 'Find & Replace';
    }
    if (command.includes('Accessibility') || command.includes('spell')) {
      return 'Tools';
    }
    return 'Other';
  }
}

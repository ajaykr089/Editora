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
}

export interface KeyboardShortcutConfig {
  shortcuts?: KeyboardShortcut[];
  enabled?: boolean;
  customShortcuts?: Record<string, KeyboardShortcut>;
}

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
    this.registerDefaultShortcuts();

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

  private getEventKey(event: KeyboardEvent): string {
    const parts = [];
    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');
    parts.push(event.key.toLowerCase());
    return parts.join('+');
  }

  handleKeyDown(event: KeyboardEvent, commandExecutor: (command: string, params?: any) => void): boolean {
    if (!this.enabled) return false;

    const eventKey = this.getEventKey(event);
    const shortcut = this.shortcuts.get(eventKey);

    if (shortcut) {
      if (shortcut.preventDefault !== false) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      commandExecutor(shortcut.command, shortcut.params);
      return true;
    }

    return false;
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

/**
 * Keymap Extension - Platform-aware configurable keyboard bindings
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorCore, KeyBinding, Keymap } from '../types';

export class KeymapExtension implements EditorExtension {
  public readonly name = 'keymap';
  private editor: EditorCore | null = null;
  private keymap: Keymap = {};
  private isMac: boolean;

  constructor(keymap?: Keymap) {
    this.isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    // Set default keymap
    this.keymap = keymap || this.getDefaultKeymap();
  }

  setup(editor: EditorCore): void {
    this.editor = editor;
  }

  private handleKeyDown(event: KeyboardEvent): boolean | void {
    if (!this.editor) return;

    // Find matching key binding
    const binding = this.findMatchingBinding(event);
    if (binding) {
      // Execute the command
      this.editor.executeCommand(binding.command);
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }

  private findMatchingBinding(event: KeyboardEvent): KeyBinding | null {
    const { ctrlKey, altKey, metaKey } = event;

    const byKey = this.matchBindings(this.keymap[String(event.key).toLowerCase()], event);
    if (byKey) return byKey;

    // With a modifier held, `key` is often not the key on the keycap: Shift turns `[` into `{` (so Ctrl+Shift+[ came
    // as "{" and fold never ran), and on a Mac Option turns F into "Ï". Fall back to the physical key in that case.
    // `key` is tried first, so layouts where the letters sit elsewhere (Ctrl+Z on a German keyboard) still match by
    // the letter, not by the position.
    if (!(ctrlKey || altKey || metaKey)) return null;
    const physical = KeymapExtension.keyFromCode(event.code);
    return physical ? this.matchBindings(this.keymap[physical], event) : null;
  }

  private static readonly codePunctuation: Record<string, string> = {
    BracketLeft: '[',
    BracketRight: ']',
    Slash: '/',
    Backslash: '\\',
    Comma: ',',
    Period: '.',
    Minus: '-',
    Equal: '=',
    Semicolon: ';',
    Quote: "'",
    Backquote: '`',
    Space: ' ',
  };

  /** The unshifted character of a physical key on a US keyboard: KeyF -> "f", Digit1 -> "1", BracketLeft -> "[". */
  private static keyFromCode(code: string | undefined): string | null {
    if (!code) return null;
    const letter = /^Key([A-Z])$/.exec(code);
    if (letter) return letter[1].toLowerCase();
    const digit = /^Digit([0-9])$/.exec(code);
    if (digit) return digit[1];
    return KeymapExtension.codePunctuation[code] ?? null;
  }

  private matchBindings(bindings: KeyBinding[] | undefined, event: KeyboardEvent): KeyBinding | null {
    if (!bindings) return null;
    const { ctrlKey, altKey, shiftKey, metaKey } = event;

    // Find match where a modifier in the binding is either unspecified (don't care) or equals the event
    for (const binding of bindings) {
      const ctrlMatch = binding.ctrlKey === undefined || binding.ctrlKey === ctrlKey;
      const altMatch = binding.altKey === undefined || binding.altKey === altKey;
      const shiftMatch = binding.shiftKey === undefined || binding.shiftKey === shiftKey;
      const metaMatch = binding.metaKey === undefined || binding.metaKey === metaKey;

      if (ctrlMatch && altMatch && shiftMatch && metaMatch) {
        return binding;
      }
    }

    return null;
  }

  // Allow EditorCore to call this directly when checking extension.onKeyDown
  onKeyDown(event: KeyboardEvent): boolean | void {
    return this.handleKeyDown(event);
  }

  private getDefaultKeymap(): Keymap {
    const keymap: Keymap = {};

    // Search commands
    this.addBinding(keymap, 'f', { ctrlKey: !this.isMac, metaKey: this.isMac }, 'find');
    this.addBinding(keymap, 'h', { ctrlKey: !this.isMac, metaKey: this.isMac }, 'replace');

    // Navigation
    this.addBinding(keymap, 'f3', {}, 'findNext');
    this.addBinding(keymap, 'f3', { shiftKey: true }, 'findPrev');
    this.addBinding(keymap, 'g', { ctrlKey: !this.isMac, metaKey: this.isMac }, 'findNext');

    // Folding
    this.addBinding(keymap, '[', { ctrlKey: !this.isMac, metaKey: this.isMac, shiftKey: true }, 'fold');
    this.addBinding(keymap, ']', { ctrlKey: !this.isMac, metaKey: this.isMac, shiftKey: true }, 'unfold');

    // Editor commands - add both ctrl and meta variants so shortcuts work across platforms and with either modifier
    this.addBinding(keymap, 's', { ctrlKey: true }, 'save');
    this.addBinding(keymap, 's', { metaKey: true }, 'save');

    // Not with Shift: Ctrl/Cmd+Shift+Z is redo, and a binding that ignores Shift would match it first.
    this.addBinding(keymap, 'z', { ctrlKey: true, shiftKey: false }, 'undo');
    this.addBinding(keymap, 'z', { metaKey: true, shiftKey: false }, 'undo');

    this.addBinding(keymap, 'y', { ctrlKey: true }, 'redo');
    this.addBinding(keymap, 'y', { metaKey: true }, 'redo');
    this.addBinding(keymap, 'z', { ctrlKey: true, shiftKey: true }, 'redo');
    this.addBinding(keymap, 'z', { metaKey: true, shiftKey: true }, 'redo');
    // Tab / Shift+Tab. Unspecified modifiers are "don't care" when matching, so the outdent
    // binding must come first and the plain one must spell out that nothing else is held -
    // otherwise Shift+Tab was caught by the insertTab binding.
    this.addBinding(keymap, 'tab', { shiftKey: true }, 'outdent');
    this.addBinding(keymap, 'tab', { shiftKey: false, ctrlKey: false, altKey: false, metaKey: false }, 'insertTab');

    // Theme switching
    this.addBinding(keymap, 't', { ctrlKey: !this.isMac, metaKey: this.isMac, shiftKey: true }, 'toggleTheme');
    this.addBinding(keymap, 'f', { altKey: true, shiftKey: true }, 'formatDocument');

    return keymap;
  }

  private addBinding(keymap: Keymap, key: string, modifiers: Partial<KeyBinding>, command: string): void {
    const normalizedKey = key.toLowerCase();
    if (!keymap[normalizedKey]) {
      keymap[normalizedKey] = [];
    }

    keymap[normalizedKey].push({
      key: normalizedKey,
      command,
      ...modifiers
    });
  }

  // Public API for customizing keymap
  setKeymap(keymap: Keymap): void {
    this.keymap = { ...keymap };
  }

  addKeyBinding(binding: KeyBinding): void {
    const normalizedKey = binding.key.toLowerCase();
    if (!this.keymap[normalizedKey]) {
      this.keymap[normalizedKey] = [];
    }

    // Remove existing binding for this command if it exists
    this.keymap[normalizedKey] = this.keymap[normalizedKey].filter(b => b.command !== binding.command);

    // Add new binding
    this.keymap[normalizedKey].push({
      ...binding,
      key: normalizedKey
    });
  }

  removeKeyBinding(key: string, command?: string): void {
    const normalizedKey = key.toLowerCase();

    if (command) {
      // Remove specific command binding
      if (this.keymap[normalizedKey]) {
        this.keymap[normalizedKey] = this.keymap[normalizedKey].filter(b => b.command !== command);
        if (this.keymap[normalizedKey].length === 0) {
          delete this.keymap[normalizedKey];
        }
      }
    } else {
      // Remove all bindings for this key
      delete this.keymap[normalizedKey];
    }
  }

  getKeymap(): Keymap {
    return { ...this.keymap };
  }

  getBindingsForCommand(command: string): KeyBinding[] {
    const bindings: KeyBinding[] = [];

    for (const key in this.keymap) {
      for (const binding of this.keymap[key]) {
        if (binding.command === command) {
          bindings.push({ ...binding });
        }
      }
    }

    return bindings;
  }

  getPlatformInfo(): { isMac: boolean; platform: string } {
    return {
      isMac: this.isMac,
      platform: navigator.platform
    };
  }

  destroy(): void {
    this.keymap = {};
    this.editor = null;
  }
}

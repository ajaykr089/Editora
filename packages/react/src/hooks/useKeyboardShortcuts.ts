/**
 * React Hook for Keyboard Shortcuts
 */
import { useEffect, useRef } from 'react';
import { KeyboardShortcutManager } from '@editora/core';
import type { KeyboardShortcut, KeyboardShortcutConfig } from '@editora/core';

export interface UseKeyboardShortcutsOptions extends KeyboardShortcutConfig {
  onCommand?: (command: string, params?: any) => void;
  editorElement?: HTMLElement | null;
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}) {
  const managerRef = useRef<any>(null);
  const onCommandRef = useRef(options.onCommand);

  useEffect(() => {
    onCommandRef.current = options.onCommand;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (options.enabled === false) return;

    const manager = new KeyboardShortcutManager(options);
    managerRef.current = manager;

    const handleKeyDown = (event: KeyboardEvent) => {
      const handled = manager.handleKeyDown(event, (command, params) => {
        if (onCommandRef.current) {
          onCommandRef.current(command, params);
        }

        // Also execute via global command system
        if (typeof window !== 'undefined' && (window as any).executeEditorCommand) {
          (window as any).executeEditorCommand(command, params);
        }
      });

      return handled;
    };

    const target = options.editorElement || document;
    if (target) {
      target.addEventListener('keydown', handleKeyDown as any);
    }

    return () => {
      if (target) {
        target.removeEventListener('keydown', handleKeyDown as any);
      }
    };
  }, [options.editorElement, options.enabled, options.shortcuts, options.customShortcuts]);

  return {
    getShortcuts: () => managerRef.current?.getAllShortcuts() || [],
    getShortcutForCommand: (command: string) => managerRef.current?.getShortcutForCommand(command),
    getShortcutsHelp: () => managerRef.current?.getShortcutsHelp() || '',
    enable: () => managerRef.current?.enable(),
    disable: () => managerRef.current?.disable(),
    isEnabled: () => managerRef.current?.isEnabled() || false,
  };
}

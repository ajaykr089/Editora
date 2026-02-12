/**
 * UI layer exports
 */

export { ToolbarRenderer } from './ToolbarRenderer';
export type { ToolbarConfig, ToolbarButton } from './ToolbarRenderer';

export { FloatingToolbar } from './FloatingToolbar';
export type { FloatingToolbarConfig } from './FloatingToolbar';

export { StatusBar } from './StatusBar';
export type { StatusBarConfig, StatusInfo } from './StatusBar';

// Native UI Components - Framework Agnostic
export { Dialog, type DialogConfig } from './Dialog';
export { Dropdown, type DropdownConfig, type DropdownOption } from './Dropdown';
export { ColorPicker, type ColorPickerConfig } from './ColorPicker';

// Plugin-specific dialogs
export * from './dialogs';

export { Button } from './components/Button';
export { Tooltip } from './components/Tooltip';
export { Modal } from './components/Modal';
export { Dropdown } from './components/Dropdown';
export { Input } from './components/Input';
export { Popover } from './components/Popover';
export { Tabs } from './components/Tabs';
export { Menu } from './components/Menu';
export { Icon } from './components/Icon';
export { ToastAPI } from './components/ToastAPI';
export { FloatingToolbar } from './components/FloatingToolbar';
export { BlockControls } from './components/BlockControls';
export { CommandPalette } from './components/CommandPalette';
export { ContextMenu } from './components/ContextMenu';
export { SelectionPopup } from './components/SelectionPopup';
export { PluginPanel } from './components/PluginPanel';

// Named exports only — no default export to keep ESM/CJS consumers consistent.

// Ensure all web components are registered when this package is imported
import '@editora/ui-core';

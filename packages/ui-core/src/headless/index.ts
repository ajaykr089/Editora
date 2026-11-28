/**
 * Headless behaviour: WAI-ARIA patterns on your own markup and styles, no custom elements, no shadow
 * DOM. Each controller sets the roles and states, handles keyboard, focus and dismissal, and sets
 * `data-state` for styling (`[data-state="open"]`, Tailwind `data-[state=open]:`).
 *
 *   import { createDialog } from '@editora/ui-core/headless';
 *   const dialog = createDialog({ trigger: button, content: panel });
 */
export { createDialog } from './dialog';
export type { DialogOptions, DialogController, DialogChangeReason } from './dialog';
export { createPopover } from './popover';
export type { PopoverOptions, PopoverController, PopoverChangeReason } from './popover';
export { createMenu } from './menu';
export type { MenuOptions, MenuController } from './menu';
export { createTabs } from './tabs';
export type { TabsOptions, TabsController } from './tabs';
export { createListbox } from './listbox';
export type { ListboxOptions, ListboxController } from './listbox';

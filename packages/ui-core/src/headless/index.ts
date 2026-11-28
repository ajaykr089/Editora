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
export { createCollapsible } from './collapsible';
export type { CollapsibleOptions, CollapsibleController } from './collapsible';
export { createAccordion } from './accordion';
export type { AccordionOptions, AccordionController } from './accordion';
export { createTooltip } from './tooltip';
export type { TooltipOptions, TooltipController } from './tooltip';
export { createHoverCard } from './hover-card';
export type { HoverCardOptions, HoverCardController } from './hover-card';
export { createToggleGroup } from './toggle-group';
export type { ToggleGroupOptions, ToggleGroupController } from './toggle-group';
export { createToolbar } from './toolbar';
export type { ToolbarOptions, ToolbarController } from './toolbar';
export { createCheckbox, createSwitch } from './checkbox';
export type { CheckboxOptions, CheckboxController, CheckedState, SwitchOptions, SwitchController } from './checkbox';
export { createRadioGroup } from './radio-group';
export type { RadioGroupOptions, RadioGroupController } from './radio-group';
export { createSlider } from './slider';
export type { SliderOptions, SliderController } from './slider';
export { createContextMenu } from './context-menu';
export type { ContextMenuOptions, ContextMenuController } from './context-menu';
export { createSelect } from './select';
export type { SelectOptions, SelectController } from './select';
export { createCombobox } from './combobox';
export type { ComboboxOptions, ComboboxController } from './combobox';
export { createNavigationMenu } from './navigation-menu';
export type { NavigationMenuOptions, NavigationMenuController } from './navigation-menu';
export { createScrollArea } from './scroll-area';
export type { ScrollAreaOptions, ScrollAreaController } from './scroll-area';
export { createToaster } from './toast';
export type { ToasterOptions, ToasterController, ToastAddOptions } from './toast';

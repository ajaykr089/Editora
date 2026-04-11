/// <reference path="./custom-elements.d.ts" />
'use client';
import { primeUICoreRegistration } from './core-registration';

primeUICoreRegistration();

export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';
export { Tooltip } from './components/Tooltip';
export { Alert, AlertIcon, AlertTitle, AlertDescription, AlertActions } from './components/Alert';
export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownSectionLabel
} from './components/Dropdown';
export { Input, type InputProps, type InputPrefixProps, type InputSuffixProps, type InputErrorProps } from './components/Input';
export { PasswordField } from './components/PasswordField';
export { TagsInput } from './components/TagsInput';
export { PinInput, OTPInput } from './components/PinInput';
export { FileUpload, Dropzone } from './components/FileUpload';
export { Textarea } from './components/Textarea';
export type { TextareaProps, TextareaLabelProps, TextareaDescriptionProps, TextareaErrorProps } from './components/Textarea';
export { Field } from './components/Field';
export { Description, FieldError, ControlGroup, Fieldset } from './components/FieldSemantics';
export { FiltersBar } from './components/FiltersBar';
export type { FiltersBarOption, FiltersBarProps } from './components/FiltersBar';
export { Combobox } from './components/Combobox';
export { Badge } from './components/Badge';
export type { BadgeProps, BadgeRemoveDetail } from './components/Badge';
export { EmptyState } from './components/EmptyState';
export { Table } from './components/Table';
export { DataTable } from './components/DataTable';
export { Chart } from './components/Chart';
export { Timeline } from './components/Timeline';
export { Carousel } from './components/Carousel';
export type {
  CarouselProps,
  CarouselItemProps,
  CarouselControlsVariant,
  CarouselControlsPosition,
  CarouselControlsAlign,
  CarouselControlsVisibility,
  CarouselIndicatorsVariant,
  CarouselDirection,
  CarouselTransition
} from './components/Carousel';
export { CodeBlock } from './components/CodeBlock';
export type { CodeBlockProps } from './components/CodeBlock';
export { CodeSnippet } from './components/CodeSnippet';
export type { CodeSnippetProps } from './components/CodeSnippet';
export { CopyButton } from './components/CopyButton';
export type { CopyButtonProps } from './components/CopyButton';
export { DataViewToolbar } from './components/DataViewToolbar';
export type { DataViewToolbarProps } from './components/DataViewToolbar';
export { Stat } from './components/Stat';
export type { StatProps } from './components/Stat';
export { MetricCard } from './components/MetricCard';
export type { MetricCardProps } from './components/MetricCard';
export { Calendar } from './components/Calendar';
export { ColorPicker } from './components/ColorPicker';
export { DatePicker } from './components/DatePicker';
export { DateRangePicker } from './components/DateRangePicker';
export { DateField, TimeField } from './components/DateField';
export { NumberField } from './components/NumberField';
export { MultiSelect } from './components/MultiSelect';
export { SplitButton } from './components/SplitButton';
export { TransferList } from './components/TransferList';
export type {
  TransferListProps,
  TransferListOption,
  TransferListChangeDetail,
  TransferListElement,
  TransferListVariant,
  TransferListTone,
  TransferListSize,
  TransferListElevation,
  TransferListSelectionIndicator
} from './components/TransferList';
export { Sortable } from './components/Sortable';
export type {
  SortableProps,
  SortableElement,
  SortableList,
  SortableItem,
  SortableMoveOptions,
  SortableDropMode,
  SortableSortMode,
  SortableChangeSource,
  SortableOperation,
  SortableDropzoneStyle,
  SortableRenderEmptyStateContext,
  SortableRenderItemContext,
  SortableRenderListHeaderContext,
  SortableSelectionChangeDetail,
  SortablePersistenceRecord,
  SortablePersistenceSnapshot,
  SortableChangeDetail
} from './components/Sortable';
export { InlineEdit } from './components/InlineEdit';
export { TimePicker } from './components/TimePicker';
export { DateTimePicker } from './components/DateTimePicker';
export { DateRangeTimePicker } from './components/DateRangeTimePicker';
export { Gantt } from './components/Gantt';
export { Stepper } from './components/Stepper';
export { Wizard } from './components/Wizard';
export { Rating } from './components/Rating';
export { QuickActions } from './components/QuickActions';
export {
  NavigationMenu,
  NavigationMenuRoot,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuViewport
} from './components/NavigationMenu';
export { Menubar } from './components/Menubar';
export { Dialog } from './components/Dialog';
export { DialogProvider, useDialog } from './components/DialogProvider';
export { Popover } from './components/Popover';
export { Tabs } from './components/Tabs';
export type { TabsProps, TabsTabProps, TabsPanelProps } from './components/Tabs';
export { Menu, MenuItem, MenuSeparator, MenuSectionLabel } from './components/Menu';
export { Icon } from './components/Icon';
export { ToastAPI, ToastProvider, useToast, toast, toastApi, toastAdvanced, toastPro, toastLegacy } from './components/ToastAPI';
export { Toast } from './components/Toast';
export type { ToastElement, ToastProps, ToastShowDetail, ToastHideDetail, ToastShowOptions } from './components/Toast';
export { FloatingToolbar } from './components/FloatingToolbar';
export { BlockControls } from './components/BlockControls';
export { Kbd } from './components/Kbd';
export type { KbdProps } from './components/Kbd';
export { Shortcut } from './components/Shortcut';
export type { ShortcutProps } from './components/Shortcut';
export { Command, CommandItem, type CommandProps, type CommandItemProps, type CommandSelectDetail } from './components/Command';
export { CommandPalette, CommandPaletteItem, type CommandPaletteProps, type CommandPaletteItemProps, type CommandPaletteSelectDetail, type CommandPaletteQueryChangeDetail, type CommandPaletteOpenChangeDetail, type CommandPaletteElement } from './components/CommandPalette';
export { ContextMenu } from './components/ContextMenu';
export { SelectionPopup } from './components/SelectionPopup';
export { PluginPanel } from './components/PluginPanel';
export { Form } from './components/Form';
export { useForm } from './hooks/useForm';
export { useFloating } from './hooks/useFloating';

// layout exports
export { Box } from './components/Box';
export { Flex } from './components/Flex';
export { Grid } from './components/Grid';
export { PlacementGrid } from './components/PlacementGrid';
export { MasonryGrid } from './components/MasonryGrid';
export { Section } from './components/Section';
export { Container } from './components/Container';
export {
  Sidebar
} from './components/Sidebar';
export type {
  SidebarProps,
  SidebarGroupProps,
  SidebarItemInput,
  SidebarItemProps,
  SidebarSlotProps,
  SidebarSearchInputProps,
  SidebarSelectDetail,
  SidebarTone
} from './components/Sidebar';
export { PanelGroup, Panel, Splitter } from './components/PanelGroup';
export { Tree } from './components/Tree';
export type { TreeProps, TreeItemProps, TreeSelectDetail, TreeExpandedChangeDetail } from './components/Tree';
export { Breadcrumb } from './components/Breadcrumb';
export { AppHeader, AppHeaderStart, AppHeaderCenter, AppHeaderTitle, AppHeaderSubtitle, AppHeaderEnd } from './components/AppHeader';
export { PageHeader } from './components/PageHeader';
export type { PageHeaderAction, PageHeaderProps, PageHeaderStatusChip } from './components/PageHeader';
export { PageToolbar } from './components/PageToolbar';
export type { PageToolbarProps } from './components/PageToolbar';
export { RecordHeader } from './components/RecordHeader';
export type { RecordHeaderProps, RecordHeaderDetail } from './components/RecordHeader';
export { Drawer } from './components/Drawer';
export { Layout } from './components/Layout';

export { ThemeProvider } from './components/ThemeProvider';
export { useTheme } from './hooks/useTheme';

// Named exports only — no default export to keep ESM/CJS consumers consistent.

export { Collection } from './components/Collection';
export { Listbox } from './components/Listbox';
export { RovingFocusGroup } from './components/RovingFocusGroup';
export { DismissableLayer } from './components/DismissableLayer';
export { FocusScope } from './components/FocusScope';
export { Positioner } from './components/Positioner';
export { Anchor } from './components/Anchor';
export { Checkbox } from './components/Checkbox';
export { RadioGroup } from './components/RadioGroup';
export { Switch } from './components/Switch';
export type { SwitchProps, SwitchDescriptionProps } from './components/Switch';
export { Toggle } from './components/Toggle';
export { ToggleGroup } from './components/ToggleGroup';
export type { ToggleGroupProps, ToggleGroupItemProps } from './components/ToggleGroup';
export { AspectRatio } from './components/AspectRatio';
export { Avatar } from './components/Avatar';
export { Presence } from './components/Presence';
export { Progress } from './components/Progress';
export { Meter } from './components/Meter';
export { Portal } from './components/Portal';
export { ScrollArea } from './components/ScrollArea';
export { Separator } from './components/Separator';
export { Slot } from './components/Slot';
export { Toolbar } from './components/Toolbar';
export { VisuallyHidden } from './components/VisuallyHidden';
export { Collapsible } from './components/Collapsible';
export { Pagination } from './components/Pagination';
export { Accordion } from './components/Accordion';
export { DirectionProvider } from './components/DirectionProvider';
export { HoverCard, type HoverCardProps, type HoverCardTriggerProps, type HoverCardContentProps } from './components/HoverCard';
export { Card } from './components/Card';
export { Label } from './components/Label';
export {
  AlertDialog,
  AlertDialogIcon,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogActions
} from './components/AlertDialog';
export { AlertDialogProvider, useAlertDialog } from './components/AlertDialogProvider';
export { AnimatedText } from './components/AnimatedText';
export type {
  BuiltinAnimatedTextEffect,
  AnimatedTextElement,
  AnimatedTextProps,
  AnimatedTextEffect,
  AnimatedTextSplit,
  AnimatedTextTrigger,
  AnimatedTextVariant,
  AnimatedTextTone,
  AnimatedTextSize,
  AnimatedTextElevation,
  AnimatedTextAlign,
} from './components/AnimatedText';
export { SpinningText } from './components/SpinningText';
export type {
  SpinningTextProps,
  SpinningTextCenterProps,
  SpinningTextElement,
  SpinningTextDirection,
  SpinningTextVariant,
  SpinningTextTone,
  SpinningTextSize,
  SpinningTextElevation,
} from './components/SpinningText';
export { NumberTicker } from './components/NumberTicker';
export type {
  NumberTickerProps,
  NumberTickerElement,
  NumberTickerTone,
  NumberTickerSize,
  NumberTickerAlign,
  NumberTickerEasing,
  NumberTickerAnimation,
  NumberTickerTrigger,
  NumberTickerStaggerFrom,
  NumberTickerFormatStyle,
  NumberTickerCurrencyDisplay,
  NumberTickerNotation,
  NumberTickerCompactDisplay,
  NumberTickerSignDisplay,
  NumberTickerFormatterContext,
  NumberTickerFormatter,
} from './components/NumberTicker';
export { AnimatedList } from './components/AnimatedList';
export type {
  AnimatedListProps,
  AnimatedListItemProps,
  AnimatedListEffect,
  AnimatedListAnimation,
  AnimatedListTrigger,
  AnimatedListVariant,
  AnimatedListTone,
  AnimatedListSize,
  AnimatedListElevation,
  AnimatedListElement,
} from './components/AnimatedList';
export { AnimatedBeam } from './components/AnimatedBeam';
export type {
  AnimatedBeamProps,
  AnimatedBeamNodeProps,
  AnimatedBeamHubProps,
  AnimatedBeamConnectionProps,
  AnimatedBeamElement,
  AnimatedBeamVariant,
  AnimatedBeamTone,
  AnimatedBeamSize,
  AnimatedBeamElevation,
  AnimatedBeamAnimation,
  AnimatedBeamCurve,
} from './components/AnimatedBeam';
export { IconCloud } from './components/IconCloud';
export type {
  IconCloudProps,
  IconCloudItemProps,
  IconCloudCenterProps,
  IconCloudElement,
  IconCloudDirection,
  IconCloudVariant,
  IconCloudTone,
  IconCloudSize,
  IconCloudElevation,
} from './components/IconCloud';
export { Dock } from './components/Dock';
export type {
  DockProps,
  DockItemProps,
  DockItemSlotProps,
  DockElement,
  DockOrientation,
  DockVariant,
  DockTone,
  DockSize,
  DockAnimation,
  DockElevation,
  DockLabelMode,
  DockLabelPlacement,
  DockFocusTarget,
} from './components/Dock';
export { Orbiter } from './components/Orbiter';
export type {
  OrbiterProps,
  OrbiterItemProps,
  OrbiterCenterProps,
  OrbiterElement,
  OrbiterDirection,
  OrbiterAnimation,
  OrbiterVariant,
  OrbiterTone,
  OrbiterSize,
  OrbiterElevation,
} from './components/Orbiter';
export { Marquee } from './components/Marquee';
export type { MarqueeProps, MarqueeItemProps, MarqueeDirection } from './components/Marquee';
export { Select } from './components/Select';
export { Slider } from './components/Slider';
export { Skeleton } from './components/Skeleton';
export {
  AnimatedNumber,
  useAnimatedNumber,
  useAnimatedNumberValue,
  type AnimatedNumberProps,
  type AnimatedNumberAnimation,
  type AnimatedNumberVariant,
  type AnimatedNumberFormat,
  type AnimatedNumberNotation,
  type AnimatedNumberDirection,
  type AnimatedNumberCompleteEvent,
} from './components/AnimatedNumber';

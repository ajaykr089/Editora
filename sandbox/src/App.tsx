import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AlertDialogProvider } from '@editora/ui-react';
import { NavSidebar } from './components/NavSidebar';

// Editors
import { EditoraAllToolbarsDemo, EditoraApiDemo, EditoraControlledDemo, EditoraEditorDemo, EditoraEnterpriseDemo, EditoraPluginsDemo, EditoraReadOnlyDemo } from './pages/EditorDemos';
import { LightCodeEditorCompletionDemo, LightCodeEditorDemo, LightCodeEditorDiagnosticsDemo, LightCodeEditorFormattingDemo, LightCodeEditorFullDemo, LightCodeEditorLanguageDemo, LightCodeEditorReadOnlyDemo, LightCodeEditorSearchDemo } from './pages/LightCodeEditorDemos';
// Motion
import { AnimatedBeamDemo, AnimatedListDemo, AnimatedNumberDemo, AnimatedTextDemo, MarqueeDemo, NumberTickerDemo, OrbiterDemo, SpinningTextDemo, DockDemo } from './pages/MotionDemos';
// Layout
import { AppHeaderDemo, AspectRatioDemo, BoxDemo, ContainerDemo, FlexDemo, GridDemo, LayoutDemo, MasonryGridDemo, PanelGroupDemo, PlacementGridDemo, SectionDemo, SidebarDemo } from './pages/LayoutDemos';
// Form
import { CheckboxDemo, ColorPickerDemo, DateTimeFieldDemo, DateTimePickersDemo, FileUploadDemo, InlineEditDemo, InputDemo, LabelDemo, SelectDemo, SwitchDemo, TextareaDemo, SliderDemo, RadioGroupDemo, RatingDemo, TagsInputDemo, PasswordFieldDemo, PinInputDemo, NumberFieldDemo, ComboboxDemo, MultiSelectDemo, TransferListDemo, FieldDemo } from './pages/FormDemos';
// Overlays
import { AlertDialogDemo, AlertDialogPromiseDemo, DialogDemo, DrawerDemo, DropdownDemo, TooltipDemo, PopoverDemo, HoverCardDemo, MenuDemo, MenubarDemo, ContextMenuDemo } from './pages/OverlayDemos';
// Feedback
import { AccordionDemo, AlertDemo, CollapsibleDemo, EmptyStateDemo, ProgressDemo, MeterDemo, ToastAPIDemo } from './pages/FeedbackDemos';
// Navigation
import { BreadcrumbDemo, TabsDemo, TreeDemo, PaginationDemo, StepperDemo, CommandDemo, CommandPaletteDemo, WizardDemo, TimelineDemo } from './pages/NavigationDemos';
// Data Display
import { AvatarDemo, BadgeDemo, CardDemo, CarouselDemo, ChartDemo, CodeSnippetDemo, DataTableDemo, DataViewToolbarDemo, MetricCardDemo, PageHeaderDemo, PageToolbarDemo, RecordHeaderDemo, ReportingDemo, StatDemo, TableDemo, SkeletonDemo, ScrollAreaDemo } from './pages/DataDisplayDemos';
// Buttons
import { ButtonDemo, ButtonMatricesDemo, CopyButtonDemo, FloatingToolbarDemo, ToggleDemo, ToggleGroupDemo, ToolbarDemo, SplitButtonDemo, QuickActionsDemo } from './pages/ButtonDemos';
// Typography
import { IconDemo, KbdDemo, SeparatorDemo, ShortcutDemo, VisuallyHiddenDemo } from './pages/TypographyDemos';
import { IconCloudDemo, IconsCatalogDemo } from './pages/IconDemos';
import { GanttDemo } from './pages/GanttDemos';
// Primitives
import { PortalDemo, PresenceDemo, SelectionPopupDemo, NavigationMenuDemo, CalendarDemo, CodeBlockDemo, FiltersBarDemo, SortableDemo, DirectionProviderDemo, SlotDemo, BlockControlsDemo, PluginPanelDemo } from './pages/PrimitiveDemos';

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 14,
  color: '#0f172a',
  background: '#f8fafc',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: '28px 32px',
  overflowY: 'auto',
  maxWidth: 1100,
};

export default function App() {
  return (
    <AlertDialogProvider defaults={{ variant: 'soft', tone: 'warning', radius: 12, elevation: 'high', closeOnBackdrop: false }}>
      <div style={layoutStyle}>
        <NavSidebar />
        <main style={contentStyle}>
          <Routes>
            <Route path="/" element={<Navigate to="/editora-editor" replace />} />

            {/* Editors */}
            <Route path="/editora-editor" element={<EditoraEditorDemo />} />
            <Route path="/editora-editor-controlled" element={<EditoraControlledDemo />} />
            <Route path="/editora-editor-readonly" element={<EditoraReadOnlyDemo />} />
            <Route path="/editora-editor-plugins" element={<EditoraPluginsDemo />} />
            <Route path="/editora-editor-all-toolbars" element={<EditoraAllToolbarsDemo />} />
            <Route path="/editora-editor-enterprise" element={<EditoraEnterpriseDemo />} />
            <Route path="/editora-editor-api" element={<EditoraApiDemo />} />
            <Route path="/light-code-editor" element={<LightCodeEditorDemo />} />
            <Route path="/light-code-editor-languages" element={<LightCodeEditorLanguageDemo />} />
            <Route path="/light-code-editor-search" element={<LightCodeEditorSearchDemo />} />
            <Route path="/light-code-editor-diagnostics" element={<LightCodeEditorDiagnosticsDemo />} />
            <Route path="/light-code-editor-completion" element={<LightCodeEditorCompletionDemo />} />
            <Route path="/light-code-editor-formatting" element={<LightCodeEditorFormattingDemo />} />
            <Route path="/light-code-editor-readonly" element={<LightCodeEditorReadOnlyDemo />} />
            <Route path="/light-code-editor-full" element={<LightCodeEditorFullDemo />} />

            {/* Motion */}
            <Route path="/animated-beam" element={<AnimatedBeamDemo />} />
            <Route path="/animated-list" element={<AnimatedListDemo />} />
            <Route path="/animated-number" element={<AnimatedNumberDemo />} />
            <Route path="/animated-text" element={<AnimatedTextDemo />} />
            <Route path="/marquee" element={<MarqueeDemo />} />
            <Route path="/number-ticker" element={<NumberTickerDemo />} />
            <Route path="/orbiter" element={<OrbiterDemo />} />
            <Route path="/spinning-text" element={<SpinningTextDemo />} />
            <Route path="/dock" element={<DockDemo />} />

            {/* Layout */}
            <Route path="/app-header" element={<AppHeaderDemo />} />
            <Route path="/aspect-ratio" element={<AspectRatioDemo />} />
            <Route path="/box" element={<BoxDemo />} />
            <Route path="/container" element={<ContainerDemo />} />
            <Route path="/flex" element={<FlexDemo />} />
            <Route path="/grid" element={<GridDemo />} />
            <Route path="/layout" element={<LayoutDemo />} />
            <Route path="/masonry-grid" element={<MasonryGridDemo />} />
            <Route path="/panel-group" element={<PanelGroupDemo />} />
            <Route path="/section" element={<SectionDemo />} />
            <Route path="/sidebar" element={<SidebarDemo />} />

            {/* Form Inputs */}
            <Route path="/checkbox" element={<CheckboxDemo />} />
            <Route path="/color-picker" element={<ColorPickerDemo />} />
            <Route path="/combobox" element={<ComboboxDemo />} />
            <Route path="/date-time-field" element={<DateTimeFieldDemo />} />
            <Route path="/date-time-pickers" element={<DateTimePickersDemo />} />
            <Route path="/field" element={<FieldDemo />} />
            <Route path="/field-semantics" element={<FieldDemo />} />
            <Route path="/file-upload" element={<FileUploadDemo />} />
            <Route path="/inline-edit" element={<InlineEditDemo />} />
            <Route path="/input" element={<InputDemo />} />
            <Route path="/label" element={<LabelDemo />} />
            <Route path="/multi-select" element={<MultiSelectDemo />} />
            <Route path="/number-field" element={<NumberFieldDemo />} />
            <Route path="/password-field" element={<PasswordFieldDemo />} />
            <Route path="/pin-input" element={<PinInputDemo />} />
            <Route path="/radio" element={<RadioGroupDemo />} />
            <Route path="/radio-group" element={<RadioGroupDemo />} />
            <Route path="/rating" element={<RatingDemo />} />
            <Route path="/select" element={<SelectDemo />} />
            <Route path="/slider" element={<SliderDemo />} />
            <Route path="/switch" element={<SwitchDemo />} />
            <Route path="/tags-input" element={<TagsInputDemo />} />
            <Route path="/textarea" element={<TextareaDemo />} />
            <Route path="/transfer-list" element={<TransferListDemo />} />

            {/* Overlays */}
            <Route path="/alert-dialog" element={<AlertDialogDemo />} />
            <Route path="/alert-dialog-promise" element={<AlertDialogPromiseDemo />} />
            <Route path="/context-menu" element={<ContextMenuDemo />} />
            <Route path="/dialog" element={<DialogDemo />} />
            <Route path="/dialog-promise" element={<DialogDemo />} />
            <Route path="/drawer" element={<DrawerDemo />} />
            <Route path="/dropdown" element={<DropdownDemo />} />
            <Route path="/floating-toolbar" element={<FloatingToolbarDemo />} />
            <Route path="/hover-card" element={<HoverCardDemo />} />
            <Route path="/menu" element={<MenuDemo />} />
            <Route path="/menubar" element={<MenubarDemo />} />
            <Route path="/popover" element={<PopoverDemo />} />
            <Route path="/portal" element={<PortalDemo />} />
            <Route path="/selection-popup" element={<SelectionPopupDemo />} />
            <Route path="/tooltip" element={<TooltipDemo />} />

            {/* Feedback */}
            <Route path="/accordion" element={<AccordionDemo />} />
            <Route path="/alert" element={<AlertDemo />} />
            <Route path="/collapsible" element={<CollapsibleDemo />} />
            <Route path="/empty-state" element={<EmptyStateDemo />} />
            <Route path="/meter" element={<MeterDemo />} />
            <Route path="/presence" element={<PresenceDemo />} />
            <Route path="/progress" element={<ProgressDemo />} />
            <Route path="/toast" element={<ToastAPIDemo />} />
            <Route path="/toast-api" element={<ToastAPIDemo />} />

            {/* Navigation */}
            <Route path="/breadcrumb" element={<BreadcrumbDemo />} />
            <Route path="/command" element={<CommandDemo />} />
            <Route path="/command-palette" element={<CommandPaletteDemo />} />
            <Route path="/navigation-menu" element={<NavigationMenuDemo />} />
            <Route path="/pagination" element={<PaginationDemo />} />
            <Route path="/stepper" element={<StepperDemo />} />
            <Route path="/tabs" element={<TabsDemo />} />
            <Route path="/tree" element={<TreeDemo />} />
            <Route path="/wizard" element={<WizardDemo />} />

            {/* Data Display */}
            <Route path="/avatar" element={<AvatarDemo />} />
            <Route path="/badge" element={<BadgeDemo />} />
            <Route path="/calendar" element={<CalendarDemo />} />
            <Route path="/card" element={<CardDemo />} />
            <Route path="/carousel" element={<CarouselDemo />} />
            <Route path="/chart" element={<ChartDemo />} />
            <Route path="/code-block" element={<CodeBlockDemo />} />
            <Route path="/code-snippet" element={<CodeSnippetDemo />} />
            <Route path="/data-table" element={<DataTableDemo />} />
            <Route path="/data-view-toolbar" element={<DataViewToolbarDemo />} />
            <Route path="/filters-bar" element={<FiltersBarDemo />} />
            <Route path="/gantt" element={<GanttDemo />} />
            <Route path="/metric-card" element={<MetricCardDemo />} />
            <Route path="/page-header" element={<PageHeaderDemo />} />
            <Route path="/page-toolbar" element={<PageToolbarDemo />} />
            <Route path="/placement-grid" element={<PlacementGridDemo />} />
            <Route path="/record-header" element={<RecordHeaderDemo />} />
            <Route path="/reporting" element={<ReportingDemo />} />
            <Route path="/scroll-area" element={<ScrollAreaDemo />} />
            <Route path="/sortable" element={<SortableDemo />} />
            <Route path="/stat" element={<StatDemo />} />
            <Route path="/table" element={<TableDemo />} />
            <Route path="/timeline" element={<TimelineDemo />} />

            {/* Buttons */}
            <Route path="/button" element={<ButtonDemo />} />
            <Route path="/button-matrices" element={<ButtonMatricesDemo />} />
            <Route path="/copy-button" element={<CopyButtonDemo />} />
            <Route path="/quick-actions" element={<QuickActionsDemo />} />
            <Route path="/split-button" element={<SplitButtonDemo />} />
            <Route path="/toggle" element={<ToggleDemo />} />
            <Route path="/toggle-group" element={<ToggleGroupDemo />} />
            <Route path="/toolbar" element={<ToolbarDemo />} />

            {/* Typography */}
            <Route path="/icon" element={<IconDemo />} />
            <Route path="/icon-cloud" element={<IconCloudDemo />} />
            <Route path="/icons-catalog" element={<IconsCatalogDemo />} />
            <Route path="/kbd" element={<KbdDemo />} />
            <Route path="/separator" element={<SeparatorDemo />} />
            <Route path="/shortcut" element={<ShortcutDemo />} />
            <Route path="/skeleton" element={<SkeletonDemo />} />
            <Route path="/visually-hidden" element={<VisuallyHiddenDemo />} />

            {/* Primitives */}
            <Route path="/block-controls" element={<BlockControlsDemo />} />
            <Route path="/direction-provider" element={<DirectionProviderDemo />} />
            <Route path="/form" element={<FieldDemo />} />
            <Route path="/plugin-panel" element={<PluginPanelDemo />} />
            <Route path="/primitive-wrappers" element={<SlotDemo />} />
            <Route path="/slot" element={<SlotDemo />} />
            <Route path="/theming" element={<BoxDemo />} />

            <Route path="*" element={<Navigate to="/editora-editor" replace />} />
          </Routes>
        </main>
      </div>
    </AlertDialogProvider>
  );
}

/// <reference path="./custom-elements.d.ts" />
'use client';

// No blanket `import '@editora/ui-core'`: each component registers the elements it renders (see index.tsx).

// RSC-safe client barrel:
// keep this surface limited to commonly used wrappers that are safe to import
// during Next/Remix server prerender of client components.

export { Alert, AlertActions, AlertDescription, AlertIcon, AlertTitle } from './components/Alert';
export { AnimatedNumber, useAnimatedNumber, useAnimatedNumberValue } from './components/AnimatedNumber';
export { Anchor } from './components/Anchor';
export { AspectRatio } from './components/AspectRatio';
export { Avatar } from './components/Avatar';
export { Badge } from './components/Badge';
export { Box } from './components/Box';
export { Button } from './components/Button';
export { Calendar } from './components/Calendar';
export { Carousel } from './components/Carousel';
export { Checkbox } from './components/Checkbox';
export { ColorPicker } from './components/ColorPicker';
export { CodeBlock } from './components/CodeBlock';
export { CodeSnippet } from './components/CodeSnippet';
export { Container } from './components/Container';
export { ControlGroup, Description, FieldError, Fieldset } from './components/FieldSemantics';
export { CopyButton } from './components/CopyButton';
export { DateField, TimeField } from './components/DateField';
export { DatePicker } from './components/DatePicker';
export { DateRangePicker } from './components/DateRangePicker';
export { DateRangeTimePicker } from './components/DateRangeTimePicker';
export { DateTimePicker } from './components/DateTimePicker';
export { DirectionProvider } from './components/DirectionProvider';
export { EmptyState } from './components/EmptyState';
export { Field } from './components/Field';
export { DataViewToolbar } from './components/DataViewToolbar';
export { FiltersBar } from './components/FiltersBar';
export { Flex } from './components/Flex';
export { Grid } from './components/Grid';
export { Icon } from './components/Icon';
export { Input } from './components/Input';
export { Kbd } from './components/Kbd';
export { Label } from './components/Label';
export { MetricCard } from './components/MetricCard';
export { Meter } from './components/Meter';
export { NumberField } from './components/NumberField';
export { PageHeader } from './components/PageHeader';
export { PageToolbar } from './components/PageToolbar';
export { PasswordField } from './components/PasswordField';
export { PinInput, OTPInput } from './components/PinInput';
export { Progress } from './components/Progress';
export { Radio } from './components/Radio';
export { RadioGroup } from './components/RadioGroup';
export { RecordHeader } from './components/RecordHeader';
export { Section } from './components/Section';
export { Shortcut } from './components/Shortcut';
export { Select } from './components/Select';
export { Separator } from './components/Separator';
export { Skeleton } from './components/Skeleton';
export { Slider } from './components/Slider';
export { Stat } from './components/Stat';
export { Stepper } from './components/Stepper';
export { Switch } from './components/Switch';
export { TagsInput } from './components/TagsInput';
export { Textarea } from './components/Textarea';
export { TimePicker } from './components/TimePicker';
export { Toggle } from './components/Toggle';
export { VisuallyHidden } from './components/VisuallyHidden';

// shadcn/ui and Radix parity: typography, groups, item and chat components
export { AccessibleIcon } from './components/AccessibleIcon';
export type { AccessibleIconProps } from './components/AccessibleIcon';
export { Announcer } from './components/Announcer';
export type { AnnouncerProps } from './components/Announcer';
export { Attachment } from './components/Attachment';
export type { AttachmentProps, AttachmentState, AttachmentRemoveDetail } from './components/Attachment';
export { AttachmentGroup } from './components/AttachmentGroup';
export type { AttachmentGroupProps } from './components/AttachmentGroup';
export { Bubble } from './components/Bubble';
export type { BubbleProps } from './components/Bubble';
export { BubbleGroup } from './components/BubbleGroup';
export type { BubbleGroupProps } from './components/BubbleGroup';
export { ButtonGroup } from './components/ButtonGroup';
export type { ButtonGroupProps } from './components/ButtonGroup';
export { Heading } from './components/Heading';
export type { HeadingProps } from './components/Heading';
export { InputGroup } from './components/InputGroup';
export type { InputGroupProps } from './components/InputGroup';
export { Item } from './components/Item';
export type { ItemProps } from './components/Item';
export { ItemGroup } from './components/ItemGroup';
export type { ItemGroupProps } from './components/ItemGroup';
export { Marker } from './components/Marker';
export type { MarkerProps } from './components/Marker';
export { Message } from './components/Message';
export type { MessageProps } from './components/Message';
export { MessageScroller } from './components/MessageScroller';
export type { MessageScrollerProps, MessageScrollerElement } from './components/MessageScroller';
export { NativeSelect } from './components/NativeSelect';
export type { NativeSelectProps } from './components/NativeSelect';
export { Prose } from './components/Prose';
export type { ProseProps } from './components/Prose';
export { Question } from './components/Question';
export type { QuestionProps } from './components/Question';
export { Questionnaire } from './components/Questionnaire';
export type { QuestionnaireProps, QuestionnaireElement, QuestionnaireValue, QuestionnaireValues, QuestionnaireChangeDetail, QuestionnaireStepDetail, QuestionDefinition, QuestionOption } from './components/Questionnaire';
export { Spinner } from './components/Spinner';
export type { SpinnerProps } from './components/Spinner';
export { Text } from './components/Text';
export type { TextProps } from './components/Text';
export { Trace } from './components/Trace';
export type { TraceProps } from './components/Trace';
export { TraceItem } from './components/TraceItem';
export type { TraceItemProps, TraceItemStatus } from './components/TraceItem';
export { announce, clearAnnouncements } from './components/Announcer';
export type { AnnounceOptions, AnnouncePoliteness } from './components/Announcer';
// Headless hooks: WAI-ARIA behaviour on your own markup and styles
export { useHeadlessDialog, useHeadlessPopover, useHeadlessMenu, useHeadlessTabs, useHeadlessListbox } from './components/Headless';
export type { UseHeadlessDialogOptions, UseHeadlessDialogResult, UseHeadlessPopoverOptions, UseHeadlessMenuOptions, UseHeadlessMenuResult, UseHeadlessTabsOptions, UseHeadlessTabsResult, UseHeadlessListboxOptions, UseHeadlessListboxResult } from './components/Headless';

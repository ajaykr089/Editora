/// <reference path="./custom-elements.d.ts" />
'use client';

import { primeUICoreRegistration } from './core-registration';

primeUICoreRegistration();

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

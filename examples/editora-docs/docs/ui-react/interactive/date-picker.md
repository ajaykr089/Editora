---
title: DatePicker
description: DatePicker component for date selection with support for various formats, localization, validation, and interactive features for enhanced user experience.
sidebar_label: DatePicker
---

# DatePicker

The `DatePicker` component provides comprehensive date selection functionality with support for various date formats, localization, validation, and interactive features. It includes popover and inline modes, custom formatting, event handling, and accessibility support for enhanced user experience.

## Basic Usage

```tsx
import { DatePicker } from '@editora/ui-react';

function BasicDatePicker() {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <DatePicker 
      value={selectedDate}
      onChange={(detail) => setSelectedDate(detail.value)}
      placeholder="Select a date"
      label="Appointment Date"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Selected date |
| `defaultValue` | `string` | - | Default selected date |
| `open` | `boolean` | - | Control popover open state |
| `defaultOpen` | `boolean` | `false` | Default open state |
| `min` | `string` | - | Minimum selectable date |
| `max` | `string` | - | Maximum selectable date |
| `locale` | `string` | - | Locale for date formatting |
| `translations` | `Record<string, string> \| string` | - | Custom translations |
| `weekStart` | `0 \| 1 \| 6` | - | First day of week (0=Sunday, 1=Monday, 6=Saturday) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `shape` | `'default' \| 'square' \| 'soft'` | `'default'` | Input shape |
| `bare` | `boolean` | `false` | Bare input style |
| `variant` | `'default' \| 'contrast'` | `'default'` | Input variant |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | `'idle'` | Input state |
| `placeholder` | `string` | - | Placeholder text |
| `label` | `string` | - | Input label |
| `hint` | `string` | - | Input hint text |
| `error` | `string` | - | Error message |
| `clearable` | `boolean` | `false` | Show clear button |
| `allowInput` | `boolean` | `false` | Allow manual input |
| `closeOnSelect` | `boolean` | `true` | Close popover on selection |
| `outsideClick` | `'none' \| 'navigate' \| 'select'` | `'navigate'` | Outside click behavior |
| `disabled` | `boolean` | `false` | Disable input |
| `readOnly` | `boolean` | `false` | Read-only mode |
| `required` | `boolean` | `false` | Required field |
| `name` | `string` | - | Input name attribute |
| `mode` | `'popover' \| 'inline'` | `'popover'` | Display mode |
| `showFooter` | `boolean` | `false` | Show footer with actions |
| `events` | `Array<{ date: string; title?: string; tone?: 'default' \| 'success' \| 'warning' \| 'danger' \| 'info' }>` | - | Special events to highlight |
| `eventsMax` | `number` | - | Maximum events to show |
| `eventsDisplay` | `'dots' \| 'badges' \| 'count'` | `'dots'` | Event display style |
| `format` | `'iso' \| 'locale' \| 'custom'` | `'locale'` | Date format |
| `displayFormat` | `string` | - | Custom display format |
| `onInput` | `(detail: DatePickerDetail) => void` | - | Input event handler |
| `onChange` | `(detail: DatePickerDetail) => void` | - | Change event handler |
| `onValueChange` | `(value: string \| null) => void` | - | Value change handler |
| `onOpen` | `() => void` | - | Open event handler |
| `onClose` | `() => void` | - | Close event handler |
| `onInvalid` | `(detail: { raw: string; reason: string }) => void` | - | Invalid input handler |

## Basic Configuration

### Simple Date Picker
Basic date picker with minimal configuration.

```tsx
<DatePicker 
  placeholder="Select a date"
  label="Birthday"
/>
```

### Date Picker with Value
Date picker with initial value.

```tsx
<DatePicker 
  value="2023-12-25"
  label="Selected Date"
  onChange={(detail) => console.log('Date changed:', detail)}
/>
```

### Date Picker with Validation
Date picker with min/max constraints.

```tsx
<DatePicker 
  min="2023-01-01"
  max="2023-12-31"
  placeholder="Select within 2023"
  label="Date Range"
  error="Please select a date within 2023"
/>
```

### Date Picker with Events
Date picker with highlighted events.

```tsx
<DatePicker 
  events={[
    { date: '2023-12-25', title: 'Christmas', tone: 'success' },
    { date: '2023-01-01', title: 'New Year', tone: 'warning' }
  ]}
  eventsDisplay="badges"
  placeholder="Select a date"
  label="Events Calendar"
/>
```

## Date Formats

### ISO Format
ISO 8601 date format (YYYY-MM-DD).

```tsx
<DatePicker 
  format="iso"
  value="2023-12-25"
  placeholder="YYYY-MM-DD"
  label="ISO Format"
/>
```

### Locale Format
Locale-specific date format.

```tsx
<DatePicker 
  format="locale"
  locale="en-US"
  value="2023-12-25"
  placeholder="MM/DD/YYYY"
  label="Locale Format"
/>
```

### Custom Format
Custom date display format.

```tsx
<DatePicker 
  format="custom"
  displayFormat="DD MMM YYYY"
  value="2023-12-25"
  placeholder="25 Dec 2023"
  label="Custom Format"
/>
```

## Display Modes

### Popover Mode
Default popover mode for date selection.

```tsx
<DatePicker 
  mode="popover"
  placeholder="Click to select date"
  label="Popover Date Picker"
/>
```

### Inline Mode
Inline calendar display.

```tsx
<DatePicker 
  mode="inline"
  placeholder="Inline calendar"
  label="Inline Date Picker"
/>
```

## Advanced Features

### Localization
Date picker with custom locale and translations.

```tsx
function LocalizedDatePicker() {
  const translations = {
    'Select date': 'Seleccionar fecha',
    'January': 'Enero',
    'February': 'Febrero',
    'Today': 'Hoy',
    'Clear': 'Limpiar'
  };

  return (
    <DatePicker 
      locale="es-ES"
      translations={translations}
      weekStart={1}
      placeholder="Seleccionar fecha"
      label="Calendario en Español"
    />
  );
}
```

### Event Handling
Comprehensive event handling for date picker interactions.

```tsx
function EventfulDatePicker() {
  const [date, setDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (detail) => {
    setDate(detail.value);
    console.log('Date changed:', detail);
  };

  const handleOpen = () => {
    setIsOpen(true);
    console.log('Date picker opened');
  };

  const handleClose = () => {
    setIsOpen(false);
    console.log('Date picker closed');
  };

  const handleInvalid = (detail) => {
    console.log('Invalid input:', detail);
  };

  return (
    <DatePicker 
      value={date}
      open={isOpen}
      onChange={handleDateChange}
      onOpen={handleOpen}
      onClose={handleClose}
      onInvalid={handleInvalid}
      placeholder="Select a date"
      label="Eventful Date Picker"
      clearable={true}
      allowInput={true}
    />
  );
}
```

### Custom Events
Date picker with custom events and styling.

```tsx
function EventfulDatePicker() {
  const events = [
    { date: '2023-12-25', title: 'Christmas Day', tone: 'success' },
    { date: '2023-12-31', title: 'New Year Eve', tone: 'warning' },
    { date: '2023-11-23', title: 'Thanksgiving', tone: 'info' },
    { date: '2023-10-31', title: 'Halloween', tone: 'danger' }
  ];

  return (
    <DatePicker 
      events={events}
      eventsMax={3}
      eventsDisplay="count"
      placeholder="Select a date"
      label="Events Calendar"
      showFooter={true}
    />
  );
}
```

### Range Selection
Date picker for selecting date ranges.

```tsx
function RangeDatePicker() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <DatePicker 
        value={startDate}
        onChange={(detail) => setStartDate(detail.value)}
        placeholder="Start date"
        label="Start Date"
        max={endDate || undefined}
      />
      <DatePicker 
        value={endDate}
        onChange={(detail) => setEndDate(detail.value)}
        placeholder="End date"
        label="End Date"
        min={startDate || undefined}
      />
    </div>
  );
}
```

## Advanced Examples

### Complete Date Management
Full-featured date picker with all capabilities.

```tsx
function CompleteDatePicker() {
  const [date, setDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');

  const events = [
    { date: '2023-12-25', title: 'Christmas', tone: 'success' },
    { date: '2023-01-01', title: 'New Year', tone: 'warning' },
    { date: '2023-07-04', title: 'Independence Day', tone: 'danger' }
  ];

  const validateDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);
    
    if (dateString && (date < today || date > maxDate)) {
      return 'Please select a date within the next year';
    }
    return '';
  };

  const handleDateChange = (detail) => {
    setDate(detail.value);
    setError(validateDate(detail.value));
  };

  const handleClear = () => {
    setDate('');
    setError('');
  };

  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Complete Date Picker
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Full-featured date picker with validation, events, and comprehensive event handling.
        </div>
      </div>
      
      {/* Date Picker */}
      <div style={{ 
        padding: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <DatePicker 
          value={date}
          open={isOpen}
          min="2023-01-01"
          max="2024-12-31"
          locale="en-US"
          weekStart={0}
          size="md"
          shape="default"
          variant="default"
          placeholder="Select a date"
          label="Appointment Date"
          hint="Select a date within the next year"
          error={error}
          clearable={true}
          allowInput={true}
          closeOnSelect={true}
          outsideClick="navigate"
          showFooter={true}
          events={events}
          eventsMax={3}
          eventsDisplay="badges"
          format="locale"
          onChange={handleDateChange}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          onInvalid={(detail) => console.log('Invalid input:', detail)}
        />
      </div>
      
      {/* Controls */}
      <div style={{ 
        padding: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        display: 'flex',
        gap: '16px',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            backgroundColor: isOpen ? '#3b82f6' : '#ffffff',
            color: isOpen ? '#ffffff' : '#374151',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isOpen ? 'Close' : 'Open'} Calendar
        </button>
        <button
          onClick={handleClear}
          disabled={!date}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            backgroundColor: !date ? '#f3f4f6' : '#ffffff',
            color: !date ? '#9ca3af' : '#374151',
            cursor: !date ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          Clear Selection
        </button>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          Selected: {date || 'None'}
        </span>
      </div>
      
      {/* Information */}
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Date Information</h4>
        {date && (
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              <strong>Selected Date:</strong> {date}
            </div>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              <strong>Is Weekend:</strong> {isWeekend(date) ? 'Yes' : 'No'}
            </div>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              <strong>Validation:</strong> {error ? 'Invalid' : 'Valid'}
            </div>
          </div>
        )}
      </div>
      
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Complete Date Picker Summary
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Date Picker Type: Complete Date Management
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Features: Validation, Events, Localization, Custom Formatting
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Events: Christmas, New Year, Independence Day
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Validation: Date range and format validation
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Multi-Language Date Picker
Date picker with multiple language support.

```tsx
function MultiLanguageDatePicker() {
  const [language, setLanguage] = useState('en');
  const [date, setDate] = useState('');

  const translations = {
    en: {
      'Select date': 'Select date',
      'January': 'January',
      'February': 'February',
      'March': 'March',
      'April': 'April',
      'May': 'May',
      'June': 'June',
      'July': 'July',
      'August': 'August',
      'September': 'September',
      'October': 'October',
      'November': 'November',
      'December': 'December',
      'Today': 'Today',
      'Clear': 'Clear'
    },
    es: {
      'Select date': 'Seleccionar fecha',
      'January': 'Enero',
      'February': 'Febrero',
      'March': 'Marzo',
      'April': 'Abril',
      'May': 'Mayo',
      'June': 'Junio',
      'July': 'Julio',
      'August': 'Agosto',
      'September': 'Septiembre',
      'October': 'Octubre',
      'November': 'Noviembre',
      'December': 'Diciembre',
      'Today': 'Hoy',
      'Clear': 'Limpiar'
    },
    fr: {
      'Select date': 'Sélectionner une date',
      'January': 'Janvier',
      'February': 'Février',
      'March': 'Mars',
      'April': 'Avril',
      'May': 'Mai',
      'June': 'Juin',
      'July': 'Juillet',
      'August': 'Août',
      'September': 'Septembre',
      'October': 'Octobre',
      'November': 'Novembre',
      'December': 'Décembre',
      'Today': 'Aujourd\'hui',
      'Clear': 'Effacer'
    }
  };

  const locales = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR'
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Multi-Language Date Picker
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Date picker with support for multiple languages and localization.
        </div>
      </div>
      
      {/* Language Selector */}
      <div style={{ 
        padding: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#6b7280' }}>
            Select Language:
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              fontSize: '14px'
            }}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
        
        <DatePicker 
          value={date}
          onChange={(detail) => setDate(detail.value)}
          locale={locales[language]}
          translations={translations[language]}
          weekStart={language === 'en' ? 0 : 1}
          placeholder={translations[language]['Select date']}
          label="Date Selection"
          size="md"
          shape="soft"
        />
      </div>
      
      <div style={{ 
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Multi-Language Date Picker Summary
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Date Picker Type: Multi-Language Support
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Languages: English, Spanish, French
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Features: Custom translations, locale-specific formatting
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            • Week Start: Language-specific (US: Sunday, EU: Monday)
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Styling and Theming

### CSS Custom Properties
Customize date picker appearance:

```css
:root {
  --ui-date-picker-bg: #ffffff;
  --ui-date-picker-text: #374151;
  --ui-date-picker-border: 1px solid #e5e7eb;
  --ui-date-picker-focus: #3b82f6;
  --ui-date-picker-hover: #f3f4f6;
  --ui-date-picker-selected: #dbeafe;
  --ui-date-picker-today: #fee2e2;
  --ui-date-picker-disabled: #f3f4f6;
  --ui-date-picker-error: #ef4444;
  --ui-date-picker-success: #10b981;
}
```

### Theme Customization
Switch between different date picker themes:

```css
ui-date-picker[variant="default"] {
  --ui-date-picker-border: 1px solid #e5e7eb;
  --ui-date-picker-focus: #3b82f6;
  --ui-date-picker-selected: #dbeafe;
}

ui-date-picker[variant="contrast"] {
  --ui-date-picker-border: 2px solid #374151;
  --ui-date-picker-focus: #1f2937;
  --ui-date-picker-selected: #93c5fd;
}

ui-date-picker[shape="square"] {
  border-radius: 0;
}

ui-date-picker[shape="soft"] {
  border-radius: 12px;
}

ui-date-picker[size="sm"] {
  padding: 6px 10px;
  font-size: 12px;
}

ui-date-picker[size="lg"] {
  padding: 12px 16px;
  font-size: 16px;
}
```

### Calendar Customization
Customize calendar appearance:

```css
ui-date-picker-calendar {
  --ui-calendar-bg: #ffffff;
  --ui-calendar-text: #374151;
  --ui-calendar-header: #f9fafb;
  --ui-calendar-border: 1px solid #e5e7eb;
  --ui-calendar-weekend: #fee2e2;
  --ui-calendar-today: #3b82f6;
  --ui-calendar-selected: #dbeafe;
  --ui-calendar-disabled: #f3f4f6;
}

ui-date-picker-calendar[week-start="1"] {
  /* Monday as first day of week */
}

ui-date-picker-calendar[week-start="0"] {
  /* Sunday as first day of week */
}
```

### Event Styling
Customize event display:

```css
ui-date-picker-event {
  --ui-event-dot-size: 6px;
  --ui-event-badge-padding: 2px 6px;
  --ui-event-count-size: 10px;
}

ui-date-picker-event[type="success"] {
  --ui-event-color: #10b981;
}

ui-date-picker-event[type="warning"] {
  --ui-event-color: #f59e0b;
}

ui-date-picker-event[type="danger"] {
  --ui-event-color: #ef4444;
}

ui-date-picker-event[type="info"] {
  --ui-event-color: #3b82f6;
}
```

### Animation Customization
Customize date picker animations:

```css
ui-date-picker {
  --ui-date-picker-transition: all 0.2s ease-in-out;
}

ui-date-picker-calendar {
  transition: opacity var(--ui-date-picker-transition);
  animation: calendar-slide 0.3s ease-out;
}

@keyframes calendar-slide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

ui-date-picker-calendar[open] {
  animation: calendar-slide-reverse 0.3s ease-in;
}

@keyframes calendar-slide-reverse {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
```

## Accessibility

### ARIA Attributes
DatePicker components include proper ARIA attributes:

- `role="combobox"` for input container
- `role="button"` for calendar trigger
- `role="grid"` for calendar grid
- `role="row"` for calendar rows
- `role="gridcell"` for calendar cells
- `aria-expanded` for calendar state
- `aria-selected` for selected dates
- `aria-disabled` for disabled dates
- `aria-label` for date descriptions

### Keyboard Navigation
- Tab navigation through interactive elements
- Arrow keys for date navigation
- Enter/Space for date selection
- Escape to close calendar
- Home/End for first/last day of month
- Page Up/Down for month navigation
- Ctrl + Home/End for year navigation

### Screen Reader Support
- Date format announcements
- Selected date descriptions
- Calendar structure navigation
- Event and holiday announcements
- Error state descriptions
- Loading state notifications

## Best Practices

1. **Use appropriate date format**: Match format to user locale and expectations
2. **Implement proper validation**: Validate date ranges and formats
3. **Provide clear labels**: Use descriptive labels and placeholders
4. **Handle edge cases**: Consider weekends, holidays, and special dates
5. **Support keyboard navigation**: Ensure all functionality is keyboard accessible
6. **Use proper ARIA attributes**: Implement appropriate accessibility roles
7. **Consider localization**: Support multiple languages and date formats
8. **Provide feedback**: Show loading states and validation feedback
9. **Test with screen readers**: Verify accessibility compatibility
10. **Handle time zones**: Consider time zone implications for date selection

## Related Components

- [TimePicker](./time-picker) - Time selection component
- [DateTimePicker](./date-time-picker) - Combined date and time selection
- [DateRangePicker](./date-range-picker) - Date range selection
- [Calendar](./calendar) - Calendar component
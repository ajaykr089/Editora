---
title: Date Range Picker
description: Interactive date-range picker for scheduling and reporting flows.
sidebar_label: Date Range Picker
---

# Date Range Picker

```tsx live
function DateRangePickerDemo() {
  const [detail, setDetail] = React.useState(null);
  return (
    <ThemeProvider>
      <DateRangePicker
        label="Incident window"
        rangeVariant="single-field"
        closeOnSelect
        clearable
        allowPartial
        value='{"start":"2026-03-11","end":"2026-03-13"}'
        onChange={setDetail}
      />
      {detail && <pre>{JSON.stringify(detail, null, 2)}</pre>}
    </ThemeProvider>
  );
}
```

## Key Props

`value`, `defaultValue`, `open`, `defaultOpen`, `min`, `max`, `locale`, `translations`, `weekStart`, `size`, `shape`, `bare`, `variant`, `state`, `rangeVariant`, `label`, `hint`, `error`, `allowSameDay`, `allowPartial`, `closeOnSelect`, `clearable`, `disabled`, `readOnly`, `required`, `name`, `nameStart`, `nameEnd`, `mode`, `showFooter`, `onInput`, `onChange`, `onValueChange`, `onOpen`, `onClose`, `onInvalid`

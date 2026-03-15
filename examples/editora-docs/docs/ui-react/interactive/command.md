---
title: Command
description: Search-first command surface with list selection.
sidebar_label: Command
---

# Command

A command palette component that provides search-first selection from a list of items. Built as a composed component with a root container and searchable items.

```tsx
import { Command } from '@editora/ui-react';

<Command
  placeholder="Search commands"
  emptyText="No matching commands"
  onQueryChange={(value) => console.log(value)}
  onSelect={(detail) => console.log(detail.value)}
>
  <Command.Item value="publish" label="Publish update">
    Publish update
  </Command.Item>
  <Command.Item value="archive" label="Archive draft">
    Archive draft
  </Command.Item>
</Command>;
```

## Sub-components

### Command
Root container that wraps the command palette interface. Handles search input and item selection.

**Props:**
- `placeholder?: string` — Placeholder text for the search input
- `emptyText?: string` — Text displayed when no items match the search
- `onSelect?: (detail: CommandSelectDetail) => void` — Fired when an item is selected
- `onQueryChange?: (value: string) => void` — Fired when the search query changes

**Type: `CommandSelectDetail`**
```tsx
{
  index: number;        // Index position of selected item
  item: HTMLElement;    // The HTML element that was selected
  label: string;        // The item's label text
  value?: string;       // The item's value attribute
}
```

### Command.Item
Individual command item within the command palette. Renders as a searchable button.

**Props:**
- `value?: string` — Value associated with this item
- `label?: string` — Label used for searching and accessibility
- `keywords?: string` — Additional keywords for search matching
- All standard HTML button attributes

## Examples

### Basic Command Palette

```tsx
<Command
  placeholder="Type a command..."
  emptyText="No commands found"
  onSelect={(detail) => {
    console.log('Selected:', detail.value);
  }}
>
  <Command.Item value="new" label="New file">
    Create new file
  </Command.Item>
  <Command.Item value="open" label="Open file">
    Open existing file
  </Command.Item>
  <Command.Item value="save" label="Save file">
    Save current file
  </Command.Item>
</Command>
```

### With Search Filtering

```tsx
export function FilteredCommandPalette() {
  const [query, setQuery] = React.useState('');

  const commands = [
    { value: 'bold', label: 'Bold', keywords: 'format text' },
    { value: 'italic', label: 'Italic', keywords: 'format text' },
    { value: 'underline', label: 'Underline', keywords: 'format text' },
    { value: 'strike', label: 'Strike', keywords: 'format text' }
  ];

  return (
    <Command
      placeholder="Search formatting..."
      onQueryChange={setQuery}
      onSelect={(detail) => {
        console.log('Applied formatting:', detail.value);
      }}
    >
      {commands.map((cmd) => (
        <Command.Item 
          key={cmd.value}
          value={cmd.value} 
          label={cmd.label}
          keywords={cmd.keywords}
        >
          {cmd.label}
        </Command.Item>
      ))}
    </Command>
  );
}
```

### With Keyboard Shortcuts

```tsx
<Command
  placeholder="Search actions..."
  onSelect={(detail) => handleAction(detail.value)}
>
  <Command.Item value="save" label="Save file">
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      Save file
      <span style={{ fontSize: '12px', opacity: 0.6 }}>⌘S</span>
    </div>
  </Command.Item>
  <Command.Item value="export" label="Export as PDF">
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      Export as PDF
      <span style={{ fontSize: '12px', opacity: 0.6 }}>⌘E</span>
    </div>
  </Command.Item>
</Command>
```

## CSS Variables

The `ui-command` web component supports these CSS custom properties for customization:

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui-command-bg` | `#ffffff96` | Background color |
| `--ui-command-text` | `#0f172a` | Text color |
| `--ui-command-muted` | `#64748b` | Muted/disabled text color |
| `--ui-command-border` | `1px solid #cbd5e1ac` | Border style |
| `--ui-command-accent` | `#2563eb` | Highlight/accent color |
| `--ui-command-focus` | `#2563eb` | Focus ring color |
| `--ui-command-radius` | `16px` | Border radius |
| `--ui-command-shadow` | `none` | Box shadow |


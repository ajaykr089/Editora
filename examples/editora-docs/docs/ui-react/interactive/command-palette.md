---
title: Command Palette
description: Overlay command launcher built on top of the command primitive.
sidebar_label: Command Palette
---

# Command Palette

A full-screen command palette overlay that provides fast access to commands with search functionality. Built as a composed component with a root container and command items.

```tsx
import { CommandPalette } from '@editora/ui-react';

<CommandPalette open onSelect={(detail) => console.log(detail.value)}>
  <CommandPalette.Item value="new-doc" label="New document">
    New document
  </CommandPalette.Item>
  <CommandPalette.Item value="open-settings" label="Open settings">
    Open settings
  </CommandPalette.Item>
</CommandPalette>;
```

## Sub-components

### CommandPalette
Root container that renders a full-screen command palette overlay with search and command list.

**Props:**
- `open?: boolean` — Whether the palette is open
- `query?: string` — Current search query
- `placeholder?: string` — Placeholder text for the search input
- `emptyText?: string` — Text displayed when no items match the search
- `headless?: boolean` — Hide the overlay and panel styling (for custom styling)
- `onOpen?: () => void` — Fired when the palette opens
- `onClose?: () => void` — Fired when the palette closes
- `onOpenChange?: (detail: CommandPaletteOpenChangeDetail) => void` — Fired when open state changes
- `onSelect?: (detail: CommandPaletteSelectDetail) => void` — Fired when a command is selected
- `onQueryChange?: (detail: CommandPaletteQueryChangeDetail) => void` — Fired when the search query changes

**Type: `CommandPaletteSelectDetail`**
```tsx
{
  index: number;        // Index position of selected item
  item: HTMLElement;    // The HTML element that was selected
  label: string;        // The item's label text
  value?: string;       // The item's value attribute
}
```

**Type: `CommandPaletteQueryChangeDetail`**
```tsx
{
  value: string;        // The new search query
  previousValue?: string;  // The previous search query
}
```

**Type: `CommandPaletteOpenChangeDetail`**
```tsx
{
  open: boolean;        // Whether the palette is now open
}
```

**Imperative Methods** (via ref):
- `openPalette()` — Opens the palette
- `closePalette()` — Closes the palette
- `focusSearch()` — Focuses the search input
- `clearQuery()` — Clears the search query
- `query: string` — Current search query (property)

### CommandPalette.Item
Individual command item within the palette. Renders as a searchable button.

**Props:**
- `value?: string` — Value associated with this item
- `label?: string` — Label used for searching and accessibility
- `keywords?: string` — Additional keywords for search matching
- All standard HTML button attributes

## Examples

### Basic Command Palette

```tsx
export function BasicPalette() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <CommandPalette
      open={open}
      placeholder="Search commands (Ctrl+K)..."
      onClose={() => setOpen(false)}
      onSelect={(detail) => {
        console.log('Selected:', detail.value);
        setOpen(false);
      }}
    >
      <CommandPalette.Item value="new-file" label="New file">
        Create new file
      </CommandPalette.Item>
      <CommandPalette.Item value="new-folder" label="New folder">
        Create new folder
      </CommandPalette.Item>
      <CommandPalette.Item value="settings" label="Settings">
        Open settings
      </CommandPalette.Item>
    </CommandPalette>
  );
}
```

### With Categories

```tsx
export function CategorizedPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const commands = [
    { category: 'File', label: 'New file', value: 'new-file', keywords: 'create file document' },
    { category: 'File', label: 'Open file', value: 'open-file', keywords: 'open browse file' },
    { category: 'Edit', label: 'Cut', value: 'cut', keywords: 'edit clipboard' },
    { category: 'Edit', label: 'Copy', value: 'copy', keywords: 'edit clipboard' },
    { category: 'Edit', label: 'Paste', value: 'paste', keywords: 'edit clipboard' }
  ];

  const grouped = commands.reduce((acc, cmd) => {
    const key = cmd.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(cmd);
    return acc;
  }, {} as Record<string, typeof commands>);

  return (
    <CommandPalette
      open={open}
      placeholder="Search all commands..."
      onClose={() => setOpen(false)}
      onSelect={(detail) => {
        console.log('Executed:', detail.label);
        setOpen(false);
      }}
      onQueryChange={(detail) => setQuery(detail.value)}
    >
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} style={{ paddingTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', color: '#64748b', textTransform: 'uppercase' }}>
            {category}
          </div>
          {items.map((cmd) => (
            <CommandPalette.Item
              key={cmd.value}
              value={cmd.value}
              label={cmd.label}
              keywords={cmd.keywords}
              style={{ padding: '8px 12px', fontSize: 14 }}
            >
              {cmd.label}
            </CommandPalette.Item>
          ))}
        </div>
      ))}
    </CommandPalette>
  );
}
```

### With Metadata

```tsx
<CommandPalette
  open={open}
  placeholder="Search projects..."
  onSelect={(detail) => {
    console.log('Opened project:', detail.value);
    setOpen(false);
  }}
>
  {projects.map((project) => (
    <CommandPalette.Item
      key={project.id}
      value={project.id}
      label={project.name}
      keywords={project.tags?.join(' ')}
      style={{
        display: 'grid',
        gap: 4,
        padding: '10px 12px',
        borderRadius: 8,
        cursor: 'pointer'
      }}
    >
      <div style={{ fontWeight: 500 }}>{project.name}</div>
      <div style={{ fontSize: 12, color: '#64748b' }}>
        {project.description}
      </div>
    </CommandPalette.Item>
  ))}
</CommandPalette>
```

## Keyboard Shortcuts

The command palette integrates with keyboard shortcuts by default:
- **Cmd/Ctrl+K** — Open/close palette (requires manual event listener)
- **Escape** — Close palette
- **Arrow Up/Down** — Navigate commands
- **Enter** — Select highlighted command

## CSS Variables

The underlying `ui-command-palette` web component supports these CSS custom properties:

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui-command-z` | `1300` | Z-index for the palette overlay |
| `--ui-command-backdrop` | `rgba(2, 6, 23, 0.52)` | Backdrop color |
| `--ui-command-bg` | `#ffffff96` | Background color (inherited from Command) |
| `--ui-command-text` | `#0f172a` | Text color (inherited from Command) |
| `--ui-command-muted` | `#64748b` | Muted text color (inherited from Command) |
| `--ui-command-border` | `1px solid #cbd5e1ac` | Border style (inherited from Command) |
| `--ui-command-accent` | `#2563eb` | Highlight color (inherited from Command) |
| `--ui-command-focus` | `#2563eb` | Focus ring color (inherited from Command) |
| `--ui-command-radius` | `16px` | Border radius (inherited from Command) |


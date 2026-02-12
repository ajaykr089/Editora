# Fullscreen Plugin

A comprehensive fullscreen plugin for the Rich Text Editor that allows users to expand the editor to fill the entire viewport.

## Features

- **Toggle Fullscreen**: Click the fullscreen button in the toolbar to expand/collapse the editor
- **Keyboard Support**: Press `Escape` to exit fullscreen mode
- **Responsive**: Editor scales properly in fullscreen mode
- **Toolbar Integration**: Easy-to-use button in the main toolbar

## Installation

The plugin is included in the `@editora/plugins` package.

```tsx
import { FullscreenPlugin, FullscreenPluginProvider } from '@editora/plugins';
```

## Usage

### Basic Setup

The fullscreen plugin is automatically integrated into the EditoraEditor when using `FullscreenPluginProvider`:

```tsx
import { EditoraEditor } from '@editora/react';
import { FullscreenPlugin } from '@editora/plugins';

export default function Editor() {
  return (
    <EditoraEditor
      plugins={[
        // ... other plugins
        FullscreenPlugin(),
      ]}
    />
  );
}
```

### Using the useFullscreen Hook

You can programmatically control fullscreen mode using the `useFullscreen` hook:

```tsx
import { useFullscreen } from '@editora/plugins';

function MyComponent() {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <button onClick={toggleFullscreen}>
      {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    </button>
  );
}
```

## API

### FullscreenPlugin()

Creates a fullscreen plugin instance that adds a toolbar button.

**Returns**: `Plugin`

### FullscreenPluginProvider

Context provider that manages fullscreen state.

**Props**:
- `children: ReactNode` - Child components
- `editor?: Editor` - Optional editor instance

**Context**:
```typescript
interface FullscreenContextType {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}
```

### useFullscreen()

Hook to access fullscreen context.

**Returns**: `FullscreenContextType`

**Throws**: Error if not used within `FullscreenPluginProvider`

## Styling

The fullscreen plugin uses CSS Modules for scoped styling. The active fullscreen state applies these styles:

- Positions editor as `fixed` filling the entire viewport
- Sets z-index to `9999` to appear above other content
- Hides body scrollbars
- Maintains toolbar and content proportions

### CSS Classes

- `.fullscreenActive` - Applied to editor when fullscreen is active

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Escape** | Exit fullscreen mode |

## Browser Support

The fullscreen plugin works in all modern browsers that support:
- CSS Grid/Flexbox
- ES6+ JavaScript features
- CSS Custom Properties

## Accessibility

- Toolbar button is keyboard accessible
- Escape key provides standard fullscreen exit mechanism
- Maintains proper focus management

## Example

```tsx
import React from 'react';
import { EditoraEditor } from '@editora/react';
import {
  BoldPlugin,
  ItalicPlugin,
  FullscreenPlugin,
} from '@editora/plugins';

export default function Editor() {
  return (
    <EditoraEditor
      plugins={[
        BoldPlugin(),
        ItalicPlugin(),
        FullscreenPlugin(),
      ]}
    />
  );
}
```

## Notes

- The fullscreen button appears in the main toolbar
- Fullscreen state is maintained until explicitly closed
- All editor functionality remains available in fullscreen mode
- The fullscreen state is local to the component (not persisted)

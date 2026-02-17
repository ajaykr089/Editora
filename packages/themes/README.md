# @editora/themes

<div align="center">
  <img src="../../images/editora_logo_blocks.svg" alt="Editora Logo" width="200" height="auto">
</div>

<div align="center">
  <img src="../../images/theme-comparison.png" alt="Editora Themes - Light vs Dark Theme Comparison" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  <p><em>Themes and styling system with built-in light/dark mode support</em></p>
</div>

Themes and styling system for Editora Rich Text Editor with built-in light/dark mode support and customizable design tokens.

## 📦 Installation

```bash
npm install @editora/themes
```

## 🎯 Overview

The themes package provides a comprehensive styling system using CSS variables, making it easy to customize the editor's appearance and support multiple themes.

## ✨ Features

- **Light & Dark Themes**: Pre-built themes with automatic system detection
- **CSS Variables**: Fully customizable using CSS custom properties
- **Responsive**: Mobile-friendly and adaptive layouts
- **Accessible**: High contrast ratios and WCAG compliance
- **Modern Design**: Clean, professional appearance
- **Easy Customization**: Override any variable to match your brand

## 🚀 Quick Start

### Basic Usage

```tsx
import "@editora/themes/theme.css";
OR
import "@editora/themes/themes/default.css";
import { EditoraEditor } from '@editora/react';

function App() {
  return <EditoraEditor theme="light" />;
}
```

### With Theme Toggle

```tsx
import "@editora/themes/theme.css";
OR
import "@editora/themes/themes/default.css";
import { EditoraEditor } from '@editora/react';
import { useState } from 'react';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div data-theme={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      
      <EditoraEditor theme={theme} />
    </div>
  );
}
```

### Auto Theme Detection

```tsx
import "@editora/themes/theme.css";
OR
import "@editora/themes/themes/default.css";
import { EditoraEditor } from '@editora/react';

function App() {
  return <EditoraEditor theme="auto" />;
}
```

## 🎨 Built-in Themes

### Light Theme (Default)

Clean, professional light theme suitable for most applications.

```tsx
<EditoraEditor theme="light" />
```

### Dark Theme

Modern dark theme with comfortable colors for low-light environments.

```tsx
<EditoraEditor theme="dark" />
```

### Auto Theme

Automatically matches system preferences.

```tsx
<EditoraEditor theme="auto" />
```

## 🔧 Customization

### CSS Variables

All theme colors and sizes use CSS variables for easy customization.

#### Color Variables

```css
:root {
  /* Primary colors */
  --editora-primary: #0066cc;
  --editora-primary-hover: #0052a3;
  --editora-primary-active: #003d7a;
  
  /* Background colors */
  --editora-bg: #ffffff;
  --editora-bg-secondary: #f5f5f5;
  --editora-bg-tertiary: #e0e0e0;
  
  /* Text colors */
  --editora-text: #000000;
  --editora-text-secondary: #666666;
  --editora-text-muted: #999999;
  
  /* Border colors */
  --editora-border: #cccccc;
  --editora-border-focus: #0066cc;
  
  /* Toolbar */
  --editora-toolbar-bg: #f5f5f5;
  --editora-toolbar-border: #cccccc;
  --editora-toolbar-button-hover: #e0e0e0;
  --editora-toolbar-button-active: #d0d0d0;
  
  /* Content area */
  --editora-content-bg: #ffffff;
  --editora-content-padding: 16px;
  
  /* Selection */
  --editora-selection-bg: rgba(0, 102, 204, 0.2);
  
  /* Status colors */
  --editora-error: #dc3545;
  --editora-warning: #ffc107;
  --editora-success: #28a745;
  --editora-info: #17a2b8;
}
```

#### Dark Theme Variables

```css
[data-theme="dark"] {
  --editora-primary: #3399ff;
  --editora-primary-hover: #5cadff;
  --editora-primary-active: #1f8cff;
  
  --editora-bg: #1e1e1e;
  --editora-bg-secondary: #2d2d2d;
  --editora-bg-tertiary: #3d3d3d;
  
  --editora-text: #ffffff;
  --editora-text-secondary: #cccccc;
  --editora-text-muted: #999999;
  
  --editora-border: #444444;
  --editora-border-focus: #3399ff;
  
  --editora-toolbar-bg: #2d2d2d;
  --editora-toolbar-border: #444444;
  --editora-toolbar-button-hover: #3d3d3d;
  --editora-toolbar-button-active: #4d4d4d;
  
  --editora-content-bg: #1e1e1e;
  
  --editora-selection-bg: rgba(51, 153, 255, 0.3);
}
```

#### Size Variables

```css
:root {
  /* Font sizes */
  --editora-font-size-sm: 12px;
  --editora-font-size-base: 14px;
  --editora-font-size-lg: 16px;
  
  /* Spacing */
  --editora-spacing-xs: 4px;
  --editora-spacing-sm: 8px;
  --editora-spacing-md: 16px;
  --editora-spacing-lg: 24px;
  --editora-spacing-xl: 32px;
  
  /* Border radius */
  --editora-radius-sm: 2px;
  --editora-radius-md: 4px;
  --editora-radius-lg: 8px;
  
  /* Shadows */
  --editora-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --editora-shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
  --editora-shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
  
  /* Z-indexes */
  --editora-z-dropdown: 1000;
  --editora-z-modal: 2000;
  --editora-z-tooltip: 3000;
}
```

### Custom Theme Example

```css
/* custom-theme.css */
import "@editora/themes/theme.css";
OR
import "@editora/themes/themes/default.css";

:root {
  /* Brand colors */
  --editora-primary: #7c3aed;
  --editora-primary-hover: #6d28d9;
  --editora-primary-active: #5b21b6;
  
  /* Custom toolbar */
  --editora-toolbar-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --editora-toolbar-button-hover: rgba(255, 255, 255, 0.1);
  
  /* Rounded corners */
  --editora-radius-md: 12px;
  
  /* Custom font */
  --editora-font-family: 'Inter', system-ui, sans-serif;
}
```

## 💡 Usage Examples

### Brand Customization

```css
/* Match your brand colors */
:root {
  --editora-primary: #ff6b6b;
  --editora-primary-hover: #ff5252;
  --editora-toolbar-bg: #ffffff;
  --editora-border: #e0e0e0;
}

.my-editor {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### Compact Mode

```css
/* Smaller toolbar and spacing */
:root {
  --editora-toolbar-height: 32px;
  --editora-spacing-md: 8px;
  --editora-font-size-base: 12px;
}
```

### High Contrast Mode

```css
/* Improve accessibility */
[data-theme="high-contrast"] {
  --editora-bg: #000000;
  --editora-text: #ffffff;
  --editora-border: #ffffff;
  --editora-primary: #ffff00;
}
```

### Minimal Theme

```css
/* Clean, distraction-free editing */
:root {
  --editora-toolbar-bg: transparent;
  --editora-toolbar-border: none;
  --editora-border: transparent;
}

.rte-toolbar {
  border-bottom: 1px solid var(--editora-border);
}
```

## 📱 Responsive Styles

The theme automatically adapts to different screen sizes:

```css
/* Mobile adjustments */
@media (max-width: 768px) {
  :root {
    --editora-toolbar-height: 48px; /* Larger touch targets */
    --editora-font-size-base: 16px; /* Prevent zoom on iOS */
    --editora-spacing-md: 12px;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  :root {
    --editora-content-padding: 20px;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  :root {
    --editora-content-padding: 24px;
  }
}
```

## 🌙 Dark Mode Implementation

### System Preference Detection

```tsx
import { useEffect, useState } from 'react';

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return theme;
}

function App() {
  const theme = useTheme();
  
  return (
    <div data-theme={theme}>
      <EditoraEditor />
    </div>
  );
}
```

### Manual Theme Toggle

```tsx
function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div data-theme={theme}>
      <button onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <EditoraEditor />
    </div>
  );
}
```

## 🎨 Component-Specific Styling

### Toolbar Customization

```css
.rte-toolbar {
  background: linear-gradient(to right, #667eea, #764ba2);
  border-radius: 8px 8px 0 0;
}

.rte-toolbar-button {
  color: white;
  border-radius: 4px;
  transition: all 0.2s;
}

.rte-toolbar-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}
```

### Content Area Styling

```css
.rte-content {
  font-family: 'Georgia', serif;
  font-size: 18px;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
}

.rte-content h1 {
  color: var(--editora-primary);
  border-bottom: 2px solid var(--editora-border);
  padding-bottom: 0.3em;
}
```

### Dialog Styling

```css
.rte-dialog {
  border-radius: var(--editora-radius-lg);
  box-shadow: var(--editora-shadow-lg);
}

.rte-dialog-header {
  background: var(--editora-bg-secondary);
  border-radius: var(--editora-radius-lg) var(--editora-radius-lg) 0 0;
}
```

## 📄 License

MIT © [Ajay Kumar](https://github.com/ajaykr089)

## 🔗 Links

- [Documentation](https://github.com/ajaykr089/Editora#readme)
- [GitHub Repository](https://github.com/ajaykr089/Editora)
- [Issue Tracker](https://github.com/ajaykr089/Editora/issues)
- [npm Package](https://www.npmjs.com/package/@editora/themes)

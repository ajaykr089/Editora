---
title: ThemeProvider
description: Theme context provider for managing design tokens and theme persistence.
sidebar_label: ThemeProvider
---

# ThemeProvider

The `ThemeProvider` component provides a context for managing theme tokens and applying them to the Editora component system. It supports theme persistence, token merging, and seamless integration with the design system.

## Basic Usage

```tsx
import { ThemeProvider } from '@editora/ui-react';

function App() {
  return (
    <ThemeProvider>
      <YourApplication />
    </ThemeProvider>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tokens` | `Partial<ThemeTokens>` | - | Initial theme tokens to merge with defaults |
| `children` | `React.ReactNode` | - | Child components that will have theme access |
| `storageKey` | `string \| null` | `'editora.theme.tokens'` | localStorage key for theme persistence |

## Theme Tokens

The theme system uses a comprehensive token system with the following structure:

```typescript
interface ThemeTokens {
  colors: {
    primary: string;
    text: string;
    background: string;
    // ... more color tokens
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    // ... more spacing tokens
  };
  typography: {
    size: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      // ... more typography tokens
    };
    // ... more typography properties
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    // ... more shadow tokens
  };
  motion: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
  zIndex: {
    base: number;
    modal: number;
    dropdown: number;
    // ... more z-index tokens
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
```

## Basic Theming

### Custom Colors
Apply custom color tokens to override defaults.

```tsx
function CustomThemeApp() {
  const customTokens = {
    colors: {
      primary: '#0f766e',
      text: '#0f172a',
      background: '#ffffff'
    }
  };

  return (
    <ThemeProvider tokens={customTokens}>
      <YourApplication />
    </ThemeProvider>
  );
}
```

### Typography Customization
Customize typography tokens for consistent text styling.

```tsx
function TypographyTheme() {
  const typographyTokens = {
    typography: {
      size: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '24px'
      }
    }
  };

  return (
    <ThemeProvider tokens={typographyTokens}>
      <YourApplication />
    </ThemeProvider>
  );
}
```

### Spacing System
Define custom spacing tokens for consistent layout.

```tsx
function SpacingTheme() {
  const spacingTokens = {
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    }
  };

  return (
    <ThemeProvider tokens={spacingTokens}>
      <YourApplication />
    </ThemeProvider>
  );
}
```

## Theme Persistence

The ThemeProvider automatically persists theme tokens to localStorage and restores them on subsequent visits.

### Default Persistence
By default, themes are persisted using the key `'editora.theme.tokens'`.

```tsx
// Theme is automatically saved and restored
<ThemeProvider>
  <YourApplication />
</ThemeProvider>
```

### Custom Storage Key
Use a custom storage key for theme persistence.

```tsx
<ThemeProvider storageKey="my-app.theme">
  <YourApplication />
</ThemeProvider>
```

### Disable Persistence
Disable theme persistence by setting storageKey to null.

```tsx
<ThemeProvider storageKey={null}>
  <YourApplication />
</ThemeProvider>
```

## Advanced Theming

### Theme Switching
Implement theme switching with multiple predefined themes.

```tsx
function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('light');

  const themes = {
    light: {
      colors: {
        primary: '#3b82f6',
        text: '#1f2937',
        background: '#ffffff'
      }
    },
    dark: {
      colors: {
        primary: '#60a5fa',
        text: '#f3f4f6',
        background: '#111827'
      }
    },
    brand: {
      colors: {
        primary: '#0f766e',
        text: '#0f172a',
        background: '#ffffff'
      }
    }
  };

  return (
    <ThemeProvider tokens={themes[currentTheme]}>
      <div>
        <select 
          value={currentTheme} 
          onChange={(e) => setCurrentTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="brand">Brand</option>
        </select>
        <YourApplication />
      </div>
    </ThemeProvider>
  );
}
```

### Dynamic Theme Updates
Update theme tokens dynamically based on user preferences.

```tsx
function DynamicTheme() {
  const [userPreferences, setUserPreferences] = useState({
    primaryColor: '#3b82f6',
    fontSize: '16px',
    borderRadius: '8px'
  });

  const dynamicTokens = {
    colors: {
      primary: userPreferences.primaryColor
    },
    typography: {
      size: {
        md: userPreferences.fontSize
      }
    },
    radius: userPreferences.borderRadius
  };

  return (
    <ThemeProvider tokens={dynamicTokens}>
      <ThemeControls onPreferencesChange={setUserPreferences} />
      <YourApplication />
    </ThemeProvider>
  );
}
```

### Theme Inheritance
Build upon existing themes by merging tokens.

```tsx
function InheritedTheme() {
  const baseTheme = {
    colors: {
      primary: '#3b82f6',
      text: '#1f2937'
    }
  };

  const extendedTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      secondary: '#64748b',
      accent: '#f59e0b'
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    }
  };

  return (
    <ThemeProvider tokens={extendedTheme}>
      <YourApplication />
    </ThemeProvider>
  );
}
```

## Integration with useTheme Hook

The ThemeProvider works seamlessly with the `useTheme` hook for accessing and updating theme tokens.

```tsx
import { ThemeProvider, useTheme } from '@editora/ui-react';

function ThemeAwareComponent() {
  const { tokens, setTokens } = useTheme();

  const handleColorChange = (color) => {
    setTokens({
      colors: {
        primary: color
      }
    });
  };

  return (
    <div>
      <button onClick={() => handleColorChange('#ef4444')}>
        Red Theme
      </button>
      <button onClick={() => handleColorChange('#10b981')}>
        Green Theme
      </button>
      <div style={{ color: tokens.colors.primary }}>
        Current primary color: {tokens.colors.primary}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeAwareComponent />
    </ThemeProvider>
  );
}
```

## Theme Token Examples

### Complete Theme Example
A comprehensive theme with all token categories.

```tsx
const completeTheme = {
  colors: {
    primary: '#0f766e',
    primaryForeground: '#ffffff',
    secondary: '#64748b',
    secondaryForeground: '#ffffff',
    text: '#0f172a',
    background: '#ffffff',
    muted: '#94a3b8',
    mutedForeground: '#64748b',
    accent: '#f59e0b',
    accentForeground: '#ffffff',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e5e7eb',
    input: '#f3f4f6',
    ring: '#3b82f6'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  typography: {
    size: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '40px'
    },
    weight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  motion: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1060,
    toast: 1070,
    tooltip: 1080
  },
  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1400px'
  }
};

function CompleteThemeApp() {
  return (
    <ThemeProvider tokens={completeTheme}>
      <YourApplication />
    </ThemeProvider>
  );
}
```

## Styling with Theme Tokens

### CSS-in-JS
Use theme tokens in styled components or CSS-in-JS.

```tsx
const StyledButton = styled.button`
  background-color: var(--ui-color-primary);
  color: var(--ui-color-primary-foreground);
  padding: var(--ui-spacing-md);
  border-radius: var(--ui-radius);
  font-size: var(--ui-typography-size-md);
  transition: all var(--ui-motion-duration-normal) var(--ui-motion-easing-ease);
  
  &:hover {
    filter: brightness(0.95);
  }
`;
```

### CSS Custom Properties
Access theme tokens directly in CSS.

```css
.my-component {
  background-color: var(--ui-color-background);
  color: var(--ui-color-text);
  padding: var(--ui-spacing-lg);
  border-radius: var(--ui-radius);
}

.my-component:hover {
  box-shadow: var(--ui-shadow-md);
}
```

## Best Practices

1. **Use semantic tokens**: Prefer semantic names over literal values
2. **Maintain consistency**: Use the same tokens across components
3. **Consider accessibility**: Ensure sufficient color contrast
4. **Test theme switching**: Verify all components work with different themes
5. **Document custom tokens**: Document any custom tokens you add
6. **Use responsive tokens**: Consider different values for different breakpoints

## Related Components

- [useTheme](./use-theme) - Hook for accessing theme tokens
- [Theme Tokens](../guide/theming) - Comprehensive theming guide
- [ThemeProvider](./theme-provider) - Theme context provider
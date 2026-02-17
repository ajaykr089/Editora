# Migration Guide: Editora Toast v1.x to v2.x

This guide helps you migrate from the simple v1.x toast library to the advanced v2.x notification system.

## ✅ Backward Compatibility

**Good news!** Version 2.x maintains 100% backward compatibility. Your existing code will continue to work without any changes.

## 🚀 What's New in v2.x

### Advanced Features

- **Promise Lifecycle Toasts**: Automatic state transitions for async operations
- **Rich Content Support**: HTML, icons, actions, progress bars
- **Queue Management**: Priority-based queuing with overflow strategies
- **Multiple Positions**: Support for all screen corners and center
- **Theming System**: Light, dark, and custom themes
- **Plugin Architecture**: Extensible with custom plugins
- **Accessibility**: WCAG AA compliant with screen reader support
- **Mobile Gestures**: Swipe and drag to dismiss
- **Toast Grouping**: Related notifications can be grouped
- **Editor Integration**: Built-in hooks for rich text editors

### Performance Improvements

- O(1) insertion with optimized queue management
- Batched DOM updates
- Memory leak prevention
- Virtualized rendering for large queues

## 📋 Migration Steps

### Step 1: Update Package

```bash
npm update @editora/toast
# or
npm install @editora/toast@latest
```

### Step 2: Import Changes (Optional)

For advanced features, use the new import:

```typescript
// Old way (still works)
import { toast } from '@editora/toast';
import "@editora/toast/toast.css";
// New way for advanced features
import { toastAdvanced as toast } from '@editora/toast';
import "@editora/toast/toast.css";
```

### Step 3: Enable Advanced Features

#### Promise-Based Toasts

```typescript
// Before
const toastId = toast.loading('Saving...');
saveData().then(() => {
  // Manual update required
  // No built-in way to handle this
});

// After
toast.promise(
  saveData(),
  {
    loading: 'Saving...',
    success: 'Data saved successfully!',
    error: 'Failed to save data'
  }
);
```

#### Rich Content with Actions

```typescript
// Before
toast.success('File uploaded!');

// After
toast.show({
  message: 'File uploaded successfully',
  level: 'success',
  icon: '✓',
  actions: [
    { label: 'View File', onClick: () => openFile() },
    { label: 'Dismiss', onClick: () => {} }
  ]
});
```

#### Progress Indicators

```typescript
// New feature
toast.show({
  message: 'Uploading...',
  level: 'loading',
  progress: { value: 75, showPercentage: true }
});
```

#### Toast Updates

```typescript
// Before
// No built-in update mechanism

// After
const loadingToast = toast.loading('Processing...');
setTimeout(() => {
  toast.update(loadingToast.id, {
    message: 'Complete!',
    level: 'success'
  });
}, 2000);
```

#### Global Configuration

```typescript
// New feature
import { toastAdvanced as toast } from '@editora/toast';

toast.configure({
  position: 'top-right',
  duration: 5000,
  maxVisible: 3,
  theme: 'dark',
  pauseOnHover: true
});
```

## 🎨 Styling Changes

### CSS Variables

The new version uses CSS variables for theming:

```css
:root {
  --editora-toast-bg: rgba(0, 0, 0, 0.85);
  --editora-toast-color: #fff;
  --editora-toast-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  --editora-toast-border-radius: 6px;
}
```

### Theme Support

```html
<!-- Light theme -->
<body data-theme="light">

<!-- Dark theme -->
<body data-theme="dark">
```

## 🔌 Plugin System

Extend functionality with plugins:

```typescript
const analyticsPlugin = {
  name: 'analytics',
  install(manager) {
    manager.on('afterShow', (toast) => {
      analytics.track('toast_shown', { level: toast.level });
    });
  }
};

toast.use(analyticsPlugin);
```

## 📱 Mobile Enhancements

- **Swipe to Dismiss**: Swipe left/right to dismiss toasts
- **Touch Gestures**: Improved touch interaction
- **Responsive Design**: Better mobile layouts

## ♿ Accessibility Improvements

- **ARIA Live Regions**: Screen reader announcements
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling
- **Reduced Motion**: Respects user preferences

## 🏗️ Architecture Changes

### New Core Components

- **ToastManager**: Central orchestrator
- **ToastStore**: State management
- **ToastQueue**: Queue and priority management
- **ToastRenderer**: DOM rendering and animations
- **ToastLifecycle**: Event hooks and plugins

### SSR Safety

The library now safely handles server-side rendering environments.

## 🧪 Testing Your Migration

1. **Run existing tests** - All v1.x functionality should work
2. **Test new features** - Gradually adopt advanced features
3. **Check styling** - Verify toast appearance in your application
4. **Test accessibility** - Use screen readers and keyboard navigation

## 🐛 Troubleshooting

### Common Issues

**Toasts not showing?**
- Check that CSS is loaded: `import "@editora/toast/toast.css"`
- Verify DOM is available (not SSR)

**Styling issues?**
- CSS variables may need updating
- Check for CSS conflicts

**TypeScript errors?**
- Update type imports for advanced features
- Use `ToastOptionsAdvanced` for full type support

## 📞 Support

- 📖 [Documentation](README.md)
- 🐛 [Issues](https://github.com/ajaykr089/Editora/issues)
- 💬 [Discussions](https://github.com/ajaykr089/Editora/discussions)

## 🎯 Next Steps

After migration:

1. Explore advanced features in your application
2. Create custom plugins for your use cases
3. Customize themes to match your design system
4. Integrate with your rich text editor

The v2.x release transforms the simple toast library into a comprehensive notification system while maintaining the simplicity and reliability you expect.
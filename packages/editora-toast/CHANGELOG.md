# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.0.0 (2026-02-14)

### 🎉 Major Upgrade: Advanced Notification System

**Breaking Changes:** None - Full backward compatibility maintained

#### ✨ New Features

- **Promise Lifecycle Toasts**: Automatic state transitions for async operations
  ```typescript
  toast.promise(uploadFile(), {
    loading: 'Uploading...',
    success: 'Uploaded!',
    error: 'Failed'
  });
  ```

- **Rich Content Support**: HTML, icons, actions, and progress bars
  ```typescript
  toast.show({
    message: 'File uploaded',
    icon: '✓',
    actions: [{ label: 'View', onClick: () => {} }],
    progress: { value: 75 }
  });
  ```

- **Toast Updates**: Modify existing toasts dynamically
  ```typescript
  const toast = toast.loading('Saving...');
  toast.update(toast.id, { message: 'Saved!', level: 'success' });
  ```

- **Multiple Positions**: Support for all screen corners and center
- **Queue Management**: Priority-based queuing with overflow strategies
- **Theming System**: Light, dark, and custom themes with CSS variables
- **Plugin Architecture**: Extensible with custom plugins
- **Toast Grouping**: Related notifications can be grouped together
- **Spring Physics Animations**: Realistic spring-based animations with customizable physics
- **Custom Animation Hooks**: User-defined animation functions for complete control
- **Animation Manager**: Centralized animation system supporting CSS, spring, and custom animations
- **Accessibility**: WCAG AA compliant with screen reader support
- **Mobile Gestures**: Swipe and drag to dismiss
- **Editor Integration**: Built-in hooks for rich text editors

#### 🏗️ Architecture Changes

- **New Core Components**:
  - `ToastManager`: Central orchestrator
  - `ToastStore`: State management
  - `ToastQueue`: Queue and priority management
  - `ToastRenderer`: DOM rendering and animations
  - `ToastLifecycle`: Event hooks and plugins

- **Performance Improvements**:
  - O(1) insertion with optimized queue management
  - Batched DOM updates
  - Memory leak prevention
  - Virtualized rendering for large queues

- **SSR Safety**: Server-side rendering compatible
- **Security**: HTML sanitization and XSS protection

#### 🎨 UI/UX Enhancements

- Modern minimal design with consistent spacing
- Non-blocking interaction patterns
- Stacking system for grouped toasts
- Z-index management
- Responsive layout for mobile devices
- Focus management and keyboard navigation

#### 📦 API Additions

- `toastAdvanced.show()` - Full-featured toast creation
- `toastAdvanced.update()` - Update existing toasts
- `toastAdvanced.promise()` - Promise lifecycle toasts
- `toastAdvanced.group()` - Group related toasts
- `toastAdvanced.configure()` - Global configuration
- `toastAdvanced.use()` - Install plugins
- `toastAdvanced.onEditorEvent()` - Editor integration hooks

#### 🔧 Configuration Options

```typescript
toast.configure({
  position: 'top-right',
  duration: 5000,
  maxVisible: 5,
  theme: 'dark',
  pauseOnHover: true,
  enableAccessibility: true,
  swipeDismiss: true,
  dragDismiss: false
});
```

#### 📚 Documentation

- Comprehensive README with examples
- Migration guide for v1.x → v2.x
- Interactive demo with all features
- TypeScript definitions for all APIs

#### 🧪 Quality Assurance

- Full backward compatibility maintained
- Extensive TypeScript typing
- Accessibility compliance (WCAG AA)
- Cross-browser testing
- Mobile device support

---

## 1.0.2 (2026-02-13)

**Note:** Version bump only for package @editora/toast

## 1.0.1 (2026-02-12)

**Note:** Version bump only for package @editora/toast

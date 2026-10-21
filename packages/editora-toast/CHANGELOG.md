# Change Log

## 2.1.0

### Minor Changes

- ba54cae: Toast: a modern look, a stack that opens on hover, keyboard access and a complete `toast` API.

  **Look.** The card is now opaque and neutral, with a status icon (one shape per level, a spinner for loading), instead of a 6% tint with a coloured stripe. The old tint made the toast 94% transparent, so the page showed through its text, and in dark mode the primary action button was white on white. The `dark` theme is now dark (it was a white card), `richColors` tints the card, `colored` and `glass` meet 4.5:1 contrast, and every theme was checked at 4.5:1 for text and 3:1 for icons in light and dark. `system` follows `prefers-color-scheme` and the app's own switch (a `dark` class or `data-theme`, `data-bs-theme`, `data-color-scheme`, `data-mantine-color-scheme` on `<html>`). `icon` accepts text, a DOM node or `false`; `configure({ icons: false })` turns the built-in icons off.

  **Stacking.** Several toasts fold into a deck by default (`stack: true, expand: false`): the newest in full, older ones as edges behind it; hover, focus or a tap opens it into a list. The newest toast is now always nearest the edge of the screen (it was farthest). A dismissed toast leaves the layout at once. `configure({ stack: false })` gives a plain list. The layout uses `translate`/`scale`, so the animation types and swipe-to-dismiss still work.

  **Behaviour.** Timers hold for the whole stack while it is hovered or focused and keep the time that was left (they used to restart from the full duration); a toast that arrives meanwhile is held too. Toasts are Tab stops; Alt+T (`hotkey`) focuses the newest, Escape dismisses the focused one and hands focus on; `pauseOnFocus` is on by default.

  **API.** `toast('text')` shows a plain toast, and `toast.show`, `.promise`, `.update`, `.dismiss(id?)` (no id clears all), `.clear` and `.configure` complete the simple API; they do nothing on the server. `toast.promise(…, { success: { title, description } })` now replaces the loading text instead of keeping it.

  **Fixes.** The progress bar had no styling and a zero-width track, so it never showed; it now sits in the text column and survives a message update. The primary action button took its colours from `:root`, so themed toasts got the wrong fill.

  **Upgrading.** The layout uses the individual `translate` and `scale` CSS properties, so it needs Chrome 104, Safari 14.1 or Firefox 72 or later. If you styled toasts with CSS, the `::before` accent stripe and the tinted `background` of the level classes are gone: use the `--et-*` variables (`--et-bg`, `--et-text`, `--et-success`, …) or restyle `.editora-toast`. `configure({ stack: false })` restores a list; `configure({ icons: false })` removes the icons. The package is 15 KB gzipped JS plus 5 KB CSS (12 KB + 7 KB before); the README's "9 KB" figure was out of date.

## 2.0.10

### Patch Changes

- 16ae8ee: Rewrite the READMEs of `@editora/light-code-editor`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/ui-sortable` and `@editora/toast`, which are the npm pages of these packages, with screenshots and examples.

  Their images and links were relative paths that npm cannot show, and several examples did not run. Every example is now a file that is type-checked in strict mode and run in Chromium (React ones under `StrictMode`, drag and drop with the pointer and the keyboard), and the README quotes it word for word (`npm run check:readme-examples`). The screenshots are taken from the same examples (`npm run readme:screenshots`).

  Things the READMEs now get right that they did not: the `@editora/themes` tokens only set text, border and shadow colours (backgrounds are set by rules), the helpers it exports are documented; `@editora/ui-core` and `@editora/ui-react` list measured bundle sizes (a Button imported from the `@editora/ui-react` root is 1 MB gzipped up front, from its own entry 54 KB up front plus the rest of `ui-core` loaded later); `@editora/toast` documents its defaults (bottom right, four seconds, three visible, theme `system`) and that it is safe to import on the server.

## 2.0.9

### Patch Changes

- f53ca3a: Fix several toast bugs. `closable: true` was ignored (only its alias `closeButton` worked), because the config's `closeButton: false` was merged in first and then read ahead of it; an explicit `closable: false` also failed to override a configured `closeButton: true`, and `update()` now adds or removes the close button. `configure({ maxVisible })` never changed the limit (the previously stored `visibleToasts` alias always won). `html: true` rendered the literal markup instead of HTML, because its "sanitizer" escaped everything; it now renders a safe subset (inline formatting, lists and http(s)/mailto/tel/relative links) built from an allowlist, and removes everything else. A toast could stay on "loading" forever when its promise settled before the toast had been registered, and `update()`/`dismiss()` called in the same tick as `show()` were silently dropped; they now wait for the toast. The close button was invisible on touch devices (it only appeared on hover); it is now always visible there. A timer that removed the screen-reader announcement threw if the page body had already been replaced. On touch screens the action and close buttons did nothing (and on desktop a clicked button never took focus and the toast text could not be selected): the swipe-to-dismiss handler cancelled every touchstart/mousedown, which also cancels the click the browser derives from the touch. Presses on controls are now left alone and a drag only takes over once the pointer moves; a gesture the browser cancels (`touchcancel`) no longer leaves the toast stuck mid-drag. Documents `html: true` and persistent toasts in the README, and adds the package's first test suite.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.8](https://github.com/ajaykr089/Editora/compare/@editora/toast@2.0.5...@editora/toast@2.0.8) (2026-09-05)

**Note:** Version bump only for package @editora/toast

## 2.0.5 (2026-03-08)

**Note:** Version bump only for package @editora/toast

## 2.0.4 (2026-03-05)

**Note:** Version bump only for package @editora/toast

## 2.0.0 (2026-02-14)

### 🎉 Major Upgrade: Advanced Notification System

**Breaking Changes:** None - Full backward compatibility maintained

#### ✨ New Features

- **Promise Lifecycle Toasts**: Automatic state transitions for async operations

  ```typescript
  toast.promise(uploadFile(), {
    loading: "Uploading...",
    success: "Uploaded!",
    error: "Failed",
  });
  ```

- **Rich Content Support**: HTML, icons, actions, and progress bars

  ```typescript
  toast.show({
    message: "File uploaded",
    icon: "✓",
    actions: [{ label: "View", onClick: () => {} }],
    progress: { value: 75 },
  });
  ```

- **Toast Updates**: Modify existing toasts dynamically

  ```typescript
  const toast = toast.loading("Saving...");
  toast.update(toast.id, { message: "Saved!", level: "success" });
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
  position: "top-right",
  duration: 5000,
  maxVisible: 5,
  theme: "dark",
  pauseOnHover: true,
  enableAccessibility: true,
  swipeDismiss: true,
  dragDismiss: false,
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

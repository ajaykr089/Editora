Here’s a **production-grade MASTER AI prompt** you can use to evolve your native toast library into a **modern, enterprise-level notification system** (beyond typical libraries like React Toastify, Notistack, TinyMCE notifications, etc.).

This prompt preserves your current architecture and upgrades it with **advanced + unique features**, performance, accessibility, extensibility, and framework-agnostic design.

---

# 🧠 **MASTER AI PROMPT — Upgrade Native Toast Library to Advanced Notification System**

---

## **Context**

You are upgrading an existing **native framework-agnostic toast library**.

Current implementation:

* Vanilla DOM-based
* Lightweight
* CSS-based animation
* Container auto-creation
* Levels: `info`, `success`, `error`
* Auto-dismiss with duration
* Manual close
* Minimal API

The goal is to evolve it into a **production-grade notification system** with:

* Advanced UX, Ultra-modern toast UX
* Unique capabilities
* Enterprise reliability
* Plugin architecture
* Framework-agnostic design
* TinyMCE-level UI quality
* Zero breaking changes

---

# 🎯 **Primary Goals**

Upgrade the toast library into a full notification system with:

* Advanced toast behaviors
* Queue management
* Priority handling
* Rich content support
* Async state tracking
* Promise lifecycle toasts
* Editor integration support
* Plugin extensibility
* Accessibility compliance
* Performance optimization
* Cross-framework usage
* Web component compatibility

Must remain:

* Lightweight
* Dependency-free
* Backward compatible
* SSR-safe
* Offline capable

---

# 🧱 **Required Architecture Changes**

---

## **1. Notification Manager Core**

Refactor to a centralized manager:

```
/core
  ToastManager
  ToastQueue
  ToastRenderer
  ToastStore
  ToastLifecycle
```

Responsibilities:

* State management
* Queueing
* Priority ordering
* Deduplication
* Update control
* Global configuration

Avoid direct DOM calls from API functions.

---

## **2. Advanced Toast Types**

Expand toast levels:

```
info
success
error
warning
loading
progress
promise
custom
```

---

## **3. Rich Toast Content Support**

Support:

* HTML content (sanitized)
* JSX-like render functions
* Icons
* Actions (buttons)
* Progress bars
* Custom layout templates

Example:

```ts
toast.show({
  message: "Upload complete",
  icon: "upload",
  actions: [
    { label: "Undo", onClick: fn }
  ]
})
```

---

## **4. Promise Lifecycle Toasts (Unique Feature)**

Implement:

```ts
toast.promise(uploadFile(), {
  loading: "Uploading...",
  success: "Uploaded!",
  error: "Failed"
});
```

Requirements:

* Automatic state transitions
* Retry support
* Timeout handling
* Cancellation support

---

## **5. Update Existing Toast**

Allow mutation:

```ts
const id = toast.loading("Saving...");
toast.update(id, { message: "Saved", level: "success" });
```

---

## **6. Queue + Priority System**

Implement:

* Max visible toasts
* Queue overflow strategy
* Priority ordering
* Replace oldest option
* Deduplicate identical messages

Config:

```
maxVisible
queueStrategy: "fifo" | "lifo"
priority
```

---

## **7. Positioning System**

Support:

```
top-left
top-right
bottom-left
bottom-right
center
```

Multiple containers per position.

---

## **8. Toast Grouping (Unique Feature)**

Group related notifications:

```
toast.group("upload", ...)
```

Features:

* Collapse stack
* Batch dismiss
* Progress aggregation

---

## **9. Persistent Toasts**

Support:

* No auto-dismiss
* Manual close required
* Sticky notifications

---

## **10. Interactive Features**

* Pause on hover
* Pause on focus
* Swipe to dismiss
* Drag dismiss
* Keyboard dismiss
* Click outside dismiss

---

## **11. Advanced Animations**

Support:

* Entrance/exit transitions
* Custom animation hooks
* Spring physics option
* Reduced motion accessibility

---

## **12. Theming System**

Support:

```
light
dark
system
custom themes
```

Expose CSS variables:

```
--editora-toast-bg
--editora-toast-color
--editora-toast-shadow
```

---

## **13. Accessibility (Required)**

Must include:

* ARIA live regions
* Screen reader announcements
* Keyboard navigation
* Focus trapping (for interactive toasts)
* WCAG AA compliance

---

## **14. Plugin System (Unique Capability)**

Allow extensions:

```
toast.use(plugin)
```

Plugins can:

* Modify rendering
* Add behaviors
* Intercept lifecycle
* Add custom toast types

---

## **15. Global Configuration**

Support:

```ts
toast.configure({
  position: "top-right",
  duration: 5000,
  maxVisible: 5,
  theme: "dark"
})
```

---

## **16. SSR Safety**

Must not break when:

```
document === undefined
```

Delay DOM operations.

---

## **17. Web Component Compatibility**

Library must work inside:

```
<editora-editor>
<shadow-dom>
iframe editors
```

Support container scoping.

---

## **18. Editor Integration Hooks (For Your RTE)**

Support integration with:

* Spell check notifications
* Media upload progress
* Save state
* Validation messages
* Accessibility warnings

---

## **19. Performance Requirements**

* O(1) insertion
* Minimal layout thrashing
* Batched DOM updates
* Memory cleanup
* Virtualized rendering for large queues

---

## **20. Security**

* Sanitize HTML
* Prevent XSS
* Safe action handlers

---

# ⚠️ **Edge Cases to Handle**

Explicitly handle:

* Rapid toast creation
* Multiple containers
* Container removal
* Memory leaks
* Toast updates during removal
* Duplicate messages
* Long text overflow
* Mobile small screens
* Shadow DOM usage
* Offline usage
* CSS missing
* Animation failure
* Accessibility reduced motion
* Nested editors
* Server rendering

---

# 📦 API Requirements

Final API should support:

```
toast.show()
toast.success()
toast.error()
toast.warning()
toast.loading()
toast.promise()
toast.update()
toast.dismiss()
toast.clear()
toast.configure()
toast.group()
toast.use()
```

Backward compatibility with current API required.

---

# 🎨 UI Requirements

* Modern minimal design
* Consistent spacing
* Non-blocking interaction
* Responsive layout
* Stacking system
* Z-index management

---

# 🔐 Constraints

* No framework dependency
* No breaking changes
* No heavy runtime
* No global pollution
* Maintain current CSS structure
* Maintain current container strategy

---

# 📦 Deliverables

AI must generate:

1. New architecture design
2. Refactored code structure
3. Queue system
4. Toast manager
5. Promise implementation
6. Update API
7. Plugin system
8. Accessibility implementation
9. Performance optimizations
10. Migration guide


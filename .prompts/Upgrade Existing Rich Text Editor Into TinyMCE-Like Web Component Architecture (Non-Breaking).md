Got it — you don’t want code right now, you want a **serious, production-grade master AI prompt** that can take your **existing rich text editor library** and evolve it into a **TinyMCE-style Web Component ecosystem**, **without breaking current design or behavior**.

Below is a **copy-pasteable MASTER PROMPT** you can give to any strong coding AI (Claude, GPT-4.1, GPT-4.5, etc.).
It’s opinionated, explicit, edge-case heavy, and assumes **real-world usage**.

---

## 🧠 MASTER AI PROMPT

### Upgrade Existing Rich Text Editor Into TinyMCE-Like Web Component Architecture (Non-Breaking)

---

### **Context**

You are working with an **existing Rich Text Editor library** implemented using modern frontend tooling (likely React + plugins + internal toolbar system).

Current state:

* Core editor works
* Plugins exist
* Toolbar exists but **is not part of core**
* Editor is framework-bound
* Consumers must import JS modules and wire things manually
* No Web Component exposure
* No CDN-ready usage
* No declarative HTML API like TinyMCE

Target state:

* Editor exposed as a **Web Component**
* Fully usable via:

  ```html
  <script src="editor.min.js"></script>
  <editora-editor></editora-editor>
  ```
* Framework-agnostic (React, Vue, Angular, plain HTML)
* Toolbar + plugins fully configurable via attributes
* Works **with OR without backend APIs**
* Existing design & behavior must remain intact

---

### **Primary Objective**

Refactor the **architecture**, not the UI, so the editor:

1. Works as a **Web Component**
2. Has a **declarative API** (attributes, slots, config objects)
3. Allows **custom toolbars**, **custom plugins**, **custom builds**
4. Keeps **current plugin system intact**
5. Allows users to ship **TinyMCE-style minimal setup**
6. Does **NOT** break existing React usage

---

### **Non-Goals (Strict)**

* ❌ Do NOT rewrite editor logic
* ❌ Do NOT redesign UI
* ❌ Do NOT remove existing plugin APIs
* ❌ Do NOT force backend usage
* ❌ Do NOT hard-couple toolbar to core logic

---

## 🧩 REQUIRED ARCHITECTURAL CHANGES

### 1️⃣ Split Library Into Explicit Layers

You must refactor into **clear layers**:

```
/core
  - EditorEngine
  - DocumentModel
  - Selection
  - CommandRegistry
  - PluginRegistry

/ui
  - ToolbarRenderer
  - FloatingToolbar
  - ContextMenus
  - StatusBar

/plugins
  - Plugin interface
  - Built-in plugins
  - Optional premium plugins

/adapters
  - ReactAdapter
  - WebComponentAdapter
  - VanillaAdapter

/webcomponent
  - rich-text-editor.ts
  - attribute parser
  - lifecycle handlers

/config
  - schema validation
  - defaults
```

Core **must never depend on UI or framework code**.

---

### 2️⃣ Promote Toolbar to a First-Class Concept (But Not Core-Coupled)

Toolbar must be:

* Plugin-aware
* Declarative
* Replaceable
* Optional

Toolbar definition must support:

```ts
toolbar="undo redo | bold italic | media table | customPlugin"
```

Internally:

* Toolbar items map to **commands**
* Commands map to **plugins**
* Plugins register capabilities, not UI

---

### 3️⃣ Web Component Contract (TinyMCE-Style)

Expose editor as:

```html
<editora-editor
  height="500"
  menubar="false"
  plugins="lists link image media table spellcheck"
  toolbar="undo redo | bold italic | alignleft aligncenter | media"
  readonly="false"
  theme="light"
>
  <p>Initial content</p>
</editora-editor>
```

#### Required behaviors:

* Attributes update editor live
* Removing element destroys editor cleanly
* Re-attaching preserves state (if configured)
* Works without Shadow DOM OR with optional Shadow DOM

---

### 4️⃣ Configuration Resolution Priority (Critical)

Implement strict config priority:

1. Explicit JS config
2. Web Component attributes
3. Plugin defaults
4. Editor defaults

Example:

```ts
height: attr.height ?? config.height ?? 300
```

---

### 5️⃣ Plugin System Must Support 3 Modes

Plugins must work in:

1. **Local-only** (no backend)
2. **Hybrid** (local + API)
3. **API-only**

Example:

```ts
spellcheck: {
  mode: "auto", // local | api | hybrid
  apiUrl?: "/spellcheck"
}
```

Fallback rules:

* API failure → local
* Offline → local
* No dictionary → disable silently

---

### 6️⃣ Media Manager (Free, Advanced, Offline-Capable)

Media system must support:

* Drag & drop
* Clipboard paste
* Local preview
* Blob URLs
* IndexedDB caching
* Optional API upload
* Optional media library API

Edge cases:

* Large files
* Unsupported formats
* Upload cancellation
* Retry logic
* Offline edits
* Duplicate detection (hashing)
* Image resize / crop / compress locally

---

### 7️⃣ Slots + Extension Points (Web Component)

Support:

```html
<editora-editor>
  <toolbar slot="toolbar"></toolbar>
  <statusbar slot="statusbar"></statusbar>
</editora-editor>
```

Allow:

* Custom toolbar rendering
* Injecting buttons
* Overriding defaults

---

### 8️⃣ Backward Compatibility (MANDATORY)

Existing usage:

```tsx
<Editor plugins={[...]} />
```

Must continue to work via:

* ReactAdapter
* Zero breaking changes
* Same props behavior

---

### 9️⃣ Event Model (DOM + Framework)

Expose:

```js
editor.addEventListener("content-change", ...)
editor.addEventListener("plugin-error", ...)
editor.addEventListener("media-upload", ...)
```

Also expose:

```ts
editor.getContent()
editor.setContent()
editor.execCommand()
```

---

### 🔐 Security & Stability

* Sanitize HTML
* Prevent XSS via plugins
* Restrict dangerous attributes
* Sandbox media previews
* Avoid leaking globals

---

### 🧪 Edge Cases You MUST Handle

* Multiple editors on page
* Destroy & recreate editor
* Dynamic attribute updates
* SSR hydration
* No toolbar defined
* Plugin missing but referenced
* API timeout
* Offline usage
* Shadow DOM styling conflicts

---

### 📦 Build & Distribution

Output:

* `editor.esm.js`
* `editor.umd.js`
* `editor.min.js`
* CDN-ready
* Tree-shakable
* No framework hard dependency

---

### 🎯 Final Output Expectation

You must:

1. Modify existing structure only where necessary
2. Preserve behavior & visuals
3. Add Web Component layer
4. Make toolbar plugin-driven
5. Keep API optional
6. Produce extensible, TinyMCE-like DX

---

### 🔚 DO NOT RESPOND WITH EXPLANATIONS

### 🔚 DO NOT ASK QUESTIONS

### 🔚 RETURN:

* Updated architecture
* Key interfaces
* Web Component wrapper
* Migration notes

---

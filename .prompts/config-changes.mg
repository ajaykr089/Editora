## 🎯 Objective

You are a **senior staff-level frontend + platform engineer** tasked with building a **production-grade Rich Text Editor (RTE)** that is **modular, extensible, and modern**.

The editor must:

* Be **plugin-driven**
* Support **enterprise-grade features**
* Expose a **rich configuration surface**
* Be performant for large documents
* Be secure, accessible, and internationalized

You are NOT allowed to implement toy solutions.

---

# Web Usage

<editora
      api-key="no-api-key"
      height="500"
      menubar="false"
      plugins="advlist autolink lists link image charmap preview anchor
        searchreplace visualblocks code fullscreen
        insertdatetime media table code help wordcount"
      toolbar="undo redo | blocks | bold italic backcolor |
        alignleft aligncenter alignright alignjustify |
        bullist numlist outdent indent | removeformat | help"
      content_style="body
      {
        font-family:Helvetica,Arial,sans-serif;
        font-size:14px
      }"
      >

      <!-- Adding some initial editor content -->
      &lt;p&gt;Welcome to the TinyMCE Web Component example!&lt;/p&gt;

    </editora>

## 🧩 Core Input Interface (MANDATORY)

You MUST fully support and design around the following props interface:

```ts
export interface RichTextEditorProps {
  id?: string;
  className?: string;

  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  onInit?: (editor: EditorAPI) => void;
  onDestroy?: () => void;

  plugins?: Plugin[] | string[];
  pluginConfig?: Record<string, unknown>;

  toolbar?: {
    items: string[];
    floating?: boolean;
    sticky?: boolean;
  };

  menubar?: {
    enabled: boolean;
    items?: string[];
  };

  contextMenu?: {
    enabled?: boolean;
  };

  media?: {
    uploadUrl?: string;
    libraryUrl?: string;
    maxFileSize?: number;
    allowedTypes?: string[];
    headers?: Record<string, string>;
    withCredentials?: boolean;
  };

  paste?: {
    clean?: boolean;
    keepFormatting?: boolean;
    convertWord?: boolean;
  };

  history?: {
    maxSteps?: number;
    debounceMs?: number;
  };

  language?: {
    locale?: string;
    direction?: 'ltr' | 'rtl';
  };

  spellcheck?: {
    enabled?: boolean;
    provider?: 'browser' | 'local' | 'api';
    apiUrl?: string;
  };

  autosave?: {
    enabled?: boolean;
    intervalMs?: number;
    storageKey?: string;
  };

  accessibility?: {
    enableARIA?: boolean;
    keyboardNavigation?: boolean;
    checker?: boolean;
  };

  performance?: {
    debounceInputMs?: number;
    viewportOnlyScan?: boolean;
  };

  content?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    sanitize?: boolean;
  };

  security?: {
    sanitizeOnPaste?: boolean;
    sanitizeOnInput?: boolean;
  };
}
```

---

## 🏗️ Architectural Requirements

### 1️⃣ Core Editor Engine

* Contenteditable-based (or virtualized DOM abstraction)
* DOM-safe mutation handling
* Cursor-safe transformations
* Selection preservation
* Undo/redo batching

### 2️⃣ Plugin System

* Plugins can:

  * Register toolbar buttons
  * Register commands
  * Hook into lifecycle events
  * Add UI overlays
  * Declare backend dependencies
* Plugins must be **isolated**
* Plugin failure must NOT crash editor

---

## 🧠 EditorAPI (MANDATORY)

Design and expose an `EditorAPI` with standard editor functionality:

```ts
interface EditorAPI {
  getHTML(): string;
  setHTML(html: string): void;
  execCommand(name: string, value?: any): void;
  registerCommand(name: string, fn: () => void): void;
  focus(): void;
  blur(): void;
  destroy(): void;
}
```

Pass this into `onInit`.

---

## 🧪 Feature Implementation Requirements

### 🔹 Toolbar & UI

* Dynamic toolbar rendering
* Floating toolbar positioning
* Sticky toolbar support
* Plugin-contributed buttons

### 🔹 Spell Check

* Support `browser`, `local`, and `api` modes
* Local = lightweight fallback
* API mode = enterprise-grade
* Ignore protected DOM regions
* Context menu suggestions
* User dictionary persistence
* Language switching

### 🔹 Paste Handling

* Word/Google Docs cleanup
* Style stripping
* HTML sanitization
* Schema validation

### 🔹 Media Upload

* Chunked uploads
* Progress tracking
* Error recovery
* Auth headers
* Secure URL handling

### 🔹 Autosave

* Debounced storage
* Crash recovery
* Storage abstraction (localStorage / API)

### 🔹 Accessibility

* ARIA roles
* Keyboard navigation
* Screen reader labels
* Accessibility checker plugin

### 🔹 Performance

* Viewport-based scanning
* Throttled background tasks
* Large document handling (10k+ words)

---

## 🌐 Backend-Aware Features (IMPORTANT)

Some plugins REQUIRE backend APIs.
Design the editor so frontend and backend are **loosely coupled**.

### Example API responsibilities:

* Spell checking
* Grammar
* Comments
* Merge tags
* Templates
* User dictionaries
* Collaboration

You MUST design clean contracts and allow swapping providers.

---

## ⚠️ Edge Cases to Handle (MANDATORY)

* Cursor jumps after DOM mutation
* Undo stack corruption
* Spellcheck spans breaking selection
* Nested contenteditable=false
* RTL text
* Emoji + surrogate pairs
* Large pasted HTML
* Plugin unload/reload
* Editor destroy cleanup

---

## ❌ Explicitly Forbidden

* Hardcoded dictionaries for production
* Full-document rescans on every keystroke
* Direct innerHTML mutations without selection handling
* Plugin-specific hacks in core
* Blocking UI threads

---

## ✅ Deliverables Expected From You

You MUST produce:

1. Editor core architecture
2. Plugin lifecycle design
3. EditorAPI implementation
4. Example plugins (spellcheck, media)
5. State management strategy
6. Performance optimization plan
7. Security & sanitization strategy
8. Accessibility compliance plan

---

## 🧠 Mindset

Think like:

* Modern text editors
* Collaborative editing systems
* VS Code extension system

But build **cleaner**, **lighter**, and **modern**.

---

### 🟢 Final Rule

If a feature feels “simple”, you are probably missing edge cases.
Re-think it.


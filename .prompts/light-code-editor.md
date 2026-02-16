## 🧠 **ROLE**

You are a senior editor engine architect.

Upgrade an existing lightweight JavaScript code editor (already includes line-based document model and range operations) into a **production-grade, extensible, high-performance code editor library** comparable to CodeMirror Lite.

You must:

* Output production-ready code.
* Validate syntax.
* Check all brackets.
* No incomplete code.
* Keep existing document model intact
* Improve architecture
* Add missing core editor systems
* Maintain lightweight footprint
* Make library framework-agnostic
* Design plugin-based architecture
* Ensure performance for large files (100k+ lines)

Return complete implementation structure.

---

# 🎯 **CURRENT IMPLEMENTATION (DO NOT BREAK)**

Existing editor already supports:

### Document Model

* Line-based text storage
* Replace range
* Insert/delete
* Get text
* Version tracking

### Core Operations

* Position → offset conversion
* Range operations
* Multi-line replacement

You MUST extend this system — not rewrite it.

---

# 🚀 **REQUIRED ARCHITECTURE UPGRADES**

---

## 1. Editor Core Engine (New)

Create central controller:

```
Editor
 ├ document
 ├ view
 ├ selection
 ├ commands
 ├ extensions
 └ state
```

### Responsibilities

* State orchestration
* Event system
* Plugin lifecycle
* Command execution
* Render coordination

### Required APIs

```
editor.dispatch(transaction)
editor.on(event, handler)
editor.use(extension)
editor.destroy()
```

---

## 2. Transaction System (CodeMirror-style)

Implement immutable updates.

### Transaction Structure

```
interface Transaction {
  changes
  selection
  effects
  annotations
}
```

### Requirements

* Batched updates
* Undo support
* State transitions
* No direct DOM mutation

---

## 3. Selection Engine

Implement robust selection model.

### Features

* Cursor position
* Range selection
* Multi-cursor support
* Keyboard navigation
* Selection mapping after edits

### API

```
getSelection()
setSelection(range)
addCursor(position)
```

---

## 4. Virtualized Rendering Engine (CRITICAL)

Replace full DOM rendering.

### Requirements

* Render visible lines only
* Viewport tracking
* DOM recycling
* Efficient updates
* Line height measurement
* Scroll sync

### Target Performance

* 100k+ lines
* Smooth scrolling
* Minimal reflow

---

## 5. View Layer

Separate document and DOM.

### Components

```
EditorView
LineView
CursorLayer
SelectionLayer
GutterLayer
```

### Responsibilities

* Rendering
* Event capture
* Decorations
* Viewport updates

---

## 6. Syntax Highlighting Engine

### Requirements

* Tokenization pipeline
* Language plugins
* Incremental parsing
* Async support
* Theme system

### Interface

```
registerLanguage(languageProvider)
```

---

## 7. Command System

Create command registry.

### Examples

* undo
* redo
* insertText
* deleteLine
* indent
* format

### API

```
registerCommand(name, handler)
executeCommand(name)
```

---

## 8. Extension / Plugin Architecture (CRITICAL)

### Must Support

* Extensions modify behavior
* Lifecycle hooks
* State fields
* Keymaps
* Decorations

### Extension API

```
interface Extension {
  name
  setup(editor)
  destroy()
}
```

---

## 9. Undo / Redo History

### Requirements

* Transaction history
* Time-based grouping
* Selection restore
* Stack limit

---

## 10. Keymap System

### Requirements

* Keyboard shortcuts
* Multi-key bindings
* Cross-platform handling
* Extension overrides

---

## 11. Decoration System

Used for:

* Syntax highlight
* Errors
* Search matches
* Selection visuals

### Types

```
mark
line
widget
gutter
```

---

## 12. Gutter System

### Features

* Line numbers
* Breakpoints
* Custom markers

---

## 13. Theme System

### Requirements

* CSS variables
* Dark/light support
* Runtime switching

---

## 14. Search Engine

### Features

* Find
* Replace
* Highlight matches
* Regex support

---

## 15. Bracket Matching

* Incremental matching
* Nested detection
* Highlight pairs

---

## 16. Code Folding

* Range folding
* Language folding rules
* Toggle UI

---

## 17. Read-only Mode

* Disable mutations
* Allow selection

---

## 18. Large File Optimization

* Chunk parsing
* Lazy rendering
* Memory control

---

# 🏗 **DESIGN REQUIREMENTS**

---

## Performance

* O(visible lines) rendering
* Minimal DOM updates
* Debounced operations
* No full re-render

---

## Architecture Principles

* Immutable state
* Separation of model and view
* Plugin-driven behavior
* Tree-shakeable modules

---

## Bundle Goals

* < 100kb base build
* No framework dependency

---

# 🧩 FILE STRUCTURE

```
core/
  Editor.ts
  Transaction.ts
  State.ts

model/
  Document.ts (existing)
  Position.ts
  Range.ts

view/
  EditorView.ts
  LineView.ts
  Viewport.ts

selection/
  Selection.ts

commands/
  CommandRegistry.ts

extensions/
  Extension.ts

history/
  History.ts

render/
  VirtualRenderer.ts

decorations/
  Decoration.ts

features/
  search/
  folding/
  bracketMatching/
```

---

# ⚠️ EDGE CASES

Handle:

* Multi-line paste
* Unicode characters
* Emoji handling
* Surrogate pairs
* IME composition
* Rapid typing
* Cursor mapping after edits
* Scrolling during edits
* Large file freeze prevention
* Selection collapse on delete
* Overlapping decorations

---

# 🧪 TEST REQUIREMENTS

Generate tests for:

* Document edits
* Selection mapping
* Undo/redo
* Rendering updates
* Plugin lifecycle

---

# 📦 OUTPUT REQUIREMENTS

Return:

1. Full architecture
2. TypeScript types
3. Core engine implementation
4. Extension system
5. Rendering system
6. Example usage
7. Performance optimizations
8. Migration notes from current code

---

# ⭐ BONUS (IF POSSIBLE)

* LSP integration architecture
* Collaborative editing hooks
* Diff view support

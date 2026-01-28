# Math Plugin Managers - Usage Guide

## Overview
The Math Plugin uses several manager classes to handle different aspects of math formula management. Each manager is now properly integrated and utilized.

---

## 1. **MathRegistry** ✅ ACTIVE
**Purpose:** Central store for all math nodes in memory

**Location:** MathPlugin.ts (class definition at lines 35-74)

**Current Usage:**
- Stores all inserted/updated math formulas with unique IDs
- Provides observer pattern for subscribing to changes
- Called in:
  - `applyMathToSelection()` - registers new math nodes
  - `updateExistingMath()` - updates existing nodes
  - `MathSelectionManager.deleteMathElement()` - removes deleted nodes
  - `MathClipboardManager` - retrieves nodes for copy/paste
  - `MathSerializationManager` - exports/imports from registry

**Export:** `mathRegistry`

**External Usage Example:**
```typescript
// Subscribe to all math changes
const unsubscribe = mathRegistry.subscribe((node, action) => {
  console.log(`Math node ${action}:`, node);
});

// Get all math nodes
const nodes = mathRegistry.getAll();
```

---

## 2. **MathRenderer** ✅ ACTIVE
**Purpose:** Renders LaTeX/MathML to HTML using KaTeX

**Location:** MathPlugin.ts (class definition at lines 363-457)

**Current Usage:**
- Renders math formulas with caching for performance
- Converts MathML to LaTeX as fallback
- Generates semantic labels for accessibility
- Called in:
  - `applyMathToSelection()` - renders new formulas
  - `updateExistingMath()` - re-renders updated formulas
  - `MathClipboardManager.insertMathNodeAtCursor()` - renders pasted formulas
  - `MathSerializationManager.importFromJSON()` - renders imported formulas

**Export:** `mathRenderer`

**External Usage Example:**
```typescript
const mathNode = {
  id: 'test',
  type: 'inline',
  format: 'latex',
  formula: 'x^2 + y^2 = z^2',
  renderedHtml: '',
  semanticLabel: '',
  created: new Date(),
  modified: new Date()
};

const { html, semantic } = mathRenderer.render(mathNode);
```

---

## 3. **MathSelectionManager** ✅ ACTIVE
**Purpose:** Handles keyboard and mouse interactions with math elements

**Location:** MathPlugin.ts (class definition at lines 79-291)

**Current Usage:**
- Initializes event listeners on constructor (line 92)
- Handles keydown events for deletion and navigation (lines 95-140)
- Handles click events to select math elements (lines 143-157)
- Prevents typing inside math elements
- Allows deletion with Delete/Backspace keys
- Called automatically through event listeners

**Event Listeners:**
- `keydown` - line 91: `document.addEventListener('keydown', this.handleKeydown.bind(this));`
- `click` - line 92: `document.addEventListener('click', this.handleClick.bind(this));`

**Export:** `mathSelectionManager`

**Features:**
- Cursor management around math elements
- Math element deletion with registry cleanup
- Selection within editable content near math elements

---

## 4. **MathUndoManager** ✅ ACTIVE
**Purpose:** Tracks and manages undo/redo operations

**Location:** MathPlugin.ts (class definition at lines 440-457)

**Current Usage:**
- Records all insert and update operations
- Maintains operation history (max 50 operations)
- Called in:
  - `applyMathToSelection()` - records new insertions (lines 918-931)
  - `updateExistingMath()` - records updates (lines 970-987)

**Exports/Public Commands:**
- `undoMathOperation()` - exposed command to trigger undo
- Registered with MathProvider as `'undoMath'` command

**External Usage Example:**
```typescript
// Trigger undo
if (mathUndoManager.canUndo()) {
  mathUndoManager.undo();
}
```

**Keyboard Shortcut:**
- Ctrl+Z / Cmd+Z on math elements (integrated in MathProvider)

---

## 5. **MathClipboardManager** ✅ ACTIVE
**Purpose:** Handles copy/paste of math formulas

**Location:** MathPlugin.ts (class definition at lines 718-783)

**Current Usage:**
- Initializes event listeners on constructor (line 727)
- Intercepts copy events on math elements
- Intercepts paste events with math format
- Maintains clipboard data in custom format with fallback to plain text
- Called automatically through event listeners

**Event Listeners:**
- `copy` - line 726: `document.addEventListener('copy', this.handleCopy.bind(this));`
- `paste` - line 727: `document.addEventListener('paste', this.handlePaste.bind(this));`

**Export:** `mathClipboardManager`

**Features:**
- Preserves math metadata (formula, format, type) on copy
- Handles paste with proper registration and rendering
- Fallback to plain text for external apps

---

## 6. **MathSerializationManager** ✅ ACTIVE
**Purpose:** Export/import math content in JSON or HTML formats

**Location:** MathPlugin.ts (class definition at lines 460-597)

**Current Usage:**
- Exports all math nodes to JSON or HTML
- Imports math nodes from JSON or HTML
- Integrated into public API through commands:
  - `exportMathContent(format)` - export command
  - `importMathContent(data, format)` - import command

**Export:** `mathSerializationManager`

**External Usage Examples:**

```typescript
// Export as JSON
const json = exportMathContent('json');

// Export as HTML
const html = exportMathContent('html');

// Import from JSON
const result = importMathContent(jsonString, 'json');
if (result.success) {
  console.log(`Imported ${result.imported} math nodes`);
}
```

**Use Cases:**
- Save document with embedded math to database
- Transfer math content between editors
- Backup/restore math formulas
- Version control of math content

---

## Integration Summary

| Manager | Initialized | Event Listeners | Called In | Exported |
|---------|-------------|-----------------|-----------|----------|
| MathRegistry | Line 569 | None | 6 places | ✅ Yes |
| MathRenderer | Line 570 | None | 4 places | ✅ Yes |
| MathSelectionManager | Line 571 | keydown, click | auto-init | ✅ Yes |
| MathUndoManager | Line 572 | None | 2 places | ✅ Yes |
| MathClipboardManager | Line 574 | copy, paste | auto-init | ✅ Yes |
| MathSerializationManager | Line 573 | None | import/export | ✅ Yes |

---

## Public Commands Available

```typescript
// Commands to register with editor
(window as any).registerEditorCommand?.('insertMath', handleInsertMath);
(window as any).registerEditorCommand?.('updateMath', handleUpdateMath);
(window as any).registerEditorCommand?.('undoMath', undoMathOperation);

// Utility functions for external use
exportMathContent(format: 'json' | 'html'): string
importMathContent(data: string, format: 'json' | 'html'): result
```

---

## Notes

✅ = All managers are now **properly utilized and integrated**
- No unused code
- Clear event flow
- Proper separation of concerns
- Public API for external integration

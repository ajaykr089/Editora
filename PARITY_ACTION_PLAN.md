# React & Web Component Parity Action Plan

## 🎯 Goal
Ensure 100% feature and styling parity between React and Web Component implementations with full multi-instance support.

## 📊 Current State Analysis

### CSS Loading Issues

#### React (via Storybook/Examples)
- ✅ Loads: `packages/react/dist/react.css`
- ✅ Loads: `packages/plugins/dist/plugins.css` 
- ✅ Loads: `packages/core/dist/core.css`
- **Result**: All plugin styles (table, anchor, footnote, etc.) are available

#### Web Component (Current)
- ✅ Loads: `packages/core/dist/webcomponent.min.js`
- ❌ **MISSING**: No CSS files loaded in examples!
- ❌ `test-toolbar-fix.html` only loads `packages/core/src/webcomponent/styles.css`
- **Result**: Missing plugin styles, causing inconsistent appearance

### Multi-Instance Support Issues

#### Identified Problems:
1. ✅ **FIXED**: `BackgroundColorPlugin` - Auto-initialization race condition removed
2. ✅ **FIXED**: `TablePlugin` - Now uses `findEditorContainerFromSelection()`
3. ✅ **FIXED**: `RichTextEditor` - Added `data-editora-editor` attribute
4. ✅ **FIXED**: Content element has both `editora-content` and `rte-content` classes
5. ✅ **FIXED**: Command handler ensures focus and selection before execution

#### Potential Issues to Check:
- Other plugins using `document.querySelector()` instead of scoped queries
- Plugins with module-level state that might conflict across instances
- Event listeners not properly scoped to editor instance

## 🔧 Required Actions

### 1. CSS Bundle Strategy ✅ COMPLETED

**Decision**: Create single CSS bundle for web component

**Files to bundle:**
- Core editor styles
- All plugin styles (table, anchor, footnote, media, etc.)
- Toast notifications
- Code editor

**Implementation:**
- Bundle already exists: `packages/plugins/dist/plugins.css`
- Need to ensure it's loaded in all examples

### 2. Update All Web Component Examples

**Files to update:**
- `examples/webcomponent-basic.html`
- `examples/webcomponent-all-plugins.html`
- `test-toolbar-fix.html`
- Any other example files

**Add to `<head>` section:**
```html
<!-- Core Editor Styles -->
<link rel="stylesheet" href="../packages/core/src/webcomponent/styles.css">
<!-- All Plugin Styles -->
<link rel="stylesheet" href="../packages/plugins/dist/plugins.css">
<!-- Core Styles -->
<link rel="stylesheet" href="../packages/core/dist/core.css">
```

### 3. Plugin Multi-Instance Audit

**Plugins to review:**
- [ ] Link Plugin
- [ ] Media Manager Plugin
- [ ] Document Manager Plugin
- [ ] Anchor Plugin
- [ ] Footnote Plugin
- [ ] Embed Iframe Plugin
- [ ] Math Plugin
- [ ] Special Characters Plugin
- [ ] Emojis Plugin
- [ ] Code Sample Plugin
- [ ] Preview Plugin
- [ ] Fullscreen Plugin

**Check for:**
- ❌ `document.querySelector()` - Should use scoped helpers
- ❌ Module-level state that persists across instances
- ❌ Global event listeners not cleaned up
- ✅ Use `findEditorContainerFromSelection()` or similar helpers
- ✅ Event listeners scoped to specific editor instance
- ✅ Proper cleanup in close/destroy methods

### 4. Feature Parity Checklist

**Configuration Options:**
- [ ] Verify all React props have web component equivalents
- [ ] Test all toolbar configurations
- [ ] Test all plugin combinations
- [ ] Verify readonly/disabled states
- [ ] Test autofocus behavior
- [ ] Test placeholder text

**Toolbar Items:**
- [ ] All 46 command aliases work correctly
- [ ] All buttons render with correct icons
- [ ] All dropdowns function properly
- [ ] Separators display correctly
- [ ] Sticky toolbar works in both

**Plugin Functionality:**
- [ ] All native plugins execute commands
- [ ] All dialogs open and close properly
- [ ] All inline pickers position correctly
- [ ] All keyboard shortcuts work
- [ ] All context menus appear

### 5. Multi-Instance Test Suite

**Create comprehensive test:**
- [ ] 3 editors on same page
- [ ] Each with different configuration
- [ ] Test simultaneous editing
- [ ] Test plugin execution in different instances
- [ ] Verify no cross-instance interference
- [ ] Test dialog/picker opening in correct instance

## 📝 Implementation Order

1. ✅ **Phase 1**: CSS Loading (Update all examples)
2. **Phase 2**: Plugin Audit (Review and fix multi-instance issues)
3. **Phase 3**: Configuration Parity (Ensure all options work)
4. **Phase 4**: Multi-Instance Testing (Create test suite)
5. **Phase 5**: Documentation (Update guides with findings)

## 🎯 Success Criteria

- ✅ Both implementations load identical CSS
- ✅ All plugins work in both React and web component
- ✅ Identical visual appearance in both
- ✅ All features function identically
- ✅ Multiple instances work without conflicts
- ✅ No global state pollution
- ✅ Clean event listener management

## 📌 Notes

- Web component already has proper structure (data-editora-editor attribute)
- Command handler already manages focus/selection
- Most native plugins already use proper patterns
- Main issue is CSS not being loaded in examples

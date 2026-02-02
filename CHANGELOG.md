# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release preparation
- Complete plugin system with 40+ plugins
- React components and hooks
- Theming system with light/dark mode
- Comprehensive documentation
- Example projects
- CI/CD workflows

## [1.0.0] - 2026-02-02

### Added

#### Core Features
- Framework-agnostic editor engine
- Plugin architecture for extensibility
- TypeScript support with full type definitions
- XSS protection and content sanitization
- Accessibility features (WCAG 2.1 compliant)
- Multi-instance editor support

#### React Package
- `<RichTextEditor />` component
- `useEditor` hook for editor management
- `useEditorState` hook for state tracking
- `useEditorCommands` hook for commands
- `<Toolbar />` component
- `<ToolbarButton />` component
- SSR compatibility

#### Plugins (40+)
- **Text Formatting**: Bold, Italic, Underline, Strikethrough, Font Family, Font Size, Text Color, Background Color
- **Block Elements**: Headings (H1-H6), Paragraphs, Blockquotes, Code Blocks, Horizontal Rules, Page Breaks
- **Lists**: Bullet Lists, Numbered Lists, Checklists, Indent/Outdent
- **Media**: Images (with upload), Videos, Audio, Embed IFrames, Media Manager
- **Advanced**: Tables, Math Equations (LaTeX), Links, Anchors, Comments, Templates, Merge Tags
- **Document Management**: Import/Export (Word, PDF, HTML), Document Manager
- **Accessibility**: Spell Checker, Accessibility Checker
- **Utilities**: History (Undo/Redo), Fullscreen, Line Height, Text Direction, Alignment, Capitalization

#### Themes
- Light theme (default)
- Dark theme
- Auto theme (system preference detection)
- Customizable via CSS variables
- Responsive design
- High contrast mode support

#### Documentation
- Comprehensive README for each package
- API documentation
- Usage examples
- Quick start guide
- Contributing guidelines
- Publishing guide

#### Examples
- Basic editor example
- Advanced editor example
- Blog post editor
- Documentation editor
- Form integration examples

#### Developer Experience
- Lerna monorepo setup
- Automated build system
- GitHub Actions CI/CD
- Conventional commits
- Automated changelog generation
- Tree-shakeable bundles
- Optimized bundle sizes

### Changed
- N/A (Initial release)

### Deprecated
- N/A (Initial release)

### Removed
- N/A (Initial release)

### Fixed
- N/A (Initial release)

### Security
- XSS protection enabled by default
- Content sanitization
- Secure file upload handling
- Input validation

## Package Versions

All packages released at version 1.0.0:
- `@editora/core@1.0.0`
- `@editora/react@1.0.0`
- `@editora/plugins@1.0.0`
- `@editora/themes@1.0.0`

---

## Release Notes

### Version 1.0.0 - Initial Release

This is the first stable release of Editora Rich Text Editor! 🎉

**Highlights:**
- 40+ production-ready plugins
- Complete React integration
- Comprehensive theming system
- Full TypeScript support
- Extensive documentation
- Working examples

**Installation:**
```bash
npm install @editora/react @editora/core @editora/plugins @editora/themes
```

**Quick Start:**
```tsx
import { RichTextEditor } from '@editora/react';
import { createBoldPlugin, createItalicPlugin } from '@editora/plugins';
import '@editora/themes/styles';

function App() {
  return (
    <RichTextEditor
      plugins={[createBoldPlugin(), createItalicPlugin()]}
    />
  );
}
```

**Documentation:**
- [Main README](./README.md)
- [Quick Start Guide](./QUICKSTART.md)
- [API Documentation](./packages/react/README.md)

---

## Links

- [GitHub Repository](https://github.com/ajaykr089/Rich-Text-Editor)
- [Issue Tracker](https://github.com/ajaykr089/Rich-Text-Editor/issues)
- [npm Packages](https://www.npmjs.com/search?q=%40editora)

# Editora Rich Text Editor

[![npm version](https://badge.fury.io/js/%40editora%2Fcore.svg)](https://badge.fury.io/js/%40editora%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A powerful, framework-agnostic rich text editor built with modern web technologies.

<p align="center">
  <img src="images/editora-logo.svg" alt="Editora Logo" width="300">
</p>

## ✨ Features

<p align="center">
  <img src="images/features-overview.png" alt="Features Overview" width="800">
</p>

- **🎨 Modern UI**: Clean, intuitive interface with customizable themes
- **🔧 Framework Agnostic**: Works with React, Vue, Angular, or vanilla JavaScript
- **📱 Responsive**: Fully responsive design that works on all devices
- **⚡ Fast**: Lightweight core with lazy-loaded plugins
- **🎯 Accessible**: WCAG 2.1 compliant with keyboard navigation
- **🔌 Extensible**: 40+ plugins including tables, images, code blocks, and more

## 🚀 Quick Start

### CDN (Simplest)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css">
</head>
<body>
  <editora-editor
    plugins="bold italic underline history"
    toolbar-items="bold italic underline | undo redo"
    height="300"
  >
    <p>Start editing...</p>
  </editora-editor>
</body>
</html>
```

<p align="center">
  <img src="images/cdn-example.png" alt="CDN Example" width="600">
</p>

### NPM Installation

```bash
npm install @editora/core @editora/plugins
```

### React Example

```jsx
import { EditoraEditor } from '@editora/react';
import '@editora/themes/default.css';

function MyEditor() {
  return (
    <EditoraEditor
      plugins={['bold', 'italic', 'underline']}
      height={300}
    />
  );
}
```

<p align="center">
  <img src="images/react-example.png" alt="React Example" width="600">
</p>

## 📖 Documentation

- [📚 Full Documentation](https://editora.netlify.app)
- [🎮 Live Playground](https://editora.netlify.app/playground.html)
- [🔌 Plugin Reference](https://editora.netlify.app/plugins/)
- [⚙️ API Reference](https://editora.netlify.app/docs/api.html)

## 🎨 Themes

Editora comes with beautiful built-in themes:

<table>
  <tr>
    <td align="center">
      <strong>Light Theme</strong><br>
      <img src="images/theme-comparison.svg" alt="Theme Comparison" width="300">
    </td>
    <td align="center">
      <strong>Dark Theme</strong><br>
      <img src="images/theme-comparison.svg" alt="Theme Comparison" width="300">
    </td>
  </tr>
</table>

## 🔌 Plugins

Choose from 40+ plugins to customize your editor:

| Plugin | Description | Demo |
|--------|-------------|------|
| `bold` | Text formatting | <img src="images/plugin-bold.png" alt="Bold Plugin" width="100"> |
| `table` | Table editing | <img src="images/plugin-table.png" alt="Table Plugin" width="100"> |
| `image` | Image insertion | <img src="images/plugin-image.png" alt="Image Plugin" width="100"> |
| `math` | Math equations | <img src="images/plugin-math.png" alt="Math Plugin" width="100"> |

<p align="center">
  <img src="images/plugin-architecture.png" alt="Plugin Architecture" width="700">
</p>

## 🌟 Use Cases

### Blogging Platform
<p align="center">
  <img src="images/use-case-blog.png" alt="Blog Example" width="600">
</p>

### Content Management
<p align="center">
  <img src="images/use-case-cms.png" alt="CMS Example" width="600">
</p>

### Documentation
<p align="center">
  <img src="images/use-case-docs.png" alt="Docs Example" width="600">
</p>

## 📊 Bundle Sizes

Choose the right bundle for your needs:

<p align="center">
  <img src="images/bundle-comparison.png" alt="Bundle Comparison" width="500">
</p>

- **Core Bundle**: 96KB (essential plugins only)
- **Full Bundle**: 1.9MB (all plugins included)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

<p align="center">
  <img src="images/contributing-workflow.png" alt="Contributing Workflow" width="600">
</p>

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<p align="center">
  <img src="images/powered-by-editora.png" alt="Powered by Editora" width="200">
</p>

<p align="center">
  Made with ❤️ by the Editora team
</p>
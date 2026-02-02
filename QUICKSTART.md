# Quick Start Guide

Get Editora Rich Text Editor up and running in 5 minutes!

## Installation

```bash
npm install @editora/react @editora/core @editora/plugins @editora/themes
```

## Basic Setup

### 1. Import Packages

```tsx
import { RichTextEditor } from '@editora/react';
import {
  createBoldPlugin,
  createItalicPlugin,
  createHeadingPlugin,
  createListPlugin,
  createHistoryPlugin
} from '@editora/plugins';
import '@editora/themes/styles';
```

### 2. Create Component

```tsx
import { useState } from 'react';

function MyEditor() {
  const [content, setContent] = useState('<p>Start writing...</p>');

  const plugins = [
    createBoldPlugin(),
    createItalicPlugin(),
    createHeadingPlugin(),
    createListPlugin(),
    createHistoryPlugin()
  ];

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      plugins={plugins}
      placeholder="Type something..."
    />
  );
}
```

### 3. Done! 🎉

That's it! You now have a working rich text editor.

## Next Steps

### Add More Features

```tsx
import {
  createLinkPlugin,
  createImagePlugin,
  createTablePlugin,
  createCodeSamplePlugin
} from '@editora/plugins';

const advancedPlugins = [
  ...plugins, // Previous plugins
  createLinkPlugin(),
  createImagePlugin({
    upload: async (file) => {
      // Upload logic
      return '/path/to/uploaded/image.jpg';
    }
  }),
  createTablePlugin(),
  createCodeSamplePlugin()
];
```

### Customize Theme

```tsx
// In your CSS file
:root {
  --editora-primary: #007bff;
  --editora-toolbar-bg: #f8f9fa;
}
```

### Handle Form Submission

```tsx
function BlogPostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <RichTextEditor
        value={content}
        onChange={setContent}
        plugins={plugins}
      />
      <button type="submit">Publish</button>
    </form>
  );
}
```

## Examples

Check out complete examples in the `/examples` directory:

- **Basic** - Simple setup
- **Advanced** - Full-featured editor
- **Blog** - Blog post editor
- **Docs** - Technical documentation

## Documentation

- [Full Documentation](./README.md)
- [@editora/react](./packages/react/README.md)
- [@editora/plugins](./packages/plugins/README.md)
- [@editora/themes](./packages/themes/README.md)

## Support

- [GitHub Issues](https://github.com/ajaykr089/Editora/issues)
- [Contributing Guide](./CONTRIBUTING.md)

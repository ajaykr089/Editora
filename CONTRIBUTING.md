# Contributing to Editora Rich Text Editor

Thank you for your interest in contributing to Editora! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Creating Plugins](#creating-plugins)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js 16+ and npm 7+
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/Editora.git
cd Editora
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/ajaykr089/Editora.git
```

## Development Setup

### Install Dependencies

```bash
npm install
```

This will install dependencies for all packages in the monorepo using Lerna.

### Build All Packages

```bash
npm run build
```

### Start Development Mode

```bash
npm run dev
```

This starts Vite in watch mode for all packages.

### Run Storybook

```bash
npm run storybook
```

Opens Storybook at [http://localhost:6006](http://localhost:6006)

## Project Structure

```
Editora/
├── packages/
│   ├── core/              # Framework-agnostic core
│   ├── react/             # React components
│   ├── plugins/           # Plugin collection
│   │   ├── bold/
│   │   ├── italic/
│   │   └── ...            # 40+ plugins
│   ├── themes/            # Styling system
│   └── performance/       # Optimization utilities
├── examples/              # Example projects
├── stories/               # Storybook stories
├── api/                   # Backend API (optional)
└── lerna.json            # Monorepo configuration
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Build/tooling changes

### 2. Make Changes

- Write clean, documented code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run tests
npm test

# Type check
npm run typecheck

# Lint code
npm run lint

# Build to ensure no errors
npm run build
```

### 4. Commit Your Changes

We use conventional commits:

```bash
git commit -m "feat(plugin-bold): add keyboard shortcut customization"
git commit -m "fix(editor): resolve selection issue on blur"
git commit -m "docs(readme): add installation instructions"
```

Commit message format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Build/tooling

### 5. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Then create a pull request on GitHub with:
- Clear title and description
- Reference any related issues
- Include screenshots for UI changes
- Describe testing performed

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Prefer interfaces over types for object shapes
- Use explicit types, avoid `any`
- Document complex types with JSDoc

```typescript
/**
 * Configuration options for the editor
 */
interface EditorConfig {
  /** Initial HTML content */
  content?: string;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Array of plugins to load */
  plugins?: Plugin[];
}
```

### React Components

- Use functional components with hooks
- Prefer named exports
- Use TypeScript for props
- Document props with JSDoc

```typescript
interface ButtonProps {
  /** Button label text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Optional icon */
  icon?: React.ReactNode;
}

export function Button({ label, onClick, icon }: ButtonProps) {
  // Component implementation
}
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Use meaningful variable names
- Keep functions small and focused

```typescript
// Good
const plugins = [
  createBoldPlugin(),
  createItalicPlugin(),
];

// Bad
const plugins = [
  createBoldPlugin(),
  createItalicPlugin()
]
```

### File Organization

- One component per file
- Group related files in directories
- Use index files for barrel exports
- Keep file names consistent with exports

```
plugin-bold/
├── src/
│   ├── BoldPlugin.ts      # Main plugin
│   ├── BoldButton.tsx     # UI component
│   ├── types.ts           # Type definitions
│   └── index.ts           # Barrel export
├── package.json
└── README.md
```

## Testing

### Unit Tests

Write tests for:
- Plugin functionality
- Utility functions
- State management
- Edge cases

```typescript
describe('BoldPlugin', () => {
  it('should toggle bold formatting', () => {
    const plugin = createBoldPlugin();
    // Test implementation
  });

  it('should handle keyboard shortcut', () => {
    // Test implementation
  });
});
```

### Integration Tests

Test component integration:

```typescript
describe('RichTextEditor', () => {
  it('should render with plugins', () => {
    render(
      <RichTextEditor
        plugins={[createBoldPlugin()]}
      />
    );
    // Assertions
  });
});
```

## Creating Plugins

### Plugin Structure

```typescript
import { Plugin, Editor } from '@editora/core';

export interface MyPluginOptions {
  // Plugin options
}

export class MyPlugin extends Plugin {
  name = 'my-plugin';
  
  constructor(private options: MyPluginOptions = {}) {
    super();
  }
  
  install(editor: Editor) {
    // Initialize plugin
  }
  
  execute(command: string, ...args: any[]) {
    // Handle commands
  }
  
  destroy() {
    // Cleanup
  }
}

export function createMyPlugin(options?: MyPluginOptions) {
  return new MyPlugin(options);
}
```

### Plugin Guidelines

1. **Single Responsibility**: Each plugin should do one thing well
2. **Configuration**: Make features configurable
3. **Documentation**: Document all options and features
4. **Tests**: Include comprehensive tests
5. **Examples**: Provide usage examples
6. **Types**: Full TypeScript support

### Plugin Checklist

- [ ] Plugin class extends base Plugin
- [ ] Factory function for creation
- [ ] TypeScript interfaces for options
- [ ] Install method implementation
- [ ] Execute method for commands
- [ ] Cleanup in destroy method
- [ ] Unit tests
- [ ] Documentation
- [ ] Example usage
- [ ] README file

## Submitting Changes

### Pull Request Checklist

Before submitting:

- [ ] Code follows style guidelines
- [ ] Tests pass (`npm test`)
- [ ] Types are correct (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] PR description is clear

### PR Review Process

1. Automated checks run (CI/CD)
2. Code review by maintainers
3. Address feedback
4. Approval required from maintainer
5. Merge to main branch

## Questions?

- Open an [issue](https://github.com/ajaykr089/Editora/issues)
- Check [documentation](README.md)
- Ask in discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make Editora better for everyone. We appreciate your time and effort!

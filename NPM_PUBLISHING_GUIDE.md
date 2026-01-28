# Editora - NPM Publishing Guide

## Package Information

**Library Name**: Editora  
**Author**: Ajay Kumar <ajaykr089@gmail.com>  
**Repository**: https://github.com/ajaykr089/editora  
**Version**: 1.0.0  
**License**: MIT

## Available NPM Packages

Editora is published as a monorepo with the following scoped packages:

### Core Packages

| Package | Name | Description |
|---------|------|-------------|
| Core Engine | `@editora/core` | Framework-agnostic editor engine |
| React Components | `@editora/react` | Pre-built React components |
| Plugins | `@editora/plugins` | 30+ plugins for rich editing |
| Themes | `@editora/themes` | Built-in themes and styling |
| Performance | `@editora/performance` | Performance monitoring utilities |
| Light Code Editor | `@editora/light-code-editor` | Lightweight code editor library |

### Individual Plugin Packages

All plugins are also available individually as `@editora/plugin-{name}`:

- `@editora/plugin-bold`
- `@editora/plugin-italic`
- `@editora/plugin-underline`
- `@editora/plugin-strikethrough`
- `@editora/plugin-heading`
- `@editora/plugin-paragraph`
- `@editora/plugin-text-color`
- `@editora/plugin-background-color`
- `@editora/plugin-text-alignment`
- `@editora/plugin-line-height`
- `@editora/plugin-list`
- `@editora/plugin-checklist`
- `@editora/plugin-blockquote`
- `@editora/plugin-code`
- `@editora/plugin-table`
- `@editora/plugin-link`
- `@editora/plugin-image`
- `@editora/plugin-math`
- `@editora/plugin-emoji`
- `@editora/plugin-special-characters`
- `@editora/plugin-history`
- `@editora/plugin-preview`
- `@editora/plugin-document-manager`
- `@editora/plugin-font-family`
- `@editora/plugin-font-size`
- `@editora/plugin-indent`
- `@editora/plugin-direction`
- `@editora/plugin-capitalization`

## Installation

### Install all main packages
```bash
npm install editora @editora/react @editora/plugins @editora/themes
```

### Install specific packages
```bash
# Just the core engine
npm install @editora/core

# React components without all plugins
npm install @editora/react @editora/core

# Individual plugins
npm install @editora/plugin-bold @editora/plugin-italic
```

### Install with peer dependencies
```bash
npm install editora @editora/react @editora/plugins react react-dom
```

## Publishing to NPM

### Prerequisites

1. NPM account at https://www.npmjs.com
2. Logged in locally: `npm login`
3. Have publishing rights to the `editora` and `@editora` scope

### Publishing Steps

1. **Update version** in root and relevant package.json files:
   ```bash
   npm version major|minor|patch
   ```

2. **Build the packages**:
   ```bash
   npm run build
   ```

3. **Run tests** (if configured):
   ```bash
   npm run test
   ```

4. **Publish to NPM**:
   ```bash
   # Publish all packages
   npm run publish
   
   # Or publish specific packages
   cd packages/core && npm publish
   cd ../react && npm publish
   ```

### Monorepo Publishing with Lerna

The project uses Lerna for monorepo management:

```bash
# Publish all changed packages
lerna publish

# Publish with custom version
lerna publish --force-publish

# Publish only to npm (skip git)
lerna publish --skip-git
```

## Package Access Scope

The `@editora` scope requires:

1. **Create organization on npm**: https://www.npmjs.com/org/create
2. **Add team members**: Each member needs npm account
3. **Set scope visibility**:
   - Public: Anyone can install
   - Private: Only team members can install

### Set public scope:
```bash
npm access grant read-write @editora:org @editora-team
npm access public @editora/core
```

## Versioning Strategy

Follow Semantic Versioning (semver):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (1.1.0): New features, backward compatible
- **PATCH** (1.0.1): Bug fixes

### Version by package type:

```
Core (@editora/core):       1.0.0
React (@editora/react):     1.0.0  (matches core)
Plugins (@editora/plugins): 1.0.0  (matches core)
Themes (@editora/themes):   1.0.0  (matches core)
```

## NPM Registry Configuration

### .npmrc file (in root)

```ini
registry=https://registry.npmjs.org/
@editora:registry=https://registry.npmjs.org/
access=public
```

### Login and verification:

```bash
# Login to npm
npm login

# Verify login
npm whoami

# Check npm version
npm --version
```

## Package Metadata

Each package.json includes:

```json
{
  "name": "@editora/package-name",
  "version": "1.0.0",
  "description": "Description of the package",
  "author": "Ajay Kumar <ajaykr089@gmail.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/ajaykr089/editora.git",
    "directory": "packages/package-name"
  },
  "bugs": {
    "url": "https://github.com/ajaykr089/editora/issues"
  },
  "homepage": "https://editora.dev",
  "keywords": [
    "editor",
    "rich-text",
    "react",
    "plugins",
    "typescript"
  ],
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    }
  },
  "files": ["dist"]
}
```

## Quality Checklist Before Publishing

- [ ] Version updated in all relevant package.json
- [ ] CHANGELOG.md updated with new features/fixes
- [ ] README.md reflects current features
- [ ] All tests passing: `npm test`
- [ ] Code linted: `npm run lint`
- [ ] Types checked: `npm run typecheck`
- [ ] Build succeeds: `npm run build`
- [ ] No console warnings during build
- [ ] Dependencies are correct and minimal
- [ ] Git tag created: `git tag v1.0.0`
- [ ] Git tag pushed: `git push origin v1.0.0`

## After Publishing

1. **Verify on npm registry**:
   ```bash
   npm view @editora/react
   npm info @editora/core@latest
   ```

2. **Test installation**:
   ```bash
   npm install editora @editora/react @editora/plugins
   ```

3. **Update GitHub releases**:
   - Create release for the git tag
   - Add changelog notes
   - Link to npm packages

4. **Announce release**:
   - GitHub discussions/issues
   - npm notifications auto-sent to watchers
   - Consider social media announcement

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Publish to NPM
on:
  push:
    tags:
      - 'v*'
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - run: lerna publish --skip-git --yes
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

### Issue: 403 Forbidden

**Solution**: 
- Verify npm account has publishing rights
- Check @editora scope access
- Run `npm login` again

### Issue: Package already exists

**Solution**:
- Bump version number
- Use `--force` flag (not recommended)

### Issue: Build contains wrong files

**Solution**:
- Update `files` array in package.json
- Update `.npmignore` file
- Clean dist folder: `npm run clean`

### Issue: Dependencies not found

**Solution**:
- Ensure peer dependencies are listed in package.json
- Check external dependencies in build config
- Verify monorepo symlinks are correct

## Security

### Best Practices

- Enable 2FA on npm account
- Use npm tokens for CI/CD
- Audit dependencies: `npm audit`
- Keep dependencies updated: `npm update`
- Review CHANGELOG for security fixes

### Generate NPM Token

1. Go to https://www.npmjs.com/settings/~/tokens
2. Create new token: "Automation" type (all access)
3. Add to GitHub secrets as `NPM_TOKEN`
4. Use in CI/CD: `${{ secrets.NPM_TOKEN }}`

## Deprecation & Maintenance

### Deprecate a version

```bash
npm deprecate @editora/core@1.0.0 "This version has a critical bug, use 1.0.1 instead"
```

### Remove a version

```bash
npm unpublish @editora/core@1.0.0
```

### Add maintainers

```bash
npm owner add username @editora/core
npm owner remove username @editora/core
npm owner ls @editora/core
```

## Resources

- [NPM Documentation](https://docs.npmjs.com/)
- [Lerna Documentation](https://lerna.js.org/)
- [Semantic Versioning](https://semver.org/)
- [npm Publishing Guidelines](https://docs.npmjs.com/cli/publish)
- [Package.json Reference](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)

---

**Author**: Ajay Kumar <ajaykr089@gmail.com>  
**Last Updated**: January 28, 2026

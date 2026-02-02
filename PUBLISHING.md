# Publishing Guide

Complete guide for publishing Editora packages to npm.

## 📋 Prerequisites

1. **npm Account**: Create at [npmjs.com](https://www.npmjs.com)
2. **npm Login**: `npm login`
3. **2FA Enabled**: Enable two-factor authentication
4. **Access Rights**: Must have publish access to `@editora` scope

## 🔐 Setup

### 1. Create npm Organization

```bash
npm org create editora
```

Or use existing organization/scope.

### 2. Configure npm Token

For CI/CD, create an automation token:

1. Go to [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
2. Create "Automation" token
3. Add to GitHub Secrets as `NPM_TOKEN`

### 3. Verify Packages

Ensure all packages are ready:

```bash
npm run build
npm run test
npm run typecheck
```

## 📦 Publishing Workflow

### Manual Publishing

#### Option 1: Publish All Packages

```bash
# Build all packages
npm run build

# Publish all packages with version bump
npm run publish:all
```

Lerna will:
1. Detect changed packages
2. Prompt for version bump
3. Update CHANGELOGs
4. Create git tags
5. Publish to npm

#### Option 2: Version First, Publish Later

```bash
# Version bump (creates git tags)
npm run version

# Then publish
lerna publish from-git
```

#### Option 3: Specific Version

```bash
# Patch release (1.0.0 -> 1.0.1)
npm run release:patch

# Minor release (1.0.0 -> 1.1.0)
npm run release:minor

# Major release (1.0.0 -> 2.0.0)
npm run release:major
```

### Canary Releases

For testing before official release:

```bash
npm run publish:canary
```

This publishes with a canary tag like `1.0.1-alpha.0+abc123`.

### Publishing Individual Packages

```bash
cd packages/core
npm publish --access public
```

## 🚀 Automated Publishing (GitHub Actions)

### Setup GitHub Action

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build packages
        run: npm run build
      
      - name: Run tests
        run: npm test
      
      - name: Publish to npm
        run: lerna publish from-git --yes
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

### Trigger Publishing

```bash
# Create and push tag
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will automatically publish.

## 📝 Release Checklist

Before publishing:

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Version bumped in package.json files
- [ ] CHANGELOG updated
- [ ] README files up to date
- [ ] Examples tested
- [ ] Documentation reviewed

## 🏷️ Version Strategy

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 -> 2.0.0): Breaking changes
- **MINOR** (1.0.0 -> 1.1.0): New features (backward compatible)
- **PATCH** (1.0.0 -> 1.0.1): Bug fixes (backward compatible)

### Conventional Commits

Use conventional commits for automatic CHANGELOG generation:

```bash
feat(plugin-bold): add custom keyboard shortcut
fix(editor): resolve selection bug
docs(readme): update installation guide
```

## 📊 Post-Publishing

### Verify Publication

```bash
# Check published version
npm view @editora/core version
npm view @editora/react version
npm view @editora/plugins version
npm view @editora/themes version
```

### Test Installation

```bash
# Create test directory
mkdir test-editora && cd test-editora
npm init -y

# Install packages
npm install @editora/react @editora/core @editora/plugins @editora/themes
```

### Update Documentation

- Update main README with new version
- Update examples if API changed
- Announce release in GitHub Releases
- Update website/demos if applicable

## 🔄 Rollback

If you need to unpublish or deprecate:

```bash
# Deprecate a version (recommended over unpublish)
npm deprecate @editora/core@1.0.0 "Please upgrade to 1.0.1"

# Unpublish (only within 72 hours, use sparingly)
npm unpublish @editora/core@1.0.0
```

## 📋 Package Status

Current published packages:

- `@editora/core` - Core editor engine
- `@editora/react` - React components
- `@editora/plugins` - Plugin collection (40+ plugins)
- `@editora/themes` - Theming system

## 🛠️ Troubleshooting

### Error: 402 Payment Required

You need to upgrade npm account or verify organization.

### Error: 403 Forbidden

- Check npm login status: `npm whoami`
- Verify organization access
- Check 2FA settings

### Error: Version already exists

Version is already published. Bump version and try again.

### Build Fails

```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📞 Support

- [npm Support](https://npmjs.com/support)
- [GitHub Issues](https://github.com/ajaykr089/Editora/issues)
- Documentation: See main [README.md](README.md)

## 🔗 Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Lerna Documentation](https://lerna.js.org/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

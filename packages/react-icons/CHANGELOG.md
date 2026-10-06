# Change Log

## 0.1.11

### Patch Changes

- f53ca3a: Fix `IconProvider`'s `strokeWidth`, which was silently ignored: `iconWeight` always resolved to `'regular'` and always beat the provider's stroke width, so `<IconProvider value={{ strokeWidth: 3 }}>` rendered 1.5. Stroke width now resolves as prop width, prop weight, provider width, provider weight, then the default. A decorative icon that is also given an `aria-label` is no longer marked both `aria-hidden` and labelled. Invalid sizes (`0`, negatives, `NaN`, non-lengths) fall back to the default instead of reaching `width`/`height` (React logged "Received NaN for the `width` attribute"). Adds the package's first test suite.
- Updated dependencies [f53ca3a]
  - @editora/icons@0.1.11

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.10](https://github.com/ajaykr089/Editora/compare/@editora/react-icons@0.1.6...@editora/react-icons@0.1.10) (2026-09-05)

**Note:** Version bump only for package @editora/react-icons

## [0.1.6](https://github.com/ajaykr089/Editora/compare/@editora/react-icons@0.1.0...@editora/react-icons@0.1.6) (2026-03-08)

**Note:** Version bump only for package @editora/react-icons

## [0.1.5](https://github.com/ajaykr089/Editora/compare/@editora/react-icons@0.1.0...@editora/react-icons@0.1.5) (2026-03-05)

**Note:** Version bump only for package @editora/react-icons

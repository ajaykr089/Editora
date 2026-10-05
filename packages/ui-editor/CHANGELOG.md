# Change Log

## 0.1.6

### Patch Changes

- f1326f5: Ship TypeScript declarations. These packages declare `"types": "dist/index.d.ts"` in their `package.json`, but their build only produced JavaScript, so that file never existed in any published version and TypeScript users got no typings from them (TS7016, or an implicit `any`). Each package now includes a generated `dist/index.d.ts` (plus the declaration files it re-exports under `dist/_types/`), and the release workflow refuses to publish a package whose declared typings are missing.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.5](https://github.com/ajaykr089/Editora/compare/@editora/ui-editor@0.1.3...@editora/ui-editor@0.1.5) (2026-09-05)

**Note:** Version bump only for package @editora/ui-editor

## 0.1.3 (2026-03-08)

**Note:** Version bump only for package @editora/ui-editor

## 0.1.2 (2026-03-05)

**Note:** Version bump only for package @editora/ui-editor

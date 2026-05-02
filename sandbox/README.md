# Editora Component Demos

Vite + React demos for the published Editora UI packages, prepared for CodeSandbox.

## Run Locally

```bash
npm install
npm run dev
```

## Open In CodeSandbox

1. Go to https://codesandbox.io/
2. Create a new sandbox or choose **Import**.
3. Upload `Archive.zip` from this folder, or upload the contents of this `sandbox` directory.
4. CodeSandbox should install dependencies automatically.
5. Run:

```bash
npm run dev
```

## Package Versions

This sandbox uses:

- `@editora/react@1.0.12`
- `@editora/light-code-editor@1.0.10`
- `@editora/core@1.0.9`
- `@editora/plugins@1.0.8`
- `@editora/ui-react@0.1.13`
- `@editora/ui-core@0.1.13`
- `@editora/react-icons@0.1.7`
- `@editora/icons@0.1.7`
- `@editora/toast@2.0.5`
- `@editora/themes@1.0.10`

## Notes

- The demo app imports components from the published npm packages, not local workspace source.
- The first sidebar section contains the rich text editor and light code editor demos.
- `Archive.zip` excludes `node_modules` and `dist`.
- The production build can be checked with:

```bash
npm run build
```

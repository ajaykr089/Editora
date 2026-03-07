# Editora Docs

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Production documentation app for the Editora ecosystem, built with Docusaurus classic.

## Location

`examples/editora-docs`

## Core commands

```bash
cd examples/editora-docs
npm install
npm run start
npm run build
npm run serve
```

## Versioning

```bash
npm run version:cut 1.0.0
```

This app uses versioned docs (`current` + release snapshots).

## Search strategy

- Primary: Algolia DocSearch (when env vars are present)
- Fallback: local search plugin

Required env vars for Algolia:

- `DOCSEARCH_APP_ID`
- `DOCSEARCH_API_KEY`
- `DOCSEARCH_INDEX_NAME`

## Documentation architecture

- `docs/intro.md`
- `docs/getting-started/*`
- `docs/editor/*`
- `docs/ui-core/*`, `docs/ui-react/*`
- `docs/icons/*`, `docs/react-icons/*`
- `docs/toast/*`
- `docs/theming/*`
- `docs/advanced/*`
- `docs/migration/*`
- `docs/contributing/*`

## Notes

- Dark mode is the default with system preference support.
- Sitemap and SEO metadata are configured in `docusaurus.config.ts`.
- Live code blocks are auto-enabled when `@docusaurus/theme-live-codeblock` is installed.

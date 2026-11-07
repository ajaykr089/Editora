# e2e-ui

Real-browser tests for `@editora/ui-core` and `@editora/ui-react`, run in CI (`.github/workflows/ci.yml`).

| Command (in `e2e-ui/`) | What it runs |
| --- | --- |
| `npm test -- --project=chromium --project=firefox --project=webkit` | Behaviour and keyboard specs against a React 19 app built from the packages' **source** (`app/`, Vite on port 5199). Covers what jsdom cannot: form association, focus and WAI-ARIA keyboard patterns, layout, server-rendered markup, icons. |
| `npm run test:a11y` | axe over every Storybook story, unthemed and with the real light theme. Build Storybook first, from the repo root: `STORYBOOK_DISABLE_TELEMETRY=1 npx storybook build --output-dir e2e-ui/storybook-static` (stories import `packages/editora-toast/dist` and `packages/light-code-editor/dist` CSS, so build those first). Accepted findings go in `a11y-allowlist.json`, with a reason. |
| `npm run test:visual` | Screenshots of `app/visual.html` per theme (light, dark) and density. Baselines are Linux-only: run the **Update visual baselines** workflow and commit the `*-linux.png` files it uploads into `tests/visual.spec.ts-snapshots/`. Without a baseline for your platform the tests skip. |

Setup: `npm ci` here (its own lockfile; it does not touch the root install), then `npx playwright install chromium firefox webkit`.

`npm run app` serves the test app for manual checks: `/` (fixes), `/forms.html`, `/signin.html`, `/typing.html`, `/shell.html`, `/keyboard.html`, `/navigation.html`, `/density.html?density=compact`, `/ssr.html?preload=1`, `/visual.html?density=compact`.

The repo-wide size budget (`npm run check:ui-size` at the root) is separate: see `scripts/check-ui-size.mjs`.

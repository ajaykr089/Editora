# Change Log

## 0.3.0

### Minor Changes

- 5fd049a: Aliases now name what the icon draws. Some icons had collected dozens of unrelated names: `semantic-business`, a small
  chart, answered to 69 (`export`, `payroll`, `chatbot`, ...), and `pizza` drew a coffee cup. Of the 1139 aliases, 408 now
  point at a dedicated icon (`github` is `logo-github`, `export` is `download`, `import` is `upload`, `avatar` is
  `user-circle`, `line-height` is `type-line-height`, `coupon` is `tag`), 204 that no icon draws are removed, and 527
  are unchanged; every icon draws exactly as before. A removed alias makes `hasIcon` return false and `renderIconSvg`
  return an empty string: pick an icon from `listIcons()`, or register your own under that name. `listIconAliases()`
  lists where every remaining alias points.

  Removed: `accordion-close`, `accordion-open`, `accordion`, `acquisition-cost`, `adobe`, `alert-banner`, `api-limit`, `apple`, `arrears`, `attribution-model`, `attribution`, `auto-spacing`, `backdrop-blur`, `backdrop-opacity`, `backorder`, `badge-dot`, `badge-number`, `banner`, `bike`, `blockchain`, `blur`, `bounce-rate`, `breadcrumb-separator`, `breadcrumb`, `burger`, `bus`, `cake`, `cash-register`, `category-add`, `chatbot-admin`, `chip-filled`, `chip-outline`, `churn-rate`, `clipping-mask`, `collapse-horizontal`, `collapse-vertical`, `commission-rate`, `commission`, `container-fluid`, `controller`, `credit-score`, `cross-sell`, `customs`, `demand`, `docking`, `downtime-alert`, `downtime`, `drawer`, `dunning`, `duty`, `dynamic-pricing`, `easing-in-out`, `easing-in`, `easing-out`, `easing`, `export-sales`, `face-id`, `fill`, `focus-trap`, `font-color`, `font-size`, `fuel`, `gamepad`, `gantt`, `gateway-razorpay`, `gateway`, `gesture-pinch`, `gesture-swipe`, `gesture-tap`, `gesture-zoom`, `gesture`, `glass-effect`, `glass`, `google-cloud`, `gradient-conic`, `gradient-linear`, `gradient-radial`, `gradient`, `gratuity`, `guide-horizontal`, `guide-vertical`, `guide`, `habit-track`, `habit`, `hand-release`, `hand`, `heatmap-analytics`, `heatmap`, `ice-cream`, `icon-bold`, `icon-duotone`, `icon-filled`, `icon-outline`, `icon-rounded`, `icon-sharp`, `icon-thin`, `import-products`, `interest-rate`, `interest`, `lightbulb`, `lighthouse`, `limit-exceeded`, `limit`, `live-commerce`, `mapping-field`, `mapping`, `mask-inverse`, `mask`, `microinteraction`, `mining`, `modal-close`, `modal-open`, `modal`, `motion`, `negotiation`, `nft-marketplace`, `nft`, `omnichannel`, `opacity`, `optimization-auto`, `optimization-manual-admin`, `optimization`, `otp`, `overflow-hidden`, `overflow-scroll`, `overflow`, `pagination`, `panel`, `paragraph-spacing`, `paragraph`, `parking`, `path-exclude`, `path-intersect`, `path-merge`, `path-subtract`, `permission-add`, `permission-remove`, `pizza`, `plan-downgrade`, `plan-upgrade`, `plan`, `plug`, `preorder`, `procurement`, `progress-bar`, `progress-step`, `quota`, `rate-limit`, `reconciliation`, `retention-rate`, `rss`, `safe-area`, `scooter`, `ship`, `skeleton-avatar`, `skeleton-text`, `skeleton`, `sketch`, `sla-breach`, `snackbar`, `snapping-grid`, `snapping-object`, `snapping`, `social-commerce`, `source-organic`, `source-paid`, `source`, `staking`, `stepper-horizontal`, `stepper-vertical`, `stepper`, `stroke-width`, `stroke`, `supplier-add`, `supply`, `tab-active`, `tab-add`, `tab-inactive`, `tab-order`, `tab`, `tenant-add`, `tenant-switch`, `text-rotate`, `text-truncate`, `text-vertical`, `text-wrap`, `throttle`, `tip`, `toast`, `traffic-light`, `train`, `transformation-rule`, `transformation`, `transparency`, `unwrap`, `upsell`, `usb`, `variant-alt`, `variant`, `whiteboard`, `wholesale`, `wizard-step`, `wizard`, `wrap`.

- 7d2a229: 71 icons are redrawn so they look like what they name, on the 24 px grid and at the same size as the rest of the set:
  `refresh-cw`, `refresh-ccw`, `arrow-circle-cw` and `arrow-circle-ccw` have arrowheads, `spinner` is a loader,
  `settings` is a gear and `maintenance` a wrench (both were sun-like shapes), `dislike` is a thumbs-down (it was a thumbs-up),
  `bug`, `brain`, `book`, `command`, `at-sign`, `anchor`, `cast`, `link`, `link-2`, `unlink`, `quote`, `strikethrough`,
  `paperclip`, `printer`, `paste`, `edit`, `drag` (now four-way arrows), `fingerprint`, `airplane`, `accessibility` and the
  cloud weather icons are redrawn, the plus and minus of `bookmark-plus`/`-minus` and `database-add`/`-remove` no longer
  spill over the shape, and `share-2` (identical to `share`) is now a share-sheet arrow. The media controls (`play`,
  `pause`, `stop`, `forward`, `rewind`, `skip-next`, `skip-previous`) are outlines like every other icon, and gain a filled
  `solid` variant for the old look (`variant: 'solid'`). Names, aliases and every other icon are unchanged.
- d812360: New `searchIcons(query, { category?, limit? })` finds icons best match first, by name, alias (`delete` finds `trash`),
  tag (`bin` finds `trash`, `ai` finds `sparkles`) and category (`weather`). Every word of the query has to match, and when
  no icon matches them all, the icons that match the most words come back instead of nothing. Each result says what matched
  (`{ name, score, matchedBy, matched }`), and icons added with `registerIcon` are searched too. New `listIconCategories()`
  returns every category with its icon count, for picker filters. Every built-in icon now has at least one category (341 had
  none; existing categories are unchanged, and all brand icons are also in `logos`), and 123 common icons gain search tags
  for the words people type (`gear`, `bin`, `photo`, `email`, `ai`).
- 8d7a928: Names are typed: every function that takes an icon name accepts `IconName` (the union of the 504 built-in names, so
  they autocomplete) or any other string, and `IconName` is exported for typing names kept in your own data, where a
  typo becomes a compile error. `renderIconDefinition` is now also exported from the package root, and
  `getRegisteredIcon(name)` (root and `@editora/icons/renderer`) returns the icon `registerIcon` added or replaced under
  a name. The `glyphs` and `renderer` subpaths now resolve in tools that ignore `exports` (Jest 27, webpack 4,
  TypeScript's `node` resolution).

## 0.2.0

### Minor Changes

- b25a486: Ship only the icons you use. `@editora/icons/glyphs` exports every built-in icon on its own (`checkIcon`, `chevronDownIcon`, ...) so a bundler keeps only the ones imported, and `@editora/icons/renderer` draws a definition with `renderIconDefinition(definition, options)` without loading the catalog (about 1.7 KB gzipped). In `@editora/ui-core`, `addIcons(checkIcon, searchIcon)` (from `@editora/ui-core/add-icons`, or the package root; only apps that use it ship its 1.7 KB renderer) registers icons by definition: they draw at once, keep their variants and weights, are found by their aliases, and the full set (about 46 KB gzipped) is only fetched when an icon that was not added is shown.

## 0.1.12

### Patch Changes

- 59c675b: Fix `absoluteStrokeWidth`, which did the opposite of what it says. Every stroke is drawn with `vector-effect="non-scaling-stroke"`, so its width is already in screen pixels at any size; the option scaled the width by `viewBox / size` on top of that, and a 1.5 stroke came out 3px at size 12 and 0.75px at size 48 (measured in Chromium). The option now leaves the width alone and the stroke stays `strokeWidth` pixels at every size. This also fixes `<ui-icon absolute-stroke-width>` in `@editora/ui-core` and `Icon` in `@editora/ui-react`, which render through `@editora/icons`. Nothing changes for code that does not pass the option.
- 59c675b: Rewrite the READMEs of `@editora/cli`, `@editora/icons`, `@editora/react-icons` and `@editora/performance`, and add one to `@editora/ui-editor`, which had none. They are the npm pages of these packages, with screenshots and examples.

  The CLI README shows real terminal output (every command and the JavaScript example in it are run against the CLI and compared with the text, `npm run check:readme-examples`). The other READMEs have examples that are type-checked and run in Chromium, and their screenshots are taken from the same examples (`npm run readme:screenshots`).

  Things the READMEs now get right that they did not: only 21 of the 504 icons have a solid variant and 2 a duotone one; importing anything from `@editora/icons` or `@editora/react-icons` brings the whole catalog (about 48 KB and 57 KB gzipped), so named imports are not smaller; `registerWithEditoraUI(registerIcon)` must not be used with `@editora/ui-core`, because its registry then wins over the built-in icons and every `<ui-icon>` draws the plain outline; `@editora/react-icons` has no `'use client'` directive, so in the Next.js App Router its icons belong in Client Components; `editora add` does not read lock files, so in a pnpm, yarn or bun project it needs `--package-manager` or the matching `dlx`. `@editora/performance` documents that its memory manager cancels every registered timer when the heap is high, that the heap size exists only in Chromium, that the monitor times one operation at a time, and that most of it needs `window`; `@editora/ui-editor` says that its six elements are provided by `@editora/ui-core` and that loading it registers nothing, because `@editora/ui-core` is imported first and defines the same tags.

## 0.1.11

### Patch Changes

- f53ca3a: Fix the `heading-1`, `heading-2` and `heading-3` icons, which were drawn as "1H1", "12" and "1Z" (all three began with a stray "1" glyph and the H2/H3 had no "H"); they now read H1, H2, H3 at every size. Harden `renderIconSvg`: attribute names passed through `options.attrs` were written into the markup unescaped (a name such as `x" onload="…` injected attributes and produced malformed XML), and event-handler attributes and invalid names are now dropped; `size` values such as `0`, `-5`, `NaN` or `abc` went straight into `width`/`height` (browsers then size the `<svg>` at 300×150), so only positive numbers and CSS lengths are accepted and anything else falls back to the default; negative or non-finite `strokeWidth` is ignored; `absoluteStrokeWidth` now works with `px` sizes. Adds a `normalizeIconSize` export (used by `@editora/react-icons`) and the package's first test suite.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.10](https://github.com/ajaykr089/Editora/compare/@editora/icons@0.1.5...@editora/icons@0.1.10) (2026-09-05)

**Note:** Version bump only for package @editora/icons

## [0.1.5](https://github.com/ajaykr089/Editora/compare/@editora/icons@0.1.0...@editora/icons@0.1.5) (2026-03-08)

**Note:** Version bump only for package @editora/icons

## [0.1.4](https://github.com/ajaykr089/Editora/compare/@editora/icons@0.1.0...@editora/icons@0.1.4) (2026-03-05)

**Note:** Version bump only for package @editora/icons

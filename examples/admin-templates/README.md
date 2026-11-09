# Editora admin templates

Two complete admin templates built only with the Editora ecosystem, as references for people and for AI
assistants writing Editora code. They are about UI, UX and how the packages fit together: there is no backend.
`shared/data.ts` is a pretend API in the browser (seeded data, a short delay, server-style validation errors), so
loading states, server-side tables and error handling look the way they would against a real server.

| | Larkspur | Copperline |
| --- | --- | --- |
| Stack | React 19, `@editora/ui-react`, `@editora/react` (editor) | Plain HTML, `@editora/ui-core` web components, `<editora-editor>` |
| Style | Multi-dashboard admin (PlainAdmin-like) | Page-per-file admin (AdminKit-like) |
| Brand | Violet, light and dark, three densities | Copper, light and dark |
| Pages | eCommerce, Analytics, CRM and Projects dashboards; Orders and order detail; Customers and profile; Products (grid/table, add/edit drawer); Invoices and printable invoice; Mail (compose with the editor); Calendar; Kanban; Journal (post editor); Profile; Settings (5 tabs); Pricing; UI elements gallery; Sign in / up / forgot / verify; 404 | Dashboard; Orders (server-side table); Order detail; Help centre articles; Article editor; Settings; Sign in; 404 |

## Run them

```bash
npm install --prefix examples/admin-templates
npm run dev --prefix examples/admin-templates     # http://127.0.0.1:5230
```

Open `/larkspur/` or `/copperline/`. Add `?theme=dark` for dark mode and `?latency=0` to skip the pretend network
delay. The packages run from this repository's source (see `vite.config.ts`): in your own app, install them from
npm and none of the aliases are needed.

## Where to look

| To see how to… | Larkspur (React) | Copperline (HTML) |
| --- | --- | --- |
| Set a brand theme, light/dark | `larkspur/src/lib/theme.ts`, `main.tsx` | `copperline/src/common.ts` (`setMode`) |
| Register only the icons you use | `larkspur/src/lib/icons.ts` | `copperline/src/common.ts` |
| App shell: header, sidebar, drawer on phones | `larkspur/src/Shell.tsx` | the top of any `.html` page |
| Route Editora links through your router | `main.tsx` (`NavigationProvider`) | plain `href`s |
| Server-side table: paging, sorting, filters | `pages/Orders.tsx` | `copperline/src/orders.ts` |
| Row selection and bulk actions | `pages/Customers.tsx` | |
| Server validation errors on fields | `pages/CustomerDetail.tsx`, `apps/Mail.tsx` | `copperline/src/settings.ts` (`setErrors`) |
| Confirm / prompt dialogs | `pages/Customers.tsx`, `pages/UiKit.tsx` | `copperline/order.html` (`ui-dialog`) |
| The rich-text editor | `lib/RichText.tsx`, `apps/JournalEditor.tsx`, `apps/Mail.tsx` | `copperline/editor.html`, `src/editor.ts` |
| Charts | `pages/Commerce.tsx`, `pages/Analytics.tsx` | `copperline/src/dashboard.ts` |
| Kanban (Sortable) | `apps/Kanban.tsx` | |
| Calendar with events | `apps/Calendar.tsx` | |
| Every component family | `pages/UiKit.tsx` (`#/ui`) | |

## Rules that save time

These are things the templates had to get right. Most of them were found, and fixed in the library, while
building the templates.

**Theme and styles**

- Theme once at the top (`ThemeProvider tokens={createThemeTokens({ colors: { primary } }, { mode })}` in React,
  `applyTheme(createThemeTokens(...), document)` in HTML). The rich-text editor picks the same tokens up.
- Set the page font yourself: `body { font-family: var(--ui-font-family) }`. The theme defines it; nothing applies
  it to your own markup.
- `toastApi` needs `import '@editora/toast/toast.css'` once. Without it toasts use a minimal fallback (the console
  says so).
- Icons by name (`icon="wallet"`) need the icon registered: `addIcons(walletIcon, ...)` from
  `@editora/icons/glyphs`. The full set is never downloaded.

**Links**

- A link that looks like a button: `<Button href="/orders">` / `<ui-button href="./orders.html">`. It is a real
  link (new tab, announced as a link) and goes through `NavigationProvider` like Sidebar links.

**Data tables**

- `ui-data-table` wraps an ordinary `<table>`. Columns share the width equally unless you give the `<th>`s widths
  (`style="width: 30%"`). Right-align numbers with `data-align="end"` on the `<th>` and `<td>`.
- Server-side: `serverSide`, `totalRows`, `page`, `pageSize`, and handle `onSortChange` / `onPageChange` by
  fetching. Put `data-id` on rows: selection reports `ids`, and `data-href` makes the row a link.
- A checkbox column: put `<Checkbox data-row-select>` in each row and `<Checkbox data-select-all>` in its header
  (or plain `<input type="checkbox">`). The table keeps them in step with the selection (select-all is
  indeterminate for some) and never sorts by that column; `data-sort="false"` turns sorting off for any column.

**Forms**

- Give errors from the server to the form (`<Form errors={...}>` / `form.setErrors({...})`) or to a field
  (`error="..."` on Input, Textarea, Select). They show on the field and the first one is focused.
- `Checkbox` takes `name`, `value`, `required`, `defaultChecked` and is submitted with the form.

**Editor**

- Name the editing area: `ariaLabelledBy` (React) or `aria-labelledby` on `<editora-editor>` pointing at your
  visible label. The placeholder is not a label.
- React: create the plugins once, outside the component. HTML: list plugins and toolbar as attributes and set
  content after `editor-ready`.

**Charts**

- `values` / `labels` attributes take JSON arrays (`values="[12, 18, 9]"`). Bars and areas start at zero.
- For categories (stages, devices), pass `showChange={false}` (`show-change="false"`): a first-to-last change means
  nothing there, so the summary shows the lowest value instead.

**Known limits**

- `Sortable` `renderItem` content lives in the component's shadow root: your CSS classes do not reach it. Style it
  inline or with Editora components (see `apps/Kanban.tsx`).
- `Stat`, `PageHeader` and `MetricCard` are React-only; Copperline builds its stat cards from `ui-card`.

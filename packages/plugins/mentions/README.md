# @editora/mentions

`@editora/mentions` adds @mention autocomplete and atomic mention tokens to Editora.

## Features

- Trigger mentions with `@` while typing
- Keyboard navigation (`ArrowUp/ArrowDown`, `Enter`, `Tab`, `Esc`)
- Multi-instance safe popup handling
- Atomic mention token deletion (Backspace/Delete)
- Dark/light theme styles

## Install

```bash
npm install @editora/mentions
```

## Usage

```ts
import { MentionPlugin } from '@editora/mentions';

const mentions = MentionPlugin({
  triggerChars: ['@'],
  minChars: 1,
  maxSuggestions: 8,
  items: [
    { id: 'john.doe', label: 'John Doe', meta: 'john@acme.com' },
    { id: 'sarah.lee', label: 'Sarah Lee', meta: 'sarah@acme.com' },
  ],
});
```

Use it with `@editora/react` or web component setup by including it in your plugin list.

## Web Component Configuration

`mentions` supports the same option shape in web components via `pluginConfig`.

```html
<editora-editor id="wc-editor"></editora-editor>
<script>
  const el = document.getElementById('wc-editor');
  el.setConfig({
    plugins: 'bold italic mentions history',
    toolbar: { items: 'bold italic insertMention undo redo' },
    pluginConfig: {
      mentions: {
        minChars: 2,
        maxSuggestions: 10,
        items: [
          { id: 'john.doe', label: 'John Doe', meta: 'john@acme.com' },
          { id: 'sarah.lee', label: 'Sarah Lee', meta: 'sarah@acme.com' },
        ],
      },
    },
  });
</script>
```

Notes:
- Use plugin name `mentions` (alias `mention` also works).
- If `search` is provided, it overrides `api` and static `items`.

## Data Source Modes

Mentions can load suggestions from three sources:

1. `items` (static list, default)
2. `search(query, trigger)` (custom logic, sync or async)
3. `api` (declarative HTTP config)

Resolution precedence is:

`search` -> `api` -> `items`

If `search` is provided, it is used as the source of truth.

## Search Callback (Optional)

Use `search` when you want full control in code (custom filtering, caching, auth, multi-source lookup).

```ts
import { MentionPlugin } from '@editora/mentions';

const mentions = MentionPlugin({
  minChars: 1,
  maxSuggestions: 8,
  search: async (query, trigger) => {
    if (trigger !== '@') return [];
    if (!query.trim()) return [];

    const res = await fetch(`/api/users/typeahead?q=${encodeURIComponent(query)}&limit=8`);
    if (!res.ok) return [];

    const json = await res.json();
    return (json.items || []).map((u: any) => ({
      id: String(u.id),
      label: String(u.name),
      meta: String(u.email || ''),
      value: `@${u.username}`,
    }));
  },
});
```

## API Typeahead (Optional)

Static `items` remain the default. For database-backed typeahead, pass `api`:

```ts
import { MentionPlugin } from '@editora/mentions';

const mentions = MentionPlugin({
  minChars: 2,
  maxSuggestions: 10,
  api: {
    url: '/api/users/search',
    method: 'GET',
    headers: () => ({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    }),
    queryParam: 'q',
    limitParam: 'limit',
    staticParams: { status: 'active' },
    debounceMs: 220,
    timeoutMs: 8000,
    responsePath: 'data.items',
    mapItem: (raw) => ({
      id: String((raw as any).id),
      label: String((raw as any).name),
      meta: String((raw as any).email || ''),
    }),
    onError: (error) => {
      console.error('Mention API failed', error);
    },
  },
});
```

For full control, use `api.buildRequest(ctx)` and/or `api.transformResponse(response, ctx)`.

## Usage Scenarios

### Scenario 1: Static Team Directory

Best for small fixed lists (for example internal users loaded at boot).

```ts
MentionPlugin({
  items: [
    { id: 'john.doe', label: 'John Doe', meta: 'Engineering' },
    { id: 'sarah.lee', label: 'Sarah Lee', meta: 'Product' },
  ],
});
```

### Scenario 2: Client-side Search Over Preloaded Data

Best when you preload a large list once, then filter in memory.

```ts
const users = await loadUsersOnce();

MentionPlugin({
  search: (query) => {
    const q = query.toLowerCase();
    return users
      .filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .slice(0, 10)
      .map((u) => ({ id: u.id, label: u.name, meta: u.email }));
  },
});
```

### Scenario 3: Server Typeahead via Search Callback

Best when you need custom auth, request cancellation strategy, or merged data from multiple APIs.

```ts
MentionPlugin({
  search: async (query, trigger) => {
    const [users, teams] = await Promise.all([
      fetch(`/api/users?q=${encodeURIComponent(query)}&trigger=${trigger}`).then((r) => r.json()),
      fetch(`/api/teams?q=${encodeURIComponent(query)}&trigger=${trigger}`).then((r) => r.json()),
    ]);

    return [
      ...(users.items || []).map((u: any) => ({ id: `u:${u.id}`, label: u.name, meta: 'User' })),
      ...(teams.items || []).map((t: any) => ({ id: `t:${t.id}`, label: t.name, meta: 'Team' })),
    ].slice(0, 10);
  },
});
```

### Scenario 4: Declarative API Configuration

Best when you want less custom code and standardized request behavior.

```ts
MentionPlugin({
  api: {
    url: '/api/users/search',
    method: 'GET',
    queryParam: 'q',
    limitParam: 'limit',
    responsePath: 'data.items',
    mapItem: (raw) => ({
      id: String((raw as any).id),
      label: String((raw as any).name),
    }),
  },
});
```

### Scenario 5: Multiple Trigger Characters

Use different mention patterns in one editor (`@` users, `#` tags, etc).

```ts
MentionPlugin({
  triggerChars: ['@', '#'],
  search: async (query, trigger) => {
    if (trigger === '@') {
      const r = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
      const j = await r.json();
      return (j.items || []).map((u: any) => ({ id: u.id, label: u.name, meta: 'User' }));
    }

    const r = await fetch(`/api/tags?q=${encodeURIComponent(query)}`);
    const j = await r.json();
    return (j.items || []).map((t: any) => ({ id: t.id, label: t.name, meta: 'Tag' }));
  },
});
```

### API Request Customization

`MentionApiConfig` supports full request control:

- `url`: API endpoint.
- `method`: HTTP method (`GET`, `POST`, `PUT`, `PATCH`, `HEAD`, etc).
- `headers`: static headers object or `(ctx) => headers`.
- `credentials`, `mode`, `cache`: forwarded to `fetch`.
- `queryParam`, `triggerParam`, `limitParam`: query/body field names.
- `staticParams`: additional static parameters.
- `body`: static body or `(ctx) => body` for non-GET/HEAD calls.
- `buildRequest`: full low-level override. If provided, it takes priority.
- `responseType`: `json` (default) or `text`.
- `responsePath`: dotted path in response payload (for example `data.items`).
- `mapItem`: convert one raw API record into a `MentionItem`.
- `transformResponse`: convert whole payload into `MentionItem[]`.
- `debounceMs`: debounce query calls.
- `timeoutMs`: request timeout before abort.
- `onError`: centralized request error hook.

Example with full `buildRequest` control:

```ts
const mentions = MentionPlugin({
  api: {
    buildRequest: (ctx) => ({
      url: "/api/v2/users/typeahead",
      init: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          search: ctx.query,
          trigger: ctx.trigger,
          pageSize: ctx.limit,
          includeInactive: false,
        }),
      },
    }),
    transformResponse: (response) => {
      const rows = (response as any)?.results ?? [];
      return rows.map((row: any) => ({
        id: String(row.userId),
        label: String(row.displayName),
        meta: String(row.email || ""),
        value: `@${row.username}`,
      }));
    },
  },
});
```

## Options

- `triggerChars?: string[]`
- `minChars?: number`
- `maxQueryLength?: number`
- `maxSuggestions?: number`
- `items?: MentionItem[]`
- `api?: MentionApiConfig`
- `search?: (query, trigger) => MentionItem[] | Promise<MentionItem[]>`
- `itemRenderer?: (item, query) => string`
- `emptyStateText?: string`
- `noResultsText?: string`
- `loadingText?: string`
- `insertSpaceAfterMention?: boolean`

## Security Note

If you provide `itemRenderer`, return trusted HTML only.

<h1 align="center">@editora/toast</h1>

<p align="center">
  Toast notifications with no dependencies and nothing to mount: call <code>toast.success('Saved')</code> from
  anywhere. Status icons, a stack that opens on hover, promise toasts, actions, progress, light and dark, keyboard access.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/toast"><img src="https://img.shields.io/npm/v/@editora/toast.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/toast"><img src="https://img.shields.io/npm/dm/@editora/toast.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/toast.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/toast"><img src="https://img.shields.io/npm/types/@editora/toast.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem.netlify.app/toast-demo.html">Live demo</a> ·
  <a href="https://editora-ecosystem-storybook.netlify.app/">Storybook</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/themes.png" alt="Eleven toasts stacked in the top-right corner, one in each of the light, dark, colored, minimal, glass, neon, retro, ocean, forest, sunset and midnight themes" width="440">
</p>

## Features

- **Nothing to mount.** No provider, no container element: the first call creates what it needs. It works from React,
  Vue, plain JavaScript, a service, or an event handler.
- **A modern card.** An opaque, neutral surface with a status icon (a different shape for each level, so colour is
  never the only cue), in light and dark. Dark follows the system, or your app's own `.dark` switch.
- **A stack that opens on hover.** Several toasts fold into a deck, the newest in full; hover it or focus it and it
  opens into a list while the timers wait.
- **Promise toasts.** One toast follows a promise from *loading* to *success* or *error*.
- **Actions and progress**: buttons in the toast, and a progress bar with an optional percentage.
- **Thirteen themes and seven positions**, a queue (three toasts show at once by default), duplicate prevention and
  swipe-to-dismiss.
- **Keyboard and screen readers.** Alt+T jumps to the toasts, Escape dismisses one, errors are announced as alerts and
  the rest politely, and `prefers-reduced-motion` is respected.
- **Small.** 15 KB gzipped plus 5 KB of CSS. No dependencies.
- **Safe on the server.** The package imports in Node and the calls do nothing there, so a call in shared code does not
  break server rendering.
- Written in TypeScript. A script tag works too (a UMD build).

## Install

```bash
npm install @editora/toast
```

## Quick start

```ts
import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

toast.success('Document saved');
toast.info('A new version is available');
toast.warning('Storage is almost full');
toast.error('Upload failed');
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/levels.png" alt="Three toasts in the bottom-right corner, each with an icon: Document saved with a green check, A new version is available with a blue i and Storage is almost full with an orange warning triangle" width="440">
</p>

Toasts appear in the bottom-right corner and go away after four seconds. Three are visible at once; the rest wait in a
queue (a fourth toast, *Upload failed* above, appears when there is room). With more than one toast showing they fold
into a deck: see [Stacking](#stacking).

`toast` is all you need. Call it with a message for a plain toast, or use `toast.info`, `toast.success`,
`toast.warning`, `toast.error` and `toast.loading`, each taking a message and, if you like, an options object or a
duration in milliseconds. `toast.show`, `toast.promise`, `toast.update`, `toast.dismiss`, `toast.clear` and
`toast.configure` cover the rest. `toastAdvanced` (also exported as `toastPro`) is the same plus groups, plugins and
subscriptions.

## Titles, actions and progress

```ts
import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

// A toast with a title, a description, actions and progress. duration: 0 keeps it until it is dismissed.
const report = toast.show({
  level: 'success',
  title: 'Report ready',
  description: 'Q3-summary.pdf is 2.4 MB',
  actions: [
    { label: 'Open', primary: true, onClick: () => console.log('open') },
    { label: 'Dismiss', onClick: () => report.dismiss() }
  ],
  duration: 0
});

const upload = toast.show({
  level: 'info',
  message: 'Uploading photos',
  progress: { value: 64, showPercentage: true },
  duration: 0
});
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/actions.png" alt="A toast titled Report ready with a description and Open and Dismiss buttons, under a toast that says Uploading photos with a progress bar at 64 percent" width="440">
</p>

`show()` returns the toast: `dismiss()` removes it and `update(options)` changes it. Pressing an action runs its `onClick`
and closes the toast; give the action `dismissOnClick: false` to keep the toast open. The progress bar follows
`update(id, { progress })`.

## Promises and updates

`toast.promise()` shows one toast that becomes the result of a promise, and `update()` changes any toast by id:

```ts
import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

const saveDocument = new Promise<{ name: string }>((resolve) => {
  setTimeout(() => resolve({ name: 'Q3-summary.pdf' }), 1500);
});

// One toast that moves from loading to success or error by itself.
toast.promise(saveDocument, {
  loading: 'Saving document...',
  success: (file) => `Saved ${file.name}`,
  error: (error) => `Could not save: ${error.message}`
});

// Or update a toast yourself.
const sync = toast.loading('Syncing...');
setTimeout(() => {
  toast.update(sync.id, { message: 'Everything is up to date', level: 'success' });
}, 2500);
```

<table>
  <tr>
    <td><img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/promise-loading.png" alt="Two toasts that read Saving document and Syncing, each with a spinner"></td>
    <td><img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/promise-success.png" alt="The same toasts after the promise resolved and the update: Saved Q3-summary.pdf and Everything is up to date, each with a green check"></td>
  </tr>
  <tr>
    <td align="center"><sub>While it works</sub></td>
    <td align="center"><sub>After the promise resolves and the update</sub></td>
  </tr>
</table>

`toast.promise()` returns the promise you gave it, so you can still `await` it. If you only need the message, `success`
and `error` can be plain strings; they can also be options (`{ title, description, actions }`), which replace the
loading text.

## Stacking

```ts
import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

// By default several toasts fold into a deck: the newest in full, the others as edges behind it.
// Hover the deck (or press Alt+T) and it opens into a list; the timers wait while it is open.
toast.success('Document saved');
toast.info('A new version is available');
toast.warning('Storage is almost full');

// Prefer a plain list that is always open?
// toast.configure({ stack: false });
```

<table>
  <tr>
    <td><img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/deck-closed.png" alt="Three toasts folded into a deck: Storage is almost full in front, with the edges of the two older toasts behind it"></td>
    <td><img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/deck-open.png" alt="The same toasts opened into a list, the newest nearest the corner"></td>
  </tr>
  <tr>
    <td align="center"><sub>Folded</sub></td>
    <td align="center"><sub>Hovered or focused</sub></td>
  </tr>
</table>

The newest toast is always the one nearest the edge of the screen. While the deck is open, the timers of its toasts wait,
and a toast that arrives meanwhile waits with them. A toast that is dismissed leaves at once and the others close the gap.
`stack: false` keeps a plain list; `stack: true, expand: true` shows a list that is always open.

On a touch screen a tap opens the deck; a tap elsewhere closes it.

## Icons

```ts
import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

// A list instead of a deck, so all four are visible at once.
toast.configure({ maxVisible: 4, stack: false });

toast.success('Saved');                              // the icon of the level
toast('Copied to clipboard');                        // no level, no icon
toast.info('Invite sent', { icon: '✉️' });           // your own: text, an emoji or a DOM node
toast.error('Payment failed', { icon: false });      // none

// Or switch the built-in icons off everywhere:
// toast.configure({ icons: false });
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/icons.png" alt="Four toasts: Saved with a green check, Copied to clipboard without an icon, Invite sent with an envelope emoji and Payment failed without an icon" width="440">
</p>

The built-in icons are drawn in SVG from the level's colour (`--et-success`, `--et-error`, ...) and are hidden from screen
readers; the message carries the meaning. `icon` takes a string (text or an emoji), a DOM node, or `false`.

## In React, and in any framework

There is nothing to render. Call `toast` from a handler, an effect or a service:

```tsx
import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

async function saveDraft() {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { name: 'draft.md' };
}

// There is nothing to mount: call toast from any handler or effect.
export default function SaveButton() {
  return (
    <button
      onClick={() =>
        toast.promise(saveDraft(), {
          loading: 'Saving...',
          success: (file) => `Saved ${file.name}`,
          error: 'Could not save'
        })
      }
    >
      Save
    </button>
  );
}
```

[`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react) also has a `ToastProvider` and a `useToast()` hook
if you like a provider.

## From a script tag

The UMD build defines three globals: `toast`, `toastAdvanced` and `toastPro` (the same object as `toastAdvanced`).
Pin a version in production, as here:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/toast@2/dist/toast.css" />
<script src="https://cdn.jsdelivr.net/npm/@editora/toast@2/dist/index.umd.js"></script>

<button id="save">Save</button>

<script>
  document.getElementById('save').onclick = () => {
    // The script defines three globals: toast, toastAdvanced and toastPro (the same object as toastAdvanced).
    toast.success('Saved from a CDN');

    const notification = toastAdvanced.show({
      message: 'File uploaded',
      level: 'success',
      actions: [
        { label: 'View', onClick: () => console.log('view') },
        { label: 'Dismiss', onClick: () => notification.dismiss() }
      ],
      duration: 0
    });
  };
</script>
```

## Configure it

`configure()` sets the defaults for every toast from then on. A single toast can still override them:

```ts
import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

// Settings for every toast from now on. A toast can still override them.
toast.configure({
  position: 'top-center',
  duration: 6000,
  maxVisible: 3,
  theme: 'ocean',
  closeButton: true,
  preventDuplicate: true
});

toast.info('Welcome back');
toast.info('Welcome back'); // the duplicate is dropped
toast.warning('Your plan renews tomorrow', { theme: 'sunset', duration: 0 });
```

| Setting | Default | |
| --- | --- | --- |
| `position` | `'bottom-right'` | Where toasts appear (see [Positions](#positions)). |
| `duration` | `4000` | How long a toast stays, in milliseconds. `0` keeps it until it is dismissed. |
| `maxVisible` | `3` | How many show at once; the others wait in the queue. (`visibleToasts` is an alias.) |
| `queueStrategy` | `'fifo'` | `'fifo'` or `'lifo'`: which waiting toast comes next. |
| `theme` | `'system'` | One of the [themes](#themes). |
| `closeButton` | `false` | Show a close button on every toast. |
| `icons` | `true` | Show the built-in status icons. |
| `preventDuplicate` | `false` | Drop a toast whose content is already showing. With `dedupeScope`: `'visible'`, `'queue'` or `'all'` (the default). |
| `stack`, `expand`, `gap` | `true`, `false`, `8` | A deck that opens on hover (`stack`), a list that is always open (`expand`, or `stack: false`), and the gap between toasts. |
| `pauseOnHover`, `pauseOnFocus`, `pauseOnWindowBlur` | `true`, `true`, `false` | Hold the timers while the pointer is over the stack, a toast has keyboard focus, or the window is in the background. The time that was left is kept. |
| `hotkey` | `'alt+t'` | A shortcut that moves focus to the toasts, for example `'ctrl+shift+k'`; `false` turns it off. |
| `swipeDismiss`, `swipeDirection`, `dragDismiss` | `true`, `'any'`, `false` | Dismiss by swiping, in which direction, and by dragging. |
| `offset`, `mobileOffset`, `zIndex` | `16`, `16`, none | The distance from the edge of the screen, on desktop and on mobile, and the stacking order. |
| `rtl` | `false` | Right-to-left layout. |
| `richColors` | `false` | Tint each toast with the colour of its level. |
| `container` | the page body | The element toasts are added to. |

`toast.getConfig()` (on `toastAdvanced`) returns the current settings.

## Themes

`light`, `dark`, `system`, `colored`, `minimal`, `glass`, `neon`, `retro`, `ocean`, `forest`, `sunset`, `midnight` and
`custom`. Set one for all toasts with `configure({ theme })`, or for one toast with `{ theme }`:

```ts
import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

// A deck would fold these into one; stack: false keeps them in a list.
toast.configure({ position: 'top-right', maxVisible: 12, stack: false, gap: 8 });

const themes = [
  'light', 'dark', 'colored', 'minimal', 'glass', 'neon', 'retro', 'ocean', 'forest', 'sunset', 'midnight'
] as const;

for (const theme of themes) {
  toast.info(`The ${theme} theme`, { theme, duration: 0 });
}
```

The picture at the top of this page is that code. `system` (the default) follows the operating system's light or dark
setting, and your app's own switch: a `dark` class, or `data-theme="dark"`, `data-bs-theme="dark"`,
`data-color-scheme="dark"` or `data-mantine-color-scheme="dark"` on the `<html>` element (and `light` for an app that is
light while the system is dark). Each toast carries `data-theme` and level classes (`editora-toast-info`, ...).

A theme is a set of CSS variables, so you can make your own with a few lines (the `custom` theme leaves the colours to you):

```css
.editora-toast[data-theme="custom"] {
  --et-bg: #fffbeb;
  --et-text: #292524;
  --et-text-muted: #78716c;
  --et-border: #fcd34d;
  --et-success: #15803d; /* the colour of the success icon; also --et-error, --et-warning, --et-info, --et-loading */
  --et-radius: 16px;
}
```

`--et-width`, `--et-font`, `--et-shadow`, `--et-action-bg` and `--et-action-ink` (the primary button) are variables too.

## Positions

`top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` and `center`:

```ts
import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

toast.configure({ maxVisible: 10 });

const positions = [
  'top-left', 'top-center', 'top-right',
  'bottom-left', 'bottom-center', 'bottom-right',
  'center'
] as const;

for (const position of positions) {
  toast.success(position, { position, duration: 0 });
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/positions.png" alt="Seven toasts on a page: one at each corner, one at the top centre, one at the bottom centre and one in the middle" width="900">
</p>

## Toast options

Everything `show()` accepts. All of it is optional except a message (or a title):

| Option | |
| --- | --- |
| `message`, `title`, `description` | The text. |
| `level` | `'info'`, `'success'`, `'warning'`, `'error'` or `'loading'`. |
| `icon` | Your own icon: a string (text or an emoji) or a DOM node; `false` for none. Left out, the level's icon. |
| `actions`, `action`, `cancel` | Buttons: `{ label, onClick, primary?, dismissOnClick? }`. |
| `progress` | `{ value, showPercentage? }`, with `value` from 0 to 100. |
| `duration`, `persistent` | How long it stays (`0`, or `persistent: true`, keeps it until dismissed). |
| `position`, `theme`, `customClass`, `rtl` | Where it appears and how it looks. |
| `closable` / `closeButton` | Show a close button. |
| `html` | Render `message` as HTML. Only inline formatting, lists and safe links are kept. |
| `render` | Build the toast yourself: `(toast) => HTMLElement`. |
| `priority`, `important` | Show higher priorities first; `important` also pushes lower-priority toasts out. |
| `preventDuplicate`, `dedupeKey`, `dedupeScope` | Drop duplicates, by content or by your own key. |
| `pauseOnHover`, `pauseOnFocus`, `swipeDismiss`, `swipeDirection`, `dragDismiss` | Behaviour; see the [settings](#configure-it). |
| `role`, `ariaLive` | Override the announcement (see [Accessibility](#accessibility)). |
| `group` | The id of a group the toast belongs to. |
| `animation` | Animation settings (a CSS animation by default; spring and other types are available). |
| `onShow`, `onHide`, `onUpdate` | Lifecycle callbacks. |

## Accessibility

Toasts live in a region that is announced politely. An **error** toast is a `role="alert"` with `aria-live="assertive"`,
so a screen reader interrupts to read it; every other level is `role="status"` with `aria-live="polite"`. The close button
is labelled "Close notification", and the icons are decorative (a different shape for each level, so a toast is not told
apart by colour alone). Override the announcement of one toast with `role` and `ariaLive`.

**Keyboard.** Every toast is a Tab stop, so its buttons can be reached before it goes away. **Alt+T** (`hotkey`) moves
focus to the newest toast and opens the stack; **Escape** dismisses the focused toast and moves on to the next one, or back
to where you were. While a toast has keyboard focus, or the pointer is over the stack, the timers wait. With
`prefers-reduced-motion` the toasts fade instead of sliding.

## API

`toast`:

| Method | |
| --- | --- |
| `toast(message, options?)` | A plain toast, with no level and no icon. |
| `info`, `success`, `warning`, `error`, `loading` `(message, options?)` | A toast of that level. |
| `show(options)` | Show a toast from full options; returns `{ id, options, dismiss(), update(options) }`. |
| `promise(promise, { loading, success, error })` | A toast that follows a promise (also `onSuccess` and `onError`); resolves with the promise's value. |
| `update(id, options)` | Change a toast. |
| `dismiss(id?)` / `clear()` | Remove one toast, or (with no id) every toast. |
| `configure(settings)` | Set the [settings](#configure-it). |

`toastAdvanced` (`toastPro`) has all of those and more:

| Method | |
| --- | --- |
| `group(id, options)` | Show a toast that belongs to a group. |
| `getConfig()` | Read the settings. |
| `getToasts()` / `getGroups()` / `getState()` | The toasts, the groups, or both with the queue and the settings. |
| `subscribe(listener)` | Call `listener(state)` when the toasts change; returns an unsubscribe function. |
| `use(plugin)` | Install a plugin: `{ name, install(manager), uninstall? }`. |
| `onEditorEvent(event, callback)` / `triggerEditorEvent(event, toast, ...args)` | Connect toasts to your editor's events. |
| `destroy()` | Remove every toast and the toast region. |

The classes and types are exported too: `ToastManager`, and `ToastOptions`, `ToastConfig`, `ToastInstance`,
`ToastPosition`, `ToastTheme`, `ToastPromiseOptions` and more. If you are upgrading from 1.x, see the
[migration guide](https://github.com/ajaykr089/Editora/blob/main/packages/editora-toast/MIGRATION_GUIDE.md).

## Upgrading from 2.0

2.1 changes how toasts look and where they sit; nothing was removed.

- **The look.** The card is opaque and neutral, with a status icon, instead of a see-through tint with a coloured stripe
  (the page showed through the text). The `dark` theme is dark (it was a white card), and the primary button is readable in
  dark mode. `richColors` gives the tinted card back. `configure({ icons: false })` removes the icons.
- **Stacking.** Several toasts fold into a deck by default, and the newest toast is nearest the edge of the screen (it
  used to be farthest). To get a plain list: `configure({ stack: false })`.
- **Timers.** Hovering or focusing the stack holds every toast and keeps the time that was left; before, each toast was
  held on its own and started again from the full duration.
- **Keyboard.** Toasts are Tab stops, Alt+T and Escape work, and `pauseOnFocus` is on. `configure({ hotkey: false })` turns the shortcut off.
- **The simple API** gained `toast(message)`, `promise`, `update`, `dismiss`, `clear`, `configure` and `show`.
- **Browsers.** The layout uses the individual `translate` and `scale` properties: Chrome 104, Safari 14.1, Firefox 72 or later.
- If you styled toasts with CSS, the accent stripe (`::before`) and the tinted `background` of the level classes are gone: set
  `--et-*` variables or `--et-accent`, or restyle `.editora-toast`.

## Part of Editora

[`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react) depends on this package.

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)

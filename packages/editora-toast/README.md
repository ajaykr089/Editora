<h1 align="center">@editora/toast</h1>

<p align="center">
  Toast notifications with no dependencies and nothing to mount: call <code>toast.success('Saved')</code> from
  anywhere. Promise toasts, actions, progress, thirteen themes, seven positions and screen-reader announcements.
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
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/themes.png" alt="Ten toasts stacked in the top-right corner, one in each of the light, colored, minimal, glass, neon, retro, ocean, forest, sunset and midnight themes" width="440">
</p>

## Features

- **Nothing to mount.** No provider, no container element: the first call creates what it needs. It works from React,
  Vue, plain JavaScript, a service, or an event handler.
- **Promise toasts.** One toast follows a promise from *loading* to *success* or *error*.
- **Actions and progress**: buttons in the toast, and a progress bar with an optional percentage.
- **Thirteen themes and seven positions**, a queue (three toasts show at once by default), duplicate prevention and
  swipe-to-dismiss.
- **Accessible.** Errors are announced as alerts, the rest politely, and a close button is labelled.
- **Small.** 9 KB gzipped, plus 6 KB of CSS. No dependencies.
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
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/levels.png" alt="Three toasts in the bottom-right corner: Document saved in green, A new version is available in blue and Storage is almost full in orange" width="440">
</p>

Toasts appear in the bottom-right corner and go away after four seconds. Three are visible at once; the rest wait in a
queue (a fourth toast, *Upload failed* above, appears when there is room).

`toast` is the simple API: `toast.info`, `toast.success`, `toast.warning`, `toast.error` and `toast.loading`, each taking
a message and, if you like, an options object or a duration in milliseconds. For everything else there is
`toastAdvanced` (also exported as `toastPro`).

## Titles, actions and progress

```ts
import { toastAdvanced as toast } from '@editora/toast';
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
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/actions.png" alt="A toast titled Report ready with a description and Open and Dismiss buttons, under a toast that says Uploading photos" width="440">
</p>

`show()` returns the toast: `dismiss()` removes it and `update(options)` changes it. Pressing an action runs its `onClick`
and closes the toast; give the action `dismissOnClick: false` to keep the toast open.

## Promises and updates

`toast.promise()` shows one toast that becomes the result of a promise, and `update()` changes any toast by id:

```ts
import { toastAdvanced as toast } from '@editora/toast';
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
    <td><img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/promise-loading.png" alt="Two toasts that read Saving document and Syncing"></td>
    <td><img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/editora-toast/docs/images/promise-success.png" alt="The same toasts after the promise resolved and the update: Saved Q3-summary.pdf and Everything is up to date"></td>
  </tr>
  <tr>
    <td align="center"><sub>While it works</sub></td>
    <td align="center"><sub>After the promise resolves and the update</sub></td>
  </tr>
</table>

`toast.promise()` returns the promise you gave it, so you can still `await` it. If you only need the message, `success`
and `error` can be plain strings.

## In React, and in any framework

There is nothing to render. Call `toast` from a handler, an effect or a service:

```tsx
import { toastAdvanced as toast } from '@editora/toast';
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
import { toastAdvanced as toast } from '@editora/toast';
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
| `preventDuplicate` | `false` | Drop a toast whose content is already showing. With `dedupeScope`: `'visible'`, `'queue'` or `'all'` (the default). |
| `pauseOnHover`, `pauseOnFocus`, `pauseOnWindowBlur` | `true`, `false`, `false` | Pause the timer while the pointer is over a toast, a toast has focus, or the window is in the background. |
| `swipeDismiss`, `swipeDirection`, `dragDismiss` | `true`, `'any'`, `false` | Dismiss by swiping, in which direction, and by dragging. |
| `stack`, `expand`, `gap` | `false`, `true`, `8` | How several visible toasts are laid out, and the gap between them. |
| `offset`, `mobileOffset`, `zIndex` | `16`, `16`, none | The distance from the edge of the screen, on desktop and on mobile, and the stacking order. |
| `rtl` | `false` | Right-to-left layout. |
| `richColors` | `false` | Richer colours for the levels. |
| `container` | the page body | The element toasts are added to. |

`toast.getConfig()` returns the current settings.

## Themes

`light`, `dark`, `system`, `colored`, `minimal`, `glass`, `neon`, `retro`, `ocean`, `forest`, `sunset`, `midnight` and
`custom`. Set one for all toasts with `configure({ theme })`, or for one toast with `{ theme }`:

```ts
import { toastAdvanced as toast } from '@editora/toast';
import '@editora/toast/toast.css';

toast.configure({ position: 'top-right', maxVisible: 10, gap: 8 });

const themes = [
  'light', 'colored', 'minimal', 'glass', 'neon', 'retro', 'ocean', 'forest', 'sunset', 'midnight'
] as const;

for (const theme of themes) {
  toast.info(`The ${theme} theme`, { theme, duration: 0 });
}
```

The picture at the top of this page is that code. `system` (the default) follows the operating system's light or
dark setting. Each toast carries `data-theme` and level classes (`editora-toast-info`, ...), so you can restyle the
themes with CSS.

## Positions

`top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` and `center`:

```ts
import { toastAdvanced as toast } from '@editora/toast';
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
| `icon` | An icon, as a string. |
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
is labelled "Close notification". Override the announcement of one toast with `role` and `ariaLive`. Actions are buttons,
so a keyboard can reach them, and `pauseOnFocus` pauses the timer while a toast has focus.

## API

`toastAdvanced` (`toastPro`):

| Method | |
| --- | --- |
| `show(options)` | Show a toast; returns `{ id, options, dismiss(), update(options) }`. |
| `info`, `success`, `warning`, `error`, `loading` `(message, options?)` | Shorthands for `show`. |
| `update(id, options)` / `dismiss(id)` / `clear()` | Change, remove or remove every toast. |
| `promise(promise, { loading, success, error })` | A toast that follows a promise; also `onSuccess` and `onError` callbacks. |
| `group(id, options)` | Show a toast that belongs to a group. |
| `configure(settings)` / `getConfig()` | Set and read the [settings](#configure-it). |
| `getToasts()` / `getGroups()` / `getState()` | The toasts, the groups, or both with the queue and the settings. |
| `subscribe(listener)` | Call `listener(state)` when the toasts change; returns an unsubscribe function. |
| `use(plugin)` | Install a plugin: `{ name, install(manager), uninstall? }`. |
| `onEditorEvent(event, callback)` / `triggerEditorEvent(event, toast, ...args)` | Connect toasts to your editor's events. |
| `destroy()` | Remove every toast and the toast region. |

The classes and types are exported too: `ToastManager`, and `ToastOptions`, `ToastConfig`, `ToastInstance`,
`ToastPosition`, `ToastTheme`, `ToastPromiseOptions` and more. If you are upgrading from 1.x, see the
[migration guide](https://github.com/ajaykr089/Editora/blob/main/packages/editora-toast/MIGRATION_GUIDE.md).

## Part of Editora

[`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react) depends on this package.

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)

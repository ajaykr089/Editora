<h1 align="center">@editora/cli</h1>

<p align="center">
  Add Editora to a project with one command. <code>npx @editora/cli add editor</code> installs the rich text editor,
  <code>add toast</code> the notifications, <code>add data-table</code> a component. It picks the packages and runs
  your package manager.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/cli"><img src="https://img.shields.io/npm/v/@editora/cli.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/cli"><img src="https://img.shields.io/npm/dm/@editora/cli.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/cli.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/cli"><img src="https://img.shields.io/node/v/@editora/cli.svg" alt="Node.js version"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem.netlify.app/docs/reference/cli">Documentation</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/cli/docs/images/add.png" alt="A terminal running npx @editora/cli add editor --dry-run, which prints that it will run npm install @editora/react @editora/plugins @editora/themes, and the same for add button modal toast, which installs @editora/ui-react and @editora/toast" width="760">
</p>

## What it does

`editora add` turns a name you know, such as `editor` or `button`, into the packages behind it and installs them with
npm, pnpm, yarn or bun. That is all it does: it does not create files, change your configuration or write code, so what
changes in your project is what your package manager changes (`package.json`, the lock file, `node_modules`).

- **One command, several packages.** `add editor` installs three, `add all` seven.
- **Look before you install.** `--dry-run` prints the command and stops.
- **Your package manager.** npm, pnpm, yarn or bun, detected or chosen with a flag.
- **No dependencies.** It needs Node.js 16 or later.

## Quick start

```bash
npx @editora/cli add editor
```

Add `--dry-run` to see what it would run without installing anything:

```text
$ npx @editora/cli add editor --dry-run
Editora add targets: editor
- editor: Rich text editor stack for React

Installing with npm: npm install @editora/react @editora/plugins @editora/themes

Dry run enabled. No packages were installed.
```

To use it as a command, install it once and run `editora`:

```bash
npm install -g @editora/cli
editora add editor
```

## What you can add

| You type | It installs | Then read |
| --- | --- | --- |
| `editor` | `@editora/react`, `@editora/plugins`, `@editora/themes` | [`@editora/react`](https://www.npmjs.com/package/@editora/react) |
| `toast` | `@editora/toast` | [`@editora/toast`](https://www.npmjs.com/package/@editora/toast) |
| `react-icons` | `@editora/react-icons` | [`@editora/react-icons`](https://www.npmjs.com/package/@editora/react-icons) |
| `light-code-editor` | `@editora/light-code-editor` | [`@editora/light-code-editor`](https://www.npmjs.com/package/@editora/light-code-editor) |
| `button`, `data-table`, `tabs`, `modal`, ... | `@editora/ui-react` | [`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react) |
| `all` | all of the above | |

The last two rows are the components of [`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react): every
component it exports can be added by name, written the way you like (`data-table`, `datatable` and `DataTable` are the
same). A leading `ui-` is allowed, so `ui-select` is `select`. Parts of a compound component, such as `AlertTitle`, come
with the component they belong to. `modal` is a name for `Dialog` and installs the same package.

Two names are not what they seem. `toast` is the notification package, `@editora/toast`, and `ui-toast` is the toast
component of `@editora/ui-react`. And `editor` installs the packages, but you still need `react` and `react-dom` in your
project, and `@editora/core`, which `@editora/react` lists as a peer dependency: npm 7 and later install it for you, and
with a package manager that does not, add it yourself.

## Several at once

Give as many names as you like. The packages are installed with one command, and a package that two names share is
installed once:

```text
$ npx @editora/cli add button modal toast --dry-run
Editora add targets: button, modal, toast
- button: UI component (button) from @editora/ui-react
- modal: Use Dialog from @editora/ui-react as modal primitive
- toast: Notification runtime

Installing with npm: npm install @editora/ui-react @editora/toast

Dry run enabled. No packages were installed.
```

## Choose the package manager

The CLI uses the package manager that started it: `npm_config_user_agent`, which npm, pnpm, yarn and bun set for the
commands they run. Run through `npx`, or on its own after `npm install -g`, that is npm. It does not read your lock
file, so in a project that uses pnpm, yarn or bun, start it with that tool (`pnpm dlx @editora/cli add editor`,
`yarn dlx`, `bunx`) or say which one you want:

```bash
npx @editora/cli add button --package-manager pnpm
npx @editora/cli add button --package-manager=yarn
npx @editora/cli add button --package-manager bun
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/cli/docs/images/package-managers.png" alt="A terminal running add button --dry-run with each package manager: npm install, pnpm add, yarn add and bun add, followed by deno, which is refused with Unsupported package manager: deno" width="760">
</p>

## When something is wrong

A name it does not know prints what is supported and exits with status 1. A missing name, an unknown option or an unknown
command print the usage text and exit with status 1 too.

```text
$ npx @editora/cli add floating-ui
Unknown feature(s): floating-ui
Supported:
- all exported @editora/ui-react component names
- special: all, card, editor, light-code-editor, modal, react-icons, toast, ui-components, ui-react
```

An unsupported package manager does the same:

```text
$ npx @editora/cli add button --package-manager deno
Unsupported package manager: deno
```

If the package manager is not installed, the CLI says so and exits with status 1. If the install itself fails, the exit
status is the package manager's own, so a script or a CI job stops where the install did.

```bash
npx @editora/cli --help      # the usage text
npx @editora/cli --version   # the version of the CLI
```

## Use it from code

The helpers behind the command are exported, for a script that wants to know what a name installs. They are plain
JavaScript with no type declarations, for `require` and `import` alike.

```js
const { resolveTarget, installCommand } = require('@editora/cli');

const target = resolveTarget('data-table');
console.log(target.canonicalName, target.entry.packages);
console.log(installCommand('pnpm', target.entry.packages));
```

```text
data-table [ '@editora/ui-react' ]
[ 'pnpm', [ 'add', '@editora/ui-react' ] ]
```

`resolveTarget(name)` returns `null` for a name it does not know. The module also exports `run(argv)`, which does what
the command does and returns the exit status, `parseArgs`, `detectPackageManager`, `getVersion`, `formatHelpText`, the
list `uiReactComponents` and the table `specialRegistry`.

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)

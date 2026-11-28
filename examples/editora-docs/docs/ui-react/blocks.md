---
title: "Blocks"
description: "Ready-made page sections (sign-in, profile settings, dashboard, app shell, chat) to copy into your app and edit."
sidebar_label: "Blocks"
---

# Blocks

Blocks are whole page sections built from `@editora/ui-react` components. You copy one into your project and it becomes your code: change the layout, the copy, the fields.

```bash
npx @editora/cli add block-login
```

```text
Copied block-login into src/components/editora
  + src/components/editora/blocks/block-login.tsx
They need @editora/ui-react: npm install @editora/ui-react
Use it: import { LoginBlock } from './src/components/editora/blocks/block-login';
```

| Block | What it is | Component |
| --- | --- | --- |
| `block-login` | A sign-in card: email and password, remember me, Google and GitHub buttons, links to sign up and reset. `onSubmit`, `onProvider`, `error`. | `LoginBlock` |
| `block-settings-profile` | A profile page: avatar, name, email, bio, time zone, a preference switch, and the account details as a data list. `defaultValues`, `onSave`. | `SettingsProfileBlock` |
| `block-dashboard` | An overview: four metric cards, a revenue chart and recent activity. `metrics`, `revenue`, `activity`. | `DashboardBlock` |
| `block-app-shell` | A layout: side navigation (a drawer below 768px, opened from the header), header and main region, with landmarks and a skip link. `title`, `nav`, `current`, `user`, `children`. | `AppShellBlock` |
| `block-chat` | A chat: the transcript (follows streamed answers, anchors each question) and a composer with attachments; Enter sends, Shift+Enter adds a line. `messages`, `streaming`, `onSend`, `height`. | `ChatBlock` |

Each block is one file with no dependencies besides `react` and `@editora/ui-react`, works in light and dark themes, and is axe-clean. Add `--js` for a `.jsx` file instead of TypeScript, and `--dir` to put it somewhere else. Running the command again updates a block you have not changed and keeps one you have (see [CLI](../reference/cli)).

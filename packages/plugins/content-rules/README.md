# @editora/content-rules

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


`@editora/content-rules` adds native content governance checks to Editora (required sections, banned words, readability, and sentence-length rules).

## Features

- Native framework-agnostic plugin (no framework dependency)
- Works in React (Vite/CRA) and Web Component without modification
- Realtime debounced auditing for performance
- Rule checks included out of the box:
  - banned words
  - required headings/sections
  - maximum sentence length
  - readability threshold (Flesch-style score)
- Accessible rules panel (`role="dialog"`, keyboard navigation, `aria-live` updates)
- Multi-instance safe (state isolated per editor)
- Light/dark theme support
- Extensible via custom rule callbacks

## Install

```bash
npm install @editora/content-rules
```

## Basic Usage (React)

```tsx
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ContentRulesPlugin } from '@editora/plugins';

const plugins = [
  BoldPlugin(),
  HistoryPlugin(),
  ContentRulesPlugin({
    bannedWords: ['obviously', 'simply'],
    requiredHeadings: ['Summary', 'Risks'],
    maxSentenceWords: 28,
    minReadabilityScore: 58,
    enableRealtime: true,
  }),
];

export default function App() {
  return <EditoraEditor plugins={plugins} />;
}
```

## Basic Usage (Web Component)

```html
<editora-editor id="editor"></editora-editor>
<script>
  const editor = document.getElementById('editor');
  editor.setConfig({
    plugins: 'bold history contentRules',
    toolbar: {
      items: 'bold undo redo | contentRules contentRulesAudit contentRulesRealtime',
    },
    pluginConfig: {
      contentRules: {
        bannedWords: ['obviously', 'simply'],
        requiredHeadings: ['Summary', 'Risks'],
        maxSentenceWords: 28,
      },
    },
  });
</script>
```

Accepted aliases: `contentRules`, `content-rules`, `contentrules`.

## Toolbar Commands

- `toggleContentRulesPanel` -> open/close content rules panel
- `runContentRulesAudit` -> run full audit immediately and open panel
- `toggleContentRulesRealtime` -> toggle realtime auditing
- `getContentRulesIssues` -> emit `editora:content-rules-issues`, cache latest issues on `editor.__contentRulesIssues`, and optionally pass issues to a callback
- `setContentRulesOptions` -> update rule config at runtime

## Keyboard Shortcuts

- `Ctrl/Cmd + Alt + Shift + R` -> open/close content rules panel
- `Ctrl/Cmd + Alt + Shift + L` -> run content rules audit
- `Ctrl/Cmd + Alt + Shift + T` -> toggle realtime auditing
- `Esc` -> close panel when focused

## Advanced Usage

### Add custom rule

```ts
ContentRulesPlugin({
  customRules: [
    {
      id: 'must-include-signoff',
      severity: 'error',
      evaluate({ text }) {
        if (/approved by:/i.test(text)) return [];
        return [
          {
            id: 'must-include-signoff-0',
            ruleId: 'must-include-signoff',
            severity: 'error',
            message: 'Document must include an "Approved by:" line.',
            suggestion: 'Add an approval sign-off section at the end.',
          },
        ];
      },
    },
  ],
});
```

### Update rules at runtime

```ts
(window as any).executeEditorCommand?.('setContentRulesOptions', {
  bannedWords: ['very', 'really'],
  requiredHeadings: ['Overview', 'Decision'],
  minReadabilityScore: 62,
});

(window as any).executeEditorCommand?.('runContentRulesAudit');
```

### Read issues programmatically

```ts
const exec = (window as any).executeEditorCommand;

exec?.('getContentRulesIssues', (issues) => {
  console.log('issues from callback', issues);
});

document.addEventListener('editora:content-rules-issues', (event) => {
  const issues = (event as CustomEvent).detail?.issues || [];
  console.log('issues from event', issues);
});
```

## Edge Cases Covered

- Realtime audits are debounced to avoid re-scanning on every keystroke.
- Repeated snapshots are skipped to avoid duplicate expensive runs.
- Custom rule errors are isolated so built-in checks still run.
- Each editor instance keeps separate options, issues, panel state, and timers.
- Issue locate action gracefully falls back when precise selection cannot be resolved.

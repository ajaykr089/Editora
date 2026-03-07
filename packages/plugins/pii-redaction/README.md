# @editora/pii-redaction

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


`@editora/pii-redaction` detects sensitive data patterns (PII/secrets) and helps redact them before documents are shared, exported, or approved.

## Features

- Native framework-agnostic plugin (no framework dependency)
- Works in React (Vite/CRA) and Web Components without modification
- Built-in detectors: email, phone, SSN, credit card, IPv4, API key, JWT
- Realtime debounced scanning for performance-sensitive typing
- Redact one finding or redact all findings in one command
- Accessible panel (`role="dialog"`, keyboard navigation, `aria-live` updates)
- Light/dark theme support
- Multi-instance safe state (findings, options, panel, timers)

## Install

```bash
npm install @editora/pii-redaction
```

## Basic Usage (React)

```tsx
import { EditoraEditor } from '@editora/react';
import { HistoryPlugin, PIIRedactionPlugin } from '@editora/plugins';

const plugins = [
  HistoryPlugin(),
  PIIRedactionPlugin({
    enableRealtime: true,
    redactionMode: 'token',
    redactionToken: 'REDACTED',
    maxFindings: 120,
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
    plugins: 'history pii-redaction',
    toolbar: {
      items: 'undo redo | piiRedaction piiScan piiRedactAll piiRealtime',
    },
  });
</script>
```

Accepted aliases: `piiRedaction`, `pii-redaction`, `piiredaction`.

## Practical Scenario

### Scenario: Pre-release compliance pass for a customer incident memo

A content team prepares an external incident memo. The draft accidentally includes:

- direct customer email addresses
- internal support phone numbers
- a pasted API key from a debugging note

Before legal approval, the team must detect and redact all sensitive values.

### Suggested flow

1. Open panel: `Ctrl/Cmd + Alt + Shift + I`.
2. Run scan: `Ctrl/Cmd + Alt + Shift + U`.
3. Review findings list (type, severity, detected value, masked preview).
4. Use `Locate` to confirm context.
5. Redact single sensitive values where needed.
6. Run `Redact All` to clear remaining findings.
7. Re-run scan and confirm zero findings before export.

### Why this is useful

- Prevents accidental leakage in docs moving across teams.
- Gives editors a repeatable pre-share safety checkpoint.
- Keeps remediation in-editor without external scripts/tools.

## Step-by-Step Test Scenario (Manual QA)

Use this exact flow to validate behavior quickly in Storybook or your app.

### 1) Seed test content

Paste the content below into an editor instance:

```html
<h2>Incident Draft</h2>
<p>Owner email: incident.owner@acme.com</p>
<p>Escalation phone: +1 (415) 555-0136</p>
<p>Temporary key: sk-ABCDEF1234567890ABCDEF1234567890AB</p>
<p>Session token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Kf7f0Xf7abcABC123zzYY77abcABC123zzYY77</p>
```

### 2) Run the first scan

1. Open panel: `Ctrl/Cmd + Alt + Shift + I`
2. Run scan: `Ctrl/Cmd + Alt + Shift + U`
3. Verify findings appear (email, phone, API key, JWT)

Expected result: findings list and severity summary are visible.

### 3) Validate per-item actions

1. Click `Locate` on one finding
2. Confirm selection jumps to matched content
3. Click `Redact` on that finding

Expected result: one finding is removed/updated, editor content changes, redaction event is emitted.

### 4) Validate redact-all

1. Press `Ctrl/Cmd + Alt + Shift + M`
2. Run scan again

Expected result: zero findings after full redaction.

### 5) Validate realtime toggle

1. Toggle realtime off: `Ctrl/Cmd + Alt + Shift + Y`
2. Type a new email like `qa.user@acme.com`
3. Confirm panel does not auto-refresh immediately
4. Toggle realtime on and type another sensitive value

Expected result: detection resumes only when realtime is on.

### 6) Validate readonly behavior

1. Put editor in readonly mode
2. Attempt `Redact` and `Redact All`

Expected result: redaction actions are blocked and readonly message is shown.

### 7) Validate multi-instance isolation

1. Open two editors (A and B), each with different sensitive content
2. Run scan in A only
3. Redact in A only

Expected result: A state/buttons/findings change; B remains unchanged.

## Toolbar Commands

- `togglePIIRedactionPanel` -> open/close PII panel
- `runPIIScan` -> run immediate scan and refresh findings
- `redactAllPII` -> redact all currently detectable findings
- `redactPIIFinding` -> redact one finding by id
- `togglePIIRealtime` -> enable/disable realtime scanning
- `getPIIRedactionFindings` -> emit `editora:pii-findings`, cache findings on `editor.__piiRedactionFindings`, optional callback
- `setPIIRedactionOptions` -> update detector/options at runtime

## Keyboard Shortcuts

- `Ctrl/Cmd + Alt + Shift + I` -> open/close PII panel
- `Ctrl/Cmd + Alt + Shift + U` -> run PII scan
- `Ctrl/Cmd + Alt + Shift + M` -> redact all findings
- `Ctrl/Cmd + Alt + Shift + Y` -> toggle realtime scan
- `Esc` -> close panel

## Advanced Usage

### Restrict detectors and severity tuning

```ts
PIIRedactionPlugin({
  detectors: {
    email: { enabled: true, severity: 'medium' },
    'api-key': { enabled: true, severity: 'high' },
    jwt: { enabled: true, severity: 'high' },
    ipv4: false, // disable low-risk detector for this doc type
  },
});
```

### Multi-instance React usage (isolated command execution)

```tsx
import { useRef } from 'react';
import { EditoraEditor } from '@editora/react';
import { HistoryPlugin, PIIRedactionPlugin } from '@editora/plugins';

export default function DualEditors() {
  const editorA = useRef<any>(null);
  const editorB = useRef<any>(null);

  return (
    <>
      <EditoraEditor
        plugins={[HistoryPlugin(), PIIRedactionPlugin({ enableRealtime: true })]}
        onInit={(api) => (editorA.current = api)}
      />
      <EditoraEditor
        plugins={[HistoryPlugin(), PIIRedactionPlugin({ enableRealtime: false, redactionMode: 'mask' })]}
        onInit={(api) => (editorB.current = api)}
      />

      <button onClick={() => editorA.current?.execCommand('runPIIScan')}>Scan A</button>
      <button onClick={() => editorB.current?.execCommand('runPIIScan')}>Scan B</button>
    </>
  );
}
```

### Runtime option update

```ts
(window as any).executeEditorCommand?.('setPIIRedactionOptions', {
  enableRealtime: false,
  redactionMode: 'mask',
  maxFindings: 200,
});

(window as any).executeEditorCommand?.('runPIIScan');
```

### Release gate before export/share

```ts
const exec = (window as any).executeEditorCommand;

exec?.('runPIIScan');
exec?.('getPIIRedactionFindings', (findings, stats) => {
  if (stats.total > 0) {
    throw new Error(`Blocked export: ${stats.total} PII findings still present.`);
  }

  // safeExportDocument();
});
```

### Profile switching by document phase

```ts
const exec = (window as any).executeEditorCommand;

// Authoring profile
exec?.('setPIIRedactionOptions', {
  enableRealtime: true,
  redactionMode: 'mask',
  detectors: { ipv4: false },
});

// Pre-release profile
exec?.('setPIIRedactionOptions', {
  enableRealtime: false,
  redactionMode: 'token',
  maxFindings: 300,
  detectors: { ipv4: true, jwt: true, 'api-key': true },
});

exec?.('runPIIScan');
```

### Read findings programmatically

```ts
const exec = (window as any).executeEditorCommand;

exec?.('getPIIRedactionFindings', (findings, stats) => {
  console.log('findings', findings);
  console.log('stats', stats);
});

document.addEventListener('editora:pii-findings', (event) => {
  const detail = (event as CustomEvent).detail;
  console.log('event findings', detail?.findings || []);
});
```

## Edge Cases Covered

- Multi-instance isolation for findings/options/panels/timers
- Debounced realtime scans for large docs
- Snapshot dedupe avoids redundant full rescans
- Credit-card detector uses Luhn validation to reduce false positives
- Mask mode output remains re-scan safe (idempotent redaction behavior)
- Redaction actions are blocked in readonly mode and announced in panel
- Detached editors are cleaned up deterministically (panel/timers/listeners state)
- Panel + listeners are detached cleanly when plugin is destroyed

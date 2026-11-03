# @editora/authorship

Record where every piece of text in your editor came from: **typed** (and by whom), **pasted** (and from which app),
written by **AI** (and which model), added by a **collaborator**, inserted by an **editor tool**, or **changed outside
the editor**. Highlight it, replay how the document was written, and export a record a server can verify.

Works with any `contenteditable` editor, with a ready-made plugin for Editora. No dependencies. Your HTML is never
changed: origins are kept in a separate record that you store next to the content.

```js
import { attachAuthorship } from '@editora/authorship';

const authorship = attachAuthorship(document.querySelector('#editor'), { author: 'Ana', autoStart: true });

// Later: save the record with the document, and show a summary.
save({ html: editor.innerHTML, authorship: authorship.serialize() });
const report = authorship.getReport();
// report.byKind.pasted.share -> 0.31, report.ai -> [{ origin: { model: 'gemma4' }, chars: 47 }], report.activeMs ...
```

## What it records and what it does not

This package records **where text came from**. It does **not** detect cheating, and it does not guess whether text was
written by AI.

- Everything is recorded in the browser. A determined user can fake a log kept only in the browser.
- Logs sent to a **witness** server as the person writes (see below) prove **when** each part of the text existed. They
  do not prove **who physically typed it**: a script can type too.
- Text that changes with no known cause (a browser extension, another script) is labelled `external` rather than guessed.

Use it to show people what is in a document and to label AI or pasted content honestly. Don't use it as proof of
misconduct on its own.

## Privacy

Recording only starts when you call `start()` (or pass `autoStart: true`; the Editora plugin starts on its own because
adding it is the opt-in). The Editora toolbar button shows a red dot and says "recording" while it records. Tell the
people writing that it is on.

By default typing is stored in bursts, not keystroke by keystroke (`timing: 'keystroke'` changes that). The package
sends nothing anywhere unless you configure a witness, and the witness only ever receives hashes, never text.

## Origins

| Kind | When |
| --- | --- |
| `existing` | Text that was there when recording started |
| `typed` | Typing, Enter, autocorrect (keeps the corrected text's origin), IME input |
| `pasted` | Paste or drop from outside. `source` is `word`, `google-docs`, `google-sheets`, `excel`, `libreoffice`, `apple`, `vscode`, `web` or `plain` |
| `ai` | Text inside an element with `data-provenance="ai"`, or announced with `expect({ kind: 'ai', model })` |
| `collaborator` | Remote edits announced by the collaboration plugin (or by you) |
| `tool` | Text the editor's own UI inserted (emoji picker, merge tags, slash menu) with no input event |
| `external` | Anything else |

Moving text keeps its origin: cut and paste, copy and paste between editors on the page, drag and drop, and undo or redo.

### Telling it about inserted text

Tools that insert text themselves can label it either way, without importing this package:

```html
<!-- Any element around inserted text -->
<ins data-provenance="ai" data-provenance-model="gemma4:31b-cloud" data-provenance-provider="ollama">…</ins>
```

```js
// Or announce the next change
import { announceProvenance } from '@editora/authorship';
announceProvenance(editorElement, { kind: 'ai', model: 'gpt-oss:20b' });
// Same thing with no import:
editorElement.dispatchEvent(new CustomEvent('provenance:expect', { detail: { kind: 'ai', model: 'gpt-oss:20b' }, bubbles: true }));
```

[`@editora/ai-review`](../ai-review) marks its suggestions this way, and `@editora/collaboration` announces remote
edits, so accepted AI rewrites and collaborators' text are labelled with no extra code.

## Editora

```js
import { AuthorshipPlugin } from '@editora/authorship/editora';

editor.setConfig({
  plugins: ['bold', 'italic', 'history', AuthorshipPlugin({
    author: currentUser.name,
    state: savedRecord,                       // optional: continue an earlier record
    onReady: (authorship) => (window.authorship = authorship),
  })],
  toolbar: 'undo redo | bold italic | toggleAuthorship',
});
```

The **Authorship** button opens a panel with the share of text from each origin (each one a highlight switch), the
origin of the text at the cursor (announced to screen readers), pastes, AI inserts, writing time, **Replay writing**
and **Export record**. Hovering highlighted text shows where it came from.

Commands: `toggleAuthorship`, `toggleAuthorshipHighlights`, `openAuthorshipReplay`, `startAuthorship`,
`stopAuthorship`, `getAuthorship` (returns the controller).

## Saving and loading

```js
const record = authorship.serialize();             // JSON: origins, runs, text, log
authorship.start(record);                           // after loading the same content again
```

If the content was edited somewhere that did not record authorship, the parts that differ become `external`.
`serialize({ log: false })` leaves out the log (smaller, but no replay or witness check), and
`serialize({ text: false })` leaves out the plain-text copy.

### Exporting with the HTML

```js
import { toAnnotatedHtml, readEmbeddedState, documentSourceType } from '@editora/authorship';

const html = toAnnotatedHtml(editorElement, authorship.serialize(), { embed: true });
// <p>… <span data-provenance="ai" data-provenance-model="gemma4" data-provenance-type="http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia">…</span></p>
// <script type="application/vnd.editora.authorship+json">{…}</script>

const { html: clean, state } = readEmbeddedState(html);
documentSourceType(authorship.getReport()); // …/compositeWithTrainedAlgorithmicMedia when human and AI text are mixed
```

There is no standard for text provenance yet. The `data-provenance-type` values come from the IPTC Digital Source
Type vocabulary, which was built for images and video but is the closest widely used one.

## Replay

```js
import { openReplayView, createReplay } from '@editora/authorship';

const { log, origins } = authorship.serialize();
openReplayView(log, { origins });                   // a dialog: play/pause, scrubber, speed, colour by origin

createReplay(log).at(timestamp).text;               // or rebuild the text at any moment yourself
```

Pauses longer than 1.5 seconds are shortened, so hours of writing play in minutes. Only the text is replayed, not the
formatting.

## Witness server

A witness signs the log as it is written, with its own clock, so later edits to the log are detectable and every part
of the text has a "seen by" time. The browser seals the log into hash-chained batches and sends **only the hashes**.

```js
// Browser
attachAuthorship(element, { author: 'Ana', autoStart: true, witness: { url: '/api/authorship', doc: essay.id } });

// Server (Next.js route, Workers, Deno…)
import { createAuthorshipWitness, verifyWitnessed, toNodeHandler } from '@editora/authorship/server';

export const POST = createAuthorshipWitness({
  secret: process.env.AUTHORSHIP_SECRET,            // 16+ characters, server only
  store,                                            // optional { get(doc), set(doc, receipt) }: refuses a second history
  allowDoc: (doc, request) => canWrite(request, doc),
});
// Node http / Express: app.post('/api/authorship', toNodeHandler(witness))

// Checking a submitted record
const result = await verifyWitnessed(record, { secret: process.env.AUTHORSHIP_SECRET, doc: essay.id });
// { ok, problems: [], replayMatches: true, witnessedEvents: 412, totalEvents: 415, witnessedUntil: 1793706185852 }
```

`verifyWitnessed` checks that the log replays to the saved text, that no event was changed after it was sealed, that
every receipt was signed by your witness, and that no event is dated after the witness saw it. Without a `store`, the
witness is stateless and cannot notice someone building a second history for the same document. Use a store if that
matters to you.

## Headless

The engine runs anywhere (Node, workers) on plain text:

```js
import { AuthorshipEngine, buildReport } from '@editora/authorship';

const engine = new AuthorshipEngine({ author: 'Ana' });
engine.reset('Intro.');
engine.update('Intro. Hello', { cause: 'type', origin: { kind: 'typed', author: 'Ana' } });
buildReport(engine.serialize()).byKind.typed.chars; // 5
```

## Limits

- Highlights use the CSS Custom Highlight API (Chrome/Edge 105+, Safari 17.2+, Firefox 140+), with a positioned
  overlay elsewhere.
- Moving text between browser tabs or apps counts as a paste: origins only travel between editors on the same page.
- A collaborator's own record shows their text as typed. Each person's record shows other people's text as
  `collaborator`, without names. A shared record across collaborators is not built yet.
- In React, the plugin attaches to an editor the first time it is focused or edited (React does not call plugin `init`).

## License

MIT

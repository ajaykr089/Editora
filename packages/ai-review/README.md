# @editora/ai-review

Let an AI rewrite text in your editor **without taking the pen away from the user.** The model's answer streams in as
word-level suggestions (struck-out old text, highlighted new text) that the user accepts or rejects one by one, like
tracked changes. Nothing changes until they say so.

- **Works in any `contenteditable`**: Editora, or your own editor. A headless core works on plain text, in the browser
  or on a server.
- **Keeps formatting.** Only the changed words are touched; bold, links and mentions around them stay as they were.
- **Streams.** Suggestions appear while the model writes; the user can stop it at any time.
- **Safe to review late.** If someone edits a suggestion before deciding, it can only be dismissed, never applied over
  their edit.
- **Free to try, bring your own key, or use your server.** Ollama's cloud models through a local Ollama; any
  OpenAI-compatible API (OpenAI, OpenRouter, Groq, Mistral, DeepSeek, LM Studio...); Claude; or a proxy endpoint that
  keeps keys off the page.
- No runtime dependencies. About 16 kB gzipped.

## Editora

```js
import '@editora/core/webcomponent';
import '@editora/core/webcomponent.css';
import { AIReviewPlugin } from '@editora/ai-review/editora';

const editor = document.querySelector('editora-editor');
editor.setConfig({
  plugins: ['bold', 'italic', 'list', 'history', AIReviewPlugin()],
  toolbar: 'undo redo | bold italic | bullist | openAIReview',
});
```

The **AI** button (or <kbd>Ctrl/⌘ J</kbd>) opens a menu: *Improve writing*, *Fix spelling & grammar*, *Make
shorter*, *Make longer*, *More formal*, *More friendly*, *Simplify*, or anything typed in. It rewrites the selection,
or the paragraph the cursor is in. Accepting and rejecting is one undo step.

Commands: `openAIReview`, `aiRewrite` (value: a preset id or an instruction), `aiReviewAcceptAll`,
`aiReviewRejectAll`, `aiReviewSettings`.

## Any contenteditable

```js
import { attachAIReview } from '@editora/ai-review';

const ai = attachAIReview(document.querySelector('#editor'), {
  onEnd: ({ beforeHTML, afterHTML }) => save(afterHTML),
});

button.addEventListener('click', () => ai.openMenu(button));
// or directly:
await ai.rewrite('Make it friendlier');
```

`ai.current` is the open review (`acceptAll()`, `rejectAll()`, `discard()`, `focusNext()`). While a review is open the
editor's HTML contains `<ins>`/`<del>` marks; to save at that moment use `htmlWithoutSuggestions(element)`.

## Choosing a model

With no `provider`, users get a **Model settings** dialog and the default is Ollama on their own computer.

| Option | Where requests go | Key |
| --- | --- | --- |
| Ollama on this computer | `http://localhost:11434` | none: run `ollama signin` once to use Ollama's free cloud models (`gemma4:31b-cloud`, `gpt-oss:120b-cloud`, `gpt-oss:20b-cloud`, `nemotron-3-nano:30b-cloud`, `nemotron-3-super:cloud`, `nemotron-3-ultra:cloud`) |
| OpenAI-compatible API | straight from the browser to the service | the user's own; kept in `sessionStorage`, or `localStorage` if they tick *Remember* |
| Your server (below) | your endpoint | yours, or the user's forwarded per request |

Fix the provider in code instead:

```js
import { createOllamaProvider, createOpenAICompatibleProvider, createProxyProvider } from '@editora/ai-review';

AIReviewPlugin({ provider: createOllamaProvider({ model: 'gpt-oss:20b-cloud' }) });
AIReviewPlugin({ provider: createOpenAICompatibleProvider({ preset: 'openrouter', apiKey, model: 'your-model' }) });
AIReviewPlugin({ provider: createProxyProvider({ url: '/api/ai-review' }) });
```

A provider is anything with `stream({ system, prompt, signal })` returning an async iterable of text, so you can wrap
any SDK.

### Claude

```js
import Anthropic from '@anthropic-ai/sdk';
import { createAnthropicProvider } from '@editora/ai-review/anthropic';

const provider = createAnthropicProvider({ client: new Anthropic() }); // claude-opus-5-5, effort "low"
```

Use it on your server behind `createAIReviewHandler`. In the browser, only with a key the user typed in:
`new Anthropic({ apiKey, dangerouslyAllowBrowser: true })`. Declined requests are retried on Anthropic's recommended
fallback model (`fallbacks: false` turns that off).

## Your server

ollama.com and most providers do not accept requests from web pages, and you may not want keys in the page at all.
`@editora/ai-review/server` is a small streaming proxy built on the standard `Request`/`Response`:

```js
// app/api/ai-review/route.js (Next.js); also Hono, Bun, Deno, Cloudflare Workers
import { createAIReviewHandler, createOllamaProvider, ollamaCloudProvider } from '@editora/ai-review/server';

export const POST = createAIReviewHandler({
  providers: {
    ollama: ({ model }) => createOllamaProvider({ model }),          // the server's own Ollama
    'ollama-cloud': ollamaCloudProvider(process.env.OLLAMA_API_KEY), // https://ollama.com/settings/keys
  },
  allowedModels: ['gemma4:31b', 'gpt-oss:120b'], // which models a client may ask for
  allowClientKeys: true, // let users bring their own key (sent per request, never stored)
  authorize: (request) => isSignedIn(request),
});
```

Express / `node:http`: `app.post('/api/ai-review', toNodeHandler(handler))`.

Point the editor at it, and list what it offers in the settings dialog:

```js
AIReviewPlugin({
  userSettings: {
    proxy: {
      url: '/api/ai-review',
      providers: [{ id: 'ollama-cloud', label: 'Ollama Cloud (your key)', needsKey: true, models: ['gemma4:31b', 'gpt-oss:120b'] }],
    },
  },
});
```

## Headless

```js
import { AIReview, runRewrite, createOllamaProvider } from '@editora/ai-review';

const review = new AIReview(['Me and him goes to school.']);
review.subscribe((snapshot) => render(snapshot.hunks)); // { id, block, start, end, deleted, inserted, status, provisional }
await runRewrite({ provider: createOllamaProvider(), review, instruction: 'Fix grammar' });
review.accept(review.hunks[0].id);
review.resolve(); // ['He and I go to school.']
```

`diffText(a, b)` gives the word-level changes on their own.

## Details

- The model is asked to keep the paragraph count. If it does not, the whole selection is offered as one replacement.
- While the model writes, typing in the editor is paused; <kbd>Esc</kbd> or **Stop** cancels and restores the text.
- Keyboard: <kbd>Alt+Enter</kbd> accepts and <kbd>Alt+Backspace</kbd> rejects the current suggestion,
  <kbd>Alt+]</kbd> / <kbd>Alt+[</kbd> move between suggestions.
- Colours follow Editora's dark theme (`theme="dark"`, `.dark`, `[data-theme="dark"]`) and can be changed with the
  `--air-*` CSS variables.
- The selected text and nearby paragraphs (up to `contextChars`, default 1200) are sent to the provider you choose.

## Demo

```bash
npm run build -w @editora/core && npm run build -w @editora/ai-review
node packages/ai-review/demo/server.mjs
```

Then open http://localhost:5192.

## License

MIT

# @editora/ai-review

## 0.3.0

### Minor Changes

- 2d925b8: New package `@editora/agent`: an AI agent that reads and edits the whole document, with every edit shown as a suggestion to accept or reject. It ships seven document tools, an agent loop with Ollama, OpenAI-compatible and Claude providers (plus a server-side proxy for keys), a chat panel and Editora plugin, and `editora-mcp`, an MCP server that lets Claude Desktop, Claude Code, Cursor or any MCP client edit the document open in your page.

  `@editora/ai-review`: `AIReview.update()` and `finish()` also take one proposed string per block, where an empty string deletes that block's text as an inline suggestion. `textBlocks` and `BLOCK_SELECTOR` are exported.

## 0.2.1

### Patch Changes

- c8aff5f: New package `@editora/authorship`: record where every piece of text came from (typed, pasted with its source app, AI with its model, collaborator, editor tool, external), highlight it, replay the writing, export annotated HTML, and verify records with a witness server that only sees hashes.

  `@editora/ai-review` suggestion marks now carry `data-provenance="ai"` with the model and provider, and `@editora/collaboration` announces remote edits with a `provenance:expect` event, so authorship recorders label that text without extra code.

- 553d978: Typings now resolve in TypeScript projects that use `moduleResolution: "NodeNext"` or `"node16"` (they failed with TS2834 because relative imports had no file extension).

## 0.2.0

### Minor Changes

- c2ea539: Ollama Cloud (https://ollama.com) is offered in Model settings as soon as you pass a server endpoint (`userSettings.proxy.url`), so users without a local Ollama have an online option; with a server key (`keyOptional`) it becomes the default. The local option shows its URL (http://localhost:11434), checks whether Ollama is running there and links to the download if not. When a rewrite fails, the error has a "Model settings" button, and messages from your server are shown without the technical prefix. New exports: `OLLAMA_CLOUD_CHOICE`, `proxyChoicesFor`, `defaultSettingsFor`, `isOllamaRunning`.

## 0.1.0

### Minor Changes

- 86017c2: New package: AI rewrites shown as word-level accept/reject suggestions in any contenteditable, with an Editora plugin, streaming, a server proxy, and providers for Ollama (free cloud models through a local Ollama), any OpenAI-compatible API with the user's own key, and Claude.

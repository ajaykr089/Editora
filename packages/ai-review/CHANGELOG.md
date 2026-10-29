# @editora/ai-review

## 0.2.0

### Minor Changes

- c2ea539: Ollama Cloud (https://ollama.com) is offered in Model settings as soon as you pass a server endpoint (`userSettings.proxy.url`), so users without a local Ollama have an online option; with a server key (`keyOptional`) it becomes the default. The local option shows its URL (http://localhost:11434), checks whether Ollama is running there and links to the download if not. When a rewrite fails, the error has a "Model settings" button, and messages from your server are shown without the technical prefix. New exports: `OLLAMA_CLOUD_CHOICE`, `proxyChoicesFor`, `defaultSettingsFor`, `isOllamaRunning`.

## 0.1.0

### Minor Changes

- 86017c2: New package: AI rewrites shown as word-level accept/reject suggestions in any contenteditable, with an Editora plugin, streaming, a server proxy, and providers for Ollama (free cloud models through a local Ollama), any OpenAI-compatible API with the user's own key, and Claude.

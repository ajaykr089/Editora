---
'@editora/ai-review': minor
---

Ollama Cloud (https://ollama.com) is offered in Model settings as soon as you pass a server endpoint (`userSettings.proxy.url`), so users without a local Ollama have an online option; with a server key (`keyOptional`) it becomes the default. The local option shows its URL (http://localhost:11434), checks whether Ollama is running there and links to the download if not. When a rewrite fails, the error has a "Model settings" button, and messages from your server are shown without the technical prefix. New exports: `OLLAMA_CLOUD_CHOICE`, `proxyChoicesFor`, `defaultSettingsFor`, `isOllamaRunning`.

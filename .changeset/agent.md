---
'@editora/agent': minor
'@editora/ai-review': minor
---

New package `@editora/agent`: an AI agent that reads and edits the whole document, with every edit shown as a suggestion to accept or reject. It ships seven document tools, an agent loop with Ollama, OpenAI-compatible and Claude providers (plus a server-side proxy for keys), a chat panel and Editora plugin, and `editora-mcp`, an MCP server that lets Claude Desktop, Claude Code, Cursor or any MCP client edit the document open in your page.

`@editora/ai-review`: `AIReview.update()` and `finish()` also take one proposed string per block, where an empty string deletes that block's text as an inline suggestion. `textBlocks` and `BLOCK_SELECTOR` are exported.

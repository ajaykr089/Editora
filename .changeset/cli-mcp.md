---
"@editora/cli": minor
---

`editora mcp` runs a Model Context Protocol server over stdio for AI coding tools (Claude Code, Cursor, VS Code, Windsurf): `list_components`, `get_component_docs` (the API reference of a component), `get_component_source` (the files a copy would write), `copy_components` (as `add --copy`) and `install_command`. Add it with `{ "command": "npx", "args": ["-y", "@editora/cli", "mcp"] }`.

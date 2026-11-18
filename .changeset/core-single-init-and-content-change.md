---
"@editora/core": patch
---

Build `<editora-editor>` once, and report each change once.

- An editor written with a `plugins` or `toolbar` attribute was torn down and rebuilt once per attribute while the element was being upgraded (the usual page: the markup first, the script after it), so `editor-ready` fired three times for an editor with both attributes, plugins were initialised repeatedly, and `editor-destroy` fired for an editor that had not been destroyed. The editor is now built once from all the attributes. An attribute changed later still rebuilds it, once for however many are changed together. An editor taken out of the page while its plugins are still loading no longer builds itself in the detached element.
- `content-change` fired a second time on every blur, repeating the HTML that the debounced event had just reported, and it fired on a blur with no change at all, such as clicking a toolbar button, so one toolbar edit produced two events. Blur now reports only HTML that differs from what the last event said. An edit still waiting for the debounce, or one made without an input event, is still reported on blur.

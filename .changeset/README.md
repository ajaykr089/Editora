# Changesets

This directory tracks pending version bumps for packages in this monorepo.

## Making a change that should ship

After making a change to any published package (anything under `packages/*` or
`packages/plugins/*` that isn't `private`), run:

```bash
npx changeset add
```

It will ask which package(s) changed, whether the change is a patch/minor/major
bump for each, and a short summary. This writes a markdown file into
`.changeset/` — commit that file alongside your code change.

You can add as many changesets as you like before a release; they accumulate.

### Deprecated packages

`@editora/ui-angular`, `@editora/ui-vue`, and `@editora/ui-svelte` are
deprecated stubs. They are excluded via the `ignore` list in
[`config.json`](./config.json), so `changeset add` won't offer them and
`changeset version`/`changeset publish` will never touch them. Use
`@editora/ui-core` directly in those frameworks.

### Tooling-only changes

If a change affects the release process itself (like the `ignore` list above)
rather than any package's published code, add an *empty* changeset instead —
it records the change without bumping any version:

```bash
npx changeset add --empty -m "Description of what changed and why"
```

## Releasing

When you're ready to cut a release, trigger the "Publish to npm" GitHub Actions
workflow (`workflow_dispatch`). It will:

1. Run the full test/build/verify gates.
2. Run `changeset version` — this consumes every pending `.changeset/*.md`
   file, bumps the affected packages' `package.json` versions, updates their
   `CHANGELOG.md`, and deletes the consumed changeset files.
3. Commit and push that version bump.
4. Run `changeset publish` — this publishes to npm any package whose local
   version isn't yet on the registry, and pushes the corresponding
   `<package>@<version>` git tags.

If there are no pending changesets, steps 2-4 are a no-op — nothing gets
bumped or published.

See https://github.com/changesets/changesets for full docs.

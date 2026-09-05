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

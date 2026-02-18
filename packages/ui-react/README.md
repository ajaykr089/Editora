# @editora/ui-react

Tiny React adapter for Editora UI web components. Exports thin wrappers that map props/events to custom elements.

Example:

import { Button } from '@editora/ui-react'

<Button>Save</Button>

Build:

```
cd packages/ui-react
npm install
npm run build
```

This produces `dist/index.esm.js` and `dist/index.cjs.js` for consumers.

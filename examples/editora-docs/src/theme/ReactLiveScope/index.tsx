import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Docusaurus's @docusaurus/theme-live-codeblock looks for this exact module
// (src/theme/ReactLiveScope) to build the scope available inside ```jsx live
// code blocks. Without it, live blocks can only use React itself - see
// docs/advanced/live-playground.md, whose demo deliberately avoids any
// @editora component for exactly that reason.
//
// Exposing the whole @editora/ui-react barrel (rather than hand-picking a
// few components) means any doc page can drop a real component into a live
// block without this file needing an update every time. @editora/react-icons
// is included too - several component docs (AlertDialog, CopyButton,
// MetricCard, Sidebar, AnimatedBeam) compose icons from it inside their
// usage examples. Both packages export a component named `Icon` with
// unrelated APIs (ui-react's wraps the ui-icon custom element and takes a
// `name` string; react-icons' is a generic per-icon SVG wrapper) - spread
// EditoraUIReact last so its `Icon` wins, matching what every ui-react
// component doc's demo actually expects. The individual react-icons exports
// used by demos (AlertTriangleIcon, UserIcon, etc.) are unaffected either
// way since ui-react has no components by those names.
//
// The @editora barrels are only loaded in the browser. @editora/ui-core defines
// its custom elements at import time (`class X extends HTMLElement`), which
// throws under Node, so a top-level `import` here failed every static page
// during `docusaurus build` ("HTMLElement is not defined"). The live preview
// itself already renders inside BrowserOnly, so the server never needs these.
const editoraScope = ExecutionEnvironment.canUseDOM
  ? {
      ...require('@editora/react-icons'),
      ...require('@editora/ui-react'),
    }
  : {};

const ReactLiveScope = {
  React,
  ...React,
  ...editoraScope,
};

export default ReactLiveScope;

import React from 'react';
import * as EditoraUIReact from '@editora/ui-react';

// Docusaurus's @docusaurus/theme-live-codeblock looks for this exact module
// (src/theme/ReactLiveScope) to build the scope available inside ```jsx live
// code blocks. Without it, live blocks can only use React itself - see
// docs/advanced/live-playground.md, whose demo deliberately avoids any
// @editora component for exactly that reason.
//
// Exposing the whole @editora/ui-react barrel (rather than hand-picking a
// few components) means any doc page can drop a real component into a live
// block without this file needing an update every time.
const ReactLiveScope = {
  React,
  ...React,
  ...EditoraUIReact,
};

export default ReactLiveScope;

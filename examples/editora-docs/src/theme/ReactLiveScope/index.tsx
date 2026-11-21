import React from 'react';

// The scope every live block starts from. The @editora packages are not here:
// src/theme/Playground/Provider loads the ones a block uses on demand (see
// src/live/scopeLoader.ts), so they stay out of the JavaScript of pages that
// have no live block, and out of the server build, where their custom
// element classes (`class X extends HTMLElement`) throw.
const ReactLiveScope = {
  React,
  ...React,
};

export default ReactLiveScope;

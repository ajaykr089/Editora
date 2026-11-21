// ui-react and react-icons for live blocks.
//
// Both packages export a component named `Icon` with unrelated APIs
// (ui-react's wraps the ui-icon custom element and takes a `name` string;
// react-icons' is a generic per-icon SVG wrapper). ui-react is spread last so
// its `Icon` wins, matching what every ui-react component doc's demo expects.
// The individual react-icons exports (AlertTriangleIcon, UserIcon, ...) are
// unaffected since ui-react has no components by those names.
import * as reactIcons from '@editora/react-icons';
import * as uiReact from '@editora/ui-react';
// ui-react's `toast` is the lite build, which leaves the stylesheet to the app.
import '@editora/toast/toast.css';

export default { ...reactIcons, ...uiReact } as Record<string, unknown>;

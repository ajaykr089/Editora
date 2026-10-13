// The utilities call window.setTimeout, window.setInterval and window.clearTimeout. In Node, `window` can be the global object:
// timers, `performance` and EventTarget are all there, and jest's fake timers replace the same properties.
globalThis.window = globalThis;

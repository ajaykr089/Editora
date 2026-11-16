---
'@editora/ui-react': patch
---

`ThemeProvider` writes its tokens to the document during its first render in the browser, before the components inside it mount. Apps with their own brand colour saw the default blue on every page load, fading into the brand colour over about 300ms: a component that measured layout made the browser compute styles before the tokens were applied, and the buttons' colour transition did the rest.

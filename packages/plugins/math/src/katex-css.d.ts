// Vite's `?raw` suffix imports a file's text. KaTeX's own stylesheet is read that way (see MathPlugin.native.ts).
declare module 'katex/dist/katex.min.css?raw' {
  const css: string;
  export default css;
}

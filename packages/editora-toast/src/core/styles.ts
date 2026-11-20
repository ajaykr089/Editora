// The stylesheet the package can put on the page itself. The main entry provides it; the lite entry does not, and then
// the app loads toast.css.
let builtIn: string | null = null;

export function provideStyles(css: string): void {
  builtIn = css;
}

export function builtInStyles(): string | null {
  return builtIn;
}

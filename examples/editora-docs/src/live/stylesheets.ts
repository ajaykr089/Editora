// Adds a stylesheet to the page and resolves once it has loaded, so a live
// editor never renders unstyled.
//
// The editor stylesheets are imported with `!!file-loader?...!<path>`, which
// emits the file as it ships instead of passing it through the site's CSS
// pipeline. That pipeline runs postcss-preset-env, whose :is() polyfill spent
// over 20 minutes expanding the 116 `:is(...)` rules of @editora/themes'
// dark.css and never finished the build; apps using the package do not run
// that transform either. src/live/liveCssPlugin.ts keeps the minifier off
// these files too.
const added = new Map<string, Promise<void>>();

export function addStylesheet(href: string): Promise<void> {
  let promise = added.get(href);
  if (!promise) {
    promise = new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => {
        added.delete(href);
        link.remove();
        reject(new Error(`Could not load ${href}`));
      };
      document.head.appendChild(link);
    });
    added.set(href, promise);
  }
  return promise;
}

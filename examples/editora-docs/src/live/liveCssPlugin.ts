import type { Plugin } from '@docusaurus/types';

// Keeps the live examples' editor stylesheets (src/live/scopes/*, emitted under
// assets/css/live/) exactly as the packages ship them.
//
// file-loader already keeps them out of the site's PostCSS pipeline, but the
// production CSS minifier (cssnano) also runs over every emitted .css asset,
// and it mangles the native CSS nesting in @editora/themes: it flattened the
// nested `.rte-toolbar-group-items.font-size .rte-toolbar-button { border: none }`
// into a top-level `.rte-toolbar-button` rule and merged the real
// `.rte-toolbar-button` rule away, so every toolbar button lost its layout.
export default function liveCssPlugin(): Plugin {
  return {
    name: 'editora-live-css',
    configureWebpack(config) {
      for (const minimizer of config.optimization?.minimizer ?? []) {
        const plugin = minimizer as { constructor?: { name?: string }; options?: { exclude?: unknown } };
        if (plugin?.constructor?.name === 'CssMinimizerPlugin' && plugin.options) {
          plugin.options.exclude = /assets\/css\/live\//;
        }
      }
      return {};
    },
  };
}

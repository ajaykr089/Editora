// The React editor and every plugin factory, with the styles the editor docs
// tell an app to import. dark.css follows the site's own dark mode
// (html[data-theme="dark"]). See ../stylesheets.ts for the `!!file-loader`.
import { EditoraEditor, RichTextEditor } from '@editora/react';
import * as plugins from '@editora/plugins';
import pluginsCss from '!!file-loader?name=assets/css/live/[name]-[contenthash].[ext]!@editora/plugins/styles.css';
import defaultThemeCss from '!!file-loader?name=assets/css/live/[name]-[contenthash].[ext]!@editora/themes/themes/default.css';
import darkThemeCss from '!!file-loader?name=assets/css/live/[name]-[contenthash].[ext]!@editora/themes/themes/dark.css';
import { addStylesheet } from '../stylesheets';

export const ready = Promise.all([pluginsCss, defaultThemeCss, darkThemeCss].map(addStylesheet));

export default { ...plugins, EditoraEditor, RichTextEditor } as Record<string, unknown>;

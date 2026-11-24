// Registers the <editora-editor> custom element (its plugins load on demand),
// with the stylesheet the web component docs load next to it. See
// ../stylesheets.ts for the `!!file-loader`.
import '@editora/core/webcomponent';
import webcomponentCss from '!!file-loader?name=assets/css/live/[name]-[contenthash].[ext]!@editora/core/webcomponent.css';
import { addStylesheet } from '../stylesheets';

export const ready = addStylesheet(webcomponentCss);

export default {} as Record<string, unknown>;

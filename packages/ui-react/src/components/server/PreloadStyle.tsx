import { createElement } from 'react';
import { PRELOAD_CSS } from '@editora/ui-core/preload';

export type EditoraPreloadStyleProps = {
  /** Content-Security-Policy nonce for the inline style. */
  nonce?: string;
};

/**
 * Put this in the document head of a server-rendered app (Next.js root layout, Remix root, ...).
 * Until the custom elements are defined in the browser it gives each one the display it will have,
 * hides what it will hide (closed dialogs, menu content, inactive tab panels, raw <option>s) and
 * reserves form-control height, so the page does not flash unstyled content or jump on hydration.
 * The same rules ship as `@editora/ui-core/preload.css`.
 */
export function EditoraPreloadStyle({ nonce }: EditoraPreloadStyleProps = {}) {
  return createElement('style', {
    'data-editora-preload': '',
    nonce,
    dangerouslySetInnerHTML: { __html: PRELOAD_CSS }
  });
}

export default EditoraPreloadStyle;

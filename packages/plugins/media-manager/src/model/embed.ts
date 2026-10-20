import type { EmbedSpec } from '../embeds/providers';
import { EMBED_CLASS, EMBED_MAX_WIDTH, FIGURE_CLASS, adoptFigure, styleFigure, type Align } from './figure';

/** Tells the editor's input sanitizer that this iframe came from a user's own action (see core's `TRUSTED_EMBED_ATTRIBUTE`). */
export const TRUSTED_EMBED_ATTRIBUTE = 'data-editora-embed';

/**
 * The permissions a video player is given. Not `allow-same-origin` scripts, not `camera`: only what watching a
 * video needs.
 */
const ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';

/**
 * An embedded player as a figure: a block as wide as the text allows (up to `EMBED_MAX_WIDTH`), with an iframe
 * that keeps its shape (`aspect-ratio`) so that no height has to be guessed. The iframe loads lazily.
 */
export const buildEmbedFigure = (spec: EmbedSpec, options: { align?: Align; title?: string; maxWidth?: string } = {}): HTMLElement => {
  const figure = document.createElement('figure');
  figure.classList.add(FIGURE_CLASS, EMBED_CLASS);
  figure.setAttribute('data-provider', spec.provider);
  figure.style.maxWidth = options.maxWidth ?? EMBED_MAX_WIDTH;
  styleFigure(figure, options.align ?? 'center');

  const iframe = document.createElement('iframe');
  iframe.src = spec.src;
  iframe.title = options.title?.trim() || spec.label;
  iframe.setAttribute('allow', ALLOW);
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute(TRUSTED_EMBED_ATTRIBUTE, 'true');
  iframe.style.cssText = `display: block; width: 100%; aspect-ratio: ${Number(spec.aspectRatio.toFixed(4))}; border: 0;`;
  // A vertical video should not be as wide as a landscape one.
  if (spec.aspectRatio < 1 && !options.maxWidth) figure.style.maxWidth = '360px';

  figure.append(iframe);
  adoptFigure(figure);
  return figure;
};

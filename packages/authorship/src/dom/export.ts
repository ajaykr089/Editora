/**
 * Export authorship with the HTML: spans carrying `data-provenance`
 * attributes, the full record as embedded JSON, and IPTC digital source
 * type terms. No standard for text provenance exists yet; the IPTC terms
 * are the closest widely used vocabulary (built for images and video).
 */
import type { AuthorshipReport } from '../core/report';
import type { AuthorshipState, OriginKind } from '../core/types';
import { PROVENANCE_ATTR } from './attach';
import { buildDocMap } from './text';

export const IPTC_DIGITAL_SOURCE_TYPE = 'http://cv.iptc.org/newscodes/digitalsourcetype/';
export const EMBED_TYPE = 'application/vnd.editora.authorship+json';

/** IPTC term for one origin kind, when one fits. */
export function digitalSourceType(kind: OriginKind): string | undefined {
  if (kind === 'typed' || kind === 'collaborator') return `${IPTC_DIGITAL_SOURCE_TYPE}digitalCreation`;
  if (kind === 'ai') return `${IPTC_DIGITAL_SOURCE_TYPE}trainedAlgorithmicMedia`;
  return undefined;
}

/** IPTC term for a whole document: human, AI, or human text edited with AI. */
export function documentSourceType(report: AuthorshipReport): string | undefined {
  const human = report.byKind.typed.chars + report.byKind.collaborator.chars;
  const ai = report.byKind.ai.chars;
  if (ai && human) return `${IPTC_DIGITAL_SOURCE_TYPE}compositeWithTrainedAlgorithmicMedia`;
  if (ai) return `${IPTC_DIGITAL_SOURCE_TYPE}trainedAlgorithmicMedia`;
  if (human) return `${IPTC_DIGITAL_SOURCE_TYPE}digitalCreation`;
  return undefined;
}

export interface AnnotateOptions {
  /** Kinds to wrap in spans (default pasted, AI, collaborator, tool, external). */
  kinds?: OriginKind[];
  /** Also embed the record as JSON (default false). */
  embed?: boolean;
  /** Leave the log out of the embedded record (default false: keep it). */
  withoutLog?: boolean;
}

const escapeJson = (json: string) => json.replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

/**
 * HTML for `root`'s content with text wrapped by origin, e.g.
 * `<span data-provenance="ai" data-provenance-model="gemma4">…</span>`.
 * `state` must describe `root`'s current text (from `controller.serialize()`).
 */
export function toAnnotatedHtml(root: HTMLElement, state: AuthorshipState, options: AnnotateOptions = {}): string {
  const kinds = options.kinds ?? ['pasted', 'ai', 'collaborator', 'tool', 'external'];
  const clone = root.cloneNode(true) as HTMLElement;
  const map = buildDocMap(clone);
  if (map.text.length !== state.length) throw new Error('The authorship state does not match this content; serialize it again first.');
  const doc = clone.ownerDocument;

  // Wrap right to left so splitting a text node never moves a piece still to come.
  const pieces: Array<{ start: number; end: number; id: number }> = [];
  let pos = 0;
  for (const [length, id] of state.runs) {
    const origin = state.origins[id];
    if (origin && kinds.includes(origin.kind)) pieces.push({ start: pos, end: pos + length, id });
    pos += length;
  }
  for (const piece of pieces.reverse()) {
    const origin = state.origins[piece.id];
    const segments = map.segments.filter((segment) => segment.start < piece.end && segment.end > piece.start);
    for (const segment of segments.reverse()) {
      let node = segment.node;
      const from = Math.max(0, piece.start - segment.start);
      const to = Math.min(node.length, piece.end - segment.start);
      if (to < node.length) node.splitText(to);
      if (from > 0) node = node.splitText(from);
      const span = doc.createElement('span');
      span.setAttribute(PROVENANCE_ATTR, origin.kind);
      if (origin.model) span.setAttribute(`${PROVENANCE_ATTR}-model`, origin.model);
      if (origin.provider) span.setAttribute(`${PROVENANCE_ATTR}-provider`, origin.provider);
      if (origin.source) span.setAttribute(`${PROVENANCE_ATTR}-source`, origin.source);
      if (origin.author) span.setAttribute(`${PROVENANCE_ATTR}-author`, origin.author);
      const term = digitalSourceType(origin.kind);
      if (term) span.setAttribute(`${PROVENANCE_ATTR}-type`, term);
      node.parentNode!.insertBefore(span, node);
      span.appendChild(node);
    }
  }
  const html = clone.innerHTML;
  return options.embed ? embedState(html, state, { withoutLog: options.withoutLog }) : html;
}

/** Append the record to HTML as `<script type="application/vnd.editora.authorship+json">`. */
export function embedState(html: string, state: AuthorshipState, options: { withoutLog?: boolean } = {}): string {
  const record = options.withoutLog ? { ...state, log: undefined } : state;
  return `${html}\n<script type="${EMBED_TYPE}">${escapeJson(JSON.stringify(record))}</script>`;
}

/** Read a record embedded with `embedState`; returns the HTML without it too. */
export function readEmbeddedState(html: string): { html: string; state: AuthorshipState | null } {
  const pattern = new RegExp(`\\s*<script type="${EMBED_TYPE.replace(/[.+]/g, '\\$&')}">([\\s\\S]*?)</script>`);
  const match = pattern.exec(html);
  if (!match) return { html, state: null };
  try {
    return { html: html.replace(match[0], ''), state: JSON.parse(match[1]) as AuthorshipState };
  } catch {
    return { html, state: null };
  }
}

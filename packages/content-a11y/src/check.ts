import { snippet } from './dom';
import { imageRules } from './rules/images';
import { GENERIC_LINK_TEXT, linkRules } from './rules/links';
import { structureRules } from './rules/structure';
import { textRules } from './rules/text';
import type { CheckOptions, Issue, ResolvedOptions, Rule } from './types';

/** Every rule, in the order issues are grouped in reports. */
export const RULES: Rule[] = [...imageRules, ...linkRules, ...structureRules, ...textRules];

export type ContentInput = string | Element | Document;

export interface CheckResult {
  issues: Issue[];
  errors: number;
  warnings: number;
  infos: number;
  /** The element that was checked (the <body> of a parsed string). Fixes edit it. */
  root: Element;
  /** The checked content's HTML as it is now, after any fixes you applied. */
  html(): string;
}

function defaultParse(html: string): Document {
  if (typeof DOMParser === 'undefined') {
    throw new Error('content-a11y: no DOMParser here. Pass `parse` (from jsdom or linkedom) to check HTML strings on a server.');
  }
  return new DOMParser().parseFromString(html, 'text/html');
}

function rootOf(input: ContentInput, options: CheckOptions): Element {
  if (typeof input === 'string') return (options.parse ?? defaultParse)(input).body;
  if ('body' in input && input.nodeType === 9) return (input as Document).body;
  return input as Element;
}

function resolve(options: CheckOptions): ResolvedOptions {
  return {
    minHeadingLevel: Math.max(1, Math.min(6, options.minHeadingLevel ?? 1)),
    headingStartKnown: options.minHeadingLevel !== undefined,
    maxAltLength: options.maxAltLength ?? 150,
    background: options.background ?? '#ffffff',
    genericLinkText: new Set([...GENERIC_LINK_TEXT, ...(options.genericLinkText ?? []).map((text) => text.toLowerCase())]),
    fileTypes: options.fileTypes ?? ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'zip'],
  };
}

/** Check content for accessibility problems. Strings are parsed; elements are checked in place, so fixes edit them. */
export function checkContent(input: ContentInput, options: CheckOptions = {}): CheckResult {
  const root = rootOf(input, options);
  const resolved = resolve(options);
  const issues: Issue[] = [];

  for (const rule of RULES) {
    const setting = options.rules?.[rule.id];
    if (setting === 'off') continue;
    rule.check({
      root,
      options: resolved,
      report(element, details) {
        issues.push({
          rule: rule.id,
          severity: setting ?? rule.severity,
          level: rule.level,
          wcag: rule.wcag,
          message: options.messages?.[rule.id] ?? details.message,
          help: details.help,
          element,
          snippet: snippet(element),
          fixes: details.fixes ?? [],
        });
      },
    });
  }

  // Document order, so a report reads top to bottom.
  issues.sort((a, b) => {
    if (a.element === b.element) return 0;
    const position = a.element.compareDocumentPosition(b.element);
    return position & 4 /* FOLLOWING */ ? -1 : position & 2 /* PRECEDING */ ? 1 : 0;
  });

  return {
    issues,
    errors: issues.filter((issue) => issue.severity === 'error').length,
    warnings: issues.filter((issue) => issue.severity === 'warning').length,
    infos: issues.filter((issue) => issue.severity === 'info').length,
    root,
    html: () => root.innerHTML,
  };
}

export interface FixOptions extends CheckOptions {
  /**
   * Which fixes to apply. Default `['auto']`: only the ones that are safe without a person looking.
   * Fixes that need text (alt text) or a judgement about meaning (`manual`) are never applied in bulk.
   */
  kinds?: Array<'auto' | 'suggested'>;
}

export interface FixResult {
  html: string;
  /** What was changed, one entry per fix. */
  applied: Array<{ rule: string; fix: string; snippet: string }>;
  /** Issues still there after fixing (including the ones that need a person). */
  remaining: Issue[];
}

/**
 * Apply fixes and re-check. Fixes that need text from a person (alt text) are
 * never applied here; `suggested` ones only when you ask for them.
 */
export function fixContent(input: ContentInput, options: FixOptions = {}): FixResult {
  const kinds = new Set(options.kinds ?? ['auto']);
  const applied: FixResult['applied'] = [];
  let result = checkContent(input, options);
  const root = result.root;

  // A fix can change what other rules see (removing a heading changes the outline), so re-check between rounds.
  for (let round = 0; round < 5; round += 1) {
    const candidates = result.issues
      .map((issue) => ({ issue, fix: issue.fixes.find((fix) => kinds.has(fix.kind) && !fix.input && !fix.manual) }))
      .filter((candidate): candidate is { issue: Issue; fix: NonNullable<typeof candidate.fix> } => Boolean(candidate.fix));
    if (candidates.length === 0) break;
    for (const { issue, fix } of candidates) {
      if (!root.contains(issue.element)) continue;
      fix.apply();
      applied.push({ rule: issue.rule, fix: fix.label, snippet: issue.snippet });
    }
    result = checkContent(root, options);
  }

  return { html: root.innerHTML, applied, remaining: result.issues };
}

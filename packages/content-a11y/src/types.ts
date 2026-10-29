export type Severity = 'error' | 'warning' | 'info';

/** The WCAG conformance level a rule maps to, or `best-practice` when it is advice beyond WCAG. */
export type Level = 'A' | 'AA' | 'AAA' | 'best-practice';

export interface Fix {
  /** Button text, e.g. "Mark as decorative". */
  label: string;
  /**
   * `auto`: safe to apply without looking (removing an empty heading).
   * `suggested`: changes meaning or wording, so a person should confirm it.
   */
  kind: 'auto' | 'suggested';
  /** The fix needs text from the person (e.g. alt text); `apply` receives it. */
  input?: { label: string; placeholder?: string; initial?: string };
  /**
   * Only when a person picks it, never in bulk: the choice depends on what the
   * content means (marking an image decorative hides it from screen readers).
   */
  manual?: boolean;
  apply(value?: string): void;
}

export interface Issue {
  rule: string;
  severity: Severity;
  level: Level;
  /** WCAG success criterion, e.g. "1.1.1". */
  wcag?: string;
  message: string;
  /** Why it matters and how to fix it by hand. */
  help: string;
  element: Element;
  /** Short HTML excerpt of the element, for reports. */
  snippet: string;
  fixes: Fix[];
}

export interface CheckOptions {
  /** Turn rules off or change their severity: `{ 'text-all-caps': 'off', 'link-new-window': 'error' }`. */
  rules?: Record<string, Severity | 'off'>;
  /**
   * The highest heading level content may use. Content shown under a page
   * title that is already the h1 should start at h2: pass 2. Default 1.
   */
  minHeadingLevel?: number;
  /** Alt text longer than this is flagged (default 150 characters). */
  maxAltLength?: number;
  /** The page background behind the content, for contrast checks (default #ffffff). */
  background?: string;
  /** Extra phrases to treat as meaningless link text (lower case). */
  genericLinkText?: string[];
  /** File extensions whose links should say the file type (default pdf, doc, docx, xls, xlsx, ppt, pptx, zip). */
  fileTypes?: string[];
  /** Replace a rule's message: `{ 'image-alt-missing': 'Describe this image.' }`. */
  messages?: Record<string, string>;
  /** Parse HTML strings into a Document. Defaults to DOMParser; on a server pass one from jsdom or linkedom. */
  parse?: (html: string) => Document;
}

export interface ResolvedOptions {
  minHeadingLevel: number;
  /** `minHeadingLevel` was given: the first heading is checked against it too. */
  headingStartKnown: boolean;
  maxAltLength: number;
  background: string;
  genericLinkText: Set<string>;
  fileTypes: string[];
}

export interface RuleContext {
  root: Element;
  options: ResolvedOptions;
  /** Report a problem with `element`. */
  report(element: Element, details: { message: string; help: string; fixes?: Fix[] }): void;
}

export interface Rule {
  id: string;
  severity: Severity;
  level: Level;
  wcag?: string;
  /** One line describing what the rule checks, for docs and settings UIs. */
  title: string;
  check(context: RuleContext): void;
}

import { all, inlineStyle, isAllBold, rename, tagOf, textOf, unwrap } from '../dom';
import type { Rule } from '../types';

const HEADING = 'h1, h2, h3, h4, h5, h6';
const levelOf = (heading: Element) => parseInt(tagOf(heading).slice(1), 10);

function setLevel(heading: Element, level: number): void {
  rename(heading, `h${Math.max(1, Math.min(6, level))}`);
}

export const headingEmpty: Rule = {
  id: 'heading-empty',
  title: 'Headings need text',
  severity: 'error',
  level: 'A',
  wcag: '1.3.1',
  check({ root, report }) {
    for (const heading of all(root, HEADING)) {
      if (textOf(heading) || heading.querySelector('img[alt]:not([alt=""])')) continue;
      report(heading, {
        message: 'This heading is empty.',
        help: 'Screen reader users jump between headings; an empty one announces nothing. It is usually left behind after editing.',
        fixes: [
          {
            label: 'Remove the empty heading',
            kind: 'auto',
            apply() {
              heading.remove();
            },
          },
        ],
      });
    }
  },
};

export const headingTooHigh: Rule = {
  id: 'heading-too-high',
  title: 'Content headings start below the page title',
  severity: 'warning',
  level: 'best-practice',
  wcag: '1.3.1',
  check({ root, options, report }) {
    if (options.minHeadingLevel <= 1) return;
    for (const heading of all(root, HEADING)) {
      if (levelOf(heading) >= options.minHeadingLevel) continue;
      report(heading, {
        message: `This is a level ${levelOf(heading)} heading; content here starts at level ${options.minHeadingLevel}.`,
        help: 'The page title is already the top heading, so headings in the content should sit below it.',
        fixes: [
          {
            label: `Make it a level ${options.minHeadingLevel} heading`,
            kind: 'suggested',
            apply() {
              setLevel(heading, options.minHeadingLevel);
            },
          },
        ],
      });
    }
  },
};

export const headingSkip: Rule = {
  id: 'heading-skip',
  title: 'Heading levels should not skip (h2 then h4)',
  severity: 'warning',
  level: 'A',
  wcag: '1.3.1',
  check({ root, options, report }) {
    // Without a known start level, content may begin at any level (it often sits under the page's h1).
    let previous = options.headingStartKnown ? options.minHeadingLevel - 1 : -1;
    for (const heading of all(root, HEADING)) {
      const level = levelOf(heading);
      if (previous === -1 || level < options.minHeadingLevel) {
        previous = level;
        continue;
      }
      if (level > previous + 1 && previous >= options.minHeadingLevel - 1) {
        const expected = previous + 1;
        report(heading, {
          message:
            previous < options.minHeadingLevel
              ? `This is a level ${level} heading, but the headings here start at level ${options.minHeadingLevel}.`
              : `This heading jumps from level ${previous} to level ${level}.`,
          help: 'Screen reader users use heading levels as an outline; a skipped level suggests something is missing. Pick the level by structure, not by size (restyle it if it looks too big).',
          fixes: [
            {
              label: `Make it a level ${expected} heading`,
              kind: 'suggested',
              apply() {
                setLevel(heading, expected);
              },
            },
          ],
        });
        previous = expected;
        continue;
      }
      previous = level;
    }
  },
};

export const headingLong: Rule = {
  id: 'heading-long',
  title: 'Headings should be short',
  severity: 'info',
  level: 'best-practice',
  check({ root, report }) {
    for (const heading of all(root, HEADING)) {
      const length = textOf(heading).length;
      if (length <= 160) continue;
      report(heading, {
        message: `This heading is ${length} characters long.`,
        help: 'Long headings are hard to scan and tiring to hear. Is it a paragraph styled as a heading?',
        fixes: [
          {
            label: 'Make it a paragraph',
            kind: 'suggested',
            apply() {
              rename(heading, 'p');
            },
          },
        ],
      });
    }
  },
};

/** A short, fully bold (or large) paragraph with text after it reads as a heading but is not one. */
export const headingFake: Rule = {
  id: 'heading-fake',
  title: 'Use real headings, not bold paragraphs',
  severity: 'warning',
  level: 'A',
  wcag: '1.3.1',
  check({ root, options, report }) {
    let lastLevel = options.minHeadingLevel - 1;
    for (const element of all(root, `${HEADING}, p`)) {
      if (tagOf(element) !== 'p') {
        lastLevel = levelOf(element);
        continue;
      }
      if (element.closest('li, td, th, blockquote, figcaption')) continue;
      const text = textOf(element);
      if (!text || text.length > 120 || /[.,;:!?)\]"'”]$/.test(text)) continue;
      const size = parseFloat(inlineStyle(element, 'font-size') ?? '') || 0;
      const looksLikeHeading = isAllBold(element) || size >= 20;
      const next = element.nextElementSibling;
      if (!looksLikeHeading || !next || !['p', 'ul', 'ol', 'table', 'blockquote'].includes(tagOf(next))) continue;
      if (tagOf(next) === 'p' && isAllBold(next)) continue; // A run of bold lines is emphasis, not a heading.
      const level = Math.min(6, Math.max(options.minHeadingLevel, lastLevel + 1));
      report(element, {
        message: `"${text}" looks like a heading but is a bold paragraph.`,
        help: 'Screen reader users navigate by headings, and bold text is not one. Use a real heading so the structure is there for everyone.',
        fixes: [
          {
            label: `Make it a level ${level} heading`,
            kind: 'suggested',
            apply() {
              const heading = rename(element, `h${level}`);
              heading.querySelectorAll('strong, b').forEach(unwrap);
              heading.removeAttribute('style');
            },
          },
        ],
      });
    }
  },
};

const BULLET = /^\s*([-*•◦▪–—●])\s+/;
const NUMBER = /^\s*(\d{1,3}|[a-z])[.)]\s+/i;

/** Paragraphs typed as "- item" or "1. item" are not lists to assistive technology. */
export const listFake: Rule = {
  id: 'list-fake',
  title: 'Use real lists, not lines typed with dashes or numbers',
  severity: 'warning',
  level: 'A',
  wcag: '1.3.1',
  check({ root, report }) {
    const paragraphs = all(root, 'p');
    const used = new Set<Element>();
    for (const first of paragraphs) {
      if (used.has(first)) continue;
      const kind = BULLET.test(textOf(first)) ? 'ul' : NUMBER.test(textOf(first)) ? 'ol' : null;
      if (!kind) continue;
      const pattern = kind === 'ul' ? BULLET : NUMBER;
      const run = [first];
      let next = first.nextElementSibling;
      while (next && tagOf(next) === 'p' && pattern.test(textOf(next))) {
        run.push(next);
        next = next.nextElementSibling;
      }
      if (run.length < 2) continue;
      run.forEach((paragraph) => used.add(paragraph));
      report(first, {
        message: `These ${run.length} lines are typed as a ${kind === 'ul' ? 'bulleted' : 'numbered'} list.`,
        help: 'Screen readers announce real lists ("list, 3 items") and let people skip them. Lines starting with dashes or numbers are just paragraphs.',
        fixes: [
          {
            label: `Make it a ${kind === 'ul' ? 'bulleted' : 'numbered'} list`,
            kind: 'suggested',
            apply() {
              const list = first.ownerDocument.createElement(kind);
              first.before(list);
              for (const paragraph of run) {
                const item = first.ownerDocument.createElement('li');
                while (paragraph.firstChild) item.appendChild(paragraph.firstChild);
                // Strip the typed marker from the first text node.
                const walker = first.ownerDocument.createTreeWalker(item, 4);
                const node = walker.nextNode() as Text | null;
                if (node) node.data = node.data.replace(pattern, '');
                list.appendChild(item);
                paragraph.remove();
              }
            },
          },
        ],
      });
    }
  },
};

export const tableHeaders: Rule = {
  id: 'table-headers',
  title: 'Data tables need a header row',
  severity: 'error',
  level: 'A',
  wcag: '1.3.1',
  check({ root, report }) {
    for (const table of all(root, 'table')) {
      if (table.getAttribute('role') === 'presentation' || table.querySelector('th')) continue;
      const rows = Array.from(table.querySelectorAll('tr')).filter((row) => row.closest('table') === table);
      if (rows.length < 2 || rows[0].children.length < 2) continue;
      report(table, {
        message: 'This table has no header cells.',
        help: 'Without headers, screen readers read each cell with no idea which column it is in. Mark the first row (or column) as headers.',
        fixes: [
          {
            label: 'Make the first row the header',
            kind: 'suggested',
            apply() {
              const doc = table.ownerDocument;
              const thead = doc.createElement('thead');
              const first = rows[0];
              const section = first.parentElement!;
              table.insertBefore(thead, section === table ? first : section);
              thead.appendChild(first);
              Array.from(first.children).forEach((cell) => {
                const header = rename(cell, 'th');
                header.setAttribute('scope', 'col');
              });
            },
          },
        ],
      });
    }
  },
};

export const tableEmptyHeader: Rule = {
  id: 'table-empty-header',
  title: 'Header cells need text',
  severity: 'warning',
  level: 'A',
  wcag: '1.3.1',
  check({ root, report }) {
    for (const header of all(root, 'th')) {
      if (textOf(header) || header.querySelector('img[alt]:not([alt=""])')) continue;
      // The corner cell above row headers is commonly empty.
      const row = header.parentElement;
      if (row && row.firstElementChild === header && header.closest('thead')) continue;
      report(header, {
        message: 'This header cell is empty.',
        help: 'Screen readers announce the header with each cell in its column. Give it a short label.',
      });
    }
  },
};

export const structureRules = [headingEmpty, headingTooHigh, headingSkip, headingLong, headingFake, listFake, tableHeaders, tableEmptyHeader];

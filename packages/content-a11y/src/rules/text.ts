import { contrastRatio, nearestPassingColor, parseColor, type RGBA } from '../color';
import { all, inlineStyle, setInlineStyle, tagOf, textOf, unwrap } from '../dom';
import type { Rule } from '../types';

/** Four or more capitalised words in a row (acronyms on their own are fine). */
const SHOUTING = /\b(?:[A-Z][A-Z'’-]+\s+){3,}[A-Z][A-Z'’-]+\b/;

function sentenceCase(text: string): string {
  const lower = text.toLowerCase();
  return lower.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_match, gap: string, letter: string) => gap + letter.toUpperCase());
}

export const textAllCaps: Rule = {
  id: 'text-all-caps',
  title: 'Avoid long runs of capital letters',
  severity: 'warning',
  level: 'best-practice',
  check({ root, report }) {
    for (const block of all(root, 'p, li, h1, h2, h3, h4, h5, h6, td, th, blockquote')) {
      if (Array.from(block.children).some((child) => ['p', 'li', 'ul', 'ol', 'table'].includes(tagOf(child)))) continue;
      const text = textOf(block);
      if (!SHOUTING.test(text)) continue;
      report(block, {
        message: 'This text is written in capital letters.',
        help: 'Long capitalised text is harder to read, and some screen readers spell it out letter by letter. Write it in sentence case (use bold for emphasis).',
        fixes: [
          {
            label: 'Change to sentence case',
            kind: 'suggested',
            apply() {
              const walker = block.ownerDocument.createTreeWalker(block, 4);
              let first = true;
              while (walker.nextNode()) {
                const node = walker.currentNode as Text;
                if (!SHOUTING.test(node.data) && !/^[^a-z]*[A-Z]{4,}[^a-z]*$/.test(node.data)) {
                  first = false;
                  continue;
                }
                const converted = sentenceCase(node.data);
                node.data = first ? converted : converted.charAt(0).toLowerCase() + converted.slice(1);
                first = false;
              }
            },
          },
        ],
      });
    }
  },
};

export const textUnderline: Rule = {
  id: 'text-underline',
  title: 'Underlined text that is not a link looks like one',
  severity: 'info',
  level: 'best-practice',
  check({ root, report }) {
    for (const element of all(root, 'u, [style*="underline"]')) {
      if (element.closest('a') || tagOf(element) === 'a' || !textOf(element)) continue;
      if (tagOf(element) !== 'u' && !/underline/i.test(inlineStyle(element, 'text-decoration') ?? inlineStyle(element, 'text-decoration-line') ?? '')) continue;
      report(element, {
        message: 'This underlined text is not a link.',
        help: 'People expect underlined text to be clickable. Use bold or italics for emphasis.',
        fixes: tagOf(element) === 'u'
          ? [
              {
                label: 'Remove the underline',
                kind: 'suggested',
                apply() {
                  unwrap(element);
                },
              },
            ]
          : [],
      });
    }
  },
};

export const emptyParagraphs: Rule = {
  id: 'empty-paragraphs',
  title: 'Do not use empty paragraphs for spacing',
  severity: 'info',
  level: 'best-practice',
  check({ root, report }) {
    const isEmpty = (element: Element | null) =>
      !!element && tagOf(element) === 'p' && !textOf(element) && !element.querySelector('img, iframe, video, input, svg');
    for (const paragraph of all(root, 'p')) {
      if (!isEmpty(paragraph) || isEmpty(paragraph.previousElementSibling)) continue;
      const run = [paragraph];
      let next = paragraph.nextElementSibling;
      while (isEmpty(next)) {
        run.push(next!);
        next = next!.nextElementSibling;
      }
      if (run.length < 2) continue;
      report(paragraph, {
        message: `${run.length} empty paragraphs are used as spacing.`,
        help: 'Screen readers announce each one as "blank". Use the theme’s spacing, or a divider if it separates topics.',
        fixes: [
          {
            label: 'Remove the empty paragraphs',
            kind: 'auto',
            apply() {
              run.forEach((element) => element.remove());
            },
          },
        ],
      });
    }
  },
};

function effectiveBackground(element: Element, root: Element, fallback: RGBA): RGBA {
  for (let node: Element | null = element; node; node = node === root ? null : node.parentElement) {
    const color = parseColor(inlineStyle(node, 'background-color') ?? inlineStyle(node, 'background')?.split(/\s+(?![^(]*\))/)[0]);
    if (color && color[3] > 0) return color[3] < 1 ? ([...color.slice(0, 3), 1] as RGBA) : color;
  }
  return fallback;
}

function isLargeText(element: Element, root: Element): boolean {
  let size = 16;
  let bold = false;
  for (let node: Element | null = element; node; node = node === root ? null : node.parentElement) {
    const fontSize = inlineStyle(node, 'font-size');
    if (fontSize && size === 16) {
      const value = parseFloat(fontSize);
      size = /pt$/i.test(fontSize) ? value * (4 / 3) : /em$/i.test(fontSize) ? value * 16 : value;
    }
    const weight = inlineStyle(node, 'font-weight');
    if (['strong', 'b'].includes(tagOf(node)) || (weight && (/bold/.test(weight) || parseInt(weight, 10) >= 700))) bold = true;
    if (/^h[1-3]$/.test(tagOf(node))) bold = true;
  }
  return size >= 24 || (bold && size >= 18.66);
}

/** Only colours set in the content itself can be checked here; theme colours are the theme's responsibility. */
export const textContrast: Rule = {
  id: 'text-contrast',
  title: 'Text colours need enough contrast with the background',
  severity: 'error',
  level: 'AA',
  wcag: '1.4.3',
  check({ root, options, report }) {
    const page = parseColor(options.background) ?? [255, 255, 255, 1];
    for (const element of all(root, '[style*="color"]')) {
      const foreground = parseColor(inlineStyle(element, 'color'));
      if (!foreground || !textOf(element)) continue;
      const background = effectiveBackground(element, root, page);
      const ratio = contrastRatio(foreground, background);
      const target = isLargeText(element, root) ? 3 : 4.5;
      if (ratio >= target) continue;
      const better = nearestPassingColor(foreground, background, target);
      report(element, {
        message: `This text has a contrast ratio of ${ratio.toFixed(2)}:1; it needs at least ${target}:1.`,
        help: 'Low contrast text is hard to read for many people, especially on phones in daylight. Use a darker (or lighter) colour.',
        fixes: better
          ? [
              {
                label: `Use ${better} instead`,
                kind: 'suggested',
                apply() {
                  setInlineStyle(element, 'color', better);
                },
              },
            ]
          : [],
      });
    }
  },
};

export const textRules = [textAllCaps, textUnderline, emptyParagraphs, textContrast];

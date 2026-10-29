import { accessibleText, all, unwrap } from '../dom';
import type { Rule } from '../types';

export const GENERIC_LINK_TEXT = [
  'click here', 'click', 'here', 'click this', 'tap here', 'read more', 'more', 'learn more', 'more info',
  'more information', 'find out more', 'details', 'see more', 'continue', 'continue reading', 'link', 'this link',
  'this', 'go', 'go here', 'website', 'page', 'info', 'download', 'view', 'see here',
];

const normalize = (text: string) => text.toLowerCase().replace(/[.,:;!?…»›>→]+$/g, '').replace(/\s+/g, ' ').trim();

export const linkEmpty: Rule = {
  id: 'link-empty',
  title: 'Links need text',
  severity: 'error',
  level: 'A',
  wcag: '2.4.4',
  check({ root, report }) {
    for (const link of all(root, 'a[href]')) {
      if (accessibleText(link) !== '' || link.querySelector('img')) continue; // Image links: image-link-alt.
      report(link, {
        message: 'This link has no text.',
        help: 'Screen readers announce it as just "link", and nobody can see where it goes. It is usually left behind after editing.',
        fixes: [
          {
            label: 'Remove the empty link',
            kind: 'auto',
            apply() {
              unwrap(link);
            },
          },
        ],
      });
    }
  },
};

export const linkGenericText: Rule = {
  id: 'link-generic-text',
  title: 'Link text should say where the link goes, not "click here"',
  severity: 'warning',
  level: 'A',
  wcag: '2.4.4',
  check({ root, options, report }) {
    for (const link of all(root, 'a[href]')) {
      const text = normalize(accessibleText(link));
      if (!text || !options.genericLinkText.has(text)) continue;
      report(link, {
        message: `The link text "${accessibleText(link)}" does not say where it goes.`,
        help: 'Screen reader users often browse a list of links out of context. Use the destination as the link text, e.g. "Read the 2026 pricing guide".',
        fixes: [
          {
            label: 'Rewrite the link text',
            kind: 'suggested',
            input: { label: 'Where does this link go?', placeholder: 'e.g. 2026 pricing guide' },
            apply(value) {
              if (value?.trim()) link.textContent = value.trim();
            },
          },
        ],
      });
    }
  },
};

export const linkUrlText: Rule = {
  id: 'link-url-text',
  title: 'Long web addresses make poor link text',
  severity: 'warning',
  level: 'best-practice',
  wcag: '2.4.4',
  check({ root, report }) {
    for (const link of all(root, 'a[href]')) {
      const text = accessibleText(link);
      if (text.length < 40 || !/^(?:https?:\/\/|www\.)\S+$/i.test(text)) continue;
      report(link, {
        message: 'The link text is a long web address.',
        help: 'Screen readers read addresses out character by character. Use a short description of the page instead.',
        fixes: [
          {
            label: 'Use a description',
            kind: 'suggested',
            input: { label: 'Describe the page', placeholder: 'e.g. Accessibility statement' },
            apply(value) {
              if (value?.trim()) link.textContent = value.trim();
            },
          },
        ],
      });
    }
  },
};

export const linkNewWindow: Rule = {
  id: 'link-new-window',
  title: 'Say when a link opens a new tab',
  severity: 'warning',
  level: 'AAA',
  wcag: '3.2.5',
  check({ root, report }) {
    for (const link of all(root, 'a[href][target="_blank"]')) {
      const text = accessibleText(link);
      if (/new (?:tab|window)|opens in/i.test(`${text} ${link.getAttribute('title') ?? ''}`)) continue;
      report(link, {
        message: 'This link opens a new tab without saying so.',
        help: 'An unexpected new tab disorients people, and the Back button stops working. Say so in the link text, or let the link open in the same tab.',
        fixes: [
          {
            label: 'Add "(opens in a new tab)"',
            kind: 'suggested',
            apply() {
              link.appendChild(link.ownerDocument.createTextNode(' (opens in a new tab)'));
            },
          },
          {
            label: 'Open in the same tab',
            kind: 'suggested',
            manual: true,
            apply() {
              link.removeAttribute('target');
            },
          },
        ],
      });
    }
  },
};

export const linkFileType: Rule = {
  id: 'link-file-type',
  title: 'Links to documents should say the file type',
  severity: 'info',
  level: 'best-practice',
  check({ root, options, report }) {
    const pattern = new RegExp(`\\.(${options.fileTypes.join('|')})(?:[?#].*)?$`, 'i');
    for (const link of all(root, 'a[href]')) {
      const match = (link.getAttribute('href') ?? '').match(pattern);
      if (!match) continue;
      const type = match[1].toUpperCase().replace(/X$/, '');
      if (new RegExp(`\\b(?:${type}|${match[1]})\\b`, 'i').test(accessibleText(link))) continue;
      report(link, {
        message: `This link opens a ${type} file without saying so.`,
        help: 'People should know before they click that a link downloads a document, which may not work well on their device or with their assistive technology.',
        fixes: [
          {
            label: `Add "(${type})"`,
            kind: 'suggested',
            apply() {
              link.appendChild(link.ownerDocument.createTextNode(` (${type})`));
            },
          },
        ],
      });
    }
  },
};

export const linkSameText: Rule = {
  id: 'link-same-text',
  title: 'Links with the same text should go to the same place',
  severity: 'warning',
  level: 'AAA',
  wcag: '2.4.9',
  check({ root, options, report }) {
    const seen = new Map<string, string>();
    for (const link of all(root, 'a[href]')) {
      const text = normalize(accessibleText(link));
      if (!text || options.genericLinkText.has(text)) continue; // Already reported as generic.
      const href = (link.getAttribute('href') ?? '').replace(/\/$/, '');
      const first = seen.get(text);
      if (first === undefined) seen.set(text, href);
      else if (first !== href) {
        report(link, {
          message: `Another link with the text "${accessibleText(link)}" goes somewhere else.`,
          help: 'Links that sound the same should lead to the same place. Make the text of each one distinct.',
        });
      }
    }
  },
};

export const linkRules = [linkEmpty, linkGenericText, linkUrlText, linkNewWindow, linkFileType, linkSameText];

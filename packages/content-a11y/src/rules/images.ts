import { accessibleText, all } from '../dom';
import type { Fix, Rule } from '../types';

const FILENAME = /^[\w\-. ()%]+\.(?:jpe?g|png|gif|webp|avif|svg|bmp|tiff?|heic)$|^(?:img|image|dsc|dscn|pxl|photo|screenshot|screen shot)[\s_-]?\d[\w\s\-.:]*$/i;
const GENERIC = new Set(['image', 'img', 'photo', 'picture', 'graphic', 'icon', 'logo', 'pic', 'banner', 'spacer', 'placeholder', 'untitled', 'alt', 'alt text', 'description', 'thumbnail', 'figure', 'screenshot']);
const REDUNDANT = /^(?:an?\s+|the\s+)?(?:image|picture|photo(?:graph)?|graphic|illustration|icon)\s+(?:of|showing|shows|depicting)\s+/i;

const describeFix = (image: Element): Fix => ({
  label: 'Write alt text',
  kind: 'suggested',
  input: { label: 'Describe what the image shows or does', placeholder: 'e.g. Sales grew 12% from March to June', initial: image.getAttribute('alt') ?? '' },
  apply(value) {
    if (value !== undefined) image.setAttribute('alt', value.trim());
  },
});

const decorativeFix = (image: Element): Fix => ({
  label: 'Mark as decorative',
  kind: 'suggested',
  manual: true,
  apply() {
    image.setAttribute('alt', '');
  },
});

const inLink = (image: Element) => image.closest('a[href]') !== null;

export const imageAltMissing: Rule = {
  id: 'image-alt-missing',
  title: 'Images need alt text, or alt="" when they are decorative',
  severity: 'error',
  level: 'A',
  wcag: '1.1.1',
  check({ root, report }) {
    for (const image of all(root, 'img')) {
      if (image.hasAttribute('alt') || image.getAttribute('role') === 'presentation' || image.getAttribute('aria-hidden') === 'true') continue;
      if (inLink(image)) continue; // image-link-alt reports it with the link's purpose in mind.
      report(image, {
        message: 'This image has no alt text.',
        help: 'Screen reader users hear the file name or nothing. Describe what the image shows or does; if it is only decoration, mark it as decorative.',
        fixes: [describeFix(image), decorativeFix(image)],
      });
    }
  },
};

export const imageAltFilename: Rule = {
  id: 'image-alt-filename',
  title: 'Alt text must not be a file name or a placeholder word',
  severity: 'error',
  level: 'A',
  wcag: '1.1.1',
  check({ root, report }) {
    for (const image of all(root, 'img[alt]')) {
      const alt = (image.getAttribute('alt') ?? '').trim();
      if (!alt) continue;
      const src = (image.getAttribute('src') ?? '').split(/[?#]/)[0].split('/').pop() ?? '';
      if (FILENAME.test(alt) || (src && alt.toLowerCase() === decodeURIComponent(src).toLowerCase()) || GENERIC.has(alt.toLowerCase())) {
        report(image, {
          message: `The alt text "${alt}" does not describe the image.`,
          help: 'File names and words like "image" or "photo" tell screen reader users nothing. Describe what the image shows or does.',
          fixes: [describeFix(image), decorativeFix(image)],
        });
      }
    }
  },
};

export const imageAltRedundant: Rule = {
  id: 'image-alt-redundant',
  title: 'Alt text should not start with "image of" or "picture of"',
  severity: 'warning',
  level: 'best-practice',
  check({ root, report }) {
    for (const image of all(root, 'img[alt]')) {
      const alt = image.getAttribute('alt') ?? '';
      const match = alt.match(REDUNDANT);
      if (!match) continue;
      const rest = alt.slice(match[0].length);
      const cleaned = rest.charAt(0).toUpperCase() + rest.slice(1);
      report(image, {
        message: `The alt text starts with "${match[0].trim()}".`,
        help: 'Screen readers already say it is an image. Start with what it shows.',
        fixes: [
          {
            label: `Change to "${cleaned}"`,
            kind: 'auto',
            apply() {
              image.setAttribute('alt', cleaned);
            },
          },
        ],
      });
    }
  },
};

export const imageAltLong: Rule = {
  id: 'image-alt-long',
  title: 'Alt text should be short; put long descriptions in the text',
  severity: 'warning',
  level: 'best-practice',
  wcag: '1.1.1',
  check({ root, options, report }) {
    for (const image of all(root, 'img[alt]')) {
      const alt = (image.getAttribute('alt') ?? '').trim();
      if (alt.length <= options.maxAltLength) continue;
      report(image, {
        message: `The alt text is ${alt.length} characters long.`,
        help: `Keep alt text under ${options.maxAltLength} characters. Put a longer description (of a chart, say) in the text or a caption, where everyone can read it.`,
        fixes: [describeFix(image)],
      });
    }
  },
};

export const imageLinkAlt: Rule = {
  id: 'image-link-alt',
  title: 'A link that is only an image needs alt text saying where it goes',
  severity: 'error',
  level: 'A',
  wcag: '2.4.4',
  check({ root, report }) {
    for (const link of all(root, 'a[href]')) {
      const images = Array.from(link.querySelectorAll('img'));
      if (images.length === 0 || accessibleText(link) !== '') continue;
      report(images[0], {
        message: 'This linked image has no alt text, so the link has no name.',
        help: 'Screen readers announce just "link". Give the image alt text that says where the link goes, such as "Home page" for a logo.',
        fixes: [
          {
            label: 'Say where the link goes',
            kind: 'suggested',
            input: { label: 'Where does this link go?', placeholder: 'e.g. Home page' },
            apply(value) {
              if (value) images[0].setAttribute('alt', value.trim());
            },
          },
        ],
      });
    }
  },
};

export const iframeTitle: Rule = {
  id: 'iframe-title',
  title: 'Embedded frames (videos, maps) need a title',
  severity: 'error',
  level: 'A',
  wcag: '4.1.2',
  check({ root, report }) {
    for (const frame of all(root, 'iframe')) {
      if ((frame.getAttribute('title') ?? '').trim() || frame.getAttribute('aria-hidden') === 'true') continue;
      report(frame, {
        message: 'This embedded frame has no title.',
        help: 'Screen reader users hear "frame" with no idea what it holds. Give it a short title such as "Video: product tour".',
        fixes: [
          {
            label: 'Add a title',
            kind: 'suggested',
            input: { label: 'What does the frame show?', placeholder: 'e.g. Video: product tour' },
            apply(value) {
              if (value) frame.setAttribute('title', value.trim());
            },
          },
        ],
      });
    }
  },
};

export const mediaCaptions: Rule = {
  id: 'media-captions',
  title: 'Videos need captions',
  severity: 'warning',
  level: 'A',
  wcag: '1.2.2',
  check({ root, report }) {
    for (const video of all(root, 'video')) {
      if (video.querySelector('track[kind="captions"], track[kind="subtitles"]')) continue;
      if (video.hasAttribute('muted') && !video.hasAttribute('controls')) continue; // Silent background loop.
      report(video, {
        message: 'This video has no captions track.',
        help: 'People who cannot hear the audio need captions. Add a <track kind="captions"> file, or check that captions are burned into the video.',
      });
    }
  },
};

export const imageRules = [imageAltMissing, imageAltFilename, imageAltRedundant, imageAltLong, imageLinkAlt, iframeTitle, mediaCaptions];

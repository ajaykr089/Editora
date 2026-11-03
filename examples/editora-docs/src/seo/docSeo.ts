/**
 * Search titles and descriptions for docs pages.
 *
 * Many pages share a short title ("Checkbox", "@editora/core") with another page,
 * and many front-matter descriptions are a few words. Search results show both
 * the <title> and the description, so each page gets its section in the title
 * and a sentence about its package when its description is short. The visible
 * page heading is not changed.
 */

type Section = { match: RegExp; title: (title: string) => string; about: string };

const UI_REACT = "Part of @editora/ui-react, the free React UI kit from Editora.";

const SECTIONS: Section[] = [
  { match: /^ui-react\/(form-inputs|interactive|providers-hooks)\//, title: (t) => `${t} – React component`, about: UI_REACT },
  { match: /^ui-react(\/|$)/, title: (t) => (t.includes("ui-react") ? t : `${t} – @editora/ui-react`), about: UI_REACT },
  {
    match: /^ui-core\/./,
    title: (t) => `${t} – web component`,
    about: "Part of @editora/ui-core, Editora's framework-agnostic web component library.",
  },
  {
    match: /^plugins\//,
    title: (t) => (/plugin/i.test(t) ? t : `${t} plugin`),
    about: "A plugin for Editora, the free open-source rich text editor.",
  },
  {
    match: /^editor\/(core|react|plugins|themes|web-component)\/?$/,
    title: (t) => `${t} – getting started`,
    about: "Editora is a free, open-source rich text editor for React and the web.",
  },
  {
    match: /^packages\//,
    title: (t) => `${t} – package guide`,
    about: "Editora is a free, open-source rich text editor for React and the web.",
  },
  {
    match: /^content-tools\//,
    title: (t) => t,
    about: "Works with Editora or any other rich text editor.",
  },
  {
    match: /^toast(\/|$)/,
    title: (t) => (t === "Toast" ? "Toast notifications – @editora/toast" : t),
    about: "Part of the Editora UI kit.",
  },
  {
    match: /^(icons|react-icons|ui-core)(\/|$)/,
    title: (t) => t,
    about: "Part of the Editora UI kit.",
  },
  {
    match: /^(guide|theming|advanced)\//,
    title: (t) => `${t} – Editora guide`,
    about: "From the Editora docs: a free, open-source rich text editor for React and the web.",
  },
];

const DEFAULT_ABOUT = "From the Editora docs: a free, open-source rich text editor for React and the web.";

/** "| Editora" is added by Docusaurus; past this length search engines cut the title off. */
const MAX_TITLE = 60 - " | Editora".length;
const SHORT_DESCRIPTION = 100;
const MAX_DESCRIPTION = 160;

/**
 * Pages documenting the same component twice (form-inputs/ and interactive/).
 * Each points search engines at the fuller of the two.
 */
export const CANONICAL_PATHS: Record<string, string> = {
  "/docs/ui-react/interactive/checkbox": "/docs/ui-react/form-inputs/checkbox",
  "/docs/ui-react/interactive/color-picker": "/docs/ui-react/form-inputs/color-picker",
  "/docs/ui-react/form-inputs/combobox": "/docs/ui-react/interactive/combobox",
  "/docs/ui-react/form-inputs/date-picker": "/docs/ui-react/interactive/date-picker",
  "/docs/ui-react/interactive/date-range-picker": "/docs/ui-react/form-inputs/date-range-picker",
  "/docs/ui-react/interactive/date-time-picker": "/docs/ui-react/form-inputs/date-time-picker",
  "/docs/ui-react/interactive/file-upload": "/docs/ui-react/form-inputs/file-upload",
  "/docs/ui-react/form-inputs/form": "/docs/ui-react/interactive/form",
  "/docs/ui-react/interactive/input": "/docs/ui-react/form-inputs/input",
  "/docs/ui-react/interactive/progress": "/docs/ui-react/form-inputs/progress",
  "/docs/ui-react/interactive/radio-group": "/docs/ui-react/form-inputs/radio-group",
  "/docs/ui-react/interactive/radio": "/docs/ui-react/form-inputs/radio",
  "/docs/ui-react/interactive/select": "/docs/ui-react/form-inputs/select",
  "/docs/ui-react/form-inputs/slider": "/docs/ui-react/interactive/slider",
  "/docs/ui-react/form-inputs/stepper": "/docs/ui-react/interactive/stepper",
  "/docs/ui-react/interactive/switch": "/docs/ui-react/form-inputs/switch",
  "/docs/ui-react/interactive/textarea": "/docs/ui-react/form-inputs/textarea",
  "/docs/ui-react/interactive/time-picker": "/docs/ui-react/form-inputs/time-picker",
  "/docs/ui-react/interactive/toggle": "/docs/ui-react/form-inputs/toggle",
  "/docs/ui-react/form-inputs/tooltip": "/docs/ui-react/interactive/tooltip",
};

/** The doc's path below /docs/ (and below /docs/<version>/ for older versions). */
function docPath(permalink: string): string {
  return permalink.replace(/^\/docs\/(\d+\.\d+\.\d+\/)?/, "");
}

export function searchTitle(title: string, permalink: string): string {
  const section = SECTIONS.find((s) => s.match.test(docPath(permalink)));
  const longer = section ? section.title(title) : title;
  return longer.length <= MAX_TITLE ? longer : title;
}

export function searchDescription(description: string | undefined, permalink: string): string | undefined {
  if (!description) return description;
  const text = description.trim();
  if (text.length >= SHORT_DESCRIPTION) return text;
  const about = SECTIONS.find((s) => s.match.test(docPath(permalink)))?.about ?? DEFAULT_ABOUT;
  const joined = `${/[.!?]$/.test(text) ? text : `${text}.`} ${about}`;
  return joined.length <= MAX_DESCRIPTION ? joined : text;
}

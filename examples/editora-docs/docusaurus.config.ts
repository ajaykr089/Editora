import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const hasAlgolia =
  Boolean(process.env.DOCSEARCH_APP_ID) &&
  Boolean(process.env.DOCSEARCH_API_KEY) &&
  Boolean(process.env.DOCSEARCH_INDEX_NAME);

const config: Config = {
  title: "Editora",
  tagline: "Enterprise-grade documentation for the Editora ecosystem",
  favicon: "img/editora-mark.svg",

  future: {
    v4: true,
  },

  url: "https://editora-ecosystem.netlify.app",
  baseUrl: "/",
  trailingSlash: false,

  organizationName: "editora",
  projectName: "editora-docs",

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "docs",
          editUrl: "https://github.com/ajaykr089/Editora/tree/main/examples/editora-docs/",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          includeCurrentVersion: true,
          lastVersion: "current",
          versions: {
            current: {
              label: "Next",
            },
          },
        },
        blog: false,
        sitemap: {
          changefreq: "weekly",
          priority: 0.6,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ["@docusaurus/theme-live-codeblock"],

  plugins: [
    ...(!hasAlgolia
      ? [
          [
            "@easyops-cn/docusaurus-search-local",
            {
              indexDocs: true,
              indexPages: true,
              indexBlog: false,
              docsRouteBasePath: ["docs"],
              language: ["en"],
              hashed: true,
              highlightSearchTermsOnTargetPage: true,
              explicitSearchResultPath: true,
            },
          ],
        ]
      : []),
  ],

  themeConfig: {
    image: "img/editora-social-card.svg",
    metadata: [
      {
        name: "description",
        content:
          "Production-ready docs for Editora: core editor, React wrapper, plugins, themes, icons, and UI packages.",
      },
      {
        name: "keywords",
        content:
          "editora, rich text editor, react editor, web components, docs, plugins, ui-core, ui-react, icons",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Editora Docs" },
      { property: "og:title", content: "Editora Documentation" },
      {
        property: "og:description",
        content: "Enterprise-grade documentation for the Editora ecosystem.",
      },
      {
        property: "og:image",
        content: "https://editora-ecosystem.netlify.app/img/editora-social-card.svg",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "https://editora-ecosystem.netlify.app/img/editora-social-card.svg",
      },
    ],
    navbar: {
      title: "Editora",
      logo: {
        alt: "Editora logo",
        src: "img/editora-mark.svg",
      },
      items: [
        { to: "/docs/intro", label: "Docs", position: "left" },
        { to: "/docs/getting-started/overview", label: "Getting Started", position: "left" },
        { to: "/docs/editor/core", label: "Core", position: "left" },
        { to: "/docs/ui-react", label: "UI React", position: "left" },
        { to: "/docs/ai-usage", label: "AI", position: "left" },
        { type: "search", position: "right" },
        { type: "docsVersionDropdown", position: "right" },
        {
          href: "https://github.com/ajaykr089/Editora",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Editor",
          items: [
            { label: "@editora/core", to: "/docs/editor/core" },
            { label: "@editora/react", to: "/docs/editor/react" },
            { label: "@editora/plugins", to: "/docs/editor/plugins" },
            { label: "@editora/themes", to: "/docs/editor/themes" },
          ],
        },
        {
          title: "UI and Icons",
          items: [
            { label: "@editora/icons", to: "/docs/icons" },
            { label: "@editora/react-icons", to: "/docs/react-icons" },
            { label: "@editora/ui-core", to: "/docs/ui-core" },
            { label: "@editora/ui-react", to: "/docs/ui-react" },
          ],
        },
        {
          title: "Resources",
          items: [
            { label: "Contributing", to: "/docs/contributing/overview" },
            { label: "Migration", to: "/docs/migration/versioning-and-releases" },
            { label: "CLI", to: "/docs/reference/cli" },
            { label: "AI Guide", to: "/docs/ai-usage" },
            { label: "Prompt Pack", to: "/docs/editora-prompts" },
            { label: "Editor AI Guide", to: "/docs/editor/ai-usage" },
            { label: "Editor Prompt Pack", to: "/docs/editor/editora-prompts" },
            { label: "Toast AI Guide", to: "/docs/toast/ai-usage" },
            { label: "React Icons AI Guide", to: "/docs/react-icons/ai-usage" },
            { label: "Light Code Editor AI Guide", to: "/docs/packages/light-code-editor-ai-usage" },
            { label: "components.json", href: "https://editora-ecosystem.netlify.app/components.json" },
            { label: "GitHub", href: "https://github.com/ajaykr089/Editora" },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Editora`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "yaml", "tsx", "typescript", "diff"],
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    ...(hasAlgolia
      ? {
          algolia: {
            appId: process.env.DOCSEARCH_APP_ID ?? "",
            apiKey: process.env.DOCSEARCH_API_KEY ?? "",
            indexName: process.env.DOCSEARCH_INDEX_NAME ?? "",
            contextualSearch: true,
            searchPagePath: "search",
          },
        }
      : {}),
  } satisfies Preset.ThemeConfig,
};

export default config;

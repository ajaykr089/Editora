import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./index.module.css";

const packageCards = [
  {
    name: "@editora/core",
    role: "Framework-agnostic editor runtime and web component surface.",
    to: "/docs/editor/core",
  },
  {
    name: "@editora/react",
    role: "React wrapper with lifecycle hooks and integration controls.",
    to: "/docs/editor/react",
  },
  {
    name: "@editora/plugins",
    role: "Composable plugin catalog for authoring and workflow features.",
    to: "/docs/editor/plugins",
  },
  {
    name: "@editora/themes",
    role: "Default, dark, and custom theming foundations.",
    to: "/docs/editor/themes",
  },
  {
    name: "@editora/icons",
    role: "Framework-neutral icon assets and integration surface.",
    to: "/docs/icons",
  },
  {
    name: "@editora/react-icons",
    role: "React icon components and provider-based defaults.",
    to: "/docs/react-icons",
  },
  {
    name: "@editora/ui-core",
    role: "UI primitives and design-system-friendly building blocks.",
    to: "/docs/ui-core",
  },
  {
    name: "@editora/ui-react",
    role: "React-first UI layer for app-level composition.",
    to: "/docs/ui-react",
  },
];

const layers = [
  "Core Runtime",
  "Plugin System",
  "Theme Tokens",
  "UI Primitives",
  "Framework Adapters",
  "Application Surface",
];

const quickstart = [
  {
    title: "npm",
    command: "npm i @editora/core @editora/react @editora/plugins @editora/themes",
  },
  {
    title: "pnpm",
    command: "pnpm add @editora/core @editora/react @editora/plugins @editora/themes",
  },
  {
    title: "yarn",
    command: "yarn add @editora/core @editora/react @editora/plugins @editora/themes",
  },
];

const features = [
  "Versioned documentation",
  "Dark mode by default",
  "Algolia + local search fallback",
  "Live code playground support",
  "SEO metadata and sitemap",
  "Scalable monorepo architecture",
];

const showcaseHighlights = [
  "QuickActions, Drawer, Accordion, HoverCard, Progress, DatePicker, and DateRangePicker",
  "Patient, appointment, billing, pharmacy, lab, staff, wards, reports, and settings workflows",
  "Live local validation path for app-level UI composition and state transitions",
];

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const siteUrl = siteConfig.url.replace(/\/+$/, "");
  const showcaseIconUrl = useBaseUrl("/img/editora-mark.svg");
  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Editora Documentation",
    url: siteUrl,
    description: "Production-ready docs for the Editora ecosystem.",
    isPartOf: {
      "@type": "WebSite",
      name: "Editora Documentation",
      url: siteUrl,
    },
  };
  const packageListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: packageCards.map((pkg, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: pkg.name,
      url: `${siteUrl}${pkg.to}`,
    })),
  };

  return (
    <Layout title="Editora Docs" description="Production-ready docs for the Editora ecosystem">
      <Head>
        <meta
          name="keywords"
          content="editora docs, rich text editor docs, react ui library docs, web components documentation, editora packages"
        />
        <script type="application/ld+json">
          {JSON.stringify(collectionStructuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(packageListStructuredData)}
        </script>
      </Head>
      <main className={styles.page}>
        <section className={styles.hero}>
          <p className={styles.badge}>Editora Ecosystem</p>
          <h1>Enterprise documentation for modern editing systems.</h1>
          <p className={styles.subtitle}>
            Structured docs for core editing runtime, React integration, plugins, themes, icons, and UI packages.
            Optimized for onboarding speed, release confidence, and long-term scale.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary button--lg" to="/docs/getting-started/overview">
              Get Started
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/getting-started/about">
              Architecture
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.showcase}>
            <div className={styles.showcaseCopy}>
              <div className={styles.showcaseLabel}>
                <img className={styles.showcaseIcon} src={showcaseIconUrl} alt="" />
                <div className={styles.showcaseMeta}>
                  <p className={styles.kicker}>Advanced Showcase App</p>
                  <div className={styles.showcaseTags}>
                    <span>Hospital Ops</span>
                    <span>UI React</span>
                    <span>Realtime Testing</span>
                  </div>
                </div>
              </div>
              <h2>Hospital management demo for real app-level testing.</h2>
              <p>
                Use the hospital management example when you want to validate how Editora UI React components behave
                together inside a busy operational product instead of isolated snippets.
              </p>
              <ul className={styles.showcaseList}>
                {showcaseHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.showcaseActions}>
              <Link className="button button--primary button--lg" to="/docs/examples/hospital-management-showcase">
                Open Showcase
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/examples/live-examples">
                Browse Examples
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Ecosystem Packages</h2>
          <div className={styles.grid}>
            {packageCards.map((pkg) => (
              <article key={pkg.name} className={styles.card}>
                <h3>{pkg.name}</h3>
                <p>{pkg.role}</p>
                <Link to={pkg.to}>Open docs</Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>System Architecture</h2>
          <div className={styles.layers}>
            {layers.map((layer) => (
              <span key={layer} className={styles.layer}>
                {layer}
              </span>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Quick Install</h2>
          <div className={styles.quickstart}>
            {quickstart.map((item) => (
              <article key={item.title} className={styles.commandCard}>
                <h3>{item.title}</h3>
                <pre>
                  <code>{item.command}</code>
                </pre>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Developer Experience Baseline</h2>
          <ul className={styles.featureList}>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2>AI Assistant Integration</h2>
          <p>
            Use the AI guide and machine-readable registries to generate runnable Editora code with real imports.
          </p>
          <p>
            Editor-specific guides: <Link to="/docs/editor/ai-usage">Editor AI Usage</Link> and{" "}
            <Link to="/docs/editor/editora-prompts">Editor Prompt Pack</Link>.
          </p>
          <p>
            Package guides: <Link to="/docs/toast/ai-usage">Toast</Link>,{" "}
            <Link to="/docs/react-icons/ai-usage">React Icons</Link>, and{" "}
            <Link to="/docs/packages/light-code-editor-ai-usage">Light Code Editor</Link>.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary" to="/docs/ai-usage">
              AI Guide
            </Link>
            <Link className="button button--secondary" to="/docs/editora-prompts">
              Prompt Pack
            </Link>
            <Link className="button button--secondary" href={`${siteUrl}/components.json`}>
              components.json
            </Link>
          </div>
        </section>

        <section className={styles.trust}>
          <h2>Built for long-term maintenance</h2>
          <p>
            Editora docs are organized for multi-version releases, package ownership, API consistency, and contributor
            scalability across monorepo teams.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary" to="/docs/migration/versioning-and-releases">
              Versioning Strategy
            </Link>
            <Link className="button button--secondary" to="/docs/contributing/overview">
              Contribute
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}

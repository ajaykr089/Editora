import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import CodeBlock from "@theme/CodeBlock";
import styles from "./index.module.css";

const heroCode = `import { Editor } from "@editora/react";
import { bold, italic, link, table } from "@editora/plugins";

export function Notes() {
  return (
    <Editor
      plugins={[bold, italic, link, table]}
      theme="default"
      onChange={(doc) => save(doc)}
    />
  );
}`;

const packageGroups = [
  {
    label: "Editor",
    items: [
      { name: "@editora/core", role: "Framework-agnostic runtime and web component.", to: "/docs/editor/core" },
      { name: "@editora/react", role: "React wrapper with lifecycle hooks.", to: "/docs/editor/react" },
      { name: "@editora/plugins", role: "Composable authoring plugin catalog.", to: "/docs/editor/plugins" },
      { name: "@editora/themes", role: "Default, dark, and custom theme tokens.", to: "/docs/editor/themes" },
    ],
  },
  {
    label: "UI Kit",
    items: [
      { name: "@editora/ui-react", role: "React-first UI layer for app composition.", to: "/docs/ui-react" },
      { name: "@editora/ui-core", role: "Framework-neutral UI primitives.", to: "/docs/ui-core" },
      { name: "@editora/icons", role: "Framework-neutral icon assets.", to: "/docs/icons" },
      { name: "@editora/react-icons", role: "React icon components.", to: "/docs/react-icons" },
    ],
  },
];

const quickstart = [
  { title: "npm", command: "npm i @editora/core @editora/react @editora/plugins" },
  { title: "pnpm", command: "pnpm add @editora/core @editora/react @editora/plugins" },
  { title: "yarn", command: "yarn add @editora/core @editora/react @editora/plugins" },
];

const traits = [
  { label: "Versioned", detail: "Docs ship per release, not just for main." },
  { label: "Local-first search", detail: "Algolia when configured, indexed fallback otherwise." },
  { label: "Live playground", detail: "Editable code blocks throughout the guides." },
  { label: "Typed end to end", detail: "Every package ships its own .d.ts." },
];

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const siteUrl = siteConfig.url.replace(/\/+$/, "");
  const logoUrl = useBaseUrl("/img/brand/editora_logo_blocks.svg");

  const collectionStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Editora Documentation",
    url: siteUrl,
    description: "Production-ready docs for the Editora ecosystem.",
    isPartOf: { "@type": "WebSite", name: "Editora Documentation", url: siteUrl },
  };

  return (
    <Layout title="Editora Docs" description="Production-ready docs for the Editora ecosystem">
      <Head>
        <meta
          name="keywords"
          content="editora docs, rich text editor docs, react ui library docs, web components documentation, editora packages"
        />
        <script type="application/ld+json">{JSON.stringify(collectionStructuredData)}</script>
      </Head>

      <main className={styles.page}>
        {/* ── Hero: the editor's own API is the centerpiece ── */}
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <img src={logoUrl} alt="" width={40} height={40} className={styles.heroMark} />
            <p className={styles.eyebrow}>Editora Ecosystem</p>
            <h1>A rich-text editor you can actually read the source of.</h1>
            <p className={styles.subtitle}>
              Core runtime, React bindings, a plugin system, and a matching UI kit —
              versioned, typed, and documented as one coherent system.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/docs/getting-started/overview">
                Get started
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/getting-started/about">
                Read the architecture
              </Link>
            </div>
            <div className={styles.heroMeta}>
              <span><strong>8</strong> packages</span>
              <span className={styles.dot}>·</span>
              <span>MIT licensed</span>
              <span className={styles.dot}>·</span>
              <span>Tree-shakeable</span>
            </div>
          </div>

          <div className={styles.heroCodeWrap}>
            <div className={styles.heroCodeChrome}>
              <span className={styles.heroCodeDot} />
              <span className={styles.heroCodeDot} />
              <span className={styles.heroCodeDot} />
              <span className={styles.heroCodeFile}>notes.tsx</span>
            </div>
            <CodeBlock language="tsx">{heroCode}</CodeBlock>
          </div>
        </section>

        {/* ── Quick install ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionEyebrow}>Install</h2>
          <div className={styles.quickstart}>
            {quickstart.map((item) => (
              <div key={item.title} className={styles.commandCard}>
                <span className={styles.commandLabel}>{item.title}</span>
                <code className={styles.commandText}>{item.command}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ── Packages, grouped not flattened ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionEyebrow}>Packages</h2>
          {packageGroups.map((group) => (
            <div key={group.label} className={styles.packageGroup}>
              <h3 className={styles.packageGroupLabel}>{group.label}</h3>
              <div className={styles.grid}>
                {group.items.map((pkg) => (
                  <Link key={pkg.name} to={pkg.to} className={styles.card}>
                    <code className={styles.cardName}>{pkg.name}</code>
                    <p className={styles.cardRole}>{pkg.role}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ── Showcase ── */}
        <section className={styles.section}>
          <div className={styles.showcase}>
            <div className={styles.showcaseCopy}>
              <p className={styles.kicker}>Reference application</p>
              <h2>A hospital ops dashboard, built entirely on the UI kit</h2>
              <p>
                Patient records, appointments, billing, pharmacy, and lab workflows —
                exercising drawers, accordions, date pickers, and tables together in a
                real, busy interface instead of isolated snippets.
              </p>
            </div>
            <div className={styles.showcaseActions}>
              <Link className="button button--primary" to="/docs/examples/hospital-management-showcase">
                Open showcase
              </Link>
              <Link className="button button--secondary" to="/docs/examples/live-examples">
                Browse examples
              </Link>
            </div>
          </div>
        </section>

        {/* ── Traits, dense single row ── */}
        <section className={styles.section}>
          <div className={styles.traits}>
            {traits.map((t) => (
              <div key={t.label} className={styles.trait}>
                <span className={styles.traitLabel}>{t.label}</span>
                <span className={styles.traitDetail}>{t.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI integration ── */}
        <section className={styles.sectionBordered}>
          <p className={styles.kicker}>For AI assistants</p>
          <h2>Machine-readable component registry</h2>
          <p>
            Generate runnable Editora code with real imports via the AI guide and{" "}
            <code>components.json</code>.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary" to="/docs/ai-usage">
              AI guide
            </Link>
            <Link className="button button--secondary" to="/docs/editora-prompts">
              Prompt pack
            </Link>
            <Link className="button button--secondary" href={`${siteUrl}/components.json`}>
              components.json
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}

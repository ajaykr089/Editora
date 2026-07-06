import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import styles from "./404.module.css";

const QUICK_LINKS = [
  { label: "Get started",      to: "/docs/getting-started/overview" },
  { label: "Core editor",      to: "/docs/editor/core" },
  { label: "React package",    to: "/docs/editor/react" },
  { label: "UI Kit",           to: "/docs/ui-react" },
  { label: "Examples",         to: "/docs/examples/hospital-management-showcase" },
  { label: "API reference",    to: "/docs/reference/api" },
];

export default function NotFound(): JSX.Element {
  const logoUrl = useBaseUrl("/img/brand/editora_logo_blocks.svg");

  return (
    <Layout title="Page not found" description="This page doesn't exist in the Editora docs.">
      <main className={styles.page}>
        <div className={styles.card}>
          <img src={logoUrl} alt="" width={40} height={40} className={styles.mark} />
          <p className={styles.code}>404</p>
          <h1 className={styles.heading}>Page not found</h1>
          <p className={styles.body}>
            This URL doesn't exist in the docs. It may have moved, been renamed,
            or never existed. Try one of these instead:
          </p>

          <div className={styles.links}>
            {QUICK_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className={styles.link}>
                {l.label}
                <span className={styles.arrow}>→</span>
              </Link>
            ))}
          </div>

          <div className={styles.actions}>
            <Link className="button button--primary" to="/docs/intro">
              Back to docs
            </Link>
            <Link className="button button--secondary" to="/">
              Homepage
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}

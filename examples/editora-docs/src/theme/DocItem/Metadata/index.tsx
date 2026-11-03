/**
 * Replaces the theme's DocItem/Metadata (swizzled) to give each docs page a
 * search title, a fuller description, TechArticle structured data, and a
 * canonical URL for pages that duplicate another page. See src/seo/docSeo.ts.
 */
import React from "react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { PageMetadata } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { CANONICAL_PATHS, searchDescription, searchTitle } from "../../../seo/docSeo";

export default function DocItemMetadata(): JSX.Element {
  const { metadata, frontMatter, assets } = useDoc();
  const { siteConfig } = useDocusaurusContext();
  const siteUrl = siteConfig.url;
  const title = searchTitle(metadata.title, metadata.permalink);
  const description = searchDescription(metadata.description, metadata.permalink);
  const canonicalPath = CANONICAL_PATHS[metadata.permalink];
  const url = `${siteUrl}${canonicalPath ?? metadata.permalink}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: metadata.title,
    description,
    url,
    inLanguage: "en",
    image: `${siteUrl}/img/editora-social-card.png`,
    ...(metadata.lastUpdatedAt ? { dateModified: new Date(metadata.lastUpdatedAt).toISOString() } : {}),
    ...(frontMatter.keywords?.length ? { keywords: frontMatter.keywords.join(", ") } : {}),
    isPartOf: { "@type": "WebSite", name: `${siteConfig.title} Documentation`, url: siteUrl },
    about: { "@type": "SoftwareApplication", name: siteConfig.title, url: siteUrl },
    publisher: { "@type": "Organization", name: siteConfig.title, url: siteUrl },
  };

  return (
    <>
      <PageMetadata
        title={title}
        description={description}
        keywords={frontMatter.keywords}
        image={assets.image ?? frontMatter.image}
      />
      <Head>
        {canonicalPath && <link rel="canonical" href={url} />}
        {canonicalPath && <meta property="og:url" content={url} />}
        <script type="application/ld+json">{JSON.stringify(article)}</script>
      </Head>
    </>
  );
}

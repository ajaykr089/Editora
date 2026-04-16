---
title: SEO Strategy
description: Canonical URL, robots, sitemap, structured data, and verification guidance for Editora docs.
keywords: [seo, sitemap, robots, canonical, search console, indexing]
---

# SEO Strategy

Use this page as the operational checklist for search indexing on the docs site.

## What ships in the docs app

- Canonical site URL from `DOCS_SITE_URL`
- Sitemap generation at `/sitemap.xml`
- `robots.txt` generation before `start`, `build`, and `serve`
- Website and organization JSON-LD
- OpenGraph and Twitter card metadata
- Optional Google and Bing verification tags
- Preview deploy `noindex` support through `DOCS_NO_INDEX`

## Recommended production env vars

```bash
DOCS_SITE_URL=https://editora-ecosystem.netlify.app/
DOCS_STORYBOOK_URL=https://editora-ecosystem-storybook.netlify.app/
GOOGLE_SITE_VERIFICATION=your-google-token
BING_SITE_VERIFICATION=your-bing-token
DOCS_TWITTER_HANDLE=@editora
```

## Preview deploys

Set `DOCS_NO_INDEX=true` for preview or branch deploys. This prevents duplicate-content indexing and keeps search engines focused on the canonical production host.

## Search console checklist

1. Deploy the docs with the real production `DOCS_SITE_URL`.
2. Verify ownership in Google Search Console and Bing Webmaster Tools.
3. Submit `/sitemap.xml`.
4. Check that preview deploys send `noindex`.
5. Monitor coverage, canonicals, and duplicate-title warnings after the first crawl.

## Content guidance

- Keep one clear search intent per page.
- Prefer stable slugs over frequent route changes.
- Use descriptive titles and frontmatter descriptions.
- Cross-link package pages, guides, examples, and component docs.

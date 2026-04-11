#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const siteUrl = (process.env.DOCS_SITE_URL || "https://editora-ecosystem.netlify.app").replace(/\/+$/, "");
const shouldNoIndex = /^(1|true|yes)$/i.test(process.env.DOCS_NO_INDEX || "");

const staticDir = path.join(__dirname, "..", "static");
const robotsPath = path.join(staticDir, "robots.txt");

fs.mkdirSync(staticDir, { recursive: true });

const robotsLines = [
  "User-agent: *",
  shouldNoIndex ? "Disallow: /" : "Allow: /",
  `Sitemap: ${siteUrl}/sitemap.xml`,
];

fs.writeFileSync(robotsPath, `${robotsLines.join("\n")}\n`, "utf8");

console.log(`Wrote ${path.relative(process.cwd(), robotsPath)} for ${shouldNoIndex ? "noindex" : "index"} mode.`);

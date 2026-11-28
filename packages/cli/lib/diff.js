/* `editora diff`: what changed in copied components, here and upstream.
 *
 * For every file editora.json recorded, three versions meet: the hash written at copy time, the file as it is now,
 * and what copying again would write (same source, prefix, folder and JS setting). From them:
 *   up-to-date   nobody changed it
 *   update       upstream changed, you did not: `editora add <name> --copy` updates it
 *   local        you changed it, upstream did not
 *   conflict     both changed: merge by hand, or --overwrite to take upstream
 *   missing      you deleted it
 *   new          upstream now needs a file you do not have
 */
const fs = require("fs");
const path = require("path");
const { copyComponents, CONFIG_FILE } = require("./copy");
const { sha256 } = require("./copy-index");

/** A unified diff of two texts (Myers-free, LCS on lines; fine for source files). */
function unifiedDiff(a, b, { from = "a", to = "b", context = 3 } = {}) {
  const x = a.split("\n");
  const y = b.split("\n");
  const n = x.length;
  const m = y.length;
  // LCS table from the end, as 16-bit rows to stay small.
  const lcs = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) for (let j = m - 1; j >= 0; j -= 1) lcs[i][j] = x[i] === y[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && x[i] === y[j]) ops.push([" ", x[i++], i, j++ + 1]);
    else if (j < m && (i >= n || lcs[i][j + 1] > lcs[i + 1][j])) ops.push(["+", y[j++], i, j]);
    else ops.push(["-", x[i++], i, j]);
  }
  const changed = ops.map((op, k) => (op[0] !== " " ? k : -1)).filter((k) => k >= 0);
  if (!changed.length) return "";
  const out = [`--- ${from}`, `+++ ${to}`];
  let k = 0;
  while (k < changed.length) {
    const start = Math.max(0, changed[k] - context);
    let end = Math.min(ops.length - 1, changed[k] + context);
    while (k + 1 < changed.length && changed[k + 1] - context <= end + 1) {
      k += 1;
      end = Math.min(ops.length - 1, changed[k] + context);
    }
    const hunk = ops.slice(start, end + 1);
    const aStart = (hunk.find((op) => op[0] !== "+") || [0, 0, 0])[2] || 1;
    const bStart = (hunk.find((op) => op[0] !== "-") || [0, 0, 0, 0])[3] || 1;
    const aLen = hunk.filter((op) => op[0] !== "+").length;
    const bLen = hunk.filter((op) => op[0] !== "-").length;
    out.push(`@@ -${aStart},${aLen} +${bStart},${bLen} @@`);
    for (const op of hunk) out.push(`${op[0]}${op[1]}`);
    k += 1;
  }
  return `${out.join("\n")}\n`;
}

/**
 * @param {string[]} names  components to compare (default: every copied one)
 * @param {{ projectDir: string, source?: string, indexFile?: string, registry?: string, fetch?: Function }} options
 */
async function diffCopies(names, options) {
  const projectDir = options.projectDir;
  const configFile = path.join(projectDir, CONFIG_FILE);
  if (!fs.existsSync(configFile)) throw new Error(`No ${CONFIG_FILE} here: nothing has been copied with --copy yet.`);
  const saved = JSON.parse(fs.readFileSync(configFile, "utf8")).copy;
  if (!saved || !saved.components || !saved.components.length) throw new Error(`${CONFIG_FILE} lists no copied components.`);
  const wanted = names.length ? names : saved.components;
  const unknown = wanted.filter((name) => !saved.components.some((c) => c.toLowerCase() === String(name).toLowerCase()));
  if (unknown.length) throw new Error(`Not copied here: ${unknown.join(", ")} (copied: ${saved.components.join(", ")}).`);

  // Copy again, on paper: React components and blocks by name, elements (ui-*) as elements.
  const base = { projectDir, dryRun: true, collect: true, source: options.source, indexFile: options.indexFile, fetch: options.fetch, registry: options.registry || saved.registry, js: saved.js || undefined };
  const planned = new Map();
  const asElements = wanted.filter((name) => /^ui-/.test(name));
  const asReact = wanted.filter((name) => !/^ui-/.test(name));
  for (const [list, react] of [[asReact, true], [asElements, false]]) {
    if (!list.length) continue;
    const report = await copyComponents(list, { ...base, react });
    if (report.unknown) throw new Error(`The source no longer has: ${report.unknown.join(", ")}.`);
    for (const entry of report.files) planned.set(entry.file, entry);
  }

  const recorded = saved.files || {};
  const files = [];
  for (const [file, entry] of [...planned].sort(([a], [b]) => a.localeCompare(b))) {
    const abs = path.join(projectDir, file);
    const was = recorded[file];
    if (!fs.existsSync(abs)) {
      files.push({ file, status: was ? "missing" : "new", upstream: entry.content });
      continue;
    }
    const local = fs.readFileSync(abs, "utf8");
    const localHash = sha256(local);
    const upstreamChanged = was ? entry.hash !== was : entry.hash !== localHash;
    const localChanged = was ? localHash !== was : entry.hash !== localHash;
    let status = "up-to-date";
    if (localHash === entry.hash) status = "up-to-date";
    else if (upstreamChanged && localChanged) status = "conflict";
    else if (upstreamChanged) status = "update";
    else if (localChanged) status = "local";
    files.push({ file, status, ...(status === "up-to-date" ? {} : { patch: unifiedDiff(local, entry.content, { from: `${file} (yours)`, to: `${file} (upstream)` }) }) });
  }
  const counts = files.reduce((acc, f) => ({ ...acc, [f.status]: (acc[f.status] || 0) + 1 }), {});
  return { components: wanted, files, counts, commit: saved.commit || null };
}

module.exports = { diffCopies, unifiedDiff };

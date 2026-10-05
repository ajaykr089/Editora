const { describe, it, expect } = require('@jest/globals');
const fs = require('fs');
const path = require('path');

// Toolbar icons are inline SVG strings, and every icon of every enabled plugin lands in the same
// document. Design-tool exports (SVG Repo, Carbon, ...) carry ids such as "icon",
// "SVGRepo_iconCarrier" or "_Transparent_Rectangle_" on their wrapper groups: dozens of duplicates
// per editor (invalid HTML), and generic names like "icon" that collide with the host page's own
// elements for getElementById / #icon selectors. An id is only legitimate when the same svg
// references it (gradients, clip paths, masks).

const pluginsDir = path.resolve(__dirname, '..');

function pluginSourceFiles() {
  return fs
    .readdirSync(pluginsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !['shared', 'node_modules', 'dist'].includes(entry.name))
    .flatMap((entry) => {
      const srcDir = path.join(pluginsDir, entry.name, 'src');
      if (!fs.existsSync(srcDir)) return [];
      return fs
        .readdirSync(srcDir)
        .filter((file) => /\.(ts|tsx|js)$/.test(file) && !/\.test\.|\.d\.ts$/.test(file))
        .map((file) => path.join(srcDir, file));
    });
}

describe('toolbar icon svgs', () => {
  it('carry no ids that nothing references', () => {
    const offenders = [];

    for (const file of pluginSourceFiles()) {
      const source = fs.readFileSync(file, 'utf8');
      for (const [svg] of source.matchAll(/<svg[\s\S]*?<\/svg>/g)) {
        for (const [, id] of svg.matchAll(/\sid=\\?["']([^"'\\]+)\\?["']/g)) {
          const referenced = svg.includes(`#${id}`);
          if (!referenced) offenders.push(`${path.relative(pluginsDir, file)}: id="${id}"`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});

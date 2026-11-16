import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

// table.css is loaded by every app that uses the editor (it is part of @editora/plugins/styles.css).
// A bare `table` selector restyled every table on the page: admin data tables got a 16px margin,
// a second border and, in dark mode, the editor's table background.
const css = readFileSync(join(__dirname, '..', 'table.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const selectors = Array.from(css.matchAll(/([^{}]+)\{/g))
  .map((match) => match[1].trim())
  .filter((prelude) => !prelude.startsWith('@'))
  .flatMap((prelude) => prelude.split(/,(?![^(]*\))/).map((part) => part.trim()));

describe('table.css', () => {
  it('only styles tables inside an editor', () => {
    const leaking = selectors.filter((selector) => /(^|[\s(>+~])(table|thead|tbody|tr|td|th)(?=$|[\s:.[>+~)])/.test(selector.replace(/:where\(\.rte-content, \.editora-content\) table/g, 'SCOPED')) && !/\.rte-table|SCOPED|\.resize-handle/.test(selector.replace(/:where\(\.rte-content, \.editora-content\) table/g, 'SCOPED')));
    expect(leaking).toEqual([]);
  });
});

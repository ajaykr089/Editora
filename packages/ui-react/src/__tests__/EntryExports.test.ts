import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Every `@editora/ui-react/<Name>` entry can be imported either way:
//   import Checkbox from '@editora/ui-react/Checkbox'
//   import { Checkbox } from '@editora/ui-react/Checkbox'
// A default import of an entry that only had a named export rendered "Element type is invalid".
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf8')) as { exports: Record<string, unknown> };
// Modules that group several components under one entry: no single default makes sense.
const GROUPS = new Set(['FieldSemantics']);
const entries = Object.keys(pkg.exports)
  .map((key) => /^\.\/([A-Z][A-Za-z]+)$/.exec(key)?.[1])
  .filter((name): name is string => !!name && !GROUPS.has(name));

describe('component entries', () => {
  it.each(entries)('%s has a default export equal to its named export', async (name) => {
    const mod = (await import(`../components/${name}.tsx`)) as Record<string, unknown>;
    expect(mod[name], `named export ${name}`).toBeTruthy();
    expect(mod.default, 'default export').toBe(mod[name]);
  });
});

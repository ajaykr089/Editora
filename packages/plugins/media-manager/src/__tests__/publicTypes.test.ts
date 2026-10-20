import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as api from '../index';

/**
 * The types that people get are written by hand (`index.d.ts` in this package and in `@editora/plugins`), not made
 * from the source. These tests fail when something is exported from the source and not declared there, so that what
 * the plugin can do and what TypeScript says it can do do not drift apart again (they did, for a whole redesign).
 */
const text = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const mediaDts = text('../../index.d.ts');
const pluginsDts = text('../../../index.d.ts');
const source = text('../index.ts');

const runtimeExports = Object.keys(api);
const typeExports = [...source.matchAll(/export type \{([^}]+)\}/g)]
  .flatMap((match) => match[1].split(','))
  .map((name) => name.trim())
  .filter(Boolean);

const declares = (dts: string, name: string) => new RegExp(`export (?:declare )?(?:function|class|const|interface|type) ${name}\\b`).test(dts);

describe('the declared types', () => {
  it('know every runtime export of the plugin', () => {
    expect(runtimeExports.length).toBeGreaterThan(8);
    for (const name of runtimeExports) {
      expect(declares(mediaDts, name), `@editora/media-manager does not declare ${name}`).toBe(true);
      expect(declares(pluginsDts, name), `@editora/plugins does not declare ${name}`).toBe(true);
    }
  });

  it('know every type the plugin exports', () => {
    expect(typeExports.length).toBeGreaterThan(8);
    for (const name of typeExports) {
      expect(declares(mediaDts, name), `@editora/media-manager does not declare the type ${name}`).toBe(true);
      expect(declares(pluginsDts, name), `@editora/plugins does not declare the type ${name}`).toBe(true);
    }
  });

  it('are the same in both packages', () => {
    const block = pluginsDts.slice(pluginsDts.indexOf('// ── Media manager'), pluginsDts.indexOf('// ─────────────'));
    const inPlugins = block.split('\n').slice(1).join('\n').trim();
    const inMedia = mediaDts.replace(/^import type[^\n]*\n\n/, '').trim();
    expect(inPlugins).toBe(inMedia);
  });

  it('let the plugin take settings, which the first declaration did not', () => {
    expect(mediaDts).toMatch(/export function MediaManagerPlugin\(config\?: Partial<MediaManagerConfig>\): Plugin;/);
    expect(pluginsDts).not.toMatch(/export function MediaManagerPlugin\(\): Plugin;/);
    expect(pluginsDts).not.toMatch(/export type MediaManagerConfig = Record<string, unknown>;/);
  });
});

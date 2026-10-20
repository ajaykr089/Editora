import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as api from '../index';

/**
 * The types of `@editora/plugins` are written by hand (`packages/plugins/index.d.ts`), not made from the source (the
 * standalone `@editora/media-manager` gets generated ones: `npm run build:types`). These tests fail when something is
 * exported from the source and not declared there, so that what the plugin can do and what TypeScript says it can do
 * do not drift apart again (they did, for a whole redesign).
 */
const text = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
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
      expect(declares(pluginsDts, name), `@editora/plugins does not declare ${name}`).toBe(true);
    }
  });

  it('know every type the plugin exports', () => {
    expect(typeExports.length).toBeGreaterThan(8);
    for (const name of typeExports) {
      expect(declares(pluginsDts, name), `@editora/plugins does not declare the type ${name}`).toBe(true);
    }
  });

  it('let the plugin take settings, which the first declaration did not', () => {
    expect(pluginsDts).toMatch(/export function MediaManagerPlugin\(config\?: Partial<MediaManagerConfig>\): Plugin;/);
    expect(pluginsDts).not.toMatch(/export function MediaManagerPlugin\(\): Plugin;/);
    expect(pluginsDts).not.toMatch(/export type MediaManagerConfig = Record<string, unknown>;/);
  });
});

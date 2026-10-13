import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Importing one wrapper from its own entry (`@editora/ui-react/TimeField`) has to define the
 * elements that wrapper renders, and nothing else has to be loaded to make it work. This file
 * imports ONLY the wrappers below, in a fresh jsdom, so a custom element that is defined here was
 * defined by the wrapper's own imports and not by another test or by the package root.
 */
describe('deep-imported wrappers define the elements they render', () => {
  it('defines nothing before a wrapper is imported', () => {
    expect(customElements.get('ui-time-field')).toBeUndefined();
    expect(customElements.get('ui-sortable')).toBeUndefined();
  });

  it('TimeField (exported by DateField)', async () => {
    await import('../components/DateField');
    expect(customElements.get('ui-date-field')).toBeDefined();
    expect(customElements.get('ui-time-field')).toBeDefined();
  });

  it('Dropzone (exported by FileUpload)', async () => {
    await import('../components/FileUpload');
    expect(customElements.get('ui-file-upload')).toBeDefined();
    expect(customElements.get('ui-dropzone')).toBeDefined();
  });

  it('Description, FieldError, ControlGroup and Fieldset (exported by FieldSemantics)', async () => {
    await import('../components/FieldSemantics');
    for (const tag of ['ui-description', 'ui-field-error', 'ui-control-group', 'ui-fieldset']) {
      expect(customElements.get(tag), tag).toBeDefined();
    }
  });

  it('Sortable', async () => {
    await import('../components/Sortable');
    expect(customElements.get('ui-sortable')).toBeDefined();
  });

  it('does not load the rest of the catalog for it', () => {
    // Elements that none of the wrappers above renders or imports.
    for (const tag of ['ui-chart', 'ui-data-table', 'ui-dialog', 'ui-color-picker']) {
      expect(customElements.get(tag), tag).toBeUndefined();
    }
  });
});

describe('wrapper sources', () => {
  const dir = resolve(dirname(fileURLToPath(import.meta.url)), '../components');
  const files = readdirSync(dir).filter((file) => /\.tsx?$/.test(file));

  it('never import the whole @editora/ui-core catalog (only the components barrel does)', () => {
    const offenders = files.filter((file) => {
      if (file === 'index.ts') return false;
      // `import type` is erased, so it does not load anything.
      const source = readFileSync(join(dir, file), 'utf8').replace(/import\s+type\s[^;]*?from\s*['"][^'"]+['"];?/g, '');
      return /(?:import|from)\s*\(?\s*['"]@editora\/ui-core['"]/.test(source);
    });
    expect(offenders).toEqual([]);
  });
});

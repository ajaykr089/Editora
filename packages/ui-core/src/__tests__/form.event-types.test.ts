import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';

// ui-core's tsconfig skips test files, so type assertions inside a test never get checked. This test
// runs the compiler on a small consumer file instead.
const formModule = path.resolve(__dirname, '../components/ui-form.ts').replace(/\\/g, '/');

function diagnosticsFor(source: string): string[] {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-form-types-'));
  const file = path.join(dir, 'consumer.ts');
  fs.writeFileSync(file, `import '${formModule.replace(/\.ts$/, '')}';\n${source}\nexport {};\n`);
  const program = ts.createProgram([file], {
    noEmit: true,
    strict: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
    skipLibCheck: true,
    types: []
  });
  const sourceFile = program.getSourceFile(file)!;
  const diagnostics = [...program.getSemanticDiagnostics(sourceFile), ...program.getSyntacticDiagnostics(sourceFile)];
  fs.rmSync(dir, { recursive: true, force: true });
  return diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
}

describe('ui-form event types', () => {
  it('a submit listener gets a CustomEvent with detail.values', () => {
    expect(
      diagnosticsFor(`
        const form = document.createElement('ui-form');
        form.addEventListener('submit', (event) => { const values: Record<string, unknown> = event.detail.values; void values; });
        form.addEventListener('invalid', (event) => { const errors: Record<string, string | undefined> = event.detail.errors; void errors; });
        form.addEventListener('dirty-change', (event) => { const dirty: boolean = event.detail.dirty; void dirty; });
        form.addEventListener('autosave', (event) => { void event.detail.values; });
        form.addEventListener('validate', (event) => { const ok: boolean = event.detail.valid; void ok; });
        form.addEventListener('click', (event) => { const x: number = event.clientX; void x; });
        const found = document.querySelector('ui-form');
        found?.addEventListener('submit', (event) => { void event.detail.values; });
      `)
    ).toEqual([]);
  });

  it('it is no longer the browser SubmitEvent (which has no detail)', () => {
    const errors = diagnosticsFor(`
      const form = document.createElement('ui-form');
      form.addEventListener('submit', (event) => { const native: SubmitEvent = event; void native; });
    `);
    expect(errors.length).toBeGreaterThan(0);
  });
});

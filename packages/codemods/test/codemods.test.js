import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { transform } from '../src/transforms/text-field-on-commit.js';
import { run } from '../src/index.js';

const bin = fileURLToPath(new URL('../bin/editora-codemods.js', import.meta.url));

test('renames onChange to onCommit on Input and Textarea, keeping formatting and comments', () => {
  const source = `import { Input, Textarea, Select } from '@editora/ui-react';

export function Profile({ save }) {
  return (
    <>
      {/* saved when the field is left */}
      <Input label="Name" onChange={(value) => save('name', value)} />
      <Textarea
        label="Bio"
        onChange={save}
      />
      <Select label="Role" onChange={save} />
    </>
  );
}
`;
  const { output, changes, warnings } = transform(source, 'Profile.jsx');
  assert.equal(changes, 2);
  assert.deepEqual(warnings, []);
  assert.equal(output, source.replace('<Input label="Name" onChange', '<Input label="Name" onCommit').replace('        onChange={save}', '        onCommit={save}'));
  assert.match(output, /<Select label="Role" onChange=\{save\} \/>/);
});

test('follows aliases, namespace imports and the per-component entries', () => {
  const source = `import UIInput from '@editora/ui-react/Input';
import * as UI from '@editora/ui-react';
import { Textarea as Notes } from '@editora/ui-react/client';
const a = <UIInput onChange={f} />;
const b = <UI.Textarea onChange={f}></UI.Textarea>;
const c = <Notes onChange={f} />;
const d = <UI.Select onChange={f} />;
`;
  const { output, changes } = transform(source, 'a.tsx');
  assert.equal(changes, 3);
  assert.equal((output.match(/onCommit/g) || []).length, 3);
  assert.match(output, /<UI\.Select onChange=\{f\} \/>/);
});

test('leaves other libraries alone, and code without Editora untouched', () => {
  const other = `import { Input } from 'some-other-ui';\nconst x = <Input onChange={f} />;\n`;
  assert.equal(transform(other, 'x.jsx').changes, 0);
  const typesOnly = `import type { InputProps } from '@editora/ui-react';\nconst x = <Input onChange={f} />;\n`;
  assert.equal(transform(typesOnly, 'x.tsx').changes, 0);
});

test('asks for a check instead of guessing', () => {
  const source = `import { Input } from '@editora/ui-react';
const a = <Input onChange={f} onCommit={g} />;
const b = <Input {...fieldProps} />;
`;
  const { output, changes, warnings } = transform(source, 'form.tsx');
  assert.equal(changes, 0);
  assert.equal(output, source);
  assert.equal(warnings.length, 2);
  assert.match(warnings[0], /^form\.tsx:2:\d+ Input has both onChange and onCommit/);
  assert.match(warnings[1], /^form\.tsx:3:\d+ Input spreads props/);
});

test('parses TypeScript generics and plain .js files with JSX', () => {
  const ts = `import { Input } from '@editora/ui-react';\nconst id = <T,>(value: T): T => value;\nexport const A = () => <Input onChange={id<string>} />;\n`;
  assert.equal(transform(ts, 'a.tsx').changes, 1);
  const js = `import { Input } from '@editora/ui-react';\nexport const A = () => <Input onChange={f} />;\n`;
  assert.equal(transform(js, 'a.js').changes, 1);
});

test('the CLI walks folders, skips node_modules, and writes only without --dry', () => {
  const dir = mkdtempSync(join(tmpdir(), 'editora-codemods-'));
  try {
    mkdirSync(join(dir, 'src'));
    mkdirSync(join(dir, 'node_modules', 'pkg'), { recursive: true });
    const app = `import { Input } from '@editora/ui-react';\nexport const A = () => <Input onChange={f} />;\n`;
    writeFileSync(join(dir, 'src', 'A.tsx'), app);
    writeFileSync(join(dir, 'node_modules', 'pkg', 'B.tsx'), app);

    const dry = execFileSync(process.execPath, [bin, 'text-field-on-commit', 'src', '--dry'], { cwd: dir, encoding: 'utf8' });
    assert.match(dry, /would update src\/A\.tsx \(1\)/);
    assert.equal(readFileSync(join(dir, 'src', 'A.tsx'), 'utf8'), app);

    const result = run('text-field-on-commit', [dir], { cwd: dir });
    assert.deepEqual(result.files.map((file) => file.path), ['src/A.tsx']);
    assert.match(readFileSync(join(dir, 'src', 'A.tsx'), 'utf8'), /onCommit=\{f\}/);
    assert.equal(readFileSync(join(dir, 'node_modules', 'pkg', 'B.tsx'), 'utf8'), app);

    assert.throws(() => run('nope', [dir]), /Unknown codemod "nope"/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

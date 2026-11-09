import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The "*" after a required field's label is visual: screen readers already hear "required" from
// the control. Twelve fields left it readable, so "Amount" was announced "Amount star".
describe('required markers', () => {
  it('are hidden from screen readers in every component', () => {
    const dir = join(__dirname, '../components');
    const offenders = readdirSync(dir)
      .filter((file) => file.endsWith('.ts'))
      .flatMap((file) => (readFileSync(join(dir, file), 'utf8').match(/<span class="required"[^>]*>/g) || []).filter((tag) => !tag.includes('aria-hidden="true"')).map(() => file));
    expect(offenders).toEqual([]);
  });
});

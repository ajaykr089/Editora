import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// react-dom/server is about 120 KB gzipped. A static import from a client component puts it in
// every app that uses that component (Sidebar did, for icon HTML). Load it on demand instead.
describe('client components', () => {
  it('never import react-dom/server statically', () => {
    const dir = join(__dirname, '../components');
    const offenders = readdirSync(dir)
      .filter((file) => /\.tsx?$/.test(file))
      .filter((file) => /^\s*import[^;]*from\s+['"]react-dom\/server(\.browser)?['"]/m.test(readFileSync(join(dir, file), 'utf8')));
    expect(offenders).toEqual([]);
  });
});

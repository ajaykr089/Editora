import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-data-table';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
afterEach(() => { document.body.innerHTML = ''; });

describe('ui-data-table layout="auto"', () => {
  it('lets columns size to their content, except when resizing or virtualizing needs fixed widths', async () => {
    document.body.innerHTML = `<ui-data-table layout="auto"><table>
      <thead><tr><th>ID</th><th>Name</th></tr></thead>
      <tbody><tr><td>1</td><td>Ada Lovelace</td></tr></tbody></table></ui-data-table>`;
    await tick();
    const css = document.head.textContent || '';
    expect(css).toMatch(/table-layout: fixed;/);
    expect(css).toMatch(
      /ui-data-table\[layout="auto"\]:not\(\[headless\]\):not\(\[resizable-columns\]\):not\(\[virtualize\]\) > table \{\s*table-layout: auto;/
    );
  });
});

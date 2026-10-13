// Run checks for the examples of the @editora/light-code-editor README.
export default async function checks({ run }) {
  const text = (page) => page.$eval('[contenteditable]', (el) => el.textContent ?? '');

  await run('lce-quick-start', async (page, { logs }) => {
    const found = await page.evaluate(() => ({
      gutter: !!document.querySelector('[data-editor-gutter="true"]'),
      tokens: document.querySelectorAll('[data-editora-editor] span').length,
      folds: document.querySelectorAll('[class*="fold"]').length,
    }));
    if (!found.gutter) return 'there is no line-number gutter';
    if (found.tokens < 5) return 'the code is not syntax highlighted';
    await page.click('[contenteditable]');
    await page.keyboard.type('x');
    await page.waitForTimeout(300);
    return logs.some((line) => line.startsWith('Content changed:')) ? true : "the 'change' event did not fire";
  });

  await run('lce-react', async (page) => {
    const before = await page.textContent('p');
    await page.click('[contenteditable]');
    await page.keyboard.press('Control+End');
    await page.keyboard.type('// note');
    await page.waitForTimeout(300);
    const after = await page.textContent('p');
    if (before === after) return `typing did not reach React state (${after})`;
    await page.click('button:text-is("Reset")');
    await page.waitForTimeout(300);
    // The editor ends its last line with a zero-width space.
    return (await text(page)).replace(/[\u200b\s]+$/, '') === '{}' ? true : `Reset did not push the new value into the editor (${JSON.stringify(await text(page))})`;
  });

  await run('lce-language-service', async (page) => {
    await page.waitForTimeout(500);
    const body = await page.textContent('body');
    if (!/1 warning/.test(body ?? '')) return 'the diagnostic is not reported in the status line';
    if (!/Remove inline onclick handler/.test(body ?? '')) return 'the code action is not offered';
    await page.click('text=Remove inline onclick handler');
    await page.waitForTimeout(300);
    return /onclick/.test(await text(page)) ? 'the code action did not remove the handler' : true;
  });

  await run('lce-custom-extension', async (page) => {
    const content = await text(page);
    return /^\/\/ 20\d\d-\d\d-\d\dT/.test(content) ? true : `insertTimestamp did not insert a timestamp (${JSON.stringify(content.slice(0, 40))})`;
  });

  await run('lce-decorations', async (page) => {
    const found = await page.evaluate(() => ({
      gutter: document.querySelectorAll('.lce-decoration-gutter--error').length,
      highlights: typeof CSS !== 'undefined' && 'highlights' in CSS ? CSS.highlights.size : -1,
    }));
    if (found.gutter !== 1) return `expected one gutter badge, found ${found.gutter}`;
    return found.highlights === 0 ? 'the inline decoration was not registered' : true;
  });
}

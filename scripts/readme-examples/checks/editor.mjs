// Run checks for the examples of the @editora/core, @editora/react and @editora/plugins READMEs.
// `run(name, check)` opens the example in Chromium; `check` returns true, or a string that says what is wrong.
export default async function checks({ run, commands, selectAll }) {
  await run('react-quick-start', async (page) => {
    const found = await commands(page);
    // `heading` resolves to the heading menu (setBlockType); it used to be dropped silently.
    const wanted = ['undo', 'redo', 'setBlockType', 'toggleBold', 'toggleItalic', 'toggleUnderline', 'openLinkDialog', 'toggleBulletList', 'toggleOrderedList'];
    const missing = wanted.filter((command) => !found.includes(command));
    return missing.length ? `toolbar is missing ${missing.join(', ')}` : true;
  });

  await run('react-document-editor', async (page) => {
    const hasTable = (await commands(page)).length > 5;
    const status = await page.locator('text=words').count();
    return hasTable && status ? true : 'expected a toolbar and a status bar';
  });

  await run('react-themes', async (page) => {
    const colours = await page.evaluate(() =>
      [...document.querySelectorAll('[data-theme]')].map((el) => getComputedStyle(el.querySelector('[contenteditable]')).color),
    );
    return colours.length === 2 && colours[0] !== colours[1] ? true : `the two themes give the text the same colour (${colours.join(' / ')})`;
  });

  await run('react-editor-api', async (page) => {
    await selectAll(page, '[contenteditable="true"]');
    await page.click('button:text-is("Bold")');
    await page.click('button:text-is("Read HTML")');
    const bold = await page.textContent('pre');
    if (!/<(b|strong)>/.test(bold ?? '')) return `Bold did not bold the text: ${bold}`;
    await page.click('button:text-is("Replace")');
    await page.click('button:text-is("Read HTML")');
    const replaced = await page.textContent('pre');
    return replaced === '<p>Replaced from outside.</p>' ? true : `setHTML/getHTML returned ${replaced}`;
  });

  await run('plugins-entry-points', async (page) => {
    const found = await commands(page);
    if (!found.includes('insertTable') || !found.includes('insertMath') || !found.includes('toggleTrackChanges')) return `toolbar has ${found.join(', ')}`;
    await page.click('[data-command="insertTable"]');
    await page.waitForTimeout(300);
    return (await page.locator('[contenteditable] table').count()) === 1 ? true : 'Insert Table did not insert a table';
  });

  await run('plugins-options', async (page) => {
    await page.click('[data-command="toggleTrackChanges"]');
    await page.evaluate(() => {
      const content = document.querySelector('[contenteditable="true"]');
      content.focus();
      const range = document.createRange();
      range.selectNodeContents(content.querySelector('p'));
      range.collapse(false);
      getSelection().removeAllRanges();
      getSelection().addRange(range);
    });
    await page.keyboard.type(' added');
    await page.waitForTimeout(300);
    const author = await page.getAttribute('[data-track-change="insert"]', 'data-track-author');
    if (author !== 'Ava Miller') return `the tracked change is attributed to ${author}`;
    await page.click('[data-command="insertMergeTag"]');
    await page.waitForTimeout(400);
    const dialog = await page.textContent('body');
    return /First name/.test(dialog ?? '') && /Account/.test(dialog ?? '') ? true : 'the merge tag dialog does not list the configured tags';
  });

  await run('plugins-lazy', async (page) => {
    await page.waitForTimeout(800);
    const found = await commands(page);
    return found.includes('toggleSpellCheck') ? true : `the lazily loaded plugin did not arrive (toolbar: ${found.join(', ')})`;
  });

  await run('core-bundler', async (page) => {
    // This one is a plain module: the demo page adds the element, as the README's HTML does.
    return page.evaluate(() => !!customElements.get('editora-editor')) ? true : 'the element is not registered';
  });

  await run('core-cdn', async (page) => {
    const found = await commands(page);
    return found.includes('toggleBold') && found.includes('openLinkDialog') ? true : `toolbar has ${found.join(', ')}`;
  });

  await run('core-full', async (page) => {
    const found = await commands(page);
    const wanted = ['toggleBold', 'toggleBulletList', 'openTextColorPicker', 'openBackgroundColorPicker', 'toggleBlockquote', 'insertTable'];
    const missing = wanted.filter((command) => !found.includes(command));
    return missing.length ? `toolbar is missing ${missing.join(', ')}` : true;
  });

  await run('core-minimal', async (page) => {
    const found = await commands(page);
    return found.includes('toggleBold') && found.includes('toggleBulletList') ? true : `toolbar has ${found.join(', ')}`;
  });

  await run('core-config', async (page) => {
    const editors = await page.$$eval('editora-editor', (els) =>
      els.map((el) => ({
        dark: el.classList.contains('editora-theme-dark'),
        buttons: el.querySelectorAll('[data-command]').length,
        editable: el.querySelector('.editora-content')?.getAttribute('contenteditable'),
      })),
    );
    if (!editors[0]?.dark) return 'theme="dark" did not give the first editor the dark theme';
    if (editors[0].buttons !== 8) return `the short toolbar has ${editors[0].buttons} buttons, expected 8`;
    if (editors[1]?.editable !== 'false' || editors[1]?.buttons !== 0) return 'the read-only editor is editable or shows a toolbar';
    return true;
  });

  await run('core-api', async (page) => {
    const text = (selector) => page.textContent(selector);
    await page.click('#read');
    if (!/Edit me/.test((await text('#out')) ?? '')) return 'getContent() did not return the content';
    await page.click('#replace');
    await page.click('#read');
    if ((await text('#out')) !== '<h2>Replaced</h2><p>From outside.</p>') return `setContent() then getContent() gave ${await text('#out')}`;
    await page.evaluate(() => document.getElementById('editor').setContent('<p>x</p>'));
    await selectAll(page, '#editor .editora-content');
    await page.click('#bold');
    await page.click('#read');
    if (!/<(b|strong)|font-weight/.test((await text('#out')) ?? '')) return `execCommand('toggleBold') changed nothing: ${await text('#out')}`;
    await page.click('#editor .editora-content');
    await page.keyboard.type('!');
    await page.waitForTimeout(400);
    return /!/.test((await text('#out')) ?? '') ? true : 'content-change did not report the typed text';
  });

  await run('plugins-web-component', async (page) => {
    const found = await commands(page);
    const wanted = ['undo', 'redo', 'toggleBold', 'insertTable', 'insertMergeTag'];
    const missing = wanted.filter((command) => !found.includes(command));
    return missing.length ? `toolbar is missing ${missing.join(', ')}` : true;
  });
}

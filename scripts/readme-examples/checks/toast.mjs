// Run checks for the examples of the @editora/toast README.
export default async function checks({ run }) {
  const toasts = (page) => page.locator('.editora-toast');
  const has = async (page, text) => (await page.locator(`text=${text}`).count()) > 0;

  await run('toast-quick-start', async (page) => {
    await page.waitForTimeout(500);
    // Three toasts are visible at once by default; the fourth waits in the queue.
    const visible = await toasts(page).count();
    if (visible !== 3) return `expected 3 visible toasts, found ${visible}`;
    for (const text of ['Document saved', 'A new version is available', 'Storage is almost full']) {
      if (!(await has(page, text))) return `"${text}" is not shown`;
    }
    if (await has(page, 'Upload failed')) return 'the fourth toast should wait in the queue';
    // Toasts last four seconds: the queued one takes the first free place.
    await page.waitForTimeout(4600);
    return (await has(page, 'Upload failed')) ? true : 'the queued toast never appeared';
  });

  await run('toast-advanced', async (page) => {
    await page.waitForTimeout(500);
    for (const text of ['Report ready', 'Q3-summary.pdf is 2.4 MB', 'Uploading photos', '64%']) {
      if (!(await has(page, text))) return `"${text}" is not shown`;
    }
    // The two toasts are folded into a deck: the older one (with the Dismiss button) opens when the stack is hovered.
    await page.locator('.editora-toast-container').hover();
    await page.getByRole('button', { name: 'Dismiss' }).click();
    await page.waitForTimeout(1000);
    return (await has(page, 'Report ready')) ? 'the Dismiss action did not dismiss the toast' : true;
  });

  await run('toast-promise', async (page) => {
    // The page has been open for about a second: the document is still saving (it takes 1.5 s).
    if (!(await has(page, 'Saving document...'))) return 'the loading toast is not shown';
    await page.waitForTimeout(1000);
    if (!(await has(page, 'Saved Q3-summary.pdf'))) return 'the toast did not turn into the success message';
    await page.waitForTimeout(1500);
    return (await has(page, 'Everything is up to date')) ? true : 'update() did not change the toast';
  });

  await run('toast-themes', async (page) => {
    await page.waitForTimeout(700);
    const themes = await page.$$eval('.editora-toast', (els) => els.map((el) => el.getAttribute('data-theme')));
    const expected = ['light', 'dark', 'colored', 'minimal', 'glass', 'neon', 'retro', 'ocean', 'forest', 'sunset', 'midnight'];
    return expected.every((theme) => themes.includes(theme)) ? true : `the toasts have these themes: ${themes.join(', ')}`;
  });

  await run('toast-stack', async (page) => {
    await page.waitForTimeout(600);
    const deck = () =>
      page.$$eval('.editora-toast', (els) => ({
        expanded: els[0].parentElement.dataset.expanded,
        text: els.map((el) => el.textContent.trim()),
        front: els.find((el) => el.dataset.front === 'true')?.textContent.trim(),
        collapsed: els.map((el) => el.dataset.collapsed),
      }));
    const folded = await deck();
    if (folded.text.length !== 3) return `expected 3 toasts, found ${folded.text.length}`;
    if (folded.expanded !== 'false' || folded.front !== 'Storage is almost full') return `the toasts are not folded into a deck with the newest in front: ${JSON.stringify(folded)}`;
    if (folded.collapsed.filter((c) => c === 'true').length !== 2) return 'the two older toasts should be folded behind the newest';
    // Hover opens the deck, and the timers wait for as long as it is open (the toasts last four seconds).
    await page.locator('.editora-toast[data-front="true"]').hover();
    await page.waitForTimeout(500);
    if ((await deck()).expanded !== 'true') return 'hovering the deck did not open it';
    await page.waitForTimeout(4600);
    if ((await page.locator('.editora-toast').count()) !== 3) return 'the toasts went away while the deck was open';
    await page.mouse.move(2, 2);
    await page.waitForTimeout(500);
    if ((await deck()).expanded !== 'false') return 'the deck did not close when the pointer left';
    await page.waitForFunction(() => document.querySelectorAll('.editora-toast').length === 0, null, { timeout: 8000 }).catch(() => {});
    return (await page.locator('.editora-toast').count()) === 0 ? true : 'the toasts did not go away after the deck was closed';
  });

  await run('toast-icons', async (page) => {
    await page.waitForTimeout(700);
    const state = await page.$$eval('.editora-toast', (els) =>
      els.map((el) => ({
        text: el.textContent.trim(),
        svg: !!el.querySelector('.editora-toast-icon svg'),
        icon: el.querySelector('.editora-toast-icon')?.textContent.trim() || '',
        hidden: el.querySelector('.editora-toast-icon')?.getAttribute('aria-hidden'),
      })),
    );
    const of = (text) => state.find((entry) => entry.text.includes(text));
    if (state.length !== 4) return `expected 4 toasts, found ${state.length}`;
    if (!of('Saved')?.svg || of('Saved').hidden !== 'true') return 'the success toast has no built-in icon (or it is not hidden from screen readers)';
    if (of('Copied to clipboard')?.svg !== false || of('Copied to clipboard')?.icon !== '') return 'a plain toast should have no icon';
    if (of('Invite sent')?.icon !== '✉️') return `the own icon was not used (${of('Invite sent')?.icon})`;
    if (of('Payment failed')?.svg !== false || of('Payment failed')?.icon !== '') return 'icon: false should leave the icon out';
    return true;
  });

  await run('toast-positions', async (page) => {
    await page.waitForTimeout(700);
    const size = page.viewportSize();
    const where = await page.$$eval('.editora-toast', (els) =>
      els.map((el) => {
        const box = el.getBoundingClientRect();
        return { text: el.textContent.trim(), cx: box.x + box.width / 2, cy: box.y + box.height / 2 };
      }),
    );
    const find = (name) => where.find((entry) => entry.text.startsWith(name));
    const checks = {
      'top-left': (e) => e.cx < size.width / 3 && e.cy < size.height / 3,
      'top-center': (e) => Math.abs(e.cx - size.width / 2) < 80 && e.cy < size.height / 3,
      'top-right': (e) => e.cx > (size.width * 2) / 3 && e.cy < size.height / 3,
      'bottom-left': (e) => e.cx < size.width / 3 && e.cy > (size.height * 2) / 3,
      'bottom-center': (e) => Math.abs(e.cx - size.width / 2) < 80 && e.cy > (size.height * 2) / 3,
      'bottom-right': (e) => e.cx > (size.width * 2) / 3 && e.cy > (size.height * 2) / 3,
      center: (e) => Math.abs(e.cx - size.width / 2) < 80 && Math.abs(e.cy - size.height / 2) < 120,
    };
    for (const [name, test] of Object.entries(checks)) {
      const entry = find(name);
      if (!entry || !test(entry)) return `the "${name}" toast is at ${entry ? `${Math.round(entry.cx)},${Math.round(entry.cy)}` : 'nowhere'}`;
    }
    return true;
  });

  await run('toast-configure', async (page) => {
    await page.waitForTimeout(600);
    const welcome = await page.locator('text=Welcome back').count();
    if (welcome !== 1) return `preventDuplicate should leave one "Welcome back" toast, found ${welcome}`;
    const state = await page.$$eval('.editora-toast', (els) =>
      els.map((el) => ({ theme: el.getAttribute('data-theme'), text: el.textContent.trim(), cx: el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2, close: !!el.querySelector('[aria-label*="lose" i], .editora-toast-close, button') })),
    );
    const welcomeToast = state.find((entry) => entry.text.startsWith('Welcome'));
    const renewal = state.find((entry) => entry.text.startsWith('Your plan'));
    if (!welcomeToast || welcomeToast.theme !== 'ocean') return `the configured theme was not used (${welcomeToast?.theme})`;
    if (!renewal || renewal.theme !== 'sunset') return 'a toast could not override the configured theme';
    return Math.abs(welcomeToast.cx - page.viewportSize().width / 2) < 80 && welcomeToast.close ? true : 'the position or the close button was not applied';
  });

  await run('toast-cdn', async (page) => {
    const globals = await page.evaluate(() => ({
      toast: typeof window.toast?.success,
      same: window.toastPro === window.toastAdvanced && typeof window.toastAdvanced?.show === 'function',
    }));
    if (globals.toast !== 'function' || !globals.same) return `the UMD globals are wrong: ${JSON.stringify(globals)}`;
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(600);
    if (!(await has(page, 'Saved from a CDN')) || !(await has(page, 'File uploaded'))) return 'the toasts did not appear';
    await page.locator('.editora-toast').getByRole('button', { name: 'Dismiss' }).click();
    await page.waitForTimeout(1000);
    return (await has(page, 'File uploaded')) ? 'the Dismiss action did not dismiss the toast' : true;
  });

  await run('toast-react', async (page) => {
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(300);
    if (!(await has(page, 'Saving...'))) return 'the loading toast is not shown';
    await page.waitForTimeout(1200);
    return (await has(page, 'Saved draft.md')) ? true : 'the toast did not turn into the success message';
  });
}

// Run checks for the examples of the @editora/ui-sortable README.
export default async function checks({ run }) {
  const items = (page) =>
    page.evaluate(() =>
      document
        .querySelector('ui-sortable')
        .items.map((item) => `${item.id}@${item.listId}${item.parentId ? `^${item.parentId}` : ''}`),
    );

  // Press the drag handle of one item and release over another, the way a pointer user does.
  async function drag(page, fromLabel, toLabel, below = 40) {
    const from = await page.getByText(fromLabel, { exact: true }).first().boundingBox();
    const to = await page.getByText(toLabel, { exact: true }).first().boundingBox();
    await page.mouse.move(from.x - 17, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(from.x - 60, from.y - 20, { steps: 6 });
    await page.mouse.move(to.x + 60, to.y + below, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(700);
  }

  await run('sortable-quick-start', async (page, { logs }) => {
    for (const label of ['Backlog', 'In Progress', 'Done', 'Audit onboarding']) {
      if (!(await page.getByText(label, { exact: true }).count())) return `${label} is not shown`;
    }
    await drag(page, 'Audit onboarding', 'Ship release notes');
    if (!logs.some((line) => line.startsWith('order'))) return "dragging did not fire 'change'";
    const moved = (await items(page)).find((entry) => entry.startsWith('story-1@'));
    return moved && !moved.startsWith('story-1@backlog') ? true : `the item did not change list (${moved})`;
  });

  await run('sortable-react', async (page, { logs }) => {
    if (!(await page.getByText('Audit onboarding', { exact: true }).count())) return 'the items are not shown';
    await drag(page, 'Audit onboarding', 'Ship release notes');
    return logs.some((line) => line.startsWith('[') || line.startsWith('Array') || /story-1/.test(line)) ? true : 'onChange did not report the new order';
  });

  await run('sortable-board', async (page) => {
    const selected = await page.evaluate(() => document.querySelector('ui-sortable').selection);
    if (JSON.stringify(selected) !== '["epic"]') return `the initial selection is ${JSON.stringify(selected)}, not ["epic"]`;
    const before = await items(page);
    await drag(page, 'Design review', 'Release epic');
    const after = await items(page);
    if (after.join() === before.join()) return 'dragging an item changed nothing';
    // The template list clones what is dragged out of it.
    await drag(page, 'Launch brief template', 'Design review', 20);
    const cloned = await items(page);
    if (cloned.length !== after.length + 1) return `dragging from the clone-on-drag list should add an item (${after.length} -> ${cloned.length})`;
    if (!cloned.some((entry) => entry.startsWith('template-brief@templates'))) return 'the original template left its list';

    // persistKey: where each item is survives a reload (a clone is a new item your own state has to keep).
    await page.reload();
    await page.waitForSelector('ui-sortable');
    await page.waitForTimeout(1200);
    const restored = await items(page);
    return restored.join() === after.join() ? true : `the positions were not restored after a reload (${restored.join(' ')})`;
  });

  await run('sortable-flat', async (page) => {
    const before = await items(page);
    await drag(page, 'SEO metadata', 'Headline polish', 8);
    const after = await items(page);
    if (after.join() === before.join()) return 'dragging an item changed nothing';
    if (!after.every((entry) => !entry.includes('^'))) return 'allowNesting={false} still produced a nested item';

    // The keyboard: Space lifts the focused item, the arrow keys choose the place, Space drops it.
    await page.evaluate(() => document.querySelector('ui-sortable').focusItem('legal'));
    await page.waitForTimeout(200);
    for (const key of ['Space', 'ArrowDown', 'Space']) {
      await page.keyboard.press(key);
      await page.waitForTimeout(250);
    }
    const moved = await items(page);
    return moved.join() !== after.join() ? true : 'the keyboard did not reorder the list';
  });

  await run('sortable-custom', async (page) => {
    // Playwright's text selectors see through the shadow roots the list is rendered in.
    for (const expected of ['Selected', 'Ready', '2 items', '0 items', 'No items in Done yet']) {
      if (!(await page.locator(`text=${expected}`).count())) return `the custom rendering is missing "${expected}"`;
    }
    return true;
  });
}

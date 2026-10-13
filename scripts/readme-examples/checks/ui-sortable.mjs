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

  await run('sortable-guard', async (page) => {
    const before = await items(page);
    // "Doing" holds two cards at most: one more fits, the next is refused.
    await drag(page, 'Plan the launch', 'Collect the assets');
    const first = await items(page);
    if (!first.some((entry) => entry === 'launch@doing')) return `a card should fit in Doing (${first.join(' ')})`;
    await drag(page, 'Write the brief', 'Collect the assets');
    const second = await items(page);
    if (second.join() !== first.join()) return `Doing is full, but a third card went in (${second.join(' ')})`;

    // canDrop: a card that was not reviewed does not go to Done, a reviewed one does.
    const done = await page.evaluate(() => {
      const element = document.querySelector('ui-sortable');
      element.select(['budget']);
      const refused = element.moveSelection({ targetListId: 'done' });
      element.select(['brief']);
      const accepted = element.moveSelection({ targetListId: 'done' });
      return { refused, accepted };
    });
    if (done.refused !== false) return 'an unreviewed card was allowed into Done';
    if (done.accepted !== true) return 'a reviewed card was refused';

    // onBeforeChange: three cards at once is cancelled, and nothing changes.
    const three = await page.evaluate(() => {
      const element = document.querySelector('ui-sortable');
      const snapshot = element.items.map((item) => `${item.id}@${item.listId}`).join();
      element.select(['brief', 'budget', 'launch']);
      const moved = element.moveSelection({ targetListId: 'todo' });
      return { moved, same: element.items.map((item) => `${item.id}@${item.listId}`).join() === snapshot };
    });
    if (three.moved !== false || !three.same) return 'onBeforeChange(false) should have cancelled the move of three cards';
    return before.length === (await items(page)).length ? true : 'cards were lost';
  });

  await run('sortable-vanilla', async (page, { logs }) => {
    // The cards are the ones the function drew, with the data of each item.
    for (const expected of ['Invoice Acme', '$1200', 'Quote Globex', '$450', 'Chase Initech', '$80']) {
      if (!(await page.locator(`text=${expected}`).count())) return `the card is missing "${expected}"`;
    }
    // Selecting a card draws it again.
    await page.getByText('Quote Globex', { exact: true }).first().click();
    await page.waitForTimeout(300);
    if (!(await page.locator('text=$450 (selected)').count())) return 'the selected card was not drawn again as selected';
    // The list with a limit shows its count, and canDrop refuses the big one.
    if (!(await page.locator('text=2/3').count())) return 'the list header does not show 2/3';
    const result = await page.evaluate(() => {
      const board = document.querySelector('ui-sortable');
      board.select(['acme']);
      const refused = board.moveSelection({ targetListId: 'done' });
      board.select(['globex']);
      const accepted = board.moveSelection({ targetListId: 'done' });
      return { refused, accepted };
    });
    if (result.refused !== false) return 'a card over $1,000 was allowed into Done';
    if (result.accepted !== true) return 'a small card was refused';
    return logs.some((line) => line.startsWith('moved')) ? true : "'change' did not fire";
  });

  await run('sortable-two-boards', async (page) => {
    const boards = () =>
      page.evaluate(() => {
        const [backlog, sprint] = Array.from(document.querySelectorAll('ui-sortable'));
        const ids = (element) => element.items.map((item) => item.id).join(' ');
        return { backlog: ids(backlog), sprint: ids(sprint) };
      });
    const before = await boards();
    if (before.backlog !== 'audit notes handoff' || before.sprint !== 'login docs') return `unexpected start (${JSON.stringify(before)})`;

    // A card of the first board dropped on the second one: it leaves one and arrives in the other.
    await drag(page, 'Audit onboarding', 'Write docs', 8);
    const moved = await boards();
    if (moved.backlog !== 'notes handoff' || !moved.sprint.split(' ').includes('audit')) return `the card did not cross (${JSON.stringify(moved)})`;

    // The second board holds three: it is full now, so the next card is refused and stays where it was.
    await drag(page, 'Ship release notes', 'Fix login', 8);
    const refused = await boards();
    if (refused.backlog !== moved.backlog || refused.sprint !== moved.sprint) return `a full board took a fourth card (${JSON.stringify(refused)})`;

    // And a card can go back.
    await drag(page, 'Fix login', 'Review handoff', 8);
    const back = await boards();
    return back.backlog.split(' ').includes('login') && !back.sprint.split(' ').includes('login') ? true : `the card did not go back (${JSON.stringify(back)})`;
  });
}

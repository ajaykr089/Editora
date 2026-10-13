// Run checks for the examples of the @editora/ui-editor README.
const UI_CORE = 'https://cdn.jsdelivr.net/npm/@editora/ui-core/dist/index.esm.js';
const UI_EDITOR = 'https://cdn.jsdelivr.net/npm/@editora/ui-editor/dist/index.esm.js';
const ICONS = 'https://cdn.jsdelivr.net/npm/@editora/icons/dist/index.esm.js';

// The class each package exports, and the tag it is meant for.
const ELEMENTS = [
  ['UIFloatingToolbar', 'ui-floating-toolbar'],
  ['UICommandPalette', 'ui-command-palette'],
  ['UIContextMenu', 'ui-context-menu'],
  ['UIPluginPanel', 'ui-plugin-panel'],
  ['UIBlockControls', 'ui-block-controls'],
  ['UISelectionPopup', 'ui-selection-popup'],
];

export default async function checks({ run }) {
  await run('ui-editor-palette', async (page) => {
    const status = () => page.locator('#status').textContent();
    if ((await status()) !== 'Nothing run yet') return `the page starts with "${await status()}"`;

    await page.click('#open');
    await page.waitForTimeout(150);
    if (!(await page.$eval('#palette', (element) => element.hasAttribute('open')))) return 'the palette did not open';

    // Typing filters the three commands down to the one that matches.
    await page.keyboard.type('bold');
    await page.waitForTimeout(150);
    const visible = await page.$$eval('#palette button', (buttons) =>
      buttons.filter((button) => button.getBoundingClientRect().height > 0 && getComputedStyle(button).display !== 'none').map((button) => button.textContent),
    );
    if (visible.join() !== 'Toggle bold') return `after typing "bold", these commands are shown: ${JSON.stringify(visible)}`;

    // The arrow keys move to it, and Enter runs it and closes the palette.
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    if ((await status()) !== 'Ran: Toggle bold') return `Enter ran "${await status()}"`;
    if (await page.$eval('#palette', (element) => element.hasAttribute('open'))) return 'the palette stayed open after a command ran';

    // Escape closes it too.
    await page.click('#open');
    await page.waitForTimeout(150);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    return (await page.$eval('#palette', (element) => element.hasAttribute('open'))) ? 'Escape did not close the palette' : true;
  });

  // The README says that loading this package registers nothing: ui-core, which it imports first, owns the six tags.
  const alone = {
    name: 'ui-editor-alone',
    kind: 'html',
    source: `<script type="importmap">{ "imports": { "@editora/ui-core": "${UI_CORE}", "@editora/icons": "${ICONS}" } }</script>
<script type="module">import '${UI_EDITOR}';</script>`,
  };
  await run(
    'ui-editor-alone',
    async (page) => {
      const result = await page.evaluate(
        async ([coreUrl, editorUrl, elements]) => {
          const core = await import(coreUrl);
          const editor = await import(editorUrl);
          return elements.map(([name, tag]) => {
            const registered = customElements.get(tag);
            return {
              tag,
              defined: !!registered,
              fromCore: registered === core[name],
              fromEditor: registered === editor[name],
              editorClass: typeof editor[name] === 'function',
              distinct: editor[name] !== core[name],
            };
          });
        },
        [UI_CORE, UI_EDITOR, ELEMENTS],
      );
      for (const row of result) {
        if (!row.editorClass) return `${row.tag}: the package does not export its class`;
        if (!row.defined) return `${row.tag} is not defined at all`;
        if (!row.fromCore) return `${row.tag} is not the element of @editora/ui-core`;
        if (row.fromEditor || !row.distinct) return `${row.tag} is the class of @editora/ui-editor: update the README`;
      }
      return true;
    },
    alone,
  );
}

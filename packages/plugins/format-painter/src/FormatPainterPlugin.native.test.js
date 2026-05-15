const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { FormatPainterPlugin } = require('./FormatPainterPlugin.native.ts');

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.Node = dom.window.Node;
  global.NodeFilter = dom.window.NodeFilter;
  global.Range = dom.window.Range;
  global.Selection = dom.window.Selection;
  global.CustomEvent = dom.window.CustomEvent;
  global.Event = dom.window.Event;
  global.KeyboardEvent = dom.window.KeyboardEvent;
  global.MouseEvent = dom.window.MouseEvent;
  return dom;
}

function teardownDom(dom) {
  dom.window.close();
  delete global.window;
  delete global.document;
  delete global.HTMLElement;
  delete global.Node;
  delete global.NodeFilter;
  delete global.Range;
  delete global.Selection;
  delete global.CustomEvent;
  delete global.Event;
  delete global.KeyboardEvent;
  delete global.MouseEvent;
}

function createEditor(html) {
  const editor = document.createElement('div');
  editor.className = 'rte-content';
  editor.setAttribute('contenteditable', 'true');
  editor.innerHTML = html;
  document.body.appendChild(editor);
  return editor;
}

function selectText(element) {
  const range = document.createRange();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const text = walker.nextNode();
  range.selectNodeContents(text || element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function selectCollapsed(element) {
  const range = document.createRange();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const text = walker.nextNode();
  range.setStart(text || element, 0);
  range.collapse(true);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function selectContents(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function runCase(name, fn) {
  const dom = setupDom();
  try {
    fn();
    console.log(`ok - ${name}`);
  } finally {
    teardownDom(dom);
  }
}

runCase('copies inline and block formatting while preserving target metadata', () => {
  const editor = createEditor(`
    <h2 id="source" style="text-align: center; line-height: 2;"><b><span style="color: rgb(255, 0, 0); font-size: 20px;">Source</span></b></h2>
    <p id="target" data-translation-segment-id="translation-segment-9"><i>Target</i></p>
  `);
  const plugin = FormatPainterPlugin();

  selectText(editor.querySelector('#source'));
  assert.equal(plugin.commands.toggleFormatPainter(undefined, { contentElement: editor }), true);

  selectText(editor.querySelector('#target'));
  plugin.commands.paintFormats(undefined, { contentElement: editor });

  const target = editor.querySelector('#target');
  assert.equal(target.tagName, 'H2');
  assert.equal(target.getAttribute('data-translation-segment-id'), 'translation-segment-9');
  assert.equal(target.style.textAlign, 'center');
  assert.equal(target.style.lineHeight, '2');
  assert.ok(target.querySelector('b'));
  assert.equal(target.querySelector('i'), null);
  assert.match(target.innerHTML, /Target/);
  assert.equal(target.querySelector('[data-editora-format-painter-bookmark]'), null);
});

runCase('honors ignored formats by leaving target marks untouched', () => {
  const editor = createEditor(`
    <p id="source"><span style="color: rgb(0, 0, 255);">Source</span></p>
    <p id="target"><b>Target</b></p>
  `);
  const plugin = FormatPainterPlugin({ ignoredFormats: ['bold'] });

  selectText(editor.querySelector('#source'));
  assert.equal(plugin.commands.toggleFormatPainter(undefined, { contentElement: editor }), true);

  selectText(editor.querySelector('#target'));
  assert.equal(plugin.commands.paintFormats(undefined, { contentElement: editor }), true);

  const target = editor.querySelector('#target');
  assert.ok(target.querySelector('b'));
  assert.match(target.innerHTML, /Target/);
});

runCase('does not write cursor styles while paint mode is active', () => {
  const editor = createEditor('<p id="source" style="line-height: 21px;"><strong>Source</strong></p>');
  const plugin = FormatPainterPlugin();
  const beforeHTML = editor.innerHTML;

  selectText(editor.querySelector('#source strong'));
  assert.equal(plugin.commands.toggleFormatPainter(undefined, { contentElement: editor }), true);
  assert.equal(document.getElementById('editora-format-painter-styles'), null);
  assert.equal(editor.hasAttribute('data-format-painter-cursor'), false);
  assert.equal(editor.style.cursor, '');
  assert.equal(editor.querySelector('#source').style.cursor, '');
  assert.equal(editor.querySelector('strong').style.cursor, '');
  assert.equal(editor.innerHTML, beforeHTML);

  assert.equal(plugin.commands.cancelFormatPainter(undefined, { contentElement: editor }), true);
  assert.equal(editor.innerHTML, beforeHTML);
});

runCase('does not clear active paint mode from a toolbar mouseup', () => {
  const editor = createEditor('<p id="source"><strong>Source</strong></p>');
  const toolbar = document.createElement('div');
  toolbar.className = 'rte-toolbar-wrapper';
  const button = document.createElement('button');
  button.setAttribute('data-command', 'toggleFormatPainter');
  toolbar.appendChild(button);
  document.body.appendChild(toolbar);

  const plugin = FormatPainterPlugin();
  plugin.initialize();

  selectText(editor.querySelector('#source strong'));
  assert.equal(plugin.commands.toggleFormatPainter(undefined, { contentElement: editor }), true);
  button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

  assert.equal(editor.classList.contains('rte-format-painter-active'), true);
  assert.equal(button.classList.contains('active'), true);
});

runCase('keeps ignored format options scoped to the plugin instance', () => {
  const editorA = createEditor(`
    <p id="source-a"><span style="color: rgb(0, 0, 255);">Source</span></p>
    <p id="target-a"><b>Target A</b></p>
  `);
  const editorB = createEditor(`
    <p id="source-b"><span style="color: rgb(0, 0, 255);">Source</span></p>
    <p id="target-b"><b>Target B</b></p>
  `);
  const pluginA = FormatPainterPlugin({ ignoredFormats: ['bold'] });
  const pluginB = FormatPainterPlugin();

  selectText(editorA.querySelector('#source-a'));
  assert.equal(pluginA.commands.toggleFormatPainter(undefined, { contentElement: editorA }), true);
  selectText(editorB.querySelector('#source-b'));
  assert.equal(pluginB.commands.toggleFormatPainter(undefined, { contentElement: editorB }), true);

  selectText(editorA.querySelector('#target-a'));
  assert.equal(pluginA.commands.paintFormats(undefined, { contentElement: editorA }), true);
  selectText(editorB.querySelector('#target-b'));
  assert.equal(pluginB.commands.paintFormats(undefined, { contentElement: editorB }), true);

  assert.ok(editorA.querySelector('#target-a b'));
  assert.equal(editorB.querySelector('#target-b b'), null);
});

runCase('paints list item text without creating extra list items or inline wrappers between items', () => {
  const editor = createEditor(`
    <p id="source"><strong>Launch note</strong></p>
    <ul id="target-list">
      <li data-id="one">Keep formatting intentional</li>
      <li data-id="two">Add links, headings, and emphasis as needed</li>
      <li data-id="three">Watch the HTML update as you edit</li>
    </ul>
  `);
  const plugin = FormatPainterPlugin({ ignoredFormats: ['fontFamily', 'fontSize', 'color'] });

  selectText(editor.querySelector('#source strong'));
  assert.equal(plugin.commands.toggleFormatPainter(undefined, { contentElement: editor }), true);

  selectContents(editor.querySelector('#target-list'));
  plugin.commands.paintFormats(undefined, { contentElement: editor });

  const list = editor.querySelector('#target-list');
  assert.equal(list.children.length, 3);
  assert.deepEqual(
    Array.from(list.children).map((child) => child.tagName),
    ['LI', 'LI', 'LI'],
  );
  assert.equal(list.querySelectorAll('li b').length, 3);
  assert.equal(list.querySelectorAll(':scope > b, :scope > span').length, 0);
  assert.equal(list.querySelector('[data-editora-format-painter-bookmark]'), null);
  assert.equal(editor.innerHTML.includes('data-editora-format-painter-bookmark'), false);

  selectContents(editor.querySelector('#target-list'));
  plugin.commands.paintFormats(undefined, { contentElement: editor });
  assert.equal(list.children.length, 3);
  assert.equal(list.querySelectorAll('b b').length, 0);
  assert.equal(list.querySelectorAll('.rte-format-painted .rte-format-painted').length, 0);
  assert.equal(list.querySelectorAll('li b').length, 3);

  const comments = [];
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_COMMENT);
  let comment = walker.nextNode();
  while (comment) {
    comments.push(comment.nodeValue);
    comment = walker.nextNode();
  }
  assert.deepEqual(comments, []);
});

runCase('paints table and table cell styles onto selected target cells', () => {
  const editor = createEditor(`
    <table><tbody>
      <tr><td id="source" style="background-color: rgb(255, 255, 0); text-align: right; vertical-align: top; padding-left: 12px; border-left: 2px solid rgb(0, 0, 0);">Source</td></tr>
      <tr><td id="target">Target</td></tr>
    </tbody></table>
  `);
  const plugin = FormatPainterPlugin();

  selectCollapsed(editor.querySelector('#source'));
  assert.equal(plugin.commands.toggleFormatPainter(undefined, { contentElement: editor }), true);

  selectCollapsed(editor.querySelector('#target'));
  assert.equal(plugin.commands.paintFormats(undefined, { contentElement: editor }), true);

  const target = editor.querySelector('#target');
  assert.equal(target.style.backgroundColor, 'rgb(255, 255, 0)');
  assert.equal(target.style.textAlign, 'right');
  assert.equal(target.style.verticalAlign, 'top');
  assert.equal(target.style.paddingLeft, '12px');
  assert.equal(target.style.borderLeftWidth, '2px');
  assert.equal(target.style.borderLeftStyle, 'solid');
});

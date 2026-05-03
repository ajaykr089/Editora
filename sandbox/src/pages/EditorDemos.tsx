import React, { useMemo, useRef, useState } from 'react';
import { RichTextEditor, type EditorAPI } from '@editora/react';
import {
  A11yCheckerPlugin,
  AnchorPlugin,
  ApprovalWorkflowPlugin,
  BackgroundColorPlugin,
  BlockquotePlugin,
  BlocksLibraryPlugin,
  BoldPlugin,
  CapitalizationPlugin,
  ChecklistPlugin,
  CitationsPlugin,
  ClearFormattingPlugin,
  CodePlugin,
  CodeSamplePlugin,
  CommentsPlugin,
  ConditionalContentPlugin,
  ContentRulesPlugin,
  DataBindingPlugin,
  DirectionPlugin,
  DocSchemaPlugin,
  DocumentManagerPlugin,
  EmbedIframePlugin,
  EmojisPlugin,
  FontFamilyPlugin,
  FontSizePlugin,
  FootnotePlugin,
  FullscreenPlugin,
  HeadingPlugin,
  HistoryPlugin,
  IndentPlugin,
  ItalicPlugin,
  LineHeightPlugin,
  LinkPlugin,
  ListPlugin,
  MediaManagerPlugin,
  MentionPlugin,
  MergeTagPlugin,
  MathPlugin,
  PageBreakPlugin,
  PIIRedactionPlugin,
  PreviewPlugin,
  PrintPlugin,
  SlashCommandsPlugin,
  SmartPastePlugin,
  SpecialCharactersPlugin,
  SpellCheckPlugin,
  TablePlugin,
  TemplatePlugin,
  TextAlignmentPlugin,
  TextColorPlugin,
  TrackChangesPlugin,
  TranslationWorkflowPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
  VersionDiffPlugin,
} from '@editora/plugins';
import { Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };
const note: React.CSSProperties = { fontSize: 13, color: '#64748b', marginTop: 10 };

const articleHtml = `
  <h2>Launch briefing</h2>
  <p>Editora gives product teams a rich authoring surface with toolbar actions, structured content, autosave hooks, and plugin-driven workflows.</p>
  <ul>
    <li>Draft product updates</li>
    <li>Review legal notes</li>
    <li>Publish formatted release notes</li>
  </ul>
`;

const readonlyHtml = `
  <h2>Published policy</h2>
  <p>This document is rendered in read-only mode so reviewers can inspect the same rich content without editing it.</p>
  <blockquote>Use read-only surfaces for approvals, previews, and embedded knowledge-base articles.</blockquote>
`;

const createBasicPlugins = () => [
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  ListPlugin(),
  LinkPlugin(),
  HistoryPlugin(),
];

const createFormattingPlugins = () => [
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  StrikethroughPlugin(),
  ListPlugin(),
  ChecklistPlugin(),
  LinkPlugin(),
  HistoryPlugin(),
  BlockquotePlugin(),
  ClearFormattingPlugin(),
  TextAlignmentPlugin(),
  TextColorPlugin(),
  BackgroundColorPlugin(),
  CodePlugin(),
];

const createEnterprisePlugins = () => [
  ...createFormattingPlugins(),
  TablePlugin(),
  CodeSamplePlugin(),
  MathPlugin(),
  EmojisPlugin(),
  CommentsPlugin(),
  A11yCheckerPlugin(),
  DirectionPlugin(),
  PreviewPlugin(),
  PrintPlugin(),
];

const createAllToolbarPlugins = () => [
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  StrikethroughPlugin(),
  ListPlugin(),
  ChecklistPlugin(),
  HistoryPlugin(),
  LinkPlugin(),
  BlockquotePlugin(),
  ClearFormattingPlugin(),
  CodePlugin(),
  CodeSamplePlugin(),
  TablePlugin(),
  FontSizePlugin(),
  FontFamilyPlugin(),
  TextAlignmentPlugin(),
  TextColorPlugin(),
  BackgroundColorPlugin(),
  LineHeightPlugin(),
  IndentPlugin(),
  DirectionPlugin(),
  CapitalizationPlugin(),
  MathPlugin(),
  SpecialCharactersPlugin(),
  EmojisPlugin(),
  EmbedIframePlugin(),
  AnchorPlugin(),
  MediaManagerPlugin(),
  DocumentManagerPlugin(),
  PreviewPlugin(),
  FullscreenPlugin(),
  PrintPlugin(),
  PageBreakPlugin(),
  FootnotePlugin(),
  MergeTagPlugin({
    tags: [
      { key: 'first_name', label: 'First name', category: 'Contact', preview: 'Ava' },
      { key: 'company', label: 'Company', category: 'Account', preview: 'Editora Labs' },
      { key: 'renewal_date', label: 'Renewal date', category: 'Account', preview: 'May 18, 2026' },
    ],
  }),
  TemplatePlugin(),
  CommentsPlugin(),
  SpellCheckPlugin(),
  A11yCheckerPlugin(),
  TrackChangesPlugin({ author: 'Sandbox Reviewer', enabledByDefault: false }),
  VersionDiffPlugin({
    baselineHtml: '<h2>Welcome to Editora</h2><p>This baseline text is used by the version diff toolbar action.</p>',
  }),
  ConditionalContentPlugin({
    defaultAudience: ['enterprise'],
    defaultLocale: ['en-US'],
    context: { plan: 'enterprise', locale: 'en-US' },
  }),
  DataBindingPlugin({
    data: {
      user: { firstName: 'Ava', lastName: 'Miller' },
      account: { name: 'Editora Labs', renewalDate: '2026-05-18' },
      order: { total: 1234.56, createdAt: '2026-03-03T12:00:00Z' },
    },
  }),
  ContentRulesPlugin({
    bannedWords: ['obviously', 'simply'],
    requiredHeadings: ['Summary'],
    maxSentenceWords: 28,
    minReadabilityScore: 55,
    enableRealtime: true,
  }),
  CitationsPlugin({
    defaultStyle: 'apa',
    enableFootnoteSync: true,
  }),
  ApprovalWorkflowPlugin({
    defaultStatus: 'draft',
    lockOnApproval: true,
    defaultActor: 'Editorial Lead',
  }),
  PIIRedactionPlugin({
    enableRealtime: true,
    redactionMode: 'token',
    maxFindings: 120,
  }),
  SmartPastePlugin({
    defaultProfile: 'balanced',
    maxHtmlLength: 220000,
  }),
  BlocksLibraryPlugin({
    maxResults: 120,
    blocks: [
      {
        id: 'incident-summary',
        label: 'Incident Summary Block',
        category: 'Operations',
        tags: ['incident', 'summary'],
        keywords: ['postmortem', 'rca'],
        html: '<h3>Incident Summary</h3><p>Describe impact, timeline, and customer exposure.</p>',
      },
      {
        id: 'risk-register-entry',
        label: 'Risk Register Entry',
        category: 'Compliance',
        tags: ['risk', 'governance'],
        keywords: ['mitigation', 'owner'],
        html: '<h3>Risk Register Entry</h3><p><strong>Risk:</strong> <em>Describe risk here.</em></p><p><strong>Mitigation:</strong> Define mitigation owner and due date.</p>',
      },
      {
        id: 'release-rollback',
        label: 'Release Rollback Plan',
        category: 'Engineering',
        tags: ['release', 'rollback'],
        keywords: ['deployment', 'runbook'],
        html: '<h3>Rollback Plan</h3><ol><li>Pause rollout</li><li>Revert deployment</li><li>Validate service health</li></ol>',
      },
    ],
  }),
  DocSchemaPlugin({
    defaultSchemaId: 'policy',
    enableRealtime: true,
    schemas: [
      {
        id: 'policy',
        label: 'Policy',
        strictOrder: true,
        allowUnknownHeadings: true,
        sections: [
          { title: 'Policy Statement' },
          { title: 'Applicability', aliases: ['Scope'] },
          { title: 'Controls' },
          { title: 'Exceptions' },
          { title: 'Enforcement' },
        ],
      },
    ],
  }),
  TranslationWorkflowPlugin({
    sourceLocale: 'en-US',
    targetLocale: 'fr-FR',
    enableRealtime: true,
    locales: ['en-US', 'fr-FR', 'de-DE', 'es-ES', 'ja-JP'],
  }),
  SlashCommandsPlugin(),
  MentionPlugin({
    items: [
      { id: 'john.doe', label: 'John Doe', meta: 'john@acme.com' },
      { id: 'sarah.lee', label: 'Sarah Lee', meta: 'sarah@acme.com' },
      { id: 'ops.team', label: 'Ops Team', meta: 'team' },
    ],
  }),
];

const basicToolbarItems = ['undo', 'redo', 'heading', 'bold', 'italic', 'underline', 'link', 'bullist', 'numlist'];
const compactGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 };

const allPluginsShowcaseHtml = `
  <h1>All Plugin Features</h1>
  <h2>Basic Formatting</h2>
  <p><strong>Bold</strong>, <em>Italic</em>, <u>Underline</u>, <s>Strikethrough</s></p>
  <h2>Typography</h2>
  <p style="color: #e91e63;">Text Color</p>
  <p style="background-color: #ffeb3b;">Background Color</p>
  <p style="font-size: 18px;">Font Size: 18px</p>
  <p style="font-family: 'Courier New';">Font Family: Courier New</p>
  <p style="line-height: 2;">Line Height: 2.0</p>
  <h2>Text Alignment</h2>
  <p style="text-align: left;">Left aligned</p>
  <p style="text-align: center;">Center aligned</p>
  <p style="text-align: right;">Right aligned</p>
  <p style="text-align: justify;">Justified text with enough content to wrap and demonstrate justification.</p>
  <h2>Lists</h2>
  <ul><li>Bullet list item 1</li><li>Bullet list item 2</li></ul>
  <ol><li>Numbered list item 1</li><li>Numbered list item 2</li></ol>
  <h2>Block Quotes</h2>
  <blockquote>This is a blockquote. It can contain multiple paragraphs and formatting.</blockquote>
  <h2>Code</h2>
  <pre><code>function hello() { console.log("Hello, World!"); }</code></pre>
  <h2>Tables</h2>
  <table border="1"><tr><th>Header 1</th><th>Header 2</th></tr><tr><td>Cell 1</td><td>Cell 2</td></tr></table>
`;

function editorShell(children: React.ReactNode) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
      {children}
    </div>
  );
}

export function EditoraEditorDemo() {
  const activePlugins = useMemo(createBasicPlugins, []);

  return (
    <div>
      <h2 style={h2}>Editora Rich Text Editor</h2>
      <div style={panel}>
        <h3 style={h3}>Default authoring surface</h3>
        {editorShell(
          <RichTextEditor
            defaultValue={articleHtml}
            placeholder="Start writing..."
            plugins={activePlugins}
            toolbar={{ items: basicToolbarItems }}
            statusbar={{ enabled: true, position: 'bottom' }}
            content={{ minHeight: 220, autoHeight: true }}
          />,
        )}
        <div style={note}>A compact starter setup with toolbar, placeholder, status bar, and seeded content.</div>
      </div>
    </div>
  );
}

export function EditoraControlledDemo() {
  const [html, setHtml] = useState(articleHtml);
  const activePlugins = useMemo(createFormattingPlugins, []);

  return (
    <div>
      <h2 style={h2}>Controlled Editor</h2>
      <div style={panel}>
        <h3 style={h3}>State-backed content</h3>
        {editorShell(
          <RichTextEditor
            value={html}
            onChange={setHtml}
            plugins={activePlugins}
            toolbar={{ sticky: true, items: ['undo', 'redo', 'bold', 'italic', 'link', 'blockquote', 'clearformatting'] }}
            statusbar={{ enabled: true }}
            content={{ minHeight: 200 }}
          />,
        )}
      </div>
      <div style={panel}>
        <h3 style={h3}>Live HTML output</h3>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 12, color: '#334155', background: '#f8fafc', borderRadius: 10, padding: 12, maxHeight: 180, overflow: 'auto' }}>
          {html}
        </pre>
      </div>
    </div>
  );
}

export function EditoraReadOnlyDemo() {
  return (
    <div>
      <h2 style={h2}>Read-only Editor</h2>
      <div style={panel}>
        <h3 style={h3}>Reviewer view</h3>
        {editorShell(
          <RichTextEditor
            defaultValue={readonlyHtml}
            readonly
            toolbar={{ items: [] }}
            statusbar={{ enabled: false }}
            content={{ minHeight: 180 }}
          />,
        )}
      </div>
    </div>
  );
}

export function EditoraPluginsDemo() {
  const activePlugins = useMemo(createFormattingPlugins, []);

  return (
    <div>
      <h2 style={h2}>Plugin Toolbar</h2>
      <div style={panel}>
        <h3 style={h3}>Formatting plugin set</h3>
        {editorShell(
          <RichTextEditor
            defaultValue="<h2>Plugin document</h2><p>Select text and use the toolbar for formatting, links, lists, colors, and code.</p>"
            plugins={activePlugins}
            toolbar={{ sticky: true, showMoreOptions: true }}
            floatingToolbar={{ enabled: true }}
            contextMenu={{ enabled: true }}
            history={{ maxSteps: 50, debounceMs: 300 }}
            content={{ minHeight: 240 }}
          />,
        )}
      </div>
    </div>
  );
}

export function EditoraEnterpriseDemo() {
  const activePlugins = useMemo(createEnterprisePlugins, []);
  const rtlPlugins = useMemo(() => [BoldPlugin(), ItalicPlugin(), DirectionPlugin(), HistoryPlugin()], []);

  return (
    <div>
      <h2 style={h2}>Enterprise Editor</h2>
      <Grid style={{ gap: 20 }}>
        <div style={panel}>
          <h3 style={h3}>Document workflow setup</h3>
          {editorShell(
            <RichTextEditor
              defaultValue="<h2>Quarterly business review</h2><p>Add tables, comments, code samples, equations, and review helpers from the enterprise-style plugin set.</p>"
              plugins={activePlugins}
              toolbar={{ sticky: true, showMoreOptions: true }}
              menubar={{ enabled: true, items: ['file', 'edit', 'insert', 'format', 'tools'] }}
              contextMenu={{ enabled: true }}
              paste={{ clean: true, keepFormatting: true, convertWord: true }}
              spellcheck={{ enabled: true, provider: 'browser' }}
              accessibility={{ enableARIA: true, keyboardNavigation: true, checker: true }}
              security={{ sanitizeOnInput: true, sanitizeOnPaste: true }}
              statusbar={{ enabled: true }}
              content={{ minHeight: 260, sanitize: true }}
            />,
          )}
        </div>
        <div style={panel}>
          <h3 style={h3}>RTL and autosave configuration</h3>
          {editorShell(
            <RichTextEditor
              defaultValue="<h2>Global content note</h2><p>Use language and autosave options for internationalized authoring flows.</p>"
              plugins={rtlPlugins}
              toolbar={{ items: ['bold', 'italic', 'direction', 'undo', 'redo'] }}
              language={{ locale: 'ar', direction: 'rtl' }}
              autosave={{ enabled: true, intervalMs: 3000, storageKey: 'editora-sandbox-autosave', provider: 'localStorage' }}
              content={{ minHeight: 180 }}
            />,
          )}
        </div>
      </Grid>
    </div>
  );
}

export function EditoraAllToolbarsDemo() {
  const [readonly, setReadonly] = useState(true);
  const [themeA, setThemeA] = useState<'default' | 'dark' | 'acme'>('default');
  const [themeB, setThemeB] = useState<'default' | 'dark' | 'acme'>('dark');
  const [contentA, setContentA] = useState('');
  const [contentB, setContentB] = useState('');
  const [controlledValue, setControlledValue] = useState('<h2>Controlled Editor</h2><p>This editor content is controlled by React state.</p>');

  const storyBasicPlugins = useMemo(createAllToolbarPlugins, []);
  const customToolbarPlugins = useMemo(
    () => [BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), StrikethroughPlugin(), LinkPlugin(), HistoryPlugin()],
    [],
  );
  const showcasePlugins = useMemo(createAllToolbarPlugins, []);
  const readonlyPlugins = useMemo(createAllToolbarPlugins, []);
  const placeholderSimplePlugins = useMemo(() => [BoldPlugin(), ItalicPlugin()], []);
  const placeholderDetailedPlugins = useMemo(() => [BoldPlugin(), ItalicPlugin(), UnderlinePlugin()], []);
  const placeholderPrefilledPlugins = useMemo(() => [BoldPlugin(), ItalicPlugin()], []);
  const themeAPlugins = useMemo(createAllToolbarPlugins, []);
  const themeBPlugins = useMemo(createAllToolbarPlugins, []);
  const multiAPlugins = useMemo(createAllToolbarPlugins, []);
  const multiBPlugins = useMemo(createAllToolbarPlugins, []);
  const controlledPlugins = useMemo(createAllToolbarPlugins, []);
  const bottomPlugins = useMemo(createFormattingPlugins, []);
  const floatingPlugins = useMemo(createFormattingPlugins, []);

  const cycleTheme = (theme: 'default' | 'dark' | 'acme') => {
    if (theme === 'default') return 'dark';
    if (theme === 'dark') return 'acme';
    return 'default';
  };

  const themedPanelStyle = (theme: 'default' | 'dark' | 'acme'): React.CSSProperties => ({
    padding: 12,
    borderRadius: 12,
    background: theme === 'dark' ? '#0b1220' : theme === 'acme' ? '#eef4fb' : '#ffffff',
    border: '1px solid #e2e8f0',
  });

  return (
    <div>
      <h2 style={h2}>All Editor Toolbars</h2>
      <Grid style={{ gap: 20 }}>
        <div style={panel}>
          <h3 style={h3}>Storybook Basic: all available native toolbar plugins</h3>
          {editorShell(
            <RichTextEditor
              plugins={storyBasicPlugins}
              statusbar={{ enabled: true, position: 'bottom' }}
              floatingToolbar={true}
              defaultValue="<h2>Welcome to Editora</h2><p>This is a <strong>framework-agnostic</strong> rich text editor with a broad native plugin surface.</p><p><strong>Core capabilities:</strong></p><ul><li>Zero framework dependencies in the editor runtime</li><li>Large native plugin catalog for enterprise workflows</li><li>Declarative TinyMCE-style API</li></ul>"
              content={{ minHeight: 240 }}
            />,
          )}
        </div>

        <div style={panel}>
          <h3 style={h3}>Custom toolbar string syntax</h3>
          {editorShell(
            <RichTextEditor
              plugins={customToolbarPlugins}
              statusbar={{ enabled: true }}
              toolbar={{ items: 'undo redo | bold italic underline strikethrough | link', sticky: true }}
              defaultValue="<h2>Minimal Editor</h2><p>This editor has a <strong>simplified toolbar</strong> using the Storybook string format with separators.</p><p>Perfect for comments, lightweight review flows, or simple text input.</p>"
              content={{ minHeight: 200 }}
            />,
          )}
        </div>

        <div style={panel}>
          <h3 style={h3}>All plugins showcase</h3>
          <div style={{ ...compactGrid, marginBottom: 16, fontSize: 13, color: '#475569' }}>
            <div><strong>Basic Formatting:</strong><br />Bold, Italic, Underline, Strikethrough, ClearFormatting</div>
            <div><strong>Block Types:</strong><br />Heading, Blockquote, Code, Code Sample</div>
            <div><strong>Lists:</strong><br />List, Checklist</div>
            <div><strong>Layout:</strong><br />TextAlignment, Indent, Direction</div>
            <div><strong>Typography:</strong><br />TextColor, BackgroundColor, FontSize, FontFamily, LineHeight, Capitalization</div>
            <div><strong>Content:</strong><br />Link, Table, Anchor, EmbedIframe, Footnote</div>
            <div><strong>Special:</strong><br />Math, SpecialCharacters, Emojis</div>
            <div><strong>Tools:</strong><br />A11yChecker, Comments, DocumentManager, Fullscreen</div>
          </div>
          {editorShell(
            <RichTextEditor
              plugins={showcasePlugins}
              statusbar={{ enabled: true }}
              toolbar={{ sticky: true, showMoreOptions: true }}
              menubar={{ enabled: true, items: ['file', 'edit', 'insert', 'format', 'tools'] }}
              floatingToolbar={true}
              contextMenu={{ enabled: true }}
              defaultValue={allPluginsShowcaseHtml}
              content={{ minHeight: 320, sanitize: true }}
            />,
          )}
        </div>

        <div style={panel}>
          <h3 style={h3}>Readonly mode with toolbar surface</h3>
          <Flex style={{ gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <Button size="sm" onClick={() => setReadonly((value) => !value)}>
              {readonly ? 'Enable editing' : 'Disable editing'}
            </Button>
          </Flex>
          {editorShell(
            <RichTextEditor
              plugins={readonlyPlugins}
              statusbar={{ enabled: true }}
              readonly={readonly}
              defaultValue="<h2>Readonly Content</h2><p>This content can be toggled between readonly and editable mode.</p><ul><li>Useful for previews and audit views</li><li>Good for formatted document display</li><li>Supports review-mode workflows</li></ul>"
              content={{ minHeight: 220 }}
            />,
          )}
        </div>

        <div style={panel}>
          <h3 style={h3}>Placeholder patterns</h3>
          <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {editorShell(
              <RichTextEditor
                plugins={placeholderSimplePlugins}
                toolbar={{ items: 'bold italic', showMoreOptions: false }}
                statusbar={{ enabled: true }}
                placeholder="Type something here..."
                content={{ minHeight: 150 }}
              />,
            )}
            {editorShell(
              <RichTextEditor
                plugins={placeholderDetailedPlugins}
                toolbar={{ items: 'bold italic underline', showMoreOptions: false }}
                statusbar={{ enabled: true }}
                placeholder="Draft release notes: summary, impact, migration steps, and rollback plan."
                content={{ minHeight: 150 }}
              />,
            )}
            {editorShell(
              <RichTextEditor
                plugins={placeholderPrefilledPlugins}
                toolbar={{ items: 'bold italic', showMoreOptions: false }}
                statusbar={{ enabled: true }}
                placeholder="Delete all content to show this placeholder."
                defaultValue="<p>This editor starts with content. Clear it to reveal placeholder.</p>"
                content={{ minHeight: 150 }}
              />,
            )}
          </Grid>
        </div>

        <div style={panel}>
          <h3 style={h3}>Theme switcher editor-only pattern</h3>
          <Flex style={{ gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <Button size="sm" onClick={() => setThemeA(cycleTheme(themeA))}>Cycle editor A</Button>
            <Button size="sm" variant="secondary" onClick={() => setThemeB(cycleTheme(themeB))}>Cycle editor B</Button>
            <Button size="sm" variant="ghost" onClick={() => { setThemeA('default'); setThemeB('dark'); }}>Reset themes</Button>
          </Flex>
          <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div data-theme={themeA} style={themedPanelStyle(themeA)}>
              <h3 style={{ ...h3, color: themeA === 'dark' ? '#f8fafc' : '#334155' }}>Editor A</h3>
              {editorShell(
                <RichTextEditor plugins={themeAPlugins} toolbar={{ showMoreOptions: false }} statusbar={{ enabled: true }} floatingToolbar={true} defaultValue="<p>Editor A theme is controlled independently.</p>" content={{ minHeight: 170 }} />,
              )}
            </div>
            <div data-theme={themeB} style={themedPanelStyle(themeB)}>
              <h3 style={{ ...h3, color: themeB === 'dark' ? '#f8fafc' : '#334155' }}>Editor B</h3>
              {editorShell(
                <RichTextEditor plugins={themeBPlugins} toolbar={{ showMoreOptions: false }} statusbar={{ enabled: true }} floatingToolbar={true} defaultValue="<p>Editor B can use a different theme from Editor A.</p>" content={{ minHeight: 170 }} />,
              )}
            </div>
          </Grid>
        </div>

        <div style={panel}>
          <h3 style={h3}>Multiple editors with synchronized content</h3>
          <Flex style={{ gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <Button size="sm" onClick={() => setContentB(contentA)}>Sync A to B</Button>
            <Button size="sm" variant="secondary" onClick={() => setContentA(contentB)}>Sync B to A</Button>
          </Flex>
          <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {editorShell(
              <RichTextEditor
                plugins={multiAPlugins}
                toolbar={{ showMoreOptions: false }}
                statusbar={{ enabled: true }}
                onChange={setContentA}
                defaultValue="<h3>Editor A</h3><p>Type here...</p>"
                content={{ minHeight: 190 }}
              />,
            )}
            {editorShell(
              <RichTextEditor
                plugins={multiBPlugins}
                toolbar={{ showMoreOptions: false }}
                statusbar={{ enabled: true }}
                value={contentB}
                onChange={setContentB}
                defaultValue="<h3>Editor B</h3><p>Type here...</p>"
                content={{ minHeight: 190 }}
              />,
            )}
          </Grid>
        </div>

        <div style={panel}>
          <h3 style={h3}>Controlled editor</h3>
          <Flex style={{ gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <Button size="sm" onClick={() => setControlledValue('<h2>Reset!</h2><p>Content was reset from the sandbox controls.</p>')}>Reset content</Button>
            <Button size="sm" variant="secondary" onClick={() => setControlledValue((value) => `${value}<p>Appended from the sandbox controls.</p>`)}>Append content</Button>
          </Flex>
          {editorShell(
            <RichTextEditor
              plugins={controlledPlugins}
              statusbar={{ enabled: true }}
              value={controlledValue}
              onChange={setControlledValue}
              content={{ minHeight: 220 }}
            />,
          )}
        </div>

        <div style={panel}>
          <h3 style={h3}>Bottom toolbar placement</h3>
          {editorShell(
            <RichTextEditor
              defaultValue="<h2>Bottom toolbar</h2><p>The same formatting commands can be placed below the document surface for compact embedded editors.</p>"
              plugins={bottomPlugins}
              toolbar={{ position: 'bottom', items: ['heading', 'bold', 'italic', 'underline', 'textalignment', 'textcolor', 'backgroundcolor', 'bullist', 'numlist', 'checklist', 'link', 'code', 'clearformatting'], showMoreOptions: true } as any}
              statusbar={{ enabled: false }}
              content={{ minHeight: 200 }}
            />,
          )}
        </div>

        <div style={panel}>
          <h3 style={h3}>Selection floating toolbar</h3>
          {editorShell(
            <RichTextEditor
              defaultValue="<h2>Floating selection toolbar</h2><p>Select this sentence to reveal the contextual floating toolbar while the main toolbar stays available for document-level commands.</p>"
              plugins={floatingPlugins}
              toolbar={{ items: ['bold', 'italic', 'underline', 'strikethrough', 'link', 'blockquote', 'clearformatting'], floating: true, showMoreOptions: false }}
              floatingToolbar={{ enabled: true }}
              contextMenu={{ enabled: true }}
              content={{ minHeight: 190 }}
            />,
          )}
        </div>
      </Grid>
    </div>
  );
}

export function EditoraApiDemo() {
  const editorRef = useRef<EditorAPI | null>(null);
  const [snapshot, setSnapshot] = useState('');
  const activePlugins = useMemo(createBasicPlugins, []);

  const setPreset = () => {
    editorRef.current?.setHTML('<h2>API inserted content</h2><p>This content was pushed through the EditorAPI.</p>');
    setSnapshot(editorRef.current?.getHTML() || '');
  };

  return (
    <div>
      <h2 style={h2}>Editor API</h2>
      <div style={panel}>
        <h3 style={h3}>Imperative controls</h3>
        <Flex style={{ gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <Button size="sm" onClick={() => editorRef.current?.focus()}>Focus</Button>
          <Button size="sm" variant="secondary" onClick={setPreset}>Insert preset</Button>
          <Button size="sm" variant="secondary" onClick={() => setSnapshot(editorRef.current?.getHTML() || '')}>Read HTML</Button>
          <Button size="sm" variant="ghost" onClick={() => toastAdvanced.info('State captured', { duration: 1200, theme: 'light' })}>Toast</Button>
        </Flex>
        {editorShell(
          <RichTextEditor
            defaultValue="<p>Use the buttons above to focus, insert, and inspect editor content.</p>"
            plugins={activePlugins}
            onInit={(editor) => {
              editorRef.current = editor;
              setSnapshot(editor.getHTML());
            }}
            onChange={setSnapshot}
            toolbar={{ items: ['bold', 'italic', 'link'] }}
            content={{ minHeight: 180 }}
          />,
        )}
      </div>
      <div style={panel}>
        <h3 style={h3}>Latest HTML snapshot</h3>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 12, color: '#334155', background: '#f8fafc', borderRadius: 10, padding: 12 }}>
          {snapshot || 'No content captured yet.'}
        </pre>
      </div>
    </div>
  );
}

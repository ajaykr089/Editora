import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EditoraEditor } from '@editora/react';
import { Box, Grid } from '@editora/ui-react';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import { allNativePlugins } from './richTextEditor.shared';

const meta: Meta<typeof EditoraEditor> = {
  title: 'Editor/Rich Text Editor - Web Component/Formatting & Content',
  component: EditoraEditor,
  parameters: {
    layout: 'padded',
    docs: {
      source: { type: 'code' },
      description: {
        component: 'Formatting and content examples were split out of the main docs page to keep the base editor docs responsive.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllPluginsShowcase: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '4px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>All Native Plugins Loaded</h3>
        <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '13px' }}>
          <div><strong>Basic Formatting:</strong><br />Bold, Italic, Underline, Strikethrough, ClearFormatting</div>
          <div><strong>Block Types:</strong><br />Heading, Blockquote, Code, Code Sample</div>
          <div><strong>Lists:</strong><br />List, Checklist</div>
          <div><strong>Layout:</strong><br />TextAlignment, Indent, Direction</div>
          <div><strong>Typography:</strong><br />TextColor, BackgroundColor, FontSize, FontFamily, LineHeight, Capitalization</div>
          <div><strong>Content:</strong><br />Link, Table, Anchor, EmbedIframe, Footnote</div>
          <div><strong>Special:</strong><br />Math, SpecialCharacters, Emojis</div>
          <div><strong>Tools:</strong><br />A11yChecker, Comments, DocumentManager, Fullscreen</div>
          <div><strong>Workflow:</strong><br />Schema, Translation, Approval, SmartPaste, PII Redaction</div>
        </Grid>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={`
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
          <blockquote>"This is a blockquote. It can contain multiple paragraphs and formatting."</blockquote>
          <h2>Code</h2>
          <pre><code>function hello() { console.log("Hello, World!"); }</code></pre>
          <h2>Tables</h2>
          <table border="1"><tr><th>Header 1</th><th>Header 2</th></tr><tr><td>Cell 1</td><td>Cell 2</td></tr></table>
        `}
      />
    </div>
  ),
};

export const MathEquations: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#e1f5fe', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Math Plugin</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>Insert mathematical equations using LaTeX notation.</p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={`
          <h2>Mathematical Equations</h2>
          <p>Inline equation: <span data-math-inline="true" data-latex="E = mc^2" class="math-inline">$E = mc^2$</span></p>
          <div data-math-block="true" data-latex="\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}" class="math-block">
            $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$
          </div>
          <p>Pythagorean theorem: <span data-math-inline="true" data-latex="a^2 + b^2 = c^2" class="math-inline">$a^2 + b^2 = c^2$</span></p>
        `}
      />
    </div>
  ),
};

export const SpecialContent: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#fce4ec', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Special Characters & Emojis</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>Insert special characters and emojis from the editor tool surface.</p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={`
          <h2>Special Characters & Emojis</h2>
          <h3>Special Characters</h3>
          <p>Common: © ® ™ § ¶ † ‡ • ★</p>
          <p>Arrows: → ← ↑ ↓ ↔ ⇒ ⇐</p>
          <p>Currency: $ € £ ¥ ₹ ₽</p>
          <p>Math: ± × ÷ ≠ ≤ ≥ ∞ ∑ ∫ √</p>
          <p>Greek: α β γ δ π σ θ Ω</p>
          <h3>Emojis</h3>
          <p>Smileys: 😀 😃 😄 😊 😍 🤩</p>
          <p>Gestures: 👍 👏 🙌 💪 ✌️ 🤝</p>
          <p>Objects: 💻 📱 📷 ⌚ 💡 🔋</p>
          <p>Nature: 🌵 🌲 🌹 🌸 ⭐ 🌞</p>
        `}
      />
    </div>
  ),
};

export const Tables: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#f1f8e9', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Table Plugin</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>Create and edit structured tables in the editor.</p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={`
          <h2>Tables</h2>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="padding: 8px; background: #f5f5f5;">Feature</th>
                <th style="padding: 8px; background: #f5f5f5;">Status</th>
                <th style="padding: 8px; background: #f5f5f5;">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding: 8px;">Web Component</td><td style="padding: 8px;">Complete</td><td style="padding: 8px;">Framework-agnostic</td></tr>
              <tr><td style="padding: 8px;">Native Plugins</td><td style="padding: 8px;">Complete</td><td style="padding: 8px;">Extensive surface</td></tr>
              <tr><td style="padding: 8px;">Bundle Size</td><td style="padding: 8px;">Optimized</td><td style="padding: 8px;">Lean runtime</td></tr>
            </tbody>
          </table>
        `}
      />
    </div>
  ),
};

export const EventHandling: Story = {
  render: () => {
    const [content, setContent] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    const handleChange = (html: string) => {
      setContent(html);
      const text = html.replace(/<[^>]*>/g, '').trim();
      setWordCount(text.split(/\s+/).filter(Boolean).length);
      setCharCount(text.length);
    };

    return (
      <div>
        <EditoraEditor
          plugins={allNativePlugins}
          statusbar={{ enabled: true }}
          onChange={handleChange}
          defaultValue={`
            <h2>Try typing here</h2>
            <p>Watch the statistics update in real time as you type.</p>
          `}
        />

        <Box style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Statistics</h4>
          <p style={{ margin: '5px 0' }}>Words: <strong>{wordCount}</strong></p>
          <p style={{ margin: '5px 0' }}>Characters: <strong>{charCount}</strong></p>
          <details style={{ marginTop: '10px' }}>
            <summary style={{ cursor: 'pointer' }}>Show HTML</summary>
            <pre style={{ fontSize: '12px', overflow: 'auto', marginTop: '10px' }}>{content}</pre>
          </details>
        </Box>
      </div>
    );
  },
};

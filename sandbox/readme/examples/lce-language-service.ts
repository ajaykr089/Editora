import { createEditor, createLanguageServiceExtensions, type CompletionContext } from '@editora/light-code-editor';
import '@editora/light-code-editor/light-code-editor.css';

const container = document.getElementById('editor') as HTMLElement;

const languageService = createLanguageServiceExtensions({
  languageId: 'html',
  highlight: ({ text }) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
  diagnostics: async ({ text, abortSignal }) => {
    if (abortSignal?.aborted) {
      return [];
    }

    return text.includes('onclick=')
      ? [
          {
            severity: 'warning',
            message: 'Inline handlers need review',
            range: {
              start: { line: 0, column: 8 },
              end: { line: 0, column: 15 },
            },
          },
        ]
      : [];
  },
  completionProviders: [
    (context: CompletionContext) =>
      context.prefix.startsWith('di') ? [{ label: 'div', kind: 'tag', insertText: 'div' }] : [],
  ],
  hover: ({ diagnostics }) =>
    diagnostics[0]
      ? {
          title: diagnostics[0].code || diagnostics[0].severity,
          content: diagnostics[0].message,
          range: diagnostics[0].range,
        }
      : null,
  codeActions: ({ lineText, position }) =>
    lineText.includes('onclick=')
      ? [
          {
            label: 'Remove inline onclick handler',
            run: (editor) => {
              const start = lineText.indexOf('onclick=');
              editor.replace(
                {
                  start: { line: position.line, column: Math.max(0, start - 1) },
                  end: { line: position.line, column: start + 'onclick="save()"'.length },
                },
                '',
              );
            },
          },
        ]
      : [],
});

const editor = createEditor(container, {
  value: '<button onclick="save()">Save</button>\n<div class="note">Hello</div>\n',
  extensions: languageService.extensions,
});

editor.executeCommand('refreshLanguageDiagnostics');
editor.executeCommand('showCodeActions');

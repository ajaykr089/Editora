
import type { Preview } from '@storybook/react';

const storyRawModules = import.meta.glob('./stories/**/*.stories.tsx', { as: 'raw', eager: true }) as Record<
  string,
  string
>;

type ScanState = 'normal' | 'single' | 'double' | 'template' | 'line-comment' | 'block-comment';

function extractConsumerImports(source: string): string {
  const imports = source.match(/(^import[\s\S]*?;)/gm) ?? [];
  const consumerImports = imports.filter((statement) => {
    const specifier = statement.match(/from\s+['"]([^'"]+)['"]/);
    if (!specifier) return false;
    return specifier[1].startsWith('@editora/');
  });
  return consumerImports.join('\n').trim();
}

function normalizeStoryFileName(fileName?: string): string {
  if (!fileName) return '';
  return fileName
    .replace(/\\/g, '/')
    .replace(/^\.?\/?\.storybook\//, './')
    .replace(/^\.\//, './');
}

function basename(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1] || path;
}

function extractWrapperTagName(source: string): string | null {
  const match = source.trim().match(/^<([A-Z][A-Za-z0-9_]*)\b[^>]*\/>\s*;?$/);
  return match?.[1] ?? null;
}

function extractStandaloneWrapperTarget(source: string): string | null {
  const trimmed = source.trim();
  const direct = trimmed.match(/^<([A-Z][A-Za-z0-9_]*)\b[^>]*\/>\s*;?$/);
  if (direct) return direct[1];

  const arrow = trimmed.match(
    /^(?:\([^)]*\)|[A-Za-z_$][A-Za-z0-9_$]*)\s*=>\s*\(?\s*<([A-Z][A-Za-z0-9_]*)\b[\s\S]*\/>\s*\)?\s*;?$/
  );
  return arrow?.[1] ?? null;
}

function extractStandaloneIdentifierTarget(source: string): string | null {
  const match = source.trim().match(/^([A-Z][A-Za-z0-9_]*)\s*;?$/);
  return match?.[1] ?? null;
}

function extractImportedIdentifiers(source: string): Set<string> {
  const result = new Set<string>();
  const importPattern = /^import\s+([\s\S]*?)\s+from\s+['"][^'"]+['"];?$/gm;
  let match: RegExpExecArray | null = null;

  while ((match = importPattern.exec(source)) !== null) {
    const clause = match[1].trim();
    if (!clause) continue;

    const namespaceMatch = clause.match(/\*\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
    if (namespaceMatch?.[1]) result.add(namespaceMatch[1]);

    const defaultMatch = clause.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*(?:,|$)/);
    if (defaultMatch && !clause.startsWith('{') && !clause.startsWith('*')) {
      result.add(defaultMatch[1]);
    }

    const namedMatch = clause.match(/\{([\s\S]*?)\}/);
    if (namedMatch?.[1]) {
      const parts = namedMatch[1].split(',').map((part) => part.trim()).filter(Boolean);
      for (const part of parts) {
        const cleaned = part.replace(/^type\s+/, '').trim();
        const aliasMatch = cleaned.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)$/);
        if (aliasMatch?.[2]) {
          result.add(aliasMatch[2]);
          continue;
        }
        if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(cleaned)) {
          result.add(cleaned);
        }
      }
    }
  }

  return result;
}

function extractReferencedComponentTags(source: string): string[] {
  const matches = source.matchAll(/<([A-Z][A-Za-z0-9_]*)\b/g);
  const ordered = new Set<string>();
  for (const match of matches) {
    if (match[1]) ordered.add(match[1]);
  }
  return Array.from(ordered);
}

function matchBalanced(source: string, openIndex: number, openChar: string, closeChar: string): number {
  let depth = 0;
  let state: ScanState = 'normal';

  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];
    const prev = source[i - 1];

    if (state === 'line-comment') {
      if (ch === '\n') state = 'normal';
      continue;
    }
    if (state === 'block-comment') {
      if (ch === '*' && next === '/') {
        state = 'normal';
        i += 1;
      }
      continue;
    }
    if (state === 'single') {
      if (ch === "'" && prev !== '\\') state = 'normal';
      continue;
    }
    if (state === 'double') {
      if (ch === '"' && prev !== '\\') state = 'normal';
      continue;
    }
    if (state === 'template') {
      if (ch === '`' && prev !== '\\') state = 'normal';
      continue;
    }

    if (ch === '/' && next === '/') {
      state = 'line-comment';
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      state = 'block-comment';
      i += 1;
      continue;
    }
    if (ch === "'") {
      state = 'single';
      continue;
    }
    if (ch === '"') {
      state = 'double';
      continue;
    }
    if (ch === '`') {
      state = 'template';
      continue;
    }

    if (ch === openChar) depth += 1;
    if (ch === closeChar) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function findStatementEnd(source: string, startIndex: number): number {
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let state: ScanState = 'normal';

  for (let i = startIndex; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];
    const prev = source[i - 1];

    if (state === 'line-comment') {
      if (ch === '\n') state = 'normal';
      continue;
    }
    if (state === 'block-comment') {
      if (ch === '*' && next === '/') {
        state = 'normal';
        i += 1;
      }
      continue;
    }
    if (state === 'single') {
      if (ch === "'" && prev !== '\\') state = 'normal';
      continue;
    }
    if (state === 'double') {
      if (ch === '"' && prev !== '\\') state = 'normal';
      continue;
    }
    if (state === 'template') {
      if (ch === '`' && prev !== '\\') state = 'normal';
      continue;
    }

    if (ch === '/' && next === '/') {
      state = 'line-comment';
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      state = 'block-comment';
      i += 1;
      continue;
    }
    if (ch === "'") {
      state = 'single';
      continue;
    }
    if (ch === '"') {
      state = 'double';
      continue;
    }
    if (ch === '`') {
      state = 'template';
      continue;
    }

    if (ch === '(') depthParen += 1;
    if (ch === ')') depthParen = Math.max(0, depthParen - 1);
    if (ch === '{') depthBrace += 1;
    if (ch === '}') depthBrace = Math.max(0, depthBrace - 1);
    if (ch === '[') depthBracket += 1;
    if (ch === ']') depthBracket = Math.max(0, depthBracket - 1);

    if (ch === ';' && depthParen === 0 && depthBrace === 0 && depthBracket === 0) {
      return i;
    }
  }

  return -1;
}

function extractComponentImplementation(storySource: string, componentName: string): string | null {
  const fnPattern = new RegExp(`\\bfunction\\s+${componentName}\\s*\\(`);
  const fnMatch = fnPattern.exec(storySource);
  if (fnMatch) {
    const bodyStart = storySource.indexOf('{', fnMatch.index);
    if (bodyStart !== -1) {
      const bodyEnd = matchBalanced(storySource, bodyStart, '{', '}');
      if (bodyEnd !== -1) {
        return storySource.slice(fnMatch.index, bodyEnd + 1).trim();
      }
    }
  }

  const constPattern = new RegExp(`\\b(?:const|let|var)\\s+${componentName}\\s*=`);
  const constMatch = constPattern.exec(storySource);
  if (constMatch) {
    const end = findStatementEnd(storySource, constMatch.index);
    if (end !== -1) {
      return storySource.slice(constMatch.index, end + 1).trim();
    }
  }

  return null;
}

function getComponentDeclarationName(definition: string): string | null {
  const fnMatch = definition.match(/^function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/);
  if (fnMatch?.[1]) return fnMatch[1];
  const constMatch = definition.match(/^(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=/);
  return constMatch?.[1] ?? null;
}

function collectLocalComponentImplementations(storySource: string, snippet: string): string[] {
  const imported = extractImportedIdentifiers(storySource);
  const queue = extractReferencedComponentTags(snippet);
  const visited = new Set<string>();
  const implementations: string[] = [];

  while (queue.length > 0) {
    const name = queue.shift();
    if (!name || visited.has(name)) continue;
    visited.add(name);
    if (imported.has(name)) continue;

    const implementation = extractComponentImplementation(storySource, name);
    if (!implementation) continue;
    implementations.push(implementation);

    const nested = extractReferencedComponentTags(implementation);
    for (const nestedName of nested) {
      if (!visited.has(nestedName)) queue.push(nestedName);
    }
  }

  return implementations;
}

const storyImportsByPath = new Map<string, string>();
const storyImportsByBasename = new Map<string, string>();
const storySourceByPath = new Map<string, string>();
const storySourceByBasename = new Map<string, string>();
for (const [path, source] of Object.entries(storyRawModules)) {
  const normalized = normalizeStoryFileName(path);
  const fileBaseName = basename(path);
  const imports = extractConsumerImports(source);
  storySourceByPath.set(normalized, source);
  storySourceByBasename.set(fileBaseName, source);
  if (imports) {
    storyImportsByPath.set(normalized, imports);
    storyImportsByBasename.set(fileBaseName, imports);
  }
}

function buildDocsSource(source: string, fileName?: string): string {
  if (!source) return source;
  const normalizedFileName = normalizeStoryFileName(fileName);
  const fileBaseName = basename(normalizedFileName || fileName || '');
  const storySource = storySourceByPath.get(normalizedFileName) || storySourceByBasename.get(fileBaseName);
  const imports = storyImportsByPath.get(normalizedFileName) || storyImportsByBasename.get(fileBaseName);
  const wrapperTag = extractWrapperTagName(source);
  let snippet = source.trim();

  if (wrapperTag && storySource) {
    const wrapperImplementation = extractComponentImplementation(storySource, wrapperTag);
    if (wrapperImplementation) {
      snippet = wrapperImplementation;
    }
  }

  const standaloneWrapper = storySource ? extractStandaloneWrapperTarget(snippet) : null;
  if (standaloneWrapper && storySource) {
    const wrapperImplementation = extractComponentImplementation(storySource, standaloneWrapper);
    if (wrapperImplementation) {
      snippet = wrapperImplementation;
    }
  }

  const standaloneIdentifier = storySource ? extractStandaloneIdentifierTarget(snippet) : null;
  if (standaloneIdentifier && storySource) {
    const identifierImplementation = extractComponentImplementation(storySource, standaloneIdentifier);
    if (identifierImplementation) {
      snippet = identifierImplementation;
    }
  }

  const extraDefinitions =
    storySource && !/^\s*import\s/m.test(snippet)
      ? collectLocalComponentImplementations(storySource, snippet)
      : [];
  const snippetName = getComponentDeclarationName(snippet);
  const filteredDefinitions = extraDefinitions.filter((definition) => {
    const name = getComponentDeclarationName(definition);
    return !name || name !== snippetName;
  });

  const sections: string[] = [];
  if (imports && !/^\s*import\s/m.test(snippet)) sections.push(imports);
  if (filteredDefinitions.length > 0) sections.push(filteredDefinitions.join('\n\n'));
  sections.push(snippet);

  return sections.join('\n\n').trim();
}

if (typeof document !== 'undefined' && !document.getElementById('editora-not-defined-guard')) {
  const style = document.createElement('style');
  style.id = 'editora-not-defined-guard';
  // Prevent upgrade flicker for web components before customElements.define runs.
  style.textContent = ':not(:defined) { visibility: hidden; }';
  document.head.appendChild(style);
}

const preview: Preview = {
  parameters: {
    docs: {
      canvas: {
        sourceState: 'shown',
      },
      source: {
        state: 'open',
        type: 'dynamic',
        transform: (source: string, context: { parameters?: { fileName?: string } }) => {
          try {
            return buildDocsSource(source, context?.parameters?.fileName);
          } catch (error) {
            const fileName = context?.parameters?.fileName || 'unknown-story';
            console.warn(`[storybook] docs source transform failed for ${fileName}`, error);
            return source;
          }
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

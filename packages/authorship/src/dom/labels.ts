import type { Origin, OriginKind } from '../core/types.js';

export interface AuthorshipLabels {
  kinds: Record<OriginKind, string>;
  sources: Record<string, string>;
  pastedFrom: string;
  writtenBy: string;
  insertedBy: string;
  recording: string;
  notRecording: string;
}

export const DEFAULT_LABELS: AuthorshipLabels = {
  kinds: {
    typed: 'Typed',
    pasted: 'Pasted',
    ai: 'AI',
    collaborator: 'Collaborator',
    tool: 'Editor tool',
    external: 'Changed outside the editor',
    existing: 'Before recording',
  },
  sources: {
    word: 'Microsoft Word',
    'google-docs': 'Google Docs',
    'google-sheets': 'Google Sheets',
    excel: 'Excel',
    libreoffice: 'LibreOffice',
    apple: 'an Apple app',
    vscode: 'VS Code',
    web: 'a web page',
    plain: 'plain text',
    internal: 'this document',
  },
  pastedFrom: 'Pasted from {source}',
  writtenBy: 'Written by {model}',
  insertedBy: 'Inserted by {tool}',
  recording: 'Recording authorship',
  notRecording: 'Authorship recording is off',
};

export function mergeLabels(labels?: Partial<AuthorshipLabels>): AuthorshipLabels {
  return {
    ...DEFAULT_LABELS,
    ...labels,
    kinds: { ...DEFAULT_LABELS.kinds, ...labels?.kinds },
    sources: { ...DEFAULT_LABELS.sources, ...labels?.sources },
  };
}

const fill = (template: string, value: string) => template.replace('{source}', value).replace('{model}', value).replace('{tool}', value);

/** One line for an origin: "Pasted from Google Docs", "Written by gemma4 (Ollama)". */
export function describeOrigin(origin: Origin, labels: AuthorshipLabels = DEFAULT_LABELS): string {
  if (origin.kind === 'pasted' && origin.source) {
    const source = labels.sources[origin.source] ?? origin.source;
    const via = origin.via === 'drop' ? ' (dropped)' : '';
    return fill(labels.pastedFrom, source) + via;
  }
  if (origin.kind === 'ai' && origin.model) return fill(labels.writtenBy, origin.provider ? `${origin.model} (${origin.provider})` : origin.model);
  if (origin.kind === 'tool' && origin.source) return fill(labels.insertedBy, origin.source);
  return labels.kinds[origin.kind];
}

export function formatTime(t: number, locale?: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(t);
  } catch {
    return new Date(t).toISOString();
  }
}

export function formatDuration(ms: number): string {
  const minutes = Math.round(ms / 60_000);
  if (minutes < 1) return `${Math.max(1, Math.round(ms / 1000))} s`;
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

import { describe, expect, it } from 'vitest';
import { DEFAULT_LABELS, fillLabel, resolveLabels } from '../components/labels';

describe('resolveLabels', () => {
  it('is the English labels with nothing given', () => {
    expect(resolveLabels()).toBe(DEFAULT_LABELS);
    expect(resolveLabels(undefined).title).toBe('Markdown');
  });

  it('replaces only the entries given', () => {
    const labels = resolveLabels({ title: 'Markdown (es)', split: 'Dividido' });
    expect(labels.title).toBe('Markdown (es)');
    expect(labels.split).toBe('Dividido');
    expect(labels.edit).toBe(DEFAULT_LABELS.edit);
    expect(labels.commands).toEqual(DEFAULT_LABELS.commands);
  });

  it('merges the commands one by one', () => {
    const labels = resolveLabels({ commands: { bold: 'Negrita' } });
    expect(labels.commands.bold).toBe('Negrita');
    expect(labels.commands.italic).toBe('Italic');
    expect(Object.keys(labels.commands)).toEqual(Object.keys(DEFAULT_LABELS.commands));
  });

  it('ignores what is not a string, and commands that do not exist', () => {
    const labels = resolveLabels({ title: 3 as any, edit: undefined, commands: { bold: null as any, nonsense: 'x' } as any });
    expect(labels.title).toBe('Markdown');
    expect(labels.edit).toBe('Edit');
    expect(labels.commands.bold).toBe('Bold');
    expect((labels.commands as any).nonsense).toBeUndefined();
  });

  it('never changes the defaults', () => {
    const before = JSON.stringify(DEFAULT_LABELS);
    resolveLabels({ title: 'x', commands: { bold: 'y' } });
    expect(JSON.stringify(DEFAULT_LABELS)).toBe(before);
  });

  it('has a label for every toolbar command and every text the editor shows', () => {
    for (const value of Object.values(DEFAULT_LABELS.commands)) expect(value.length).toBeGreaterThan(0);
    for (const [key, value] of Object.entries(DEFAULT_LABELS)) {
      if (key !== 'commands') expect(typeof value, key).toBe('string');
    }
  });
});

describe('fillLabel', () => {
  it('fills the placeholder', () => {
    expect(fillLabel('Heading {0}', 3)).toBe('Heading 3');
    expect(fillLabel('Back to reference {0}', 'note')).toBe('Back to reference note');
    expect(fillLabel('No placeholder', 1)).toBe('No placeholder');
  });
});

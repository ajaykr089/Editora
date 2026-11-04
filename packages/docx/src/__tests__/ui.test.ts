// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createDocxImport, showDocxReport, summarizeWarnings } from '../ui';

const fixture = (name: string) => new Uint8Array(readFileSync(join(__dirname, 'fixtures', name)));
const docxFile = (name: string, bytes: Uint8Array) => new File([bytes as Uint8Array<ArrayBuffer>], name, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
const cards = () => [...document.querySelectorAll<HTMLElement>('.docx-ui-card')];

// jsdom has no DragEvent or DataTransfer: build what the importer reads.
function drag(type: string, target: Element, files: File[] = []) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', { value: { types: ['Files'], files, dropEffect: 'none' } });
  target.dispatchEvent(event);
  return event;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe('summarizeWarnings', () => {
  it('lists real losses, and folds formatting and inferred structure into one line each', () => {
    expect(summarizeWarnings(['Comments were dropped', 'Font sizes were not kept', 'Text colours were not kept', 'Lists were inferred from typed bullets and numbers'])).toEqual({
      kind: 'warning',
      message: '1 thing could not be kept:',
      items: ['Comments were dropped'],
      notes: ['Formatting simplified: font sizes, text colours.', 'Structure added: lists from typed bullets.'],
    });
  });

  it('is a success when only formatting changed', () => {
    expect(summarizeWarnings(['Paragraph alignment was not kept'])).toEqual({ kind: 'success', message: 'All content came through.', notes: ['Formatting simplified: alignment.'] });
    expect(summarizeWarnings([])).toEqual({ kind: 'success', message: 'Everything came through.', notes: [] });
  });
});

describe('showDocxReport', () => {
  it('announces errors as alerts and everything else as status, and closes on Escape', () => {
    showDocxReport({ kind: 'error', title: 'Could not import a.docx', message: 'Broken' });
    const [card] = cards();
    expect(card.getAttribute('role')).toBe('alert');
    expect(card.querySelector('h2')?.textContent).toBe('Could not import a.docx');
    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(cards()).toHaveLength(0);
  });

  it('closes a plain success by itself, but keeps warnings until dismissed', () => {
    vi.useFakeTimers();
    showDocxReport({ kind: 'success', title: 'Saved' });
    showDocxReport({ kind: 'warning', title: 'Imported', items: ['Charts were dropped'] });
    vi.advanceTimersByTime(10000);
    expect(cards().map((card) => card.dataset.kind)).toEqual(['warning']);
    cards()[0].querySelector<HTMLButtonElement>('.docx-ui-close')!.click();
    expect(cards()).toHaveLength(0);
    vi.useRealTimers();
  });

  it('injects its styles once', () => {
    showDocxReport({ kind: 'success', title: 'a' });
    showDocxReport({ kind: 'success', title: 'b' });
    expect(document.querySelectorAll('#editora-docx-ui')).toHaveLength(1);
  });
});

describe('createDocxImport', () => {
  it('imports a picked or dropped file and reports the result', async () => {
    const imported: string[] = [];
    const target = document.createElement('div');
    document.body.append(target);
    const importer = createDocxImport({ dropTarget: target, onImport: ({ doc, file }) => void imported.push(`${file.name}: ${doc.children[0].type}`) });
    const result = await importer.importFile(docxFile('Library.docx', fixture('docx-library.docx')));
    expect(result?.warnings).toEqual(['Tracked changes were accepted', 'Footnotes and endnotes were moved to a numbered list at the end']);
    expect(imported).toEqual(['Library.docx: heading']);
    expect(cards()[0].querySelector('h2')?.textContent).toBe('Imported Library.docx');
    importer.destroy();
  });

  it('shows the drop overlay while files are over the target, through child elements', () => {
    const target = document.createElement('div');
    const child = document.createElement('p');
    target.append(child);
    document.body.append(target);
    const importer = createDocxImport({ dropTarget: target, onImport: () => undefined });
    drag('dragenter', target);
    drag('dragenter', child);
    drag('dragleave', child);
    expect(target.querySelector('.docx-ui-overlay')?.textContent).toBe('Drop a Word file to import it');
    expect(target.style.position).toBe('relative');
    drag('dragleave', target);
    expect(target.querySelector('.docx-ui-overlay')).toBeNull();
    expect(target.style.position).toBe('');
    importer.destroy();
  });

  it('takes over drops of files only, and imports the dropped file', async () => {
    const target = document.createElement('div');
    document.body.append(target);
    const done = new Promise<string>((resolve) => {
      createDocxImport({ dropTarget: target, onImport: ({ file }) => resolve(file.name) });
    });
    const event = drag('drop', target, [docxFile('Dropped.docx', fixture('docx-library.docx'))]);
    expect(event.defaultPrevented).toBe(true);
    expect(await done).toBe('Dropped.docx');
    // A text drop is left to the editor.
    const text = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(text, 'dataTransfer', { value: { types: ['text/plain'], files: [] } });
    target.dispatchEvent(text);
    expect(text.defaultPrevented).toBe(false);
  });

  it('explains wrong and damaged files, and calls onError', async () => {
    const errors: string[] = [];
    const importer = createDocxImport({ onImport: () => undefined, onError: (error) => void errors.push(error.message) });
    await importer.importFile(new File(['hello'], 'notes.txt', { type: 'text/plain' }));
    await importer.importFile(docxFile('Broken.docx', new Uint8Array([1, 2, 3, 4])));
    expect(errors).toEqual(['notes.txt is not a Word (.docx) file.', 'Not a .docx file: no ZIP directory found.']);
    expect(cards().map((card) => card.querySelector('h2')?.textContent)).toEqual(['Could not import notes.txt', 'Could not import Broken.docx']);
    importer.destroy();
  });

  it('uses custom labels', async () => {
    const importer = createDocxImport({ onImport: () => undefined, labels: { imported: (name) => `Importé : ${name}` } });
    await importer.importFile(docxFile('Rapport.docx', fixture('docx-library.docx')));
    expect(cards()[0].querySelector('h2')?.textContent).toBe('Importé : Rapport.docx');
    importer.destroy();
  });
});

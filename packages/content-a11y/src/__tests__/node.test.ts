// @vitest-environment node
import { execFileSync, spawnSync } from 'child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { tmpdir } from 'os';
import { join } from 'path';
import { checkContent, fixContent } from '../check';

const parse = (html: string) => new JSDOM(html).window.document;
const bin = join(__dirname, '..', '..', 'bin', 'content-a11y.js');
const dist = join(__dirname, '..', '..', 'dist', 'index.js');

describe('on a server', () => {
  it('needs a parser for HTML strings, and says so', () => {
    expect(() => checkContent('<p>x</p>')).toThrow(/Pass `parse`/);
  });

  it('checks and fixes with a jsdom parser', () => {
    expect(checkContent('<h2></h2><img src="a.png">', { parse }).issues.map((issue) => issue.rule)).toEqual(['heading-empty', 'image-alt-missing']);
    expect(fixContent('<p>a</p><h3></h3>', { parse }).html).toBe('<p>a</p>');
  });
});

// The CLI imports the built bundle; build first (`npm run build`).
const built = (() => {
  try {
    readFileSync(dist);
    return true;
  } catch {
    return false;
  }
})();

describe.runIf(built)('CLI', () => {
  it('reports problems and fails the build on errors', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cax-'));
    writeFileSync(join(dir, 'a.html'), '<h2></h2><p><img src="x.png"></p>');
    writeFileSync(join(dir, 'b.html'), '<p>All good.</p>');
    const run = spawnSync(process.execPath, [bin, dir], { encoding: 'utf8' });
    expect(run.status).toBe(1);
    expect(run.stderr).toContain('a.html: error heading-empty');
    expect(run.stderr).toContain('b.html: no accessibility issues found');
    expect(run.stderr).toContain('2 problems in 2 files; 2 at or above "error"');
  });

  it('applies safe fixes in place, keeps full documents intact, and prints JSON', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cax-'));
    const file = join(dir, 'page.html');
    writeFileSync(file, '<!doctype html><html lang="en"><head><title>T</title></head><body><h2>A</h2><h3></h3><p>x</p></body></html>');
    const output = execFileSync(process.execPath, [bin, file, '--fix', '--json'], { encoding: 'utf8' });
    const report = JSON.parse(output);
    expect(report[0].fixed.map((item: { rule: string }) => item.rule)).toEqual(['heading-empty']);
    expect(report[0].issues).toEqual([]);
    expect(readFileSync(file, 'utf8')).toBe('<!DOCTYPE html>\n<html lang="en"><head><title>T</title></head><body><h2>A</h2><p>x</p></body></html>\n');
  });

  it('reads stdin and honours --fail-on and --rule', () => {
    const run = spawnSync(process.execPath, [bin, '-', '--rule', 'image-alt-missing=warning', '--fail-on', 'error'], { input: '<img src="x.png">', encoding: 'utf8' });
    expect(run.status).toBe(0);
    expect(run.stderr).toContain('stdin: warning image-alt-missing');
    const strict = spawnSync(process.execPath, [bin, '-', '--fail-on', 'warning'], { input: '<p><a href="/x">here</a></p>', encoding: 'utf8' });
    expect(strict.status).toBe(1);
  });
});

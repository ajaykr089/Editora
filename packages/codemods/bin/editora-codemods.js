#!/usr/bin/env node
import { run, transforms } from '../src/index.js';

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const [transformName, ...paths] = args.filter((arg) => !arg.startsWith('--'));

if (!transformName || args.includes('--help') || !paths.length) {
  console.log('Usage: npx @editora/codemods <codemod> <files or folders...> [--dry]\n\nCodemods:');
  for (const [name, codemod] of Object.entries(transforms)) console.log(`  ${name.padEnd(22)} ${codemod.description}`);
  console.log('\n--dry  report what would change without writing files.');
  process.exit(transformName && !args.includes('--help') ? 1 : 0);
}

try {
  const result = run(transformName, paths, { dry });
  for (const file of result.files) console.log(`${dry ? 'would update' : 'updated'} ${file.path} (${file.changes})`);
  for (const warning of result.warnings) console.warn(`check: ${warning}`);
  console.log(`${result.changes} change${result.changes === 1 ? '' : 's'} in ${result.files.length} file${result.files.length === 1 ? '' : 's'}${dry ? ' (dry run, nothing written)' : ''}; ${result.warnings.length} to check by hand.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const warned = new Set<string>();

/**
 * SpellcheckPlugin and MediaPlugin are inert scaffolds (every command logs and returns null)
 * that were never wired to anything; real implementations ship as separate packages. They stay
 * exported so existing imports keep resolving, but say so loudly - once per page - instead of
 * leaving dead toolbar buttons that look like a working feature.
 */
export function warnDeprecatedScaffold(exportName: string, replacement: string): void {
  if (warned.has(exportName)) return;
  warned.add(exportName);
  console.warn(
    `[Editora] ${exportName} from @editora/core is a deprecated, non-functional scaffold: its commands and toolbar buttons do nothing. ` +
      `It will be removed in a future major release - use ${replacement} instead.`
  );
}

/** Test hook: forget which deprecations were already reported. */
export function resetDeprecationWarnings(): void {
  warned.clear();
}

const warned = new Set<string>();

/**
 * Options that are accepted so existing code keeps working but that nothing acts on. They say so once
 * per page, the first time one is actually requested, instead of leaving a feature that looks wired up.
 */
export function warnIgnoredOption(option: string, detail: string): void {
  if (warned.has(option)) return;
  warned.add(option);
  console.warn(
    `[Editora] The "${option}" option has no effect: ${detail} ` +
      `It is still accepted so existing code keeps working, and will be removed in a future major release.`
  );
}

/** Test hook: forget which options were already reported. */
export function resetIgnoredOptionWarnings(): void {
  warned.clear();
}

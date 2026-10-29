import type { Issue } from './types';

const LABEL: Record<Issue['severity'], string> = { error: 'error', warning: 'warning', info: 'info' };

/** Plain-text report, one issue per line, for terminals and CI logs. */
export function formatReport(issues: Issue[], source = ''): string {
  if (issues.length === 0) return `${source ? `${source}: ` : ''}no accessibility issues found`;
  return issues
    .map((issue) => {
      const where = issue.wcag ? `WCAG ${issue.wcag} (${issue.level})` : issue.level === 'best-practice' ? 'best practice' : issue.level;
      const fixes = issue.fixes.length ? ` [fix: ${issue.fixes.map((fix) => `${fix.label}${fix.kind === 'auto' ? ', auto' : ''}`).join('; ')}]` : '';
      return `${source ? `${source}: ` : ''}${LABEL[issue.severity]} ${issue.rule}: ${issue.message} ${where}${fixes}\n    ${issue.snippet}`;
    })
    .join('\n');
}

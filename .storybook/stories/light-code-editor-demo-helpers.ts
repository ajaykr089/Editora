import type {
  EditorDecoration,
  EditorDiagnostic,
} from "@editora/light-code-editor";

export function findLineIndex(
  lines: string[],
  matchers: string[],
  fallbackIndex = 0,
): number {
  for (const matcher of matchers) {
    const index = lines.findIndex((line) => line.includes(matcher));
    if (index !== -1) {
      return index;
    }
  }

  return Math.max(
    0,
    Math.min(
      fallbackIndex,
      Math.max(0, lines.length - 1),
    ),
  );
}

function isMalformedDemoMarkupLine(line: string): boolean {
  const trimmed = line.trim();
  const textTagMatch = trimmed.match(/^<(h[1-6]|p|span|strong|em|li|title)\b[^>]*>[\s\S]+$/i);

  return Boolean(
    textTagMatch &&
    !new RegExp(`</${textTagMatch[1]}\\s*>`, "i").test(trimmed),
  );
}

function isDemoIssueLine(line: string): boolean {
  return line.includes("onclick=") || isMalformedDemoMarkupLine(line);
}

function findDemoIssueLineIndex(lines: string[], fallbackIndex = 0): number {
  const issueLine = lines.findIndex(isDemoIssueLine);

  return issueLine >= 0
    ? issueLine
    : Math.max(0, Math.min(fallbackIndex, Math.max(0, lines.length - 1)));
}

export function buildDecorationDemo(text: string, toggles: {
  line: boolean;
  gutter: boolean;
  inline: boolean;
}): EditorDecoration[] {
  const lines = text.split("\n");
  const activeLineMatchers = [
    '<div class="highlight">',
    "<button",
    "<section id=\"about\">",
    "<h1>Hello World</h1>",
    "Missing closing tags",
  ];
  const issueLineMatchers = [
    "onclick=",
  ];
  const hasActiveDecorationTarget = activeLineMatchers.some(
    (matcher) => lines.some((line) => line.includes(matcher)),
  );
  const hasIssueDecorationTarget = issueLineMatchers.some(
    (matcher) => lines.some((line) => line.includes(matcher)),
  ) || lines.some(isMalformedDemoMarkupLine);

  if (!hasActiveDecorationTarget && !hasIssueDecorationTarget) {
    return [];
  }

  const activeLine = findLineIndex(lines, activeLineMatchers, 0);
  const issueLine = hasIssueDecorationTarget
    ? findDemoIssueLineIndex(lines, activeLine)
    : -1;
  const issueLineText = lines[issueLine] || "";

  const inlineTarget =
    ["alert", "Missing closing tags", "<img", "Click me"]
      .find((candidate) => issueLineText.includes(candidate)) ||
    issueLineText.trim().split(/\s+/)[0] ||
    "";
  const inlineStart = inlineTarget ? issueLineText.indexOf(inlineTarget) : -1;
  const decorations: EditorDecoration[] = [];

  if (toggles.line) {
    decorations.push({
      id: "storybook-active-line",
      type: "line",
      line: activeLine,
      className: "lce-decoration-line--active",
      style: {
        backgroundColor: "rgba(56, 189, 248, 0.12)",
        boxShadow: "inset 0 0 0 1px rgba(56, 189, 248, 0.22)",
      },
    });
  }

  if (toggles.gutter && hasIssueDecorationTarget) {
    decorations.push({
      id: "storybook-gutter-warning",
      type: "gutter",
      line: issueLine,
      label: "●",
      title: "Storybook decoration marker",
      className: "lce-decoration-gutter--error",
      style: {
        paddingRight: "8px",
      },
    });
  }

  if (toggles.inline && hasIssueDecorationTarget && inlineStart >= 0 && inlineTarget.length > 0) {
    decorations.push({
      id: "storybook-inline-highlight",
      type: "inline",
      range: {
        start: { line: issueLine, column: inlineStart },
        end: { line: issueLine, column: inlineStart + inlineTarget.length },
      },
      style: {
        backgroundColor: "rgba(248, 113, 113, 0.2)",
        textDecoration: "underline wavy rgba(248, 113, 113, 0.95)",
      },
    });
  }

  return decorations;
}

export function buildDiagnosticsDemo(text: string): EditorDiagnostic[] {
  const lines = text.split("\n");
  const issueLineMatchers = [
    "onclick=",
  ];
  const hasDemoDiagnosticTarget = issueLineMatchers.some((matcher) =>
    lines.some((line) => line.includes(matcher)),
  ) || lines.some(isMalformedDemoMarkupLine);

  if (!hasDemoDiagnosticTarget) {
    return [];
  }

  const issueLine = findDemoIssueLineIndex(lines, 0);
  const issueLineText = lines[issueLine] || "";

  const messageTarget =
    ["alert", "Missing closing tags", "<img", "Click me"]
      .find((candidate) => issueLineText.includes(candidate)) ||
    issueLineText.trim().split(/\s+/)[0] ||
    "issue";
  const messageStart = Math.max(0, issueLineText.indexOf(messageTarget));

  const infoLine = findLineIndex(lines, [
    "<div class=\"highlight\">",
    "<section id=\"about\">",
    "<h1>Hello World</h1>",
  ], issueLine);
  const infoLineText = lines[infoLine] || "";
  const infoTarget =
    ["highlight", "About", "Hello World"]
      .find((candidate) => infoLineText.includes(candidate)) ||
    infoLineText.trim().split(/\s+/)[0] ||
    "note";
  const infoStart = Math.max(0, infoLineText.indexOf(infoTarget));

  const diagnostics: EditorDiagnostic[] = [
    {
      id: "story-error",
      severity: "error",
      message: issueLineText.includes("Missing closing tags")
        ? "Unclosed or malformed markup"
        : "Inline handler needs review",
      source: "storybook",
      code: issueLineText.includes("Missing closing tags") ? "HTML001" : "SEC201",
      range: {
        start: { line: issueLine, column: messageStart },
        end: { line: issueLine, column: messageStart + Math.max(1, messageTarget.length) },
      },
    },
  ];

  if (infoLineText.trim().length > 0) {
    diagnostics.push({
      id: "story-info",
      severity: issueLineText.includes("Missing closing tags") ? "warning" : "info",
      message: issueLineText.includes("Missing closing tags")
        ? "Parser recovery may shift following nodes"
        : "Decorative content block worth reviewing",
      source: "storybook",
      code: issueLineText.includes("Missing closing tags") ? "HTML014" : "UX110",
      range: {
        start: { line: infoLine, column: infoStart },
        end: { line: infoLine, column: infoStart + Math.max(1, infoTarget.length) },
      },
    });
  }

  return diagnostics;
}

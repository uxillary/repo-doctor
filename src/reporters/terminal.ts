import type { Category, RuleResult, ScanResult, Severity } from "../core/types.js";

const CATEGORY_LABELS: Record<Category, string> = {
  documentation: "Documentation",
  repository: "Repository",
  ci: "CI",
  hygiene: "Hygiene"
};

export function renderTerminalReport(result: ScanResult): string {
  const lines = ["Repo Doctor", "", `Repository: ${result.repository.root}`, ""];
  const categories = unique(result.rules.map((rule) => rule.category));

  for (const category of categories) {
    lines.push(CATEGORY_LABELS[category]);
    for (const rule of result.rules.filter((item) => item.category === category)) {
      lines.push(`  ${symbolFor(rule)} ${rule.ruleId} ${displayMessage(rule)}`);
    }
    lines.push("");
  }

  lines.push(renderSummary(result));
  return `${lines.join("\n")}\n`;
}

function displayMessage(rule: RuleResult): string {
  if (rule.status === "fail") {
    return rule.findings[0]?.message ?? rule.title;
  }

  return rule.title;
}

function symbolFor(rule: RuleResult): string {
  if (rule.status === "pass") {
    return "✓";
  }

  if (rule.status === "skip") {
    return "-";
  }

  return severitySymbol(rule.severity);
}

function severitySymbol(severity: Severity): string {
  if (severity === "error") {
    return "✕";
  }
  if (severity === "warning") {
    return "!";
  }
  return "?";
}

function renderSummary(result: ScanResult): string {
  const parts = [`${result.summary.passed} passed`];

  if (result.summary.warnings > 0) {
    parts.push(`${result.summary.warnings} warning${result.summary.warnings === 1 ? "" : "s"}`);
  }
  if (result.summary.errors > 0) {
    parts.push(`${result.summary.errors} error${result.summary.errors === 1 ? "" : "s"}`);
  }
  if (result.summary.suggestions > 0) {
    parts.push(`${result.summary.suggestions} suggestion${result.summary.suggestions === 1 ? "" : "s"}`);
  }
  if (result.summary.skipped > 0) {
    parts.push(`${result.summary.skipped} skipped`);
  }

  return parts.join(" · ");
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

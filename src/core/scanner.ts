import { loadRepositoryContext } from "../detection/repository-context.js";
import { defaultRules } from "../rules/registry.js";
import type { Finding, Rule, RuleResult, ScanResult, ScanSummary } from "./types.js";

export interface ScanOptions {
  rules?: Rule[];
}

export async function scanRepository(targetPath: string, options: ScanOptions = {}): Promise<ScanResult> {
  const context = await loadRepositoryContext(targetPath);
  const rules = options.rules ?? defaultRules;
  const results: RuleResult[] = [];

  for (const rule of rules) {
    const applicable = await rule.isApplicable(context);
    if (!applicable) {
      results.push({
        ruleId: rule.id,
        title: rule.title,
        category: rule.category,
        status: "skip",
        severity: rule.severity,
        confidence: rule.confidence,
        findings: [],
        message: "Rule is not applicable"
      });
      continue;
    }

    results.push(await rule.run(context));
  }

  const findings = results.flatMap((result) => result.findings);

  return {
    schemaVersion: 1,
    repository: {
      root: context.root
    },
    rules: results,
    findings,
    summary: summarize(results, findings)
  };
}

function summarize(results: RuleResult[], findings: Finding[]): ScanSummary {
  return {
    passed: results.filter((result) => result.status === "pass").length,
    failed: results.filter((result) => result.status === "fail").length,
    skipped: results.filter((result) => result.status === "skip").length,
    errors: findings.filter((finding) => finding.severity === "error").length,
    warnings: findings.filter((finding) => finding.severity === "warning").length,
    suggestions: findings.filter((finding) => finding.severity === "suggestion").length
  };
}

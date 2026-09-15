import type { Finding, Rule, RuleResult } from "./types.js";

export function pass(rule: Rule, message?: string): RuleResult {
  return baseResult(rule, "pass", [], message);
}

export function fail(
  rule: Rule,
  finding: Omit<Finding, "ruleId" | "category" | "status" | "severity" | "confidence">
): RuleResult {
  const fullFinding: Finding = {
    ruleId: rule.id,
    category: rule.category,
    status: "fail",
    severity: rule.severity,
    confidence: rule.confidence,
    ...finding
  };

  return baseResult(rule, "fail", [fullFinding], fullFinding.message);
}

export function skip(rule: Rule, message: string): RuleResult {
  return baseResult(rule, "skip", [], message);
}

function baseResult(rule: Rule, status: RuleResult["status"], findings: Finding[], message?: string): RuleResult {
  return {
    ruleId: rule.id,
    title: rule.title,
    category: rule.category,
    status,
    severity: rule.severity,
    confidence: rule.confidence,
    findings,
    ...(message === undefined ? {} : { message })
  };
}

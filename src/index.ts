export { scanRepository } from "./core/scanner.js";
export { loadRepositoryContext, RepositoryContextError } from "./detection/repository-context.js";
export { renderJsonReport } from "./reporters/json.js";
export { renderTerminalReport } from "./reporters/terminal.js";
export { defaultRules } from "./rules/registry.js";
export type {
  Category,
  Confidence,
  Finding,
  FindingLocation,
  RepositoryContext,
  Rule,
  RuleResult,
  RuleStatus,
  ScanResult,
  ScanSummary,
  Severity
} from "./core/types.js";

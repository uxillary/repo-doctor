export type RuleStatus = "pass" | "fail" | "skip";

export type Severity = "error" | "warning" | "suggestion";

export type Confidence = "high" | "medium";

export type Category = "documentation" | "repository" | "ci" | "hygiene";

export interface FindingLocation {
  path: string;
  line?: number;
  column?: number;
}

export interface Finding {
  ruleId: string;
  category: Category;
  status: "fail";
  severity: Severity;
  confidence: Confidence;
  message: string;
  title?: string;
  evidence?: string;
  location?: FindingLocation;
}

export interface RuleResult {
  ruleId: string;
  title: string;
  category: Category;
  status: RuleStatus;
  severity: Severity;
  confidence: Confidence;
  findings: Finding[];
  message?: string;
}

export interface Rule {
  id: string;
  title: string;
  category: Category;
  severity: Severity;
  confidence: Confidence;
  isApplicable(context: RepositoryContext): Promise<boolean> | boolean;
  run(context: RepositoryContext): Promise<RuleResult> | RuleResult;
}

export interface ReadTextFileOptions {
  maxBytes?: number;
}

export interface RepositoryContext {
  root: string;
  exists(relativePath: string): Promise<boolean>;
  isDirectory(relativePath: string): Promise<boolean>;
  listDirectory(relativePath?: string): Promise<string[]>;
  readTextFile(relativePath: string, options?: ReadTextFileOptions): Promise<string>;
  toRelativePath(absolutePath: string): string;
  resolveInsideRoot(relativePath: string): Promise<string>;
}

export interface ScanSummary {
  passed: number;
  failed: number;
  skipped: number;
  errors: number;
  warnings: number;
  suggestions: number;
}

export interface ScanResult {
  schemaVersion: 1;
  repository: {
    root: string;
  };
  rules: RuleResult[];
  findings: Finding[];
  summary: ScanSummary;
}

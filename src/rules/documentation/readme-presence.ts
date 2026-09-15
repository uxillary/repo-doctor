import { fail, pass } from "../../core/result.js";
import type { Rule, RuleResult } from "../../core/types.js";

const README_PATTERN = /^readme(?:\.(?:md|markdown|mdown|txt|rst|adoc))?$/i;

export const readmePresenceRule: Rule = {
  id: "DOC001",
  title: "README present",
  category: "documentation",
  severity: "warning",
  confidence: "high",
  isApplicable: () => true,
  async run(context): Promise<RuleResult> {
    const rootEntries = await context.listDirectory();
    const readme = rootEntries.find((entry) => README_PATTERN.test(entry));

    if (readme !== undefined) {
      return pass(this, `Found ${readme}`);
    }

    return fail(this, {
      message: "README file is missing",
      location: { path: "README.md" }
    });
  }
};

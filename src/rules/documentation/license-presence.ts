import { fail, pass } from "../../core/result.js";
import type { Rule, RuleResult } from "../../core/types.js";

const LICENSE_PATTERN = /^(?:licen[cs]e|copying|notice)(?:\.(?:md|markdown|txt|rst|adoc))?$/i;

export const licensePresenceRule: Rule = {
  id: "DOC002",
  title: "License file present",
  category: "documentation",
  severity: "warning",
  confidence: "high",
  isApplicable: () => true,
  async run(context): Promise<RuleResult> {
    const rootEntries = await context.listDirectory();
    const license = rootEntries.find((entry) => LICENSE_PATTERN.test(entry));

    if (license !== undefined) {
      return pass(this, `Found ${license}`);
    }

    return fail(this, {
      message: "License file is missing",
      location: { path: "LICENSE" }
    });
  }
};

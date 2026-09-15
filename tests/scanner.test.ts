import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanRepository } from "../src/core/scanner.js";

describe("scanRepository", () => {
  it("aggregates passing and failing rule results", async () => {
    const result = await scanRepository(fixture("missing-license"));

    expect(result.schemaVersion).toBe(1);
    expect(result.summary.passed).toBe(1);
    expect(result.summary.failed).toBe(1);
    expect(result.summary.warnings).toBe(1);
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]?.ruleId).toBe("DOC002");
  });

  it("scans generic directories without requiring a .git directory", async () => {
    const result = await scanRepository(fixture("minimal"));

    expect(result.summary.failed).toBe(2);
    expect(result.findings.map((finding) => finding.ruleId)).toEqual(["DOC001", "DOC002"]);
  });
});

function fixture(name: string): string {
  return path.resolve("tests", "fixtures", name);
}

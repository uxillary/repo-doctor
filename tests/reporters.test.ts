import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanRepository } from "../src/core/scanner.js";
import { renderJsonReport } from "../src/reporters/json.js";
import { renderTerminalReport } from "../src/reporters/terminal.js";

describe("reporters", () => {
  it("renders stable JSON with a schema version", async () => {
    const result = await scanRepository(fixture("missing-license"));
    const parsed = JSON.parse(renderJsonReport(result)) as { schemaVersion: number; findings: Array<{ ruleId: string }> };

    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.findings[0]?.ruleId).toBe("DOC002");
  });

  it("renders focused terminal output", async () => {
    const result = await scanRepository(fixture("missing-readme"));
    const output = renderTerminalReport(result);

    expect(output).toContain("Repo Doctor");
    expect(output).toContain("Documentation");
    expect(output).toContain("DOC001 README file is missing");
    expect(output).toContain("1 passed");
  });
});

function fixture(name: string): string {
  return path.resolve("tests", "fixtures", name);
}

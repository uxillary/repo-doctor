import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRepositoryContext } from "../src/detection/repository-context.js";
import { licensePresenceRule } from "../src/rules/documentation/license-presence.js";
import { readmePresenceRule } from "../src/rules/documentation/readme-presence.js";

describe("documentation rules", () => {
  it("passes DOC001 when a README exists", async () => {
    const result = await readmePresenceRule.run(await context("healthy-basic"));
    expect(result.status).toBe("pass");
  });

  it("fails DOC001 when a README is missing", async () => {
    const result = await readmePresenceRule.run(await context("missing-readme"));
    expect(result.status).toBe("fail");
    expect(result.findings[0]?.ruleId).toBe("DOC001");
  });

  it("passes DOC002 when a license file exists", async () => {
    const result = await licensePresenceRule.run(await context("healthy-basic"));
    expect(result.status).toBe("pass");
  });

  it("fails DOC002 when a license file is missing", async () => {
    const result = await licensePresenceRule.run(await context("missing-license"));
    expect(result.status).toBe("fail");
    expect(result.findings[0]?.ruleId).toBe("DOC002");
  });
});

async function context(name: string) {
  return loadRepositoryContext(path.resolve("tests", "fixtures", name));
}

import { spawn } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const cliPath = path.resolve("src", "cli", "index.ts");

describe("CLI", () => {
  it("prints help", async () => {
    const result = await runCli(["--help"]);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain("Usage:");
  });

  it("prints JSON output", async () => {
    const result = await runCli([fixture("missing-license"), "--json"]);

    expect(result.code).toBe(0);
    const parsed = JSON.parse(result.stdout) as { schemaVersion: number; findings: Array<{ ruleId: string }> };
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.findings[0]?.ruleId).toBe("DOC002");
  });

  it("returns non-zero for invalid targets", async () => {
    const result = await runCli([fixture("does-not-exist")]);

    expect(result.code).toBe(1);
    expect(result.stderr).toContain("Target does not exist");
  });
});

async function runCli(args: string[]): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["--import", "tsx", cliPath, ...args], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

function fixture(name: string): string {
  return path.resolve("tests", "fixtures", name);
}

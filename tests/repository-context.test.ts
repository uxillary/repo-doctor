import { mkdtemp, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRepositoryContext, RepositoryContextError } from "../src/detection/repository-context.js";

describe("RepositoryContext", () => {
  it("reads files inside the repository root", async () => {
    const context = await loadRepositoryContext(fixture("healthy-basic"));

    await expect(context.readTextFile("README.md")).resolves.toContain("Healthy Basic");
    await expect(context.exists("LICENSE")).resolves.toBe(true);
  });

  it("rejects path traversal outside the repository root", async () => {
    const context = await loadRepositoryContext(fixture("healthy-basic"));

    await expect(context.readTextFile("../README.md")).rejects.toBeInstanceOf(RepositoryContextError);
  });

  it("does not follow a symlink outside the repository root when reading", async () => {
    const tempRoot = await mkdtemp(path.join(os.tmpdir(), "repo-doctor-"));
    const outsideFile = path.join(os.tmpdir(), `repo-doctor-outside-${Date.now()}.txt`);
    await writeFile(outsideFile, "outside");
    try {
      await symlink(outsideFile, path.join(tempRoot, "linked.txt"));
    } catch (error) {
      if (isWindowsSymlinkPermissionError(error)) {
        return;
      }
      throw error;
    }

    const context = await loadRepositoryContext(tempRoot);
    await expect(context.readTextFile("linked.txt")).rejects.toBeInstanceOf(RepositoryContextError);
  });
});

function fixture(name: string): string {
  return path.resolve("tests", "fixtures", name);
}

function isWindowsSymlinkPermissionError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "EPERM";
}

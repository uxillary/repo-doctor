#!/usr/bin/env node
import { existsSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { scanRepository } from "../core/scanner.js";
import { RepositoryContextError } from "../detection/repository-context.js";
import { renderJsonReport } from "../reporters/json.js";
import { renderTerminalReport } from "../reporters/terminal.js";

const require = createRequire(import.meta.url);
const packageJson = require("../../package.json") as { version: string };

interface CliOptions {
  targetPath: string;
  json: boolean;
}

export async function main(argv = process.argv.slice(2)): Promise<number> {
  try {
    const options = parseArgs(argv);

    if (options === "help") {
      process.stdout.write(helpText());
      return 0;
    }

    if (options === "version") {
      process.stdout.write(`${packageJson.version}\n`);
      return 0;
    }

    validateTarget(options.targetPath);
    const result = await scanRepository(options.targetPath);
    process.stdout.write(options.json ? renderJsonReport(result) : renderTerminalReport(result));
    return 0;
  } catch (error) {
    process.stderr.write(`Error: ${formatError(error)}\n`);
    return 1;
  }
}

function parseArgs(argv: string[]): CliOptions | "help" | "version" {
  const positional: string[] = [];
  let json = false;

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      return "help";
    }
    if (arg === "--version" || arg === "-v") {
      return "version";
    }
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }
    positional.push(arg);
  }

  if (positional.length > 1) {
    throw new Error("Expected at most one repository path");
  }

  return {
    targetPath: path.resolve(positional[0] ?? process.cwd()),
    json
  };
}

function validateTarget(targetPath: string): void {
  if (!existsSync(targetPath)) {
    throw new Error(`Target does not exist: ${targetPath}`);
  }

  if (!statSync(targetPath).isDirectory()) {
    throw new Error(`Target is not a directory: ${targetPath}`);
  }
}

function helpText(): string {
  return `Repo Doctor

Usage:
  repo-doctor [path] [--json]
  repo-doctor --help
  repo-doctor --version

Options:
  --json        Print structured JSON output
  -h, --help    Show help
  -v, --version Show version
`;
}

function formatError(error: unknown): string {
  if (error instanceof RepositoryContextError || error instanceof Error) {
    return error.message;
  }

  return "Unknown failure";
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await main();
}

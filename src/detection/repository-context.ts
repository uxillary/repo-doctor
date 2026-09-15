import { constants } from "node:fs";
import { access, lstat, opendir, realpath, readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { ReadTextFileOptions, RepositoryContext } from "../core/types.js";

const DEFAULT_MAX_TEXT_BYTES = 1024 * 1024;

export class RepositoryContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RepositoryContextError";
  }
}

export async function loadRepositoryContext(targetPath: string): Promise<RepositoryContext> {
  const root = await realpath(targetPath);
  const rootStats = await stat(root);

  if (!rootStats.isDirectory()) {
    throw new RepositoryContextError(`Target is not a directory: ${targetPath}`);
  }

  return new LocalRepositoryContext(root);
}

class LocalRepositoryContext implements RepositoryContext {
  constructor(readonly root: string) {}

  async exists(relativePath: string): Promise<boolean> {
    try {
      const absolutePath = await this.resolveInsideRoot(relativePath);
      await access(absolutePath, constants.F_OK);
      return true;
    } catch (error) {
      if (error instanceof RepositoryContextError) {
        throw error;
      }
      return false;
    }
  }

  async isDirectory(relativePath: string): Promise<boolean> {
    try {
      const absolutePath = await this.resolveInsideRoot(relativePath);
      const entry = await stat(absolutePath);
      return entry.isDirectory();
    } catch (error) {
      if (error instanceof RepositoryContextError) {
        throw error;
      }
      return false;
    }
  }

  async listDirectory(relativePath = "."): Promise<string[]> {
    const absolutePath = await this.resolveInsideRoot(relativePath);
    const directory = await opendir(absolutePath);
    const names: string[] = [];

    for await (const entry of directory) {
      names.push(entry.name);
    }

    return names.sort((a, b) => a.localeCompare(b));
  }

  async readTextFile(relativePath: string, options: ReadTextFileOptions = {}): Promise<string> {
    const absolutePath = await this.resolveInsideRoot(relativePath);
    const entry = await lstat(absolutePath);

    if (entry.isSymbolicLink()) {
      const linkedPath = await realpath(absolutePath);
      assertInsideRoot(this.root, linkedPath);
    }

    if (!entry.isFile() && !entry.isSymbolicLink()) {
      throw new RepositoryContextError(`Path is not a file: ${relativePath}`);
    }

    const fileStats = await stat(absolutePath);
    const maxBytes = options.maxBytes ?? DEFAULT_MAX_TEXT_BYTES;
    if (fileStats.size > maxBytes) {
      throw new RepositoryContextError(`File exceeds read limit of ${maxBytes} bytes: ${relativePath}`);
    }

    return readFile(absolutePath, "utf8");
  }

  toRelativePath(absolutePath: string): string {
    const resolved = path.resolve(absolutePath);
    assertInsideRoot(this.root, resolved);
    return normalizeRelative(path.relative(this.root, resolved));
  }

  async resolveInsideRoot(relativePath: string): Promise<string> {
    if (path.isAbsolute(relativePath)) {
      throw new RepositoryContextError(`Expected a repository-relative path: ${relativePath}`);
    }

    const resolved = path.resolve(this.root, relativePath);
    assertInsideRoot(this.root, resolved);
    return resolved;
  }
}

function assertInsideRoot(root: string, candidate: string): void {
  const relative = path.relative(root, candidate);
  if (relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))) {
    return;
  }

  throw new RepositoryContextError("Path resolves outside the repository root");
}

function normalizeRelative(relativePath: string): string {
  return relativePath.split(path.sep).join("/");
}

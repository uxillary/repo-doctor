# Repo Doctor

Repo Doctor is an early, pre-release foundation for a local-first deterministic
repository health scanner. The long-term goal is to identify actionable problems
in documentation, repository hygiene, package metadata, CI/CD configuration,
security-related repository settings, maintainability, and consistency.

This repository currently contains only the v0.1 architectural skeleton and two
real checks. It does not yet implement the planned broader rule catalogue.

## Philosophy

- Works locally without an account.
- Uses deterministic checks instead of AI or LLMs.
- Treats scanned repositories as untrusted input.
- Does not execute repository code, package scripts, shell files, or binaries.
- Keeps the core scanner separate from CLI and reporter formatting.
- Produces structured findings that can later support terminal, JSON, GitHub
  annotations, and SARIF reporters.

## Current checks

- `DOC001`: README file is present.
- `DOC002`: license file is present.

Repo Doctor recognises common README and license filename casing/extensions, but
does not perform license identification yet.

## CLI usage

The package name may change before publication. In this repository, after
installing dependencies and building, the local CLI supports:

```bash
repo-doctor .
repo-doctor ./path/to/repository
repo-doctor . --json
repo-doctor --help
repo-doctor --version
```

During development, build first and use `node dist/cli/index.js`.

Ordinary health findings, such as a missing license, do not currently make the
process exit non-zero. Non-zero exits are reserved for execution and input
failures until policy options such as `--fail-on` exist.

## Architecture

The initial data flow is:

```text
repository path
      ↓
RepositoryContext
      ↓
Rule[]
      ↓
Finding[]
      ↓
Reporter
```

Current source boundaries:

- `src/core`: domain types, result helpers, and scanner orchestration.
- `src/detection`: safe local repository context loading and file inspection.
- `src/rules`: deterministic rule implementations and the rule registry.
- `src/reporters`: terminal and JSON output.
- `src/cli`: local command-line interface.

Rules do not contain terminal formatting logic. Reporters do not inspect
repositories.

## Development

```bash
npm install
npm test
npm run typecheck
npm run lint
npm run build
```

## Rule authoring

See [docs/rules.md](docs/rules.md) for the current rule structure and ID
conventions.

## Roadmap direction

Future milestones may add more context-aware rules, configuration support,
additional reporters, GitHub Actions integration, SARIF, and CI failure policies.
Those features are deliberately outside this v0.1 foundation.

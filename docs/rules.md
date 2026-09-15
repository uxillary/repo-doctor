# Rule authoring

Repo Doctor rules are deterministic checks that run against a `RepositoryContext`.
Rules must inspect repository files statically and must not execute code, import modules,
run package scripts, or call external services from the repository being scanned.

Each rule exposes:

- a stable ID;
- a short title;
- a category;
- a severity;
- a confidence;
- applicability logic;
- execution logic that returns `pass`, `fail`, or `skip`.

Findings should be actionable and should include a repository-relative location when that
helps future reporters create annotations.

## ID conventions

Rule IDs are stable public identifiers. Do not renumber an existing rule after release.

- `DOCxxx`: documentation
- `REPxxx`: repository configuration and metadata
- `CIxxx`: CI/CD configuration
- `HYGxxx`: maintainability and hygiene

Only `DOC001` and `DOC002` are implemented in v0.1.

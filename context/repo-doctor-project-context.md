# Repo Doctor — Project Context

> Working product name: **Repo Doctor**  
> GitHub organisation: **uxillary**  
> Status: **Product definition / pre-implementation**  
> Purpose of this document: Preserve the agreed product direction, MVP scope, architecture, constraints, and roadmap so future ChatGPT/Codex sessions can work from a stable source of truth.

---

## 1. Product vision

Repo Doctor is an open-source developer tool that performs a **health check on a Git/GitHub repository**.

It should inspect a repository and identify common maintenance problems, missing best practices, inconsistencies, suspicious configuration, and useful opportunities for improvement.

The core idea is:

> **Run a health check on your repository.**

A developer should eventually be able to run something as simple as:

```bash
npx <final-package-name> .
```

and later use the same scanner automatically in GitHub Actions:

```yaml
- uses: uxillary/<final-repo-name>@v1
```

Example conceptual output:

```text
🩺 Repository check

Health: Good

Documentation
  ✓ README.md found
  ✓ License detected
  ⚠ SECURITY.md missing
    Recommended for public projects accepting vulnerability reports.

Repository
  ✓ .gitignore detected
  ⚠ package.json repository URL doesn't match Git remote
    package.json: github.com/uxillary/old-name
    git remote:   github.com/uxillary/new-name

CI / Workflows
  ✓ 3 workflows detected
  ⚠ 4 GitHub Actions use mutable version tags
    .github/workflows/release.yml:18
    actions/checkout@v6

Maintenance
  ⚠ README contains 2 broken relative links
  ✓ No obvious committed build output

2 warnings · 0 errors · 4 suggestions
```

Repo Doctor should feel like a **diagnostic tool**, not simply another standards-enforcement linter.

Its core behaviour is:

**detect → explain → prioritise**

rather than:

**enforce arbitrary standards**

---

## 2. Why this project exists

Repo Doctor is being built for two connected reasons.

First, it solves a genuine problem across the maintainer's own repositories: projects evolve, files get renamed, package metadata becomes stale, workflows accumulate, documentation links break, recommended repository files are forgotten, and configuration can drift without anyone noticing.

Second, Repo Doctor is intended to become a genuinely useful open-source Uxillary developer tool that other developers install, add to repositories, recommend, contribute to, fork, and star.

Distribution and developer experience are therefore part of the product itself:

- extremely low setup friction;
- strong README and documentation;
- useful zero-config defaults;
- good terminal output;
- npm/npx distribution;
- GitHub Action integration;
- search/discoverability;
- contribution-friendly architecture.

However, usefulness comes first. The project must **not optimise for stars at the expense of solving real repository-maintenance problems**.

The desired reaction when scanning a real repository is:

> "Oh — yeah, I should fix that."

False positives and arbitrary recommendations undermine that goal.

---

## 3. Product principles

Repo Doctor should be:

- open source;
- free;
- privacy-friendly;
- useful without an account;
- deterministic wherever possible;
- fast;
- cross-platform;
- easy to install;
- useful locally before GitHub integration is required;
- useful for small personal repositories and larger open-source projects;
- extensible so checks can be added cleanly;
- capable of strong human-readable terminal output;
- capable of machine-readable output;
- suitable for CI/GitHub Actions;
- safe to run against repositories that are not trusted.

### No required AI dependency

The core scanner must **not require an LLM, API key, account, or cloud service**.

Repository health checks should be deterministic whenever possible.

AI could eventually become an optional enhancement for explanations or advanced analysis, but it must never be required for the core product.

---

## 4. Related Uxillary tools

There are plans for several related developer tools:

- Repo Doctor;
- GitHub Release Analytics;
- GitHub Profile Analytics.

These should remain **separate projects**.

Repo Doctor should expose clean machine-readable data and architectural boundaries that could allow future Uxillary tools to consume or combine information, but it must not become a monolithic "GitHub everything" application.

Release analytics and profile analytics do **not** belong inside Repo Doctor.

---

## 5. Existing ecosystem and product gap

Research identified several adjacent tools.

### OpenSSF Scorecard

OpenSSF Scorecard evaluates open-source projects primarily from a **security posture** perspective. It performs sophisticated checks around areas such as branch protection, code review, dependency practices, CI, token permissions, pinned dependencies, and security policy.

Repo Doctor should not attempt to replace Scorecard.

### Repolinter

Repolinter checks repository standards and policies such as required files, file contents, licenses, JSON schemas, links, and other repository conventions.

The TODO Group repository was archived in February 2026.

It is philosophically close to part of the Repo Doctor idea, but Repo Doctor should focus more strongly on **diagnosis, context-aware applicability, explanations, and repository inconsistencies** rather than being primarily a policy enforcement engine.

### actionlint

actionlint performs deep static validation of GitHub Actions workflows.

Repo Doctor should perform useful high-level workflow checks but should not recreate actionlint's parser and semantic analysis.

### zizmor

zizmor performs detailed GitHub Actions security analysis.

Repo Doctor can identify a small number of high-value workflow security issues but should not attempt to replace zizmor.

### lychee

lychee performs sophisticated link checking.

Repo Doctor can deterministically check internal/relative documentation links but should not initially recreate a full external URL crawler.

### GitHub Community Standards

GitHub exposes repository community-health information for files such as README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT and issue templates.

Repo Doctor should go significantly beyond simply counting whether recommended files exist.

### Product gap

There is room for a tool answering the broader question:

> **"I have this repository. What is obviously wrong, inconsistent, missing, suspicious, or worth fixing?"**

Repo Doctor should act as a useful diagnostic layer above narrower specialist tools.

It should complement specialist tooling rather than attempting to replace it.

---

## 6. Naming warning

**Repo Doctor is currently a working name, not a confirmed final public/package name.**

Research found several existing projects using `repo-doctor` or very similar names, including projects with overlapping repository-health functionality and existing npm usage.

Therefore:

- continue using Repo Doctor internally while designing/building;
- do not assume the final npm package or repository should use this exact name;
- perform a dedicated naming/searchability/package-availability pass before public release;
- retain the medical/diagnostic concept even if the final name changes.

Possible visual/product language includes:

- doctor;
- health check;
- scan;
- diagnosis;
- findings;
- repository vitals;
- check-up;
- treatment/fix guidance.

Branding should be memorable but not so gimmicky that the tool appears unserious.

---

## 7. Target users

### Primary: individual maintainers

Developers maintaining personal, portfolio, open-source, hobby, library, CLI, application, or website repositories.

They want to run one command and discover things they forgot, broke, misconfigured, or allowed to drift.

### Secondary: contributors and reviewers

Developers cloning an unfamiliar project who want a quick understanding of its repository health, documentation, tests, workflows, metadata, and obvious maintenance issues.

### Later: teams and CI

Teams may eventually run Repo Doctor automatically and optionally fail CI for selected severities.

Example:

```bash
repo-doctor . --fail-on error
```

Enterprise policy enforcement is **not** the primary v0.1 target.

---

## 8. Core differentiator: context-aware applicability

Repo Doctor should avoid blindly applying identical standards to every repository.

A key part of scanning is determining enough repository context to decide which rules are relevant.

Potential detected project characteristics include:

```text
Repository
├── Node project/package
├── Python project/package
├── Rust crate
├── GitHub Action
├── static website
├── application
├── library
├── monorepo
├── public OSS repository
└── unknown/generic repository
```

Examples:

A static HTML site should not automatically be penalised for lacking an npm test suite.

An npm package can reasonably receive checks for package metadata, repository URLs, package naming, and lockfiles.

A GitHub Action repository can receive checks relating to `action.yml`, workflows, release/tag practices, and Action metadata.

A small private utility should not automatically be considered unhealthy because it lacks a CODE_OF_CONDUCT.

**Not applicable is a valid rule outcome.**

This context-aware behaviour is likely to be one of the strongest product differentiators.

---

## 9. v0.1 scope fence

The first version must remain intentionally small.

### v0.1 should contain

- local repository scanning;
- TypeScript/Node.js CLI;
- zero-config defaults;
- repository context detection;
- approximately 15–20 high-confidence deterministic rules;
- rule applicability logic;
- human-readable terminal output;
- JSON output;
- reliable exit behaviour;
- fixture repositories;
- unit/integration tests;
- Windows, Linux, and macOS compatibility;
- npm/npx distribution architecture;
- architecture that can support a GitHub Action later.

### v0.1 should NOT contain

- required AI;
- web dashboard;
- GitHub App;
- user accounts/login;
- database;
- cloud scanning service;
- automatic PR creation;
- automatic repository fixing;
- plugin marketplace;
- dependency vulnerability scanner;
- source-code quality analysis;
- required GitHub API access;
- organisation-wide scanning;
- remote repository cloning service;
- historical analytics;
- GitHub Release Analytics;
- GitHub Profile Analytics;
- complex policy language;
- dozens of ecosystem integrations;
- external internet link crawling by default;
- a giant initial rule catalogue.

If a proposed feature does not directly improve the core local repository health scan, it should probably be deferred.

---

## 10. Candidate v0.1 checks

The target is roughly **15–20 reliable checks**, not a large number of shallow or noisy checks.

Rule IDs should be stable from an early stage.

### Documentation

#### DOC001 — README missing

Detect whether an appropriate README exists.

#### DOC002 — LICENSE missing

Suggest a license where appropriate, especially for public/open-source repositories.

Applicability matters: do not imply every repository must be licensed publicly.

#### DOC003 — CONTRIBUTING missing

Suggest contribution guidance where appropriate for collaborative/open-source repositories.

#### DOC004 — SECURITY.md missing

Suggest a security policy for public projects where vulnerability reporting is relevant.

#### DOC005 — CODE_OF_CONDUCT missing

Low-severity suggestion where appropriate for community/open-source projects.

#### DOC006 — broken relative links in README

Check repository-relative links deterministically without requiring network access.

### Repository

#### REP001 — `.gitignore` missing where appropriate

Only apply when the detected project type would normally generate local/build/dependency files that should not be committed.

#### REP002 — repository URL metadata does not match Git remote

Example:

```text
package.json: github.com/uxillary/old-project
git remote:   github.com/uxillary/new-project
```

This is a particularly strong Repo Doctor-style check because it detects repository drift rather than merely enforcing file presence.

#### REP003 — suspicious large tracked files

Identify unusually large tracked files while avoiding arbitrary claims that every large file is wrong.

#### REP004 — suspicious generated, temporary, or secret-like files tracked

Examples may include common environment files, temporary output, editor artefacts, or generated directories where confidence is high.

Do not print suspected secret values.

#### REP005 — package manifest exists without expected lockfile

Apply only where ecosystem/package-manager context makes the expectation meaningful.

### CI/CD

#### CI001 — project appears testable but no apparent CI test workflow exists

Must be context-aware and conservative.

#### CI002 — basic suspicious or malformed workflow configuration

Keep this deliberately shallow. Do not attempt to replace actionlint.

#### CI003 — GitHub Action dependency is not pinned immutably

Identify action references using mutable tags/branches where immutable SHA pinning is preferable.

This should distinguish first-party/third-party considerations if necessary and clearly explain the recommendation.

#### CI004 — workflow permissions appear unnecessarily broad

Implement only high-confidence cases in v0.1.

Do not attempt a complete workflow security analyser.

### Project hygiene

#### HYG001 — no detectable test setup where tests are reasonably expected

Context-aware.

#### HYG002 — obvious temporary/debug artefacts tracked

Only flag high-confidence patterns.

#### HYG003 — manifest metadata inconsistencies

Detect mismatches between repository identity and package/project metadata.

#### HYG004 — empty or obvious placeholder README

A README existing is not sufficient if it contains only placeholder/template content.

#### HYG005 — publishable package/project missing basic metadata

Apply only when Repo Doctor has strong evidence the project is intended for publishing/distribution.

---

## 11. Rule philosophy

Rules should prioritise:

1. deterministic evidence;
2. high confidence;
3. actionable findings;
4. low false-positive rates;
5. useful explanations;
6. sensible applicability.

If Repo Doctor is not sufficiently confident, it should prefer not to make the claim.

A small collection of trustworthy findings is better than a large report containing questionable recommendations.

---

## 12. Result model

Status and severity should be separate concepts.

### Status

```text
pass
fail
skip
```

`skip` includes rules that are not applicable or cannot be evaluated safely/reliably.

### Severity

Keep severity intentionally small:

```text
error
warning
suggestion
```

Examples:

```text
Rule: SECURITY.md missing
Status: fail
Severity: suggestion
```

versus:

```text
Rule: tracked .env file
Status: fail
Severity: error
```

### Confidence

Internally, findings may also expose:

```text
high
medium
```

Avoid emitting low-confidence diagnoses.

---

## 13. Finding/evidence model

Every rule should produce structured evidence rather than preformatted terminal text.

Conceptual example:

```ts
{
  ruleId: "REP002",
  status: "fail",
  severity: "warning",
  message: "package.json repository URL does not match Git remote",
  location: {
    path: "package.json",
    line: 12
  },
  evidence: {
    declared: "uxillary/old-project",
    detected: "uxillary/new-project"
  }
}
```

The same result should later power:

- terminal output;
- JSON;
- GitHub annotations;
- GitHub job summaries;
- SARIF;
- possible future HTML reports;
- possible integrations with related Uxillary tooling.

**Rules must not contain presentation-specific logic.**

---

## 14. Scoring philosophy

Do **not** rush into an apparently precise `78/100 → B+` health score.

A numeric score looks attractive but can create misleading precision unless every weight is defensible.

For early versions, prefer reporting something such as:

```text
Repository health: Good

✓ 14 passed
⚠ 4 warnings
ℹ 2 suggestions
○ 3 not applicable
```

A future numeric score may be introduced once enough real repositories and fixture cases exist to calibrate a transparent scoring specification.

Key principles for future scoring:

- never penalise a repository for a rule that is not applicable;
- severity should influence impact;
- categories should not be weighted arbitrarily without documentation;
- scoring methodology must be documented;
- users should be able to understand why a score changed;
- avoid fake mathematical precision.

---

## 15. Recommended runtime and distribution

Use **TypeScript + Node.js** for the initial implementation.

Reasons:

- excellent fit for npm/npx distribution;
- cross-platform;
- familiar Uxillary development stack;
- good libraries for JSON, YAML, Markdown, filesystem and Git-related parsing;
- straightforward testing;
- suitable for GitHub Actions;
- allows the scanner core to be reused between CLI and Action interfaces.

Desired zero-install experience:

```bash
npx @uxillary/<final-package-name> .
```

A shorter unscoped package may be considered if naming/package availability makes sense, but do not depend on that assumption yet.

---

## 16. Proposed repository architecture

Initial conceptual structure:

```text
src/
├── cli/
│   ├── args.ts
│   └── run.ts
│
├── core/
│   ├── scanner.ts
│   ├── context.ts
│   ├── result.ts
│   └── score.ts
│
├── detection/
│   ├── project-type.ts
│   ├── git.ts
│   └── manifests.ts
│
├── rules/
│   ├── documentation/
│   ├── repository/
│   ├── ci/
│   └── hygiene/
│
├── reporters/
│   ├── terminal.ts
│   ├── json.ts
│   └── github.ts
│
└── config/
    └── defaults.ts

tests/
├── rules/
├── reporters/
└── fixtures/
    ├── healthy-node/
    ├── messy-node/
    ├── minimal-repo/
    ├── no-ci/
    └── bad-workflows/
```

This is a direction, not a requirement to create every file immediately.

Avoid premature abstraction.

### Core data flow

```text
Repository
    ↓
RepositoryContext
    ↓
Rules
    ↓
Finding[] / RuleResult[]
    ↓
Reporters
```

The scanner engine must remain independent from the terminal and GitHub Action interfaces.

---

## 17. Conceptual rule API

A rule should be small and self-contained.

Conceptually:

```ts
interface Rule {
  id: string;
  category: Category;
  severity: Severity;

  applies(context: RepositoryContext): boolean;

  check(context: RepositoryContext): Promise<RuleResult>;
}
```

Exact types can evolve during implementation.

The important properties are:

- stable rule ID;
- category;
- severity;
- applicability;
- deterministic check;
- structured result;
- evidence/location where possible.

Adding a new rule should not require modifying unrelated reporters or scanner internals.

---

## 18. CLI UX

The CLI should remain simple and predictable.

Target commands/options include:

```bash
repo-doctor .
repo-doctor ./my-project
repo-doctor . --json
repo-doctor . --verbose
repo-doctor . --category ci
repo-doctor . --rule CI003
repo-doctor . --fail-on error
```

Possible later commands:

```bash
repo-doctor init
repo-doctor explain CI003
repo-doctor . --sarif report.sarif
repo-doctor . --changed
```

### `explain` as a potential differentiator

A future command such as:

```bash
repo-doctor explain CI003
```

could explain:

- what the rule checks;
- why it matters;
- what Repo Doctor detected;
- how to fix it;
- when ignoring it is reasonable;
- relevant authoritative documentation.

The product should educate rather than simply produce warnings.

Do not make this feature block v0.1.

---

## 19. GitHub Action integration

The eventual Action UX should be extremely low friction:

```yaml
- uses: uxillary/<final-name>@v1
```

The Action must call the **same scanner core** used by the CLI.

Do not maintain separate scanning implementations.

Architecture:

```text
            Core scanner
            /          \
          CLI          Action
```

Potential Action capabilities:

- GitHub annotations;
- job summary;
- exit/failure threshold;
- JSON report artifact;
- SARIF later.

GitHub Action integration is targeted for the milestone after the first useful local CLI unless implementation proves trivial enough to include safely without delaying release.

---

## 20. JSON and machine-readable output

JSON should be supported early because it establishes the integration boundary for future tooling.

The output should include enough information for another program to understand:

- scanner version;
- repository context/profile;
- executed rules;
- skipped/not-applicable rules;
- findings;
- severity;
- category;
- evidence;
- source location where known;
- summary counts.

Do not make consumers parse terminal text.

---

## 21. SARIF

SARIF is desirable but should **not block v0.1**.

GitHub can ingest SARIF 2.1.0 from third-party static analysis tools and surface findings in code scanning.

Repo Doctor's early structured result model should therefore preserve:

- stable rule IDs;
- file paths;
- line locations where possible;
- severity;
- messages;
- evidence.

This will make a later SARIF reporter much easier.

Likely target: v0.2 or v0.3.

---

## 22. Security model

This is a foundational requirement:

> **Scanning a repository must never execute repository code by default.**

Repo Doctor may inspect files such as:

```text
package.json
pyproject.toml
Cargo.toml
README.md
.github/workflows/*.yml
.gitignore
action.yml
Git metadata
filesystem structure
```

It must not automatically execute repository-provided commands such as:

```bash
npm install
npm test
npm run <anything>
make
./scripts/*
```

A repository may be malicious or compromised.

### Additional scanner protections

Repo Doctor should:

- treat YAML/JSON/Markdown/manifests as data;
- never evaluate repository code;
- limit the size of files it reads;
- bound filesystem recursion;
- avoid following symlinks outside the repository root;
- avoid printing secret values;
- redact sensitive evidence where appropriate;
- avoid network requests unless explicitly requested;
- handle malformed files safely;
- avoid shell interpolation of repository-controlled values;
- avoid trusting Git hooks or package lifecycle scripts.

This can eventually become part of the public product positioning:

> **Safe static inspection. Repo Doctor does not execute your repository's code.**

---

## 23. Link checking strategy

### v0.1

Check deterministic repository-relative links such as:

```text
README.md → ./docs/setup.md
```

### Later

External URL checking can be opt-in, for example:

```bash
repo-doctor . --check-external-links
```

External link checking introduces:

- networking;
- redirects;
- rate limiting;
- temporary outages;
- authentication;
- flaky CI;
- duplicate functionality already handled well by specialist tools such as lychee.

Therefore external crawling should not be part of the core v0.1 scan.

---

## 24. Configuration philosophy

Repo Doctor should be **zero-config first**.

The default behaviour must be useful enough that most users can simply run the command.

A small optional configuration file may later support suppression and severity changes.

Possible minimal shape:

```yaml
# .repo-doctor.yml

ignore:
  - DOC005

severity:
  DOC004: warning
```

Later this could evolve toward:

```yaml
rules:
  CI003: error
  DOC005: off
```

Do not build an ESLint-scale policy/configuration language in v0.1.

---

## 25. Testing strategy

Fixture repositories are essential.

Create small deterministic repositories representing expected scenarios rather than relying primarily on live GitHub repositories.

Potential fixtures:

```text
tests/fixtures/
├── healthy-node/
├── missing-readme/
├── broken-readme-link/
├── wrong-package-url/
├── unpinned-actions/
├── committed-env/
├── static-site/
├── library/
├── no-ci/
├── bad-workflows/
└── empty-repo/
```

Each rule should ideally have coverage for:

- expected pass;
- expected fail;
- not applicable;
- malformed input;
- relevant edge cases.

Reporter output should be tested separately from rule logic.

Snapshot testing may be useful for terminal and JSON output where it does not make tests unnecessarily brittle.

### Contributor-friendly fixtures

A useful future contribution workflow is:

> Found a false positive? Add a minimal fixture reproducing it plus the expected result.

This gives contributors a straightforward way to improve the scanner.

---

## 26. Documentation and developer experience

Documentation is part of the product, not post-release polish.

The README should eventually communicate within seconds:

1. what Repo Doctor does;
2. why someone should use it;
3. how to run it immediately;
4. example output;
5. what it checks;
6. what it deliberately does not do;
7. its safety/privacy model;
8. how to use it in GitHub Actions;
9. how to suppress/configure rules;
10. how to contribute a rule or fixture.

The project should have strong examples and screenshots/terminal captures once the output is stable.

Potential discoverability topics/keywords include:

- repository health checker;
- GitHub repository audit;
- repo linter;
- repository best practices;
- GitHub Actions health/security;
- README checker;
- repository maintenance;
- open-source project health;
- developer tooling;
- CI repository checks.

Do not keyword-stuff documentation. Searchability should emerge from accurate descriptions of useful functionality.

---

## 27. Branding direction

The medical diagnostic metaphor is useful because it immediately communicates the product.

Potential concepts:

```text
🩺 repository check-up
repository vitals
diagnosis
findings
scan
health
prescription/fix guidance
```

Terminal output can use restrained medical language without turning into novelty software.

Example:

```text
🩺 Repo Doctor
Scanning repository...

Repository health: Good
```

Avoid excessive animations, jokes, emoji, or gimmicks that interfere with CI logs and serious use.

Human-friendly output and machine-friendly output should be separate reporters.

---

## 28. Milestone roadmap

### Milestone 0 — Specification and scaffold

Goal: establish the foundation before building lots of checks.

Deliverables:

- confirm/further investigate final name;
- initialise repository;
- TypeScript/Node toolchain;
- CLI entry point;
- core result types;
- repository context model;
- rule interface;
- category/severity/status model;
- security constraints;
- initial fixture/test infrastructure;
- basic terminal and JSON reporter contracts;
- initial README explaining pre-release direction.

Do not implement the whole product during this milestone.

### Milestone 1 — Scanner MVP / v0.1

Goal: ship a genuinely useful local repository scanner.

Deliverables:

- project/repository detection;
- approximately 15–20 high-confidence deterministic rules;
- applicability system;
- terminal reporter;
- JSON reporter;
- CLI filtering/options required for useful local scans;
- fixture repositories;
- tests;
- Windows/Linux/macOS CI;
- npm publishing setup;
- polished README;
- first public npm release.

Target experience:

```bash
npx @uxillary/<name> .
```

### Milestone 2 — GitHub-native / v0.2

Goal: make Repo Doctor useful as a persistent repository check.

Deliverables may include:

- `action.yml`;
- GitHub Action distribution;
- annotations;
- GitHub job summary;
- `--fail-on` thresholds;
- JSON artifact support;
- documentation for CI usage.

Target experience:

```yaml
- uses: uxillary/<name>@v1
```

### Milestone 3 — richer diagnostics / v0.3

Potential features:

- SARIF reporter;
- `explain <rule>`;
- minimal config file;
- rule suppression;
- additional ecosystem-aware checks;
- stronger monorepo awareness;
- improved project profiling;
- more source locations/evidence.

### Milestone 4 — stable ecosystem / v1.0

Potential requirements:

- stable rule IDs;
- stable JSON/report contract;
- documented scoring methodology if numeric scoring has proven useful;
- mature suppression/configuration behaviour;
- documented rule contribution API;
- strong false-positive regression suite;
- mature Action integration;
- clear compatibility/support policy.

### Only after demonstrated demand

Do not automatically add these simply because they sound useful:

- autofix;
- automatic PR generation;
- HTML dashboards;
- remote/cloud scanning;
- plugin marketplace;
- organisation scanning;
- optional AI explanations;
- deep integrations with specialist scanners.

Adoption and user feedback should justify these features.

---

## 29. v0.1 success criteria

The primary success criterion is not GitHub stars or the number of implemented rules.

The useful test is:

> **Can Repo Doctor scan a varied set of real repositories and repeatedly find legitimate things worth fixing without annoying the maintainer with nonsense?**

A practical internal validation target is to run it against at least ten varied Uxillary repositories and evaluate:

- useful findings discovered;
- false positives;
- skipped/not-applicable behaviour;
- scan speed;
- output clarity;
- cross-platform behaviour;
- whether findings are actionable.

Only after the scanner is genuinely useful should public growth metrics become meaningful.

---

## 30. Frozen product definition

Unless deliberately revised, use the following as the working product definition:

> **Repo Doctor is a local-first, deterministic repository health scanner that identifies actionable maintenance, documentation, configuration and CI problems without executing repository code or requiring external services.**
>
> **It prioritises high-confidence findings, explains why they matter, adapts checks to the type of project being scanned, and exposes the same findings through human-readable CLI output and machine-readable formats.**
>
> **It complements specialist tools such as OpenSSF Scorecard, actionlint, zizmor and lychee rather than attempting to replace them.**

---

## 31. Scope-protection rules for future ChatGPT/Codex sessions

When planning or implementing Repo Doctor:

1. Prefer the smallest change that advances the current milestone.
2. Do not perform broad repository rewrites without a concrete need.
3. Do not add speculative infrastructure for distant features.
4. Do not add AI dependencies to deterministic checks.
5. Do not execute scanned repository code.
6. Keep rules independent from reporters.
7. Keep CLI and GitHub Action implementations backed by the same core scanner.
8. Prefer high-confidence checks over a large rule count.
9. Treat false positives as product bugs.
10. Preserve `skip/not applicable` as a first-class result.
11. Do not introduce numeric scoring until the scoring model can be justified and documented.
12. Do not absorb GitHub Release Analytics or GitHub Profile Analytics into this repository.
13. Do not recreate specialist tools when a focused Repo Doctor-level diagnostic is sufficient.
14. Do not add features merely because they may attract stars.
15. Protect v0.1 from scope expansion.

When a new feature is proposed, ask:

> **Does this materially improve the core repository health scan required for the current milestone?**

If not, record it as a future idea and continue shipping the current milestone.

---

## 32. Immediate next step

The next development task should be **Milestone 0: repository foundation**, not implementation of every planned rule.

The first Codex task should establish a deliberately small but production-quality foundation including:

- Node/TypeScript package scaffold;
- CLI entry point;
- repository context/result/rule contracts;
- minimal scanner orchestration;
- terminal + JSON reporter foundations;
- test/fixture infrastructure;
- cross-platform-safe filesystem handling;
- lint/typecheck/test scripts;
- initial documentation;
- no large rule catalogue yet.

Once that foundation is reviewed and committed, rules should be added incrementally in small, testable groups.

---

**End of project context.**

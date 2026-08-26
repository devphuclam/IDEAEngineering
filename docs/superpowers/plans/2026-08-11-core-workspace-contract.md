# Core Workspace Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Provide one dependency-light \`verify-template\` command that proves the Core Workspace contract is complete, safe, and product-neutral from a clean checkout.

**Architecture:** A Bash command at \`scripts/verify-template\` is the only public verification seam. It validates a small set of versioned repository artifacts, a strict example environment file, secret-like assignments in tracked files, and local Markdown references; integration tests invoke the command against temporary Git repositories and assert only exit status and actionable diagnostics.

**Tech Stack:** Bash 4+, Git, and standard POSIX command-line utilities; no package manager, application SDK, cloud CLI, database, or network access.

## Global Constraints

- The public command is \`./scripts/verify-template\` and is the only V1 executable lifecycle command.
- A clean checkout must verify without Azure CLI, Azure credentials, application SDKs, databases, deployment configuration, package installation, or network access.
- Tests exercise the public command's exit status and diagnostics; they do not source the command or call internal helpers.
- Technical repository documentation is written in English.
- The Core Workspace is product-neutral; Stack Profiles and Platform Adapters are optional layers.
- \`setup\`, \`lint\`, \`test\`, and \`build\` are supplied only by a selected Stack Profile when they perform real work; \`deploy\` is supplied only by a Platform Adapter.
- V1 must not add fake or no-op application lifecycle commands.
- Sensitive assignments accept only an empty value or the documented environment-reference form \`\${UPPER_CASE_NAME}\`; committed literal values are rejected.
- Template release metadata is the single-line SemVer file \`.template-version\`; the initial value is \`0.1.0\`.

---

### Task 1: Establish the Core Workspace artifacts and required-file verification

**Files:**
- Create: \`README.md\`
- Create: \`docs/core-workspace.md\`
- Create: \`config/template.env.example\`
- Create: \`.template-version\`
- Create: \`scripts/verify-template\`
- Create: \`tests/verify-template.test.sh\`
- Modify: \`docs/research/2026-08-10-development-workspace-template-platform.md\`

**Interfaces:**
- Consumes: Git repository root, either inferred from the script location or passed as \`--root PATH\` for black-box tests.
- Produces: \`./scripts/verify-template [--root PATH]\`, returning \`0\` on success and nonzero with \`ERROR [CONTRACT_ID] ...\` diagnostics on stderr.

- [ ] **Step 1: Write a failing public-command test for a missing required artifact**

Create \`tests/verify-template.test.sh\` with a small test harness that creates a temporary Git repository containing the required baseline artifacts, removes \`CONTEXT.md\`, runs \`bash scripts/verify-template --root <fixture>\`, and asserts a nonzero exit plus a diagnostic containing both \`CORE_REQUIRED_FILE\` and \`CONTEXT.md\`. Build fixture contents from hand-written literals or copied public artifacts; invoke the verifier as a process and never source it.

The test entrypoint must be:

\`\`\`bash
bash tests/verify-template.test.sh
\`\`\`

The harness prints one \`ok - <name>\` or \`not ok - <name>\` line per test and exits nonzero when any test fails.

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

\`\`\`bash
bash tests/verify-template.test.sh
\`\`\`

Expected: FAIL because \`scripts/verify-template\` does not exist, so the required \`CORE_REQUIRED_FILE\` diagnostic is absent.

- [ ] **Step 3: Add the minimum Core artifacts and required-file checks**

Create these artifacts:

\`\`\`text
README.md
AGENTS.md
CONTEXT.md
docs/core-workspace.md
config/template.env.example
.template-version
\`\`\`

\`README.md\` must identify the repository as a product-neutral Development Workspace Template, show \`./scripts/verify-template\` as the clean-checkout command, and link to \`CONTEXT.md\`, \`AGENTS.md\`, \`docs/core-workspace.md\`, and \`config/template.env.example\`.

\`config/template.env.example\` must contain only comments plus:

\`\`\`dotenv
PROJECT_NAME=example-project
EXAMPLE_API_TOKEN=\${EXAMPLE_API_TOKEN}
\`\`\`

\`.template-version\` must contain exactly:

\`\`\`text
0.1.0
\`\`\`

Implement \`scripts/verify-template\` with \`set -uo pipefail\`, \`--root PATH\`, \`--help\`, unknown-argument handling, and required-file checks. Diagnostics use stable contract identifiers and actionable paths, for example:

\`\`\`text
ERROR [CORE_REQUIRED_FILE] Missing required Core Workspace artifact: CONTEXT.md
\`\`\`

The command must collect all detected violations and exit \`1\`; argument misuse exits \`2\`. A valid single-line SemVer matching \`^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$\` is required in \`.template-version\`, with contract identifier \`RELEASE_VERSION\` for missing, multiline, or malformed values.

Mark \`scripts/verify-template\` and \`tests/verify-template.test.sh\` executable in Git.

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run:

\`\`\`bash
bash tests/verify-template.test.sh
\`\`\`

Expected: the missing-artifact test passes with pristine TAP-like output.

- [ ] **Step 5: Add and run release metadata behavior tests**

Add one test that replaces \`.template-version\` with \`version-one\` and expects nonzero plus \`RELEASE_VERSION\` and \`.template-version\`. First run it against the current implementation and confirm RED if malformed version validation is not yet present; then add only the validation needed and rerun to GREEN.

- [ ] **Step 6: Fix the pre-existing Markdown whitespace warning and verify the task**

Remove the two trailing spaces after the Date and Scope lines in \`docs/research/2026-08-10-development-workspace-template-platform.md\` without changing their text. Run:

\`\`\`bash
bash tests/verify-template.test.sh
git diff --check
\`\`\`

Expected: all tests pass and \`git diff --check\` prints nothing.

- [ ] **Step 7: Commit**

\`\`\`bash
git add README.md docs/core-workspace.md config/template.env.example .template-version scripts/verify-template tests/verify-template.test.sh docs/research/2026-08-10-development-workspace-template-platform.md
git commit -m "feat: add executable core workspace contract"
\`\`\`

### Task 2: Validate safe configuration and reject committed secret-like values

**Files:**
- Modify: \`scripts/verify-template\`
- Modify: \`tests/verify-template.test.sh\`
- Modify: \`docs/core-workspace.md\`

**Interfaces:**
- Consumes: \`config/template.env.example\` and assignment-like lines in files returned by \`git -C <root> ls-files\`.
- Produces: \`CONFIG_SYNTAX\` and \`SECRET_LITERAL\` diagnostics through the existing public command.

- [ ] **Step 1: Write and run a failing malformed-configuration test**

Add a test that appends \`lowercase-name=value\` to \`config/template.env.example\`, stages the fixture, invokes the public command, and expects nonzero plus \`CONFIG_SYNTAX\`, the config path, and the offending line number.

Run:

\`\`\`bash
bash tests/verify-template.test.sh
\`\`\`

Expected: the new test fails because malformed assignment syntax is not rejected.

- [ ] **Step 2: Implement strict example-config parsing and confirm GREEN**

Accept only blank lines, comment lines whose first non-whitespace character is \`#\`, or assignments matching \`^[A-Z][A-Z0-9_]*=.*$\`. Reject duplicate keys. Report every malformed or duplicate line with \`CONFIG_SYNTAX\`, file path, line number, and a correction hint. Rerun the focused suite and confirm all tests pass.

- [ ] **Step 3: Write and run a failing literal-secret test**

Add a test that replaces the \`EXAMPLE_API_TOKEN\` environment reference with a dynamically assembled literal such as \`literal-\` plus \`credential-value\`, stages the fixture, and expects nonzero plus \`SECRET_LITERAL\`, \`EXAMPLE_API_TOKEN\`, and the file path. Do not place a complete credential-shaped sample in tracked test source.

Run:

\`\`\`bash
bash tests/verify-template.test.sh
\`\`\`

Expected: the new test fails because literal sensitive assignments are not rejected.

- [ ] **Step 4: Implement tracked-file secret assignment checks and confirm GREEN**

Inspect regular files listed by \`git -C <root> ls-files\`. For assignment-like lines in dotenv, YAML, JSON, TOML, and config files, normalize the key and treat keys containing \`SECRET\`, \`TOKEN\`, \`PASSWORD\`, \`PASSWD\`, \`API_KEY\`, \`PRIVATE_KEY\`, \`CLIENT_SECRET\`, or \`CONNECTION_STRING\` as sensitive. Accept only an empty value or \`\${UPPER_CASE_NAME}\` after trimming quotes and whitespace; reject other values with \`SECRET_LITERAL\`, the key, file path, and line number.

Skip binary files safely. The verifier must not print the rejected value. Rerun the focused suite and confirm all tests pass.

- [ ] **Step 5: Add the safe-placeholder positive test**

Add a test proving the committed \`\${EXAMPLE_API_TOKEN}\` form passes. The test must invoke the public command against a complete fixture and assert exit \`0\`, without grepping implementation source.

- [ ] **Step 6: Document configuration safety and verify the task**

In \`docs/core-workspace.md\`, document that committed examples use \`\${UPPER_CASE_NAME}\`, actual values come from developer/CI secret stores, and \`verify-template\` is a baseline guard rather than a replacement for enterprise secret scanning.

Run:

\`\`\`bash
bash tests/verify-template.test.sh
git diff --check
\`\`\`

Expected: all tests pass with no warnings; the diff check prints nothing.

- [ ] **Step 7: Commit**

\`\`\`bash
git add scripts/verify-template tests/verify-template.test.sh docs/core-workspace.md
git commit -m "feat: verify safe template configuration"
\`\`\`

### Task 3: Verify documentation references and the complete clean-checkout contract

**Files:**
- Modify: \`scripts/verify-template\`
- Modify: \`tests/verify-template.test.sh\`
- Modify: \`README.md\`
- Modify: \`docs/core-workspace.md\`

**Interfaces:**
- Consumes: relative Markdown links in tracked \`*.md\` files and the complete checked-out repository.
- Produces: \`DOC_REFERENCE\` diagnostics and a successful zero-exit clean-checkout verification through \`./scripts/verify-template\`.

- [ ] **Step 1: Write and run a failing broken-reference test**

Add a test that appends the following literal line to the fixture \`README.md\`, stages the fixture, runs the public command, and expects nonzero plus \`DOC_REFERENCE\`, \`README.md\`, and \`missing-guide.md\`.

```markdown
[Missing guide](missing-guide.md)
```

Run:

\`\`\`bash
bash tests/verify-template.test.sh
\`\`\`

Expected: the new test fails because local Markdown references are not yet validated.

- [ ] **Step 2: Implement local Markdown reference validation and confirm GREEN**

For tracked Markdown files, extract inline link targets, ignore \`http://\`, \`https://\`, \`mailto:\`, and anchor-only targets, strip an optional \`#fragment\`, resolve the remaining path relative to the referring document, and require that it exists. Report missing paths with \`DOC_REFERENCE\`, the referring file, and the original target. Paths in this template contain no URL-encoded spaces, so decoding is outside V1 scope.

Rerun the focused suite and confirm all tests pass.

- [ ] **Step 3: Finish lifecycle and layer semantics documentation**

Ensure \`docs/core-workspace.md\` explicitly states:

- Core Workspace owns collaboration rules, agent guidance, security defaults, documentation conventions, and verification.
- Stack Profiles optionally provide real \`setup\`, \`lint\`, \`test\`, and \`build\` behavior for a selected application stack.
- Platform Adapters optionally provide source-host, CI/CD, cloud, and \`deploy\` integration.
- V1 supplies only \`verify-template\`; absent lifecycle commands are intentional and no no-op shims are provided.
- Azure is optional and no Azure account, CLI, credential, pipeline, service connection, infrastructure definition, or deployment target is required.

Keep the README concise and link to this detailed contract.

- [ ] **Step 4: Add clean-success and unknown-argument behavior tests**

Add one test that verifies a complete fixture exits \`0\` and prints a concise success line containing \`Core Workspace contract verified\`. Add one test that invokes \`--unknown\`, expects exit \`2\`, and checks for a usage hint. Run each new test first before any required implementation adjustment; observe RED only when behavior is absent, then add the minimum behavior and rerun to GREEN.

- [ ] **Step 5: Run full verification from the actual worktree**

Run:

\`\`\`bash
bash tests/verify-template.test.sh
./scripts/verify-template
git diff --check
git status --short
\`\`\`

Expected: every integration test passes; the actual repository reports \`Core Workspace contract verified\`; diff check is empty; only intended task files are modified.

- [ ] **Step 6: Commit**

\`\`\`bash
git add scripts/verify-template tests/verify-template.test.sh README.md docs/core-workspace.md
git commit -m "feat: verify core documentation contract"
\`\`\`

- [ ] **Step 7: Verify the complete ticket acceptance criteria**

Run fresh:

\`\`\`bash
bash tests/verify-template.test.sh
./scripts/verify-template
git diff --check
\`\`\`

Confirm each acceptance criterion from GitHub issue #2 against command output and the committed diff. Do not add Stack Profile, Platform Adapter, Azure, deployment, or fake lifecycle implementations.

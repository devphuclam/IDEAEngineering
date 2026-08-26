# Portable Dev Container Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one pinned, minimal Linux Dev Container contract that works for local containers, GitHub Codespaces, and compatible CI while keeping the Core Workspace free of application and Azure tooling.

**Architecture:** The repository will contain one exact `.devcontainer/devcontainer.json` using the official Microsoft Dev Container Ubuntu image by immutable digest. `scripts/verify-template` will validate that exact four-property configuration and the required onboarding document without invoking a container. `tests/devcontainer-smoke.test.sh` will own runtime-dependent creation, in-container verification, cleanup, and explicit prerequisite failure diagnostics.

**Tech Stack:** Bash 4+, Git, JSON, Docker-compatible runtime, Development Containers CLI, Markdown, and the existing black-box shell test harness. No package installation or application SDK is required by the Core Workspace.

## Global Constraints

- The default configuration is exactly `.devcontainer/devcontainer.json`.
- The image is `mcr.microsoft.com/devcontainers/base@sha256:1f8bb87ca6d342a587a9163a5a1ea8c487bcd4f149e8483a5ff711f795f0776d`.
- The configuration uses `remoteUser: "vscode"` and `postCreateCommand: "./scripts/verify-template"`.
- The configuration declares no `features`, `build`, `dockerComposeFile`, `forwardPorts`, `portsAttributes`, personal editor settings, personal editor extensions, secrets, or environment values.
- The Core Workspace adds no application Stack Profile, language/framework SDK, database, Azure CLI, infrastructure CLI, pipeline, service connection, or deployment target.
- `./scripts/verify-template` remains the sole public Core Workspace verification seam.
- Missing or malformed Dev Container content emits a nonzero exit and the stable `DEVCONTAINER` contract identifier.
- Onboarding must cover local Docker use, GitHub Codespaces, WSL2 without a container, the absence of native Windows parity, shared versus personal customization, and the absence of application lifecycle commands until an optional layer supplies real behavior.
- Runtime smoke verification must not silently skip a missing `devcontainer` CLI, unavailable Docker daemon, image-pull failure, container-start failure, in-container verification failure, or cleanup failure.
- Technical documentation is English and contains no Azure credentials, organization identifiers, subscription identifiers, service connections, or secret values.
- Tests invoke the public verifier as a process; no test sources private verifier functions.

---

## File map

| File | Responsibility |
| --- | --- |
| `.devcontainer/devcontainer.json` | The one default portable Dev Container configuration. |
| `docs/development-environment.md` | Local, Codespaces, WSL2, customization, and lifecycle onboarding. |
| `README.md` | Links the new onboarding document from the template entry point. |
| `scripts/verify-template` | Validates the pinned Dev Container JSON and onboarding contract with `DEVCONTAINER` diagnostics. |
| `tests/verify-template.test.sh` | Black-box positive and negative contract tests, including a complete fixture. |
| `tests/devcontainer-smoke.test.sh` | Runtime-dependent creation, exec, cleanup, and prerequisite self-tests. |

## Task 1: Specify the Dev Container contract with black-box tests

**Files:**

- Modify: `tests/verify-template.test.sh` in `make_fixture`, the new contract test functions, and the invocation list at the bottom.
- Read: `scripts/verify-template` only to identify the existing public command; do not source it from the tests.

**Interfaces:**

- Consumes: existing `make_fixture`, `repo_root`, `failures`, and `bash "$repo_root/scripts/verify-template" --root "$fixture"` process invocation.
- Produces: a complete fixture containing the approved four-property Dev Container JSON and onboarding markers, plus seven new black-box tests that all expect `DEVCONTAINER` on failure.

- [ ] **Step 1: Extend the complete fixture with the approved configuration and onboarding content.**

After the existing `mkdir -p "$fixture/docs" "$fixture/config"` line, add `.devcontainer` to the directory list. After writing `docs/core-workspace.md`, write these exact fixture files:

```bash
  printf '%s\n' \
    '{' \
    '  "name": "Development Workspace Template",' \
    '  "image": "mcr.microsoft.com/devcontainers/base@sha256:1f8bb87ca6d342a587a9163a5a1ea8c487bcd4f149e8483a5ff711f795f0776d",' \
    '  "remoteUser": "vscode",' \
    '  "postCreateCommand": "./scripts/verify-template"' \
    '}' > "$fixture/.devcontainer/devcontainer.json"
  printf '%s\n' \
    '# Development Environment' \
    'Use Docker Desktop and a Dev Containers-capable editor for local development.' \
    'The same Dev Container runs in GitHub Codespaces.' \
    'Use WSL2 without a container when company policy prohibits containers.' \
    'Native Windows parity is not promised.' \
    'Shared customization belongs in the template; personal themes, keymaps, dotfiles, and editor preferences stay outside it.' \
    'The Core Workspace has no application setup, lint, test, build, or deploy command until a Stack Profile or Platform Adapter supplies real behavior.' > "$fixture/docs/development-environment.md"
```

Add `[Development environment](docs/development-environment.md)` to the fixture README so the documentation reference is also exercised.

- [ ] **Step 2: Add the missing-file regression test and run it against the current verifier.**

Add this function before `test_complete_fixture_success`:

```bash
test_requires_default_devcontainer() {
  make_fixture
  rm "$fixture/.devcontainer/devcontainer.json"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DEVCONTAINER"* ]] && [[ "$output" == *".devcontainer/devcontainer.json"* ]]; then
    printf '%s\n' 'ok - requires the default Dev Container configuration'
  else
    printf '%s\n' 'not ok - requires the default Dev Container configuration'
    failures=$((failures + 1))
  fi
}
```

Run:

```bash
bash tests/verify-template.test.sh
```

Expected: the existing 54 tests remain green and this new test is `not ok` because the current verifier does not yet enforce the Dev Container contract. This is the required RED observation for the first behavior.

- [ ] **Step 3: Add the six remaining contract regressions with exact mutations.**

Add these functions, each using the same `make_fixture`, process invocation, cleanup, and `DEVCONTAINER` assertion shape as the first test:

```bash
test_requires_pinned_official_devcontainer_image() {
  make_fixture
  sed -i 's#@sha256:[0-9a-f]*#:#' "$fixture/.devcontainer/devcontainer.json"
  git -C "$fixture" add .devcontainer/devcontainer.json >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"
  if [ "$status" -ne 0 ] && [[ "$output" == *"DEVCONTAINER"* ]]; then
    printf '%s\n' 'ok - requires the pinned official Dev Container image'
  else
    printf '%s\n' 'not ok - requires the pinned official Dev Container image'
    failures=$((failures + 1))
  fi
}

test_requires_shared_post_create_verification() {
  make_fixture
  sed -i 's#\./scripts/verify-template#true#' "$fixture/.devcontainer/devcontainer.json"
  git -C "$fixture" add .devcontainer/devcontainer.json >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"
  if [ "$status" -ne 0 ] && [[ "$output" == *"DEVCONTAINER"* ]]; then
    printf '%s\n' 'ok - requires shared post-create verification'
  else
    printf '%s\n' 'not ok - requires shared post-create verification'
    failures=$((failures + 1))
  fi
}

test_rejects_devcontainer_features() {
  make_fixture
  sed -i '$i\  ,"features": {}' "$fixture/.devcontainer/devcontainer.json"
  git -C "$fixture" add .devcontainer/devcontainer.json >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"
  if [ "$status" -ne 0 ] && [[ "$output" == *"DEVCONTAINER"* ]]; then
    printf '%s\n' 'ok - rejects Dev Container Features in the Core configuration'
  else
    printf '%s\n' 'not ok - rejects Dev Container Features in the Core configuration'
    failures=$((failures + 1))
  fi
}

test_rejects_devcontainer_build_configuration() {
  make_fixture
  sed -i '$i\  ,"build": {"dockerfile": "Dockerfile"}' "$fixture/.devcontainer/devcontainer.json"
  git -C "$fixture" add .devcontainer/devcontainer.json >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"
  if [ "$status" -ne 0 ] && [[ "$output" == *"DEVCONTAINER"* ]]; then
    printf '%s\n' 'ok - rejects custom Dev Container builds in the Core configuration'
  else
    printf '%s\n' 'not ok - rejects custom Dev Container builds in the Core configuration'
    failures=$((failures + 1))
  fi
}

test_rejects_devcontainer_ports() {
  make_fixture
  sed -i '$i\  ,"forwardPorts": [3000]' "$fixture/.devcontainer/devcontainer.json"
  git -C "$fixture" add .devcontainer/devcontainer.json >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"
  if [ "$status" -ne 0 ] && [[ "$output" == *"DEVCONTAINER"* ]]; then
    printf '%s\n' 'ok - rejects application ports in the Core configuration'
  else
    printf '%s\n' 'not ok - rejects application ports in the Core configuration'
    failures=$((failures + 1))
  fi
}

test_requires_development_environment_onboarding() {
  make_fixture
  printf '%s\n' '# Development Environment' > "$fixture/docs/development-environment.md"
  git -C "$fixture" add docs/development-environment.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"
  if [ "$status" -ne 0 ] && [[ "$output" == *"DEVCONTAINER"* ]] && [[ "$output" == *"docs/development-environment.md"* ]]; then
    printf '%s\n' 'ok - requires development environment onboarding'
  else
    printf '%s\n' 'not ok - requires development environment onboarding'
    failures=$((failures + 1))
  fi
}
```

Run:

```bash
bash tests/verify-template.test.sh
```

Expected: all seven new tests are `not ok` for the current verifier, while existing behavior remains unchanged. The failures must be caused by the missing `DEVCONTAINER` diagnostics, not by syntax errors in the tests.

- [ ] **Step 4: Register the seven tests and commit the RED test contract.**

Add the seven function calls immediately before `test_complete_fixture_success` in the invocation list, then run `bash -n tests/verify-template.test.sh`. Commit only the test changes:

```bash
git add tests/verify-template.test.sh
git diff --cached --check
git commit -m "test: specify portable dev container contract"
```

## Task 2: Implement the `DEVCONTAINER` verifier contract

**Files:**

- Modify: `scripts/verify-template` after the existing Core content checks and before release/configuration scanning.
- Test: `tests/verify-template.test.sh` from Task 1.

**Interfaces:**

- Consumes: `root`, `violations`, existing tracked-file enumeration, and the seven public process tests.
- Produces: `validate_devcontainer_contract`, the stable `DEVCONTAINER` diagnostics, and a verifier that accepts the complete fixture and rejects each Task 1 mutation.

- [ ] **Step 1: Add a whitespace-compacting JSON helper with no external parser dependency.**

Add a Bash helper named `compact_json` that accepts the full file content in `$1`, stores the result in the global variable `compact_json_result`, and removes only JSON whitespace outside quoted strings. It must preserve escaped characters inside strings and must not treat a backslash-escaped quote as the end of a string. The helper must use the same Bash character iteration style already used by `strip_inline_comment`; it must not call Python, Node, `jq`, `realpath`, or a network service.

The required state transitions are:

```bash
compact_json() {
  local source=$1
  local result=
  local in_string=0
  local escaped=0
  local index=0
  local character

  while (( index < ${#source} )); do
    character=${source:index:1}
    if (( in_string )); then
      result+=$character
      if (( escaped )); then
        escaped=0
      elif [[ "$character" == \\ ]]; then
        escaped=1
      elif [[ "$character" == '"' ]]; then
        in_string=0
      fi
    else
      case "$character" in
        '"') in_string=1; result+=$character ;;
        $' '|$'\t'|$'\n'|$'\r') ;;
        *) result+=$character ;;
      esac
    fi
    index=$((index + 1))
  done

  compact_json_result=$result
}
```

- [ ] **Step 2: Add exact Dev Container and onboarding contract validation.**

Add a `validate_devcontainer_contract` function that performs these checks in order and increments `violations` for every failed check:

1. Require the regular file `.devcontainer/devcontainer.json` and emit `ERROR [DEVCONTAINER] Missing required Dev Container configuration: .devcontainer/devcontainer.json` when absent.
2. Read the file into `devcontainer_source`; emit `ERROR [DEVCONTAINER] Unable to read .devcontainer/devcontainer.json` when reading fails.
3. Compact the content with `compact_json`.
4. Compare the compact content byte-for-byte with this exact canonical object:

```bash
expected_devcontainer='{"name":"Development Workspace Template","image":"mcr.microsoft.com/devcontainers/base@sha256:1f8bb87ca6d342a587a9163a5a1ea8c487bcd4f149e8483a5ff711f795f0776d","remoteUser":"vscode","postCreateCommand":"./scripts/verify-template"}'
```

5. When the comparison fails, emit `ERROR [DEVCONTAINER] .devcontainer/devcontainer.json must contain only the pinned foundational configuration with remoteUser vscode and postCreateCommand ./scripts/verify-template` without printing the full file content.
6. Require `docs/development-environment.md` and require these exact semantic fragments: `Docker Desktop`, `Dev Containers`, `GitHub Codespaces`, `WSL2`, `Native Windows parity is not promised`, `personal themes`, `Stack Profile`, `Platform Adapter`, `setup`, `lint`, `test`, `build`, and `deploy`. For a missing marker stored in `required_marker`, emit `ERROR [DEVCONTAINER] docs/development-environment.md must contain required onboarding marker: $required_marker`.

The implementation may use a parameterized `require_contract_content` helper, but existing `CORE_CONTENT` diagnostics must retain their current output. The new onboarding failures must use `DEVCONTAINER` so Task 1 can assert one stable contract identifier. Call `validate_devcontainer_contract` once before release metadata validation.

- [ ] **Step 3: Run the focused public suite to verify GREEN.**

Run:

```bash
bash -n scripts/verify-template tests/verify-template.test.sh
bash tests/verify-template.test.sh
```

Expected: 61/61 tests pass and zero `not ok` lines. If a test fails, fix the verifier or fixture while preserving the public process boundary; do not weaken the test assertions.

- [ ] **Step 4: Commit the verifier implementation.**

```bash
git add scripts/verify-template
git diff --cached --check
git commit -m "feat: verify portable dev container contract"
```

## Task 3: Add the repository configuration and onboarding

**Files:**

- Create: `.devcontainer/devcontainer.json` with mode `100644`.
- Create: `docs/development-environment.md`.
- Modify: `README.md`.
- Test: `tests/verify-template.test.sh` and `scripts/verify-template` from Tasks 1–2.

**Interfaces:**

- Consumes: the exact canonical JSON and onboarding markers required by `validate_devcontainer_contract`.
- Produces: a real repository configuration that passes the Core verifier and explains all supported environment paths without adding application or Azure behavior.

- [ ] **Step 1: Create the exact default Dev Container configuration.**

Create `.devcontainer/devcontainer.json` with exactly this content:

```json
{
  "name": "Development Workspace Template",
  "image": "mcr.microsoft.com/devcontainers/base@sha256:1f8bb87ca6d342a587a9163a5a1ea8c487bcd4f149e8483a5ff711f795f0776d",
  "remoteUser": "vscode",
  "postCreateCommand": "./scripts/verify-template"
}
```

Do not add comments, Features, build settings, ports, environment variables, secrets, editor preferences, or lifecycle commands beyond `postCreateCommand`.

- [ ] **Step 2: Write the onboarding document with concrete supported paths.**

Create `docs/development-environment.md` with these sections and requirements:

```markdown
# Development Environment

## Local Dev Container

Install Docker Desktop and a Dev Containers-capable editor, open the repository, and reopen it in the configured Dev Container. The shared environment is defined by `.devcontainer/devcontainer.json`; after creation, `./scripts/verify-template` is the verification command.

## GitHub Codespaces

Create a Codespace from this repository. GitHub uses the same default `.devcontainer/devcontainer.json`, so the image, workspace user, and post-create verification do not depend on a developer's personal machine.

## WSL2 fallback

When company policy prohibits containers, use WSL2 without a container and run the repository's shell verification from the Linux environment. This is a controlled fallback, not a claim that native Windows execution has identical behavior.

Native Windows parity is not promised.

## Shared and personal customization

Keep required repository customization in the template. Keep personal themes, keymaps, dotfiles, and editor preferences outside the template so they do not become project dependencies.

## Core Workspace lifecycle scope

The Core Workspace has no application `setup`, `lint`, `test`, `build`, or `deploy` command. A Stack Profile may supply real setup, lint, test, and build behavior; a Platform Adapter may supply deploy behavior. Until those optional layers exist, `./scripts/verify-template` is the only public verification command.
```

Use the exact phrase `Native Windows parity is not promised.` so the verifier checks an unambiguous boundary. Do not add Azure organization, tenant, subscription, service connection, credential, or secret examples.

- [ ] **Step 3: Link onboarding from the README.**

Update the final README paragraph to include the new document:

```markdown
Read the [Core Workspace contract](docs/core-workspace.md) for the supported V1 scope and clean-checkout verification, the [development environment guide](docs/development-environment.md) for local containers, Codespaces, and WSL2 fallback, plus the [project context](CONTEXT.md), [agent guidance](AGENTS.md), and [example environment configuration](config/template.env.example).
```

- [ ] **Step 4: Run the repository verifier and commit the configuration/docs.**

Run:

```bash
./scripts/verify-template
bash tests/verify-template.test.sh
git diff --check
```

Expected: the direct verifier prints `Core Workspace contract verified`, the suite reports 61/61 passing, and the diff check is clean. Commit:

```bash
git add .devcontainer/devcontainer.json docs/development-environment.md README.md
git diff --cached --check
git commit -m "docs: add portable development environment"
```

## Task 4: Add runtime smoke verification and explicit prerequisite tests

**Files:**

- Create: `tests/devcontainer-smoke.test.sh` with mode `100755`.
- Test: the new smoke harness using its self-test mode and, when prerequisites are available, its real default mode.

**Interfaces:**

- Consumes: repository root, `devcontainer` CLI, Docker-compatible CLI, `.devcontainer/devcontainer.json`, and `./scripts/verify-template`.
- Produces: `bash tests/devcontainer-smoke.test.sh` as the real runtime smoke command and `bash tests/devcontainer-smoke.test.sh --self-test` as deterministic prerequisite/error coverage.
- Environment overrides: `DEVCONTAINER_COMMAND` defaults to `devcontainer`; `DOCKER_COMMAND` defaults to `docker`.
- Stable diagnostics: `DEVCONTAINER_TOOL`, `DEVCONTAINER_RUNTIME`, `DEVCONTAINER_START`, `DEVCONTAINER_VERIFY`, and `DEVCONTAINER_CLEANUP`.

- [ ] **Step 1: Implement command and daemon prerequisite checks.**

The script must use Bash and define `run_smoke`, `test_missing_devcontainer_cli`, and `test_unreachable_docker_daemon`. `run_smoke` must:

```bash
devcontainer_command=${DEVCONTAINER_COMMAND:-devcontainer}
docker_command=${DOCKER_COMMAND:-docker}
workspace_folder=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
```

It must report `ERROR [DEVCONTAINER_TOOL] Missing Development Containers CLI: $devcontainer_command` when `command -v "$devcontainer_command"` fails. It must run `"$docker_command" info`; a nonzero result emits `ERROR [DEVCONTAINER_RUNTIME] Docker-compatible runtime is unavailable or its daemon is not running`. It must return nonzero at either failure and must not continue to image pull or container startup.

- [ ] **Step 2: Implement create, verify, and cleanup with an EXIT trap.**

After prerequisites pass, run exactly:

```bash
"$devcontainer_command" up --workspace-folder "$workspace_folder"
"$devcontainer_command" exec --workspace-folder "$workspace_folder" ./scripts/verify-template
```

Use an `EXIT` trap that runs `"$devcontainer_command" down --workspace-folder "$workspace_folder"` after a successful `up` and emits `ERROR [DEVCONTAINER_CLEANUP]` if cleanup fails. A failed `up` emits `ERROR [DEVCONTAINER_START]`; a failed in-container verifier emits `ERROR [DEVCONTAINER_VERIFY]`. Preserve the original nonzero status when cleanup also fails. Do not pipe away command output or convert a failed step into a success.

- [ ] **Step 3: Add deterministic self-tests for missing CLI and unavailable daemon.**

`--self-test` must run two tests without requiring Docker:

1. Set `DEVCONTAINER_COMMAND` to a unique nonexistent executable name, call `run_smoke`, and assert nonzero status plus `DEVCONTAINER_TOOL`.
2. Create a temporary executable Docker shim whose body is `exit 1`, set `DEVCONTAINER_COMMAND=sh`, set `DOCKER_COMMAND` to that shim, call `run_smoke`, and assert nonzero status plus `DEVCONTAINER_RUNTIME`.

Print `ok - reports a missing Dev Container CLI`, `ok - reports an unavailable Docker daemon`, and a final failure count. The self-test must never invoke `devcontainer up`.

- [ ] **Step 4: Run syntax and self-tests, then run real smoke if available.**

Run:

```bash
bash -n tests/devcontainer-smoke.test.sh
bash tests/devcontainer-smoke.test.sh --self-test
```

Expected: both self-tests pass with zero failures. Then inspect prerequisites:

```bash
command -v devcontainer
docker info
```

If both succeed, run `bash tests/devcontainer-smoke.test.sh` and require a zero exit plus successful in-container `Core Workspace contract verified`. If either prerequisite is unavailable, run the real smoke command once, record its exact `DEVCONTAINER_TOOL` or `DEVCONTAINER_RUNTIME` failure, and leave the issue open until the runtime smoke has been executed successfully. Do not report the runtime smoke as passing based on the self-tests.

- [ ] **Step 5: Commit the smoke harness.**

```bash
git add tests/devcontainer-smoke.test.sh
git diff --cached --check
git commit -m "test: add dev container smoke harness"
```

## Final verification and review gate

After Tasks 1–4, run all of these from the isolated worktree:

```bash
bash -n scripts/verify-template tests/verify-template.test.sh tests/devcontainer-smoke.test.sh
bash tests/verify-template.test.sh
bash tests/devcontainer-smoke.test.sh --self-test
./scripts/verify-template
git diff --check
git status --short --branch
```

The expected contract suite result is 61/61 passing with zero failures. The smoke self-test must have two passing cases. The direct verifier must print `Core Workspace contract verified`. A real runtime smoke pass is additionally required before resolving #3; a missing local runtime is a recorded blocker, not a pass.

Run the two-axis review against the base commit selected before implementation:

- Standards axis: repository conventions, provider-neutral wording, shell portability, executable mode, line endings, and no hidden dependency on Azure/application tooling.
- Spec axis: every #3 acceptance criterion, especially real container creation and the exact failure behavior for missing prerequisites.

Fix Critical and Important findings with a new test-first task, rerun the full verification gate, then commit the final remediation. Resolve [#3](https://github.com/devphuclam/CodespaceTemplate/issues/3) only after the real smoke command succeeds and the review has no unresolved load-bearing findings.

## Plan self-review

- Spec coverage: Tasks 1–2 cover the required configuration and verifier behavior; Task 3 covers the shared environment and onboarding; Task 4 covers local/Codespaces-compatible runtime smoke and explicit failure modes; the final gate covers review and issue resolution.
- Dependency boundaries: no application Stack Profile, Azure CLI, database, Docker-in-Docker Feature, port, secret, or deployment implementation is introduced.
- Public seam: only `./scripts/verify-template` is used as the Core verifier; the smoke file is explicitly a test harness.
- Portability: verifier logic remains Bash-only and does not depend on Python, Node, `jq`, `realpath`, Docker, or network access.
- Test isolation: all contract tests invoke the verifier as a separate process; smoke self-tests use temporary command shims and do not require a running daemon.
- Naming consistency: `DEVCONTAINER_COMMAND`, `DOCKER_COMMAND`, `run_smoke`, `--self-test`, and all diagnostic identifiers are defined once and reused by subsequent tasks.

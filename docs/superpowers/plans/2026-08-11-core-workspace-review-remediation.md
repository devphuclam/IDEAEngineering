# Core Workspace Review Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the load-bearing Standards and Spec gaps found by the final two-axis review so the public verifier proves the complete documented Core Workspace contract.

**Architecture:** Keep `./scripts/verify-template` as the only public seam. Add explicit contract checks for the two prescribed example configuration assignments and required README/Core-document semantics, and reuse one private Markdown destination validator for both inline links and reference-definition destinations; documentation-only fixes align provider-neutral vocabulary and the historical SemVer expression with the already accepted strict implementation.

**Tech Stack:** Bash 4.0+, Git, and POSIX `od`/`awk`; no package manager, application SDK, cloud CLI, database, network access, or new dependency.

## Global Constraints

- The public command remains `./scripts/verify-template`; private helpers must not become new public commands.
- A clean checkout must verify without Azure CLI, Azure credentials, application SDKs, databases, deployment configuration, package installation, or network access.
- Tests invoke the public command as a process and assert exit status plus actionable diagnostics; they do not source the verifier or call private helpers.
- `config/template.env.example` permits blank lines and comments but must contain exactly one `PROJECT_NAME=example-project` assignment and exactly one `EXAMPLE_API_TOKEN=${EXAMPLE_API_TOKEN}` assignment, with no other assignment keys.
- Required README semantics are: identify the Development Workspace Template, show `./scripts/verify-template`, and include the four required local paths `CONTEXT.md`, `AGENTS.md`, `docs/core-workspace.md`, and `config/template.env.example`.
- Required Core contract semantics are: Core ownership, optional Stack Profile `setup`/`lint`/`test`/`build`, optional Platform Adapter `deploy`, V1-only verification with no no-op shims, and optional Azure.
- Tracked local Markdown destinations include destinations declared by reference definitions such as `[guide]: guide.md`; fenced and inline code remain excluded.
- Sensitive values and rejected configuration values must never be printed in diagnostics.
- Strict SemVer numeric identifiers use `(0|[1-9][0-9]*)` for each component; leading zeros stay rejected.
- Technical repository documentation remains English and Core Work Item terminology remains provider-neutral.
- Preserve Bash 4.0 compatibility, LF checkout attributes, and executable Git modes for both shell files.
- Do not perform the review's optional monolith, test-harness duplication, quote-scanner duplication, or data-clump refactors in this ticket.

---

### Task 1: Enforce complete Core content and reference-style destinations

**Files:**
- Modify: `tests/verify-template.test.sh`
- Modify: `scripts/verify-template`
- Modify: `docs/agents/triage-labels.md`
- Modify: `docs/superpowers/plans/2026-08-11-core-workspace-contract.md`

**Interfaces:**
- Consumes: the required Core files, `config/template.env.example`, inline Markdown links, and Markdown reference definitions in tracked `*.md` files.
- Produces: the unchanged `./scripts/verify-template [--root PATH]` command plus stable `CONFIG_CONTRACT`, `CORE_CONTENT`, and existing `DOC_REFERENCE` diagnostics.

- [ ] **Step 1: Make the complete fixture represent the documented Core contract**

Replace the placeholder README and Core contract literals in `make_fixture` with these hand-written public artifacts; keep the remaining fixture files and Git staging behavior unchanged:

```bash
printf '%s\n' \
  '# Development Workspace Template' \
  'Run `./scripts/verify-template`.' \
  '[Context](CONTEXT.md)' \
  '[Agent guidance](AGENTS.md)' \
  '[Core contract](docs/core-workspace.md)' \
  '[Example configuration](config/template.env.example)' > "$fixture/README.md"

printf '%s\n' \
  '# Core Workspace' \
  'Core owns collaboration rules, agent guidance, security defaults, documentation conventions, and verification.' \
  'Stack Profiles optionally provide real setup, lint, test, and build behavior.' \
  'Platform Adapters optionally provide deploy integration.' \
  'V1 supplies only verification and provides no no-op shims.' \
  'Azure is optional.' > "$fixture/docs/core-workspace.md"
```

Run the existing suite before adding production checks. Expected: all `47` existing cases remain `ok`; this fixture-only step introduces no verifier behavior.

- [ ] **Step 2: Add three failing public regressions for the exact example-configuration contract**

Add and register these three independent behaviors using the existing harness shape:

```bash
test_missing_required_example_configuration_key() {
  make_fixture
  printf '%s\n' 'EXAMPLE_API_TOKEN=${EXAMPLE_API_TOKEN}' > "$fixture/config/template.env.example"
  git -C "$fixture" add config/template.env.example >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"CONFIG_CONTRACT"* ]] && [[ "$output" == *"PROJECT_NAME"* ]] && [[ "$output" == *"config/template.env.example"* ]]; then
    printf '%s\n' 'ok - requires every prescribed example configuration key'
  else
    printf '%s\n' 'not ok - requires every prescribed example configuration key'
    failures=$((failures + 1))
  fi
}

test_unexpected_example_configuration_key() {
  make_fixture
  printf '%s\n' 'EXTRA_SETTING=enabled' >> "$fixture/config/template.env.example"
  git -C "$fixture" add config/template.env.example >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"CONFIG_CONTRACT"* ]] && [[ "$output" == *"EXTRA_SETTING"* ]] && [[ "$output" == *"config/template.env.example"* ]]; then
    printf '%s\n' 'ok - rejects extra example configuration keys'
  else
    printf '%s\n' 'not ok - rejects extra example configuration keys'
    failures=$((failures + 1))
  fi
}

test_incorrect_required_example_configuration_value() {
  make_fixture
  printf '%s\n' 'PROJECT_NAME=renamed-project' 'EXAMPLE_API_TOKEN=${EXAMPLE_API_TOKEN}' > "$fixture/config/template.env.example"
  git -C "$fixture" add config/template.env.example >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"CONFIG_CONTRACT"* ]] && [[ "$output" == *"PROJECT_NAME"* ]] && [[ "$output" != *"renamed-project"* ]]; then
    printf '%s\n' 'ok - enforces prescribed example configuration values'
  else
    printf '%s\n' 'not ok - enforces prescribed example configuration values'
    failures=$((failures + 1))
  fi
}
```

Run the suite. Expected: exit `1` with exactly these three new `not ok` lines while all 47 prior cases remain `ok`.

- [ ] **Step 3: Enforce the exact configuration key/value set and return the three tests to GREEN**

Inside the existing `config_file` block, define Bash-4.0-compatible associative arrays:

```bash
declare -A expected_config_values=(
  [PROJECT_NAME]='example-project'
  [EXAMPLE_API_TOKEN]='${EXAMPLE_API_TOKEN}'
)
declare -A config_values=()
```

After syntax and duplicate checks derive `config_value=${config_line#*=}`. Reject a key absent from `expected_config_values` with `ERROR [CONFIG_CONTRACT] config/template.env.example line N contains unexpected key KEY; remove it from the Core example`, without printing its value. Store accepted key values in `config_values`.

After the line loop, iterate `PROJECT_NAME EXAMPLE_API_TOKEN`. For a missing key, emit `CONFIG_CONTRACT`, the path, and key plus an add-the-required-assignment hint. For a mismatched value, emit `CONFIG_CONTRACT`, the path, and key plus a restore-the-prescribed-value hint; do not interpolate the rejected value. Increment `violations` for each failed contract.

Run the suite. Expected: all `50` cases print `ok`.

- [ ] **Step 4: Add failing public regressions for required README and Core-document semantics**

Add and register:

```bash
test_readme_requires_core_contract_content() {
  make_fixture
  printf '%s\n' '# Example' > "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"CORE_CONTENT"* ]] && [[ "$output" == *"README.md"* ]] && [[ "$output" == *"Development Workspace Template"* ]]; then
    printf '%s\n' 'ok - requires README contract semantics'
  else
    printf '%s\n' 'not ok - requires README contract semantics'
    failures=$((failures + 1))
  fi
}

test_core_document_requires_layer_semantics() {
  make_fixture
  printf '%s\n' '# Core Workspace' > "$fixture/docs/core-workspace.md"
  git -C "$fixture" add docs/core-workspace.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"CORE_CONTENT"* ]] && [[ "$output" == *"docs/core-workspace.md"* ]] && [[ "$output" == *"Stack Profiles"* ]]; then
    printf '%s\n' 'ok - requires documented layer semantics'
  else
    printf '%s\n' 'not ok - requires documented layer semantics'
    failures=$((failures + 1))
  fi
}
```

Run the suite. Expected: these two tests are RED because required files are currently checked only for existence.

- [ ] **Step 5: Validate stable content markers without adding an external parser**

Add a private helper with this interface:

```bash
require_content_fragments() {
  local relative_path=$1
  shift
  local content
  local fragment

  if [ ! -f "$root/$relative_path" ]; then
    return
  fi
  if ! content=$(<"$root/$relative_path"); then
    printf 'ERROR [REPOSITORY_ACCESS] Unable to read required Core Workspace artifact: %s\n' "$relative_path" >&2
    violations=$((violations + 1))
    return
  fi

  for fragment in "$@"; do
    if [[ "$content" != *"$fragment"* ]]; then
      printf 'ERROR [CORE_CONTENT] %s must contain required contract marker: %s\n' "$relative_path" "$fragment" >&2
      violations=$((violations + 1))
    fi
  done
}
```

Call it for `README.md` with `Development Workspace Template`, `./scripts/verify-template`, `CONTEXT.md`, `AGENTS.md`, `docs/core-workspace.md`, and `config/template.env.example`.

Call it for `docs/core-workspace.md` with `collaboration rules`, `agent guidance`, `security defaults`, `documentation conventions`, `verification`, `Stack Profiles`, `setup`, `lint`, `test`, `build`, `Platform Adapters`, `deploy`, `V1`, `no-op`, and `Azure is optional`.

These are stable contract markers, not exact full-document snapshots. Run the suite. Expected: all `52` cases print `ok`.

- [ ] **Step 6: Add failing negative and positive regressions for reference-style destinations**

Add and register:

```bash
test_broken_reference_style_markdown_destination() {
  make_fixture
  printf '%s\n' '[Guide][guide]' '[guide]: missing-reference-guide.md' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *"README.md"* ]] && [[ "$output" == *"missing-reference-guide.md"* ]]; then
    printf '%s\n' 'ok - rejects broken reference-style Markdown destinations'
  else
    printf '%s\n' 'not ok - rejects broken reference-style Markdown destinations'
    failures=$((failures + 1))
  fi
}

test_valid_reference_style_markdown_destination() {
  make_fixture
  printf '%s\n' '# Guide' > "$fixture/guide.md"
  printf '%s\n' '[Guide][guide]' '[guide]: <guide.md> "Guide title"' >> "$fixture/README.md"
  git -C "$fixture" add README.md guide.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" != *"DOC_REFERENCE"* ]]; then
    printf '%s\n' 'ok - accepts valid reference-style Markdown destinations'
  else
    printf '%s\n' 'not ok - accepts valid reference-style Markdown destinations'
    failures=$((failures + 1))
  fi
}
```

Run the suite. Expected: the broken-reference test is RED while the positive case documents desired support.

- [ ] **Step 7: Reuse destination parsing and path validation for reference definitions**

Extract the current destination-token parsing into `extract_markdown_destination TARGET`, which sets `markdown_destination_found` plus `markdown_destination` and supports both `<path>` with optional title and a bare non-whitespace destination.

Extract the current external/anchor skip, fragment removal, unescaping, lexical normalization, existence, final-symlink, parent containment, and directory containment block into `validate_markdown_destination DESTINATION REFERRING_PATH REFERRING_DIRECTORY`. Preserve every existing `DOC_REFERENCE` diagnostic and violation increment.

In each visible Markdown line, detect a definition whose first non-whitespace content is `[label]: destination`, take the destination tail after the colon, call `extract_markdown_destination`, then call `validate_markdown_destination` when found. Afterwards, keep scanning the same visible line for inline links through the existing label/parenthesis parser and the same two new helpers. Definitions inside fenced blocks, indented code, or inline code remain invisible through the existing block/code stripping.

Do not implement undefined-reference-label resolution, footnotes, or a full CommonMark parser; this task validates local filesystem destinations declared by reference definitions.

Run the suite. Expected: all `54` public cases print `ok`, including every pre-existing Markdown edge case.

- [ ] **Step 8: Align provider-neutral wording and the settled strict SemVer plan expression**

In `docs/agents/triage-labels.md`, replace `Maintainer needs to evaluate this issue` with `Maintainer needs to evaluate this Work Item`. This is human-facing prose and receives diff review rather than a source-text test.

In `docs/superpowers/plans/2026-08-11-core-workspace-contract.md`, replace the stale `^[0-9]+\.[0-9]+\.[0-9]+$` expression with:

```text
^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$
```

This reconciles the historical plan with its `SemVer` requirement and the already reviewed leading-zero regression; do not weaken the implementation.

- [ ] **Step 9: Run complete verification, inspect scope, and commit**

Run fresh:

```bash
bash -n scripts/verify-template tests/verify-template.test.sh
bash tests/verify-template.test.sh
./scripts/verify-template
git diff --check
git status --short --branch
```

Also confirm:

```bash
git check-attr text eol -- scripts/verify-template tests/verify-template.test.sh
git ls-files -s scripts/verify-template tests/verify-template.test.sh
```

Expected: syntax exits `0`; exactly `54` tests print `ok` with no `not ok`; direct verification prints `Core Workspace contract verified`; diff checks are empty; both shell files retain `text=set`, `eol=lf`, and mode `100755`; only the verifier, public suite, two documentation fixes, and this remediation plan are in scope.

Commit:

```bash
git add docs/superpowers/plans/2026-08-11-core-workspace-review-remediation.md docs/superpowers/plans/2026-08-11-core-workspace-contract.md docs/agents/triage-labels.md scripts/verify-template tests/verify-template.test.sh
git commit -m "fix: enforce complete core workspace contract"
```

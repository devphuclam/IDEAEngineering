# Core Workspace Residual Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the three load-bearing review findings left after commit `2b9f4b9` without expanding the Core Workspace public surface.

**Architecture:** Keep `./scripts/verify-template` as the only public seam and strengthen its existing line-oriented parsers. YAML flow mappings are split at top-level commas with quote and nesting awareness, Markdown angle-bracket destinations are separated from optional titles, and local documentation links fail closed when their final target is a symbolic link because physical containment cannot be proven without another resolver dependency.

**Tech Stack:** Bash 4+, Git, and standard POSIX command-line utilities; no package manager, application SDK, cloud CLI, database, network access, `realpath`, or new dependency.

## Global Constraints

- The public command remains `./scripts/verify-template`; no second verifier or public lifecycle command may be added.
- A clean checkout must verify without Azure CLI, Azure credentials, application SDKs, databases, deployment configuration, package installation, or network access.
- Tests must invoke the public command as a process and assert its exit status and diagnostics; tests must not source the verifier or call internal helpers.
- Sensitive assignments accept only an empty value or `${UPPER_CASE_NAME}` after quote, whitespace, delimiter, and comment normalization; rejected values must never appear in diagnostics.
- YAML coverage in this hardening cycle is line-oriented: sequence mappings and one-line flow mappings must inspect every top-level member while respecting quoted commas and nested flow values.
- Local Markdown destinations must remain repository-relative after lexical normalization and physical checks. Symbolic-link targets are rejected, including links that happen to point back inside the repository, so containment stays deterministic without `realpath` or `readlink`.
- Technical repository documentation is written in English.
- Preserve LF checkout attributes and executable Git modes for `scripts/verify-template` and `tests/verify-template.test.sh`.
- Do not add Stack Profiles, Platform Adapters, Azure behavior, deployment behavior, fake lifecycle commands, or unrelated parser features.

---

### Task 1: Close residual YAML, Markdown, and containment gaps

**Files:**
- Modify: `tests/verify-template.test.sh`
- Modify: `scripts/verify-template`
- Modify: `docs/core-workspace.md`

**Interfaces:**
- Consumes: assignment-like lines in tracked `*.yaml` and `*.yml` files, inline Markdown link targets in tracked `*.md` files, and the existing `--root PATH` fixture seam.
- Produces: the unchanged `./scripts/verify-template [--root PATH]` command, `SECRET_LITERAL` for unsafe sensitive assignments, and `DOC_REFERENCE` for missing, escaping, or symbolic-link documentation targets.

- [ ] **Step 1: Add a failing regression for a sensitive key after an ordinary YAML flow member**

Add this public-command test beside the existing YAML tests and register it in the invocation list:

```bash
test_yaml_flow_mapping_checks_every_top_level_member() {
  make_fixture
  literal_prefix='literal-'
  literal_suffix='credential-value'
  printf '%s%s%s\n' '{name: service, API_TOKEN: ' "$literal_prefix$literal_suffix" '}' > "$fixture/config/service.yaml"
  git -C "$fixture" add config/service.yaml >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" != *"$literal_prefix$literal_suffix"* ]]; then
    printf '%s\n' 'ok - checks every top-level member in YAML flow mappings'
  else
    printf '%s\n' 'not ok - checks every top-level member in YAML flow mappings'
    failures=$((failures + 1))
  fi
}
```

- [ ] **Step 2: Run the suite and confirm the YAML later-member test is RED**

Run:

```bash
bash tests/verify-template.test.sh
```

Expected: exit `1` with `not ok - checks every top-level member in YAML flow mappings`; all pre-existing cases remain `ok`. This proves the current one-match YAML branch stops after `name: service`.

- [ ] **Step 3: Add a failing positive regression for a quoted placeholder at the end of a flow mapping**

Add and register this separate behavior test:

```bash
test_yaml_flow_mapping_accepts_quoted_placeholder() {
  make_fixture
  printf '%s\n' '{API_TOKEN: "${API_TOKEN}"} # supplied at runtime' > "$fixture/config/service.yaml"
  git -C "$fixture" add config/service.yaml >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" != *"SECRET_LITERAL"* ]]; then
    printf '%s\n' 'ok - accepts quoted placeholders in YAML flow mappings'
  else
    printf '%s\n' 'not ok - accepts quoted placeholders in YAML flow mappings'
    failures=$((failures + 1))
  fi
}
```

Run the suite again. Expected: the new test exits through the harness as RED because the current value normalization retains the flow-map closing brace.

- [ ] **Step 4: Parse every top-level YAML flow member and return both YAML tests to GREEN**

Replace the one-shot YAML prefix stripping with two private functions:

```bash
validate_yaml_assignment_segment() {
  local segment=$1
  local assignment_path=$2
  local assignment_line_number=$3
  local assignment_key
  local assignment_value

  segment=${segment#"${segment%%[![:space:]]*}"}
  segment=${segment%"${segment##*[![:space:]]}"}
  if [[ "$segment" =~ $assignment_pattern ]]; then
    assignment_key=${BASH_REMATCH[1]}
    assignment_value=${BASH_REMATCH[2]}
    validate_sensitive_assignment "$assignment_key" "$assignment_value" "$assignment_path" "$assignment_line_number"
  fi
}
```

Add `validate_yaml_assignment_line LINE PATH LINE_NUMBER` with this exact behavior:

1. Remove one leading YAML sequence marker matching `^[[:space:]]*-[[:space:]]+`, then trim outer whitespace.
2. For a line beginning with `{`, call the existing quote-aware `strip_inline_comment`, trim the result, remove one outer `{...}` pair, and scan the remaining characters from left to right.
3. Track the active single or double quote, backslash escapes inside double quotes, and nested `{...}` or `[...]` depth. Split only on commas encountered outside quotes at nesting depth zero.
4. Pass every resulting segment, including the final segment, to `validate_yaml_assignment_segment`.
5. For non-flow YAML, pass the trimmed line to `validate_yaml_assignment_segment` once.

Call this function from the tracked-file loop for `*.yaml` and `*.yml`, then `continue` so the generic one-shot matcher does not duplicate validation. Do not weaken the existing dotenv, JSON, TOML, binary-file, comment, empty-value, or redaction behavior.

Run:

```bash
bash tests/verify-template.test.sh
```

Expected: both new YAML tests and all pre-existing tests print `ok` and the suite exits `0`.

- [ ] **Step 5: Add a failing regression for an angle-bracket Markdown destination with a title**

Add this test beside the existing title test and register it:

```bash
test_angle_bracket_markdown_reference_with_title() {
  make_fixture
  printf '%s\n' '# Guide' > "$fixture/guide.md"
  printf '%s\n' '[Guide](<guide.md> "Guide title")' >> "$fixture/README.md"
  git -C "$fixture" add README.md guide.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" != *"DOC_REFERENCE"* ]]; then
    printf '%s\n' 'ok - accepts angle-bracket Markdown destinations with optional titles'
  else
    printf '%s\n' 'not ok - accepts angle-bracket Markdown destinations with optional titles'
    failures=$((failures + 1))
  fi
}
```

Run the suite. Expected: RED because the current whole-string `\<*\>` condition falls through when title text follows `>` and retains angle brackets in the filesystem path.

- [ ] **Step 6: Extract the angle-bracket destination independently of its title**

In the Markdown destination branch, replace the whole-string angle-bracket condition with a prefix match that requires `>` to be followed by whitespace or end of target:

```bash
if [[ "$markdown_target" =~ ^\<([^\>]*)\>([[:space:]]|$) ]]; then
  markdown_destination=${BASH_REMATCH[1]}
elif [[ "$markdown_target" =~ ^([^[:space:]]+) ]]; then
  markdown_destination=${BASH_REMATCH[1]}
else
  continue
fi
```

Run the suite. Expected: the new angle-bracket-title test and the existing bare-title, balanced-parenthesis, escaped-parenthesis, missing-target, inline-code, and fenced-code cases all print `ok`.

- [ ] **Step 7: Add a failing public regression for a final-file symlink that points outside the repository root**

Add and register this test near the existing root-escape test:

```bash
test_symlinked_file_reference_outside_root_is_rejected() {
  make_fixture
  outside_directory=$(mktemp -d)
  outside_path="$outside_directory/outside-guide.md"
  printf '%s\n' '# Outside fixture' > "$outside_path"
  if ! MSYS=winsymlinks:sys ln -s "$outside_path" "$fixture/outside-link.md" 2>/dev/null; then
    rm -rf "$fixture" "$outside_directory"
    printf '%s\n' 'not ok - rejects symlinked file references outside the fixture root'
    failures=$((failures + 1))
    return
  fi
  printf '%s\n' '[Outside root](outside-link.md)' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture" "$outside_directory"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *"README.md"* ]] && [[ "$output" == *"outside-link.md"* ]]; then
    printf '%s\n' 'ok - rejects symlinked file references outside the fixture root'
  else
    printf '%s\n' 'not ok - rejects symlinked file references outside the fixture root'
    failures=$((failures + 1))
  fi
}
```

`MSYS=winsymlinks:sys` makes Git Bash create its supported system-file symlink representation on Windows and is harmless for Unix `ln`; the test still exercises the public command against a real `test -L` target.

Run the suite. Expected: RED because the current verifier canonicalizes only the containing directory for regular files, so an existing final-file symlink bypasses physical containment.

- [ ] **Step 8: Reject symbolic-link Markdown targets with an actionable diagnostic**

Immediately after the existing `-e` check and before parent-directory canonicalization, add:

```bash
if [ -L "$markdown_resolved_path" ]; then
  printf 'ERROR [DOC_REFERENCE] %s references a symbolic link; use a non-symlink local path within the repository: %s\n' "$tracked_path" "$markdown_destination" >&2
  violations=$((violations + 1))
  continue
fi
```

This deliberately rejects both external and internal symlink targets. It closes the physical-containment gap without adding `realpath`, `readlink`, Python, or another resolver.

Run the suite. Expected: the symlink regression and all prior lexical traversal, directory containment, and no-`realpath` tests print `ok`.

- [ ] **Step 9: Document deterministic reference containment**

Append this section to `docs/core-workspace.md`:

```markdown
## Documentation reference safety

Tracked local Markdown links must resolve to non-symbolic-link files or directories inside the repository. The Core verifier rejects symbolic-link targets, even when a link points back inside the repository, so physical containment remains deterministic without an external path-resolution dependency.
```

- [ ] **Step 10: Run complete verification, inspect scope, and commit**

Run fresh:

```bash
bash -n scripts/verify-template tests/verify-template.test.sh
bash tests/verify-template.test.sh
./scripts/verify-template
git diff --check
git status --short --branch
```

Expected: syntax exits `0`; the expanded public suite has exactly `42` `ok` lines and no `not ok` lines; direct verification prints `Core Workspace contract verified`; the diff check is empty; only the plan, verifier, public test suite, and Core contract documentation are in this hardening cycle.

Commit:

```bash
git add docs/superpowers/plans/2026-08-11-core-workspace-residual-hardening.md scripts/verify-template tests/verify-template.test.sh docs/core-workspace.md
git commit -m "fix: harden core workspace verification"
```

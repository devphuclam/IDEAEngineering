#!/usr/bin/env bash

set -u

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
failures=0

make_fixture() {
  fixture=$(mktemp -d)
  mkdir -p "$fixture/docs/agents" "$fixture/docs/platform-adapters" "$fixture/config" "$fixture/.devcontainer" "$fixture/.github/workflows" "$fixture/scripts" "$fixture/tests" "$fixture/.agents/skills/implement" "$fixture/.agents/skills/tdd" "$fixture/.agents/skills/code-review" "$fixture/.agents/skills/writing-for-agents" "$fixture/.agents/skills/research" "$fixture/.agents/skills/wizard" "$fixture/.agents/skills/resolving-merge-conflicts" "$fixture/.specify/integrations" "$fixture/.specify/memory" "$fixture/.specify/scripts/powershell" "$fixture/.specify/templates" "$fixture/.specify/workflows/speckit" "$fixture/.agents/skills/speckit-analyze" "$fixture/.agents/skills/speckit-checklist" "$fixture/.agents/skills/speckit-clarify" "$fixture/.agents/skills/speckit-constitution" "$fixture/.agents/skills/speckit-converge" "$fixture/.agents/skills/speckit-implement" "$fixture/.agents/skills/speckit-plan" "$fixture/.agents/skills/speckit-specify" "$fixture/.agents/skills/speckit-tasks" "$fixture/.agents/skills/speckit-taskstoissues"
  git -C "$fixture" init --quiet
  printf '%s\n' \
    '# Development Workspace Template' \
    'Run `./scripts/verify-template`.' \
    '[Context](CONTEXT.md)' \
    '[Agent guidance](AGENTS.md)' \
    '[Core contract](docs/core-workspace.md)' \
    '[Example configuration](config/template.env.example)' \
    '[Template provenance](.template-provenance)' \
    '[Azure-ready Platform Adapter](docs/platform-adapters/azure.md)' \
    '[Azure adapter example](config/azure-adapter.env.example)' \
    '[Generated Project onboarding](docs/generated-projects.md)' \
    '[Spec Kit workflow](docs/agents/spec-kit.md)' \
    '[Docker Desktop + WSL2 recovery](scripts/docker-wsl-recovery.sh)' > "$fixture/README.md"
  printf '%s\n' \
    '# Agent guidance' \
    'Use the provider-neutral collaboration workflow in docs/agents/collaboration.md.' \
    'Use the project-local skill catalog in docs/agents/local-skills.md.' > "$fixture/AGENTS.md"
  printf '%s\n' '# Context' > "$fixture/CONTEXT.md"
  printf '%s\n' \
    '# Spec Kit and Matt Pocock Workflow' \
    'This repository includes GitHub Spec Kit with Codex skills.' \
    'Use $speckit-specify for feature specifications and $implement for ticket-driven work.' \
    'Matt Pocock skills provide domain and engineering quality.' > "$fixture/docs/agents/spec-kit.md"
  printf '%s\n' \
    '# Core Workspace' \
    'Core owns collaboration rules, agent guidance, security defaults, documentation conventions, and verification.' \
    'Stack Profiles optionally provide real setup, lint, test, and build behavior.' \
    'Platform Adapters optionally provide deploy integration.' \
    'V1 supplies only verification and provides no no-op shims.' \
    'Azure is optional.' \
    'The current Template Release uses release metadata.' > "$fixture/docs/core-workspace.md"
  printf '%s\n' '[Development environment](docs/development-environment.md)' >> "$fixture/README.md"
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
    'Use the Docker Desktop + WSL2 recovery wizard when integration stops.' \
    'The same Dev Container runs in GitHub Codespaces.' \
    'Use WSL2 without a container when company policy prohibits containers.' \
    'Native Windows parity is not promised.' \
    'Shared customization belongs in the template; personal themes, keymaps, dotfiles, and editor preferences stay outside it.' \
    'The Core Workspace has no application setup, lint, test, build, or deploy command until a Stack Profile or Platform Adapter supplies real behavior.' > "$fixture/docs/development-environment.md"
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'set -u' \
    'TOTAL_STAGES=5' \
    'check_integration() { :; }' \
    '# Inspect backend.sock before running docker info.' \
    '# Factory Reset is intentionally never automatic.' > "$fixture/scripts/docker-wsl-recovery.sh"
  printf '%s\n' 'PROJECT_NAME=example-project' 'EXAMPLE_API_TOKEN=${EXAMPLE_API_TOKEN}' > "$fixture/config/template.env.example"
  printf '%s\n' \
    'AZURE_DEVOPS_ORGANIZATION=${AZURE_DEVOPS_ORGANIZATION}' \
    'AZURE_DEVOPS_PROJECT=${AZURE_DEVOPS_PROJECT}' \
    'AZURE_APPROVED_SOURCE_HOST=${AZURE_APPROVED_SOURCE_HOST}' \
    'AZURE_ENTRA_TENANT_ID=${AZURE_ENTRA_TENANT_ID}' \
    'AZURE_SUBSCRIPTION_ID=${AZURE_SUBSCRIPTION_ID}' \
    'AZURE_CI_IDENTITY=${AZURE_CI_IDENTITY}' \
    'AZURE_RUNTIME_IDENTITY=${AZURE_RUNTIME_IDENTITY}' \
    'AZURE_SECRET_STORE_URI=${AZURE_SECRET_STORE_URI}' > "$fixture/config/azure-adapter.env.example"
  printf '%s\n' '0.1.0' > "$fixture/.template-version"
  printf '%s\n' 'template_name=Development Workspace Template' 'template_release=0.1.0' > "$fixture/.template-provenance"
  mkdir -p "$fixture/docs/releases"
  printf '%s\n' \
    '# Template Release 0.1.0' \
    'This release contains the stack-neutral Core Workspace, portable Dev Container, and provider-neutral Agent workflow.' \
    'Generated Projects are independently owned after creation; there is no automatic synchronization.' \
    'Adopt this release intentionally through the migration guidance.' \
    'The Core remains usable without an application Stack Profile or Platform Adapter.' > "$fixture/docs/releases/0.1.0.md"
  printf '%s\n' \
    '# Template Release Migration' \
    'A Generated Project is independently owned after creation and retains origin.' \
    'Please review a release diff and migration notes before changing project-owned files.' \
    'Update template provenance intentionally; there is no silent synchronization and no forced synchronization.' \
    'Keep application Stack Profile and Platform Adapter changes separate from Core adoption.' > "$fixture/docs/template-migrations.md"
  printf '%s\n' '[Template releases](docs/releases/)' '[Migration guidance](docs/template-migrations.md)' >> "$fixture/README.md"
  printf '%s\n' \
    '# Azure-ready Platform Adapter' \
    '## Independent adapter concerns' \
    'Azure Repos and work tracking, Azure Pipelines, and Azure infrastructure are independent adapter concerns.' \
    'Before adoption, obtain the Azure DevOps Organization, Microsoft Entra tenant, approved source host, subscription scope, CI policy, role boundaries, network restrictions, and responsible administrators from the company.' \
    'Use named developer identities, federated pipeline identities, and managed runtime identities with an approved secret store.' \
    'This adapter does not provision resources, does not delete resources, and does not mutate resources. It performs no live check; Azure CLI and credentials are optional; pipelines are optional.' > "$fixture/docs/platform-adapters/azure.md"
  printf '%s\n' \
    '# Agent Collaboration Workflow' \
    'This provider-neutral workflow uses Work Item, branch, worktree, pull request, and handoff.' \
    'Do not allow concurrent Agent work in one branch.' \
    'Every change has one human review intent; minimum_human_approvals: 0 permits the author to satisfy the review intent where the platform supports it.' \
    'Provider-specific tracker operations belong in the selected adapter documentation.' > "$fixture/docs/agents/collaboration.md"
  printf '%s\n' \
    '# Project-local Agent Skills' \
    'These pinned project-local skills work when an optional global plugin is absent.' \
    '- [implement](../../.agents/skills/implement/SKILL.md)' \
    '- [tdd](../../.agents/skills/tdd/SKILL.md)' \
    '- [code-review](../../.agents/skills/code-review/SKILL.md)' \
    '- [writing-for-agents](../../.agents/skills/writing-for-agents/SKILL.md)' > "$fixture/docs/agents/local-skills.md"
  printf '%s\n' \
    'schema_version: 1' \
    'skills:' \
    '  - name: implement' \
    '    path: .agents/skills/implement/SKILL.md' \
    '  - name: tdd' \
    '    path: .agents/skills/tdd/SKILL.md' \
    '  - name: code-review' \
    '    path: .agents/skills/code-review/SKILL.md' \
    '  - name: writing-for-agents' \
    '    path: .agents/skills/writing-for-agents/SKILL.md' \
    '  - name: research' \
    '    path: .agents/skills/research/SKILL.md' \
    '  - name: wizard' \
    '    path: .agents/skills/wizard/SKILL.md' \
    '  - name: resolving-merge-conflicts' \
    '    path: .agents/skills/resolving-merge-conflicts/SKILL.md' \
    '  - name: speckit-analyze' \
    '    path: .agents/skills/speckit-analyze/SKILL.md' \
    '  - name: speckit-checklist' \
    '    path: .agents/skills/speckit-checklist/SKILL.md' \
    '  - name: speckit-clarify' \
    '    path: .agents/skills/speckit-clarify/SKILL.md' \
    '  - name: speckit-constitution' \
    '    path: .agents/skills/speckit-constitution/SKILL.md' \
    '  - name: speckit-converge' \
    '    path: .agents/skills/speckit-converge/SKILL.md' \
    '  - name: speckit-implement' \
    '    path: .agents/skills/speckit-implement/SKILL.md' \
    '  - name: speckit-plan' \
    '    path: .agents/skills/speckit-plan/SKILL.md' \
    '  - name: speckit-specify' \
    '    path: .agents/skills/speckit-specify/SKILL.md' \
    '  - name: speckit-tasks' \
    '    path: .agents/skills/speckit-tasks/SKILL.md' \
    '  - name: speckit-taskstoissues' \
    '    path: .agents/skills/speckit-taskstoissues/SKILL.md' > "$fixture/.agents/skills/manifest.yml"
  printf '%s\n' '# implement' > "$fixture/.agents/skills/implement/SKILL.md"
  printf '%s\n' '# tdd' > "$fixture/.agents/skills/tdd/SKILL.md"
  printf '%s\n' '# code review' > "$fixture/.agents/skills/code-review/SKILL.md"
  printf '%s\n' '# writing for agents' > "$fixture/.agents/skills/writing-for-agents/SKILL.md"
  printf '%s\n' '# research' > "$fixture/.agents/skills/research/SKILL.md"
  printf '%s\n' '# wizard' > "$fixture/.agents/skills/wizard/SKILL.md"
  printf '%s\n' '# resolving merge conflicts' > "$fixture/.agents/skills/resolving-merge-conflicts/SKILL.md"
  for skill in analyze checklist clarify constitution converge implement plan specify tasks taskstoissues; do
    printf '%s\n' "# speckit-$skill" > "$fixture/.agents/skills/speckit-$skill/SKILL.md"
  done
  printf '%s\n' 'feature.json' 'extensions/*/local-config.yml' > "$fixture/.specify/.gitignore"
  printf '%s\n' '{ "integration": "codex", "ai_skills": true, "script": "ps" }' > "$fixture/.specify/init-options.json"
  printf '%s\n' '{ "integration": "codex", "default_integration": "codex", "integration_settings": { "codex": { "skills": true } } }' > "$fixture/.specify/integration.json"
  printf '%s\n' '{ "integration": "codex", "files": { ".agents/skills/speckit-specify/SKILL.md": "fixture" } }' > "$fixture/.specify/integrations/codex.manifest.json"
  printf '%s\n' '{ "integration": "speckit", "files": { ".specify/templates/spec-template.md": "fixture" } }' > "$fixture/.specify/integrations/speckit.manifest.json"
  printf '%s\n' '{ "sha256": "fixture", "source": "core" }' > "$fixture/.specify/memory/.constitution-template.json"
  printf '%s\n' '# Constitution' > "$fixture/.specify/memory/constitution.md"
  for file in check-prerequisites.ps1 common.ps1 create-new-feature.ps1 setup-plan.ps1 setup-tasks.ps1; do
    printf '%s\n' "# $file" > "$fixture/.specify/scripts/powershell/$file"
  done
  printf '%s\n' '# resolve-template.ps1' > "$fixture/.specify/scripts/powershell/resolve-template.ps1"
  for file in checklist-template.md constitution-template.md plan-template.md spec-template.md tasks-template.md; do
    printf '%s\n' "# $file" > "$fixture/.specify/templates/$file"
  done
  printf '%s\n' '# workflow' > "$fixture/.specify/workflows/speckit/workflow.yml"
  printf '%s\n' '{"workflows":[]}' > "$fixture/.specify/workflows/workflow-registry.json"
  printf '%s\n' \
    '# GitHub Platform Adapter: Work Items' \
    '## Author self-review checklist' \
    '- [ ] A human reviewer intent is recorded.' \
    'GitHub does not record author approval as an independent approval.' \
    'A future Azure Repos adapter can count the requester vote when configured.' > "$fixture/docs/agents/github-platform-adapter.md"
  printf '%s\n' \
    '# Pull Request Review Intent' \
    'Review intent' \
    '- [ ] I completed the author self-review checklist.' \
    '- [ ] A human review intent exists; minimum_human_approvals: 0.' \
    'This checklist is not an independent approval.' > "$fixture/.github/pull_request_template.md"
  printf '%s\n' \
    'name: Verify Template' \
    'on:' \
    '  push:' \
    '  pull_request:' \
    'permissions:' \
    '  contents: read' \
    'jobs:' \
    '  verify:' \
    '    steps:' \
    '      - run: ./scripts/verify-template' \
    '      - run: bash tests/generated-project-smoke.test.sh' > "$fixture/.github/workflows/verify-template.yml"
  printf '%s\n' \
    '# Generated Projects' \
    'Create a Generated Project from the GitHub Template Repository.' \
    'Run `./scripts/verify-template` and the development environment smoke test.' \
    'Generated Projects are independently owned; preserve `.template-provenance`.' \
    'Teams can intentionally extend the project with an application Stack Profile or Platform Adapter.' \
    'The baseline works without Azure.' > "$fixture/docs/generated-projects.md"
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'git archive HEAD | tar -x' \
    '.template-provenance' \
    './scripts/verify-template' \
    'tests/devcontainer-smoke.test.sh' > "$fixture/tests/generated-project-smoke.test.sh"
  git -C "$fixture" add . >/dev/null 2>&1
}

test_missing_required_artifact() {
  make_fixture
  rm "$fixture/CONTEXT.md"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"CORE_REQUIRED_FILE"* ]] && [[ "$output" == *"CONTEXT.md"* ]]; then
    printf '%s\n' 'ok - rejects a missing required Core Workspace artifact'
  else
    printf '%s\n' 'not ok - rejects a missing required Core Workspace artifact'
    failures=$((failures + 1))
  fi
}

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

test_requires_template_provenance() {
  make_fixture
  rm "$fixture/.template-provenance"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"RELEASE_PROVENANCE"* ]]; then
    printf '%s\n' 'ok - requires Template Release provenance metadata'
  else
    printf '%s\n' 'not ok - requires Template Release provenance metadata'
    failures=$((failures + 1))
  fi
}

test_rejects_missing_origin_release_documentation() {
  make_fixture
  printf '%s\n' 'template_name=Development Workspace Template' 'template_release=9.9.9' > "$fixture/.template-provenance"
  git -C "$fixture" add .template-provenance >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"RELEASE_PROVENANCE"* ]] && [[ "$output" == *"9.9.9"* ]]; then
    printf '%s\n' 'ok - rejects provenance whose origin release documentation is missing'
  else
    printf '%s\n' 'not ok - rejects provenance whose origin release documentation is missing'
    failures=$((failures + 1))
  fi
}

test_accepts_project_origin_older_than_current_release() {
  make_fixture
  printf '%s\n' '0.2.0' > "$fixture/.template-version"
  sed 's/0.1.0/0.2.0/g' "$fixture/docs/releases/0.1.0.md" > "$fixture/docs/releases/0.2.0.md"
  git -C "$fixture" add .template-version docs/releases/0.2.0.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" == *"Core Workspace contract verified"* ]]; then
    printf '%s\n' 'ok - accepts an older origin release for an independently updated Generated Project'
  else
    printf '%s\n' 'not ok - accepts an older origin release for an independently updated Generated Project'
    failures=$((failures + 1))
  fi
}

test_requires_release_and_migration_documentation() {
  make_fixture
  rm "$fixture/docs/releases/0.1.0.md"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"RELEASE_DOCUMENTATION"* ]]; then
    printf '%s\n' 'ok - requires release notes and migration guidance'
  else
    printf '%s\n' 'not ok - requires release notes and migration guidance'
    failures=$((failures + 1))
  fi
}

test_requires_azure_platform_adapter_contract() {
  make_fixture
  rm "$fixture/docs/platform-adapters/azure.md"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"AZURE_ADAPTER"* ]]; then
    printf '%s\n' 'ok - requires the Azure-ready Platform Adapter contract'
  else
    printf '%s\n' 'not ok - requires the Azure-ready Platform Adapter contract'
    failures=$((failures + 1))
  fi
}

test_rejects_real_azure_configuration_values() {
  make_fixture
  sed -i 's#AZURE_SUBSCRIPTION_ID=${AZURE_SUBSCRIPTION_ID}#AZURE_SUBSCRIPTION_ID=00000000-0000-0000-0000-000000000000#' "$fixture/config/azure-adapter.env.example"
  git -C "$fixture" add config/azure-adapter.env.example >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"AZURE_CONFIG"* ]] && [[ "$output" == *"AZURE_SUBSCRIPTION_ID"* ]]; then
    printf '%s\n' 'ok - rejects real-looking Azure configuration values'
  else
    printf '%s\n' 'not ok - rejects real-looking Azure configuration values'
    failures=$((failures + 1))
  fi
}

test_rejects_mandatory_azure_core_coupling() {
  make_fixture
  printf '%s\n' 'az account show is required before Core verification.' >> "$fixture/docs/core-workspace.md"
  git -C "$fixture" add docs/core-workspace.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"AZURE_COUPLING"* ]]; then
    printf '%s\n' 'ok - rejects mandatory Azure tooling in the Core Workspace'
  else
    printf '%s\n' 'not ok - rejects mandatory Azure tooling in the Core Workspace'
    failures=$((failures + 1))
  fi
}

test_rejects_broken_project_local_skill_path() {
  make_fixture
  sed -i 's#path: .agents/skills/tdd/SKILL.md#path: .agents/skills/missing/SKILL.md#' "$fixture/.agents/skills/manifest.yml"
  git -C "$fixture" add .agents/skills/manifest.yml >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"AGENT_SKILLS"* ]] && [[ "$output" == *"tdd"* ]]; then
    printf '%s\n' 'ok - rejects a broken project-local skill path'
  else
    printf '%s\n' 'not ok - rejects a broken project-local skill path'
    failures=$((failures + 1))
  fi
}

test_requires_public_template_ci_contract() {
  make_fixture
  rm "$fixture/.github/workflows/verify-template.yml"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"TEMPLATE_CI"* ]]; then
    printf '%s\n' 'ok - requires the public template CI contract'
  else
    printf '%s\n' 'not ok - requires the public template CI contract'
    failures=$((failures + 1))
  fi
}

test_rejects_ci_without_public_verifier() {
  make_fixture
  sed -i 's#./scripts/verify-template#true#' "$fixture/.github/workflows/verify-template.yml"
  git -C "$fixture" add .github/workflows/verify-template.yml >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"TEMPLATE_CI"* ]]; then
    printf '%s\n' 'ok - rejects CI that omits the public verifier'
  else
    printf '%s\n' 'not ok - rejects CI that omits the public verifier'
    failures=$((failures + 1))
  fi
}

test_requires_generated_project_onboarding_contract() {
  make_fixture
  rm "$fixture/docs/generated-projects.md"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"GENERATED_PROJECT"* ]]; then
    printf '%s\n' 'ok - requires Generated Project onboarding guidance'
  else
    printf '%s\n' 'not ok - requires Generated Project onboarding guidance'
    failures=$((failures + 1))
  fi
}

test_requires_generated_project_smoke_harness() {
  make_fixture
  rm "$fixture/tests/generated-project-smoke.test.sh"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"GENERATED_PROJECT"* ]]; then
    printf '%s\n' 'ok - requires the Generated Project smoke harness'
  else
    printf '%s\n' 'not ok - requires the Generated Project smoke harness'
    failures=$((failures + 1))
  fi
}

test_malformed_release_version() {
  make_fixture
  printf '%s\n' 'version-one' > "$fixture/.template-version"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"RELEASE_VERSION"* ]] && [[ "$output" == *".template-version"* ]]; then
    printf '%s\n' 'ok - rejects a malformed template release version'
  else
    printf '%s\n' 'not ok - rejects a malformed template release version'
    failures=$((failures + 1))
  fi
}

test_release_version_with_leading_zero() {
  make_fixture
  printf '%s\n' '01.2.3' > "$fixture/.template-version"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"RELEASE_VERSION"* ]] && [[ "$output" == *".template-version"* ]]; then
    printf '%s\n' 'ok - rejects leading zeros in template release versions'
  else
    printf '%s\n' 'not ok - rejects leading zeros in template release versions'
    failures=$((failures + 1))
  fi
}

test_malformed_example_configuration() {
  make_fixture
  printf '%s\n' 'lowercase-name=value' >> "$fixture/config/template.env.example"
  git -C "$fixture" add config/template.env.example >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"CONFIG_SYNTAX"* ]] && [[ "$output" == *"config/template.env.example"* ]] && [[ "$output" == *"line 3"* ]]; then
    printf '%s\n' 'ok - rejects malformed example configuration assignments'
  else
    printf '%s\n' 'not ok - rejects malformed example configuration assignments'
    failures=$((failures + 1))
  fi
}

test_duplicate_example_configuration_key() {
  make_fixture
  printf '%s\n' 'PROJECT_NAME=duplicate-project' >> "$fixture/config/template.env.example"
  git -C "$fixture" add config/template.env.example >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"CONFIG_SYNTAX"* ]] && [[ "$output" == *"PROJECT_NAME"* ]] && [[ "$output" == *"line 3"* ]]; then
    printf '%s\n' 'ok - rejects duplicate example configuration keys'
  else
    printf '%s\n' 'not ok - rejects duplicate example configuration keys'
    failures=$((failures + 1))
  fi
}

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

test_literal_sensitive_assignment() {
  make_fixture
  literal_prefix='literal-'
  literal_suffix='credential-value'
  printf '%s%s\n' 'EXAMPLE_API_TOKEN=' "$literal_prefix$literal_suffix" > "$fixture/config/template.env.example"
  git -C "$fixture" add config/template.env.example >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"EXAMPLE_API_TOKEN"* ]] && [[ "$output" == *"config/template.env.example"* ]]; then
    printf '%s\n' 'ok - rejects literal values for sensitive assignments'
  else
    printf '%s\n' 'not ok - rejects literal values for sensitive assignments'
    failures=$((failures + 1))
  fi
}

test_safe_sensitive_placeholder() {
  make_fixture
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ]; then
    printf '%s\n' 'ok - accepts uppercase environment references for sensitive assignments'
  else
    printf '%s\n' 'not ok - accepts uppercase environment references for sensitive assignments'
    failures=$((failures + 1))
  fi
}

test_token_coverage_metric_is_not_a_secret() {
  make_fixture
  printf '%s\n' '{"token_coverage":0.95}' > "$fixture/config/relevance.json"
  git -C "$fixture" add config/relevance.json >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" == *"Core Workspace contract verified"* ]]; then
    printf '%s\n' 'ok - accepts token_coverage as a non-secret quality metric'
  else
    printf '%s\n' 'not ok - accepts token_coverage as a non-secret quality metric'
    failures=$((failures + 1))
  fi
}

test_secret_environment_variable_name_is_safe() {
  make_fixture
  printf '%s\n' '{"authentication":{"patFallback":{"secretEnvironmentVariable":"AGENT_WORKSPACE_AZURE_PAT"}}}' > "$fixture/config/provider.json"
  mkdir -p "$fixture/tools/agent-workspace/src/config"
  printf '%s\n' 'export interface PatConfig { secretEnvironmentVariable: string; }' > "$fixture/tools/agent-workspace/src/config/provider.ts"
  git -C "$fixture" add config/provider.json >/dev/null 2>&1
  git -C "$fixture" add tools/agent-workspace/src/config/provider.ts >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" != *"SECRET_LITERAL"* ]]; then
    printf '%s\n' 'ok - accepts a safe environment-variable name in secretEnvironmentVariable'
  else
    printf '%s\n' 'not ok - accepts a safe environment-variable name in secretEnvironmentVariable'
    failures=$((failures + 1))
  fi
}

test_tracked_config_directory_sensitive_assignment_is_scanned() {
  make_fixture
  printf '%s\n' 'API_TOKEN=literal-config-token' > "$fixture/config/runtime"
  git -C "$fixture" add config/runtime >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" == *"config/runtime"* ]]; then
    printf '%s\n' 'ok - scans sensitive assignments in extensionless config files'
  else
    printf '%s\n' 'not ok - scans sensitive assignments in extensionless config files'
    failures=$((failures + 1))
  fi
}

test_source_config_sensitive_assignment_is_scanned() {
  make_fixture
  mkdir -p "$fixture/tools/agent-workspace/src/config"
  printf '%s\n' 'export const API_TOKEN = "literal-source-config-token";' > "$fixture/tools/agent-workspace/src/config/runtime.ts"
  git -C "$fixture" add tools/agent-workspace/src/config/runtime.ts >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" == *"tools/agent-workspace/src/config/runtime.ts"* ]]; then
    printf '%s\n' 'ok - scans sensitive assignments in source config files'
  else
    printf '%s\n' 'not ok - scans sensitive assignments in source config files'
    failures=$((failures + 1))
  fi
}

test_source_config_member_expression_literal_is_scanned() {
  make_fixture
  mkdir -p "$fixture/tools/agent-workspace/src/config"
  printf '%s\n' "const value = 'literal-member-secret';" 'export const config = { apiToken: value.secret };' > "$fixture/tools/agent-workspace/src/config/runtime.ts"
  git -C "$fixture" add tools/agent-workspace/src/config/runtime.ts >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* || "$output" == *"APITOKEN"* ]]; then
    printf '%s\n' 'ok - scans sensitive member expressions that resolve to source literals'
  else
    printf '%s\n' 'not ok - scans sensitive member expressions that resolve to source literals'
    failures=$((failures + 1))
  fi
}

test_source_config_unresolved_member_expression_is_scanned() {
  make_fixture
  mkdir -p "$fixture/tools/agent-workspace/src/config"
  printf '%s\n' 'export const config = { apiToken: runtimeConfig.token };' > "$fixture/tools/agent-workspace/src/config/runtime.ts"
  git -C "$fixture" add tools/agent-workspace/src/config/runtime.ts >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"APITOKEN"* ]]; then
    printf '%s\n' 'ok - fails closed on unresolved sensitive member expressions'
  else
    printf '%s\n' 'not ok - fails closed on unresolved sensitive member expressions'
    failures=$((failures + 1))
  fi
}

test_multiline_source_config_sensitive_assignment_is_scanned() {
  make_fixture
  mkdir -p "$fixture/tools/agent-workspace/src/config"
  printf '%s\n' 'export const API_TOKEN =' '  "literal-multiline-config-token";' > "$fixture/tools/agent-workspace/src/config/runtime.ts"
  git -C "$fixture" add tools/agent-workspace/src/config/runtime.ts >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" == *"tools/agent-workspace/src/config/runtime.ts"* ]]; then
    printf '%s\n' 'ok - scans multiline sensitive assignments in source config files'
  else
    printf '%s\n' 'not ok - scans multiline sensitive assignments in source config files'
    failures=$((failures + 1))
  fi
}

test_source_config_object_sensitive_assignment_is_scanned() {
  make_fixture
  mkdir -p "$fixture/tools/agent-workspace/src/config"
  printf '%s\n' 'export const runtime = { API_TOKEN: "literal-object-config-token" };' > "$fixture/tools/agent-workspace/src/config/runtime.ts"
  git -C "$fixture" add tools/agent-workspace/src/config/runtime.ts >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" == *"tools/agent-workspace/src/config/runtime.ts"* ]]; then
    printf '%s\n' 'ok - scans object-property sensitive assignments in source config files'
  else
    printf '%s\n' 'not ok - scans object-property sensitive assignments in source config files'
    failures=$((failures + 1))
  fi
}

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

test_empty_sensitive_assignments() {
  make_fixture
  printf '%s\n' 'API_TOKEN=' > "$fixture/config/runtime.env"
  printf '%s\n' 'CLIENT_SECRET: ""' > "$fixture/config/service.yaml"
  printf '%s\n' "PASSWORD = ''" > "$fixture/config/service.toml"
  printf '%s\n' '{"PRIVATE_KEY":""}' > "$fixture/config/service.json"
  git -C "$fixture" add config/runtime.env config/service.yaml config/service.toml config/service.json >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" != *"SECRET_LITERAL"* ]]; then
    printf '%s\n' 'ok - accepts empty sensitive assignments'
  else
    printf '%s\n' 'not ok - accepts empty sensitive assignments'
    failures=$((failures + 1))
  fi
}

test_dotenv_trailing_comma_is_rejected() {
  make_fixture
  printf '%s\n' 'API_TOKEN=,' > "$fixture/config/runtime.env"
  git -C "$fixture" add config/runtime.env >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" == *"config/runtime.env"* ]] && [[ "$output" != *"API_TOKEN=,"* ]]; then
    printf '%s\n' 'ok - rejects a trailing comma as a dotenv sensitive literal'
  else
    printf '%s\n' 'not ok - rejects a trailing comma as a dotenv sensitive literal'
    failures=$((failures + 1))
  fi
}

test_non_posix_grep_failure_cannot_skip_secret_scan() {
  make_fixture
  literal_prefix='literal-'
  literal_suffix='credential-value'
  printf '%s%s\n' 'API_TOKEN=' "$literal_prefix$literal_suffix" > "$fixture/config/runtime.env"
  git -C "$fixture" add config/runtime.env >/dev/null 2>&1
  shim_directory=$(mktemp -d)
  real_grep=$(command -v grep)
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'for argument in "$@"; do' \
    '  case "$argument" in' \
    '    -*I*) printf "%s\n" "forced grep -I failure" >&2; exit 2 ;;' \
    '  esac' \
    'done' \
    'exec "$VERIFY_TEMPLATE_REAL_GREP" "$@"' > "$shim_directory/grep"
  chmod +x "$shim_directory/grep"
  output=$(VERIFY_TEMPLATE_REAL_GREP="$real_grep" PATH="$shim_directory:$PATH" bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture" "$shim_directory"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" == *"config/runtime.env"* ]] && [[ "$output" != *"$literal_prefix$literal_suffix"* ]]; then
    printf '%s\n' 'ok - does not fail open when grep -I is unavailable'
  else
    printf '%s\n' 'not ok - does not fail open when grep -I is unavailable'
    failures=$((failures + 1))
  fi
}

test_binary_classifier_failure_is_rejected() {
  make_fixture
  printf '%s\n' 'PROJECT_NAME=example-project' > "$fixture/config/runtime.env"
  git -C "$fixture" add config/runtime.env >/dev/null 2>&1
  shim_directory=$(mktemp -d)
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'printf "%s\n" "forced binary-classifier failure" >&2' \
    'exit 2' > "$shim_directory/od"
  chmod +x "$shim_directory/od"
  output=$(PATH="$shim_directory:$PATH" bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture" "$shim_directory"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_SCAN_ACCESS"* ]] && [[ "$output" == *"config/runtime.env"* ]] && [[ "$output" == *"read or classify"* ]] && [[ "$output" != *"Core Workspace contract verified"* ]]; then
    printf '%s\n' 'ok - rejects binary-classifier operational failures'
  else
    printf '%s\n' 'not ok - rejects binary-classifier operational failures'
    failures=$((failures + 1))
  fi
}

test_binary_files_are_skipped() {
  make_fixture
  literal_prefix='literal-'
  literal_suffix='credential-value'
  printf 'API_TOKEN=%s\0binary\n' "$literal_prefix$literal_suffix" > "$fixture/config/binary.env"
  git -C "$fixture" add config/binary.env >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" != *"SECRET_LITERAL"* ]] && [[ "$output" != *"$literal_prefix$literal_suffix"* ]]; then
    printf '%s\n' 'ok - skips binary files during sensitive assignment scanning'
  else
    printf '%s\n' 'not ok - skips binary files during sensitive assignment scanning'
    failures=$((failures + 1))
  fi
}

test_exported_dotenv_sensitive_assignment() {
  make_fixture
  literal_prefix='literal-'
  literal_suffix='credential-value'
  printf '%s%s\n' 'export API_TOKEN=' "$literal_prefix$literal_suffix" > "$fixture/config/runtime.env"
  git -C "$fixture" add config/runtime.env >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" == *"config/runtime.env"* ]] && [[ "$output" != *"$literal_prefix$literal_suffix"* ]]; then
    printf '%s\n' 'ok - rejects literal values in exported dotenv assignments'
  else
    printf '%s\n' 'not ok - rejects literal values in exported dotenv assignments'
    failures=$((failures + 1))
  fi
}

test_single_quoted_toml_sensitive_assignment() {
  make_fixture
  literal_prefix='literal-'
  literal_suffix='credential-value'
  printf '%s%s%s\n' "'API_TOKEN' = '" "$literal_prefix$literal_suffix" "'" > "$fixture/config/service.toml"
  git -C "$fixture" add config/service.toml >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" == *"config/service.toml"* ]] && [[ "$output" != *"$literal_prefix$literal_suffix"* ]]; then
    printf '%s\n' 'ok - rejects literal values in single-quoted TOML assignments'
  else
    printf '%s\n' 'not ok - rejects literal values in single-quoted TOML assignments'
    failures=$((failures + 1))
  fi
}

test_compact_json_sensitive_assignment() {
  make_fixture
  literal_prefix='literal-'
  literal_suffix='credential-value'
  printf '%s%s%s\n' '{"API_TOKEN":"' "$literal_prefix$literal_suffix" '"}' > "$fixture/config/service.json"
  git -C "$fixture" add config/service.json >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" == *"config/service.json"* ]] && [[ "$output" != *"$literal_prefix$literal_suffix"* ]]; then
    printf '%s\n' 'ok - rejects literal values in compact JSON assignments'
  else
    printf '%s\n' 'not ok - rejects literal values in compact JSON assignments'
    failures=$((failures + 1))
  fi
}

test_pretty_printed_json_sensitive_assignment() {
  make_fixture
  literal_prefix='literal-'
  literal_suffix='credential-value'
  printf '%s\n' '{' > "$fixture/config/service.json"
  printf '  "API_TOKEN": "%s"\n' "$literal_prefix$literal_suffix" >> "$fixture/config/service.json"
  printf '%s\n' '}' >> "$fixture/config/service.json"
  git -C "$fixture" add config/service.json >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" == *"config/service.json"* ]] && [[ "$output" != *"$literal_prefix$literal_suffix"* ]]; then
    printf '%s\n' 'ok - rejects literal values in pretty-printed JSON assignments'
  else
    printf '%s\n' 'not ok - rejects literal values in pretty-printed JSON assignments'
    failures=$((failures + 1))
  fi
}

test_yaml_sequence_and_flow_sensitive_assignments() {
  make_fixture
  literal_prefix='literal-'
  literal_suffix='credential-value'
  printf '%s%s\n' '- API_TOKEN: ' "$literal_prefix$literal_suffix" > "$fixture/config/service.yaml"
  printf '%s%s%s\n' '- {CLIENT_SECRET: ' "$literal_prefix$literal_suffix" '}' >> "$fixture/config/service.yaml"
  git -C "$fixture" add config/service.yaml >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" == *"CLIENT_SECRET"* ]] && [[ "$output" != *"$literal_prefix$literal_suffix"* ]]; then
    printf '%s\n' 'ok - rejects literal values in YAML sequence and flow mappings'
  else
    printf '%s\n' 'not ok - rejects literal values in YAML sequence and flow mappings'
    failures=$((failures + 1))
  fi
}

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

test_quoted_sensitive_placeholders_with_inline_comments() {
  make_fixture
  printf '%s\n' 'API_TOKEN: "${API_TOKEN}" # supplied at runtime' > "$fixture/config/service.yaml"
  printf '%s\n' "CLIENT_SECRET = '\${CLIENT_SECRET}' # supplied at runtime" > "$fixture/config/service.toml"
  git -C "$fixture" add config/service.yaml config/service.toml >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" != *"SECRET_LITERAL"* ]]; then
    printf '%s\n' 'ok - accepts quoted sensitive placeholders with inline comments'
  else
    printf '%s\n' 'not ok - accepts quoted sensitive placeholders with inline comments'
    failures=$((failures + 1))
  fi
}

test_nested_compact_json_sensitive_assignment() {
  make_fixture
  literal_prefix='literal-'
  literal_suffix='credential-value'
  printf '%s%s%s\n' '{"auth":{"API_TOKEN":"' "$literal_prefix$literal_suffix" '"}}' > "$fixture/config/service.json"
  git -C "$fixture" add config/service.json >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" == *"config/service.json"* ]] && [[ "$output" != *"$literal_prefix$literal_suffix"* ]]; then
    printf '%s\n' 'ok - rejects literal values in nested compact JSON assignments'
  else
    printf '%s\n' 'not ok - rejects literal values in nested compact JSON assignments'
    failures=$((failures + 1))
  fi
}

test_compact_multi_member_json_sensitive_assignment() {
  make_fixture
  literal_prefix='literal-'
  literal_suffix='credential-value'
  printf '%s%s%s\n' '{"name":"service","API_TOKEN":"' "$literal_prefix$literal_suffix" '"}' > "$fixture/config/service.json"
  git -C "$fixture" add config/service.json >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SECRET_LITERAL"* ]] && [[ "$output" == *"API_TOKEN"* ]] && [[ "$output" != *"$literal_prefix$literal_suffix"* ]]; then
    printf '%s\n' 'ok - rejects literal values in compact multi-member JSON assignments'
  else
    printf '%s\n' 'not ok - rejects literal values in compact multi-member JSON assignments'
    failures=$((failures + 1))
  fi
}

test_requires_agent_collaboration_contract() {
  make_fixture
  rm "$fixture/docs/agents/collaboration.md"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"AGENT_COLLABORATION"* ]]; then
    printf '%s\n' 'ok - requires the provider-neutral Agent collaboration contract'
  else
    printf '%s\n' 'not ok - requires the provider-neutral Agent collaboration contract'
    failures=$((failures + 1))
  fi
}

test_rejects_provider_commands_in_core_collaboration() {
  make_fixture
  printf '%s\n' 'Run gh issue commands directly from this provider-neutral workflow.' >> "$fixture/docs/agents/collaboration.md"
  git -C "$fixture" add docs/agents/collaboration.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"AGENT_COLLABORATION"* ]]; then
    printf '%s\n' 'ok - rejects provider-specific commands in Core collaboration guidance'
  else
    printf '%s\n' 'not ok - rejects provider-specific commands in Core collaboration guidance'
    failures=$((failures + 1))
  fi
}

test_requires_project_local_skill_manifest() {
  make_fixture
  rm "$fixture/.agents/skills/code-review/SKILL.md"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"AGENT_SKILLS"* ]]; then
    printf '%s\n' 'ok - requires every pinned project-local workflow skill'
  else
    printf '%s\n' 'not ok - requires every pinned project-local workflow skill'
    failures=$((failures + 1))
  fi
}

test_requires_spec_kit_contract() {
  make_fixture
  rm "$fixture/docs/agents/spec-kit.md"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"SPEC_KIT"* ]]; then
    printf '%s\n' 'ok - requires the project-local Spec Kit contract'
  else
    printf '%s\n' 'not ok - requires the project-local Spec Kit contract'
    failures=$((failures + 1))
  fi
}

test_requires_author_self_review_adapter_contract() {
  make_fixture
  printf '%s\n' '# GitHub adapter' > "$fixture/docs/agents/github-platform-adapter.md"
  git -C "$fixture" add docs/agents/github-platform-adapter.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"AGENT_REVIEW"* ]]; then
    printf '%s\n' 'ok - requires the adapter author self-review contract'
  else
    printf '%s\n' 'not ok - requires the adapter author self-review contract'
    failures=$((failures + 1))
  fi
}

test_git_enumeration_failure_is_rejected() {
  make_fixture
  rm -rf "$fixture/.git"
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"REPOSITORY_ACCESS"* ]] && [[ "$output" != *"Core Workspace contract verified"* ]]; then
    printf '%s\n' 'ok - fails closed when tracked-file enumeration is unavailable'
  else
    printf '%s\n' 'not ok - fails closed when tracked-file enumeration is unavailable'
    failures=$((failures + 1))
  fi
}

test_mounted_repository_safe_directory_is_allowed() {
  make_fixture
  shim_directory=$(mktemp -d)
  real_git=$(command -v git)
  printf '%s\n' \
    '#!/usr/bin/env bash' \
    'safe_directory=0' \
    'for argument in "$@"; do' \
    '  case "$argument" in' \
    '    safe.directory=*) safe_directory=1 ;;' \
    '  esac' \
    'done' \
    'if [ "$safe_directory" -ne 1 ]; then' \
    '  printf "%s\\n" "simulated dubious ownership" >&2' \
    '  exit 128' \
    'fi' \
    'exec "$VERIFY_TEMPLATE_REAL_GIT" "$@"' > "$shim_directory/git"
  chmod +x "$shim_directory/git"
  output=$(VERIFY_TEMPLATE_REAL_GIT="$real_git" PATH="$shim_directory:$PATH" bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture" "$shim_directory"

  if [ "$status" -eq 0 ] && [[ "$output" == *"Core Workspace contract verified"* ]]; then
    printf '%s\n' 'ok - allows mounted repositories with explicit Git safe-directory configuration'
  else
    printf '%s\n' 'not ok - allows mounted repositories with explicit Git safe-directory configuration'
    failures=$((failures + 1))
  fi
}

test_broken_markdown_reference() {
  make_fixture
  printf '%s\n' '[Missing guide](missing-guide.md)' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *"README.md"* ]] && [[ "$output" == *"missing-guide.md"* ]]; then
    printf '%s\n' 'ok - rejects broken local Markdown references'
  else
    printf '%s\n' 'not ok - rejects broken local Markdown references'
    failures=$((failures + 1))
  fi
}

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

test_markdown_label_with_escaped_closing_bracket() {
  make_fixture
  printf '%s\n' '[A \] label](missing-escaped.md)' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *"README.md"* ]] && [[ "$output" == *"missing-escaped.md"* ]]; then
    printf '%s\n' 'ok - checks Markdown links with escaped closing brackets in labels'
  else
    printf '%s\n' 'not ok - checks Markdown links with escaped closing brackets in labels'
    failures=$((failures + 1))
  fi
}

test_markdown_label_with_nested_brackets() {
  make_fixture
  printf '%s\n' '[A [nested] label](missing-nested.md)' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *"README.md"* ]] && [[ "$output" == *"missing-nested.md"* ]]; then
    printf '%s\n' 'ok - checks Markdown links with nested brackets in labels'
  else
    printf '%s\n' 'not ok - checks Markdown links with nested brackets in labels'
    failures=$((failures + 1))
  fi
}

test_markdown_reference_with_title() {
  make_fixture
  printf '%s\n' '# Guide' > "$fixture/guide.md"
  printf '%s\n' '[Guide](guide.md "Guide title")' >> "$fixture/README.md"
  git -C "$fixture" add README.md guide.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" != *"DOC_REFERENCE"* ]]; then
    printf '%s\n' 'ok - accepts Markdown destinations with optional titles'
  else
    printf '%s\n' 'not ok - accepts Markdown destinations with optional titles'
    failures=$((failures + 1))
  fi
}

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

test_markdown_references_with_parentheses() {
  make_fixture
  printf '%s\n' '# Draft guide' > "$fixture/guide(draft).md"
  printf '%s\n' '# Final guide' > "$fixture/guide(final).md"
  printf '%s\n' '[Draft](guide(draft).md)' '[Final](guide\(final\).md)' >> "$fixture/README.md"
  git -C "$fixture" add README.md 'guide(draft).md' 'guide(final).md' >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" != *"DOC_REFERENCE"* ]]; then
    printf '%s\n' 'ok - accepts balanced and escaped parentheses in Markdown destinations'
  else
    printf '%s\n' 'not ok - accepts balanced and escaped parentheses in Markdown destinations'
    failures=$((failures + 1))
  fi
}

test_missing_parenthesized_markdown_destination() {
  make_fixture
  printf '%s\n' '[Missing](missing_(guide).md "Missing guide")' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *"missing_(guide).md"* ]] && [[ "$output" != *"Missing guide"* ]]; then
    printf '%s\n' 'ok - rejects a missing parenthesized Markdown destination without treating its title as path'
  else
    printf '%s\n' 'not ok - rejects a missing parenthesized Markdown destination without treating its title as path'
    failures=$((failures + 1))
  fi
}

test_inline_code_is_not_a_markdown_reference() {
  make_fixture
  printf '%s\n' 'Use `[Missing guide](missing-guide.md)` as an example.' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ]; then
    printf '%s\n' 'ok - ignores link-shaped text in inline code'
  else
    printf '%s\n' 'not ok - ignores link-shaped text in inline code'
    failures=$((failures + 1))
  fi
}

test_agent_skill_links_outside_fences_are_checked() {
  make_fixture
  mkdir -p "$fixture/.agents/skills/example"
  printf '%s\n' '[Missing skill guide](missing-skill-guide.md)' > "$fixture/.agents/skills/example/SKILL.md"
  printf '%s\n' '```markdown' '[Future project path](./src/future/CONTEXT.md)' '```' >> "$fixture/.agents/skills/example/SKILL.md"
  git -C "$fixture" add .agents/skills/example/SKILL.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *".agents/skills/example/SKILL.md"* ]] && [[ "$output" == *"missing-skill-guide.md"* ]] && [[ "$output" != *"./src/future/CONTEXT.md"* ]]; then
    printf '%s\n' 'ok - checks real links while ignoring fenced skill-template examples'
  else
    printf '%s\n' 'not ok - checks real links while ignoring fenced skill-template examples'
    failures=$((failures + 1))
  fi
}

test_escaped_backticks_do_not_hide_markdown_references() {
  make_fixture
  printf '%s\n' '\`[Missing guide](escaped-backtick.md)\`' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *"escaped-backtick.md"* ]]; then
    printf '%s\n' 'ok - checks references beside escaped backticks'
  else
    printf '%s\n' 'not ok - checks references beside escaped backticks'
    failures=$((failures + 1))
  fi
}

test_multi_backtick_and_fenced_code_are_not_references() {
  make_fixture
  printf '%s\n' '``[Missing guide](multi-backtick.md)``' '```markdown' '[Missing guide](fenced-example.md)' '```' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ]; then
    printf '%s\n' 'ok - ignores multi-backtick and fenced-code examples'
  else
    printf '%s\n' 'not ok - ignores multi-backtick and fenced-code examples'
    failures=$((failures + 1))
  fi
}

test_multiline_backtick_code_spans_are_not_references() {
  make_fixture
  printf '%s\n' '`Example starts' '[Missing guide](multiline-code.md)' 'and ends`' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ]; then
    printf '%s\n' 'ok - ignores link-shaped text in multiline code spans'
  else
    printf '%s\n' 'not ok - ignores link-shaped text in multiline code spans'
    failures=$((failures + 1))
  fi
}

test_multiline_code_span_removal_preserves_line_boundaries() {
  make_fixture
  printf '%s\n' '[Label]`example' 'continued`(missing.md)' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" != *"DOC_REFERENCE"* ]]; then
    printf '%s\n' 'ok - preserves line boundaries when removing multiline code spans'
  else
    printf '%s\n' 'not ok - preserves line boundaries when removing multiline code spans'
    failures=$((failures + 1))
  fi
}

test_inline_code_span_removal_preserves_adjacency() {
  make_fixture
  printf '%s\n' '[Label]`example`(missing-adjacent.md)' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" != *"DOC_REFERENCE"* ]]; then
    printf '%s\n' 'ok - preserves same-line adjacency when removing inline code spans'
  else
    printf '%s\n' 'not ok - preserves same-line adjacency when removing inline code spans'
    failures=$((failures + 1))
  fi
}

test_unmatched_backticks_do_not_hide_later_references() {
  make_fixture
  printf '%s\n' '`Unmatched code delimiter' '[Missing guide](after-unmatched-backtick.md)' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *"after-unmatched-backtick.md"* ]]; then
    printf '%s\n' 'ok - checks links after unmatched backtick runs'
  else
    printf '%s\n' 'not ok - checks links after unmatched backtick runs'
    failures=$((failures + 1))
  fi
}

test_fenced_backticks_do_not_close_unmatched_inline_delimiters() {
  make_fixture
  printf '%s\n' '`Unmatched code delimiter' '[Missing guide](before-fenced-backtick.md)' '```markdown' '`Backtick inside fenced code' '```' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *"before-fenced-backtick.md"* ]]; then
    printf '%s\n' 'ok - fenced backticks do not close unmatched inline delimiters'
  else
    printf '%s\n' 'not ok - fenced backticks do not close unmatched inline delimiters'
    failures=$((failures + 1))
  fi
}

test_four_space_indented_fence_like_text_does_not_open_a_fence() {
  make_fixture
  printf '%s\n' '    ```markdown' '[Missing guide](indented-fence.md)' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *"indented-fence.md"* ]]; then
    printf '%s\n' 'ok - checks links after four-space-indented fence-like text'
  else
    printf '%s\n' 'not ok - checks links after four-space-indented fence-like text'
    failures=$((failures + 1))
  fi
}

test_fence_like_lines_with_trailing_text_do_not_close_fences() {
  make_fixture
  printf '%s\n' '```markdown' '``` not a closer' '[Missing guide](still-fenced.md)' '```' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ]; then
    printf '%s\n' 'ok - keeps fences open after fence-like lines with text'
  else
    printf '%s\n' 'not ok - keeps fences open after fence-like lines with text'
    failures=$((failures + 1))
  fi
}

test_links_after_valid_fence_closers_are_checked() {
  make_fixture
  printf '%s\n' '```markdown' '[Placeholder](fenced-placeholder.md)' '```' '[Missing guide](after-fence.md)' >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *"after-fence.md"* ]] && [[ "$output" != *"fenced-placeholder.md"* ]]; then
    printf '%s\n' 'ok - checks links after valid fence closers'
  else
    printf '%s\n' 'not ok - checks links after valid fence closers'
    failures=$((failures + 1))
  fi
}

test_references_outside_the_root_are_rejected() {
  make_fixture
  outside_path="$(dirname "$fixture")/verify-template-outside-$RANDOM.md"
  printf '%s\n' '# Outside fixture' > "$outside_path"
  outside_target="../$(basename "$outside_path")"
  printf '[Outside root](%s)\n' "$outside_target" >> "$fixture/README.md"
  git -C "$fixture" add README.md >/dev/null 2>&1
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture" "$outside_path"

  if [ "$status" -ne 0 ] && [[ "$output" == *"DOC_REFERENCE"* ]] && [[ "$output" == *"README.md"* ]] && [[ "$output" == *"$outside_target"* ]]; then
    printf '%s\n' 'ok - rejects references that escape the fixture root'
  else
    printf '%s\n' 'not ok - rejects references that escape the fixture root'
    failures=$((failures + 1))
  fi
}

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

test_verification_does_not_require_realpath() {
  make_fixture
  printf '%s\n' '# Guide' > "$fixture/guide.md"
  printf '%s\n' '[Guide](guide.md)' >> "$fixture/README.md"
  git -C "$fixture" add README.md guide.md >/dev/null 2>&1
  shim_directory=$(mktemp -d)
  printf '%s\n' '#!/usr/bin/env bash' 'exit 127' > "$shim_directory/realpath"
  chmod +x "$shim_directory/realpath"
  output=$(PATH="$shim_directory:$PATH" bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture" "$shim_directory"

  if [ "$status" -eq 0 ] && [[ "$output" == *"Core Workspace contract verified"* ]]; then
    printf '%s\n' 'ok - verifies without a realpath command'
  else
    printf '%s\n' 'not ok - verifies without a realpath command'
    failures=$((failures + 1))
  fi
}

test_tracked_shell_scripts_use_lf_checkouts() {
  local output
  output=$(git -C "$repo_root" ls-files '*.sh' | while IFS= read -r path; do
    git -C "$repo_root" check-attr eol -- "$path"
  done)

  if [ -n "$output" ] && ! grep -vE ': eol: lf$' <<< "$output" | grep -q .; then
    printf '%s\n' 'ok - tracked shell scripts use LF checkouts'
  else
    printf '%s\n' 'not ok - tracked shell scripts use LF checkouts'
    failures=$((failures + 1))
  fi
}

test_complete_fixture_success() {
  make_fixture
  output=$(bash "$repo_root/scripts/verify-template" --root "$fixture" 2>&1)
  status=$?
  rm -rf "$fixture"

  if [ "$status" -eq 0 ] && [[ "$output" == *"Core Workspace contract verified"* ]]; then
    printf '%s\n' 'ok - verifies a complete Core Workspace fixture'
  else
    printf '%s\n' 'not ok - verifies a complete Core Workspace fixture'
    failures=$((failures + 1))
  fi
}

test_unknown_argument() {
  output=$(bash "$repo_root/scripts/verify-template" --unknown 2>&1)
  status=$?

  if [ "$status" -eq 2 ] && [[ "$output" == *"Usage:"* ]]; then
    printf '%s\n' 'ok - rejects unknown arguments with usage guidance'
  else
    printf '%s\n' 'not ok - rejects unknown arguments with usage guidance'
    failures=$((failures + 1))
  fi
}

test_missing_required_artifact
test_readme_requires_core_contract_content
test_core_document_requires_layer_semantics
test_requires_template_provenance
test_rejects_missing_origin_release_documentation
test_accepts_project_origin_older_than_current_release
test_requires_release_and_migration_documentation
test_requires_azure_platform_adapter_contract
test_rejects_real_azure_configuration_values
test_rejects_mandatory_azure_core_coupling
test_rejects_broken_project_local_skill_path
test_requires_public_template_ci_contract
test_rejects_ci_without_public_verifier
test_requires_generated_project_onboarding_contract
test_requires_generated_project_smoke_harness
test_requires_agent_collaboration_contract
test_rejects_provider_commands_in_core_collaboration
test_requires_project_local_skill_manifest
test_requires_spec_kit_contract
test_requires_author_self_review_adapter_contract
test_git_enumeration_failure_is_rejected
test_mounted_repository_safe_directory_is_allowed
test_malformed_release_version
test_release_version_with_leading_zero
test_malformed_example_configuration
test_duplicate_example_configuration_key
test_missing_required_example_configuration_key
test_unexpected_example_configuration_key
test_incorrect_required_example_configuration_value
test_literal_sensitive_assignment
test_safe_sensitive_placeholder
test_token_coverage_metric_is_not_a_secret
test_secret_environment_variable_name_is_safe
test_tracked_config_directory_sensitive_assignment_is_scanned
test_source_config_sensitive_assignment_is_scanned
test_source_config_member_expression_literal_is_scanned
test_source_config_unresolved_member_expression_is_scanned
test_multiline_source_config_sensitive_assignment_is_scanned
test_source_config_object_sensitive_assignment_is_scanned
test_requires_default_devcontainer
test_requires_pinned_official_devcontainer_image
test_requires_shared_post_create_verification
test_rejects_devcontainer_features
test_rejects_devcontainer_build_configuration
test_rejects_devcontainer_ports
test_requires_development_environment_onboarding
test_empty_sensitive_assignments
test_dotenv_trailing_comma_is_rejected
test_non_posix_grep_failure_cannot_skip_secret_scan
test_binary_classifier_failure_is_rejected
test_binary_files_are_skipped
test_exported_dotenv_sensitive_assignment
test_single_quoted_toml_sensitive_assignment
test_compact_json_sensitive_assignment
test_nested_compact_json_sensitive_assignment
test_compact_multi_member_json_sensitive_assignment
test_pretty_printed_json_sensitive_assignment
test_yaml_sequence_and_flow_sensitive_assignments
test_yaml_flow_mapping_checks_every_top_level_member
test_yaml_flow_mapping_accepts_quoted_placeholder
test_quoted_sensitive_placeholders_with_inline_comments
test_broken_markdown_reference
test_broken_reference_style_markdown_destination
test_valid_reference_style_markdown_destination
test_markdown_label_with_escaped_closing_bracket
test_markdown_label_with_nested_brackets
test_markdown_reference_with_title
test_angle_bracket_markdown_reference_with_title
test_markdown_references_with_parentheses
test_missing_parenthesized_markdown_destination
test_inline_code_is_not_a_markdown_reference
test_agent_skill_links_outside_fences_are_checked
test_escaped_backticks_do_not_hide_markdown_references
test_multi_backtick_and_fenced_code_are_not_references
test_multiline_backtick_code_spans_are_not_references
test_multiline_code_span_removal_preserves_line_boundaries
test_inline_code_span_removal_preserves_adjacency
test_unmatched_backticks_do_not_hide_later_references
test_fenced_backticks_do_not_close_unmatched_inline_delimiters
test_four_space_indented_fence_like_text_does_not_open_a_fence
test_fence_like_lines_with_trailing_text_do_not_close_fences
test_links_after_valid_fence_closers_are_checked
test_references_outside_the_root_are_rejected
test_symlinked_file_reference_outside_root_is_rejected
test_verification_does_not_require_realpath
test_tracked_shell_scripts_use_lf_checkouts
test_complete_fixture_success
test_unknown_argument

exit "$failures"

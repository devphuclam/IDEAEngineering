# Template Usage Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `docs/generated-projects.md` into the complete, practical onboarding guide for creating and operating a project from this template.

**Architecture:** Keep one canonical user guide at `docs/generated-projects.md`; retain the existing README link as navigation. Link to the existing Core Workspace, development environment, collaboration, release, migration, and Azure adapter documents instead of duplicating their contracts.

**Tech Stack:** Markdown, Bash verification scripts, Git, GitHub Template Repository, GitHub Codespaces, Docker-compatible Dev Containers, WSL2, and Codex Desktop.

## Global Constraints

- Keep technical repository documentation in English.
- Use descriptive branch names and do not encode an Agent or AI identity in branch names.
- Do not install or select an application Stack Profile in the template guide.
- Do not claim Azure, deployment, OpenAPI, or Swagger UI is implemented in the Core Workspace.
- Do not require global Agent plugins when project-local instructions and skills are available.
- Do not duplicate verifier rules; direct readers to `./scripts/verify-template` and existing contract documents.
- Preserve `.template-provenance` as the immutable origin release record.
- Keep Azure optional until company organization, identity, subscription, and policy boundaries are available.

---

### Task 1: Expand the canonical Generated Project onboarding guide

**Files:**
- Modify: `docs/generated-projects.md`
- Verify: `README.md`, `docs/core-workspace.md`, `docs/development-environment.md`, `docs/agents/collaboration.md`, `docs/template-migrations.md`, `docs/platform-adapters/azure.md`

**Interfaces:**
- Consumes: Existing links and contracts for the Core Workspace, environments, Agent collaboration, releases, migrations, Stack Profiles, and Platform Adapters.
- Produces: A single self-contained onboarding path that a new project maintainer can follow from template creation through normal development.

- [ ] **Step 1: Add the creation and environment sections**

Update `docs/generated-projects.md` so it starts with the purpose and then gives this order:

```markdown
## Create a repository
## Choose a development environment
## Verify the baseline
## Open the project in Codex Desktop
```

Document GitHub's **Use this template** flow, then explain the three supported environment paths:

```text
GitHub Codespaces → Code → Codespaces → Create codespace on main
Local Dev Container → Docker Desktop + Dev Containers-capable editor
WSL2 fallback → bash ./scripts/verify-template
```

State that native Windows parity is not promised, and show the expected verification command and result:

```bash
./scripts/verify-template
# Core Workspace contract verified
```

Explain that a Codex Desktop session should open the Generated Project and read `AGENTS.md` and `CONTEXT.md` before changing files. Point to `docs/agents/local-skills.md` for the project-local workflow skills.

- [ ] **Step 2: Add the extension and API guidance**

Add sections named `## Add application capabilities` and `## Add platform capabilities`.

Explain that application SDKs, frameworks, databases, API tooling, OpenAPI, and Swagger UI belong in a deliberately selected Stack Profile. Explain that Azure Repos/work tracking, Azure Pipelines, and Azure infrastructure are independent Platform Adapter concerns. Include this boundary explicitly:

```text
The Core Workspace is usable without Azure, an application stack, deployment tooling, OpenAPI, or Swagger UI.
```

Link readers to `docs/core-workspace.md`, `docs/platform-adapters/azure.md`, and the existing environment guide instead of prescribing stack-specific install commands.

- [ ] **Step 3: Add solo/team collaboration instructions**

Add `## Work alone or with a team` and document this workflow:

```text
Work Item → descriptive branch → isolated worktree → implementation → verification → review → merge
```

State that solo contributors may self-review according to the repository's review intent, while team contributors should use separate Work Items, branches, and worktrees. State that two Agents must not work concurrently in the same branch or worktree. Use a descriptive example such as `feature/project-bootstrap`; do not use a branch name containing `codex`, `AI`, or an Agent name.

Link to `docs/agents/collaboration.md` and the selected tracker adapter for provider-specific operations.

- [ ] **Step 4: Add release adoption and troubleshooting sections**

Add `## Adopt later Template Releases` and `## Troubleshooting`.

Explain that `.template-provenance` records the immutable origin release, Generated Projects are independently owned, and later releases are adopted intentionally through `docs/template-migrations.md`. Troubleshooting must cover these concrete cases:

```text
Missing ./scripts/verify-template → run from the repository root.
Docker/Dev Containers failure → start Docker Desktop and check the Dev Containers CLI.
Codespaces failure → recreate the Codespace from the repository's main branch.
Windows shell mismatch → use Git Bash or WSL2 for the Bash commands.
Azure access unavailable → continue with Core verification; Azure is optional in V1.
```

End with a short “first day” sequence linking to the relevant documents:

```text
Create repository → open environment → read AGENTS.md/CONTEXT.md → verify → choose Stack Profile → create first Work Item
```

- [ ] **Step 5: Run documentation verification**

From the repository root, run:

```bash
git diff --check
./scripts/verify-template
```

Expected result:

```text
Core Workspace contract verified
```

Confirm that the verifier reports no `DOC_REFERENCE`, `CORE_CONTENT`, `GENERATED_PROJECT`, or `AZURE_COUPLING` violations. Use `rg` to scan the guide for accidental placeholders and out-of-scope claims:

```bash
rg -ni 'placeholder' docs/generated-projects.md
```

Expected result: no matches.

- [ ] **Step 6: Commit the documentation change**

```bash
git add docs/generated-projects.md
git commit -m "docs: add template usage guide"
```

The commit must be on the descriptive branch `docs/template-usage-guide` and must not create or rename the branch to include `codex`, `AI`, or an Agent identity.

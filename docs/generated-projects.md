# Generated Projects

This repository is a GitHub Template Repository for creating product-neutral Generated Projects. A Generated Project starts with the Core Workspace, its release provenance, the shared development environment, and the collaboration rules documented in [`AGENTS.md`](../AGENTS.md).

Follow this guide from repository creation through the first project Work Item. The Core Workspace is usable without Azure, an application stack, deployment tooling, OpenAPI, or Swagger UI.

## Create a repository

Create a Generated Project from this repository before adding product code:

1. Open the template repository on GitHub and choose **Use this template**.
2. Choose **Create a new repository**, then select the intended owner, organization, visibility, and repository name.
3. Create the repository. GitHub creates an independent repository; later changes to this template do not overwrite it automatically.
4. Open the new repository and use its `main` branch as the starting point.

The Generated Project is independently owned after creation. Keep [`.template-provenance`](../.template-provenance) as the immutable record of the origin Template Release.

## Choose a development environment

Choose the environment that fits the project and company policy. The shared contract is [`.devcontainer/devcontainer.json`](../.devcontainer/devcontainer.json); the execution host may be local, cloud-based, or WSL2.

### GitHub Codespaces

1. Open the Generated Project on GitHub.
2. Choose **Code** → **Codespaces** → **Create codespace on main**.
3. Wait for the Dev Container to finish creating and let its post-create verification run.

Codespaces uses the repository's default Dev Container configuration. See the [development environment guide](development-environment.md) for the environment boundary.

### Local Dev Container

Install Docker Desktop and use a Dev Containers-capable editor. Open the Generated Project, reopen it in the configured Dev Container, and run the verification command from the repository root.

### WSL2 fallback

When company policy prohibits containers, open the Generated Project from WSL2 and run the Bash commands there:

```bash
./scripts/verify-template
```

Use Git Bash or WSL2 when a Windows shell cannot execute the repository's Bash scripts. Native Windows parity with the Linux environment is not promised by V1.

## Verify the baseline

Run the one public verification command from the Generated Project root:

```bash
./scripts/verify-template
```

The expected successful result is:

```text
Core Workspace contract verified
```

The template CI calls this same public command. When Docker and the Dev Containers CLI are available, also run the development environment smoke test:

```bash
bash tests/devcontainer-smoke.test.sh
```

Do not replace verification with an application `setup`, `lint`, `test`, `build`, or `deploy` command. Those commands belong to an intentionally selected Stack Profile or Platform Adapter.

## Open the project in Codex Desktop

Open the Generated Project folder in Codex Desktop after cloning it locally. Before asking an Agent to change files, ask it to read:

- [`AGENTS.md`](../AGENTS.md) for repository rules and Work Item routing.
- [`CONTEXT.md`](../CONTEXT.md) for the project context.
- [`docs/agents/local-skills.md`](agents/local-skills.md) for the project-local workflow skills.
- [`docs/agents/spec-kit.md`](agents/spec-kit.md) when the feature will use Spec Kit.
- This guide for the Generated Project lifecycle.

A useful first request is:

```text
Read AGENTS.md, CONTEXT.md, docs/generated-projects.md, docs/agents/local-skills.md, and docs/agents/spec-kit.md. Summarize the repository constraints, then propose the next Work Item without changing files.
```

Project-local instructions and skills are sufficient for the documented workflow. Global Agent plugins are optional enhancements, not prerequisites.

For a Spec Kit-managed feature, use the `$speckit-*` lifecycle described in
[`docs/agents/spec-kit.md`](agents/spec-kit.md). For an approved ticket that intentionally has
no Spec Kit feature directory, use Matt Pocock `$implement`. Do not run both implementation
lifecycles for the same change.

## Add application capabilities

Teams can intentionally extend a Generated Project after the Core Workspace is verified. Choose an application Stack Profile before installing application-specific SDKs or adding lifecycle commands.

A Stack Profile may supply real behavior for:

- Application language and framework tooling.
- Database and service dependencies.
- `setup`, `lint`, `test`, and `build` commands.
- API tooling, OpenAPI documents, and Swagger UI when the project is actually an API project.

The template does not select a default application stack. Keep application decisions in the Stack Profile so non-API projects do not inherit OpenAPI or Swagger UI, and so the Core Workspace remains reusable for other domains.

Read the [Core Workspace contract](core-workspace.md) before adding a Stack Profile. Do not add fake or no-op application commands to make an incomplete stack appear ready.

## Add platform capabilities

Add source hosting, CI/CD, cloud, or deployment behavior through a selected Platform Adapter. Azure concerns remain independent:

- Azure Repos and work tracking.
- Azure Pipelines.
- Azure infrastructure.

Adopt only the concerns approved for the project. The [Azure-ready Platform Adapter guide](platform-adapters/azure.md) lists the company information and identity boundaries that must be obtained before Azure is enabled. Its committed example configuration contains safe values only; real company values belong in approved developer or CI environments.

The Core Workspace remains usable without Azure, Azure CLI, credentials, network access, pipelines, infrastructure-as-code, or a deployment target. The adapter does not provision or perform a live Azure check.

## Work alone or with a team

Use the same auditable flow for solo and team development:

```text
Work Item → descriptive branch → isolated worktree → implementation → verification → review → merge
```

For a solo change, a descriptive branch such as `feature/project-bootstrap` is enough. The author may complete the self-review checklist according to the repository's review intent. GitHub records the checklist but does not record author approval as an independent approval.

For team development:

- Give each change its own Work Item, branch, and worktree.
- Use a descriptive branch name such as `feature/reporting-foundation`.
- Keep two Agents from working concurrently in the same branch or worktree.
- Run verification before review and merge only after the selected review intent is satisfied.

Do not encode `codex`, `AI`, an Agent name, or a person's identity in a branch name. Provider-specific Work Item operations belong in the selected [issue-tracker adapter](agents/issue-tracker.md); the provider-neutral collaboration rules are in [`docs/agents/collaboration.md`](agents/collaboration.md).

## Adopt later Template Releases

Generated Projects are independently owned. The [`.template-provenance`](../.template-provenance) file retains the immutable origin release; it is not overwritten when the project adopts later template changes.

To adopt a later Template Release intentionally:

1. Read the target release notes in [`docs/releases/`](releases/).
2. Read the [migration guidance](template-migrations.md) and review the diff against project-owned files.
3. Apply compatible changes on a focused branch.
4. Run `./scripts/verify-template` and the project's own verification.
5. Record the adopted release in the Generated Project's own changelog or release notes while preserving `.template-provenance`.

There is no silent or forced synchronization. Template changes must not overwrite project-owned code, documentation, Stack Profile, or Platform Adapter decisions.

## Troubleshooting

### `./scripts/verify-template` is missing

Run the command from the Generated Project repository root. Confirm that the repository was created from the template and that the `scripts` directory is present.

### Docker or Dev Containers fails

Start Docker Desktop, then check that the Dev Containers CLI is available:

```bash
docker info
devcontainer --version
```

If the project does not need a container, use the documented WSL2 fallback and run the Core verifier there.

### Codespaces fails to create

Recreate the Codespace from the Generated Project's `main` branch. Confirm that `.devcontainer/devcontainer.json` is present and that the repository's default environment has not been replaced by application-specific configuration prematurely.

### A Windows shell cannot run the Bash commands

Use Git Bash or WSL2. The Core Workspace's portable contract is Linux-oriented; native Windows parity is not promised.

### Azure access is unavailable

Continue with Core verification and local development. Azure is optional in V1, so missing Azure access, credentials, or network access does not block the baseline workflow.

### Verification reports a contract or documentation error

Read the error category and path in the diagnostic, fix the referenced contract, and rerun `./scripts/verify-template` from a clean repository root. Do not bypass the verifier by adding a duplicate project-specific check.

## First day sequence

Use this sequence when starting a new project:

```text
Create repository → open environment → read AGENTS.md/CONTEXT.md → verify → choose Stack Profile → create first Work Item
```

Keep the [Core Workspace contract](core-workspace.md), [development environment guide](development-environment.md), [collaboration workflow](agents/collaboration.md), [release notes](releases/), [migration guidance](template-migrations.md), and [Azure adapter boundary](platform-adapters/azure.md) nearby as the project grows.

# Portable Dev Container Design

**Status:** Approved design

**Approved:** 2026-08-12

**Work Item:** [#3 — Run the Core Workspace in a portable Dev Container](https://github.com/devphuclam/CodespaceTemplate/issues/3)

## Goal

Provide one minimal Linux Dev Container configuration that acts as the portable environment contract for local container use, GitHub Codespaces, and compatible CI without adding an application Stack Profile, Azure tooling, databases, or deployment behavior.

## Design decisions

### One default configuration

Create exactly one default configuration at `.devcontainer/devcontainer.json`. The configuration will use the official Microsoft Dev Container base image pinned to the immutable manifest digest currently associated with the `ubuntu` tag:

```json
{
  "name": "Development Workspace Template",
  "image": "mcr.microsoft.com/devcontainers/base@sha256:1f8bb87ca6d342a587a9163a5a1ea8c487bcd4f149e8483a5ff711f795f0776d",
  "remoteUser": "vscode",
  "postCreateCommand": "./scripts/verify-template"
}
```

The digest is part of the Template Release contract. Updating the base image is an intentional template maintenance change and must update the digest, verification evidence, and release documentation together.

The configuration will not declare `features`, `build`, `dockerComposeFile`, `forwardPorts`, `portsAttributes`, personal editor extensions, personal editor settings, secrets, or environment values. The Core Workspace supplies no application runtime, SDK, database, Azure CLI, infrastructure CLI, or deployment target.

The configuration relies on the Dev Container specification's default workspace mount and lifecycle behavior. Repository customization is limited to the shared name, the non-root development user, and the post-create verification command.

### Verification boundaries

`./scripts/verify-template` remains the sole public Core Workspace verification seam. The verifier will gain a small `DEVCONTAINER` contract check that validates the required configuration file, pinned image reference, non-root user, and post-create command. It will reject the forbidden application or platform coupling listed above without attempting to start a container.

Container creation is tested by `tests/devcontainer-smoke.test.sh`, which is an integration test harness and not a second application lifecycle command. The smoke harness will:

1. Check that the `devcontainer` CLI exists.
2. Check that Docker is installed and its daemon is reachable.
3. Set `workspaceFolder` to the repository root and run `devcontainer up --workspace-folder "$workspaceFolder"`.
4. Run `devcontainer exec --workspace-folder "$workspaceFolder" ./scripts/verify-template` inside the running container.
5. Remove the test container with the Dev Container CLI cleanup operation.

Missing tools, an unavailable daemon, an image-pull failure, a container-start failure, and an in-container verification failure must each produce a nonzero result with an actionable diagnostic containing the failed contract or prerequisite. The harness must not silently skip a required smoke step.

### Contributor onboarding

Add `docs/development-environment.md` and link it from `README.md`. The document will explain:

- local execution through Docker Desktop and a Dev Containers-capable editor;
- creation from the same repository through GitHub Codespaces;
- WSL2 without a container as the controlled fallback when company policy prohibits containers;
- that native Windows execution is not the promised environment contract;
- that personal themes, keymaps, dotfiles, and editor preferences remain outside the template;
- that the Core Workspace has no application `setup`, `lint`, `test`, `build`, or `deploy` command until a Stack Profile or Platform Adapter supplies real behavior.

The document will contain no Azure credential, organization, subscription, service connection, or secret value.

## Testing strategy

Extend the existing black-box verifier suite with observable contract tests named for these behaviors:

- `test_requires_default_devcontainer`
- `test_requires_pinned_official_devcontainer_image`
- `test_requires_shared_post_create_verification`
- `test_rejects_devcontainer_features`
- `test_rejects_devcontainer_build_configuration`
- `test_rejects_devcontainer_ports`
- `test_requires_development_environment_onboarding`

The complete fixture used by the suite will contain the same valid Dev Container configuration and onboarding semantics as the repository. Negative fixtures will mutate only the targeted contract and will assert a nonzero status plus the stable `DEVCONTAINER` contract identifier. No test will source private verifier helpers.

The integration smoke harness will have explicit failure tests for a missing `devcontainer` CLI and an unreachable Docker daemon. When the required local runtime is available, it will also be run against the real repository to prove container creation, startup, and in-container verification.

## Acceptance mapping

| Issue #3 requirement | Design evidence |
| --- | --- |
| Default container builds and starts from a clean checkout | Pinned official image, one default `devcontainer.json`, and real CLI smoke harness |
| Same public verification command succeeds inside the container | `postCreateCommand` and `devcontainer exec ... ./scripts/verify-template` |
| Foundational tools only | No application features, custom build, ports, secrets, Azure tooling, databases, or deployment configuration |
| Shared customization without personal preferences | Minimal shared JSON fields and onboarding boundary |
| Local, Codespaces, and WSL2 guidance | `docs/development-environment.md` linked from `README.md` |
| Clear failure when container cannot be created | Non-skipping smoke harness with prerequisite, startup, pull, and in-container diagnostics |

## Out of scope

- No application Stack Profile or language/framework SDK.
- OpenAPI, Swagger UI, databases, or product source code.
- Azure CLI, Azure infrastructure tooling, service connections, pipelines, or resources.
- GitHub Actions workflow creation and GitHub Template Repository settings; those belong to #7.
- Generated Project creation; that belongs to #7.
- Personal dotfiles, editor themes, keymaps, and extension bundles.
- Automatic image updates or silent synchronization of the pinned digest.

## Risks and mitigations

The pinned image digest will eventually age. The mitigation is to update it through an explicit Template Release with fresh smoke evidence rather than allowing an unreviewed mutable tag to change the environment.

Local container execution depends on Docker Desktop or an equivalent runtime and the Dev Container CLI. The smoke harness reports missing prerequisites directly, while Codespaces and the documented WSL2 fallback provide the supported alternatives.

The official base image contains shared development utilities beyond this repository's shell verifier. The template adds no application-specific tooling; any future application runtime must enter through a named Stack Profile.

## References

- [GitHub: Setting up a template repository for GitHub Codespaces](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/setting-up-your-repository/setting-up-a-template-repository-for-github-codespaces)
- [Dev Container specification: using images, Dockerfiles, and Docker Compose](https://containers.dev/guide/dockerfile)
- [Development Containers CLI](https://github.com/devcontainers/cli)
- [Development Container Images](https://github.com/devcontainers/images)

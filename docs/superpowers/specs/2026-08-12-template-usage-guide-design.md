# Template Usage Guide Design

## Goal

Turn `docs/generated-projects.md` into the practical entry point for people creating and operating a Generated Project from this template. A new maintainer should be able to create a project, open a supported environment, verify the baseline, add optional capabilities, collaborate safely, and adopt later Template Releases without relying on chat history.

## Placement and navigation

- Keep the canonical guide at `docs/generated-projects.md` instead of introducing a second overlapping document.
- Keep the existing README link as the primary navigation path.
- Keep technical repository documentation in English, consistent with the repository contract.

## Content

The guide will cover this workflow in order:

1. Create a repository with GitHub's **Use this template** flow.
2. Choose GitHub Codespaces, a local Dev Container, or the documented WSL2 fallback.
3. Run `./scripts/verify-template` and recognize a successful result.
4. Open the Generated Project in Codex Desktop and require Agents to read `AGENTS.md` and `CONTEXT.md` before changing the project.
5. Select an application Stack Profile before adding stack-specific SDKs, build commands, APIs, databases, OpenAPI, or Swagger UI.
6. Add source-host, CI/CD, deployment, or cloud integration through a Platform Adapter; keep Azure optional until company boundaries are known.
7. Follow the same Work Item, focused branch, isolated worktree, review, and merge flow for solo and team development.
8. Preserve `.template-provenance` and intentionally adopt later Template Releases using the migration guidance.
9. Troubleshoot the most likely Windows, shell, Docker, Dev Containers CLI, and verification failures.

## Boundaries

- The guide will not install or select an application Stack Profile.
- It will not claim Azure, deployment, OpenAPI, or Swagger UI is already implemented.
- It will not require global Agent plugins when project-local instructions and skills are available.
- Examples will use descriptive branch names and will not encode an Agent or AI identity in branch names.
- The guide will not duplicate verifier rules; it will point readers to the public verification command and existing contract documents.

## Verification

- Run `./scripts/verify-template` after editing the guide.
- Confirm all new local Markdown links resolve through the existing documentation-reference checks.
- Review the final guide for placeholders, contradictory environment instructions, and accidental claims that optional layers already exist.

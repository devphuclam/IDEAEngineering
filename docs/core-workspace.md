# Core Workspace

The Core Workspace is the stack-neutral foundation shared by every Generated Project. It owns collaboration rules, agent guidance, security defaults, documentation conventions, and verification. It also contains safe configuration examples and release metadata for the current Template Release.

The authoritative current release version is `.template-version`. A Generated Project retains the origin release in `.template-provenance`; see the [Template Releases](releases/) and [migration guidance](template-migrations.md). Generated Projects are independently owned after creation and do not receive automatic template synchronization.

## Clean-checkout contract

From a clean checkout, run:

```bash
./scripts/verify-template
```

The verifier confirms that required Core Workspace artifacts and release metadata are present, committed configuration examples follow the baseline safety rules, and tracked local Markdown references resolve. It is the sole public V1 lifecycle command.

V1 intentionally does not provide `setup`, `lint`, `test`, `build`, or `deploy` commands. Their absence is intentional, and the Core Workspace supplies no no-op shims for them.

## Optional layers

Stack Profiles optionally provide real `setup`, `lint`, `test`, and `build` behavior for a selected application stack. They do not change the Core Workspace collaboration contract.

Platform Adapters optionally provide source-host, CI/CD, cloud, and `deploy` integration. They preserve the Core Workspace contract while connecting a Generated Project to the selected platforms. The [Azure-ready Platform Adapter](platform-adapters/azure.md) is documentation and safe placeholders only; it does not make Azure mandatory.

Azure is optional. The Core Workspace requires no Azure account, Azure CLI, credential, pipeline, service connection, infrastructure definition, or deployment target.

The Core Workspace also includes a project-local Spec Kit and Codex skills integration for
specification-driven agent work. Spec Kit adds feature-artifact workflow support; it does not
select an application stack, provision Azure, or replace the Matt Pocock engineering skills.
Follow the [Spec Kit + Matt Pocock workflow](agents/spec-kit.md) when using both.

## Configuration safety

Committed configuration examples use `${UPPER_CASE_NAME}` placeholders for sensitive values. Supply actual values through developer environments or CI secret stores; never commit them to the Generated Project. `verify-template` provides a baseline guard for obvious configuration mistakes and literal sensitive assignments, but it does not replace enterprise secret-scanning controls.

## Documentation reference safety

Tracked local Markdown links must resolve to non-symbolic-link files or directories inside the repository. The Core verifier rejects symbolic-link targets, even when a link points back inside the repository, so physical containment remains deterministic without an external path-resolution dependency.

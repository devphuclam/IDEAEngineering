# Implementation Plan: Backend development access

**Branch**: `codex/backend-dev-access` | **Date**: 2026-10-01 | **Spec**: [spec.md](spec.md)

## Summary

Deliver US1 before Swagger: a Windows PowerShell 5.1-compatible launcher and a user-owned Ubuntu
runtime controller around the existing inspected executable. Provision one new persistent synthetic
database; migrations and console bootstrap stay explicit. Keep TLS/session/CSRF behavior unchanged.
US2 adds development-only interactive documentation after separate intake and build authority.

## Technical Context

- Language/platform: Windows PowerShell 5.1 and CMD; Ubuntu Bash; existing Temurin 25.0.4.1+1.
- P1 dependencies: installed OpenSSH, native PostgreSQL 18 and retained Server JAR; no package/build.
- P2 candidate: springdoc WebMVC UI 3.1.1, not admitted yet. Preserve Log4j2/no Logback.
- Storage: `idea_ddm_preview_20261001_26.public`, created only if absent, owned by migrator;
  distinct runtime app role. Protected config and owned process records outside Git.
- Testing: public launcher exit/status/address outputs; real trusted HTTPS and actual PostgreSQL,
  synthetic login and persistence across owned stop/start. User-approved seam on 2026-10-01.
- Target/scale: one developer, one Ubuntu runtime, Windows browser through loopback SSH tunnel.
- Constraints: port 18444, localhost SAN/trust, no TLS bypass, no automatic service/firewall change,
  no verifier, no F03-B source change or implicit PR25 merge.
- Performance: bounded readiness wait 60s; SSH connect timeout 10s; timeout is failure, not readiness.

## Constitution Check

P1 is non-operational developer support around already accepted product behavior, not a new
production increment or gate approval. It changes no business API, permission or product schema.
P2 is a development-only observer/request client and still requires security qualification and
dependency intake before code/import/build. No new product gate is asserted.

Trace: user approvals -> Issue #26 -> this feature -> public-boundary test/evidence. Existing F03-B
history and main's uncommitted progress files remain untouched. Secrets stay in restricted server
configuration, never Git, process arguments or retained output. Dedicated provisioning preserves
least privilege and Flyway history protection. Retained artifact/source limits remain explicit.
Pre/post-design process check: satisfied for P1; P2 tooling/import execution BLOCKED until its
recorded pre-use dispositions exist.

## Project Structure

```text
IDEA-Dev.cmd
tools/backend-dev-access/launcher.ps1
deploy/development/preview/backend.sh
deploy/development/preview/setup.sh
tests/backend-dev-access/launcher-contract.test.ps1
specs/006-backend-dev-access/{spec,plan,research,data-model,quickstart,tasks}.md
specs/006-backend-dev-access/contracts/launcher.md
specs/006-backend-dev-access/evidence/launcher-results.md
```

Controller: `start`, `status`, `stop`. Launcher: `Start`, `Status`, `Stop`.
An interactive wizard provisions only the fixed isolated DB and creates the initial synthetic
custodian through the packaged operator. It prompts privately for database and application
credentials; no live delivery channel is enabled.

## Delivery and gates

1. Record spec/plan/tasks and analyze consistency; reuse existing qualified runtime/artifact.
2. TDD launcher one observable failure/success behavior per cycle. Test real operations only after
   the developer completes root-only provisioning and console credential entry.
3. Show actual Web/health addresses and start/status/stop commands; record limits.
4. Intake exact Swagger graph and separately authorize restricted build tools, then agree Swagger
   test seam. No download/build to repair missing authority.
5. Qualify documentation/Try out; external review and integration stay separate.

Implementation refinement: local tunnel metadata lives under the Windows user's LocalAppData,
not checkout-local `var/`. This retains ownership across a future checkout integration without
adopting an unrecorded tunnel. It contains process identity only, no authentication material.

No parallel editing of this branch. Read-only prerequisite research may run independently;
runtime and data writes remain ordered.

# Development Access Build-Tool Process Exception

| Field | Value |
|---|---|
| Stable ID / class | `IE-RES-DEVACCESS-BUILDTOOL-EXCEPTION-20261002` / bounded process-exception record |
| Version / status / normativity | `0.1` / Approved for the process scope below / INFORMATIVE; no product or legal approval |
| Owner / author / authority | Engineering / Codex / Project Reviewer Nguyen Huynh Phuc Lam, explicit chat approval 2026-10-02 before execution |
| Applicability | Issue #26, Spec Kit 006, internal engineering Swagger build/test only |
| Classification / retention | INTERNAL; retain in Git with Issue #26 and the historical intake |
| Upstream / downstream | [Exact nine-artifact intake](2026-10-01-t043-maven-web-build-intake.md), [intake rule](../agents/external-source-intake.md) / [T012–T015](../../specs/006-backend-dev-access/tasks.md) |
| Change / supersession | New authority; does not rewrite historical T043 or F03-B exceptions; no predecessor |
| Review trigger / expiry | Any artifact/version/graph/hash/use change; expires at whole-feature acceptance or earlier withdrawal |
| Evidence / tailoring | Authorization only, execution NOT-RUN; tailored process-exception controls, no standards conformity claim |

The reviewer authorizes the exact `exec-maven-plugin:3.6.3` and eight runtime dependencies already
inspected and checksummed in `IE-RES-T043-MAVEN-WEB-INTAKE-20261001`, solely for internal build/test
of Issue #26. Verify all nine JAR hashes and the descriptor graph before execution. Missing or
changed artifacts are BLOCKED; no replacement download is authorized by this exception. Keep the
tools unmodified with their notices in the controlled build cache and exclude them from
`BOOT-INF/lib`.

The supplemental Plexus terms remain a Legal Review obligation. This is a limited process
exception, not legal approval, commercial clearance or redistribution permission. It grants no
additional license rights and does not replace T036. It does not apply to F04, F05, general
development or production. Any new Swagger/application/tool artifact requires its own pre-use
intake. No previous F03-B exception is inherited.

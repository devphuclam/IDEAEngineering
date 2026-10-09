# API exporter restart verification

| Control | Value |
|---|---|
| ID / version / status | `IE-VER-API-EXPORTER-RESTART-20261009` / `0.1` / Draft |
| Class / authority | Engineering verification; informative, no product requirement or acceptance decision |
| Scope / owner | Work Item #53; repository maintainers |
| Author / review | Primary engineering worker; two-axis engineering review completed; independent human acceptance `NOT-RUN` |
| Date / classification | 2026-10-09, `Asia/Ho_Chi_Minh`; INTERNAL |
| Baseline | `main@91cf6c25e516ce2b3ae628d59c2a20b90076bcff` |
| Executed source | `8d62d5cdc45eab079e036e75c0a295773b05a2e7` |
| Change / supersession | Fresh restart requested by user; predecessor PR #54 retained as historical, not the current candidate |
| Retention / review trigger | Retain with #53; recheck changed source, contract, renderer, runtime or dependency |
| Evidence / tailoring | Actual focused tool execution; grouped control envelope, no standards-conformity claim |

## Result

- Original Word/Excel/HTML exporter and layouts retained; inputs cover 46 actual HTTP operations and nine CPD DESIGN cards.
- Metadata, responsible person, editorial Vietnamese text, workflows and history retained. Technical fields come from controlled sources.
- Concise direct-field/model references; retry appears once per operation. No fabricated DESIGN wire details.
- Output content and Word/Excel core metadata contain no listed AI names. Source attribution with such a name fails before catalog/output writes.
- Source checks reject missing/stale/unreviewed routes and invalid supported schemas. A new synthetic route first fails, then appears in all three formats only after a complete reviewed contract is supplied.
- Two source-semantic review findings were repaired: login/logout retry is not read-only replay; credential-proof stale/ineligible-target refusal is 403, not an invented 409. Targeted tests: RED 0/2, then GREEN 2/2.
- Two-axis engineering review: spec findings closed; no actionable standards finding. This is not Project Reviewer acceptance.

## Exact execution

Approved existing Windows Node `24.19.0`, SHA-256
`3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237`.
Renderer dependencies use the unchanged admitted lockfile/cache; no download or install.

Working directory: `tools/contract-exporter` in the fresh `codex/api-contract-restart` worktree.
Each command below used the approved binary's full absolute path, not PATH selection.

```text
node --test contract.test.mjs render.test.mjs restart.test.mjs
node export.mjs --update
node export.mjs --check
node export.mjs --update
```

| Oracle | Actual result |
|---|---|
| Focused tests | 41/41 PASS; failures/cancelled/skipped 0; 17.1794455 seconds |
| Source/contract check | PASS; 46 routes / 46 HTTP operations |
| Default exports | Word, Excel and HTML generated; 55 entries, v1.2 |
| Same-source repeat | 0 changed / 0 new; no duplicate entries/revision/archive; previous snapshots preserved |
| Final tracked tree | Clean after exact-source execution |

[Retained command output](evidence/20261009-restart-node-test.txt), SHA-256 of committed LF bytes:
`ce5e59503cb54402aee9b7fa34ad584b2de8bf3793217972afa612147a42207e`.
Earlier 39/39 at `c5cf33b` and predecessor executions are historical, not combined with this run.

## Limits and handoff

Rendered Word page/layout inspection is `NOT-RUN`: the bundled runtime has no available Word renderer. Content/OOXML checks do not prove visual layout. Word remains an unqualified-layout preview, not a layout-approved final handoff.

Maven, PostgreSQL, application runtime, browser product qualification, deployment and verifier are `NOT-RUN`; not needed for this source/export-tool increment. No Java, business API, schema, migration, dependency graph, deployment or CI changes. The scanner and schema checks are bounded, not universal framework introspection or a full OpenAPI certification.

Next: Project Reviewer checks the fresh Draft PR and generated samples. No merge or Issue closure authorized by this record. The main worktree's unrelated UI/catalog edits remain untouched.

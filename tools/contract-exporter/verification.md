# Issue #53 — contract synchronization verification and handoff

| Control field | Value |
|---|---|
| ID / class | IE-VEV-API-CONTRACT-SYNC-053 / focused engineering verification |
| Version / status | 0.1 / engineering PASS; independent Project Reviewer acceptance pending |
| Normativity / classification | INFORMATIVE / INTERNAL |
| Author / intended reviewer | Codex / Project Reviewer |
| Publication | 2026-10-09, Asia/Ho_Chi_Minh |
| Scope / change | [Issue #53](https://github.com/devphuclam/IDEAEngineering/issues/53); CODEX_ONLY |
| Baseline | main `91cf6c25e516ce2b3ae628d59c2a20b90076bcff` |
| Final executed source | `8f2a28a69ccee0b8641cabd22e70df32bb3a2cf1` |
| Downstream | [tool instructions](README.md), [API handoff](../../docs/product/instances/idea-engineering/api/handoff/README.md) |
| Review trigger | Route/owner/DTO/security/contract/tool behavior change; CI runner/rule activation |
| Retention | Git; predecessor source and review findings remain historical |

## Objective, inputs and boundary

Detect omitted/stale supported HTTP routes, refuse unreviewed owner/source drift, and project
the actual contracts into the existing documents. No product requirement or API is introduced.
The main worktree's unrelated UI edits and catalog date edit were preserved; all repairs live
in the isolated `codex/api-contract-sync` worktree.

Execution Node: 24.19.0, Windows x64, approved existing binary, SHA-256
`3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237`.
Check and guard tests use Node built-ins only. Renderer reuses the existing installed lockfile
graph through an ignored worktree cache junction: docx 9.9.0 and exceljs 4.4.0; both embedded
MIT texts were inspected and retained in their existing packages. No new rights/graph/version/
redistribution claim or blanket transitive-license approval is made by this tool repair.
No download/install or dependency execution-environment change was performed.
Unchanged lockfile SHA-256:
`d3c3b8a1c8426a5a7b9234d17fe0e9c219e47f1dab674ceb2ee66b9a3ba20047`.

Owned test fixtures use fresh temporary roots and exact bounded cleanup. Tests do not mutate
the checkout's Java, account data or database. Generated output/archive stays Git-ignored.

## RED → GREEN and review repairs

Initial RED: generated catalog omitted the actual account directory route. Source inspection
found 33 Feature 009 HTTP adapters absent from the predecessor export and an incorrect GET
Gateway status description (actual method POST; binary response, not JSON).

Targeted RED witnesses subsequently covered missing routes, documentation-prefix hiding, new
unreviewed filters, path-variable identity, qualified Spring annotation bypass, literal-example
misvalidation, DESIGN misclassification and HTML text injection. Minimum repairs made those
guards GREEN. Malformed input is refused before writing generated catalog/output.

Two-axis code review found three source/wire discrepancies: empty filter refusal bodies,
six nullable output fields and copied health/CSRF concurrency semantics. They were corrected
only in contracts/projections. The reviewers rechecked `8f2a28a...` and resolved their original
findings; no remaining blocking finding was reported in those bounded rechecks.
This is an engineering review, not a submitted independent human GitHub approval.

## Final execution

Commands below used the approved Node binary explicitly rather than PATH:

~~~text
node --test tools/contract-exporter/contract.test.mjs tools/contract-exporter/render.test.mjs
node tools/contract-exporter/export.mjs --check --json
node tools/contract-exporter/export.mjs --update
node tools/contract-exporter/export.mjs --update
git diff --check
~~~

| Oracle | Actual result |
|---|---|
| Guard regression | 28/28 PASS |
| Actual document rendering regression | 2/2 PASS |
| Aggregate | 30 PASS, 0 failure/cancel/skip; 13.682 seconds |
| Source/contract check | PASS; 46 routes / 46 operations, zero errors |
| Inventory | 44 Server (42 product + 2 health), 2 Gateway HTTP; 9 CPD DESIGN, 55 catalog entries |
| Word/Excel/HTML content | Every operation retained; generated OOXML read; HTML script and 46/9 tabs checked |
| Repeat export | PASS; catalog unchanged, existing same-content archive retained |
| Bad/missing contract | exit 1; no generated writes/output in owned refusal fixtures |
| Scope diff | Java/test/migration/POM/dependency lockfiles unchanged |
| Documentation links/diff | Focused checks recorded in final publication |

Raw Node output: [20261009-final-node-test.txt](evidence/20261009-final-node-test.txt);
SHA-256 of the retained LF bytes:
`480c58ecb759e4856e04124ea593845aa7408b882f3c5a3d88c63001b741d6d3`.
Generated final HTML content SHA-256:
`2f82a019601abf679419e8f6482d2e44e1c5bfe3c2cc42669459bab2cdfc7c1c`.
Rendering tests inspect content/script; actual Chrome, Word page layout and Excel UI
qualification are NOT-RUN. No new runtime behavior claim is inferred from these results.

## Remaining integration condition

`main` was read back at the baseline above with `protected=false`.
The new workflow requires pre-existing approved Node, fails preflight on drift and installs
nothing. A GitHub-hosted runner is not assumed to contain that exact binary; remote execution
is unqualified until actual CI evidence says otherwise. Maintainer must provide a permitted
runner and make `API contract synchronization` a required check before claiming enforced merge
protection. The contributor instruction and local guards are implemented; that hosting/settings
action is not silently performed or reported PASS.

### Actual CI attempt — environment BLOCKED

The [API contract synchronization job](https://github.com/devphuclam/IDEAEngineering/actions/runs/37885627747/job/113674875318)
ran against publication head `14a91548f66417b8a0bbaf6e6fa2cf70b4d56f0e` on
2026-10-09 (completed at 04:49:10 UTC). Checkout passed. The approved pre-existing Node
preflight failed with `Approved Node 24.19.0 unavailable; provisioning/intake is a separate action.`
The contract check and guard regression were consequently skipped: remote execution is
NOT-RUN, not PASS and not a contract regression failure. No fallback version, installation or
download was used. The runner's actual Node version was not retained; no version is inferred.
This evidence-only publication does not change the final local executed source or its 30/30
result. Permitted runner provisioning and required-check configuration remain integration
conditions; no merge-enforcement claim is made.

Static supported-route discovery and source fingerprints are not universal runtime route
discovery or semantic correctness proof. OpenAPI validation is explicitly bounded.
No Maven/PostgreSQL/application test/deploy/full verifier was run; all are NOT-RUN for this
focused documentation/tool change. No product API, authentication, session, CSRF, permission,
database, migration or deployment behavior changed. PR stays Draft/Open for review; no merge.

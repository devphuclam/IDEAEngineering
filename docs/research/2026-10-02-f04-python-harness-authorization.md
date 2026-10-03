# F04 Python Harness — Prospective Tooling Clarification

| Control | Value |
|---|---|
| Stable ID / class | `IE-RES-F04-PYTHON-AUTH-20261002` / bounded successor process authorization |
| Version / document status | `0.1` / Approved for the prospective scope below |
| Product normativity / repository instruction state | INFORMATIVE / NOT-APPLICABLE; no product, legal, commercial or deployment approval |
| Owner / author | Engineering / Codex |
| Reviewer / authorization authority | Project Reviewer Nguyễn Huỳnh Phúc Lâm; explicit supplied repair/continuation decision, 2026-10-02 |
| Applicability / start baseline | Work Item [#31](https://github.com/devphuclam/IDEAEngineering/issues/31), PR #32, F04 T023–T026 harness only; checkpoint head `fb69096f3cc838e5b3198118c34aa47fa31e94e0` |
| Effective / evidence date | 2026-10-02, prospectively after this record is committed and before clean requalification |
| Classification / retention | INTERNAL; retain with F04 qualification evidence and original tooling authorization |
| Upstream | [Original tooling record](2026-10-02-f04-buildtool-execution-authorization.md), Project Reviewer checkpoint review and task |
| Downstream | Scoped Bash runner, no-build Python qualification harness, [F04 results](../../specs/005-ph1-foundation-custody/evidence/F04-outcome-results.md), T023-B |
| Change / supersession | Additive clarification of an omitted harness utility; original authorization and original execution receipts remain unchanged; superseded by NOT-APPLICABLE |
| Review trigger | Any Python version, interpreter/hash, environment, direct module, utility scope or invocation expansion; missing/mismatched runtime blocks execution |
| Evidence / tailoring | Installed-runtime observation and static source inspection; STANDARD-GUIDED information/configuration/verification trace under IE-STD-AUTH-001; requalification NOT-RUN at record creation |

## Review-discovered control gap

The schema/Audit checkpoint used `python3` for build preflight, UUID schema naming and no-build
admission qualification. Python was an unlisted harness utility in
`IE-RES-F04-BUILDTOOL-AUTH-20261002`. That original record was incomplete: this successor does
not claim Python was pre-authorized and does not retroactively cure its process-control gap.

The Project Reviewer accepts the prior 15/15 results as technically valid bounded PostgreSQL
evidence, but requires a clean three-suite requalification under this prospective envelope before
T023-B. Preserve the prior source/hashes; add a successor receipt rather than rewrite history.

## Exact installed runtime and standard-library scope

Read-only probes on `ideaddmserver`, 2026-10-02:

- `python3 --version`: **Python 3.14.4**, CPython.
- `command -v python3`: `/usr/bin/python3`; resolved interpreter `/usr/bin/python3.14`.
- Interpreter SHA-256: `52e0a13e60a981d8c4b6478be2ba5176f69da07948a056bf49cf6f077e30cb41`.
- Existing OS packages: `python3.14` and `python3.14-minimal`, both `3.14.4-1ubuntu0.2`.
- Isolated probe `-I -S`: `sys.prefix == sys.base_prefix == /usr`, `isolated=1`, `no_site=1`.

Static inspection of `run-f04-postgresql-checks.sh` and `qualify-f04-build-preflight.py` finds
only standard-library imports: `hashlib`, `json`, `os`, `re`, `subprocess`,
`xml.etree.ElementTree`, `zipfile`, `pathlib`, `uuid`, `shutil`, `tempfile`; successor runtime
validation also uses standard-library `sys`. Their functions are local file/hash/metadata
inspection, invoking already admitted local tools, owned preflight-fixture files and UUID naming.
No pip environment, third-party Python module, network resolution, download or installation is
required. Standard-library status alone does not authorize new uses or network behavior.

## Prospective authorization and guards

Use only `/usr/bin/python3.14` with this exact interpreter hash and version, invoked with
`-I -S` to ignore Python environment overrides and disable site-packages initialization. Confirm
the system prefix, isolated flags and exact runtime before F04 build/credential/database access.
The Bash runner pins the interpreter before its preflight and uses it for the schema UUID.
The standalone no-build qualifier requires the same isolated invocation and runtime before
creating its owned metadata fixture:

```bash
/usr/bin/python3.14 -I -S apps/server/scripts/qualify-f04-build-preflight.py
```

This admits Python prospectively only as the F04 test/preflight/schema-fixture harness utility.
It does not authorize a Python product runtime, F05, general project tooling, pip, virtualenv,
third-party packages or network/install fallback. Existing offline Maven, nine-artifact, unchanged
build graph, approved PostgreSQL database/owned schema and guarded cleanup boundaries remain.
Any runtime/version/hash/direct-module/scope expansion reopens tooling review before execution.

# P05 Server Fixture Provisioning Evidence

| Field | Value |
|---|---|
| Evidence ID | `P05-SERVER-FIXTURES-20260924` |
| Document class / product normativity | Verification evidence / `INFORMATIVE` |
| Increment | `IE-INC-READY-001` / PH0 / P05 |
| Version / status | `0.2` / Draft; P05 preparation result `PASS` |
| Evidence date | 2026-09-24, Asia/Ho_Chi_Minh |
| Executor | Project Reviewer ran the one-time `sudo` command in the Ubuntu SSH terminal; Codex inspected the returned evidence through a separate authenticated SSH connection. |
| Reviewer / acceptance | Project Reviewer confirmed `Hoàn thành P05` on 2026-09-24 after review of the observed size, SHA-256, permissions, manifest, retention date and PH1 limitations. Review is by the data custodian, not an independent human. |
| Classification / retention | `INTERNAL`; retain this bounded record with P05/T022 evidence. Review/delete generated server files by 2027-01-31 or record an extension before then. |
| Source | [`IE-PH0-P05-DATA-001@0.4`](../test-data-and-verification.md), [generator](../../../tools/p05-fixtures/generate-fixtures.mjs), [runner](../../../tools/p05-fixtures/run-on-server.sh), [expected digests](../fixtures/expected-artifact-digests.json), [test personas](../fixtures/test-persona-profiles.json) |
| Limit | This proves preparation of synthetic bytes only; it does not exercise an IDEA application, Gateway, Checkout, Check-in, Review, Release, a second Vault, multi-GB transfer or performance. |

## Method and observed configuration

The generator source was copied to `/tmp/idea-p05-generate.mjs`. SHA-256 of the staged source and
repository source matched `4ebb0eae6147d7d5cd7a238b6791535478160c3623239e8b432bf31c00e34c70`.
The runner source passed `bash -n` on the server and matched repository SHA-256
`47fccf9b97e5fea8cfff0c8c80d2bf4e4e57e7976a498be0e8e077aa2abf5643`.
The runner refused an existing target, then the Project Reviewer ran
`sudo bash /tmp/idea-p05-run.sh`. It used Node.js `v24.21.0`, created the approved separate
directory as `idea-server`, checked owner/mode/size and independently checked both file hashes.
The server manifest records generation at `2026-09-24T04:10:10.085Z`.

| Item | Observed size | Observed mode / owner | Observed SHA-256 | Expected match |
|---|---:|---|---|---|
| `/srv/idea/artifacts/p05-fixtures` | directory | `700 idea-server:idea-server` | Not applicable | Yes |
| `IE-DATA-CANONICAL-001-small-1KiB.bin` | 1,024 bytes | `600 idea-server:idea-server` | `c6aa2b94ca9fd4d756deb9d75500f1fd217bf04efad6d2be4de4a682ae723384` | Yes |
| `IE-DATA-CANONICAL-001-transfer-64MiB.bin` | 67,108,864 bytes | `600 idea-server:idea-server` | `04c5a57e3b754b5eb75de7216d33a4982b525c3a1cdfd19b9eddfd1520126eae` | Yes |
| `manifest.json` | 1,764 bytes | `600 idea-server:idea-server` | Not pinned | Fields reviewed |

The server's evidence copy is
`/home/phuclam/idea-p05-evidence-2026-09-24.txt` (`600 phuclam:phuclam`, 2,425 bytes),
SHA-256 `39d451a67af08ee918d84f82ec3f57cc72e8edaddd66149a7cf08489efedf7af`.
Codex read that file by authenticated SSH after the user ran the command. It contains the runner's
`P05_SERVER_FIXTURES=PASS` result, `stat` and `sha256sum` output, plus the server manifest.

## Manifest and review boundary

The observed manifest identifies dataset `IE-DATA-CANONICAL-001@0.2`, first-party deterministic
generator `1.0.0`, synthetic classification, `v24.21.0` runtime, both sizes/hashes above, physical
location `/srv/idea/artifacts/p05-fixtures`, Project Reviewer as data custodian and reviewer, and
retention review date `2027-01-31`. It explicitly states that the files are not CAD/Office documents
and that two Test Persona profiles do not establish independent-human review.

## Disposition

The Project Reviewer accepted P05 preparation as `PASS` on 2026-09-24 after seeing the observed
size, SHA-256, permissions, manifest, retention date and PH1 limitations. This is a one-person
review and is not independent-human review evidence. D4's Product Decision Authority decision about
whether the bounded fixture is sufficient for the PH1 gate remains `OPEN / NOT-RUN`. Application
checks `P05-DATA-01`–`09` remain `NOT-RUN`.

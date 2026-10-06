# T036 native package, source and notice correspondence

| Control | Value |
|---|---|
| Stable ID / class / version | IE-RES-T036-NATIVE-20261006-001 / RESEARCH-EVIDENCE / 0.1 |
| Status / evidence | Draft; local-cache/lock correspondence and exact publisher source; whole native transitive closure OPEN |
| Owner / author / reviewer | Engineering intake / Codex bounded research worker / Project Reviewer; Legal Review acceptance NOT-RUN |
| Baseline / date | T036, PR38 predecessor 8af0a6a05d19106960c9f2674aa1fd9e49231dde; 2026-10-06 Asia/Ho_Chi_Minh |
| Normativity / authority | INFORMATIVE; REFERENCE-ONLY research, no new import, execution or legal approval |
| Classification / retention | INTERNAL; retain with exact-version intake and historical limitations |
| Upstream / downstream | [Intake](../agents/external-source-intake.md), [prior Rolldown research](2026-10-06-t036-rolldown-rights.md) / [T036 matrix](../../specs/005-ph1-foundation-custody/evidence/PH1-T036-closure-matrix.md) |
| Change / trigger / tailoring | Successor correspondence evidence; version/platform/graph/use drift reopens review; STD-INFO-001, ISO/IEC/IEEE 15289:2019 STANDARD-GUIDED, no conformity claim |

## 1. Read-only method and exact native bytes

Windows existing npm cache is `C:/Users/TD-999/AppData/Local/npm-cache/_cacache`;
Ubuntu cache is `/home/phuclam/.npm/_cacache`. Archive paths derive from committed lock
integrity as `content-v2/sha512/<first2>/<next2>/<remainingHex>`. All six existing archives'
SHA-512 values match the lock. Their streamed native-entry SHA-256 values match installed
binaries in the ignored controlled Windows Web cache and the retained Ubuntu
`/home/phuclam/idea-t043-package-green-2fe89d4/apps/web/node_modules`.

Windows inspection used PowerShell/.NET GZipStream/TarReader; Ubuntu used sha512sum,
tar listing and `tar -xOzf ... | sha256sum`. Entries were streamed only, not extracted to disk.
No package was downloaded, installed, imported or executed. This proves installed-byte →
cached archive → committed lock correspondence, not independently authenticated publication,
signature verification or a reproducible source build.

| Exact package | Existing archive SHA-512 / lock match | Native entry / SHA-256 (archive = installed) |
|---|---|---|
| @rolldown/binding-win32-x64-msvc@1.2.11 | fcfccaab3009d378b5f68cb622d3efcaf6958ce8c108d9df689b3ccaf51d1812a68844a09eb2524366b077cd50cc56db9c09aeed83bd66726b0c26fd55224f44 | package/rolldown-binding.win32-x64-msvc.node / cc49bb8c6463e2c85ed1287bf949bf6cfd08d6e0b80be53d2a12eb4500c1bf8c |
| @rolldown/binding-linux-x64-gnu@1.2.11 | 98e5414f774fa645a6f170563e65386dff94e9d6032de328ffda235268ace0dd0be6ebb5d2aadae6f3b29e067bfcf49da04e06f4abd1b786e5a11c4d8cb6acec | package/rolldown-binding.linux-x64-gnu.node / 34e3f5cc135d0fec7f0d9837e30413f1a151037b1568911f074048bf941d68e5 |
| @typescript/typescript-win32-x64@7.0.2 | d014371e40071e528b4a9d6a46f7f7494846a46b03ba107f8e0170ef982ecaa6f126a11a4b40b0fd514ef22da71e094953340246d30c47f20100a137113302e2 | package/lib/tsc.exe / f9ecfbdc93753d2c972d66a8d0d75f5bd737fd4a5f88b422d9091ea282bcb2c7 |
| @typescript/typescript-linux-x64@7.0.2 | 11875fd9c360eeb8025899f109d27e177577f4ef2285bdfb78702ed4b2bca00162ce04d06cf38aef31c75db3edf2b5f6e023aa3835de237b087f47c25c6ec7fc | package/lib/tsc / 4f2de678286401759b3fb4475bafe35b8f32b4b3a07d92642bbf37eadc9b34a4 |
| lightningcss-win32-x64-msvc@1.33.0 | 3a5108083c7f5e5d05a92a786ebcbccc59c2bc6a628371a5e200aabaf6301eea892840b5fa7f4d8039e216fa871a632fd5992a0c9ac3a8a292ca44c35fe7a1b8 | package/lightningcss.win32-x64-msvc.node / d043df0f0675e7fffed4cf8b8c33e28639ec9f21d445c21e7fe4985e4a9b5a91 |
| lightningcss-linux-x64-gnu@1.33.0 | 6abf89bbb2e670dd09a381692f88691726f0346f7fdc0fc1af9296da7da3c8e0e0dcc1195da0d800375e9a8352f810cd7cc80abf29492e3e12e6dc9101cb6e02 | package/lightningcss.linux-x64-gnu.node / 84c6f35fb9c78f9920090f4017a9dc6dc50842a56c543f509943a0d434325d93 |

TypeScript Windows archive LICENSE/NOTICE equal retained installed texts:
LICENSE a7d00bfd54525bc694b6e32f64c7ebcf5e6b7ae3657be5cc12767bce74654a47;
NOTICE f5c708b59114507b8b27b48181b6883d106bbca0c1634bbee45b5e344237b66b.
Linux archive NOTICE was independently streamed and matches; Linux LICENSE equality reuses
the retained authenticated observation, not a claimed second archive stream. LightningCSS
Windows archive LICENSE independently matches retained MPL text
5eba353fe5076ac3432177f8ab1cf75e3afcd0584251e37c3bfead5f447d040e;
Linux LICENSE equality likewise reuses retained evidence. Rolldown Linux archive lists only
manifest, README and binding; no separate legal file is present.

Reference-only successor inspection also found LightningCSS's official exact-tag
[v1.33.0 LICENSE](https://raw.githubusercontent.com/parcel-bundler/lightningcss/v1.33.0/LICENSE)
and [Cargo manifest](https://raw.githubusercontent.com/parcel-bundler/lightningcss/v1.33.0/Cargo.toml).
These establish attributable source/terms wayfinding, not a complete selected-feature dependency
notice manifest or binary attestation. Reading the source license imports no text into IDEA;
the node/package.json URL could not be read and contributes no evidence. LightningCSS's
full compiled transitive notice closure also remains unclaimed; before redistributing a native
tool, Engineering must resolve that exact delivery scope rather than reuse a metadata label.

## 2. TypeScript source correspondence, beyond manifest metadata

Both TypeScript parent/native manifests pin gitHead
`2bd066d87f5bafd315be9f40889d0a60b9e58e0b`. The exact commit belongs to official
[microsoft/typescript-go](https://github.com/microsoft/typescript-go/tree/2bd066d87f5bafd315be9f40889d0a60b9e58e0b),
with actual [LICENSE](https://raw.githubusercontent.com/microsoft/typescript-go/2bd066d87f5bafd315be9f40889d0a60b9e58e0b/LICENSE)
and [NOTICE](https://raw.githubusercontent.com/microsoft/typescript-go/2bd066d87f5bafd315be9f40889d0a60b9e58e0b/NOTICE.txt).
The exact [publication recipe](https://github.com/microsoft/typescript-go/blob/2bd066d87f5bafd315be9f40889d0a60b9e58e0b/Herebyfile.mjs#L1792)
deliberately changes repository metadata to microsoft/TypeScript for publication and records
checkout gitHead. Its [platform packaging](https://github.com/microsoft/typescript-go/blob/2bd066d87f5bafd315be9f40889d0a60b9e58e0b/Herebyfile.mjs#L1883)
builds OS/CPU-specific native compilers and copies LICENSE/NOTICE. Thus typescript-go is an
attributable source/build/package bridge, not a guessed repository substitution.

Exact [go.mod](https://raw.githubusercontent.com/microsoft/typescript-go/2bd066d87f5bafd315be9f40889d0a60b9e58e0b/go.mod)
corroborates the native dependencies identified in retained NOTICE, including xxh3,
Go JSON experiment, go-winio/go-osstat and x/sync/sys/term/text. Module lists include
test/tool dependencies and are not automatically complete compiled binary inventories.
Signature/attestation validation and reproducibility remain NOT-RUN; presence of `tsc.sig`
does not establish signature verification.

## 3. Rolldown remaining gap and smallest resolution

The [prior exact v1.2.11 research](2026-10-06-t036-rolldown-rights.md) establishes source MIT
grant and native crate/loader correspondence. Cache comparison above establishes the exact
installed binding's lock-package identity. The official
[publish workflow](https://github.com/rolldown/rolldown/blob/v1.2.11/.github/workflows/publish-to-npm.yml)
creates platform directories, moves native artifacts, copies parent license material and
declares provenance-publishing permission. A recipe is not verification of this cached
artifact's provenance attestation.

The [binding crate](https://raw.githubusercontent.com/rolldown/rolldown/v1.2.11/crates/rolldown_binding/Cargo.toml)
and [Cargo.lock](https://raw.githubusercontent.com/rolldown/rolldown/v1.2.11/Cargo.lock) identify
additional Rust dependencies. [THIRD-PARTY-LICENSE](https://raw.githubusercontent.com/rolldown/rolldown/v1.2.11/THIRD-PARTY-LICENSE)
covers copied/derived Rollup/esbuild material; it is not an explicit complete compiled-Rust
component/notice manifest. Remaining R36-02 is therefore:

`exact target/feature-selected compiled Rust subset → attributable component terms → retained obligations`

Workspace MIT or every Cargo.lock row is not sufficient. This does not prove a missing grant;
it leaves coverage UNKNOWN. Smallest resolution: obtain exact publisher native SBOM/notice
evidence, or map official exact target/feature build inputs to component legal evidence.
Prefer publisher/retained cache evidence. New crate archives, Rust installation or native
rebuilds are outside this review authority. If available evidence cannot close that specific
coverage, bring it to Project Reviewer/Legal Review without converting attestation absence
into a fabricated license prohibition.

## 4. Disposition

Six locked archive/native byte comparisons PASS. TypeScript exact source/build/legal
correspondence and Rolldown exact source grant/package byte correspondence ESTABLISHED,
with stated authenticity limits. Full Rolldown compiled Rust notice closure UNKNOWN/OPEN.
LightningCSS native bytes/legal-file identity ESTABLISHED; full Rust transitive closure and
company MPL disposition are not invented. These tools are not automatically Web runtime
payload; actual use is in R36-01 and special/future-use authority in R36-03.
Whole T036 acceptance, legal/company/commercial clearance NOT-RUN. R36-04 remains closed.
No build, listener, deployment, verifier, database or timer action occurred.

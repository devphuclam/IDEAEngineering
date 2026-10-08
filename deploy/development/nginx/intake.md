# Nginx development-entry intake and execution envelope

| Control | Value |
|---|---|
| ID / version / class | IE-RES-NGINX-DEV-49-001 / 0.1 / dependency intake and bounded execution recipe |
| Status / normativity | Draft; INFORMATIVE for product behavior |
| Repository process authority / instruction state | NOT-APPLICABLE; this recipe is not a new repository policy |
| Acceptance authority / evidence status | Project user / qualification IN_PROGRESS, independent human acceptance NOT-RUN |
| Owner / author / review | Project user / Codex, CODEX_ONLY / human review NOT-RUN |
| Authority / date | User authorizes development Nginx slice and exact two-package download/private extraction on 2026-10-08, Asia/Ho_Chi_Minh |
| Baseline / Work Item | main 7fd542b36a2a0887721b82df5dca323da8809058 / [Issue49](https://github.com/devphuclam/IDEAEngineering/issues/49) |
| Classification / retention | INTERNAL; retain package rights, hashes and sanitized results; no automatic database deletion |
| Supersession / trigger | New deployment slice, no historical acceptance rewritten; reopen for package/hash/graph/target/trust or distribution change |
| Trace | TECH-D02/TECH-D05 in [technology views](../../../docs/product/instances/idea-engineering/technology/IDEA-core-v0-technology-architecture-views.md); [intake procedure](../../../docs/agents/external-source-intake.md) |
| Downstream | control.sh, provision.sh, nginx.conf, launch.ps1, tests/nginx-dev, README.md and results.md in this slice |

This is a tailored development-intake/verification envelope under IE-STD-AUTH-001:
no product requirement, effective product baseline, standards-conformity or legal
acceptance is created. Work Item49/Git history is the change record; superseded-by
NOT-APPLICABLE. Historical product/gate/qualification evidence remains separate.

## Exact third-party inputs

Use mode **DEPENDENCY**, development host only, unmodified private extraction.
The user explicitly approves retrieving these two official Ubuntu packages, not
installing them with apt/dpkg, running maintainer scripts or enabling a service.
The host's existing cached Ubuntu metadata and non-mutating apt simulation select
only these two new packages; all shared-library prerequisites already exist.

| Package | Official HTTPS archive path | SHA-256 |
|---|---|---|
| nginx 1.28.3-2ubuntu1.11 amd64 | https://archive.ubuntu.com/ubuntu/pool/main/n/nginx/nginx_1.28.3-2ubuntu1.11_amd64.deb | f9c3041e8952741cff93b9138322ae4d8ff0d52a9b4327f25b25f87281108997 |
| nginx-common 1.28.3-2ubuntu1.11 all | https://archive.ubuntu.com/ubuntu/pool/main/n/nginx/nginx-common_1.28.3-2ubuntu1.11_all.deb | 30ddbab1f1b752677c9d4f92de038be9af9ee2cafc96d87cda41659d4d5c8142 |

The exact Ubuntu [copyright record](https://changelogs.ubuntu.com/changelogs/pool/main/n/nginx/nginx_1.28.3-2ubuntu1.11/copyright)
was read before import; SHA-256
`437401e2b26c87fbd03d3a5e6c915dbed82fe07c52863f927b34bb70dea570b0`.
It grants BSD-2-Clause for Nginx, Debian packaging and man pages, Expat for
selected packaging helpers, GPL-2+ for the Debian build helper `dh_nginx`, and
public-domain MurmurHash. That build helper is not used or shipped by IDEA.
Do not infer a blanket license from the upstream project name. Disposition:
**APPROVED-WITH-OBLIGATIONS** for this internal unmodified deployment. Preserve
the full package copyright/notice files and package archives. Maintainers own
notice retention; redistribution or modifications require renewed mapping and
the applicable source/notice obligations. No commercial/production release is
qualified here, and no new license rights are created by the user approval.

Existing Ubuntu host dependencies: libc6 2.43-2ubuntu2.4, libcrypt1 1:4.5.1-1,
PCRE2 10.46-1build1, libssl3t64 3.5.5-1ubuntu3.7, zlib1g
1:1.3.dfsg+really1.3.1-1ubuntu3.1; OpenSSL also links existing libzstd1
1.5.7+dfsg-3 (use its BSD-3-Clause option and retain the complete installed notice).
Dynamic-library paths/hashes must be frozen
after extraction and verified before each launch. They remain host dependencies,
not application JAR payload. Retain their installed copyright records beside
the deployment. No optional dynamic Nginx module is loaded.

Existing utilities are used without upgrades: dpkg-deb 1.23.7ubuntu1
(`66a1f5c65bc66cf20a35eb0695bf783bfb365bc80a45006d8a9d97fd406536e0`),
curl 8.18.0-1ubuntu2.7
(`7abff479a2c8bd06ace2d82522a8bf2b102ae917ab2a2cbfa0fc52a2178a48a6`),
OpenSSL 3.5.5-1ubuntu3.7
(`1d72cbc5bf62be3f3dbd7626c295b63c5fdc1dd8439f323ac47998d8a062b4c9`).
The installed OpenSSL copyright grants Apache-2.0 for the used binary; retain
that record, not a claim that unused source-only Perl files enter IDEA.

## Bounded deployment

- Owned Ubuntu root: `/home/phuclam/idea-nginx-dev-20261008-49`, must not exist
  before provisioning. No sudo, system service, firewall or trust-store change.
- Nginx HTTPS `127.0.0.1:18448` -> privately launched existing packaged Server
  HTTPS `127.0.0.1:18449`. Windows SSH forwarding binds only 127.0.0.1:18448.
- Reuse application source `9d3732cb173e8094195b9bdd60b5588ac3cfa42e`, JAR
  `318a52cf1e658a53bc9fa54137346c15277060667998d2f10f33454d15bb8c1c`.
  No Maven, npm installation, Java edit or rebuild. Development Swagger is enabled
  by the existing configuration flag only in the owned new runtime.
- Reuse existing synthetic database `idea_ddm_iam_ui_20261007_46`, exact schema
  `iam_ui_c3b8cde44f9a4d1199306c381c12d1bb`, migrator/app roles remain separate.
  Runtime uses app only. No migration, bootstrap, seeding, DDL or schema cleanup.
- Reuse normally trusted test certificate, SAN localhost/127.0.0.1, SHA-256
  `6cee40386182902343aeb0ad6db1110656b1c293dcc3c33fbc3fe32251d965ad`,
  expires 2026-10-14T05:19:50Z. Certificate, encrypted PEM key and password-file
  reference stay on Ubuntu; do not commit private bytes. Stop when expired.
- Upstream verification is explicit, using this certificate as dedicated trust
  and `localhost` as the verified endpoint identity. No trust-all or TLS bypass.
- Preserve predecessor preview18444, Feature00918446/Vite5173 and their
  ownership/forwards. Stop only the new owned processes and forward. Rollback
  means stop the new entry and use the unchanged predecessor path.
- Disable access logging; private error logs never become public evidence. No
  request bodies, password, cookie, CSRF or proof values in retained evidence.

## Agreed qualification seams and oracle

The user-approved seams are the Windows Start/Status/Stop commands and actual
trusted Chrome through the Nginx HTTPS entry into the existing Server contracts.
RED must demonstrate missing first-party behavior, not missing packages/cert.

1. Read-only Status reports NOT_PROVISIONED/STOPPED/RUNNING truthfully.
2. Trusted HTTPS serves packaged actual Web; anonymous session/docs refused.
3. UI sign-in -> same server-established Actor/context/accounts; cookie remains
   Secure/HttpOnly/Strict/host-only and unavailable to JavaScript.
4. Bad CSRF refused; authenticated Swagger and allowlisted assets work, direct
   Swagger WebJars/unknown asset remain404. Valid logout204 -> session401.
5. Proxy-owned Stop closes only18448/18449; Start retains the synthetic Actor,
   account and credential. Old proof401 after backend restart, fresh sign-in200.
6. Fail closed on untrusted TLS, wrong upstream identity, unexpected Host/Origin,
   ownership conflict, occupied port, unavailable upstream or input/hash drift.

Use installed Chrome155.0.8059.39 (hash
`d3784ffbf1f6109348416064b3e4cd739b06fa61d89a81b262c780df9f32270c`),
already retained Playwright/playwright-core1.62.1 LICENSE/NOTICE/third-party
notices under the [browser intake](../../../docs/research/2026-10-01-t043-browser-tool-intake.md)
(bounded successor use here, internal test only), and project-admitted Windows
Node24.19.0/hash3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237.
No browser download, package addition, screenshots/HAR/trace or secret diagnostics.

Status initially NOT-RUN. Record exact execution source and actual results in
`results.md`. This is development deployment qualification, not production,
LAN rollout, HA, certificate renewal, general proxy hardening or Gateway byte
transport qualification. Verifier and whole feature reruns remain NOT-RUN.

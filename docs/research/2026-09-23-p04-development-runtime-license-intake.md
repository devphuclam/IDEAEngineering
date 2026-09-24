# P04 Development Runtime and License Intake

| Field | Value |
|---|---|
| Stable knowledge ID | `IE-RES-PH0-DEP-20260923-001` |
| Document class / title | `IE-RES` / P04 Development Runtime and License Intake |
| Version / status | `1.2` / `Draft` |
| Product normativity | `INFORMATIVE`; creates no Feature, requirement, technology selection or permission to deploy |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Evidence date | 2026-09-23 (Asia/Ho_Chi_Minh) |
| Owner / author | Principal Product Author / Principal Product Author |
| Reviewer / acceptance authority | Project Reviewer confirmed the company-size/revenue input used for the historical Docker candidate; independent legal/license review `NOT-RUN`. The current development server operator is the Project Reviewer; later accepted-deployment ownership is separate. |
| Applicable baseline | `IE-INC-READY-001`; historical Windows/Docker P04 candidate; selected Ubuntu development successor is recorded in `environment-profile.md@0.9` |
| Scope / intended use | Historical intake of Docker Desktop on Windows, PostgreSQL 18 Docker Official Image and Windows Eclipse Temurin 25 ZIP. These are no longer the selected P04 development dependencies. Native Ubuntu package intake remains separate and `NOT-RUN`. |
| Source / upstream trace | Repository external-source intake rules; official Docker, PostgreSQL/Docker Official Image and Adoptium sources cited below; user-confirmed eligibility input |
| Downstream trace | [`environment-profile.md`](../../specs/004-technical-pilot-readiness/environment-profile.md); [`readiness-register.md`](../../specs/004-technical-pilot-readiness/readiness-register.md); D5 and future dependency locks |
| Change / Work Item trace | `IE-INC-READY-001`; T014, T017 and T021; no Product Change Record required because this is readiness evidence only |
| Supersedes / superseded by | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Classification / retention | `INTERNAL`; retain with the P04/D5 readiness package and exact dependency qualification successors |
| Review trigger | Company eligibility facts, upstream license/terms, selected image/archive/version, intended distribution, deployment context or commercial-use boundary changes |
| Evidence status / authority limit | Mixed: official source facts plus attributable user input. Remote SPDX attestation availability and an exploratory local Debian OVAL comparison are recorded for the pinned `linux/amd64` digest; no Debian Trixie OVAL match was found for its 201 Debian package entries. This is not a qualified whole-image CVE scan: four Go components are outside that feed, and per-package license/notice review, Docker Scout analysis, image pull and runtime checks remain `NOT-RUN`. Trivy `0.74.0` is assessed in §9 as a candidate for a controlled local trial; it is not installed or qualified. This is not legal advice, Product approval, PG4 approval or permission to pull. |

## 1. Result

**Current P04 disposition (2026-09-23):** The Project Reviewer selected a new Ubuntu Server 26
for Java Server, Web, native PostgreSQL and one filesystem Vault development. Windows remains the
Desktop/Workspace/CAD platform. The Docker image and Windows Temurin ZIP findings below are
retained as historical research; their eligibility or exact pins do not qualify the new native
Ubuntu packages. See [the current environment profile](../../specs/004-technical-pilot-readiness/environment-profile.md)
and [runbook](../../deploy/development/README.md). No Ubuntu dependency installation or runtime
result is claimed by this record.

| Subject | Evidence-based disposition | What remains before use |
|---|---|---|
| Docker Desktop `29.7.2` | `ELIGIBLE-FOR-FREE-COMPANY-USE — USER-CONFIRMED` | On 2026-09-23, the project user explicitly confirmed that the company has fewer than 250 employees **and** less than USD 10 million in annual revenue. Reopen if either fact or Docker's terms change. |
| PostgreSQL 18 Docker Official Image | `REMOTE SBOM VERIFIED; EXPLORATORY OVAL MATCH 0; IMAGE INTAKE INCOMPLETE` | Development pin: `postgres:18.6-trixie@sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae`; `linux/amd64` manifest `sha256:0377e72c5289ed2f98cf61b1a9c2db9eb9d300317fe14244492fbc94343b3d04`; source revision `e00e1bd34ec5c8a8e7ad89b273b3d42efaf6d5bc`. The local Debian OVAL comparison found no match among 201 Debian/Trixie package entries; four Go components are outside its coverage. This is not a whole-image `PASS`. Per-package license/notice review, qualified whole-image CVE review, pull and runtime remain `NOT-RUN`; use is not authorized by this record. |
| Eclipse Temurin 25 | `SELECTED IDENTITY — INSTALLATION NOT-RUN` | Portable Windows x64 ZIP: `OpenJDK25U-jdk_x64_windows_hotspot_25.0.4.1_1.zip`, SHA-256 `00c847d804f4a78e9f04f2683faf14fed898535b177b7fc704486cb0284e9283`. Planned location: `C:/IDEA-DDM/tools/temurin-25.0.4.1+1`. Download, checksum/signature verification and runtime check remain `NOT-RUN`. |

No component was installed and no PostgreSQL image layer was downloaded or pulled. The exact
remote SPDX attestation was processed in memory. The authorized Debian OVAL feed was downloaded
to the system temporary directory and parsed locally; its checksum and generator timestamp are
recorded in §3.2. No SBOM, image layer or scanner artifact was retained in the repository.

## 2. Docker Desktop company-use condition

Docker states that Docker Desktop is governed by the Docker Subscription Service Agreement. Its
official licensing page says unpaid use is available to a commercial undertaking only when it has
**fewer than 250 employees and less than USD 10 million in annual revenue**. Larger organizations
and government entities require a paid subscription. On 2026-09-23, the project user explicitly
confirmed that the company satisfies both free-use thresholds. This closes the project-level
Docker Desktop eligibility question; it is an attributable user confirmation, not independent
legal advice or a general approval for unrelated Docker services.

The official agreement also distinguishes company/employment use from personal developer use.
Therefore the fact that one engineer runs Docker Desktop does not turn this project into personal
use.

Recorded closure evidence:

1. project-user confirmation of both company threshold facts on 2026-09-23;
2. observed Docker Desktop version `29.7.2` on the selected development workstation;
3. scope limited to internal Core v0 development; no Docker Desktop redistribution is proposed.

Primary sources:

- [Docker Desktop license agreement](https://docs.docker.com/subscription-billing/desktop-license/)
- [Docker Subscription Service Agreement](https://www.docker.com/legal/docker-subscription-service-agreement/)
- [Docker Desktop for Windows — terms and installation](https://docs.docker.com/desktop/setup/install/windows-install/)

## 3. PostgreSQL 18 image provenance and license

The intended image is the `postgres` Docker Official Image maintained by the PostgreSQL Docker
Community. Docker's own source repository warns that this is Docker Official Image packaging and
not an upstream PostgreSQL-provided image. The current official-images library lists a concrete
PostgreSQL 18 patch line, but tags can move as images are rebuilt. Reproducible setup therefore
requires a platform-appropriate immutable digest resolved at the approved intake date.

The selected local-development identity was inspected without pulling the image on 2026-09-23:

- tag: `postgres:18.6-trixie`;
- multi-platform index digest: `sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae`;
- Windows Docker Desktop target platform: `linux/amd64`;
- `linux/amd64` manifest digest: `sha256:0377e72c5289ed2f98cf61b1a9c2db9eb9d300317fe14244492fbc94343b3d04`;
- packaging source revision: `e00e1bd34ec5c8a8e7ad89b273b3d42efaf6d5bc`;
- base image declared by the manifest: `debian:trixie-slim`.

PostgreSQL itself uses the PostgreSQL License, which permits use, copying, modification and
distribution subject to retaining its required notice. The `docker-library/postgres` packaging
source at the selected revision uses the MIT license, which also requires preserving its notice
when the covered material is copied or distributed. These are checks of the two named source
components, **not** an approval of every layer in the published image. The image also contains
Debian base-distribution and other packages whose exact licenses and notices have not been
inventoried for the selected `linux/amd64` manifest. No claim is made that the complete image is
ready for future commercial redistribution.

The exact-digest SPDX attestation availability was verified remotely on 2026-09-23 (details in
§3.1). No image layers were fetched. The SBOM itself was inspected in memory and not retained as a
repository artifact. Its SPDX package inventory has not yet had a complete package-by-package
license and notice review. The local Debian OVAL comparison in §3.2 found no matching Trixie
definitions for the listed Debian package entries, but it is exploratory and does not cover the
four Go components in the SBOM. It is not a whole-image CVE result. Current public tag pages and
generic PostgreSQL CVE lists are not substitutes for analysis of the selected digest. Docker documents a
CLI route that can analyze an SPDX or in-toto SBOM input, so a vulnerability review can be planned
without resolving or downloading image layers. Docker Scout's data-handling documentation says
image-analysis metadata is transmitted to Docker Scout. On 2026-09-23 the Project Reviewer
reported that permission had been granted to send the pinned image's SBOM metadata for analysis;
the underlying approval record was not inspected. A non-interactive `docker scout cves sbom://`
attempt then returned `Log in with your Docker ID or email address to use docker scout.` and
produced no vulnerability result. No account credential was provided or entered. The Docker
Scout analysis remains `NOT-RUN` because the Project Reviewer has no Docker account. Retain
tool/version, advisory date, input SBOM digest, image digest, findings and accepted
remediation/exception decision for any later qualified whole-image scan.

### 3.1 Exact-digest remote SBOM evidence (2026-09-23)

A read-only Docker Registry API inspection confirmed that the pinned index digest resolves to the
same OCI index and contains a `linux/amd64` manifest with the pinned child digest. The index also
contains an attestation manifest explicitly associated with that child digest. Its in-toto JSON
layer is annotated with predicate type `https://spdx.dev/Document`; the layer's declared SHA-256
was verified against the retrieved SBOM bytes. The in-toto statement subject names
`postgres:18.6-trixie` for `linux/amd64` and carries the exact child digest above. The payload
declares SPDX 2.3 and contains 206 package records. This confirms that the exact-platform SBOM is
available from the registry without retrieving the image's filesystem layers. It does **not** show
that the license obligations are reviewed or that the image is authorized for use.

The remote attestation was then extracted with `docker buildx imagetools inspect` into process
memory only and parsed without saving the SBOM or downloading image layers. Of the 206 package
records, 191 have a populated `licenseDeclared` expression, one declares `NOASSERTION`, and 14
have no declared-license value. All 206 have `licenseConcluded=NOASSERTION`, and none provides a
substantive `copyrightText` value. Therefore these fields are useful inventory leads, not a
completed license/notice review: the generated SBOM does not establish which license option
applies or supply the notice texts that must be retained.

Docker's documented remote-image method can extract an SBOM attestation from a registry with
`docker buildx imagetools inspect ... --format "{{ json .SBOM }}"`; Docker Scout also documents
`sbom://` input for SPDX files or in-toto attestations. These are suitable no-image-layer paths
when a matching attestation already exists. If it does not exist, Docker Scout says it creates an
SBOM by indexing image contents; that fallback is not treated here as no-pull. The Scout CLI also
has a registry-source mode, but source selection alone is not evidence that an operation avoids
fetching image layers.

The exact SBOM bytes were not retained. The available observation is therefore provenance and
availability evidence, not a completed license inventory. Debian Policy states that each Debian
package is accompanied by its distribution license copy in
`/usr/share/doc/PACKAGE/copyright`. Before any future redistribution conclusion, retain and review
the relevant notices/license texts for the Debian packages and other included components, in
addition to reviewing SPDX license fields and any `NOASSERTION`/custom expressions. The SPDX file
alone is not accepted here as proof that every applicable notice has been captured or assessed.

For a no-image-layer vulnerability analysis, Docker documents `docker scout cves` input via
`sbom://` and supports SPDX/in-toto SBOM input. Docker's data-handling page states that local image
analysis transmits PURLs and layer digests to the Docker Scout platform (and says this local
analysis data is not persistently stored there). The Project Reviewer reported that permission for
this external analysis has been granted on 2026-09-23; the approval record was not independently
inspected. The attempted SBOM scan stopped at the Docker Scout sign-in requirement and returned no
result. No credentials were entered; Docker Scout analysis remains `NOT-RUN` because the Project
Reviewer has no Docker account. The separate local Debian-only comparison is recorded in §3.2.

PostgreSQL 18 also changes the image's data layout: the documented `PGDATA` is
`/var/lib/postgresql/18/docker`, while the volume target is `/var/lib/postgresql`. A later Compose
file must follow that layout and must not be copied from an older-major example without review.

### 3.2 Authorized local Debian OVAL comparison (2026-09-23)

At the Project Reviewer's request and with explicit authorization, the Trixie OVAL feed was
retrieved from Debian over HTTPS:
[`oval-definitions-trixie.xml.bz2`](https://www.debian.org/security/oval/oval-definitions-trixie.xml.bz2).
The downloaded file was 9,551,111 bytes (SHA-256
`3CA9C13F6193C2B670695D6204844DFD52A78EF5930FE548AF8DE9ABE8B998DD`). Its XML generator reports
schema `5.11.2` and timestamp `2026-09-23T07:25:27.188-04:00`. It was read from the system
temporary directory; no scanner or software package was installed.

For a local comparison, the exact `linux/amd64` SPDX attestation blob already identified in §3.1
was fetched from the public registry and processed in memory; no image layers were requested, and
no package list or PURL was sent to an external service. The SPDX 2.3 document contained 206
records: 205 versioned, uniquely named packages; 201 had Debian Trixie 13 package URLs and four
were Go components (`github.com/moby/sys/user`, `github.com/tianon/gosu`, `golang.org/x/sys` and
`stdlib`).

A one-off local evaluator compared Debian package names and full package versions against the
Trixie OVAL criteria. It applied the Debian epoch, upstream-version and Debian-revision ordering
described by `deb-version(7)`, preserving each definition's AND/OR logic. For the pinned profile,
the Debian 13 release gate was matched to the SBOM and the architecture-existence gate to the
`linux/amd64` manifest. The retrieved feed contained 55,430 definitions (55,412 with CVE
references); the evaluator reported no unsupported test/criterion forms, no unresolved CVE
definitions and no package/version match among the 201 Debian entries.

This result is limited to the Debian Trixie rules and the packages represented in this registry
SBOM. The four Go components are outside the feed. The one-off evaluator was not independently
validated against a maintained OVAL/SBOM scanner and was not retained as project tooling; it is
therefore a useful local comparison, not a qualified whole-image vulnerability scan and not proof
that the image is “clean.” The Debian `debsbom sec-scan` manual documents a purpose-built SBOM
scanner using Debian Security Tracker data, but that tool and its separate database were not
installed or used. Keep the formal whole-image CVE review `NOT-RUN` until a qualified scan covers
the exact digest and all SBOM components. The Docker Scout route also remains unavailable without
a Docker account.

Primary sources:

- [Debian Trixie OVAL feed index and published file](https://www.debian.org/security/oval/)
- [Debian Security Tracker methodology](https://security-team.debian.org/security_tracker.html)
- [Debian package-version comparison rules (`deb-version(7)`)](https://manpages.debian.org/trixie/dpkg-dev/deb-version.7.en.html)
- [`debsbom sec-scan` manual](https://manpages.debian.org/unstable/debsbom/debsbom-sec-scan.1.en.html) (reference only; not installed or used)

Remaining evidence before calling the image qualified:

1. retained notice text and an SBOM-based license inventory for the exact image, including base
   and transitive packages;
2. dated vulnerability review of that same digest, with findings and disposition;
3. local database-data location and backup/disposal owner;
4. record the Project Reviewer's reported company authorization for image use in the P04 evidence,
   followed by first pull/start result and PostgreSQL version/health evidence.

Primary sources:

- [PostgreSQL License](https://www.postgresql.org/about/licence/)
- [`docker-library/postgres` source and provenance](https://github.com/docker-library/postgres)
- [Pinned packaging license at `e00e1bd`](https://github.com/docker-library/postgres/blob/e00e1bd34ec5c8a8e7ad89b273b3d42efaf6d5bc/LICENSE)
- [Docker Official Image source-of-truth entry for PostgreSQL](https://github.com/docker-library/official-images/blob/master/library/postgres)
- [PostgreSQL Docker Official Image documentation](https://github.com/docker-library/docs/blob/master/postgres/README.md)
- [PostgreSQL 18 `PGDATA` and volume behavior](https://github.com/docker-library/docs/blob/master/postgres/content.md)
- [Docker Registry API pinned multi-platform index](https://registry-1.docker.io/v2/library/postgres/manifests/sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae) (read-only metadata; accessed 2026-09-23)
- [Docker Registry API pinned `linux/amd64` manifest](https://registry-1.docker.io/v2/library/postgres/manifests/sha256:0377e72c5289ed2f98cf61b1a9c2db9eb9d300317fe14244492fbc94343b3d04) (read-only metadata; accessed 2026-09-23)
- [Docker Registry API exact-platform SPDX attestation blob](https://registry-1.docker.io/v2/library/postgres/blobs/sha256:05d71ffe696fbee4520f720f3686a8242c68ca16ad938e73ede946ad9a9b925d) (accessed 2026-09-23; blob digest verified in memory; no image layers fetched)
- [Docker Scout SBOMs and remote extraction](https://docs.docker.com/scout/how-tos/view-create-sboms/)
- [`docker scout sbom` CLI reference](https://docs.docker.com/reference/cli/docker/scout/sbom/)
- [`docker scout cves` CLI reference](https://docs.docker.com/reference/cli/docker/scout/cves/)
- [Docker Scout data handling](https://docs.docker.com/scout/deep-dive/data-handling/)
- [Debian Policy: copyright information in each package](https://www.debian.org/doc/debian-policy/ch-docs.html#copyright-information)

## 4. Eclipse Temurin 25 provenance and license

Adoptium states that Eclipse Temurin binaries are provided at no cost under GNU GPL version 2 with
the Classpath Exception. Adoptium's support roadmap classifies Java 25 as an LTS line and currently
states availability through at least September 2031; this is a community release roadmap, not a
company support SLA.

The official `temurin25-binaries` releases publish per-platform assets, checksums and signatures.
For the selected Windows development machine, Q11 pins:

- release: `jdk-25.0.4.1+1`;
- asset: `OpenJDK25U-jdk_x64_windows_hotspot_25.0.4.1_1.zip`;
- asset SHA-256: `00c847d804f4a78e9f04f2683faf14fed898535b177b7fc704486cb0284e9283`;
- checksum-file asset SHA-256: `4cbb1a51d939fe05da9204e10bf620f8650cb1ea8cf41eaf7ed6fe31434da1a5`;
- signature asset SHA-256: `11bb89dc4c19d5cce5ba79d43b5519aa718e37c85a091a446e8f8be343c2ebd3`;
- planned extraction root: `C:/IDEA-DDM/tools/temurin-25.0.4.1+1` outside Git;
- activation rule: repository-owned development scripts set process-local `JAVA_HOME`; they do not
  modify the workstation-wide `PATH`.

This selection does not imply paid vendor support and does not authorize installation during PH0.

Remaining closure evidence before reporting the JDK ready:

1. downloaded-byte SHA-256 and signature verification result;
2. retained GPL-2.0-with-Classpath-Exception license/notice;
3. permitted workstation extraction and patch owner;
4. `java -version` evidence from the planned location;
5. reopen review for later Temurin patch releases.

Primary sources:

- [Adoptium licensing FAQ](https://adoptium.net/docs/faq)
- [Temurin support and release roadmap](https://adoptium.net/support/)
- [Official Temurin 25 binary releases](https://github.com/adoptium/temurin25-binaries/releases)

## 5. P04 effect

- The selected development shape remains unchanged: Backend/Web/Desktop/Workspace run on Windows;
  Docker is limited to the PostgreSQL development dependency; the first Vault is a host filesystem
  directory outside Git.
- Docker Desktop company-use eligibility is confirmed for the current company facts and internal
  development scope. The pinned PostgreSQL image has a registry-hosted SPDX attestation bound to
  the pinned `linux/amd64` manifest; this closes only the remote-SBOM-availability question.
- PostgreSQL `18.6-trixie` is pinned for temporary local development only; this does not select
  Docker as the Server deployment model. The Project Reviewer reported that company permission
  covers internal use of the pinned image and Docker Scout analysis; the approval record has not
  been inspected. The local OVAL comparison found zero Trixie definition matches among 201 Debian
  SBOM packages; four Go components remain outside that comparison, so the whole-image CVE review
  remains `NOT-RUN`. Per-package license/notice review, Docker Scout analysis, pull and runtime
  evidence also remain `NOT-RUN`. The Scout command returned a sign-in requirement and no result;
  the Project Reviewer has no Docker account.
- On 2026-09-23 Docker Engine became available (`29.7.2`) and the development Compose file
  validated successfully without printing configuration values. Host port `5432` was already
  listening, so only the local `IDEA_DATABASE_PORT` setting was changed to `5433`; the existing
  PostgreSQL service was not stopped or modified. No image was pulled and no container was
  created or started. The pinned image intake gates above still apply.
- The Project Reviewer has now set `IDEA_DATABASE_BOOTSTRAP_PASSWORD` in the ignored local
  environment file. A presence-only check confirmed it is set; the secret value was not read or
  printed. This removes the local password-entry prerequisite, but does not bypass the image
  license and vulnerability intake gates below.
- Temurin `25.0.4.1+1` portable Windows x64 ZIP is pinned for the Backend development toolchain.
  Download, verification, extraction and runtime evidence remain `NOT-RUN`.
- This evidence does not alter the approved Tech baseline, authorize PH1, close D5 or turn P04 into
  `PASS`.

## 6. Change record

| Version | Date | Change | Evidence |
|---|---|---|---|
| 0.1 | 2026-09-23 | Recorded Docker eligibility input and pinned PostgreSQL/Temurin identities without installing or pulling. | Project user; official sources cited above |
| 0.2 | 2026-09-23 | Checked the PostgreSQL and pinned packaging licenses, separated those direct-source rights from the still-missing whole-image license/SBOM/CVE review, and linked the prepared local Compose instructions. No image was pulled or run. | Official PostgreSQL, docker-library and Docker Scout sources; [local preparation](../../deploy/development/README.md) |
| 0.3 | 2026-09-23 | Verified that the pinned `linux/amd64` image has a registry-hosted SPDX 2.3 attestation bound to its exact manifest digest, without retrieving image layers. Clarified that a package-level license/notice review is still incomplete and Docker Scout's documented SBOM-based CVE route was not run because external-data handling authorization is unconfirmed. No image was pulled or run; no product or technology baseline changed. | Read-only Docker Registry API evidence; official Docker Scout and Debian Policy documentation cited in §3.1 |
| 0.4 | 2026-09-23 | Recorded Docker Engine readiness and quiet Compose validation. Moved only the local database port setting from occupied `5432` to available `5433`; left the existing PostgreSQL service untouched. No image pull, container creation or runtime check occurred. | Local Docker Engine and Compose validation; local port-listener check |
| 0.5 | 2026-09-23 | Parsed the exact-platform registry SBOM in memory: 191 populated declared-license expressions, 1 `NOASSERTION`, 14 empty/unset; all 206 conclusions are `NOASSERTION` and no substantive copyright-text notices are included. This confirms that package-level notice review is still incomplete. No image layers, local SBOM artifact or image/container were created; no external Docker Scout analysis was run. | Pinned registry SBOM attestation; local in-memory field count |
| 0.6 | 2026-09-23 | Recorded the Project Reviewer's report that internal image use and external SBOM analysis are permitted. Attempted a streamed SBOM-only Docker Scout scan; it stopped at the account sign-in requirement and returned no findings. Recorded that the local bootstrap-password variable is absent. No credentials were entered, no image layers were pulled, and no container was created or started. | User confirmation; Docker Scout CLI output; quiet local environment-variable presence check |
| 0.7 | 2026-09-23 | Assessed no-account/local-only CVE review options for the pinned image. No usable local scanner/advisory database was present; Docker Scout offline mode does not establish one, and permitted alternatives would require downloading a vulnerability database or sending package identifiers externally. Kept the CVE review `NOT-RUN`; no image layers/database were downloaded and no package metadata was sent externally. | Official Docker and Debian documentation; read-only local tool/cache checks |
| 0.8 | 2026-09-23 | Recorded that the Project Reviewer has set the local bootstrap password (presence checked only; value not read), and confirmed quiet Compose validation still passes, port `5433` is free, and the pinned image is not local. The Reviewer has no Docker account, so Docker Scout sign-in is unavailable; no account was requested or created. No image pull or container start occurred; CVE review remains `NOT-RUN`. | User confirmation; quiet local environment-variable check; `docker compose config --quiet`; local port and image checks |
| 0.9 | 2026-09-23 | Recorded the authorized Debian Trixie OVAL feed retrieval and checksum, parsed its generator timestamp, and performed an exploratory local match against the exact registry SPDX inventory. No Debian Trixie rule matched the 201 Debian package entries; four Go components are outside the feed. Kept formal whole-image CVE review `NOT-RUN` because the one-off evaluator is not independently qualified and does not cover all SBOM components. No image layers were fetched, no software was installed, and no package metadata was sent externally. | Official Debian OVAL feed; exact-platform registry SBOM; local in-memory criteria/version comparison; official Debian version-ordering and `debsbom` documentation |
| 1.0 | 2026-09-23 | Assessed `debsbom sec-scan` as a possible Debian-focused local cross-check. Verified upstream release `0.10.2`, Debian package versions, MIT/Expat license record, documented SBOM/tracker behavior and Linux/Python fit. Kept it reference-only: no software or database was downloaded, no tool was installed or run, and dependencies and operational suitability remain unqualified. Whole-image CVE review remains `NOT-RUN`. | Debian package metadata and copyright record; Debian manual; tagged upstream release, source and package metadata |
| 1.1 | 2026-09-23 | Assessed Trivy `0.74.0` as a better-fit candidate for a controlled local trial because its documented coverage includes Debian OS packages, Go components and package-license classification. Recorded Apache-2.0 for the tool, telemetry/data-fetch behavior, and outstanding review of transitive dependencies and source-specific advisory-data terms. No tool, image layers or vulnerability database was downloaded; no scan was run. Whole-image CVE and package-license reviews remain `NOT-RUN`. | Official Trivy release, license, vulnerability/license/database/telemetry documentation, and documented advisory-source records |
| 1.2 | 2026-09-23 | Record the Project Reviewer's replacement of temporary Windows/Docker P04 development with a new Ubuntu Server 26 using native PostgreSQL and one filesystem Vault. Preserve this document as historical intake; native Ubuntu package qualification remains separate and `NOT-RUN`. | User environment decision; `environment-profile.md@0.9`; Ubuntu development runbook |

## 7. Initial no-account, local-only CVE route assessment (before §3.2)

The registry-hosted SPDX 2.3 attestation can be supplied to `docker scout cves` through its
documented `sbom://` input, but the SBOM records package facts; it does not itself contain the
advisory database needed to determine which package versions are affected. Docker documents that
Scout matches SBOM package metadata against vulnerability advisories. Its documented offline
switch (`DOCKER_SCOUT_OFFLINE=true`) means indexing does not make outbound requests; the official
documentation does not state that this mode includes a local CVE/advisory database or bypasses the
Scout account requirement for vulnerability analysis.

The initial read-only check found no cached Scout SBOM or temporary analysis data (`docker scout
cache df`), and no `trivy`, `grype`, `osv-scanner`, `syft`, `debsecan` or `oscap` executable
available on `PATH`. The previous Scout SBOM attempt stopped at the Docker account sign-in prompt.
The Project Reviewer confirmed they do not have a Docker account. No account was requested or
created, and no SBOM/package metadata was sent to an external analysis service in this check.

Debian identifies its Security Tracker as the primary source and separately publishes JSON and
OVAL vulnerability data. At the time of this initial assessment, downloading an advisory database
was outside the then-approved scope; querying the tracker per SBOM package would also transmit
package identifiers externally. The Project Reviewer later authorized a local download of the
official Trixie OVAL feed; that retrieval and comparison are recorded in §3.2. No maintained
whole-image or SBOM evaluator is installed on this workstation.

Disposition: exact SBOM availability remains verified; whole-image CVE review remains
`NOT-RUN`, not `PASS` or “no known vulnerabilities.” In the initial assessment, no image was
pulled, no layer was downloaded, no scanner or database was installed/downloaded, no account was
created, no package metadata was transmitted, and no server was accessed. Later local OVAL actions
are documented in §3.2. Separately, the bootstrap password is now present in the ignored local
environment file, Compose syntax passes, port `5433` is free and the pinned image is not present
locally. These preparation checks do not satisfy the remaining image intake gates.

Primary sources:

- [Docker Scout CVE command and `sbom://` input](https://docs.docker.com/reference/cli/docker/scout/cves/)
- [Docker Scout analysis and advisory matching](https://docs.docker.com/scout/explore/analysis/)
- [Docker Scout offline-mode behavior](https://docs.docker.com/scout/how-tos/configure-cli/)
- [Docker Scout data handling](https://docs.docker.com/scout/deep-dive/data-handling/)
- [Debian security information sources](https://www.debian.org/security/)
- [Debian OVAL feed index](https://www.debian.org/security/oval/) (Trixie feed size observed 2026-09-23)

## 8. Candidate assessment: `debsbom sec-scan` (2026-09-23)

This section evaluates whether `debsbom sec-scan` is a reasonable next candidate for a local
cross-check. It does not authorize installation, execution, or use as a release/security gate.

### 8.1 What it does and what it could cover

The tagged upstream release `v0.10.2` and Debian manual describe `sec-scan` as reading an SPDX or
CycloneDX SBOM and checking referenced Debian source packages against Debian Security Tracker
data. It can report text, JSON, SARIF or VEX. The default distribution is Trixie when an SBOM
component lacks distribution information. This is a plausible second comparison for the Debian
package subset of the pinned PostgreSQL image, whose existing registry SBOM is SPDX 2.3. It is not
a general-purpose scanner for every ecosystem in that image: the four Go components noted in §3.2
are outside the Debian package-tracker scope.

The manual documents a local JSON database path
(`~/.cache/debsbom/security-tracker.json`) and says `--update-db` downloads the tracker database
from the configured tracker URL and stores it at that path. Inspection of the tagged v0.10.2
command code shows a download when `--update-db` is set **or** when the local database is missing;
after that, the scanner reads the SBOM and local JSON database. No SBOM-upload path appears in
that command implementation. This is source inspection, not a runtime network audit, so any later
use should still be run in a controlled environment. The command's own documentation says it can
run air-gapped when the database has already been downloaded. No package identifiers or SBOM were
sent by this project to the tool; no tracker database was downloaded for it.

### 8.2 Source, license and operating fit

The latest upstream release reviewed is `v0.10.2` (2026-09-07). Debian publishes `0.10.2-1` in
Sid (unstable) and Forky (testing); Trixie backports lists `0.10.1-1~bpo13+1`. Therefore, do not
assume the latest upstream version is the version available through the Trixie package channel.

Debian's copyright record identifies both the upstream code and Debian packaging as Expat/MIT
licensed; the upstream release also carries an MIT license. It permits commercial use subject to
retaining the copyright and permission notice when redistributing covered copies or substantial
portions. This conclusion covers `debsbom` itself, not its Python dependencies or Debian tracker
data. Those require separate license/terms checks if they are downloaded, installed or
redistributed.

The tool is a Python CLI. Upstream requires Python 3.11 or later and classifies the supported OS
as POSIX Linux. Debian package metadata lists Python 3 and Debian-oriented Python libraries as
dependencies; other capabilities, including SPDX/CycloneDX parsing, have additional related
packages. No official Windows support is declared. Thus it is not a qualified native Windows
tool for this workstation. A Linux environment would be needed for the documented Debian-package
path; whether an already approved Linux environment is available for this task is `UNKNOWN`.

### 8.3 Disposition

| Question | Finding |
|---|---|
| Source and license suitable for evaluation? | `YES, RESEARCH-ONLY`. `debsbom` is MIT/Expat licensed; dependencies and tracker-data terms are not yet reviewed. |
| Does it cover the whole image? | `NO`. Its documented source is Debian's Security Tracker; non-Debian components need separate coverage. |
| Is it ready to install or run here? | `NO`. It is not installed, Windows use is unqualified, and the runtime plus exact dependency set have not been qualified. |
| Can it replace the formal CVE gate now? | `NO`. No run was performed; dependency licenses, tracker-data terms and controlled runtime behavior remain unverified. |

Disposition: `REFERENCE-ONLY / NOT-INSTALLED / NOT-QUALIFIED`. If the Project Reviewer later
authorizes a trial, first select an approved Linux environment and exact package/dependency
versions; record dependency licenses and tracker-data terms; prepare and date the tracker
database; then run the exact pinned SPDX input and retain the complete result. Even then, treat it
as one Debian-focused evidence source, not proof that the whole image has no vulnerabilities.

Primary sources:

- [Upstream release `v0.10.2`](https://github.com/siemens/debsbom/releases/tag/v0.10.2)
- [Debian Sid package `debsbom 0.10.2-1`](https://packages.debian.org/en/sid/debsbom)
- [Debian Trixie Backports package `debsbom 0.10.1-1~bpo13+1`](https://packages.debian.org/en/trixie-backports/debsbom)
- [Debian Forky package `debsbom 0.10.2-1`](https://packages.debian.org/en/forky/debsbom)
- [Debian copyright record for `debsbom 0.10.2-1`](https://metadata.ftp-master.debian.org/changelogs//main/d/debsbom/debsbom_0.10.2-1_copyright)
- [`debsbom sec-scan` manual](https://siemens.github.io/debsbom/commands/sec-scan.html)
- [Tagged v0.10.2 scan command source](https://github.com/siemens/debsbom/blob/v0.10.2/src/debsbom/commands/security_scan.py)
- [Tagged v0.10.2 scanner source](https://github.com/siemens/debsbom/blob/v0.10.2/src/debsbom/securityscan/scanner.py)
- [Tagged v0.10.2 package metadata](https://github.com/siemens/debsbom/blob/v0.10.2/pyproject.toml)
- [Debian Security Tracker release list](https://security-tracker.debian.org/tracker/data/releases)

## 9. Candidate assessment: Trivy `0.74.0` (2026-09-23)

This assessment follows the Project Reviewer's direction to use an independently selected local
tool rather than wait for a QLHT-provided scanner. It is a research-backed recommendation only:
it does not authorize downloading/installing Trivy, downloading its databases, fetching image
layers, or treating any future scan result as a security approval.

### 9.1 Why this is a better fit for the pinned image

The pinned PostgreSQL image SBOM contains 201 Debian package entries and four Go components not
covered by the earlier one-off Debian OVAL comparison. Trivy's current documented sources include
Debian's Security Bug Tracker/OVAL for Debian OS packages, and both GitHub Advisory Database (Go)
and Go Vulnerability Database for Go packages. Its documentation also describes detection of
non-packaged Go binaries when embedded module information is available. This offers one toolchain
that can cross-check both gaps in the current exploratory comparison; it does not guarantee that
every component is identifiable or that every advisory is detected.

Trivy also documents package-license scanning for OS package managers such as `apt`, and an
extended mode that inspects license files within the image. It classifies licenses into broad risk
categories and marks unrecognized results `UNKNOWN`; these are screening results, not a legal
opinion. A reviewer must inspect the package's actual license and required notices before deciding
whether the image may be used or redistributed.

### 9.2 License, source data and privacy

The Trivy `v0.74.0` source repository identifies Apache License 2.0. The `trivy-db` source
repository also identifies Apache-2.0 for its database-building code. These code licenses permit
commercial use subject to their conditions, including preserving required notices when
redistributing the tool. This does not by itself clear every compiled dependency or every advisory
record bundled into a database. Trivy's own source table marks the two Go advisory sources as
commercially usable. GitHub's current terms license the GitHub Advisory Database under CC-BY-4.0
and allow attribution by linking to the database or records used. This is one source only: the
exact rights/attribution obligations of the remaining source records and any future redistribution
of a database or report still need source-by-source review. The tool's release
`bom.json` and notices should be inspected before a controlled trial, and a fuller dependency
license inventory is required before ever bundling it with IDEA.

Trivy downloads vulnerability data from its configured registry sources into a local cache. Its
documentation says usage telemetry can include an opaque installation identifier, Trivy version,
operating system and non-revealing scan options; it says scan results, image names and paths are not
collected, and provides `--disable-telemetry`. Any trial should set telemetry off, avoid Trivy
Cloud/upload features, pin the exact image digest and save results locally. The scanner will need
network access to obtain the database; scanning the image from its registry may also fetch image
layers to the workstation. That data movement must be made explicit before the trial.

### 9.3 Disposition and remaining qualification

| Question | Finding |
|---|---|
| Can it address the known coverage gap? | `PROMISING`: documented coverage includes Debian OS packages and Go advisories/components; actual coverage of this exact SBOM remains `NOT-RUN`. |
| Can it help with license inventory? | `YES, AS SCREENING`: package-license detection is available; unknowns and required notices still need human review. |
| Is the tool license commercially usable? | `Apache-2.0` for the Trivy code reviewed at `v0.74.0`, subject to license conditions. This is not clearance of all bundled dependencies or advisory data. |
| Is the source-data license fully cleared for product redistribution? | `NO / NOT-REVIEWED`: each data source and any redistribution of database/results needs a separate decision. Local internal scanning and shipping the tool/database with IDEA are different uses. |
| Is it installed, run or qualified? | `NO`: binary, database, image layers and scan results were not downloaded or produced. |
| Does this complete the P04 image intake? | `NO`: whole-image CVE review, per-package notices, authorized image pull/runtime and P04 reviewer evidence remain open. |

Historical Docker-path recommendation only, if that path is explicitly reopened: conduct a
controlled trial with the exact `v0.74.0` Windows x64 release,
after recording its checksum/signature, release `bom.json`, direct/transitive license notices and
the relevant advisory-source terms. Disable telemetry and cloud/upload features. Use the exact
pinned `linux/amd64` digest, retain the database timestamp/version and raw JSON results locally,
and separately reconcile the Debian packages and Go components against the existing registry
SBOM. Treat all output as candidate evidence for human review, not an automatic `PASS`. The trial
still requires explicit approval before the tool/database or image layers are downloaded.

Primary sources:

- [Trivy release `v0.74.0`](https://github.com/aquasecurity/trivy/releases/tag/v0.74.0)
- [Trivy official installation instructions, including Windows release packages](https://trivy.dev/docs/latest/getting-started/installation/)
- [Trivy `v0.74.0` Apache-2.0 license](https://github.com/aquasecurity/trivy/blob/v0.74.0/LICENSE)
- [Trivy vulnerability database repository and license](https://github.com/aquasecurity/trivy-db)
- [Trivy vulnerability coverage and data sources](https://trivy.dev/docs/latest/scanner/vulnerability/)
- [Trivy license scanner coverage and limitations](https://trivy.dev/docs/latest/scanner/license/)
- [Trivy database download, cache and offline options](https://trivy.dev/docs/latest/configuration/db/)
- [Trivy usage telemetry and disable option](https://trivy.dev/docs/latest/advanced/telemetry/)
- [Trivy container-image sources, including registries](https://trivy.dev/docs/latest/target/container_image/)
- [GitHub Advisory Database terms: CC-BY-4.0 attribution requirement](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#advisory-database)
- [Go Vulnerability Database](https://pkg.go.dev/vuln/)

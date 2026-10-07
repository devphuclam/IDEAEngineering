# IAM UI 46 readiness utilities

These are environment/build preflight utilities, not T008 fixtures or product implementation.
Authority: the human's 2026-10-07 continuation of readiness at
`5b2fb9fbeec9e2edc23532de7b2a81d84289a664`, plus explicit PG2/PG3 PASS in this conversation.
Historical publication at 4c98f226 kept PG4 BLOCKED until these actual checks completed.
The historical human Backend-first disposition is recorded in
[envelope section 5](../../specs/009-iam-rbac-ui-integration/execution-envelope.md#5-human-backend-first-gate-disposition--2026-10-07):
PG4 PASS-WITH-ACTIONS, HTTPS/Chrome NOT-RUN and due before actual Web qualification. These
utilities alone grant no T008+ authority and still require normal TLS verification when executed.
The subsequently executed unchanged harness, actual trusted Chrome PASS 2/2, owned cleanup and
current PG4 PASS are recorded in [envelope section 6](../../specs/009-iam-rbac-ui-integration/execution-envelope.md#6-trusted-https-execution-and-action-closure--2026-10-07).

## Controlled inputs and commands

Use the existing JDK 25.0.4.1+1-LTS and Maven 3.9.16 pinned by handoff section 8.
Export the committed source with command-local `git -c core.autocrlf=false archive`; compare
exported bytes with committed inputs before transfer and again after extraction.
Root: `/home/phuclam/idea-iam-ui-20261007-46`; retain earlier diagnostics without overwrite.
Database: only `idea_ddm_iam_ui_20261007_46`; existing migrator/app; no migration or bootstrap
during TLS/build preflight. Its empty public and privileges are checked separately.

`ReadinessGraphAudit.java` uses existing Maven core Resolver in offline mode to inspect the
effective application model and declared/direct-goal plugin acquisition graph. It does not
execute Maven goals or load plugin realms. Run using:

    /opt/idea/tools/jdk-25.0.4.1+1/bin/java \
      -cp '/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/lib/*:/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/boot/*' \
      ReadinessGraphAudit.java <exact-exported-Server-pom>

The original POM actually selects jsr305:3.0.2 in the Boot plugin graph. The sole POM repair
uses the previously qualified buildpack-platform 4.1.1 dependency/exclusion, preserving the
application graph, versions and product behavior. Historical missing-right evidence remains.

The package path uses a private Node-only mirror of the exact admitted Linux 24.21.0 binary
and full LICENSE; no npm/npx/corepack are copied or invoked. Reuse the hash-checked retained
Linux Web node_modules via an owned export's link, never modify the retained cache. The
existing Web build script therefore calls the locked TypeScript and Vite CLIs directly:

    <owned-node-only>/bin/node apps/server/scripts/build-web-static.mjs <owned-export>/apps/server/target

Then from that owned export's apps/server, use command-local JAVA_HOME and existing Maven:

    mvn -o -B -s <export>/tests/ph1/f05-qualification/server-grant/settings.xml \
      -gs <same-settings> -Dmaven.repo.local=/home/phuclam/.m2/repository \
      org.apache.maven.plugins:maven-resources-plugin:3.5.0:resources \
      org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile \
      org.apache.maven.plugins:maven-jar-plugin:3.5.1:jar \
      org.springframework.boot:spring-boot-maven-plugin:4.1.1:repackage

No clean, lifecycle package/test, install or network resolution. Require no JSR305 selection,
no provider/tooling leakage into runtime, exact application runtime hash set, executable-JAR
manifest/loader, actual built Web and retained React/ReactDOM/scheduler notices. This package
is a prerequisite check of predecessor code, not IAM UI or new owner qualification.

After hash-verified transfer of the resulting JAR, `package-preflight.ps1` compares it against
the accepted 57-JAR Server payload inventory (not the different 38-JAR Gateway graph), checks
outer/nested JSR305 providers, executable manifest/loader, actual Web, three runtime notices
and ten immutable migration bytes. Run with `-JarPath <owned-JAR> -RepositoryRoot <LF-export>`.
The 11 selected starter/annotation-processor JARs are excluded by Boot's packaging rules;
the retained jarmode-tools 4.1.1 copy is expected, not newly introduced build-tool leakage.

## Fresh HTTPS environment fixture

`HttpsFixture.java` uses only JDK standard APIs and the existing keytool. It exposes only
`GET /__iam_readiness`; no product API, password, identity, database or Swagger.
TLS root is exactly `/home/phuclam/idea-iam-ui-20261007-46/tls-01`, must not exist before prepare.

    <jdk>/bin/java HttpsFixture.java prepare
    <jdk>/bin/java HttpsFixture.java serve

Prepare creates an RSA 3072 PKCS12, random password in a private mode-600 file, 7-day test
certificate with SAN localhost + 127.0.0.1 and serverAuth. Freeze the public certificate
SHA-256/SHA-1, subject, SAN, serial, validity and keystore hash before serving. Transfer only
the public DER certificate. Import only that certificate to CurrentUser Root after fingerprint
confirmation; no machine store, global cacerts, old preview certificate or trust bypass.

Serve binds Ubuntu `127.0.0.1:18446` only. A dedicated SSH process forwards Windows
`127.0.0.1:18446` to that exact remote endpoint, with BatchMode, StrictHostKeyChecking and
ExitOnForwardFailure. Require both ports free before starting. No wildcard/LAN or second listener.

Run `browser-preflight.mjs` with the existing approved Windows Node 24.19.0. It pins its
executable and installed Chrome hash, Playwright/core 1.62.1, headed Chrome 154.0.8037.98,
normal trust/hostname checks and exact HTTP 200/body on both SAN names. No password,
session, cookie, proof, HAR, screenshots or recorded browser profile. This is HTTPS environment
readiness, not actual IDEA UI/browser acceptance.

## STOP, retention and cleanup

Stop on source/hash/tool/version/graph drift, missing cache, dependency acquisition, certificate
expiry/untrusted result, unexpected target, permission or production/preview data. Never install,
download, weaken TLS, silently change source, migration, scope or oracle to obtain PASS.
Private key/password remain outside Git; never read them into evidence or log arguments.
Stop only the recorded test fixture PID after verifying its exact command/root, then the exact
owned SSH forwarding PID. Require no listener remains on either 18446. Retain TLS files privately
for the approved later tests; no database DROP and no broad schema/process cleanup.
V1–V10 remain byte-identical; V11 and T008+ remain NOT-STARTED. Verifier, deploy, merge NOT-RUN.

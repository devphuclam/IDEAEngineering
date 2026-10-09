# Independent Backend / Frontend development

| Control | Value |
|---|---|
| ID / class / version | IE-DEV-SEPARATE-WEB-SERVER-051 / internal development recipe / 0.1 |
| Owner / author / authority | Project user / Codex, CODEX_ONLY / user authorizes separate Backend/Frontend and configurable multi-host connections on 2026-10-09, Asia/Ho_Chi_Minh |
| Status / review | Implementation in progress; qualification results recorded separately; independent acceptance NOT-RUN |
| Normativity / scope | INFORMATIVE product behavior; Issue #51 development tooling only, not a new product architecture or multi-site acceptance |
| Classification / retention | INTERNAL, synthetic data only; retain historical controls/evidence and the existing DB |
| Predecessor / trace | [merged Nginx entry](../../deploy/development/nginx/README.md), [snapshot review path](../iam-ui-dev/README.md), [Issue #51](https://github.com/devphuclam/IDEAEngineering/issues/51) |
| Change / review trigger | Source, upstreams, tools, TLS, package or data target change; requalify affected checks; no implicit deployment/rights approval |

## Two applications, one browser origin

Backend and Frontend have independent source, build and process lifecycles. The
browser uses relative `/api/...` URLs; only the edge knows the actual Server host.
Moving a Server does not require embedding its internal address into the Web bundle.

```text
Browser HTTPS localhost:18448
  -> SSH local forward -> Ubuntu Nginx
       /api, /dev-api, /health, /webjars -> verified HTTPS Backend
       UI + HMR (dev) -> SSH reverse forward -> local Windows Vite -> edited checkout
       UI (review) -> previously qualified bundled-Web package, explicitly labelled
```

The edge has explicit `dev` and `review` modes. There is no Vite-to-old-snapshot
fallback. Frontend Stop leaves Backend/data intact. Backend Stop leaves Frontend
source intact; subsequent APIs fail rather than inventing successful data.
Old 18444 and the Feature009 remote-Vite review controls remain historical/rollback
paths. Their source, packages and records are not overwritten by this change.

## Human commands

From the checkout whose Web source you want to develop:

```powershell
.\IDEA-Dev.cmd BackendStart
cd apps/web
npm run dev
```

Visit **https://localhost:18448/**. Keep the development terminal open. Saving a
UI source file must update that page through HMR. `npm run dev` invokes the existing
admitted Node24.19.0 explicitly; no PATH Node substitution or dependency installation.
The `npm` command itself requires your already admitted shell/tool setup; the direct
equivalent does not require invoking PATH npm:

```powershell
.\IDEA-Dev.cmd Frontend
```

`IDEA-Dev.cmd Dev` starts the two independent processes together for convenience;
this does not make Frontend a Backend dependency. `IDEA-Dev.cmd Start` selects the
qualified packaged review UI. It is not a build or an update to current main.

`IDEA-Dev.cmd Status` reports Backend, edge mode, Frontend source directory and SSH
state. `FrontendStop` stops dev Frontend/reverse tunnel/dev edge only. `BackendStop`
stops only the owned Server. `Stop` stops this entry's owned processes/tunnels,
never PostgreSQL, other applications, databases, identities or history.

Swagger is **https://localhost:18448/dev-api/** after ordinary login. Use existing
synthetic accounts and their current real permissions; do not reseed or grant roles
to hide legitimate 403 responses. Passwords remain in the private interactive
handoff, never chat/evidence. Existing `npm run dev:credentials` remains private-only.

## Independent builds and future hosting

- Web: `npm run build` produces `apps/web/dist`, including the three admitted
  React/ReactDOM/scheduler notices. It does not build Java or contact registries.
- Backend: offline `mvn -o -Pbackend-only -DskipTests package` in `apps/server`
  uses `target/backend-only`, skips Web build and excludes Web resources. Cached
  admitted JDK/Maven/graph are prerequisites. The default historical bundled-Web
  package remains supported; do not mislabel it as Backend-only.
- Backend edits require an explicit build/package update and Server restart.
  UI HMR does not deploy Backend edits or change the pinned JAR.

Connection settings are loaded from an optional private local JSON file through
`IDEA_DEV_CONFIG`. The public schema/defaults are in [topology.mjs](topology.mjs).
For example, `backendOrigin=https://server.internal:9443` and
`frontendOrigin=https://web.internal:5173` can represent separate hosts. Match
`backendTlsName`, CA paths and normal certificate verification to those hosts.
An external `backendOrigin` is checked as an endpoint, not as a locally owned PID;
the controller will not start a redundant local Server for it. The current controller only manages the existing Ubuntu synthetic Server and
Windows Vite; it is not a remote fleet installer. Independently hosted upstreams
are provisioned by their own operators, then selected by edge configuration.

**Different physical hosts do not mean different browser origins.** Keep one
trusted public edge origin for Web/API under the current session/CSRF contract.
Direct browser cross-origin APIs, CORS changes, SSO, session HA and multi-site
data replication are not introduced or qualified here.

## Controlled execution envelope

- Base: `main@43762acb689fac41033ff25fde1d9227367de796`; Issue51 branch only.
- Windows Node24.19.0 SHA256
  `3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237`;
  existing Vite8.3.1/React6.1.1 plugin/TypeScript7.0.2/cache only, no npm install/ci.
- Existing Nginx1.28.3-2ubuntu1.11, JDK25.0.4.1 and their previously checked
  binary/library/TLS manifests are reused, not reacquired. Known current-use
  rights/notice obligations remain; no new tool or dependency graph is admitted.
- The retained JAR remains source `9d3732cb173e8094195b9bdd60b5588ac3cfa42e`, hash
  `318a52cf1e658a53bc9fa54137346c15277060667998d2f10f33454d15bb8c1c`.
- Retained DB `idea_ddm_iam_ui_20261007_46`, schema
  `iam_ui_c3b8cde44f9a4d1199306c381c12d1bb`, migrator owner/app runtime split.
  No migration/bootstrap/fixture/credential or authority mutation.
- Fresh remote root `/home/phuclam/idea-dev-access-20261009-51-03`, phuclam:700;
  loopback edge18448, Server18449, SSH reverse18450; local Vite5175 only.
- TLS material remains on Ubuntu, pin
  `6cee40386182902343aeb0ad6db1110656b1c293dcc3c33fbc3fe32251d965ad`,
  valid until 2026-10-14T05:19:50Z. No trust-store change or TLS bypass.
- Testing: launcher/ownership; source/HMR; actual HTTPS API/login/CSRF/Swagger;
  dev failure without snapshot adoption; review/dev separation; cleanup/retention.
  Headed admitted Chrome155.0.8059.39, existing Playwright/core1.62.1 only.
- STOP on graph/tool/hash drift, unknown process/port, TLS expiry/trust failure,
  wrong DB/schema/owner or need for company data. Never signal an unknown PID,
  drop a DB/schema, weaken IAM/TLS or acquire a substitute package.
- Runtime feature regression/verifier NOT-RUN unless a specific affected check
  requires it; no whole PH1 rerun or automatic merge.

Provision once, after committing/publishing the control source: generate a fresh
packet with `node tools/dev-access/packet.mjs <fresh-local-directory>`, verify hashes,
create the fresh owned remote root, transfer only the packet, verify the same
manifest, set directory700/files600 and create logs/temp directories. If the root
exists, stop rather than overwrite historical inputs. Existing legacy Nginx entry
must be stopped through its owned launcher before these ports can be adopted.
Normal human Start never provisions, downloads, builds, migrates or seeds.

# Human launcher contract

Issue #26; user-approved launcher test boundary, 2026-10-01.

## Windows commands

`IDEA-Dev.cmd Start|Status|Stop` (no argument: menu). Only Start may open the browser, after readiness.
Defaults: `phuclam@192.168.137.33`, user-owned remote preview directory, loopback port 18444, existing
IDEA SSH key. No command accepts a secret argument.

Output: Backend host, remote bind/port, local URL, process/database readiness, Swagger availability.
US1 reports Swagger NOT_INSTALLED, never a supposedly working Swagger link.

Exit: 0 action complete; 2 missing/invalid prerequisite or ownership conflict; 3 stopped/unhealthy;
1 execution/connectivity/TLS failure. Status is read-only. Stop verifies ownership and does not
create/delete data. Failed Start never opens a browser; occupied port alone never proves ownership.

## HTTPS observations

- `/health`: 200 + `status=UP`, process only.
- `/health/database`: 200 + `status=UP`, actual PostgreSQL.
- `/api/v1/identity/session`: 401 before sign-in; existing Web sign-in/session/sign-out afterward.
- Stop/start: fresh sign-in to the retained identity, not revival of an old runtime proof. No HA,
  failover, recovery or backup qualification claim.

Use normal Windows TLS trust, with no ignore flag/callback or HTTP/Secure-cookie downgrade.
Verify Server ownership independently of health before reuse. Retain outcomes/hashes, not secrets.

## Swagger gate

US2 documents supported methods, fields and real refusal/status outcomes on the same origin.
Actual Try out is a separately agreed seam after exact dependency/build-tool admission. It cannot
create a new business API or proof-delivery authority just to make a request succeed.

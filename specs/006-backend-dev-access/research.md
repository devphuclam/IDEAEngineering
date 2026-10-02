# Development access decisions

Engineering research notes, 2026-10-01, Issue #26; informative, not dependency admission.

## Existing package first

- Decision: reuse `/home/phuclam/idea-f03b-closure-final-package-13/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar`.
- Identity: SHA-256 `ac4f74e1fe5453b7716e13da970027ba403d695340974ca13503f3d8989332ff`,
  package source `38b99f50de09370a8e8554cc80fc66a0afa70b62` per retained F03 evidence; no new build.
- Rationale: actual Server-served Web is already packaged/qualified; current Ubuntu has no Java
  process or Backend listener. Test fixtures are transient and intentionally remove their data.
- Alternative rejected: reuse a destructive T043 fixture as a durable human environment.

## Private transport and lifecycle

- Decision: remote loopback `127.0.0.1:18444` and local SSH forward; manual Start/Status/Stop.
- Rationale: same-origin HTTPS and ordinary session/CSRF unchanged; no LAN/firewall exposure.
- Trust prerequisite: CurrentUser Root thumbprint `754395850240E7524360D2AEDDEFA66796BA9BDB`,
  SHA-256 `71D16C7626E9ED97C84EC6167FE8E88CB753BFF5135EE547FB221EB0828D3DE2`.
  Certificate expires 2026-10-08 10:58:09 +07. Never bypass TLS; renew before expiry separately.
- Alternative deferred: systemd boot startup, which the user did not select.

## Persistent synthetic data

- Decision: create a new fixed preview DB; never adopt an existing DB or mutate retained evidence.
- Rationale: app/migrator roles exist but cannot create DBs; `sudo -n true` requires interactive
  authentication. Provisioning therefore needs the developer console.
- Use packaged migration directly: `database-migrate.sh` would rebuild with expired tooling.
  Use console bootstrap through PropertiesLauncher; no public bootstrap route.
- Prompt for dev DB access in the wizard, save mode 600 in its own runtime directory. Do not
  silently promote the old test credential file to a new persistent purpose.

## Swagger second

- Candidate: `org.springdoc:springdoc-openapi-starter-webmvc-ui:3.1.1`.
- Official source: [springdoc documentation](https://springdoc.org/),
  [exact tag](https://github.com/springdoc/springdoc-openapi/tree/v3.1.1).
- Boot 4 major-family support is documented; exact source uses Boot 4.1.0. This application's
  exact Boot 4.1.1 compatibility is NOT-RUN, not assumed.
- Swagger intake and expired exec-maven-plugin exception need separate dispositions before build.
  No package is imported by this research.
- Preserve Log4j2 by excluding starter-logging on the Swagger dependency path. Document filter-based
  login/logout explicitly; integrate current CSRF acquisition without JWT/storage/bypass.
- Do not enable the currently unqualified live credential-proof delivery channel.

# IDEA Enterprise Integration and Deployment Evidence

Date and retrieval snapshot: 2026-09-11

Status: research evidence and architecture-decision input; no Tech approval, production sizing or
implementation result.

## Scope and evidence boundary

This note tests two candidate directions for IDEA Engineering Core v0:

- **Q5 — enterprise integration:** IDEA owns its engineering-product data; other systems use
  governed Interfaces and committed events; inbound data is translated and validated; direct
  operational-database coupling is avoided.
- **Q10 — initial deployment:** begin with a modular monolith on a small, company-managed topology;
  keep backup outside the primary failure domain; isolate format conversion when its operating
  system, license or resource profile requires it; scale out only when workload or availability
  evidence justifies the additional machinery.

The historical prose uses four evidence classes. They are normalized below so this note can be
consumed with the other technology notes without turning guidance into a standard:

| Normalized evidence class | Historical label in this note | What it can establish | What it cannot establish |
|---|---|---|---|
| `FORMAL-STANDARD` / `INDUSTRY-SPECIFICATION` | `NORMATIVE STANDARD` | Standard or specification semantics, such as HTTP, OpenAPI, CloudEvents or OIDC | That IDEA must use a particular architecture, broker, cloud or product |
| `OFFICIAL-GUIDANCE-PATTERN` | `OFFICIAL GUIDANCE / PATTERN` | A known failure mode, reusable response and trade-offs | Qualification for IDEA's workload or organization |
| `FIRST-PARTY-PUBLIC-PRACTICE` / `COMPETITOR-OBSERVATION` | `FIRST-PARTY PUBLIC PRACTICE` / `VENDOR-PUBLIC` | A reputable product exposes or reports a comparable practice | Undisclosed internals, or an IDEA requirement merely because the product is successful |
| `IDEA-INFERENCE` | `IDEA RECOMMENDATION` | A bounded interpretation or recommendation derived from IDEA context and the evidence | Product approval, runtime proof, capacity proof or an SLA |
| `QUALIFICATION-UNKNOWN` | `UNKNOWN` | The unresolved question and the evidence still required | A claim that the missing behavior exists or does not exist |

Competitor observations remain reference evidence only. They do not create an IDEA requirement.

## 1. What is actually standardized?

There is **no general ISO or IETF standard that requires** “transactional outbox + Adapter per
external system + modular monolith + one VM.” Claiming that would be false. The applicable standards
cover smaller, interoperable parts of the design:

| Subject | Evidence | Safe conclusion for IDEA |
|---|---|---|
| Architecture description | [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html) specifies requirements for expressing an architecture description and explicitly does not prescribe an architecture method, notation or target architecture. | Record stakeholders, concerns, views, decisions and rationale; do not present Q5/Q10 as ISO-mandated topology. |
| HTTP operations and retry semantics | [IETF RFC 9110 §9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2) defines idempotent request-method semantics and explains why an idempotent request can be retried after communication failure. | IDEA must state retry semantics for state-changing operations. HTTP alone does not make an arbitrary `POST` idempotent; the application still needs an operation/idempotency design. |
| HTTP Interface description | The [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) is a language-agnostic standard for describing HTTP APIs to people and tooling. | OpenAPI is a suitable candidate for documenting a selected HTTP Interface; it does not decide IDEA's domain ownership or guarantee compatibility by itself. |
| Event envelope | [CloudEvents](https://cloudevents.io/) is a CNCF specification for describing event data consistently across systems and platforms. | CloudEvents is a viable event-envelope candidate; it does not provide durable delivery, ordering, authorization or an outbox. |
| Enterprise login | [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) defines an identity layer over OAuth 2.0 for authenticating an end user and obtaining claims. | Future company login can use a standard identity Interface when the company provider and policy are known. Identity claims do not replace IDEA's product authorization rules. |
| Recovery planning | [NIST SP 800-34 Rev. 1](https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final) gives contingency-planning guidance. Its backup guidance covers frequency/scope based on criticality, off-site storage considerations and recovery testing. | Q10's separate backup location, measured RTO/RPO and restore drills have strong official guidance. NIST does not require IDEA to deploy one VM or a Kubernetes cluster. |

These standards support explicit contracts and measurable recovery. The architecture patterns below
connect those standardized pieces into a reliable system.

## 2. Q5 — evidence for the integration model

### 2.1 Interface instead of operational-schema coupling

`OFFICIAL GUIDANCE / PATTERN`. Microsoft's
[Anti-Corruption Layer pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer)
places a façade or Adapter between systems with different semantics. It translates requests and
keeps an external system's model from constraining the application's model. The guidance also calls
out input validation, transaction/data consistency, correlation and observability as design
concerns. AWS documents the same model-translation purpose in its
[Anti-corruption layer guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/acl.html).

`IDEA RECOMMENDATION`. ERP's `Material`, MES's production object and IDEA's `Item`/`Generation`/
`Release` must not become one accidental model. A system-specific Adapter should translate IDs,
units, schema and failure semantics. This is the basis for rejecting a universal “integration”
Module full of ERP/MES-specific business rules.

No cited standard universally prohibits read-only database access. **Avoiding direct access to the
operational schema is an architecture recommendation**, because the schema is an implementation
detail and direct writes can bypass owner-Module invariants, authorization and Audit. A deliberately
governed reporting replica or export schema can still be evaluated later; it would itself be a
versioned integration contract, not permission to couple to arbitrary production tables.

### 2.2 Committed events and transactional outbox

`OFFICIAL GUIDANCE / PATTERN`. AWS's
[Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
addresses the dual-write failure where an application both commits database state and sends a
message. It records the business change and outbox entry in the same transaction, then publishes
committed entries separately. AWS explicitly notes duplicate delivery and recommends idempotent
consumers.

`IDEA RECOMMENDATION`. When IDEA releases a BOM, the Release and corresponding outbox record should
commit together. Failure or downtime in ERP must not fabricate, reverse or repeat the Release.
Delivery may retry, so stable Event IDs and consumer deduplication are required. A broker is a
separate topology choice: an outbox can be valid before IDEA has a real consumer or an independently
operated message broker.

### 2.3 Idempotent commands and duplicate-tolerant consumers

`FIRST-PARTY PUBLIC PRACTICE`. Stripe's
[idempotent request contract](https://docs.stripe.com/api/idempotent_requests) lets clients retry
state-changing requests with an idempotency key without performing the operation twice; Stripe also
rejects reuse of a key with different parameters. Stripe's
[webhook guidance](https://docs.stripe.com/webhooks) describes automatic retries, possible duplicate
events, non-guaranteed delivery order and deduplication using Event IDs.

`SAFE LIMIT`. This proves that idempotency keys, retry and duplicate handling are production-grade
external contract practices. It does **not** reveal or prove that Stripe implements its internals
with a transactional outbox.

`IDEA RECOMMENDATION`. Check-in, Release and inbound integration commands should carry a stable
Operation ID plus an input fingerprint. Repeating the same operation returns or reconciles the same
logical result; reusing the ID with different input is refused.

### 2.4 Comparable PLM integration products

`VENDOR-PUBLIC`. PTC describes
[Windchill Enterprise Systems Integration](https://support.ptc.com/help/windchill/plus/r13.1.2.0/en/Windchill_Help_Center/sublandingpages/ESIAbout_wncplus.html)
as integration between Windchill PLM and ERP distribution targets. The documented paths include
publishing product information in standard XML/JSON and using authenticated REST endpoints for
third-party create/update/delete operations. Aras exposes an
[OData Interface](https://www.aras.com/community/documentationlibrary/Innovator/24/Content/Innovator%2024%20Docs/RESTful%20API/Aras%20Innovator%20OData%20Interface.htm)
that translates OData requests to its internal AML requests, and its
[Data Synchronization Service](https://docs.aras.com/aras-innovator-platform-29/overview/0000019f-d662-d08f-a1df-df62514e0001)
documents source/destination actions and events.

`SAFE LIMIT`. These sources demonstrate that mature PLM products expose governed integration
Interfaces, publishing paths and synchronization concepts. They do not prove that IDEA should copy
Windchill or Aras schemas, use OData, use their middleware, or implement an outbox exactly as
proposed.

### 2.5 Q5 evidence disposition

| Proposed Q5 rule | Evidence strength | Disposition |
|---|---|---|
| IDEA and each external system retain explicit data ownership | Strong domain/integration rationale; comparable PLM practice | Keep |
| Versioned Query/Command Interfaces | Supported by HTTP/OpenAPI standards and public enterprise APIs | Keep; select exact protocol in Tech |
| Event only represents owner state that has committed | Strong dual-write integrity rationale | Keep |
| Transactional outbox for reliable post-commit publication | Strong official pattern guidance | Keep for operations that publish integration events |
| Stable Operation/Event IDs and idempotent retry | HTTP semantics plus strong public Stripe practice | Keep |
| Adapter per materially different external-system semantic model | Strong official pattern guidance | Keep; an Adapter may be in-process initially |
| Inbound staging/validation/preview | Strong safety recommendation for bulk or high-impact imports | Keep conditionally; a small validated single-record command need not create a separate staging subsystem |
| Never expose arbitrary operational tables as an integration contract | Strong maintainability/integrity recommendation, not a universal standard | Keep; allow a separately governed read model/export if later justified |
| Install a message broker in Core v0 | No current consumer/load evidence | Do not require yet |

## 3. Q10 — evidence for the deployment model

### 3.1 Modular monolith before distributed services

`OFFICIAL GUIDANCE / PATTERN`. Microsoft states in
[Common web application architectures](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)
that microservices add communication, resiliency and eventual-consistency machinery, and that the
cost can outweigh the benefit for simpler applications. Microsoft's
[microservices architecture guidance](https://learn.microsoft.com/en-us/azure/architecture/microservices/)
also says the whole system has more moving parts and successful operation requires mature DevOps
practices.

`FIRST-PARTY PUBLIC PRACTICE`. Shopify reported that its large core Rails application was being
managed as a
[modular monolith](https://shopify.engineering/shopify-monolith), with explicit component ownership
and public entry points. Shopify also reported building a
[business-system integration platform](https://shopify.engineering/rails-business-systems-intergration-platform)
as a modular monolith. GitLab explained why a
[modular monolith](https://about.gitlab.com/blog/why-were-sticking-with-ruby-on-rails/)
served its product and why selected performance-critical capabilities could still be separate
daemons.

`CURRENT COUNTER-EVIDENCE`. GitLab's 2026 strategy says its monolith is giving way to more
API-first composable services for new machine-scale demands. That does not invalidate the earlier
evidence. It shows that an architecture can cross a threshold where measured scale and independent
workloads justify extraction. IDEA should preserve that evolution path without paying its full
distributed-systems cost in Core v0.

`SAFE LIMIT`. Shopify and GitLab use different languages, workloads and organizations. Their public
experience proves viability and trade-offs, not that their stack or scale applies to IDEA.

### 3.2 Standalone/non-HA is a legitimate initial topology

`FIRST-PARTY PUBLIC PRACTICE`. GitLab's current
[reference architectures](https://docs.gitlab.com/administration/reference_architectures/)
generally recommend a standalone, non-HA single- or multi-node approach with automated backup for
deployments serving 2,000 or fewer users, while reserving HA architectures for larger tiers and
explicit resilience needs. Its
[up-to-1,000-user reference](https://docs.gitlab.com/administration/reference_architectures/1k_users/)
shows that one server can contain multiple internal services and later separate them for independent
scaling. GitLab bases sizing on measured request rates and warns that large repositories and unusual
workloads change the result.

`IDEA RECOMMENDATION`. A company-managed standalone topology is therefore a credible initial
candidate for 50–100 intended IDEA users with an RTO target of four working hours and RPO target of
one hour. It is **not capacity proof**: multi-GB engineering files, Check-in concurrency, conversion
load and storage growth differ from GitLab and require IDEA-specific tests.

### 3.3 Why Kubernetes is not the default

`OFFICIAL GUIDANCE`. The Kubernetes project's
[production-environment guidance](https://kubernetes.io/docs/setup/production-environment/)
requires planning for control-plane and worker availability, certificates, load balancing, etcd
backup, access control, resources, monitoring and upgrades. A single-machine Kubernetes environment
remains a single point of failure; Kubernetes does not manufacture HA from one server.

`IDEA RECOMMENDATION`. Without an existing company platform team or a measured requirement for
independent scaling/self-healing, Kubernetes would add another production system to operate without
removing IDEA's database, Artifact, backup or recovery obligations. Reconsider it if the company
already provides a supported cluster platform or IDEA later needs multiple stateless instances and
automated orchestration.

### 3.4 Independent backup and tested recovery

`OFFICIAL GUIDANCE`. NIST SP 800-34 recommends regular backups whose frequency and scope reflect
data criticality, identifies off-site storage as good business practice, and calls for retrieval/
recovery testing. GitLab's
[administration guidance](https://docs.gitlab.com/administration/get_started/#back-up-your-gitlab-data)
likewise instructs operators to plan backup, store configuration separately, test restore and
periodically verify backups.

`IDEA RECOMMENDATION`. Database, immutable Artifacts, configuration and required keys must be
recoverable to a mutually usable point. “Independent failure domain” means the recovery copy is not
lost by the same VM/storage/admin mistake; it does not necessarily mean a second data centre for the
current RTO/RPO. RAID or a snapshot kept only on the primary host is not sufficient recovery
evidence.

### 3.5 Isolated format conversion is normal in PLM

`VENDOR-PUBLIC`. Aras documents its
[Conversion Server](https://aras.com/wp-content/uploads/2024/05/Aras-Innovator-2024-Release-Conversion-Server-Setup-Guide.pdf)
as a framework that manages conversion tasks rather than being the converter itself. Current Aras
installation guidance says a Conversion Server is typically installed on a
[separate server](https://docs.aras.com/aras-innovator-platform-30/configuring-aras-innovator-optional/0000019f-273a-d087-a79f-e73bbe160000)
because co-location can significantly affect performance. Its documented CAD converter environment
has Windows and additional software requirements. PTC's Windchill documentation likewise describes
a WVS Worker on a different Windows machine for relevant visualization work.

`IDEA RECOMMENDATION`. Keep the Format Interface stable and allow the worker to run on a Windows
host with the exact licensed CAD/Office/converter profile. The worker creates a candidate result;
the owner Module in IDEA remains responsible for verifying and associating it with the exact source
Generation.

### 3.6 Q10 evidence disposition

| Proposed Q10 rule | Evidence strength | Disposition |
|---|---|---|
| Modular monolith with enforced Module Interfaces | Strong official trade-off guidance and reputable large-scale practice | Keep |
| One company-managed VM/server as initial candidate | Credible public standalone precedent; IDEA sizing still unknown | Keep as testable candidate, never as capacity claim |
| Logical ownership separation for Server, database and Artifact custody | Strong integrity and evolution rationale | Keep even if initially co-located |
| Backup outside the primary failure domain and restore drills | Strong NIST/vendor operational guidance | Keep as mandatory qualification condition |
| Separate Windows Format Worker when tool/license/load requires it | Strong analogous PLM vendor practice | Keep as conditional topology |
| Kubernetes/HA cluster from Core v0 | No current requirement or operator evidence | Do not recommend by default |
| Scale Server, database, Artifact store, broker or worker independently later | Credible evolution path, but each split needs its own trigger | Keep as planned option, not prebuilt infrastructure |

## 4. Direct answer to “does anyone serious use this?”

Yes, but no single named company proves the whole IDEA proposal:

- **Shopify** publicly used modular-monolith structure for a very large core product and for a
  business-system integration platform.
- **GitLab** publicly used a modular monolith, offers a standalone non-HA reference topology well
  above IDEA's user count, and is now extracting capabilities where new scale warrants it.
- **Stripe** publicly exposes idempotent write requests and duplicate/retry-aware event delivery.
- **GitHub** publicly integrates through versioned REST APIs and webhooks; this demonstrates the
  public Interface/event surface, not GitHub's internal transaction design.
- **Windchill** and **Aras Innovator** expose governed PLM integration APIs/publishing or
  synchronization mechanisms instead of defining integration as arbitrary SQL access.
- **Aras** and **Windchill** document separate conversion/visualization worker infrastructure for
  format processing.

The defensible argument to management is therefore not “a famous company does it, so copy it.” It is:

1. IDEA has specific integrity, file, recovery, team and growth constraints.
2. Q5/Q10 address identifiable failure modes under those constraints.
3. Applicable standards define interoperable contracts and recovery semantics.
4. Official architecture guidance documents the relevant patterns and trade-offs.
5. Reputable products demonstrate that the practices are viable at meaningful scale.
6. IDEA still must run its own spikes, load tests and restore drills before the proposal becomes a
   qualified production decision.

## 5. Remaining questions before a Tech recommendation can be defended

The evidence above supports the **shape** of Q5/Q10. It does not yet select:

- the first real ERP/MES/identity consumer and the direction/frequency of its data flow;
- REST/OpenAPI versus another protocol for each Interface;
- CloudEvents adoption and the exact event versioning policy;
- in-process outbox dispatcher versus a broker-backed delivery topology;
- on-premises, private-cloud or public-cloud hosting;
- Linux versus Windows for the primary Server host;
- physical/virtual storage, backup target and security administration;
- exact Format worker tools and licenses;
- hardware sizing, concurrency limits or an HA threshold.

Those are Tech decisions or qualification facts. They should be resolved by the decision tree and
evidence, not silently inherited from the example companies above.

## 2026-09-13 correction addendum

The 2026-09-11 source dates are intentionally retained. A current-date audit did not find a
version-specific claim in this note that should be rewritten as a current runtime baseline; this
note is about integration and deployment patterns. The normalized taxonomy above replaces the old
labels for synthesis purposes. Current platform versions and support dates are recorded in the
separate synthesis artifact.

| Boundary | Correct reading |
|---|---|
| ISO/IETF/OpenAPI/CloudEvents/OIDC | `FORMAL-STANDARD` or `INDUSTRY-SPECIFICATION`; none mandates a broker, modular monolith or one VM. |
| AWS/Microsoft/NIST patterns | `OFFICIAL-GUIDANCE-PATTERN`; they identify failure modes and trade-offs, not an IDEA capacity result. |
| Shopify/GitLab/Stripe/GitHub/Aras/Windchill examples | `FIRST-PARTY-PUBLIC-PRACTICE` or `COMPETITOR-OBSERVATION`; no internal implementation is inferred. |
| One VM, separate Format Worker, outbox, Adapter and recovery recommendations | `IDEA-INFERENCE`; preserve as candidates subject to qualification, not approved topology. |

No product scope, Feature/Spec/Tech decision, architecture semantics, FTR/REQ, DDM capability or
PG state is changed by this note.

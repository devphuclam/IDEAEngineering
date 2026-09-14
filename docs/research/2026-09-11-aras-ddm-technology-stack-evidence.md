# Aras Innovator and DDM Technology-Stack Evidence

| Control field | Value |
|---|---|
| Stable Research ID | `IE-RES-COMP-TECH-20260911-001` |
| Document class / version / status | `COMPETITOR-RESEARCH` / `0.1` / `Draft` |
| Product normativity | `INFORMATIVE`; competitor facts cannot approve an IDEA stack or create a requirement |
| Repository process authority / instruction state | `NOT-APPLICABLE` / `NOT-APPLICABLE` |
| Owner / author | Principal Product Author; named person attribution `BLOCKED` before `Proposed` |
| Reviewer / acceptance authority | Project user for internal review; Product Decision Authority acceptance `NOT-RUN` |
| Applicable baseline | `IDEA-C1-ANALYSIS-DESIGN-001`; historical vendor-release comparison only |
| Evidence date / control update | 2026-09-11 / 2026-09-14 |
| Classification / retention | `INTERNAL`; retain as a dated competitor observation, not a current support promise |
| Source / upstream trace | Vendor first-party sources and release contexts cited below; [product knowledge reading rules](../product/knowledge/README.md) |
| Downstream trace | [Technology evidence synthesis](2026-09-13-technology-selection-evidence-synthesis.md), [technology decision matrix](../product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md) |
| Change record / predecessor | [IE-CHG-DOC-REVIEW-001](../product/instances/idea-engineering/registers/CHG-2026-09-14-post-pull-document-review-corrections.md); previously uncontrolled note SHA-256 `15ed52811aa5fd97e7ec636c7f5c72e8b7cd8c229e9081104c3a1370a1c2be7e` |
| Supersession / review trigger | No controlled predecessor; recheck the exact vendor release/source before reusing a claim |
| Evidence status | Bounded public vendor claims and explicitly labeled inference; IDEA runtime qualification `NOT-RUN` |

Control tailoring under `IE-STD-AUTH-001@0.2`: this competitor note preserves release/date context,
source class and limits. It has no independent product requirement, effective product date,
controlled predecessor version or implementation result.

Date and retrieval snapshot: 2026-09-11

Status: competitor/vendor research input only. It does not approve an IDEA technology, topology,
requirement, or compatibility claim.

## Evidence boundary

This note uses first-party public material. A published support matrix establishes a supported
deployment environment, not the vendor's complete source-code architecture. A component name or
legacy interface is not enough to infer the language/framework of the whole product. Aras and CSI
also publish material for different product releases and deployment modes; those facts must not be
silently combined into one timeless stack.

## Evidence taxonomy and date boundary

This is a historical competitor snapshot, not a current IDEA technology baseline. The controlled
taxonomy for this research set is:

| Normalized class | Use in this note |
|---|---|
| `OFFICIAL-PRODUCT-FACT` | Aras/CSI documentation directly states a supported product, release or interface fact. |
| `OFFICIAL-LIFECYCLE-LICENSING` | A vendor support, edition or licensing term is stated directly. |
| `COMPETITOR-OBSERVATION` | The observation concerns Aras or DDM and cannot create an IDEA requirement. |
| `IDEA-INFERENCE` | A bounded comparison implication derived from the observation; it is not a product decision. |
| `QUALIFICATION-UNKNOWN` | The public source does not establish the implementation, contract or IDEA applicability. |

The older `VENDOR-PUBLIC`/`PUBLISHER-PRIMARY` wording in the source ledger is treated as
`OFFICIAL-PRODUCT-FACT` or `OFFICIAL-LIFECYCLE-LICENSING` only where the publisher directly states
the fact. `2026-09-11` remains the retrieval date for every historical claim below; a later release
must not be silently projected backwards onto Platform 33, R39/R40 or DDM 2026.x.

## Aras Innovator

| Layer | Vendor-public evidence | Limit |
|---|---|---|
| Runtime | Aras identifies Innovator R39 as its first `.NET 10`-compliant release and says the migration covers Core Server, Client, OAuth, Vault, Conversion and Agent endpoints ([migration note](https://docs.aras.com/aras-innovator-migration-to-net-10)). | Earlier supported releases use older runtimes; the exact target release still controls. |
| Web hosting | Platform 33 documentation says server components run on ASP.NET Core/.NET 8.0.1, with Kestrel as the primary web server and IIS as reverse proxy for MSI installations ([runtime note](https://docs.aras.com/aras-innovator-platform-33/aras-innovator-runs-on-net-core/0000019f-179e-dcff-a7bf-5f9f3b510000)). | This is a release-specific on-premises description, not proof that every current SaaS/on-premises deployment has the same hosting topology. |
| On-premises OS and database | The Platform 33 matrix lists Windows Server/IIS for Innovator and Vault and Microsoft SQL Server 2016/2017/2019/2022 for the database ([platform matrix](https://docs.aras.com/aras-innovator-platform-33/platforms-standards/0000019f-179b-dcff-a7bf-5f9b69cb0000)). | Do not attach the Platform 33 `.NET 8.0.1` matrix unchanged to R39/R40. |
| Current SaaS example | Aras documents an R40 SaaS condition running `.NET 10` on Ubuntu 24.04 while still passing data to SQL Server ([R40 consideration](https://docs.aras.com/aras-innovator-release-40/appendix-a-additional-considerations)). | It explicitly concerns affected SaaS deployments and does not establish Ubuntu as an on-premises requirement. |
| Browser client | The Platform 33 matrix lists browser clients on Windows and macOS using Edge, Firefox or Chrome ([platform matrix](https://docs.aras.com/aras-innovator-platform-33/platforms-standards/0000019f-179b-dcff-a7bf-5f9b69cb0000)). | The public source does not identify a supported React, Angular or other complete frontend framework stack. |
| Product data and files | Installation guidance identifies Web/Application Server, Database Server and File/Vault Server roles; these may be co-located or placed on separate machines ([prerequisites](https://docs.aras.com/aras-innovator-platform-33/prerequisites/0000019f-1799-dcff-a7bf-5f9979f20000), [installation overview](https://docs.aras.com/aras-innovator-platform-33/overview/0000019f-1799-dcff-a7bf-5f9973b20002)). Conversion and Agent roles are separately documented. | Multiple deployable roles are not by themselves evidence that the product is a microservice architecture. |
| Customization | Aras says business logic Methods can be written in JavaScript, C# or VB.NET, normally through IOM, while AML is the platform message/data language ([Methods](https://docs.aras.com/methods/0000019f-d65e-d08f-a1df-df7e64130000), [programmer introduction](https://docs.aras.com/aras-innovator-platform-29/introduction/0000019f-d660-d08f-a1df-df6024930000)). | Supported customization languages do not identify every language used internally by Aras. |
| Integration | Aras publishes REST/OData endpoints; its OData interface translates requests into AML. Configurable Web Services can expose scoped, versioned OData endpoints ([OData interface](https://docs.aras.com/aras-innovator-platform-33/aras-innovator-odata-interface/0000019f-179d-dcff-a7bf-5f9de2b60000), [CWS use](https://docs.aras.com/aras-innovator-release-37/using-a-web-service-37)). OAuth 2.0 token use is documented ([OAuth example](https://docs.aras.com/using-oauth-2-0-tokens-from-the-authentication-server/0000019f-d65e-d08f-a1df-df7ee0740000)). | Exact API availability and compatibility remain release/configuration specific. |

### Defensible shorthand for Aras

Aras is a browser-based, metadata-driven PLM platform whose currently documented runtime family is
ASP.NET Core/.NET, with Microsoft SQL Server, separate Vault/file storage and optional Agent/
Conversion roles. Its supported customization and integration surfaces include AML/IOM, C# and
JavaScript Methods, REST/OData and OAuth. On-premises documentation is historically Windows/IIS
centric, while current SaaS documentation also shows .NET on Linux/container-oriented hosting.

## CSI DesignDataManager (DDM)

| Layer | Vendor-public evidence | Limit |
|---|---|---|
| Server and database | CSI's current DDM 2026.x matrix lists Windows Server 2019/2022/2025 and SQL Server or SQL Express 2019/2022/2025 ([system requirements](https://www.designdatamanager.com/services/system-requirements/)). | This establishes supported products, not implementation language or database schema. |
| Desktop clients | The same matrix lists 64-bit Windows 10/11 clients and current CAD compatibility. The product matrix separates CAD and Office user surfaces ([system requirements](https://www.designdatamanager.com/services/system-requirements/), [product matrix](https://www.designdatamanager.com/products/ddm-product-matrix/)). | The public pages do not identify whether every client is implemented with WPF, WinForms, C++ or another UI technology. |
| Browser client | DDM Web is described as a browser application for real-time search, view and print without a DDM client installation on the workstation ([DDM Web](https://www.designdatamanager.com/products/ddm-web-2/)). | The page does not establish its frontend or server framework; some browser names on the page are historical. |
| Product topology | The product matrix describes Windows-only/SQL-Server-only deployment for core DDM surfaces and names Web and Multi-Site offerings, central repository and database replication ([product matrix](https://www.designdatamanager.com/products/ddm-product-matrix/)). Release material names Secure/Remote File Servers, Routing Server, Action Server, Web components and an internal WCF layer ([2024.07 release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000159541DDM-2024.07-Release-ListDoc.pdf), [2026.04 release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf)). | A WCF component is a Microsoft/.NET-era clue, but is insufficient evidence that all current DDM server/client code is C#/.NET or that WCF is a supported public API. |
| Integration and reporting | CSI advertises ERP/MRP integration, including XML/CSV-oriented Enterprise Update Manager paths, and a release note describes read-only SQL reporting ([BOM/EUM](https://www.designdatamanager.com/products/bill-of-materials/), [product matrix](https://www.designdatamanager.com/products/ddm-product-matrix/), [2026.04 release list](https://www.designdatamanager.com/wp-content/uploads/DOC-000201751DDM-2026.04-Release-ListDoc.pdf)). | Public material does not establish a general supported API, schema/versioning policy, event delivery, retry or idempotency contract. |

### Defensible shorthand for DDM

DDM is publicly evidenced as a Windows + SQL Server product family with Windows CAD/Office clients,
a browser surface, central/file-server-oriented storage, optional multi-site replication and named
background/integration components. The exact current server language, ORM, frontend framework,
internal modularity and supported general-purpose API remain `UNKNOWN` without an authorized package,
runtime inspection or vendor architecture documentation.

## Implications for the IDEA proposal

These competitor observations support four comparison lessons, not requirements:

1. `.NET` is a credible long-lived enterprise engineering-system runtime; Aras is direct evidence.
2. Separating authoritative metadata, vaulted artifacts and conversion/background processing is a
   mature PLM deployment pattern.
3. Windows integration remains important around CAD/Office clients, even when a server runtime can
   run on Linux.
4. Both vendors' public material is strongly SQL Server-oriented. Therefore PostgreSQL in IDEA is a
   deliberate alternative that must be justified by company operations, licensing, recovery and
   support—not treated as competitor parity. Conversely, competitor use alone is not sufficient to
   require SQL Server.

No first-party evidence found here validates React, WPF/WebView2 or PostgreSQL by competitor imitation.
Those remain IDEA-specific candidates to evaluate on maintainability, security, operator competence,
support lifecycle and qualification results.

## 2026-09-13 correction addendum

The current-date audit found no evidence that requires rewriting the release-specific Aras or DDM
claims above. The important correction is methodological: the R39/R40, Platform 33 and DDM 2026.x
facts remain historical `COMPETITOR-OBSERVATION` entries, not a current IDEA stack recommendation.
Current technology candidates are maintained in
[`2026-09-13-technology-selection-evidence-synthesis.md`](2026-09-13-technology-selection-evidence-synthesis.md).

| Claim boundary | Current disposition | Limitation |
|---|---|---|
| Aras R39 `.NET 10`, Platform 33 `.NET 8.0.1`, and R40 SaaS `.NET 10`/Ubuntu 24.04 | `OFFICIAL-PRODUCT-FACT` → `COMPETITOR-OBSERVATION`; retain each release context | No inference about all Aras deployments or IDEA's runtime. |
| DDM 2026.x Windows Server/SQL Server matrix and WCF wording | `OFFICIAL-PRODUCT-FACT` → `COMPETITOR-OBSERVATION` | Supported environment is not implementation-language or ORM evidence. |
| SQL Server prevalence in both products | `IDEA-INFERENCE` only | PostgreSQL remains an independently qualified IDEA candidate. |

No product scope, Feature/Spec/Tech decision, architecture semantics, FTR/REQ, DDM capability or
PG state is changed by this note.

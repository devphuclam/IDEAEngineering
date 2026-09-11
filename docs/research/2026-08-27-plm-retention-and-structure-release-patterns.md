# PLM Retention and Structure-Release Patterns

Date: 2026-08-27  
Questions: What should IDEA do for document deletion/retention (Q85), assembly or product-structure release (Q86), and a released parent when a child is revised (Q87)?  
Source policy: Official Aras Innovator and PTC Windchill documentation only. Vendor behavior and IDEA design inference are separated below.

## Decision summary for IDEA

| Question | Recommended MVP semantics |
|---|---|
| Q85 — delete, trash, and purge | Use `Active → Trashed → Restored` or `Trashed → PurgePending → Purged`. Trash is reversible disposition only. Purge is an authorized administrative operation with a dry-run conflict report. It must fail closed while any retained Generation is pinned by a Release Record, Structure Snapshot, approval/audit record, active reference, retention rule, or legal hold. Physical content may be removed only after no retained manifest refers to its digest; `Purged` is final only after reconciled cleanup succeeds. |
| Q86 — release an assembly | Release one user-confirmed scope resolved to exact `DocumentId + BusinessRevisionId + GenerationId` entries and one exact Structure Snapshot. Every required dependency must either already be Released at the pinned Generation or be explicitly included, approved, and eligible in the same release operation. Unresolved, excluded-required, stale, unauthorized, or ineligible entries block the whole operation. Revalidate the complete scope at commit and publish state transitions plus one immutable Release Record atomically. |
| Q87 — child is revised later | Never rewrite an existing parent Release Record or its Structure Snapshot. A new child Revision/Generation may be visible in a separate dynamic “Latest” view, but the released parent continues to resolve the exact child Generation it released with. To adopt the new child, create/revise the parent, deliberately replace the pinned child in a new Structure Snapshot, review it, and issue a new Release Record. |

These are IDEA product decisions inferred from mature PLM patterns and IDEA's existing immutable-Generation and exact-Release-Record architecture. They are not claims that either vendor persists the same object model.

## Official product facts

### Q85 — deletion, purge, and retained history

**Aras Innovator facts**

- Aras distinguishes `Purge This Version` from `Delete All Versions`. Product Engineering stores prior versions read-only, permits purging a specific version with Delete permission, and warns that purging the only version deletes the Item completely. Claimed Items cannot be deleted. ([Aras Innovator Platform 33 — Versioning and Promoting](https://docs.aras.com/aras-innovator-platform-33/versioning-and-promoting/0000019f-179e-dcff-a7bf-5f9f80ee0000))
- Deleting an entire Product Engineering Document requires Delete rights for every life-cycle state represented in its history. A Document that is claimed or used by another Item cannot be deleted. ([Aras Innovator Release 32 — Deleting Documents](https://www.aras.com/community/documentationlibrary/Innovator/32/Content/Innovator%2024%20Docs/Aras%20PE%2014%20-%20User's%20Guide/Deleting%20Documents.htm))

**PTC Windchill facts**

- Windchill's interactive Delete action offers different scopes: latest iteration, all iterations of one revision, or all revisions. Its Collector can gather related objects into the proposed delete set. ([Windchill 13.1.2 — Deleting an Object](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/commonactions/CommonItemDelete.html))
- Windchill Purge is explicitly permanent and removes both metadata and content selected by a query/job. Queries can select by object type, context, dates, life-cycle state, and version criteria. ([About Purging](https://support.ptc.com/help/windchill/cloud/r12.0.2.0/en/Windchill_Help_Center/PurgeAbout.html), [Windchill 13.1.2 — About Selection Criteria](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/purge/PurgeCriteria.html))
- A protected Windchill baseline prevents deletion of its members until the object is removed from the baseline or the baseline is deleted. Purge conflict handling also treats baseline membership, completed promotion notices, end-item configurations, published-to-ERP state, and revision branch points as non-overridable blockers. ([Windchill 13.1.2 — Creating a Baseline](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/baselines/BaselineCreate.html), [Windchill 13.1.2 — Purge Conflicts](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/purge/PurgeConflicts.html))
- Windchill can archive data for later restore only when the applicable archive functionality is installed; this is distinct from permanent purge. ([Windchill 13.1.2 — Purge, Archive, and Restore Jobs](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/siteadmin_chp/SiteAdminChp_PurgeArchiveRestore.html))

**IDEA inference**

Mature PLM products permit destructive operations, but put permissions, usage/baseline relationships, version lineage, and administrative conflict checks in front of them. IDEA should add a reversible Trash layer for ordinary users and make physical purge narrower than either vendor's generic delete command. A released or referenced Generation is evidence, not disposable clutter. It should remain until the governing retention/hold and every authoritative reference permit removal. A purge may remove logical records only as one governed scope; content-addressed blobs may be reclaimed later only when their reference count is zero.

### Q86 — releasing an assembly or product structure

**PTC Windchill facts**

- A Windchill promotion request keeps the selected object iterations in a promotion baseline. Related objects can be collected, while the user separately marks which objects are promotion candidates. Under the approval workflow, all approvers must approve before candidate states are promoted; rejection leaves or returns their states to the original state. ([Windchill 13.1.2 — Create a Promotion Request](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/ProdMatPromoReqCreate.html), [Default Promotion Process Workflows](https://support.ptc.com/help/windchill/r13.1.2.0/pt_BR/Windchill_Help_Center/lifecycle_chp/LCChp_PromotionProcess.html))
- Collection behavior is configurable. A collector can include dependent parts/documents and distinguish dependent objects in a structure from merely related objects; only objects remaining visible in the collection are included in the final action. ([Windchill 13.1.2 — Collecting Baseline Objects](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/baselines/BaselineCollectObjects.html))
- Windchill's BOM Release Rule checks resulting objects and their first-level dependants against configured target/valid/invalid states. A child that is itself a resulting object can move to the target state as part of the change; an invalid dependent makes the rule fail. The collector and whether predecessor revisions are checked are configuration options. ([Windchill 13.1.2 — BOM Release Rule](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/businessrules/BusRulesBOMReleaseRuleRef.html))
- For configurable product structures, PTC instructs users to create a managed baseline containing the top module and all other structure objects, then promote the top module and designate that managed baseline for the released revision. ([Windchill 13.1.2 — Defining a Default Baseline](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVDefineDefaultBaseline.html))

**IDEA inference**

IDEA should borrow the explicit collector/preview, exact baseline, eligibility-rule, and approve-then-release pattern. It should not silently cascade release through an unreviewed tree. The MVP collector should recursively resolve all release-required dependencies according to a versioned Release Policy and show `already released`, `candidate`, `excluded`, `unresolved`, and `blocked` disposition for every entry. The user confirms the exact scope; required exclusions fail closed.

The cited vendor pages do **not** establish a database-level all-or-nothing transaction across every promoted object and persisted artifact. IDEA's atomic multi-object Release Record is therefore an IDEA reliability requirement, not a vendor fact.

### Q87 — a child changes after the parent was released

**Aras Innovator facts**

- Aras supports separate structure-resolution modes. `Default` uses the child version physically stored on the relationship; `Latest` and `Latest Released` dynamically resolve newer child generations. These modes can therefore present different structures without proving that the stored parent relationship was rewritten. ([Aras Innovator Release 40 — Structure Resolution Parameters](https://docs.aras.com/aras-innovator-release-40/structure-resolution-parameters/0000019f-3774-d087-a79f-f7770fe00000), [Aras Innovator Platform 29 — Bill of Materials](https://docs.aras.com/aras-innovator-platform-29/bill-of-materials/0000019f-d660-d08f-a1df-df60be0e0000))
- In Aras Express Change Management, a BOM relationship change requires the affected parent to be set to `Revise`; the new parent major revision carries the changed BOM, while the original revision remains non-editable. ([Aras Innovator Release 35 — Express Change Management](https://www.aras.com/community/documentationlibrary/Innovator/35/Content/Innovator%2024%20Docs/Aras%20PE%2014%20-%20User's%20Guide/Express%20Change%20Management.htm))

**PTC Windchill facts**

- Windchill describes a baseline as a snapshot and a baseline configuration filter as selecting the exact versions captured in that baseline. A separate `Latest` configuration specification displays the most recent version instead. Promotion-request filtering likewise displays the versions captured in the promotion baseline. ([Windchill 13.1.2 — Document Structure Filters](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/docmgmt/DocMgmtConfigSpecAbout.html), [Selecting a Baseline Configuration Specification](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMConfigSpecBaseline.html))

**IDEA inference**

IDEA should make the distinction visible in the UI:

- **Released Baseline** always resolves the immutable Structure Snapshot pinned by the chosen Release Record.
- **Current Working Structure** may show newer working or released child revisions under an explicitly named resolution policy and should flag differences from the selected release.
- “Update to latest child” is a deliberate change to a new parent Business Revision, never a side effect of opening, searching, or releasing the child.

This preserves auditability and reproducibility while still giving engineers an actionable indication that a newer child exists.

## Configuration and edition limits

- Aras evidence spans Product Engineering 14 behavior surfaced in Innovator Releases 32/35 and current Platform/Release 40 documentation. ItemType versionability, life cycles, permissions, revision lists, relationship behavior, change processes, and resolution modes are configurable. Dynamic query resolution is not itself proof of a persisted released baseline.
- Windchill evidence is primarily 13.1.2. Baselines are identified by PTC as a Windchill PDMLink capability; collectors, promotion workflows, business-rule sets, valid states, and predecessor checks are administrator-configurable. Optional products can add object types and collection actions. Archive/restore requires separately installed functionality.
- Neither vendor's public documentation proves IDEA's desired immutable `Generation`, `Structure Snapshot`, `Release Record`, recursive dependency closure, or atomic commit implementation. Those remain IDEA requirements to specify and verify independently.

## Recommended answers

- **Q85: A**, with the stricter rule that any retained Release Record, exact Structure Snapshot, approval/audit evidence, reference, retention obligation, or legal hold blocks purge of its pinned data.
- **Q86: A**, with a user-confirmed exact scope, policy-driven recursive dependency closure, eligibility preview, and atomic revalidation/release.
- **Q87: A**: the old release remains exact and immutable; adopting a new child requires a new parent Business Revision and Release Record.

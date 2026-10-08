# Web Interaction and Privacy Contract

| Field | Value |
|---|---|
| ID / version / state / authority | IE-UX-IAM-UI-001 / 0.6 execution status successor / Draft Account through Inspector plus review repairs qualified; accepted technical semantics unchanged / INFORMATIVE |
| Owner / author / review | UI integration owner / Codex, CODEX_ONLY / Project Reviewer DESIGN REVIEW PASS at 0a1de66627fccc4597ac753f6c642d1d8d5f7d1d through human conversation; PG2/PG3/PG4 PASS; actual browser qualification in handoff sections 16/18–22; predecessor independent review FAIL, successor acceptance pending |
| Baseline / change / date | Spec accepted e227cb1d; [operations](operations.md) / Issue #46 / 2026-10-08 Asia/Ho_Chi_Minh |
| Classification / effective / retention / trigger | INTERNAL / NOT-APPLICABLE / Git / operation, privacy, authority or interaction change |
| Supersession / downstream | Mock/security behavior not accepted; no current live contract replaced / actual Web qualification |

1. Obtain session/CSRF through existing same-origin flow. Current context comes from Server, not
   role labels, local arrays, department mapping or fallback Organization.
2. Account screen reads authorized actual fields. Creation shows PENDING, not an automatically
   ACTIVE user. Activation, membership and assignment are distinct operations.
3. Proof handoff is intentional, private and temporary. Redemption target/password control is
   separate from admin UI. No proof in link/URL, clipboard automation, persistence, console or
   retained screenshot/trace. No Swagger Try-out for secret submission.
4. Assignment wizard: Scope → person in Group filter OR labelled Group principal → exact
   Role/version → confirm actual principal/scope/content/interval/reason. Person filter does not
   create membership/dependency. Display organization-wide breadth explicitly; default P where
   supported. Server preview is advisory; commit must revalidate.
5. Multi-role detail is a list of independent assignment IDs/versions/scopes and contributing
   paths. End/replace exactly the selected association; show remaining access, no “remove user
   permissions” aggregate shortcut.
6. Custom successor activation changes no assignment; replacement has its own difference preview.
   Disabled/unsupported/design-only actions are not selectable executables.
7. Project administration distinguishes administrative scope from technical participation.
   Creation grants neither membership nor content. Project/Group membership history is inspectable
   only under declared authority; Group names do not establish authority.
8. Read inspection shows RBAC eligibility separately from owner gates. Never labels a DESIGN-only
   engineering action as usable because a similarly named permission exists.

Every screen supports loading, authorized empty, refusal, stale conflict, unavailable and unresolved
outcome separately. Success is server-confirmed; mutation failure cannot enable mock/dev identity.
Reload restores current state through Server reads, not local grant arrays or localStorage bearer.

Keyboard controls have labels, visible focus, logical order and accessible current-screen errors.
Dialogs contain focus, Escape cancels only cancellable work, and close restores invoking focus.
No colour-only status, clickable div-only actions or focus lost behind an overlay. Confirmations
state target, version, scope and exact consequence; no vague all-powerful “admin” toggle.

Qualification uses actual same-origin packaged Web + trusted HTTPS Server, ordinary HttpOnly
Secure/SameSite cookie, real session/CSRF, refusal/invalidated session, no client caller ActorId,
network-loss behavior and secret-retention inspection. Presentation tests alone are insufficient.
Exact existing UI commits and desired visual intent are retained in [readiness](../integration-readiness.md).

## Historical delivery qualification — Account and Project/Group

The actual authored Login/Admin layout is retained and connected through `App.tsx`, not a mock
or a second route framework. Account context/list/detail, PENDING create, manual proof handoff,
recipient setup/reset, separate disable/re-enable, reload/refusal and uncertain-result handling
are qualified by headed Chrome **10/10** at `b50272136295a9f2fed7142ba6442e44c6738d17`.
See [handoff section 16](../integration-readiness.md#16-account-ui-mvp-fast-delivery-milestone--2026-10-07).
Project/Group now uses the authored Project presentation and Server context/list/detail/actions,
explicit membership/history and Group target prerequisite through `App.tsx#projects`.
Actual headed Chrome **8/8** at `1d3fbd4d35650ec2c561032ae605e440a639473c` qualifies scope refusal,
stale state, committed-response loss/same-ID resolution, unavailable refresh and bounded keyboard/
privacy/session behavior. See [handoff section 18](../integration-readiness.md#18-projectgroup-usable-vertical-slice--2026-10-08).
At that historical milestone, Assignment/Custom/Inspector were not yet delivered. It was not
whole-feature accessibility, independent review or deployment acceptance.

## Current successor delivery — review repairs

Assignment/Custom/Inspector now use actual Server adapters on the retained shell; per-story
results remain sections 19–21. [Section 22](../integration-readiness.md#22-independent-review-repair-successor--2026-10-08)
qualifies the external findings at source 9d3732cb173e8094195b9bdd60b5588ac3cfa42e:
actual Chrome Assignment9/9 and Inspector8/8, Web62/62 + TypeScript. The three-role journey
uses ordinary AA/PA/PRA grants, not prerequisite fixture grants. Assignment confirmation shows
exact predecessor/new Role version/content, interval and added/removed/unchanged permissions.
History uses independent audit.read and truthful safe owner facts; not-retained snapshots are
labelled, no arbitrary Audit or secret export. Keyboard/privacy/session/loss oracles still pass.
These are engineering results. T093/PG5 successor review, deployment and integration remain pending.

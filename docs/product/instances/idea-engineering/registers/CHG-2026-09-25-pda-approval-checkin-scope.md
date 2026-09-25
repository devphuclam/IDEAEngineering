# Product Decision Authority Approval — Check-in Scope

## Control envelope

| Field | Recorded value |
|---|---|
| Stable Supporting Record ID | `IE-CHG-PDA-APPROVAL-003` |
| Class / version / record status | `CHG` / `0.1` / `Draft` record |
| Decision status and date | `APPROVED` / 25-09-2026 |
| Decision authority | Product Decision Authority — project boss |
| Decision reported by | Project Reviewer; in response to the three-branch confirmation question, the project user answered “Duyệt hết” |
| Evidence class | User-reported management decision; signed minutes or approval-system event not supplied |
| Product normativity | Scoped policy decision under DOC-04 `REQ-WS-006`; not approval of the whole DOC-05 or a new `REQ-*` |
| Applicable source | DOC-05 `IE-PROD-ARCH-001@0.24`, `ARCH-VIEW-ACT-004`; predecessor design record [IE-CHG-WS-SCOPE-001](CHG-2026-09-25-checkin-scope-decision-clarification.md) |
| Downstream | DOC-05 successor, VVP-002/003 and WS-09…11; implementation and runtime verification remain `NOT-RUN` |
| Classification / retention | `INTERNAL`; retain with the predecessor diagram rendition and successor source |

## Approved decision

For one proposed Check-in scope, the Product Decision Authority approved all three branches:

1. If the system cannot determine whether a file is required by a selected root, block Check-in.
   Identify the unresolved file and reason. Do not treat it as unrelated; preserve local bytes and
   still-valid Reservations.
2. If a selected root or its required dependency has changed without an `Active` Reservation,
   block the complete proposed Check-in. Do not publish a partial Change Set; preserve local bytes
   and still-valid Reservations.
3. If a changed file without an `Active` Reservation is proven outside the selected roots and
   their required dependency closure, show it as **Modified without Checkout**, exclude it from
   the proposed publish set and require confirmation of the revised exact scope. Declining does
   not Check-in. Confirming permits preflight only; the Server revalidates before publication.

This is an IDEA decision. The bounded [DDM/Aras review](../../../../research/2026-09-25-checkin-unreserved-nonrequired-ddm-aras-review.md)
does not establish that either product uses the exact third branch.

## Source at the decision

The project user confirmed the entire three-branch diagram on 25-09-2026. The reviewed source was
a **working copy**, not Git `HEAD`; the exact rule is reproduced above so that a later editorial
revision cannot enlarge the approved scope.

| Item | Pin at decision |
|---|---|
| DOC-04 `IE-PROD-SREQ-001@0.15` | SHA-256 `ec5ab1c9d0fa449f2d290aff9502665f68c58aa9ad44b379249155c124c6c7ff`; `REQ-WS-006` remains unchanged |
| DOC-05 `IE-PROD-ARCH-001@0.24` | SHA-256 `561adf492fec909a88d92574327f9b263f246832a1c67c0a1d43916412cc143b` |
| [Pre-approval `ARCH-VIEW-ACT-004` Mermaid block](../evidence/IE-VEV-WS-SCOPE-001/ARCH-VIEW-ACT-004.mmd) | SHA-256 `bca5cd47882e37a88385ac924db5c172a1f58bb3a12e3662b96fe54d44cf1858` |
| [Pre-approval SVG](../evidence/IE-VEV-WS-SCOPE-001/ARCH-VIEW-ACT-004.svg) | SHA-256 `d3162e4a33c81cd4878e4b3f5d04ba51b2b7c5e9efa043c574058e81e1a67252`; [render manifest](../evidence/IE-VEV-WS-SCOPE-001/render-results.json) |

## Effects and limits

- DOC-05 may replace “Draft candidate” labels for these **three policy branches** and link this
  decision. The architecture document and diagram rendition still require their own review.
- VVP may add explicit tests for the three branches. A planned test is not a `PASS` result.
- The 17-09 Feature/Spec/Tech predecessor approval remains pinned separately. This decision does
  not select a format-specific dependency resolver, change the Tech Stack, Q-15, Product Scope,
  PG3 or PG4, or authorize an unqualified implementation result.
- If signed minutes or an approval-system event become available, attach them as a successor
  evidence record; do not silently change this decision's scope or date.

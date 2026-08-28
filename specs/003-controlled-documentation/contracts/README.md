# Documentation Contracts

This directory defines the information-item contracts for the `003-controlled-documentation`
increment. They are contracts between authors, reviewers, gate authorities and later template
maintainers; they are not runtime APIs and do not select an application technology.

## Contract index

| Contract | Purpose |
|---|---|
| [document-catalogue.md](document-catalogue.md) | Exact eight core classes, nine supporting classes, authority boundaries and gate mapping |
| [control-fields-and-status.md](control-fields-and-status.md) | Common control envelope, status transitions, version/revision distinction and placeholder rules |
| [evidence-and-trace.md](evidence-and-trace.md) | Evidence classes, clean-room transfer, GOV-owned Material Coverage Inventory/Behavioral Coverage Register, locale boundary and bidirectional trace |
| [gate-package.md](gate-package.md) | PG0–PG7 package inputs, outcomes, independence/representativeness rules, Validation Pack minimums and pilot dispositions |
| [rendition.md](rendition.md) | DOCX/PDF rendition identity, staleness and source-baseline rules |
| [validation.md](validation.md) | Static, review and walkthrough checks tied to the specification's success criteria |

## Common contract rules

1. `CONTEXT.md`, the constitution, accepted ADRs, the standards register and the clean-room
   register remain authoritative in their existing scopes.
2. The eight core documents use IDEA product language only. Reference-product names, citations and
   comparisons stay in supporting research, coverage, ADR or governance records.
3. A missing, blocked or unexecuted prerequisite is visible as such and never represented as a pass.
4. A contract describes what must be recorded and verified; it does not invent a production schema,
   API, deployment topology or technology choice.
5. The Behavioral Coverage Register is a GOV-owned register/sub-register, not a tenth supporting
   class; the eight core templates remain free of reference-product names and comparison narrative.

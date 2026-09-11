# Domain documentation

IDEA Engineering uses one domain context. Before domain work, read [CONTEXT.md](../../CONTEXT.md)
and the [ADR index](../adr/README.md), then the ADRs relevant to the proposed change. The index
distinguishes product decisions from inherited workspace decisions.

## Use the right source

- **Terminology:** use the definitions in CONTEXT.md in requirements, Work Items, designs and tests.
  If a needed concept is missing, record the gap for domain review rather than introducing a
  competing synonym.
- **Product content:** use the [IDEA instance catalogue](../product/instances/idea-engineering/README.md)
  to locate the owning DOC or supporting record and its current status. Class templates describe
  how to author a document; they do not supply IDEA requirements.
- **Reference-product claims:** follow the [knowledge index](../product/knowledge/README.md) and
  preserve the evidence classification. An observation becomes an IDEA requirement only through
  the documented product-decision process.

## Handle conflicts explicitly

If a proposed change conflicts with a documented decision, identify the affected ADR or controlled
record, explain the conflict and obtain the required decision before changing the authoritative
content. Preserve the earlier decision and its history. Keep navigation guides as pointers to these
sources, not additional copies of the domain model.

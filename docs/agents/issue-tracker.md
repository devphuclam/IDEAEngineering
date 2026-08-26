# Work Item tracker routing

Use the provider-neutral **Work Item** language defined in [`CONTEXT.md`](../../CONTEXT.md) throughout Core guidance. Before reading or changing tracked work:

1. Read [`AGENTS.md`](../../AGENTS.md) to identify the selected Platform Adapter.
2. Open that adapter's document below and use its tracker operations.
3. Keep provider names and commands in the adapter document so Generated Projects can replace it without rewriting Core concepts or skill pointers to this file.

## Platform Adapter documents

- [GitHub Platform Adapter](github-platform-adapter.md)

When a skill says **publish to the issue tracker**, use the selected adapter's create operation. When it says **fetch the relevant ticket**, use the selected adapter's read operation.

Wayfinding retains the provider-neutral map, child, blocking, frontier, claim, and resolve concepts. The selected adapter defines how its tracker represents and performs those operations.

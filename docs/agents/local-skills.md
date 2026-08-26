# Project-local Agent Skills

The workflow is usable when an optional global plugin is absent. The repository pins the skills needed to inspect, implement, test, review, document, and recover work in `.agents/skills/manifest.yml`.

Use the local skill instructions as the project source of truth:

- [Implement](../../.agents/skills/implement/SKILL.md)
- [Test-driven development](../../.agents/skills/tdd/SKILL.md)
- [Code review](../../.agents/skills/code-review/SKILL.md)
- [Writing for Agents](../../.agents/skills/writing-for-agents/SKILL.md)
- [Research](../../.agents/skills/research/SKILL.md)
- [Wizard](../../.agents/skills/wizard/SKILL.md)
- [Resolve merge conflicts](../../.agents/skills/resolving-merge-conflicts/SKILL.md)

Spec Kit is installed as a second, project-local skill family. Use the [Spec Kit workflow
guide](spec-kit.md) to combine it with the Matt Pocock skills without duplicating artifacts.

Skills are project-local files, so a Generated Project carries the same documented workflow after creation. A global plugin may add convenience features, but it is not a prerequisite for this catalog.

## Skill sources and updates

The Matt Pocock skills are editable copies from `mattpocock/skills`. The design skill family,
including UI/UX Pro Max, comes from `nextlevelbuilder/ui-ux-pro-max-skill`. Their source paths and
content hashes are recorded in [`skills-lock.json`](../../skills-lock.json), so future updates can
be reproduced without guessing which upstream repository supplied a skill.

From the repository root, update both locked skill families with:

```powershell
npx --yes skills@latest update -p -y
```

Review the resulting diff before committing. Update Spec Kit separately with `specify self check`
and `specify integration upgrade codex --integration-options="--skills"`; do not use the generic
skills updater for the `speckit-*` files. Project-specific skill edits are not an upstream family
and must be reviewed independently.

On Windows, prefer running the generic updater inside the Dev Container or WSL so upstream LF line
endings are preserved. The repository pins UI/UX Pro Max's snapshot-backed catalog files to LF in
`.gitattributes`; this keeps its data-integrity validator deterministic when `core.autocrlf=true`.

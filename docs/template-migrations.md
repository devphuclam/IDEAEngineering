# Template Release Migration Guidance

A Generated Project retains the origin `Template Release` recorded in `.template-provenance` when it is created. After creation, the Generated Project is independently owned; its team decides which later release changes to adopt.

## Intentional adoption

1. Read the target Template Release notes and review the release diff against the Generated Project.
2. Check the migration guidance and identify conflicts with project-owned code, documentation, Stack Profile, and Platform Adapter changes.
3. Apply compatible changes on a focused branch and run `./scripts/verify-template` plus the project's own verification.
4. Keep `.template-provenance` unchanged because it retains origin; record the adopted release in the Generated Project's own changelog or release notes.

There is no silent synchronization and no forced synchronization. A release adoption is a deliberate change owned by the Generated Project team; it must not overwrite project-owned changes automatically.

Keep application Stack Profile and Platform Adapter adoption separate from the Core Workspace migration so each boundary can be reviewed independently.

# IDEA — Roles & Permissions visual concept

**Visual reference only. Synthetic data. Not production code.**

The user approved this single concept for visual exploration and liked the rendered direction
on 2026-10-09. Publication to `main` was explicitly requested so it is available for subsequent
UI Kit work. This does not replace the current application or authorize new product behavior.

## Open the concept

From the repository root, using the existing approved Node.js runtime:

```powershell
node prototypes/iam-visual-concept-preview.mjs
```

Open **http://127.0.0.1:18609/**. Stop the preview with **Ctrl+C**.
The helper serves only the concept and the existing IDEA logo, on loopback. If the port is already
occupied, it stops; do not kill an unrelated process. No package installation or Backend is needed.

Alternatively, open [iam-visual-concept.html](iam-visual-concept.html) directly in a browser
from the checkout. Keep the existing logo at its relative path.

## What to try

- Search or filter the role list and select a role to inspect its permissions.
- Switch between permissions, information and version views.
- Try light/dark and comfortable/compact presentation.
- Use **Tạo vai trò** to preview a RAM-only draft. It is not validated or activated by the Server.

Reload discards the draft. Navigation to other screens explains that they are not included in
this concept. There is no API call, authentication, permission grant, persistence or deployment.
Role codes follow the inspected supported profile; custom role identities and user data are
illustrative, not records from a database.

## Direction to carry into the existing UI Kit

- Keep the actual IDEA logo, its proportions and its colors.
- Soft neutral canvas, white working surfaces, graphite text and restrained blue interaction color.
- Clear hierarchy: header, navigation, toolbar, table, detail inspector.
- Readable typography; compact mode primarily reduces spacing, not every text size.
- Thin borders, modest corner radius, consistent authored outline icons, no decorative card grid.
- Keep exact role/version/scope meaning visible while giving task-oriented labels priority.

Use this as a presentation reference, not as a replacement application: preserve real Server data,
component interfaces, validation, refusal/error states, session/CSRF and authorization logic.
Do not copy synthetic draft behavior into production. No new component framework, font or icon
dependency is required by this concept.

The [reference study](../docs/research/2026-10-09-enterprise-ui-visual-direction-reference-study.md)
separates publisher guidance from IDEA interpretation and user preference.

## Verification limits

The concept was rendered and visually inspected, with positive user feedback. The complete
interaction/browser qualification is **NOT-RUN**. Publication checks cover source syntax, local
links, preview resource boundaries and diff scope only. Application tests, Maven, PostgreSQL,
runtime qualification and `verify-template` are **NOT-RUN**; no application source changed.

Publication checks on 2026-10-09: inline JavaScript and helper syntax passed; four local document
links resolved; five HTTP resource/method checks passed; the owned preview process stopped.
These checks used the existing Node.js 24.19.0 binary, SHA-256
`3602f2bb1a10f2cbab4c36886218a33c1ab3db87290e73b033c46c77147d0237`.

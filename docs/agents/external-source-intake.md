# External Source and License Intake

Use this procedure before cloning or pulling an external project for adaptation, adding it as a
submodule or dependency, copying code or documentation, vendoring a repository, or importing an
icon, font, model, dataset, SDK, converter or generated asset into IDEA Engineering.

This is an engineering intake control, not legal advice. The detailed future-commercial obligation
is tracked by
[`IE-GOV-COMMERCIAL-001`](../product/instances/idea-engineering/registers/GOV-future-commercial-readiness.md).

## 1. Classify the intended use

Choose one before copying anything:

| Use | Meaning |
|---|---|
| `REFERENCE-ONLY` | Inspect behavior or public concepts. No source, text, schema, image or proprietary asset enters IDEA. |
| `DEPENDENCY` | IDEA calls or packages the third-party component. |
| `COPY-OR-ADAPT` | Source, configuration, documentation or assets are copied or modified. |
| `FORK-OR-VENDOR` | A third-party repository or substantial subset is retained and maintained with IDEA. |

Completion criterion: the intended use and the exact material in scope are written down. A vague
plan to “borrow from” a repository is not an intake decision.

## 2. Pin source and rights evidence

Record all applicable fields:

- project name, owner and canonical URL;
- exact tag or commit, retrieval date and artifact checksum when practical;
- license identifier and the license/notice files from that exact source state;
- separate terms for code, documentation, examples, fonts, icons, media, data, models and SDKs;
- intended internal use, later distribution and modification/linking/hosting model.

Public access is not permission to reuse. If no license grants the needed right, classify the intake
`BLOCKED`; keep it reference-only and copy nothing into IDEA. Package metadata, a repository badge
or a third-party summary does not override the actual license and notice files.

Completion criterion: another reviewer can reproduce the source identity and read the terms that
were evaluated.

## 3. Evaluate obligations against the intended use

Account for every applicable obligation or restriction:

- attribution, copyright notice and bundled license text;
- `NOTICE` file or acknowledgement requirements;
- source-offer, corresponding-source, copyleft or network-use obligations;
- modification marking and relinking/replacement requirements;
- commercial-use, field-of-use, user/seat/server and redistribution restrictions;
- patent license, patent retaliation and contributor terms;
- trademark, product-name and logo restrictions;
- confidentiality, export, data, model-weight or dataset conditions;
- separate CAD/Office SDK, converter, plug-in or runtime EULA conditions.

Escalate to the Legal Review Authority before reuse when terms are missing, custom, conflicting,
non-commercial, source-disclosure/network-copyleft, redistribution-limited, or otherwise unclear for
the intended future offering. Do not treat internal use today as proof that commercial distribution
later will be allowed.

Completion criterion: every identified obligation has an owner and a concrete compliance action, or
the intake remains blocked.

## 4. Record one disposition before import

| Disposition | Meaning |
|---|---|
| `REFERENCE-ONLY` | May be studied with recorded provenance; no material is imported. |
| `APPROVED` | Exact source and intended use are compatible and no unfulfilled special obligation remains. |
| `APPROVED-WITH-OBLIGATIONS` | Reuse is allowed only with the recorded notices, source handling, packaging or other actions. |
| `BLOCKED-LEGAL` | Legal qualification or company authority is required before reuse. |
| `REJECTED` | Do not use this source for the intended purpose. |

For `DEPENDENCY`, `COPY-OR-ADAPT` or `FORK-OR-VENDOR`, record the result in a controlled third-party
intake record and update the dependency/license inventory. Preserve required license and notice text
with the distributed artifact. Transitive components belong in the later SBOM even when a direct
dependency owns their lockfile entry.

Completion criterion: the disposition exists before the first imported line or asset is committed.

## 5. Keep the decision current

Reopen intake when the source version, license, linking/hosting model, distribution model, product
market or copied material changes. A previously accepted version does not automatically approve a
successor version.

Completion criterion: the committed source or dependency resolves to the same identity and use that
the intake record approved.

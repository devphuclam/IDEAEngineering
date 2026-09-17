# IDEA Engineering Core v0 — Feature / Spec / Tech presentation source map

- Presentation: `docs/reports/IDEA-Engineering-Core-v0-Feature-Spec-Tech-Management-Review-2026-09-16-FINAL.pptx`
- Source generator: `scripts/presentations/build-idea-core-v0-feature-spec-tech-review.mjs`
- Source commit: `f269a0445737a7efd7f406ee51517149a8967afa`
- Slide count: 18
- Controlled diagram inventory: `docs/reports/IDEA-Engineering-Core-v0-controlled-diagram-inventory-2026-09-16.md`
- PowerPoint hyperlinks verified: 23/23
- Current SRS count represented: 87 requirements
- Q-15 represented as: `PARTIAL / NO WINNER`
- Product Decision Authority approval represented as: `NOT-RUN`

## Final slide list

1. FEATURE → SPEC → TECH
2. Controlled Views dùng trong buổi review
3. Feature — Core v0 cung cấp những năng lực gì?
4. Feature — Core v0 làm gì và không làm gì?
5. Spec — Hệ thống bắt buộc phải vận hành đúng như thế nào?
6. Spec — Danh tính và lịch sử dữ liệu
7. Spec — Chỉnh sửa tài liệu mà không phá lịch sử
8. Spec — Product Structure phải tái tạo được lịch sử
9. Spec — Release là một baseline chính xác
10. Spec — Correctness phải giữ được cả khi có lỗi
11. Spec — Requirement chỉ hoàn chỉnh khi kiểm chứng được
12. Tech — Engineering hiện thực Spec bằng kiến trúc nào?
13. Tech — Công nghệ nào chịu trách nhiệm gì?
14. Tech — Các phương án đã được xem xét
15. Ba quyết định cần Management review
16. ARCH-VIEW-RBAC-001 — Principal-role-scope authorization model
17. TECH-D04 — Runtime & Protocol View
18. TECH-D05 — Deployment View

## Diagram inventory

Slide 1 — FEATURE → SPEC → TECH — Presentation synthesis — DOC-01@0.6; DOC-04@0.13; DOC-05@0.20
Slide 2 — Controlled Views dùng trong buổi review — Presentation synthesis — DOC-05@0.20; DOC-06@0.16; TECH-VIEWS@0.2
Slide 3 — Feature — Core v0 cung cấp những năng lực gì? — Presentation synthesis — DOC-01@0.6; DOC-03@0.7; FEATURE-001@0.12
Slide 4 — Feature — Core v0 làm gì và không làm gì? — Presentation synthesis — DOC-01@0.6; DOC-04@0.13
Slide 5 — Spec — Hệ thống bắt buộc phải vận hành đúng như thế nào? — Presentation synthesis — DOC-04@0.13; VVP@0.16
Slide 6 — Spec — Danh tính và lịch sử dữ liệu — Management simplification — DATA-VIEW-CORE-001
Slide 7 — Spec — Chỉnh sửa tài liệu mà không phá lịch sử — Management simplification — ARCH-VIEW-MOD-002; ARCH-VIEW-SEQ-002; DATA-VIEW-WS-001
Slide 8 — Spec — Product Structure phải tái tạo được lịch sử — Management simplification — DATA-VIEW-CORE-001
Slide 9 — Spec — Release là một baseline chính xác — Management simplification — ARCH-VIEW-SEQ-003
Slide 10 — Spec — Correctness phải giữ được cả khi có lỗi — Management simplification — ARCH-VIEW-RBAC-001; DATA-VIEW-AUTH-001
Slide 11 — Spec — Requirement chỉ hoàn chỉnh khi kiểm chứng được — Presentation synthesis — DOC-04@0.13; VVP@0.16
Slide 12 — Tech — Engineering hiện thực Spec bằng kiến trúc nào? — Management simplification — TECH-D01; TECH-D05
Slide 13 — Tech — Công nghệ nào chịu trách nhiệm gì? — Management simplification — TECH-D03
Slide 14 — Tech — Các phương án đã được xem xét — Management simplification — TECH-D08
Slide 15 — Ba quyết định cần Management review — Presentation synthesis — FEATURE-001@0.12; DOC-04@0.13; TECH-001@0.14
Slide 16 — ARCH-VIEW-RBAC-001 — Principal-role-scope authorization model — Direct reuse — ARCH-VIEW-RBAC-001
Slide 17 — TECH-D04 — Runtime & Protocol View — Direct reuse — TECH-D04
Slide 18 — TECH-D05 — Deployment View — Direct reuse — TECH-D05

Slides 16–18 directly reuse current controlled renderings. Other diagram slides are marked as Management simplification or Presentation synthesis.

## Slide-to-source mapping

| Slide | Controlled source |
|---:|---|
| 1 | DOC-01@0.6; DOC-04@0.13; DOC-05@0.20 |
| 2 | DOC-05@0.20; DOC-06@0.16; TECH-VIEWS@0.2 |
| 3 | DOC-01@0.6; DOC-03@0.7; FEATURE-001@0.12 |
| 4 | DOC-01@0.6; DOC-04@0.13 |
| 5 | DOC-04@0.13; VVP@0.16 |
| 6 | DATA-VIEW-CORE-001 |
| 7 | ARCH-VIEW-MOD-002; ARCH-VIEW-SEQ-002; DATA-VIEW-WS-001 |
| 8 | DATA-VIEW-CORE-001 |
| 9 | ARCH-VIEW-SEQ-003 |
| 10 | ARCH-VIEW-RBAC-001; DATA-VIEW-AUTH-001 |
| 11 | DOC-04@0.13; VVP@0.16 |
| 12 | TECH-D01; TECH-D05 |
| 13 | TECH-D03 |
| 14 | TECH-D08 |
| 15 | FEATURE-001@0.12; DOC-04@0.13; TECH-001@0.14 |
| 16 | ARCH-VIEW-RBAC-001 |
| 17 | TECH-D04 |
| 18 | TECH-D05 |

## Exact source links

- [DOC-01@0.6](https://github.com/devphuclam/IDEAEngineering/blob/f269a0445737a7efd7f406ee51517149a8967afa/docs/product/instances/idea-engineering/DOC-01-product-vision-and-scope.md)
- [DOC-03@0.7](https://github.com/devphuclam/IDEAEngineering/blob/f269a0445737a7efd7f406ee51517149a8967afa/docs/product/instances/idea-engineering/DOC-03-business-requirements.md)
- [DOC-04@0.13](https://github.com/devphuclam/IDEAEngineering/blob/f269a0445737a7efd7f406ee51517149a8967afa/docs/product/instances/idea-engineering/DOC-04-software-requirements-specification.md)
- [DOC-05@0.20](https://github.com/devphuclam/IDEAEngineering/blob/f269a0445737a7efd7f406ee51517149a8967afa/docs/product/instances/idea-engineering/DOC-05-architecture-description.md)
- [DOC-06@0.16](https://github.com/devphuclam/IDEAEngineering/blob/f269a0445737a7efd7f406ee51517149a8967afa/docs/product/instances/idea-engineering/DOC-06-data-integration-and-migration-specification.md)
- [DOC-08@0.12](https://github.com/devphuclam/IDEAEngineering/blob/f269a0445737a7efd7f406ee51517149a8967afa/docs/product/instances/idea-engineering/DOC-08-ui-ux-and-interaction-specification.md)
- [FEATURE-001@0.12](https://github.com/devphuclam/IDEAEngineering/blob/f269a0445737a7efd7f406ee51517149a8967afa/docs/product/instances/idea-engineering/decision-briefs/FEATURE-001-feature-definition-and-scope.md)
- [TECH-001@0.14](https://github.com/devphuclam/IDEAEngineering/blob/f269a0445737a7efd7f406ee51517149a8967afa/docs/product/instances/idea-engineering/decision-briefs/TECH-001-technology-and-architecture-proposal.md)
- [IE-KNW-TECH-DEC-001@0.6](https://github.com/devphuclam/IDEAEngineering/blob/f269a0445737a7efd7f406ee51517149a8967afa/docs/product/knowledge/2026-09-13-core-v0-technology-decision-matrix.md)
- [IE-ARC-TECH-VIEW-001@0.2](https://github.com/devphuclam/IDEAEngineering/blob/f269a0445737a7efd7f406ee51517149a8967afa/docs/product/instances/idea-engineering/technology/IDEA-core-v0-technology-architecture-views.md)
- [VVP@0.16](https://github.com/devphuclam/IDEAEngineering/blob/f269a0445737a7efd7f406ee51517149a8967afa/docs/product/instances/idea-engineering/registers/VVP-core-v0-verification-validation-plan.md)

## Validation status

- Finalizer result: PASS
- Management simplifications and presentation syntheses remain editable in PowerPoint.
- Direct-reuse appendix views retain their controlled rendering and link to the commit-pinned SVG.
- Controlled view inventory count: 38.
- Real external hyperlinks verified in the PPTX package: 23.
- No native table or quantitative chart was required.
- Worker runtime/toolchain remains qualification-dependent.
- Technology baseline is Engineering-selected; Product Decision Authority review remains NOT-RUN.

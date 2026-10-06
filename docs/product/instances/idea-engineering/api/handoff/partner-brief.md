# IDEA Core v0 — partner assessment brief

`IE-API-HANDOFF-PARTNER-001`, v0.1, Draft, INFORMATIVE.
**INTERNAL DRAFT — NOT APPROVED FOR EXTERNAL SHARING.**
Control fields inherit the [hub envelope](README.md). Intended recipient and authorized disclosure
are UNKNOWN; no partner access or service commitment is established.

## Purpose

Support a scoped technical discussion, not offer an already supported public integration API.
IDEA's contract documentation separates implemented interfaces from internal services,
qualification fixtures, design-only operations and deferred capabilities.

## Current capability description

The documented Identity/Session boundary covers sign-in/sign-out, current session, scoped
account administration and first-credential/password-reset flows. The Server establishes
identity and applies current eligibility and scoped permissions. Administrative authority is
not implied by sign-in.

The broader Core catalogue covers controlled product information, discovery, structure,
lifecycle, configuration, custody/transfer, evidence and related semantic interfaces.
Catalogue presence does not mean a client-facing endpoint exists.

## Exclusions

Core v0 does not promise supported public integration, direct database access, ERP/MRP write-back
or bidirectional synchronization. Internal and synthetic qualification interfaces are not
partner contracts. No production URL, partner account, availability commitment, throughput,
support agreement or rollout date is offered by this brief.

## Before an integration handoff

Agree the use case, data ownership, exact operations, permission model, interface/version,
environment, security obligations, acceptance tests and support contacts. Approve the disclosure
scope and produce a recipient-specific frozen package. Secrets are exchanged through a separately
approved mechanism, not included in API documentation.

This brief has not been sent to any partner. External approval and actual integration remain
separate from internal documentation acceptance.

package com.idea.ddm.access;

/** Fixed owner projections, correlated to the unique admitted request/commit attempt.
 * Refused authorization attempts do not reserve an OperationId and cannot supply its scope.
 * Missing or ambiguous retained evidence yields NULL and must fail closed, never guess.
 */
final class CommittedAdministrationScope {
    private CommittedAdministrationScope() {}
    static final String ASSIGNMENT = """
        (SELECT min(c.requested_scope::text)
         FROM assignment_authorization_evidence c
         JOIN assignment_authorization_evidence r ON r.attempt_id=c.attempt_id AND r.stage='REQUEST'
         WHERE c.operation_id=e.operation_id AND r.operation_id=e.operation_id AND c.stage='COMMIT'
           AND c.actor_id=e.actor_id AND r.actor_id=e.actor_id
           AND c.organization_id=e.organization_id AND r.organization_id=e.organization_id
           AND c.eligible AND c.granted AND c.delegation_allowed
           AND r.eligible AND r.granted AND r.delegation_allowed
           AND c.requested_scope=r.requested_scope
         HAVING count(*)=1)
        """;
    static final String PROJECT = """
        (SELECT min((c.paths->'requestedScope')::text)
         FROM project_authorization_evidence c
         JOIN project_authorization_evidence r ON r.attempt_id=c.attempt_id AND r.stage='REQUEST'
         WHERE c.operation_id=e.operation_id AND r.operation_id=e.operation_id AND c.stage='COMMIT'
           AND c.actor_id=e.actor_id AND r.actor_id=e.actor_id
           AND c.organization_id=e.organization_id AND r.organization_id=e.organization_id
           AND c.permission_code=e.action AND r.permission_code=e.action
           AND c.eligible AND c.granted AND r.eligible AND r.granted
           AND c.paths->'requestedScope'=r.paths->'requestedScope'
         HAVING count(*)=1)
        """;
}

namespace Idea.Q15.WorkspaceProtocol;

public sealed class RequestValidator(string workspaceId, string sessionId, byte[] secret, TimeProvider? timeProvider = null)
{
    private readonly TimeProvider _timeProvider = timeProvider ?? TimeProvider.System;

    public ProtocolValidationResult Validate(WorkspaceRequest request)
    {
        if (!string.Equals(request.ProtocolVersion, ProtocolConstants.Version, StringComparison.Ordinal))
            return ProtocolValidationResult.Refused("PROTOCOL_VERSION", "Unsupported Workspace protocol version.");
        if (request.RequestId == Guid.Empty)
            return ProtocolValidationResult.Refused("REQUEST_ID", "A non-empty request identity is required.");
        if (!string.Equals(request.WorkspaceId, workspaceId, StringComparison.Ordinal))
            return ProtocolValidationResult.Refused("WORKSPACE_MISMATCH", "Request is bound to another Workspace.");
        if (!string.Equals(request.SessionId, sessionId, StringComparison.Ordinal))
            return ProtocolValidationResult.Refused("SESSION_STALE", "Workspace session is stale or unknown.");
        if (request.Sequence <= 0)
            return ProtocolValidationResult.Refused("SEQUENCE", "Sequence must be positive.");

        DateTimeOffset issuedAt;
        try
        {
            issuedAt = DateTimeOffset.FromUnixTimeMilliseconds(request.IssuedAtUnixMs);
        }
        catch (ArgumentOutOfRangeException)
        {
            return ProtocolValidationResult.Refused("TIMESTAMP", "Issued time is invalid.");
        }

        if ((_timeProvider.GetUtcNow() - issuedAt).Duration() > ProtocolConstants.MaximumClockSkew)
            return ProtocolValidationResult.Refused("SESSION_STALE", "Request is outside the accepted time window.");
        if (!ProtocolSigner.Verify(request, secret))
            return ProtocolValidationResult.Refused("AUTHENTICATION", "Workspace request authentication failed.");
        return ValidatePayload(request);
    }

    private static ProtocolValidationResult ValidatePayload(WorkspaceRequest request)
    {
        if (request.Payload.ValueKind != System.Text.Json.JsonValueKind.Object)
            return ProtocolValidationResult.Refused("PAYLOAD_SCHEMA", "Payload must be an object.");

        var allowed = request.Operation switch
        {
            WorkspaceOperation.GetWorkspaceStatus => Array.Empty<string>(),
            WorkspaceOperation.OpenDocument => ["documentId", "generationId"],
            WorkspaceOperation.OpenFolder => ["documentId"],
            WorkspaceOperation.SelectFile => ["documentId", "artifactRole"],
            WorkspaceOperation.LaunchApprovedApplication => ["documentId", "generationId", "applicationCode"],
            _ => null
        };
        if (allowed is null)
            return ProtocolValidationResult.Refused("UNKNOWN_OPERATION", "Operation is not allowlisted.");

        var actual = request.Payload.EnumerateObject().Select(static p => p.Name).ToArray();
        if (actual.Any(name => !allowed.Contains(name, StringComparer.Ordinal)) ||
            allowed.Any(name => !actual.Contains(name, StringComparer.Ordinal)))
            return ProtocolValidationResult.Refused("PAYLOAD_SCHEMA", "Payload fields do not match the operation schema.");

        foreach (var property in request.Payload.EnumerateObject())
        {
            if (property.Value.ValueKind != System.Text.Json.JsonValueKind.String ||
                string.IsNullOrWhiteSpace(property.Value.GetString()) ||
                property.Value.GetString()!.Length > 128)
                return ProtocolValidationResult.Refused("PAYLOAD_SCHEMA", $"Field {property.Name} is invalid.");
        }

        if (actual.Any(static name => name.Contains("path", StringComparison.OrdinalIgnoreCase) ||
                                      name.Contains("command", StringComparison.OrdinalIgnoreCase) ||
                                      name.Contains("shell", StringComparison.OrdinalIgnoreCase)))
            return ProtocolValidationResult.Refused("FORBIDDEN_PROXY", "Arbitrary command/path fields are forbidden.");
        return ProtocolValidationResult.Valid();
    }
}

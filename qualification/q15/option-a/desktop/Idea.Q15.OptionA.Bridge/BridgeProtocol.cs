using System.Text;
using System.Text.Json;

namespace Idea.Q15.OptionA.Bridge;

public sealed record BridgeIntent(string ProtocolVersion, string BridgeSessionId, Guid RequestId, string Operation, JsonElement Payload);
public sealed record BridgeValidation(bool Accepted, string Code, string Detail, BridgeIntent? Intent)
{
    public static BridgeValidation Refused(string code, string detail) => new(false, code, detail, null);
}

public sealed class BridgeGuard(Uri allowedOrigin, string sessionId)
{
    public const int MaximumMessageBytes = 16_384;
    private static readonly HashSet<string> AllowedOperations = new(StringComparer.Ordinal)
    {
        "GetWorkspaceStatus", "OpenDocument", "OpenFolder", "SelectFile", "LaunchApprovedApplication"
    };
    private readonly HashSet<Guid> _seenRequestIds = [];
    private readonly object _sync = new();

    public BridgeValidation Validate(Uri source, string json)
    {
        if (!SameOrigin(source, allowedOrigin))
            return BridgeValidation.Refused("ORIGIN_REFUSED", "WebView message origin is not allowlisted.");
        if (Encoding.UTF8.GetByteCount(json) is <= 0 or > MaximumMessageBytes)
            return BridgeValidation.Refused("MESSAGE_SIZE", "WebView message exceeds the allowed size.");

        try
        {
            using var document = JsonDocument.Parse(json, new JsonDocumentOptions { MaxDepth = 8 });
            if (document.RootElement.ValueKind != JsonValueKind.Object)
                return BridgeValidation.Refused("MESSAGE_SCHEMA", "WebView message must be an object.");
            var expectedRoot = new[] { "protocolVersion", "bridgeSessionId", "requestId", "operation", "payload" };
            var actualRoot = document.RootElement.EnumerateObject().Select(static property => property.Name).ToArray();
            if (actualRoot.Length != expectedRoot.Length || actualRoot.Any(name => !expectedRoot.Contains(name, StringComparer.Ordinal)))
                return BridgeValidation.Refused("MESSAGE_SCHEMA", "WebView message fields do not match the versioned schema.");

            var protocolVersion = document.RootElement.GetProperty("protocolVersion").GetString();
            var suppliedSession = document.RootElement.GetProperty("bridgeSessionId").GetString();
            var requestIdText = document.RootElement.GetProperty("requestId").GetString();
            var operation = document.RootElement.GetProperty("operation").GetString();
            var payload = document.RootElement.GetProperty("payload");
            if (protocolVersion != "1.0") return BridgeValidation.Refused("PROTOCOL_VERSION", "Unsupported Desktop bridge version.");
            if (!string.Equals(suppliedSession, sessionId, StringComparison.Ordinal)) return BridgeValidation.Refused("BRIDGE_SESSION", "Navigation invalidated this bridge session.");
            if (!Guid.TryParse(requestIdText, out var requestId) || requestId == Guid.Empty) return BridgeValidation.Refused("REQUEST_ID", "A valid requestId is required.");
            if (operation is null || !AllowedOperations.Contains(operation)) return BridgeValidation.Refused("UNKNOWN_OPERATION", "Desktop bridge operation is not allowlisted.");
            if (payload.ValueKind != JsonValueKind.Object) return BridgeValidation.Refused("PAYLOAD_SCHEMA", "Intent payload must be an object.");

            var payloadCheck = ValidatePayload(operation, payload);
            if (!payloadCheck.Accepted) return payloadCheck;
            lock (_sync)
            {
                if (!_seenRequestIds.Add(requestId)) return BridgeValidation.Refused("REPLAY", "Desktop bridge requestId was already observed.");
            }
            return new BridgeValidation(true, "OK", string.Empty,
                new BridgeIntent(protocolVersion, suppliedSession!, requestId, operation, payload.Clone()));
        }
        catch (JsonException exception)
        {
            return BridgeValidation.Refused("MALFORMED_MESSAGE", exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            return BridgeValidation.Refused("MESSAGE_SCHEMA", exception.Message);
        }
    }

    private static BridgeValidation ValidatePayload(string operation, JsonElement payload)
    {
        string[] expected = operation switch
        {
            "GetWorkspaceStatus" => [],
            "OpenDocument" => ["documentId", "generationId"],
            "OpenFolder" => ["documentId"],
            "SelectFile" => ["documentId", "artifactRole"],
            "LaunchApprovedApplication" => ["documentId", "generationId", "applicationCode"],
            _ => throw new InvalidOperationException("Operation is not allowlisted.")
        };
        var actual = payload.EnumerateObject().Select(static property => property.Name).ToArray();
        if (actual.Length != expected.Length || actual.Any(name => !expected.Contains(name, StringComparer.Ordinal)))
            return BridgeValidation.Refused("PAYLOAD_SCHEMA", "Intent payload fields do not match the operation schema.");
        if (actual.Any(static name => name.Contains("path", StringComparison.OrdinalIgnoreCase) ||
                                      name.Contains("command", StringComparison.OrdinalIgnoreCase) ||
                                      name.Contains("shell", StringComparison.OrdinalIgnoreCase)))
            return BridgeValidation.Refused("FORBIDDEN_PROXY", "Arbitrary command/path fields are forbidden.");
        foreach (var property in payload.EnumerateObject())
        {
            if (property.Value.ValueKind != JsonValueKind.String || string.IsNullOrWhiteSpace(property.Value.GetString()) || property.Value.GetString()!.Length > 128)
                return BridgeValidation.Refused("PAYLOAD_BOUNDS", $"Intent field {property.Name} is invalid.");
        }
        return new BridgeValidation(true, "OK", string.Empty, null);
    }

    private static bool SameOrigin(Uri left, Uri right) =>
        string.Equals(left.Scheme, right.Scheme, StringComparison.OrdinalIgnoreCase) &&
        string.Equals(left.Host, right.Host, StringComparison.OrdinalIgnoreCase) &&
        left.Port == right.Port;
}

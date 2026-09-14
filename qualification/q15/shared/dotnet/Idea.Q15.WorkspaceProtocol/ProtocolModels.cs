using System.Text.Json;
using System.Text.Json.Serialization;

namespace Idea.Q15.WorkspaceProtocol;

public static class ProtocolConstants
{
    public const string Version = "1.0";
    public const string DefaultPipeName = "idea-q15-workspace-v1";
    public const int MaximumFrameBytes = 65_536;
    public static readonly TimeSpan MaximumClockSkew = TimeSpan.FromMinutes(2);
}

[JsonConverter(typeof(JsonStringEnumConverter<WorkspaceOperation>))]
public enum WorkspaceOperation
{
    GetWorkspaceStatus,
    OpenDocument,
    OpenFolder,
    SelectFile,
    LaunchApprovedApplication
}

public sealed record WorkspaceRequest(
    string ProtocolVersion,
    Guid RequestId,
    string WorkspaceId,
    string SessionId,
    long Sequence,
    long IssuedAtUnixMs,
    WorkspaceOperation Operation,
    JsonElement Payload,
    string Mac);

public sealed record UnsignedWorkspaceRequest(
    string ProtocolVersion,
    Guid RequestId,
    string WorkspaceId,
    string SessionId,
    long Sequence,
    long IssuedAtUnixMs,
    WorkspaceOperation Operation,
    JsonElement Payload);

public sealed record WorkspaceResponse(
    string ProtocolVersion,
    Guid RequestId,
    string Status,
    string Code,
    JsonElement Payload,
    bool PreservesLocalCandidate,
    string Mac);

public sealed record UnsignedWorkspaceResponse(
    string ProtocolVersion,
    Guid RequestId,
    string Status,
    string Code,
    JsonElement Payload,
    bool PreservesLocalCandidate);

public sealed record ProtocolValidationResult(bool IsValid, string Code, string Detail)
{
    public static ProtocolValidationResult Valid() => new(true, "OK", string.Empty);
    public static ProtocolValidationResult Refused(string code, string detail) => new(false, code, detail);
}

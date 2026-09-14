using System.Security.Cryptography;
using System.Text;

namespace Idea.Q15.WorkspaceProtocol;

public static class ProtocolSigner
{
    public static WorkspaceRequest Sign(UnsignedWorkspaceRequest request, ReadOnlySpan<byte> secret)
    {
        var mac = ComputeMac(RequestSigningText(request), secret);
        return new WorkspaceRequest(
            request.ProtocolVersion,
            request.RequestId,
            request.WorkspaceId,
            request.SessionId,
            request.Sequence,
            request.IssuedAtUnixMs,
            request.Operation,
            request.Payload,
            mac);
    }

    public static WorkspaceResponse Sign(UnsignedWorkspaceResponse response, ReadOnlySpan<byte> secret)
    {
        var mac = ComputeMac(ResponseSigningText(response), secret);
        return new WorkspaceResponse(
            response.ProtocolVersion,
            response.RequestId,
            response.Status,
            response.Code,
            response.Payload,
            response.PreservesLocalCandidate,
            mac);
    }

    public static bool Verify(WorkspaceRequest request, ReadOnlySpan<byte> secret)
    {
        var unsigned = new UnsignedWorkspaceRequest(
            request.ProtocolVersion,
            request.RequestId,
            request.WorkspaceId,
            request.SessionId,
            request.Sequence,
            request.IssuedAtUnixMs,
            request.Operation,
            request.Payload);
        return VerifyMac(request.Mac, RequestSigningText(unsigned), secret);
    }

    public static bool Verify(WorkspaceResponse response, ReadOnlySpan<byte> secret)
    {
        var unsigned = new UnsignedWorkspaceResponse(
            response.ProtocolVersion,
            response.RequestId,
            response.Status,
            response.Code,
            response.Payload,
            response.PreservesLocalCandidate);
        return VerifyMac(response.Mac, ResponseSigningText(unsigned), secret);
    }

    public static string Fingerprint(WorkspaceRequest request)
    {
        var unsigned = new UnsignedWorkspaceRequest(
            request.ProtocolVersion,
            request.RequestId,
            request.WorkspaceId,
            request.SessionId,
            request.Sequence,
            request.IssuedAtUnixMs,
            request.Operation,
            request.Payload);
        return Base64Url(SHA256.HashData(Encoding.UTF8.GetBytes(RequestSigningText(unsigned))));
    }

    private static string RequestSigningText(UnsignedWorkspaceRequest request) => string.Join('\n',
        request.ProtocolVersion,
        request.RequestId.ToString("D"),
        request.WorkspaceId,
        request.SessionId,
        request.Sequence.ToString(System.Globalization.CultureInfo.InvariantCulture),
        request.IssuedAtUnixMs.ToString(System.Globalization.CultureInfo.InvariantCulture),
        request.Operation.ToString(),
        PayloadHash(request.Payload));

    private static string ResponseSigningText(UnsignedWorkspaceResponse response) => string.Join('\n',
        response.ProtocolVersion,
        response.RequestId.ToString("D"),
        response.Status,
        response.Code,
        response.PreservesLocalCandidate ? "true" : "false",
        PayloadHash(response.Payload));

    private static string PayloadHash(System.Text.Json.JsonElement payload) =>
        Base64Url(SHA256.HashData(Encoding.UTF8.GetBytes(ProtocolJson.Canonicalize(payload))));

    private static string ComputeMac(string text, ReadOnlySpan<byte> secret) =>
        Base64Url(HMACSHA256.HashData(secret, Encoding.UTF8.GetBytes(text)));

    private static bool VerifyMac(string supplied, string text, ReadOnlySpan<byte> secret)
    {
        try
        {
            var expected = HMACSHA256.HashData(secret, Encoding.UTF8.GetBytes(text));
            var actual = FromBase64Url(supplied);
            return CryptographicOperations.FixedTimeEquals(expected, actual);
        }
        catch (FormatException)
        {
            return false;
        }
    }

    public static string Base64Url(ReadOnlySpan<byte> value) =>
        Convert.ToBase64String(value).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    public static byte[] FromBase64Url(string value)
    {
        var normalized = value.Replace('-', '+').Replace('_', '/');
        normalized = normalized.PadRight(normalized.Length + ((4 - normalized.Length % 4) % 4), '=');
        return Convert.FromBase64String(normalized);
    }
}

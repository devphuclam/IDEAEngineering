using Idea.Q15.OptionA.Bridge;
using Xunit;

namespace Idea.Q15.OptionA.Bridge.Tests;

public sealed class BridgeGuardTests
{
    private readonly Uri _origin = new("http://127.0.0.1:5173");
    private const string Session = "bridge-session";

    [Fact]
    public void AcceptsExactTypedIntent()
    {
        var result = Guard().Validate(_origin, Message("OpenDocument", "{\"documentId\":\"DOC-Q15-000001\",\"generationId\":\"GEN-Q15-000001-V001\"}"));
        Assert.True(result.Accepted);
        Assert.Equal("OpenDocument", result.Intent!.Operation);
    }

    [Theory]
    [InlineData("https://evil.example", "ORIGIN_REFUSED")]
    [InlineData("http://127.0.0.1:5174", "ORIGIN_REFUSED")]
    public void RefusesWrongOrigin(string origin, string code)
    {
        var result = Guard().Validate(new Uri(origin), Message("GetWorkspaceStatus", "{}"));
        Assert.False(result.Accepted); Assert.Equal(code, result.Code);
    }

    [Fact]
    public void RefusesUnknownOperation()
    {
        var result = Guard().Validate(_origin, Message("RunShell", "{}"));
        Assert.False(result.Accepted); Assert.Equal("UNKNOWN_OPERATION", result.Code);
    }

    [Fact]
    public void RefusesArbitraryPathAndCommandFields()
    {
        var path = Guard().Validate(_origin, Message("OpenDocument", "{\"documentId\":\"DOC-Q15-000001\",\"generationId\":\"GEN-Q15-000001-V001\",\"path\":\"C:/secret\"}"));
        var command = Guard().Validate(_origin, Message("GetWorkspaceStatus", "{\"command\":\"whoami\"}"));
        Assert.Equal("PAYLOAD_SCHEMA", path.Code); Assert.Equal("PAYLOAD_SCHEMA", command.Code);
    }

    [Fact]
    public void RefusesStaleNavigationSession()
    {
        var result = Guard().Validate(_origin, Message("GetWorkspaceStatus", "{}", session: "old"));
        Assert.False(result.Accepted); Assert.Equal("BRIDGE_SESSION", result.Code);
    }

    [Fact]
    public void RefusesReplay()
    {
        var guard = Guard(); var id = Guid.NewGuid(); var json = Message("GetWorkspaceStatus", "{}", id: id);
        Assert.True(guard.Validate(_origin, json).Accepted);
        var replay = guard.Validate(_origin, json);
        Assert.False(replay.Accepted); Assert.Equal("REPLAY", replay.Code);
    }

    [Fact]
    public void RefusesMalformedAndOversizedMessages()
    {
        Assert.Equal("MALFORMED_MESSAGE", Guard().Validate(_origin, "{").Code);
        Assert.Equal("MESSAGE_SIZE", Guard().Validate(_origin, new string('x', BridgeGuard.MaximumMessageBytes + 1)).Code);
    }

    private BridgeGuard Guard() => new(_origin, Session);
    private static string Message(string operation, string payload, string session = Session, Guid? id = null) =>
        $"{{\"protocolVersion\":\"1.0\",\"bridgeSessionId\":\"{session}\",\"requestId\":\"{id ?? Guid.NewGuid()}\",\"operation\":\"{operation}\",\"payload\":{payload}}}";
}

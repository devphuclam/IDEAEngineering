using System.Buffers.Binary;
using System.IO.Pipes;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Idea.Q15.Workspace;
using Idea.Q15.WorkspaceProtocol;
using Xunit;

namespace Idea.Q15.WorkspaceProtocol.Tests;

public sealed class ProtocolTests
{
    private static readonly byte[] Secret = SHA256.HashData("q15-ephemeral-test-secret"u8);
    private static readonly DateTimeOffset Now = new(2026, 9, 14, 12, 0, 0, TimeSpan.Zero);

    [Fact]
    public void CanonicalJson_SortsObjectKeysAndRetainsArrays()
    {
        using var left = JsonDocument.Parse("{\"z\":1,\"a\":{\"y\":2,\"x\":[3,1]}}");
        using var right = JsonDocument.Parse("{\"a\":{\"x\":[3,1],\"y\":2},\"z\":1}");
        Assert.Equal(ProtocolJson.Canonicalize(left.RootElement), ProtocolJson.Canonicalize(right.RootElement));
        Assert.Equal("{\"a\":{\"x\":[3,1],\"y\":2},\"z\":1}", ProtocolJson.Canonicalize(left.RootElement));
    }

    [Fact]
    public void Hmac_VerifiesExactRequestAndRejectsChangedPayload()
    {
        var request = ValidRequest(WorkspaceOperation.OpenDocument, new { documentId = "DOC-Q15-000001", generationId = "GEN-Q15-000001-V001" });
        Assert.True(ProtocolSigner.Verify(request, Secret));
        var changed = request with { Payload = ProtocolJson.Element(new { documentId = "DOC-Q15-000009", generationId = "GEN-Q15-000001-V001" }) };
        Assert.False(ProtocolSigner.Verify(changed, Secret));
    }

    [Theory]
    [InlineData("wrong-workspace", "1.0", "WS-OTHER", "SESSION-Q15-001", "WORKSPACE_MISMATCH")]
    [InlineData("wrong-version", "9.9", "WS-Q15-001", "SESSION-Q15-001", "PROTOCOL_VERSION")]
    [InlineData("stale-session", "1.0", "WS-Q15-001", "SESSION-OLD", "SESSION_STALE")]
    public void Validator_RefusesBoundedIdentityFailures(string _, string version, string workspace, string session, string expected)
    {
        var unsigned = new UnsignedWorkspaceRequest(version, Guid.NewGuid(), workspace, session, 1, Now.ToUnixTimeMilliseconds(),
            WorkspaceOperation.GetWorkspaceStatus, ProtocolJson.Element(new { }));
        var request = ProtocolSigner.Sign(unsigned, Secret);
        var result = Validator().Validate(request);
        Assert.False(result.IsValid);
        Assert.Equal(expected, result.Code);
    }

    [Fact]
    public void Validator_RefusesInvalidMac()
    {
        var request = ValidRequest(WorkspaceOperation.GetWorkspaceStatus, new { }) with { Mac = new string('A', 43) };
        var result = Validator().Validate(request);
        Assert.False(result.IsValid);
        Assert.Equal("AUTHENTICATION", result.Code);
    }

    [Fact]
    public void Validator_RefusesArbitraryPathOrExtraFields()
    {
        var request = ValidRequest(WorkspaceOperation.OpenDocument, new
        {
            documentId = "DOC-Q15-000001",
            generationId = "GEN-Q15-000001-V001",
            path = "C:\\Windows\\System32"
        });
        var result = Validator().Validate(request);
        Assert.False(result.IsValid);
        Assert.Equal("PAYLOAD_SCHEMA", result.Code);
    }

    [Fact]
    public async Task FrameCodec_RoundTripsPartialReadStream()
    {
        var request = ValidRequest(WorkspaceOperation.GetWorkspaceStatus, new { });
        await using var encoded = new MemoryStream();
        await FrameCodec.WriteAsync(encoded, request, CancellationToken.None);
        await using var partial = new PartialReadStream(encoded.ToArray(), 3);
        var decoded = await FrameCodec.ReadAsync<WorkspaceRequest>(partial, CancellationToken.None);
        Assert.Equal(request.RequestId, decoded.RequestId);
    }

    [Fact]
    public async Task FrameCodec_RejectsOversizedFrameBeforeAllocation()
    {
        var header = new byte[4];
        BinaryPrimitives.WriteInt32LittleEndian(header, ProtocolConstants.MaximumFrameBytes + 1);
        await using var stream = new MemoryStream(header);
        var error = await Assert.ThrowsAsync<InvalidDataException>(() => FrameCodec.ReadAsync<WorkspaceRequest>(stream, CancellationToken.None));
        Assert.Contains("outside the allowed range", error.Message, StringComparison.Ordinal);
    }

    [Fact]
    public async Task FrameCodec_RejectsTruncatedFrame()
    {
        var header = new byte[4];
        BinaryPrimitives.WriteInt32LittleEndian(header, 20);
        await using var stream = new MemoryStream(header.Concat(new byte[3]).ToArray());
        await Assert.ThrowsAsync<EndOfStreamException>(() => FrameCodec.ReadAsync<WorkspaceRequest>(stream, CancellationToken.None));
    }

    [Fact]
    public async Task FrameCodec_RejectsMalformedJson()
    {
        var payload = "{not-json"u8.ToArray();
        var header = new byte[4];
        BinaryPrimitives.WriteInt32LittleEndian(header, payload.Length);
        await using var stream = new MemoryStream(header.Concat(payload).ToArray());
        await Assert.ThrowsAsync<JsonException>(() => FrameCodec.ReadAsync<WorkspaceRequest>(stream, CancellationToken.None));
    }

    [Fact]
    public void Validator_RefusesEmptyRequestIdStaleTimestampAndUnknownOperation()
    {
        var emptyId = ValidRequest(WorkspaceOperation.GetWorkspaceStatus, new { }) with { RequestId = Guid.Empty };
        Assert.Equal("REQUEST_ID", Validator().Validate(ProtocolSigner.Sign(
            new UnsignedWorkspaceRequest(emptyId.ProtocolVersion, emptyId.RequestId, emptyId.WorkspaceId, emptyId.SessionId,
                emptyId.Sequence, emptyId.IssuedAtUnixMs, emptyId.Operation, emptyId.Payload), Secret)).Code);

        var stale = ProtocolSigner.Sign(new UnsignedWorkspaceRequest(ProtocolConstants.Version, Guid.NewGuid(), "WS-Q15-001",
            "SESSION-Q15-001", 1, Now.Subtract(TimeSpan.FromHours(1)).ToUnixTimeMilliseconds(),
            WorkspaceOperation.GetWorkspaceStatus, ProtocolJson.Element(new { })), Secret);
        Assert.Equal("SESSION_STALE", Validator().Validate(stale).Code);

        var unknown = ProtocolSigner.Sign(new UnsignedWorkspaceRequest(ProtocolConstants.Version, Guid.NewGuid(), "WS-Q15-001",
            "SESSION-Q15-001", 1, Now.ToUnixTimeMilliseconds(), (WorkspaceOperation)999,
            ProtocolJson.Element(new { })), Secret);
        Assert.Equal("UNKNOWN_OPERATION", Validator().Validate(unknown).Code);
    }

    [Fact]
    public async Task WorkspaceHost_ExecutesDirectNamedPipeRequestAndPreservesCandidate()
    {
        await using var harness = await RunningWorkspace.StartAsync();
        var client = new WorkspacePipeClient(harness.PipeName, "WS-Q15-001", "SESSION-Q15-001", Secret, new FrozenTimeProvider(Now));
        var response = await client.SendAsync(WorkspaceOperation.OpenDocument,
            new { documentId = "DOC-Q15-000001", generationId = "GEN-Q15-000001-V001" },
            TimeSpan.FromSeconds(5), CancellationToken.None);
        Assert.Equal("Accepted", response.Status);
        Assert.Equal("DOCUMENT_MATERIALIZED", response.Code);
        Assert.True(response.PreservesLocalCandidate);
        Assert.True(File.Exists(Path.Combine(harness.CustodyRoot, "DOC-Q15-000001.txt")));
    }

    [Fact]
    public async Task WorkspaceHost_HandlesConcurrentCorrelatedRequests()
    {
        await using var harness = await RunningWorkspace.StartAsync();
        var client = new WorkspacePipeClient(harness.PipeName, "WS-Q15-001", "SESSION-Q15-001", Secret, new FrozenTimeProvider(Now));
        var responses = await Task.WhenAll(Enumerable.Range(0, 16).Select(_ => client.SendAsync(
            WorkspaceOperation.GetWorkspaceStatus, new { }, TimeSpan.FromSeconds(5), CancellationToken.None)));
        Assert.Equal(16, responses.Select(static result => result.RequestId).Distinct().Count());
        Assert.All(responses, result => Assert.Equal("WORKSPACE_READY", result.Code));
    }

    [Fact]
    public async Task WorkspaceHost_ReturnsCachedResultForExactReplayAndRefusesChangedReuse()
    {
        await using var harness = await RunningWorkspace.StartAsync();
        var request = ValidRequest(WorkspaceOperation.GetWorkspaceStatus, new { });
        var first = await SendRawAsync(harness.PipeName, request);
        var replay = await SendRawAsync(harness.PipeName, request);
        Assert.Equal(first.RequestId, replay.RequestId);
        Assert.Equal(first.Status, replay.Status);
        Assert.Equal(first.Code, replay.Code);
        Assert.Equal(first.Mac, replay.Mac);
        Assert.Equal(ProtocolJson.Canonicalize(first.Payload), ProtocolJson.Canonicalize(replay.Payload));

        var changedUnsigned = new UnsignedWorkspaceRequest(request.ProtocolVersion, request.RequestId, request.WorkspaceId,
            request.SessionId, request.Sequence, request.IssuedAtUnixMs, WorkspaceOperation.OpenFolder,
            ProtocolJson.Element(new { documentId = "DOC-Q15-000001" }));
        var changed = ProtocolSigner.Sign(changedUnsigned, Secret);
        var refused = await SendRawAsync(harness.PipeName, changed);
        Assert.Equal("Refused", refused.Status);
        Assert.Equal("REQUEST_ID_REUSE", refused.Code);
    }

    [Fact]
    public async Task WorkspacePipeClient_RejectsMismatchedResponseCorrelation()
    {
        var pipeName = $"idea-q15-correlation-{Guid.NewGuid():N}";
        await using var server = new NamedPipeServerStream(pipeName, PipeDirection.InOut, 1,
            PipeTransmissionMode.Byte, PipeOptions.Asynchronous | PipeOptions.CurrentUserOnly);
        var serverTask = Task.Run(async () =>
        {
            await server.WaitForConnectionAsync();
            _ = await FrameCodec.ReadAsync<WorkspaceRequest>(server, CancellationToken.None);
            var response = ProtocolSigner.Sign(new UnsignedWorkspaceResponse(ProtocolConstants.Version, Guid.NewGuid(),
                "Accepted", "WORKSPACE_READY", ProtocolJson.Element(new { }), true), Secret);
            await FrameCodec.WriteAsync(server, response, CancellationToken.None);
        });
        var client = new WorkspacePipeClient(pipeName, "WS-Q15-001", "SESSION-Q15-001", Secret, new FrozenTimeProvider(Now));
        var error = await Assert.ThrowsAsync<InvalidDataException>(() => client.SendAsync(
            WorkspaceOperation.GetWorkspaceStatus, new { }, TimeSpan.FromSeconds(5), CancellationToken.None));
        Assert.Contains("did not correlate", error.Message, StringComparison.Ordinal);
        await serverTask;
    }

    [Fact]
    public async Task WorkspacePipeClient_TimesOutWhenWorkspaceIsUnavailable()
    {
        var client = new WorkspacePipeClient($"idea-q15-absent-{Guid.NewGuid():N}", "WS-Q15-001", "SESSION-Q15-001", Secret,
            new FrozenTimeProvider(Now));
        await Assert.ThrowsAnyAsync<OperationCanceledException>(() => client.SendAsync(
            WorkspaceOperation.GetWorkspaceStatus, new { }, TimeSpan.FromMilliseconds(100), CancellationToken.None));
    }

    [Fact]
    public async Task NewUiClientReconnectsAfterWorkspaceRestart()
    {
        var pipeName = $"idea-q15-restart-{Guid.NewGuid():N}";
        await using (var first = await RunningWorkspace.StartAsync(pipeName))
        {
            var client = new WorkspacePipeClient(pipeName, "WS-Q15-001", "SESSION-Q15-001", Secret, new FrozenTimeProvider(Now));
            var response = await client.SendAsync(WorkspaceOperation.GetWorkspaceStatus, new { }, TimeSpan.FromSeconds(5));
            Assert.Equal("WORKSPACE_READY", response.Code);
        }
        await using (var restarted = await RunningWorkspace.StartAsync(pipeName))
        {
            var restartedUiClient = new WorkspacePipeClient(pipeName, "WS-Q15-001", "SESSION-Q15-001", Secret, new FrozenTimeProvider(Now));
            var response = await restartedUiClient.SendAsync(WorkspaceOperation.GetWorkspaceStatus, new { }, TimeSpan.FromSeconds(5));
            Assert.Equal("WORKSPACE_READY", response.Code);
            Assert.True(response.PreservesLocalCandidate);
        }
    }

    private static WorkspaceRequest ValidRequest(WorkspaceOperation operation, object payload)
    {
        var unsigned = new UnsignedWorkspaceRequest(ProtocolConstants.Version, Guid.NewGuid(), "WS-Q15-001", "SESSION-Q15-001", 1,
            Now.ToUnixTimeMilliseconds(), operation, ProtocolJson.Element(payload));
        return ProtocolSigner.Sign(unsigned, Secret);
    }

    private static RequestValidator Validator() => new("WS-Q15-001", "SESSION-Q15-001", Secret, new FrozenTimeProvider(Now));

    private static async Task<WorkspaceResponse> SendRawAsync(string pipeName, WorkspaceRequest request)
    {
        await using var pipe = new NamedPipeClientStream(".", pipeName, PipeDirection.InOut,
            PipeOptions.Asynchronous | PipeOptions.CurrentUserOnly);
        await pipe.ConnectAsync(5_000, CancellationToken.None);
        await FrameCodec.WriteAsync(pipe, request, CancellationToken.None);
        return await FrameCodec.ReadAsync<WorkspaceResponse>(pipe, CancellationToken.None);
    }

    private sealed class FrozenTimeProvider(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
    }

    private sealed class PartialReadStream(byte[] bytes, int maximumRead) : MemoryStream(bytes)
    {
        public override int Read(byte[] buffer, int offset, int count) => base.Read(buffer, offset, Math.Min(count, maximumRead));
        public override ValueTask<int> ReadAsync(Memory<byte> buffer, CancellationToken cancellationToken = default) =>
            base.ReadAsync(buffer[..Math.Min(buffer.Length, maximumRead)], cancellationToken);
    }

    private sealed class RunningWorkspace : IAsyncDisposable
    {
        private readonly CancellationTokenSource _stop;
        private readonly Task _hostTask;
        public string PipeName { get; }
        public string CustodyRoot { get; }

        private RunningWorkspace(string pipeName, string custodyRoot, CancellationTokenSource stop, Task hostTask)
        {
            PipeName = pipeName;
            CustodyRoot = custodyRoot;
            _stop = stop;
            _hostTask = hostTask;
        }

        public static async Task<RunningWorkspace> StartAsync(string? requestedPipeName = null)
        {
            var pipeName = requestedPipeName ?? $"idea-q15-test-{Guid.NewGuid():N}";
            var custodyRoot = Path.Combine(Path.GetTempPath(), "idea-q15-tests", Guid.NewGuid().ToString("N"));
            var options = new WorkspaceOptions(pipeName, "WS-Q15-001", "SESSION-Q15-001", Secret, custodyRoot, false);
            var stop = new CancellationTokenSource();
            var task = new WorkspaceHost(options, new FrozenTimeProvider(Now)).RunAsync(stop.Token);
            await Task.Delay(50);
            return new RunningWorkspace(pipeName, custodyRoot, stop, task);
        }

        public async ValueTask DisposeAsync()
        {
            _stop.Cancel();
            try { await _hostTask.ConfigureAwait(false); }
            catch (OperationCanceledException) { }
            _stop.Dispose();
            var safeRoot = Path.GetFullPath(Path.Combine(Path.GetTempPath(), "idea-q15-tests")) + Path.DirectorySeparatorChar;
            var target = Path.GetFullPath(CustodyRoot);
            if (target.StartsWith(safeRoot, StringComparison.OrdinalIgnoreCase) && Directory.Exists(target))
                Directory.Delete(target, recursive: true);
        }
    }
}

using System.IO.Pipes;

namespace Idea.Q15.WorkspaceProtocol;

public sealed class WorkspacePipeClient(
    string pipeName,
    string workspaceId,
    string sessionId,
    byte[] secret,
    TimeProvider? timeProvider = null)
{
    private long _sequence;
    private readonly TimeProvider _timeProvider = timeProvider ?? TimeProvider.System;

    public async Task<WorkspaceResponse> SendAsync(
        WorkspaceOperation operation,
        object payload,
        TimeSpan timeout,
        CancellationToken cancellationToken = default)
    {
        using var timeoutSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        timeoutSource.CancelAfter(timeout);
        await using var pipe = new NamedPipeClientStream(
            ".",
            pipeName,
            PipeDirection.InOut,
            PipeOptions.Asynchronous | PipeOptions.CurrentUserOnly);
        await pipe.ConnectAsync(timeoutSource.Token).ConfigureAwait(false);

        var unsigned = new UnsignedWorkspaceRequest(
            ProtocolConstants.Version,
            Guid.NewGuid(),
            workspaceId,
            sessionId,
            Interlocked.Increment(ref _sequence),
            _timeProvider.GetUtcNow().ToUnixTimeMilliseconds(),
            operation,
            ProtocolJson.Element(payload));
        var request = ProtocolSigner.Sign(unsigned, secret);
        await FrameCodec.WriteAsync(pipe, request, timeoutSource.Token).ConfigureAwait(false);
        var response = await FrameCodec.ReadAsync<WorkspaceResponse>(pipe, timeoutSource.Token).ConfigureAwait(false);
        if (response.RequestId != request.RequestId)
            throw new InvalidDataException("Workspace response requestId did not correlate.");
        if (!ProtocolSigner.Verify(response, secret))
            throw new InvalidDataException("Workspace response authentication failed.");
        return response;
    }
}

using System.Collections.Concurrent;
using System.Diagnostics;
using System.IO.Pipes;
using System.Security.Cryptography;
using System.Text.Json;
using Idea.Q15.WorkspaceProtocol;

namespace Idea.Q15.Workspace;

public sealed class WorkspaceHost(WorkspaceOptions options, TimeProvider? timeProvider = null)
{
    private readonly RequestValidator _validator = new(options.WorkspaceId, options.SessionId, options.Secret, timeProvider);
    private readonly ConcurrentDictionary<Guid, CachedResult> _results = new();
    private readonly SemaphoreSlim _journalLock = new(1, 1);

    public async Task RunAsync(CancellationToken cancellationToken)
    {
        Directory.CreateDirectory(options.CustodyRoot);
        while (!cancellationToken.IsCancellationRequested)
        {
            var pipe = new NamedPipeServerStream(
                options.PipeName,
                PipeDirection.InOut,
                NamedPipeServerStream.MaxAllowedServerInstances,
                PipeTransmissionMode.Byte,
                PipeOptions.Asynchronous | PipeOptions.CurrentUserOnly,
                16_384,
                16_384);
            try
            {
                await pipe.WaitForConnectionAsync(cancellationToken).ConfigureAwait(false);
                _ = HandleConnectionAsync(pipe, cancellationToken);
            }
            catch
            {
                await pipe.DisposeAsync().ConfigureAwait(false);
                throw;
            }
        }
    }

    private async Task HandleConnectionAsync(NamedPipeServerStream pipe, CancellationToken hostCancellation)
    {
        await using (pipe.ConfigureAwait(false))
        {
            using var requestTimeout = CancellationTokenSource.CreateLinkedTokenSource(hostCancellation);
            requestTimeout.CancelAfter(TimeSpan.FromSeconds(10));
            WorkspaceRequest? request = null;
            try
            {
                request = await FrameCodec.ReadAsync<WorkspaceRequest>(pipe, requestTimeout.Token).ConfigureAwait(false);
                var validation = _validator.Validate(request);
                var response = validation.IsValid
                    ? await ExecuteIdempotentlyAsync(request, requestTimeout.Token).ConfigureAwait(false)
                    : Refusal(request.RequestId, validation.Code, validation.Detail);
                await FrameCodec.WriteAsync(pipe, response, requestTimeout.Token).ConfigureAwait(false);
            }
            catch (OperationCanceledException) when (!hostCancellation.IsCancellationRequested)
            {
                if (request is not null && pipe.IsConnected)
                    await TryWriteAsync(pipe, Refusal(request.RequestId, "TIMEOUT", "Workspace request timed out."), hostCancellation).ConfigureAwait(false);
            }
            catch (Exception exception) when (exception is InvalidDataException or EndOfStreamException or JsonException)
            {
                if (request is not null && pipe.IsConnected)
                    await TryWriteAsync(pipe, Refusal(request.RequestId, "MALFORMED_FRAME", exception.Message), hostCancellation).ConfigureAwait(false);
            }
        }
    }

    private async Task<WorkspaceResponse> ExecuteIdempotentlyAsync(WorkspaceRequest request, CancellationToken cancellationToken)
    {
        var fingerprint = ProtocolSigner.Fingerprint(request);
        if (_results.TryGetValue(request.RequestId, out var cached))
        {
            return string.Equals(cached.Fingerprint, fingerprint, StringComparison.Ordinal)
                ? cached.Response
                : Refusal(request.RequestId, "REQUEST_ID_REUSE", "requestId was reused with different input.");
        }

        var response = await ExecuteAsync(request, cancellationToken).ConfigureAwait(false);
        var winner = _results.GetOrAdd(request.RequestId, new CachedResult(fingerprint, response));
        return string.Equals(winner.Fingerprint, fingerprint, StringComparison.Ordinal)
            ? winner.Response
            : Refusal(request.RequestId, "REQUEST_ID_REUSE", "requestId was reused concurrently with different input.");
    }

    private async Task<WorkspaceResponse> ExecuteAsync(WorkspaceRequest request, CancellationToken cancellationToken)
    {
        return request.Operation switch
        {
            WorkspaceOperation.GetWorkspaceStatus => Success(request.RequestId, "WORKSPACE_READY", new
            {
                workspaceId = options.WorkspaceId,
                protocolVersion = ProtocolConstants.Version,
                custody = "qualification-local",
                processLaunchEnabled = options.AllowProcessLaunch
            }),
            WorkspaceOperation.OpenDocument => await OpenDocumentAsync(request, cancellationToken).ConfigureAwait(false),
            WorkspaceOperation.OpenFolder => Success(request.RequestId, "FOLDER_RESOLVED", new
            {
                documentId = Required(request, "documentId"),
                localEntryId = $"ENTRY-{Required(request, "documentId")}",
                note = "Path remains Workspace-private."
            }),
            WorkspaceOperation.SelectFile => Success(request.RequestId, "FILE_SELECTED", new
            {
                documentId = Required(request, "documentId"),
                artifactRole = Required(request, "artifactRole"),
                localEntryId = $"ENTRY-{Required(request, "documentId")}-PRIMARY"
            }),
            WorkspaceOperation.LaunchApprovedApplication => await LaunchAsync(request, cancellationToken).ConfigureAwait(false),
            _ => Refusal(request.RequestId, "UNKNOWN_OPERATION", "Operation is not allowlisted.")
        };
    }

    private async Task<WorkspaceResponse> OpenDocumentAsync(WorkspaceRequest request, CancellationToken cancellationToken)
    {
        var documentId = Required(request, "documentId");
        var generationId = Required(request, "generationId");
        if (!documentId.StartsWith("DOC-Q15-", StringComparison.Ordinal) ||
            !generationId.StartsWith("GEN-Q15-", StringComparison.Ordinal))
            return Refusal(request.RequestId, "MANIFEST_SCOPE", "Document or Generation is outside the frozen manifest scope.");

        var safeName = documentId + ".txt";
        var materializedPath = Path.Combine(options.CustodyRoot, safeName);
        var content = $"IDEA Q-15 synthetic local candidate{Environment.NewLine}Document={documentId}{Environment.NewLine}Generation={generationId}{Environment.NewLine}";
        if (!File.Exists(materializedPath))
            await File.WriteAllTextAsync(materializedPath, content, cancellationToken).ConfigureAwait(false);
        var bytes = await File.ReadAllBytesAsync(materializedPath, cancellationToken).ConfigureAwait(false);
        var digest = Convert.ToHexStringLower(SHA256.HashData(bytes));
        await AppendJournalAsync(new
        {
            atUtc = DateTimeOffset.UtcNow,
            operation = request.Operation.ToString(),
            requestId = request.RequestId,
            documentId,
            generationId,
            digest,
            localCandidatePreserved = true
        }, cancellationToken).ConfigureAwait(false);
        return Success(request.RequestId, "DOCUMENT_MATERIALIZED", new
        {
            documentId,
            generationId,
            digest,
            localEntryId = $"ENTRY-{documentId}",
            launchStatus = "not-requested"
        });
    }

    private async Task<WorkspaceResponse> LaunchAsync(WorkspaceRequest request, CancellationToken cancellationToken)
    {
        var code = Required(request, "applicationCode");
        if (!string.Equals(code, "text-editor", StringComparison.Ordinal))
            return Refusal(request.RequestId, "APPLICATION_NOT_ALLOWLISTED", "Application code is not allowlisted by this harness.");
        var materialized = await OpenDocumentAsync(request, cancellationToken).ConfigureAwait(false);
        if (materialized.Status != "Accepted") return materialized;
        if (!options.AllowProcessLaunch)
            return Success(request.RequestId, "LAUNCH_DISABLED", new
            {
                documentId = Required(request, "documentId"),
                applicationCode = code,
                materialized = true,
                launched = false,
                note = "Explicit qualification opt-in is required."
            });

        var path = Path.Combine(options.CustodyRoot, Required(request, "documentId") + ".txt");
        Process.Start(new ProcessStartInfo("notepad.exe", path) { UseShellExecute = false });
        return Success(request.RequestId, "APPLICATION_LAUNCHED", new
        {
            documentId = Required(request, "documentId"),
            applicationCode = code,
            materialized = true,
            launched = true
        });
    }

    private async Task AppendJournalAsync(object entry, CancellationToken cancellationToken)
    {
        await _journalLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            var line = JsonSerializer.Serialize(entry, ProtocolJson.SerializerOptions) + Environment.NewLine;
            await File.AppendAllTextAsync(Path.Combine(options.CustodyRoot, "workspace-journal.jsonl"), line, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            _journalLock.Release();
        }
    }

    private static string Required(WorkspaceRequest request, string name) =>
        request.Payload.GetProperty(name).GetString()!;

    private WorkspaceResponse Success(Guid requestId, string code, object payload) =>
        ProtocolSigner.Sign(new UnsignedWorkspaceResponse(
            ProtocolConstants.Version,
            requestId,
            "Accepted",
            code,
            ProtocolJson.Element(payload),
            true), options.Secret);

    private WorkspaceResponse Refusal(Guid requestId, string code, string detail) =>
        ProtocolSigner.Sign(new UnsignedWorkspaceResponse(
            ProtocolConstants.Version,
            requestId,
            "Refused",
            code,
            ProtocolJson.Element(new { detail }),
            true), options.Secret);

    private static async Task TryWriteAsync(Stream pipe, WorkspaceResponse response, CancellationToken cancellationToken)
    {
        try { await FrameCodec.WriteAsync(pipe, response, cancellationToken).ConfigureAwait(false); }
        catch (Exception) when (!cancellationToken.IsCancellationRequested) { }
    }

    private sealed record CachedResult(string Fingerprint, WorkspaceResponse Response);
}

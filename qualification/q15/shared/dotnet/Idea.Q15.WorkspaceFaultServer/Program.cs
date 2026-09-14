using System.Buffers.Binary;
using System.IO.Pipes;
using System.Text.Json;
using Idea.Q15.WorkspaceProtocol;

var mode = Environment.GetEnvironmentVariable("IDEA_Q15_FAULT_MODE") ?? "disconnect-after-connect";
var pipeName = Environment.GetEnvironmentVariable("IDEA_Q15_PIPE_NAME") ?? ProtocolConstants.DefaultPipeName;
var secretText = Environment.GetEnvironmentVariable("IDEA_Q15_WORKSPACE_SECRET") ?? "";
var secret = ProtocolSigner.FromBase64Url(secretText);
var readyFile = Environment.GetEnvironmentVariable("IDEA_Q15_FAULT_READY_FILE");

await using var pipe = new NamedPipeServerStream(
    pipeName,
    PipeDirection.InOut,
    1,
    PipeTransmissionMode.Byte,
    PipeOptions.Asynchronous | PipeOptions.CurrentUserOnly,
    16_384,
    16_384);
Console.WriteLine("Q15_FAULT_SERVER_READY");
if (!string.IsNullOrWhiteSpace(readyFile))
    await File.WriteAllTextAsync(readyFile, "ready");
await pipe.WaitForConnectionAsync();

switch (mode)
{
    case "disconnect-after-connect":
        return;
    case "close-during-read":
        await ReadExactlyAsync(pipe, new byte[1]);
        return;
    case "hold-connection":
        await Task.Delay(TimeSpan.FromSeconds(30));
        return;
    case "timeout":
        _ = await ReadFrameAsync(pipe);
        await Task.Delay(TimeSpan.FromSeconds(30));
        return;
}

var requestBytes = await ReadFrameAsync(pipe);
if (mode == "close-during-write")
{
    var responseBytes = JsonSerializer.SerializeToUtf8Bytes(new { partial = true });
    await WriteBytesAsync(pipe, responseBytes, responseBytes.Length + 20, Math.Min(3, responseBytes.Length));
    return;
}

switch (mode)
{
    case "malformed-response":
        await WriteBytesAsync(pipe, "not-json"u8.ToArray(), 8, 8);
        return;
    case "oversized-response":
        await WriteHeaderAsync(pipe, ProtocolConstants.MaximumFrameBytes + 1);
        return;
    case "truncated-response":
        await WriteBytesAsync(pipe, "{}"u8.ToArray(), 32, 2);
        return;
}

var request = JsonSerializer.Deserialize<WorkspaceRequest>(requestBytes, ProtocolJson.SerializerOptions)
              ?? throw new InvalidDataException("Fault server request was empty.");
var unsigned = new UnsignedWorkspaceResponse(
    ProtocolConstants.Version,
    mode == "response-request-id-mismatch" ? Guid.NewGuid() : request.RequestId,
    "Accepted",
    "WORKSPACE_READY",
    ProtocolJson.Element(new { mode }),
    true);
var response = ProtocolSigner.Sign(unsigned, secret);
if (mode == "invalid-response-mac")
    response = response with { Mac = new string('A', response.Mac.Length) };
await FrameCodec.WriteAsync(pipe, response, CancellationToken.None);

static async Task<byte[]> ReadFrameAsync(Stream stream)
{
    var header = new byte[4];
    await ReadExactlyAsync(stream, header);
    var length = BinaryPrimitives.ReadInt32LittleEndian(header);
    if (length is <= 0 or > ProtocolConstants.MaximumFrameBytes)
        throw new InvalidDataException("Fault server received an invalid frame length.");
    var payload = new byte[length];
    await ReadExactlyAsync(stream, payload);
    return payload;
}

static async Task WriteHeaderAsync(Stream stream, int length)
{
    var header = new byte[4];
    BinaryPrimitives.WriteInt32LittleEndian(header, length);
    await stream.WriteAsync(header);
    await stream.FlushAsync();
}

static async Task WriteBytesAsync(Stream stream, byte[] payload, int declaredLength, int bytesToWrite)
{
    await WriteHeaderAsync(stream, declaredLength);
    await stream.WriteAsync(payload.AsMemory(0, Math.Min(bytesToWrite, payload.Length)));
    await stream.FlushAsync();
}

static async Task ReadExactlyAsync(Stream stream, Memory<byte> buffer)
{
    var offset = 0;
    while (offset < buffer.Length)
    {
        var read = await stream.ReadAsync(buffer[offset..]);
        if (read == 0) throw new EndOfStreamException();
        offset += read;
    }
}

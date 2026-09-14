using System.Buffers.Binary;
using System.Text.Json;

namespace Idea.Q15.WorkspaceProtocol;

public static class FrameCodec
{
    public static async Task WriteAsync<T>(Stream stream, T value, CancellationToken cancellationToken)
    {
        var payload = JsonSerializer.SerializeToUtf8Bytes(value, ProtocolJson.SerializerOptions);
        if (payload.Length is <= 0 or > ProtocolConstants.MaximumFrameBytes)
        {
            throw new InvalidDataException($"Frame payload length {payload.Length} is outside the allowed range.");
        }

        var header = new byte[sizeof(int)];
        BinaryPrimitives.WriteInt32LittleEndian(header, payload.Length);
        await stream.WriteAsync(header, cancellationToken).ConfigureAwait(false);
        await stream.WriteAsync(payload, cancellationToken).ConfigureAwait(false);
        await stream.FlushAsync(cancellationToken).ConfigureAwait(false);
    }

    public static async Task<T> ReadAsync<T>(Stream stream, CancellationToken cancellationToken)
    {
        var header = new byte[sizeof(int)];
        await ReadExactlyAsync(stream, header, cancellationToken).ConfigureAwait(false);
        var length = BinaryPrimitives.ReadInt32LittleEndian(header);
        if (length is <= 0 or > ProtocolConstants.MaximumFrameBytes)
        {
            throw new InvalidDataException($"Frame payload length {length} is outside the allowed range.");
        }

        var payload = new byte[length];
        await ReadExactlyAsync(stream, payload, cancellationToken).ConfigureAwait(false);
        return JsonSerializer.Deserialize<T>(payload, ProtocolJson.SerializerOptions)
               ?? throw new InvalidDataException("Frame JSON was empty.");
    }

    private static async Task ReadExactlyAsync(Stream stream, Memory<byte> buffer, CancellationToken cancellationToken)
    {
        var total = 0;
        while (total < buffer.Length)
        {
            var read = await stream.ReadAsync(buffer[total..], cancellationToken).ConfigureAwait(false);
            if (read == 0)
            {
                throw new EndOfStreamException($"Truncated frame: received {total} of {buffer.Length} bytes.");
            }
            total += read;
        }
    }
}

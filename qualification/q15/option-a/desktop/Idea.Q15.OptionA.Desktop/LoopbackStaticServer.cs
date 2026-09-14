using System.Net;
using System.Net.Sockets;
using System.IO;
using System.Text;

namespace Idea.Q15.OptionA.Desktop;

internal sealed class LoopbackStaticServer : IAsyncDisposable
{
    private readonly string _root;
    private readonly TcpListener _listener;
    private readonly CancellationTokenSource _stop = new();
    private readonly Task _loop;
    public Uri Origin { get; }

    private LoopbackStaticServer(string root, TcpListener listener)
    {
        _root = Path.GetFullPath(root);
        _listener = listener;
        var endpoint = (IPEndPoint)listener.LocalEndpoint;
        Origin = new Uri($"http://127.0.0.1:{endpoint.Port}");
        _loop = AcceptLoopAsync(_stop.Token);
    }

    public static LoopbackStaticServer Start(string root)
    {
        var index = Path.Combine(root, "index.html");
        if (!File.Exists(index)) throw new FileNotFoundException("Build Option A web before starting the Desktop shell.", index);
        var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start(32);
        return new LoopbackStaticServer(root, listener);
    }

    private async Task AcceptLoopAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            TcpClient client;
            try { client = await _listener.AcceptTcpClientAsync(cancellationToken).ConfigureAwait(false); }
            catch (OperationCanceledException) { break; }
            _ = ServeAsync(client, cancellationToken);
        }
    }

    private async Task ServeAsync(TcpClient client, CancellationToken cancellationToken)
    {
        using (client)
        await using (var stream = client.GetStream())
        using (var reader = new StreamReader(stream, Encoding.ASCII, false, 4096, leaveOpen: true))
        {
            var requestLine = await reader.ReadLineAsync(cancellationToken).ConfigureAwait(false);
            string? line;
            do { line = await reader.ReadLineAsync(cancellationToken).ConfigureAwait(false); } while (!string.IsNullOrEmpty(line));
            if (requestLine is null || !requestLine.StartsWith("GET ", StringComparison.Ordinal))
            {
                await WriteStatusAsync(stream, "405 Method Not Allowed", "text/plain", "GET only"u8.ToArray(), cancellationToken).ConfigureAwait(false);
                return;
            }
            var target = requestLine.Split(' ', StringSplitOptions.RemoveEmptyEntries).ElementAtOrDefault(1) ?? "/";
            var relative = Uri.UnescapeDataString(target.Split('?', '#')[0]).TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            if (string.IsNullOrEmpty(relative) || !Path.HasExtension(relative)) relative = "index.html";
            var path = Path.GetFullPath(Path.Combine(_root, relative));
            if (!path.StartsWith(_root + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase) || !File.Exists(path))
                path = Path.Combine(_root, "index.html");
            var bytes = await File.ReadAllBytesAsync(path, cancellationToken).ConfigureAwait(false);
            await WriteStatusAsync(stream, "200 OK", ContentType(path), bytes, cancellationToken).ConfigureAwait(false);
        }
    }

    private static async Task WriteStatusAsync(Stream stream, string status, string contentType, byte[] body, CancellationToken cancellationToken)
    {
        var header = Encoding.ASCII.GetBytes($"HTTP/1.1 {status}\r\nContent-Type: {contentType}\r\nContent-Length: {body.Length}\r\nCache-Control: no-store\r\nConnection: close\r\nX-Content-Type-Options: nosniff\r\nContent-Security-Policy: default-src 'self'; connect-src 'self' http://127.0.0.1:5115; style-src 'self' 'unsafe-inline'\r\n\r\n");
        await stream.WriteAsync(header, cancellationToken).ConfigureAwait(false);
        await stream.WriteAsync(body, cancellationToken).ConfigureAwait(false);
    }

    private static string ContentType(string path) => Path.GetExtension(path).ToLowerInvariant() switch
    {
        ".html" => "text/html; charset=utf-8", ".js" => "text/javascript; charset=utf-8", ".css" => "text/css; charset=utf-8",
        ".json" => "application/json; charset=utf-8", ".svg" => "image/svg+xml", ".png" => "image/png", _ => "application/octet-stream"
    };

    public async ValueTask DisposeAsync()
    {
        _stop.Cancel();
        _listener.Stop();
        try { await _loop.ConfigureAwait(false); } catch (OperationCanceledException) { }
        _stop.Dispose();
    }
}

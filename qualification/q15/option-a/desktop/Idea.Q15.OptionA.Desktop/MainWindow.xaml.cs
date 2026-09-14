using System.Text.Json;
using System.IO;
using System.Diagnostics;
using System.Windows;
using Idea.Q15.OptionA.Bridge;
using Idea.Q15.WorkspaceProtocol;
using Microsoft.Web.WebView2.Core;

namespace Idea.Q15.OptionA.Desktop;

public partial class MainWindow : Window
{
    private LoopbackStaticServer? _staticServer;
    private BridgeGuard? _guard;
    private string _bridgeSession = string.Empty;
    private WorkspacePipeClient? _workspace;
    private readonly Stopwatch _startup = Stopwatch.StartNew();
    private Guid? _smokeRequestId;

    public MainWindow()
    {
        InitializeComponent();
        Loaded += OnLoaded;
        Closed += OnClosed;
    }

    private async void OnLoaded(object sender, RoutedEventArgs e)
    {
        try
        {
            var webRoot = Path.Combine(AppContext.BaseDirectory, "web");
            _staticServer = LoopbackStaticServer.Start(webRoot);
            ConfigureWorkspaceClient();
            await WebView.EnsureCoreWebView2Async();
            var core = WebView.CoreWebView2;
            core.Settings.AreDevToolsEnabled = false;
            core.Settings.AreHostObjectsAllowed = false;
            core.Settings.IsWebMessageEnabled = true;
            core.Settings.AreDefaultScriptDialogsEnabled = false;
            core.Settings.IsPasswordAutosaveEnabled = false;
            core.Settings.IsGeneralAutofillEnabled = false;
            core.NavigationStarting += NavigationStarting;
            core.NavigationCompleted += NavigationCompleted;
            core.NewWindowRequested += (_, args) => args.Handled = true;
            core.WebMessageReceived += WebMessageReceived;
            BeginNavigationBoundary();
            WebView.Source = new Uri(_staticServer.Origin, "/");
            ShellStatus.Text = $"Narrow shell · allowlisted origin {_staticServer.Origin}";
        }
        catch (Exception exception)
        {
            ShellStatus.Text = $"Startup failed: {exception.Message}";
            FailSmoke("DESKTOP_STARTUP", exception);
        }
    }

    private void ConfigureWorkspaceClient()
    {
        var encoded = Environment.GetEnvironmentVariable("IDEA_Q15_WORKSPACE_SECRET");
        if (string.IsNullOrWhiteSpace(encoded)) return;
        _workspace = new WorkspacePipeClient(
            Environment.GetEnvironmentVariable("IDEA_Q15_PIPE_NAME") ?? ProtocolConstants.DefaultPipeName,
            Environment.GetEnvironmentVariable("IDEA_Q15_WORKSPACE_ID") ?? "WS-Q15-001",
            Environment.GetEnvironmentVariable("IDEA_Q15_WORKSPACE_SESSION") ?? "SESSION-Q15-001",
            ProtocolSigner.FromBase64Url(encoded));
    }

    private void BeginNavigationBoundary()
    {
        _bridgeSession = Convert.ToHexStringLower(System.Security.Cryptography.RandomNumberGenerator.GetBytes(24));
        _guard = _staticServer is null ? null : new BridgeGuard(_staticServer.Origin, _bridgeSession);
    }

    private void NavigationStarting(object? sender, CoreWebView2NavigationStartingEventArgs e)
    {
        if (_staticServer is null || !Uri.TryCreate(e.Uri, UriKind.Absolute, out var target) || !SameOrigin(target, _staticServer.Origin))
        {
            e.Cancel = true;
            ShellStatus.Text = "Navigation refused outside the allowlisted loopback origin.";
            return;
        }
        BeginNavigationBoundary();
    }

    private async void NavigationCompleted(object? sender, CoreWebView2NavigationCompletedEventArgs e)
    {
        if (!e.IsSuccess)
        {
            ShellStatus.Text = $"Navigation failed: {e.WebErrorStatus}";
            FailSmoke("WEBVIEW_NAVIGATION", new InvalidOperationException(e.WebErrorStatus.ToString()));
            return;
        }
        await WebView.CoreWebView2.ExecuteScriptAsync("document.documentElement.dataset.q15Host='wpf-webview2';");
        WebView.CoreWebView2.PostWebMessageAsJson(JsonSerializer.Serialize(new
        {
            type = "bridge.ready", protocolVersion = "1.0", bridgeSessionId = _bridgeSession
        }, ProtocolJson.SerializerOptions));
        var smokeReport = Environment.GetEnvironmentVariable("IDEA_Q15_SMOKE_REPORT");
        if (!string.IsNullOrWhiteSpace(smokeReport))
        {
            _smokeRequestId = Guid.NewGuid();
            var intent = JsonSerializer.Serialize(new
            {
                protocolVersion = "1.0",
                bridgeSessionId = _bridgeSession,
                requestId = _smokeRequestId,
                operation = "GetWorkspaceStatus",
                payload = new { }
            }, ProtocolJson.SerializerOptions);
            await WebView.CoreWebView2.ExecuteScriptAsync($"window.chrome.webview.postMessage({intent});");
        }
    }

    private async void WebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        var source = Uri.TryCreate(e.Source, UriKind.Absolute, out var uri) ? uri : new Uri("about:blank");
        var validation = _guard?.Validate(source, e.WebMessageAsJson) ?? BridgeValidation.Refused("BRIDGE_NOT_READY", "Bridge is not ready.");
        if (!validation.Accepted || validation.Intent is null)
        {
            PostResult(Guid.Empty, Refused(validation.Code, validation.Detail));
            return;
        }
        if (_workspace is null)
        {
            PostResult(validation.Intent.RequestId, Refused("WORKSPACE_CONFIGURATION", "Workspace session secret is not configured."));
            return;
        }
        try
        {
            var operation = Enum.Parse<WorkspaceOperation>(validation.Intent.Operation, ignoreCase: false);
            var payload = JsonSerializer.Deserialize<Dictionary<string, string>>(validation.Intent.Payload.GetRawText(), ProtocolJson.SerializerOptions)
                          ?? new Dictionary<string, string>();
            var response = await _workspace.SendAsync(operation, payload, TimeSpan.FromSeconds(8));
            PostResult(validation.Intent.RequestId, new
            {
                requestId = response.RequestId,
                status = response.Status,
                code = response.Code,
                payload = response.Payload,
                preservesLocalCandidate = response.PreservesLocalCandidate
            });
            if (_smokeRequestId == validation.Intent.RequestId)
                CompleteSmoke(response.Status, response.Code, response.PreservesLocalCandidate);
        }
        catch (Exception exception)
        {
            PostResult(validation.Intent.RequestId, Refused("WORKSPACE_FAILURE", exception.Message));
        }
    }

    private void PostResult(Guid requestId, object result) => WebView.CoreWebView2.PostWebMessageAsJson(JsonSerializer.Serialize(new
    {
        type = "bridge.result", requestId, result
    }, ProtocolJson.SerializerOptions));

    private static object Refused(string code, string detail) => new
    {
        requestId = Guid.Empty, status = "Refused", code, payload = new { detail }, preservesLocalCandidate = true
    };

    private static bool SameOrigin(Uri left, Uri right) => left.Scheme == right.Scheme && left.Host == right.Host && left.Port == right.Port;

    private void CompleteSmoke(string status, string code, bool preservesLocalCandidate)
    {
        var report = Environment.GetEnvironmentVariable("IDEA_Q15_SMOKE_REPORT");
        if (string.IsNullOrWhiteSpace(report)) return;
        var fullPath = Path.GetFullPath(report);
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);
        File.WriteAllText(fullPath, JsonSerializer.Serialize(new
        {
            candidate = "option-a",
            webViewLoaded = true,
            bridgeOriginValidated = true,
            workspaceRoundTrip = status,
            code,
            preservesLocalCandidate,
            webView2Runtime = WebView.CoreWebView2.Environment.BrowserVersionString,
            startupToRoundTripMs = _startup.Elapsed.TotalMilliseconds
        }, new JsonSerializerOptions(ProtocolJson.SerializerOptions) { WriteIndented = true }));
        Dispatcher.BeginInvoke(Close);
    }

    private void FailSmoke(string code, Exception exception)
    {
        var report = Environment.GetEnvironmentVariable("IDEA_Q15_SMOKE_REPORT");
        if (string.IsNullOrWhiteSpace(report)) return;
        var fullPath = Path.GetFullPath(report);
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);
        File.WriteAllText(fullPath, JsonSerializer.Serialize(new
        {
            candidate = "option-a",
            webViewLoaded = WebView.CoreWebView2 is not null,
            bridgeOriginValidated = false,
            workspaceRoundTrip = "Failed",
            code,
            detail = exception.ToString(),
            startupToFailureMs = _startup.Elapsed.TotalMilliseconds
        }, new JsonSerializerOptions(ProtocolJson.SerializerOptions) { WriteIndented = true }));
        Dispatcher.BeginInvoke(Close);
    }

    private async void OnClosed(object? sender, EventArgs e)
    {
        if (_staticServer is not null) await _staticServer.DisposeAsync();
    }
}

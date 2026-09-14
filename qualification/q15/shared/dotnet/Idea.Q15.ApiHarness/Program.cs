using System.Collections.Concurrent;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls(builder.Configuration["Q15_URL"] ?? "http://127.0.0.1:5115");
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
    .SetIsOriginAllowed(origin => Uri.TryCreate(origin, UriKind.Absolute, out var uri) &&
                                  (uri.Host == "127.0.0.1" || uri.Host == "localhost" || uri.Host == "app.idea-q15.local"))
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()));
builder.Services.AddSingleton(Q15Fixture.Load());
builder.Services.AddSingleton<QualificationState>();

var app = builder.Build();
app.UseCors();

app.MapGet("/health", () => Results.Ok(new { status = "ready", authority = "qualification-harness-only" }));
app.MapGet("/api/v1/qualification/config", (Q15Fixture fixture) => Results.Ok(new
{
    fixtureId = fixture.FixtureId,
    version = fixture.Version,
    seed = fixture.Seed,
    workspaceId = fixture.WorkspaceId,
    profiles = fixture.Profiles,
    scenarioDocuments = fixture.ScenarioDocuments,
    textFixtures = fixture.TextFixtures
}));
app.MapGet("/api/v1/qualification/locales", (Q15Fixture fixture) => Results.Ok(fixture.Locales));
app.MapPost("/api/v1/qualification/reset", (HttpContext context, QualificationState state) =>
{
    if (!IPAddress.IsLoopback(context.Connection.RemoteIpAddress ?? IPAddress.None))
        return Problem(403, "LOOPBACK_ONLY", "Qualification reset is loopback-only.");
    state.Reset();
    return Results.Ok(new { status = "reset", productAuthority = false });
});

app.MapPost("/api/v1/session/login", (LoginRequest request, HttpContext context, Q15Fixture fixture, QualificationState state) =>
{
    var user = fixture.Users.SingleOrDefault(candidate =>
        string.Equals(candidate.Username, request.Username, StringComparison.Ordinal) &&
        string.Equals(candidate.Password, request.Password, StringComparison.Ordinal));
    if (user is null)
        return Problem(401, "INVALID_CREDENTIALS", "Synthetic credentials were not accepted.");
    if (!user.Eligible || user.SessionMode == "expired")
        return Problem(401, "SESSION_INELIGIBLE", "The server did not establish an eligible Actor context.");

    var token = state.CreateSession(user.Username);
    context.Response.Cookies.Append(QualificationState.CookieName, token, new CookieOptions
    {
        HttpOnly = true,
        Secure = false,
        SameSite = SameSiteMode.Lax,
        IsEssential = true,
        Path = "/",
        Expires = DateTimeOffset.UtcNow.AddMinutes(30)
    });
    return Results.Ok(SessionView.For(user));
});

app.MapPost("/api/v1/session/logout", (HttpContext context, QualificationState state) =>
{
    if (context.Request.Cookies.TryGetValue(QualificationState.CookieName, out var token))
        state.RevokeSession(token);
    context.Response.Cookies.Delete(QualificationState.CookieName);
    return Results.Ok(new { status = "signed-out", localCandidateChanged = false });
});

app.MapGet("/api/v1/session", (HttpContext context, Q15Fixture fixture, QualificationState state) =>
{
    var established = EstablishActor(context, fixture, state);
    return established.User is null ? established.Refusal! : Results.Ok(SessionView.For(established.User));
});

app.MapGet("/api/v1/search", (string q, string? profile, int? offset, int? limit, HttpContext context, Q15Fixture fixture, QualificationState state) =>
{
    var established = EstablishActor(context, fixture, state);
    if (established.User is null) return established.Refusal!;
    if (q == "__expire__")
    {
        state.RevokeSession(established.Token!);
        return Problem(401, "SESSION_EXPIRED", "The server session expired during the request.");
    }
    if (q == "__refused__") return Problem(403, "SEARCH_REFUSED", "Access Policy refused this synthetic search scope.");
    if (q == "__error__") return Problem(503, "SEARCH_UNAVAILABLE", "The synthetic Discovery projection is unavailable.");

    var selectedProfile = fixture.Profile(profile);
    var total = q == "__empty__" ? 0 : selectedProfile.Rows;
    var safeOffset = Math.Clamp(offset ?? 0, 0, Math.Max(0, total));
    var safeLimit = Math.Clamp(limit ?? 100, 1, 200);
    var take = Math.Min(safeLimit, Math.Max(0, total - safeOffset));
    var items = Enumerable.Range(safeOffset, take).Select(index => state.Document(index, fixture)).ToArray();
    return Results.Ok(new SearchPage(total, safeOffset, safeLimit, fixture.Columns, items));
});

app.MapGet("/api/v1/tree", (string? profile, int? offset, int? limit, HttpContext context, Q15Fixture fixture, QualificationState state) =>
{
    var established = EstablishActor(context, fixture, state);
    if (established.User is null) return established.Refusal!;
    var selectedProfile = fixture.Profile(profile);
    var safeOffset = Math.Clamp(offset ?? 0, 0, selectedProfile.TreeNodes);
    var safeLimit = Math.Clamp(limit ?? 250, 1, 500);
    var take = Math.Min(safeLimit, selectedProfile.TreeNodes - safeOffset);
    var nodes = Enumerable.Range(safeOffset, take)
        .Select(index => TreeNode.Create(index, selectedProfile.MaxDepth))
        .ToArray();
    return Results.Ok(new { total = selectedProfile.TreeNodes, maxDepth = selectedProfile.MaxDepth, offset = safeOffset, limit = safeLimit, nodes });
});

app.MapGet("/api/v1/documents/{documentId}", (string documentId, HttpContext context, Q15Fixture fixture, QualificationState state) =>
{
    var established = EstablishActor(context, fixture, state);
    if (established.User is null) return established.Refusal!;
    if (!TryDocumentIndex(documentId, out var index)) return Problem(404, "DOCUMENT_NOT_FOUND", "Document identity is outside the fixture.");
    var summary = state.Document(index, fixture);
    var canCheckout = established.User.CanCheckout && index != 2;
    return Results.Ok(new DocumentDetail(
        summary.DocumentId,
        summary.Title,
        summary.Revision,
        summary.Version,
        summary.GenerationId,
        summary.State,
        summary.Values,
        index % 3 == 0 ? "CAD Product Definition" : "Controlled Document",
        new Dictionary<string, string>
        {
            ["owner"] = index % 2 == 0 ? "Linh Nguyễn" : "佐藤 結衣",
            ["project"] = "P-100",
            ["classification"] = "INTERNAL",
            ["localIntegrity"] = index == 3 ? "Modified" : "Exact",
            ["serverFreshness"] = index == 3 ? "OutOfDate" : "Current"
        },
        canCheckout ? ["Checkout", "OpenWorkspace", "CheckinStatus"] : ["OpenWorkspace"],
        !canCheckout));
});

app.MapPost("/api/v1/documents/{documentId}/checkout", (string documentId, CheckoutRequest request, HttpContext context, Q15Fixture fixture, QualificationState state) =>
{
    var established = EstablishActor(context, fixture, state);
    if (established.User is null) return established.Refusal!;
    if (!TryDocumentIndex(documentId, out var index)) return Problem(404, "DOCUMENT_NOT_FOUND", "Document identity is outside the fixture.");
    if (!established.User.CanCheckout || index == 2 || request.Scenario == "unauthorized")
        return Problem(403, "CHECKOUT_REFUSED", "The server-established Actor is not permitted to Checkout this document.");
    if (!string.Equals(request.WorkspaceId, fixture.WorkspaceId, StringComparison.Ordinal))
        return Problem(409, "WORKSPACE_MISMATCH", "Checkout is bound to another Workspace.");

    var document = state.Document(index, fixture);
    if (!string.Equals(request.ExpectedGenerationId, document.GenerationId, StringComparison.Ordinal) || index == 3 || request.Scenario == "stale")
        return Problem(409, "STALE_GENERATION", "Expected Generation is not the current Working Head.");
    if (index == 1 || request.Scenario == "conflict")
        return Problem(409, "RESERVATION_CONFLICT", "Another Actor/Workspace owns the active Reservation.");

    var fingerprint = $"checkout|{documentId}|{request.WorkspaceId}|{request.ExpectedGenerationId}|{request.Scenario}";
    var operation = state.GetOrCreateOperation(request.OperationId, fingerprint, () =>
    {
        var reservationId = $"RES-Q15-{request.OperationId:N}";
        state.Reservations[reservationId] = new ReservationRecord(reservationId, documentId, established.User.Username, request.WorkspaceId, request.ExpectedGenerationId, "Active");
        return new OperationRecord(request.OperationId, "Checkout", documentId, request.ExpectedGenerationId,
            request.Scenario == "uncertain" || index == 4 ? "Pending" : "Committed", reservationId,
            null, true, fingerprint);
    });
    if (operation is null) return Problem(409, "OPERATION_ID_REUSE", "OperationId was reused with different input.");
    var statusCode = operation.Status == "Pending" ? StatusCodes.Status202Accepted : StatusCodes.Status200OK;
    return Results.Json(operation.View(), statusCode: statusCode);
});

app.MapPost("/api/v1/documents/{documentId}/checkin", (string documentId, CheckinRequest request, HttpContext context, Q15Fixture fixture, QualificationState state) =>
{
    var established = EstablishActor(context, fixture, state);
    if (established.User is null) return established.Refusal!;
    if (!state.Reservations.TryGetValue(request.ReservationId, out var reservation) ||
        reservation.Status != "Active" || reservation.DocumentId != documentId ||
        reservation.Username != established.User.Username || reservation.WorkspaceId != request.WorkspaceId)
        return Problem(409, "RESERVATION_INVALID", "No matching Active Reservation exists; local work remains preserved.");
    if (request.Scenario == "failed")
        return Problem(409, "CHECKIN_VALIDATION", "Synthetic Check-in validation failed; Reservation and local candidate remain.");

    var fingerprint = $"checkin|{documentId}|{request.WorkspaceId}|{request.ReservationId}|{request.ExpectedGenerationId}|{request.DeclaredDigest}|{request.Scenario}";
    var operation = state.GetOrCreateOperation(request.OperationId, fingerprint, () =>
    {
        var pending = request.Scenario == "uncertain";
        if (!pending)
        {
            state.AdvanceDocument(documentId);
            state.Reservations[request.ReservationId] = reservation with { Status = "Ended" };
        }
        return new OperationRecord(request.OperationId, "Checkin", documentId, request.ExpectedGenerationId,
            pending ? "NeedsReconciliation" : "Committed", request.ReservationId,
            pending ? "RESPONSE_UNCERTAIN" : null, true, fingerprint);
    });
    if (operation is null) return Problem(409, "OPERATION_ID_REUSE", "OperationId was reused with different input.");
    var statusCode = operation.Status == "NeedsReconciliation" ? StatusCodes.Status202Accepted : StatusCodes.Status200OK;
    return Results.Json(operation.View(), statusCode: statusCode);
});

app.MapGet("/api/v1/operations/{operationId:guid}", (Guid operationId, HttpContext context, Q15Fixture fixture, QualificationState state) =>
{
    var established = EstablishActor(context, fixture, state);
    if (established.User is null) return established.Refusal!;
    if (!state.Operations.TryGetValue(operationId, out var operation))
        return Problem(404, "OPERATION_NOT_FOUND", "No operation exists with that identity.");
    var observed = state.Observe(operation);
    return Results.Ok(observed.View());
});

await app.RunAsync();

static (UserFixture? User, string? Token, IResult? Refusal) EstablishActor(HttpContext context, Q15Fixture fixture, QualificationState state)
{
    if (!context.Request.Cookies.TryGetValue(QualificationState.CookieName, out var token))
        return (null, null, Problem(401, "SESSION_REQUIRED", "Server session proof is required."));
    var username = state.EstablishActor(token);
    if (username is null)
        return (null, token, Problem(401, "SESSION_EXPIRED", "Server session is expired or revoked."));
    var user = fixture.Users.Single(candidate => candidate.Username == username);
    return (user, token, null);
}

static IResult Problem(int status, string code, string detail) => Results.Json(new
{
    type = $"https://idea.local/problems/{code.ToLowerInvariant().Replace('_', '-')}",
    title = status switch { 401 => "Authentication required", 403 => "Operation refused", 404 => "Not found", 409 => "State conflict", _ => "Qualification harness failure" },
    status,
    code,
    detail
}, contentType: "application/problem+json", statusCode: status);

static bool TryDocumentIndex(string documentId, out int index)
{
    index = -1;
    const string prefix = "DOC-Q15-";
    return documentId.StartsWith(prefix, StringComparison.Ordinal) &&
           int.TryParse(documentId[prefix.Length..], out var oneBased) &&
           oneBased > 0 && (index = oneBased - 1) >= 0;
}

public sealed record LoginRequest(string Username, string Password);
public sealed record CheckoutRequest(Guid OperationId, string WorkspaceId, string ExpectedGenerationId, string? Scenario);
public sealed record CheckinRequest(Guid OperationId, string WorkspaceId, string ReservationId, string ExpectedGenerationId, string DeclaredDigest, string? Scenario);
public sealed record SessionView(string DisplayName, string Locale, DateTimeOffset ExpiresAtUtc)
{
    public static SessionView For(UserFixture user) => new(user.DisplayName, user.Locale, DateTimeOffset.UtcNow.AddMinutes(30));
}
public sealed record SearchPage(int Total, int Offset, int Limit, IReadOnlyList<string> Columns, IReadOnlyList<DocumentSummary> Items);
public sealed record DocumentSummary(string DocumentId, string Title, string Revision, int Version, string GenerationId, string State, IReadOnlyList<string> Values);
public sealed record DocumentDetail(string DocumentId, string Title, string Revision, int Version, string GenerationId, string State,
    IReadOnlyList<string> Values, string DocumentClass, IReadOnlyDictionary<string, string> Metadata, IReadOnlyList<string> AllowedActions, bool ReadOnly);
public sealed record TreeNode(string NodeId, string? ParentId, string Label, int Depth, bool HasChildren)
{
    public static TreeNode Create(int index, int maxDepth)
    {
        var depth = index == 0 ? 0 : 1 + (index % Math.Max(1, maxDepth));
        var parent = index == 0 ? null : $"NODE-Q15-{Math.Max(0, index - depth):D6}";
        return new TreeNode($"NODE-Q15-{index:D6}", parent, $"Assembly {index:D6} — 組立品", depth, index % 4 == 0);
    }
}
public sealed record ReservationRecord(string ReservationId, string DocumentId, string Username, string WorkspaceId, string ExpectedGenerationId, string Status);
public sealed record OperationRecord(Guid OperationId, string Kind, string DocumentId, string ExpectedGenerationId, string Status,
    string? ReservationId, string? ReasonCode, bool PreservedLocalCandidate, string Fingerprint, int Observations = 0)
{
    public object View() => new { operationId = OperationId, kind = Kind, status = Status, documentId = DocumentId,
        expectedGenerationId = ExpectedGenerationId, reservationId = ReservationId, reasonCode = ReasonCode,
        preservedLocalCandidate = PreservedLocalCandidate };
}

public sealed class QualificationState
{
    public const string CookieName = "Q15-Session";
    private readonly ConcurrentDictionary<string, SessionRecord> _sessions = new();
    private readonly ConcurrentDictionary<string, int> _documentVersions = new();
    public ConcurrentDictionary<string, ReservationRecord> Reservations { get; } = new();
    public ConcurrentDictionary<Guid, OperationRecord> Operations { get; } = new();

    public string CreateSession(string username)
    {
        var token = Convert.ToHexStringLower(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32));
        _sessions[token] = new SessionRecord(username, DateTimeOffset.UtcNow.AddMinutes(30), false);
        return token;
    }

    public string? EstablishActor(string token) =>
        _sessions.TryGetValue(token, out var session) && !session.Revoked && session.ExpiresAtUtc > DateTimeOffset.UtcNow
            ? session.Username
            : null;

    public void RevokeSession(string token)
    {
        if (_sessions.TryGetValue(token, out var session)) _sessions[token] = session with { Revoked = true };
    }

    public DocumentSummary Document(int index, Q15Fixture fixture)
    {
        var id = $"DOC-Q15-{index + 1:D6}";
        var version = _documentVersions.GetOrAdd(id, _ => 1 + index % 9);
        var scenarioState = index switch { 1 => "Reserved", 2 => "Released", 3 => "In Work", 4 => "In Work", _ => "In Work" };
        var title = (index % 3) switch
        {
            0 => $"Pump assembly {index + 1:D6} — Cụm bơm",
            1 => $"Control cabinet {index + 1:D6} — Tủ điều khiển",
            _ => $"設計文書 {index + 1:D6} — Engineering document"
        };
        var values = Enumerable.Range(1, fixture.Columns.Count).Select(column => $"R{index + 1:D6}-C{column:D2}").ToArray();
        return new DocumentSummary(id, title, ((char)('A' + index % 6)).ToString(), version, $"GEN-Q15-{index + 1:D6}-V{version:D3}", scenarioState, values);
    }

    public void AdvanceDocument(string documentId) => _documentVersions.AddOrUpdate(documentId, 2, (_, current) => current + 1);

    public OperationRecord? GetOrCreateOperation(Guid id, string fingerprint, Func<OperationRecord> factory)
    {
        var current = Operations.GetOrAdd(id, _ => factory());
        return current.Fingerprint == fingerprint ? current : null;
    }

    public OperationRecord Observe(OperationRecord operation)
    {
        if (operation.Status is not ("Pending" or "NeedsReconciliation")) return operation;
        var updated = operation with { Observations = operation.Observations + 1 };
        if (updated.Observations >= 2)
        {
            updated = updated with { Status = "Committed", ReasonCode = null };
            if (updated.Kind == "Checkin" && updated.ReservationId is not null && Reservations.TryGetValue(updated.ReservationId, out var reservation))
            {
                AdvanceDocument(updated.DocumentId);
                Reservations[updated.ReservationId] = reservation with { Status = "Ended" };
            }
        }
        Operations[operation.OperationId] = updated;
        return updated;
    }

    public void Reset()
    {
        _sessions.Clear();
        _documentVersions.Clear();
        Reservations.Clear();
        Operations.Clear();
    }

    private sealed record SessionRecord(string Username, DateTimeOffset ExpiresAtUtc, bool Revoked);
}

public sealed record UserFixture(string Username, string Password, string DisplayName, string Locale, bool Eligible, bool CanCheckout, string SessionMode);
public sealed record ProfileFixture(int Rows, int Columns, int TreeNodes, int MaxDepth);
public sealed class Q15Fixture
{
    public required string FixtureId { get; init; }
    public required string Version { get; init; }
    public required int Seed { get; init; }
    public required string WorkspaceId { get; init; }
    public required Dictionary<string, ProfileFixture> Profiles { get; init; }
    public required List<UserFixture> Users { get; init; }
    public required Dictionary<string, string> ScenarioDocuments { get; init; }
    public required Dictionary<string, string> TextFixtures { get; init; }
    public JsonElement Locales { get; set; }
    public IReadOnlyList<string> Columns { get; } = Enumerable.Range(1, 20).Select(index => $"field{index:D2}").ToArray();

    public ProfileFixture Profile(string? name) => Profiles.TryGetValue(name ?? "large", out var profile) ? profile : Profiles["large"];

    public static Q15Fixture Load()
    {
        var root = AppContext.BaseDirectory;
        var fixture = JsonSerializer.Deserialize<Q15Fixture>(File.ReadAllText(Path.Combine(root, "fixtures", "qualification-fixture.json")),
            new JsonSerializerOptions(JsonSerializerDefaults.Web) { PropertyNameCaseInsensitive = true })
            ?? throw new InvalidDataException("Q-15 fixture could not be loaded.");
        fixture.Locales = JsonSerializer.Deserialize<JsonElement>(File.ReadAllText(Path.Combine(root, "fixtures", "locales.json")));
        return fixture;
    }
}

public partial class Program;

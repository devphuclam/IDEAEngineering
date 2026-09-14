using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Idea.Q15.ApiHarness.Tests;

public sealed class ApiHarnessTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ApiHarnessTests(WebApplicationFactory<Program> factory) => _factory = factory;

    [Fact]
    public async Task Login_EstablishesServerSessionWithoutReturningActorIdOrToken()
    {
        using var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/v1/session/login", new { username = "engineer", password = "q15-engineer-only", actorId = "CLIENT-SPOOF" });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(response.Headers.TryGetValues("Set-Cookie", out var cookies));
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal("Linh Nguyễn", body.RootElement.GetProperty("displayName").GetString());
        Assert.False(body.RootElement.TryGetProperty("actorId", out _));
        Assert.False(body.RootElement.TryGetProperty("token", out _));
        Assert.Contains(cookies!, value => value.Contains("HttpOnly", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task ExpiredIdentity_IsRefused()
    {
        using var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/v1/session/login", new { username = "expired", password = "q15-expired-only" });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal("SESSION_INELIGIBLE", await ProblemCode(response));
    }

    [Fact]
    public async Task LargeSearch_UsesFrozenCountsAndTwentyColumns()
    {
        using var client = await AuthenticatedClient("engineer", "q15-engineer-only");
        using var response = await client.GetAsync("/api/v1/search?q=pump&profile=large&offset=0&limit=100");
        response.EnsureSuccessStatusCode();
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal(100_000, body.RootElement.GetProperty("total").GetInt32());
        Assert.Equal(20, body.RootElement.GetProperty("columns").GetArrayLength());
        Assert.Equal(100, body.RootElement.GetProperty("items").GetArrayLength());
        Assert.Equal("DOC-Q15-000001", body.RootElement.GetProperty("items")[0].GetProperty("documentId").GetString());
    }

    [Theory]
    [InlineData("__empty__", HttpStatusCode.OK, null)]
    [InlineData("__refused__", HttpStatusCode.Forbidden, "SEARCH_REFUSED")]
    [InlineData("__error__", HttpStatusCode.ServiceUnavailable, "SEARCH_UNAVAILABLE")]
    public async Task Search_ExposesDeterministicEmptyRefusedAndErrorStates(string query, HttpStatusCode status, string? code)
    {
        using var client = await AuthenticatedClient("engineer", "q15-engineer-only");
        using var response = await client.GetAsync($"/api/v1/search?q={query}&profile=small");
        Assert.Equal(status, response.StatusCode);
        if (code is null)
        {
            using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
            Assert.Equal(0, body.RootElement.GetProperty("total").GetInt32());
        }
        else Assert.Equal(code, await ProblemCode(response));
    }

    [Fact]
    public async Task ReaderCannotCheckoutEvenWithSpoofedActorId()
    {
        using var client = await AuthenticatedClient("reader", "q15-reader-only");
        var response = await client.PostAsJsonAsync("/api/v1/documents/DOC-Q15-000001/checkout", new
        {
            operationId = Guid.NewGuid(), workspaceId = "WS-Q15-001", expectedGenerationId = "GEN-Q15-000001-V001",
            scenario = "success", actorId = "ENGINEER-SPOOF"
        });
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        Assert.Equal("CHECKOUT_REFUSED", await ProblemCode(response));
    }

    [Fact]
    public async Task CheckoutConflictAndStaleStateAreTypedAndDoNotCommit()
    {
        using var client = await AuthenticatedClient("engineer", "q15-engineer-only");
        var conflict = await client.PostAsJsonAsync("/api/v1/documents/DOC-Q15-000002/checkout", new
        {
            operationId = Guid.NewGuid(), workspaceId = "WS-Q15-001", expectedGenerationId = "GEN-Q15-000002-V002", scenario = "conflict"
        });
        Assert.Equal("RESERVATION_CONFLICT", await ProblemCode(conflict));
        var stale = await client.PostAsJsonAsync("/api/v1/documents/DOC-Q15-000004/checkout", new
        {
            operationId = Guid.NewGuid(), workspaceId = "WS-Q15-001", expectedGenerationId = "GEN-Q15-000004-V004", scenario = "stale"
        });
        Assert.Equal("STALE_GENERATION", await ProblemCode(stale));
    }

    [Fact]
    public async Task UncertainCheckoutUsesSameOperationUntilServerConfirms()
    {
        using var client = await AuthenticatedClient("engineer", "q15-engineer-only");
        var operationId = Guid.NewGuid();
        var response = await client.PostAsJsonAsync("/api/v1/documents/DOC-Q15-000005/checkout", new
        {
            operationId, workspaceId = "WS-Q15-001", expectedGenerationId = "GEN-Q15-000005-V005", scenario = "uncertain"
        });
        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        var first = await client.GetFromJsonAsync<JsonElement>($"/api/v1/operations/{operationId}");
        var second = await client.GetFromJsonAsync<JsonElement>($"/api/v1/operations/{operationId}");
        Assert.Equal("Pending", first.GetProperty("status").GetString());
        Assert.Equal("Committed", second.GetProperty("status").GetString());
        Assert.Equal(operationId, second.GetProperty("operationId").GetGuid());
    }

    [Fact]
    public async Task CheckinSuccessEndsReservationAndReturnsOneAuthoritativeOperation()
    {
        using var client = await AuthenticatedClient("engineer", "q15-engineer-only");
        var checkoutId = Guid.NewGuid();
        var checkout = await client.PostAsJsonAsync("/api/v1/documents/DOC-Q15-000001/checkout", new
        {
            operationId = checkoutId, workspaceId = "WS-Q15-001", expectedGenerationId = "GEN-Q15-000001-V001", scenario = "success"
        });
        var checkoutBody = await checkout.Content.ReadFromJsonAsync<JsonElement>();
        var reservationId = checkoutBody.GetProperty("reservationId").GetString();
        var checkinId = Guid.NewGuid();
        var checkin = await client.PostAsJsonAsync("/api/v1/documents/DOC-Q15-000001/checkin", new
        {
            operationId = checkinId, workspaceId = "WS-Q15-001", reservationId,
            expectedGenerationId = "GEN-Q15-000001-V001", declaredDigest = new string('a', 64), scenario = "success"
        });
        Assert.Equal(HttpStatusCode.OK, checkin.StatusCode);
        var status = await client.GetFromJsonAsync<JsonElement>($"/api/v1/operations/{checkinId}");
        Assert.Equal("Committed", status.GetProperty("status").GetString());
        Assert.True(status.GetProperty("preservedLocalCandidate").GetBoolean());
        var second = await client.PostAsJsonAsync("/api/v1/documents/DOC-Q15-000001/checkin", new
        {
            operationId = Guid.NewGuid(), workspaceId = "WS-Q15-001", reservationId,
            expectedGenerationId = "GEN-Q15-000001-V001", declaredDigest = new string('a', 64), scenario = "success"
        });
        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
        Assert.Equal("RESERVATION_INVALID", await ProblemCode(second));
    }

    private async Task<HttpClient> AuthenticatedClient(string username, string password)
    {
        var loginClient = _factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var response = await loginClient.PostAsJsonAsync("/api/v1/session/login", new { username, password });
        response.EnsureSuccessStatusCode();
        var cookie = response.Headers.GetValues("Set-Cookie").Single().Split(';')[0];
        loginClient.DefaultRequestHeaders.Add("Cookie", cookie);
        return loginClient;
    }

    private static async Task<string?> ProblemCode(HttpResponseMessage response)
    {
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return body.RootElement.GetProperty("code").GetString();
    }
}

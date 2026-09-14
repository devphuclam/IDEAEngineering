namespace Idea.Q15.Workspace;

public sealed record WorkspaceOptions(
    string PipeName,
    string WorkspaceId,
    string SessionId,
    byte[] Secret,
    string CustodyRoot,
    bool AllowProcessLaunch)
{
    public static WorkspaceOptions FromEnvironment()
    {
        var secretText = Environment.GetEnvironmentVariable("IDEA_Q15_WORKSPACE_SECRET");
        if (string.IsNullOrWhiteSpace(secretText))
            throw new InvalidOperationException("IDEA_Q15_WORKSPACE_SECRET must contain a base64url test-session secret.");

        var root = Environment.GetEnvironmentVariable("IDEA_Q15_CUSTODY_ROOT")
                   ?? Path.Combine(Path.GetTempPath(), "idea-q15", "workspace");
        return new WorkspaceOptions(
            Environment.GetEnvironmentVariable("IDEA_Q15_PIPE_NAME") ?? WorkspaceProtocol.ProtocolConstants.DefaultPipeName,
            Environment.GetEnvironmentVariable("IDEA_Q15_WORKSPACE_ID") ?? "WS-Q15-001",
            Environment.GetEnvironmentVariable("IDEA_Q15_WORKSPACE_SESSION") ?? "SESSION-Q15-001",
            WorkspaceProtocol.ProtocolSigner.FromBase64Url(secretText),
            Path.GetFullPath(root),
            string.Equals(Environment.GetEnvironmentVariable("IDEA_Q15_ALLOW_PROCESS_LAUNCH"), "true", StringComparison.OrdinalIgnoreCase));
    }
}

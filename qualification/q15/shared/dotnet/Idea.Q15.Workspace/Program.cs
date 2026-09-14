using Idea.Q15.Workspace;

try
{
    var options = WorkspaceOptions.FromEnvironment();
    Console.WriteLine($"IDEA Q-15 Workspace readying pipe {options.PipeName} for {options.WorkspaceId}.");
    using var stop = new CancellationTokenSource();
    Console.CancelKeyPress += (_, eventArgs) =>
    {
        eventArgs.Cancel = true;
        stop.Cancel();
    };
    await new WorkspaceHost(options).RunAsync(stop.Token);
}
catch (OperationCanceledException)
{
    return 0;
}
catch (Exception exception)
{
    Console.Error.WriteLine(exception);
    return 1;
}

return 0;

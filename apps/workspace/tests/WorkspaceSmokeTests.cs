using System.Reflection;

namespace Idea.Ddm.Workspace.Tests;

[TestClass]
public sealed class WorkspaceSmokeTests
{
    [TestMethod]
    public void WorkspaceHasItsOwnStaEntryPoint()
    {
        var hostType = Assembly.Load("IdeaWorkspace").GetType("Idea.Ddm.Workspace.WorkspaceHost");
        var entryPoint = hostType?.GetMethod("Main", BindingFlags.Public | BindingFlags.Static);

        Assert.IsNotNull(entryPoint);
        Assert.IsNotNull(entryPoint.GetCustomAttribute<STAThreadAttribute>());
    }
}

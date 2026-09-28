using System.Reflection;
using System.Windows;

namespace Idea.Ddm.Desktop.Tests;

[TestClass]
public sealed class DesktopSmokeTests
{
    [TestMethod]
    public void AppIsAWindowsPresentationFoundationApplication()
    {
        var appType = Assembly.Load("IdeaDesktop").GetType("Idea.Ddm.Desktop.App");

        Assert.IsNotNull(appType);
        Assert.IsTrue(typeof(Application).IsAssignableFrom(appType));
    }
}

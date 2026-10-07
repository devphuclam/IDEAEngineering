import java.io.File;
import java.nio.file.*;
import java.security.MessageDigest;
import java.util.*;
import org.codehaus.plexus.*;
import org.apache.maven.execution.*;
import org.apache.maven.internal.aether.DefaultRepositorySystemSessionFactory;
import org.apache.maven.project.*;
import org.apache.maven.model.Plugin;
import org.apache.maven.artifact.repository.MavenArtifactRepository;
import org.apache.maven.artifact.repository.ArtifactRepositoryPolicy;
import org.apache.maven.artifact.repository.layout.DefaultRepositoryLayout;
import org.apache.maven.plugin.internal.PluginDependenciesResolver;
import org.apache.maven.plugin.MavenPluginManager;
import org.apache.maven.plugin.BuildPluginManager;
import org.eclipse.aether.*;
import org.eclipse.aether.artifact.DefaultArtifact;
import org.eclipse.aether.collection.CollectRequest;
import org.eclipse.aether.graph.Dependency;
import org.eclipse.aether.repository.RemoteRepository;
import org.eclipse.aether.resolution.DependencyRequest;
import org.eclipse.aether.util.filter.DependencyFilterUtils;

/** Read-only, offline model/acquisition audit; never executes a Maven goal or test. */
class ReadinessGraphAudit {
    public static void main(String[] args) throws Exception {
        if (args.length != 1 || !Runtime.version().toString().equals("25.0.4.1+1-LTS"))
            throw new IllegalArgumentException("exact POM and JDK required");
        var container = new DefaultPlexusContainer(new DefaultContainerConfiguration()
            .setClassPathScanning(PlexusConstants.SCANNING_INDEX).setAutoWiring(true));
        try {
            var request = new DefaultMavenExecutionRequest();
            var policy = new ArtifactRepositoryPolicy(true, "never", "fail");
            var local = new MavenArtifactRepository("local", "file:///home/phuclam/.m2/repository",
                new DefaultRepositoryLayout(), policy, policy);
            request.setOffline(true).setLocalRepositoryPath("/home/phuclam/.m2/repository")
                .setLocalRepository(local).setSystemProperties(System.getProperties())
                .setUserProperties(new Properties());
            var session = container.lookup(DefaultRepositorySystemSessionFactory.class)
                .newRepositorySession(request);
            var seenModels = new HashSet<String>();
            session.setRepositoryListener(new AbstractRepositoryListener() {
                public void artifactResolved(RepositoryEvent event) {
                    var a = event.getArtifact();
                    if (a != null && a.getExtension().equals("pom") && a.getFile() != null &&
                            seenModels.add(a.toString())) try {
                        row("model-pom", a.getGroupId() + ":" + a.getArtifactId() + ":" + a.getVersion(),
                            a.getFile().toPath());
                    } catch (Exception e) { throw new RuntimeException(e); }
                }
            });
            var projectRequest = new DefaultProjectBuildingRequest();
            projectRequest.setLocalRepository(local);
            projectRequest.setRepositorySession(session).setSystemProperties(System.getProperties())
                .setUserProperties(new Properties()).setProcessPlugins(false).setResolveDependencies(true);
            System.out.println("AUDIT=READ_ONLY;OFFLINE=true;GOALS=NONE");
            var project = container.lookup(ProjectBuilder.class)
                .build(new File(args[0]), projectRequest).getProject();
            var mavenSession = new MavenSession(container, session, request, new DefaultMavenExecutionResult());
            mavenSession.setProjects(List.of(project));
            System.out.println("SERVER_POM_SHA256=" + sha(Path.of(args[0])));
            for (var artifact : project.getArtifacts())
                row("server-" + artifact.getScope(), artifact.getGroupId() + ":" +
                    artifact.getArtifactId() + ":" + artifact.getVersion(), artifact.getFile().toPath());
            var resolver = container.lookup(PluginDependenciesResolver.class);
            var selectedPlugins = new ArrayList<Plugin>(project.getBuildPlugins());
            for (String item : List.of("maven-resources-plugin:3.5.0", "maven-compiler-plugin:3.15.0",
                    "maven-jar-plugin:3.5.1", "maven-surefire-plugin:3.5.6")) {
                String[] pieces = item.split(":");
                var plugin = new Plugin();
                plugin.setGroupId("org.apache.maven.plugins");
                plugin.setArtifactId(pieces[0]);
                plugin.setVersion(pieces[1]);
                selectedPlugins.add(plugin);
            }
            for (var declared : selectedPlugins) {
                if (declared.getVersion() == null) throw new IllegalStateException("plugin version unresolved");
                System.out.println("PLUGIN_AUDIT=" + declared.getGroupId() + ":" + declared.getArtifactId() + ":" + declared.getVersion());
                var root = resolver.resolve(declared, null, null, project.getRemotePluginRepositories(), session);
                root.accept(new org.eclipse.aether.graph.DependencyVisitor() {
                    public boolean visitEnter(org.eclipse.aether.graph.DependencyNode node) {
                        var artifact = node.getArtifact();
                        if (artifact != null && artifact.getFile() != null) try {
                            row("plugin-acquisition-" + declared.getArtifactId(),
                                artifact.getGroupId() + ":" + artifact.getArtifactId() + ":" + artifact.getVersion(),
                                artifact.getFile().toPath());
                        } catch (Exception failure) { throw new RuntimeException(failure); }
                        return true;
                    }
                    public boolean visitLeave(org.eclipse.aether.graph.DependencyNode node) { return true; }
                });
            }
            System.out.println("AUDIT_COMPLETE=PASS;PLUGIN_REALMS_NOT_LOADED=true;GOALS=NONE");
        } finally { container.dispose(); }
    }
    static void row(String graph, String coordinate, Path path) throws Exception {
        System.out.println("ARTIFACT\t" + graph + "\t" + coordinate + "\t" + path + "\t" + sha(path));
    }
    static String sha(Path path) throws Exception {
        return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(Files.readAllBytes(path)));
    }
}

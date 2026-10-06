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
class GraphAudit {
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
            for (String coordinate : List.of("maven-resources-plugin:3.5.0",
                    "maven-compiler-plugin:3.15.0", "maven-surefire-plugin:3.5.6")) {
                var parts = coordinate.split(":"); var plugin = new Plugin();
                plugin.setGroupId("org.apache.maven.plugins"); plugin.setArtifactId(parts[0]);
                plugin.setVersion(parts[1]);
                System.out.println("PLUGIN_AUDIT=" + coordinate);
                try {
                    var root = resolver.resolve(plugin, null, null,
                        project.getRemotePluginRepositories(), session);
                    root.accept(new org.eclipse.aether.graph.DependencyVisitor() {
                        public boolean visitEnter(org.eclipse.aether.graph.DependencyNode node) {
                            var artifact = node.getArtifact();
                            if (artifact != null && artifact.getFile() != null) try {
                                row("plugin-acquisition-" + parts[0], artifact.getGroupId() + ":" +
                                    artifact.getArtifactId() + ":" + artifact.getVersion(),
                                    artifact.getFile().toPath());
                            } catch (Exception failure) { throw new RuntimeException(failure); }
                            return true;
                        }
                        public boolean visitLeave(org.eclipse.aether.graph.DependencyNode node) { return true; }
                    });
                    var manager = container.lookup(MavenPluginManager.class);
                    var descriptor = manager.getPluginDescriptor(plugin,
                        project.getRemotePluginRepositories(), session);
                    var realm = container.lookup(BuildPluginManager.class).getPluginRealm(mavenSession, descriptor);
                    for (var url : realm.getURLs()) {
                        var path = Path.of(url.toURI());
                        row("plugin-realm-" + parts[0], path.getFileName().toString(), path);
                    }
                    System.out.println("REALM_PARENT=" + coordinate + ";" + realm.getParentRealm());
                    for (String name : List.of("org.slf4j.Logger", "javax.inject.Inject",
                            "org.codehaus.plexus.component.annotations.Component",
                            "org.codehaus.plexus.classworlds.ClassWorld")) {
                        var imported = realm.loadClass(name);
                        var origin = Path.of(imported.getProtectionDomain().getCodeSource().getLocation().toURI());
                        row("core-provider-" + parts[0], name, origin);
                    }
                } catch (Exception failure) {
                    System.out.println("PLUGIN_ACQUISITION_STOP=" + coordinate + ";" + failure.getMessage());
                }
            }
            // Mirrors SurefireDependencyResolver.getProviderClasspath: a singleton dependency,
            // no project managed-dependency list, current Maven session, runtime classpath filter.
            System.out.println("PROVIDER_AUDIT=surefire-junit-platform:3.5.6");
            var collect = new CollectRequest(List.of(new Dependency(new DefaultArtifact(
                "org.apache.maven.surefire:surefire-junit-platform:3.5.6"), "compile")),
                null, project.getRemotePluginRepositories());
            try {
                var result = container.lookup(RepositorySystem.class).resolveDependencies(session,
                    new DependencyRequest().setCollectRequest(collect)
                        .setFilter(DependencyFilterUtils.classpathFilter("runtime")));
                for (var resolved : result.getArtifactResults()) {
                    var artifact = resolved.getArtifact();
                    row("provider-acquisition", artifact.getGroupId() + ":" +
                        artifact.getArtifactId() + ":" + artifact.getVersion(), artifact.getFile().toPath());
                }
                System.out.println("PROVIDER_ACQUISITION=PASS");
            } catch (Exception failure) {
                System.out.println("PROVIDER_ACQUISITION=BLOCKED;" + failure.getMessage());
            }
            var aligned = new CollectRequest(List.of(new Dependency(new DefaultArtifact(
                "org.junit.platform:junit-platform-launcher:6.0.3"), "compile")),
                null, project.getRemotePluginRepositories());
            for (var result : container.lookup(RepositorySystem.class).resolveDependencies(session,
                    new DependencyRequest().setCollectRequest(aligned)
                        .setFilter(DependencyFilterUtils.classpathFilter("runtime"))).getArtifactResults()) {
                var a = result.getArtifact();
                row("provider-alignment", a.getGroupId() + ":" + a.getArtifactId() + ":" + a.getVersion(),
                    a.getFile().toPath());
            }
        } finally { container.dispose(); }
    }
    static void row(String graph, String coordinate, Path path) throws Exception {
        System.out.println("ARTIFACT\t" + graph + "\t" + coordinate + "\t" + path + "\t" + sha(path));
    }
    static String sha(Path path) throws Exception {
        return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(Files.readAllBytes(path)));
    }
}

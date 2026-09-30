package com.idea.ddm.identity;

import java.io.Console;
import java.util.Arrays;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

/** Explicit local operator tool. No Spring context, HTTP controller or application-startup hook. */
public final class BootstrapOperatorCommand {
    private BootstrapOperatorCommand() {}

    public static void main(String[] args) {
        if (args.length != 1 || !("--inspect".equals(args[0]) || "--initialize".equals(args[0]))) {
            System.err.println("Use --inspect or --initialize; identity/password arguments are not accepted.");
            System.exit(2);
        }
        var console = System.console();
        if ("--initialize".equals(args[0]) && console == null) {
            System.err.println("Interactive operator console required; no initialization attempted.");
            System.exit(2);
        }
        try {
            var bootstrap = new AdministratorBootstrap(dataSource(System.getenv()));
            var existing = bootstrap.inspect();
            if ("--inspect".equals(args[0])) {
                System.out.println("BOOTSTRAP_STATE=" + (existing.custodianActorId() == null ? "UNINITIALIZED" : "INITIALIZED"));
                return;
            }
            if (existing.custodianActorId() != null) {
                System.out.println("BOOTSTRAP_STATE=ALREADY_INITIALIZED; ActorId=" + existing.custodianActorId());
                return;
            }
            initialize(bootstrap, console);
        } catch (RuntimeException exception) {
            // Never print a driver cause, console input, verifier or password.
            System.err.println("Local bootstrap failed; no success is reported. Check controlled configuration and input.");
            System.exit(1);
        }
    }

    private static void initialize(AdministratorBootstrap bootstrap, Console console) {
        var organization = UUID.fromString(console.readLine("Operating Organization UUID: "));
        var name = console.readLine("Operating Organization name: ");
        var displayName = console.readLine("Named custodian display name: ");
        var login = console.readLine("Named custodian login: ");
        char[] password = null;
        char[] confirmation = null;
        try {
            password = console.readPassword("New custodian password (not echoed): ");
            confirmation = console.readPassword("Confirm new password: ");
            if (password == null || confirmation == null || !Arrays.equals(password, confirmation)) {
                throw new IllegalArgumentException("Credential confirmation failed");
            }
            var result = bootstrap.initialize(organization, name, displayName, login, new String(password));
            System.out.println("BOOTSTRAP_STATE=" + result.state() + "; ActorId=" + result.actorId());
        } finally {
            if (password != null) Arrays.fill(password, '\0');
            if (confirmation != null) Arrays.fill(confirmation, '\0');
        }
    }

    private static DriverManagerDataSource dataSource(Map<String, String> environment) {
        if (!"idea_ddm_app".equals(required(environment, "IDEA_DATABASE_APP_USER"))) {
            throw new IllegalArgumentException("Use the qualified runtime role, not a migration or superuser role");
        }
        var url = "jdbc:postgresql://" + required(environment, "IDEA_DATABASE_HOST") + ":"
                + required(environment, "IDEA_DATABASE_PORT") + "/" + required(environment, "IDEA_DATABASE_NAME");
        return new DriverManagerDataSource(url, "idea_ddm_app", required(environment, "IDEA_DATABASE_APP_PASSWORD"));
    }

    private static String required(Map<String, String> environment, String name) {
        var value = environment.get(name);
        if (value == null || value.isBlank()) throw new IllegalArgumentException("Missing operator configuration");
        return value;
    }
}

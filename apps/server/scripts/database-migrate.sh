#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SERVER_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
JAR_PATH="$SERVER_DIR/target/idea-server-0.1.0-SNAPSHOT.jar"
JAVA_BIN=${JAVA_HOME:+"$JAVA_HOME/bin/java"}
JAVA_BIN=${JAVA_BIN:-java}

for name in IDEA_DATABASE_HOST IDEA_DATABASE_PORT IDEA_DATABASE_NAME \
    IDEA_DATABASE_MIGRATION_USER IDEA_DATABASE_MIGRATION_PASSWORD; do
    eval "value=\${$name-}"
    if [ -z "$value" ]; then
        printf '%s\n' "Missing required environment variable: $name" >&2
        exit 2
    fi
done

(cd "$SERVER_DIR" && sh ./mvnw -B -DskipTests package)

exec "$JAVA_BIN" \
    -Dloader.main=com.idea.ddm.migration.DatabaseMigrationCommand \
    -cp "$JAR_PATH" \
    org.springframework.boot.loader.launch.PropertiesLauncher

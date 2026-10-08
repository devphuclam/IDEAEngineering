#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
[[ $# == 4 && $1 =~ ^[0-9a-f]{40}$ && $2 =~ ^[0-9a-f]{64}$ && $3 =~ ^(account|project|assignment|custom-role|inspection|final)-qualification-[0-9]{2}$ ]] || exit 2
[[ $4 == build || $4 == start || $4 == console || $4 == verify || $4 == stop ]] || exit 2
fixture_class=com.idea.ddm.identity.AccountBrowserFixtureCommand
if [[ $3 == project-* ]]; then fixture_class=com.idea.ddm.identity.ProjectBrowserFixtureCommand; [[ $4 != console ]] || exit 2; fi
if [[ $3 == assignment-* ]]; then fixture_class=com.idea.ddm.identity.AssignmentBrowserFixtureCommand; [[ $4 != console ]] || exit 2; fi
if [[ $3 == custom-role-* ]]; then fixture_class=com.idea.ddm.identity.CustomRoleBrowserFixtureCommand; [[ $4 != console ]] || exit 2; fi
if [[ $3 == inspection-* || $3 == final-* ]]; then fixture_class=com.idea.ddm.identity.AccessInspectionBrowserFixtureCommand; [[ $4 != console ]] || exit 2; fi
owned=/home/phuclam/idea-iam-ui-20261007-46/run-$3
source_root="$owned/source"
[[ $(id -un) == phuclam && $(realpath -e "$owned") == "$owned" && $(realpath -e "$source_root") == "$source_root" ]] || exit 3
manifest="$source_root/tests/iam-ui-46/inputs.sha256"
[[ $(sha256sum "$manifest" | cut -d' ' -f1) == "$2" ]] || exit 4
cd "$source_root"
sha256sum --strict -c "$manifest" > "$owned/source-$4-check.log"
while IFS=$'\t' read -r path hash; do
  [[ $path == path ]] && continue
  [[ $(sha256sum "$path" | cut -d' ' -f1) == "$hash" ]] || exit 4
done < tests/ph1/f05-qualification/https-loopback/toolchain.tsv
while IFS=$'\t' read -r role coordinate path hash; do
  [[ $role == role ]] && continue
  [[ $coordinate != *jsr305* && $(sha256sum "$path" | cut -d' ' -f1) == "$hash" ]] || exit 4
done < docs/research/inventories/iam-ui-46-resolved-inputs.tsv
export JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1
export PATH="$JAVA_HOME/bin:/usr/bin:/bin"
unset MAVEN_OPTS MAVEN_ARGS JAVA_TOOL_OPTIONS JDK_JAVA_OPTIONS _JAVA_OPTIONS CLASSPATH NODE_OPTIONS NODE_PATH
jar="$source_root/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar"
classpath="$source_root/apps/server/target/test-classes:$source_root/apps/server/target/classes"
while IFS=$'\t' read -r role coordinate path hash; do
  if [[ $role == server-compile || $role == server-runtime ]]; then classpath="$classpath:$path"; fi
done < docs/research/inventories/iam-ui-46-resolved-inputs.tsv
if [[ $4 == build ]]; then
  [[ ! -e "$source_root/apps/server/target" && ! -e "$owned/build-private.log" ]] || exit 3
  node=/home/phuclam/idea-iam-ui-20261007-46/node-only/bin/node
  [[ $(sha256sum "$node" | cut -d' ' -f1) == 7fde7b8afa198da66257f42ee2001d874c7355631e6d1579a5fb5ef1f246df4c ]] || exit 4
  [[ $("$node" --version) == v24.21.0 ]] || exit 4
  [[ ! -e "$source_root/apps/web/node_modules" ]] || exit 3
  ln -s /home/phuclam/idea-t043-package-green-2fe89d4/apps/web/node_modules "$source_root/apps/web/node_modules"
  "$node" apps/server/scripts/build-web-static.mjs "$source_root/apps/server/target" > "$owned/web-build-private.log" 2>&1
  settings="$source_root/tests/ph1/f05-qualification/server-grant/settings.xml"
  cd "$source_root/apps/server"
  /home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn -o -B -s "$settings" -gs "$settings" -Dmaven.repo.local=/home/phuclam/.m2/repository \
    org.apache.maven.plugins:maven-resources-plugin:3.5.0:resources \
    org.apache.maven.plugins:maven-resources-plugin:3.5.0:testResources \
    org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile \
    org.apache.maven.plugins:maven-compiler-plugin:3.15.0:testCompile \
    org.apache.maven.plugins:maven-jar-plugin:3.5.1:jar \
    org.springframework.boot:spring-boot-maven-plugin:4.1.1:repackage > "$owned/build-private.log" 2>&1
  sha256sum "$jar" > "$owned/jar.sha256"
  cd "$source_root"; sha256sum --strict -c "$manifest" > "$owned/source-build-postflight.log"
  printf 'OFFLINE_PACKAGE=PASS;SOURCE=%s\n' "$1"; cat "$owned/jar.sha256"; exit 0
fi
[[ -f "$owned/jar.sha256" ]]; sha256sum --strict -c "$owned/jar.sha256" >/dev/null
credential_file=/home/phuclam/.config/idea/f03a-test.env
[[ $(stat -c '%U:%a' "$credential_file") == phuclam:600 ]] || exit 5
set -a; . "$credential_file"; set +a
export IDEA_DATABASE_NAME=idea_ddm_iam_ui_20261007_46 IDEA_DATABASE_HOST=127.0.0.1 IDEA_DATABASE_PORT=5432
export IDEA_DATABASE_APP_USER=idea_ddm_app IDEA_DATABASE_MIGRATION_USER=idea_ddm_migrator IDEA_IAM_SOURCE_SHA="$1" IDEA_IAM_BROWSER_ROOT="$owned"
if [[ $4 == start ]]; then
  [[ ! -e "$owned/server.pid" && ! -e "$owned/schema.name" && -z $(ss -H -ltn 'sport = :18446') ]] || exit 3
  export IDEA_IAM_TEST_SCHEMA="iam_ui_$(tr -d '-' < /proc/sys/kernel/random/uuid)"
  printf '%s\n' "$IDEA_IAM_TEST_SCHEMA" > "$owned/schema.name"
  "$JAVA_HOME/bin/java" -cp "$classpath" "$fixture_class" seed > "$owned/fixture-private.log" 2>&1
  tls=/home/phuclam/idea-iam-ui-20261007-46/tls-01
  [[ $(sha256sum "$tls/fixture.p12" | cut -d' ' -f1) == cb9c804289e7d3e6b4d7e6c9f665a61194b42eac7b55146f5eecd023ef8cab2f ]] || exit 4
  [[ $(stat -c '%U:%a' "$tls/password.private") == phuclam:600 ]] || exit 4
  export IDEA_DATABASE_SCHEMA="$IDEA_IAM_TEST_SCHEMA" IDEA_SERVER_TLS_ENABLED=true IDEA_SERVER_TLS_KEY_STORE="$tls/fixture.p12" IDEA_SERVER_TLS_KEY_ALIAS=iam-ui-46
  export IDEA_SERVER_TLS_KEY_STORE_PASSWORD="$(cat "$tls/password.private")"
  nohup "$JAVA_HOME/bin/java" -Djava.net.preferIPv4Stack=true -jar "$jar" --server.address=127.0.0.1 --server.port=18446 --spring.flyway.enabled=false --idea.identity.manual-credential-delivery.enabled=true --idea.dev-api.enabled=false > "$owned/server-private.log" 2>&1 < /dev/null &
  printf '%s\n' "$!" > "$owned/server.pid"
  printf 'PACKAGED_SERVER_START=REQUESTED;SCHEMA=%s;PID=%s\n' "$IDEA_IAM_TEST_SCHEMA" "$!"; exit 0
fi
export IDEA_IAM_TEST_SCHEMA="$(cat "$owned/schema.name")"
[[ $IDEA_IAM_TEST_SCHEMA =~ ^iam_ui_[0-9a-f]{32}$ ]] || exit 6
if [[ $4 == console ]]; then
  export IDEA_ADOPTION_OPERATOR_AUTHORIZATION=IAM-46-SYNTHETIC-Q15-APPROVED IDEA_ADOPTION_SOURCE_SHA="$1" IDEA_ADOPTION_TEST_SCHEMA="$IDEA_IAM_TEST_SCHEMA"
  exec "$JAVA_HOME/bin/java" -Dloader.main=com.idea.ddm.identity.SuperSuccessorAdoptionCommand -cp "$jar" org.springframework.boot.loader.launch.PropertiesLauncher --adopt
fi
if [[ $4 == verify ]]; then
  "$JAVA_HOME/bin/java" -cp "$classpath" "$fixture_class" verify
  cd "$source_root"; sha256sum --strict -c "$manifest" > "$owned/source-final-check.log"
  printf 'SOURCE_TOOL_PACKAGE_POSTFLIGHT=PASS\n'; exit 0
fi
pid="$(cat "$owned/server.pid")"
[[ $pid =~ ^[0-9]+$ ]] || exit 6
if [[ -e /proc/$pid/cmdline ]]; then
  [[ $(tr '\0' ' ' < /proc/$pid/cmdline) == *"-jar $jar "* ]] || exit 6
  kill -TERM "$pid"
  for attempt in $(seq 1 30); do [[ ! -e /proc/$pid/cmdline ]] && break; sleep 1; done
  [[ ! -e /proc/$pid/cmdline || -z $(tr '\0' ' ' < /proc/$pid/cmdline) ]] || exit 6
fi
[[ -z $(ss -H -ltn 'sport = :18446') ]] || exit 6
export PGPASSWORD="$IDEA_DATABASE_MIGRATION_PASSWORD"
marker="IDEA_IAM_UI_RUN:$1:$IDEA_IAM_TEST_SCHEMA"
actual=$(psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$IDEA_DATABASE_NAME" -v ON_ERROR_STOP=1 -Atqc "SELECT pg_get_userbyid(nspowner)||'|'||obj_description(oid,'pg_namespace') FROM pg_namespace WHERE nspname='$IDEA_IAM_TEST_SCHEMA'")
[[ $actual == "idea_ddm_migrator|$marker" ]] || exit 6
psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$IDEA_DATABASE_NAME" -v ON_ERROR_STOP=1 -qc "DROP SCHEMA $IDEA_IAM_TEST_SCHEMA CASCADE" > "$owned/cleanup-private.log" 2>&1
[[ $(psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$IDEA_DATABASE_NAME" -Atqc "SELECT count(*) FROM pg_namespace WHERE nspname='$IDEA_IAM_TEST_SCHEMA'") == 0 ]] || exit 6
[[ $(psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$IDEA_DATABASE_NAME" -Atqc "SELECT count(*) FROM pg_tables WHERE schemaname='public'") == 0 ]] || exit 6
[[ $(realpath -e "$owned/fixture.private.json") == "$owned/fixture.private.json" && $(stat -c '%U:%a' "$owned/fixture.private.json") == phuclam:600 ]] || exit 6
rm -- "$owned/fixture.private.json"
printf 'OWNED_SERVER_STOP=PASS;LISTENER=NONE;EXACT_SCHEMA_REMAINDER=0;PUBLIC_TABLES=0;PRIVATE_FIXTURE_REMOVED=true;DATABASE_RETAINED=true\n'

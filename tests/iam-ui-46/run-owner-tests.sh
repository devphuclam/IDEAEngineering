#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
[[ $# == 6 && $1 =~ ^[0-9a-f]{40}$ && $2 =~ ^[0-9a-f]{64}$ ]] || exit 2
[[ $3 =~ ^(owner|transaction)-(qualification|red|green)-[0-9]{2}$ && $5 =~ ^[1-9][0-9]*$ ]] || exit 2
[[ $4 == OwnerSessionEligibilityTest || $4 == IdentityTransactionsTest || $4 == OwnerSessionEligibilityTest,IdentityTransactionsTest ]] || exit 2
[[ $6 == PASS || $6 == RED ]] || exit 2
owned=/home/phuclam/idea-iam-ui-20261007-46/run-$3
source_root="$owned/source"
[[ $(id -un) == phuclam && $(realpath -e "$owned") == "$owned" ]] || exit 3
[[ $(realpath -e "$source_root") == "$source_root" && ! -e "$owned/maven-private.log" ]] || exit 3
[[ -z $(find "$source_root" -type l -print -quit) && ! -e "$source_root/apps/server/target" ]] || exit 3
for base in "$source_root" "$source_root/apps/server"; do
  for configuration in maven.config jvm.config extensions.xml; do
    [[ ! -e "$base/.mvn/$configuration" ]] || exit 3
  done
done
manifest="$source_root/tests/iam-ui-46/inputs.sha256"
[[ $(sha256sum "$manifest" | cut -d' ' -f1) == "$2" ]] || exit 4
cd "$source_root"
sha256sum --strict -c "$manifest" > "$owned/source-preflight.log"
verify_tools() {
  while IFS=$'\t' read -r path hash; do
    [[ $path == path ]] && continue
    [[ $(sha256sum "$path" | cut -d' ' -f1) == "$hash" ]] || return 1
  done < tests/ph1/f05-qualification/https-loopback/toolchain.tsv
  while IFS=$'\t' read -r role coordinate path hash; do
    [[ $role == role ]] && continue
    [[ $coordinate != *jsr305* && $(sha256sum "$path" | cut -d' ' -f1) == "$hash" ]] || return 1
  done < docs/research/inventories/iam-ui-46-resolved-inputs.tsv
}
verify_tools
export JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1
export PATH="$JAVA_HOME/bin:/usr/bin:/bin"
unset MAVEN_OPTS MAVEN_ARGS JAVA_TOOL_OPTIONS JDK_JAVA_OPTIONS _JAVA_OPTIONS CLASSPATH
maven=/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn
credential_file=/home/phuclam/.config/idea/f03a-test.env
[[ $(realpath -e "$credential_file") == "$credential_file" && $(stat -c '%U:%a' "$credential_file") == phuclam:600 ]] || exit 5
set -a
. "$credential_file"
set +a
db=idea_ddm_iam_ui_20261007_46
export PGPASSWORD="$IDEA_DATABASE_MIGRATION_PASSWORD"
target=$(psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$db" -v ON_ERROR_STOP=1 -Atqc \
  "SELECT current_database()||'|'||current_user||'|'||pg_get_userbyid(datdba) FROM pg_database WHERE datname=current_database()")
[[ $target == "$db|idea_ddm_migrator|idea_ddm_migrator" ]] || exit 6
export IDEA_IAM_SOURCE_SHA="$1"
export IDEA_IAM_TEST_SCHEMA="iam_ui_$(tr -d '-' < /proc/sys/kernel/random/uuid)"
schema="$IDEA_IAM_TEST_SCHEMA"
[[ $schema =~ ^iam_ui_[0-9a-f]{32}$ ]] || exit 6
[[ $(psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$db" -v ON_ERROR_STOP=1 -Atqc "SELECT count(*) FROM pg_namespace WHERE nspname='$schema'") == 0 ]] || exit 6
printf 'SOURCE=%s;DATABASE=%s;SCHEMA=%s;TESTS=%s\n' "$1" "$db" "$schema" "$4" > "$owned/run-identity.txt"
unset PGPASSWORD
settings="$source_root/tests/ph1/f05-qualification/server-grant/settings.xml"
cd "$source_root/apps/server"
set +e
"$maven" -o -B -s "$settings" -gs "$settings" -Dmaven.repo.local=/home/phuclam/.m2/repository \
  -Dtest="$4" -DfailIfNoTests=true -DargLine=-Djava.net.preferIPv4Stack=true \
  org.apache.maven.plugins:maven-resources-plugin:3.5.0:resources \
  org.apache.maven.plugins:maven-resources-plugin:3.5.0:testResources \
  org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile \
  org.apache.maven.plugins:maven-compiler-plugin:3.15.0:testCompile \
  org.apache.maven.plugins:maven-surefire-plugin:3.5.6:test > "$owned/maven-private.log" 2>&1
status=$?
set -e
# Maven/Surefire has returned. Never clean while a child JVM still owns this run.
if ps -eo args | grep '[j]ava' | grep -F "$owned/" >/dev/null; then printf 'STOP=OWNED_JVM_STILL_RUNNING\n'; exit 7; fi
export PGPASSWORD="$IDEA_DATABASE_MIGRATION_PASSWORD"
marker="IDEA_IAM_UI_RUN:$1:$schema"
actual=$(psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$db" -v ON_ERROR_STOP=1 -Atqc \
  "SELECT pg_get_userbyid(nspowner)||'|'||obj_description(oid,'pg_namespace') FROM pg_namespace WHERE nspname='$schema'")
if [[ -n $actual ]]; then
  [[ $actual == "idea_ddm_migrator|$marker" ]] || { printf 'STOP=SCHEMA_OWNER_MARKER_MISMATCH\n'; exit 8; }
  psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$db" -v ON_ERROR_STOP=1 -qc "DROP SCHEMA $schema CASCADE" > "$owned/cleanup-private.log" 2>&1
  printf 'EXACT_SCHEMA_CLEANUP=COMPLETE;SCHEMA=%s\n' "$schema"
else
  printf 'SCHEMA_CREATION=NOT_OBSERVED;NO_CLEANUP_ADOPTED\n'
fi
[[ $(psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$db" -v ON_ERROR_STOP=1 -Atqc "SELECT count(*) FROM pg_namespace WHERE nspname='$schema'") == 0 ]] || exit 8
[[ $(psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$db" -v ON_ERROR_STOP=1 -Atqc "SELECT count(*) FROM pg_tables WHERE schemaname='public'") == 0 ]] || exit 8
unset PGPASSWORD IDEA_DATABASE_APP_PASSWORD IDEA_DATABASE_MIGRATION_PASSWORD
cd "$source_root"
verify_tools
sha256sum --strict -c "$manifest" > "$owned/source-postflight.log"
printf 'POSTFLIGHT=PASS;EXACT_SCHEMA_REMAINDER=0;PUBLIC_TABLES=0;DATABASE_RETAINED=true;MAVEN_EXIT=%s\n' "$status"
if [[ $6 == RED ]]; then
  [[ $status != 0 ]] || { printf 'UNEXPECTED_GREEN\n'; exit 9; }
  grep -q 'Tests run:' "$owned/maven-private.log" || { printf 'STOP=NO_EXECUTED_RED_TEST\n'; exit 9; }
  printf 'EXECUTED_RED_RECORDED\n'
else
  [[ $status == 0 ]] || { printf 'ENGINEERING_FAILURE\n'; exit 9; }
  grep -q "Tests run: $5, Failures: 0, Errors: 0, Skipped: 0" "$owned/maven-private.log" || exit 9
  printf 'FOCUSED_QUALIFICATION=PASS;TESTS=%s\n' "$5"
fi
grep 'Tests run:' "$owned/maven-private.log"
cat "$owned/run-identity.txt"
sha256sum "$owned/maven-private.log" "$owned/source-preflight.log" "$owned/source-postflight.log"

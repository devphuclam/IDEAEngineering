#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
[[ $# == 4 && $3 =~ ^(g03|g04|g05|g06|regression|receipt)-(red|green)-[0-9]{2}$ && $4 =~ ^[1-9][0-9]*$ ]] || exit 2
owned=/home/phuclam/idea-f05a-t028-t030-20261005-37/run-$3
source_root="$owned/source"
[[ $1 =~ ^[0-9a-f]{40}$ && $2 =~ ^[0-9a-f]{64}$ ]] || exit 2
[[ $(id -un) == phuclam && $(realpath -e "$owned") == "$owned" ]] || exit 3
[[ $(realpath -e "$source_root") == "$source_root" && ! -e "$owned/maven-private.log" ]] || exit 4
[[ -z $(find "$source_root" -type l -print -quit) && ! -e "$source_root/apps/server/target" ]] || exit 5
for base in "$source_root" "$source_root/apps/server"; do
  for configuration in maven.config jvm.config extensions.xml; do
    [[ ! -e "$base/.mvn/$configuration" ]] || exit 6
  done
done
manifest="$source_root/tests/ph1/f05-qualification/server-grant/inputs.sha256"
[[ $(sha256sum "$manifest" | cut -d' ' -f1) == "$2" ]] || exit 7
export JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1
export PATH="$JAVA_HOME/bin:/usr/bin:/bin"
unset MAVEN_OPTS MAVEN_ARGS JAVA_TOOL_OPTIONS JDK_JAVA_OPTIONS _JAVA_OPTIONS CLASSPATH
unset IDEA_DATABASE_APP_PASSWORD IDEA_DATABASE_MIGRATION_PASSWORD
maven=/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn
[[ $(sha256sum "$JAVA_HOME/bin/java" | cut -d' ' -f1) == 7380ce48ed5013735d2c8414db54adb8f981e7933ff594bd36f3baccddaafba3 ]] || exit 8
[[ $(sha256sum "$JAVA_HOME/bin/javac" | cut -d' ' -f1) == 86d10cd1c73e976f364291f3c3d10bb167f0bafdd6eb4c9c6dc44bddeffcc45e ]] || exit 8
[[ $(sha256sum "$maven" | cut -d' ' -f1) == f9381d0cb98abaaf9592dae421eddc497e84ed9bfb723b84c111d1350863c3a2 ]] || exit 8
[[ $(sha256sum /usr/bin/psql | cut -d' ' -f1) == a200e38c89b111d3abdf26927b186fdd423bef3d84f157af0f4b65db6f8e6c94 ]] || exit 8
preflight="$source_root/tests/ph1/f05-qualification/server-grant/ExecutionPreflight.java"
"$JAVA_HOME/bin/java" "$preflight" "$source_root" > "$owned/input-preflight.log"
export IDEA_F05_SOURCE_SHA="$1"
test_selector=CustodyBoundaryTest
case "$3" in
  receipt-green-20|receipt-green-21|receipt-green-22|receipt-green-23|receipt-green-24|receipt-green-25|receipt-green-26|receipt-green-27|receipt-green-28|receipt-green-29|receipt-red-30|receipt-green-31|receipt-green-32|receipt-red-33|receipt-green-34) test_selector=TransferClientBoundaryTest ;;
  receipt-*) test_selector=ReceiptBoundaryTest ;;
  regression-green-01) test_selector=F05GrantMigrationTest ;;
  regression-green-05) test_selector=F05ReceiptMigrationTest ;;
  regression-green-06) test_selector=F05GrantMigrationTest ;;
  regression-green-02|regression-green-04|regression-green-07|regression-green-08|regression-green-09|regression-green-12) test_selector=IdentityFlowTest,HttpSessionFlowTest,ServerSmokeTest
    export IDEA_F03_TEST_DATABASE_NAME=idea_ddm_f05a_20261005_t028 ;;
esac
export IDEA_F05_TEST_SCHEMA="f05_$(tr -d '-' < /proc/sys/kernel/random/uuid)"
[[ $IDEA_F05_TEST_SCHEMA =~ ^f05_[0-9a-f]{32}$ ]] || exit 9
printf 'SOURCE=%s; DATABASE=idea_ddm_f05a_20261005_t028; SCHEMA=%s\n' "$1" "$IDEA_F05_TEST_SCHEMA" > "$owned/run-identity.txt"
cd "$source_root/apps/server"
settings="$source_root/tests/ph1/f05-qualification/server-grant/settings.xml"
set +e
# Credentials are read only inside the forked test from its guarded private file, never Maven env/properties.
"$maven" -o -B -X -s "$settings" -gs "$settings" -Dmaven.repo.local=/home/phuclam/.m2/repository \
  -Dtest="$test_selector" -DfailIfNoTests=true -DargLine=-Djava.net.preferIPv4Stack=true \
  org.apache.maven.plugins:maven-resources-plugin:3.5.0:resources \
  org.apache.maven.plugins:maven-resources-plugin:3.5.0:testResources \
  org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile \
  org.apache.maven.plugins:maven-compiler-plugin:3.15.0:testCompile \
  org.apache.maven.plugins:maven-surefire-plugin:3.5.6:test > "$owned/maven-private.log" 2>&1
status=$?
set -e
# Cleanup is permitted only after the owned test/Server JVMs have exited.
if ps -eo args | grep '[j]ava' | grep -F "$owned/" >/dev/null; then printf 'STOP=OWNED_JVM_STILL_RUNNING\n'; exit 10; fi
set -a
. /home/phuclam/.config/idea/f03a-test.env
set +a
export PGPASSWORD="$IDEA_DATABASE_MIGRATION_PASSWORD"
db=idea_ddm_f05a_20261005_t028
schema="$IDEA_F05_TEST_SCHEMA"
marker="IDEA_F05_RUN:$1:$schema"
actual=$(psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$db" -v ON_ERROR_STOP=1 -Atqc \
  "SELECT pg_get_userbyid(nspowner)||'|'||obj_description(oid,'pg_namespace') FROM pg_namespace WHERE nspname='$schema'")
if [[ -n $actual ]]; then
  [[ $actual == "idea_ddm_migrator|$marker" ]] || { printf 'STOP=SCHEMA_MARKER_MISMATCH\n'; exit 11; }
  psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$db" -v ON_ERROR_STOP=1 -qc "DROP SCHEMA $schema CASCADE" > "$owned/cleanup-private.log" 2>&1
  remaining=$(psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$db" -v ON_ERROR_STOP=1 -Atqc "SELECT count(*) FROM pg_namespace WHERE nspname='$schema'")
  [[ $remaining == 0 ]] || exit 12
  printf 'F05_EXACT_SCHEMA_CLEANUP=COMPLETE; SCHEMA=%s; DATABASE_RETAINED=true\n' "$schema"
else
  printf 'F05_SCHEMA_CREATION=NOT_OBSERVED; NO_CLEANUP_ADOPTED\n'
fi
residual=$(psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$db" -v ON_ERROR_STOP=1 -Atqc \
  "SELECT count(*) FROM pg_namespace WHERE nspname ~ '^f05_[0-9a-f]{32}$' AND obj_description(oid,'pg_namespace') LIKE 'IDEA_F05_RUN:$1:%'")
[[ $residual == 0 ]] || { printf 'STOP=OWNED_REGRESSION_SCHEMA_REMAINS\n'; exit 12; }
printf 'F05_SOURCE_OWNED_SCHEMA_REMAINDER=0\n'
unset PGPASSWORD IDEA_DATABASE_APP_PASSWORD IDEA_DATABASE_MIGRATION_PASSWORD
"$JAVA_HOME/bin/java" "$preflight" "$source_root" "$owned/maven-private.log" > "$owned/postflight.log"
if [[ $3 == *-red-* ]]; then
  [[ $status != 0 ]] || { printf 'UNEXPECTED_GREEN\n'; exit 13; }
  grep -q 'Tests run:' "$owned/maven-private.log" || exit 14
  printf 'RED_EXECUTION_RECORDED; SOURCE=%s; MAVEN_EXIT=%s\n' "$1" "$status"
else
  [[ $status == 0 ]] || { printf 'ENGINEERING_FAILURE; MAVEN_EXIT=%s\n' "$status"; exit 13; }
  grep -q 'BUILD SUCCESS' "$owned/maven-private.log" || exit 14
  grep -q "Tests run: $4, Failures: 0, Errors: 0, Skipped: 0" "$owned/maven-private.log" || exit 15
  printf 'SLICE_GREEN=PASS; SOURCE=%s; MAVEN_EXIT=%s\n' "$1" "$status"
fi
cat "$owned/run-identity.txt"
sha256sum "$owned/maven-private.log" "$owned/input-preflight.log" "$owned/postflight.log"

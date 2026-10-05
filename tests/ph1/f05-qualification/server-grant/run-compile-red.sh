#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
owned=/home/phuclam/idea-f05a-t028-t030-20261005-37/run-g01-compile-red-01
source_root="$owned/source"
[[ $# == 2 && $1 =~ ^[0-9a-f]{40}$ && $2 =~ ^[0-9a-f]{64}$ ]] || exit 2
[[ $(id -un) == phuclam && $(realpath -e "$owned") == "$owned" ]] || exit 3
[[ $(realpath -e "$source_root") == "$source_root" && ! -e "$owned/maven-private.log" ]] || exit 4
[[ -z $(find "$source_root" -type l -print -quit) ]] || exit 5
[[ ! -e "$source_root/apps/server/target" && ! -e "$source_root/apps/server/.mvn" && ! -e "$source_root/.mvn" ]] || exit 6
manifest="$source_root/tests/ph1/f05-qualification/server-grant/inputs.sha256"
[[ $(sha256sum "$manifest" | cut -d' ' -f1) == "$2" ]] || exit 7
cd "$source_root"
sha256sum -c "$manifest" > "$owned/source-preflight.log"
export JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1
export PATH="$JAVA_HOME/bin:/usr/bin:/bin"
unset MAVEN_OPTS MAVEN_ARGS JAVA_TOOL_OPTIONS JDK_JAVA_OPTIONS _JAVA_OPTIONS CLASSPATH
maven=/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn
[[ $(sha256sum "$JAVA_HOME/bin/java" | cut -d' ' -f1) == 7380ce48ed5013735d2c8414db54adb8f981e7933ff594bd36f3baccddaafba3 ]] || exit 8
[[ $(sha256sum "$JAVA_HOME/bin/javac" | cut -d' ' -f1) == 86d10cd1c73e976f364291f3c3d10bb167f0bafdd6eb4c9c6dc44bddeffcc45e ]] || exit 8
[[ $(sha256sum "$maven" | cut -d' ' -f1) == f9381d0cb98abaaf9592dae421eddc497e84ed9bfb723b84c111d1350863c3a2 ]] || exit 8
preflight="$source_root/tests/ph1/f05-qualification/server-grant/ExecutionPreflight.java"
"$JAVA_HOME/bin/java" "$preflight" "$source_root" > "$owned/input-preflight.log"
# Initial compilation RED requires no database, credential, Server or listener.
cd "$source_root/apps/server"
settings="$source_root/tests/ph1/f05-qualification/server-grant/settings.xml"
set +e
"$maven" -o -B -X -s "$settings" -gs "$settings" \
  -Dmaven.repo.local=/home/phuclam/.m2/repository \
  -Dtest=CustodyBoundaryTest -DfailIfNoTests=true \
  org.apache.maven.plugins:maven-resources-plugin:3.5.0:resources \
  org.apache.maven.plugins:maven-resources-plugin:3.5.0:testResources \
  org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile \
  org.apache.maven.plugins:maven-compiler-plugin:3.15.0:testCompile \
  org.apache.maven.plugins:maven-surefire-plugin:3.5.6:test > "$owned/maven-private.log" 2>&1
status=$?
set -e
"$JAVA_HOME/bin/java" "$preflight" "$source_root" "$owned/maven-private.log" > "$owned/postflight.log"
[[ $status != 0 ]] || { printf 'STOP=UNEXPECTED_GREEN\n'; exit 9; }
grep -q 'COMPILATION ERROR' "$owned/maven-private.log" || { printf 'STOP=NON_COMPILATION_FAILURE\n'; exit 10; }
grep -q 'TransferGrantService' "$owned/maven-private.log" || { printf 'STOP=WRONG_RED\n'; exit 11; }
if grep -E 'maven-surefire-plugin.*:test .*@|exec-maven-plugin.*:exec .*@|spring-boot-maven-plugin.*:repackage .*@' "$owned/maven-private.log" >/dev/null; then
  printf 'STOP=UNEXPECTED_GOAL_EXECUTION\n'; exit 12
fi
cd "$source_root"
sha256sum -c "$manifest" > "$owned/source-postflight.log"
printf 'G01_INITIAL_COMPILE_RED=OBSERVED; MAVEN_EXIT=%s; SOURCE=%s; BEHAVIOR_TEST=NOT-RUN; DB=NOT-USED\n' "$status" "$1"
sha256sum "$owned/maven-private.log" "$owned/input-preflight.log" "$owned/postflight.log"

#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
root=/home/phuclam/idea-dev-access-20261009-51-04
source_root=$root/build-source
[[ $(id -un) == phuclam && $(realpath -e "$source_root") == "$source_root" && $(stat -c '%U:%a' "$root") == phuclam:700 ]] || exit 3
cd "$source_root"
sha256sum --strict -c "$root/build-source.sha256" > "$root/logs/package-inputs.log"
while IFS=$'\t' read -r path hash; do
  [[ $path == path ]] && continue
  [[ $(sha256sum "$path" | cut -d' ' -f1) == "$hash" ]] || exit 3
done < tests/ph1/f05-qualification/https-loopback/toolchain.tsv
while IFS=$'\t' read -r role coordinate path hash; do
  [[ $role == role ]] && continue
  [[ $coordinate != *jsr305* && $(sha256sum "$path" | cut -d' ' -f1) == "$hash" ]] || exit 3
done < docs/research/inventories/iam-ui-46-resolved-inputs.tsv
[[ ! -e apps/server/target && ! -e apps/web ]] || exit 3
export JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1 PATH=/opt/idea/tools/jdk-25.0.4.1+1/bin:/usr/bin:/bin
unset MAVEN_OPTS MAVEN_ARGS JAVA_TOOL_OPTIONS JDK_JAVA_OPTIONS _JAVA_OPTIONS CLASSPATH NODE_OPTIONS NODE_PATH
settings=$source_root/tests/ph1/f05-qualification/server-grant/settings.xml
cd apps/server
/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn -o -B -X -s "$settings" -gs "$settings" -Dmaven.repo.local=/home/phuclam/.m2/repository -Dmaven.test.skip=true -Pbackend-only package > "$root/logs/backend-package-private.log" 2>&1
cd "$source_root"
[[ ! -e apps/server/target/backend-only/generated-resources/web && ! -e apps/web ]] || exit 3
if grep -Eq 'Included:.*(jsr305|findbugs:jsr305)|com.google.code.findbugs:jsr305' "$root/logs/backend-package-private.log"; then exit 3; fi
previous=/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-44/source/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar
package=$source_root/apps/server/target/backend-only/idea-server-0.1.0-SNAPSHOT.jar
"$JAVA_HOME/bin/java" tests/dev-access/PackageProbe.java "$previous" "$package"
sha256sum "$package"
sha256sum --strict -c "$root/build-source.sha256" > "$root/logs/package-inputs-postflight.log"
printf '%s\n' 'BACKEND_BUILD=OFFLINE_PASS;FRONTEND_DIRECTORY_ABSENT=true;JSR305_NOT_SELECTED=true;TESTS=NOT_RUN;RUNTIME_NOT_STARTED=true'

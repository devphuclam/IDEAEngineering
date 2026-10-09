#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
root=/home/phuclam/idea-api-docs-20261009-53-01
[[ $(id -un) == phuclam && $(realpath -e "$root") == "$root" && $(stat -c '%U:%a' "$root") == phuclam:700 ]] || exit 3
cd "$root"
sha256sum --strict -c inputs.sha256
java=/opt/idea/tools/jdk-25.0.4.1+1/bin/java
jar=/opt/idea/tools/jdk-25.0.4.1+1/bin/jar
[[ $(sha256sum "$java" | cut -d' ' -f1) == 7380ce48ed5013735d2c8414db54adb8f981e7933ff594bd36f3baccddaafba3 ]] || exit 3
[[ $(sha256sum "$jar" | cut -d' ' -f1) == 033a730b1e74f26f7345ec4754bd6fa8a0d075973475d18695b386da516738b2 ]] || exit 3
previous=/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-44/source/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar
[[ $(sha256sum "$previous" | cut -d' ' -f1) == 318a52cf1e658a53bc9fa54137346c15277060667998d2f10f33454d15bb8c1c ]] || exit 3
candidate=$root/idea-server-documentation.jar
[[ ! -e $candidate ]] || exit 3
cp -- "$previous" "$candidate"
"$jar" --update --file "$candidate" -C projection BOOT-INF/classes/dev-access/openapi.json
document_hash=$(sha256sum projection/BOOT-INF/classes/dev-access/openapi.json | cut -d' ' -f1)
"$java" DocumentationPackageProbe.java "$previous" "$candidate" "$document_hash"
sha256sum "$candidate"
sha256sum --strict -c inputs.sha256
printf '%s\n' 'MAVEN=NOT_RUN;APPLICATION_COMPILE=NOT_RUN;PRODUCT_CLASSES_UNCHANGED=true;MIGRATION=NOT_RUN;BOOTSTRAP=NOT_RUN'

#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
server_dir=${1:?Provide the isolated source apps/server directory}
root=/home/phuclam/.local/share/idea/dev-preview-26
for name in runtime.env operator.env; do
  [[ -f $root/$name && ! -L $root/$name && $(stat -c '%a:%u' "$root/$name") == "600:$(id -u)" ]] || { echo 'BLOCKED private preview test configuration'; exit 2; }
done
set -a
source "$root/runtime.env"
source "$root/operator.env"
set +a
[[ $IDEA_DATABASE_NAME == idea_ddm_preview_20261001_26 && $IDEA_DATABASE_APP_USER == idea_ddm_app && $IDEA_DATABASE_MIGRATION_USER == idea_ddm_migrator ]]
unset IDEA_SERVER_TLS_ENABLED IDEA_SERVER_TLS_KEY_STORE IDEA_SERVER_TLS_KEY_STORE_PASSWORD IDEA_SERVER_TLS_KEY_ALIAS
export IDEA_DEVACCESS_TEST_DATABASE_NAME=idea_ddm_preview_20261001_26
export JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1
export PATH=/opt/idea/tools/node-v24.21.0-linux-x64/bin:$PATH
python3 /home/phuclam/preflight.py /home/phuclam/2026-10-01-t043-maven-web-build-intake.md
cd -- "$server_dir"
exec /home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn -o -B \
  -Dtest=DevelopmentApiDocumentationTest,DevelopmentApiDocumentationHttpTest,ServerSmokeTest test

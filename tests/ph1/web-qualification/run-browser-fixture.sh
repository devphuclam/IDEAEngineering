#!/usr/bin/env bash
# External T043 fixture, never a production launcher; no secret in arguments/output.
set -euo pipefail
set +x
umask 077
action=${1:?action required}
run_id=${2:?32-hex run identifier required}
[[ "$run_id" =~ ^[a-f0-9]{32}$ ]] || exit 2
root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
[[ "$root" == "/home/phuclam/idea-t043-browser-$run_id" ]] || exit 2
java_root=/opt/idea/tools/jdk-25.0.4.1+1
jar=/home/phuclam/idea-f03b-closure-final-package-13/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar
expected_jar=ac4f74e1fe5453b7716e13da970027ba403d695340974ca13503f3d8989332ff
[[ "$(sha256sum "$jar" | cut -d ' ' -f 1)" == "$expected_jar" ]] || exit 2
set -a
source /home/phuclam/.config/idea/f03a-test.env
set +a
export IDEA_DATABASE_HOST=127.0.0.1 IDEA_DATABASE_PORT=5432
export IDEA_DATABASE_APP_USER=idea_ddm_app IDEA_DATABASE_MIGRATION_USER=idea_ddm_migrator
export IDEA_DATABASE_NAME=idea_ddm_f03a_20260930_c91e7a42
export IDEA_DATABASE_SCHEMA="t043_web_$run_id"
classpath="$root/classes:$root/extracted/BOOT-INF/classes:$root/extracted/BOOT-INF/lib/*"
cd -- "$root"
case "$action" in
  prepare)
    test ! -e "$root/extracted" && test ! -e "$root/classes" || exit 2
    mkdir -m 700 -- "$root/extracted" "$root/classes"
    (cd -- "$root/extracted" && "$java_root/bin/jar" xf "$jar")
    "$java_root/bin/javac" -cp "$classpath" -d "$root/classes" "$root/WebQualificationFixture.java"
    "$java_root/bin/java" -cp "$classpath" com.idea.ddm.identity.WebQualificationFixture prepare "$run_id"
    ;;
  start)
    test -d "$root/classes" && test ! -e "$root/server.pid" || exit 2
    tls=/home/phuclam/idea-f03b-web-tls-739db09df96d4d97ac69fce17bc32fae
    export IDEA_SERVER_TLS_ENABLED=true IDEA_SERVER_TLS_KEY_STORE="$tls/server.p12"
    IFS= read -r IDEA_SERVER_TLS_KEY_STORE_PASSWORD < "$tls/store-password" || test -n "${IDEA_SERVER_TLS_KEY_STORE_PASSWORD:-}"
    export IDEA_SERVER_TLS_KEY_STORE_PASSWORD
    export IDEA_SERVER_TLS_KEY_STORE_TYPE=PKCS12 IDEA_SERVER_TLS_KEY_ALIAS=idea-t043
    nohup "$java_root/bin/java" -jar "$jar" --server.address=127.0.0.1 --server.port=18444 \
      --logging.level.root=WARN > "$root/server.log" 2>&1 < /dev/null &
    printf '%s\n' "$!" > "$root/server.pid"
    printf 'T043_SERVER_STARTED=YES\n'
    ;;
  disable)
    "$java_root/bin/java" -cp "$classpath" com.idea.ddm.identity.WebQualificationFixture disable "$run_id"
    ;;
  cleanup)
    if [ -f "$root/server.pid" ]; then
      pid=$(< "$root/server.pid")
      [[ "$pid" =~ ^[0-9]+$ ]] || exit 2
      if kill -0 "$pid" 2>/dev/null; then
        [[ "$(readlink -f "/proc/$pid/cwd")" == "$root" ]] || exit 2
        kill -- "$pid"
        for attempt in {1..50}; do
          kill -0 "$pid" 2>/dev/null || break
          sleep 0.1
        done
        # Refuse database cleanup while the owned JVM might still use its schema.
        if kill -0 "$pid" 2>/dev/null; then
          printf 'T043_SERVER_TERMINATION=BLOCKED; owned schema retained\n' >&2
          exit 2
        fi
      fi
    fi
    "$java_root/bin/java" -cp "$classpath" com.idea.ddm.identity.WebQualificationFixture cleanup "$run_id"
    ;;
  *) exit 2 ;;
esac

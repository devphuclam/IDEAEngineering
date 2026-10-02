#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
action=${1:?action} id=${2:?owned identifier}
[[ $id =~ ^[a-f0-9]{32}$ ]] || exit 2
root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
[[ $root == "/home/phuclam/idea-devaccess-browser-$id" && $(stat -c '%a:%u' "$root") == "700:$(id -u)" ]] || exit 2
jar=/home/phuclam/idea-devaccess-source-4419a9f/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar
[[ $(sha256sum "$jar" | cut -d ' ' -f 1) == 0eb0f2852a0e92c03a5969b5c44d95ab752d8b82ff5810b83efe1dd48dc13d3c ]] || exit 2
java_root=/opt/idea/tools/jdk-25.0.4.1+1
config=/home/phuclam/.local/share/idea/dev-preview-26
for file in runtime.env operator.env; do
  [[ ! -L $config/$file && $(stat -c '%a:%u' "$config/$file") == "600:$(id -u)" ]] || exit 2
done
set -a; source "$config/runtime.env"; source "$config/operator.env"; set +a
[[ $IDEA_DATABASE_NAME == idea_ddm_preview_20261001_26 && $IDEA_DATABASE_APP_USER == idea_ddm_app && $IDEA_DATABASE_MIGRATION_USER == idea_ddm_migrator ]] || exit 2
export IDEA_DATABASE_SCHEMA="devaccess_browser_$id" SPRING_CONFIG_LOCATION=classpath:/application.properties
classpath="$root/classes:$root/extracted/BOOT-INF/classes:$root/extracted/BOOT-INF/lib/*"
owned_process() {
  [[ $pid =~ ^[1-9][0-9]*$ && $ticks =~ ^[0-9]+$ && -r /proc/$pid/stat ]] || return 1
  [[ $(stat -c %u "/proc/$pid") == "$(id -u)" && $(readlink -f "/proc/$pid/cwd") == "$root" && $(readlink -f "/proc/$pid/exe") == "$java_root/bin/java" ]] || return 1
  local stat tail; stat=$(< "/proc/$pid/stat"); tail=${stat##*) }; read -ra fields <<< "$tail"
  [[ ${fields[19]} == "$ticks" ]] || return 1
  local -a args=(); mapfile -d '' -t args < "/proc/$pid/cmdline"
  [[ ${#args[@]} == 6 && ${args[0]} == "$java_root/bin/java" && ${args[1]} == -jar && ${args[2]} == "$jar" && ${args[3]} == --server.address=127.0.0.1 && ${args[4]} == --server.port=18445 && ${args[5]} == --logging.level.root=WARN ]]
}
cd -- "$root"
case "$action" in
  prepare)
    [[ ! -e extracted && ! -e classes ]] || exit 2
    mkdir -m 700 extracted classes
    (cd extracted && "$java_root/bin/jar" xf "$jar")
    "$java_root/bin/javac" -cp "$classpath" -d classes SwaggerBrowserFixture.java
    "$java_root/bin/java" -cp "$classpath" com.idea.ddm.identity.SwaggerBrowserFixture prepare "$id"
    ;;
  start)
    [[ ! -e runtime.state && -z $(ss -H -ltn 'sport = :18445') ]] || exit 2
    tls=/home/phuclam/idea-f03b-web-tls-739db09df96d4d97ac69fce17bc32fae
    export IDEA_SERVER_TLS_ENABLED=true IDEA_SERVER_TLS_KEY_STORE="$tls/server.p12" IDEA_SERVER_TLS_KEY_STORE_TYPE=PKCS12 IDEA_SERVER_TLS_KEY_ALIAS=idea-t043
    export IDEA_SERVER_TLS_KEY_STORE_PASSWORD; IDEA_SERVER_TLS_KEY_STORE_PASSWORD=$(< "$tls/store-password")
    export IDEA_DEV_API_ENABLED=true
    unset IDEA_DATABASE_MIGRATION_PASSWORD IDEA_DATABASE_MIGRATION_USER
    nohup "$java_root/bin/java" -jar "$jar" --server.address=127.0.0.1 --server.port=18445 --logging.level.root=WARN > server.log 2>&1 < /dev/null &
    pid=$!; stat=$(< "/proc/$pid/stat"); tail=${stat##*) }; read -ra fields <<< "$tail"; ticks=${fields[19]}
    printf '%s %s\n' "$pid" "$ticks" > runtime.state
    echo 'SWAGGER_FIXTURE_STARTED=YES'
    ;;
  cleanup)
    if [[ -e runtime.state ]]; then
      read -r pid ticks extra < runtime.state
      [[ -z ${extra:-} ]] || exit 2
      if [[ -d /proc/$pid && -e /proc/$pid/exe ]]; then
        owned_process || { echo 'SWAGGER_PROCESS_OWNERSHIP_CONFLICT'; exit 2; }
        kill -TERM "$pid"
        for ((i=0;i<100;i++)); do [[ -e /proc/$pid/exe ]] || break; sleep 0.1; done
        [[ ! -e /proc/$pid/exe ]] || { echo 'SWAGGER_STOP_BLOCKED'; exit 2; }
      fi
      rm -- runtime.state
    fi
    "$java_root/bin/java" -cp "$classpath" com.idea.ddm.identity.SwaggerBrowserFixture cleanup "$id"
    ;;
  *) exit 2 ;;
esac

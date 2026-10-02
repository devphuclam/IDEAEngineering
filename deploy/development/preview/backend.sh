#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
root=${IDEA_PREVIEW_ROOT:-/home/phuclam/.local/share/idea/dev-preview-26}
action=${1:-status}
case "$action" in start|status|stop) ;; *) echo 'BACKEND_ERROR=INVALID_ACTION'; exit 2 ;; esac
refuse_configuration_overrides() {
  local entry name
  while IFS= read -r -d '' entry; do
    name=${entry%%=*}
    case "${name^^}" in
      SPRING_*|SPRING.*|SERVER_*|SERVER.*|JAVA_TOOL_OPTIONS|JDK_JAVA_OPTIONS|_JAVA_OPTIONS)
        echo 'BACKEND_ERROR=ENVIRONMENT_OVERRIDE_REFUSED; Start requires controlled preview configuration.'
        exit 2 ;;
    esac
  done < <(env -0)
}
# Refuse inherited configuration before taking a lock or launching anything. Status/Stop
# must remain available to inspect/stop an owned runtime from the same shell.
[[ $action != start ]] || refuse_configuration_overrides
if [[ ! -f "$root/provisioned" || ! -f "$root/runtime.env" ]]; then
  echo 'BACKEND_STATE=NOT_PROVISIONED'
  exit 3
fi
[[ -d $root && ! -L $root && $(stat -c '%a:%u' "$root") == "700:$(id -u)" ]] || { echo 'BACKEND_ERROR=PRIVATE_DIRECTORY_REQUIRED'; exit 2; }
root=$(readlink -f "$root")
[[ ! -L $root/runtime.env && $(stat -c '%a:%u' "$root/runtime.env") == "600:$(id -u)" ]] || { echo 'BACKEND_ERROR=PRIVATE_CONFIG_REQUIRED'; exit 2; }
if [[ $action != status ]]; then
  exec 9>"$root/controller.lock"
  flock -n 9 || { echo 'BACKEND_ERROR=CONTROLLER_BUSY'; exit 2; }
fi
java=/opt/idea/tools/jdk-25.0.4.1+1/bin/java
jar="$root/server.jar"
process_owned() {
  local stat tail ticks
  [[ $pid =~ ^[1-9][0-9]*$ && $started =~ ^[0-9]+$ && -r /proc/$pid/stat ]] || return 1
  [[ $(stat -c %u "/proc/$pid") == "$(id -u)" ]] || return 1
  stat=$(cat "/proc/$pid/stat" 2>/dev/null) || return 1
  tail=${stat##*) }
  read -ra fields <<< "$tail"
  [[ ${#fields[@]} -ge 20 ]] || return 1
  ticks=${fields[19]}
  [[ $ticks == "$started" && $(readlink -f "/proc/$pid/exe") == "$(readlink -f "$java")" ]] || return 1
  [[ $(readlink -f "/proc/$pid/cwd") == "$(readlink -f "$root")" ]] || return 1
  local -a args=()
  mapfile -d '' -t args < "/proc/$pid/cmdline"
  [[ ${#args[@]} == 5 && ${args[0]} == "$java" && ${args[1]} == -jar && ${args[2]} == "$jar" && ${args[3]} == --server.address=127.0.0.1 && ${args[4]} == --server.port=18444 ]]
}
if [[ -f "$root/runtime.state" ]]; then
  read -r pid started extra < "$root/runtime.state" || true
  if [[ ! ${pid:-} =~ ^[1-9][0-9]*$ || ! ${started:-} =~ ^[0-9]+$ || -n ${extra:-} || -L $root/runtime.state ]]; then
    echo 'BACKEND_ERROR=PROCESS_OWNERSHIP_CONFLICT; No process was signalled.'
    exit 2
  fi
  if [[ ! -d /proc/$pid ]]; then
    [[ $action == status ]] || rm -- "$root/runtime.state"
    pid=
  elif ! process_owned; then
    echo 'BACKEND_ERROR=PROCESS_OWNERSHIP_CONFLICT; No process was signalled.'
    exit 2
  fi
fi
if [[ -z ${pid:-} && ( $action == stop || $action == status ) ]]; then
  echo 'BACKEND_STATE=STOPPED'
  [[ $action == stop ]] && exit 0
  exit 3
fi
if [[ $action == stop ]]; then
  process_owned || { echo 'BACKEND_ERROR=PROCESS_OWNERSHIP_CONFLICT'; exit 2; }
  kill -TERM "$pid"
  for ((i=0; i<300; i++)); do
    if [[ ! -d /proc/$pid || ! -e /proc/$pid/exe ]]; then
      rm -- "$root/runtime.state"
      echo 'BACKEND_STATE=STOPPED'
      exit 0
    fi
    if ! process_owned; then
      if [[ ! -d /proc/$pid || ! -e /proc/$pid/exe ]]; then
        rm -- "$root/runtime.state"
        echo 'BACKEND_STATE=STOPPED'
        exit 0
      fi
      echo 'BACKEND_ERROR=PROCESS_OWNERSHIP_CONFLICT'; exit 2
    fi
    sleep 0.1
  done
  echo 'BACKEND_ERROR=STOP_TIMEOUT; Runtime state retained; no other process was signalled.'
  exit 1
fi
if [[ -n ${pid:-} ]]; then
  echo "BACKEND_STATE=RUNNING; PID=$pid"
  exit 0
fi
[[ -z $(ss -H -ltn 'sport = :18444') ]] || { echo 'BACKEND_ERROR=REMOTE_PORT_OCCUPIED'; exit 2; }
[[ ! -L $jar && $(sha256sum "$jar" | cut -d ' ' -f 1) == 7d402298742328122cf7e9821cb19066942e04caa753541ecbdba4e69ec104e5 ]] || { echo 'BACKEND_ERROR=ARTIFACT_HASH_MISMATCH'; exit 2; }
set -a; source "$root/runtime.env"; set +a
refuse_configuration_overrides
[[ $IDEA_DATABASE_NAME == idea_ddm_preview_20261001_26 && $IDEA_DATABASE_APP_USER == idea_ddm_app && $IDEA_DATABASE_HOST == 127.0.0.1 && $IDEA_DATABASE_PORT == 5432 ]] || { echo 'BACKEND_ERROR=PREVIEW_CONFIG_MISMATCH'; exit 2; }
unset IDEA_DATABASE_MIGRATION_PASSWORD IDEA_DATABASE_MIGRATION_USER SPRING_APPLICATION_JSON JAVA_TOOL_OPTIONS JDK_JAVA_OPTIONS _JAVA_OPTIONS
unset IDEA_IDENTITY_SYNTHETICCREDENTIALDELIVERY_ENABLED IDEA_IDENTITY_SYNTHETIC_CREDENTIAL_DELIVERY_ENABLED
export IDEA_SERVER_TLS_KEY_STORE_PASSWORD
IDEA_SERVER_TLS_KEY_STORE_PASSWORD=$(< /home/phuclam/idea-f03b-web-tls-739db09df96d4d97ac69fce17bc32fae/store-password)
# Only the inspected packaged configuration may supply Spring properties; do not
# discover application.properties/yaml in the runtime directory or its config/ folder.
export SPRING_CONFIG_LOCATION=classpath:/application.properties
# Explicitly enable the admitted documentation only in this isolated manual preview.
export IDEA_DEV_API_ENABLED=true
cd -- "$root"
nohup "$java" -jar "$jar" --server.address=127.0.0.1 --server.port=18444 >"$root/server.log" 2>&1 < /dev/null 9>&- &
pid=$!
for ((i=0; i<30; i++)); do
  [[ -r /proc/$pid/stat ]] || { echo 'BACKEND_ERROR=SERVER_START_FAILED; Inspect private server.log locally.'; exit 1; }
  stat=$(cat "/proc/$pid/stat"); tail=${stat##*) }; read -ra fields <<< "$tail"; started=${fields[19]}
  if process_owned; then
    printf '%s %s\n' "$pid" "$started" > "$root/runtime.state.tmp"
    mv -- "$root/runtime.state.tmp" "$root/runtime.state"
    echo "BACKEND_STATE=RUNNING; PID=$pid"
    exit 0
  fi
  sleep 0.1
done
echo 'BACKEND_ERROR=SERVER_START_UNVERIFIED; No readiness claimed.'
exit 1

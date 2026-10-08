#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
action=${1:-status}
[[ $# == 1 && $action =~ ^(setup|start|status|stop|credentials)$ ]] || exit 2
tools=/home/phuclam/idea-iam-ui-20261007-46/manual-dev-01
root=/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-44
retained=/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-43/source
source_sha=9d3732cb173e8094195b9bdd60b5588ac3cfa42e
manifest=29e1975f3fae8b0fe9a2d085fa8783654179528863b3e2591af4a2851cceee7f
jar_hash=318a52cf1e658a53bc9fa54137346c15277060667998d2f10f33454d15bb8c1c
java=/opt/idea/tools/jdk-25.0.4.1+1/bin/java
node=/opt/idea/tools/node-v24.21.0-linux-x64/bin/node
jar=$root/source/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar
[[ $(id -un) == phuclam && $(realpath -e "$tools") == "$tools" ]] || exit 3
(cd "$tools"; sha256sum --strict -c tools.sha256 >/dev/null)
unset MAVEN_OPTS MAVEN_ARGS JAVA_TOOL_OPTIONS JDK_JAVA_OPTIONS _JAVA_OPTIONS CLASSPATH NODE_OPTIONS NODE_PATH

ticks() { local line tail; line=$(<"/proc/$1/stat"); tail=${line##*) }; read -ra fields <<< "$tail"; printf '%s' "${fields[19]}"; }
save_process() { printf '%s %s\n' "$2" "$(ticks "$2")" > "$root/$1.state"; }
owned_pid() {
  local kind=$1 pid stamp command
  [[ -f $root/$kind.state ]] || return 1
  read -r pid stamp < "$root/$kind.state"
  [[ $pid =~ ^[0-9]+$ && $stamp =~ ^[0-9]+$ ]] || exit 4
  [[ -e /proc/$pid/exe ]] || return 1
  [[ $(stat -c '%U' "/proc/$pid") == phuclam && $(ticks "$pid") == "$stamp" ]] || exit 4
  command=$(tr '\0' ' ' < "/proc/$pid/cmdline")
  if [[ $kind == backend ]]; then [[ $command == "$java -Djava.net.preferIPv4Stack=true -jar $jar "* ]] || exit 4
  else [[ $command == "$node $tools/vite-dev.mjs " ]] || exit 4; fi
  printf '%s' "$pid"
}
get_pid() {
  process_id=
  if process_id=$(owned_pid "$1"); then return 0; else
    local result=$?; [[ $result == 1 ]] || exit "$result"; return 1
  fi
}
check_inputs() {
  [[ $(realpath -e "$root") == "$root" && $(stat -c '%U:%a' "$root") == phuclam:700 ]] || exit 3
  [[ $(sha256sum "$root/source/tests/iam-ui-46/inputs.sha256" | cut -d' ' -f1) == "$manifest" ]] || exit 4
  (cd "$root/source"; sha256sum --strict -c tests/iam-ui-46/inputs.sha256 > "$root/dev-source-check.log")
  [[ $(sha256sum "$jar" | cut -d' ' -f1) == "$jar_hash" ]] || exit 4
  [[ $(sha256sum "$node" | cut -d' ' -f1) == 7fde7b8afa198da66257f42ee2001d874c7355631e6d1579a5fb5ef1f246df4c && $("$node" --version) == v24.21.0 ]] || exit 4
  while IFS=$'\t' read -r path hash; do [[ $path == path ]] && continue; [[ $(sha256sum "$path" | cut -d' ' -f1) == "$hash" ]] || exit 4; done < "$root/source/tests/ph1/f05-qualification/https-loopback/toolchain.tsv"
  while IFS=$'\t' read -r role coordinate path hash; do [[ $role == role ]] && continue; [[ $coordinate != *jsr305* && $(sha256sum "$path" | cut -d' ' -f1) == "$hash" ]] || exit 4; done < "$root/source/docs/research/inventories/iam-ui-46-resolved-inputs.tsv"
}
database() {
  local credentials=/home/phuclam/.config/idea/f03a-test.env
  [[ $(stat -c '%U:%a' "$credentials") == phuclam:600 ]] || exit 5
  set -a; . "$credentials"; set +a
  export IDEA_DATABASE_NAME=idea_ddm_iam_ui_20261007_46 IDEA_DATABASE_HOST=127.0.0.1 IDEA_DATABASE_PORT=5432
  export IDEA_DATABASE_APP_USER=idea_ddm_app IDEA_DATABASE_MIGRATION_USER=idea_ddm_migrator
  schema=$(<"$root/schema.name"); [[ $schema =~ ^iam_ui_[0-9a-f]{32}$ ]] || exit 5
  local actual
  actual=$(PGPASSWORD="$IDEA_DATABASE_MIGRATION_PASSWORD" psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_migrator -d "$IDEA_DATABASE_NAME" -v ON_ERROR_STOP=1 -Atqc "SELECT pg_get_userbyid(nspowner)||'|'||obj_description(oid,'pg_namespace') FROM pg_namespace WHERE nspname='$schema'")
  [[ $actual == "idea_ddm_migrator|IDEA_IAM_UI_RUN:$source_sha:$schema" ]] || exit 5
  export IDEA_DATABASE_SCHEMA="$schema"
}
if [[ $action == status && ! -d $root ]]; then echo 'IAM_DEV_STATE=NOT_PROVISIONED'; exit 0; fi
if [[ $action == setup ]]; then
  [[ ! -e $root && -z $(ss -H -ltn 'sport = :18446 or sport = :5173') ]] || exit 3
  [[ $(sha256sum "$retained/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar" | cut -d' ' -f1) == "$jar_hash" ]] || exit 4
  mkdir -m 700 "$root"
  cp -a -- "$retained" "$root/source"
  check_inputs
  printf '%s  %s\n' "$jar_hash" "$jar" > "$root/jar.sha256"
  bash "$root/source/tests/iam-ui-46/account-browser.sh" "$source_sha" "$manifest" assignment-qualification-44 start
  save_process backend "$(<"$root/server.pid")"
  echo 'IAM_DEV_SETUP=PASS;FRESH_SYNTHETIC_SCHEMA=true;EXACT_QUALIFIED_PACKAGE_REUSED=true;BUILD=NOT_RUN'
  exit 0
fi
check_inputs
database
if [[ $action == credentials ]]; then
  [[ -t 1 && $(stat -c '%U:%a' "$root/fixture.private.json") == phuclam:600 ]] || exit 6
  "$node" --input-type=module -e 'import{readFileSync}from"node:fs";const f=JSON.parse(readFileSync(process.argv[1],"utf8"));for(const p of["admin","member","ordinary"])console.log(f[p+"Login"]+" : "+f[p+"Password"]);' "$root/fixture.private.json"
  exit 0
fi
if [[ $action == status ]]; then
  get_pid backend || true; backend_pid=$process_id
  get_pid vite || true; vite_pid=$process_id
  echo "IAM_DEV_STATE=$([[ -n $backend_pid && -n $vite_pid ]] && echo RUNNING || echo STOPPED);APPLICATION_SOURCE=$source_sha;JAR_SHA256=$jar_hash"
  echo "IAM_DEV_DATABASE=$IDEA_DATABASE_NAME;SCHEMA=$schema;POSTGRESQL=UP;DATA_RETAINED=true"
  exit 0
fi
if [[ $action == stop ]]; then
  # Validate both exact identities before signalling either; never delete the schema.
  get_pid vite || true; vite_pid=$process_id
  get_pid backend || true; backend_pid=$process_id
  for pid in "$vite_pid" "$backend_pid"; do
    [[ -n $pid ]] || continue; kill -TERM "$pid"
    for attempt in {1..50}; do [[ ! -e /proc/$pid/exe ]] && break; sleep 0.1; done
    [[ ! -e /proc/$pid/exe ]] || { echo 'IAM_DEV_STOP=TIMEOUT;STATE_RETAINED=true'; exit 6; }
  done
  [[ -z $(ss -H -ltn 'sport = :18446 or sport = :5173') ]] || exit 6
  echo 'IAM_DEV_STATE=STOPPED;DATABASE_SCHEMA_ACCOUNTS_RETAINED=true'
  exit 0
fi
if ! get_pid backend; then
  [[ -z $(ss -H -ltn 'sport = :18446') ]] || exit 6
  tls=/home/phuclam/idea-iam-ui-20261007-46/tls-01
  [[ $(sha256sum "$tls/fixture.p12" | cut -d' ' -f1) == cb9c804289e7d3e6b4d7e6c9f665a61194b42eac7b55146f5eecd023ef8cab2f && $(stat -c '%U:%a' "$tls/password.private") == phuclam:600 ]] || exit 6
  export IDEA_SERVER_TLS_ENABLED=true IDEA_SERVER_TLS_KEY_STORE="$tls/fixture.p12" IDEA_SERVER_TLS_KEY_ALIAS=iam-ui-46
  export IDEA_SERVER_TLS_KEY_STORE_PASSWORD="$(<"$tls/password.private")"
  unset IDEA_DATABASE_MIGRATION_PASSWORD IDEA_DATABASE_MIGRATION_USER
  nohup "$java" -Djava.net.preferIPv4Stack=true -jar "$jar" --server.address=127.0.0.1 --server.port=18446 --spring.flyway.enabled=false --idea.identity.manual-credential-delivery.enabled=true --idea.dev-api.enabled=false > "$root/dev-backend-private.log" 2>&1 < /dev/null &
  save_process backend "$!"
fi
get_pid backend; backend_pid=$process_id
for attempt in {1..100}; do
  get_pid backend || exit 6
  [[ -n $(ss -H -ltn 'sport = :18446') ]] && break; sleep 0.1
done
[[ -n $(ss -H -ltn 'sport = :18446') ]] || exit 6
if ! get_pid vite; then
  [[ -z $(ss -H -ltn 'sport = :5173') ]] || exit 6
  nohup env -u IDEA_DATABASE_APP_PASSWORD -u IDEA_DATABASE_MIGRATION_PASSWORD -u IDEA_SERVER_TLS_KEY_STORE_PASSWORD "$node" "$tools/vite-dev.mjs" > "$root/dev-vite-private.log" 2>&1 < /dev/null &
  save_process vite "$!"
fi
for attempt in {1..100}; do get_pid vite || exit 6; [[ -n $(ss -H -ltn 'sport = :5173') ]] && break; sleep 0.1; done
[[ -n $(ss -H -ltn 'sport = :5173') ]] || exit 6
echo 'IAM_DEV_STATE=RUNNING;VITE_HTTPS=127.0.0.1:5173;SERVER_HTTPS=127.0.0.1:18446;DATA_RETAINED=true'

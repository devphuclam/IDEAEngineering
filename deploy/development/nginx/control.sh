#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
action=${1:-status}
[[ $# == 1 && $action =~ ^(start|status|stop)$ ]] || exit 2
root=/home/phuclam/idea-nginx-dev-20261008-49
tools=/home/phuclam/idea-nginx-dev-control-49
fixture=/home/phuclam/idea-iam-ui-20261007-46/run-assignment-qualification-44
tls=/home/phuclam/idea-iam-ui-20261007-46/tls-01
java=/opt/idea/tools/jdk-25.0.4.1+1/bin/java
jar=$fixture/source/apps/server/target/idea-server-0.1.0-SNAPSHOT.jar
nginx=$root/package/usr/sbin/nginx
schema=iam_ui_c3b8cde44f9a4d1199306c381c12d1bb
[[ $(id -un) == phuclam && $(realpath -e "$tools") == "$tools" ]] || exit 3
(cd "$tools"; sha256sum --strict -c inputs.sha256 >/dev/null)
if [[ ! -e $root ]]; then
  [[ $action == status ]] || exit 3
  echo 'NGINX_DEV_STATE=NOT_PROVISIONED;DATABASE_CHANGED=false'
  exit 0
fi
[[ $(realpath -e "$root") == "$root" && $(stat -c '%U:%a' "$root") == phuclam:700 ]] || exit 3
exec 9> "$root/control.lock"
flock -n 9 || { echo 'NGINX_DEV_STATE=BUSY;NO_PROCESS_SIGNALLED=true'; exit 4; }
unset JAVA_TOOL_OPTIONS JDK_JAVA_OPTIONS _JAVA_OPTIONS CLASSPATH LD_PRELOAD LD_LIBRARY_PATH OPENSSL_CONF OPENSSL_MODULES

ticks() {
  local line tail
  line=$(<"/proc/$1/stat"); tail=${line##*) }
  read -ra fields <<< "$tail"
  printf '%s' "${fields[19]}"
}
owned() {
  local kind=$1 pid stamp command expected
  [[ -f $root/$kind.state ]] || return 1
  read -r pid stamp < "$root/$kind.state"
  [[ $pid =~ ^[0-9]+$ && $stamp =~ ^[0-9]+$ ]] || exit 4
  [[ -e /proc/$pid/exe ]] || return 1
  [[ $(stat -c '%U' "/proc/$pid") == phuclam && $(ticks "$pid") == "$stamp" ]] || exit 4
  command=$(tr '\0' ' ' < "/proc/$pid/cmdline")
  if [[ $kind == nginx ]]; then
    [[ $(readlink -f "/proc/$pid/exe") == "$nginx" && $command == *"-p $root/ -c $tools/nginx.conf"* ]] || exit 4
  else
    [[ $command == "$java -Djava.net.preferIPv4Stack=true -jar $jar "* && $command == *'--server.port=18449'* ]] || exit 4
  fi
  printf '%s' "$pid"
}
get_owned() {
  process_id=
  if process_id=$(owned "$1"); then return 0; else
    local result=$?; [[ $result == 1 ]] || exit "$result"; return 1
  fi
}
save() { printf '%s %s\n' "$2" "$(ticks "$2")" > "$root/$1.state"; }
inputs() {
  sha256sum --strict -c "$root/binaries.sha256" >/dev/null
  sha256sum --strict -c "$root/libraries.sha256" >/dev/null
  sha256sum --strict -c "$root/tls.sha256" >/dev/null
  [[ $(sha256sum "$jar" | cut -d' ' -f1) == 318a52cf1e658a53bc9fa54137346c15277060667998d2f10f33454d15bb8c1c ]] || exit 3
  [[ $(sha256sum "$tls/fixture.p12" | cut -d' ' -f1) == cb9c804289e7d3e6b4d7e6c9f665a61194b42eac7b55146f5eecd023ef8cab2f ]] || exit 3
  [[ $(stat -c '%U:%a' "$tls/password.private") == phuclam:600 ]] || exit 3
  openssl x509 -in "$root/tls/certificate.pem" -checkend 3600 -noout >/dev/null
}
health() {
  curl --noproxy '*' --fail --silent --show-error --max-time 5 --cacert "$root/tls/certificate.pem" \
    --resolve localhost:18449:127.0.0.1 https://localhost:18449/health/database >/dev/null 2>&1
}
close_owned() {
  local pid=$1 signal=$2
  [[ -n $pid ]] || return 0
  kill -"$signal" "$pid"
  for attempt in {1..100}; do [[ ! -e /proc/$pid/exe ]] && return 0; sleep 0.1; done
  echo 'NGINX_DEV_STOP=TIMEOUT;NO_FORCED_KILL=true'; return 1
}
# Stop is available even if package/cert inputs drift or expire; identity still must match.
get_owned nginx || true; nginx_pid=$process_id
get_owned backend || true; backend_pid=$process_id
if [[ $action == stop ]]; then
  close_owned "$nginx_pid" QUIT
  close_owned "$backend_pid" TERM
  [[ -z $(ss -H -ltn 'sport = :18448 or sport = :18449') ]] || exit 4
  echo 'NGINX_DEV_STATE=STOPPED;EXISTING_PROCESSES_AND_DATABASE_RETAINED=true'
  exit 0
fi
inputs
if [[ $action == status ]]; then
  if [[ -n $nginx_pid && -n $backend_pid ]] && health; then
    echo 'NGINX_DEV_STATE=RUNNING;NGINX=UP;SERVER=UP;POSTGRESQL=UP;UPSTREAM_TLS=VERIFIED;DATABASE_RETAINED=true'
  elif [[ -z $nginx_pid && -z $backend_pid ]]; then
    echo 'NGINX_DEV_STATE=STOPPED;DATABASE_RETAINED=true'
  else
    echo 'NGINX_DEV_STATE=DEGRADED;NO_SUCCESS_CLAIM=true'; exit 5
  fi
  exit 0
fi

new_backend=; new_nginx=
failed_start() {
  local result=$?
  trap - EXIT
  if [[ $result != 0 ]]; then
    [[ -z $new_nginx ]] || close_owned "$new_nginx" QUIT || true
    [[ -z $new_backend ]] || close_owned "$new_backend" TERM || true
    echo 'NGINX_DEV_START=FAILED;DATABASE_RETAINED=true'
  fi
  exit "$result"
}
trap failed_start EXIT
if [[ -z $backend_pid ]]; then
  [[ -z $(ss -H -ltn 'sport = :18449') ]] || exit 4
  credentials=/home/phuclam/.config/idea/f03a-test.env
  [[ $(stat -c '%U:%a' "$credentials") == phuclam:600 ]] || exit 3
  set -a; . "$credentials"; set +a
  export IDEA_DATABASE_HOST=127.0.0.1 IDEA_DATABASE_PORT=5432 IDEA_DATABASE_NAME=idea_ddm_iam_ui_20261007_46
  export IDEA_DATABASE_SCHEMA="$schema" IDEA_DATABASE_APP_USER=idea_ddm_app
  actual=$(PGPASSWORD="$IDEA_DATABASE_APP_PASSWORD" psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_app -d "$IDEA_DATABASE_NAME" -v ON_ERROR_STOP=1 -Atqc "SELECT pg_get_userbyid(nspowner)||'|'||obj_description(oid,'pg_namespace') FROM pg_namespace WHERE nspname='$schema'")
  [[ $actual == "idea_ddm_migrator|IDEA_IAM_UI_RUN:9d3732cb173e8094195b9bdd60b5588ac3cfa42e:$schema" ]] || exit 3
  export IDEA_SERVER_TLS_ENABLED=true IDEA_SERVER_TLS_KEY_STORE="$tls/fixture.p12" IDEA_SERVER_TLS_KEY_ALIAS=iam-ui-46
  export IDEA_SERVER_TLS_KEY_STORE_PASSWORD="$(<"$tls/password.private")"
  unset IDEA_DATABASE_MIGRATION_PASSWORD IDEA_DATABASE_MIGRATION_USER
  nohup "$java" -Djava.net.preferIPv4Stack=true -jar "$jar" --server.address=127.0.0.1 --server.port=18449 \
    --spring.flyway.enabled=false --idea.identity.manual-credential-delivery.enabled=true --idea.dev-api.enabled=true \
    > "$root/logs/server-private.log" 2>&1 < /dev/null 9>&- &
  new_backend=$!; save backend "$new_backend"
fi
for attempt in {1..100}; do get_owned backend || exit 5; health && break; sleep 0.2; done
health || exit 5
if [[ -z $nginx_pid ]]; then
  [[ -z $(ss -H -ltn 'sport = :18448') ]] || exit 4
  "$nginx" -p "$root/" -c "$tools/nginx.conf" -e "$root/logs/nginx-private.log" -t > "$root/logs/config-check-private.log" 2>&1
  nohup env -u IDEA_DATABASE_APP_PASSWORD -u IDEA_SERVER_TLS_KEY_STORE_PASSWORD \
    "$nginx" -p "$root/" -c "$tools/nginx.conf" -e "$root/logs/nginx-private.log" \
    > "$root/logs/nginx-start-private.log" 2>&1 < /dev/null 9>&- &
  new_nginx=$!; save nginx "$new_nginx"
fi
for attempt in {1..50}; do
  get_owned nginx || exit 5
  curl --noproxy '*' --fail --silent --max-time 2 --cacert "$root/tls/certificate.pem" \
    --resolve localhost:18448:127.0.0.1 https://localhost:18448/health/database >/dev/null && break
  sleep 0.2
done
curl --noproxy '*' --fail --silent --max-time 5 --cacert "$root/tls/certificate.pem" \
  --resolve localhost:18448:127.0.0.1 https://localhost:18448/health/database >/dev/null
echo 'NGINX_DEV_STATE=RUNNING;NGINX_HTTPS=127.0.0.1:18448;SERVER_HTTPS=127.0.0.1:18449;SWAGGER=ENABLED;DATABASE_RETAINED=true'

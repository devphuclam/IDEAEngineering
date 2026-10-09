#!/usr/bin/env bash
. "$(dirname "$(realpath -e "$0")")/common.sh"
[[ $# == 1 && $1 =~ ^(start|status|stop)$ ]] || exit 2
action=$1
exec 9> "$root/backend.lock"; flock -n 9 || exit 4
if [[ $action == stop ]]; then close_owned backend TERM; echo 'BACKEND=STOPPED;DATABASE_RETAINED=true;FRONTEND_UNCHANGED=true'; exit 0; fi
get_owned backend || true
if [[ $action == status ]]; then
  if health; then endpoint=UP; else endpoint=UNAVAILABLE; fi
  if [[ $backend_managed != true ]]; then
    echo "BACKEND=EXTERNAL;BACKEND_ENDPOINT=$endpoint;ORIGIN=$backend_origin;FRONTEND_INDEPENDENT=true"
  else
    if [[ -n $process_id && $endpoint == UP ]]; then state=UP; elif [[ -z $process_id ]]; then state=STOPPED; else state=DEGRADED; fi
    echo "BACKEND=$state;BACKEND_ENDPOINT=$endpoint;APPLICATION_SOURCE=9d3732cb173e8094195b9bdd60b5588ac3cfa42e;DATABASE=idea_ddm_iam_ui_20261007_46;SCHEMA=iam_ui_c3b8cde44f9a4d1199306c381c12d1bb;FRONTEND_INDEPENDENT=true"
  fi
  exit 0
fi
[[ $backend_managed == true ]] || { echo 'BACKEND=EXTERNAL;START_WITH_ITS_OWN_OPERATOR=true'; exit 4; }
inputs
if [[ -z $process_id ]]; then
  [[ -z $(ss -H -ltn 'sport = :18449') ]] || { echo 'BACKEND=PORT_OCCUPIED;NO_PROCESS_SIGNALLED=true'; exit 4; }
  credentials=/home/phuclam/.config/idea/f03a-test.env
  [[ $(stat -c '%U:%a' "$credentials") == phuclam:600 ]] || exit 3
  set -a; . "$credentials"; set +a
  export IDEA_DATABASE_HOST=127.0.0.1 IDEA_DATABASE_PORT=5432 IDEA_DATABASE_NAME=idea_ddm_iam_ui_20261007_46
  export IDEA_DATABASE_SCHEMA=iam_ui_c3b8cde44f9a4d1199306c381c12d1bb IDEA_DATABASE_APP_USER=idea_ddm_app
  actual=$(PGPASSWORD="$IDEA_DATABASE_APP_PASSWORD" psql -X -h 127.0.0.1 -p 5432 -U idea_ddm_app -d "$IDEA_DATABASE_NAME" -v ON_ERROR_STOP=1 -Atqc "SELECT pg_get_userbyid(nspowner)||'|'||obj_description(oid,'pg_namespace') FROM pg_namespace WHERE nspname='$IDEA_DATABASE_SCHEMA'")
  [[ $actual == "idea_ddm_migrator|IDEA_IAM_UI_RUN:9d3732cb173e8094195b9bdd60b5588ac3cfa42e:$IDEA_DATABASE_SCHEMA" ]] || exit 3
  export IDEA_SERVER_TLS_ENABLED=true IDEA_SERVER_TLS_KEY_STORE="$tls/fixture.p12" IDEA_SERVER_TLS_KEY_ALIAS=iam-ui-46
  export IDEA_SERVER_TLS_KEY_STORE_PASSWORD="$(<"$tls/password.private")"
  unset IDEA_DATABASE_MIGRATION_PASSWORD IDEA_DATABASE_MIGRATION_USER
  new_backend=1
  trap 'result=$?; if [[ $result != 0 && ${new_backend:-} == 1 ]]; then close_owned backend TERM || true; fi' EXIT
  nohup "$java" -Djava.net.preferIPv4Stack=true -jar "$jar" --server.address=127.0.0.1 --server.port=18449 \
    --spring.flyway.enabled=false --idea.identity.manual-credential-delivery.enabled=true --idea.dev-api.enabled=true \
    > "$root/logs/backend-private.log" 2>&1 < /dev/null 9>&- &
  save backend "$!"
fi
for attempt in {1..100}; do get_owned backend || exit 5; health && break; sleep 0.2; done
health || exit 5
echo 'BACKEND=UP;POSTGRESQL=UP;BUILD=NOT_RUN;MIGRATION=NOT_RUN;BOOTSTRAP=NOT_RUN;FRONTEND_INDEPENDENT=true'

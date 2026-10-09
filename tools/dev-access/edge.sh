#!/usr/bin/env bash
. "$(dirname "$(realpath -e "$0")")/common.sh"
[[ $# -ge 1 && $1 =~ ^(start|status|stop)$ ]] || exit 2
action=$1; mode=${2:-}
exec 9> "$root/edge.lock"; flock -n 9 || exit 4
if [[ $action == stop ]]; then close_owned edge QUIT; echo 'EDGE=STOPPED;BACKEND_UNCHANGED=true'; exit 0; fi
get_owned edge || true; edge_pid=$process_id
if [[ $action == status ]]; then
  if [[ -n $edge_pid ]]; then echo "EDGE=RUNNING;MODE=$(<"$root/mode")"; else echo 'EDGE=STOPPED'; fi
  exit 0
fi
inputs
[[ $# == 2 && $mode =~ ^(dev|review)$ ]] || exit 2
if [[ -n $edge_pid ]]; then [[ $(<"$root/mode") == "$mode" ]] || { echo 'EDGE=MODE_CONFLICT;STOP_EDGE_BEFORE_SWITCH=true'; exit 4; }; exit 0; fi
health || { echo 'EDGE=BACKEND_UNAVAILABLE;NO_SUCCESS_CLAIM=true'; exit 5; }
if [[ $mode == dev ]]; then curl --noproxy '*' --fail --silent --max-time 5 "$frontend_origin/@vite/client" >/dev/null || { echo 'EDGE=FRONTEND_UNAVAILABLE;NO_SNAPSHOT_FALLBACK=true'; exit 5; }; fi
[[ -z $(ss -H -ltn "sport = :$edge_port") ]] || exit 4
"$nginx" -p "$root/" -c "$root/nginx-$mode.conf" -t > "$root/logs/config-$mode-private.log" 2>&1
new_edge=1
trap 'result=$?; if [[ $result != 0 && ${new_edge:-} == 1 ]]; then close_owned edge QUIT || true; fi' EXIT
printf '%s\n' "$mode" > "$root/mode"
nohup env -u IDEA_DATABASE_APP_PASSWORD -u IDEA_SERVER_TLS_KEY_STORE_PASSWORD "$nginx" -p "$root/" -c "$root/nginx-$mode.conf" \
  > "$root/logs/edge-private.log" 2>&1 < /dev/null 9>&- &
save edge "$!"
for attempt in {1..50}; do
  get_owned edge || exit 5
  curl --noproxy '*' --fail --silent --max-time 2 --cacert "$certificate" "$public_origin/health/database" >/dev/null && break
  sleep 0.2
done
curl --noproxy '*' --fail --silent --max-time 5 --cacert "$certificate" "$public_origin/health/database" >/dev/null
echo "EDGE=RUNNING;MODE=$mode;BACKEND_UPSTREAM=$backend_origin;FRONTEND_UPSTREAM=$frontend_origin;NO_AUTHORITY_CHANGE=true"

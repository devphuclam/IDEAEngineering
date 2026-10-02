#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
controller=${1:?Provide controller path}
[[ -z $(ss -H -ltn 'sport = :18444') ]] || { echo 'BLOCKED qualification port already occupied'; exit 77; }
fixture=$(mktemp -d /tmp/idea-remote-port.XXXXXXXX)
node=/opt/idea/tools/node-v24.21.0-linux-x64/bin/node
fixture_pid=
fixture_ticks=
cleanup() {
  if [[ -n $fixture_pid && -r /proc/$fixture_pid/stat ]]; then
    stat=$(cat "/proc/$fixture_pid/stat")
    tail=${stat##*) }; read -ra fields <<< "$tail"
    if [[ ${fields[19]} == "$fixture_ticks" && $(readlink -f "/proc/$fixture_pid/exe") == "$node" ]]; then
      kill -TERM "$fixture_pid"
      wait "$fixture_pid" 2>/dev/null || true
    else
      echo 'CLEANUP_OWNERSHIP_CONFLICT; no process signalled'
    fi
  fi
  rm -f -- "$fixture/provisioned" "$fixture/runtime.env" "$fixture/controller.lock"
  rmdir -- "$fixture"
}
trap cleanup EXIT
touch "$fixture/provisioned" "$fixture/runtime.env"
chmod 600 "$fixture/provisioned" "$fixture/runtime.env"
"$node" -e "require('node:net').createServer().listen(18444, '127.0.0.1')" >/dev/null 2>&1 &
fixture_pid=$!
stat=$(cat "/proc/$fixture_pid/stat"); tail=${stat##*) }; read -ra fields <<< "$tail"; fixture_ticks=${fields[19]}
for ((i=0; i<50; i++)); do
  [[ -z $(ss -H -ltn 'sport = :18444') ]] || break
  kill -0 "$fixture_pid"
  sleep 0.1
done
[[ -n $(ss -H -ltn 'sport = :18444') ]] || { echo 'FAIL fixture did not bind'; exit 1; }
set +e
output=$(IDEA_PREVIEW_ROOT="$fixture" bash "$controller" start 2>&1)
code=$?
set -e
[[ $code == 2 && $output == *'BACKEND_ERROR=REMOTE_PORT_OCCUPIED'* && $output != *'BACKEND_STATE=RUNNING'* ]] || { echo "FAIL occupied remote port must refuse Start (got $code)"; exit 1; }
kill -0 "$fixture_pid"
[[ ! -e $fixture/runtime.state && -n $(ss -H -ltn 'sport = :18444') ]]
echo 'PASS occupied Ubuntu port refuses Start; foreign listener is not adopted or stopped'

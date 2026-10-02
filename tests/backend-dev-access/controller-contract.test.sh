#!/usr/bin/env bash
set -euo pipefail
controller=${1:?Provide controller path}
fixture=$(mktemp -d /tmp/idea-preview-contract.XXXXXXXX)
foreign_pid=
cleanup() {
  if [[ -n $foreign_pid ]]; then kill "$foreign_pid" 2>/dev/null || true; wait "$foreign_pid" 2>/dev/null || true; fi
  IDEA_PREVIEW_ROOT="$fixture" bash "$controller" stop >/dev/null 2>&1 || true
  rm -f "$fixture/runtime.env" "$fixture/provisioned" "$fixture/runtime.state" "$fixture/controller.lock" "$fixture/server.jar" "$fixture/server.log" "$fixture/runtime.state.tmp"
  rmdir "$fixture"
}
trap cleanup EXIT
set +e
output=$(IDEA_PREVIEW_ROOT="$fixture" bash "$controller" status 2>&1)
code=$?
set -e
if [[ $code != 3 || $output != *'BACKEND_STATE=NOT_PROVISIONED'* || $output == *'BACKEND_STATE=RUNNING'* ]]; then
  echo "FAIL unprovisioned status must exit 3 without readiness (got $code)"
  exit 1
fi
echo 'PASS controller refuses unprovisioned state'
touch "$fixture/provisioned" "$fixture/runtime.env"
chmod 600 "$fixture/provisioned" "$fixture/runtime.env"
set +e
output=$(IDEA_PREVIEW_ROOT="$fixture" bash "$controller" stop 2>&1)
code=$?
set -e
if [[ $code != 0 || $output != *'BACKEND_STATE=STOPPED'* ]]; then
  echo "FAIL stopping an already stopped preview must succeed (got $code)"
  exit 1
fi
echo 'PASS Stop is idempotent without starting a process'
set +e
output=$(IDEA_PREVIEW_ROOT="$fixture" bash "$controller" status 2>&1)
code=$?
set -e
if [[ $code != 3 || $output != *'BACKEND_STATE=STOPPED'* ]]; then
  echo "FAIL Status must identify an absent runtime as STOPPED (got $code)"
  exit 1
fi
echo 'PASS Status reports STOPPED rather than readiness for an absent process'
sleep 60 &
foreign_pid=$!
ticks=$(awk '{print $22}' "/proc/$foreign_pid/stat")
printf '%s %s\n' "$foreign_pid" "$ticks" > "$fixture/runtime.state"
set +e
output=$(IDEA_PREVIEW_ROOT="$fixture" bash "$controller" stop 2>&1)
code=$?
set -e
if [[ $code != 2 || $output != *'PROCESS_OWNERSHIP_CONFLICT'* ]] || ! kill -0 "$foreign_pid"; then
  echo "FAIL foreign PID must survive Stop with exit 2 (got $code)"
  exit 1
fi
echo 'PASS controller never signals a foreign process from a forged state record'
kill "$foreign_pid"; wait "$foreign_pid" 2>/dev/null || true; foreign_pid=
rm "$fixture/runtime.state"
preview=/home/phuclam/.local/share/idea/dev-preview-26
if [[ ! -f $preview/runtime.env ]]; then echo 'BLOCKED real preview configuration missing'; exit 77; fi
if [[ -n $(ss -H -ltn 'sport = :18444') ]]; then echo 'BLOCKED qualification port already occupied'; exit 77; fi
cp "$preview/runtime.env" "$fixture/runtime.env"
cp "$preview/server.jar" "$fixture/server.jar"
set +e
output=$(IDEA_PREVIEW_ROOT="$fixture" bash "$controller" start 2>&1)
code=$?
set -e
if [[ $code != 0 || $output != *'BACKEND_STATE=RUNNING'* ]]; then
  echo "FAIL Start must launch the owned retained Java package (got $code)"; exit 1
fi
IDEA_PREVIEW_ROOT="$fixture" bash "$controller" status | grep -q 'BACKEND_STATE=RUNNING'
IDEA_PREVIEW_ROOT="$fixture" bash "$controller" status | grep -q 'BACKEND_DOCUMENTATION=ENABLED'
read -r own_pid own_ticks own_artifact < "$fixture/runtime.state"
printf '%s %s\n' "$own_pid" "$own_ticks" > "$fixture/runtime.state"
legacy=$(IDEA_PREVIEW_ROOT="$fixture" bash "$controller" status)
[[ $legacy == *'BACKEND_STATE=RUNNING'* && $legacy == *'BACKEND_DOCUMENTATION=UNVERIFIED'* && $legacy != *'BACKEND_DOCUMENTATION=ENABLED'* ]]
echo 'PASS legacy receipt retains ownership without claiming documentation generation'
IDEA_PREVIEW_ROOT="$fixture" bash "$controller" stop | grep -q 'BACKEND_STATE=STOPPED'
echo 'PASS owned real Java runtime starts, is recognized, and stops without deleting configuration'
[[ -f $fixture/runtime.env && -f $fixture/provisioned ]]

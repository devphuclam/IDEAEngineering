#!/usr/bin/env bash
set -euo pipefail

target=/srv/idea/artifacts/p05-fixtures
generator=/tmp/idea-p05-generate.mjs
node=/opt/idea/tools/node-v24.21.0-linux-x64/bin/node
evidence=/home/phuclam/idea-p05-evidence-2026-09-24.txt
small=$target/IE-DATA-CANONICAL-001-small-1KiB.bin
large=$target/IE-DATA-CANONICAL-001-transfer-64MiB.bin

if (( EUID != 0 )); then
  echo 'Run this script with sudo.' >&2
  exit 1
fi
if [[ -e $target || -L $target ]]; then
  echo "Target already exists; stopped without changing it: $target" >&2
  exit 1
fi
if [[ -e $evidence || -L $evidence ]]; then
  echo "Evidence path already exists; stopped without changing it: $evidence" >&2
  exit 1
fi

printf '%s  %s\n' \
  '4ebb0eae6147d7d5cd7a238b6791535478160c3623239e8b432bf31c00e34c70' \
  "$generator" | sha256sum --check --status
"$node" --version
install -d -o idea-server -g idea-server -m 0700 "$target"
runuser -u idea-server -- "$node" "$generator" >/dev/null

[[ $(stat -c '%a %U:%G' "$target") == '700 idea-server:idea-server' ]]
[[ $(stat -c '%a %U:%G %s' "$small") == '600 idea-server:idea-server 1024' ]]
[[ $(stat -c '%a %U:%G %s' "$large") == '600 idea-server:idea-server 67108864' ]]
printf '%s  %s\n' \
  'c6aa2b94ca9fd4d756deb9d75500f1fd217bf04efad6d2be4de4a682ae723384' "$small" \
  '04c5a57e3b754b5eb75de7216d33a4982b525c3a1cdfd19b9eddfd1520126eae' "$large" \
  | sha256sum --check --status

{
  echo 'P05_SERVER_FIXTURES=PASS'
  stat -c '%a %U:%G %s %n' "$target" "$small" "$large" "$target/manifest.json"
  sha256sum "$small" "$large"
  cat "$target/manifest.json"
} > "$evidence"
chown phuclam:phuclam "$evidence"
chmod 0600 "$evidence"
echo "P05 evidence: $evidence"

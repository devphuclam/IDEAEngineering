#!/usr/bin/env bash
set -u

node_major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || printf '0')"
platform="$(uname -s 2>/dev/null || printf unknown)"
is_wsl="false"
if [ -n "${WSL_DISTRO_NAME:-}" ] || grep -qi microsoft /proc/version 2>/dev/null; then is_wsl="true"; fi
is_container="false"
if [ -f /.dockerenv ] || [ -n "${REMOTE_CONTAINERS:-}" ] || [ -n "${CODESPACES:-}" ] || [ -n "${DEVCONTAINER:-}" ]; then is_container="true"; fi

node_ok="false"
if [ "$node_major" -ge 24 ] 2>/dev/null; then node_ok="true"; fi
git_ok="false"
if git rev-parse --git-dir >/dev/null 2>&1; then git_ok="true"; fi
lock_ok="false"
if [ -f package-lock.json ] || [ -f tools/agent-workspace/package-lock.json ]; then lock_ok="true"; fi

printf '{"platform":"%s","wsl2":%s,"linuxDevContainer":%s,"nodeMajor":%s,"node24OrNewer":%s,"gitRepository":%s,"lockfile":%s}\n' "$platform" "$is_wsl" "$is_container" "$node_major" "$node_ok" "$git_ok" "$lock_ok"

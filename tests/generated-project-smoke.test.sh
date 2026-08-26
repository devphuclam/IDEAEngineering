#!/usr/bin/env bash

set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
generated_parent=$(mktemp -d)
generated_root="$generated_parent/generated-project"

cleanup() {
  rm -rf "$generated_parent"
}

trap cleanup EXIT

fail() {
  printf 'ERROR [GENERATED_PROJECT] %s\n' "$1" >&2
  exit 1
}

require_generated_path() {
  local relative_path=$1
  if [ ! -e "$generated_root/$relative_path" ]; then
    fail "Generated Project is missing required path: $relative_path"
  fi
}

require_generated_marker() {
  local relative_path=$1
  local marker=$2
  if ! grep -Fq "$marker" "$generated_root/$relative_path"; then
    fail "Generated Project path $relative_path is missing marker: $marker"
  fi
}

mkdir -p "$generated_root"
if ! (cd "$repo_root" && git archive HEAD | tar -x -C "$generated_root"); then
  fail 'Unable to create a clean Generated Project archive'
fi

require_generated_path '.template-provenance'
require_generated_path 'AGENTS.md'
require_generated_path 'docs/core-workspace.md'
require_generated_path 'docs/platform-adapters/azure.md'
require_generated_path '.devcontainer/devcontainer.json'
require_generated_path '.devcontainer/agent-workspace/devcontainer.json'
require_generated_path '.devcontainer/agent-workspace/Dockerfile'
require_generated_path '.devcontainer/agent-workspace/.dockerignore'
require_generated_path 'scripts/verify-template'
require_generated_path 'tests/devcontainer-smoke.test.sh'
require_generated_marker 'docs/core-workspace.md' 'Stack Profiles'
require_generated_marker 'docs/core-workspace.md' 'Platform Adapters'
require_generated_marker 'docs/platform-adapters/azure.md' 'Azure is optional'

git -C "$generated_root" init --quiet
git -C "$generated_root" add .

if ! (cd "$generated_root" && ./scripts/verify-template --root "$generated_root"); then
  fail 'Generated Project failed the public Core Workspace verifier'
fi

if [ "${1-}" = '--self-test' ]; then
  printf '%s\n' 'Generated Project preservation and verifier checks passed (development environment smoke skipped by request)'
  exit 0
fi

if [ "$#" -ne 0 ]; then
  printf 'ERROR [USAGE] Unknown argument: %s\n' "$1" >&2
  printf '%s\n' 'Usage: bash tests/generated-project-smoke.test.sh [--self-test]' >&2
  exit 2
fi

(cd "$generated_root" && bash tests/devcontainer-smoke.test.sh)
(
  cd "$generated_root" \
    && DEVCONTAINER_CONFIG=.devcontainer/agent-workspace/devcontainer.json \
       bash tests/devcontainer-smoke.test.sh
)
printf '%s\n' 'Generated Project verifier and development environment smoke passed'

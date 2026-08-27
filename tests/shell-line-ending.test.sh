#!/usr/bin/env bash

set -uo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
failures=0

while IFS= read -r tracked_path; do
  [ -n "$tracked_path" ] || continue
  attribute=$(git -C "$repo_root" check-attr eol -- "$tracked_path")
  eol=${attribute##*: }
  if [ "$eol" != 'lf' ]; then
    printf 'not ok - %s must use Git eol=lf (found %s)\n' "$tracked_path" "$eol"
    failures=$((failures + 1))
  fi
done < <(git -C "$repo_root" ls-files -- '*.sh')

if [ "$failures" -ne 0 ]; then
  exit 1
fi

printf '%s\n' 'ok - all tracked shell scripts use Git eol=lf'

#!/usr/bin/env bash
# Run interactively as phuclam. Never send these passwords to an Agent/chat.
set -euo pipefail
set +x
umask 077

if [ "$(id -un)" != phuclam ] || [ "$HOME" != /home/phuclam ]; then
  printf '%s\n' 'Run this helper as phuclam on the development server.' >&2
  exit 2
fi
if [ ! -t 0 ]; then
  printf '%s\n' 'An interactive terminal is required.' >&2
  exit 2
fi

directory=/home/phuclam/.config/idea
target="$directory/f03a-test.env"
if [ -L /home/phuclam/.config ] || [ -L "$directory" ] || [ -e "$target" ] || [ -L "$target" ]; then
  printf '%s\n' 'Refusing an existing credential file or symbolic-link directory.' >&2
  exit 2
fi
mkdir -p "$directory"
chmod 700 "$directory"
read -r -s -p 'PostgreSQL idea_ddm_app password: ' app_password
printf '\n'
read -r -s -p 'PostgreSQL idea_ddm_migrator password: ' migration_password
printf '\n'
if [ -z "$app_password" ] || [ -z "$migration_password" ]; then
  printf '%s\n' 'Both passwords are required; no file was written.' >&2
  exit 2
fi

# Bash-escaped literal values; no evaluation of entered password text.
set -o noclobber
{
  printf 'export IDEA_DATABASE_APP_PASSWORD=%q\n' "$app_password"
  printf 'export IDEA_DATABASE_MIGRATION_PASSWORD=%q\n' "$migration_password"
} > "$target"
unset app_password migration_password
printf '%s\n' 'F03A_TEST_ACCESS_READY; owner phuclam; mode 600; passwords not displayed.'
printf '%s\n' 'Remove /home/phuclam/.config/idea/f03a-test.env when F03-A verification is finished.'

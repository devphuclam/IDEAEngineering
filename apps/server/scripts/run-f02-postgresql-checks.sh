#!/usr/bin/env bash
set -euo pipefail

DB_NAME="${IDEA_F02_TEST_DATABASE_NAME:-idea_ddm_f02_20260929_a52f44f6}"
if [[ ! "$DB_NAME" =~ ^idea_ddm_f02_[a-z0-9_]+$ ]]; then
  printf '%s\n' 'Refusing to run: use an isolated name matching idea_ddm_f02_<run-id>.' >&2
  exit 2
fi

if [ "${IDEA_DATABASE_NAME:-$DB_NAME}" != "$DB_NAME" ]; then
  printf '%s\n' 'Refusing to run: IDEA_DATABASE_NAME must match IDEA_F02_TEST_DATABASE_NAME.' >&2
  exit 2
fi

export IDEA_DATABASE_HOST="${IDEA_DATABASE_HOST:-127.0.0.1}"
export IDEA_DATABASE_PORT="${IDEA_DATABASE_PORT:-5432}"
export IDEA_DATABASE_NAME="$DB_NAME"
export IDEA_DATABASE_APP_USER="${IDEA_DATABASE_APP_USER:-idea_ddm_app}"
export IDEA_DATABASE_MIGRATION_USER="${IDEA_DATABASE_MIGRATION_USER:-idea_ddm_migrator}"
export IDEA_F02_TEST_DATABASE_NAME="$DB_NAME"

RUN_FRESH_TEST="${IDEA_F02_RUN_FRESH_DATABASE_TEST:-1}"
if [ "$RUN_FRESH_TEST" != "0" ] && [ "$RUN_FRESH_TEST" != "1" ]; then
  printf '%s\n' 'Refusing to run: IDEA_F02_RUN_FRESH_DATABASE_TEST must be 0 or 1.' >&2
  exit 2
fi

if [ "$RUN_FRESH_TEST" = "1" ]; then
  if [ -z "${IDEA_DATABASE_APP_PASSWORD:-}" ]; then
    read -r -s -p 'IDEA app DB password: ' IDEA_DATABASE_APP_PASSWORD
    printf '\n'
  fi
  export IDEA_DATABASE_APP_PASSWORD
else
  unset IDEA_DATABASE_APP_PASSWORD
fi
if [ -z "${IDEA_DATABASE_MIGRATION_PASSWORD:-}" ]; then
  read -r -s -p 'IDEA migration DB password: ' IDEA_DATABASE_MIGRATION_PASSWORD
  printf '\n'
fi
export IDEA_DATABASE_MIGRATION_PASSWORD

export JAVA_HOME="${JAVA_HOME:-/opt/idea/tools/jdk-25.0.4.1+1}"
export PATH="$JAVA_HOME/bin:$PATH"

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
SERVER_DIR="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"
LOG_FILE="${IDEA_F02_TEST_LOG:-$HOME/${DB_NAME}-test-$(date +%Y%m%d-%H%M%S).log}"
umask 077
if [ -e "$LOG_FILE" ]; then
  printf '%s\n' 'Refusing to overwrite an existing F02 test log.' >&2
  exit 2
fi
exec > >(tee "$LOG_FILE") 2>&1

printf 'F02_TEST_DATABASE=%s\n' "$DB_NAME"
printf 'F02_TEST_LOG=%s\n' "$LOG_FILE"
if [ "$RUN_FRESH_TEST" = "1" ]; then
  printf '%s\n' 'F02_FRESH_DATABASE_TEST=RUN'
else
  printf '%s\n' 'F02_FRESH_DATABASE_TEST=NOT_RERUN; retaining prior successful test evidence'
fi
"$JAVA_HOME/bin/java" --version

if [ "$RUN_FRESH_TEST" = "1" ]; then
  (cd "$SERVER_DIR" && sh ./mvnw -B -Dtest=DataBaselineTest test)
fi
(cd "$SERVER_DIR" && sh ./scripts/database-migrate.sh)
(cd "$SERVER_DIR" && sh ./mvnw -B -Dtest=ServerSmokeTest test)

printf '%s\n' 'F02_TEST_SUITE=PASS'
unset IDEA_DATABASE_APP_PASSWORD IDEA_DATABASE_MIGRATION_PASSWORD

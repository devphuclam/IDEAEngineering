#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077

credential_file=/home/phuclam/.config/idea/f03a-test.env
if [ ! -f "$credential_file" ] || [ -L "$credential_file" ] ||
   [ "$(stat -c %a "$credential_file")" != 600 ] ||
   [ "$(stat -c %U "$credential_file")" != "$(id -un)" ]; then
  printf '%s\n' 'F03-B requires the private operator-owned test credential file.' >&2
  exit 2
fi
. "$credential_file"
: "${IDEA_DATABASE_APP_PASSWORD:?Missing app password}"
: "${IDEA_DATABASE_MIGRATION_PASSWORD:?Missing migration password}"
export IDEA_DATABASE_HOST=127.0.0.1
export IDEA_DATABASE_PORT=5432
export IDEA_F03B_TEST_DATABASE_NAME=idea_ddm_f03a_20260930_c91e7a42
export IDEA_F03_TEST_DATABASE_NAME="$IDEA_F03B_TEST_DATABASE_NAME"
export IDEA_DATABASE_APP_USER=idea_ddm_app
export IDEA_DATABASE_MIGRATION_USER=idea_ddm_migrator
export JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1
export PATH="$JAVA_HOME/bin:$PATH"

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
server_dir="$(CDPATH= cd -- "$script_dir/.." && pwd)"
log_file="$(mktemp /home/phuclam/idea-f03b-test-XXXXXXXX.log)"
exec > >(tee "$log_file") 2>&1
printf 'F03B_TEST_LOG=%s\n' "$log_file"
printf 'F03B_TEST_DATABASE=%s; schema=f03b_<random UUID>; transport=loopback HTTP test only\n' "$IDEA_F03B_TEST_DATABASE_NAME"
for role in app migration; do
  if [ "$role" = app ]; then
    PGPASSWORD="$IDEA_DATABASE_APP_PASSWORD" psql -h 127.0.0.1 -U idea_ddm_app -d "$IDEA_F03B_TEST_DATABASE_NAME" -Atc 'SELECT current_user,current_database();'
  else
    PGPASSWORD="$IDEA_DATABASE_MIGRATION_PASSWORD" psql -h 127.0.0.1 -U idea_ddm_migrator -d "$IDEA_F03B_TEST_DATABASE_NAME" -Atc 'SELECT current_user,current_database();'
  fi
done
java --version
cd "$server_dir"
sh ./mvnw -B "-Dtest=${1:-HttpSessionFlowTest,ServerSmokeTest}" test
printf '%s\n' 'F03B_SCOPED_TESTS=PASS'

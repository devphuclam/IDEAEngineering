#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077

credential_file=/home/phuclam/.config/idea/f03a-test.env
if [ -L "$credential_file" ] || [ "$(stat -c %a "$credential_file")" != 600 ] ||
   [ "$(stat -c %U "$credential_file")" != "$(id -un)" ]; then
  printf '%s\n' 'F03-A credentials must be a private, operator-owned regular file.' >&2
  exit 2
fi
test -f "$credential_file" || exit 2
. "$credential_file"
: "${IDEA_DATABASE_APP_PASSWORD:?Missing app password}"
: "${IDEA_DATABASE_MIGRATION_PASSWORD:?Missing migration password}"

# All test DDL is in a UUID schema inside this existing dedicated test database.
# Neither the development database nor public schema is migrated/cleaned by IdentityFlowTest.
export IDEA_DATABASE_HOST=127.0.0.1
export IDEA_DATABASE_PORT=5432
export IDEA_F03_TEST_DATABASE_NAME=idea_ddm_f02_20260929_a52f44f6
export IDEA_DATABASE_APP_USER=idea_ddm_app
export IDEA_DATABASE_MIGRATION_USER=idea_ddm_migrator
export JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1
export PATH="$JAVA_HOME/bin:$PATH"

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
server_dir="$(CDPATH= cd -- "$script_dir/.." && pwd)"
log_file="$(mktemp /home/phuclam/idea-f03a-test-XXXXXXXX.log)"
exec > >(tee "$log_file") 2>&1
printf 'F03A_TEST_LOG=%s\n' "$log_file"
printf 'F03A_TEST_DATABASE=%s; schema=f03a_<random UUID>\n' "$IDEA_F03_TEST_DATABASE_NAME"
for role in app migration; do
  if [ "$role" = app ]; then
    PGPASSWORD="$IDEA_DATABASE_APP_PASSWORD" psql -h 127.0.0.1 -U idea_ddm_app -d "$IDEA_F03_TEST_DATABASE_NAME" -Atc 'SELECT current_user, current_database();'
  else
    PGPASSWORD="$IDEA_DATABASE_MIGRATION_PASSWORD" psql -h 127.0.0.1 -U idea_ddm_migrator -d "$IDEA_F03_TEST_DATABASE_NAME" -Atc 'SELECT current_user, current_database();'
  fi
done
"$JAVA_HOME/bin/java" --version
cd "$server_dir"
sh ./mvnw -B "-Dtest=${1:-IdentityFlowTest}" test
printf '%s\n' 'F03A_SCOPED_TESTS=PASS'

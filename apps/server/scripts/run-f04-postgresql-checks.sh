#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
server_dir="$(CDPATH= cd -- "$script_dir/.." && pwd)"
export IDEA_F04_REPO_ROOT="$(CDPATH= cd -- "$server_dir/../.." && pwd)"
: "${IDEA_F04_SOURCE_SHA:?Exact committed archive source is required}"
[[ "$IDEA_F04_SOURCE_SHA" =~ ^[0-9a-f]{40}$ ]] || exit 2
[ -f "$IDEA_F04_REPO_ROOT/docs/research/2026-10-02-f04-buildtool-execution-authorization.md" ] || exit 2

# Read-only checksum/descriptor preflight against the authoritative retained inventory.
python3 - <<'PY'
import hashlib, os, re, xml.etree.ElementTree as ET, zipfile
from pathlib import Path
root=Path(os.environ['IDEA_F04_REPO_ROOT'])
intake=(root/'docs/research/2026-10-01-t043-maven-web-build-intake.md').read_text()
inventory=dict(re.findall(r'^\| `([^`]+:[^`]+:[^`]+)` \| `([A-F0-9]{64})` \|', intake, re.M))
if len(inventory)!=9: raise SystemExit('BLOCKED: exact nine-artifact inventory missing')
cache=Path('/home/phuclam/.m2/repository')
paths={}
for gav,wanted in inventory.items():
    group,artifact,version=gav.split(':')
    path=cache/group.replace('.','/')/artifact/version/(artifact+'-'+version+'.jar')
    if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest().upper()!=wanted:
        raise SystemExit('BLOCKED: missing/hash-changed approved build artifact '+gav)
    paths[gav]=path
with zipfile.ZipFile(paths['org.codehaus.mojo:exec-maven-plugin:3.6.3']) as z:
    raw=z.read('META-INF/maven/plugin.xml')
    actual={':'.join(n.findtext(k) for k in ('groupId','artifactId','version'))
            for n in ET.fromstring(raw).findall('./dependencies/dependency')}
    if actual!=set(inventory)-{'org.codehaus.mojo:exec-maven-plugin:3.6.3'} or hashlib.sha256(raw).hexdigest().upper()!='186E94C4147FC6600DBB0865B50FF3783D19B6F9A0FA06732521706AE2605A96':
        raise SystemExit('BLOCKED: build-tool descriptor changed')
print('F04_BUILD_TOOL_PREFLIGHT=9/9; DESCRIPTOR=EXACT; MODE=OFFLINE')
PY

credential_file=/home/phuclam/.config/idea/f03a-test.env
if [ ! -f "$credential_file" ] || [ -L "$credential_file" ] ||
   [ "$(stat -c %a "$credential_file")" != 600 ] || [ "$(stat -c %U "$credential_file")" != "$(id -un)" ]; then
  printf '%s\n' 'BLOCKED: controlled private credential file required' >&2
  exit 2
fi
. "$credential_file"
: "${IDEA_DATABASE_APP_PASSWORD:?Missing app credential}"
: "${IDEA_DATABASE_MIGRATION_PASSWORD:?Missing migrator credential}"
export IDEA_DATABASE_APP_PASSWORD IDEA_DATABASE_MIGRATION_PASSWORD
export IDEA_DATABASE_HOST=127.0.0.1 IDEA_DATABASE_PORT=5432
export IDEA_DATABASE_APP_USER=idea_ddm_app IDEA_DATABASE_MIGRATION_USER=idea_ddm_migrator
export IDEA_F04_TEST_DATABASE_NAME=idea_ddm_f03a_20260930_c91e7a42
export IDEA_F04_TEST_SCHEMA="f04_$(python3 -c 'import uuid; print(uuid.uuid4().hex)')"
export JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1
export PATH="$JAVA_HOME/bin:/opt/idea/tools/node-v24.21.0-linux-x64/bin:$PATH"
maven=/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn
[ -x "$maven" ] || { printf '%s\n' 'BLOCKED: approved cached Maven missing'; exit 2; }
[ -f "$IDEA_F04_REPO_ROOT/apps/web/node_modules/typescript/package.json" ] || {
  printf '%s\n' 'BLOCKED: existing locked Web cache must be prepared; no install fallback'; exit 2;
}

test_selector="${1:-F04SchemaTest}"
[[ "$test_selector" =~ ^(F04SchemaTest|F04PredecessorMigrationTest|AuditEvidenceRepositoryTest)(#[A-Za-z][A-Za-z0-9]*)?$ ]] || exit 2
log_file="$(mktemp /home/phuclam/idea-f04-schema-XXXXXXXX.log)"
exec > >(tee "$log_file") 2>&1
printf 'F04_SOURCE=%s; F04_DATABASE=%s; F04_SCHEMA=%s; LOG=%s\n' \
  "$IDEA_F04_SOURCE_SHA" "$IDEA_F04_TEST_DATABASE_NAME" "$IDEA_F04_TEST_SCHEMA" "$log_file"
cd "$server_dir"
set +e
"$maven" -o -B "-Dtest=$test_selector" test
result=$?
set -e
printf 'F04_MAVEN_EXIT=%s\n' "$result"

# Capture the result before cleanup. Credentials never enter command arguments or output.
if [ -d target/surefire-reports ]; then
  find target/surefire-reports -maxdepth 1 -type f -name '*Test*' -exec sha256sum {} \;
fi
export PGHOST=127.0.0.1 PGPORT=5432 PGDATABASE="$IDEA_F04_TEST_DATABASE_NAME"
export PGUSER=idea_ddm_migrator PGPASSWORD="$IDEA_DATABASE_MIGRATION_PASSWORD"
[[ "$IDEA_F04_TEST_SCHEMA" =~ ^f04_[0-9a-f]{32}$ ]] || exit 2
marker="IDEA_F04_RUN:$IDEA_F04_SOURCE_SHA:$IDEA_F04_TEST_SCHEMA"
owned="$(psql -X -v ON_ERROR_STOP=1 -Atc "SELECT count(*) FROM pg_namespace WHERE nspname='$IDEA_F04_TEST_SCHEMA' AND pg_get_userbyid(nspowner)='idea_ddm_migrator' AND obj_description(oid,'pg_namespace')='$marker'")"
if [ "$owned" = 1 ]; then
  # Maven/test connections are stopped; only this run's exact tagged schema may be removed.
  psql -X -v ON_ERROR_STOP=1 -c "DROP SCHEMA $IDEA_F04_TEST_SCHEMA CASCADE"
  printf 'F04_OWNED_SCHEMA_CLEANUP=COMPLETE; SCHEMA=%s\n' "$IDEA_F04_TEST_SCHEMA"
elif [ "$owned" != 0 ]; then
  printf '%s\n' 'BLOCKED: schema ownership marker mismatch; no cleanup performed' >&2
  exit 2
fi
unset PGPASSWORD IDEA_DATABASE_APP_PASSWORD IDEA_DATABASE_MIGRATION_PASSWORD
exit "$result"

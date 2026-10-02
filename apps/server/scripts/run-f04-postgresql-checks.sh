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
export JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1
export PATH="$JAVA_HOME/bin:/opt/idea/tools/node-v24.21.0-linux-x64/bin:$PATH"
maven=/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn
[ -x "$maven" ] || { printf '%s\n' 'BLOCKED: approved cached Maven missing'; exit 2; }
export IDEA_F04_MAVEN="$maven"

# Read-only checksum/descriptor preflight against the authoritative retained inventory.
python3 - <<'PY'
import hashlib, json, os, re, subprocess, xml.etree.ElementTree as ET, zipfile
from pathlib import Path
root=Path(os.environ['IDEA_F04_REPO_ROOT'])
# Git blob identities from qualified application source 2a74130..., not current mutable files.
build_inputs={
    'apps/server/pom.xml':'8a6f0e54ea7d59e5839ebff513bd9903b802a19f',
    'apps/server/scripts/build-web-static.mjs':'4afc7eb0316fc98d60defcdc35665c738ce5fb4f',
    'apps/web/package.json':'8b69a5fbfc465b928dc1a584cbccc566e6a23b4b',
    'apps/web/package-lock.json':'ceb0b140bc1aedbc246f91cda8cce8b080b2a4a6',
    'apps/web/vite.config.ts':'58676f788a8e5e81102769fc864d071857d12dd1',
}
for relative,wanted in build_inputs.items():
    path=root/relative
    if not path.is_file(): raise SystemExit('BLOCKED: approved build input missing '+relative)
    raw=path.read_bytes()
    actual=hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
    if actual!=wanted: raise SystemExit('BLOCKED: qualified build input changed '+relative)
for directory in (root/'.mvn',root/'apps/server/.mvn'):
    for name in ('maven.config','jvm.config','extensions.xml'):
        if (directory/name).exists(): raise SystemExit('BLOCKED: unapproved Maven configuration '+name)
package=json.loads((root/'apps/web/package.json').read_text())
direct=package['dependencies'] | package['devDependencies']
for name,wanted in direct.items():
    path=root/'apps/web/node_modules'/name/'package.json'
    if not path.is_file() or json.loads(path.read_text()).get('version')!=wanted:
        raise SystemExit('BLOCKED: approved installed Web package missing/changed '+name)
java=subprocess.check_output([os.environ['JAVA_HOME']+'/bin/java','--version'],text=True)
if 'Temurin-25.0.4.1+1' not in java: raise SystemExit('BLOCKED: approved JDK changed')
if not subprocess.check_output([os.environ['IDEA_F04_MAVEN'],'--version'],text=True).startswith('Apache Maven 3.9.16 '):
    raise SystemExit('BLOCKED: approved Maven changed')
if subprocess.check_output(['node','--version'],text=True).strip()!='v24.21.0':
    raise SystemExit('BLOCKED: approved Node changed')
if subprocess.check_output(['npm','--version'],text=True).strip()!='11.19.0':
    raise SystemExit('BLOCKED: approved npm changed')
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
print('F04_BUILD_TOOL_PREFLIGHT=9/9; DESCRIPTOR=EXACT; BUILD_INPUTS=5/5; WEB_DIRECT=8/8; TOOLS=EXACT; MODE=OFFLINE')
PY
if [ "${1:-}" = --preflight-only ]; then
  printf '%s\n' 'F04_BUILD_PREFLIGHT_ONLY=PASS; MAVEN_BUILD=NOT-RUN; DATABASE=NOT-ACCESSED'
  exit 0
fi

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
[ -f "$IDEA_F04_REPO_ROOT/apps/web/node_modules/typescript/package.json" ] || {
  printf '%s\n' 'BLOCKED: existing locked Web cache must be prepared; no install fallback'; exit 2;
}

test_selector="${1:-F04SchemaTest}"
[[ "$test_selector" =~ ^(F04SchemaTest|F04PredecessorMigrationTest|AuditEvidenceRepositoryTest)(#[A-Za-z][A-Za-z0-9]*)?$ ]] || exit 2
# Confirm server version and app authority before the test is allowed to create its schema.
export PGHOST=127.0.0.1 PGPORT=5432 PGDATABASE="$IDEA_F04_TEST_DATABASE_NAME"
export PGUSER=idea_ddm_app PGPASSWORD="$IDEA_DATABASE_APP_PASSWORD"
prerequisite="$(psql -X -v ON_ERROR_STOP=1 -Atc "SELECT current_setting('server_version')='18.6' AND current_user='idea_ddm_app' AND NOT has_database_privilege(current_user,current_database(),'CREATE')")"
[ "$prerequisite" = t ] || { printf '%s\n' 'BLOCKED: PostgreSQL version/app authority changed' >&2; exit 2; }
unset PGPASSWORD
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
exists="$(psql -X -v ON_ERROR_STOP=1 -Atc "SELECT count(*) FROM pg_namespace WHERE nspname='$IDEA_F04_TEST_SCHEMA'")"
if [ "$owned" = 1 ]; then
  # Maven/test connections are stopped; only this run's exact tagged schema may be removed.
  psql -X -v ON_ERROR_STOP=1 -c "DROP SCHEMA $IDEA_F04_TEST_SCHEMA CASCADE"
  remaining="$(psql -X -v ON_ERROR_STOP=1 -Atc "SELECT count(*) FROM pg_namespace WHERE nspname='$IDEA_F04_TEST_SCHEMA'")"
  [ "$remaining" = 0 ] || { printf '%s\n' 'BLOCKED: owned schema cleanup not confirmed' >&2; exit 2; }
  printf 'F04_OWNED_SCHEMA_CLEANUP=COMPLETE; SCHEMA=%s\n' "$IDEA_F04_TEST_SCHEMA"
elif [ "$exists" = 0 ]; then
  printf 'F04_OWNED_SCHEMA_CLEANUP=NOT-CREATED; SCHEMA=%s\n' "$IDEA_F04_TEST_SCHEMA"
else
  printf '%s\n' 'BLOCKED: schema ownership marker mismatch; no cleanup performed' >&2
  exit 2
fi
unset PGPASSWORD IDEA_DATABASE_APP_PASSWORD IDEA_DATABASE_MIGRATION_PASSWORD
exit "$result"

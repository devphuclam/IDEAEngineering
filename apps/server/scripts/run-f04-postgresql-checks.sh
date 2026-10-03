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
[ -f "$IDEA_F04_REPO_ROOT/docs/research/2026-10-02-f04-python-harness-authorization.md" ] || exit 2
f04_python=/usr/bin/python3.14
if [ ! -x "$f04_python" ] ||
   [ "$(sha256sum "$f04_python" | cut -d ' ' -f 1)" != 52e0a13e60a981d8c4b6478be2ba5176f69da07948a056bf49cf6f077e30cb41 ]; then
  printf '%s\n' 'BLOCKED: exact authorized F04 Python interpreter missing/changed' >&2
  exit 2
fi
export JAVA_HOME=/opt/idea/tools/jdk-25.0.4.1+1
export PATH="$JAVA_HOME/bin:/opt/idea/tools/node-v24.21.0-linux-x64/bin:$PATH"
maven=/home/phuclam/.m2/wrapper/dists/apache-maven-3.9.16/510fba38/bin/mvn
[ -x "$maven" ] || { printf '%s\n' 'BLOCKED: approved cached Maven missing'; exit 2; }
export IDEA_F04_MAVEN="$maven"

# Read-only checksum/descriptor preflight against the authoritative retained inventory.
"$f04_python" -I -S - <<'PY'
import hashlib, json, os, re, subprocess, sys, xml.etree.ElementTree as ET, zipfile
from pathlib import Path
if (sys.version_info[:3] != (3, 14, 4) or sys.implementation.name != 'cpython'
        or sys.executable != '/usr/bin/python3.14' or sys.prefix != '/usr'
        or sys.base_prefix != '/usr' or not sys.flags.isolated or not sys.flags.no_site):
    raise SystemExit('BLOCKED: authorized isolated F04 Python runtime changed')
print('F04_PYTHON=CPython-3.14.4; ISOLATED=1; NO_SITE=1; INTERPRETER_SHA256=EXACT')
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
    # git archive applies this Windows checkout's CRLF conversion to text files.
    # Pin the qualified Git text blob, allowing only the LF/CRLF representation difference.
    raw=path.read_bytes().replace(b'\r\n',b'\n')
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
maven_version=re.sub(r'\x1b\[[0-9;]*m','',subprocess.check_output([os.environ['IDEA_F04_MAVEN'],'--version'],text=True))
if not maven_version.startswith('Apache Maven 3.9.16 '):
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
export IDEA_F03_TEST_DATABASE_NAME="$IDEA_F04_TEST_DATABASE_NAME"
export IDEA_F03B_TEST_DATABASE_NAME="$IDEA_F04_TEST_DATABASE_NAME"
export IDEA_F04_TEST_SCHEMA="f04_$("$f04_python" -I -S -c 'import uuid; print(uuid.uuid4().hex)')"
[ -f "$IDEA_F04_REPO_ROOT/apps/web/node_modules/typescript/package.json" ] || {
  printf '%s\n' 'BLOCKED: existing locked Web cache must be prepared; no install fallback'; exit 2;
}

test_selector="${1:-F04SchemaTest}"
[[ "$test_selector" =~ ^(F04SchemaTest|F04PredecessorMigrationTest|AuditEvidenceRepositoryTest|OwnerOutcomeTest|IdentityFlowTest|HttpSessionFlowTest|ServerRestartFlowTest|ServerSmokeTest)(#[A-Za-z][A-Za-z0-9]*)?$ ]] || exit 2
# Confirm server version and app authority before the test is allowed to create its schema.
export PGHOST=127.0.0.1 PGPORT=5432 PGDATABASE="$IDEA_F04_TEST_DATABASE_NAME"
export PGUSER=idea_ddm_app PGPASSWORD="$IDEA_DATABASE_APP_PASSWORD"
prerequisite="$(psql -X -v ON_ERROR_STOP=1 -Atc "SELECT current_setting('server_version_num')='180006' AND current_user='idea_ddm_app' AND NOT has_database_privilege(current_user,current_database(),'CREATE') AND NOT has_schema_privilege(current_user,'public','CREATE')")"
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
# Regression fixtures close their Server/child processes before marker-guarded cleanup.
# Verify absence; never automatically drop a leftover nested schema after a failed shutdown.
while read -r regression_schema; do
  [[ "$regression_schema" =~ ^f04_[0-9a-f]{32}$ ]] || exit 2
  [ "$regression_schema" = "$IDEA_F04_TEST_SCHEMA" ] && continue
  remaining="$(psql -X -v ON_ERROR_STOP=1 -Atc "SELECT count(*) FROM pg_namespace WHERE nspname='$regression_schema'")"
  [ "$remaining" = 0 ] || { printf 'BLOCKED: retained regression schema %s; no automatic cleanup\n' "$regression_schema" >&2; exit 2; }
  printf 'F04_REGRESSION_SCHEMA_ABSENT=CONFIRMED; SCHEMA=%s\n' "$regression_schema"
done < <(sed -nE 's/^F04_SCHEMA_READY=(f04_[0-9a-f]{32});.*/\1/p' "$log_file" | sort -u)
while read -r child_pid; do
  if kill -0 "$child_pid" 2>/dev/null; then
    printf 'BLOCKED: restart child PID %s remains live; no cleanup permitted\n' "$child_pid" >&2
    exit 2
  fi
  printf 'F04_RESTART_CHILD_STOPPED=%s\n' "$child_pid"
done < <(sed -nE 's/^F03B_RESTART_RUNTIME=[0-9]+; pid=([0-9]+);.*/\1/p' "$log_file" | sort -u)
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

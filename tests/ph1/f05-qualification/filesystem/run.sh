#!/usr/bin/bash
# Approved JDK-only synthetic filesystem prerequisite; no dynamic repair or cleanup.
set -euo pipefail
unset JAVA_TOOL_OPTIONS _JAVA_OPTIONS JDK_JAVA_OPTIONS CLASSPATH LD_PRELOAD LD_LIBRARY_PATH BASH_ENV ENV
umask 077
refuse() { printf 'T027_FILESYSTEM_PREFLIGHT=BLOCKED;reason=%s\n' "$1" >&2; exit 3; }
[[ $# == 2 && "$1" =~ ^[0-9a-f]{40}$ && "$2" =~ ^[0-9a-f]{64}$ ]] || refuse RECEIPT_ARGUMENTS
[[ "$BASH_VERSION" == '5.3.9(1)-release' ]] || refuse BASH_VERSION
root=/home/phuclam/idea-f05a-20261003-37/filesystem-qualification-01
src="$root/source/tests/ph1/f05-qualification/filesystem"
check_hash() {
  local observed
  observed="$(/usr/bin/sha256sum -- "$1")" || refuse HASH_READ
  [[ "${observed%% *}" == "$2" ]] || refuse HASH_DRIFT
}
check_hash /usr/bin/bash 3efccc187bafa75ff1e37d246270ab3e7aa559f242c7a52bf3ec2a1b5450bdbd
for utility in /usr/bin/sha256sum /usr/bin/readlink /usr/bin/stat; do
  check_hash "$utility" f84e76ea4da1e0c4e92254bd0d7dccdabe2c8b3098e734f27997dae3ee5d8e02
done
for directory in /home/phuclam/idea-f05a-20261003-37 "$root" "$root/source"; do
  [[ -d "$directory" && ! -L "$directory" ]] || refuse ROOT_TYPE
  [[ "$(/usr/bin/readlink -f -- "$directory")" == "$directory" ]] || refuse CANONICAL_ROOT
  [[ "$(/usr/bin/stat -c '%u:%a' -- "$directory")" == "$UID:700" ]] || refuse ROOT_OWNER_MODE
done
[[ "$(/usr/bin/readlink -f -- "${BASH_SOURCE[0]}")" == "$src/run.sh" ]] || refuse RUNNER_LOCATION
[[ ! -e "$root/fixture" && ! -L "$root/fixture" ]] || refuse FIXTURE_ALREADY_EXISTS
for file in FilesystemPrerequisite.java run.sh tools.sha256 inputs.sha256; do
  [[ -f "$src/$file" && ! -L "$src/$file" ]] || refuse INPUT_TYPE
  [[ "$(/usr/bin/stat -c '%u:%a' -- "$src/$file")" == "$UID:600" ]] || refuse INPUT_MODE
done
cd "$src"
check_hash inputs.sha256 "$2"
/usr/bin/sha256sum --check --strict inputs.sha256 || refuse INPUT_HASH
/usr/bin/sha256sum --check --strict tools.sha256 || refuse TOOL_HASH
printf 'T027_FILESYSTEM_SOURCE=%s\nT027_FILESYSTEM_PREFLIGHT=PASS\n' "$1"
/opt/idea/tools/jdk-25.0.4.1+1/bin/java --source 25 "$src/FilesystemPrerequisite.java"
/usr/bin/sha256sum --check --strict tools.sha256 || refuse FINAL_TOOL_HASH
/usr/bin/sha256sum --check --strict inputs.sha256 || refuse FINAL_INPUT_HASH
[[ "$(/usr/bin/stat -c '%s:%a' -- "$root/fixture/adapter/objects/verified.bin")" == '1024:400' ]] || refuse EXTERNAL_OBJECT_ORACLE
check_hash "$root/fixture/adapter/objects/verified.bin" 5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef
check_hash "$root/fixture/outside-adapter/sentinel.bin" 5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef
printf 'T027_FILESYSTEM_EXTERNAL_ORACLE=PASS;INPUTS=UNCHANGED;TOOLING=UNCHANGED\n'

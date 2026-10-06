#!/usr/bin/bash
# T027 Q01 only. Provisioning/execution needs the separately reviewed package.
set -euo pipefail
# Clear child-process injection variables before invoking any external utility.
unset JAVA_TOOL_OPTIONS _JAVA_OPTIONS JDK_JAVA_OPTIONS CLASSPATH LD_PRELOAD LD_LIBRARY_PATH BASH_ENV ENV

refuse() {
  printf 'F05_Q01_PREFLIGHT=BLOCKED; reason=%s\n' "$1" >&2
  exit 3
}

[[ $# == 0 ]] || refuse ARGUMENTS
[[ "$BASH_VERSION" == '5.3.9(1)-release' ]] || refuse BASH_VERSION
expected_root=/home/phuclam/idea-f05a-20261003-37
qualification_dir="$expected_root/qualification"
source_file="$qualification_dir/Ed25519KeySeparationQualification.java"
[[ -d "$qualification_dir" && ! -L "$expected_root" && ! -L "$qualification_dir" ]] || refuse RUN_ROOT
[[ "$('/usr/bin/readlink' -f -- "${BASH_SOURCE[0]}")" == "$qualification_dir/run-q01.sh" ]] || refuse RUNNER_LOCATION
[[ "$('/usr/bin/readlink' -f -- "$qualification_dir")" == "$qualification_dir" ]] || refuse ROOT_CONTAINMENT
for directory in "$expected_root" "$qualification_dir"; do
  [[ "$('/usr/bin/stat' -c '%u:%a' -- "$directory")" == "$UID:700" ]] || refuse ROOT_PERMISSIONS
done
[[ -f "$source_file" && ! -L "$source_file" ]] || refuse SOURCE_FILE
[[ "$('/usr/bin/stat' -c '%u:%a' -- "$source_file")" == "$UID:600" ]] || refuse SOURCE_PERMISSIONS
[[ "$('/usr/bin/stat' -c '%u:%a' -- "${BASH_SOURCE[0]}")" == "$UID:600" ]] || refuse RUNNER_PERMISSIONS

check_hash() {
  local observed
  observed="$(/usr/bin/sha256sum -- "$1")" || refuse HASH_READ
  [[ "${observed%% *}" == "$2" ]] || refuse ARTIFACT_HASH
}

check_hash /usr/bin/bash 3efccc187bafa75ff1e37d246270ab3e7aa559f242c7a52bf3ec2a1b5450bdbd
for utility in /usr/bin/sha256sum /usr/bin/readlink /usr/bin/stat; do
  check_hash "$utility" f84e76ea4da1e0c4e92254bd0d7dccdabe2c8b3098e734f27997dae3ee5d8e02
done
jdk=/opt/idea/tools/jdk-25.0.4.1+1
check_hash "$jdk/bin/java" 7380ce48ed5013735d2c8414db54adb8f981e7933ff594bd36f3baccddaafba3
check_hash "$jdk/lib/modules" 6b11db4c84e8ac3b9500397753e02ad03450e904fa8656eb8fd2a2197e536b57
check_hash "$jdk/lib/server/libjvm.so" 5e0fb6e83a5676090f28ff0b453e9199df06af1ff90d473c1b9837e41096114c
check_hash "$jdk/lib/libjli.so" 7e7f36f97914708f5289433fc52b0787ffc66ecb0f4f31d09ad16bcd9e3c25aa
check_hash "$jdk/release" 44be64b383baa18668afefbe9a780ae3a9d730a066eaaa92500f77bd1e4b934c
check_hash "$jdk/conf/security/java.security" 7c43432bc33b890d4e750f6886f383785a35a9b6021c34c84fcde11bb15c152d
check_hash "$source_file" ccf7e62043ccb072631410bf351d42b00b8442a93930e9425e2e99d439cba2a4

printf 'F05_Q01_PREFLIGHT=PASS\n'
exec "$jdk/bin/java" --source 25 "$source_file"

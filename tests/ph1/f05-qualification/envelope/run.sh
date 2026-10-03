#!/usr/bin/bash
set -euo pipefail
umask 077
unset JAVA_TOOL_OPTIONS _JAVA_OPTIONS JDK_JAVA_OPTIONS CLASSPATH LD_PRELOAD LD_LIBRARY_PATH BASH_ENV ENV
refuse() { printf 'T027_ENVELOPE=BLOCKED;reason=%s\n' "$1" >&2; exit 3; }
[[ $# == 3 && "$1" =~ ^[0-9a-f]{40}$ && "$2" =~ ^[0-9a-f]{64}$ ]] || refuse RECEIPT
case "$3" in
  red) name=envelope-red-01 ;;
  trace) name=envelope-green-01 ;;
  sign-red) name=envelope-sign-red-01 ;;
  sign-green) name=envelope-sign-green-01 ;;
  full) name=envelope-qualification-01 ;;
  *) refuse PHASE ;;
esac
root="/home/phuclam/idea-f05a-20261003-37/$name"
src="$root/source/tests/ph1/f05-qualification/envelope"
for dir in /home/phuclam/idea-f05a-20261003-37 "$root" "$root/source"; do
  [[ -d "$dir" && ! -L "$dir" && "$(/usr/bin/readlink -f "$dir")" == "$dir" ]] || refuse ROOT
  [[ "$(/usr/bin/stat -c '%u:%a' "$dir")" == "$UID:700" ]] || refuse ROOT_MODE
done
[[ "$(/usr/bin/readlink -f "${BASH_SOURCE[0]}")" == "$src/run.sh" && ! -e "$root/run" ]] || refuse REUSE
[[ "$BASH_VERSION" == '5.3.9(1)-release' ]] || refuse BASH_VERSION
cd "$root/source"
[[ "$(/usr/bin/sha256sum "$src/inputs.sha256")" == "$2  $src/inputs.sha256" ]] || refuse MANIFEST
/usr/bin/sha256sum --check --strict "$src/inputs.sha256" || refuse INPUT_HASH
pins=tests/ph1/f05-qualification/https-loopback/toolchain.tsv
while IFS=$'\t' read -r path hash; do
  [[ "$path" == path ]] && continue
  [[ "$hash" =~ ^[0-9a-f]{64}$ && "$(/usr/bin/sha256sum "$path")" == "$hash  $path" ]] || refuse TOOL_HASH
done < "$pins"
jdk=/opt/idea/tools/jdk-25.0.4.1+1/bin
/usr/bin/mkdir -m700 -p "$root/run/classes"
"$jdk/javac" -d "$root/run/classes" "$src/Envelope.java" "$src/Qualification.java"
printf 'SOURCE=%s\nPHASE=%s\n' "$1" "$3"
if [[ "$3" == full ]]; then
  "$jdk/java" -cp "$root/run/classes" Qualification sign "$root/run/vectors"
  "$jdk/java" -cp "$root/run/classes" Qualification verify "$root/run/vectors"
else
  case "$3" in sign-*) command=signature ;; *) command=trace ;; esac
  "$jdk/java" -cp "$root/run/classes" Qualification "$command"
fi
/usr/bin/sha256sum --check --strict "$src/inputs.sha256" || refuse FINAL_INPUT_HASH
while IFS=$'\t' read -r path hash; do
  [[ "$path" == path ]] && continue
  [[ "$(/usr/bin/sha256sum "$path")" == "$hash  $path" ]] || refuse FINAL_TOOL_HASH
done < "$pins"
printf 'ORIGINAL_INPUTS_TOOLS_UNCHANGED=PASS\n'

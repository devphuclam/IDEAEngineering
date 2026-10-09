#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
root=$(dirname "$(realpath -e "${BASH_SOURCE[0]}")")
[[ $(id -un) == phuclam && $(stat -c '%U:%a' "$root") == phuclam:700 ]] || exit 3
(cd "$root"; sha256sum --strict -c inputs.sha256 >/dev/null)
. "$root/environment.sh"
unset JAVA_TOOL_OPTIONS JDK_JAVA_OPTIONS _JAVA_OPTIONS CLASSPATH LD_PRELOAD LD_LIBRARY_PATH OPENSSL_CONF OPENSSL_MODULES

ticks() { local line tail; line=$(<"/proc/$1/stat"); tail=${line##*) }; read -ra fields <<< "$tail"; printf '%s' "${fields[19]}"; }
save() { printf '%s %s\n' "$2" "$(ticks "$2")" > "$root/$1.state"; }
owned() {
  local kind=$1 pid stamp command expected
  [[ -f $root/$kind.state ]] || return 1
  read -r pid stamp < "$root/$kind.state"
  [[ $pid =~ ^[0-9]+$ && $stamp =~ ^[0-9]+$ ]] || return 4
  [[ -e /proc/$pid/exe ]] || return 1
  [[ $(stat -c '%U' "/proc/$pid") == phuclam && $(ticks "$pid") == "$stamp" ]] || return 4
  command=$(tr '\0' ' ' < "/proc/$pid/cmdline")
  if [[ $kind == backend ]]; then
    [[ $(readlink -f "/proc/$pid/exe") == "$java" && $command == "$java -Djava.net.preferIPv4Stack=true -jar $jar "* && $command == *'--server.port=18449'* ]] || return 4
  else
    [[ $(readlink -f "/proc/$pid/exe") == "$nginx" && $command == *"-p $root/ -c $root/nginx-"* ]] || return 4
  fi
  printf '%s' "$pid"
}
get_owned() {
  process_id=
  if process_id=$(owned "$1"); then return 0; else local result=$?; [[ $result == 1 ]] || exit "$result"; return 1; fi
}
close_owned() {
  local kind=$1 signal=$2 pid stamp result
  if pid=$(owned "$kind"); then :; else result=$?; [[ $result == 1 ]] && return 0; return "$result"; fi
  stamp=$(ticks "$pid")
  kill -"$signal" "$pid"
  for attempt in {1..350}; do
    [[ ! -e /proc/$pid/exe || $(ticks "$pid") != "$stamp" ]] && return 0
    sleep 0.1
  done
  echo 'DEV_STOP=TIMEOUT;NO_FORCED_KILL=true'; return 4
}
inputs() {
  sha256sum --strict -c "$retained/binaries.sha256" >/dev/null
  sha256sum --strict -c "$retained/libraries.sha256" >/dev/null
  sha256sum --strict -c "$retained/tls.sha256" >/dev/null
  [[ $(sha256sum "$java" | cut -d' ' -f1) == 7380ce48ed5013735d2c8414db54adb8f981e7933ff594bd36f3baccddaafba3 ]] || exit 3
  [[ $(sha256sum "$jar" | cut -d' ' -f1) == "$jar_sha256" ]] || exit 3
  openssl x509 -in "$certificate" -checkend 3600 -noout >/dev/null
}
health() {
  curl --noproxy '*' --fail --silent --show-error --max-time 5 --cacert "$backend_ca" "$backend_origin/health/database" >/dev/null 2>&1
}

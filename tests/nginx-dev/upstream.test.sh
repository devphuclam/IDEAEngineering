#!/usr/bin/env bash
set -euo pipefail
set +x
umask 077
root=/home/phuclam/idea-nginx-dev-20261008-49
tools=/home/phuclam/idea-nginx-dev-control-49
nginx=$root/package/usr/sbin/nginx
bash "$tools/control.sh" status >/dev/null
exec 9> "$root/control.lock"
flock -n 9 || exit 2
ticks() { local line tail; line=$(<"/proc/$1/stat"); tail=${line##*) }; read -ra fields <<< "$tail"; printf '%s' "${fields[19]}"; }
read -r original stamp < "$root/nginx.state"
[[ $original =~ ^[0-9]+$ && $(ticks "$original") == "$stamp" && $(stat -c '%U' "/proc/$original") == phuclam && $(readlink -f "/proc/$original/exe") == "$nginx" ]] || exit 2
[[ $(tr '\0' ' ' < "/proc/$original/cmdline") == *"-p $root/ -c $tools/nginx.conf"* ]] || exit 2
case_root=$(mktemp -d "$root/upstream-check.XXXXXXXX")
child=; child_stamp=
stop_child() {
  if [[ -n $child && -e /proc/$child/exe ]]; then
    [[ $(ticks "$child") == "$child_stamp" && $(readlink -f "/proc/$child/exe") == "$nginx" ]] || return 2
    kill -QUIT "$child"
    for attempt in {1..100}; do [[ ! -e /proc/$child/exe ]] && break; sleep 0.05; done
    [[ ! -e /proc/$child/exe ]] || return 2
  fi
  child=
}
restore() {
  result=$?; trap - EXIT
  stop_child || result=2
  flock -u 9
  bash "$tools/control.sh" start >/dev/null || result=2
  exit "$result"
}
kill -QUIT "$original"
for attempt in {1..100}; do [[ ! -e /proc/$original/exe ]] && break; sleep 0.05; done
[[ ! -e /proc/$original/exe ]] || exit 2
trap restore EXIT
for mode in wrong-name untrusted; do
  if [[ $mode == wrong-name ]]; then
    sed -e 's/proxy_ssl_name localhost;/proxy_ssl_name wrong.invalid;/' \
      -e "s@^error_log .*;@error_log $case_root/$mode-private.log error;@" "$tools/nginx.conf" > "$case_root/$mode.conf"
  else
    # Read-only system roots do not trust the fixture. Never mutate any trust store.
    sed -e "s@proxy_ssl_trusted_certificate .*;@proxy_ssl_trusted_certificate /etc/ssl/certs/ca-certificates.crt;@" \
      -e "s@^error_log .*;@error_log $case_root/$mode-private.log error;@" "$tools/nginx.conf" > "$case_root/$mode.conf"
  fi
  "$nginx" -p "$root/" -c "$case_root/$mode.conf" -e "$case_root/$mode-private.log" -t > "$case_root/$mode-config-private.log" 2>&1
  "$nginx" -p "$root/" -c "$case_root/$mode.conf" -e "$case_root/$mode-private.log" > "$case_root/$mode-start-private.log" 2>&1 < /dev/null 9>&- &
  child=$!; child_stamp=$(ticks "$child")
  status=
  for attempt in {1..40}; do
    status=$(curl --noproxy '*' --silent --max-time 3 --cacert "$root/tls/certificate.pem" \
      --resolve localhost:18448:127.0.0.1 -o /dev/null -w '%{http_code}' https://localhost:18448/health/database) || true
    [[ $status == 502 ]] && break
    sleep 0.1
  done
  [[ $status == 502 ]] || exit 2
  if [[ $mode == wrong-name ]]; then
    grep -q 'upstream SSL certificate does not match' "$case_root/$mode-private.log" || exit 2
  else
    grep -q 'upstream SSL certificate verify error' "$case_root/$mode-private.log" || exit 2
  fi
  stop_child
  echo "NGINX_UPSTREAM_$mode=PASS;HTTP=502;NO_APPLICATION_SUCCESS=true"
done

#!/usr/bin/env bash
# Environment prerequisite only: creates a new private test key, never trusts it.
set -euo pipefail
set +x
umask 077

tls_dir=${1:?Supply a new absolute /home/phuclam/idea-f03b-web-tls-<32 hex> directory}
if [[ ! "$tls_dir" =~ ^/home/phuclam/idea-f03b-web-tls-[a-f0-9]{32}$ ]] ||
   [ -e "$tls_dir" ] || [ -L "$tls_dir" ]; then
  printf '%s\n' 'Refused: target must be a new exact test TLS directory.' >&2
  exit 2
fi
keytool=/opt/idea/tools/jdk-25.0.4.1+1/bin/keytool
test -x "$keytool" || { printf '%s\n' 'BLOCKED: qualified keytool is missing.' >&2; exit 2; }
mkdir -m 700 -- "$tls_dir"
# Secret stays in the operator-owned directory and is never printed or put in arguments.
od -An -N32 -tx1 /dev/urandom | tr -d ' \n' > "$tls_dir/store-password"
"$keytool" -genkeypair -alias idea-t043 -keyalg RSA -keysize 3072 -validity 7 \
  -dname 'CN=IDEA T043 loopback test' -ext 'SAN=dns:localhost,ip:127.0.0.1' \
  -ext 'EKU=serverAuth' -ext 'KU=digitalSignature,keyEncipherment' \
  -storetype PKCS12 -keystore "$tls_dir/server.p12" \
  -storepass:file "$tls_dir/store-password" -keypass:file "$tls_dir/store-password"
"$keytool" -exportcert -alias idea-t043 -keystore "$tls_dir/server.p12" \
  -storepass:file "$tls_dir/store-password" -file "$tls_dir/server.cer"
chmod 600 -- "$tls_dir/server.p12" "$tls_dir/server.cer" "$tls_dir/store-password"
printf 'T043_TLS_DIRECTORY=%s\n' "$tls_dir"
"$keytool" -printcert -file "$tls_dir/server.cer"
printf '%s\n' 'TLS_TRUST=NOT_CONFIGURED; this prerequisite is not a Web RED or PASS.'
